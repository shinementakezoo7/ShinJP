import { createServiceRoleClient } from '../supabase/client'

// Define OAuth session interface
export interface OAuthSession {
  id: string
  user_id: string
  provider: string
  provider_user_id: string
  access_token: string
  refresh_token: string | null
  id_token: string | null
  expires_at: string
  scope: string | null
  created_at: string
  updated_at: string
}

// Encrypt OAuth tokens
const encryptToken = async (token: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(secret)
  const key = await crypto.subtle.importKey('raw', secretKey, { name: 'AES-GCM' }, false, [
    'encrypt',
  ])

  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedToken = encoder.encode(token)
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encodedToken)

  const encryptedArray = new Uint8Array(encrypted)
  const result = new Uint8Array(iv.length + encryptedArray.length)
  result.set(iv, 0)
  result.set(encryptedArray, iv.length)

  return Buffer.from(result).toString('base64')
}

// Decrypt OAuth tokens
const decryptToken = async (encryptedToken: string, secret: string): Promise<string> => {
  const encoder = new TextEncoder()
  const secretKey = encoder.encode(secret)
  const key = await crypto.subtle.importKey('raw', secretKey, { name: 'AES-GCM' }, false, [
    'decrypt',
  ])

  const data = Buffer.from(encryptedToken, 'base64')
  const iv = data.slice(0, 12)
  const encrypted = data.slice(12)

  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, encrypted)

  return new TextDecoder().decode(decrypted)
}

// Create OAuth session
export const createOAuthSession = async (
  userId: string,
  provider: string,
  providerUserId: string,
  accessToken: string,
  refreshToken: string | null = null,
  idToken: string | null = null,
  expiresIn: number,
  scope: string | null = null
): Promise<OAuthSession | null> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  const encryptionSecret =
    process.env.OAUTH_TOKEN_ENCRYPTION_SECRET || 'fallback_secret_key_32_characters_long'

  try {
    // Encrypt tokens
    const encryptedAccessToken = await encryptToken(accessToken, encryptionSecret)
    const encryptedRefreshToken = refreshToken
      ? await encryptToken(refreshToken, encryptionSecret)
      : null
    const encryptedIdToken = idToken ? await encryptToken(idToken, encryptionSecret) : null

    // Calculate expiration time
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    // Insert OAuth session into database
    const { data, error } = await (supabase.from('oauth_sessions') as any)
      .insert({
        user_id: userId,
        provider,
        provider_user_id: providerUserId,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        id_token: encryptedIdToken,
        expires_at: expiresAt,
        scope,
      })
      .select()

    if (error) {
      console.error('Error creating OAuth session:', error)
      return null
    }

    return data[0] as OAuthSession
  } catch (error) {
    console.error('Error creating OAuth session:', error)
    return null
  }
}

// Get OAuth session by ID
export const getOAuthSession = async (sessionId: string): Promise<OAuthSession | null> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    const { data, error } = await (supabase.from('oauth_sessions') as any)
      .select('*')
      .eq('id', sessionId)
      .single()

    if (error || !data) {
      console.error('OAuth session not found:', error?.message)
      return null
    }

    // Check if session has expired
    if (new Date(data.expires_at) < new Date()) {
      console.error('OAuth session has expired')
      return null
    }

    return data as OAuthSession
  } catch (error) {
    console.error('Error fetching OAuth session:', error)
    return null
  }
}

// Get active OAuth session for user and provider
export const getUserOAuthSession = async (
  userId: string,
  provider: string
): Promise<OAuthSession | null> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    const { data, error } = await (supabase.from('oauth_sessions') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('provider', provider)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) {
      console.error('Active OAuth session not found:', error?.message)
      return null
    }

    return data as OAuthSession
  } catch (error) {
    console.error('Error fetching user OAuth session:', error)
    return null
  }
}

// Refresh OAuth tokens
export const refreshOAuthTokens = async (
  sessionId: string,
  newAccessToken: string,
  newRefreshToken: string | null = null,
  expiresIn: number
): Promise<boolean> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }

  const encryptionSecret =
    process.env.OAUTH_TOKEN_ENCRYPTION_SECRET || 'fallback_secret_key_32_characters_long'

  try {
    // Encrypt tokens
    const encryptedAccessToken = await encryptToken(newAccessToken, encryptionSecret)
    const encryptedRefreshToken = newRefreshToken
      ? await encryptToken(newRefreshToken, encryptionSecret)
      : null

    // Calculate new expiration time
    const expiresAt = new Date(Date.now() + expiresIn * 1000).toISOString()

    // Update OAuth session
    const { error } = await (supabase.from('oauth_sessions') as any)
      .update({
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_at: expiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq('id', sessionId)

    if (error) {
      console.error('Error refreshing OAuth tokens:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error refreshing OAuth tokens:', error)
    return false
  }
}

// Delete OAuth session
export const deleteOAuthSession = async (sessionId: string): Promise<boolean> => {
  const supabase = createServiceRoleClient()
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }

  try {
    const { error } = await (supabase.from('oauth_sessions') as any).delete().eq('id', sessionId)

    if (error) {
      console.error('Error deleting OAuth session:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting OAuth session:', error)
    return false
  }
}

// Get decrypted tokens from session
export const getDecryptedTokens = async (
  session: OAuthSession
): Promise<{
  accessToken: string
  refreshToken: string | null
  idToken: string | null
} | null> => {
  const encryptionSecret =
    process.env.OAUTH_TOKEN_ENCRYPTION_SECRET || 'fallback_secret_key_32_characters_long'

  try {
    const accessToken = await decryptToken(session.access_token, encryptionSecret)
    const refreshToken = session.refresh_token
      ? await decryptToken(session.refresh_token, encryptionSecret)
      : null
    const idToken = session.id_token ? await decryptToken(session.id_token, encryptionSecret) : null

    return {
      accessToken,
      refreshToken,
      idToken,
    }
  } catch (error) {
    console.error('Error decrypting OAuth tokens:', error)
    return null
  }
}
