import { type NextRequest, NextResponse } from 'next/server'
import { ModelTask, modelRouter } from '@/lib/ai/model-router'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

interface ChatRequest {
  messages: ChatMessage[]
  temperature?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json()
    const { messages, temperature = 0.7 } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 })
    }

    // Check if NVIDIA API is configured
    if (!process.env.NVIDIA_API_KEY_1 && !process.env.NVIDIA_API_KEY_2) {
      console.error('❌ NVIDIA API keys not configured')
      return NextResponse.json(
        {
          error: 'NVIDIA API is not configured',
          details:
            'Please set NVIDIA_API_KEY_1 in your environment variables. Visit https://build.nvidia.com/ to get your API key.',
        },
        { status: 503 }
      )
    }

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

Remember: You're teaching in ENGLISH to help students LEARN Japanese. Your goal is making Japanese accessible and understandable, just like you've done for thousands of international students over 30 years.`,
    }

    // Prepare messages for the AI
    const aiMessages = [systemPrompt, ...messages]

    console.log('🤖 Processing chat request with NVIDIA stockmark-2-100b-instruct...')
    console.log(`   Messages count: ${aiMessages.length}`)
    console.log(`   Temperature: ${temperature}`)

    // Route to NVIDIA API using stockmark-2-100b-instruct with 122K context window support
    let response
    try {
      response = await modelRouter.route({
        task: ModelTask.CONVERSATION_PRACTICE,
        messages: aiMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature,
        maxTokens: 8000, // Increased for longer, more detailed responses with 122K context
      })
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

// Health check endpoint
export async function GET() {
  const status = modelRouter.getStatus()

  return NextResponse.json({
    status: 'ok',
    nvidia: status.nvidiaStatus,
    message: 'Chat API is ready',
  })
}
