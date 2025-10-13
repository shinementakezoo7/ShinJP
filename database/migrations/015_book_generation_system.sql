-- =====================================================
-- BOOK GENERATION SYSTEM MIGRATION
-- Complete system for AI-powered book generation
-- Supports 500+ page books with parallel processing
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. BOOK TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.book_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Info
  name VARCHAR(200) NOT NULL,
  description TEXT,
  template_type VARCHAR(50) NOT NULL CHECK (template_type IN ('ssw_sector', 'jlpt_level', 'custom')),
  
  -- Template Structure
  structure JSONB NOT NULL DEFAULT '{
    "parts": [],
    "total_chapters": 25,
    "total_pages": 500
  }',
  
  -- Content Requirements per Chapter
  content_requirements JSONB DEFAULT '{
    "vocabulary_per_chapter": 40,
    "grammar_points_per_chapter": 10,
    "examples_per_grammar": 5,
    "dialogues_per_chapter": 2,
    "exercises_per_chapter": 10,
    "min_word_count": 4000,
    "max_word_count": 8000
  }',
  
  -- AI Prompts
  chapter_prompt_template TEXT,
  section_prompt_template TEXT,
  vocabulary_prompt_template TEXT,
  dialogue_prompt_template TEXT,
  exercise_prompt_template TEXT,
  
  -- Validation Rules
  validation_rules JSONB DEFAULT '{
    "require_safety_content": false,
    "require_cultural_notes": true,
    "jlpt_compliance": true,
    "min_vocabulary": 30,
    "min_grammar_points": 8
  }',
  
  -- Metadata
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. BOOK GENERATION JOBS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.book_generation_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID,
  
  -- Book Configuration
  book_type VARCHAR(50) NOT NULL CHECK (book_type IN ('ssw_sector', 'jlpt_level', 'custom')),
  sector_id VARCHAR(50), -- caregiving, construction, etc.
  jlpt_level VARCHAR(10), -- N5, N4, N3, N2, N1
  custom_config JSONB,
  
  -- Template & Structure
  template_id UUID REFERENCES public.book_templates(id),
  target_pages INTEGER DEFAULT 500,
  target_chapters INTEGER DEFAULT 25,
  book_title VARCHAR(500),
  
  -- Generation Configuration
  generation_config JSONB DEFAULT '{
    "parallel_chapters": 10,
    "use_streaming": true,
    "include_exercises": true,
    "include_audio_scripts": true,
    "include_cultural_notes": true,
    "vocabulary_density": "high",
    "grammar_focus": true,
    "retry_on_failure": true,
    "max_retries": 3
  }',
  
  -- Status Tracking
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending',
    'initializing',
    'generating',
    'validating',
    'finalizing',
    'completed',
    'failed',
    'cancelled'
  )),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
  current_stage VARCHAR(100),
  
  -- Progress Details
  chapters_total INTEGER DEFAULT 0,
  chapters_completed INTEGER DEFAULT 0,
  chapters_failed INTEGER DEFAULT 0,
  chapters_in_progress INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_completion_time TIMESTAMP WITH TIME ZONE,
  total_generation_time_seconds INTEGER,
  
  -- Output
  output_book_id UUID REFERENCES public.textbooks(id),
  output_files JSONB DEFAULT '[]',
  
  -- Error Handling
  error_message TEXT,
  error_details JSONB,
  retry_count INTEGER DEFAULT 0,
  
  -- Metadata & Analytics
  ai_model VARCHAR(100) DEFAULT 'NVIDIA stockmark-2-100b-instruct',
  total_tokens_used INTEGER DEFAULT 0,
  total_cost_usd DECIMAL(10, 4) DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 3. CHAPTER GENERATION TASKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.chapter_generation_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES public.book_generation_jobs(id) ON DELETE CASCADE,
  
  -- Chapter Info
  chapter_number INTEGER NOT NULL,
  chapter_title VARCHAR(500),
  part_number INTEGER,
  part_title VARCHAR(200),
  
  -- Content Specification
  target_word_count INTEGER DEFAULT 5000,
  vocabulary_list JSONB DEFAULT '[]',
  grammar_points JSONB DEFAULT '[]',
  dialogue_scenarios TEXT[],
  
  -- Generation Config
  prompt TEXT,
  generation_params JSONB DEFAULT '{
    "temperature": 0.7,
    "max_tokens": 16000,
    "model": "NVIDIA stockmark-2-100b-instruct"
  }',
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'pending',
    'queued',
    'generating',
    'validating',
    'completed',
    'failed',
    'retrying'
  )),
  retry_count INTEGER DEFAULT 0,
  max_retries INTEGER DEFAULT 3,
  
  -- Output
  output_chapter_id UUID REFERENCES public.textbook_chapters(id),
  generated_content JSONB,
  generated_markdown TEXT,
  word_count INTEGER,
  
  -- Quality Metrics
  validation_status VARCHAR(20),
  validation_results JSONB,
  quality_score DECIMAL(3, 2),
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  generation_time_seconds INTEGER,
  
  -- Error Handling
  error_message TEXT,
  error_stack TEXT,
  
  -- AI Metadata
  tokens_used INTEGER,
  ai_model VARCHAR(100),
  cost_usd DECIMAL(10, 4),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(job_id, chapter_number)
);

