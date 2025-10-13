-- =====================================================
-- Shinmen Takezo Database Schema
-- Japanese Learning Platform (N5 to N1)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Users & Authentication
-- =====================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE,
  display_name VARCHAR(100),
  
  -- Learning profile
  current_jlpt_level VARCHAR(10) DEFAULT 'N5' CHECK (current_jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  target_jlpt_level VARCHAR(10) DEFAULT 'N1' CHECK (target_jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  native_language VARCHAR(50) DEFAULT 'English',
  learning_goals TEXT[],
  interests TEXT[],
  
  -- Statistics
  study_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_study_time INTEGER DEFAULT 0, -- in minutes
  total_lessons_completed INTEGER DEFAULT 0,
  total_reviews_completed INTEGER DEFAULT 0,
  
  -- Settings
  daily_goal_minutes INTEGER DEFAULT 30,
  notifications_enabled BOOLEAN DEFAULT true,
  theme_preference VARCHAR(20) DEFAULT 'system',
  font_size INTEGER DEFAULT 16,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE public.user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- UI preferences
  show_romaji BOOLEAN DEFAULT true,
  show_furigana BOOLEAN DEFAULT true,
  auto_play_audio BOOLEAN DEFAULT false,
  
  -- Study preferences
  srs_new_cards_per_day INTEGER DEFAULT 20,
  srs_review_limit INTEGER DEFAULT 100,
  preferred_study_time VARCHAR(20) DEFAULT 'anytime',
  
  -- Content preferences
  preferred_content_topics TEXT[],
  avoid_content_topics TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- =====================================================
-- Textbooks & Content
-- =====================================================

-- Textbooks
CREATE TABLE public.textbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  
  -- Basic info
  title VARCHAR(500) NOT NULL,
  description TEXT,
  jlpt_level VARCHAR(10) NOT NULL CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  
  -- Content
  chapters JSONB NOT NULL DEFAULT '[]',
  total_chapters INTEGER DEFAULT 0,
  
  -- Metadata
  topics TEXT[],
  keywords TEXT[],
  estimated_completion_hours INTEGER,
  
  -- Status
  is_public BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT false,
  generation_status VARCHAR(20) DEFAULT 'draft' CHECK (generation_status IN ('draft', 'generating', 'completed', 'error')),
  
  -- AI generation info
  generated_by VARCHAR(100) DEFAULT 'NVIDIA stockmark-2-100b-instruct',
  generation_params JSONB,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Textbook chapters (denormalized for easier querying)
CREATE TABLE public.textbook_chapters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  textbook_id UUID NOT NULL REFERENCES public.textbooks(id) ON DELETE CASCADE,
  
  chapter_number INTEGER NOT NULL,
  title VARCHAR(500) NOT NULL,
  introduction TEXT,
  
  -- Content
  sections JSONB NOT NULL DEFAULT '[]',
  vocabulary JSONB DEFAULT '[]',
  grammar_points JSONB DEFAULT '[]',
  exercises JSONB DEFAULT '[]',
  
  -- Metadata
  estimated_time_minutes INTEGER DEFAULT 30,
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(textbook_id, chapter_number)
);

-- Lessons (reusable learning units)
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic info
  title VARCHAR(500) NOT NULL,
  description TEXT,
  jlpt_level VARCHAR(10) NOT NULL CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  lesson_type VARCHAR(50) NOT NULL CHECK (lesson_type IN ('grammar', 'vocabulary', 'kanji', 'reading', 'listening', 'conversation', 'culture')),
  
  -- Content
  content JSONB NOT NULL,
  exercises JSONB DEFAULT '[]',
  
  -- Metadata
  topics TEXT[],
  prerequisites UUID[], -- lesson IDs
  estimated_time_minutes INTEGER DEFAULT 20,
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  
  -- Status
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Learning Progress
-- =====================================================

-- User textbook progress
CREATE TABLE public.user_textbook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES public.textbooks(id) ON DELETE CASCADE,
  
  -- Progress
  current_chapter INTEGER DEFAULT 1,
  chapters_completed INTEGER DEFAULT 0,
  total_chapters INTEGER,
  completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage BETWEEN 0 AND 100),
  
  -- Time tracking
  total_time_spent INTEGER DEFAULT 0, -- minutes
  last_studied_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('not_started', 'in_progress', 'completed', 'paused')),
  
  -- Bookmarks
  bookmarks JSONB DEFAULT '[]',
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, textbook_id)
);

-- User lesson progress
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  
  -- Completion
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- Performance
  score DECIMAL(5,2), -- percentage
  time_spent INTEGER DEFAULT 0, -- seconds
  attempts INTEGER DEFAULT 0,
  
  -- Detailed results
  exercise_results JSONB DEFAULT '[]',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, lesson_id)
);

-- Study sessions (for analytics)
CREATE TABLE public.study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Session info
  session_type VARCHAR(50) NOT NULL CHECK (session_type IN ('lesson', 'review', 'textbook', 'practice', 'conversation')),
  content_id UUID, -- textbook_id or lesson_id
  
  -- Metrics
  duration_seconds INTEGER NOT NULL,
  items_reviewed INTEGER DEFAULT 0,
  items_correct INTEGER DEFAULT 0,
  
  -- Context
  metadata JSONB,
  
  started_at TIMESTAMP WITH TIME ZONE NOT NULL,
  ended_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Spaced Repetition System (SRS)
