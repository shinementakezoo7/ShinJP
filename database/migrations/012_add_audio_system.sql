-- =====================================================
-- Audio System Migration
-- Adds complete audio support with TTS, multiple speakers/speeds
-- Version: 1.0.0
-- Date: 2025-01-XX
-- =====================================================

-- Create audio files master table
CREATE TABLE IF NOT EXISTS public.audio_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id UUID NOT NULL,
  content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('word', 'sentence', 'dialogue', 'paragraph', 'exercise', 'chapter')),
  japanese_text TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  speaker VARCHAR(20) NOT NULL CHECK (speaker IN ('male', 'female', 'child', 'elderly')),
  speed VARCHAR(20) NOT NULL CHECK (speed IN ('slow', 'normal', 'fast')),
  dialect VARCHAR(50) DEFAULT 'standard',
  duration_seconds DECIMAL(10, 2),
  file_size_kb INTEGER,
  format VARCHAR(10) DEFAULT 'mp3',
  quality VARCHAR(20) DEFAULT 'high' CHECK (quality IN ('low', 'medium', 'high', 'premium')),
  provider VARCHAR(50) DEFAULT 'azure',
  provider_voice_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create pronunciation guide table
CREATE TABLE IF NOT EXISTS public.pronunciation_guides (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  word VARCHAR(200) NOT NULL UNIQUE,
  ipa_notation TEXT,
  pitch_accent VARCHAR(50),
  accent_type VARCHAR(20) CHECK (accent_type IN ('heiban', 'atamadaka', 'nakadaka', 'odaka')),
  accent_position INTEGER,
  audio_url TEXT,
  visual_diagram_url TEXT,
  common_mistakes JSONB DEFAULT '[]',
  regional_variations JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create text-to-speech job queue
CREATE TABLE IF NOT EXISTS public.tts_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  text TEXT NOT NULL,
  speaker VARCHAR(20) NOT NULL,
  speed VARCHAR(20) NOT NULL,
  dialect VARCHAR(50) DEFAULT 'standard',
  provider VARCHAR(50) DEFAULT 'azure',
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  output_url TEXT,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  priority INTEGER DEFAULT 5 CHECK (priority BETWEEN 1 AND 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create audio usage analytics table
CREATE TABLE IF NOT EXISTS public.audio_usage_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  audio_file_id UUID REFERENCES public.audio_files(id) ON DELETE CASCADE,
  user_id UUID,
  play_count INTEGER DEFAULT 1,
  total_listen_duration_seconds INTEGER,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_audio_content ON public.audio_files(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_audio_speaker_speed ON public.audio_files(speaker, speed);
CREATE INDEX IF NOT EXISTS idx_audio_text_hash ON public.audio_files(md5(japanese_text));
CREATE INDEX IF NOT EXISTS idx_pronunciation_word ON public.pronunciation_guides(word);
CREATE INDEX IF NOT EXISTS idx_tts_status ON public.tts_jobs(status) WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_tts_priority ON public.tts_jobs(priority DESC, created_at ASC) WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_audio_analytics_audio ON public.audio_usage_analytics(audio_file_id);
CREATE INDEX IF NOT EXISTS idx_audio_analytics_user ON public.audio_usage_analytics(user_id) WHERE user_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE public.audio_files IS 'Master audio files table with TTS-generated pronunciation for all content';
COMMENT ON TABLE public.pronunciation_guides IS 'Detailed pronunciation information including pitch accent and IPA notation';
COMMENT ON TABLE public.tts_jobs IS 'Text-to-speech job queue for async audio generation';
COMMENT ON TABLE public.audio_usage_analytics IS 'Track audio playback for analytics and recommendations';

COMMENT ON COLUMN public.audio_files.content_id IS 'UUID of the content (word, sentence, etc.) this audio belongs to';
COMMENT ON COLUMN public.audio_files.speaker IS 'Voice type: male, female, child, elderly for different learning contexts';
COMMENT ON COLUMN public.audio_files.speed IS 'Playback speed: slow (learners), normal (standard), fast (advanced)';
COMMENT ON COLUMN public.audio_files.dialect IS 'Regional dialect: standard (Tokyo), kansai, kyushu, tohoku, etc.';
COMMENT ON COLUMN public.pronunciation_guides.accent_type IS 'Japanese pitch accent pattern type';
COMMENT ON COLUMN public.tts_jobs.priority IS 'Job priority 1-10, higher = more urgent (10 = immediate, 1 = low)';

-- Create function to find or create audio file
CREATE OR REPLACE FUNCTION get_or_create_audio(
  p_text TEXT,
  p_speaker VARCHAR(20) DEFAULT 'female',
  p_speed VARCHAR(20) DEFAULT 'normal',
  p_dialect VARCHAR(50) DEFAULT 'standard'
)
RETURNS UUID AS $$
DECLARE
  v_audio_id UUID;
BEGIN
  -- Try to find existing audio
  SELECT id INTO v_audio_id
  FROM public.audio_files
  WHERE japanese_text = p_text
    AND speaker = p_speaker
    AND speed = p_speed
    AND dialect = p_dialect
  LIMIT 1;

  -- If not found, create TTS job
  IF v_audio_id IS NULL THEN
    INSERT INTO public.tts_jobs (text, speaker, speed, dialect, priority)
    VALUES (p_text, p_speaker, p_speed, p_dialect, 7)
    RETURNING id INTO v_audio_id;
  END IF;

  RETURN v_audio_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to update audio analytics
CREATE OR REPLACE FUNCTION record_audio_play(
  p_audio_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_duration_seconds INTEGER DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.audio_usage_analytics (
    audio_file_id,
    user_id,
    play_count,
    total_listen_duration_seconds
  )
  VALUES (
    p_audio_id,
    p_user_id,
    1,
    COALESCE(p_duration_seconds, 0)
  )
  ON CONFLICT (audio_file_id, user_id)
  DO UPDATE SET
    play_count = audio_usage_analytics.play_count + 1,
    total_listen_duration_seconds = audio_usage_analytics.total_listen_duration_seconds + COALESCE(p_duration_seconds, 0),
    last_played_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_audio_files_updated_at BEFORE UPDATE ON public.audio_files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pronunciation_updated_at BEFORE UPDATE ON public.pronunciation_guides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample pronunciation guides for common words
INSERT INTO public.pronunciation_guides (word, ipa_notation, pitch_accent, accent_type, accent_position, common_mistakes)
VALUES
  ('こんにちは', 'konnitɕiwa', 'LHHHL', 'nakadaka', 3, '[{"mistake":"Flat pronunciation","correction":"Raise pitch on ni-chi, drop on wa","explanation":"The pitch rises in the middle and falls at the end"}]'),
  ('ありがとう', 'aɾiɡatoː', 'LHHHL', 'nakadaka', 3, '[{"mistake":"English-like stress","correction":"Even rhythm with pitch pattern","explanation":"Japanese uses pitch accent, not stress accent"}]'),
  ('すみません', 'sumimasen', 'LHHHL', 'nakadaka', 2, '[{"mistake":"Saying ''su-mi-ma-se-n''","correction":"Natural ''su-mi-ma-sen''","explanation":"Final n should be a nasal sound, not a separate syllable"}]')
ON CONFLICT (word) DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Audio System Migration Completed Successfully!';
  RAISE NOTICE '   - Created audio_files table for TTS-generated audio';
  RAISE NOTICE '   - Created pronunciation_guides table with pitch accent data';
  RAISE NOTICE '   - Created tts_jobs queue for async audio generation';
  RAISE NOTICE '   - Created audio_usage_analytics for tracking playback';
  RAISE NOTICE '   - Created helper functions for audio management';
  RAISE NOTICE '   - Supports multiple speakers: male, female, child, elderly';
  RAISE NOTICE '   - Supports multiple speeds: slow, normal, fast';
  RAISE NOTICE '   - Supports regional dialects: standard, kansai, kyushu, etc.';
  RAISE NOTICE '   - Ready for Azure/Google Cloud TTS integration';
END $$;
