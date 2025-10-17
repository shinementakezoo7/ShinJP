import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { BookGenerationJob, ChapterGenerationTask } from '@/lib/book-generation/types'

// Create a new generation job
export const createGenerationJob = async (
  job: Partial<BookGenerationJob>
): Promise<BookGenerationJob | null> => {
  try {
    databaseLogger.debug('Creating generation job', { userId: job.userId, bookType: job.bookType })

    const { data, error } = await supabase
      .from('generation_jobs')
      .insert({
        user_id: job.userId,
        book_type: job.bookType,
        target_sector: job.targetSector,
        jlpt_level: job.jlptLevel,
        target_pages: job.targetPages,
        target_chapters: job.targetChapters,
        status: job.status || 'pending',
        ai_model: job.aiModel,
        created_at: job.createdAt || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating generation job', {
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created generation job', { jobId: data.id })
    return data as BookGenerationJob
  } catch (error) {
    databaseLogger.error('Unexpected error creating generation job', {}, error as Error)
    return null
  }
}

// Update a generation job
export const updateGenerationJob = async (
  jobId: string,
  updates: Partial<BookGenerationJob>
): Promise<BookGenerationJob | null> => {
  try {
    databaseLogger.debug('Updating generation job', { jobId, updates })

    const { data, error } = await supabase
      .from('generation_jobs')
      .update({
        status: updates.status,
        progress: updates.progress,
        chapters_completed: updates.chaptersCompleted,
        chapters_failed: updates.chaptersFailed,
        chapters_in_progress: updates.chaptersInProgress,
        started_at: updates.startedAt,
        completed_at: updates.completedAt,
        ai_model: updates.aiModel,
        total_tokens_used: updates.totalTokensUsed,
        total_cost_usd: updates.totalCostUsd,
        retry_count: updates.retryCount,
        error_message: updates.errorMessage,
        output_files: updates.outputFiles,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobId)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating generation job', {
        jobId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully updated generation job', { jobId })
    return data as BookGenerationJob
  } catch (error) {
    databaseLogger.error('Unexpected error updating generation job', { jobId }, error as Error)
    return null
  }
}

// Get a generation job by ID
export const getGenerationJob = async (jobId: string): Promise<BookGenerationJob | null> => {
  try {
    databaseLogger.debug('Fetching generation job', { jobId })

    const { data, error } = await supabase
      .from('generation_jobs')
      .select('*')
      .eq('id', jobId)
      .single()

    if (error) {
      databaseLogger.error('Error fetching generation job', {
        jobId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched generation job', { jobId })
    return data as BookGenerationJob
  } catch (error) {
    databaseLogger.error('Unexpected error fetching generation job', { jobId }, error as Error)
    return null
  }
}

// Create generation tasks
export const createGenerationTasks = async (
  tasks: Partial<ChapterGenerationTask>[]
): Promise<ChapterGenerationTask[] | null> => {
  try {
    databaseLogger.debug('Creating generation tasks', { taskCount: tasks.length })

    const taskRecords = tasks.map((task) => ({
      job_id: task.jobId,
      chapter_number: task.chapterNumber,
      chapter_title: task.chapterTitle,
      status: task.status || 'pending',
      content: task.content,
      word_count: task.wordCount,
      token_count: task.tokenCount,
      cost_usd: task.costUsd,
      error_message: task.errorMessage,
      retries: task.retries,
      started_at: task.startedAt,
      completed_at: task.completedAt,
      created_at: task.createdAt || new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { data, error } = await supabase.from('generation_tasks').insert(taskRecords).select()

    if (error) {
      databaseLogger.error('Error creating generation tasks', {
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created generation tasks', { taskCount: data.length })
    return data as ChapterGenerationTask[]
  } catch (error) {
    databaseLogger.error('Unexpected error creating generation tasks', {}, error as Error)
    return null
  }
}

// Update a generation task
export const updateGenerationTask = async (
  taskId: string,
  updates: Partial<ChapterGenerationTask>
): Promise<ChapterGenerationTask | null> => {
  try {
    databaseLogger.debug('Updating generation task', { taskId, updates })

    const { data, error } = await supabase
      .from('generation_tasks')
      .update({
        status: updates.status,
        content: updates.content,
        word_count: updates.wordCount,
        token_count: updates.tokenCount,
        cost_usd: updates.costUsd,
        error_message: updates.errorMessage,
        retries: updates.retries,
        started_at: updates.startedAt,
        completed_at: updates.completedAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', taskId)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating generation task', {
        taskId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully updated generation task', { taskId })
    return data as ChapterGenerationTask
  } catch (error) {
    databaseLogger.error('Unexpected error updating generation task', { taskId }, error as Error)
    return null
  }
}

// Get all tasks for a job
export const getGenerationTasksByJob = async (
  jobId: string
): Promise<ChapterGenerationTask[] | null> => {
  try {
    databaseLogger.debug('Fetching generation tasks for job', { jobId })

    const { data, error } = await supabase
      .from('generation_tasks')
      .select('*')
      .eq('job_id', jobId)
      .order('chapter_number', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching generation tasks', {
        jobId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched generation tasks', { jobId, taskCount: data.length })
    return data as ChapterGenerationTask[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching generation tasks', { jobId }, error as Error)
    return null
  }
}
