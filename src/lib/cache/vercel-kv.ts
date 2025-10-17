/**
 * Vercel KV Cache Layer
 * Provides an alternative to Upstash Redis with built-in persistence
 */

import { kv } from '@vercel/kv'

export type CacheTTL = {
  staticContent: number // 24 hours
  publicData: number // 1 hour
  userData: number // 5 minutes
  realTimeData: number // 1 minute
  searchResults: number // 30 minutes
}

export const CACHE_TTL: CacheTTL = {
  staticContent: 24 * 60 * 60,
  publicData: 60 * 60,
  userData: 5 * 60,
  realTimeData: 60,
  searchResults: 30 * 60,
}

/**
 * Vercel KV Cache Manager
 * Drop-in replacement for Redis cache manager
 */
export class VercelKVCacheManager {
  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await kv.get<T>(key)
      return value
    } catch (error) {
      console.error(`Error getting cache key ${key}:`, error)
      return null
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      await kv.setex(key, ttl, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting cache key ${key}:`, error)
    }
  }

  /**
   * Delete value from cache
   */
  async delete(key: string): Promise<void> {
    try {
      await kv.del(key)
    } catch (error) {
      console.error(`Error deleting cache key ${key}:`, error)
    }
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<void> {
    try {
      const keys = await kv.keys(pattern)
      if (keys.length > 0) {
        await kv.del(...keys)
      }
    } catch (error) {
      console.error(`Error deleting cache pattern ${pattern}:`, error)
    }
  }

  /**
   * Check if key exists
   */
  async has(key: string): Promise<boolean> {
    try {
      const value = await kv.exists(key)
      return value === 1
    } catch (error) {
      console.error(`Error checking cache key ${key}:`, error)
      return false
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    try {
      const values = await kv.mget<T[]>(...keys)
      return values
    } catch (error) {
      console.error(`Error getting multiple cache keys:`, error)
      return keys.map(() => null)
    }
  }

  /**
   * Set multiple keys at once
   */
  async mset(entries: Array<[string, unknown, number]>): Promise<void> {
    try {
      for (const [key, value, ttl] of entries) {
        await this.set(key, value, ttl)
      }
    } catch (error) {
      console.error(`Error setting multiple cache keys:`, error)
    }
  }

  /**
   * Increment counter
   */
  async incr(key: string): Promise<number> {
    try {
      return await kv.incr(key)
    } catch (error) {
      console.error(`Error incrementing cache key ${key}:`, error)
      return 0
    }
  }

  /**
   * Get TTL of key
   */
  async ttl(key: string): Promise<number> {
    try {
      const ttl = await kv.ttl(key)
      return ttl
    } catch (error) {
      console.error(`Error getting TTL for key ${key}:`, error)
      return -1
    }
  }
}

/**
 * Singleton instance of Vercel KV Cache Manager
 */
let cacheManager: VercelKVCacheManager | null = null

export function getCacheManager(): VercelKVCacheManager {
  if (!cacheManager) {
    cacheManager = new VercelKVCacheManager()
  }
  return cacheManager
}

/**
 * Cache decorator for functions
 */
export function withCache<T extends unknown[], R>(
  ttl: number,
  keyGenerator: (...args: T) => string
) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: T) {
      const cache = getCacheManager()
      const cacheKey = keyGenerator(...args)

      // Try to get from cache
      const cached = await cache.get(cacheKey)
      if (cached !== null) {
        return cached
      }

      // Call original method
      const result = await originalMethod.apply(this, args)

      // Store in cache
      await cache.set(cacheKey, result, ttl)

      return result
    }

    return descriptor
  }
}
