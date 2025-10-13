/**
 * Type definitions for Book Generation System
 */

export type BookType = 'ssw_sector' | 'jlpt_level' | 'custom'
export type GenerationStatus =
  | 'pending'
  | 'initializing'
  | 'generating'
  | 'validating'
  | 'finalizing'
  | 'completed'
  | 'failed'
  | 'cancelled'

export type ChapterStatus =
  | 'pending'
  | 'queued'
  | 'generating'
  | 'validating'
  | 'completed'
  | 'failed'
  | 'retrying'

export interface BookGenerationConfig {
  parallelChapters: number
  useStreaming: boolean
  includeExercises: boolean
  includeAudioScripts: boolean
  includeCulturalNotes: boolean
  vocabularyDensity: 'low' | 'medium' | 'high'
  grammarFocus: boolean
  retryOnFailure: boolean
  maxRetries: number
}

export interface BookGenerationRequest {
  bookType: BookType
  sectorId?: string // For SSW: 'caregiving', 'construction', etc.
  jlptLevel?: string // For JLPT: 'N5', 'N4', 'N3', 'N2', 'N1'
  customConfig?: Record<string, unknown>
  templateId?: string
  targetPages?: number
  targetChapters?: number
  bookTitle?: string
  config: Partial<BookGenerationConfig>
  userId?: string
}

export interface BookTemplate {
  id: string
  name: string
  description: string
  templateType: 'ssw_sector' | 'jlpt_level' | 'custom'
  structure: BookStructure
  contentRequirements: ContentRequirements
  validationRules: ValidationRules
  prompts: PromptTemplates
}

export interface BookStructure {
  parts: BookPart[]
  totalChapters: number
  totalPages: number
}

export interface BookPart {
  title: string
  chapters: number
  pages: number
  sections: string[]
}

export interface ContentRequirements {
  vocabularyPerChapter: number
  grammarPointsPerChapter: number
  examplesPerGrammar: number
  dialoguesPerChapter: number
  exercisesPerChapter: number
  minWordCount: number
  maxWordCount: number
}

export interface ValidationRules {
  requireSafetyContent: boolean
  requireCulturalNotes: boolean
  jlptCompliance: boolean
  minVocabulary: number
  minGrammarPoints: number
}

export interface PromptTemplates {
  chapterPrompt?: string
  sectionPrompt?: string
  vocabularyPrompt?: string
  dialoguePrompt?: string
  exercisePrompt?: string
}

export interface BookGenerationJob {
  id: string
  userId?: string
  bookType: BookType
  sectorId?: string
  jlptLevel?: string
  customConfig?: Record<string, unknown>
  templateId?: string
  targetPages: number
  targetChapters: number
  bookTitle?: string
  generationConfig: BookGenerationConfig
  status: GenerationStatus
  progressPercentage: number
  currentStage?: string
  chaptersTotal: number
  chaptersCompleted: number
  chaptersFailed: number
  chaptersInProgress: number
  startedAt?: Date
  completedAt?: Date
  estimatedCompletionTime?: Date
  totalGenerationTimeSeconds?: number
  outputBookId?: string
  outputFiles: OutputFile[]
  errorMessage?: string
  errorDetails?: Record<string, unknown>
  retryCount: number
  aiModel: string
  totalTokensUsed: number
  totalCostUsd: number
  createdAt: Date
  updatedAt: Date
}

export interface OutputFile {
  type: 'pdf' | 'markdown' | 'epub' | 'json'
  url: string
  size?: number
  createdAt: Date
}

export interface ChapterGenerationTask {
  id: string
  jobId: string
  chapterNumber: number
  chapterTitle?: string
  partNumber?: number
  partTitle?: string
  targetWordCount: number
  vocabularyList: VocabularyEntry[]
  grammarPoints: GrammarPattern[]
  dialogueScenarios: string[]
  prompt: string
  generationParams: GenerationParams
  status: ChapterStatus
  retryCount: number
  maxRetries: number
  outputChapterId?: string
  generatedContent?: GeneratedChapter
  generatedMarkdown?: string
  wordCount?: number
  validationStatus?: string
  validationResults?: ValidationResult
  qualityScore?: number
  startedAt?: Date
  completedAt?: Date
  generationTimeSeconds?: number
  errorMessage?: string
  tokensUsed?: number
  aiModel?: string
  costUsd?: number
  createdAt: Date
  updatedAt: Date
}

