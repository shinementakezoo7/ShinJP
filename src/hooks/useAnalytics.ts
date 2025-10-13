'use client'

import { useCallback } from 'react'
import { analytics } from '@/lib/analytics/posthog'

/**
 * React hook for easy analytics tracking in components
 */
export function useAnalytics() {
  // JLPT Learning events
  const trackLessonStarted = useCallback((level: string, lesson: string) => {
    analytics.lessonStarted(level, lesson)
  }, [])

  const trackLessonCompleted = useCallback((level: string, lesson: string, duration: number) => {
    analytics.lessonCompleted(level, lesson, duration)
  }, [])

  // SSW events
  const trackTextbookGenerated = useCallback((sector: string, level: string, duration: number) => {
    analytics.textbookGenerated(sector, level, duration)
  }, [])

  const trackTextbookDownloaded = useCallback((textbookId: string, sector: string) => {
    analytics.textbookDownloaded(textbookId, sector)
  }, [])

  // Kanji practice events
  const trackKanjiPracticed = useCallback((kanji: string, accuracy: number, strokes: number) => {
    analytics.kanjiPracticed(kanji, accuracy, strokes)
  }, [])

  const trackKanjiMastered = useCallback((kanji: string, attempts: number) => {
    analytics.kanjiMastered(kanji, attempts)
  }, [])

  // Audio events
  const trackAudioGenerated = useCallback((text: string, voice: string, speed: number) => {
    analytics.audioGenerated(text, voice, speed)
  }, [])

  const trackAudioPlayed = useCallback((text: string, voice: string) => {
    analytics.audioPlayed(text, voice)
  }, [])

  // Chat events
  const trackChatMessageSent = useCallback((messageLength: number, conversationId: string) => {
    analytics.chatMessageSent(messageLength, conversationId)
  }, [])

  const trackChatResponseReceived = useCallback((responseLength: number, latency: number) => {
    analytics.chatResponseReceived(responseLength, latency)
  }, [])

  // Book events
  const trackBookOpened = useCallback((bookId: string, title: string) => {
    analytics.bookOpened(bookId, title)
  }, [])

  const trackBookProgressUpdated = useCallback((bookId: string, progress: number) => {
    analytics.bookProgressUpdated(bookId, progress)
  }, [])

  // Exercise events
  const trackExerciseStarted = useCallback((exerciseId: string, type: string) => {
    analytics.exerciseStarted(exerciseId, type)
  }, [])

  const trackExerciseCompleted = useCallback(
    (exerciseId: string, score: number, duration: number) => {
      analytics.exerciseCompleted(exerciseId, score, duration)
    },
    []
  )

  // Error tracking
  const trackError = useCallback((error: Error, context?: Record<string, unknown>) => {
    analytics.error(error, context)
  }, [])

  // Feature usage
  const trackFeatureUsed = useCallback(
    (featureName: string, metadata?: Record<string, unknown>) => {
      analytics.featureUsed(featureName, metadata)
    },
    []
  )

  return {
    // JLPT
    trackLessonStarted,
    trackLessonCompleted,
    // SSW
    trackTextbookGenerated,
    trackTextbookDownloaded,
    // Kanji
    trackKanjiPracticed,
    trackKanjiMastered,
    // Audio
    trackAudioGenerated,
    trackAudioPlayed,
    // Chat
    trackChatMessageSent,
    trackChatResponseReceived,
    // Books
    trackBookOpened,
    trackBookProgressUpdated,
    // Exercises
    trackExerciseStarted,
    trackExerciseCompleted,
    // General
    trackError,
    trackFeatureUsed,
  }
}
