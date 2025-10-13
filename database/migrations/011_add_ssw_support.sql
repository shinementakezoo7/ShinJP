-- =====================================================
-- SSW (Specified Skilled Worker) Support Migration
-- Adds complete support for SSW Type 1, Type 2, and JFT-Basic
-- Version: 1.0.0
-- Date: 2025-01-XX
-- =====================================================

-- Add SSW columns to textbooks table
ALTER TABLE public.textbooks
ADD COLUMN IF NOT EXISTS ssw_type VARCHAR(20) CHECK (ssw_type IN ('SSW1', 'SSW2', 'JFT-Basic', NULL)),
ADD COLUMN IF NOT EXISTS target_sector VARCHAR(100),
ADD COLUMN IF NOT EXISTS workplace_focus BOOLEAN DEFAULT false;

-- Add SSW columns to textbook_chapters
ALTER TABLE public.textbook_chapters
ADD COLUMN IF NOT EXISTS ssw_relevant BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS workplace_scenarios JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS sector_vocabulary JSONB DEFAULT '[]';

-- Create SSW content master table
CREATE TABLE IF NOT EXISTS public.ssw_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ssw_type VARCHAR(20) NOT NULL CHECK (ssw_type IN ('SSW1', 'SSW2', 'JFT-Basic')),
  sector VARCHAR(100) NOT NULL,
  content_category VARCHAR(50) NOT NULL,
  title VARCHAR(500) NOT NULL,
  content JSONB NOT NULL,
  jlpt_equivalent VARCHAR(10),
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  practical_usage TEXT,
  workplace_context TEXT,
  safety_critical BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sector-specific vocabulary table
CREATE TABLE IF NOT EXISTS public.ssw_sector_vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector VARCHAR(100) NOT NULL,
  word VARCHAR(200) NOT NULL,
  reading VARCHAR(200) NOT NULL,
  romaji VARCHAR(200),
  meaning TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  usage_context TEXT,
  formality_level VARCHAR(20),
  frequency_rank INTEGER,
  is_critical BOOLEAN DEFAULT false,
  example_sentences JSONB DEFAULT '[]',
  related_terms JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workplace scenarios table
CREATE TABLE IF NOT EXISTS public.workplace_scenarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sector VARCHAR(100) NOT NULL,
  scenario_type VARCHAR(100) NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  dialogue JSONB NOT NULL,
  vocabulary_focus VARCHAR(500)[],
  grammar_focus VARCHAR(500)[],
  cultural_notes TEXT,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create JFT-Basic test content table
CREATE TABLE IF NOT EXISTS public.jft_basic_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(50) NOT NULL CHECK (section IN ('script_vocabulary', 'conversation_expression', 'listening', 'reading')),
  question_type VARCHAR(50) NOT NULL,
  content JSONB NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
  time_allocation INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_textbooks_ssw_type ON public.textbooks(ssw_type) WHERE ssw_type IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_textbooks_sector ON public.textbooks(target_sector) WHERE target_sector IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_ssw_content_type_sector ON public.ssw_content(ssw_type, sector);
CREATE INDEX IF NOT EXISTS idx_ssw_vocab_sector ON public.ssw_sector_vocabulary(sector);
CREATE INDEX IF NOT EXISTS idx_ssw_vocab_critical ON public.ssw_sector_vocabulary(is_critical) WHERE is_critical = true;
CREATE INDEX IF NOT EXISTS idx_workplace_scenarios_sector ON public.workplace_scenarios(sector);
CREATE INDEX IF NOT EXISTS idx_jft_content_section ON public.jft_basic_content(section);

-- Add comments for documentation
COMMENT ON TABLE public.ssw_content IS 'Master table for Specified Skilled Worker (SSW) learning content covering 14 designated sectors';
COMMENT ON TABLE public.ssw_sector_vocabulary IS 'Industry-specific vocabulary for 14 designated sectors with safety-critical terms flagged';
COMMENT ON TABLE public.workplace_scenarios IS 'Real-world workplace communication scenarios specific to each sector';
COMMENT ON TABLE public.jft_basic_content IS 'JFT-Basic (Japan Foundation Test for Basic Japanese) test format questions';

COMMENT ON COLUMN public.textbooks.ssw_type IS 'SSW1 (N4 equivalent), SSW2 (N3 equivalent), or JFT-Basic test preparation';
COMMENT ON COLUMN public.textbooks.target_sector IS 'One of 14 designated sectors: caregiving, construction, agriculture, food service, etc.';
COMMENT ON COLUMN public.textbooks.workplace_focus IS 'Whether this textbook focuses on workplace communication';
COMMENT ON COLUMN public.textbook_chapters.ssw_relevant IS 'Whether this chapter contains SSW-specific content';
COMMENT ON COLUMN public.textbook_chapters.workplace_scenarios IS 'Array of workplace scenario objects for practical learning';
COMMENT ON COLUMN public.textbook_chapters.sector_vocabulary IS 'Sector-specific vocabulary items used in this chapter';
COMMENT ON COLUMN public.ssw_sector_vocabulary.is_critical IS 'Safety-critical or legally required terminology';

-- Insert sample data for testing (optional - can be removed in production)
INSERT INTO public.ssw_sector_vocabulary (sector, word, reading, romaji, meaning, english_translation, is_critical, example_sentences)
VALUES
  ('caregiving', '利用者', 'りようしゃ', 'riyousha', '介護サービスを利用する人', 'care service user', true, '[{"japanese":"利用者様のお名前を確認してください。","english":"Please confirm the care user''s name.","context":"Daily care routine"}]'),
  ('caregiving', '服薬', 'ふくやく', 'fukuyaku', '薬を飲むこと', 'taking medication', true, '[{"japanese":"服薬の時間になりました。","english":"It''s time for medication.","context":"Medication administration"}]'),
  ('construction', '安全帯', 'あんぜんたい', 'anzentai', '高所作業時に使用する安全器具', 'safety harness', true, '[{"japanese":"必ず安全帯を着用してください。","english":"Please be sure to wear your safety harness.","context":"Safety briefing"}]'),
  ('construction', '現場', 'げんば', 'genba', '工事が行われる場所', 'construction site', false, '[{"japanese":"現場に到着しました。","english":"We have arrived at the site.","context":"Daily work"}]')
ON CONFLICT DO NOTHING;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_ssw_content_updated_at BEFORE UPDATE ON public.ssw_content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ssw_vocab_updated_at BEFORE UPDATE ON public.ssw_sector_vocabulary
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ SSW Support Migration Completed Successfully!';
  RAISE NOTICE '   - Added SSW columns to textbooks and chapters tables';
  RAISE NOTICE '   - Created ssw_content table';
  RAISE NOTICE '   - Created ssw_sector_vocabulary table with sample data';
  RAISE NOTICE '   - Created workplace_scenarios table';
  RAISE NOTICE '   - Created jft_basic_content table';
  RAISE NOTICE '   - Created indexes for optimal query performance';
  RAISE NOTICE '   - SSW Types supported: SSW1 (N4), SSW2 (N3), JFT-Basic';
  RAISE NOTICE '   - 14 sectors ready for content generation';
END $$;