-- =====================================================
-- 4. BOOK VOCABULARY BANK TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.book_vocabulary_bank (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Classification
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(100),
  tags TEXT[],
  
  -- Word Data
  word VARCHAR(100) NOT NULL,
  reading VARCHAR(100) NOT NULL,
  romaji VARCHAR(200),
  
  -- Meanings
  primary_meaning TEXT NOT NULL,
  alternative_meanings TEXT[],
  
  -- Classification
  jlpt_level VARCHAR(10) CHECK (jlpt_level IN ('N5', 'N4', 'N3', 'N2', 'N1')),
  part_of_speech VARCHAR(50),
  formality_level VARCHAR(20) CHECK (formality_level IN ('casual', 'neutral', 'formal', 'keigo')),
  
  -- Usage
  usage_frequency VARCHAR(20) CHECK (usage_frequency IN ('daily', 'weekly', 'monthly', 'specialized')),
  safety_critical BOOLEAN DEFAULT false,
  workplace_essential BOOLEAN DEFAULT false,
  
  -- Examples (JSONB array)
  example_sentences JSONB DEFAULT '[]',
  
  -- Collocations
  collocations TEXT[],
  
  -- Context
  cultural_notes TEXT,
  usage_notes TEXT,
  
  -- Associations
  related_words UUID[],
  synonyms TEXT[],
  antonyms TEXT[],
  
  -- Metadata
  source VARCHAR(100),
  verified BOOLEAN DEFAULT false,
  verified_by VARCHAR(100),
  usage_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. BOOK DIALOGUE TEMPLATES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.book_dialogue_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Classification
  category VARCHAR(50) NOT NULL,
  sector VARCHAR(50),
  scenario_type VARCHAR(100) NOT NULL,
  tags TEXT[],
  
  -- Dialogue Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  
  -- Context
  setting TEXT,
  participants INTEGER DEFAULT 2,
  participant_roles JSONB DEFAULT '[]',
  
  -- Content
  dialogue_structure JSONB NOT NULL,
  
  -- Learning Points
  key_phrases JSONB DEFAULT '[]',
  grammar_points TEXT[],
  vocabulary_focus TEXT[],
  cultural_notes TEXT,
  
  -- Metadata
  jlpt_level VARCHAR(10),
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  formality_level VARCHAR(20),
  
  audio_script_available BOOLEAN DEFAULT false,
  audio_file_url TEXT,
  
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 6. BOOK GENERATION LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.book_generation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID REFERENCES public.book_generation_jobs(id) ON DELETE CASCADE,
  task_id UUID REFERENCES public.chapter_generation_tasks(id) ON DELETE CASCADE,
  
  log_level VARCHAR(20) CHECK (log_level IN ('debug', 'info', 'warning', 'error', 'critical')),
  message TEXT NOT NULL,
  details JSONB,
  
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Templates
CREATE INDEX IF NOT EXISTS idx_templates_type ON public.book_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_templates_active ON public.book_templates(is_active) WHERE is_active = true;

-- Generation Jobs
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.book_generation_jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_user ON public.book_generation_jobs(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_type ON public.book_generation_jobs(book_type);
CREATE INDEX IF NOT EXISTS idx_jobs_created ON public.book_generation_jobs(created_at DESC);

-- Chapter Tasks
CREATE INDEX IF NOT EXISTS idx_tasks_job ON public.chapter_generation_tasks(job_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.chapter_generation_tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_chapter_num ON public.chapter_generation_tasks(job_id, chapter_number);

-- Vocabulary Bank
CREATE INDEX IF NOT EXISTS idx_vocab_category ON public.book_vocabulary_bank(category);
CREATE INDEX IF NOT EXISTS idx_vocab_jlpt ON public.book_vocabulary_bank(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_vocab_word ON public.book_vocabulary_bank(word);
CREATE INDEX IF NOT EXISTS idx_vocab_safety ON public.book_vocabulary_bank(safety_critical) WHERE safety_critical = true;
CREATE INDEX IF NOT EXISTS idx_vocab_workplace ON public.book_vocabulary_bank(workplace_essential) WHERE workplace_essential = true;

-- Dialogue Templates
CREATE INDEX IF NOT EXISTS idx_dialogues_category ON public.book_dialogue_templates(category);
CREATE INDEX IF NOT EXISTS idx_dialogues_sector ON public.book_dialogue_templates(sector);
CREATE INDEX IF NOT EXISTS idx_dialogues_jlpt ON public.book_dialogue_templates(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_dialogues_active ON public.book_dialogue_templates(is_active) WHERE is_active = true;

-- Logs
CREATE INDEX IF NOT EXISTS idx_logs_job ON public.book_generation_logs(job_id);
CREATE INDEX IF NOT EXISTS idx_logs_task ON public.book_generation_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_logs_level ON public.book_generation_logs(log_level);
CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON public.book_generation_logs(timestamp DESC);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_book_templates_updated_at
  BEFORE UPDATE ON public.book_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_generation_jobs_updated_at
  BEFORE UPDATE ON public.book_generation_jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chapter_generation_tasks_updated_at
  BEFORE UPDATE ON public.chapter_generation_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_vocabulary_bank_updated_at
  BEFORE UPDATE ON public.book_vocabulary_bank
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_book_dialogue_templates_updated_at
  BEFORE UPDATE ON public.book_dialogue_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE public.book_templates IS 'Templates for generating structured books (SSW, JLPT, custom)';
COMMENT ON TABLE public.book_generation_jobs IS 'Main job tracker for book generation processes';
COMMENT ON TABLE public.chapter_generation_tasks IS 'Individual chapter generation tasks within a book job';
COMMENT ON TABLE public.book_vocabulary_bank IS 'Comprehensive vocabulary database for all categories';
COMMENT ON TABLE public.book_dialogue_templates IS 'Pre-defined dialogue scenarios for workplace/learning contexts';
COMMENT ON TABLE public.book_generation_logs IS 'Detailed logs for debugging and monitoring';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Book Generation System migration completed successfully!';
  RAISE NOTICE '   Created tables:';
  RAISE NOTICE '   - book_templates';
  RAISE NOTICE '   - book_generation_jobs';
  RAISE NOTICE '   - chapter_generation_tasks';
  RAISE NOTICE '   - book_vocabulary_bank';
  RAISE NOTICE '   - book_dialogue_templates';
  RAISE NOTICE '   - book_generation_logs';
  RAISE NOTICE '';
  RAISE NOTICE '   System ready to generate 500+ page books! 🚀';
END $$;
