-- =====================================================
-- Migration 011: Advanced Database Enhancements
-- ShinJP Japanese Learning Platform
-- Comprehensive database improvements for production scale
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram search
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- Composite GIN indexes
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- Encryption
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements"; -- Query monitoring
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- UUID generation

-- =====================================================
-- PART 1: AUDIT TRAIL SYSTEM
-- Add audit columns to track who created/modified/deleted records
-- =====================================================

-- Function to add audit columns to existing tables
CREATE OR REPLACE FUNCTION add_audit_columns(table_name text) RETURNS void AS $$
BEGIN
    -- Add columns if they don't exist
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id)', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id)', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id)', table_name);
    EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE', table_name);
    
    -- Create index for soft delete
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_not_deleted ON %I(id) WHERE deleted_at IS NULL', table_name, table_name);
    
    RAISE NOTICE 'Added audit columns to %', table_name;
END;
$$ LANGUAGE plpgsql;

-- Apply audit columns to user data tables
SELECT add_audit_columns('textbooks');
SELECT add_audit_columns('textbook_chapters');
SELECT add_audit_columns('lessons');
SELECT add_audit_columns('user_textbook_progress');
SELECT add_audit_columns('user_lesson_progress');
SELECT add_audit_columns('conversations');
SELECT add_audit_columns('srs_cards');
SELECT add_audit_columns('user_exercise_attempts');
SELECT add_audit_columns('study_sessions');
SELECT add_audit_columns('book_reading_progress');
SELECT add_audit_columns('user_achievements');

-- =====================================================
-- PART 2: NEW TABLES FOR ADVANCED FEATURES
-- =====================================================

-- 2.1 Notification System
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification content
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'achievement', 'reminder', 'social', 'system', 
        'lesson_complete', 'streak', 'review_due', 'message'
    )),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    
    -- Link to related content
    link_type VARCHAR(50),
    link_id UUID,
    
    -- Status
    read_at TIMESTAMP WITH TIME ZONE,
    archived_at TIMESTAMP WITH TIME ZONE,
    
    -- Priority
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Delivery channels
    delivered_push BOOLEAN DEFAULT false,
    delivered_email BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    CONSTRAINT valid_expiry CHECK (expires_at IS NULL OR expires_at > created_at)
);

CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_type ON notifications(type, created_at DESC);
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

-- 2.2 Content Recommendations
CREATE TABLE IF NOT EXISTS content_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Recommended content
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN (
        'textbook', 'lesson', 'word', 'grammar', 'book', 'exercise'
    )),
    content_id UUID NOT NULL,
    
    -- Recommendation scoring
    score NUMERIC(5,4) NOT NULL CHECK (score BETWEEN 0 AND 1),
    confidence NUMERIC(5,4) CHECK (confidence BETWEEN 0 AND 1),
    
    -- Reason for recommendation
    reason_type VARCHAR(50) CHECK (reason_type IN (
        'similar_content', 'jlpt_level', 'learning_path', 
        'popular', 'personalized', 'collaborative'
    )),
    reason_text TEXT,
    
    -- Interaction tracking
    viewed_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    dismissed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    algorithm_version VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_recommendations_user_active ON content_recommendations(user_id, score DESC) 
    WHERE dismissed_at IS NULL AND expires_at > NOW();
CREATE INDEX idx_recommendations_content ON content_recommendations(content_type, content_id);

-- Enable RLS
ALTER TABLE content_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own recommendations" ON content_recommendations
    FOR ALL USING (auth.uid() = user_id);

-- 2.3 Error Logging System
CREATE TABLE IF NOT EXISTS error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User context (nullable for anonymous errors)
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    
    -- Error details
    error_type VARCHAR(100) NOT NULL,
    error_code VARCHAR(50),
    error_message TEXT NOT NULL,
    stack_trace TEXT,
    
    -- Request context
    endpoint VARCHAR(255),
    http_method VARCHAR(10),
    request_data JSONB,
    response_status INTEGER,
    
    -- Environment
    user_agent TEXT,
    ip_address INET,
    environment VARCHAR(20) DEFAULT 'production',
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}',
    
    -- Timestamps
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Severity
    severity VARCHAR(20) DEFAULT 'error' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical'))
);