export interface GenerationParams {
  temperature: number
  maxTokens: number
  model: string
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export interface VocabularyEntry {
  id?: string
  word: string
  reading: string
  romaji?: string
  primaryMeaning: string
  alternativeMeanings?: string[]
  jlptLevel?: string
  partOfSpeech?: string
  formalityLevel?: string
  usageFrequency?: string
  safetyCritical?: boolean
  workplaceEssential?: boolean
  exampleSentences?: ExampleSentence[]
  collocations?: string[]
  culturalNotes?: string
  usageNotes?: string
}

export interface ExampleSentence {
  japanese: string
  romaji?: string
  english: string
  context?: string
}

export interface GrammarPattern {
  id?: string
  pattern: string
  meaning: string
  usage: string
  jlptLevel?: string
  formality?: string
  examples?: ExampleSentence[]
  notes?: string
}

export interface DialogueTemplate {
  id: string
  category: string
  sector?: string
  scenarioType: string
  title: string
  description?: string
  setting?: string
  participants: number
  participantRoles: ParticipantRole[]
  dialogueStructure: DialogueLine[]
  keyPhrases: KeyPhrase[]
  grammarPoints: string[]
  vocabularyFocus: string[]
  culturalNotes?: string
  jlptLevel?: string
  difficulty: number
  formalityLevel?: string
}

export interface ParticipantRole {
  name: string
  role: string
  description?: string
}

export interface DialogueLine {
  speaker: string
  japanese: string
  romaji?: string
  english: string
  notes?: string
}

export interface KeyPhrase {
  phrase: string
  reading?: string
  meaning: string
  usage: string
  notes?: string
}

export interface GeneratedChapter {
  chapterNumber: number
  title: string
  introduction: string
  sections: ChapterSection[]
  vocabulary: VocabularyEntry[]
  grammarPoints: GrammarPattern[]
  dialogues: GeneratedDialogue[]
  exercises: Exercise[]
  culturalNotes?: string[]
  summary?: string
  metadata: ChapterMetadata
}

export interface ChapterSection {
  heading: string
  content: string
  examples?: ExampleSentence[]
  notes?: string[]
}

export interface GeneratedDialogue {
  title: string
  setting: string
  participants: string[]
  lines: DialogueLine[]
  keyPhrases: KeyPhrase[]
  notes?: string
}

export interface Exercise {
  type: 'multiple_choice' | 'fill_blank' | 'translation' | 'matching' | 'writing'
  question: string
  options?: string[]
  correctAnswer: string
  explanation: string
  difficulty?: number
}

export interface ChapterMetadata {
  wordCount: number
  vocabularyCount: number
  grammarCount: number
  dialogueCount: number
  exerciseCount: number
  estimatedReadingTime: number // minutes
  difficulty: number
  jlptLevel?: string
}

export interface ValidationResult {
  valid: boolean
  checks: ValidationCheck[]
  score: number
}

export interface ValidationCheck {
  category: string
  level: 'info' | 'warning' | 'error' | 'critical'
  message: string
  details?: Record<string, unknown>
}

export interface ProgressUpdate {
  jobId: string
  status: GenerationStatus
  progressPercentage: number
  currentStage: string
  chaptersCompleted: number
  chaptersTotal: number
  chaptersFailed: number
  estimatedCompletionTime?: Date
  message?: string
}

export interface BookExportOptions {
  bookId: string
  format: 'pdf' | 'markdown' | 'epub' | 'json'
  includeMetadata: boolean
  includeTOC: boolean
  includeAnswers: boolean
}
