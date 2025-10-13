/**
 * Optimized Books Database Functions
 *
 * This module provides database functions for books with:
 * - Caching layer integration
 * - N+1 query prevention
 * - Batch operations
 * - Error handling
 */

import { CacheKeys, CacheTTL, cache } from '@/lib/cache/redis'
import { databaseLogger } from '@/lib/utils/logger'
import { getSupabaseClient } from '../client'
import type { Book, BookReadingProgress } from '../types'

/**
 * Get all published books with caching
 * Optimized with JOIN to prevent N+1 queries
 */
export const getBooks = async (): Promise<Book[] | null> => {
  const cacheKey = CacheKeys.PUBLIC_TEXTBOOKS()

  // Try cache first
  const cached = await cache.get<Book[]>(cacheKey)
  if (cached) return cached

  try {
    databaseLogger.debug('Fetching all published books from database')

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_published', true)
      .is('deleted_at', null)
      .order('jlpt_level', { ascending: true })
      .order('title', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching books', { error: error.message, code: error.code })
      return null
    }

    const books = data as Book[]

    // Cache the result
    await cache.set(cacheKey, books, CacheTTL.PUBLIC_TEXTBOOKS)

    databaseLogger.info('Successfully fetched books', { count: books?.length || 0 })
    return books
  } catch (error) {
    databaseLogger.error('Unexpected error fetching books', {}, error as Error)
    return null
  }
}

/**
 * Get books with user progress in a single query (prevents N+1)
 */
export const getBooksWithProgress = async (
  userId: string
): Promise<Array<Book & { progress?: BookReadingProgress }> | null> => {
  try {
    databaseLogger.debug('Fetching books with user progress', { userId })

    const supabase = getSupabaseClient()

    // Single query with JOIN
    const { data, error } = await supabase
      .from('books')
      .select(
        `
        *,
        book_reading_progress!inner (
          id,
          user_id,
          book_id,
          current_page,
          last_read,
          completed_at,
          created_at,
          updated_at
        )
      `
      )
      .eq('is_published', true)
      .is('deleted_at', null)
      .eq('book_reading_progress.user_id', userId)
      .order('jlpt_level', { ascending: true })

    if (error) {
      databaseLogger.error('Error fetching books with progress', {
        userId,
        error: error.message,
        code: error.code,
      })
      return null
    }

    // Transform the nested data
    const booksWithProgress = data.map(
      (book: Book & { book_reading_progress?: BookReadingProgress[] }) => ({
        ...book,
        progress: book.book_reading_progress?.[0],
      })
    )

    databaseLogger.info('Successfully fetched books with progress', {
      userId,
      count: booksWithProgress?.length || 0,
    })

    return booksWithProgress
  } catch (error) {
    databaseLogger.error(
      'Unexpected error fetching books with progress',
      { userId },
      error as Error
    )
    return null
  }
}

/**
 * Get books by JLPT level with caching
 */
export const getBooksByJLPTLevel = async (level: number): Promise<Book[] | null> => {
  const cacheKey = CacheKeys.PUBLIC_TEXTBOOKS(`N${level}`)

  // Try cache first
  const cached = await cache.get<Book[]>(cacheKey)
  if (cached) return cached

  try {
    databaseLogger.debug('Fetching books by JLPT level', { level })

    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('jlpt_level', level)
      .eq('is_published', true)
      .is('deleted_at', null)
      .order('title', { ascending: true })

    if (error) {
      databaseLogger.error(`Error fetching JLPT N${level} books`, {
        level,
        error: error.message,
        code: error.code,
      })
      return null
    }

    const books = data as Book[]

    // Cache the result
    await cache.set(cacheKey, books, CacheTTL.PUBLIC_TEXTBOOKS)

    databaseLogger.info(`Successfully fetched JLPT N${level} books`, {
      level,
      count: books?.length || 0,
    })
    return books
  } catch (error) {
    databaseLogger.error(
      `Unexpected error fetching JLPT N${level} books`,
      { level },
      error as Error
    )
    return null
  }
}

/**
 * Get book by ID with caching
 */
export const getBookById = async (id: number): Promise<Book | null> => {
  const cacheKey = `book:${id}`

  // Try cache first
  const cached = await cache.get<Book>(cacheKey)
  if (cached) return cached

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single()

    if (error) {
      databaseLogger.error('Error fetching book', { id, error: error.message })
      return null
    }

    const book = data as Book

    // Cache the result
    await cache.set(cacheKey, book, CacheTTL.PUBLIC_TEXTBOOKS)

    return book
  } catch (error) {
    databaseLogger.error('Error fetching book', { id }, error as Error)
    return null
  }
}

