import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { generateSSWContent } from '@/lib/ai/ssw-content-generator'
import { analytics } from '@/lib/analytics/posthog'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

interface SSWGenerationRequest {
  title: string
  sswType: 'SSW1' | 'SSW2' | 'JFT-Basic'
  targetSector: string
  numberOfChapters: number
  focusAreas?: string[]
  includeWorkplaceScenarios: boolean
  includeSafetyVocabulary: boolean
  includeAudio: boolean
  userId?: string
}

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const body: SSWGenerationRequest = await req.json()

    console.log('📚 SSW Textbook Generation Request:')
    console.log(`   Type: ${body.sswType}`)
    console.log(`   Sector: ${body.targetSector}`)
    console.log(`   Chapters: ${body.numberOfChapters}`)

    // Validation
    if (!body.title || !body.sswType || !body.targetSector) {
      return NextResponse.json(
        { error: 'Missing required fields: title, sswType, targetSector' },
        { status: 400 }
      )
    }

    if (!['SSW1', 'SSW2', 'JFT-Basic'].includes(body.sswType)) {
      return NextResponse.json(
        { error: 'Invalid SSW type. Must be SSW1, SSW2, or JFT-Basic' },
        { status: 400 }
      )
    }

    if (body.numberOfChapters < 1 || body.numberOfChapters > 50) {
      return NextResponse.json(
        { error: 'Number of chapters must be between 1 and 50' },
        { status: 400 }
      )
    }

    // Create textbook record
    const { data: textbook, error: textbookError } = await supabase
      .from('textbooks')
      .insert({
        user_id: body.userId || null,
        title: body.title,
        ssw_type: body.sswType,
        target_sector: body.targetSector,
        workplace_focus: true,
        jlpt_level: body.sswType === 'SSW1' ? 'N4' : body.sswType === 'SSW2' ? 'N3' : 'N4',
        total_chapters: body.numberOfChapters,
        generation_status: 'generating',
        is_public: false,
        is_published: false,
        generated_by: 'NVIDIA stockmark-2-100b-instruct',
        generation_params: {
          sswType: body.sswType,
          targetSector: body.targetSector,
          focusAreas: body.focusAreas || [],
          includeWorkplaceScenarios: body.includeWorkplaceScenarios,
          includeSafetyVocabulary: body.includeSafetyVocabulary,
          includeAudio: body.includeAudio,
        },
      })
      .select()
      .single()

    if (textbookError) {
      console.error('❌ Failed to create textbook:', textbookError)
      return NextResponse.json(
        { error: 'Failed to create textbook', details: textbookError.message },
        { status: 500 }
      )
    }

    console.log(`✅ Textbook created with ID: ${textbook.id}`)

    // Generate chapters
    const chapters = []
    let estimatedTotalHours = 0

    for (let i = 0; i < body.numberOfChapters; i++) {
      const chapterNumber = i + 1
      console.log(`\n⏳ Generating Chapter ${chapterNumber}/${body.numberOfChapters}...`)

      try {
        const chapterContent = await generateSSWContent({
          sswType: body.sswType,
          sector: body.targetSector,
          chapterNumber: chapterNumber,
          focusAreas: body.focusAreas || [],
          includeWorkplaceScenarios: body.includeWorkplaceScenarios,
          includeSafetyVocabulary: body.includeSafetyVocabulary,
        })

        if (!chapterContent) {
          throw new Error('Failed to generate chapter content')
        }

        // Save chapter to database
        const { data: savedChapter, error: chapterError } = await supabase
          .from('textbook_chapters')
          .insert({
            textbook_id: textbook.id,
            chapter_number: chapterNumber,
            title: chapterContent.title || `Chapter ${chapterNumber}`,
            introduction: chapterContent.introduction || '',
            content: chapterContent,
            ssw_relevant: true,
            workplace_scenarios: chapterContent.workplaceScenarios || [],
            sector_vocabulary: chapterContent.sectorVocabulary || [],
            sections: chapterContent.sections || [],
            vocabulary: chapterContent.vocabulary || [],
            grammar_points: chapterContent.grammarPoints || [],
            exercises: chapterContent.exercises || [],
            includes_exercises: true,
            includes_cultural_notes: true,
            estimated_time_minutes: 60,
            generated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (chapterError) {
          console.error(`❌ Failed to save chapter ${chapterNumber}:`, chapterError)
          throw new Error(`Failed to save chapter: ${chapterError.message}`)
        }

        chapters.push(savedChapter)
        estimatedTotalHours += 1

        console.log(`✅ Chapter ${chapterNumber} completed`)

        // Generate audio if requested
        if (body.includeAudio && savedChapter) {
          console.log(`   🔊 Queuing audio generation...`)
          // Queue audio generation (implement later)
          await queueAudioGeneration(savedChapter.id, chapterContent)
        }
      } catch (error) {
        console.error(`❌ Error generating chapter ${chapterNumber}:`, error)

        // Update textbook with error
        await supabase
          .from('textbooks')
          .update({
            generation_status: 'error',
            generation_params: {
              ...textbook.generation_params,
              error: error instanceof Error ? error.message : 'Unknown error',
              failedAtChapter: chapterNumber,
            },
          })
          .eq('id', textbook.id)

        return NextResponse.json(
          {
            error: `Failed to generate chapter ${chapterNumber}`,
            details: error instanceof Error ? error.message : 'Unknown error',
            textbookId: textbook.id,
            completedChapters: chapters.length,
          },
          { status: 500 }
        )
      }
    }

    // Update textbook with completion status
    const { error: updateError } = await supabase
      .from('textbooks')
      .update({
        generation_status: 'completed',
        is_published: true,
        estimated_completion_hours: Math.ceil(estimatedTotalHours),
        updated_at: new Date().toISOString(),
      })
      .eq('id', textbook.id)

    if (updateError) {
      console.error('Failed to update textbook:', updateError)
    }

    console.log(`\n✅ SSW Textbook "${body.title}" generation complete!`)
    console.log(`   Total chapters: ${chapters.length}`)
    console.log(`   Estimated time: ${Math.ceil(estimatedTotalHours)}h`)

    // Track successful generation
    const duration = Date.now() - startTime
    analytics.textbookGenerated(body.targetSector, body.sswType, duration)

    return NextResponse.json({
      success: true,
      textbook: {
        id: textbook.id,
        title: body.title,
        sswType: body.sswType,
        targetSector: body.targetSector,
        totalChapters: chapters.length,
        estimatedHours: Math.ceil(estimatedTotalHours),
      },
      chapters: chapters.map((c) => ({
        id: c.id,
        number: c.chapter_number,
        title: c.title,
      })),
    })
  } catch (error) {
    console.error('❌ SSW textbook generation error:', error)

    // Track error
    analytics.error(error as Error, {
      route: 'generate-ssw',
      duration: Date.now() - startTime,
    })

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// GET endpoint to check generation status
export async function GET(req: NextRequest) {
  const textbookId = req.nextUrl.searchParams.get('id')

  if (!textbookId) {
    return NextResponse.json({ error: 'Textbook ID required' }, { status: 400 })
  }

  try {
    const { data: textbook, error } = await supabase
      .from('textbooks')
      .select(
        `
        *,
        textbook_chapters (
          id,
          chapter_number,
          title,
          ssw_relevant,
          workplace_scenarios,
          estimated_time_minutes
        )
      `
      )
      .eq('id', textbookId)
      .single()

    if (error) {
      return NextResponse.json({ error: 'Textbook not found' }, { status: 404 })
    }

    return NextResponse.json({
      id: textbook.id,
      title: textbook.title,
      sswType: textbook.ssw_type,
      targetSector: textbook.target_sector,
      status: textbook.generation_status,
      totalChapters: textbook.total_chapters,
      completedChapters: textbook.textbook_chapters?.length || 0,
      chapters: textbook.textbook_chapters || [],
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Helper function to queue audio generation
async function queueAudioGeneration(_chapterId: string, content: any) {
  try {
    // Extract key phrases for audio generation
    const textsToGenerate: string[] = []

    // Add vocabulary items
    if (content.vocabulary) {
      content.vocabulary.forEach((item: any) => {
        if (item.word) textsToGenerate.push(item.word)
      })
    }

    // Add example sentences
    if (content.examples) {
      content.examples.forEach((example: any) => {
        if (example.japanese) textsToGenerate.push(example.japanese)
      })
    }

    // Queue TTS jobs
    for (const text of textsToGenerate.slice(0, 20)) {
      // Limit to first 20 items
      await supabase.from('tts_jobs').insert({
        text: text,
        speaker: 'female',
        speed: 'normal',
        priority: 5,
        status: 'pending',
      })
    }

    console.log(`   ✅ Queued ${Math.min(textsToGenerate.length, 20)} audio items`)
  } catch (error) {
    console.error('   ⚠️  Failed to queue audio generation:', error)
  }
}
