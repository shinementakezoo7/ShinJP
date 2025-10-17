import { type NextRequest, NextResponse } from 'next/server'
import { ModelTask, modelRouter } from '@/lib/ai/model-router'

// Use Node.js runtime instead of edge for better compatibility
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check if NVIDIA API is configured
    if (
      !process.env.NVIDIA_API_KEY &&
      !process.env.NVIDIA_API_KEY_1 &&
      !process.env.NVIDIA_API_KEY_2
    ) {
      console.error('❌ NVIDIA API keys not configured')
      return NextResponse.json(
        {
          error: 'NVIDIA API is not configured',
          details:
            'Please set NVIDIA_API_KEY, NVIDIA_API_KEY_1, or NVIDIA_API_KEY_2 in your environment variables.',
        },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { task, messages, temperature, maxTokens } = body

    if (!task || !messages) {
      return NextResponse.json(
        { error: 'Missing required fields: task and messages' },
        { status: 400 }
      )
    }

    // Validate task
    if (!Object.values(ModelTask).includes(task)) {
      return NextResponse.json(
        { error: `Invalid task. Must be one of: ${Object.values(ModelTask).join(', ')}` },
        { status: 400 }
      )
    }

    const response = await modelRouter.route({
      task,
      messages,
      temperature,
      maxTokens,
    })

    return NextResponse.json({
      success: true,
      data: response,
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  const status = modelRouter.getStatus()
  return NextResponse.json({
    success: true,
    status,
    supportedTasks: Object.values(ModelTask),
  })
}
