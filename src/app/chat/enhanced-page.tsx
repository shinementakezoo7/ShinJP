'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isTyping?: boolean
  status?: 'sending' | 'sent' | 'delivered' | 'read'
  reaction?: string | null
  translation?: string
}

interface Conversation {
  id: string
  title: string
  message_count: number
  last_message_at: string
}

export default function EnhancedChatPage() {
  const router = useRouter()
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const [aiMode, setAiMode] = useState<'teacher' | 'conversation' | 'grammar'>('teacher')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  // Enhanced quick actions and reactions
  const quickPrompts = [
    { icon: '🌸', text: 'Daily greetings', short: 'Greetings' },
    { icon: '📝', text: 'Explain particles', short: 'Particles' },
    { icon: '✍️', text: 'Teach Hiragana', short: 'Hiragana' },
    { icon: '🗾', text: 'Travel phrases', short: 'Travel' },
    { icon: '🎮', text: 'Anime vocabulary', short: 'Anime' },
    { icon: '🍱', text: 'Food and dining', short: 'Food' },
  ]

  const messageReactions = ['👍', '❤️', '🎉', '🤔', '😊', '🔥', '✨', '🙏']
  const aiModes = [
    {
      value: 'teacher',
      label: 'Teacher Mode',
      description: 'Structured grammar and vocabulary lessons',
    },
    { value: 'conversation', label: 'Conversation Mode', description: 'Natural dialogue practice' },
    { value: 'grammar', label: 'Grammar Mode', description: 'Detailed grammar explanations' },
  ]

  const speakText = (text: string) => {
    try {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'en-US'
        utterance.rate = 1
        window.speechSynthesis.cancel()
        window.speechSynthesis.speak(utterance)
      }
    } catch (e) {
      console.error('Speech synthesis error:', e)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.error('Clipboard error:', e)
    }
  }

  const toggleReaction = (id: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, reaction: m.reaction === reaction ? null : reaction } : m
      )
    )
  }

  const handleScroll = () => {
    const el = messagesContainerRef.current
    if (!el) return
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50
    setShowScrollButton(!nearBottom)
  }

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

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
          content: `こんにちは！I'm Sensei Sakura, your AI Japanese teacher. I can teach in English with Japanese examples. How can I help you today?`,
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
  }, [messages])

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true)
    }

    // Check if speech recognition is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true)
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
      status: 'sending',
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Update message status to sent after a short delay
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === userMessage.id ? { ...m, status: 'sent' as const } : m))
      )
    }, 500)

    await saveMessage(userMessage)

    // Create streaming message placeholder
    const streamingMessageId = 'streaming-' + Date.now()
    const streamingMessage: Message = {
      id: streamingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
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
                    // Save final message with translation option
                    const finalMessage: Message = {
                      id: Date.now().toString(),
                      role: 'assistant',
                      content: fullContent,
                      timestamp: new Date(),
                      translation: showTranslation
                        ? 'こんにちは！I am Sensei Sakura, your AI Japanese teacher.'
                        : undefined,
                    }
                    await saveMessage(finalMessage)
                    // Stop typing indicator for streaming placeholder
                    setMessages((prev) =>
                      prev.map((m) => (m.id === streamingMessageId ? { ...m, isTyping: false } : m))
                    )
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

  const startVoiceInput = () => {
    if (!speechSupported) return

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('')

      setInput(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  return (
    <div className="h-screen flex bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20 relative overflow-hidden">
      {/* Enhanced Animated Background with Particle Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Dynamic Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/30 via-pink-50/20 to-orange-50/30 dark:from-gray-900/40 dark:via-red-950/10 dark:to-orange-950/10 animate-gradient-shift"></div>

        {/* Giant Kanji Watermark with Enhanced Effect */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[500px] japanese-text text-red-500/[0.015] dark:text-red-400/[0.02] select-none font-black animate-pulse-slow">
          話
        </div>

        {/* Enhanced Floating Sakura Petals with Parallax */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sakura-float"
            style={{
              left: `${(i * 7) % 100}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${12 + (i % 8) * 2}s`,
              top: `-${(i % 20) * 10}px`,
              opacity: 0.05 + Math.random() * 0.1,
              transform: `scale(${0.5 + Math.random() * 0.8})`,
            }}
          >
            <div className="text-2xl opacity-[0.15] dark:opacity-[0.1] animate-bounce-slow">🌸</div>
          </div>
        ))}

        {/* Traditional Wave Pattern (Seigaiha) with Animation */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.06] animate-wave-flow"
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

        {/* Enhanced Particle Effects */}
        {[...Array(12)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full animate-particle-float"
            style={{
              left: `${(i * 17 + 5) % 95}%`,
              top: `${(i * 13 + 10) % 85}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 5)}s`,
              opacity: 0.1 + Math.random() * 0.3,
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

      {/* Enhanced Compact Sidebar */}
      {sidebarOpen && (
        <div className="fixed md:relative inset-y-0 left-0 z-40 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                  <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
                Conversations
              </h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
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

            {/* AI Mode Selector */}
            <div className="mb-4 p-3 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <label className="text-xs font-semibold text-gray-600 dark:text-gray-300 block mb-2">
                AI Mode
              </label>
              <select
                value={aiMode}
                onChange={(e) => setAiMode(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-red-300 dark:border-red-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {aiModes.map((mode) => (
                  <option key={mode.value} value={mode.value}>
                    {mode.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {aiModes.find((m) => m.value === aiMode)?.description}
              </p>
            </div>

            <button
              onClick={handleNewConversation}
              className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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
          <div className="flex-1 overflow-y-auto p-3">
            {conversations.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">
                No conversations yet
              </div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all group ${
                      currentConversationId === conv.id
                        ? 'bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {conv.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                          <span>{conv.message_count} messages</span>
                          <span>•</span>
                          <span>{new Date(conv.last_message_at).toLocaleDateString()}</span>
                        </div>
                        {/* Progress indicator */}
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                          <div
                            className="bg-gradient-to-r from-red-500 to-pink-500 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((conv.message_count / 50) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteConversation(conv.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
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

          {/* Enhanced Footer with Stats */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
            {/* Teacher Info */}
            <div className="bg-gradient-to-br from-amber-50 to-red-50 dark:from-amber-900/20 dark:to-red-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-white">先生</span>
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    Sensei Sakura 桜先生
                  </div>
                  <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    AI Language Tutor
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                Teaching in English with Japanese examples
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {/* Enhanced Header */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
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

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-lg shadow-lg animate-pulse">
                  👘
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
                    Sensei Sakura
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  </h1>
                  <p className="text-sm text-green-600 dark:text-green-400 font-semibold">
                    Online • AI Tutor
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Translation Toggle */}
              <button
                onClick={() => setShowTranslation(!showTranslation)}
                className={`p-2 rounded-lg transition-colors ${
                  showTranslation
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                title="Toggle Translation"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5h12M9 3v2m6 4v2M3 11h12M9 9v2m6 4v2M3 17h12M9 15v2"
                  />
                </svg>
              </button>

              {/* Settings Button */}
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
        <div
          className="flex-1 overflow-y-auto p-4 relative"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="mb-8">
                <p className="text-center text-gray-600 dark:text-gray-400 text-sm mb-6">
                  Choose a topic or ask your own question
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(prompt.text)}
                      className="p-4 rounded-xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-2 border-gray-200 dark:border-gray-700 hover:border-red-500 dark:hover:border-red-500 hover:shadow-2xl transition-all text-left group group"
                    >
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        {prompt.icon}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                        {prompt.text}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Messages */}
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-message-slide-in`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.role === 'assistant' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-lg flex-shrink-0 shadow-lg hover:scale-110 transition-transform">
                    👘
                  </div>
                )}

                <div className={`max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-lg hover:shadow-2xl transition-all duration-300 group relative ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
                        : 'bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm text-gray-900 dark:text-white border border-gray-200/50 dark:border-gray-700/50 hover:border-red-300 dark:hover:border-red-600'
                    }`}
                  >
                    {/* Message Actions */}
                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1.5">
                      <button
                        onClick={() => copyToClipboard(message.content)}
                        className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center"
                        title="Copy"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 002-2v2m-6 12h8a2 2 0 002 2v2a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8a2 2 0 00-2-2z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => speakText(message.content)}
                        className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-md hover:scale-110 transition-transform flex items-center justify-center"
                        title="Speak"
                      >
                        <svg
                          className="w-4 h-4 text-gray-600 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4zM4 6h5l5 4v4l-5 4H4a2 2 0 01-2-2V8a2 2 0 012-2z"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Message Content */}
                    {message.isTyping ? (
                      <div className="flex gap-2 items-center">
                        <span className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"></span>
                        <span
                          className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        ></span>
                        <span
                          className="w-3 h-3 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: '0.4s' }}
                        ></span>
                        <span className="ml-3 text-sm text-gray-500 dark:text-gray-400">
                          Sensei is typing...
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-base sm:text-lg leading-relaxed animate-fade-in">
                          {message.content}
                        </p>

                        {/* Translation */}
                        {showTranslation && message.translation && (
                          <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 italic">
                            {message.translation}
                          </div>
                        )}
                      </>
                    )}

                    {/* Message Reactions */}
                    <div className="flex gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {messageReactions.map((reaction, idx) => (
                        <button
                          key={idx}
                          className={`text-lg hover:scale-125 transition-transform duration-200 ${
                            message.reaction === reaction ? 'ring-2 ring-red-500 rounded' : ''
                          }`}
                          onClick={() => toggleReaction(message.id, reaction)}
                          title={reaction}
                        >
                          {reaction}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-3 mt-2 ${message.role === 'user' ? 'justify-end' : ''}`}
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                    {message.role === 'user' && (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-blue-600 dark:text-blue-400">Sent</span>
                      </div>
                    )}
                  </div>
                </div>

                {message.role === 'user' && (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-lg flex-shrink-0 shadow-lg hover:scale-110 transition-transform">
                    🙋
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="fixed right-4 bottom-24 sm:bottom-10 p-3 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-2xl transition-all animate-bounce-slow"
              title="Scroll to latest"
            >
              ⬇️
            </button>
          )}
        </div>

        {/* Enhanced Input Area */}
        <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="max-w-4xl mx-auto">
            {/* AI Mode Indicator */}
            <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <span
                  className={`w-2 h-2 rounded-full ${aiMode === 'teacher' ? 'bg-red-500' : aiMode === 'conversation' ? 'bg-blue-500' : 'bg-purple-500'} animate-pulse`}
                ></span>
                <span className="capitalize">{aiMode} Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'}`}
                  ></span>
                  {isListening ? 'Listening...' : 'Teaching in English'}
                </span>
                <span>{input.length} / 1000</span>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Voice Input Button */}
              {speechSupported && (
                <button
                  onClick={startVoiceInput}
                  disabled={isLoading}
                  className={`p-3 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title={isListening ? 'Listening...' : 'Voice input'}
                >
                  {isListening ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  )}
                </button>
              )}

              {/* Quick Prompts */}
              {messages.length === 1 && (
                <div className="hidden sm:flex gap-2 mr-2">
                  {quickPrompts.slice(0, 3).map((prompt, index) => (
                    <button
                      key={`inline-${index}`}
                      onClick={() => setInput(prompt.text)}
                      className="px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white hover:border-red-500 dark:hover:border-red-500 transition-colors"
                      title={prompt.text}
                    >
                      {prompt.short}
                    </button>
                  ))}
                </div>
              )}

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value)
                  const el = inputRef.current
                  if (el) {
                    el.style.height = 'auto'
                    el.style.height = `${Math.min(el.scrollHeight, 200)}px`
                  }
                }}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? 'Listening...' : 'Ask me anything about Japanese...'}
                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                rows={2}
                disabled={isLoading}
              />

              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                  !input.trim() || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-2xl transform hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
