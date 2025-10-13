/**
 * Redis Caching Layer using Upstash
 *
 * This module provides a caching layer for frequently accessed data
 * to reduce database load and improve response times.
 *
 * Setup: Add to .env.local:
 * UPSTASH_REDIS_REST_URL=https://your-upstash-url.upstash.io
 * UPSTASH_REDIS_REST_TOKEN=your-token
 *
 * Usage:
 * import { cache } from '@/lib/cache/redis'
 *
 * const data = await cache.get('key')
 * await cache.set('key', data, 3600) // TTL in seconds
 */

import { Redis } from '@upstash/redis'

// Singleton pattern
let redisClient: Redis | null = null

export const getRedisClient = (): Redis | null => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    console.warn('⚠️ Redis not configured - caching disabled')
    return null
  }

  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    console.log('✅ Redis client initialized')
  }

  return redisClient
}

// Cache key prefixes for organization
export const CacheKeys = {
  VOCABULARY: (level: string) => `vocab:${level}`,
  KANJI: (level: string) => `kanji:${level}`,
  GRAMMAR: (level: string) => `grammar:${level}`,
  TEXTBOOK: (id: string) => `textbook:${id}`,
  TEXTBOOK_CHAPTERS: (id: string) => `textbook:${id}:chapters`,
  PUBLIC_TEXTBOOKS: (level?: string) => `textbooks:public${level ? `:${level}` : ''}`,
  USER_STATS: (userId: string) => `user:${userId}:stats`,
  USER_DUE_CARDS: (userId: string) => `user:${userId}:due-cards`,
  USER_DASHBOARD: (userId: string) => `user:${userId}:dashboard`,
  JLPT_STATS: () => 'jlpt:stats',
} as const

// TTL (Time To Live) configurations in seconds
export const CacheTTL = {
  STATIC_CONTENT: 86400, // 24 hours - for vocabulary, kanji, grammar
  PUBLIC_TEXTBOOKS: 3600, // 1 hour - public textbooks
  USER_SPECIFIC: 300, // 5 minutes - user progress, stats
  REAL_TIME: 60, // 1 minute - due cards, active sessions
  SEARCH_RESULTS: 1800, // 30 minutes - search results
} as const

/**
 * Cache wrapper with fallback to direct database queries
 */
export class CacheManager {
  private redis: Redis | null

  constructor() {
    this.redis = getRedisClient()
  }

