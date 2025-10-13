import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { SRSCard, UserPerformance } from '../types'

// Get SRS cards for a user
export const getUserSRSCards = async (userId: string): Promise<SRSCard[] | null> => {
  try {
    databaseLogger.debug('Fetching SRS cards for user', { userId })

    const { data, error } = await supabase
      .from('srs_cards')
      .select('*')
      .eq('user_id', userId)
      .order('next_review', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching SRS cards', {
        userId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched SRS cards', { userId, count: data?.length || 0 })
    return data as SRSCard[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching SRS cards', { userId }, error as Error)
    return null
  }
}

// Get due SRS cards for a user (cards that need review now)
export const getDueSRSCards = async (userId: string): Promise<SRSCard[] | null> => {
  try {
    databaseLogger.debug('Fetching due SRS cards for user', { userId })

    const { data, error } = await supabase
      .from('srs_cards')
      .select('*')
      .eq('user_id', userId)
      .lte('next_review', new Date().toISOString())
      .order('next_review', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching due SRS cards', {
        userId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched due SRS cards', { userId, count: data?.length || 0 })
    return data as SRSCard[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching due SRS cards', { userId }, error as Error)
    return null
  }
}

// Get SRS card by ID
export const getSRSCardById = async (id: number): Promise<SRSCard | null> => {
  try {
    databaseLogger.debug('Fetching SRS card by ID', { id })

    const { data, error } = await supabase.from('srs_cards').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('SRS card not found', { id })
        return null
      }
      databaseLogger.error('Error fetching SRS card by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched SRS card by ID', { id })
    return data as SRSCard
  } catch (error) {
    databaseLogger.error('Unexpected error fetching SRS card by ID', { id }, error as Error)
    return null
  }
}

// Get SRS card by user, content type, and content ID
export const getSRSCardByContent = async (
  userId: string,
  contentType: 'character' | 'word' | 'grammar',
  contentId: number
): Promise<SRSCard | null> => {
  try {
    databaseLogger.debug('Fetching SRS card by content', { userId, contentType, contentId })

    const { data, error } = await supabase
      .from('srs_cards')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('SRS card not found for content', { userId, contentType, contentId })
        return null
      }
      databaseLogger.error('Error fetching SRS card by content', {
        userId,
        contentType,
        contentId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched SRS card by content', {
      userId,
      contentType,
      contentId,
    })
    return data as SRSCard
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching SRS card by content',
      { userId, contentType, contentId },
      error as Error
    )
    return null
  }
}

// Create a new SRS card
export const createSRSCard = async (
  card: Omit<SRSCard, 'id' | 'created_at' | 'updated_at'>
): Promise<SRSCard | null> => {
  try {
    databaseLogger.debug('Creating new SRS card', { card })

    const { data, error } = await supabase
      .from('srs_cards')
      .insert([
        {
          ...card,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating SRS card', {
        card,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created SRS card', { id: data.id })
    return data as SRSCard
  } catch (error) {
    databaseLogger.error('Unexpected error creating SRS card', { card }, error as Error)
    return null
  }
}

// Update an SRS card (used when reviewing items)
export const updateSRSCard = async (
  id: number,
  updates: Partial<SRSCard>
): Promise<SRSCard | null> => {
  try {
    databaseLogger.debug('Updating SRS card', { id, updates })

    const { data, error } = await supabase
      .from('srs_cards')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating SRS card', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('SRS card not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated SRS card', { id })
    return data as SRSCard
  } catch (error) {
    databaseLogger.error('Unexpected error updating SRS card', { id, updates }, error as Error)
    return null
  }
}

// Delete an SRS card
export const deleteSRSCard = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting SRS card', { id })

    const { error } = await supabase.from('srs_cards').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting SRS card', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted SRS card', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting SRS card', { id }, error as Error)
    return false
  }
}

// Enhanced SRS Algorithm Implementation (Improved SM-2 with modern enhancements)
export const calculateEnhancedSM2 = (
  quality: number, // 0-5 rating from user
  repetitions: number,
  easeFactor: number,
  interval: number,
  previousDifficulty?: number, // Optional: track historical difficulty of this item
  userPerformanceHistory?: Array<{ quality: number; responseTime: number }> // Optional: user's recent performance
): {
  interval: number
  repetitions: number
  easeFactor: number
  recommendedNextInterval?: number
} => {
  // Quality rating:
  // 0 - Complete blackout
  // 1 - Incorrect response
  // 2 - Incorrect response with hesitation
  // 3 - Correct response with difficulty
  // 4 - Correct response with slight hesitation
  // 5 - Perfect response

  // Validate input
  if (quality < 0 || quality > 5) {
    throw new Error('Quality must be between 0 and 5')
  }

  // Enhanced ease factor calculation with multiple factors
  let easeAdjustment = 0
  let newEaseFactor = easeFactor

  // Base adjustment from original SM-2
  easeAdjustment += 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)

  // Additional adjustments based on performance history
  if (userPerformanceHistory && userPerformanceHistory.length > 0) {
    const recentPerformance = userPerformanceHistory.slice(-5) // Last 5 reviews
    const avgQuality =
      recentPerformance.reduce((sum, p) => sum + p.quality, 0) / recentPerformance.length

    // Adjust ease factor based on consistency
    if (avgQuality >= 4 && quality >= 3) {
      // Consistently good performance, slightly increase ease
      easeAdjustment += 0.05
    } else if (avgQuality < 2 && quality < 3) {
      // Consistently poor performance, decrease ease more aggressively
      easeAdjustment -= 0.1
    }
  }

  newEaseFactor = easeFactor + easeAdjustment

  // Ensure ease factor stays within reasonable bounds
  // Lower bound increased to 1.5 for better differentiation
  if (newEaseFactor < 1.5) {
    newEaseFactor = 1.5
  } else if (newEaseFactor > 3.0) {
    // Upper bound to prevent excessively long intervals
    newEaseFactor = 3.0
  }

  let newRepetitions = repetitions
  let newInterval = interval
  let recommendedNextInterval: number | undefined

  if (quality < 3) {
    // Failed review - reset repetitions but use more nuanced interval adjustment
    newRepetitions = 0

    // Instead of always 1 day, use a weighted approach based on previous difficulty
    if (previousDifficulty !== undefined && previousDifficulty > 0.7) {
      // Item historically difficult, review sooner
      newInterval = 0.5
    } else {
      newInterval = 1
    }

    // Provide recommendation for next review if this keeps happening
    recommendedNextInterval = 2 // Suggest reviewing again in 2 days if this fails again
  } else {
    newRepetitions = repetitions + 1

    if (newRepetitions === 1) {
      // First successful review - standard 1 day
      newInterval = 1
      recommendedNextInterval = 3 // Suggest 3 days for next review
    } else if (newRepetitions === 2) {
      // Second successful review - extended to 4-7 days based on quality
      newInterval = quality >= 4 ? 6 : 4
      recommendedNextInterval = quality >= 4 ? 15 : 8 // Next suggested interval
    } else {
      // Subsequent reviews - enhanced calculation
      const baseMultiplier = newEaseFactor

      // Adjust multiplier based on quality
      let qualityMultiplier = 1.0
      if (quality === 5) {
        qualityMultiplier = 1.2 // Bonus for perfect recall
      } else if (quality === 3) {
        qualityMultiplier = 0.9 // Slight reduction for difficult recall
      }

      // Response time adjustment (if available)
      if (userPerformanceHistory && userPerformanceHistory.length > 0) {
        const recentAttempt = userPerformanceHistory[userPerformanceHistory.length - 1]
        const avgResponseTime =
          userPerformanceHistory.reduce((sum, p) => sum + p.responseTime, 0) /
          userPerformanceHistory.length

        // If response time is significantly slower than average, reduce interval
        if (recentAttempt.responseTime > avgResponseTime * 1.5) {
          qualityMultiplier *= 0.85
        }
      }

      newInterval = Math.max(1, Math.round(interval * baseMultiplier * qualityMultiplier))

      // Calculate recommended next interval for user guidance
      const nextBaseInterval = Math.max(1, Math.round(newInterval * baseMultiplier))
      recommendedNextInterval = nextBaseInterval
    }
  }

  return {
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: parseFloat(newEaseFactor.toFixed(3)),
    recommendedNextInterval: recommendedNextInterval
      ? Math.round(recommendedNextInterval)
      : undefined,
  }
}

// Backward compatibility wrapper for existing SM-2 implementation
export const calculateSM2 = (
  quality: number,
  repetitions: number,
  easeFactor: number,
  interval: number
): { interval: number; repetitions: number; easeFactor: number } => {
  const result = calculateEnhancedSM2(quality, repetitions, easeFactor, interval)
  return {
    interval: result.interval,
    repetitions: result.repetitions,
    easeFactor: result.easeFactor,
  }
}

// Get user performance data
export const getUserPerformance = async (
  userId: string,
  contentType?: 'character' | 'word' | 'grammar',
  contentId?: number
): Promise<UserPerformance[] | null> => {
  try {
    databaseLogger.debug('Fetching user performance data', { userId, contentType, contentId })

    let query = supabase.from('user_performance').select('*').eq('user_id', userId)

    if (contentType) {
      query = query.eq('content_type', contentType)
    }

    if (contentId !== undefined) {
      query = query.eq('content_id', contentId)
    }

    const { data, error } = await query.order('last_attempt', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching user performance', {
        userId,
        contentType,
        contentId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched user performance', {
      userId,
      contentType,
      contentId,
      count: data?.length || 0,
    })
    return data as UserPerformance[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching user performance',
      { userId, contentType, contentId },
      error as Error
    )
    return null
  }
}

