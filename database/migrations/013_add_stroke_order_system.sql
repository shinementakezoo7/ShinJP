-- =====================================================
-- Stroke Order System Migration
-- Complete kanji stroke order with animations and practice tracking
-- Version: 1.0.0
-- Date: 2025-01-XX
-- =====================================================

-- Create kanji stroke order master table
CREATE TABLE IF NOT EXISTS public.kanji_stroke_order (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kanji VARCHAR(10) NOT NULL UNIQUE,
  stroke_count INTEGER NOT NULL CHECK (stroke_count > 0),
  stroke_data JSONB NOT NULL,
  radical VARCHAR(50),
  radical_position VARCHAR(20) CHECK (radical_position IN ('left', 'right', 'top', 'bottom', 'enclosure', 'center', 'other')),
  radical_meaning TEXT,
  animation_url TEXT,
  animation_svg TEXT,
  video_url TEXT,
  writing_tips TEXT[],
  common_mistakes JSONB DEFAULT '[]',
  similar_kanji VARCHAR(200)[],
  difficulty_rating INTEGER CHECK (difficulty_rating BETWEEN 1 AND 5),
  jlpt_level VARCHAR(10),
  joyo_grade INTEGER,
  frequency_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stroke components table (for building custom animations)
CREATE TABLE IF NOT EXISTS public.stroke_components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kanji VARCHAR(10) NOT NULL,
  stroke_number INTEGER NOT NULL CHECK (stroke_number > 0),
  stroke_type VARCHAR(50) NOT NULL CHECK (stroke_type IN ('horizontal', 'vertical', 'diagonal_down_right', 'diagonal_down_left', 'curve', 'hook', 'dot', 'complex')),
  svg_path TEXT NOT NULL,
  direction VARCHAR(50),
  start_point JSONB NOT NULL,
  end_point JSONB NOT NULL,
  control_points JSONB,
  duration_ms INTEGER DEFAULT 500,
  description TEXT,
  stroke_length INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(kanji, stroke_number)
);

-- Create handwriting practice records
CREATE TABLE IF NOT EXISTS public.handwriting_practice (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  kanji VARCHAR(10) NOT NULL,
  practice_data JSONB NOT NULL,
  accuracy_score DECIMAL(5, 2) CHECK (accuracy_score BETWEEN 0 AND 100),
  stroke_order_correct BOOLEAN,
  stroke_accuracy JSONB,
  time_taken_seconds INTEGER,
  feedback JSONB,
  practice_mode VARCHAR(50) CHECK (practice_mode IN ('guided', 'free', 'timed', 'test')),
  device_type VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create handwriting analytics summary
CREATE TABLE IF NOT EXISTS public.handwriting_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  kanji VARCHAR(10) NOT NULL,
  total_practices INTEGER DEFAULT 0,
  average_accuracy DECIMAL(5, 2),
  best_accuracy DECIMAL(5, 2),
  stroke_order_success_rate DECIMAL(5, 2),
  average_time_seconds INTEGER,
  improvement_trend JSONB,
  weak_strokes INTEGER[],
  last_practiced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, kanji)
);

-- Create kanji mnemonics table
CREATE TABLE IF NOT EXISTS public.kanji_mnemonics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kanji VARCHAR(10) NOT NULL,
  mnemonic_type VARCHAR(50) CHECK (mnemonic_type IN ('visual', 'story', 'etymology', 'phonetic', 'user_created')),
  mnemonic_text TEXT NOT NULL,
  mnemonic_image_url TEXT,
  effectiveness_rating DECIMAL(3, 2) CHECK (effectiveness_rating BETWEEN 0 AND 5),
  rating_count INTEGER DEFAULT 0,
  created_by_user_id UUID,
  is_official BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_stroke_order_kanji ON public.kanji_stroke_order(kanji);
