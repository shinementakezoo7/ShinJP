import { type NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/database/client'
import { checkRateLimit, ratelimit } from '@/lib/rate-limit'

interface RouteContext {
  params: Promise<{
    id: string
  }>
}

// GET messages for a conversation
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params
    const conversationId = params.id
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '100', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    const supabase = getSupabaseServiceClient()

    // Get messages for this conversation
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching messages:', error)
      return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
    }

    // Get total count
    const { count } = await supabase
      .from('messages')
      .select('id', { count: 'exact', head: true })
      .eq('conversation_id', conversationId)

    return NextResponse.json({
      messages: messages || [],
      total: count || 0,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST add message to conversation
export async function POST(request: NextRequest, context: RouteContext) {
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

    const params = await context.params
    const conversationId = params.id
    const body = await request.json()
    const { role, content, tokens = 0, metadata = {} } = body

    if (!role || !content) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 })
    }

    const supabase = getSupabaseServiceClient()

    // Insert message (conversation stats will be updated automatically via trigger)
    const { data: newMessage, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        tokens,
        metadata,
      })
      .select()
      .single()

    if (error) {
      console.error('Error adding message:', error)
      return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
    }

    console.log('✅ Added message to conversation:', conversationId)

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error adding message:', error)
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
  }
}
