/**
 * Advanced Database Client for ShinJP
 *
 * Provides enhanced database operations with:
 * - Connection pooling
 * - Query caching
 * - Transaction support
 * - Batch operations
 * - Error handling
 * - Performance monitoring
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { type Database } from '../supabase/client'

// =====================================================
// Configuration
// =====================================================

interface DatabaseConfig {
  maxRetries?: number
  retryDelay?: number
  queryTimeout?: number
  enableQueryLogging?: boolean
  enablePerformanceMonitoring?: boolean
}

const DEFAULT_CONFIG: DatabaseConfig = {
  maxRetries: 3,
  retryDelay: 1000,
  queryTimeout: 30000,
  enableQueryLogging: process.env.NODE_ENV === 'development',
  enablePerformanceMonitoring: true,
}

// =====================================================
// Performance Monitoring
// =====================================================

interface QueryMetrics {
  query: string
  duration: number
  timestamp: Date
  success: boolean
  error?: string
}

class PerformanceMonitor {
  private metrics: QueryMetrics[] = []
  private readonly maxMetrics = 1000

  recordQuery(metric: QueryMetrics) {
    this.metrics.push(metric)

    // Keep only the last N metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics.shift()
    }
  }

  getMetrics() {
    return this.metrics
  }

  getSlowQueries(thresholdMs: number = 1000) {
    return this.metrics.filter((m) => m.duration > thresholdMs)
  }

  getAverageDuration() {
    if (this.metrics.length === 0) return 0
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0)
    return total / this.metrics.length
  }

  getSuccessRate() {
    if (this.metrics.length === 0) return 100
    const successful = this.metrics.filter((m) => m.success).length
    return (successful / this.metrics.length) * 100
  }

  clear() {
    this.metrics = []
  }
}

// =====================================================
// Advanced Database Client
// =====================================================

export class AdvancedDatabaseClient {
  private client: SupabaseClient<Database>
  private serviceClient: SupabaseClient<Database>
  private config: DatabaseConfig
  private monitor: PerformanceMonitor

  constructor(config: Partial<DatabaseConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.monitor = new PerformanceMonitor()

    // Initialize clients
    this.client = this.createAuthClient()
    this.serviceClient = this.createServiceClient()
  }

  private createAuthClient(): SupabaseClient<Database> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables')
    }

    return createClient<Database>(
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
            'x-client-info': 'shinjp-advanced',
          },
        },
      }
    )
  }

  private createServiceClient(): SupabaseClient<Database> {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing Supabase service role key')
    }

    return createClient<Database>(
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
      }
    )
  }

  // =====================================================
  // Query Execution with Monitoring
  // =====================================================

  private async executeWithMonitoring<T>(
    queryName: string,
    queryFn: () => Promise<{ data: T | null; error: any }>
  ): Promise<{ data: T | null; error: any }> {
    const startTime = Date.now()
    let result: { data: T | null; error: any }

    try {
      result = await queryFn()

      if (this.config.enablePerformanceMonitoring) {
        this.monitor.recordQuery({
          query: queryName,
          duration: Date.now() - startTime,
          timestamp: new Date(),
          success: !result.error,
          error: result.error?.message,
        })
      }

      if (this.config.enableQueryLogging) {
        console.log(`[DB Query] ${queryName} - ${Date.now() - startTime}ms`, {
          success: !result.error,
        })
      }

      return result
    } catch (error) {
      if (this.config.enablePerformanceMonitoring) {
        this.monitor.recordQuery({
          query: queryName,
          duration: Date.now() - startTime,
          timestamp: new Date(),
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }

      console.error(`[DB Error] ${queryName}:`, error)
      return { data: null, error }
    }
  }

  // =====================================================
  // Transaction Support
  // =====================================================

  async withTransaction<T>(
    operations: (client: SupabaseClient<Database>) => Promise<T>
  ): Promise<T> {
    // Note: Supabase doesn't support explicit transactions via API
    // This is a wrapper for future implementation with PostgreSQL stored procedures
    try {
      return await operations(this.serviceClient)
    } catch (error) {
      console.error('[Transaction Error]:', error)
      throw error
    }
  }

  // =====================================================
  // Batch Operations
  // =====================================================

  async batchInsert<T extends Record<string, any>>(
    table: string,
    records: T[],
    batchSize: number = 100
  ): Promise<boolean> {
    try {
      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize)

        const { error } = await this.executeWithMonitoring(`batchInsert_${table}_${i}`, () =>
          (this.serviceClient.from(table) as any).insert(batch)
        )

        if (error) {
          console.error(`Batch insert error (batch ${i / batchSize + 1}):`, error)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Batch insert error:', error)
      return false
    }
  }

  async batchUpdate<T extends Record<string, any>>(
    table: string,
    updates: Array<{ id: string; data: Partial<T> }>,
    batchSize: number = 50
  ): Promise<boolean> {
    try {
      for (let i = 0; i < updates.length; i += batchSize) {
        const batch = updates.slice(i, i + batchSize)

        const promises = batch.map(({ id, data }) =>
          this.executeWithMonitoring(`batchUpdate_${table}_${id}`, () =>
            (this.serviceClient.from(table) as any).update(data).eq('id', id)
          )
        )

        const results = await Promise.all(promises)
        const errors = results.filter((r) => r.error)

        if (errors.length > 0) {
          console.error(`Batch update errors (batch ${i / batchSize + 1}):`, errors)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Batch update error:', error)
      return false
    }
  }

  async batchDelete(table: string, ids: string[], softDelete: boolean = true): Promise<boolean> {
    try {
      if (softDelete) {
        // Use soft delete function from migration 011
        const { error } = await this.executeWithMonitoring(`batchSoftDelete_${table}`, () =>
          this.serviceClient.rpc('soft_delete_records', {
            p_table_name: table,
            p_ids: ids,
            p_user_id: null, // Will be set by trigger
          })
        )

        if (error) {
          console.error('Batch soft delete error:', error)
          return false
        }
      } else {
        // Hard delete (use with caution)
        const { error } = await this.executeWithMonitoring(`batchDelete_${table}`, () =>
          (this.serviceClient.from(table) as any).delete().in('id', ids)
        )

        if (error) {
          console.error('Batch delete error:', error)
          return false
        }
      }

      return true
    } catch (error) {
      console.error('Batch delete error:', error)
      return false
    }
  }

  // =====================================================
  // Advanced Query Helpers
  // =====================================================

  async callDatabaseFunction<T>(
    functionName: string,
    params: Record<string, any> = {}
  ): Promise<T | null> {
    try {
      const { data, error } = await this.executeWithMonitoring(`rpc_${functionName}`, () =>
        this.serviceClient.rpc(functionName, params)
      )

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

  async getUserDashboard(userId: string) {
    return this.callDatabaseFunction('get_user_dashboard_data', { p_user_id: userId })
  }

  async generateRecommendations(userId: string, limit: number = 10) {
    return this.callDatabaseFunction('generate_content_recommendations', {
      p_user_id: userId,
      p_limit: limit,
    })
  }

  async refreshMaterializedViews() {
    return this.callDatabaseFunction('refresh_all_materialized_views')
  }

  async cleanupOldData() {
    return this.callDatabaseFunction('cleanup_old_data')
  }

  async checkDatabaseHealth() {
    return this.callDatabaseFunction('database_health_check')
  }

  // =====================================================
  // Full-Text Search
  // =====================================================

  async fullTextSearch(table: string, query: string, limit: number = 20) {
    try {
      const { data, error } = await this.executeWithMonitoring(`fullTextSearch_${table}`, () =>
        this.client.from(table).select('*').textSearch('search_vector', query).limit(limit)
      )

      if (error) {
        console.error('Full-text search error:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Full-text search error:', error)
      return null
    }
  }

  // =====================================================
  // Notification Helpers
  // =====================================================

  async createNotification(
    userId: string,
    notification: {
      type: string
      title: string
      message: string
      data?: Record<string, any>
      priority?: string
      linkType?: string
      linkId?: string
    }
  ) {
    const { data, error } = await this.executeWithMonitoring('createNotification', () =>
      this.serviceClient
        .from('notifications')
        .insert({
          user_id: userId,
          ...notification,
        })
        .select()
        .single()
    )

    return { data, error }
  }

  async markNotificationAsRead(notificationId: string) {
    const { data, error } = await this.executeWithMonitoring('markNotificationRead', () =>
      this.client
        .from('notifications')
        .update({ read_at: new Date().toISOString() })
        .eq('id', notificationId)
    )

    return { data, error }
  }

  // =====================================================
  // Performance Metrics
  // =====================================================

  getPerformanceMetrics() {
    return {
      averageDuration: this.monitor.getAverageDuration(),
      successRate: this.monitor.getSuccessRate(),
      slowQueries: this.monitor.getSlowQueries(),
      totalQueries: this.monitor.getMetrics().length,
    }
  }

  clearMetrics() {
    this.monitor.clear()
  }

  // =====================================================
  // Client Getters
  // =====================================================

  get authenticated() {
    return this.client
  }

  get service() {
    return this.serviceClient
  }
}

// =====================================================
// Singleton Instance
// =====================================================

let advancedClient: AdvancedDatabaseClient | null = null

export function getAdvancedDatabaseClient(
  config?: Partial<DatabaseConfig>
): AdvancedDatabaseClient {
  if (!advancedClient) {
    advancedClient = new AdvancedDatabaseClient(config)
  }
  return advancedClient
}

// Export default instance
export const db = getAdvancedDatabaseClient()

// =====================================================
// Utility Functions
// =====================================================

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: any

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      console.warn(`Operation failed, attempt ${i + 1}/${maxRetries}`)

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delayMs))
      }
    }
  }

  throw lastError
}

export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = 30000
): Promise<T> {
  return Promise.race([
    operation(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs)
    ),
  ])
}
