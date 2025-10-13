import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { AIContentInteractions, AIGeneratedContent } from '../types'

// Get all AI generated content
export const getAIContent = async (): Promise<AIGeneratedContent[] | null> => {
  try {
    databaseLogger.debug('Fetching all AI generated content')

    const { data, error } = await supabase
      .from('ai_generated_content')
      .select('*')
      .eq('is_published', true)
      .order('generated_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching AI content', { error: error.message, code: error.code })
      return null
    }

    databaseLogger.info('Successfully fetched AI content', { count: data?.length || 0 })
    return data as AIGeneratedContent[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching AI content', {}, error as Error)
    return null
  }
}

// Get AI content by ID
export const getAIContentById = async (id: number): Promise<AIGeneratedContent | null> => {
  try {
    databaseLogger.debug('Fetching AI content by ID', { id })

    const { data, error } = await supabase
      .from('ai_generated_content')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('AI content not found', { id })
        return null
      }
      databaseLogger.error('Error fetching AI content by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched AI content by ID', { id })
    return data as AIGeneratedContent
  } catch (error) {
    databaseLogger.error('Unexpected error fetching AI content by ID', { id }, error as Error)
    return null
  }
}

// Get AI content by type
export const getAIContentByType = async (
  type: 'story' | 'dialogue' | 'exercise' | 'explanation'
): Promise<AIGeneratedContent[] | null> => {
  try {
    databaseLogger.debug('Fetching AI content by type', { type })

    const { data, error } = await supabase
      .from('ai_generated_content')
      .select('*')
      .eq('content_type', type)
      .eq('is_published', true)
      .order('generated_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching AI content by type', {
        type,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched AI content by type', {
      type,
      count: data?.length || 0,
    })
    return data as AIGeneratedContent[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching AI content by type', { type }, error as Error)
    return null
  }
}

// Get AI content by JLPT level
export const getAIContentByJLPTLevel = async (
  level: number
): Promise<AIGeneratedContent[] | null> => {
  try {
    databaseLogger.debug('Fetching AI content by JLPT level', { level })

    const { data, error } = await supabase
      .from('ai_generated_content')
      .select('*')
      .eq('jlpt_level', level)
      .eq('is_published', true)
      .order('generated_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching AI content by JLPT level', {
        level,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched AI content by JLPT level', {
      level,
      count: data?.length || 0,
    })
    return data as AIGeneratedContent[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching AI content by JLPT level',
      { level },
      error as Error
    )
    return null
  }
}

// Create new AI generated content
export const createAIContent = async (
  content: Omit<AIGeneratedContent, 'id' | 'generated_at'>
): Promise<AIGeneratedContent | null> => {
  try {
    databaseLogger.debug('Creating new AI content', { content })

    const { data, error } = await supabase
      .from('ai_generated_content')
      .insert([
        {
          ...content,
          generated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating AI content', {
        content,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created AI content', { id: data.id })
    return data as AIGeneratedContent
  } catch (error) {
    databaseLogger.error('Unexpected error creating AI content', { content }, error as Error)
    return null
  }
}

// Update AI generated content
export const updateAIContent = async (
  id: number,
  updates: Partial<AIGeneratedContent>
): Promise<AIGeneratedContent | null> => {
  try {
    databaseLogger.debug('Updating AI content', { id, updates })

    const { data, error } = await supabase
      .from('ai_generated_content')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating AI content', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('AI content not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated AI content', { id })
    return data as AIGeneratedContent
  } catch (error) {
    databaseLogger.error('Unexpected error updating AI content', { id, updates }, error as Error)
    return null
  }
}

// Delete AI generated content
export const deleteAIContent = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting AI content', { id })

    const { error } = await supabase.from('ai_generated_content').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting AI content', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted AI content', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting AI content', { id }, error as Error)
    return false
  }
}

// Get user interactions with AI content
export const getUserAIInteractions = async (
  userId: string,
  contentId?: number
): Promise<AIContentInteractions[] | null> => {
  try {
    databaseLogger.debug('Fetching user AI interactions', { userId, contentId })

    let query = supabase.from('ai_content_interactions').select('*').eq('user_id', userId)

    if (contentId) {
      query = query.eq('content_id', contentId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching user AI interactions', {
        userId,
        contentId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched user AI interactions', {
      userId,
      contentId,
      count: data?.length || 0,
    })
    return data as AIContentInteractions[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching user AI interactions',
      { userId, contentId },
      error as Error
    )
    return null
  }
}

// Record user interaction with AI content
export const recordAIInteraction = async (
  interaction: Omit<AIContentInteractions, 'id' | 'created_at'>
): Promise<AIContentInteractions | null> => {
  try {
    databaseLogger.debug('Recording AI interaction', { interaction })

    const { data, error } = await supabase
      .from('ai_content_interactions')
      .insert([
        {
          ...interaction,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error recording AI interaction', {
        interaction,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully recorded AI interaction', { id: data.id })
    return data as AIContentInteractions
  } catch (error) {
    databaseLogger.error(
      'Unexpected error recording AI interaction',
      { interaction },
      error as Error
    )
    return null
  }
}

// Update user interaction with AI content
export const updateAIInteraction = async (
  id: number,
  updates: Partial<AIContentInteractions>
): Promise<AIContentInteractions | null> => {
  try {
    databaseLogger.debug('Updating AI interaction', { id, updates })

    const { data, error } = await supabase
      .from('ai_content_interactions')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating AI interaction', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('AI interaction not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated AI interaction', { id })
    return data as AIContentInteractions
  } catch (error) {
    databaseLogger.error(
      'Unexpected error updating AI interaction',
      { id, updates },
      error as Error
    )
    return null
  }
}