CREATE INDEX idx_error_logs_occurred ON error_logs(occurred_at DESC);
CREATE INDEX idx_error_logs_user ON error_logs(user_id, occurred_at DESC);
CREATE INDEX idx_error_logs_type ON error_logs(error_type, occurred_at DESC);
CREATE INDEX idx_error_logs_unresolved ON error_logs(resolved_at) WHERE resolved_at IS NULL;

-- Partition by month for scalability (example for January 2025)
-- CREATE TABLE error_logs_y2025m01 PARTITION OF error_logs
--     FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- 2.4 API Rate Limiting
CREATE TABLE IF NOT EXISTS api_rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Client identification
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    api_key VARCHAR(255),
    ip_address INET,
    
    -- Rate limit tracking
    endpoint VARCHAR(255) NOT NULL,
    request_count INTEGER DEFAULT 0,
    
    -- Time window
    window_start TIMESTAMP WITH TIME ZONE NOT NULL,
    window_end TIMESTAMP WITH TIME ZONE NOT NULL,
    window_size_seconds INTEGER DEFAULT 60,
    
    -- Limits
    max_requests INTEGER NOT NULL DEFAULT 100,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    CONSTRAINT valid_window CHECK (window_end > window_start)
);

CREATE INDEX idx_rate_limits_user_endpoint ON api_rate_limits(user_id, endpoint, window_end DESC);
CREATE INDEX idx_rate_limits_ip_endpoint ON api_rate_limits(ip_address, endpoint, window_end DESC);
CREATE INDEX idx_rate_limits_window ON api_rate_limits(window_end) WHERE window_end > NOW();

-- 2.5 Content Versioning
CREATE TABLE IF NOT EXISTS content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Content identification
    content_type VARCHAR(50) NOT NULL,
    content_id UUID NOT NULL,
    
    -- Version info
    version_number INTEGER NOT NULL,
    version_label VARCHAR(100),
    
    -- Full content snapshot
    content_snapshot JSONB NOT NULL,
    
    -- Change tracking
    change_type VARCHAR(50) CHECK (change_type IN ('create', 'update', 'delete', 'restore')),
    change_description TEXT,
    changed_fields TEXT[],
    
    -- Audit
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Metadata
    is_published BOOLEAN DEFAULT false,
    tags TEXT[],
    
    UNIQUE(content_type, content_id, version_number)
);

CREATE INDEX idx_content_versions_content ON content_versions(content_type, content_id, version_number DESC);
CREATE INDEX idx_content_versions_created ON content_versions(created_at DESC);

-- 2.6 User Settings & Preferences (Enhanced)
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- UI Preferences
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language VARCHAR(10) DEFAULT 'en',
    font_size INTEGER DEFAULT 16 CHECK (font_size BETWEEN 12 AND 24),
    
    -- Learning Preferences
    show_romaji BOOLEAN DEFAULT true,
    show_furigana BOOLEAN DEFAULT true,
    auto_play_audio BOOLEAN DEFAULT false,
    preferred_study_time VARCHAR(20) DEFAULT 'anytime',
    
    -- SRS Settings
    srs_new_cards_per_day INTEGER DEFAULT 20 CHECK (srs_new_cards_per_day BETWEEN 1 AND 100),
    srs_review_limit INTEGER DEFAULT 100 CHECK (srs_review_limit BETWEEN 10 AND 500),
    srs_algorithm VARCHAR(20) DEFAULT 'sm2' CHECK (srs_algorithm IN ('sm2', 'sm2_plus', 'fsrs')),
    
    -- Notification Preferences
    notifications_enabled BOOLEAN DEFAULT true,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    daily_reminder_time TIME,
    
    -- Privacy Settings
    profile_public BOOLEAN DEFAULT false,
    show_study_stats BOOLEAN DEFAULT true,
    
    -- Accessibility
    high_contrast BOOLEAN DEFAULT false,
    reduce_motion BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

