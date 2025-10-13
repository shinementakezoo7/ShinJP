-- =====================================================
-- CREATE TEXTBOOKS TABLES
-- Complete schema for AI-powered textbook generation
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- Textbooks Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.textbooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID DEFAULT NULL,
  
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
  
  -- Enhanced fields
  content_type VARCHAR(50) DEFAULT 'textbook_chapter' CHECK (content_type IN ('textbook_chapter', 'grammar_lesson', 'vocabulary_lesson', 'kanji_lesson', 'colloquial_lesson')),
  error_message TEXT,
  
  -- Stats
  view_count INTEGER DEFAULT 0,
  completion_count INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  download_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- Textbook Chapters Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.textbook_chapters (
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
  
  -- Full content storage
  content JSONB DEFAULT '{}',
  content_type VARCHAR(50) DEFAULT 'textbook_chapter' CHECK (content_type IN ('textbook_chapter', 'grammar_lesson', 'vocabulary_lesson', 'kanji_lesson', 'colloquial_lesson')),
  
  -- Enhancement tracking
  includes_exercises BOOLEAN DEFAULT true,
  includes_cultural_notes BOOLEAN DEFAULT false,
  includes_slang BOOLEAN DEFAULT false,
  includes_mnemonics BOOLEAN DEFAULT false,
  
  -- Metadata
  estimated_time_minutes INTEGER DEFAULT 30,
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(textbook_id, chapter_number)
);

-- =====================================================
-- User Textbook Progress Table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_textbook_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  textbook_id UUID NOT NULL REFERENCES public.textbooks(id) ON DELETE CASCADE,
  
  -- Progress tracking
  current_chapter INTEGER DEFAULT 1,
  completed_chapters INTEGER[] DEFAULT ARRAY[]::INTEGER[],
  completion_percentage INTEGER DEFAULT 0,
  
  -- Study stats
  time_spent_minutes INTEGER DEFAULT 0,
  last_read_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  
  -- User notes
  notes TEXT,
  bookmarked_pages INTEGER[],
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, textbook_id)
);

-- =====================================================
-- Indexes for Performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_textbooks_jlpt_level ON public.textbooks(jlpt_level);
CREATE INDEX IF NOT EXISTS idx_textbooks_status ON public.textbooks(generation_status);
CREATE INDEX IF NOT EXISTS idx_textbooks_content_type ON public.textbooks(content_type);
CREATE INDEX IF NOT EXISTS idx_textbooks_created_at ON public.textbooks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_textbooks_is_public ON public.textbooks(is_public) WHERE is_public = true;

CREATE INDEX IF NOT EXISTS idx_chapters_textbook_id ON public.textbook_chapters(textbook_id);
CREATE INDEX IF NOT EXISTS idx_chapters_content_type ON public.textbook_chapters(content_type);

CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.user_textbook_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_textbook_id ON public.user_textbook_progress(textbook_id);

-- =====================================================
-- Enable Row Level Security (Optional)
-- =====================================================
ALTER TABLE public.textbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.textbook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_textbook_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read public textbooks
CREATE POLICY IF NOT EXISTS "Public textbooks are viewable by everyone"
ON public.textbooks FOR SELECT
USING (is_public = true OR auth.uid() = user_id);

-- Policy: Users can insert their own textbooks
CREATE POLICY IF NOT EXISTS "Users can insert their own textbooks"
ON public.textbooks FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Users can update their own textbooks
CREATE POLICY IF NOT EXISTS "Users can update their own textbooks"
ON public.textbooks FOR UPDATE
USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: Anyone can read chapters of public textbooks
CREATE POLICY IF NOT EXISTS "Chapters of public textbooks are viewable"
ON public.textbook_chapters FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.textbooks
    WHERE textbooks.id = textbook_chapters.textbook_id
    AND (textbooks.is_public = true OR textbooks.user_id = auth.uid())
  )
);

-- Policy: Users can manage their own progress
CREATE POLICY IF NOT EXISTS "Users can manage their own progress"
ON public.user_textbook_progress
USING (auth.uid() = user_id);

-- =====================================================
-- Comments for Documentation
-- =====================================================
COMMENT ON TABLE public.textbooks IS 'AI-generated Japanese textbooks with JLPT compliance';
COMMENT ON TABLE public.textbook_chapters IS 'Individual chapters of textbooks with full JLPT content';
COMMENT ON TABLE public.user_textbook_progress IS 'User reading progress and study statistics';

COMMENT ON COLUMN public.textbooks.content_type IS 'Type of content: textbook_chapter, grammar_lesson, vocabulary_lesson, kanji_lesson, colloquial_lesson';
COMMENT ON COLUMN public.textbooks.error_message IS 'Error message if generation failed';
COMMENT ON COLUMN public.textbooks.download_count IS 'Number of times textbook was downloaded as PDF';

COMMENT ON COLUMN public.textbook_chapters.content IS 'Full JLPT-compliant content (JSON)';
COMMENT ON COLUMN public.textbook_chapters.includes_exercises IS 'Whether chapter includes practice exercises';
COMMENT ON COLUMN public.textbook_chapters.includes_cultural_notes IS 'Whether chapter includes cultural context';
COMMENT ON COLUMN public.textbook_chapters.includes_slang IS 'Whether chapter includes modern Japanese slang';
COMMENT ON COLUMN public.textbook_chapters.includes_mnemonics IS 'Whether chapter includes memory aids';

-- =====================================================
-- Success Message
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Textbooks tables created successfully!';
  RAISE NOTICE '   - public.textbooks';
  RAISE NOTICE '   - public.textbook_chapters';
  RAISE NOTICE '   - public.user_textbook_progress';
  RAISE NOTICE '   All indexes and policies configured.';
END $$;