// Update user performance data
export const updateUserPerformance = async (
  userId: string,
  contentType: 'character' | 'word' | 'grammar',
  contentId: number,
  isCorrect: boolean,
  responseTime: number
): Promise<UserPerformance | null> => {
  try {
    databaseLogger.debug('Updating user performance', {
      userId,
      contentType,
      contentId,
      isCorrect,
      responseTime,
    })

    // First, check if performance record exists
    const { data: existingData, error: fetchError } = await supabase
      .from('user_performance')
      .select('*')
      .eq('user_id', userId)
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .single()

    let performanceRecord: UserPerformance

    if (fetchError || !existingData) {
      // Create new performance record
      databaseLogger.debug('Creating new user performance record', {
        userId,
        contentType,
        contentId,
      })

      const { data, error } = await supabase
        .from('user_performance')
        .insert([
          {
            user_id: userId,
            content_type: contentType,
            content_id: contentId,
            attempts: 1,
            correct_attempts: isCorrect ? 1 : 0,
            last_attempt: new Date().toISOString(),
            accuracy_rate: isCorrect ? 100 : 0,
            avg_response_time: responseTime,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        databaseLogger.error('Error creating user performance record', {
          userId,
          contentType,
          contentId,
          error: error.message,
          code: error.code,
        })
        return null
      }

      performanceRecord = data as UserPerformance
    } else {
      // Update existing performance record
      databaseLogger.debug('Updating existing user performance record', {
        userId,
        contentType,
        contentId,
      })

      const attempts = existingData.attempts + 1
      const correctAttempts = existingData.correct_attempts + (isCorrect ? 1 : 0)
      const accuracyRate = (correctAttempts / attempts) * 100
      const totalResponseTime =
        existingData.avg_response_time * existingData.attempts + responseTime
      const avgResponseTime = totalResponseTime / attempts

      const { data, error } = await supabase
        .from('user_performance')
        .update({
          attempts,
          correct_attempts: correctAttempts,
          last_attempt: new Date().toISOString(),
          accuracy_rate: parseFloat(accuracyRate.toFixed(2)),
          avg_response_time: parseFloat(avgResponseTime.toFixed(2)),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingData.id)
        .select()
        .single()

      if (error) {
        databaseLogger.error('Error updating user performance record', {
          userId,
          contentType,
          contentId,
          error: error.message,
          code: error.code,
        })
        return null
      }

      performanceRecord = data as UserPerformance
    }

    databaseLogger.info('Successfully updated user performance', {
      userId,
      contentType,
      contentId,
      id: performanceRecord.id,
    })
    return performanceRecord
  } catch (error) {
    databaseLogger.error(
      'Unexpected error updating user performance',
      { userId, contentType, contentId },
      error as Error
    )
    return null
  }
}
