import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { NextRequest } from 'next/server'
import { analytics } from '@/lib/analytics/posthog'

// Configure NVIDIA provider
const nvidia = createOpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '',
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const { messages, conversationId, model = 'meta/llama-3.1-8b-instruct' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 })
    }

    // Track chat message sent
    const lastMessage = messages[messages.length - 1]
    if (lastMessage?.role === 'user') {
      analytics.chatMessageSent(lastMessage.content?.length || 0, conversationId || 'unknown')
    }

    // Generate streaming response
    const result = await streamText({
      model: nvidia(model),
      messages,
      temperature: 0.7,
      maxOutputTokens: 2000,
      onFinish: ({ text }) => {
        // Track response received
        const duration = Date.now() - startTime
        analytics.chatResponseReceived(text.length, duration)
      },
    })

    // Return streaming response
    return result.toTextStreamResponse()
  } catch (error) {
    console.error('AI Chat error:', error)

    // Track error
    analytics.error(error as Error, {
      route: 'ai-chat',
      duration: Date.now() - startTime,
    })

    return new Response('Failed to generate response', { status: 500 })
  }
}
