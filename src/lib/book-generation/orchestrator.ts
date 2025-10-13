/**
 * Book Generation Orchestrator
 *
 * Main orchestration class for generating complete books with parallel chapter processing
 */

import { v4 as uuidv4 } from 'uuid'
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
    console.log('🚀 Starting book generation...')
    console.log(`   Type: ${request.bookType}`)
    console.log(
      `   Target: ${request.targetPages || 500} pages, ${request.targetChapters || 25} chapters`
    )

    try {
      // 1. Create generation job
      const jobId = await this.createGenerationJob(request)
      console.log(`✅ Job created: ${jobId}`)

      // 2. Load template
      const template = await this.loadTemplate(request)
      console.log(`✅ Template loaded: ${template.name}`)

      // 3. Generate chapter tasks
      const tasks = await this.createChapterTasks(jobId, template, request)
      console.log(`✅ Created ${tasks.length} chapter tasks`)

      // 4. Start generation (non-blocking)
      this.startParallelGeneration(jobId, tasks, request.config.parallelChapters || 10).catch(
        (error) => {
          console.error(`❌ Generation failed for job ${jobId}:`, error)
          this.handleJobFailure(jobId, error)
        }
      )

      return jobId
    } catch (error) {
      console.error('❌ Failed to start generation:', error)
      throw error
    }
  }

  /**
   * Create a new generation job record
   */
  private async createGenerationJob(request: BookGenerationRequest): Promise<string> {
    const jobId = uuidv4()

    const job: Partial<BookGenerationJob> = {
      id: jobId,
      userId: request.userId,
      bookType: request.bookType,
      sectorId: request.sectorId,
      jlptLevel: request.jlptLevel,
      customConfig: request.customConfig,
      templateId: request.templateId,
      targetPages: request.targetPages || 500,
      targetChapters: request.targetChapters || 25,
      bookTitle: request.bookTitle,
      generationConfig: {
        parallelChapters: request.config.parallelChapters || 10,
        useStreaming: request.config.useStreaming !== false,
        includeExercises: request.config.includeExercises !== false,
        includeAudioScripts: request.config.includeAudioScripts || false,
        includeCulturalNotes: request.config.includeCulturalNotes !== false,
        vocabularyDensity: request.config.vocabularyDensity || 'high',
        grammarFocus: request.config.grammarFocus !== false,
        retryOnFailure: request.config.retryOnFailure !== false,
        maxRetries: request.config.maxRetries || 3,
      },
      status: 'initializing',
      progressPercentage: 0,
      currentStage: 'Initializing generation',
      chaptersTotal: request.targetChapters || 25,
      chaptersCompleted: 0,
      chaptersFailed: 0,
      chaptersInProgress: 0,
      startedAt: new Date(),
      aiModel: 'NVIDIA stockmark-2-100b-instruct',
      totalTokensUsed: 0,
      totalCostUsd: 0,
      retryCount: 0,
      outputFiles: [],
    }

    // TODO: Save to database
    // For now, store in memory or file
    await this.saveJobToStorage(job)

    return jobId
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

    // TODO: Save tasks to database
    await this.saveTasksToStorage(tasks)

    return tasks
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
    // TODO: Update in database
    console.log(`📊 Job ${jobId}: ${status}${message ? ` - ${message}` : ''}`)
  }

  /**
   * Calculate word count from generated content
   */
  private calculateWordCount(content: any): number {
    if (!content) return 0

    const textContent = JSON.stringify(content)
    return textContent.split(/\s+/).length
  }

  // Temporary storage methods (replace with database calls)
  private async saveJobToStorage(job: Partial<BookGenerationJob>): Promise<void> {
    // TODO: Save to database
    console.log('💾 Saving job to storage:', job.id)
  }

  private async saveTasksToStorage(tasks: ChapterGenerationTask[]): Promise<void> {
    // TODO: Save to database
    console.log('💾 Saving tasks to storage:', tasks.length)
  }

  private async updateTaskInStorage(task: ChapterGenerationTask): Promise<void> {
    // TODO: Update in database
  }

  /**
   * Get job status
   */
  async getJobStatus(jobId: string): Promise<Partial<BookGenerationJob> | null> {
    // TODO: Load from database
    return null
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
