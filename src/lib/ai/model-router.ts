import { type NVIDIARequest, nvidiaClient } from './nvidia-client'

// Model types for different tasks
export enum ModelTask {
  MULTIMODAL_VISION = 'multimodal_vision',
  MULTIMODAL_OCR = 'multimodal_ocr',
  TEXTBOOK_GENERATION = 'textbook_generation',
  SSW_GENERATION = 'ssw_generation',
  GRAMMAR_EXPLANATION = 'grammar_explanation',
  VOCABULARY_EXPLANATION = 'vocabulary_explanation',
  KANJI_EXPLANATION = 'kanji_explanation',
  CONVERSATION_PRACTICE = 'conversation_practice',
  QUIZ_GENERATION = 'quiz_generation',
  ROLEPLAY = 'roleplay',
  STORY_GENERATION = 'story_generation',
  DIALOGUE_GENERATION = 'dialogue_generation',
  EXERCISE_GENERATION = 'exercise_generation',
  GENERAL = 'general',
}

// Model routing configuration - stockmark-2-100b-instruct as primary Japanese model
const MODEL_ROUTES: Record<ModelTask, string[]> = {
  [ModelTask.MULTIMODAL_VISION]: [
    'meta/llama-3.2-11b-vision-instruct',
    'microsoft/phi-4-multimodal-instruct',
  ],
  [ModelTask.MULTIMODAL_OCR]: [
    'meta/llama-3.2-11b-vision-instruct',
    'microsoft/phi-4-multimodal-instruct',
  ],
  [ModelTask.TEXTBOOK_GENERATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.SSW_GENERATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.GRAMMAR_EXPLANATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.VOCABULARY_EXPLANATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.KANJI_EXPLANATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.CONVERSATION_PRACTICE]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.STORY_GENERATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.DIALOGUE_GENERATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.EXERCISE_GENERATION]: ['stockmark/stockmark-2-100b-instruct'],
  [ModelTask.QUIZ_GENERATION]: [
    'stockmark/stockmark-2-100b-instruct',
    'mistralai/mistral-medium-3-instruct',
  ],
  [ModelTask.ROLEPLAY]: [
    'stockmark/stockmark-2-100b-instruct',
    'mistralai/mistral-medium-3-instruct',
  ],
  [ModelTask.GENERAL]: [
    'stockmark/stockmark-2-100b-instruct',
    'mistralai/mistral-medium-3-instruct',
  ],
}

interface ModelRouterRequest {
  task: ModelTask
  messages: Array<{ role: string; content: string }>
  temperature?: number
  maxTokens?: number
  imageUrl?: string // For multimodal tasks
}

interface ModelRouterResponse {
  content: string
  model: string
  provider: 'nvidia' | 'openai'
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

class ModelRouter {
  private modelIndices: Map<ModelTask, number> = new Map()

  /**
   * Get next model for a given task (round-robin)
   */
  private getModelForTask(task: ModelTask): string {
    const models = MODEL_ROUTES[task]
    if (!models || models.length === 0) {
      throw new Error(`No models configured for task: ${task}`)
    }

    const currentIndex = this.modelIndices.get(task) || 0
    const model = models[currentIndex]

    // Update index for next call
    this.modelIndices.set(task, (currentIndex + 1) % models.length)

    return model
  }

  /**
   * Route request to appropriate NVIDIA model
   */
  async route(request: ModelRouterRequest): Promise<ModelRouterResponse> {
    const model = this.getModelForTask(request.task)

    console.log(`🎯 Routing task "${request.task}" to NVIDIA model: ${model}`)

    if (!nvidiaClient.isAvailable()) {
      throw new Error(
        'NVIDIA API is not configured. Please set NVIDIA_API_KEY_1 environment variable.'
      )
    }

    try {
      // Use 122K context window for stockmark-2-100b-instruct
      const maxTokens =
        model === 'stockmark/stockmark-2-100b-instruct'
          ? request.maxTokens || 8000 // Increased default for stockmark
          : request.maxTokens || 4000

      const nvidiaRequest: NVIDIARequest = {
        model,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: maxTokens,
      }

      const response = await nvidiaClient.chatCompletion(nvidiaRequest)

      return {
        content: response.choices[0]?.message?.content || '',
        model,
        provider: 'nvidia',
        usage: {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        },
      }
    } catch (error) {
      console.error('❌ NVIDIA API request failed:', error)

      // If one model fails, try fallback model for the task
      const models = MODEL_ROUTES[request.task]
      if (models.length > 1) {
        console.log('🔄 Trying fallback model...')
        const fallbackModel = models[1]

        const fallbackMaxTokens =
          fallbackModel === 'stockmark/stockmark-2-100b-instruct'
            ? request.maxTokens || 8000
            : request.maxTokens || 4000

        const nvidiaRequest: NVIDIARequest = {
          model: fallbackModel,
          messages: request.messages,
          temperature: request.temperature || 0.7,
          max_tokens: fallbackMaxTokens,
        }

        const response = await nvidiaClient.chatCompletion(nvidiaRequest)

        return {
          content: response.choices[0]?.message?.content || '',
          model: fallbackModel,
          provider: 'nvidia',
          usage: {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          },
        }
      }

      throw new Error(`NVIDIA API failed for task ${request.task}: ${error}`)
    }
  }

