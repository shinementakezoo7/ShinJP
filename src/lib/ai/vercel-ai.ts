/**
 * Vercel AI SDK Integration
 * Simplifies AI streaming and state management with NVIDIA models
 */

import { createOpenAI } from '@ai-sdk/openai'
import { generateObject, generateText, streamText } from 'ai'
import { z } from 'zod'

// Configure NVIDIA AI provider using OpenAI-compatible API
const nvidia = createOpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '',
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
})

// Default models
const DEFAULT_MODEL = 'meta/llama-3.1-8b-instruct'
const _JAPANESE_MODEL = 'stockmark/stockmark-13b-instruct' // Better for Japanese

/**
 * Generate text with streaming
 */
export async function generateAIText(
  prompt: string,
  options?: {
    model?: string
    temperature?: number
  }
) {
  try {
    const result = await streamText({
      model: nvidia(options?.model || DEFAULT_MODEL),
      prompt,
      temperature: options?.temperature || 0.7,
    })

    return result
  } catch (error) {
    console.error('Error generating AI text:', error)
    throw error
  }
}

/**
 * Generate text without streaming (faster for short responses)
 */
export async function generateAITextSync(
  prompt: string,
  options?: {
    model?: string
    temperature?: number
  }
) {
  try {
    const { text } = await generateText({
      model: nvidia(options?.model || DEFAULT_MODEL),
      prompt,
      temperature: options?.temperature || 0.7,
    })

    return text
  } catch (error) {
    console.error('Error generating AI text:', error)
    throw error
  }
}

/**
 * Generate structured output with Zod schema
 */
export async function generateStructuredOutput<T extends z.ZodType>(
  prompt: string,
  schema: T,
  options?: {
    model?: string
    temperature?: number
  }
): Promise<z.infer<T>> {
  try {
    const { object } = await generateObject({
      model: nvidia(options?.model || DEFAULT_MODEL),
      schema,
      prompt,
      temperature: options?.temperature || 0.7,
    })

    return object as z.infer<T>
  } catch (error) {
    console.error('Error generating structured output:', error)
    throw error
  }
}

/**
 * Generate JLPT lesson content
 */
export async function generateJLPTLesson(level: string, topic: string) {
  const schema = z.object({
    title: z.string(),
    level: z.string(),
    topic: z.string(),
    vocabulary: z.array(
      z.object({
        word: z.string(),
        reading: z.string(),
        meaning: z.string(),
        exampleSentence: z.string(),
        exampleTranslation: z.string(),
      })
    ),
    grammar: z.array(
      z.object({
        pattern: z.string(),
        explanation: z.string(),
        examples: z.array(z.string()),
      })
    ),
    exercises: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        correctAnswer: z.number(),
        explanation: z.string(),
      })
    ),
  })

  const prompt = `Generate a comprehensive JLPT ${level} lesson about "${topic}".
Include:
- 10 relevant vocabulary words with readings, meanings, and example sentences
- 3-5 grammar patterns with explanations and examples
- 5 practice exercises with multiple choice questions

Make it educational and appropriate for ${level} level learners.`

  return generateStructuredOutput(prompt, schema)
}

/**
 * Generate SSW textbook content
 */
export async function generateSSWTextbook(sector: string, level: string) {
  const schema = z.object({
    title: z.string(),
    sector: z.string(),
    level: z.string(),
    chapters: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
        vocabulary: z.array(
          z.object({
            term: z.string(),
            reading: z.string(),
            meaning: z.string(),
            usage: z.string(),
          })
        ),
        scenarios: z.array(
          z.object({
            title: z.string(),
            dialogue: z.string(),
            translation: z.string(),
            culturalNote: z.string().optional(),
          })
        ),
      })
    ),
  })

  const prompt = `Generate an SSW (Specified Skilled Worker) textbook for the ${sector} sector at ${level} level.
Include:
- 3-5 chapters covering essential workplace situations
- Industry-specific vocabulary (50+ terms)
- Realistic workplace dialogues
- Safety-critical terms highlighted
- Cultural workplace etiquette notes

Make it practical and work-focused.`

  return generateStructuredOutput(prompt, schema)
}

/**
 * Generate chat response with context
 */
export async function generateChatResponse(
  message: string,
  conversationHistory: Array<{ role: string; content: string }>
) {
  const systemPrompt = `You are Sensei Tanaka (田中先生), an expert Japanese language teacher specializing in JLPT preparation and SSW workplace Japanese. 
You are patient, encouraging, and provide clear explanations in both Japanese and English when appropriate.
You help students with vocabulary, grammar, kanji, and cultural understanding.`

  const fullPrompt = `${systemPrompt}

Conversation history:
${conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join('\n')}

User: ${message}

Sensei Tanaka:`

  return generateAIText(fullPrompt, {
    temperature: 0.8,
  })
}

/**
 * Analyze kanji and provide detailed information
 */
export async function analyzeKanji(kanji: string) {
  const schema = z.object({
    kanji: z.string(),
    readings: z.object({
      onyomi: z.array(z.string()),
      kunyomi: z.array(z.string()),
    }),
    meanings: z.array(z.string()),
    strokeCount: z.number(),
    jlptLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']).optional(),
    radical: z.string(),
    examples: z.array(
      z.object({
        word: z.string(),
        reading: z.string(),
        meaning: z.string(),
      })
    ),
    mnemonicStory: z.string(),
  })

  const prompt = `Analyze the kanji "${kanji}" and provide:
- All readings (onyomi and kunyomi)
- Meanings
- Stroke count
- JLPT level if applicable
- Radical
- 5 common words using this kanji
- A memorable story or mnemonic to remember it

Be educational and helpful.`

  return generateStructuredOutput(prompt, schema)
}

export default {
  generateText: generateAIText,
  generateTextSync: generateAITextSync,
  generateStructured: generateStructuredOutput,
  generateJLPTLesson,
  generateSSWTextbook,
  generateChatResponse,
  analyzeKanji,
}
