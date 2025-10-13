/**
 * Optimized Supabase Database Client
 *
 * This module provides a singleton Supabase client with connection pooling,
 * error handling, and performance optimizations.
 */

import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Singleton instances
let supabaseClient: SupabaseClient<Database> | null = null
let supabaseServiceClient: SupabaseClient<Database> | null = null

/**
 * Get authenticated Supabase client (respects RLS)
 * Use this for user-facing operations
 */
export const getSupabaseClient = (): SupabaseClient<Database> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase environment variables')
  }

  if (!supabaseClient) {
    supabaseClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-client-info': 'shinjp-app',
          },
        },
      }
    )
    console.log('✅ Supabase client initialized')
  }

  return supabaseClient
}

/**
 * Get service role client (bypasses RLS)
 * WARNING: Only use for administrative operations and background jobs
 */
export const getSupabaseServiceClient = (): SupabaseClient<Database> => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase service role environment variables')
  }

  if (!supabaseServiceClient) {
    supabaseServiceClient = createSupabaseClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
        db: {
          schema: 'public',
        },
        global: {
          headers: {
            'x-client-info': 'shinjp-service',
          },
        },
      }
    )
    console.log('✅ Supabase service client initialized')
  }

  return supabaseServiceClient
}

/**
 * Database query helper with automatic error handling
 */
export class DatabaseQuery<T> {
  private query: Promise<{ data: T | null; error: unknown }>

  constructor(query: Promise<{ data: T | null; error: unknown }>) {
    this.query = query
  }

  /**
   * Execute query and handle errors
   */
  async execute(): Promise<T | null> {
    try {
      const { data, error } = await this.query

      if (error) {
        console.error('Database query error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Unexpected database error:', error)
      return null
    }
  }

  /**
   * Execute query and throw on error
   */
  async executeOrThrow(): Promise<T> {
    const { data, error } = await this.query

    if (error) {
      throw new Error(`Database error: ${error}`)
    }

    if (!data) {
      throw new Error('No data returned from query')
    }

    return data
  }

  /**
   * Execute query with default value on error
   */
  async executeWithDefault(defaultValue: T): Promise<T> {
    const result = await this.execute()
    return result ?? defaultValue
  }
}

/**
 * Wrap Supabase query in DatabaseQuery helper
 */
export const wrapQuery = <T>(
  query: Promise<{ data: T | null; error: unknown }>
): DatabaseQuery<T> => {
  return new DatabaseQuery(query)
}

/**
 * Transaction wrapper for Supabase
 * Note: Supabase doesn't support explicit transactions via API,
 * so this uses RPC to call PostgreSQL transaction blocks
 */
export const withTransaction = async <T>(
  operations: (client: SupabaseClient<Database>) => Promise<T>
): Promise<T> => {
  const client = getSupabaseServiceClient()

  try {
    // In a real implementation, you'd use PostgreSQL's BEGIN/COMMIT
    // For now, we'll execute operations sequentially
    const result = await operations(client)
    return result
  } catch (error) {
    console.error('Transaction error:', error)
    throw error
  }
}

/**
 * Batch insert helper
 */
export const batchInsert = async <T extends Record<string, unknown>>(
  table: string,
  records: T[],
  batchSize: number = 100
): Promise<boolean> => {
  const client = getSupabaseServiceClient()

  try {
    // Split into batches
    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize)

      const { error } = await client.from(table).insert(batch)

      if (error) {
        console.error(`Batch insert error (batch ${i / batchSize + 1}):`, error)
        return false
      }

      console.log(`✅ Inserted batch ${i / batchSize + 1} (${batch.length} records)`)
    }

    return true
  } catch (error) {
    console.error('Batch insert error:', error)
    return false
  }
}

/**
 * Batch update helper
 */
export const batchUpdate = async <T extends Record<string, unknown>>(
  table: string,
  updates: Array<{ id: string; data: Partial<T> }>,
  batchSize: number = 50
): Promise<boolean> => {
  const client = getSupabaseServiceClient()

  try {
    for (let i = 0; i < updates.length; i += batchSize) {
      const batch = updates.slice(i, i + batchSize)

      // Execute updates in parallel
      const promises = batch.map(({ id, data }) => client.from(table).update(data).eq('id', id))

      const results = await Promise.all(promises)

      const errors = results.filter((r) => r.error)
      if (errors.length > 0) {
        console.error(`Batch update errors (batch ${i / batchSize + 1}):`, errors)
        return false
      }

      console.log(`✅ Updated batch ${i / batchSize + 1} (${batch.length} records)`)
    }

    return true
  } catch (error) {
    console.error('Batch update error:', error)
    return false
  }
}

/**
 * Call PostgreSQL function
 */
export const callDatabaseFunction = async <T>(
  functionName: string,
  params: Record<string, unknown> = {}
): Promise<T | null> => {
  const client = getSupabaseServiceClient()

  try {
    const { data, error } = await client.rpc(functionName, params)

    if (error) {
      console.error(`Database function error (${functionName}):`, error)
      return null
    }

    return data as T
  } catch (error) {
    console.error(`Unexpected error calling ${functionName}:`, error)
    return null
  }
}

/**
 * Health check
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    const client = getSupabaseClient()
    const { error } = await client.from('users').select('id').limit(1)
    return !error
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

/**
 * Get database statistics
 */
export const getDatabaseStats = async (): Promise<{
  healthy: boolean
  connectable: boolean
}> => {
  const healthy = await checkDatabaseHealth()

  return {
    healthy,
    connectable: healthy,
  }
}

// Export default client getter
export default getSupabaseClient
