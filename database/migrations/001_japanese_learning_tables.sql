-- Japanese Learning Platform - Enhanced Database Schema
-- Migration: 001_japanese_learning_tables.sql
-- Description: Core tables for Japanese language learning from N5 to N1

-- ================================================================
-- 1. KANA LEARNING TABLES
-- ================================================================

-- Hiragana and Katakana characters
CREATE TABLE IF NOT EXISTS kana_characters (
  id SERIAL PRIMARY KEY,
  character TEXT NOT NULL UNIQUE,
  type TEXT CHECK (type IN ('hiragana', 'katakana')) NOT NULL,
  romaji TEXT NOT NULL,
  unicode_hex TEXT,
  stroke_count INTEGER NOT NULL,
  stroke_order_svg TEXT,
  stroke_order_images JSONB,
  audio_url TEXT,
  mnemonics TEXT,
  memory_tips TEXT,
  common_mistakes TEXT[],
  example_words JSONB, -- [{word: "", reading: "", meaning: ""}]
  position_in_chart INTEGER, -- Order in the traditional chart
  is_basic BOOLEAN DEFAULT true, -- false for dakuten/handakuten/combinations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kana_type ON kana_characters(type);
CREATE INDEX idx_kana_romaji ON kana_characters(romaji);

-- Kana combinations (yoon, sokuon, etc.)
CREATE TABLE IF NOT EXISTS kana_combinations (
  id SERIAL PRIMARY KEY,
  combination TEXT NOT NULL,
  type TEXT CHECK (type IN ('hiragana', 'katakana')) NOT NULL,
  romaji TEXT NOT NULL,
  components TEXT[], -- Individual kana that make up this combination
  pronunciation_notes TEXT,
  example_words JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 2. ENHANCED KANJI TABLES
-- ================================================================

-- Comprehensive Kanji database
CREATE TABLE IF NOT EXISTS kanji_enhanced (
  id SERIAL PRIMARY KEY,
  character TEXT NOT NULL UNIQUE,
  jlpt_level INTEGER CHECK (jlpt_level BETWEEN 1 AND 5),
  grade_level INTEGER CHECK (grade_level BETWEEN 1 AND 12), -- Japanese school grades
  stroke_count INTEGER NOT NULL,
  stroke_order_svg TEXT,
  stroke_order_animation_url TEXT,
  radicals JSONB, -- {main: "", components: []}
  meanings JSONB, -- {primary: [], secondary: []}
  readings JSONB, -- {on: [], kun: [], nanori: [], special: []}
  frequency_rank INTEGER,
  newspaper_rank INTEGER, -- Frequency in newspapers
  joyo_kanji BOOLEAN DEFAULT false,
  jinmeiyo_kanji BOOLEAN DEFAULT false, -- Name kanji
  examples JSONB, -- [{word: "", reading: "", meaning: "", jlpt_level: 5}]
  mnemonics TEXT,
  visual_similarity TEXT[], -- Similar looking kanji
  semantic_similarity TEXT[], -- Similar meaning kanji
  common_compounds JSONB, -- Common 2-kanji compounds
  etymology TEXT,
  cultural_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kanji_jlpt ON kanji_enhanced(jlpt_level);
CREATE INDEX idx_kanji_grade ON kanji_enhanced(grade_level);
CREATE INDEX idx_kanji_frequency ON kanji_enhanced(frequency_rank);
CREATE INDEX idx_kanji_stroke_count ON kanji_enhanced(stroke_count);

-- Kanji radicals (bushu)
CREATE TABLE IF NOT EXISTS kanji_radicals (
  id SERIAL PRIMARY KEY,
  radical TEXT NOT NULL UNIQUE,
  meaning TEXT NOT NULL,
  readings TEXT[],
  stroke_count INTEGER NOT NULL,
  position TEXT CHECK (position IN ('left', 'right', 'top', 'bottom', 'enclose', 'other')),
  variants TEXT[], -- Different forms of the same radical
  kanji_examples TEXT[], -- Kanji that use this radical
  importance_level INTEGER CHECK (importance_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 3. VOCABULARY TABLES
-- ================================================================

-- Enhanced vocabulary with full context
CREATE TABLE IF NOT EXISTS vocabulary_enhanced (
  id SERIAL PRIMARY KEY,
  word TEXT NOT NULL,
  reading TEXT NOT NULL,
  writings TEXT[], -- Alternative writings
  meanings JSONB, -- {primary: "", secondary: [], nuances: ""}
  jlpt_level INTEGER CHECK (jlpt_level BETWEEN 1 AND 5),
  frequency_rank INTEGER,
  part_of_speech TEXT[], -- Can have multiple
  pitch_accent INTEGER, -- Pitch accent pattern number
  pitch_pattern TEXT, -- Visual representation (e.g., "LHHH")
  audio_url TEXT,
  example_sentences JSONB, -- [{jp: "", reading: "", en: "", audio_url: ""}]
  synonyms INTEGER[], -- References to other vocabulary IDs
  antonyms INTEGER[], -- References to other vocabulary IDs
  related_words INTEGER[], -- References to other vocabulary IDs
  collocations JSONB, -- Common word combinations
  register TEXT CHECK (register IN ('formal', 'informal', 'honorific', 'humble', 'slang', 'written', 'spoken')),
  domain TEXT[], -- Business, medical, technical, etc.
  usage_notes TEXT,
  common_mistakes TEXT,
  etymology TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(word, reading)
);

CREATE INDEX idx_vocab_jlpt ON vocabulary_enhanced(jlpt_level);
CREATE INDEX idx_vocab_frequency ON vocabulary_enhanced(frequency_rank);
CREATE INDEX idx_vocab_pos ON vocabulary_enhanced USING GIN(part_of_speech);
CREATE INDEX idx_vocab_reading ON vocabulary_enhanced(reading);

-- ================================================================
-- 4. GRAMMAR TABLES
-- ================================================================

-- Grammar patterns with detailed explanations
CREATE TABLE IF NOT EXISTS grammar_patterns_enhanced (
  id SERIAL PRIMARY KEY,
  pattern TEXT NOT NULL,
  pattern_hiragana TEXT, -- Pattern written in hiragana
  jlpt_level INTEGER CHECK (jlpt_level BETWEEN 1 AND 5),
  meaning TEXT NOT NULL,
  english_equivalent TEXT,
  structure TEXT NOT NULL, -- How to form this pattern
  formation_rules JSONB, -- Detailed rules for different word types
  usage_context TEXT[], -- When to use this pattern
  formality_level TEXT CHECK (formality_level IN ('casual', 'neutral', 'formal', 'very_formal')),
  examples JSONB, -- [{jp: "", en: "", notes: ""}]
  similar_patterns INTEGER[], -- References to similar grammar IDs
  contrasting_patterns INTEGER[], -- Patterns often confused with this
  exceptions TEXT,
  common_mistakes TEXT,
  conjugation_examples JSONB,
  practice_exercises JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_grammar_jlpt ON grammar_patterns_enhanced(jlpt_level);
CREATE INDEX idx_grammar_pattern ON grammar_patterns_enhanced(pattern);

-- Grammar dependencies (prerequisites)
CREATE TABLE IF NOT EXISTS grammar_dependencies (
  id SERIAL PRIMARY KEY,
  grammar_id INTEGER REFERENCES grammar_patterns_enhanced(id),
  prerequisite_id INTEGER REFERENCES grammar_patterns_enhanced(id),
  dependency_type TEXT CHECK (dependency_type IN ('required', 'recommended', 'related')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(grammar_id, prerequisite_id)
);

-- ================================================================
-- 5. LISTENING CONTENT
-- ================================================================

CREATE TABLE IF NOT EXISTS listening_content (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  jlpt_level INTEGER CHECK (jlpt_level BETWEEN 1 AND 5),
  content_type TEXT CHECK (content_type IN ('dialogue', 'monologue', 'news', 'announcement', 'conversation', 'lecture')),
  duration INTEGER NOT NULL, -- seconds
  audio_url TEXT NOT NULL,
  audio_speed TEXT CHECK (audio_speed IN ('slow', 'normal', 'fast', 'natural')),
  transcript_japanese TEXT NOT NULL,
  transcript_furigana JSONB, -- Furigana annotations
  transcript_romaji TEXT,
  transcript_english TEXT,
  vocabulary_notes JSONB, -- Key vocabulary explanations
  grammar_notes JSONB, -- Grammar points used
  cultural_notes TEXT,
  comprehension_questions JSONB, -- [{question: "", options: [], answer: "", explanation: ""}]
  speaker_info JSONB, -- {gender: "", age_group: "", dialect: "", profession: ""}
  difficulty_score NUMERIC(3,2),
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_listening_jlpt ON listening_content(jlpt_level);
CREATE INDEX idx_listening_type ON listening_content(content_type);
CREATE INDEX idx_listening_duration ON listening_content(duration);

-- ================================================================
-- 6. READING CONTENT
-- ================================================================

CREATE TABLE IF NOT EXISTS reading_passages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT,
  source TEXT, -- Original source if applicable
  jlpt_level INTEGER CHECK (jlpt_level BETWEEN 1 AND 5),
  content_japanese TEXT NOT NULL,
  content_furigana JSONB, -- Furigana for difficult kanji
  content_english TEXT, -- Translation
  genre TEXT CHECK (genre IN ('news', 'story', 'essay', 'email', 'letter', 'manual', 'advertisement', 'novel', 'academic')),
  difficulty_score NUMERIC(3,2),
  estimated_reading_time INTEGER, -- minutes
  character_count INTEGER,
  unique_kanji_count INTEGER,
  vocabulary_list JSONB, -- Key vocabulary with definitions
  grammar_points JSONB, -- Grammar patterns used
  comprehension_questions JSONB, -- [{question: "", options: [], answer: "", explanation: ""}]
  discussion_prompts TEXT[], -- For speaking practice
  cultural_notes TEXT,
  teaching_points JSONB, -- Key learning objectives
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reading_jlpt ON reading_passages(jlpt_level);
CREATE INDEX idx_reading_genre ON reading_passages(genre);
CREATE INDEX idx_reading_difficulty ON reading_passages(difficulty_score);

-- ================================================================
-- 7. WRITING PRACTICE
-- ================================================================

CREATE TABLE IF NOT EXISTS writing_prompts (
  id SERIAL PRIMARY KEY,
  prompt_japanese TEXT NOT NULL,
  prompt_english TEXT NOT NULL,
  jlpt_level INTEGER CHECK (jlpt_level BETWEEN 1 AND 5),
  writing_type TEXT CHECK (writing_type IN ('sentence', 'paragraph', 'essay', 'email', 'letter', 'diary', 'report')),
  expected_length INTEGER, -- Expected character count
  key_vocabulary JSONB, -- Vocabulary to include
  required_grammar JSONB, -- Grammar points to use
  sample_answer TEXT,
  grading_criteria JSONB,
  hints TEXT[],
  difficulty_score NUMERIC(3,2),
  time_limit INTEGER, -- minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 8. CULTURAL CONTENT
-- ================================================================

CREATE TABLE IF NOT EXISTS cultural_lessons (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  content JSONB, -- Structured lesson content
  related_vocabulary INTEGER[], -- Vocabulary IDs
  related_grammar INTEGER[], -- Grammar IDs
  practical_phrases JSONB, -- Useful phrases for this context
  dos_and_donts JSONB,
  historical_context TEXT,
  modern_relevance TEXT,
  multimedia_urls JSONB, -- Videos, images, etc.
  quiz_questions JSONB,
  jlpt_level INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================================
-- 9. USER PROGRESS TRACKING
-- ================================================================

-- Enhanced user progress for Japanese learning
CREATE TABLE IF NOT EXISTS user_japanese_progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- JLPT Progress
  current_jlpt_level INTEGER DEFAULT 5,
  target_jlpt_level INTEGER DEFAULT 1,
  estimated_exam_date DATE,
  
  -- Kana Mastery
  hiragana_mastery NUMERIC(5,2) DEFAULT 0,
  katakana_mastery NUMERIC(5,2) DEFAULT 0,
  kana_reading_speed INTEGER, -- Characters per minute
  
  -- Kanji Progress
  kanji_known INTEGER DEFAULT 0,
  kanji_learning INTEGER DEFAULT 0,
  kanji_mastered INTEGER DEFAULT 0,
  kanji_by_level JSONB DEFAULT '{"N5": 0, "N4": 0, "N3": 0, "N2": 0, "N1": 0}',
  
  -- Vocabulary Progress
  vocabulary_known INTEGER DEFAULT 0,
  vocabulary_learning INTEGER DEFAULT 0,
  vocabulary_mastered INTEGER DEFAULT 0,
  vocabulary_by_level JSONB DEFAULT '{"N5": 0, "N4": 0, "N3": 0, "N2": 0, "N1": 0}',
  
  -- Grammar Progress
  grammar_patterns_known INTEGER DEFAULT 0,
  grammar_patterns_learning INTEGER DEFAULT 0,
  grammar_patterns_mastered INTEGER DEFAULT 0,
  grammar_by_level JSONB DEFAULT '{"N5": 0, "N4": 0, "N3": 0, "N2": 0, "N1": 0}',
  
  -- Skills Assessment
  listening_score NUMERIC(5,2) DEFAULT 0,
  reading_score NUMERIC(5,2) DEFAULT 0,
  speaking_score NUMERIC(5,2) DEFAULT 0,
  writing_score NUMERIC(5,2) DEFAULT 0,
  
  -- Study Statistics
  total_study_time INTEGER DEFAULT 0, -- minutes
  study_streak INTEGER DEFAULT 0, -- days
  longest_streak INTEGER DEFAULT 0,
  last_study_date DATE,
  average_daily_time INTEGER DEFAULT 0, -- minutes
  preferred_study_time TIME,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_progress_user ON user_japanese_progress(user_id);
CREATE INDEX idx_user_progress_level ON user_japanese_progress(current_jlpt_level);

-- ================================================================
-- 10. PRACTICE SESSIONS
-- ================================================================

CREATE TABLE IF NOT EXISTS practice_sessions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  session_type TEXT CHECK (session_type IN ('kanji', 'vocabulary', 'grammar', 'listening', 'reading', 'writing', 'speaking', 'mixed')),
  jlpt_level INTEGER,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- seconds
  items_practiced INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  accuracy NUMERIC(5,2),
  items_data JSONB, -- Detailed data about each item practiced
  performance_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON practice_sessions(user_id);
CREATE INDEX idx_sessions_date ON practice_sessions(started_at);
CREATE INDEX idx_sessions_type ON practice_sessions(session_type);
