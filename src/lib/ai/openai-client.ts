import { createOpenAI } from '@ai-sdk/openai'

// Initialize OpenAI client if API key is available
export const openai = process.env.OPENAI_API_KEY
  ? createOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  : undefined

export type { OpenAIProvider } from '@ai-sdk/openai'