  /**
   * Generate Japanese learning content using stockmark-2-100b-instruct
   */
  async generateContent(
    type: 'story' | 'dialogue' | 'exercise' | 'explanation',
    jlptLevel: number,
    topic?: string,
    keywords?: string[]
  ): Promise<ModelRouterResponse> {
    // Determine task based on content type
    let task: ModelTask
    switch (type) {
      case 'story':
        task = ModelTask.STORY_GENERATION
        break
      case 'dialogue':
        task = ModelTask.DIALOGUE_GENERATION
        break
      case 'exercise':
        task = ModelTask.EXERCISE_GENERATION
        break
      case 'explanation':
        task = ModelTask.GRAMMAR_EXPLANATION
        break
      default:
        task = ModelTask.GENERAL
    }

    const prompt = this.buildContentPrompt(type, jlptLevel, topic, keywords)

    return this.route({
      task,
      messages: [
        {
          role: 'system',
          content:
            "You are an expert Japanese language instructor specializing in JLPT preparation. You have deep knowledge of Japanese grammar, vocabulary, and cultural context. Create educational content that is accurate, engaging, and appropriate for the learner's level. Always respond with valid, well-formatted JSON.",
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 4000,
    })
  }

  /**
   * Build content generation prompt
   */
  private buildContentPrompt(
    type: string,
    jlptLevel: number,
    topic?: string,
    keywords?: string[]
  ): string {
    const topicText = topic || 'general Japanese language learning'
    const keywordsText = keywords?.length ? keywords.join(', ') : 'none'

    switch (type) {
      case 'story':
        return `Create a short Japanese story at JLPT N${jlptLevel} level.
Topic: ${topicText}
Keywords: ${keywordsText}

Include:
1. A title
2. The story content in Japanese
3. Key vocabulary with readings and meanings
4. Important grammar points with examples

Format as JSON: {"title": "...", "content": "...", "vocabulary": [...], "grammarPoints": [...]}`

      case 'dialogue':
        return `Create a Japanese dialogue at JLPT N${jlptLevel} level.
Topic: ${topicText}
Keywords: ${keywordsText}

Include:
1. A title
2. Participant names
3. Dialogue with translations
4. Key vocabulary

Format as JSON: {"title": "...", "participants": [...], "dialogue": [...], "vocabulary": [...]}`

      case 'exercise':
        return `Create a Japanese exercise at JLPT N${jlptLevel} level.
Topic: ${topicText}
Keywords: ${keywordsText}

Include multiple-choice questions with explanations.
Format as JSON: {"title": "...", "instructions": "...", "questions": [...], "difficulty": 3}`

      case 'explanation':
        return `Explain a Japanese language concept at JLPT N${jlptLevel} level.
Topic: ${topicText}
Keywords: ${keywordsText}

Include detailed explanation, examples, and related topics.
Format as JSON: {"title": "...", "explanation": "...", "examples": [...], "relatedTopics": [...]}`

      default:
        return `Provide Japanese language learning content for JLPT N${jlptLevel} level about: ${topicText}`
    }
  }

  /**
   * Get router status
   */
  getStatus() {
    return {
      nvidiaStatus: nvidiaClient.getStatus(),
      supportedTasks: Object.keys(MODEL_ROUTES),
      currentModelIndices: Object.fromEntries(this.modelIndices),
    }
  }
}

// Export singleton instance
export const modelRouter = new ModelRouter()

// Export types
export type { ModelRouterRequest, ModelRouterResponse }
