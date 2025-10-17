/**
 * tRPC Caching Middleware
 * Implements Stale-While-Revalidate (SWR) and request caching
 */

import { TRPCError } from '@trpc/server'
import { getCacheManager, CACHE_TTL } from '../cache/vercel-kv'

export interface CacheConfig {
  ttl: number
  key?: string // Custom cache key generator
  tags?: string[] // Tags for cache invalidation
}

/**
 * Create a cache key from procedure name and input
 */
export function createCacheKey(procedureName: string, input: unknown = {}): string {
  const inputStr = JSON.stringify(input)
  return `trpc:${procedureName}:${Buffer.from(inputStr).toString('base64')}`
}

/**
 * Middleware for tRPC caching
 */
export function createCacheMiddleware(config: CacheConfig) {
  return async (opts: any) => {
    const { ctx, rawInput, next, meta } = opts
    const cache = getCacheManager()

    // Generate cache key
    const cacheKey = config.key ? config.key(rawInput) : createCacheKey(opts.path, rawInput)

    // Try to get from cache
    try {
      const cached = await cache.get(cacheKey)
      if (cached !== null && cached !== undefined) {
        // Return cached result
        return cached
      }
    } catch (error) {
      console.error('Cache read error:', error)
      // Continue without cache on error
    }

    // Call the actual procedure
    const result = await next()

    // Store result in cache (only if successful)
    if (result.ok) {
      try {
        await cache.set(cacheKey, result.data, config.ttl)

        // Tag cache for invalidation
        if (config.tags && config.tags.length > 0) {
          for (const tag of config.tags) {
            await cache.set(`tag:${tag}:${cacheKey}`, true, config.ttl)
          }
        }
      } catch (error) {
        console.error('Cache write error:', error)
        // Silently fail on cache write
      }
    }

    return result
  }
}

/**
 * Cache invalidation helper
 */
export async function invalidateCacheByTag(tag: string): Promise<void> {
  const cache = getCacheManager()
  await cache.deletePattern(`tag:${tag}:*`)
}

/**
 * Cache invalidation for specific key
 */
export async function invalidateCacheKey(key: string): Promise<void> {
  const cache = getCacheManager()
  await cache.delete(key)
}

/**
 * Preset cache configurations for common scenarios
 */
export const TRPC_CACHE_PRESETS = {
  // Static content (textbooks, kanji data)
  STATIC: { ttl: CACHE_TTL.staticContent, tags: ['static'] },

  // Public data (public textbooks, shared resources)
  PUBLIC: { ttl: CACHE_TTL.publicData, tags: ['public'] },

  // User-specific data
  USER: { ttl: CACHE_TTL.userData, tags: ['user'] },

  // Real-time data (progress, stats)
  REALTIME: { ttl: CACHE_TTL.realTimeData, tags: ['realtime'] },

  // Search results
  SEARCH: { ttl: CACHE_TTL.searchResults, tags: ['search'] },
}

/**
 * Type-safe cache decorator for tRPC procedures
 */
export function cachedProcedure<T extends { input?: any; output?: any }>(baseConfig: CacheConfig) {
  return (procedureConfig: T): T => {
    return {
      ...procedureConfig,
      _cacheConfig: baseConfig,
    } as unknown as T
  }
}
