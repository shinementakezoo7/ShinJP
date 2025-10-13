import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { Exercise, ExerciseType, UserExerciseAttempt } from '../types'

// --- Exercise Types ---

// Get all exercise types
export const getExerciseTypes = async (): Promise<ExerciseType[] | null> => {
  try {
    databaseLogger.debug('Fetching all exercise types')

    const { data, error } = await supabase
      .from('exercise_types')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching exercise types', {
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched exercise types', { count: data?.length || 0 })
    return data as ExerciseType[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching exercise types', {}, error as Error)
    return null
  }
}

// Get exercise type by ID
export const getExerciseTypeById = async (id: number): Promise<ExerciseType | null> => {
  try {
    databaseLogger.debug('Fetching exercise type by ID', { id })

    const { data, error } = await supabase.from('exercise_types').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Exercise type not found', { id })
        return null
      }
      databaseLogger.error('Error fetching exercise type by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched exercise type by ID', { id })
    return data as ExerciseType
  } catch (error) {
    databaseLogger.error('Unexpected error fetching exercise type by ID', { id }, error as Error)
    return null
  }
}

// Create a new exercise type
export const createExerciseType = async (
  exerciseType: Omit<ExerciseType, 'id' | 'created_at'>
): Promise<ExerciseType | null> => {
  try {
    databaseLogger.debug('Creating new exercise type', { exerciseType })

    const { data, error } = await supabase
      .from('exercise_types')
      .insert([
        {
          ...exerciseType,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating exercise type', {
        exerciseType,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created exercise type', { id: data.id })
    return data as ExerciseType
  } catch (error) {
    databaseLogger.error(
      'Unexpected error creating exercise type',
      { exerciseType },
      error as Error
    )
    return null
  }
}

// --- Exercises ---

// Get all exercises
export const getExercises = async (): Promise<Exercise[] | null> => {
  try {
    databaseLogger.debug('Fetching all exercises')

    const { data, error } = await supabase
      .from('exercises')
      .select(
        `
        *,
        exercise_type:exercise_types(name, description)
      `
      )
      .order('created_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching exercises', { error: error.message, code: error.code })
      return null
    }

    databaseLogger.info('Successfully fetched exercises', { count: data?.length || 0 })
    return data as Exercise[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching exercises', {}, error as Error)
    return null
  }
}

// Get exercises by type
export const getExercisesByType = async (typeId: number): Promise<Exercise[] | null> => {
  try {
    databaseLogger.debug('Fetching exercises by type', { typeId })

    const { data, error } = await supabase
      .from('exercises')
      .select(
        `
        *,
        exercise_type:exercise_types(name, description)
      `
      )
      .eq('exercise_type_id', typeId)
      .order('difficulty_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching exercises by type', {
        typeId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched exercises by type', {
      typeId,
      count: data?.length || 0,
    })
    return data as Exercise[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching exercises by type', { typeId }, error as Error)
    return null
  }
}

// Get exercises by JLPT level
export const getExercisesByJLPTLevel = async (level: number): Promise<Exercise[] | null> => {
  try {
    databaseLogger.debug('Fetching exercises by JLPT level', { level })

    const { data, error } = await supabase
      .from('exercises')
      .select(
        `
        *,
        exercise_type:exercise_types(name, description)
      `
      )
      .eq('jlpt_level', level)
      .order('difficulty_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching exercises by JLPT level', {
        level,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched exercises by JLPT level', {
      level,
      count: data?.length || 0,
    })
    return data as Exercise[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching exercises by JLPT level',
      { level },
      error as Error
    )
    return null
  }
}

// Get exercise by ID
export const getExerciseById = async (id: number): Promise<Exercise | null> => {
  try {
    databaseLogger.debug('Fetching exercise by ID', { id })

    const { data, error } = await supabase
      .from('exercises')
      .select(
        `
        *,
        exercise_type:exercise_types(name, description)
      `
      )
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Exercise not found', { id })
        return null
      }
      databaseLogger.error('Error fetching exercise by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched exercise by ID', { id })
    return data as Exercise
  } catch (error) {
    databaseLogger.error('Unexpected error fetching exercise by ID', { id }, error as Error)
    return null
  }
}

// Create a new exercise
export const createExercise = async (
  exercise: Omit<Exercise, 'id' | 'created_at'>
): Promise<Exercise | null> => {
  try {
    databaseLogger.debug('Creating new exercise', { exercise })

    const { data, error } = await supabase
      .from('exercises')
      .insert([
        {
          ...exercise,
          created_at: new Date().toISOString(),
        },
      ])
      .select(
        `
        *,
        exercise_type:exercise_types(name, description)
      `
      )
      .single()

    if (error) {
      databaseLogger.error('Error creating exercise', {
        exercise,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created exercise', { id: data.id })
    return data as Exercise
  } catch (error) {
    databaseLogger.error('Unexpected error creating exercise', { exercise }, error as Error)
    return null
  }
}

// Update an exercise
export const updateExercise = async (
  id: number,
  updates: Partial<Exercise>
): Promise<Exercise | null> => {
  try {
    databaseLogger.debug('Updating exercise', { id, updates })

    const { data, error } = await supabase
      .from('exercises')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select(
        `
        *,
        exercise_type:exercise_types(name, description)
      `
      )
      .single()

    if (error) {
      databaseLogger.error('Error updating exercise', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Exercise not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated exercise', { id })
    return data as Exercise
  } catch (error) {
    databaseLogger.error('Unexpected error updating exercise', { id, updates }, error as Error)
    return null
  }
}

// Delete an exercise
export const deleteExercise = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting exercise', { id })

    const { error } = await supabase.from('exercises').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting exercise', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted exercise', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting exercise', { id }, error as Error)
    return false
  }
}

// --- User Exercise Attempts ---

// Get user's exercise attempts
export const getUserExerciseAttempts = async (
  userId: string,
  exerciseId?: number
): Promise<UserExerciseAttempt[] | null> => {
  try {
    databaseLogger.debug('Fetching user exercise attempts', { userId, exerciseId })

    let query = supabase.from('user_exercise_attempts').select('*').eq('user_id', userId)

    if (exerciseId) {
      query = query.eq('exercise_id', exerciseId)
    }

    query = query.order('started_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      databaseLogger.error('Error fetching user exercise attempts', {
        userId,
        exerciseId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched user exercise attempts', {
      userId,
      exerciseId,
      count: data?.length || 0,
    })
    return data as UserExerciseAttempt[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching user exercise attempts',
      { userId, exerciseId },
      error as Error
    )
    return null
  }
}

// Get user's recent exercise attempts (last N attempts)
export const getRecentUserExerciseAttempts = async (
  userId: string,
  limit: number = 10
): Promise<UserExerciseAttempt[] | null> => {
  try {
    databaseLogger.debug('Fetching recent user exercise attempts', { userId, limit })

    const { data, error } = await supabase
      .from('user_exercise_attempts')
      .select('*')
      .eq('user_id', userId)
      .order('started_at', { ascending: false })
      .limit(limit)

    if (error) {
      databaseLogger.error('Error fetching recent user exercise attempts', {
        userId,
        limit,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched recent user exercise attempts', {
      userId,
      limit,
      count: data?.length || 0,
    })
    return data as UserExerciseAttempt[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching recent user exercise attempts',
      { userId, limit },
      error as Error
    )
    return null
  }
}

// Record a new exercise attempt
export const recordExerciseAttempt = async (
  attempt: Omit<UserExerciseAttempt, 'id' | 'created_at'>
): Promise<UserExerciseAttempt | null> => {
  try {
    databaseLogger.debug('Recording new exercise attempt', { attempt })

    const { data, error } = await supabase
      .from('user_exercise_attempts')
      .insert([
        {
          ...attempt,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error recording exercise attempt', {
        attempt,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully recorded exercise attempt', { id: data.id })
    return data as UserExerciseAttempt
  } catch (error) {
    databaseLogger.error('Unexpected error recording exercise attempt', { attempt }, error as Error)
    return null
  }
}

// Update an exercise attempt (when exercise is completed)
export const updateExerciseAttempt = async (
  id: number,
  updates: Partial<UserExerciseAttempt>
): Promise<UserExerciseAttempt | null> => {
  try {
    databaseLogger.debug('Updating exercise attempt', { id, updates })

    const { data, error } = await supabase
      .from('user_exercise_attempts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating exercise attempt', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Exercise attempt not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated exercise attempt', { id })
    return data as UserExerciseAttempt
  } catch (error) {
    databaseLogger.error(
      'Unexpected error updating exercise attempt',
      { id, updates },
      error as Error
    )
    return null
  }
}

// Get exercise statistics for a user
export const getUserExerciseStats = async (userId: string) => {
  try {
    databaseLogger.debug('Fetching user exercise stats', { userId })

    // Get total attempts
    const { count: totalAttempts, error: countError } = await supabase
      .from('user_exercise_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      databaseLogger.error('Error fetching total attempts', {
        userId,
        error: countError.message,
        code: countError.code,
      })
      return null
    }

    // Get correct attempts
    const { count: correctAttempts, error: correctError } = await supabase
      .from('user_exercise_attempts')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_correct', true)

    if (correctError) {
      databaseLogger.error('Error fetching correct attempts', {
        userId,
        error: correctError.message,
        code: correctError.code,
      })
      return null
    }

    // Get average score
    const { data: scoreData, error: scoreError } = await supabase
      .from('user_exercise_attempts')
      .select('score')
      .eq('user_id', userId)
      .not('score', 'is', null)

    if (scoreError) {
      databaseLogger.error('Error fetching scores', {
        userId,
        error: scoreError.message,
        code: scoreError.code,
      })
      return null
    }

    const averageScore =
      scoreData.length > 0
        ? scoreData.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / scoreData.length
        : 0

    // Get average time taken
    const { data: timeData, error: timeError } = await supabase
      .from('user_exercise_attempts')
      .select('time_taken')
      .eq('user_id', userId)
      .not('time_taken', 'is', null)

    if (timeError) {
      databaseLogger.error('Error fetching time data', {
        userId,
        error: timeError.message,
        code: timeError.code,
      })
      return null
    }

    const averageTime =
      timeData.length > 0
        ? timeData.reduce((sum, attempt) => sum + (attempt.time_taken || 0), 0) / timeData.length
        : 0

    const stats = {
      totalAttempts: totalAttempts || 0,
      correctAttempts: correctAttempts || 0,
      accuracyRate: totalAttempts ? Math.round(((correctAttempts || 0) / totalAttempts) * 100) : 0,
      averageScore: Math.round(averageScore * 100) / 100,
      averageTime: Math.round(averageTime),
    }

    databaseLogger.info('Successfully fetched user exercise stats', { userId, stats })
    return stats
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching user exercise stats',
      { userId },
      error as Error
    )
    return null
  }
}
