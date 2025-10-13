// User Profile Types
export interface UserProfile {
  id: string
  email: string
  username: string
  full_name: string | null
  avatar_url: string | null
  preferred_language: string
  created_at: string
  updated_at: string
  last_active: string
  timezone: string | null
  jlpt_level: number | null
  learning_goals: string[] | null
  interests: string[] | null
}

// Character Types
export interface Character {
  id: number
  character: string
  type: 'hiragana' | 'katakana' | 'kanji'
  meaning: string[]
  readings: {
    onyomi?: string[]
    kunyomi?: string[]
  }
  stroke_count: number | null
  stroke_diagram_url: string | null
  jlpt_level: number | null
  frequency_rank: number | null
  created_at: string
}

// Word Types
export interface Word {
  id: number
  word: string
  reading: string | null
  meanings: Array<{
    meaning: string
    example_sentences?: Array<{
      japanese: string
      english: string
    }>
  }>
  jlpt_level: number | null
  frequency_rank: number | null
  part_of_speech: string[]
  created_at: string
}

// Grammar Point Types
export interface GrammarPoint {
  id: number
  title: string
  structure: string
  meaning: string
  usage_notes: string | null
  examples: Array<{
    japanese: string
    english: string
  }> | null
  jlpt_level: number | null
  related_grammar: number[]
  created_at: string
}

