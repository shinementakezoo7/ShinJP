/**
 * JLPT Content Specification System
 *
 * Complete data structures and specifications for Japanese language content
 * generation following JLPT N5-N1 standards with modern colloquial Japanese.
 *
 * Based on comprehensive research of:
 * - JLPT Official Test Specifications
 * - Jōyō Kanji (2,136 characters)
 * - Contemporary Japanese Language Usage
 * - Youth Slang and Internet Language
 * - Regional Dialects
 * - Business/Keigo Language
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'N1+'
export type FormalityLevel =
  | 'very_formal'
  | 'formal'
  | 'neutral'
  | 'casual'
  | 'very_casual'
  | 'slang'
export type SkillType =
  | 'grammar'
  | 'vocabulary'
  | 'kanji'
  | 'listening'
  | 'reading'
  | 'speaking'
  | 'writing'

// ============================================================================
// GRAMMAR PATTERN SPECIFICATION
// ============================================================================

export interface GrammarPattern {
  id: string
  pattern: string
  pattern_hiragana?: string
  jlpt_level: JLPTLevel
  frequency_score: number // 1-100

  meanings: {
    primary: string
    secondary: string[]
    nuances?: string
  }

  formation_rules: {
    structure: string
    verb_forms?: string[]
    adjective_forms?: string[]
    noun_forms?: string[]
    particles?: string[]
  }

  usage_contexts: string[]
  formality_level: FormalityLevel

  examples: GrammarExample[]
  common_mistakes: CommonMistake[]

  related_grammar: string[] // IDs of related patterns
  prerequisites: string[] // IDs of prerequisite patterns

  casual_variations: string[]
  regional_variations?: RegionalVariation[]

  cultural_notes?: string
  pitch_accent_notes?: string

  practice_exercises: PracticeExercise[]
}

export interface GrammarExample {
  japanese: string
  romaji: string
  english: string
  formality: FormalityLevel
  context: string
  audio_url?: string
  breakdown?: WordBreakdown[]
}

export interface WordBreakdown {
  word: string
  reading: string
  meaning: string
  part_of_speech: string
}

export interface CommonMistake {
  error: string
  correction: string
  explanation: string
  example_wrong?: string
  example_correct?: string
}

export interface PracticeExercise {
  type: 'fill_in_blank' | 'transformation' | 'choice' | 'translation' | 'sentence_building'
  question: string
  options?: string[]
  answer: string
  explanation: string
  difficulty: number
}

export interface RegionalVariation {
  region: string
  dialect: string
  variation: string
  usage_notes: string
}

// ============================================================================
// VOCABULARY SPECIFICATION
// ============================================================================

export interface VocabularyEntry {
  id: string
  word: string
  reading: string
  romaji: string
  alternative_writings?: string[]

  word_type: WordType
  jlpt_level: JLPTLevel
  frequency_rank: number

  meanings: {
    primary: string
    secondary: string[]
    nuances?: string
    context_specific?: ContextualMeaning[]
  }

  kanji_breakdown: KanjiInWord[]

  conjugations?: VerbConjugations | AdjectiveConjugations

  example_sentences: VocabularyExample[]

  collocations: string[]
  synonyms: RelatedWord[]
  antonyms: RelatedWord[]
  related_words: RelatedWord[]

  formality_level: FormalityLevel
  usage_notes?: string
  cultural_context?: string

  slang_casual_forms?: SlangVariation[]

  pitch_accent_pattern?: string
  pitch_accent_type?: 'heiban' | 'atamadaka' | 'nakadaka' | 'odaka'

  audio_files: string[]
  images?: string[]

  common_mistakes: CommonMistake[]
}

export type WordType =
  | 'noun'
  | 'verb_ichidan'
  | 'verb_godan'
  | 'verb_irregular'
  | 'i_adjective'
  | 'na_adjective'
  | 'adverb'
  | 'particle'
  | 'conjunction'
  | 'counter'
  | 'expression'
  | 'prefix'
  | 'suffix'

export interface KanjiInWord {
  kanji: string
  reading_in_word: string
  reading_type: 'on_yomi' | 'kun_yomi' | 'special'
}

export interface VerbConjugations {
  dictionary_form: string
  masu_form: string
  te_form: string
  ta_form: string
  nai_form: string
  potential: string
  passive: string
  causative: string
  causative_passive: string
  volitional: string
  conditional: string
  imperative: string
  provisional: string
}

export interface AdjectiveConjugations {
  present: string
  past: string
  negative: string
  past_negative: string
  te_form: string
  adverbial: string
  conditional: string
}

export interface VocabularyExample {
  japanese: string
  romaji: string
  english: string
  formality: FormalityLevel
  context: string
  audio_url?: string
}

export interface ContextualMeaning {
  context: string
  meaning: string
  example: string
}

export interface RelatedWord {
  word: string
  reading: string
  meaning: string
  note?: string
}

export interface SlangVariation {
  form: string
  usage: string
  formality: FormalityLevel
  age_group?: string
  region?: string
}

// ============================================================================
// KANJI SPECIFICATION
// ============================================================================

export interface KanjiEntry {
  id: string
  character: string

  jlpt_level?: JLPTLevel
  joyo_grade?: number // 1-6 for elementary, 8 for secondary
  frequency_rank: number

  stroke_count: number
  stroke_order: {
    sequence: string[]
    animation_url?: string
    image_url?: string
    description: string
  }

  radicals: {
    primary: string
    components: string[]
    position?: 'left' | 'right' | 'top' | 'bottom' | 'enclosure' | 'other'
  }

  meanings: string[]

  readings: {
    on_yomi: OnYomiReading[]
    kun_yomi: KunYomiReading[]
    nanori?: string[] // Name readings
    special_readings?: SpecialReading[]
  }

  visual_etymology?: string
  historical_forms?: string[]

  common_words: KanjiCompound[]

  example_sentences: KanjiExample[]

  mnemonics: string[]
  similar_looking: string[]
  similar_meaning?: string[]

  writing_tips?: string
  common_mistakes: CommonMistake[]

  cultural_notes?: string
  idioms_proverbs?: IdiomProverb[]
}

export interface OnYomiReading {
  reading: string
  compounds: string[]
}

export interface KunYomiReading {
  reading: string
  variations?: string[]
  compounds: string[]
}

export interface SpecialReading {
  word: string
  reading: string
  meaning: string
  note: string
}

export interface KanjiCompound {
  word: string
  reading: string
  meaning: string
  frequency: 'very_high' | 'high' | 'medium' | 'low'
  jlpt_level?: JLPTLevel
}

export interface KanjiExample {
  japanese: string
  romaji: string
  english: string
  jlpt_level?: JLPTLevel
  kanji_focus: string[]
}

export interface IdiomProverb {
  expression: string
  reading: string
  meaning: string
  origin?: string
}

// ============================================================================
// COLLOQUIAL & SLANG SPECIFICATION
// ============================================================================

export interface SlangExpression {
  id: string
  expression: string
  reading?: string
  romaji: string

  category: SlangCategory

  origin: string
  etymology?: string

  meanings: string[]

  variations: SlangVariationDetail[]

  example_conversations: ConversationExample[]

  formality_level: FormalityLevel
  age_group: string
  region?: string

  usage_period: string // 'current', '2010s', 'fading', 'emerging'
  trending_status: 'hot' | 'stable' | 'declining' | 'classic'

  platforms: Platform[]

  equivalent_formal_expression?: string
  equivalent_standard_japanese?: string

  usage_warnings?: string
  appropriateness: AppropriatenessContext[]
}

export type SlangCategory =
  | 'abbreviation'
  | 'youth_slang'
  | 'internet_slang'
  | 'gaming'
  | 'anime_manga'
  | 'social_media'
  | 'business_casual'
  | 'street_language'

export type Platform =
  | 'LINE'
  | 'Twitter'
  | 'Instagram'
  | 'TikTok'
  | 'YouTube'
  | 'Discord'
  | '2channel'
  | 'Niconico'
  | 'street'
  | 'gaming'

export interface SlangVariationDetail {
  form: string
  usage: string
  note?: string
}

export interface ConversationExample {
  context: string
  dialogue: DialogueLine[]
  formality: FormalityLevel
  age_group?: string
}

export interface DialogueLine {
  speaker: string
  japanese: string
  romaji: string
  english: string
}

export interface AppropriatenessContext {
  situation: string
  appropriate: boolean
  note: string
}

// ============================================================================
// DIALECT SPECIFICATION
// ============================================================================

export interface DialectExpression {
  id: string
  expression: string
  dialect_name: string
  region: string

  standard_japanese_equivalent: string
  meanings: string[]

  example_sentences: DialectExample[]

  phonetic_differences?: string
  grammar_variations?: string[]

  cultural_context?: string
  stereotypes?: string
  media_references?: string[]

  usage_frequency: 'common' | 'occasional' | 'rare' | 'archaic'
}

export interface DialectExample {
  dialect: string
  standard: string
  english: string
  context?: string
}

// ============================================================================
// CULTURAL & KEIGO SPECIFICATION
// ============================================================================

export interface KeigoPattern {
  id: string
  plain_form: string
  respectful_form: string
  humble_form: string

  verb_type: string
  jlpt_level: JLPTLevel

  usage_context: {
    respectful: string[]
    humble: string[]
  }

  examples: KeigoExample[]
  common_mistakes: CommonMistake[]
}

export interface KeigoExample {
  situation: string
  sentence: string
  translation: string
  formality: 'respectful' | 'humble' | 'polite'
  appropriate: boolean
  note?: string
}

export interface CulturalNote {
  id: string
  title: string
  category: CultureCategory

  content: string
  historical_context?: string
  modern_application: string

  related_vocabulary: string[] // vocab IDs
  related_grammar: string[] // grammar IDs

  practical_phrases: PracticalPhrase[]
  dos_and_donts: DoAndDont[]

  regional_variations?: string[]
  examples: string[]

  common_mistakes_by_foreigners: string[]
}

export type CultureCategory =
  | 'greetings'
  | 'business_etiquette'
  | 'gift_giving'
  | 'dining'
  | 'festivals'
  | 'family'
  | 'education'
  | 'work_culture'
  | 'social_hierarchy'
  | 'communication_style'

export interface PracticalPhrase {
  japanese: string
  reading: string
  english: string
  when_to_use: string
}

export interface DoAndDont {
  type: 'do' | 'dont'
  description: string
  reason: string
}

// ============================================================================
// CONTENT GENERATION SPECIFICATION
// ============================================================================

export interface TextbookChapterSpec {
  chapter_number: number
  jlpt_level: JLPTLevel
  topic: string

  learning_objectives: string[]

  estimated_study_time: number // minutes

  prerequisites: {
    grammar: string[]
    vocabulary: string[]
    kanji: string[]
  }

  content_structure: {
    introduction: string
    sections: ChapterSection[]
  }

  new_grammar: string[] // grammar pattern IDs to introduce
  new_vocabulary: string[] // vocabulary IDs to introduce
  new_kanji: string[] // kanji IDs to introduce

  cultural_content?: string[] // cultural note IDs

  exercises: ExerciseSet

  review_items: ReviewItem[]

  assessment: AssessmentSpec
}

export interface ChapterSection {
  heading: string
  content: string
  examples: ContentExample[]
  explanation_depth: 'basic' | 'intermediate' | 'advanced'
  visual_aids?: VisualAid[]
}

export interface ContentExample {
  japanese: string
  romaji?: string
  english: string
  breakdown?: WordBreakdown[]
  audio_url?: string
  notes?: string
}

export interface VisualAid {
  type: 'diagram' | 'chart' | 'illustration' | 'table'
  url?: string
  description: string
  data?: Record<string, unknown>
}

export interface ExerciseSet {
  grammar_exercises: PracticeExercise[]
  vocabulary_exercises: PracticeExercise[]
  kanji_exercises: PracticeExercise[]
  listening_exercises: PracticeExercise[]
  reading_exercises: PracticeExercise[]
  writing_exercises: PracticeExercise[]

  comprehensive_exercises: PracticeExercise[] // Mixed skill practice
}

export interface ReviewItem {
  content_type: 'grammar' | 'vocabulary' | 'kanji'
  content_id: string
  review_type: 'quick' | 'detailed' | 'application'
}

export interface AssessmentSpec {
  quiz_questions: QuizQuestion[]
  passing_score: number
  time_limit?: number // minutes
  feedback_rubric: FeedbackCriteria[]
}

export interface QuizQuestion {
  question: string
  type: 'multiple_choice' | 'fill_in' | 'translation' | 'listening' | 'reading_comprehension'
  options?: string[]
  correct_answer: string
  explanation: string
  points: number
  difficulty: number
}

export interface FeedbackCriteria {
  aspect: string
  weight: number
  scoring_guide: string
}

// ============================================================================
// JLPT LEVEL SPECIFICATIONS (Complete Coverage Requirements)
// ============================================================================

export const JLPT_LEVEL_SPECS = {
  N5: {
    study_hours: { min: 250, max: 400 },
    kanji_count: { target: 103, range: '80-103' },
    vocabulary_count: { target: 800, range: '800-1000' },
    grammar_patterns: { target: 80, range: '80-100' },
    description: 'Foundation Level - Basic Japanese mainly learned in classroom settings',
    can_do: [
      'Read and understand hiragana, katakana, and basic kanji',
      'Understand basic sentences and everyday expressions',
      'Hold simple conversations about daily life',
      'Understand basic instructions and notices',
    ],
  },

  N4: {
    study_hours: { min: 550, max: 900 },
    kanji_count: { target: 300, cumulative: 300, new: 197 },
    vocabulary_count: { target: 1500, cumulative: 1500, new: 700 },
    grammar_patterns: { target: 150, cumulative: 150, new: 70 },
    description: 'Elementary Level - Basic understanding of daily Japanese',
    can_do: [
      'Read and understand passages on familiar topics',
      'Comprehend simple conversations at near-natural speed',
      'Understand main points of conversations in daily life',
      'Read simple texts written in basic vocabulary and kanji',
    ],
  },

  N3: {
    study_hours: { min: 900, max: 1400 },
    kanji_count: { target: 650, cumulative: 650, new: 350 },
    vocabulary_count: { target: 3750, cumulative: 3750, new: 2250 },
    grammar_patterns: { target: 200, cumulative: 200, new: 50 },
    description: 'Intermediate Bridge Level - Understanding Japanese in everyday situations',
    can_do: [
      'Read and understand texts about everyday topics',
      'Comprehend main points of coherent conversations',
      'Understand newspaper headlines',
      'Follow gist of TV programs with some visual aids',
    ],
  },

  N2: {
    study_hours: { min: 1400, max: 2200 },
    kanji_count: { target: 1000, cumulative: 1000, new: 350 },
    vocabulary_count: { target: 6000, cumulative: 6000, new: 2250 },
    grammar_patterns: { target: 197, cumulative: 350, new: 150 },
    description: 'Upper-Intermediate Level - Understanding Japanese in various situations',
    can_do: [
      'Read materials on general topics',
      'Follow newspaper articles and critiques',
      'Understand everyday conversations at natural speed',
      'Comprehend content with varied expression',
    ],
  },

  N1: {
    study_hours: { min: 3100, max: 4500 },
    kanji_count: { target: 2136, cumulative: 2136, new: 1136 },
    vocabulary_count: { target: 10000, cumulative: 10000, new: 4000 },
    grammar_patterns: { target: 240, cumulative: 600, new: 250 },
    description: 'Advanced Level - Understanding Japanese in most circumstances',
    can_do: [
      'Read writings with logical complexity and abstract content',
      'Comprehend orally presented materials at natural speed',
      'Understand detailed news reports and newspaper articles',
      'Follow abstract and complex discussions',
    ],
  },
} as const

export default JLPT_LEVEL_SPECS
