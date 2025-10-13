import { type NextRequest, NextResponse } from 'next/server'

// Mock database - replace with actual database calls
// This structure supports the chat history feature
let conversationsDB: Array<{
  id: string
  user_id: string
  title: string
  model: string
  context_window: number
  total_tokens: number
  message_count: number
  last_message_at: string
  created_at: string
  updated_at: string
}> = []

let messagesDB: Array<{
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  tokens: number
  metadata: Record<string, unknown>
  created_at: string
}> = []

// GET all conversations for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id') || 'anonymous'
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)

    // Filter conversations by user
    const userConversations = conversationsDB
      .filter((conv) => conv.user_id === userId)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(offset, offset + limit)

    return NextResponse.json({
      conversations: userConversations,
      total: conversationsDB.filter((conv) => conv.user_id === userId).length,
    })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
  }
}

// POST create new conversation
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      user_id = 'anonymous',
      title = 'New Chat',
      model = 'stockmark/stockmark-2-100b-instruct',
    } = body

    const newConversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id,
      title,
      model,
      context_window: 122000, // 122K context window for stockmark
      total_tokens: 0,
      message_count: 0,
      last_message_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    conversationsDB.push(newConversation)

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

    // Remove conversation and associated messages
    conversationsDB = conversationsDB.filter((conv) => conv.id !== conversationId)
    messagesDB = messagesDB.filter((msg) => msg.conversation_id !== conversationId)

    console.log('✅ Deleted conversation:', conversationId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting conversation:', error)
    return NextResponse.json({ error: 'Failed to delete conversation' }, { status: 500 })
  }
}

// Export for use by other API routes
export { conversationsDB, messagesDB }
