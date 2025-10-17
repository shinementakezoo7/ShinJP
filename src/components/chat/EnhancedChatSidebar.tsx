'use client'

import { useEffect, useState } from 'react'

interface Conversation {
  id: string
  title: string
  message_count: number
  last_message_at: string
  created_at: string
}

interface EnhancedChatSidebarProps {
  currentConversationId: string | null
  onSelectConversation: (id: string) => void
  onNewConversation: () => void
  onDeleteConversation: (id: string) => void
  aiMode?: 'teacher' | 'conversation' | 'grammar'
  energyLevel?: number
}

export default function EnhancedChatSidebar({
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  aiMode = 'teacher',
  energyLevel = 100,
}: EnhancedChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const loadConversations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/chat/conversations?user_id=anonymous')
      const data = await response.json()
      const loadedConversations = data.conversations || []
      setConversations(loadedConversations)
      setFilteredConversations(loadedConversations)
    } catch (error) {
      console.error('Error loading conversations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConversations(conversations)
    } else {
      const filtered = conversations.filter((conv) =>
        conv.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredConversations(filtered)
    }
  }, [searchTerm, conversations])

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()

    if (confirm('Delete this conversation?')) {
      try {
        await fetch(`/api/chat/conversations?id=${id}`, { method: 'DELETE' })
        setConversations((prev) => prev.filter((conv) => conv.id !== id))
        onDeleteConversation(id)
      } catch (error) {
        console.error('Error deleting conversation:', error)
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else if (diffInHours < 168) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  if (isCollapsed) {
    return (
      <div className="w-20 bg-gradient-to-b from-gray-950 to-gray-900 border-r border-gray-700 flex flex-col items-center py-6 gap-4">
        {/* AI Mode Indicator */}
        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center text-lg shadow-lg">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>

        <button
          onClick={() => setIsCollapsed(false)}
          className="w-14 h-14 bg-gradient-to-br from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 rounded-2xl flex items-center justify-center transition-all shadow-lg group"
          title="Expand sidebar"
        >
          <svg
            className="w-6 h-6 text-gray-300 group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </button>
        <button
          onClick={onNewConversation}
          className="w-14 h-14 bg-gradient-to-br from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 rounded-2xl flex items-center justify-center transition-all shadow-lg group"
          title="New chat"
        >
          <svg
            className="w-6 h-6 text-white group-hover:scale-110 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    )
  }

  return (
    <div className="w-80 bg-gradient-to-b from-gray-950 to-gray-900 border-r border-gray-700 flex flex-col">
      {/* Enhanced Header */}
      <div className="p-5 border-b border-gray-700 bg-gradient-to-r from-gray-900/50 to-transparent">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center animate-pulse">
              💬
            </div>
            Conversations
          </h2>
          <button
            onClick={() => setIsCollapsed(true)}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-all group"
            title="Collapse sidebar"
          >
            <svg
              className="w-5 h-5 text-gray-300 group-hover:scale-110 transition-transform"
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

        {/* AI Mode Selector */}
        <div className="mb-5 p-4 bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-2xl border border-red-500/20 backdrop-blur-sm">
          <label className="text-sm font-semibold text-white block mb-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            AI Mode
          </label>
          <select
            value={aiMode}
            className="w-full px-3 py-3 bg-gray-800/80 border border-red-400/40 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 backdrop-blur-sm"
          >
            <option value="teacher" className="bg-gray-900">
              Teacher Mode
            </option>
            <option value="conversation" className="bg-gray-900">
              Conversation Mode
            </option>
            <option value="grammar" className="bg-gray-900">
              Grammar Mode
            </option>
          </select>
          <p className="text-xs text-gray-400 mt-2">
            {aiMode === 'teacher'
              ? 'Structured grammar and vocabulary lessons'
              : aiMode === 'conversation'
                ? 'Natural dialogue practice'
                : 'Detailed grammar explanations'}
          </p>
        </div>

        {/* Search Bar with Enhanced Styling */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-gray-800/60 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm backdrop-blur-sm transition-all"
          />
          <svg
            className="absolute right-4 top-3.5 w-5 h-5 text-gray-400"
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

        <button
          onClick={onNewConversation}
          className="w-full px-5 py-4 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-2xl font-semibold transition-all flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl group"
        >
          <svg
            className="w-5 h-5 group-hover:scale-110 group-hover:rotate-90 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-gray-800 rounded-2xl h-24"></div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-gray-400 text-lg mb-2">No conversations yet</p>
            <p className="text-gray-500 text-sm">
              Start a new chat to begin your Japanese learning journey
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full text-left p-4 rounded-2xl transition-all group ${
                  currentConversationId === conv.id
                    ? 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500/40 shadow-lg'
                    : 'hover:bg-gray-800/60'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-base truncate mb-2 leading-tight">
                      {conv.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {conv.message_count} messages
                      </span>
                      <span>•</span>
                      <span>{formatDate(conv.last_message_at)}</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${Math.min((conv.message_count / 50) * 100, 100)}%` }}
                      ></div>
                    </div>

                    {/* Progress Label */}
                    <div className="text-xs text-gray-500">
                      {conv.message_count} messages •{' '}
                      {Math.min(Math.round((conv.message_count / 50) * 100), 100)}% progress
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(conv.id, e)}
                    className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-red-500/20 hover:bg-red-500 rounded-xl flex items-center justify-center transition-all transform hover:scale-105"
                    title="Delete conversation"
                  >
                    <svg
                      className="w-5 h-5 text-red-400 group-hover:text-white"
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
      <div className="p-5 border-t border-gray-700 space-y-5 bg-gradient-to-r from-gray-900/50 to-transparent">
        {/* Energy Level */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-2xl p-4 border border-yellow-500/20 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-yellow-200">Energy Level</span>
            </div>
            <span className="text-lg font-bold text-yellow-300">{energyLevel}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${energyLevel}%` }}
            ></div>
          </div>
          <p className="text-xs text-yellow-200/70 mt-2">Keep learning to maintain energy!</p>
        </div>

        {/* Teacher Info */}
        <div className="bg-gradient-to-br from-amber-500/10 to-red-500/10 rounded-2xl p-4 border border-amber-500/20 backdrop-blur-sm">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-lg font-bold text-white">先生</span>
            </div>
            <div className="flex-1">
              <div className="text-base font-bold text-white mb-1">Sensei Sakura 桜先生</div>
              <div className="text-sm text-amber-300 font-semibold">AI Language Tutor</div>
            </div>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed">
            Teaching in English with Japanese examples. Available 24/7 to help you master Japanese!
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="bg-gray-800/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">{conversations.length}</div>
            <div className="text-xs text-gray-400">Conversations</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3">
            <div className="text-2xl font-bold text-white">
              {conversations.reduce((sum, conv) => sum + conv.message_count, 0)}
            </div>
            <div className="text-xs text-gray-400">Total Messages</div>
          </div>
        </div>
      </div>
    </div>
  )
}