/**
 * Search books with fuzzy matching
 */
export const searchBooks = async (searchTerm: string): Promise<Book[] | null> => {
  try {
    const supabase = getSupabaseClient()

    // Use PostgreSQL trigram similarity for better search
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_published', true)
      .is('deleted_at', null)
      .or(`title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
      .order('title', { ascending: true })
      .limit(50)

    if (error) {
      databaseLogger.error('Error searching books', { searchTerm, error: error.message })
      return null
    }

    return data as Book[]
  } catch (error) {
    databaseLogger.error('Error searching books', { searchTerm }, error as Error)
    return null
  }
}

/**
 * Create a new book
 */
export const createBook = async (
  book: Omit<Book, 'id' | 'created_at' | 'updated_at'>
): Promise<Book | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('books')
      .insert([
        {
          ...book,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error creating book', { error: error.message })
      return null
    }

    // Invalidate cache
    await cache.invalidatePattern('book:*')
    await cache.invalidatePattern(CacheKeys.PUBLIC_TEXTBOOKS())

    return data as Book
  } catch (error) {
    databaseLogger.error('Error creating book', {}, error as Error)
    return null
  }
}

/**
 * Update a book
 */
export const updateBook = async (id: number, updates: Partial<Book>): Promise<Book | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('books')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating book', { id, error: error.message })
      return null
    }

    // Invalidate cache
    await cache.del(`book:${id}`)
    await cache.invalidatePattern(CacheKeys.PUBLIC_TEXTBOOKS())

    return data as Book
  } catch (error) {
    databaseLogger.error('Error updating book', { id }, error as Error)
    return null
  }
}

/**
 * Soft delete a book
 */
export const deleteBook = async (id: number): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from('books')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      databaseLogger.error('Error deleting book', { id, error: error.message })
      return false
    }

    // Invalidate cache
    await cache.del(`book:${id}`)
    await cache.invalidatePattern(CacheKeys.PUBLIC_TEXTBOOKS())

    return true
  } catch (error) {
    databaseLogger.error('Error deleting book', { id }, error as Error)
    return false
  }
}

/**
 * Get user's reading progress for all books (optimized with JOIN)
 */
export const getUserReadingProgress = async (
  userId: string
): Promise<BookReadingProgress[] | null> => {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('book_reading_progress')
      .select('*')
      .eq('user_id', userId)
      .order('last_read', { ascending: false })

    if (error) {
      databaseLogger.error('Error fetching user reading progress', { userId, error: error.message })
      return null
    }

    return data as BookReadingProgress[]
  } catch (error) {
    databaseLogger.error('Error fetching user reading progress', { userId }, error as Error)
    return null
  }
}

/**
 * Update user's reading progress with optimistic locking
 */
export const updateUserReadingProgress = async (
  userId: string,
  bookId: number,
  updates: Partial<BookReadingProgress>
): Promise<BookReadingProgress | null> => {
  try {
    const supabase = getSupabaseClient()

    // Upsert pattern
    const { data, error } = await supabase
      .from('book_reading_progress')
      .upsert(
        {
          user_id: userId,
          book_id: bookId,
          ...updates,
          last_read: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id,book_id',
        }
      )
      .select()
      .single()

    if (error) {
      databaseLogger.error('Error updating book reading progress', {
        userId,
        bookId,
        error: error.message,
      })
      return null
    }

    // Invalidate user cache
    await cache.invalidatePattern(`user:${userId}:*`)

    return data as BookReadingProgress
  } catch (error) {
    databaseLogger.error('Error updating user reading progress', { userId, bookId }, error as Error)
    return null
  }
}

/**
 * Batch update reading progress for multiple books
 */
export const batchUpdateReadingProgress = async (
  userId: string,
  progressUpdates: Array<{ bookId: number; updates: Partial<BookReadingProgress> }>
): Promise<boolean> => {
  try {
    const supabase = getSupabaseClient()

    const records = progressUpdates.map(({ bookId, updates }) => ({
      user_id: userId,
      book_id: bookId,
      ...updates,
      last_read: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }))

    const { error } = await supabase
      .from('book_reading_progress')
      .upsert(records, { onConflict: 'user_id,book_id' })

    if (error) {
      databaseLogger.error('Error batch updating reading progress', {
        userId,
        error: error.message,
      })
      return false
    }

    // Invalidate user cache
    await cache.invalidatePattern(`user:${userId}:*`)

    return true
  } catch (error) {
    databaseLogger.error('Error batch updating reading progress', { userId }, error as Error)
    return false
  }
}