CREATE INDEX IF NOT EXISTS idx_stroke_order_jlpt ON public.kanji_stroke_order(jlpt_level) WHERE jlpt_level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stroke_order_grade ON public.kanji_stroke_order(joyo_grade) WHERE joyo_grade IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_stroke_order_difficulty ON public.kanji_stroke_order(difficulty_rating);
CREATE INDEX IF NOT EXISTS idx_stroke_components_kanji ON public.stroke_components(kanji);
CREATE INDEX IF NOT EXISTS idx_stroke_components_kanji_stroke ON public.stroke_components(kanji, stroke_number);
CREATE INDEX IF NOT EXISTS idx_handwriting_user_kanji ON public.handwriting_practice(user_id, kanji);
CREATE INDEX IF NOT EXISTS idx_handwriting_user_date ON public.handwriting_practice(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_handwriting_analytics_user ON public.handwriting_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_kanji_mnemonics_kanji ON public.kanji_mnemonics(kanji);
CREATE INDEX IF NOT EXISTS idx_kanji_mnemonics_type ON public.kanji_mnemonics(mnemonic_type);
CREATE INDEX IF NOT EXISTS idx_kanji_mnemonics_official ON public.kanji_mnemonics(is_official) WHERE is_official = true;

-- Add comments for documentation
COMMENT ON TABLE public.kanji_stroke_order IS 'Complete stroke order data for all kanji with animations and writing guides';
COMMENT ON TABLE public.stroke_components IS 'Individual stroke components for each kanji enabling custom animation generation';
COMMENT ON TABLE public.handwriting_practice IS 'User handwriting practice sessions with accuracy scoring';
COMMENT ON TABLE public.handwriting_analytics IS 'Aggregated analytics for each user-kanji combination';
COMMENT ON TABLE public.kanji_mnemonics IS 'Memory aids and mnemonics for learning kanji';

COMMENT ON COLUMN public.kanji_stroke_order.stroke_data IS 'JSONB array of stroke objects with SVG paths, directions, and metadata';
COMMENT ON COLUMN public.kanji_stroke_order.animation_svg IS 'Complete SVG with embedded animations';
COMMENT ON COLUMN public.stroke_components.stroke_type IS 'Fundamental stroke type for pattern recognition';
COMMENT ON COLUMN public.handwriting_practice.accuracy_score IS 'Overall accuracy percentage (0-100)';
COMMENT ON COLUMN public.handwriting_analytics.weak_strokes IS 'Array of stroke numbers that need improvement';

-- Create function to record handwriting practice
CREATE OR REPLACE FUNCTION record_handwriting_practice(
  p_user_id UUID,
  p_kanji VARCHAR(10),
  p_practice_data JSONB,
  p_accuracy_score DECIMAL(5,2),
  p_stroke_order_correct BOOLEAN,
  p_time_taken INTEGER
)
RETURNS UUID AS $$
DECLARE
  v_practice_id UUID;
BEGIN
  -- Insert practice record
  INSERT INTO public.handwriting_practice (
    user_id,
    kanji,
    practice_data,
    accuracy_score,
    stroke_order_correct,
    time_taken_seconds
  )
  VALUES (
    p_user_id,
    p_kanji,
    p_practice_data,
    p_accuracy_score,
    p_stroke_order_correct,
    p_time_taken
  )
  RETURNING id INTO v_practice_id;

  -- Update analytics
  INSERT INTO public.handwriting_analytics (
    user_id,
    kanji,
    total_practices,
    average_accuracy,
    best_accuracy,
    stroke_order_success_rate,
    average_time_seconds,
    last_practiced_at
  )
  VALUES (
    p_user_id,
    p_kanji,
    1,
    p_accuracy_score,
    p_accuracy_score,
    CASE WHEN p_stroke_order_correct THEN 100 ELSE 0 END,
    p_time_taken,
    NOW()
  )
  ON CONFLICT (user_id, kanji)
  DO UPDATE SET
    total_practices = handwriting_analytics.total_practices + 1,
    average_accuracy = (handwriting_analytics.average_accuracy * handwriting_analytics.total_practices + p_accuracy_score) / (handwriting_analytics.total_practices + 1),
    best_accuracy = GREATEST(handwriting_analytics.best_accuracy, p_accuracy_score),
    stroke_order_success_rate = (
      handwriting_analytics.stroke_order_success_rate * handwriting_analytics.total_practices + 
      CASE WHEN p_stroke_order_correct THEN 100 ELSE 0 END
    ) / (handwriting_analytics.total_practices + 1),
    average_time_seconds = (handwriting_analytics.average_time_seconds * handwriting_analytics.total_practices + p_time_taken) / (handwriting_analytics.total_practices + 1),
    last_practiced_at = NOW(),
    updated_at = NOW();

  RETURN v_practice_id;
END;
$$ LANGUAGE plpgsql;

-- Create function to get kanji learning recommendations
CREATE OR REPLACE FUNCTION get_kanji_practice_recommendations(
  p_user_id UUID,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  kanji VARCHAR(10),
  reason TEXT,
  priority INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH user_kanji AS (
    SELECT 
      ha.kanji,
      ha.average_accuracy,
      ha.total_practices,
      ha.last_practiced_at,
      kso.difficulty_rating,
      kso.jlpt_level
    FROM public.handwriting_analytics ha
    JOIN public.kanji_stroke_order kso ON kso.kanji = ha.kanji
    WHERE ha.user_id = p_user_id
  )
  SELECT
    uk.kanji,
    CASE
      WHEN uk.average_accuracy < 70 THEN 'Low accuracy - needs more practice'
      WHEN uk.last_practiced_at < NOW() - INTERVAL '7 days' THEN 'Not practiced recently - review needed'
      WHEN uk.total_practices < 5 THEN 'New kanji - build confidence'
      ELSE 'Regular review'
    END AS reason,
    CASE
      WHEN uk.average_accuracy < 70 THEN 10
      WHEN uk.last_practiced_at < NOW() - INTERVAL '7 days' THEN 8
      WHEN uk.total_practices < 5 THEN 7
      ELSE 5
    END AS priority
  FROM user_kanji uk
  ORDER BY priority DESC, uk.last_practiced_at ASC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_stroke_order_updated_at BEFORE UPDATE ON public.kanji_stroke_order
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_handwriting_analytics_updated_at BEFORE UPDATE ON public.handwriting_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kanji_mnemonics_updated_at BEFORE UPDATE ON public.kanji_mnemonics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample stroke order data for common kanji
INSERT INTO public.kanji_stroke_order (
  kanji, 
  stroke_count, 
  stroke_data, 
  radical, 
  radical_position, 
  writing_tips,
  common_mistakes,
  difficulty_rating,
  jlpt_level,
  joyo_grade
)
VALUES
  (
    '日', 
    4, 
    '[
      {"order":1,"type":"vertical","svg_path":"M20,10 L20,90","direction":"top_to_bottom","description":"Left vertical stroke"},
      {"order":2,"type":"horizontal","svg_path":"M20,10 L80,10","direction":"left_to_right","description":"Top horizontal stroke"},
      {"order":3,"type":"horizontal","svg_path":"M20,90 L80,90","direction":"left_to_right","description":"Bottom horizontal stroke"},
      {"order":4,"type":"vertical","svg_path":"M80,10 L80,90","direction":"top_to_bottom","description":"Right vertical stroke"}
    ]',
    '日',
    'other',
    ARRAY['Make it wider than tall', 'Horizontal strokes do not extend beyond vertical strokes', 'All strokes should be straight and clean'],
    '[
      {"mistake":"Making it square","correction":"Make it rectangular (wider than tall)","visual":"日 not 口"},
      {"mistake":"Extending horizontal strokes","correction":"Keep horizontals inside the verticals","visual":"Proper vs improper extension"}
    ]',
    1,
    'N5',
    1
  ),
  (
    '人',
    2,
    '[
      {"order":1,"type":"diagonal_down_right","svg_path":"M30,20 L50,80","direction":"down_right","description":"Left diagonal stroke (pie)"},
      {"order":2,"type":"diagonal_down_right","svg_path":"M50,40 L70,80","direction":"down_right","description":"Right diagonal stroke (na)"}
    ]',
    '人',
    'other',
    ARRAY['Left stroke starts higher and goes down more steeply', 'Right stroke is more gentle', 'Strokes meet at the bottom forming a triangle shape'],
    '[
      {"mistake":"Making strokes equal","correction":"Left stroke is steeper than right","visual":"Proper balance vs symmetrical"},
      {"mistake":"Starting both strokes at same height","correction":"Left stroke starts higher","visual":"Correct vs incorrect starting points"}
    ]',
    1,
    'N5',
    1
  )
