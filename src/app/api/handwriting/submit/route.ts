import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { analyzeHandwriting } from '@/lib/kanji/handwriting-analyzer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface HandwritingSubmission {
  userId: string
  kanji: string
  practiceData: {
    strokes: Array<{
      points: Array<{ x: number; y: number; timestamp: number }>
    }>
  }
  practiceMode?: 'guided' | 'free' | 'timed' | 'test'
  deviceType?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: HandwritingSubmission = await req.json()

    console.log(`✍️  Handwriting submission:`)
    console.log(`   User: ${body.userId}`)
    console.log(`   Kanji: ${body.kanji}`)
    console.log(`   Strokes: ${body.practiceData.strokes.length}`)

    // Validation
    if (!body.userId || !body.kanji || !body.practiceData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (body.kanji.length !== 1) {
      return NextResponse.json({ error: 'Invalid kanji character' }, { status: 400 })
    }

    // Get correct stroke order from database
    const { data: correctStrokeOrder } = await supabase
      .from('kanji_stroke_order')
      .select('stroke_count, stroke_data')
      .eq('kanji', body.kanji)
      .single()

    if (!correctStrokeOrder) {
      return NextResponse.json({ error: 'Kanji stroke order data not available' }, { status: 404 })
    }

    // Analyze handwriting
    console.log('🔍 Analyzing handwriting...')
    const analysis = await analyzeHandwriting({
      userStrokes: body.practiceData.strokes,
      correctStrokeOrder: correctStrokeOrder.stroke_data,
      expectedStrokeCount: correctStrokeOrder.stroke_count,
    })

    // Calculate time taken
    const firstStroke = body.practiceData.strokes[0]
    const lastStroke = body.practiceData.strokes[body.practiceData.strokes.length - 1]
    const timeTaken =
      lastStroke && firstStroke
        ? Math.round(
            (lastStroke.points[lastStroke.points.length - 1].timestamp -
              firstStroke.points[0].timestamp) /
              1000
          )
        : 0

    // Save to database using the helper function
    const { data: practice, error: practiceError } = await supabase.rpc(
      'record_handwriting_practice',
      {
        p_user_id: body.userId,
        p_kanji: body.kanji,
        p_practice_data: body.practiceData,
        p_accuracy_score: analysis.accuracyScore,
        p_stroke_order_correct: analysis.strokeOrderCorrect,
        p_time_taken: timeTaken,
      }
    )

    if (practiceError) {
      console.error('Failed to save practice:', practiceError)
      // Continue even if save fails
    }

    console.log(`✅ Analysis complete: ${analysis.accuracyScore}% accuracy`)

    return NextResponse.json({
      success: true,
      analysis: {
        accuracyScore: analysis.accuracyScore,
        strokeOrderCorrect: analysis.strokeOrderCorrect,
        strokeAccuracy: analysis.strokeAccuracy,
        feedback: analysis.feedback,
        timeTaken: timeTaken,
      },
      practiceId: practice?.id,
    })
  } catch (error) {
    console.error('❌ Handwriting submission error:', error)
    return NextResponse.json(
      {
        error: 'Failed to analyze handwriting',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve user's handwriting analytics
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId')
  const kanji = req.nextUrl.searchParams.get('kanji')

  if (!userId) {
    return NextResponse.json({ error: 'userId parameter is required' }, { status: 400 })
  }

  try {
    if (kanji) {
      // Get analytics for specific kanji
      const { data, error } = await supabase
        .from('handwriting_analytics')
        .select('*')
        .eq('user_id', userId)
        .eq('kanji', kanji)
        .single()

      if (error) {
        return NextResponse.json({ error: 'Analytics not found' }, { status: 404 })
      }

      return NextResponse.json(data)
    } else {
      // Get all analytics for user
      const { data, error } = await supabase
        .from('handwriting_analytics')
        .select('*')
        .eq('user_id', userId)
        .order('last_practiced_at', { ascending: false })

      if (error) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 })
      }

      return NextResponse.json({
        userId: userId,
        analytics: data || [],
        totalKanji: data?.length || 0,
      })
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
