/**
 * Book Generation Orchestrator
 *
 * Main orchestration class for generating complete books with parallel chapter processing
 */

import { v4 as uuidv4 } from 'uuid'
import { Logger } from '../utils/logger'
import {
  createGenerationJob,
  createGenerationTasks,
  updateGenerationJob,
  updateGenerationTask,
  getGenerationJob,
  getGenerationTasksByJob,
} from '../database/functions'
import type {
  BookGenerationRequest,
  BookGenerationJob,
  ChapterGenerationTask,
  BookTemplate,
  GenerationStatus,
} from './types'
import { getSSWSectorTemplate, getTemplateById } from './ssw-templates'
import { BookContentGenerator } from './content-generator'
import { BookGenerationProgressTracker } from './progress-tracker'

const logger = new Logger('BookGenerationOrchestrator')

export class BookGenerationOrchestrator {
  private contentGenerator: BookContentGenerator
  private progressTracker: BookGenerationProgressTracker

  constructor() {
    this.contentGenerator = new BookContentGenerator()
    this.progressTracker = new BookGenerationProgressTracker()
  }

  /**
   * Start a new book generation job
   */
  async startGeneration(request: BookGenerationRequest): Promise<string> {
    logger.info('Starting book generation', {
      bookType: request.bookType,
      targetPages: request.targetPages || 500,
      targetChapters: request.targetChapters || 25,
    })

    try {
      // 1. Create generation job
      const jobId = await this.createGenerationJob(request)
      logger.info('Job created', { jobId })

      // 2. Load template
      const template = await this.loadTemplate(request)
      logger.info('Template loaded', { templateName: template.name })

      // 3. Generate chapter tasks
      const tasks = await this.createChapterTasks(jobId, template, request)
      logger.info('Chapter tasks created', { taskCount: tasks.length })

      // 4. Start generation (non-blocking)
      this.startParallelGeneration(jobId, tasks, request.config.parallelChapters || 10).catch(
        (error) => {
          logger.error('Generation failed for job', {
            jobId,
            error: error instanceof Error ? error.message : String(error),
          })
          this.handleJobFailure(jobId, error)
        }
      )

      return jobId
    } catch (error) {
      logger.error('Failed to start generation', {
        error: error instanceof Error ? error.message : String(error),
      })
      throw error
    }
  }

  /**
   * Create a new generation job record
   */
  private async createGenerationJob(request: BookGenerationRequest): Promise<string> {
    // Map request to database schema (only fields that exist in the database table)
    const job: Partial<BookGenerationJob> = {
      userId: request.userId,
      bookType: request.bookType,
      targetSector: request.sectorId as string, // Map sectorId to targetSector
      jlptLevel: request.jlptLevel,
      targetPages: request.targetPages || 500,
      targetChapters: request.targetChapters || 25,
      status: 'pending', // Use database-compatible status
      progress: 0, // Use progress field instead of progressPercentage
      chaptersCompleted: 0,
      chaptersFailed: 0,
      chaptersInProgress: 0,
      aiModel: 'NVIDIA stockmark-2-100b-instruct',
      totalTokensUsed: 0,
      totalCostUsd: 0,
      retryCount: 0,
      outputFiles: [],
    }

    const createdJob = await createGenerationJob(job)
    if (!createdJob) {
      throw new Error('Failed to create generation job in database')
    }

    logger.info('Generation job created in database', { jobId: createdJob.id })
    return createdJob.id
  }

  /**
   * Load appropriate template
   */
  private async loadTemplate(request: BookGenerationRequest): Promise<BookTemplate> {
    // If template ID provided, load that
    if (request.templateId) {
      const template = getTemplateById(request.templateId)
      if (template) return template
    }

    // Otherwise, create based on book type
    if (request.bookType === 'ssw_sector' && request.sectorId) {
      return getSSWSectorTemplate(request.sectorId as any)
    }

    // TODO: Add JLPT templates
    if (request.bookType === 'jlpt_level' && request.jlptLevel) {
      throw new Error('JLPT templates not yet implemented')
    }

    throw new Error('No valid template found for request')
  }

