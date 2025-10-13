/**
 * Optimized Textbook Generation API (v2)
 *
 * Improvements over v1:
 * - Background job processing (no timeouts)
 * - Input validation
 * - Rate limiting
 * - Error handling
 * - Progress tracking
 * - Caching
 */

import { type NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/cache/redis'
import {
  enqueueTextbookGeneration,
  getTextbookGenerationProgress,
  type TextbookGenerationJob,
} from '@/lib/jobs/textbook-generation'

// Input validation schema (in production, use Zod)
interface TextbookGenerationRequest {
  title: string
  jlptLevel: number
  contentType:
    | 'textbook_chapter'
    | 'grammar_lesson'
    | 'vocabulary_lesson'
    | 'kanji_lesson'
    | 'colloquial_lesson'
  topics: string[]
  numberOfChapters: number
  includeExercises?: boolean
  includeCulturalNotes?: boolean
  includeSlang?: boolean
  includeMnemonics?: boolean
  includeExamples?: boolean
  specificContent?: {
    grammarPatterns?: string[]
    vocabularyIds?: string[]
    kanjiIds?: string[]
    slangIds?: string[]
  }
  interests?: string[]
  userId?: string
}

/**
 * Validate request input
 */
const validateRequest = (body: unknown): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Invalid request body'] }
  }

  const req = body as Partial<TextbookGenerationRequest>

  // Required fields
  if (!req.title || typeof req.title !== 'string' || req.title.trim().length === 0) {
    errors.push('Title is required and must be a non-empty string')
  }

  if (
    !req.jlptLevel ||
    typeof req.jlptLevel !== 'number' ||
    req.jlptLevel < 1 ||
    req.jlptLevel > 5
  ) {
    errors.push('JLPT level must be between 1 and 5')
  }

  if (!req.topics || !Array.isArray(req.topics) || req.topics.length === 0) {
    errors.push('Topics must be a non-empty array')
  } else if (req.topics.some((t) => !t || typeof t !== 'string' || t.trim() === '')) {
    errors.push('All topics must be non-empty strings')
  }

  if (
    !req.numberOfChapters ||
    typeof req.numberOfChapters !== 'number' ||
    req.numberOfChapters < 1 ||
    req.numberOfChapters > 50
  ) {
    errors.push('Number of chapters must be between 1 and 50')
  }

  // Validate content type
  const validContentTypes = [
    'textbook_chapter',
    'grammar_lesson',
    'vocabulary_lesson',
    'kanji_lesson',
    'colloquial_lesson',
  ]
  if (req.contentType && !validContentTypes.includes(req.contentType)) {
    errors.push(`Content type must be one of: ${validContentTypes.join(', ')}`)
  }

  return { valid: errors.length === 0, errors }
}

/**
 * POST: Enqueue textbook generation
 */
export async function POST(req: NextRequest) {
  try {
    // Get user identifier for rate limiting (could be user ID or IP)
    const userId =
      req.headers.get('x-user-id') ||
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'anonymous'

    // Rate limiting: 5 textbook generations per hour per user
    const rateLimit = await checkRateLimit(`textbook-gen:${userId}`, 5, 3600)

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: `You can only generate 5 textbooks per hour. Try again later.`,
          retryAfter: 3600,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'Retry-After': '3600',
          },
        }
      )
    }

    // Parse and validate request body
    const body = await req.json()
    const { valid, errors } = validateRequest(body)

    if (!valid) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: errors,
        },
        { status: 400 }
      )
    }

    const request = body as TextbookGenerationRequest

    // Set defaults for optional fields
    const jobData: Omit<TextbookGenerationJob, 'textbookId'> = {
      userId: request.userId || null,
      title: request.title.trim(),
      jlptLevel: request.jlptLevel,
      contentType: request.contentType || 'textbook_chapter',
      topics: request.topics.map((t) => t.trim()),
      numberOfChapters: request.numberOfChapters,
      options: {
        includeExercises: request.includeExercises !== false,
        includeCulturalNotes: request.includeCulturalNotes !== false,
        includeSlang: request.includeSlang || false,
        includeMnemonics: request.includeMnemonics !== false,
        includeExamples: request.includeExamples !== false,
      },
      specificContent: request.specificContent,
      interests: request.interests || [],
    }

    console.log(`📚 Enqueuing textbook generation: "${request.title}"`)
    console.log(`   Level: N${request.jlptLevel}, Chapters: ${request.numberOfChapters}`)

    // Enqueue the generation job
    const result = await enqueueTextbookGeneration(jobData)

    if (!result) {
      return NextResponse.json(
        {
          error: 'Failed to enqueue textbook generation',
          details: 'Could not create textbook record',
        },
        { status: 500 }
      )
    }

    console.log(`✅ Textbook generation enqueued: ${result.textbookId}`)

    return NextResponse.json(
      {
        success: true,
        textbookId: result.textbookId,
        status: result.status,
        message: 'Textbook generation has been started. Check the status endpoint for progress.',
        statusUrl: `/api/textbooks/generate-v2/status?id=${result.textbookId}`,
      },
      {
        status: 202, // Accepted (processing asynchronously)
        headers: {
          'X-RateLimit-Limit': '5',
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        },
      }
    )
  } catch (error: unknown) {
    console.error('❌ Textbook generation API error:', error)

    let errorMessage = 'Internal server error'
    let statusCode = 500

    if (error instanceof SyntaxError) {
      errorMessage = 'Invalid JSON in request body'
      statusCode = 400
    } else if (error instanceof Error) {
      errorMessage = error.message
    }

    return NextResponse.json(
      {
        error: 'Textbook generation failed',
        details: errorMessage,
      },
      { status: statusCode }
    )
  }
}

/**
 * GET: Check textbook generation status
 */
export async function GET(req: NextRequest) {
  try {
    const textbookId = req.nextUrl.searchParams.get('id')

    if (!textbookId) {
      return NextResponse.json(
        {
          error: 'Missing textbook ID',
          details: 'Please provide a textbook ID as query parameter: ?id=xxx',
        },
        { status: 400 }
      )
    }

    const progress = await getTextbookGenerationProgress(textbookId)

    if (!progress) {
      return NextResponse.json(
        {
          error: 'Textbook not found',
          details: `No textbook found with ID: ${textbookId}`,
        },
        { status: 404 }
      )
    }

    const response = {
      textbookId: progress.textbookId,
      status: progress.status,
      progress: {
        current: progress.currentChapter,
        total: progress.totalChapters,
        percentage: Math.round((progress.completedChapters / progress.totalChapters) * 100),
      },
      startedAt: progress.startedAt,
      completedAt: progress.completedAt,
      error: progress.error,
    }

    // Add appropriate cache headers based on status
    const headers: Record<string, string> = {}
    if (progress.status === 'completed' || progress.status === 'failed') {
      headers['Cache-Control'] = 'public, max-age=3600' // Cache for 1 hour
    } else {
      headers['Cache-Control'] = 'no-cache' // Don't cache ongoing generations
    }

    return NextResponse.json(response, { headers })
  } catch (error) {
    console.error('❌ Status check error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * Health check
 */
export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'X-Service': 'textbook-generation-v2',
      'X-Version': '2.0.0',
    },
  })
}
