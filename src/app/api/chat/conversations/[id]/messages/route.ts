import { type NextRequest, NextResponse } from 'next/server'

// Mock database for conversations and messages
// In production, this would use actual database (Supabase)
interface Conversation {
  id: string
  title: string
  model: string
  context_window: number
  total_tokens: number
  message_count: number
  created_at: string
  last_message_at?: string
  updated_at?: string
}

interface Message {
  id: string
  conversation_id: string
  role: string
  content: string
  tokens: number
  created_at: string
  metadata: Record<string, unknown>
}

const conversationsDB: Conversation[] = []
const messagesDB: Message[] = []

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

    // Get messages for this conversation
    const conversationMessages = messagesDB
      .filter((msg) => msg.conversation_id === conversationId)
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .slice(offset, offset + limit)

    return NextResponse.json({
      messages: conversationMessages,
      total: messagesDB.filter((msg) => msg.conversation_id === conversationId).length,
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST add message to conversation
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const params = await context.params
    const conversationId = params.id
    const body = await request.json()
    const { role, content, tokens = 0, metadata = {} } = body

    if (!role || !content) {
      return NextResponse.json({ error: 'Role and content are required' }, { status: 400 })
    }

    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      conversation_id: conversationId,
      role,
      content,
      tokens,
      metadata,
      created_at: new Date().toISOString(),
    }

    messagesDB.push(newMessage)

    // Update conversation stats
    const conversation = conversationsDB.find((conv) => conv.id === conversationId)
    if (conversation) {
      conversation.message_count++
      conversation.total_tokens += tokens
      conversation.last_message_at = new Date().toISOString()
      conversation.updated_at = new Date().toISOString()

      // Auto-generate title from first user message
      if (conversation.message_count === 1 && role === 'user') {
        conversation.title = content.length > 50 ? `${content.substring(0, 50)}...` : content
      }
    }

    console.log('✅ Added message to conversation:', conversationId)

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error('Error adding message:', error)
    return NextResponse.json({ error: 'Failed to add message' }, { status: 500 })
  }
}

export { conversationsDB, messagesDB }