  /**
   * Create chapter generation tasks from template
   */
  private async createChapterTasks(
    jobId: string,
    template: BookTemplate,
    request: BookGenerationRequest
  ): Promise<ChapterGenerationTask[]> {
    const tasks: ChapterGenerationTask[] = []
    let chapterNumber = 1

    // Iterate through template parts
    for (const part of template.structure.parts) {
      for (let i = 0; i < part.chapters; i++) {
        const chapterTitle = part.sections[i] || `Chapter ${chapterNumber}: ${part.title}`

        const task: Partial<ChapterGenerationTask> = {
          id: uuidv4(),
          jobId,
          chapterNumber,
          chapterTitle,
          partNumber: template.structure.parts.indexOf(part) + 1,
          partTitle: part.title,
          targetWordCount: Math.floor((part.pages / part.chapters) * 200), // ~200 words per page
          vocabularyList: [],
          grammarPoints: [],
          dialogueScenarios: [],
          prompt: this.buildChapterPrompt(template, chapterTitle, chapterNumber, request),
          generationParams: {
            temperature: 0.7,
            maxTokens: 16000,
            model: 'NVIDIA stockmark-2-100b-instruct',
          },
          status: 'pending',
          retryCount: 0,
          maxRetries: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        }

        tasks.push(task as ChapterGenerationTask)
        chapterNumber++
      }
    }

    // Save tasks to database
    const savedTasks = await createGenerationTasks(tasks)
    if (!savedTasks) {
      throw new Error('Failed to save generation tasks to database')
    }
    logger.info('Generation tasks saved to database', { taskCount: savedTasks.length })
    return savedTasks
  }

  /**
   * Build chapter generation prompt
   */
  private buildChapterPrompt(
    template: BookTemplate,
    chapterTitle: string,
    chapterNumber: number,
    request: BookGenerationRequest
  ): string {
    const basePrompt = template.prompts.chapterPrompt || ''

    return basePrompt
      .replace(/{chapter_number}/g, chapterNumber.toString())
      .replace(/{chapter_title}/g, chapterTitle)
      .replace(/{vocabulary_count}/g, template.contentRequirements.vocabularyPerChapter.toString())
      .replace(/{grammar_count}/g, template.contentRequirements.grammarPointsPerChapter.toString())
  }

  /**
   * Start parallel chapter generation
   */
  private async startParallelGeneration(
    jobId: string,
    tasks: ChapterGenerationTask[],
    concurrency: number
  ): Promise<void> {
    console.log(`\n🔄 Starting parallel generation (${concurrency} concurrent)...`)

    // Update job status
    await this.updateJobStatus(jobId, 'generating', 'Generating chapters in parallel')

    // Process tasks in batches
    const batches: ChapterGenerationTask[][] = []
    for (let i = 0; i < tasks.length; i += concurrency) {
      batches.push(tasks.slice(i, i + concurrency))
    }

    let totalCompleted = 0
    let totalFailed = 0

    for (const batch of batches) {
      console.log(`\n📦 Processing batch of ${batch.length} chapters...`)

      const results = await Promise.allSettled(
        batch.map((task) => this.generateChapter(jobId, task))
      )

      // Count successes and failures
      const succeeded = results.filter((r) => r.status === 'fulfilled').length
      const failed = results.filter((r) => r.status === 'rejected').length

      totalCompleted += succeeded
      totalFailed += failed

      // Update progress
      const progressPercentage = Math.floor((totalCompleted / tasks.length) * 100)
      await this.progressTracker.updateProgress(jobId, {
        jobId,
        status: 'generating',
        progressPercentage,
        currentStage: `Generated ${totalCompleted}/${tasks.length} chapters`,
        chaptersCompleted: totalCompleted,
        chaptersTotal: tasks.length,
        chaptersFailed: totalFailed,
      })

      console.log(`   ✅ Completed: ${succeeded}`)
      console.log(`   ❌ Failed: ${failed}`)
      console.log(`   📊 Progress: ${progressPercentage}%`)
    }

    // Finalize book
    if (totalFailed === 0) {
      console.log('\n✅ All chapters generated successfully!')
      await this.finalizeBook(jobId, tasks)
    } else {
      console.warn(`\n⚠️  Generation completed with ${totalFailed} failed chapters`)
      await this.updateJobStatus(
        jobId,
        'completed',
        `Completed with ${totalFailed} chapter failures`
      )
    }
  }

