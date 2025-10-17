import { type NextRequest, NextResponse } from 'next/server'
import { ModelTask, modelRouter } from '@/lib/ai/model-router'
import { checkRateLimit, aiRatelimit } from '@/lib/rate-limit'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  temperature?: number
  stream?: boolean
  model?: string // Allow specifying model
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, temperature = 0.7, stream = true, model } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous'
    const rateLimitResult = await checkRateLimit(identifier, aiRatelimit)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again later.',
          reset: rateLimitResult.reset,
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      )
    }

    // Check if any AI provider is configured
    const hasNvidia = Boolean(
      process.env.NVIDIA_API_KEY || process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY_2
    )
    const hasOpenAI = Boolean(process.env.OPENAI_API_KEY)

    if (!hasNvidia && !hasOpenAI) {
      console.error('❌ No AI providers configured')
      return NextResponse.json(
        {
          error: 'AI providers not configured',
          details: 'Please configure the required AI service environment variables.',
        },
        { status: 503 }
      )
    }

    // Log which provider is being used
    console.log(`🤖 Using AI provider - NVIDIA: ${hasNvidia}, OpenAI: ${hasOpenAI}`)

    // System prompt for experienced Japanese teacher
    const systemPrompt = {
      role: 'system',
      content: `You are Sensei Tanaka, an experienced Japanese language teacher with 30 years of experience teaching international students. You teach exclusively in ENGLISH with Japanese examples.

🎓 YOUR TEACHING STYLE:
- Explain everything in CLEAR, SIMPLE ENGLISH (like teaching beginners)
- Use Japanese words/phrases only as examples with translations
- Break down complex concepts into easy-to-understand steps
- Use real-world examples and practical situations
- Be patient, encouraging, and supportive like a mentor

📚 YOUR EXPERTISE:
- 30 years teaching Japanese to English-speaking students
- Expert in JLPT N5 to N1 curriculum
- Specialist in grammar, vocabulary, kanji, and conversation
- Deep knowledge of Japanese culture and customs
- Experience with common mistakes international students make

✍️ HOW TO RESPOND:

1. **Start with encouragement** - Acknowledge their question positively
2. **Explain in English** - Use simple, clear English explanations
3. **Give Japanese examples** - Show Japanese with romaji and English translation:
   - Japanese: 私は学生です (Watashi wa gakusei desu)
   - English: "I am a student"
4. **Break it down** - Explain grammar structure, word meanings, usage
5. **Add context** - When to use it, cultural notes, politeness levels
6. **Provide more examples** - 2-3 different situations showing usage
7. **Common mistakes** - Warn about typical errors students make
8. **Practice tip** - Suggest how they can practice this concept

📋 FORMATTING:
- Use bullet points and numbered lists for clarity
- Bold important terms: **particle は (wa)**, **verb conjugation**
- Use emojis occasionally for friendliness: ✅ ❌ 💡 📝 🎯
- Separate sections with clear headings
- Keep paragraphs short (2-3 sentences max)

🎯 KEY PRINCIPLES:
1. ALWAYS explain primarily in English
2. Japanese text is only for examples (with translations)
3. Assume student is NOT fluent in Japanese yet
4. Be thorough but not overwhelming
5. Encourage practice and questions
6. Relate to English when possible (e.g., "Like 'the' in English...")

❌ NEVER:
- Write long paragraphs in Japanese without translation
- Assume student knows Japanese grammar terms
- Skip basic explanations
- Be overly academic or use jargon
- Forget to provide practical examples

Remember: You&apos;re teaching in ENGLISH to help students LEARN Japanese. Your goal is making Japanese accessible and understandable, just like you&apos;ve done for thousands of international students over 30 years.`,
    }

    // Prepare messages for the AI
    const aiMessages = [systemPrompt, ...messages]

    console.log('🤖 Processing chat request with NVIDIA AI...')
    console.log(`   Messages count: ${aiMessages.length}`)
    console.log(`   Temperature: ${temperature}`)
    console.log(`   Streaming: ${stream}`)
    console.log(`   Model: ${model || 'default'}`)

    // Handle streaming vs non-streaming
    if (stream) {
      return handleStreamingResponse(aiMessages, temperature, model)
    }

    // Route to NVIDIA API using conversation practice task
    let response
    try {
      const routeOptions: any = {
        task: ModelTask.CONVERSATION_PRACTICE,
        messages: aiMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        maxTokens: 8000,
      }

      // Use specific model if provided
      if (model) {
        routeOptions.model = model
      }

      response = await modelRouter.route(routeOptions)
    } catch (routeError) {
      console.error('❌ Model routing error:', routeError)
      throw new Error(
        `AI model error: ${routeError instanceof Error ? routeError.message : 'Unknown error'}`
      )
    }

    // Validate response
    if (!response || !response.content) {
      console.error('❌ Invalid response from AI model')
      throw new Error('AI returned an empty or invalid response')
    }

    // Clean and validate the response content
    let cleanedContent = response.content.trim()

    // Remove any potential markdown formatting that might have slipped through
    cleanedContent = cleanedContent.replace(/```[\w]*\n?/g, '').trim()

    // Ensure content is not empty after cleaning
    if (!cleanedContent || cleanedContent.length < 10) {
      console.error('❌ AI response too short or empty after cleaning')
      throw new Error('AI response was too short or empty. Please try rephrasing your question.')
    }

    console.log('✅ Chat response generated successfully')
    console.log(`   Model used: ${response.model}`)
    console.log(`   Tokens: ${response.usage?.totalTokens || 'N/A'}`)
    console.log(`   Response length: ${cleanedContent.length} chars`)

    return NextResponse.json({
      message: cleanedContent,
      model: response.model,
      usage: response.usage,
      success: true,
    })
  } catch (error) {
    console.error('❌ Chat API Error:', error)

    // Detailed error response
    let errorMessage = 'Failed to process chat request'
    let errorDetails = 'An unexpected error occurred'
    let statusCode = 500

    if (error instanceof Error) {
      errorDetails = error.message

      // Check for specific error types
      if (error.message.includes('NVIDIA API is not configured')) {
        errorMessage = 'NVIDIA API configuration error'
        errorDetails = 'Please ensure NVIDIA_API_KEY_1 is set in your environment variables'
        statusCode = 503
      } else if (error.message.includes('429') || error.message.includes('rate limit')) {
        errorMessage = 'Rate limit exceeded'
        errorDetails = 'Too many requests. Please wait a moment and try again.'
        statusCode = 429
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout'
        errorDetails = 'The AI took too long to respond. Please try again.'
        statusCode = 504
      } else if (error.message.includes('API key')) {
        errorMessage = 'API authentication error'
        errorDetails = 'Invalid or missing API key. Please check your configuration.'
        statusCode = 401
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: statusCode }
    )
  }
}

// Streaming response handler
async function handleStreamingResponse(
  messages: ChatMessage[],
  temperature: number,
  model?: string
) {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Route to NVIDIA API
        const routeOptions: any = {
          task: ModelTask.CONVERSATION_PRACTICE,
          messages: messages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          temperature,
          maxTokens: 8000,
        }

        // Use specific model if provided
        if (model) {
          routeOptions.model = model
        }

        const response = await modelRouter.route(routeOptions)

        if (!response || !response.content) {
          throw new Error('AI returned an empty response')
        }

        const content = response.content.trim()

        // Simulate streaming by chunking the response
        // This provides a smooth typing effect
        const words = content.split(' ')
        let buffer = ''

        for (let i = 0; i < words.length; i++) {
          buffer += (i > 0 ? ' ' : '') + words[i]

          // Send chunks of 3-5 words for natural flow
          if (i % 4 === 3 || i === words.length - 1) {
            const chunk = JSON.stringify({
              type: 'content',
              content: buffer,
            })
            controller.enqueue(encoder.encode(`data: ${chunk}\n\n`))
            buffer = ''

            // Small delay between chunks for typing effect
            await new Promise((resolve) => setTimeout(resolve, 50))
          }
        }

        // Send completion event with metadata
        const doneChunk = JSON.stringify({
          type: 'done',
          model: response.model,
          usage: response.usage,
          success: true,
        })
        controller.enqueue(encoder.encode(`data: ${doneChunk}\n\n`))

        console.log('✅ Streaming response completed')
        controller.close()
      } catch (error) {
        console.error('❌ Streaming error:', error)

        // Send error event
        const errorChunk = JSON.stringify({
          type: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false,
        })
        controller.enqueue(encoder.encode(`data: ${errorChunk}\n\n`))
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  })
}

// Health check endpoint
export async function GET() {
  const status = modelRouter.getStatus()

  return NextResponse.json({
    status: 'ok',
    nvidia: status.nvidiaStatus,
    message: 'Chat API is ready',
  })
}
