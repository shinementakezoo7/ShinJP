/**
 * Enhanced Analytics Setup
 * Integrates PostHog and custom event tracking
 */

import { posthog } from 'posthog-js'

/**
 * Custom event categories
 */
export const ANALYTICS_EVENTS = {
  // Learning Events
  LESSON_STARTED: 'lesson_started',
  LESSON_COMPLETED: 'lesson_completed',
  EXERCISE_COMPLETED: 'exercise_completed',
  QUIZ_TAKEN: 'quiz_taken',
  TEXTBOOK_OPENED: 'textbook_opened',

  // AI Events
  AI_GENERATION_STARTED: 'ai_generation_started',
  AI_GENERATION_COMPLETED: 'ai_generation_completed',
  AI_GENERATION_FAILED: 'ai_generation_failed',

  // User Events
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_PROFILE_UPDATED: 'user_profile_updated',

  // Engagement Events
  STREAK_ACHIEVED: 'streak_achieved',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  STUDY_SESSION_STARTED: 'study_session_started',
  STUDY_SESSION_ENDED: 'study_session_ended',

  // Performance Events
  PAGE_LOAD: 'page_load',
  API_ERROR: 'api_error',
  CACHE_HIT: 'cache_hit',
  CACHE_MISS: 'cache_miss',

  // Content Events
  CONTENT_SHARED: 'content_shared',
  CONTENT_FAVORITED: 'content_favorited',
  CONTENT_BOOKMARKED: 'content_bookmarked',
}

/**
 * Track learning progress events
 */
export function trackLearningEvent(
  event: string,
  properties: {
    lessonId?: string
    topicId?: string
    difficulty?: string
    timeSpent?: number
    score?: number
    [key: string]: any
  }
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, {
      ...properties,
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Track AI generation events
 */
export function trackAIEvent(
  event: string,
  properties: {
    modelUsed?: string
    promptLength?: number
    responseLength?: number
    latency?: number
    error?: string
    [key: string]: any
  }
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, {
      ...properties,
      category: 'ai',
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Track user engagement metrics
 */
export function trackEngagementEvent(
  event: string,
  properties: {
    sessionDuration?: number
    itemsCompleted?: number
    accuracyRate?: number
    [key: string]: any
  }
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, {
      ...properties,
      category: 'engagement',
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Track performance metrics
 */
export function trackPerformanceEvent(
  event: string,
  properties: {
    duration?: number
    endpoint?: string
    statusCode?: number
    errorMessage?: string
    [key: string]: any
  }
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(event, {
      ...properties,
      category: 'performance',
      timestamp: new Date().toISOString(),
    })
  }
}

/**
 * Identify user with additional properties
 */
export function identifyUser(
  userId: string,
  properties: {
    email?: string
    name?: string
    language?: string
    jlptLevel?: string
    joinDate?: string
    [key: string]: any
  }
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.identify(userId, properties)
  }
}

/**
 * Set global user properties (persists across events)
 */
export function setUserProperties(properties: {
  currentLevel?: number
  totalLessonsCompleted?: number
  consecutiveDays?: number
  isPremium?: boolean
  [key: string]: any
}) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.setPersonProperties(properties)
  }
}

/**
 * Track feature usage
 */
export function trackFeatureUsage(
  feature: string,
  properties: {
    action: 'view' | 'interact' | 'complete'
    duration?: number
    success?: boolean
    [key: string]: any
  }
) {
  if (typeof window !== 'undefined' && posthog) {
    posthog.capture(`feature_${properties.action}`, {
      feature,
      ...properties,
    })
  }
}

/**
 * React hook for tracking analytics
 */
export function useAnalytics() {
  return {
    trackLearning: trackLearningEvent,
    trackAI: trackAIEvent,
    trackEngagement: trackEngagementEvent,
    trackPerformance: trackPerformanceEvent,
    trackFeature: trackFeatureUsage,
    identify: identifyUser,
    setProperties: setUserProperties,
  }
}

/**
 * Advanced: Cohort analysis helper
 */
export const cohortAnalysis = {
  /**
   * Track user entry into a cohort
   */
  enterCohort(cohortName: string, userId: string) {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('cohort_entered', {
        cohort: cohortName,
        userId,
      })
    }
  },

  /**
   * Track user exit from cohort
   */
  exitCohort(cohortName: string, userId: string) {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('cohort_exited', {
        cohort: cohortName,
        userId,
      })
    }
  },

  /**
   * Track retention metric
   */
  trackRetention(userId: string, daysActive: number) {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture('retention_check', {
        userId,
        daysActive,
        isActive: daysActive > 0,
      })
    }
  },

  /**
   * Track funnel progress
   */
  trackFunnelStep(funnelName: string, step: number, properties?: any) {
    if (typeof window !== 'undefined' && posthog) {
      posthog.capture(`funnel_${funnelName}_step_${step}`, properties)
    }
  },
}

/**
 * Export all analytics utilities
 */
export const analytics = {
  events: ANALYTICS_EVENTS,
  track: trackLearningEvent,
  trackAI: trackAIEvent,
  trackPerformance: trackPerformanceEvent,
  trackEngagement: trackEngagementEvent,
  identify: identifyUser,
  setProperties: setUserProperties,
  cohort: cohortAnalysis,
}

export default analytics
