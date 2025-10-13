/**
 * Background Job: Textbook Generation
 *
 * This module provides asynchronous textbook generation using background jobs
 * to prevent API timeouts and improve user experience.
 *
 * Setup Options:
 * 1. Inngest (recommended): npm install inngest
 * 2. Trigger.dev: npm install @trigger.dev/sdk
 * 3. Bull/BullMQ: npm install bull
 *
 * This file provides a framework-agnostic interface
 */

import { generateJLPTContent, type JLPTContentRequest } from '@/lib/ai/content-generator'
import type { JLPTLevel } from '@/lib/ai/jlpt-content-spec'
import { getSupabaseServiceClient } from '../database/client'

export interface TextbookGenerationJob {
  textbookId: string
  userId: string | null
  title: string
  jlptLevel: number
  contentType:
    | 'textbook_chapter'
    | 'grammar_lesson'
    | 'vocabulary_lesson'
    | 'kanji_lesson'
    | 'colloquial_lesson'
  topics: string[]
  numberOfChapters: number
  options: {
    includeExercises: boolean
    includeCulturalNotes: boolean
    includeSlang: boolean
    includeMnemonics: boolean
    includeExamples: boolean
  }
  specificContent?: {
    grammarPatterns?: string[]
    vocabularyIds?: string[]
    kanjiIds?: string[]
    slangIds?: string[]
  }
  interests?: string[]
}

export interface TextbookGenerationProgress {
  textbookId: string
  status: 'pending' | 'generating' | 'completed' | 'failed'
  currentChapter: number
  totalChapters: number
  completedChapters: number
  error?: string
  startedAt?: string
  completedAt?: string
}

/**
 * Create textbook record and enqueue generation job
 */
export const enqueueTextbookGeneration = async (
  job: Omit<TextbookGenerationJob, 'textbookId'>
): Promise<{ textbookId: string; status: string } | null> => {
  const supabase = getSupabaseServiceClient()

  try {
    // Create textbook record
    const textbookData = {
      user_id: job.userId,
      title: job.title,
      jlpt_level: `N${job.jlptLevel}`,
      topics: job.topics,
      keywords: job.interests || [],
      total_chapters: job.numberOfChapters,
      generation_status: 'pending',
      is_public: false,
      is_published: false,
      generated_by: 'NVIDIA stockmark-2-100b-instruct',
      generation_params: {
        contentType: job.contentType,
        includeExercises: job.options.includeExercises,
        includeCulturalNotes: job.options.includeCulturalNotes,
        includeSlang: job.options.includeSlang,
        includeMnemonics: job.options.includeMnemonics,
        includeExamples: job.options.includeExamples,
        topics: job.topics,
        interests: job.interests || [],
        specificContent: job.specificContent || {},
      },
    }

    const { data: textbook, error } = await supabase
      .from('textbooks')
      .insert(textbookData)
      .select()
      .single()

    if (error || !textbook) {
      console.error('Failed to create textbook record:', error)
      return null
    }

    console.log(`✅ Textbook record created: ${textbook.id}`)

    // In production, enqueue the job here
    // For Inngest: await inngest.send({ name: 'textbook/generate', data: { ...job, textbookId: textbook.id } })
    // For now, we'll process immediately in the background
    processTextbookGeneration({ ...job, textbookId: textbook.id }).catch((err) => {
      console.error('Background textbook generation error:', err)
    })

    return {
      textbookId: textbook.id,
      status: 'pending',
    }
  } catch (error) {
    console.error('Error enqueuing textbook generation:', error)
    return null
  }
}

/**
 * Process textbook generation (this would be the background job handler)
 */
