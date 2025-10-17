import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Define the types for our Supabase client
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      study_sessions: {
        Row: {
          id: number
          user_id: string
          start_time: string
          end_time: string | null
          duration: number | null
          activities: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          start_time: string
          end_time?: string | null
          duration?: number | null
          activities?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          start_time?: string
          end_time?: string | null
          duration?: number | null
          activities?: Record<string, unknown> | null
          created_at?: string
        }
      }
      user_performance: {
        Row: {
          id: number
          user_id: string
          content_type: string
          content_id: number
          attempts: number
          correct_attempts: number
          last_attempt: string | null
          accuracy_rate: number | null
          avg_response_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          content_type: string
          content_id: number
          attempts?: number
          correct_attempts?: number
          last_attempt?: string | null
          accuracy_rate?: number | null
          avg_response_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          content_type?: string
          content_id?: number
          attempts?: number
          correct_attempts?: number
          last_attempt?: string | null
          accuracy_rate?: number | null
          avg_response_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      study_groups: {
        Row: {
          id: number
          name: string
          description: string | null
          created_by: string
          member_count: number
          is_private: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_by: string
          member_count?: number
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_by?: string
          member_count?: number
          is_private?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      exercise_types: {
        Row: {
          id: number
          name: string
          description: string | null
          icon_url: string | null
          category: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          icon_url?: string | null
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          icon_url?: string | null
          category?: string | null
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: number
          title: string
          description: string | null
          exercise_type_id: number
          jlpt_level: number | null
          difficulty: number | null
          estimated_duration: number | null
          instructions: string | null
          content: Record<string, unknown>
          correct_answer: string | null
          explanation: string | null
          created_at: string
          updated_at: string
          is_active: boolean
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          exercise_type_id: number
          jlpt_level?: number | null
          difficulty?: number | null
          estimated_duration?: number | null
          instructions?: string | null
          content: Record<string, unknown>
          correct_answer?: string | null
          explanation?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          exercise_type_id?: number
          jlpt_level?: number | null
          difficulty?: number | null
          estimated_duration?: number | null
          instructions?: string | null
          content?: Record<string, unknown>
          correct_answer?: string | null
          explanation?: string | null
          created_at?: string
          updated_at?: string
          is_active?: boolean
        }
      }
      user_exercise_attempts: {
        Row: {
          id: number
          user_id: string
          exercise_id: number
          started_at: string
          completed_at: string | null
          time_taken: number | null
          score: number | null
          is_correct: boolean | null
          user_answer: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          exercise_id: number
          started_at: string
          completed_at?: string | null
          time_taken?: number | null
          score?: number | null
          is_correct?: boolean | null
          user_answer?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          exercise_id?: number
          started_at?: string
          completed_at?: string | null
          time_taken?: number | null
          score?: number | null
          is_correct?: boolean | null
          user_answer?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      grammar_points: {
        Row: {
          id: number
          title: string
          structure: string
          meaning: string
          usage_notes: string | null
          examples: Array<{ japanese: string; english: string }> | null
          jlpt_level: number | null
          related_grammar: Array<number>
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          structure: string
          meaning: string
          usage_notes?: string | null
          examples?: Array<{ japanese: string; english: string }> | null
          jlpt_level?: number | null
          related_grammar?: Array<number>
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          structure?: string
          meaning?: string
          usage_notes?: string | null
          examples?: Array<{ japanese: string; english: string }> | null
          jlpt_level?: number | null
          related_grammar?: Array<number>
          created_at?: string
        }
      }
      lesson_modules: {
        Row: {
          id: number
          title: string
          description: string | null
          jlpt_level: number | null
          estimated_duration: number | null
          prerequisites: Array<number>
          is_active: boolean
          sort_order: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          title: string
          description?: string | null
          jlpt_level?: number | null
          estimated_duration?: number | null
          prerequisites?: Array<number>
          is_active?: boolean
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string | null
          jlpt_level?: number | null
          estimated_duration?: number | null
          prerequisites?: Array<number>
          is_active?: boolean
          sort_order?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      lesson_items: {
        Row: {
          id: number
          lesson_module_id: number
          content_type: 'character' | 'word' | 'grammar'
          content_id: number
          sort_order: number | null
          created_at: string
        }
        Insert: {
          id?: number
          lesson_module_id: number
          content_type: 'character' | 'word' | 'grammar'
          content_id: number
          sort_order?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          lesson_module_id?: number
          content_type?: 'character' | 'word' | 'grammar'
          content_id?: number
          sort_order?: number | null
          created_at?: string
        }
      }
      user_lesson_progress: {
        Row: {
          id: number
          user_id: string
          lesson_module_id: number
          started_at: string | null
          completed_at: string | null
          completion_percentage: number | null
          quiz_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          lesson_module_id: number
          started_at?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          quiz_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          lesson_module_id?: number
          started_at?: string | null
          completed_at?: string | null
          completion_percentage?: number | null
          quiz_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      srs_cards: {
        Row: {
          id: number
          user_id: string
          content_type: 'character' | 'word' | 'grammar'
          content_id: number
          ease_factor: number
          interval: number
          repetitions: number
          next_review: string | null
          last_reviewed: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          content_type: 'character' | 'word' | 'grammar'
          content_id: number
          ease_factor: number
          interval: number
          repetitions: number
          next_review?: string | null
          last_reviewed?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          content_type?: 'character' | 'word' | 'grammar'
          content_id?: number
          ease_factor?: number
          interval?: number
          repetitions?: number
          next_review?: string | null
          last_reviewed?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_performance: {
        Row: {
          id: number
          user_id: string
          content_type: 'character' | 'word' | 'grammar'
          content_id: number
          attempts: number
          correct_attempts: number
          last_attempt: string | null
          accuracy_rate: number | null
          avg_response_time: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          content_type: 'character' | 'word' | 'grammar'
          content_id: number
          attempts?: number
          correct_attempts?: number
          last_attempt?: string | null
          accuracy_rate?: number | null
          avg_response_time?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          content_type?: 'character' | 'word' | 'grammar'
          content_id?: number
          attempts?: number
          correct_attempts?: number
          last_attempt?: string | null
          accuracy_rate?: number | null
          avg_response_time?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      words: {
        Row: {
          id: number
          word: string
          reading: string | null
          meanings: Array<{
            meaning: string
            example_sentences?: Array<{ japanese: string; english: string }>
          }>
          jlpt_level: number | null
          frequency_rank: number | null
          part_of_speech: Array<string>
          created_at: string
        }
        Insert: {
          id?: number
          word: string
          reading?: string | null
          meanings: Array<{
            meaning: string
            example_sentences?: Array<{ japanese: string; english: string }>
          }>
          jlpt_level?: number | null
          frequency_rank?: number | null
          part_of_speech: Array<string>
          created_at?: string
        }
        Update: {
          id?: number
          word?: string
          reading?: string | null
          meanings?: Array<{
            meaning: string
            example_sentences?: Array<{ japanese: string; english: string }>
          }>
          jlpt_level?: number | null
          frequency_rank?: number | null
          part_of_speech?: Array<string>
          created_at?: string
        }
      }
      users: {
        Row: {
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
          learning_goals: Array<string> | null
          interests: Array<string> | null
        }
        Insert: {
          id: string
          email: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          preferred_language: string
          created_at?: string
          updated_at?: string
          last_active?: string
          timezone?: string | null
          jlpt_level?: number | null
          learning_goals?: Array<string> | null
          interests?: Array<string> | null
        }
        Update: {
          id?: string
          email?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: string
          preferred_language?: string
          created_at?: string
          updated_at?: string
          last_active?: string
          timezone?: string | null
          jlpt_level?: number | null
          learning_goals?: Array<string> | null
          interests?: Array<string> | null
        }
      }
      group_memberships: {
        Row: {
          id: number
          user_id: string
          group_id: number
          role: string
          joined_at: string
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          group_id: number
          role?: string
          joined_at?: string
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          group_id?: number
          role?: string
          joined_at?: string
          created_at?: string
        }
      }
      forum_posts: {
        Row: {
          id: number
          group_id: number
          user_id: string
          parent_post_id: number | null
          title: string | null
          content: string
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          group_id: number
          user_id: string
          parent_post_id?: number | null
          title?: string | null
          content: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          group_id?: number
          user_id?: string
          parent_post_id?: number | null
          title?: string | null
          content?: string
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
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
        Insert: {
          id?: string
          user_id: string
          name: string
          key_prefix: string
          hashed_key: string
          permissions?: string[]
          expires_at?: string | null
          last_used_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key_prefix?: string
          hashed_key?: string
          permissions?: string[]
          expires_at?: string | null
          last_used_at?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Validate URL format to avoid runtime errors when placeholders are present
function isValidHttpUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

// Create Supabase client (guard against invalid env configuration)
let initializedClient: SupabaseClient<Database> | null = null
if (supabaseUrl && supabaseAnonKey && isValidHttpUrl(supabaseUrl)) {
  try {
    initializedClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  } catch (e) {
    console.warn('Supabase client not initialized due to invalid configuration:', e)
    initializedClient = null
  }
} else if (supabaseUrl || supabaseAnonKey) {
  // Env vars present but invalid (likely placeholders); avoid crashing
  console.warn(
    'Invalid Supabase environment configuration. Set NEXT_PUBLIC_SUPABASE_URL to a valid http/https URL and provide a valid NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  )
}

export const supabase = initializedClient

// Server-side client with service role key (for server-side operations)
export const createServiceRoleClient = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''

  if (!supabaseUrl || !serviceRoleKey) {
    return null
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
