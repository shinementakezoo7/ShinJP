-- =====================================================
-- Textbook Enhancements Migration
-- Add fields for JLPT-compliant content generation
-- =====================================================

-- Add error_message field to textbooks table
ALTER TABLE public.textbooks
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- Add content field to textbook_chapters to store full JLPT-compliant content
ALTER TABLE public.textbook_chapters
ADD COLUMN IF NOT EXISTS content JSONB DEFAULT '{}';

-- Add content_type field to track what type of content was generated
ALTER TABLE public.textbook_chapters
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'textbook_chapter' 
CHECK (content_type IN ('textbook_chapter', 'grammar_lesson', 'vocabulary_lesson', 'kanji_lesson', 'colloquial_lesson'));

-- Add fields for enhanced content tracking
ALTER TABLE public.textbook_chapters
ADD COLUMN IF NOT EXISTS includes_exercises BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS includes_cultural_notes BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS includes_slang BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS includes_mnemonics BOOLEAN DEFAULT false;

-- Add content_type to textbooks for tracking
ALTER TABLE public.textbooks
ADD COLUMN IF NOT EXISTS content_type VARCHAR(50) DEFAULT 'textbook_chapter'
CHECK (content_type IN ('textbook_chapter', 'grammar_lesson', 'vocabulary_lesson', 'kanji_lesson', 'colloquial_lesson'));

-- Create index for faster queries by content type
CREATE INDEX IF NOT EXISTS idx_textbooks_content_type ON public.textbooks(content_type);
CREATE INDEX IF NOT EXISTS idx_textbook_chapters_content_type ON public.textbook_chapters(content_type);

-- Add generation timestamp
ALTER TABLE public.textbook_chapters
ADD COLUMN IF NOT EXISTS generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Comment the table changes
COMMENT ON COLUMN public.textbooks.error_message IS 'Error message if generation failed';
COMMENT ON COLUMN public.textbooks.content_type IS 'Type of content generated: textbook_chapter, grammar_lesson, vocabulary_lesson, kanji_lesson, colloquial_lesson';
COMMENT ON COLUMN public.textbook_chapters.content IS 'Full JLPT-compliant content including all generated data';
COMMENT ON COLUMN public.textbook_chapters.content_type IS 'Type of content for this chapter';
COMMENT ON COLUMN public.textbook_chapters.includes_exercises IS 'Whether this chapter includes practice exercises';
COMMENT ON COLUMN public.textbook_chapters.includes_cultural_notes IS 'Whether this chapter includes cultural context';
COMMENT ON COLUMN public.textbook_chapters.includes_slang IS 'Whether this chapter includes modern Japanese slang';
COMMENT ON COLUMN public.textbook_chapters.includes_mnemonics IS 'Whether this chapter includes memory aids';