-- =====================================================

-- SRS Cards
CREATE TABLE public.srs_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Card content
  card_type VARCHAR(50) NOT NULL CHECK (card_type IN ('vocabulary', 'kanji', 'grammar', 'sentence')),
  content JSONB NOT NULL,
  
  -- Front/back
  front TEXT NOT NULL, -- What user sees (e.g., kanji, Japanese word)
  back TEXT NOT NULL, -- Answer (e.g., meaning, reading)
  context TEXT, -- Example sentence or usage
  
  -- SRS Algorithm (SM-2)
  interval INTEGER DEFAULT 1, -- days until next review
  ease_factor DECIMAL(3,2) DEFAULT 2.50,
  repetitions INTEGER DEFAULT 0,
  quality INTEGER, -- Last review quality (0-5)
  
  -- Schedule
  next_review_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_reviewed_at TIMESTAMP WITH TIME ZONE,
  
  -- Stats
  total_reviews INTEGER DEFAULT 0,
  correct_reviews INTEGER DEFAULT 0,
  
  -- Metadata
  source VARCHAR(50), -- 'textbook', 'lesson', 'manual'
  source_id UUID,
  tags TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SRS Review history
CREATE TABLE public.srs_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES public.srs_cards(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Review result
  quality INTEGER NOT NULL CHECK (quality BETWEEN 0 AND 5),
  time_taken_seconds INTEGER,
  
  -- Before/after state
  interval_before INTEGER,
  interval_after INTEGER,
  ease_factor_before DECIMAL(3,2),
  ease_factor_after DECIMAL(3,2),
  
  reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Vocabulary & Kanji Database
-- =====================================================

-- Vocabulary
CREATE TABLE public.vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Japanese
  word VARCHAR(255) NOT NULL UNIQUE,
  reading VARCHAR(255),
  romaji VARCHAR(255),
  
  -- Meaning
  meaning_english TEXT NOT NULL,
  meaning_native TEXT, -- User's native language
  
  -- Grammar
  part_of_speech VARCHAR(50) NOT NULL,
  jlpt_level VARCHAR(10) CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  
  -- Usage
  common_level INTEGER DEFAULT 5000, -- Frequency rank
  examples JSONB DEFAULT '[]',
  
  -- Media
  audio_url VARCHAR(500),
  
  -- Related words
  synonyms TEXT[],
  antonyms TEXT[],
  related_words TEXT[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kanji
CREATE TABLE public.kanji (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Character
  character CHAR(1) NOT NULL UNIQUE,
  
  -- Readings
  onyomi TEXT[], -- Chinese reading
  kunyomi TEXT[], -- Japanese reading
  nanori TEXT[], -- Name readings
  
  -- Meaning
  meaning_english TEXT NOT NULL,
  meaning_native TEXT,
  
  -- Structure
  radical VARCHAR(50),
  stroke_count INTEGER NOT NULL,
  stroke_order JSONB, -- SVG paths or description
  
  -- Level
  jlpt_level VARCHAR(10) CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  grade INTEGER, -- School grade level
  frequency_rank INTEGER,
  
  -- Usage
  examples JSONB DEFAULT '[]',
  compounds TEXT[], -- Common compound words
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grammar patterns
CREATE TABLE public.grammar_points (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Pattern
  pattern VARCHAR(255) NOT NULL,
  pattern_japanese VARCHAR(255),
  
  -- Meaning
  meaning TEXT NOT NULL,
  usage TEXT NOT NULL,
  formation TEXT,
  
  -- Level
  jlpt_level VARCHAR(10) NOT NULL CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  
  -- Examples
  examples JSONB DEFAULT '[]',
  
  -- Related
  related_patterns UUID[],
  tags TEXT[],
  
  -- Notes
  notes TEXT,
  common_mistakes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- AI Conversations
-- =====================================================

-- Conversation sessions
CREATE TABLE public.conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  
  -- Session info
  title VARCHAR(255),
  scenario VARCHAR(255),
  jlpt_level VARCHAR(10) NOT NULL CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  
  -- Content
  messages JSONB NOT NULL DEFAULT '[]',
  corrections JSONB DEFAULT '[]',
  
  -- Analysis
  fluency_score DECIMAL(3,2),
  grammar_accuracy DECIMAL(3,2),
  vocabulary_level VARCHAR(10),
  
  -- Metadata
  message_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Indexes for Performance
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_current_level ON public.users(current_jlpt_level);
CREATE INDEX idx_users_last_active ON public.users(last_active_at);

-- Textbooks indexes
CREATE INDEX idx_textbooks_user ON public.textbooks(user_id);
CREATE INDEX idx_textbooks_level ON public.textbooks(jlpt_level);
CREATE INDEX idx_textbooks_public ON public.textbooks(is_public) WHERE is_public = true;
CREATE INDEX idx_textbooks_status ON public.textbooks(generation_status);
CREATE INDEX idx_textbooks_created ON public.textbooks(created_at DESC);

-- Chapters indexes
CREATE INDEX idx_chapters_textbook ON public.textbook_chapters(textbook_id);

-- Lessons indexes
CREATE INDEX idx_lessons_level ON public.lessons(jlpt_level);
CREATE INDEX idx_lessons_type ON public.lessons(lesson_type);
CREATE INDEX idx_lessons_public ON public.lessons(is_public) WHERE is_public = true;

-- Progress indexes
CREATE INDEX idx_user_textbook_progress ON public.user_textbook_progress(user_id, textbook_id);
CREATE INDEX idx_user_lesson_progress ON public.user_lesson_progress(user_id, lesson_id);
CREATE INDEX idx_study_sessions_user ON public.study_sessions(user_id, started_at DESC);

-- SRS indexes
CREATE INDEX idx_srs_cards_user ON public.srs_cards(user_id);
CREATE INDEX idx_srs_cards_next_review ON public.srs_cards(user_id, next_review_at) WHERE next_review_at <= NOW();
CREATE INDEX idx_srs_cards_type ON public.srs_cards(card_type);
CREATE INDEX idx_srs_reviews_card ON public.srs_reviews(card_id, reviewed_at DESC);

-- Vocabulary indexes
CREATE INDEX idx_vocabulary_word ON public.vocabulary(word);
CREATE INDEX idx_vocabulary_level ON public.vocabulary(jlpt_level);
CREATE INDEX idx_vocabulary_pos ON public.vocabulary(part_of_speech);

-- Kanji indexes
CREATE INDEX idx_kanji_character ON public.kanji(character);
CREATE INDEX idx_kanji_level ON public.kanji(jlpt_level);
CREATE INDEX idx_kanji_stroke ON public.kanji(stroke_count);

-- Grammar indexes
CREATE INDEX idx_grammar_level ON public.grammar_points(jlpt_level);
CREATE INDEX idx_grammar_pattern ON public.grammar_points(pattern);

-- Conversations indexes
CREATE INDEX idx_conversations_user ON public.conversations(user_id, created_at DESC);

-- =====================================================
-- Row Level Security (RLS) Policies
-- =====================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textbook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_textbook_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.srs_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

-- Users: Users can read and update their own data
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User preferences: Users can manage their own preferences
CREATE POLICY "Users can manage own preferences" ON public.user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Textbooks: Users can manage their own, view public ones
CREATE POLICY "Users can view own textbooks" ON public.textbooks
  FOR SELECT USING (auth.uid() = user_id OR is_public = true);

CREATE POLICY "Users can create textbooks" ON public.textbooks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own textbooks" ON public.textbooks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own textbooks" ON public.textbooks
  FOR DELETE USING (auth.uid() = user_id);

-- Chapters: Inherit from textbooks
CREATE POLICY "Users can view chapters" ON public.textbook_chapters
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.textbooks
      WHERE textbooks.id = textbook_chapters.textbook_id
      AND (textbooks.user_id = auth.uid() OR textbooks.is_public = true)
    )
  );

-- Progress: Users can only access their own
CREATE POLICY "Users can manage own progress" ON public.user_textbook_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own lesson progress" ON public.user_lesson_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON public.study_sessions
  FOR ALL USING (auth.uid() = user_id);

-- SRS: Users can only access their own cards
CREATE POLICY "Users can manage own cards" ON public.srs_cards
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own reviews" ON public.srs_reviews
  FOR ALL USING (auth.uid() = user_id);

-- Conversations: Users can only access their own
CREATE POLICY "Users can manage own conversations" ON public.conversations
  FOR ALL USING (auth.uid() = user_id);

-- Public tables (no RLS needed - read-only for all authenticated users)
-- lessons, vocabulary, kanji, grammar_points

-- =====================================================
-- Functions & Triggers
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_textbooks_updated_at BEFORE UPDATE ON public.textbooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON public.textbook_chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON public.lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.user_textbook_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_srs_cards_updated_at BEFORE UPDATE ON public.srs_cards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update user stats on new session
CREATE OR REPLACE FUNCTION update_user_stats_on_session()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET 
    total_study_time = total_study_time + (NEW.duration_seconds / 60),
    last_active_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stats_on_new_session
  AFTER INSERT ON public.study_sessions
  FOR EACH ROW EXECUTE FUNCTION update_user_stats_on_session();

-- =====================================================
-- Initial Data (Optional)
-- =====================================================

-- You can add seed data here for vocabulary, kanji, grammar points
-- This will be populated separately

COMMENT ON TABLE public.textbooks IS 'AI-generated Japanese textbooks for JLPT levels N5-N1';
COMMENT ON TABLE public.srs_cards IS 'Spaced repetition flashcards using SM-2 algorithm';
COMMENT ON TABLE public.vocabulary IS 'Japanese vocabulary database with JLPT classification';
COMMENT ON TABLE public.kanji IS 'Kanji database with readings, meanings, and stroke order';
