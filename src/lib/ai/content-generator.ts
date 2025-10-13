import type { AIGeneratedContent } from '../database/types'
import { jlptContentGenerator } from './jlpt-content-generator'
import type { JLPTLevel } from './jlpt-content-spec'
import { ModelTask, modelRouter } from './model-router'

// Types for AI content generation
export interface AIContentRequest {
  type: 'story' | 'dialogue' | 'exercise' | 'explanation'
  jlptLevel: number
  topic?: string
  keywords?: string[]
  length?: 'short' | 'medium' | 'long'
}

// Enhanced JLPT-compliant content generation interface
export interface JLPTContentRequest {
  type:
    | 'textbook_chapter'
    | 'grammar_lesson'
    | 'vocabulary_lesson'
    | 'kanji_lesson'
    | 'colloquial_lesson'
  jlptLevel: JLPTLevel
  topic?: string
  specificContent?: {
    grammarPatterns?: string[]
    vocabularyIds?: string[]
    kanjiIds?: string[]
    slangIds?: string[]
  }
  options?: {
    includeExamples?: boolean
    includeExercises?: boolean
    includeCulturalNotes?: boolean
    includeSlang?: boolean
    includeMnemonics?: boolean
  }
}

export interface AIStoryContent {
  title: string
  content: string
  vocabulary: Array<{
    word: string
    reading: string
    meaning: string
  }>
  grammarPoints: Array<{
    structure: string
    meaning: string
    example: string
  }>
}

export interface AIDialogueContent {
  title: string
  participants: string[]
  dialogue: Array<{
    speaker: string
    text: string
    translation: string
  }>
  vocabulary: Array<{
    word: string
    reading: string
    meaning: string
  }>
}

export interface AIExerciseContent {
  title: string
  instructions: string
  questions: Array<{
    question: string
    options?: string[]
    correctAnswer: string
    explanation: string
  }>
  difficulty: number
}

export interface AIExplanationContent {
  title: string
  explanation: string
  examples: Array<{
    japanese: string
    english: string
  }>
  relatedTopics: string[]
}

/**
 * Generate AI content using NVIDIA's stockmark-2-100b-instruct model
 * This is the primary content generation function for the Shinmen Takezo platform
 *
 * @param request - Content generation request with type, level, topic, and options
 * @returns Generated content or null if generation fails
 * @throws Error with detailed message if generation fails
 */
export const generateAIContent = async (
  request: AIContentRequest
): Promise<AIGeneratedContent | null> => {
  try {
    console.log(`🎨 Generating ${request.type} content for JLPT N${request.jlptLevel}...`)
    console.log(`   Topic: ${request.topic || 'General'}`)
    console.log(`   Keywords: ${request.keywords?.join(', ') || 'None'}`)

    // Validate request
    if (!request.type || !request.jlptLevel) {
      throw new Error('Invalid request: type and jlptLevel are required')
    }

    if (request.jlptLevel < 1 || request.jlptLevel > 5) {
      throw new Error('Invalid JLPT level: must be between 1 and 5')
    }

    // Use the model router which handles NVIDIA API with stockmark-2-100b-instruct
    const response = await modelRouter.generateContent(
      request.type,
      request.jlptLevel,
      request.topic,
      request.keywords
    )

    // Parse the JSON response from the AI
    let contentData
    try {
      contentData = JSON.parse(response.content)
    } catch (_parseError) {
      console.error('Failed to parse AI response:', response.content.substring(0, 200))
      throw new Error('Invalid JSON response from AI model')
    }

    // Create AI generated content record
    const aiContent: AIGeneratedContent = {
      id: 0, // Will be set by database
      title: contentData.title || 'Generated Content',
      content_type: request.type,
      content: contentData,
      jlpt_level: request.jlptLevel,
      topics: request.topic ? [request.topic] : [],
      estimated_reading_time: calculateReadingTime(request.length || 'medium'),
      generated_by: `NVIDIA ${response.model}`,
      generated_at: new Date().toISOString(),
      version: 1,
      is_published: false,
    }

    console.log(`✅ Generated ${request.type} content: "${aiContent.title}"`)
    return aiContent
  } catch (error) {
    console.error('❌ Error generating AI content:', error)
    return null
  }
}

/**
 * Calculate estimated reading time based on length
 */
function calculateReadingTime(length: 'short' | 'medium' | 'long'): number {
  switch (length) {
    case 'short':
      return 5
    case 'long':
      return 20
    default: // medium
      return 10
  }
}

/**
 * Save generated content to database
 * TODO: Implement with actual database when Supabase is configured
 */
