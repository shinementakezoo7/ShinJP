// Export all authentication-related modules
export * from './apiKeys'
export { authOptions } from './nextauth'
export * from './oauthSessions'
export * from './roles'
export * from './security'

// Main authentication functions
import { createServiceRoleClient, supabase } from '../supabase/client'
import type { UserRole } from './roles'
import { generateJwtToken } from './security'

// Define user interface
export interface User {
  id: string
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  role: UserRole
  preferred_language: string
  created_at: string
  updated_at: string
  last_active: string
  timezone: string | null
  jlpt_level: number | null
  learning_goals: string[] | null
  interests: string[] | null
}

// Enhanced authentication function
export const authenticateUser = async (
  email: string,
  password: string
): Promise<{ user: User; token: string } | null> => {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return null
  }

  try {
    // Sign in with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Authentication error:', error)
      return null
    }

    // Fetch user details from database
    const { data: userDetails, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single()

    if (userError || !userDetails) {
      console.error('Error fetching user details:', userError)
      return null
    }

    // Type assertion for userDetails
    const user = userDetails as {
      id: string
      email: string
      username: string
      full_name: string | null
      avatar_url: string | null
      role: string
      preferred_language: string
      created_at: string
      updated_at: string
      last_active: string
      timezone: string | null
      jlpt_level: number | null
      learning_goals: string[] | null
      interests: string[] | null
    }

    // Generate JWT token
    const token = await generateJwtToken(
      { id: data.user.id, role: user.role },
      process.env.NEXTAUTH_SECRET || 'fallback_secret_key_minimum_32_characters_long',
      '24h'
    )

    // Update last active timestamp
    // prettier-ignore
    // @ts-expect-error - Supabase type inference issue with users table update
    await supabase.from('users').update({ last_active: new Date().toISOString() }).eq('id', data.user.id)

    return {
      user: {
        id: data.user.id,
        email: data.user.email || user.email,
        username: user.username,
        full_name: user.full_name,
        avatar_url: user.avatar_url,
        role: (user.role || 'user') as UserRole,
        preferred_language: user.preferred_language,
        created_at: user.created_at,
        updated_at: user.updated_at,
        last_active: user.last_active,
        timezone: user.timezone,
        jlpt_level: user.jlpt_level,
        learning_goals: user.learning_goals,
        interests: user.interests,
      },
      token,
    }
  } catch (error) {
    console.error('Error authenticating user:', error)
    return null
  }
}

// Register new user
export const registerUser = async (
  email: string,
  password: string,
  username: string,
  fullName: string | null = null
): Promise<{ user: User; token: string } | null> => {
  const serviceClient = createServiceRoleClient()
  if (!serviceClient) {
    console.error('Supabase service client not initialized')
    return null
  }

  try {
    // Check if user already exists
    const { data: existingUser } = await serviceClient
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle()

    if (existingUser) {
      console.error('User already exists')
      return null
    }

    // Check if username is taken
    const { data: existingUsername } = await serviceClient
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle()

    if (existingUsername) {
      console.error('Username already taken')
      return null
    }

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await serviceClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username,
        },
      },
    })

    if (authError) {
      console.error('Error creating auth user:', authError)
      return null
    }

    // Determine default role (first user is admin)
    const { count, error: countError } = await serviceClient
      .from('users')
      .select('*', { count: 'exact', head: true })

    const defaultRole: UserRole = countError || !count || count === 0 ? 'admin' : 'user'

    // Create user in database
    const insertData = {
      id: authData.user?.id,
      email,
      username,
      full_name: fullName,
      preferred_language: 'en',
      role: defaultRole,
    }
    // prettier-ignore
    // @ts-expect-error - Supabase type inference issue with users table
    const { data: userData, error: userError } = await serviceClient.from('users').insert(insertData).select().single()

    if (userError || !userData) {
      console.error('Error creating user in database:', userError)
      return null
    }

    // Type assertion for userData
    const newUser = userData as {
      id: string
      email: string
      username: string
      full_name: string | null
      avatar_url: string | null
      role: string
      preferred_language: string
      created_at: string
      updated_at: string
      last_active: string
      timezone: string | null
      jlpt_level: number | null
      learning_goals: string[] | null
      interests: string[] | null
    }

    // Generate JWT token
    const token = await generateJwtToken(
      { id: authData.user?.id, role: defaultRole },
      process.env.NEXTAUTH_SECRET || 'fallback_secret_key_minimum_32_characters_long',
      '24h'
    )

    return {
      user: {
        id: authData.user?.id || '',
        email,
        username,
        full_name: fullName,
        avatar_url: null,
        role: defaultRole,
        preferred_language: 'en',
        created_at: newUser.created_at,
        updated_at: newUser.updated_at,
        last_active: newUser.last_active,
        timezone: null,
        jlpt_level: null,
        learning_goals: null,
        interests: null,
      },
      token,
    }
  } catch (error) {
    console.error('Error registering user:', error)
    return null
  }
}

