'use client'

import { useEffect, useRef, useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        "こんにちは! I'm your AI Japanese learning companion. I can help you practice conversations, explain grammar, teach vocabulary, or answer any questions about Japanese. What would you like to learn today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

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

    // Simulate typing indicator
    const typingMessage: Message = {
      id: 'typing',
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isTyping: true,
    }
    setMessages((prev) => [...prev, typingMessage])

    try {
      // Call NVIDIA API with stockmark-2-100b-instruct model
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        const errorDetails = errorData.details || `Server returned status ${response.status}`
        throw new Error(errorDetails)
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => prev.filter((m) => m.id !== 'typing').concat(aiResponse))
      setIsLoading(false)
    } catch (error) {
      console.error('Error sending message:', error)

      // Show detailed error message to user
      let errorContent = 'Sorry, I encountered an error. '

      if (error instanceof Error) {
        if (
          error.message.includes('NVIDIA API is not configured') ||
          error.message.includes('NVIDIA_API_KEY')
        ) {
          errorContent =
            '⚠️ NVIDIA API is not configured. Please ensure NVIDIA_API_KEY_1 is set in your environment variables. Visit https://build.nvidia.com/ to get your API key.'
        } else if (error.message.includes('Rate limit') || error.message.includes('429')) {
          errorContent = '⚠️ Rate limit exceeded. Please wait a moment and try again.'
        } else if (error.message.includes('timeout') || error.message.includes('504')) {
          errorContent = '⚠️ Request timeout. The AI took too long to respond. Please try again.'
        } else if (error.message.includes('authentication') || error.message.includes('401')) {
          errorContent = '⚠️ Authentication error. Please check your API key configuration.'
        } else {
          errorContent = `⚠️ ${error.message || 'An unexpected error occurred. Please try again.'}`
        }
      }

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: errorContent,
        timestamp: new Date(),
      }

      setMessages((prev) => prev.filter((m) => m.id !== 'typing').concat(errorMessage))
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const quickActions = [
    { label: 'Basic Greetings', prompt: 'Teach me basic Japanese greetings' },
    { label: 'Grammar Help', prompt: 'Explain Japanese particles to me' },
    { label: 'Kanji Practice', prompt: 'Help me practice basic kanji' },
    { label: 'Daily Phrases', prompt: 'Teach me useful daily phrases' },
  ]

  return (
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header with Icon */}
      <div className="mb-7 animate-fade-in">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[3px] shadow-2xl">
          <div className="relative bg-white dark:bg-gray-900 rounded-[calc(1.5rem-3px)] p-7">
            <div className="flex items-start gap-5">
              {/* AI Avatar */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 rounded-2xl shadow-2xl flex items-center justify-center animate-pulse-glow">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-3 border-white dark:border-gray-900 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Header Content */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    <span className="holographic">AI</span> Chat Assistant
                  </h1>
                  <span className="px-2 py-1 text-xs font-bold bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-full shadow-lg">
                    LIVE
                  </span>
                </div>
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Practice Japanese with your{' '}
                  <span className="font-bold gradient-text">AI-powered Sensei</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Grammar Help
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Conversation Practice
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-lg text-xs font-semibold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Instant Feedback
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="relative animate-slide-up">
        {/* Enhanced Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 rounded-3xl"></div>
        <div className="absolute inset-0 cyber-grid opacity-5 rounded-3xl"></div>

        <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Chat Messages Area */}
          <div className="h-[495px] overflow-y-auto p-5 sm:p-7 space-y-5 custom-scrollbar">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className={`flex gap-2 max-w-[85%] sm:max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl shadow-lg flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600'
                          : 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 animate-pulse-glow'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <span className="text-white text-xs sm:text-sm font-bold">AI</span>
                      )}
                    </div>
                  </div>

                  {/* Message Bubble */}
                  <div className="flex-1">
                    {/* Name and Time */}
                    <div
                      className={`flex items-center gap-1 mb-1 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                        {message.role === 'user' ? 'You' : 'AI Sensei'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Message Content */}
                    <div
                      className={`relative rounded-2xl shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                          : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      {/* Decorative Corner */}
                      <div
                        className={`absolute ${message.role === 'user' ? '-right-1 top-4' : '-left-1 top-4'} w-4 h-4 ${
                          message.role === 'user'
                            ? 'bg-purple-600'
                            : 'bg-white dark:bg-gray-800 border-l-2 border-t-2 border-gray-200 dark:border-gray-700'
                        } transform rotate-45`}
                      ></div>

                      <div className="p-3 sm:p-4">
                        {message.isTyping ? (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <span
                                className="w-2.5 h-2.5 bg-cyan-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0ms' }}
                              ></span>
                              <span
                                className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"
                                style={{ animationDelay: '150ms' }}
                              ></span>
                              <span
                                className="w-2.5 h-2.5 bg-pink-400 rounded-full animate-bounce"
                                style={{ animationDelay: '300ms' }}
                              ></span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              AI is thinking...
                            </span>
                          </div>
                        ) : (
                          <p
                            className={`text-sm sm:text-base leading-relaxed whitespace-pre-wrap ${
                              message.role === 'user'
                                ? 'text-white'
                                : 'text-gray-800 dark:text-gray-200'
                            }`}
                          >
                            {message.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Enhanced Quick Actions */}
          {messages.length === 1 && (
            <div className="px-5 sm:px-7 py-4 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-gray-800/50 dark:to-indigo-900/30">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  className="w-4 h-4 text-indigo-600 dark:text-indigo-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  Quick Start Topics:
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={action.label}
                    onClick={() => setInput(action.prompt)}
                    className={`group relative overflow-hidden px-4 py-2 rounded-xl font-semibold text-left transition-all hover:scale-105 hover:shadow-xl ${
                      index === 0
                        ? 'bg-gradient-to-br from-indigo-500 to-blue-600'
                        : index === 1
                          ? 'bg-gradient-to-br from-purple-500 to-pink-600'
                          : index === 2
                            ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                            : 'bg-gradient-to-br from-orange-500 to-red-600'
                    } text-white shadow-lg`}
                  >
                    <div className="relative flex items-center gap-2">
                      <span className="text-xl">
                        {index === 0 ? '👋' : index === 1 ? '📚' : index === 2 ? '✍️' : '💬'}
                      </span>
                      <span className="text-sm sm:text-base">{action.label}</span>
                    </div>
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Enhanced Input Area */}
          <div className="p-5 sm:p-7 border-t-2 border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <div className="flex gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here... (Press Enter to send, Shift+Enter for new line)"
                    className="w-full p-3 sm:p-4 pr-12 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-500 dark:focus:border-indigo-400 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none transition-all focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/50 shadow-lg text-sm sm:text-base"
                    rows={3}
                    disabled={isLoading}
                  />
                  {/* Emoji Button */}
                  <button
                    onClick={() => {
                      if (inputRef.current) {
                        const cursorPos = inputRef.current.selectionStart
                        const textBefore = input.substring(0, cursorPos)
                        const textAfter = input.substring(cursorPos)
                        setInput(`${textBefore}🇯🇵${textAfter}`)
                      }
                    }}
                    className="absolute right-3 top-3 w-9 h-9 flex items-center justify-center text-xl hover:scale-110 transition-transform bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                    title="Add Japanese flag emoji"
                  >
                    🇯🇵
                  </button>
                </div>

                {/* Character Counter and Hints */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Pro tip: Ask me anything about Japanese!</span>
                  </div>
                  <div
                    className={`text-xs font-medium ${input.length > 450 ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}
                  >
                    {input.length} / 500
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center ${
                  !input.trim() || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 hover:shadow-2xl hover:scale-105 hover:from-indigo-600 hover:to-purple-700'
                }`}
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 p-7 text-center animate-slide-up stagger-1 hover:shadow-2xl transition-all hover:scale-105 border-2 border-cyan-200 dark:border-cyan-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="relative">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Natural Conversations
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Practice realistic Japanese dialogues with context-aware responses and cultural
              insights
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-7 text-center animate-slide-up stagger-2 hover:shadow-2xl transition-all hover:scale-105 border-2 border-purple-200 dark:border-purple-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all"></div>
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-purple-400 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Smart Learning</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              AI adapts to your level and learning style automatically for optimal progress
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-7 text-center animate-slide-up stagger-3 hover:shadow-2xl transition-all hover:scale-105 border-2 border-green-200 dark:border-green-800">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
          <div className="relative">
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">24/7 Available</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              Practice anytime, anywhere with instant feedback and personalized corrections
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