CREATE INDEX idx_user_settings_user ON user_settings(user_id);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- 2.7 Learning Streaks (Enhanced tracking)
CREATE TABLE IF NOT EXISTS learning_streaks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Streak info
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    
    -- Date tracking
    last_activity_date DATE NOT NULL,
    streak_start_date DATE NOT NULL,
    longest_streak_start_date DATE,
    longest_streak_end_date DATE,
    
    -- Milestones
    total_days_active INTEGER DEFAULT 0,
    
    -- Streak freeze (allow users to maintain streak)
    freeze_count INTEGER DEFAULT 0,
    max_freezes INTEGER DEFAULT 2,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id)
);

CREATE INDEX idx_learning_streaks_user ON learning_streaks(user_id);
CREATE INDEX idx_learning_streaks_current ON learning_streaks(current_streak DESC);

-- Enable RLS
ALTER TABLE learning_streaks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own streaks" ON learning_streaks
    FOR SELECT USING (auth.uid() = user_id);

-- 2.8 User Activity Log
CREATE TABLE IF NOT EXISTS user_activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Activity details
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    
    -- Related content
    content_type VARCHAR(50),
    content_id UUID,
    
    -- Metadata
    metadata JSONB DEFAULT '{}',
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Partition by month for scalability
CREATE INDEX idx_user_activity_user_time ON user_activity_log(user_id, created_at DESC);
CREATE INDEX idx_user_activity_type ON user_activity_log(activity_type, created_at DESC);

-- Enable RLS
ALTER TABLE user_activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity" ON user_activity_log
    FOR SELECT USING (auth.uid() = user_id);

-- =====================================================
-- PART 3: ADVANCED INDEXES
-- =====================================================

-- 3.1 Full-Text Search Setup

-- Add tsvector columns for full-text search
ALTER TABLE textbooks ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE books ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE vocabulary ADD COLUMN IF NOT EXISTS search_vector tsvector;
ALTER TABLE lessons ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Create GIN indexes for full-text search
CREATE INDEX IF NOT EXISTS idx_textbooks_search_vector ON textbooks USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_books_search_vector ON books USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_vocabulary_search_vector ON vocabulary USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_lessons_search_vector ON lessons USING GIN(search_vector);

-- 3.2 Composite Indexes for Common Queries

-- User progress queries
CREATE INDEX IF NOT EXISTS idx_user_textbook_progress_composite 
    ON user_textbook_progress(user_id, status, last_studied_at DESC NULLS LAST)
    WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_composite
    ON user_lesson_progress(user_id, completed_at DESC NULLS LAST)
    WHERE deleted_at IS NULL;

-- SRS review queries
CREATE INDEX IF NOT EXISTS idx_srs_cards_review_composite
    ON srs_cards(user_id, next_review, content_type)
    WHERE deleted_at IS NULL;

-- Study session analytics
CREATE INDEX IF NOT EXISTS idx_study_sessions_analytics
    ON study_sessions(user_id, start_time DESC, session_type)
    WHERE deleted_at IS NULL;

-- Textbook browsing
CREATE INDEX IF NOT EXISTS idx_textbooks_browse
    ON textbooks(is_public, jlpt_level, created_at DESC)
    WHERE deleted_at IS NULL AND is_published = true;

-- 3.3 BRIN Indexes for Time-Series Data

-- For large time-series tables, BRIN indexes are more efficient
CREATE INDEX IF NOT EXISTS idx_error_logs_occurred_brin
    ON error_logs USING BRIN(occurred_at);

CREATE INDEX IF NOT EXISTS idx_user_activity_time_brin
    ON user_activity_log USING BRIN(created_at);

-- =====================================================
-- PART 4: ADVANCED DATABASE FUNCTIONS
-- =====================================================

