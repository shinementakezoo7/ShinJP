'use client'

import { useEffect, useRef, useState } from 'react'
import JapaneseButton from '@/components/japanese/JapaneseButton'
import JapaneseCard from '@/components/japanese/JapaneseCard'
import JapaneseLoader from '@/components/japanese/JapaneseLoader'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isTyping?: boolean
  tokens?: number
  jlptLevel?: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  reactions?: string[]
  favorite?: boolean
}

interface Conversation {
  id: string
  title: string
  model: string
  context_window: number
  total_tokens: number
  message_count: number
  last_message_at: string
  created_at: string
  category?: string
  emoji?: string
}

export default function UltimateChatPage() {
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contextInfo, setContextInfo] = useState({ used: 0, total: 122000 })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isListening, setIsListening] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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
          content: `🌸 こんにちは！ Welcome, student!

I'm **Sensei Sakura 桜先生**, your AI Japanese language master with deep expertise in:

**📚 Teaching Specialties:**
• **文法 Grammar** - From basic particles to advanced honorifics
• **語彙 Vocabulary** - JLPT N5 → N1 (800 to 10,000+ words)
• **漢字 Kanji** - Master 2,000+ characters with proven mnemonics
• **会話 Conversation** - Natural, native-level expressions
• **文化 Culture** - Deep insights into Japanese customs & etiquette
• **ビジネス Business** - Professional Japanese communication

**🎯 My Teaching Philosophy:**
I teach ENTIRELY in **English** using Japanese only as examples with full translations. You don't need to know Japanese to start! Every lesson includes:
✅ Clear English explanations first
✅ Romaji for all Japanese text
✅ Word-by-word breakdowns
✅ Real-world usage examples
✅ Common mistakes to avoid
✅ Practice exercises

**🌟 Special Features:**
• JLPT level detection for vocabulary
• Voice input support (click 🎤)
• Export conversations for review
• Message favorites & reactions
• Context-aware learning path

Ready to begin your journey to Japanese mastery? Ask me anything or choose a topic below! 

頑張りましょう！ (Ganbarimashou! - Let's do our best!)`,
          timestamp: new Date(),
        },
      ])
      setContextInfo({ used: 0, total: 122000 })
      await loadConversations()
    } catch (error) {
      console.error('Error creating conversation:', error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  // Set sidebar open by default on desktop
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setSidebarOpen(true)
    }
  }, [])

  useEffect(() => {
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
          tokens: number
        }) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at),
          tokens: msg.tokens,
        })
      )

      setCurrentConversationId(conversationId)
      setMessages(loadedMessages)

      const totalTokens = loadedMessages.reduce((sum, msg) => sum + (msg.tokens || 0), 0)
      setContextInfo({ used: totalTokens, total: 122000 })

      // Close sidebar on mobile after selecting conversation
      if (window.innerWidth < 768) {
        setSidebarOpen(false)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const handleDeleteConversation = async (id: string) => {
    if (confirm('この会話を削除しますか？ Delete this conversation?')) {
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
          tokens: message.tokens || 0,
          metadata: { jlptLevel: message.jlptLevel },
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
      tokens: Math.ceil(input.trim().length / 4),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    await saveMessage(userMessage)

    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

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
        }),
      })

      if (!response.ok) {
        throw new Error(`Server error ${response.status}`)
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: typeof data.message === 'string' ? data.message : String(data.message),
        timestamp: new Date(),
        tokens: data.usage?.completion_tokens || Math.ceil(String(data.message).length / 4),
      }

      setMessages((prev) => prev.filter((m) => m.id !== 'typing').concat(aiResponse))
      await saveMessage(aiResponse)

      const newTokenCount = contextInfo.used + (userMessage.tokens || 0) + (aiResponse.tokens || 0)
      setContextInfo({ used: newTokenCount, total: 122000 })
      setIsLoading(false)
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content:
          "⚠️ ごめんなさい (Gomennasai - I'm sorry)! I encountered an error. Please try again.",
        timestamp: new Date(),
      }

      setMessages((prev) => prev.filter((m) => m.id !== 'typing').concat(errorMessage))
      setIsLoading(false)
    }
  }

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice input is not supported in your browser')
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognitionAPI =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition = new SpeechRecognitionAPI() as any
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput((prev) => `${prev} ${transcript}`)
      inputRef.current?.focus()
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.start()
  }

  const exportConversation = () => {
    const exportData = messages.map((m) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp.toISOString(),
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `japanese-lesson-${new Date().toISOString().split('T')[0]}.json`
    a.click()
  }

  const toggleFavorite = (messageId: string) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, favorite: !m.favorite } : m))
    )
  }

  const addReaction = (messageId: string, emoji: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === messageId ? { ...m, reactions: [...(m.reactions || []), emoji] } : m
      )
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const contextPercentage = (contextInfo.used / contextInfo.total) * 100

  const categories = [
    { id: 'all', name: 'All', emoji: '📚', kanji: '全部' },
    { id: 'grammar', name: 'Grammar', emoji: '📝', kanji: '文法' },
    { id: 'vocabulary', name: 'Vocabulary', emoji: '💬', kanji: '語彙' },
    { id: 'kanji', name: 'Kanji', emoji: '🈯', kanji: '漢字' },
    { id: 'conversation', name: 'Conversation', emoji: '🗣️', kanji: '会話' },
    { id: 'culture', name: 'Culture', emoji: '🎎', kanji: '文化' },
  ]

  const quickPrompts = [
    {
      emoji: '🌸',
      text: 'Teach me essential daily greetings',
      category: 'Basics',
      kanji: '挨拶',
      color: 'from-pink-500 to-rose-600',
    },
    {
      emoji: '📝',
      text: 'Explain particles: は、が、を、に',
      category: 'Grammar',
      kanji: '助詞',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      emoji: '✍️',
      text: 'Teach me Hiragana systematically',
      category: 'Writing',
      kanji: 'ひらがな',
      color: 'from-purple-500 to-violet-600',
    },
    {
      emoji: '🗾',
      text: 'Essential travel phrases for Japan',
      category: 'Travel',
      kanji: '旅行',
      color: 'from-green-500 to-emerald-600',
    },
    {
      emoji: '🍜',
      text: 'Ordering food at restaurants',
      category: 'Food',
      kanji: '食事',
      color: 'from-orange-500 to-amber-600',
    },
    {
      emoji: '💼',
      text: 'Business Japanese fundamentals',
      category: 'Business',
      kanji: '仕事',
      color: 'from-gray-600 to-slate-700',
    },
    {
      emoji: '🎌',
      text: 'Understanding keigo (honorific speech)',
      category: 'Culture',
      kanji: '敬語',
      color: 'from-red-500 to-pink-600',
    },
    {
      emoji: '📚',
      text: 'JLPT N5 study plan guide',
      category: 'JLPT',
      kanji: 'N5',
      color: 'from-cyan-500 to-teal-600',
    },
  ]

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || conv.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="h-screen flex overflow-hidden bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-red-950/10 dark:to-purple-950/10 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Giant Kanji Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[600px] japanese-text text-red-500/[0.01] dark:text-red-400/[0.02] select-none font-black">
          話
        </div>

        {/* Floating Sakura Petals */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sakura-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + Math.random() * 10}s`,
              top: '-50px',
            }}
          >
            <div className="text-3xl opacity-5 dark:opacity-10">🌸</div>
          </div>
        ))}

        {/* Traditional Pattern Overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="seigaiha-bg"
              x="0"
              y="0"
              width="140"
              height="70"
              patternUnits="userSpaceOnUse"
            >
              <g stroke="currentColor" strokeWidth="1.5" fill="none" className="text-red-600">
                <path d="M0,35 Q17.5,15 35,35 T70,35" />
                <path d="M35,35 Q52.5,15 70,35 T105,35" />
                <path d="M70,35 Q87.5,15 105,35 T140,35" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#seigaiha-bg)" />
        </svg>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Enhanced Sidebar */}
      {sidebarOpen && (
        <div className="fixed md:relative inset-y-0 left-0 z-40 w-full sm:w-96 bg-white/90 dark:bg-black/60 backdrop-blur-2xl border-r-4 border-red-300/30 dark:border-red-800/30 flex flex-col shadow-2xl">
          {/* Sidebar Header */}
          <div className="p-4 sm:p-6 border-b-2 border-red-200/30 dark:border-red-800/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black japanese-text text-red-600 dark:text-red-400 mb-1">
                  会話の歴史
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conversation History</p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
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
                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                  />
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full px-4 py-2 pl-10 bg-gray-100 dark:bg-gray-800 border-2 border-transparent focus:border-red-500 dark:focus:border-red-400 rounded-xl text-sm transition-all outline-none"
              />
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {cat.emoji} {cat.name}
                </button>
              ))}
            </div>

            {/* New Chat Button */}
            <JapaneseButton
              variant="sakura"
              size="md"
              onClick={handleNewConversation}
              className="w-full mt-4"
              leftIcon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              }
            >
              New Conversation
            </JapaneseButton>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {filteredConversations.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🌸</div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {searchQuery ? 'No conversations found' : 'Start a new conversation'}
                </p>
              </div>
            ) : (
              filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => handleSelectConversation(conv.id)}
                  className="cursor-pointer"
                >
                  <JapaneseCard
                    className={`p-4 ${
                      currentConversationId === conv.id ? 'ring-4 ring-red-500/50' : ''
                    }`}
                    pattern="seigaiha"
                    hover={true}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{conv.emoji || '💬'}</span>
                          <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm">
                            {conv.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {conv.message_count}
                          </span>
                          <span>•</span>
                          <span>{new Date(conv.last_message_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteConversation(conv.id)
                        }}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 text-red-500"
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
                  </JapaneseCard>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Footer - Teacher Stats */}
          <div className="p-4 border-t-2 border-red-200/30 dark:border-red-800/30 space-y-3">
            <JapaneseCard pattern="shippo" gradient="sakura" className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">👘</span>
                </div>
                <div className="flex-1">
                  <p className="font-black text-sm text-gray-900 dark:text-white japanese-text">
                    桜先生
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Sensei Sakura</p>
                  <p className="text-xs text-red-600 dark:text-red-400 font-bold">
                    Expert Instructor
                  </p>
                </div>
              </div>
            </JapaneseCard>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 text-center">
                <p className="text-2xl font-black text-purple-700 dark:text-purple-400">
                  {conversations.length}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-300">Conversations</p>
              </div>
              <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 text-center">
                <p className="text-2xl font-black text-green-700 dark:text-green-400">7</p>
                <p className="text-xs text-green-600 dark:text-green-300">Day Streak 🔥</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Sidebar Button (when closed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-2 sm:left-4 top-2 sm:top-4 z-50 p-2 sm:p-3 rounded-xl bg-white/90 dark:bg-black/60 backdrop-blur-xl border-2 border-red-300/30 dark:border-red-800/30 shadow-xl hover:scale-110 transition-transform"
        >
          <svg
            className="w-6 h-6 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Enhanced Header */}
        <div className="bg-white/90 dark:bg-black/60 backdrop-blur-2xl border-b-4 border-red-300/30 dark:border-red-800/30 px-3 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
              {/* Animated Sensei Avatar */}
              <div className="relative">
                <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 shadow-2xl flex items-center justify-center animate-pulse-glow">
                  <span className="text-xl sm:text-2xl md:text-3xl">👘</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-green-500 rounded-full border-2 sm:border-3 md:border-4 border-white dark:border-gray-900 animate-pulse shadow-lg"></div>
                <div className="hidden sm:block absolute -top-2 -left-2 text-lg md:text-xl animate-bounce-slow">
                  🌸
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-base sm:text-lg md:text-2xl font-black text-gray-900 dark:text-white flex items-center gap-1 sm:gap-2 md:gap-3 flex-wrap">
                  <span className="japanese-text text-red-600 dark:text-red-400">桜先生</span>
                  <span className="hidden sm:inline">Sensei Sakura</span>
                  <span className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full animate-pulse shadow-lg">
                    ONLINE
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 hidden md:block">
                  Expert Japanese Instructor • Teaching in{' '}
                  <span className="text-green-600 dark:text-green-400 font-bold">English</span> with{' '}
                  <span className="text-red-600 dark:text-red-400 font-bold japanese-text">
                    日本語
                  </span>{' '}
                  examples
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Memory Indicator */}
              <div className="group relative">
                <button className="px-4 py-2 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border-2 border-indigo-300/50 dark:border-indigo-700/50 hover:scale-105 transition-transform">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                      Memory
                    </span>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400">
                      {Math.round(contextPercentage)}%
                    </span>
                  </div>
                </button>

                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-indigo-300/50 dark:border-indigo-700/50 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-2 font-bold">
                    Conversation Memory
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          contextPercentage < 50
                            ? 'bg-green-500'
                            : contextPercentage < 80
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{ width: `${contextPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {contextInfo.used.toLocaleString()} / {contextInfo.total.toLocaleString()}{' '}
                    tokens used
                  </div>
                  <div className="mt-2 text-xs text-indigo-600 dark:text-indigo-400 italic">
                    🧠 Sensei remembers your entire conversation for context-aware teaching
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <button
                onClick={exportConversation}
                className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-300/50 dark:border-green-700/50 hover:scale-105 transition-transform"
                title="Export conversation"
              >
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </button>

              {/* Settings Button */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border-2 border-gray-300/50 dark:border-gray-600/50 hover:scale-105 transition-transform"
                title="Settings"
              >
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
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 custom-scrollbar">
          <div className="max-w-full md:max-w-3xl lg:max-w-5xl mx-auto space-y-3 sm:space-y-4 md:space-y-6">
            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="mb-10 animate-fade-in">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <div className="text-5xl">🌸</div>
                    <h3 className="text-4xl font-black">
                      <span className="japanese-text text-red-600 dark:text-red-400">
                        始めましょう
                      </span>
                    </h3>
                    <div className="text-5xl">🌸</div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Let&apos;s Begin Your Journey!
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a topic below or ask your own question
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="group relative overflow-hidden rounded-2xl bg-white/90 dark:bg-black/40 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-2xl hover:scale-[1.03] transition-all duration-300 text-left"
                    >
                      {/* Background Kanji Watermark */}
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-7xl japanese-text text-gray-200/20 dark:text-gray-800/20 font-black select-none">
                        {prompt.kanji}
                      </div>

                      {/* Gradient Overlay on Hover */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${prompt.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                      ></div>

                      <div className="relative">
                        <div className="flex items-start gap-3 mb-3">
                          <span className="text-3xl flex-shrink-0">{prompt.emoji}</span>
                          <div className="flex-1">
                            <div className="text-xs font-black text-red-600 dark:text-red-400 mb-1 uppercase tracking-wider">
                              {prompt.category}
                            </div>
                            <div className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                              {prompt.text}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-end">
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-1 transition-all"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in group`}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div
                  className={`flex gap-2 sm:gap-3 md:gap-4 max-w-[95%] sm:max-w-[90%] md:max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Enhanced Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`relative w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 ring-4 ring-blue-500/20'
                          : 'bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 ring-4 ring-red-500/20 animate-gradient'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <span className="text-lg sm:text-xl md:text-2xl">🙋</span>
                      ) : (
                        <span className="text-lg sm:text-xl md:text-2xl">👘</span>
                      )}
                      {/* Online status indicator for assistant */}
                      {message.role === 'assistant' && !message.isTyping && (
                        <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-2 h-2 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    {/* Enhanced Name and Time */}
                    <div
                      className={`flex items-center gap-3 mb-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-center gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                      >
                        <span
                          className={`text-sm font-black ${
                            message.role === 'user'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {message.role === 'user' ? 'You' : '桜先生 Sensei Sakura'}
                        </span>
                        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {message.jlptLevel && (
                        <span className="px-3 py-1 text-xs font-black bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg animate-pulse">
                          {message.jlptLevel}
                        </span>
                      )}
                    </div>

                    {/* Enhanced Message Bubble */}
                    <div
                      className={`rounded-3xl shadow-2xl relative backdrop-blur-sm transform transition-all duration-300 group-hover:scale-[1.01] ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 text-white border-4 border-blue-400/30'
                          : 'bg-white/98 dark:bg-gray-800/98 border-4 border-red-300/30 dark:border-red-700/30 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {/* Decorative Corner Element */}
                      {message.role === 'assistant' && (
                        <div className="absolute -top-2 -left-2 w-8 h-8 bg-gradient-to-br from-red-400 to-pink-500 rounded-full opacity-20 blur-md"></div>
                      )}

                      <div className="p-3 sm:p-4 md:p-6 relative z-10">
                        {message.isTyping ? (
                          <div className="flex items-center gap-4">
                            <div className="flex gap-2">
                              <span
                                className="w-4 h-4 bg-gradient-to-br from-red-400 to-pink-500 rounded-full animate-bounce shadow-lg"
                                style={{ animationDelay: '0ms' }}
                              ></span>
                              <span
                                className="w-4 h-4 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full animate-bounce shadow-lg"
                                style={{ animationDelay: '150ms' }}
                              ></span>
                              <span
                                className="w-4 h-4 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full animate-bounce shadow-lg"
                                style={{ animationDelay: '300ms' }}
                              ></span>
                            </div>
                            <span className="text-base font-semibold text-gray-600 dark:text-gray-300 japanese-text">
                              先生は考えています...{' '}
                              <span className="text-sm">(Sensei is thinking...)</span>
                            </span>
                          </div>
                        ) : (
                          <div
                            className={`prose prose-base max-w-none whitespace-pre-wrap leading-relaxed ${
                              message.role === 'user'
                                ? 'prose-invert'
                                : 'dark:prose-invert prose-headings:font-black prose-headings:text-red-600 dark:prose-headings:text-red-400 prose-strong:text-red-700 dark:prose-strong:text-red-300'
                            }`}
                          >
                            {message.content}
                          </div>
                        )}
                      </div>

                      {/* Enhanced Message Actions */}
                      {!message.isTyping && (
                        <div
                          className={`px-5 pb-4 flex items-center gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          {/* Reactions Display */}
                          {message.reactions && message.reactions.length > 0 && (
                            <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 shadow-inner">
                              {message.reactions.map((emoji, i) => (
                                <span
                                  key={i}
                                  className="text-lg transform hover:scale-125 transition-transform cursor-pointer"
                                >
                                  {emoji}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Action Buttons with Enhanced Visibility */}
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 shadow-lg">
                            <button
                              onClick={() => toggleFavorite(message.id)}
                              className={`p-2 rounded-full transition-all duration-300 ${
                                message.favorite
                                  ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30 scale-110'
                                  : 'text-gray-500 dark:text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                              }`}
                              title="Favorite"
                            >
                              <svg
                                className="w-5 h-5"
                                fill={message.favorite ? 'currentColor' : 'none'}
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                              </svg>
                            </button>

                            <button
                              onClick={() => addReaction(message.id, '👍')}
                              className="p-2 rounded-full text-xl hover:scale-125 transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20"
                              title="Like"
                            >
                              👍
                            </button>

                            <button
                              onClick={() => addReaction(message.id, '❤️')}
                              className="p-2 rounded-full text-xl hover:scale-125 transition-all hover:bg-pink-50 dark:hover:bg-pink-900/20"
                              title="Love"
                            >
                              ❤️
                            </button>

                            <button
                              onClick={() => addReaction(message.id, '🌸')}
                              className="p-2 rounded-full text-xl hover:scale-125 transition-all hover:bg-pink-50 dark:hover:bg-pink-900/20"
                              title="Sakura"
                            >
                              🌸
                            </button>

                            <div className="w-px h-6 bg-gray-300 dark:bg-gray-600"></div>

                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(message.content)
                              }}
                              className="p-2 rounded-full transition-all text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 hover:scale-110"
                              title="Copy"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2.5}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Message Tail */}
                      <div
                        className={`absolute top-6 ${
                          message.role === 'user' ? '-right-2' : '-left-2'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 transform rotate-45 ${
                            message.role === 'user'
                              ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                              : 'bg-white dark:bg-gray-800 border-l-4 border-t-4 border-red-300/30 dark:border-red-700/30'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Ultra-Enhanced Input Area */}
        <div className="bg-gradient-to-t from-white via-white to-white/95 dark:from-black/80 dark:via-black/70 dark:to-black/60 backdrop-blur-2xl border-t-4 border-red-300/40 dark:border-red-800/40 p-3 sm:p-4 md:p-6 lg:p-8 shadow-[0_-20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
          <div className="max-w-full md:max-w-3xl lg:max-w-5xl mx-auto">
            {/* Input Container with Enhanced Styling */}
            <div className="relative group">
              {/* Floating Label */}
              <div className="absolute -top-2 sm:-top-3 left-3 sm:left-6 z-10">
                <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-black rounded-full shadow-lg flex items-center gap-1 sm:gap-2">
                  <span className="animate-pulse text-sm sm:text-base">✍️</span>
                  <span className="hidden sm:inline">Message Sensei Sakura</span>
                  <span className="sm:hidden">Message</span>
                </span>
              </div>

              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about Japanese!"
                className="w-full p-3 pr-20 pb-14 sm:p-4 sm:pr-28 sm:pb-16 md:p-6 md:pr-36 md:pb-20 bg-white dark:bg-gray-800 border-2 sm:border-3 md:border-4 border-gray-300 dark:border-gray-600 focus:border-red-500 dark:focus:border-red-400 rounded-2xl sm:rounded-3xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-all duration-300 focus:outline-none focus:ring-4 sm:focus:ring-6 focus:ring-red-500/20 shadow-xl sm:shadow-2xl text-sm sm:text-base leading-relaxed font-medium"
                rows={3}
                disabled={isLoading}
              />

              {/* Enhanced Input Actions */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-6 md:right-6 flex items-center gap-2 sm:gap-3">
                {/* Voice Input Button with Visual Feedback */}
                <button
                  onClick={handleVoiceInput}
                  disabled={isLoading}
                  className={`relative p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl font-bold text-white shadow-lg sm:shadow-2xl transition-all duration-300 ${
                    isListening
                      ? 'bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 animate-pulse scale-110 ring-4 ring-red-500/50'
                      : 'bg-gradient-to-br from-purple-500 via-indigo-600 to-blue-600 hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-110'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  title="Voice input"
                >
                  {isListening && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 flex h-3 w-3 sm:h-4 sm:w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 sm:h-4 sm:w-4 bg-red-500"></span>
                    </span>
                  )}
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <span className="hidden sm:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap text-purple-600 dark:text-purple-400">
                    {isListening ? 'Listening...' : 'Voice'}
                  </span>
                </button>

                {/* Send Button with Enhanced Design */}
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || isLoading}
                  className={`relative group/send p-2 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl font-bold text-white shadow-lg sm:shadow-2xl transition-all duration-300 ${
                    !input.trim() || isLoading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-br from-red-500 via-pink-600 to-red-700 hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] hover:scale-110 animate-gradient'
                  }`}
                  title="Send message"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 sm:border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap text-gray-500 dark:text-gray-400">
                        Sending...
                      </span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 sm:w-6 sm:h-6 transform group-hover/send:translate-x-1 group-hover/send:-translate-y-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      <span className="hidden sm:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-bold whitespace-nowrap text-red-600 dark:text-red-400">
                        Send
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Character Counter Badge */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 md:bottom-6 md:left-6">
                <span
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-lg sm:rounded-xl font-black text-xs shadow-md sm:shadow-lg transition-all ${
                    input.length > 800
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 ring-2 ring-red-500/50'
                      : input.length > 500
                        ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {input.length} / 1000 chars
                </span>
              </div>

              {/* Glow Effect on Focus */}
              <div className="absolute inset-0 rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 blur-xl opacity-20"></div>
              </div>
            </div>

            {/* Enhanced Input Footer with More Info */}
            <div className="mt-3 sm:mt-4 md:mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center flex-wrap gap-2 sm:gap-3 md:gap-4 text-xs">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-bold text-green-700 dark:text-green-300">
                    Sensei Online
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <svg
                    className="w-4 h-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                    />
                  </svg>
                  <span className="font-bold text-blue-700 dark:text-blue-300">
                    Teaching in English
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <span className="text-red-500 text-sm">🎌</span>
                  <span className="font-bold text-red-700 dark:text-red-300 japanese-text">
                    日本語 Examples
                  </span>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <svg
                    className="w-4 h-4 text-purple-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                    />
                  </svg>
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    Voice Enabled
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group/emoji"
                  title="Quick reactions"
                >
                  <span className="text-xl group-hover/emoji:scale-125 transition-transform inline-block">
                    😊
                  </span>
                </button>
                <button
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  title="Keyboard shortcuts"
                >
                  <svg
                    className="w-5 h-5 text-gray-500 dark:text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Keyboard Shortcuts Hint */}
            <div className="mt-3 hidden md:flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono font-bold">
                  Enter
                </kbd>
                <span>Send</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono font-bold">
                  Shift
                </kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono font-bold">
                  Enter
                </kbd>
                <span>New Line</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono font-bold">
                  Ctrl
                </kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono font-bold">
                  /
                </kbd>
                <span>Voice Input</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading && messages.length === 0 && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl">
          <div className="text-center">
            <JapaneseLoader variant="enso" size="xl" />
            <p className="mt-6 text-xl font-bold japanese-text text-red-600 dark:text-red-400">
              読み込み中...
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Loading your learning session...
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
