import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { GrammarPoint } from '../types'

// Get all grammar points
export const getGrammarPoints = async (): Promise<GrammarPoint[] | null> => {
  try {
    databaseLogger.debug('Fetching all grammar points')

    const { data, error } = await supabase
      .from('grammar_points')
      .select('*')
      .order('jlpt_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching grammar points', {
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched grammar points', { count: data?.length || 0 })
    return data as GrammarPoint[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching grammar points', {}, error as Error)
    return null
  }
}

// Get grammar points by JLPT level
export const getGrammarPointsByJLPTLevel = async (
  level: number
): Promise<GrammarPoint[] | null> => {
  try {
    databaseLogger.debug('Fetching grammar points by JLPT level', { level })

    const { data, error } = await supabase
      .from('grammar_points')
      .select('*')
      .eq('jlpt_level', level)
      .order('id', { ascending: true })

    if (error) {
      databaseLogger.error(`Error fetching JLPT N${level} grammar points`, {
        level,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info(`Successfully fetched JLPT N${level} grammar points`, {
      level,
      count: data?.length || 0,
    })
    return data as GrammarPoint[]
  } catch (error) {
    databaseLogger.error(
      `Unexpected error fetching JLPT N${level} grammar points`,
      { level },
      error as Error
    )
    return null
  }
}

// Get grammar point by ID
export const getGrammarPointById = async (id: number): Promise<GrammarPoint | null> => {
  try {
    databaseLogger.debug('Fetching grammar point by ID', { id })

    const { data, error } = await supabase.from('grammar_points').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Grammar point not found', { id })
        return null
      }
      databaseLogger.error('Error fetching grammar point by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched grammar point by ID', { id })
    return data as GrammarPoint
  } catch (error) {
    databaseLogger.error('Unexpected error fetching grammar point by ID', { id }, error as Error)
    return null
  }
}

// Search grammar points by title or structure
export const searchGrammarPoints = async (searchTerm: string): Promise<GrammarPoint[] | null> => {
  try {
    databaseLogger.debug('Searching grammar points', { searchTerm })

    const { data, error } = await supabase
      .from('grammar_points')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,structure.ilike.%${searchTerm}%`)
      .order('jlpt_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error searching grammar points', {
        searchTerm,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully searched grammar points', {
      searchTerm,
      count: data?.length || 0,
    })
    return data as GrammarPoint[]
  } catch (error) {
    databaseLogger.error(
      'Unexpected error searching grammar points',
      { searchTerm },
      error as Error
    )
    return null
  }
}

// Create a new grammar point
export const createGrammarPoint = async (
  grammarPoint: Omit<GrammarPoint, 'id' | 'created_at'>
): Promise<GrammarPoint | null> => {
  try {
    databaseLogger.debug('Creating new grammar point', { grammarPoint })

    const { data, error } = await supabase
      .from('grammar_points')
      .insert([
        {
          ...grammarPoint,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating grammar point', {
        grammarPoint,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created grammar point', { id: data.id })
    return data as GrammarPoint
  } catch (error) {
    databaseLogger.error(
      'Unexpected error creating grammar point',
      { grammarPoint },
      error as Error
    )
    return null
  }
}

// Update a grammar point
export const updateGrammarPoint = async (
  id: number,
  updates: Partial<GrammarPoint>
): Promise<GrammarPoint | null> => {
  try {
    databaseLogger.debug('Updating grammar point', { id, updates })

    const { data, error } = await supabase
      .from('grammar_points')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating grammar point', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Grammar point not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated grammar point', { id })
    return data as GrammarPoint
  } catch (error) {
    databaseLogger.error('Unexpected error updating grammar point', { id, updates }, error as Error)
    return null
  }
}

// Delete a grammar point
export const deleteGrammarPoint = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting grammar point', { id })

    const { error } = await supabase.from('grammar_points').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting grammar point', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted grammar point', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting grammar point', { id }, error as Error)
    return false
  }
}
