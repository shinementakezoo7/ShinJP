import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { Character } from '../types'

// Get all characters
export const getCharacters = async (): Promise<Character[] | null> => {
  try {
    databaseLogger.debug('Fetching all characters')

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('jlpt_level', { ascending: true })
      .order('frequency_rank', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching characters', { error: error.message, code: error.code })
      return null
    }

    databaseLogger.info('Successfully fetched characters', { count: data?.length || 0 })
    return data as Character[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching characters', {}, error as Error)
    return null
  }
}

// Get characters by type
export const getCharactersByType = async (
  type: 'hiragana' | 'katakana' | 'kanji'
): Promise<Character[] | null> => {
  try {
    databaseLogger.debug('Fetching characters by type', { type })

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('type', type)
      .order('jlpt_level', { ascending: true })
      .order('frequency_rank', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching characters by type', {
        type,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched characters by type', {
      type,
      count: data?.length || 0,
    })
    return data as Character[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching characters by type', { type }, error as Error)
    return null
  }
}

// Get characters by JLPT level
export const getCharactersByJLPTLevel = async (level: number): Promise<Character[] | null> => {
  try {
    databaseLogger.debug('Fetching characters by JLPT level', { level })

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('jlpt_level', level)
      .order('frequency_rank', { ascending: true })

    if (error) {
      databaseLogger.error(`Error fetching JLPT N${level} characters`, {
        level,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info(`Successfully fetched JLPT N${level} characters`, {
      level,
      count: data?.length || 0,
    })
    return data as Character[]
  } catch (error) {
    databaseLogger.error(
      `Unexpected error fetching JLPT N${level} characters`,
      { level },
      error as Error
    )
    return null
  }
}

// Get character by ID
export const getCharacterById = async (id: number): Promise<Character | null> => {
  try {
    databaseLogger.debug('Fetching character by ID', { id })

    const { data, error } = await supabase.from('characters').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Character not found', { id })
        return null
      }
      databaseLogger.error('Error fetching character by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched character by ID', { id })
    return data as Character
  } catch (error) {
    databaseLogger.error('Unexpected error fetching character by ID', { id }, error as Error)
    return null
  }
}

// Search characters by character string
export const searchCharacters = async (searchTerm: string): Promise<Character[] | null> => {
  try {
    databaseLogger.debug('Searching characters', { searchTerm })

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .ilike('character', `%${searchTerm}%`)
      .order('jlpt_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error searching characters', {
        searchTerm,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully searched characters', {
      searchTerm,
      count: data?.length || 0,
    })
    return data as Character[]
  } catch (error) {
    databaseLogger.error('Unexpected error searching characters', { searchTerm }, error as Error)
    return null
  }
}

// Create a new character
export const createCharacter = async (
  character: Omit<Character, 'id' | 'created_at'>
): Promise<Character | null> => {
  try {
    databaseLogger.debug('Creating new character', { character })

    const { data, error } = await supabase
      .from('characters')
      .insert([
        {
          ...character,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating character', {
        character,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully created character', { id: data.id })
    return data as Character
  } catch (error) {
    databaseLogger.error('Unexpected error creating character', { character }, error as Error)
    return null
  }
}

// Update a character
export const updateCharacter = async (
  id: number,
  updates: Partial<Character>
): Promise<Character | null> => {
  try {
    databaseLogger.debug('Updating character', { id, updates })

    const { data, error } = await supabase
      .from('characters')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating character', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Character not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated character', { id })
    return data as Character
  } catch (error) {
    databaseLogger.error('Unexpected error updating character', { id, updates }, error as Error)
    return null
  }
}

// Delete a character
export const deleteCharacter = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting character', { id })

    const { error } = await supabase.from('characters').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting character', {
        id,
        error: error.message,
        code: error.code,
      })
      return false
    }

    databaseLogger.info('Successfully deleted character', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting character', { id }, error as Error)
    return false
  }
}