  /**
   * Generate a single chapter
   */
  private async generateChapter(
    jobId: string,
    task: ChapterGenerationTask
  ): Promise<ChapterGenerationTask> {
    console.log(`   📝 Generating Chapter ${task.chapterNumber}: ${task.chapterTitle}`)

    try {
      // Update task status
      task.status = 'generating'
      task.startedAt = new Date()

      // Generate content using AI
      const startTime = Date.now()
      const generatedContent = await this.contentGenerator.generateChapter({
        chapterNumber: task.chapterNumber,
        chapterTitle: task.chapterTitle || '',
        prompt: task.prompt,
        targetWordCount: task.targetWordCount,
        vocabularyTarget: 40,
        grammarTarget: 10,
        includeExercises: true,
        includeDialogues: true,
      })

      const endTime = Date.now()
      const generationTime = Math.floor((endTime - startTime) / 1000)

      // Update task with results
      task.status = 'completed'
      task.completedAt = new Date()
      task.generationTimeSeconds = generationTime
      task.generatedContent = generatedContent
      task.wordCount = this.calculateWordCount(generatedContent)
      task.tokensUsed = Math.floor(task.wordCount * 1.3) // Rough estimate

      console.log(
        `      ✅ Chapter ${task.chapterNumber} complete (${generationTime}s, ${task.wordCount} words)`
      )

      // TODO: Save task update to database
      await this.updateTaskInStorage(task)

      return task
    } catch (error) {
      console.error(`      ❌ Chapter ${task.chapterNumber} failed:`, error)

      task.status = 'failed'
      task.errorMessage = error instanceof Error ? error.message : 'Unknown error'
      task.retryCount++

      // Retry if allowed
      if (task.retryCount < task.maxRetries) {
        console.log(
          `      🔄 Retrying chapter ${task.chapterNumber} (attempt ${task.retryCount + 1}/${task.maxRetries})`
        )
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Wait 2s before retry
        return this.generateChapter(jobId, task)
      }

      await this.updateTaskInStorage(task)
      throw error
    }
  }

  /**
   * Finalize book after all chapters are generated
   */
  private async finalizeBook(jobId: string, tasks: ChapterGenerationTask[]): Promise<void> {
    console.log('\n🎉 Finalizing book...')

    // Compile all chapters
    const chapters = tasks
      .sort((a, b) => a.chapterNumber - b.chapterNumber)
      .map((task) => ({
        number: task.chapterNumber,
        title: task.chapterTitle,
        content: task.generatedContent,
        wordCount: task.wordCount,
      }))

    // Calculate totals
    const totalWords = chapters.reduce((sum, ch) => sum + (ch.wordCount || 0), 0)
    const totalTokens = tasks.reduce((sum, task) => sum + (task.tokensUsed || 0), 0)
    const totalCost = (totalTokens / 1000) * 0.002 // Rough estimate: $0.002 per 1K tokens

    console.log(`   📄 Total pages: ~${Math.ceil(totalWords / 200)}`)
    console.log(`   📝 Total words: ${totalWords.toLocaleString()}`)
    console.log(`   🎯 Total tokens: ${totalTokens.toLocaleString()}`)
    console.log(`   💰 Total cost: $${totalCost.toFixed(2)}`)

    // Update job
    await this.updateJobStatus(jobId, 'completed', 'Book generation completed')

    // TODO: Create textbook record in database
    // TODO: Generate PDF/exports

    console.log('\n✅ Book generation complete! 🎉📚\n')
  }

  /**
   * Handle job failure
   */
  private async handleJobFailure(jobId: string, error: Error): Promise<void> {
    console.error(`❌ Job ${jobId} failed:`, error)
    await this.updateJobStatus(jobId, 'failed', error.message)
  }

  /**
   * Update job status
   */
  private async updateJobStatus(
    jobId: string,
    status: GenerationStatus,
    message?: string
  ): Promise<void> {
    // Map GenerationStatus to database status values
    const dbStatus =
      status === 'initializing'
        ? 'pending'
        : status === 'generating'
          ? 'in_progress'
          : status === 'completed'
            ? 'completed'
            : status === 'failed'
              ? 'failed'
              : status === 'cancelled'
                ? 'cancelled'
                : 'pending'

    const updates: Partial<BookGenerationJob> = {
      status: dbStatus,
      errorMessage: message,
      updatedAt: new Date(),
    }

    // If status is completed, set completedAt
    if (status === 'completed') {
      updates.completedAt = new Date()
    }

    const updatedJob = await updateGenerationJob(jobId, updates)
    if (!updatedJob) {
      logger.warn('Failed to update generation job status in database', { jobId, status: dbStatus })
    } else {
      logger.info('Job status updated', { jobId, status: dbStatus, message })
    }
  }

  /**
   * Calculate word count from generated content
   */
  private calculateWordCount(content: any): number {
    if (!content) return 0

    const textContent = JSON.stringify(content)
    return textContent.split(/\s+/).length
  }

  /**
   * Update a generation task in the database
   */
  private async updateTaskInStorage(task: ChapterGenerationTask): Promise<void> {
    const updatedTask = await updateGenerationTask(task.id, task)
    if (!updatedTask) {
      logger.warn('Failed to update generation task in database', { taskId: task.id })
    }
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<Partial<BookGenerationJob> | null> {
    const job = await getGenerationJob(jobId)
    if (!job) {
      logger.warn('Generation job not found in database', { jobId })
      return null
    }
    return job
  }

  /**
   * Cancel job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    console.log(`🛑 Cancelling job ${jobId}`)
    await this.updateJobStatus(jobId, 'cancelled', 'Cancelled by user')
    return true
  }
}