  /**
   * Get value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.redis) return null

    try {
      const data = await this.redis.get(key)
      if (data) {
        console.log(`✅ Cache HIT: ${key}`)
        return data as T
      }
      console.log(`❌ Cache MISS: ${key}`)
      return null
    } catch (error) {
      console.error(`Redis GET error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Set value in cache with TTL
   */
  async set(
    key: string,
    value: unknown,
    ttlSeconds: number = CacheTTL.USER_SPECIFIC
  ): Promise<boolean> {
    if (!this.redis) return false

    try {
      await this.redis.set(key, value, { ex: ttlSeconds })
      console.log(`✅ Cache SET: ${key} (TTL: ${ttlSeconds}s)`)
      return true
    } catch (error) {
      console.error(`Redis SET error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string | string[]): Promise<boolean> {
    if (!this.redis) return false

    try {
      const keys = Array.isArray(key) ? key : [key]
      await this.redis.del(...keys)
      console.log(`✅ Cache DEL: ${keys.join(', ')}`)
      return true
    } catch (error) {
      console.error(`Redis DEL error:`, error)
      return false
    }
  }

  /**
   * Invalidate pattern (e.g., "user:123:*")
   */
  async invalidatePattern(pattern: string): Promise<boolean> {
    if (!this.redis) return false

    try {
      const keys = await this.redis.keys(pattern)
      if (keys.length > 0) {
        await this.redis.del(...keys)
        console.log(`✅ Cache INVALIDATE: ${pattern} (${keys.length} keys)`)
      }
      return true
    } catch (error) {
      console.error(`Redis pattern invalidation error:`, error)
      return false
    }
  }

  /**
   * Get or set pattern - fetch from cache or compute and cache
   */
  async getOrSet<T>(
    key: string,
    fetchFn: () => Promise<T>,
    ttlSeconds: number = CacheTTL.USER_SPECIFIC
  ): Promise<T | null> {
    // Try to get from cache first
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    // Cache miss - fetch from source
    try {
      const data = await fetchFn()
      if (data !== null && data !== undefined) {
        await this.set(key, data, ttlSeconds)
      }
      return data
    } catch (error) {
      console.error(`Error in getOrSet for key ${key}:`, error)
      return null
    }
  }

  /**
   * Increment counter
   */
  async incr(key: string): Promise<number | null> {
    if (!this.redis) return null

    try {
      const value = await this.redis.incr(key)
      return value
    } catch (error) {
      console.error(`Redis INCR error for key ${key}:`, error)
      return null
    }
  }

  /**
   * Check if key exists
   */
  async exists(key: string): Promise<boolean> {
    if (!this.redis) return false

    try {
      const exists = await this.redis.exists(key)
      return exists === 1
    } catch (error) {
      console.error(`Redis EXISTS error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Set expiration on existing key
   */
  async expire(key: string, ttlSeconds: number): Promise<boolean> {
    if (!this.redis) return false

    try {
      await this.redis.expire(key, ttlSeconds)
      return true
    } catch (error) {
      console.error(`Redis EXPIRE error for key ${key}:`, error)
      return false
    }
  }

  /**
   * Get multiple keys at once
   */
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    if (!this.redis) return keys.map(() => null)

    try {
      const values = (await this.redis.mget(...keys)) as (string | null)[]
      return values.map((v) => (v ? (JSON.parse(v) as T) : null))
    } catch (error) {
      console.error(`Redis MGET error:`, error)
      return keys.map(() => null)
    }
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    if (!this.redis) return false

    try {
      const result = await this.redis.ping()
      return result === 'PONG'
    } catch (error) {
      console.error('Redis PING error:', error)
      return false
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{ available: boolean; ping: boolean } | null> {
    if (!this.redis) {
      return { available: false, ping: false }
    }

    const ping = await this.ping()
    return {
      available: true,
      ping,
    }
  }
}

// Export singleton instance
export const cache = new CacheManager()

// Helper functions for common cache patterns

/**
 * Cache static JLPT content (vocabulary, kanji, grammar)
 */
export const cacheJLPTContent = async (
  type: 'vocabulary' | 'kanji' | 'grammar',
  level: string,
  data: unknown
): Promise<boolean> => {
  const key =
    type === 'vocabulary'
      ? CacheKeys.VOCABULARY(level)
      : type === 'kanji'
        ? CacheKeys.KANJI(level)
        : CacheKeys.GRAMMAR(level)

  return cache.set(key, data, CacheTTL.STATIC_CONTENT)
}

/**
 * Get cached JLPT content
 */
export const getCachedJLPTContent = async <T>(
  type: 'vocabulary' | 'kanji' | 'grammar',
  level: string
): Promise<T | null> => {
  const key =
    type === 'vocabulary'
      ? CacheKeys.VOCABULARY(level)
      : type === 'kanji'
        ? CacheKeys.KANJI(level)
        : CacheKeys.GRAMMAR(level)

  return cache.get<T>(key)
}

/**
 * Invalidate user-specific cache
 */
export const invalidateUserCache = async (userId: string): Promise<boolean> => {
  return cache.invalidatePattern(`user:${userId}:*`)
}

/**
 * Invalidate textbook cache
 */
export const invalidateTextbookCache = async (textbookId: string): Promise<boolean> => {
  await cache.del([CacheKeys.TEXTBOOK(textbookId), CacheKeys.TEXTBOOK_CHAPTERS(textbookId)])
  return cache.invalidatePattern(`textbooks:public*`)
}

/**
 * Rate limiting helper
 */
export const checkRateLimit = async (
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> => {
  const key = `ratelimit:${identifier}`
  const current = await cache.incr(key)

  if (current === null) {
    return { allowed: true, remaining: limit - 1 }
  }

  if (current === 1) {
    // First request in window
    await cache.expire(key, windowSeconds)
  }

  const allowed = current <= limit
  const remaining = Math.max(0, limit - current)

  return { allowed, remaining }
}

export default cache
