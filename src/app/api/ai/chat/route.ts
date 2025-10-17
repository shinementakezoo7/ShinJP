import { createOpenAI } from '@ai-sdk/openai'
import { streamText } from 'ai'
import type { NextRequest, NextResponse } from 'next/server'
import { analytics } from '@/lib/analytics/posthog'
import { checkRateLimit, aiRatelimit } from '@/lib/rate-limit'

// Configure NVIDIA provider
const nvidia = createOpenAI({
  apiKey: process.env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY_1 || '',
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
})

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    // Rate limiting check
    const identifier = req.headers.get('x-forwarded-for') || 'anonymous'
    const rateLimitResult = await checkRateLimit(identifier, aiRatelimit)

    if (!rateLimitResult.success) {
      return new NextResponse(
        JSON.stringify({
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again later.',
          reset: rateLimitResult.reset,
        }),
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      )
    }

    // Check if NVIDIA API is configured
    if (
      !process.env.NVIDIA_API_KEY &&
      !process.env.NVIDIA_API_KEY_1 &&
      !process.env.NVIDIA_API_KEY_2
    ) {
      console.error('❌ NVIDIA API keys not configured')
      return new NextResponse(
        JSON.stringify({
          error: 'NVIDIA API is not configured',
          details:
            'Please set NVIDIA_API_KEY, NVIDIA_API_KEY_1, or NVIDIA_API_KEY_2 in your environment variables.',
        }),
        { status: 503 }
      )
    }

    const { messages, conversationId, model = 'meta/llama-3.1-8b-instruct' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new NextResponse('Messages array is required', { status: 400 })
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

    return new NextResponse(
      JSON.stringify({
        error: 'Failed to generate response',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  const hasApiKey = !!(
    process.env.NVIDIA_API_KEY ||
    process.env.NVIDIA_API_KEY_1 ||
    process.env.NVIDIA_API_KEY_2
  )

  return NextResponse.json({
    status: 'ok',
    nvidia: hasApiKey ? 'configured' : 'not configured',
    message: 'AI Chat API is ready',
    endpoints: {
      POST: '/api/ai/chat - Generate AI responses',
      GET: '/api/ai/chat - Health check',
    },
  })
}