export const processTextbookGeneration = async (job: TextbookGenerationJob): Promise<void> => {
  const supabase = getSupabaseServiceClient()
  const { textbookId } = job

  try {
    console.log(`📚 Starting textbook generation: ${textbookId}`)

    // Update status to generating
    await supabase
      .from('textbooks')
      .update({
        generation_status: 'generating',
        updated_at: new Date().toISOString(),
      })
      .eq('id', textbookId)

    const jlptLevelStr: JLPTLevel = `N${job.jlptLevel}` as JLPTLevel
    const chapters = []
    let estimatedTotalHours = 0

    // Generate chapters in parallel (batches of 3)
    const BATCH_SIZE = 3
    for (let i = 0; i < job.numberOfChapters; i += BATCH_SIZE) {
      const batchPromises = []

      for (let j = 0; j < BATCH_SIZE && i + j < job.numberOfChapters; j++) {
        const chapterNumber = i + j + 1
        const topic = job.topics[(i + j) % job.topics.length]

        console.log(`⏳ Generating Chapter ${chapterNumber}/${job.numberOfChapters}: ${topic}...`)

        batchPromises.push(
          generateChapter({
            textbookId,
            chapterNumber,
            topic,
            jlptLevel: jlptLevelStr,
            contentType: job.contentType,
            options: job.options,
            specificContent: job.specificContent,
          })
        )
      }

      // Wait for batch to complete
      const batchResults = await Promise.allSettled(batchPromises)

      for (const result of batchResults) {
        if (result.status === 'fulfilled' && result.value) {
          chapters.push(result.value)
          estimatedTotalHours += 0.75
        } else {
          console.error('Chapter generation failed:', result)
          throw new Error('Chapter generation failed')
        }
      }

      console.log(`✅ Completed batch ${Math.floor(i / BATCH_SIZE) + 1}`)
    }

    // Update textbook with completion status
    await supabase
      .from('textbooks')
      .update({
        chapters: chapters.map((c) => c.id),
        generation_status: 'completed',
        is_published: true,
        estimated_completion_hours: Math.ceil(estimatedTotalHours),
        updated_at: new Date().toISOString(),
      })
      .eq('id', textbookId)

    console.log(`✅ Textbook generation complete: ${textbookId}`)
  } catch (error) {
    console.error(`❌ Textbook generation failed: ${textbookId}`, error)

    // Update with error status
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await supabase
      .from('textbooks')
      .update({
        generation_status: 'error',
        generation_params: {
          ...((
            await supabase
              .from('textbooks')
              .select('generation_params')
              .eq('id', textbookId)
              .single()
          ).data?.generation_params || {}),
          error: errorMessage,
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', textbookId)
  }
}

/**
 * Generate a single chapter
 */
const generateChapter = async ({
  textbookId,
  chapterNumber,
  topic,
  jlptLevel,
  contentType,
  options,
  specificContent,
}: {
  textbookId: string
  chapterNumber: number
  topic: string
  jlptLevel: JLPTLevel
  contentType: string
  options: TextbookGenerationJob['options']
  specificContent?: TextbookGenerationJob['specificContent']
}): Promise<{ id: string; chapter_number: number; title: string } | null> => {
  const supabase = getSupabaseServiceClient()

  try {
    const contentRequest: JLPTContentRequest = {
      type: contentType as JLPTContentRequest['type'],
      jlptLevel,
      topic,
      specificContent,
      options,
    }

    const chapterContent = (await generateJLPTContent(contentRequest)) as Record<string, unknown>

    if (!chapterContent) {
      throw new Error('Failed to generate chapter content')
    }

    // Save chapter to database
    const chapterData = {
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

    const { data: savedChapter, error } = await supabase
      .from('textbook_chapters')
      .insert(chapterData)
      .select()
      .single()

    if (error) {
      console.error(`Failed to save chapter ${chapterNumber}:`, error)
      throw new Error(`Failed to save chapter: ${error.message}`)
    }

    console.log(`✅ Chapter ${chapterNumber} saved successfully`)
    return savedChapter
  } catch (error) {
    console.error(`Error generating chapter ${chapterNumber}:`, error)
    throw error
  }
}

/**
 * Get textbook generation progress
 */
export const getTextbookGenerationProgress = async (
  textbookId: string
): Promise<TextbookGenerationProgress | null> => {
  const supabase = getSupabaseServiceClient()

  try {
    const { data: textbook, error } = await supabase
      .from('textbooks')
      .select(
        `
        id,
        generation_status,
        total_chapters,
        created_at,
        updated_at,
        textbook_chapters (id, chapter_number)
      `
      )
      .eq('id', textbookId)
      .single()

    if (error || !textbook) {
      return null
    }

    const completedChapters = textbook.textbook_chapters?.length || 0

    return {
      textbookId: textbook.id,
      status: textbook.generation_status as TextbookGenerationProgress['status'],
      currentChapter: completedChapters + 1,
      totalChapters: textbook.total_chapters,
      completedChapters,
      startedAt: textbook.created_at,
      completedAt: textbook.generation_status === 'completed' ? textbook.updated_at : undefined,
    }
  } catch (error) {
    console.error('Error fetching textbook generation progress:', error)
    return null
  }
}

/**
 * Cancel textbook generation (if still in progress)
 */
export const cancelTextbookGeneration = async (textbookId: string): Promise<boolean> => {
  const supabase = getSupabaseServiceClient()

  try {
    const { error } = await supabase
      .from('textbooks')
      .update({
        generation_status: 'error',
        generation_params: {
          error: 'Cancelled by user',
        },
        updated_at: new Date().toISOString(),
      })
      .eq('id', textbookId)
      .in('generation_status', ['pending', 'generating'])

    if (error) {
      console.error('Error cancelling textbook generation:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error cancelling textbook generation:', error)
    return false
  }
}