// SRS Card Types
export interface SRSCard {
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

// User Performance Types
export interface UserPerformance {
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

// Lesson Module Types
export interface LessonModule {
  id: number
  title: string
  description: string | null
  jlpt_level: number | null
  estimated_duration: number | null
  prerequisites: number[]
  is_active: boolean
  sort_order: number | null
  created_at: string
  updated_at: string
}

// Lesson Item Types
export interface LessonItem {
  id: number
  lesson_module_id: number
  content_type: 'character' | 'word' | 'grammar'
  content_id: number
  sort_order: number | null
  created_at: string
}

// User Lesson Progress Types
export interface UserLessonProgress {
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

// AI Generated Content Types
export interface AIGeneratedContent {
  id: number
  title: string | null
  content_type: 'story' | 'dialogue' | 'exercise' | 'explanation'
  content: Record<string, unknown> // JSONB content
  jlpt_level: number | null
  topics: string[]
  estimated_reading_time: number | null
  generated_by: string | null
  generated_at: string
  version: number
  is_published: boolean
}

// Book Types
export interface Book {
  id: number
  title: string
  author: string | null
  description: string | null
  cover_image_url: string | null
  jlpt_level: number | null
  total_pages: number | null
  content: Record<string, unknown> // JSONB content
  created_at: string
  updated_at: string
  is_published: boolean
}

// Book Reading Progress Types
export interface BookReadingProgress {
  id: number
  user_id: string
  book_id: number
  current_page: number | null
  last_read: string
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Study Session Types
export interface StudySession {
  id: number
  user_id: string
  start_time: string
  end_time?: string | null
  duration?: number | null
  activities?: Record<string, unknown> // JSONB activities
  created_at: string
}

// Achievement Types
export interface Achievement {
  id: number
  name: string
  description: string | null
  icon_url: string | null
  criteria: Record<string, unknown> // JSONB criteria
  category: string | null
  created_at: string
}

// User Achievement Types
export interface UserAchievement {
  id: number
  user_id: string
  achievement_id: number
  unlocked_at: string
  created_at: string
}

// Conversation Types
export interface Conversation {
  id: number
  user_id: string
  title: string | null
  conversation_type: 'free_chat' | 'roleplay' | 'pronunciation' | 'grammar'
  started_at: string
  ended_at: string | null
  created_at: string
}

// Message Types
export interface Message {
  id: number
  conversation_id: number
  sender_type: 'user' | 'ai'
  content: string
  translated_content: {
    [language: string]: string
  } | null
  audio_url: string | null
  sentiment_score: number | null
  created_at: string
}

// Exercise Types
export interface Exercise {
  id: number
  title: string
  description: string | null
  exercise_type_id: number
  exercise_type?: ExerciseType
  jlpt_level: number | null
  difficulty: number | null
  difficulty_level?: number
  estimated_duration: number | null
  time_limit?: number
  instructions: string | null
  content: Record<string, unknown> // JSONB content
  correct_answer: string | null
  explanation: string | null
  created_at: string
  updated_at: string
  is_active: boolean
}

export interface ExerciseType {
  id: number
  name: string
  description: string | null
  icon_url: string | null
  category: string | null
  created_at: string
}

export interface UserExerciseAttempt {
  id: number
  user_id: string
  exercise_id: number
  started_at: string
  completed_at?: string | null
  time_taken?: number | null
  score?: number | null
  is_correct?: boolean | null
  user_answer?: string | null
  created_at: string
  updated_at?: string
}

// Book Types
export interface BookChapter {
  id: number
  book_id: number
  chapter_number: number
  title: string
  content: Record<string, unknown>
  furigana: Array<{
    text: string
    reading: string
    start: number
    end: number
  }>
  created_at: string
  updated_at: string
}

// Study Group Types
export interface StudyGroup {
  id: number
  name: string
  description: string | null
  created_by: string
  member_count: number
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface GroupMembership {
  id: number
  user_id: string
  group_id: number
  role: 'admin' | 'member'
  joined_at: string
  created_at: string
}

export interface ForumPost {
  id: number
  group_id: number
  user_id: string
  parent_post_id: number | null
  title: string | null
  content: string
  likes_count: number
  is_pinned?: boolean
  created_at: string
  updated_at: string
  user?: {
    full_name: string
    username: string
    avatar_url: string | null
  }
}

// ============================================================================
// SSW (Specified Skilled Worker) Types
// ============================================================================

export interface SSWContent {
  id: string
  ssw_type: 'SSW1' | 'SSW2' | 'JFT-Basic'
  sector: string
  content_category: string
  title: string
  content: Record<string, unknown>
  jlpt_equivalent: string | null
  difficulty_level: number
  practical_usage: string | null
  workplace_context: string | null
  safety_critical: boolean
  created_at: string
  updated_at: string
}

export interface SSWSectorVocabulary {
  id: string
  sector: string
  word: string
  reading: string
  romaji: string
  meaning: string
  english_translation: string
  usage_context: string | null
  formality_level: string | null
  frequency_rank: number | null
  is_critical: boolean
  example_sentences: Array<{
    japanese: string
    english: string
    context: string
  }>
  related_terms: string[]
  created_at: string
  updated_at: string
}

export interface WorkplaceScenario {
  id: string
  sector: string
  scenario_type: string
  title: string
  description: string | null
  dialogue: Array<{
    speaker: string
    japanese: string
    romaji: string
    english: string
    notes?: string
  }>
  vocabulary_focus: string[]
  grammar_focus: string[]
  cultural_notes: string | null
  difficulty_level: number
  created_at: string
}

export interface JFTBasicContent {
  id: string
  section: 'script_vocabulary' | 'conversation_expression' | 'listening' | 'reading'
  question_type: string
  content: Record<string, unknown>
  difficulty_level: number
  time_allocation: number
  created_at: string
}

// ============================================================================
// Audio System Types
// ============================================================================

export interface AudioFile {
  id: string
  content_id: string
  content_type: 'word' | 'sentence' | 'dialogue' | 'paragraph' | 'exercise' | 'chapter'
  japanese_text: string
  audio_url: string
  speaker: 'male' | 'female' | 'child' | 'elderly'
  speed: 'slow' | 'normal' | 'fast'
  dialect: string
  duration_seconds: number | null
  file_size_kb: number | null
  format: string
  quality: string
  provider: string
  provider_voice_id: string | null
  created_at: string
  updated_at: string
}

export interface PronunciationGuide {
  id: string
  word: string
  ipa_notation: string | null
  pitch_accent: string | null
  accent_type: 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka' | null
  accent_position: number | null
  audio_url: string | null
  visual_diagram_url: string | null
  common_mistakes: Array<{
    mistake: string
    correction: string
    explanation: string
  }>
  regional_variations: Array<{
    region: string
    pronunciation: string
    audio_url?: string
  }>
  created_at: string
  updated_at: string
}

export interface TTSJob {
  id: string
  text: string
  speaker: 'male' | 'female' | 'child' | 'elderly'
  speed: 'slow' | 'normal' | 'fast'
  dialect: string
  provider: string
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled'
  output_url: string | null
  error_message: string | null
  retry_count: number
  priority: number
  created_at: string
  started_at: string | null
  completed_at: string | null
}

export interface AudioUsageAnalytics {
  id: string
  audio_file_id: string
  user_id: string | null
  play_count: number
  total_listen_duration_seconds: number | null
  last_played_at: string
  created_at: string
}

// ============================================================================
// Stroke Order System Types
// ============================================================================

export interface KanjiStrokeOrder {
  id: string
  kanji: string
  stroke_count: number
  stroke_data: Array<{
    order: number
    type: string
    svg_path: string
    direction: string
    description: string
  }>
  radical: string | null
  radical_position: string | null
  radical_meaning: string | null
  animation_url: string | null
  animation_svg: string | null
  video_url: string | null
  writing_tips: string[]
  common_mistakes: Array<{
    mistake: string
    correction: string
    visual: string
  }>
  similar_kanji: string[]
  difficulty_rating: number
  jlpt_level: string | null
  joyo_grade: number | null
  frequency_rank: number | null
  created_at: string
  updated_at: string
}

export interface StrokeComponent {
  id: string
  kanji: string
  stroke_number: number
  stroke_type: string
  svg_path: string
  direction: string
  start_point: { x: number; y: number }
  end_point: { x: number; y: number }
  control_points: Array<{ x: number; y: number }> | null
  duration_ms: number
  description: string
  stroke_length: number | null
  created_at: string
}

export interface HandwritingPractice {
  id: string
  user_id: string
  kanji: string
  practice_data: Record<string, unknown>
  accuracy_score: number | null
  stroke_order_correct: boolean | null
  stroke_accuracy: Record<string, unknown> | null
  time_taken_seconds: number | null
  feedback: Record<string, unknown> | null
  practice_mode: 'guided' | 'free' | 'timed' | 'test' | null
  device_type: string | null
  created_at: string
}

export interface HandwritingAnalytics {
  id: string
  user_id: string
  kanji: string
  total_practices: number
  average_accuracy: number | null
  best_accuracy: number | null
  stroke_order_success_rate: number | null
  average_time_seconds: number | null
  improvement_trend: Record<string, unknown> | null
  weak_strokes: number[]
  last_practiced_at: string | null
  created_at: string
  updated_at: string
}

export interface KanjiMnemonic {
  id: string
  kanji: string
  mnemonic_type: 'visual' | 'story' | 'etymology' | 'phonetic' | 'user_created'
  mnemonic_text: string
  mnemonic_image_url: string | null
  effectiveness_rating: number | null
  rating_count: number
  created_by_user_id: string | null
  is_official: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// Enhanced Textbook Types (with SSW support)
// ============================================================================

export interface EnhancedTextbook extends Book {
  ssw_type?: 'SSW1' | 'SSW2' | 'JFT-Basic' | null
  target_sector?: string | null
  workplace_focus?: boolean
}

export interface EnhancedTextbookChapter {
  id: string
  textbook_id: string
  chapter_number: number
  title: string
  introduction: string | null
  sections: Array<Record<string, unknown>>
  vocabulary: Array<Record<string, unknown>>
  grammar_points: Array<Record<string, unknown>>
  exercises: Array<Record<string, unknown>>
  content: Record<string, unknown>
  content_type: string
  includes_exercises: boolean
  includes_cultural_notes: boolean
  includes_slang: boolean
  includes_mnemonics: boolean
  ssw_relevant: boolean
  workplace_scenarios: Array<Record<string, unknown>>
  sector_vocabulary: Array<Record<string, unknown>>
  estimated_time_minutes: number | null
  generated_at: string | null
  created_at: string
  updated_at: string
}
