-- =====================================================
-- QUICK FIX: Add Missing Database Fields
-- Run this in Supabase SQL Editor to enable enhanced features
-- =====================================================

-- Fix for textbooks table
ALTER TABLE public.textbooks
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'textbook_chapter'
CHECK (content_type IN ('textbook_chapter', 'grammar_lesson', 'vocabulary_lesson', 'kanji_lesson', 'colloquial_lesson'));

-- Fix for textbook_chapters table
ALTER TABLE public.textbook_chapters
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'textbook_chapter'
CHECK (content_type IN ('textbook_chapter', 'grammar_lesson', 'vocabulary_lesson', 'kanji_lesson', 'colloquial_lesson')),
ADD COLUMN IF NOT EXISTS includes_exercises BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS includes_cultural_notes BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS includes_slang BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS includes_mnemonics BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_textbooks_content_type ON public.textbooks(content_type);
CREATE INDEX IF NOT EXISTS idx_textbook_chapters_content_type ON public.textbook_chapters(content_type);

-- Add comments
COMMENT ON COLUMN public.textbooks.error_message IS 'Error message if generation failed';
COMMENT ON COLUMN public.textbooks.content_type IS 'Type of content: textbook_chapter, grammar_lesson, vocabulary_lesson, kanji_lesson, colloquial_lesson';
COMMENT ON COLUMN public.textbook_chapters.content IS 'Full JLPT-compliant content (JSON)';
COMMENT ON COLUMN public.textbook_chapters.content_type IS 'Type of content for this chapter';
COMMENT ON COLUMN public.textbook_chapters.includes_exercises IS 'Whether chapter includes practice exercises';
COMMENT ON COLUMN public.textbook_chapters.includes_cultural_notes IS 'Whether chapter includes cultural context';
COMMENT ON COLUMN public.textbook_chapters.includes_slang IS 'Whether chapter includes modern Japanese slang';
COMMENT ON COLUMN public.textbook_chapters.includes_mnemonics IS 'Whether chapter includes memory aids';
COMMENT ON COLUMN public.textbook_chapters.generated_at IS 'Timestamp when chapter was generated';

-- Verify the changes
SELECT 
  'textbooks' as table_name,
  COUNT(*) FILTER (WHERE column_name = 'error_message') as has_error_message,
  COUNT(*) FILTER (WHERE column_name = 'content_type') as has_content_type
FROM information_schema.columns
WHERE table_name = 'textbooks'
UNION ALL
SELECT 
  'textbook_chapters' as table_name,
  COUNT(*) FILTER (WHERE column_name = 'content') as has_content,
  COUNT(*) FILTER (WHERE column_name = 'content_type') as has_content_type
FROM information_schema.columns
WHERE table_name = 'textbook_chapters';

-- =====================================================
-- ✅ Migration Complete!
-- You can now use all enhanced features:
-- - Enhanced error tracking
-- - Content type specification
-- - Full JLPT-compliant content storage
-- - Detailed generation metadata
-- =====================================================
