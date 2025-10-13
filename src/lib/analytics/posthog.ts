import posthog from 'posthog-js'

let isInitialized = false

export function initPostHog() {
  if (typeof window === 'undefined') return
  if (isInitialized) return

  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com'

  if (!key) {
    console.warn('PostHog key not found. Analytics disabled.')
    return
  }

  posthog.init(key, {
    api_host: host,
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') {
        posthog.debug()
      }
    },
    capture_pageview: false, // We'll handle this manually with Next.js
    capture_pageleave: true,
    autocapture: true,
  })

  isInitialized = true
}

// Track custom events
export const analytics = {
  // User events
  identify: (userId: string, traits?: Record<string, unknown>) => {
    if (typeof window === 'undefined') return
    posthog.identify(userId, traits)
  },

  // Page views
  pageView: (url: string) => {
    if (typeof window === 'undefined') return
    posthog.capture('$pageview', { url })
  },

  // JLPT Learning events
  lessonStarted: (level: string, lesson: string) => {
    posthog.capture('lesson_started', { jlpt_level: level, lesson })
  },

  lessonCompleted: (level: string, lesson: string, duration: number) => {
    posthog.capture('lesson_completed', {
      jlpt_level: level,
      lesson,
      duration_seconds: duration,
    })
  },

  // SSW events
  textbookGenerated: (sector: string, level: string, duration: number) => {
    posthog.capture('ssw_textbook_generated', {
      sector,
      level,
      generation_time_ms: duration,
    })
  },

  textbookDownloaded: (textbookId: string, sector: string) => {
    posthog.capture('ssw_textbook_downloaded', {
      textbook_id: textbookId,
      sector,
    })
  },

  // Kanji practice events
  kanjiPracticed: (kanji: string, accuracy: number, strokes: number) => {
    posthog.capture('kanji_practiced', {
      kanji,
      accuracy_percent: accuracy,
      stroke_count: strokes,
    })
  },

  kanjiMastered: (kanji: string, attempts: number) => {
    posthog.capture('kanji_mastered', {
      kanji,
      total_attempts: attempts,
    })
  },

  // Audio events
  audioGenerated: (text: string, voice: string, speed: number) => {
    posthog.capture('audio_generated', {
      text_length: text.length,
      voice_type: voice,
      speed,
    })
  },

  audioPlayed: (text: string, voice: string) => {
    posthog.capture('audio_played', {
      text_length: text.length,
      voice_type: voice,
    })
  },

  // AI Chat events
  chatMessageSent: (messageLength: number, conversationId: string) => {
    posthog.capture('chat_message_sent', {
      message_length: messageLength,
      conversation_id: conversationId,
    })
  },

  chatResponseReceived: (responseLength: number, latency: number) => {
    posthog.capture('chat_response_received', {
      response_length: responseLength,
      latency_ms: latency,
    })
  },

  // Book reading events
  bookOpened: (bookId: string, title: string) => {
    posthog.capture('book_opened', {
      book_id: bookId,
      title,
    })
  },

  bookProgressUpdated: (bookId: string, progress: number) => {
    posthog.capture('book_progress_updated', {
      book_id: bookId,
      progress_percent: progress,
    })
  },

  // Exercise events
  exerciseStarted: (exerciseId: string, type: string) => {
    posthog.capture('exercise_started', {
      exercise_id: exerciseId,
      exercise_type: type,
    })
  },

  exerciseCompleted: (exerciseId: string, score: number, duration: number) => {
    posthog.capture('exercise_completed', {
      exercise_id: exerciseId,
      score_percent: score,
      duration_seconds: duration,
    })
  },

  // Error tracking
  error: (error: Error, context?: Record<string, unknown>) => {
    posthog.capture('error_occurred', {
      error_message: error.message,
      error_stack: error.stack,
      ...context,
    })
  },

  // Feature usage
  featureUsed: (featureName: string, metadata?: Record<string, unknown>) => {
    posthog.capture('feature_used', {
      feature: featureName,
      ...metadata,
    })
  },
}

// Get PostHog instance for advanced usage
export function getPostHog() {
  return posthog
}

// Reset user (for logout)
export function resetPostHog() {
  if (typeof window === 'undefined') return
  posthog.reset()
}
