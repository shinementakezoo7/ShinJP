import { databaseLogger } from '@/lib/utils/logger'
import { supabase } from '../../supabase/client'
import type { Word } from '../types'

// Get all words
export const getWords = async (): Promise<Word[] | null> => {
  try {
    databaseLogger.debug('Fetching all words')

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .order('jlpt_level', { ascending: true })
      .order('frequency_rank', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching words', { error: error.message, code: error.code })
      return null
    }

    databaseLogger.info('Successfully fetched words', { count: data?.length || 0 })
    return data as Word[]
  } catch (error) {
    databaseLogger.error('Unexpected error fetching words', {}, error as Error)
    return null
  }
}

// Get words by JLPT level
export const getWordsByJLPTLevel = async (level: number): Promise<Word[] | null> => {
  try {
    databaseLogger.debug('Fetching words by JLPT level', { level })

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('jlpt_level', level)
      .order('frequency_rank', { ascending: true })

    if (error) {
      databaseLogger.error(`Error fetching JLPT N${level} words`, {
        level,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info(`Successfully fetched JLPT N${level} words`, {
      level,
      count: data?.length || 0,
    })
    return data as Word[]
  } catch (error) {
    databaseLogger.error(
      `Unexpected error fetching JLPT N${level} words`,
      { level },
      error as Error
    )
    return null
  }
}

// Get word by ID
export const getWordById = async (id: number): Promise<Word | null> => {
  try {
    databaseLogger.debug('Fetching word by ID', { id })

    const { data, error } = await supabase.from('words').select('*').eq('id', id).single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No data found, not necessarily an error
        databaseLogger.debug('Word not found', { id })
        return null
      }
      databaseLogger.error('Error fetching word by ID', {
        id,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully fetched word by ID', { id })
    return data as Word
  } catch (error) {
    databaseLogger.error('Unexpected error fetching word by ID', { id }, error as Error)
    return null
  }
}

// Search words by word string
export const searchWords = async (searchTerm: string): Promise<Word[] | null> => {
  try {
    databaseLogger.debug('Searching words', { searchTerm })

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .ilike('word', `%${searchTerm}%`)
      .order('jlpt_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error searching words', {
        searchTerm,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully searched words', { searchTerm, count: data?.length || 0 })
    return data as Word[]
  } catch (error) {
    databaseLogger.error('Unexpected error searching words', { searchTerm }, error as Error)
    return null
  }
}

// Search words by reading
export const searchWordsByReading = async (reading: string): Promise<Word[] | null> => {
  try {
    databaseLogger.debug('Searching words by reading', { reading })

    const { data, error } = await supabase
      .from('words')
      .select('*')
      .ilike('reading', `%${reading}%`)
      .order('jlpt_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error searching words by reading', {
        reading,
        error: error.message,
        code: error.code,
      })
      return null
    }

    databaseLogger.info('Successfully searched words by reading', {
      reading,
      count: data?.length || 0,
    })
    return data as Word[]
  } catch (error) {
    databaseLogger.error('Unexpected error searching words by reading', { reading }, error as Error)
    return null
  }
}

// Create a new word
export const createWord = async (word: Omit<Word, 'id' | 'created_at'>): Promise<Word | null> => {
  try {
    databaseLogger.debug('Creating new word', { word })

    const { data, error } = await supabase
      .from('words')
      .insert([
        {
          ...word,
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating word', { word, error: error.message, code: error.code })
      return null
    }

    databaseLogger.info('Successfully created word', { id: data.id })
    return data as Word
  } catch (error) {
    databaseLogger.error('Unexpected error creating word', { word }, error as Error)
    return null
  }
}

// Update a word
export const updateWord = async (id: number, updates: Partial<Word>): Promise<Word | null> => {
  try {
    databaseLogger.debug('Updating word', { id, updates })

    const { data, error } = await supabase
      .from('words')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating word', {
        id,
        updates,
        error: error.message,
        code: error.code,
      })
      return null
    }

    if (!data) {
      databaseLogger.warn('Word not found for update', { id })
      return null
    }

    databaseLogger.info('Successfully updated word', { id })
    return data as Word
  } catch (error) {
    databaseLogger.error('Unexpected error updating word', { id, updates }, error as Error)
    return null
  }
}

// Delete a word
export const deleteWord = async (id: number): Promise<boolean> => {
  try {
    databaseLogger.debug('Deleting word', { id })

    const { error } = await supabase.from('words').delete().eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting word', { id, error: error.message, code: error.code })
      return false
    }

    databaseLogger.info('Successfully deleted word', { id })
    return true
  } catch (error) {
    databaseLogger.error('Unexpected error deleting word', { id }, error as Error)
    return false
  }
}
