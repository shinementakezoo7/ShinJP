'use client'

import { useState } from 'react'

interface EnhancedMessageProps {
  message: {
    id: string
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: Date
    isTyping?: boolean
    status?: 'sending' | 'sent' | 'delivered' | 'read'
    reaction?: string | null
    translation?: string
  }
  showTranslation?: boolean
  onCopy?: (content: string) => void
  onSpeak?: (content: string) => void
  onReaction?: (id: string, reaction: string) => void
}

export default function EnhancedMessage({
  message,
  showTranslation = false,
  onCopy,
  onSpeak,
  onReaction,
}: EnhancedMessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [showReactions, setShowReactions] = useState(false)

  const messageReactions = ['👍', '❤️', '🎉', '🤔', '😊', '🔥', '✨', '🙏']

  const handleCopy = () => {
    onCopy?.(message.content)
  }

  const handleSpeak = () => {
    onSpeak?.(message.content)
  }

  const handleReaction = (reaction: string) => {
    onReaction?.(message.id, reaction)
  }

  return (
    <div
      className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {message.role === 'assistant' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform cursor-pointer group">
          👘
          <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse top-0 right-0 group-hover:scale-125 transition-transform"></div>
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
          {/* Floating Action Buttons */}
          <div
            className={`absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2 z-10 ${
              showActions ? 'opacity-100' : ''
            }`}
          >
            <button
              onClick={handleCopy}
              className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group-hover:translate-y-0 translate-y-2"
              title="Copy message"
            >
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform"
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
              onClick={handleSpeak}
              className="w-8 h-8 bg-white dark:bg-gray-700 rounded-full shadow-lg hover:scale-110 transition-transform flex items-center justify-center group-hover:translate-y-0 translate-y-2"
              title="Read aloud"
            >
              <svg
                className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform"
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
              <p className="text-base leading-relaxed animate-fade-in">{message.content}</p>

              {/* Translation */}
              {showTranslation && message.translation && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 italic bg-gray-50/50 dark:bg-gray-900/50 rounded-lg p-3">
                  {message.translation}
                </div>
              )}
            </>
          )}

          {/* Reactions */}
          <div
            className={`flex gap-1 mt-3 transition-all duration-200 ${
              showReactions ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0'
            } overflow-hidden`}
          >
            {messageReactions.map((reaction, idx) => (
              <button
                key={idx}
                className={`text-lg hover:scale-125 transition-transform duration-200 ${
                  message.reaction === reaction
                    ? 'ring-2 ring-red-500 rounded-full bg-red-500/20'
                    : ''
                }`}
                onClick={() => handleReaction(reaction)}
                title={reaction}
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>

        {/* Message Footer */}
        <div
          className={`flex items-center gap-3 mt-2 justify-between ${
            message.role === 'user' ? 'justify-end' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>

            {/* Status Indicator */}
            {message.role === 'user' && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-blue-600 dark:text-blue-400 capitalize">
                  {message.status || 'sent'}
                </span>
              </div>
            )}
          </div>

          {/* Quick Reaction Bar */}
          <div
            className={`flex gap-1 transition-all duration-200 ${
              showActions ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {messageReactions.slice(0, 3).map((reaction, idx) => (
              <button
                key={idx}
                className="text-lg hover:scale-125 transition-transform bg-white/80 dark:bg-gray-700/80 rounded-full px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30"
                onClick={() => handleReaction(reaction)}
                title={`Add ${reaction} reaction`}
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>
      </div>

      {message.role === 'user' && (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-lg shadow-lg hover:scale-110 transition-transform cursor-pointer group">
          🙋
          <div className="absolute w-3 h-3 bg-green-400 rounded-full animate-pulse top-0 right-0 group-hover:scale-125 transition-transform"></div>
        </div>
      )}
    </div>
  )
}
