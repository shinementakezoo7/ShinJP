'use client'

import { useRef } from 'react'

interface EnhancedInputProps {
  value: string
  onChange: (value: string) => void
  onSend: () => void
  onVoiceInput?: () => void
  isLoading?: boolean
  isListening?: boolean
  placeholder?: string
  speechSupported?: boolean
  quickPrompts?: Array<{ icon: string; text: string; short: string }>
  onQuickPrompt?: (text: string) => void
}

export default function EnhancedChatInput({
  value,
  onChange,
  onSend,
  onVoiceInput,
  isLoading = false,
  isListening = false,
  placeholder = 'Ask me anything about Japanese...',
  speechSupported = false,
  quickPrompts = [],
  onQuickPrompt,
}: EnhancedInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault()
      onSend()
    }
  }

  const handleHeightChange = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }

  return (
    <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl border-t border-gray-200 dark:border-gray-700 p-4 shadow-sm">
      <div className="max-w-4xl mx-auto">
        {/* Quick Prompts */}
        {quickPrompts.length > 0 && (
          <div className="hidden sm:flex gap-2 mb-3 pb-2 overflow-x-auto">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => onQuickPrompt?.(prompt.text)}
                className="px-3 py-2 rounded-lg bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 text-sm font-semibold text-gray-900 dark:text-white hover:border-red-500 dark:hover:border-red-500 transition-colors whitespace-nowrap hover:scale-105 transform"
                title={prompt.text}
              >
                {prompt.icon} {prompt.short}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          {/* Voice Input Button */}
          {speechSupported && (
            <button
              onClick={onVoiceInput}
              disabled={isLoading}
              className={`p-3 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-600 text-white animate-pulse shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md'
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

          {/* Main Input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => {
                onChange(e.target.value)
                handleHeightChange()
              }}
              onKeyPress={handleKeyPress}
              placeholder={isListening ? 'Listening...' : placeholder}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-base text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors pr-12"
              rows={2}
              disabled={isLoading}
            />

            {/* Character Counter */}
            <div className="absolute right-3 bottom-2 text-xs text-gray-500 dark:text-gray-400">
              {value.length}/1000
            </div>
          </div>

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            className={`px-6 py-3 rounded-xl font-semibold text-white transition-all ${
              !value.trim() || isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-2xl transform hover:scale-105 active:scale-95'
            }`}
            title="Send message"
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

        {/* Status Bar */}
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isListening ? 'bg-red-500 animate-pulse' : 'bg-green-500'
              }`}
            ></span>
            <span>{isListening ? 'Listening...' : 'Teaching in English'}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <span>Press Enter to send</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  )
}
