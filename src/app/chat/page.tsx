'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface Conversation {
  id: string
  title: string
  message_count: number
  last_message_at: string
}

export default function ChatPageRedesigned() {
  const router = useRouter()
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/chat/conversations?user_id=anonymous')
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
    }
  }

  const handleNewConversation = async () => {
    try {
      const response = await fetch('/api/chat/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'anonymous',
          title: 'New Conversation',
          model: 'stockmark/stockmark-2-100b-instruct',
        }),
      })

      const newConv = await response.json()
      setCurrentConversationId(newConv.id)
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Hello! I'm Sensei Sakura, your Japanese language teacher. I teach in English with Japanese examples. How can I help you today?`,
          timestamp: new Date(),
        },
      ])
      await loadConversations()
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true)
    }
    handleNewConversation()
    loadConversations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectConversation = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/chat/conversations/${conversationId}/messages`)
      const data = await response.json()

      const loadedMessages: Message[] = data.messages.map(
        (msg: {
          id: string
          role: 'user' | 'assistant' | 'system'
          content: string
          created_at: string
        }) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
        })
      )

      setCurrentConversationId(conversationId)
      setMessages(loadedMessages)

      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const handleDeleteConversation = async (id: string) => {
    if (confirm('Delete this conversation?')) {
      try {
        await fetch(`/api/chat/conversations?id=${id}`, { method: 'DELETE' })
        setConversations((prev) => prev.filter((conv) => conv.id !== id))
        if (currentConversationId === id) {
          handleNewConversation()
        }
      } catch (error) {
        console.error('Error deleting conversation:', error)
      }
    }
  }

  const saveMessage = async (message: Message) => {
    if (!currentConversationId) return

    try {
      await fetch(`/api/chat/conversations/${currentConversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: message.role,
          content: message.content,
          tokens: 0,
          metadata: {},
        }),
      })
    } catch (error) {
      console.error('Error saving message:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    await saveMessage(userMessage)

    // Create streaming message placeholder
    const streamingMessageId = 'streaming-' + Date.now()
    const streamingMessage: Message = {
      id: streamingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: false,
    }
    setMessages((prev) => [...prev, streamingMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: 0.7,
          stream: true,
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`)
      }

      // Handle streaming response
      if (response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''
        let done = false

        while (!done) {
          const { value, done: readerDone } = await reader.read()
          done = readerDone

          if (value) {
            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                try {
                  const data = JSON.parse(line.slice(6))

                  if (data.type === 'content') {
                    fullContent = data.content
                    // Update streaming message
                    setMessages((prev) =>
                      prev.map((m) =>
                        m.id === streamingMessageId ? { ...m, content: fullContent } : m
                      )
                    )
                  } else if (data.type === 'done') {
                    // Save final message
                    const finalMessage: Message = {
                      id: Date.now().toString(),
                      role: 'assistant',
                      content: fullContent,
                      timestamp: new Date(),
                    }
                    await saveMessage(finalMessage)
                    setIsLoading(false)
                  } else if (data.type === 'error') {
                    throw new Error(data.error)
                  }
                } catch (e) {
                  // Ignore JSON parse errors for incomplete chunks
                  console.debug('Chunk parse error:', e)
                }
              }
            }
          }
        }
      } else {
        throw new Error('No response body')
      }
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry! I encountered an error. Please try again.',
        timestamp: new Date(),
      }

      setMessages((prev) => prev.filter((m) => m.id !== streamingMessageId).concat(errorMessage))
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickPrompts = [
    { icon: '🌸', text: 'Daily greetings', short: 'Greetings' },
    { icon: '📝', text: 'Explain particles', short: 'Particles' },
    { icon: '✍️', text: 'Teach Hiragana', short: 'Hiragana' },
    { icon: '🗾', text: 'Travel phrases', short: 'Travel' },
  ]

  return (
    <div className="h-screen flex bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20 relative overflow-hidden">
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Giant Kanji Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[500px] japanese-text text-red-500/[0.02] dark:text-red-400/[0.03] select-none font-black">
          話
        </div>

        {/* Floating Sakura Petals */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sakura-float"
            style={{
              left: `${(i * 7) % 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${15 + (i % 5) * 3}s`,
              top: '-50px',
            }}
          >
            <div className="text-2xl opacity-[0.15] dark:opacity-[0.1]">🌸</div>
          </div>
        ))}

        {/* Traditional Wave Pattern (Seigaiha) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="seigaiha"
              x="0"
              y="0"
              width="140"
              height="70"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-red-600 dark:text-red-400"
              >
                <path d="M0,35 Q17.5,15 35,35 T70,35" />
                <path d="M35,35 Q52.5,15 70,35 T105,35" />
                <path d="M70,35 Q87.5,15 105,35 T140,35" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#seigaiha)" />
        </svg>

        {/* Subtle Sparkles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${(i * 13 + 10) % 90}%`,
              top: `${(i * 17 + 5) % 90}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${2 + (i % 3)}s`,
              opacity: 0.2 + (i % 3) * 0.1,
            }}
          />
        ))}
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Compact Sidebar */}
      {sidebarOpen && (
        <div className="fixed md:relative inset-y-0 left-0 z-40 w-72 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl">
          {/* Sidebar Header */}
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 dark:text-white">Conversations</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <button
              onClick={handleNewConversation}
              className="w-full px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              New Chat
            </button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No conversations yet
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors group ${
                      currentConversationId === conv.id
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {conv.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{conv.message_count} msgs</span>
                          <span>•</span>
                          <span>{new Date(conv.last_message_at).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteConversation(conv.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                      >
                        <svg
                          className="w-4 h-4 text-red-600 dark:text-red-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Compact Header */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-3 py-2 sm:px-4 sm:py-3 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Back Button */}
              <button
                onClick={() => router.push('/dashboard')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>

              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              )}

              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-lg sm:text-xl shadow-lg">
                  👘
                </div>
                <div className="min-w-0">
                  <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                    Sensei Sakura
                  </h1>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold">Online</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="mb-6">
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Choose a topic or ask your own question
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt.text)}
                      className="p-3 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="text-2xl mb-1">{prompt.icon}</div>
                      <div className="text-xs font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                        <span className="hidden sm:inline">{prompt.text}</span>
                        <span className="sm:hidden">{prompt.short}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-sm sm:text-base flex-shrink-0 shadow">
                    👘
                  </div>
                )}

                <div
                  className={`max-w-[85%] sm:max-w-[75%] ${message.role === 'user' ? 'order-first' : ''}`}
                >
                  <div
                    className={`rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg ${
                      message.role === 'user'
                        ? 'bg-red-600 text-white'
                        : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50'
                    }`}
                  >
                    {message.isTyping ? (
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        ></span>
                        <span
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.4s' }}
                        ></span>
                      </div>
                    ) : (
                      <p className="text-sm sm:text-base whitespace-pre-wrap leading-relaxed">
                        {message.content}
                      </p>
                    )}
                  </div>
                  <p
                    className={`text-xs text-gray-500 dark:text-gray-400 mt-1 ${message.role === 'user' ? 'text-right' : ''}`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-sm sm:text-base flex-shrink-0 shadow">
                    🙋
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Compact Input Area */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 shadow-sm">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Japanese..."
                className="flex-1 px-3 py-2 sm:px-4 sm:py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-sm sm:text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                rows={2}
                disabled={isLoading}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`px-4 sm:px-6 rounded-xl font-semibold text-white transition-all ${
                  !input.trim() || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                Teaching in English
              </span>
              <span>{input.length} / 1000</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
