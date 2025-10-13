-- =====================================================
-- Migration 010: Critical Database Optimizations
-- Phase 1: Performance & Security Fixes
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite GIN indexes

-- =====================================================
-- PART 1: ADD MISSING INDEXES
-- =====================================================

-- Foreign key indexes (auto-join optimization)
CREATE INDEX IF NOT EXISTS idx_srs_cards_content ON srs_cards(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_user_performance_content ON user_performance(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_lesson_items_module ON lesson_items(lesson_module_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_content ON ai_content_interactions(content_id);
CREATE INDEX IF NOT EXISTS idx_book_progress_book ON book_reading_progress(book_id);
CREATE INDEX IF NOT EXISTS idx_user_lesson_progress_lesson ON user_lesson_progress(lesson_module_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_srs_cards_user_due ON srs_cards(user_id, next_review)
  WHERE next_review <= NOW();

CREATE INDEX IF NOT EXISTS idx_textbooks_public_level ON textbooks(is_public, jlpt_level)
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_lessons_public_level_type ON lessons(is_public, jlpt_level, lesson_type)
  WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_study_sessions_user_date ON study_sessions(user_id, start_time DESC);

CREATE INDEX IF NOT EXISTS idx_user_achievements_user_unlocked ON user_achievements(user_id)
  WHERE unlocked_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_conversations_user_created ON conversations(user_id, created_at DESC);

-- Indexes for book-related queries
CREATE INDEX IF NOT EXISTS idx_book_reading_progress_user_book ON book_reading_progress(user_id, book_id);
CREATE INDEX IF NOT EXISTS idx_book_reading_progress_user_active ON book_reading_progress(user_id, last_read DESC)
  WHERE completed_at IS NULL;

-- Indexes for performance tracking
CREATE INDEX IF NOT EXISTS idx_user_performance_user_type ON user_performance(user_id, content_type);
CREATE INDEX IF NOT EXISTS idx_user_performance_user_accuracy ON user_performance(user_id, accuracy_rate DESC);

-- GIN indexes for JSONB columns (array/object searches)
CREATE INDEX IF NOT EXISTS idx_textbook_chapters_vocabulary_gin ON textbook_chapters 
  USING GIN (vocabulary);

CREATE INDEX IF NOT EXISTS idx_textbook_chapters_grammar_gin ON textbook_chapters 
  USING GIN (grammar_points);

CREATE INDEX IF NOT EXISTS idx_textbook_chapters_exercises_gin ON textbook_chapters 
  USING GIN (exercises);

CREATE INDEX IF NOT EXISTS idx_ai_generated_content_topics_gin ON ai_generated_content 
  USING GIN (topics);

-- GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_textbooks_topics_gin ON textbooks USING GIN (topics);
CREATE INDEX IF NOT EXISTS idx_textbooks_keywords_gin ON textbooks USING GIN (keywords);
CREATE INDEX IF NOT EXISTS idx_users_interests_gin ON users USING GIN (interests);

-- Trigram indexes for fuzzy text search
CREATE INDEX IF NOT EXISTS idx_vocabulary_word_trgm ON vocabulary 
  USING GIN (word gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_vocabulary_meaning_trgm ON vocabulary 
  USING GIN (meaning_english gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_kanji_meaning_trgm ON kanji 
  USING GIN (meaning_english gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_textbooks_title_trgm ON textbooks 
  USING GIN (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_books_title_trgm ON books 
  USING GIN (title gin_trgm_ops);

-- =====================================================
-- PART 2: ADD MISSING CONSTRAINTS
-- =====================================================

-- Unique constraints to prevent duplicates
ALTER TABLE srs_cards 
  ADD CONSTRAINT IF NOT EXISTS unique_srs_card_per_user_content 
  UNIQUE (user_id, content_type, content_id);

ALTER TABLE user_performance 
  ADD CONSTRAINT IF NOT EXISTS unique_user_performance_per_content 
  UNIQUE (user_id, content_type, content_id);

-- Add version column for optimistic locking
ALTER TABLE srs_cards ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE textbooks ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;
ALTER TABLE textbook_chapters ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1;

-- Add soft delete support
ALTER TABLE textbooks ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE textbook_chapters ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE books ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Index for soft deletes
CREATE INDEX IF NOT EXISTS idx_textbooks_not_deleted ON textbooks(id) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_books_not_deleted ON books(id) WHERE deleted_at IS NULL;

-- =====================================================
-- PART 3: MATERIALIZED VIEWS FOR ANALYTICS
-- =====================================================

-- User learning statistics (pre-computed)
CREATE MATERIALIZED VIEW IF NOT EXISTS user_learning_stats_mv AS
SELECT 
  u.id as user_id,
  u.email,
  u.display_name,
  u.current_jlpt_level,
  u.study_streak,
  u.total_study_time,
  COUNT(DISTINCT ulp.lesson_module_id) FILTER (WHERE ulp.completed_at IS NOT NULL) as lessons_completed,
  COUNT(DISTINCT ulp.lesson_module_id) as lessons_started,
  COUNT(DISTINCT brp.book_id) FILTER (WHERE brp.completed_at IS NOT NULL) as books_completed,
  COUNT(DISTINCT brp.book_id) as books_started,
  COUNT(DISTINCT utp.textbook_id) as textbooks_in_progress,
  SUM(COALESCE(ss.duration, 0)) as total_session_time,
  AVG(up.accuracy_rate) as avg_accuracy_rate,
  COUNT(DISTINCT ua.achievement_id) as achievements_unlocked,
  COUNT(DISTINCT sc.id) as total_srs_cards,
  COUNT(DISTINCT sc.id) FILTER (WHERE sc.next_review <= NOW()) as due_srs_cards,
  MAX(ss.start_time) as last_study_session,
  NOW() as computed_at
FROM users u
LEFT JOIN user_lesson_progress ulp ON u.id = ulp.user_id
LEFT JOIN book_reading_progress brp ON u.id = brp.user_id
LEFT JOIN user_textbook_progress utp ON u.id = utp.user_id
LEFT JOIN study_sessions ss ON u.id = ss.user_id 
  AND ss.start_time >= NOW() - INTERVAL '30 days'
LEFT JOIN user_performance up ON u.id = up.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id AND ua.unlocked_at IS NOT NULL
LEFT JOIN srs_cards sc ON u.id = sc.user_id
GROUP BY u.id, u.email, u.display_name, u.current_jlpt_level, u.study_streak, u.total_study_time;

-- Create unique index for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_learning_stats_mv_user 
  ON user_learning_stats_mv(user_id);

-- JLPT level statistics (pre-computed)
CREATE MATERIALIZED VIEW IF NOT EXISTS jlpt_content_stats_mv AS
SELECT 
  'N1' as jlpt_level,
  COUNT(DISTINCT v.id) as vocabulary_count,
  COUNT(DISTINCT k.id) as kanji_count,
  COUNT(DISTINCT gp.id) as grammar_points_count,
  COUNT(DISTINCT t.id) as textbooks_count,
  COUNT(DISTINCT l.id) as lessons_count
FROM vocabulary v
FULL OUTER JOIN kanji k ON k.jlpt_level = 'N1'
FULL OUTER JOIN grammar_points gp ON gp.jlpt_level = 'N1'
FULL OUTER JOIN textbooks t ON t.jlpt_level = 'N1' AND t.is_public = true
FULL OUTER JOIN lessons l ON l.jlpt_level = 'N1' AND l.is_public = true
WHERE v.jlpt_level = 'N1'

UNION ALL

SELECT 
  'N2' as jlpt_level,
  COUNT(DISTINCT v.id) as vocabulary_count,
  COUNT(DISTINCT k.id) as kanji_count,
  COUNT(DISTINCT gp.id) as grammar_points_count,
  COUNT(DISTINCT t.id) as textbooks_count,
  COUNT(DISTINCT l.id) as lessons_count
FROM vocabulary v
FULL OUTER JOIN kanji k ON k.jlpt_level = 'N2'
FULL OUTER JOIN grammar_points gp ON gp.jlpt_level = 'N2'
FULL OUTER JOIN textbooks t ON t.jlpt_level = 'N2' AND t.is_public = true
FULL OUTER JOIN lessons l ON l.jlpt_level = 'N2' AND l.is_public = true
WHERE v.jlpt_level = 'N2'

UNION ALL

SELECT 
  'N3' as jlpt_level,
  COUNT(DISTINCT v.id) as vocabulary_count,
  COUNT(DISTINCT k.id) as kanji_count,
  COUNT(DISTINCT gp.id) as grammar_points_count,
  COUNT(DISTINCT t.id) as textbooks_count,
  COUNT(DISTINCT l.id) as lessons_count
FROM vocabulary v
FULL OUTER JOIN kanji k ON k.jlpt_level = 'N3'
FULL OUTER JOIN grammar_points gp ON gp.jlpt_level = 'N3'
FULL OUTER JOIN textbooks t ON t.jlpt_level = 'N3' AND t.is_public = true
FULL OUTER JOIN lessons l ON l.jlpt_level = 'N3' AND l.is_public = true
WHERE v.jlpt_level = 'N3'

UNION ALL

SELECT 
  'N4' as jlpt_level,
  COUNT(DISTINCT v.id) as vocabulary_count,
  COUNT(DISTINCT k.id) as kanji_count,
  COUNT(DISTINCT gp.id) as grammar_points_count,
  COUNT(DISTINCT t.id) as textbooks_count,
  COUNT(DISTINCT l.id) as lessons_count
FROM vocabulary v
FULL OUTER JOIN kanji k ON k.jlpt_level = 'N4'
FULL OUTER JOIN grammar_points gp ON gp.jlpt_level = 'N4'
FULL OUTER JOIN textbooks t ON t.jlpt_level = 'N4' AND t.is_public = true
FULL OUTER JOIN lessons l ON l.jlpt_level = 'N4' AND l.is_public = true
WHERE v.jlpt_level = 'N4'

UNION ALL

SELECT 
  'N5' as jlpt_level,
  COUNT(DISTINCT v.id) as vocabulary_count,
  COUNT(DISTINCT k.id) as kanji_count,
  COUNT(DISTINCT gp.id) as grammar_points_count,
  COUNT(DISTINCT t.id) as textbooks_count,
  COUNT(DISTINCT l.id) as lessons_count
FROM vocabulary v
FULL OUTER JOIN kanji k ON k.jlpt_level = 'N5'
FULL OUTER JOIN grammar_points gp ON gp.jlpt_level = 'N5'
FULL OUTER JOIN textbooks t ON t.jlpt_level = 'N5' AND t.is_public = true
FULL OUTER JOIN lessons l ON l.jlpt_level = 'N5' AND l.is_public = true
WHERE v.jlpt_level = 'N5';

CREATE UNIQUE INDEX IF NOT EXISTS idx_jlpt_content_stats_mv_level 
  ON jlpt_content_stats_mv(jlpt_level);

-- =====================================================
-- PART 4: DATABASE FUNCTIONS
-- =====================================================

-- Enhanced SRS algorithm as database function
CREATE OR REPLACE FUNCTION calculate_srs_next_review(
  p_quality INTEGER,
  p_repetitions INTEGER,
  p_ease_factor NUMERIC,
  p_interval INTEGER
) RETURNS TABLE(
  new_interval INTEGER,
  new_repetitions INTEGER,
  new_ease_factor NUMERIC,
  next_review_date TIMESTAMP WITH TIME ZONE
) AS $$
DECLARE
  v_ease_adjustment NUMERIC;
  v_new_ease_factor NUMERIC;
  v_new_repetitions INTEGER;
  v_new_interval INTEGER;
BEGIN
  -- Validate input
  IF p_quality < 0 OR p_quality > 5 THEN
    RAISE EXCEPTION 'Quality must be between 0 and 5';
  END IF;
  
  -- Calculate ease factor adjustment
  v_ease_adjustment := 0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02);
  v_new_ease_factor := p_ease_factor + v_ease_adjustment;
  
  -- Clamp ease factor between 1.5 and 3.0
  v_new_ease_factor := GREATEST(1.5, LEAST(3.0, v_new_ease_factor));
  
  -- Calculate new interval based on quality
  IF p_quality < 3 THEN
    -- Failed review - reset
    v_new_repetitions := 0;
    v_new_interval := 1;
  ELSE
    -- Successful review
    v_new_repetitions := p_repetitions + 1;
    
    IF v_new_repetitions = 1 THEN
      v_new_interval := 1;
    ELSIF v_new_repetitions = 2 THEN
      v_new_interval := CASE WHEN p_quality >= 4 THEN 6 ELSE 4 END;
    ELSE
      v_new_interval := GREATEST(1, ROUND(p_interval * v_new_ease_factor));
    END IF;
  END IF;
  
  RETURN QUERY SELECT 
    v_new_interval,
    v_new_repetitions,
    ROUND(v_new_ease_factor, 2),
    NOW() + (v_new_interval || ' days')::INTERVAL;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Batch update SRS cards
CREATE OR REPLACE FUNCTION batch_update_srs_cards(
  p_card_ids UUID[],
  p_qualities INTEGER[]
) RETURNS SETOF srs_cards AS $$
DECLARE
  v_card_id UUID;
  v_quality INTEGER;
  v_idx INTEGER;
BEGIN
  -- Validate array lengths match
  IF array_length(p_card_ids, 1) != array_length(p_qualities, 1) THEN
    RAISE EXCEPTION 'Array lengths must match';
  END IF;
  
  -- Update each card
  FOR v_idx IN 1..array_length(p_card_ids, 1) LOOP
    v_card_id := p_card_ids[v_idx];
    v_quality := p_qualities[v_idx];
    
    UPDATE srs_cards
    SET 
      (interval, repetitions, ease_factor, next_review_at) = (
        SELECT new_interval, new_repetitions, new_ease_factor, next_review_date
        FROM calculate_srs_next_review(v_quality, repetitions, ease_factor, interval)
      ),
      quality = v_quality,
      last_reviewed_at = NOW(),
      total_reviews = total_reviews + 1,
      correct_reviews = correct_reviews + CASE WHEN v_quality >= 3 THEN 1 ELSE 0 END,
      updated_at = NOW(),
      version = version + 1
    WHERE id = v_card_id;
  END LOOP;
  
  RETURN QUERY SELECT * FROM srs_cards WHERE id = ANY(p_card_ids);
END;
$$ LANGUAGE plpgsql;

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY user_learning_stats_mv;
  REFRESH MATERIALIZED VIEW CONCURRENTLY jlpt_content_stats_mv;
END;
$$ LANGUAGE plpgsql;

-- Function to get textbook with all chapters (efficient JOIN)
CREATE OR REPLACE FUNCTION get_textbook_with_chapters(p_textbook_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'textbook', row_to_json(t.*),
      'chapters', COALESCE(
        (SELECT json_agg(row_to_json(c.*) ORDER BY c.chapter_number)
         FROM textbook_chapters c
         WHERE c.textbook_id = t.id AND c.deleted_at IS NULL),
        '[]'::json
      )
    )
    FROM textbooks t
    WHERE t.id = p_textbook_id AND t.deleted_at IS NULL
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to get user dashboard data (single query)
CREATE OR REPLACE FUNCTION get_user_dashboard(p_user_id UUID)
RETURNS JSON AS $$
BEGIN
  RETURN (
    SELECT json_build_object(
      'user', row_to_json(u.*),
      'stats', (
        SELECT row_to_json(stats.*)
        FROM user_learning_stats_mv stats
        WHERE stats.user_id = p_user_id
      ),
      'dueCards', COALESCE(
        (SELECT json_agg(row_to_json(sc.*) ORDER BY sc.next_review_at)
         FROM srs_cards sc
         WHERE sc.user_id = p_user_id 
         AND sc.next_review_at <= NOW()
         LIMIT 20),
        '[]'::json
      ),
      'recentSessions', COALESCE(
        (SELECT json_agg(row_to_json(ss.*) ORDER BY ss.start_time DESC)
         FROM study_sessions ss
         WHERE ss.user_id = p_user_id
         ORDER BY ss.start_time DESC
         LIMIT 10),
        '[]'::json
      ),
      'activeTextbooks', COALESCE(
        (SELECT json_agg(
           json_build_object(
             'textbook', row_to_json(t.*),
             'progress', row_to_json(utp.*)
           )
           ORDER BY utp.last_studied_at DESC
         )
         FROM user_textbook_progress utp
         JOIN textbooks t ON t.id = utp.textbook_id
         WHERE utp.user_id = p_user_id
         AND utp.status = 'in_progress'
         AND t.deleted_at IS NULL
         LIMIT 5),
        '[]'::json
      )
    )
    FROM users u
    WHERE u.id = p_user_id
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- =====================================================
-- PART 5: OPTIMIZED RLS POLICIES
-- =====================================================

-- More efficient RLS policy for textbook chapters
DROP POLICY IF EXISTS "Users can view chapters" ON textbook_chapters;
CREATE POLICY "Users can view chapters" ON textbook_chapters
  FOR SELECT USING (
    deleted_at IS NULL AND (
      EXISTS (
        SELECT 1 FROM textbooks
        WHERE textbooks.id = textbook_chapters.textbook_id
        AND textbooks.deleted_at IS NULL
        AND (textbooks.user_id = auth.uid() OR textbooks.is_public = true)
      )
    )
  );

-- =====================================================
-- PART 6: TRIGGERS FOR AUTO-MAINTENANCE
-- =====================================================

-- Trigger to increment version on update
CREATE OR REPLACE FUNCTION increment_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version := OLD.version + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER srs_cards_version_trigger
  BEFORE UPDATE ON srs_cards
  FOR EACH ROW
  EXECUTE FUNCTION increment_version();

CREATE TRIGGER textbooks_version_trigger
  BEFORE UPDATE ON textbooks
  FOR EACH ROW
  EXECUTE FUNCTION increment_version();

-- Trigger to auto-refresh materialized views (optional - use cron instead for production)
-- Commented out as it can be expensive, use scheduled jobs instead
-- CREATE OR REPLACE FUNCTION auto_refresh_stats()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   PERFORM refresh_analytics_views();
--   RETURN NULL;
-- END;
-- $$ LANGUAGE plpgsql;

-- =====================================================
-- PART 7: STATISTICS UPDATE
-- =====================================================

-- Update table statistics for query planner
ANALYZE users;
ANALYZE textbooks;
ANALYZE textbook_chapters;
ANALYZE srs_cards;
ANALYZE vocabulary;
ANALYZE kanji;
ANALYZE grammar_points;
ANALYZE study_sessions;
ANALYZE user_performance;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check indexes
SELECT 
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Check materialized views
SELECT 
  schemaname,
  matviewname,
  definition
FROM pg_matviews
WHERE schemaname = 'public';

-- Check constraints
SELECT 
  conname,
  contype,
  conrelid::regclass AS table_name,
  pg_get_constraintdef(oid) AS constraint_def
FROM pg_constraint
WHERE connamespace = 'public'::regnamespace
ORDER BY conrelid::regclass::text, conname;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================

COMMENT ON MIGRATION IS 'Migration 010: Critical database optimizations including indexes, materialized views, database functions, and performance improvements';
