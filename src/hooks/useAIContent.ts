import { useState } from 'react'
import { type AIContentRequest, generateAIContent } from '@/lib/ai/content-generator'
import type { AIGeneratedContent } from '@/lib/database/types'

/**
 * Hook for generating AI content using NVIDIA's stockmark-2-100b-instruct
 * Provides state management for content generation
 */
export const useAIContent = () => {
  const [content, setContent] = useState<AIGeneratedContent | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateContent = async (request: AIContentRequest) => {
    setLoading(true)
    setError(null)

    try {
      const generatedContent = await generateAIContent(request)
      if (generatedContent) {
        setContent(generatedContent)
        return generatedContent
      } else {
        setError('Failed to generate content. Please check NVIDIA API configuration.')
        return null
      }
    } catch (err) {
      setError('Error generating content. Please try again.')
      console.error('Content generation error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const clearContent = () => {
    setContent(null)
    setError(null)
  }

  return {
    content,
    loading,
    error,
    generateContent,
    clearContent,
  }
}
