import { v4 as uuidv4 } from 'uuid'
import { createServiceRoleClient } from '../supabase/client'

// Define API key interface
export interface ApiKey {
  id: string
  user_id: string
  name: string
  key_prefix: string
  hashed_key: string
  permissions: string[]
  expires_at: string | null
  last_used_at: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

// Generate a new API key
export const generateApiKey = (): { apiKey: string; keyPrefix: string } => {
  const key = uuidv4().replace(/-/g, '')
  const prefix = `sk-${key.substring(0, 8)}`
  const apiKey = `${prefix}${key}`
  return { apiKey, keyPrefix: prefix }
}

// Hash API key for secure storage
export const hashApiKey = async (apiKey: string): Promise<string> => {
  const encoder = new TextEncoder()
  const data = encoder.encode(apiKey)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// Create a new API key for a user
export const createApiKey = async (
  userId: string,
  name: string,
  permissions: string[] = [],
  expiresAt: string | null = null
): Promise<{ apiKey: string } | null> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    // Generate API key
    const { apiKey, keyPrefix } = generateApiKey()
    const hashedKey = await hashApiKey(apiKey)

    // Insert API key into database
    const insertData = {
      user_id: userId,
      name,
      key_prefix: keyPrefix,
      hashed_key: hashedKey,
      permissions: permissions || [],
      expires_at: expiresAt,
      is_active: true,
    }
    // @ts-expect-error - Supabase type inference issue with api_keys table
    const { error } = await supabase.from('api_keys').insert(insertData).select()

    if (error) {
      console.error('Error creating API key:', error)
      return null
    }

    return { apiKey }
  } catch (error) {
    console.error('Error creating API key:', error)
    return null
  }
}

// Validate API key
export const validateApiKey = async (
  apiKey: string
): Promise<{ userId: string; permissions: string[] } | null> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    // Extract prefix from API key
    const keyPrefix = apiKey.substring(0, 11) // sk-xxxxxxxx

    // Hash the provided API key for comparison
    const hashedKey = await hashApiKey(apiKey)

    // Look up API key in database
    const { data, error } = await supabase
      .from('api_keys')
      .select('user_id, permissions, is_active, expires_at')
      .eq('key_prefix', keyPrefix)
      .eq('hashed_key', hashedKey)
      .single()

    if (error || !data) {
      console.error('API key not found or invalid')
      return null
    }

    // Type assertion for the data object
    const apiKeyData = data as {
      user_id: string
      permissions: string[]
      is_active: boolean
      expires_at: string | null
    }

    // Check if API key is active
    if (!apiKeyData.is_active) {
      console.error('API key is inactive')
      return null
    }

    // Check if API key has expired
    if (apiKeyData.expires_at && new Date(apiKeyData.expires_at) < new Date()) {
      console.error('API key has expired')
      return null
    }

    // Update last used timestamp
    // prettier-ignore
    // @ts-expect-error - Supabase type inference issue with api_keys table update
    await supabase.from('api_keys').update({ last_used_at: new Date().toISOString() }).eq('key_prefix', keyPrefix).eq('hashed_key', hashedKey)

    return {
      userId: apiKeyData.user_id,
      permissions: apiKeyData.permissions || [],
    }
  } catch (error) {
    console.error('Error validating API key:', error)
    return null
  }
}

// Get all API keys for a user
export const getUserApiKeys = async (userId: string): Promise<ApiKey[] | null> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user API keys:', error)
      return null
    }

    return data as ApiKey[]
  } catch (error) {
    console.error('Error fetching user API keys:', error)
    return null
  }
}

// Revoke an API key
export const revokeApiKey = async (userId: string, keyId: string): Promise<boolean> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }

  try {
    // prettier-ignore
    // @ts-expect-error - Supabase type inference issue with api_keys table
    const { error } = await supabase.from('api_keys').update({ is_active: false }).eq('id', keyId).eq('user_id', userId)

    if (error) {
      console.error('Error revoking API key:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error revoking API key:', error)
    return false
  }
}

// Delete an API key permanently
export const deleteApiKey = async (userId: string, keyId: string): Promise<boolean> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }

  try {
    const { error } = await supabase.from('api_keys').delete().eq('id', keyId).eq('user_id', userId)

    if (error) {
      console.error('Error deleting API key:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting API key:', error)
    return false
  }
}
