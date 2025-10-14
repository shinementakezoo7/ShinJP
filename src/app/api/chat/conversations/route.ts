import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/database/client'
import { checkRateLimit, ratelimit } from '@/lib/rate-limit'

// GET all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id') || null
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const supabase = getSupabaseServiceClient()

    // Build query
    let query = supabase
      .from('conversations')
      .select('*')
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter by user if provided
    if (userId) {
      query = query.eq('user_id', userId)
    } else {
      // For anonymous users, get conversations without user_id
      query = query.is('user_id', null)
    }

    const { data: conversations, error } = await query

    if (error) {
      console.error('Error fetching conversations:', error)
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
    }

    // Get total count
    let totalQuery = supabase.from('conversations').select('id', { count: 'exact', head: true })

    if (userId) {
      totalQuery = totalQuery.eq('user_id', userId)
    } else {
      totalQuery = totalQuery.is('user_id', null)
    }

    const { count: totalCount } = await totalQuery

    return NextResponse.json({
      conversations: conversations || [],
      total: totalCount || 0,
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

// POST create new conversation
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = request.headers.get('x-forwarded-for') || 'anonymous'
    const rateLimitResult = await checkRateLimit(identifier, ratelimit)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          details: 'Too many requests. Please try again later.',
        },
        {
          status: 429,
          headers: rateLimitResult.headers,
        }
      )
    }

    const body = await request.json()
    const {
      user_id = null,
      title = 'New Chat',
      model = 'stockmark/stockmark-2-100b-instruct',
    } = body

    const supabase = getSupabaseServiceClient()

    const { data: newConversation, error } = await supabase
      .from('conversations')
      .insert({
        user_id,
        title,
        model,
        context_window: 122000, // 122K context window for stockmark
        total_tokens: 0,
        message_count: 0,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating conversation:', error)
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
    }

    console.log('✅ Created new conversation:', newConversation.id)

    return NextResponse.json(newConversation, { status: 201 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 })
  }
}

// DELETE conversation
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const conversationId = searchParams.get('id')

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 })
    }

    const supabase = getSupabaseServiceClient()

    // Delete conversation (messages will be deleted automatically via CASCADE)
    const { error } = await supabase.from('conversations').delete().eq('id', conversationId)

    if (error) {
      console.error('Error deleting conversation:', error)
      return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
    }

    console.log('✅ Deleted conversation:', conversationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
  }
}
