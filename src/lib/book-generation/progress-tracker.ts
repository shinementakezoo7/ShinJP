/**
 * Book Generation Progress Tracker
 *
 * Tracks and streams real-time progress updates for book generation
 */

import { EventEmitter } from 'events'
import type { ProgressUpdate } from './types'

export class BookGenerationProgressTracker extends EventEmitter {
  private progressCache: Map<string, ProgressUpdate> = new Map()

  /**
   * Update progress for a job
   */
  async updateProgress(jobId: string, update: ProgressUpdate): Promise<void> {
    // Store in cache
    this.progressCache.set(jobId, update)

    // Emit event for real-time listeners
    this.emit(`progress:${jobId}`, update)
    this.emit('progress', update)

    // TODO: Update in database
    // TODO: Send via WebSocket/SSE

    console.log(
      `📊 Progress [${jobId.substring(0, 8)}]: ${update.progressPercentage}% - ${update.currentStage}`
    )
  }

  /**
   * Get current progress
   */
  async getProgress(jobId: string): Promise<ProgressUpdate | null> {
    // Try cache first
    const cached = this.progressCache.get(jobId)
    if (cached) return cached

    // TODO: Load from database
    return null
  }

  /**
   * Stream progress updates
   */
  streamProgress(jobId: string): EventEmitter {
    const emitter = new EventEmitter()

    // Listen to progress updates
    const handler = (update: ProgressUpdate) => {
      emitter.emit('progress', update)
    }

    this.on(`progress:${jobId}`, handler)

    // Cleanup on close
    emitter.on('close', () => {
      this.off(`progress:${jobId}`, handler)
    })

    return emitter
  }

  /**
   * Estimate completion time
   */
  estimateCompletion(
    jobId: string,
    chaptersCompleted: number,
    chaptersTotal: number,
    startTime: Date
  ): Date {
    if (chaptersCompleted === 0) {
      // Can't estimate yet
      return new Date(Date.now() + 15 * 60 * 1000) // Default: 15 minutes
    }

    const elapsed = Date.now() - startTime.getTime()
    const timePerChapter = elapsed / chaptersCompleted
    const remaining = chaptersTotal - chaptersCompleted
    const estimatedRemaining = timePerChapter * remaining

    return new Date(Date.now() + estimatedRemaining)
  }

  /**
   * Clear progress cache
   */
  clearCache(jobId?: string): void {
    if (jobId) {
      this.progressCache.delete(jobId)
    } else {
      this.progressCache.clear()
    }
  }
}
