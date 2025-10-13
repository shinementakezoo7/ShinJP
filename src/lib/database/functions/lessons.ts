import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { LessonItem, LessonModule, UserLessonProgress } from '../types'

// Get all lesson modules
export const getLessonModules = async (): Promise<LessonModule[] | null> => {
  try {
    databaseLogger.debug('Fetching all lesson modules')

    const { data, error } = await supabase
      .from('lesson_modules')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('jlpt_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching lesson modules', {
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched lesson modules', { count: data?.length || 0 })
    return data as LessonModule[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching lesson modules', {}, error as Error)
    return null
  }
}

// Get lesson modules by JLPT level
export const getLessonModulesByJLPTLevel = async (
  level: number
): Promise<LessonModule[] | null> => {
  try {
    databaseLogger.debug('Fetching lesson modules by JLPT level', { level })

    const { data, error } = await supabase
      .from('lesson_modules')
      .select('*')
      .eq('jlpt_level', level)
      .eq('is_active', true)
      .order('sort_order', { ascending: true })

    if (error) {
      databaseLogger.error(`Error fetching JLPT N${level} lesson modules`, {
        level,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info(`Successfully fetched JLPT N${level} lesson modules`, {
      level,
      count: data?.length || 0,
    })
    return data as LessonModule[]
  } catch (error) {
    databaseLogger.error(
      `Unexpected error fetching JLPT N${level} lesson modules`,
      { level },
      error as Error
    )
    return null
  }
}

// Get lesson module by ID
export const getLessonModuleById = async (id: number): Promise<LessonModule | null> => {
  try {
    databaseLogger.debug('Fetching lesson module by ID', { id })

    const { data, error } = await supabase.from('lesson_modules').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Lesson module not found', { id })
        return null
      }
      databaseLogger.error('Error fetching lesson module by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched lesson module by ID', { id })
    return data as LessonModule
  } catch (error) {
    databaseLogger.error('Unexpected error fetching lesson module by ID', { id }, error as Error)
    return null
  }
}

// Create a new lesson module
export const createLessonModule = async (
  lessonModule: Omit<LessonModule, 'id' | 'created_at' | 'updated_at'>
): Promise<LessonModule | null> => {
  try {
    databaseLogger.debug('Creating new lesson module', { lessonModule })

    const { data, error } = await supabase
      .from('lesson_modules')
      .insert([
        {
          ...lessonModule,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating lesson module', {
        lessonModule,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created lesson module', { id: data.id })
    return data as LessonModule
  } catch (error) {
    databaseLogger.error(
      'Unexpected error creating lesson module',
      { lessonModule },
      error as Error
    )
    return null
  }
}

// Update a lesson module
export const updateLessonModule = async (
  id: number,
  updates: Partial<LessonModule>
): Promise<LessonModule | null> => {
  try {
    databaseLogger.debug('Updating lesson module', { id, updates })

    const { data, error } = await supabase
      .from('lesson_modules')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating lesson module', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Lesson module not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated lesson module', { id })
    return data as LessonModule
  } catch (error) {
    databaseLogger.error('Unexpected error updating lesson module', { id, updates }, error as Error)
    return null
  }
}

// Delete a lesson module
export const deleteLessonModule = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting lesson module', { id })

    const { error } = await supabase.from('lesson_modules').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting lesson module', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted lesson module', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting lesson module', { id }, error as Error)
    return false
  }
}

// Get lesson items for a module
export const getLessonItemsByModule = async (moduleId: number): Promise<LessonItem[] | null> => {
  try {
    databaseLogger.debug('Fetching lesson items by module', { moduleId })

    const { data, error } = await supabase
      .from('lesson_items')
      .select('*')
      .eq('lesson_module_id', moduleId)
      .order('sort_order', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching lesson items', {
        moduleId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched lesson items', { moduleId, count: data?.length || 0 })
    return data as LessonItem[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching lesson items', { moduleId }, error as Error)
    return null
  }
}

// Get lesson item by ID
export const getLessonItemById = async (id: number): Promise<LessonItem | null> => {
  try {
    databaseLogger.debug('Fetching lesson item by ID', { id })

    const { data, error } = await supabase.from('lesson_items').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Lesson item not found', { id })
        return null
      }
      databaseLogger.error('Error fetching lesson item by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched lesson item by ID', { id })
    return data as LessonItem
  } catch (error) {
    databaseLogger.error('Unexpected error fetching lesson item by ID', { id }, error as Error)
    return null
  }
}

// Create a new lesson item
export const createLessonItem = async (
  lessonItem: Omit<LessonItem, 'id' | 'created_at'>
): Promise<LessonItem | null> => {
  try {
    databaseLogger.debug('Creating new lesson item', { lessonItem })

    const { data, error } = await supabase
      .from('lesson_items')
      .insert([
        {
          ...lessonItem,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating lesson item', {
        lessonItem,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created lesson item', { id: data.id })
    return data as LessonItem
  } catch (error) {
    databaseLogger.error('Unexpected error creating lesson item', { lessonItem }, error as Error)
    return null
  }
}

// Update a lesson item
export const updateLessonItem = async (
  id: number,
  updates: Partial<LessonItem>
): Promise<LessonItem | null> => {
  try {
    databaseLogger.debug('Updating lesson item', { id, updates })

    const { data, error } = await supabase
      .from('lesson_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating lesson item', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Lesson item not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated lesson item', { id })
    return data as LessonItem
  } catch (error) {
    databaseLogger.error('Unexpected error updating lesson item', { id, updates }, error as Error)
    return null
  }
}

// Delete a lesson item
export const deleteLessonItem = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting lesson item', { id })

    const { error } = await supabase.from('lesson_items').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting lesson item', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted lesson item', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting lesson item', { id }, error as Error)
    return false
  }
}

// Get user lesson progress
export const getUserLessonProgress = async (
  userId: string,
  moduleId?: number
): Promise<UserLessonProgress[] | null> => {
  try {
    databaseLogger.debug('Fetching user lesson progress', { userId, moduleId })

    let query = supabase.from('user_lesson_progress').select('*').eq('user_id', userId)

    if (moduleId) {
      query = query.eq('lesson_module_id', moduleId)
    }

    const { data, error } = await query.order('started_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching user lesson progress', {
        userId,
        moduleId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched user lesson progress', {
      userId,
      moduleId,
      count: data?.length || 0,
    })
    return data as UserLessonProgress[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching user lesson progress',
      { userId, moduleId },
      error as Error
    )
    return null
  }
}

// Get user progress for a specific module
export const getUserProgressForModule = async (
  userId: string,
  moduleId: number
): Promise<UserLessonProgress | null> => {
  try {
    databaseLogger.debug('Fetching user progress for module', { userId, moduleId })

    const { data, error } = await supabase
      .from('user_lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_module_id', moduleId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('User progress for module not found', { userId, moduleId })
        return null
      }
      databaseLogger.error('Error fetching user progress for module', {
        userId,
        moduleId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched user progress for module', { userId, moduleId })
    return data as UserLessonProgress
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching user progress for module',
      { userId, moduleId },
      error as Error
    )
    return null
  }
}

// Create or update user lesson progress
export const updateUserLessonProgress = async (
  userId: string,
  moduleId: number,
  updates: Partial<UserLessonProgress>
): Promise<UserLessonProgress | null> => {
  try {
    databaseLogger.debug('Updating user lesson progress', { userId, moduleId, updates })

    // Check if progress record exists
    const existingProgress = await getUserProgressForModule(userId, moduleId)

    let progressRecord: UserLessonProgress

    if (existingProgress) {
      // Update existing progress
      databaseLogger.debug('Updating existing lesson progress record', { userId, moduleId })

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingProgress.id)
        .select()
        .single()

      if (error) {
        databaseLogger.error('Error updating user lesson progress', {
          userId,
          moduleId,
          error: error.message,
          code: error.code,
        })
        return null
      }

      progressRecord = data as UserLessonProgress
    } else {
      // Create new progress record
      databaseLogger.debug('Creating new lesson progress record', { userId, moduleId })

      const { data, error } = await supabase
        .from('user_lesson_progress')
        .insert([
          {
            user_id: userId,
            lesson_module_id: moduleId,
            started_at: new Date().toISOString(),
            ...updates,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single()

      if (error) {
        databaseLogger.error('Error creating user lesson progress', {
          userId,
          moduleId,
          error: error.message,
          code: error.code,
        })
        return null
      }

      progressRecord = data as UserLessonProgress
    }

    databaseLogger.info('Successfully updated user lesson progress', {
      userId,
      moduleId,
      id: progressRecord.id,
    })
    return progressRecord
  } catch (error) {
    databaseLogger.error(
      'Unexpected error updating user lesson progress',
      { userId, moduleId },
      error as Error
    )
    return null
  }
}

// Mark lesson module as completed
export const completeLessonModule = async (
  userId: string,
  moduleId: number,
  quizScore?: number
): Promise<UserLessonProgress | null> => {
  try {
    databaseLogger.debug('Completing lesson module', { userId, moduleId, quizScore })

    const completionTime = new Date().toISOString()

    const progress = await updateUserLessonProgress(userId, moduleId, {
      completed_at: completionTime,
      completion_percentage: 100,
      quiz_score: quizScore,
    })

    if (progress) {
      databaseLogger.info('Successfully completed lesson module', { userId, moduleId, quizScore })
    } else {
      databaseLogger.warn('Failed to complete lesson module', { userId, moduleId, quizScore })
    }

    return progress
  } catch (error) {
    databaseLogger.error(
      'Unexpected error completing lesson module',
      { userId, moduleId, quizScore },
      error as Error
    )
    return null
  }
}