export const saveAIContent = async (
  content: Omit<AIGeneratedContent, 'id' | 'generated_at'>
): Promise<AIGeneratedContent | null> => {
  try {
    // This will be implemented with Supabase
    const savedContent: AIGeneratedContent = {
      ...content,
      id: Date.now(), // Temporary mock ID
      generated_at: new Date().toISOString(),
    }

    console.log(`💾 Saved content: ${savedContent.title}`)
    return savedContent
  } catch (error) {
    console.error('Error saving AI content:', error)
    return null
  }
}

/**
 * Generate JLPT-compliant content using enhanced system
 *
 * @param request - JLPT content generation request with type, level, and options
 * @returns Generated JLPT-compliant content
 * @throws Error with detailed message if generation fails
 */
export const generateJLPTContent = async (request: JLPTContentRequest): Promise<unknown> => {
  console.log(`🎯 Generating JLPT ${request.type} for level ${request.jlptLevel}...`)
  console.log(`   Topic: ${request.topic || 'General'}`)
  console.log(`   Options:`, request.options)

  // Validate request
  if (!request.type) {
    throw new Error('Content type is required')
  }

  if (!request.jlptLevel || !['N1', 'N2', 'N3', 'N4', 'N5'].includes(request.jlptLevel)) {
    throw new Error('Valid JLPT level (N1-N5) is required')
  }

  try {
    let result

    switch (request.type) {
      case 'textbook_chapter':
        console.log(`   📚 Generating comprehensive textbook chapter...`)
        result = await jlptContentGenerator.generateTextbookChapter({
          jlptLevel: request.jlptLevel,
          chapterNumber: 1, // Default, should be passed in request
          topic: request.topic || 'General Japanese',
          grammarPatterns: request.specificContent?.grammarPatterns || [],
          vocabularyItems: request.specificContent?.vocabularyIds || [],
          kanjiCharacters: request.specificContent?.kanjiIds || [],
          includeCulturalNotes: request.options?.includeCulturalNotes !== false,
          includeSlang: request.options?.includeSlang || false,
        })
        break

      case 'grammar_lesson': {
        console.log(`   📖 Generating grammar-focused lesson...`)
        const grammarPattern =
          request.specificContent?.grammarPatterns?.[0] || request.topic || 'Basic Grammar'
        result = await jlptContentGenerator.generateGrammarLesson({
          jlptLevel: request.jlptLevel,
          grammarPatternId: grammarPattern,
          includeComparisons: request.options?.includeExamples !== false,
          includeExercises: request.options?.includeExercises !== false,
        })
        break
      }

      case 'vocabulary_lesson':
        console.log(`   📝 Generating vocabulary-focused lesson...`)
        result = await jlptContentGenerator.generateVocabularyLesson({
          jlptLevel: request.jlptLevel,
          theme: request.topic || 'General Vocabulary',
          vocabularyIds: request.specificContent?.vocabularyIds || [],
          includeExamples: request.options?.includeExamples !== false,
          includeMnemonics: request.options?.includeMnemonics !== false,
        })
        break

      case 'kanji_lesson':
        console.log(`   🀄 Generating kanji-focused lesson...`)
        result = await jlptContentGenerator.generateKanjiLesson({
          jlptLevel: request.jlptLevel,
          kanjiIds: request.specificContent?.kanjiIds || [],
          includeStrokeOrder: true,
          includeMnemonics: request.options?.includeMnemonics !== false,
          includeCompounds: true,
        })
        break

      case 'colloquial_lesson':
        console.log(`   💬 Generating modern Japanese/slang lesson...`)
        result = await jlptContentGenerator.generateColloquialLesson({
          category: 'youth_slang',
          expressions: request.specificContent?.slangIds || [],
          includeComparisons: request.options?.includeExamples !== false,
        })
        break

      default:
        throw new Error(`Unknown content type: ${request.type}`)
    }

    if (!result) {
      throw new Error(`Failed to generate ${request.type} - no content returned`)
    }

    console.log(`   ✅ Successfully generated ${request.type}`)
    return result
  } catch (error: unknown) {
    console.error(`   ❌ Error generating JLPT content:`, error)
    console.error(`   Error details:`, {
      type: request.type,
      level: request.jlptLevel,
      topic: request.topic,
      message: error instanceof Error ? error.message : 'Unknown error',
    })
    throw new Error(
      `Failed to generate ${request.type}: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

/**
 * Generate textbook chapter using AI (legacy method - maintained for backward compatibility)
 */
export const generateTextbookChapter = async (
  jlptLevel: number,
  chapterNumber: number,
  topic: string,
  includeExercises: boolean = true
): Promise<unknown> => {
  console.log(
    `🔄 Using legacy textbook generation (consider using generateJLPTContent for enhanced features)`
  )

  const maxRetries = 3
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🎯 Generating chapter (attempt ${attempt}/${maxRetries})...`)

      const response = await modelRouter.route({
        task: ModelTask.TEXTBOOK_GENERATION,
        messages: [
          {
            role: 'system',
            content:
              'You are an expert Japanese textbook author with 20+ years of experience. Create comprehensive, well-structured educational content for JLPT learners. ALWAYS respond with VALID JSON only, no markdown formatting, no code blocks.',
          },
          {
            role: 'user',
            content: `Create Chapter ${chapterNumber} of a JLPT N${jlptLevel} textbook on the topic: ${topic}.

IMPORTANT: Respond ONLY with valid JSON. Do not include markdown code blocks, backticks, or any other formatting.

Include:
1. Engaging chapter title and introduction (2-3 paragraphs)
2. 3-4 main sections with detailed explanations
3. At least 5 example sentences with translations and romaji
4. 10-15 key vocabulary items with readings and meanings
5. 3-5 grammar points with clear patterns and usage examples
${includeExercises ? '6. 5-8 practice exercises with explanations' : ''}

Required JSON structure:
{
  "title": "Engaging chapter title",
  "introduction": "2-3 paragraph introduction explaining the chapter content and importance",
  "sections": [
    {
      "heading": "Section heading",
      "content": "Detailed content with explanations",
      "examples": [{"japanese": "日本語例文", "romaji": "Romanization", "english": "English translation"}]
    }
  ],
  "vocabulary": [{"word": "単語", "reading": "たんご", "meaning": "vocabulary word"}],
  "grammarPoints": [{"pattern": "Grammar pattern", "meaning": "What it means", "usage": "When and how to use it"}]${includeExercises ? ',\n  "exercises": [{"question": "Question text", "options": ["Option 1", "Option 2", "Option 3", "Option 4"], "answer": "Correct option", "explanation": "Why this is correct"}]' : ''}
}`,
          },
        ],
        temperature: 0.7,
        maxTokens: 8000,
      })

      // Clean the response content
      let cleanContent = response.content.trim()

      // Remove markdown code blocks if present
      cleanContent = cleanContent.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '')
      cleanContent = cleanContent.replace(/^```\s*/gi, '').replace(/```\s*$/gi, '')

      // Try to extract JSON if wrapped in text
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanContent = jsonMatch[0]
      }

      console.log('📝 Parsing AI response...')
      const parsedContent = JSON.parse(cleanContent)

      // Validate required fields
      if (!parsedContent.title || !parsedContent.introduction) {
        throw new Error('Missing required fields in generated content')
      }

      // Ensure arrays exist
      parsedContent.sections = parsedContent.sections || []
      parsedContent.vocabulary = parsedContent.vocabulary || []
      parsedContent.grammarPoints = parsedContent.grammarPoints || []
      parsedContent.exercises = parsedContent.exercises || []

      console.log('✅ Chapter generated and validated successfully')
      return parsedContent
    } catch (error) {
      lastError = error as Error
      console.error(`❌ Attempt ${attempt} failed:`, error instanceof Error ? error.message : error)

      if (attempt < maxRetries) {
        const delay = attempt * 2000 // Exponential backoff
        console.log(`⏳ Waiting ${delay / 1000}s before retry...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  console.error('💥 All retry attempts exhausted')
  throw new Error(`Failed to generate chapter after ${maxRetries} attempts: ${lastError?.message}`)
}

/**
 * Generate conversation practice scenario
 */
export const generateConversationScenario = async (
  jlptLevel: number,
  scenario: string,
  participants: number = 2
): Promise<unknown> => {
  try {
    const response = await modelRouter.route({
      task: ModelTask.CONVERSATION_PRACTICE,
      messages: [
        {
          role: 'system',
          content:
            "You are a Japanese conversation instructor. Create realistic, natural dialogues appropriate for the learner's level.",
        },
        {
          role: 'user',
          content: `Create a conversation scenario for JLPT N${jlptLevel} level.

Scenario: ${scenario}
Number of participants: ${participants}

Requirements:
- Natural Japanese conversation
- Appropriate for N${jlptLevel} level vocabulary and grammar
- Include cultural context
- Provide translations and key phrases

Format as JSON:
{
  "title": "Scenario title",
  "setting": "Description of setting",
  "participants": ["Name 1", "Name 2"],
  "dialogue": [
    {"speaker": "Name", "japanese": "...", "romaji": "...", "english": "..."}
  ],
  "keyPhrases": [{"phrase": "...", "usage": "...", "notes": "..."}],
  "culturalNotes": "Any relevant cultural information"
}`,
        },
      ],
      temperature: 0.8,
      maxTokens: 4000,
    })

    return JSON.parse(response.content)
  } catch (error) {
    console.error('Error generating conversation scenario:', error)
    return null
  }
}
