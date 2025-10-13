import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { generateAudio } from '@/lib/audio/audio-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface AudioGenerationRequest {
  text: string
  speaker?: 'male' | 'female' | 'child' | 'elderly'
  speed?: 'slow' | 'normal' | 'fast'
  dialect?: string
  contentId?: string
  contentType?: 'word' | 'sentence' | 'dialogue' | 'paragraph' | 'exercise' | 'chapter'
}

export async function POST(req: NextRequest) {
  try {
    const body: AudioGenerationRequest = await req.json()

    console.log('🔊 Audio generation request:')
    console.log(`   Text: ${body.text.substring(0, 50)}${body.text.length > 50 ? '...' : ''}`)
    console.log(`   Speaker: ${body.speaker || 'female'}`)
    console.log(`   Speed: ${body.speed || 'normal'}`)

    // Validation
    if (!body.text || body.text.trim() === '') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (body.text.length > 1000) {
      return NextResponse.json({ error: 'Text is too long (max 1000 characters)' }, { status: 400 })
    }

    const speaker = body.speaker || 'female'
    const speed = body.speed || 'normal'
    const dialect = body.dialect || 'standard'

    // Check if audio already exists
    const { data: existingAudio } = await supabase
      .from('audio_files')
      .select('*')
      .eq('japanese_text', body.text)
      .eq('speaker', speaker)
      .eq('speed', speed)
      .eq('dialect', dialect)
      .single()

    if (existingAudio) {
      console.log('✅ Audio already exists, returning cached version')
      return NextResponse.json({
        success: true,
        audioUrl: existingAudio.audio_url,
        duration: existingAudio.duration_seconds,
        cached: true,
      })
    }

    // Generate new audio
    console.log('⏳ Generating new audio...')
    const audioFile = await generateAudio({
      text: body.text,
      speaker: speaker,
      speed: speed,
      dialect: dialect,
    })

    // Save to database
    const { data: savedAudio, error: saveError } = await supabase
      .from('audio_files')
      .insert({
        content_id: body.contentId || null,
        content_type: body.contentType || 'sentence',
        japanese_text: body.text,
        audio_url: audioFile.url,
        speaker: speaker,
        speed: speed,
        dialect: dialect,
        duration_seconds: audioFile.duration,
        file_size_kb: audioFile.sizeKB,
        format: 'mp3',
        quality: 'high',
        provider: audioFile.provider,
        provider_voice_id: audioFile.voiceId,
      })
      .select()
      .single()

    if (saveError) {
      console.error('⚠️  Failed to save audio to database:', saveError)
      // Still return the audio even if save failed
      return NextResponse.json({
        success: true,
        audioUrl: audioFile.url,
        duration: audioFile.duration,
        cached: false,
        warning: 'Audio generated but not saved to database',
      })
    }

    console.log('✅ Audio generated and saved')

    return NextResponse.json({
      success: true,
      audioId: savedAudio.id,
      audioUrl: audioFile.url,
      duration: audioFile.duration,
      cached: false,
    })
  } catch (error) {
    console.error('❌ Audio generation error:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate audio',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET(req: NextRequest) {
  const text = req.nextUrl.searchParams.get('text')
  const speaker = req.nextUrl.searchParams.get('speaker') || 'female'
  const speed = req.nextUrl.searchParams.get('speed') || 'normal'
  const dialect = req.nextUrl.searchParams.get('dialect') || 'standard'

  if (!text) {
    return NextResponse.json({ error: 'Text parameter is required' }, { status: 400 })
  }

  try {
    // Try to find existing audio
    const { data: audio, error } = await supabase
      .from('audio_files')
      .select('*')
      .eq('japanese_text', text)
      .eq('speaker', speaker)
      .eq('speed', speed)
      .eq('dialect', dialect)
      .single()

    if (error || !audio) {
      return NextResponse.json(
        {
          exists: false,
          message: 'Audio not found. Use POST to generate.',
        },
        { status: 404 }
      )
    }

    // Record play
    if (audio.id) {
      const { error: playError } = await supabase.rpc('record_audio_play', {
        p_audio_id: audio.id,
        p_user_id: null,
        p_duration_seconds: null,
      })
      if (playError) {
        console.error('Failed to record play:', playError)
      }
    }

    return NextResponse.json({
      exists: true,
      audioId: audio.id,
      audioUrl: audio.audio_url,
      duration: audio.duration_seconds,
      speaker: audio.speaker,
      speed: audio.speed,
    })
  } catch (error) {
    console.error('Error fetching audio:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
