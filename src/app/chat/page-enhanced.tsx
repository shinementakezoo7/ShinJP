'use client'

import { useEffect, useRef, useState } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  isTyping?: boolean
  tokens?: number
}

export default function EnhancedChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [scrollToBottom])

  useEffect(() => {
    // Initialize with welcome message
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `こんにちは! Welcome to your Japanese learning journey! 🌸

I&apos;m Sensei Sakura, your AI-powered Japanese instructor. I&apos;m here to guide you through every aspect of the Japanese language with patience and expertise.

**What I can help you with:**
• **Grammar (文法)** - From particles to complex sentence structures
• **Vocabulary (語彙)** - Build your word bank systematically 
• **Kanji (漢字)** - Master characters with mnemonics and patterns
• **Conversation (会話)** - Practice natural Japanese expressions
• **Culture (文化)** - Understand context and etiquette
• **JLPT Preparation** - Focused study for all levels (N5-N1)

I teach in English while introducing Japanese gradually. Every explanation comes with romaji, translations, and practical examples.

How can I assist you today? 頑張りましょう！(Let's do our best!)`,
        timestamp: new Date(),
      },
    ])
  }, [])

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
    setShowQuickPrompts(false)

    // Typing indicator
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
        throw new Error(`Server error ${response.status}`)
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
      console.error('Error:', error)

      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'ごめんなさい (I&apos;m sorry), I encountered an error. Please try again.',
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

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const quickPrompts = [
    { emoji: '🌸', text: 'Teach me basic greetings', category: 'Basics', kanji: '挨拶' },
    { emoji: '📝', text: 'Explain は vs が particles', category: 'Grammar', kanji: '文法' },
    { emoji: '🗾', text: 'Common travel phrases', category: 'Travel', kanji: '旅行' },
    { emoji: '🍜', text: 'Food ordering expressions', category: 'Food', kanji: '料理' },
    { emoji: '💼', text: 'Business Japanese basics', category: 'Business', kanji: '仕事' },
    { emoji: '🎌', text: 'Japanese cultural etiquette', category: 'Culture', kanji: '文化' },
  ]

  return (
    <div className="h-screen flex bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-red-950/10 dark:to-purple-950/10 overflow-hidden relative">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Kanji Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[400px] japanese-text text-red-500/[0.01] dark:text-red-400/[0.02] select-none">
          話
        </div>

        {/* Floating Sakura Petals */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-sakura-float"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${25 + i * 5}s`,
                top: '-50px',
              }}
            >
              <div className="text-4xl opacity-5">🌸</div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white/90 dark:bg-black/50 backdrop-blur-xl border-r-2 border-red-200/30 dark:border-red-800/30 flex flex-col shadow-xl">
        {/* Sidebar Header */}
        <div className="p-6 border-b border-red-200/30 dark:border-red-800/30">
          <h2 className="text-2xl font-bold japanese-text text-red-600 dark:text-red-400 mb-2">
            会話の歴史
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Conversation History</p>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* New Chat Button */}
          <button className="w-full p-4 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Conversation
          </button>

          {/* Previous Conversations */}
          <div className="space-y-2 mt-4">
            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">📚</span>
                <span className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                  Grammar Lesson
                </span>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>

            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🗣️</span>
                <span className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                  Conversation Practice
                </span>
              </div>
              <span className="text-xs text-gray-500">Yesterday</span>
            </div>

            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-800 cursor-pointer transition-all group">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">✍️</span>
                <span className="font-medium text-sm text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400">
                  Kanji Study
                </span>
              </div>
              <span className="text-xs text-gray-500">2 days ago</span>
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-red-200/30 dark:border-red-800/30">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold">
              S
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900 dark:text-white">Student</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Level N3 • 7 Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative">
        {/* Chat Header */}
        <div className="bg-white/90 dark:bg-black/50 backdrop-blur-xl border-b-2 border-red-200/30 dark:border-red-800/30 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Sensei Avatar */}
              <div className="relative">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 shadow-xl flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl">👘</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
              </div>

              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="japanese-text text-red-600 dark:text-red-400">桜先生</span>
                  <span>Sensei Sakura</span>
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Expert Japanese Instructor • Always Here to Help
                </p>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-medium flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
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
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Quick Prompts */}
            {showQuickPrompts && messages.length === 1 && (
              <div className="mb-8 animate-fade-in">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    <span className="japanese-text text-red-600 dark:text-red-400">
                      始めましょう
                    </span>{' '}
                    Let&apos;s Begin!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Choose a topic or type your own question
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickPrompt(prompt.text)}
                      className="group relative overflow-hidden rounded-xl bg-white/80 dark:bg-black/40 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 text-left"
                    >
                      {/* Background Kanji */}
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-5xl japanese-text text-gray-200/30 dark:text-gray-800/30 font-black select-none">
                        {prompt.kanji}
                      </div>

                      <div className="relative flex items-start gap-3">
                        <span className="text-2xl flex-shrink-0">{prompt.emoji}</span>
                        <div className="flex-1">
                          <div className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                            {prompt.category}
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {prompt.text}
                          </div>
                        </div>
                        <svg
                          className="w-4 h-4 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors flex-shrink-0 mt-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
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
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div
                  className={`flex gap-3 max-w-[75%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-xl shadow-lg flex items-center justify-center ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600'
                          : 'bg-gradient-to-br from-red-500 via-pink-600 to-purple-600'
                      }`}
                    >
                      {message.role === 'user' ? (
                        <span className="text-xl">🙋</span>
                      ) : (
                        <span className="text-xl">👘</span>
                      )}
                    </div>
                  </div>

                  {/* Message Content */}
                  <div className="flex-1">
                    {/* Name and Time */}
                    <div
                      className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        {message.role === 'user' ? 'You' : 'Sensei Sakura'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl shadow-md ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white'
                          : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      <div className="p-4">
                        {message.isTyping ? (
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                              <span
                                className="w-2 h-2 bg-red-400 rounded-full animate-bounce"
                                style={{ animationDelay: '0ms' }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                                style={{ animationDelay: '150ms' }}
                              ></span>
                              <span
                                className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                                style={{ animationDelay: '300ms' }}
                              ></span>
                            </div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              Sensei is thinking...
                            </span>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </div>
                        )}
                      </div>

                      {/* Message Status (for user messages) */}
                      {message.role === 'user' && !message.isTyping && (
                        <div className="px-4 pb-2 flex justify-end">
                          <svg
                            className="w-4 h-4 text-white/70"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-white/90 dark:bg-black/50 backdrop-blur-xl border-t-2 border-red-200/30 dark:border-red-800/30 p-6">
          <div className="max-w-4xl mx-auto">
            {/* Input Container */}
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Press Enter to send)"
                className="w-full p-4 pr-14 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 focus:border-red-500 dark:focus:border-red-400 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 resize-none transition-all focus:outline-none focus:ring-4 focus:ring-red-500/20 shadow-sm"
                rows={3}
                disabled={isLoading}
              />

              {/* Send Button */}
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={`absolute bottom-4 right-4 w-10 h-10 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center ${
                  !input.trim() || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-br from-red-500 to-pink-600 hover:shadow-xl hover:scale-105'
                }`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

            {/* Helpful Tips */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  Sensei explains in{' '}
                  <span className="text-green-600 dark:text-green-400 font-semibold">English</span>{' '}
                  with{' '}
                  <span className="text-red-600 dark:text-red-400 font-semibold japanese-text">
                    日本語
                  </span>{' '}
                  examples
                </span>
              </div>
              <span
                className={`font-semibold ${input.length > 450 ? 'text-red-500' : 'text-gray-500'}`}
              >
                {input.length} / 500
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
