import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { getStrokeOrderData } from '@/lib/kanji/stroke-order-service'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(_req: NextRequest, { params }: { params: Promise<{ kanji: string }> }) {
  try {
    const { kanji: kanjiParam } = await params
    const kanji = decodeURIComponent(kanjiParam)

    console.log(`📝 Fetching stroke order for: ${kanji}`)

    // Validation
    if (!kanji || kanji.length !== 1) {
      return NextResponse.json({ error: 'Invalid kanji character' }, { status: 400 })
    }

    // Try to get from database first
    const { data: strokeOrder, error } = await supabase
      .from('kanji_stroke_order')
      .select('*')
      .eq('kanji', kanji)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    if (strokeOrder) {
      console.log(`✅ Found stroke order data for ${kanji}`)
      return NextResponse.json({
        kanji: strokeOrder.kanji,
        strokeCount: strokeOrder.stroke_count,
        strokes: strokeOrder.stroke_data,
        radical: strokeOrder.radical,
        radicalPosition: strokeOrder.radical_position,
        radicalMeaning: strokeOrder.radical_meaning,
        animationUrl: strokeOrder.animation_url,
        animationSvg: strokeOrder.animation_svg,
        videoUrl: strokeOrder.video_url,
        writingTips: strokeOrder.writing_tips,
        commonMistakes: strokeOrder.common_mistakes,
        similarKanji: strokeOrder.similar_kanji,
        difficultyRating: strokeOrder.difficulty_rating,
        jlptLevel: strokeOrder.jlpt_level,
        joyoGrade: strokeOrder.joyo_grade,
      })
    }

    // If not in database, try to generate from external source
    console.log(`⏳ Generating stroke order for ${kanji}...`)
    const generatedData = await getStrokeOrderData(kanji)

    if (!generatedData) {
      return NextResponse.json({ error: 'Kanji not found', kanji: kanji }, { status: 404 })
    }

    // Save to database for future use
    const { error: insertError } = await supabase.from('kanji_stroke_order').insert({
      kanji: kanji,
      stroke_count: generatedData.strokeCount,
      stroke_data: generatedData.strokes,
      radical: generatedData.radical,
      radical_position: generatedData.radicalPosition,
      writing_tips: generatedData.writingTips || [],
      common_mistakes: generatedData.commonMistakes || [],
      difficulty_rating: generatedData.difficultyRating || 3,
    })

    if (insertError) {
      console.error('Failed to cache stroke order:', insertError)
    }

    return NextResponse.json(generatedData)
  } catch (error) {
    console.error('❌ Stroke order API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
