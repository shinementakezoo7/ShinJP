import { jwtVerify, SignJWT } from 'jose'
import { nanoid } from 'nanoid'
import { createServiceRoleClient } from '../supabase/client'

// Define security event interface
export interface SecurityEvent {
  id: string
  user_id: string | null
  event_type: string
  ip_address: string | null
  user_agent: string | null
  details: Record<string, unknown> | null
  created_at: string
}

// Log security event
export const logSecurityEvent = async (
  eventType: string,
  userId: string | null = null,
  ipAddress: string | null = null,
  userAgent: string | null = null,
  details: Record<string, unknown> | null = null
): Promise<void> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return
  }

  try {
    await (supabase.from('security_events') as any).insert({
      id: nanoid(),
      user_id: userId,
      event_type: eventType,
      ip_address: ipAddress,
      user_agent: userAgent,
      details: details,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error logging security event:', error)
  }
}

// Rate limiting interface
export interface RateLimit {
  id: string
  identifier: string // IP address, user ID, or API key
  endpoint: string
  count: number
  reset_time: string
  created_at: string
}

// Check rate limit
export const checkRateLimit = async (
  identifier: string,
  endpoint: string,
  maxRequests: number = 100,
  windowSeconds: number = 3600 // 1 hour
): Promise<{ allowed: boolean; resetTime: string | null }> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return { allowed: true, resetTime: null }
  }

  try {
    const now = new Date()
    const resetTime = new Date(now.getTime() + windowSeconds * 1000).toISOString()

    // Check if rate limit record exists
    const { data, error } = await (supabase.from('rate_limits') as any)
      .select('*')
      .eq('identifier', identifier)
      .eq('endpoint', endpoint)
      .gte('reset_time', now.toISOString())
      .maybeSingle()

    if (error) {
      console.error('Error checking rate limit:', error)
      return { allowed: true, resetTime: null }
    }

    if (!data) {
      // Create new rate limit record
      await (supabase.from('rate_limits') as any).insert({
        id: nanoid(),
        identifier,
        endpoint,
        count: 1,
        reset_time: resetTime,
        created_at: now.toISOString(),
      })

      return { allowed: true, resetTime: resetTime }
    }

    // Check if limit exceeded
    if (data.count >= maxRequests) {
      return { allowed: false, resetTime: data.reset_time }
    }

    // Increment count
    await (supabase.from('rate_limits') as any).update({ count: data.count + 1 }).eq('id', data.id)

    return { allowed: true, resetTime: data.reset_time }
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return { allowed: true, resetTime: null }
  }
}

// Password strength validation
export const validatePasswordStrength = (
  password: string
): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  // Minimum length
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }

  // Maximum length (bcrypt limit)
  if (password.length > 72) {
    errors.push('Password must be no more than 72 characters long')
  }

  // At least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  // At least one lowercase letter
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  // At least one digit
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one digit')
  }

  // At least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Email validation
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Sanitize input to prevent XSS
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// Generate secure token
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
  // In a real implementation, you would use bcrypt or similar
  // This is a simplified version for demonstration
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Verify password
export const verifyPassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  const hashedInput = await hashPassword(password)
  return hashedInput === hashedPassword
}

// Generate JWT token
export const generateJwtToken = async (
  payload: Record<string, unknown>,
  secret: string,
  expiresIn: string = '24h'
): Promise<string> => {
  const secretKey = new TextEncoder().encode(secret)
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + (expiresIn === '24h' ? 24 * 60 * 60 : 60 * 60) // 24 hours or 1 hour

  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secretKey)
}

// Verify JWT token
export const verifyJwtToken = async (token: string, secret: string): Promise<unknown> => {
  try {
    const secretKey = new TextEncoder().encode(secret)
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error('Error verifying JWT token:', error)
    return null
  }
}

// Check if user account is locked
export const isAccountLocked = async (userId: string): Promise<boolean> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }

  try {
    const { data, error } = await (supabase.from('user_security') as any)
      .select('is_locked, lock_reason, lock_expires_at')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !data) {
      return false
    }

    // Check if account is locked and if lock has expired
    if (data.is_locked && data.lock_expires_at) {
      const lockExpires = new Date(data.lock_expires_at)
      if (lockExpires > new Date()) {
        return true
      } else {
        // Unlock account if lock has expired
        await (supabase.from('user_security') as any)
          .update({
            is_locked: false,
            lock_reason: null,
            lock_expires_at: null,
            failed_login_attempts: 0,
          })
          .eq('user_id', userId)
        return false
      }
    }

    return data.is_locked || false
  } catch (error) {
    console.error('Error checking account lock status:', error)
    return false
  }
}

// Record failed login attempt
export const recordFailedLoginAttempt = async (
  userId: string,
  ipAddress: string
): Promise<void> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return
  }

  try {
    // Get current failed attempts
    const { data: userData, error: userError } = await (supabase.from('user_security') as any)
      .select('failed_login_attempts')
      .eq('user_id', userId)
      .maybeSingle()

    let failedAttempts = 1
    if (userData) {
      failedAttempts = (userData.failed_login_attempts || 0) + 1
    }

    // Lock account if too many failed attempts
    const maxFailedAttempts = parseInt(process.env.MAX_FAILED_LOGIN_ATTEMPTS || '5', 10)
    const lockDuration = parseInt(process.env.ACCOUNT_LOCK_DURATION || '3600', 10) // 1 hour default

    if (failedAttempts >= maxFailedAttempts) {
      const lockExpiresAt = new Date(Date.now() + lockDuration * 1000).toISOString()

      await (supabase.from('user_security') as any).upsert(
        {
          user_id: userId,
          failed_login_attempts: failedAttempts,
          is_locked: true,
          lock_reason: 'Too many failed login attempts',
          lock_expires_at: lockExpiresAt,
          last_failed_login_at: new Date().toISOString(),
          last_failed_login_ip: ipAddress,
        },
        { onConflict: 'user_id' }
      )
    } else {
      await (supabase.from('user_security') as any).upsert(
        {
          user_id: userId,
          failed_login_attempts: failedAttempts,
          last_failed_login_at: new Date().toISOString(),
          last_failed_login_ip: ipAddress,
        },
        { onConflict: 'user_id' }
      )
    }

    // Log security event
    await logSecurityEvent('failed_login', userId, ipAddress, null, {
      failedAttempts,
      maxAttempts: maxFailedAttempts,
    })
  } catch (error) {
    console.error('Error recording failed login attempt:', error)
  }
}

// Reset failed login attempts
export const resetFailedLoginAttempts = async (userId: string): Promise<void> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return
  }

  try {
    await (supabase.from('user_security') as any).upsert(
      {
        user_id: userId,
        failed_login_attempts: 0,
        is_locked: false,
        lock_reason: null,
        lock_expires_at: null,
      },
      { onConflict: 'user_id' }
    )
  } catch (error) {
    console.error('Error resetting failed login attempts:', error)
  }
}