ON CONFLICT (kanji) DO NOTHING;

-- Insert sample mnemonics
INSERT INTO public.kanji_mnemonics (kanji, mnemonic_type, mnemonic_text, is_official, effectiveness_rating, rating_count)
VALUES
  ('日', 'visual', 'Picture a window (口) with the SUN shining through it. The horizontal line in the middle represents the sun''s rays.', true, 4.5, 150),
  ('日', 'story', 'Every DAY, the sun rises. This kanji looks like a simplified sun (○) compressed into a rectangle.', true, 4.2, 120),
  ('人', 'visual', 'Two legs of a PERSON walking. The left leg is taking a step, and the right leg is following.', true, 4.7, 200),
  ('人', 'story', 'A stick figure PERSON supporting themselves with two legs spread apart for balance.', true, 4.3, 175)
ON CONFLICT DO NOTHING;

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Stroke Order System Migration Completed Successfully!';
  RAISE NOTICE '   - Created kanji_stroke_order table with animation data';
  RAISE NOTICE '   - Created stroke_components table for detailed stroke breakdown';
  RAISE NOTICE '   - Created handwriting_practice table for user practice tracking';
  RAISE NOTICE '   - Created handwriting_analytics table for progress analysis';
  RAISE NOTICE '   - Created kanji_mnemonics table for memory aids';
  RAISE NOTICE '   - Created helper functions for practice recording and recommendations';
  RAISE NOTICE '   - Inserted sample data for common kanji (日, 人)';
  RAISE NOTICE '   - Ready for 2,136 Jōyō kanji stroke order data';
  RAISE NOTICE '   - Supports SVG animations and video tutorials';
  RAISE NOTICE '   - Tracks user handwriting accuracy and improvement';
END $$;