// Get user by ID
export const getUserById = async (userId: string): Promise<User | null> => {
  const serviceClient = createServiceRoleClient()
  if (!serviceClient) {
    console.error('Supabase service client not initialized')
    return null
  }

  try {
    const { data, error } = await serviceClient.from('users').select('*').eq('id', userId).single()

    if (error || !data) {
      console.error('Error fetching user:', error?.message)
      return null
    }

    // Type assertion for user data
    const user = data as {
      id: string
      email: string
      username: string
      full_name: string | null
      avatar_url: string | null
      role: string
      preferred_language: string
      created_at: string
      updated_at: string
      last_active: string
      timezone: string | null
      jlpt_level: number | null
      learning_goals: string[] | null
      interests: string[] | null
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role as UserRole,
      preferred_language: user.preferred_language,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_active: user.last_active,
      timezone: user.timezone,
      jlpt_level: user.jlpt_level,
      learning_goals: user.learning_goals,
      interests: user.interests,
    }
  } catch (error) {
    console.error('Error getting user by ID:', error)
    return null
  }
}

// Update user
export const updateUser = async (userId: string, updates: Partial<User>): Promise<User | null> => {
  const serviceClient = createServiceRoleClient()
  if (!serviceClient) {
    console.error('Supabase service client not initialized')
    return null
  }

  try {
    // prettier-ignore
    // @ts-expect-error - Supabase type inference issue with users table update
    const { data, error } = await serviceClient.from('users').update({ full_name: updates.full_name, username: updates.username, avatar_url: updates.avatar_url, preferred_language: updates.preferred_language, timezone: updates.timezone, jlpt_level: updates.jlpt_level, learning_goals: updates.learning_goals, interests: updates.interests, updated_at: new Date().toISOString() }).eq('id', userId).select().single()

    if (error || !data) {
      console.error('Error updating user:', error?.message)
      return null
    }

    // Type assertion for updated user data
    const user = data as {
      id: string
      email: string
      username: string
      full_name: string | null
      avatar_url: string | null
      role: string
      preferred_language: string
      created_at: string
      updated_at: string
      last_active: string
      timezone: string | null
      jlpt_level: number | null
      learning_goals: string[] | null
      interests: string[] | null
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role as UserRole,
      preferred_language: user.preferred_language,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_active: user.last_active,
      timezone: user.timezone,
      jlpt_level: user.jlpt_level,
      learning_goals: user.learning_goals,
      interests: user.interests,
    }
  } catch (error) {
    console.error('Error updating user:', error)
    return null
  }
}

// Change user password
export const changePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> => {
  if (!supabase) {
    console.error('Supabase client not initialized')
    return false
  }

  try {
    // Verify current password
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('email')
      .eq('id', userId)
      .single()

    if (userError || !userData) {
      console.error('Error fetching user for password change:', userError?.message)
      return false
    }

    // Type assertion for user data
    const user = userData as { email: string }

    // Attempt to sign in with current password to verify
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      console.error('Current password verification failed:', signInError.message)
      return false
    }

    // Update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      console.error('Error updating password:', updateError.message)
      return false
    }

    return true
  } catch (error) {
    console.error('Error changing password:', error)
    return false
  }
}