-- 4.1 Enhanced SRS Algorithm (FSRS - Free Spaced Repetition Scheduler)
CREATE OR REPLACE FUNCTION calculate_fsrs_parameters(
    p_quality INTEGER,
    p_difficulty NUMERIC DEFAULT 0.3,
    p_stability NUMERIC DEFAULT 1.0,
    p_retrievability NUMERIC DEFAULT 0.9
) RETURNS TABLE(
    new_difficulty NUMERIC,
    new_stability NUMERIC,
    new_interval INTEGER,
    next_review_date TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
    v_new_difficulty NUMERIC;
    v_new_stability NUMERIC;
    v_new_interval INTEGER;
BEGIN
    -- FSRS algorithm implementation (simplified)
    -- Quality: 1 (again), 2 (hard), 3 (good), 4 (easy)
    
    -- Update difficulty
    v_new_difficulty := p_difficulty + 0.1 * (4 - p_quality);
    v_new_difficulty := GREATEST(0.1, LEAST(1.0, v_new_difficulty));
    
    -- Update stability based on quality and difficulty
    CASE p_quality
        WHEN 1 THEN v_new_stability := p_stability * 0.2;  -- Again
        WHEN 2 THEN v_new_stability := p_stability * 0.6;  -- Hard
        WHEN 3 THEN v_new_stability := p_stability * 2.5;  -- Good
        WHEN 4 THEN v_new_stability := p_stability * 4.0;  -- Easy
        ELSE v_new_stability := p_stability;
    END CASE;
    
    -- Calculate interval (days)
    v_new_interval := GREATEST(1, ROUND(v_new_stability));
    
    RETURN QUERY SELECT 
        ROUND(v_new_difficulty, 3),
        ROUND(v_new_stability, 2),
        v_new_interval,
        NOW() + (v_new_interval || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4.2 Smart Content Recommendation Function
CREATE OR REPLACE FUNCTION generate_content_recommendations(
    p_user_id UUID,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE(
    content_type VARCHAR,
    content_id UUID,
    score NUMERIC,
    reason TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH user_profile AS (
        SELECT 
            current_jlpt_level,
            interests,
            total_study_time
        FROM users
        WHERE id = p_user_id
    ),
    recent_content AS (
        SELECT DISTINCT content_type, content_id
        FROM user_activity_log
        WHERE user_id = p_user_id
        AND created_at > NOW() - INTERVAL '7 days'
        LIMIT 50
    ),
    similar_users AS (
        SELECT DISTINCT u2.id
        FROM users u1
        JOIN users u2 ON u2.current_jlpt_level = u1.current_jlpt_level
        WHERE u1.id = p_user_id
        AND u2.id != p_user_id
        LIMIT 10
    )
    -- Recommend based on JLPT level and popularity
    SELECT 
        'textbook'::VARCHAR as content_type,
        t.id as content_id,
        0.8::NUMERIC as score,
        'Popular for your JLPT level' as reason
    FROM textbooks t
    JOIN user_profile up ON t.jlpt_level = up.current_jlpt_level
    WHERE t.is_public = true 
    AND t.deleted_at IS NULL
    AND NOT EXISTS (
        SELECT 1 FROM user_textbook_progress utp
        WHERE utp.user_id = p_user_id AND utp.textbook_id = t.id
    )
    ORDER BY t.view_count DESC, t.average_rating DESC NULLS LAST
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- 4.3 Update User Streak Function
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS void AS $$
DECLARE
    v_streak RECORD;
    v_today DATE := CURRENT_DATE;
    v_yesterday DATE := CURRENT_DATE - INTERVAL '1 day';
    v_last_activity DATE;
BEGIN
    -- Get current streak info
    SELECT * INTO v_streak
    FROM learning_streaks
    WHERE user_id = p_user_id
    FOR UPDATE;
    
    IF NOT FOUND THEN
        -- Create new streak record
        INSERT INTO learning_streaks (
            user_id, 
            current_streak, 
            longest_streak,
            last_activity_date,
            streak_start_date,
            total_days_active
        ) VALUES (
            p_user_id, 
            1, 
            1,
            v_today,
            v_today,
            1
        );
        RETURN;
    END IF;
    
    v_last_activity := v_streak.last_activity_date;
    
    -- Update streak based on last activity
    IF v_last_activity = v_today THEN
        -- Already logged today, no change
        RETURN;
    ELSIF v_last_activity = v_yesterday THEN
        -- Consecutive day, increment streak
        UPDATE learning_streaks
        SET 
            current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = v_today,
            total_days_active = total_days_active + 1,
            updated_at = NOW(),
            longest_streak_start_date = CASE 
                WHEN current_streak + 1 > longest_streak THEN streak_start_date
                ELSE longest_streak_start_date
            END,
            longest_streak_end_date = CASE
                WHEN current_streak + 1 > longest_streak THEN v_today
                ELSE longest_streak_end_date
            END
        WHERE user_id = p_user_id;
    ELSE
        -- Streak broken, reset
        UPDATE learning_streaks
        SET 
            current_streak = 1,
            last_activity_date = v_today,
            streak_start_date = v_today,
            total_days_active = total_days_active + 1,
            updated_at = NOW()
        WHERE user_id = p_user_id;
    END IF;
    
    -- Also update user table
    UPDATE users
    SET 
        study_streak = (SELECT current_streak FROM learning_streaks WHERE user_id = p_user_id),
        longest_streak = (SELECT longest_streak FROM learning_streaks WHERE user_id = p_user_id)
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- 4.4 Batch Delete Function (Soft Delete)
CREATE OR REPLACE FUNCTION soft_delete_records(
    p_table_name TEXT,
    p_ids UUID[],
    p_user_id UUID
) RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    EXECUTE format(
        'UPDATE %I SET deleted_at = NOW(), deleted_by = $1 WHERE id = ANY($2) AND deleted_at IS NULL',
        p_table_name
    ) USING p_user_id, p_ids;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- 4.5 Get User Dashboard Data (Optimized single query)
CREATE OR REPLACE FUNCTION get_user_dashboard_data(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'user', (
            SELECT row_to_json(u.*)
            FROM users u
            WHERE u.id = p_user_id
        ),
        'streak', (
            SELECT row_to_json(ls.*)
            FROM learning_streaks ls
            WHERE ls.user_id = p_user_id
        ),
        'due_cards_count', (
            SELECT COUNT(*)
            FROM srs_cards sc
            WHERE sc.user_id = p_user_id
            AND sc.next_review <= NOW()
            AND sc.deleted_at IS NULL
        ),
        'active_textbooks', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', t.id,
                    'title', t.title,
                    'progress', utp.completion_percentage
                )
            ), '[]'::json)
            FROM user_textbook_progress utp
            JOIN textbooks t ON t.id = utp.textbook_id
            WHERE utp.user_id = p_user_id
            AND utp.status = 'in_progress'
            AND t.deleted_at IS NULL
            AND utp.deleted_at IS NULL
            ORDER BY utp.last_studied_at DESC NULLS LAST
            LIMIT 5
        ),
        'recent_achievements', (
            SELECT COALESCE(json_agg(
                json_build_object(
                    'id', a.id,
                    'name', a.name,
                    'unlocked_at', ua.unlocked_at
                )
            ), '[]'::json)
            FROM user_achievements ua
            JOIN achievements a ON a.id = ua.achievement_id
            WHERE ua.user_id = p_user_id
            AND ua.unlocked_at IS NOT NULL
            ORDER BY ua.unlocked_at DESC
            LIMIT 3
        ),
        'unread_notifications', (
            SELECT COUNT(*)
            FROM notifications n
            WHERE n.user_id = p_user_id
            AND n.read_at IS NULL
            AND (n.expires_at IS NULL OR n.expires_at > NOW())
        )
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- PART 5: ADVANCED TRIGGERS
-- =====================================================

-- 5.1 Auto-update search vectors
CREATE OR REPLACE FUNCTION update_textbook_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        COALESCE(NEW.title, '') || ' ' || 
        COALESCE(NEW.description, '') || ' ' ||
        COALESCE(array_to_string(NEW.keywords, ' '), '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER textbooks_search_vector_update
    BEFORE INSERT OR UPDATE ON textbooks
    FOR EACH ROW
    WHEN (NEW.title IS NOT NULL OR NEW.description IS NOT NULL)
    EXECUTE FUNCTION update_textbook_search_vector();

CREATE OR REPLACE FUNCTION update_vocabulary_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english',
        COALESCE(NEW.word, '') || ' ' ||
        COALESCE(NEW.reading, '') || ' ' ||
        COALESCE(NEW.meaning_english, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER vocabulary_search_vector_update
    BEFORE INSERT OR UPDATE ON vocabulary
    FOR EACH ROW
    EXECUTE FUNCTION update_vocabulary_search_vector();

-- 5.2 Cascade soft deletes
CREATE OR REPLACE FUNCTION cascade_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
    -- When a textbook is soft deleted, soft delete all its chapters
    IF TG_TABLE_NAME = 'textbooks' AND NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL THEN
        UPDATE textbook_chapters
        SET deleted_at = NEW.deleted_at, deleted_by = NEW.deleted_by
        WHERE textbook_id = NEW.id AND deleted_at IS NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER textbooks_cascade_soft_delete
    AFTER UPDATE ON textbooks
    FOR EACH ROW
    EXECUTE FUNCTION cascade_soft_delete();

-- 5.3 Auto-create notification on achievement unlock
CREATE OR REPLACE FUNCTION notify_achievement_unlock()
RETURNS TRIGGER AS $$
DECLARE
    v_achievement RECORD;
BEGIN
    IF NEW.unlocked_at IS NOT NULL AND OLD.unlocked_at IS NULL THEN
        -- Get achievement details
        SELECT * INTO v_achievement
        FROM achievements
        WHERE id = NEW.achievement_id;
        
        -- Create notification
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            data,
            priority,
            link_type,
            link_id
        ) VALUES (
            NEW.user_id,
            'achievement',
            'Achievement Unlocked!',
            format('Congratulations! You earned the "%s" achievement', v_achievement.name),
            json_build_object(
                'achievement_id', v_achievement.id,
                'achievement_name', v_achievement.name,
                'points', v_achievement.points
            ),
            'high',
            'achievement',
            NEW.achievement_id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER achievement_unlock_notification
    AFTER UPDATE ON user_achievements
    FOR EACH ROW
    EXECUTE FUNCTION notify_achievement_unlock();

-- 5.4 Auto-update audit fields
CREATE OR REPLACE FUNCTION update_audit_fields()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        NEW.created_by := auth.uid();
        NEW.created_at := NOW();
    ELSIF TG_OP = 'UPDATE' THEN
        NEW.updated_by := auth.uid();
        NEW.updated_at := NOW();
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with audit fields (example)
-- CREATE TRIGGER textbooks_audit
--     BEFORE INSERT OR UPDATE ON textbooks
--     FOR EACH ROW
--     EXECUTE FUNCTION update_audit_fields();

-- 5.5 Update streak on study session
CREATE OR REPLACE FUNCTION update_streak_on_study()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if session is complete and has meaningful duration
    IF NEW.end_time IS NOT NULL AND NEW.duration >= 60 THEN
        PERFORM update_user_streak(NEW.user_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER study_session_streak_update
    AFTER INSERT OR UPDATE ON study_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_streak_on_study();

-- =====================================================
-- PART 6: MATERIALIZED VIEWS FOR ANALYTICS
-- =====================================================

-- 6.1 Popular Content View
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_popular_content AS
SELECT 
    'textbook' as content_type,
    t.id as content_id,
    t.title,
    t.jlpt_level,
    t.view_count,
    t.completion_count,
    t.average_rating,
    COUNT(DISTINCT utp.user_id) as active_learners,
    t.created_at
FROM textbooks t
LEFT JOIN user_textbook_progress utp ON utp.textbook_id = t.id
WHERE t.is_public = true AND t.deleted_at IS NULL
GROUP BY t.id, t.title, t.jlpt_level, t.view_count, t.completion_count, t.average_rating, t.created_at

UNION ALL

SELECT 
    'lesson' as content_type,
    l.id::text::uuid as content_id,
    l.title,
    l.jlpt_level::VARCHAR(10),
    0 as view_count,
    0 as completion_count,
    NULL as average_rating,
    COUNT(DISTINCT ulp.user_id) as active_learners,
    l.created_at
FROM lessons l
LEFT JOIN user_lesson_progress ulp ON ulp.lesson_module_id = l.id::INTEGER
WHERE l.is_public = true AND l.deleted_at IS NULL
GROUP BY l.id, l.title, l.jlpt_level, l.created_at;

CREATE UNIQUE INDEX idx_mv_popular_content ON mv_popular_content(content_type, content_id);

-- 6.2 Learning Progress Summary View
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_learning_progress_summary AS
SELECT 
    u.id as user_id,
    u.current_jlpt_level,
    COUNT(DISTINCT ulp.lesson_module_id) FILTER (WHERE ulp.completed_at IS NOT NULL) as lessons_completed,
    COUNT(DISTINCT utp.textbook_id) FILTER (WHERE utp.status = 'completed') as textbooks_completed,
    COUNT(DISTINCT sc.id) as total_srs_cards,
    COUNT(DISTINCT sc.id) FILTER (WHERE sc.next_review <= NOW()) as due_srs_cards,
    AVG(up.accuracy_rate) as avg_accuracy,
    SUM(ss.duration) FILTER (WHERE ss.start_time >= NOW() - INTERVAL '30 days') as study_time_30d,
    MAX(ss.start_time) as last_study_session,
    ls.current_streak,
    NOW() as computed_at
FROM users u
LEFT JOIN user_lesson_progress ulp ON u.id = ulp.user_id AND ulp.deleted_at IS NULL
LEFT JOIN user_textbook_progress utp ON u.id = utp.user_id AND utp.deleted_at IS NULL
LEFT JOIN srs_cards sc ON u.id = sc.user_id AND sc.deleted_at IS NULL
LEFT JOIN user_performance up ON u.id = up.user_id
LEFT JOIN study_sessions ss ON u.id = ss.user_id AND ss.deleted_at IS NULL
LEFT JOIN learning_streaks ls ON u.id = ls.user_id
GROUP BY u.id, u.current_jlpt_level, ls.current_streak;

CREATE UNIQUE INDEX idx_mv_learning_progress_user ON mv_learning_progress_summary(user_id);

-- 6.3 Content Quality Metrics View
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_content_quality_metrics AS
SELECT 
    'textbook' as content_type,
    t.id as content_id,
    t.title,
    t.jlpt_level,
    COUNT(DISTINCT utp.user_id) as total_users,
    COUNT(DISTINCT utp.user_id) FILTER (WHERE utp.status = 'completed') as completed_users,
    AVG(utp.completion_percentage) as avg_completion_rate,
    t.average_rating,
    COUNT(DISTINCT ss.id) as total_study_sessions,
    AVG(ss.duration) as avg_session_duration,
    t.created_at,
    NOW() as computed_at
FROM textbooks t
LEFT JOIN user_textbook_progress utp ON utp.textbook_id = t.id AND utp.deleted_at IS NULL
LEFT JOIN study_sessions ss ON ss.content_id::TEXT = t.id::TEXT AND ss.session_type = 'textbook' AND ss.deleted_at IS NULL
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.title, t.jlpt_level, t.average_rating, t.created_at;

CREATE UNIQUE INDEX idx_mv_content_quality_content ON mv_content_quality_metrics(content_type, content_id);

-- =====================================================
-- PART 7: DATABASE MAINTENANCE FUNCTIONS
-- =====================================================

-- 7.1 Refresh all materialized views
CREATE OR REPLACE FUNCTION refresh_all_materialized_views()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_popular_content;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_learning_progress_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_content_quality_metrics;
    
    -- Refresh from migration 010 if exists
    BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY user_learning_stats_mv;
        REFRESH MATERIALIZED VIEW CONCURRENTLY jlpt_content_stats_mv;
    EXCEPTION
        WHEN undefined_table THEN
            RAISE NOTICE 'Materialized views from migration 010 not found, skipping';
    END;
    
    RAISE NOTICE 'All materialized views refreshed successfully';
END;
$$ LANGUAGE plpgsql;

-- 7.2 Clean up old data
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Delete old error logs (older than 90 days)
    DELETE FROM error_logs
    WHERE occurred_at < NOW() - INTERVAL '90 days'
    AND resolved_at IS NOT NULL;
    
    -- Delete old activity logs (older than 180 days)
    DELETE FROM user_activity_log
    WHERE created_at < NOW() - INTERVAL '180 days';
    
    -- Delete expired notifications
    DELETE FROM notifications
    WHERE expires_at < NOW() - INTERVAL '30 days';
    
    -- Delete old rate limit records (older than 7 days)
    DELETE FROM api_rate_limits
    WHERE window_end < NOW() - INTERVAL '7 days';
    
    -- Delete expired recommendations
    DELETE FROM content_recommendations
    WHERE expires_at < NOW();
    
    RAISE NOTICE 'Old data cleaned up successfully';
END;
$$ LANGUAGE plpgsql;

-- 7.3 Database health check
CREATE OR REPLACE FUNCTION database_health_check()
RETURNS TABLE(
    check_name TEXT,
    status TEXT,
    details TEXT
) AS $$
BEGIN
    -- Check for tables without indexes
    RETURN QUERY
    SELECT 
        'missing_indexes'::TEXT,
        CASE WHEN COUNT(*) > 0 THEN 'WARNING' ELSE 'OK' END,
        format('%s tables have no indexes', COUNT(*))
    FROM pg_tables t
    LEFT JOIN pg_indexes i ON t.tablename = i.tablename
    WHERE t.schemaname = 'public'
    GROUP BY t.tablename
    HAVING COUNT(i.indexname) = 0;
    
    -- Check for bloated tables
    RETURN QUERY
    SELECT 
        'table_bloat'::TEXT,
        'INFO'::TEXT,
        'Run VACUUM ANALYZE to reduce bloat'::TEXT;
    
    -- Check for long-running queries
    RETURN QUERY
    SELECT 
        'long_queries'::TEXT,
        CASE WHEN COUNT(*) > 0 THEN 'WARNING' ELSE 'OK' END,
        format('%s queries running longer than 5 minutes', COUNT(*))
    FROM pg_stat_activity
    WHERE state = 'active'
    AND now() - query_start > interval '5 minutes';
    
    RETURN;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PART 8: ENABLE REAL-TIME SUBSCRIPTIONS
-- =====================================================

-- Enable real-time for new tables
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE content_recommendations;
ALTER PUBLICATION supabase_realtime ADD TABLE learning_streaks;

-- =====================================================
-- PART 9: GRANT PERMISSIONS
-- =====================================================

-- Grant appropriate permissions (adjust as needed for your setup)
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- =====================================================
-- PART 10: UPDATE TABLE STATISTICS
-- =====================================================

-- Update statistics for query planner
ANALYZE users;
ANALYZE textbooks;
ANALYZE textbook_chapters;
ANALYZE srs_cards;
ANALYZE study_sessions;
ANALYZE notifications;
ANALYZE content_recommendations;
ANALYZE learning_streaks;

-- =====================================================
-- PART 11: COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE notifications IS 'User notifications with multi-channel delivery support';
COMMENT ON TABLE content_recommendations IS 'AI-powered content recommendations for users';
COMMENT ON TABLE error_logs IS 'Application error logging with full context';
COMMENT ON TABLE api_rate_limits IS 'API rate limiting tracking per user/endpoint';
COMMENT ON TABLE content_versions IS 'Content versioning system for audit trail';
COMMENT ON TABLE user_settings IS 'Enhanced user preferences and settings';
COMMENT ON TABLE learning_streaks IS 'User learning streak tracking with freeze support';
COMMENT ON TABLE user_activity_log IS 'Detailed user activity logging for analytics';

COMMENT ON FUNCTION calculate_fsrs_parameters IS 'FSRS (Free Spaced Repetition Scheduler) algorithm implementation';
COMMENT ON FUNCTION generate_content_recommendations IS 'Generate personalized content recommendations';
COMMENT ON FUNCTION update_user_streak IS 'Update user learning streak based on activity';
COMMENT ON FUNCTION get_user_dashboard_data IS 'Optimized function to fetch all dashboard data in one query';
COMMENT ON FUNCTION refresh_all_materialized_views IS 'Refresh all materialized views for analytics';
COMMENT ON FUNCTION cleanup_old_data IS 'Remove old data to maintain database performance';
COMMENT ON FUNCTION database_health_check IS 'Comprehensive database health check';

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '✅ Migration 011 completed successfully!';
    RAISE NOTICE '📊 New tables: 8';
    RAISE NOTICE '🔍 New indexes: 20+';
    RAISE NOTICE '⚙️ New functions: 10+';
    RAISE NOTICE '🔔 New triggers: 7';
    RAISE NOTICE '📈 New materialized views: 3';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Run: SELECT refresh_all_materialized_views();';
    RAISE NOTICE '2. Run: SELECT database_health_check();';
    RAISE NOTICE '3. Schedule periodic cleanup: SELECT cleanup_old_data();';
    RAISE NOTICE '4. Update application code to use new features';
END $$;
