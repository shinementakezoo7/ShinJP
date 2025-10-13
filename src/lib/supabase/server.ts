import { type CookieOptions, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { type Database } from './client'

export const createClient = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          try {
            const cookieStore = cookies()
            return cookieStore.get(name)?.value
          } catch (_error) {
            // The `get` method was called from a Server Component.
            return undefined
          }
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            const cookieStore = cookies()
            cookieStore.set({ name, value, ...options })
          } catch (_error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            const cookieStore = cookies()
            cookieStore.set({ name, value: '', ...options })
          } catch (_error) {
            // The `remove` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
