import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { generateJLPTContent, type JLPTContentRequest } from '@/lib/ai/content-generator'
import type { JLPTLevel } from '@/lib/ai/jlpt-content-spec'

// Initialize Supabase client
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

interface TextbookGenerationRequest {
  title: string
  jlptLevel: number // 1-5 (N1-N5)
  contentType:
    | 'textbook_chapter'
    | 'grammar_lesson'
    | 'vocabulary_lesson'
    | 'kanji_lesson'
    | 'colloquial_lesson'
  topics: string[]
  numberOfChapters: number
  includeExercises: boolean
  includeCulturalNotes: boolean
  includeSlang: boolean
  includeMnemonics: boolean
  includeExamples: boolean
  specificContent?: {
    grammarPatterns?: string[]
    vocabularyIds?: string[]
    kanjiIds?: string[]
    slangIds?: string[]
  }
  interests?: string[]
  userId?: string
}

export async function POST(req: NextRequest) {
  try {
    // Ensure required environment variables are present to avoid HTML error pages
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        {
          error: 'Supabase is not configured',
          details:
            'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.',
        },
        { status: 503 }
      )
    }
    // Check if NVIDIA API is configured
    if (
      !process.env.NVIDIA_API_KEY &&
      !process.env.NVIDIA_API_KEY_1 &&
      !process.env.NVIDIA_API_KEY_2
    ) {
      console.error('❌ NVIDIA API keys not configured')
      return NextResponse.json(
        {
          error: 'NVIDIA API is not configured',
          details:
            'Please set NVIDIA_API_KEY, NVIDIA_API_KEY_1, or NVIDIA_API_KEY_2 in your environment variables.',
        },
        { status: 503 }
      )
    }

    const body: TextbookGenerationRequest = await req.json()

    // Set defaults for optional fields
    const contentType = body.contentType || 'textbook_chapter'
    const includeExercises = body.includeExercises !== false
    const includeCulturalNotes = body.includeCulturalNotes !== false
    const includeSlang = body.includeSlang || false
    const includeMnemonics = body.includeMnemonics !== false
    const includeExamples = body.includeExamples !== false

    // Validate request
    if (!body.title || !body.jlptLevel || !body.topics || !body.numberOfChapters) {
      return NextResponse.json(
        { error: 'Missing required fields: title, jlptLevel, topics, numberOfChapters' },
        { status: 400 }
      )
    }

    if (body.jlptLevel < 1 || body.jlptLevel > 5) {
      return NextResponse.json({ error: 'JLPT level must be between 1 and 5' }, { status: 400 })
    }

    if (body.numberOfChapters < 1 || body.numberOfChapters > 50) {
      return NextResponse.json(
        { error: 'Number of chapters must be between 1 and 50' },
        { status: 400 }
      )
    }

    // Validate topics array is not empty
    if (
      !Array.isArray(body.topics) ||
      body.topics.length === 0 ||
      body.topics.some((t) => !t || t.trim() === '')
    ) {
      return NextResponse.json(
        { error: 'Topics must be a non-empty array of strings' },
        { status: 400 }
      )
    }

    console.log(`📚 Starting textbook generation: "${body.title}"`)
    console.log(`   Level: N${body.jlptLevel}`)
    console.log(`   Content Type: ${contentType}`)
    console.log(`   Chapters: ${body.numberOfChapters}`)
    console.log(`   Topics: ${body.topics.join(', ')}`)
    console.log(
      `   Options: exercises=${includeExercises}, cultural=${includeCulturalNotes}, slang=${includeSlang}, mnemonics=${includeMnemonics}`
    )

    // Create textbook record with only existing fields
    // NOTE: content_type and error_message require migration 009
    const textbookData: {
      user_id: string | null
      title: string
      jlpt_level: string
      topics: string[]
      keywords: string[]
      total_chapters: number
      generation_status: string
      is_public: boolean
      is_published: boolean
      generated_by: string
      generation_params: Record<string, unknown>
    } = {
      user_id: body.userId || null,
      title: body.title,
      jlpt_level: `N${body.jlptLevel}`,
      topics: body.topics,
      keywords: body.interests || [],
      total_chapters: body.numberOfChapters,
      generation_status: 'generating',
      is_public: false,
      is_published: false,
      generated_by: 'NVIDIA stockmark-2-100b-instruct',
      generation_params: {
        contentType: contentType,
        includeExercises: includeExercises,
        includeCulturalNotes: includeCulturalNotes,
        includeSlang: includeSlang,
        includeMnemonics: includeMnemonics,
        includeExamples: includeExamples,
        topics: body.topics,
        interests: body.interests || [],
        specificContent: body.specificContent || {},
      },
    }

    console.log('   📝 Creating textbook record...')

    const { data: textbook, error: textbookError } = await supabase
      .from('textbooks')
      .insert(textbookData)
      .select()
      .single()

    if (textbookError) {
      console.error('❌ Failed to create textbook record:', textbookError)
      console.error('   Error details:', {
        message: textbookError.message,
        code: textbookError.code,
        details: textbookError.details,
      })
      return NextResponse.json(
        {
          error: 'Failed to create textbook',
          details: textbookError.message,
          hint: 'Database migration may be required. Run: database/migrations/009_add_textbook_enhancements.sql',
        },
        { status: 500 }
      )
    }

    console.log(`   ✅ Textbook record created with ID: ${textbook.id}`)

    const textbookId = textbook.id

    // Convert JLPT level to string format
    const jlptLevelStr: JLPTLevel = `N${body.jlptLevel}` as JLPTLevel

    // Generate chapters using enhanced JLPT-compliant system
    const chapters = []
    let estimatedTotalHours = 0

    for (let i = 0; i < body.numberOfChapters; i++) {
      const chapterNumber = i + 1
      const topic = body.topics[i % body.topics.length] // Rotate through topics

      console.log(
        `\n   ⏳ Generating Chapter ${chapterNumber}/${body.numberOfChapters}: ${topic}...`
      )
      console.log(`   📚 Content Type: ${body.contentType}`)
      console.log(`   🎯 JLPT Level: ${jlptLevelStr}`)

      try {
        // Use enhanced JLPT content generation system
        const contentRequest: JLPTContentRequest = {
          type: contentType,
          jlptLevel: jlptLevelStr,
          topic: topic,
          specificContent: body.specificContent,
          options: {
            includeExamples: includeExamples,
            includeExercises: includeExercises,
            includeCulturalNotes: includeCulturalNotes,
            includeSlang: includeSlang,
            includeMnemonics: includeMnemonics,
          },
        }

        const chapterContent = (await generateJLPTContent(contentRequest)) as Record<
          string,
          unknown
        >

        if (!chapterContent) {
          throw new Error('Failed to generate chapter content')
        }

        console.log(`   ✨ Generated comprehensive JLPT-compliant content`)

        // Save chapter to database (only using fields that exist in original schema)
        // NOTE: content, content_type, includes_* require migration 009
        const chapterData: {
          textbook_id: string
          chapter_number: number
          title: string
          introduction: string
          sections: unknown[]
          vocabulary: unknown[]
          grammar_points: unknown[]
          exercises: unknown[]
          estimated_time_minutes: number
        } = {
          textbook_id: textbookId,
          chapter_number: chapterNumber,
          title: (chapterContent.title as string) || `Chapter ${chapterNumber}: ${topic}`,
          introduction:
            (chapterContent.introduction as string) ||
            (chapterContent.lesson_content as string)?.substring(0, 500) ||
            '',
          sections: (chapterContent.sections as unknown[]) || [],
          vocabulary:
            (chapterContent.vocabulary as unknown[]) ||
            (chapterContent.vocabulary_items as unknown[]) ||
            [],
          grammar_points:
            (chapterContent.grammarPoints as unknown[]) ||
            (chapterContent.grammar_pattern as unknown[]) ||
            [],
          exercises: (chapterContent.exercises as unknown[]) || [],
          estimated_time_minutes: 45,
        }

        console.log(`   💾 Saving chapter ${chapterNumber} to database...`)

        const { data: savedChapter, error: chapterError } = await supabase
          .from('textbook_chapters')
          .insert(chapterData)
          .select()
          .single()

        if (chapterError) {
          console.error(`   ❌ Failed to save chapter ${chapterNumber}:`, chapterError)
          throw new Error(`Failed to save chapter: ${chapterError.message}`)
        }

        chapters.push(savedChapter)
        estimatedTotalHours += 0.75 // 45 minutes per comprehensive chapter

        console.log(`   ✅ Chapter ${chapterNumber} completed with JLPT specifications`)
      } catch (error: unknown) {
        console.error(`   ❌ Error generating chapter ${chapterNumber}:`, error)

        // Update textbook status to error (only use existing fields)
        const errorUpdate: {
          generation_status: string
          updated_at: string
          generation_params?: Record<string, unknown>
        } = {
          generation_status: 'error',
          updated_at: new Date().toISOString(),
        }

        // Store error in generation_params if error_message field doesn't exist
        const currentParams = textbook?.generation_params || {}
        errorUpdate.generation_params = {
          ...currentParams,
          error: error instanceof Error ? error.message : 'Unknown error',
          failedAtChapter: chapterNumber,
        }

        await supabase.from('textbooks').update(errorUpdate).eq('id', textbookId)

        return NextResponse.json(
          {
            error: `Failed to generate chapter ${chapterNumber}`,
            details: error instanceof Error ? error.message : 'Unknown error',
            textbookId,
            completedChapters: chapters.length,
            hint: 'Check NVIDIA API key and network connection',
          },
          { status: 500 }
        )
      }
    }

    // Update textbook with completion status
    const { error: updateError } = await supabase
      .from('textbooks')
      .update({
        chapters: chapters.map((c) => c.id),
        generation_status: 'completed',
        is_published: true,
        estimated_completion_hours: Math.ceil(estimatedTotalHours),
        updated_at: new Date().toISOString(),
      })
      .eq('id', textbookId)

    if (updateError) {
      console.error('Failed to update textbook:', updateError)
    }

    console.log(`\n✅ Textbook "${body.title}" generation complete!`)
    console.log(`   Total chapters: ${chapters.length}`)
    console.log(`   Estimated time: ${Math.ceil(estimatedTotalHours)}h`)

    return NextResponse.json({
      success: true,
      textbook: {
        id: textbookId,
        title: body.title,
        jlptLevel: `N${body.jlptLevel}`,
        totalChapters: chapters.length,
        estimatedHours: Math.ceil(estimatedTotalHours),
      },
      chapters: chapters.map((c) => ({
        id: c.id,
        number: c.chapter_number,
        title: c.title,
      })),
    })
  } catch (error: unknown) {
    console.error('Textbook generation error:', error)
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
      jlptLevel: textbook.jlpt_level,
      status: textbook.generation_status,
      totalChapters: textbook.total_chapters,
      completedChapters: textbook.textbook_chapters?.length || 0,
      chapters: textbook.textbook_chapters || [],
    })
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
