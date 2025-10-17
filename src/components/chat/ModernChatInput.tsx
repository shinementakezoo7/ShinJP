'use client'

import React, { useState, useRef, useCallback, useEffect, DragEvent, KeyboardEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useSocketConnection,
  useChatMessages,
  useTypingIndicators,
} from '@/lib/websocket/socket-client'
import { User } from '@/lib/websocket/types'
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  StopCircle,
  Camera,
  Image,
  FileText,
  Reply,
  X,
  PaperPlane,
  Plus,
} from 'lucide-react'

interface ModernChatInputProps {
  currentUser: User
  replyingTo?: any
  onCancelReply: () => void
  onHeightChange?: (height: number) => void
  className?: string
}

interface QuickPrompt {
  icon: string
  text: string
  short: string
  category: 'grammar' | 'vocabulary' | 'kanji' | 'conversation' | 'culture'
}

export default function ModernChatInput({
  currentUser,
  replyingTo,
  onCancelReply,
  onHeightChange,
  className = '',
}: ModernChatInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [showQuickPrompts, setShowQuickPrompts] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadFiles, setUploadFiles] = useState<File[]>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isConnected } = useSocketConnection()
  const { sendMessage } = useChatMessages()
  const { sendTypingIndicator } = useTypingIndicators()

  const isTyping = inputValue.trim().length > 0

  // Quick prompts for Japanese learning
  const quickPrompts: QuickPrompt[] = [
    {
      icon: '📝',
      text: 'Can you explain the difference between は and が?',
      short: 'Particles',
      category: 'grammar',
    },
    {
      icon: '📚',
      text: 'What are the most common JLPT N5 kanji?',
      short: 'Kanji N5',
      category: 'kanji',
    },
    {
      icon: '💬',
      text: 'How do I introduce myself in Japanese?',
      short: 'Self-intro',
      category: 'conversation',
    },
    {
      icon: '🏮',
      text: 'Tell me about Japanese tea ceremony etiquette',
      short: 'Tea ceremony',
      category: 'culture',
    },
  ]

  const emojiCategories = {
    smileys: [
      '😀',
      '😃',
      '😄',
      '😁',
      '😅',
      '😂',
      '🤣',
      '😊',
      '😇',
      '🙂',
      '🙃',
      '😉',
      '😌',
      '😍',
      '🥰',
      '😘',
      '😗',
      '😙',
      '😚',
      '😋',
      '😛',
      '😝',
      '😜',
      '🤪',
      '🤨',
      '🧐',
      '🤓',
      '😎',
      '🤩',
      '🥳',
      '😏',
      '😒',
      '😞',
      '😔',
      '😟',
      '😕',
      '🙁',
      '☹️',
      '😣',
      '😖',
      '😫',
      '😩',
      '🥺',
      '😢',
      '😭',
      '😤',
      '😠',
      '😳',
      '🤯',
      '🥱',
      '😴',
      '🤤',
      '😪',
    ],
    gestures: [
      '👋',
      '🤚',
      '🖐',
      '✋',
      '🙌',
      '👏',
      '🤝',
      '👍',
      '👎',
      '👊',
      '✊',
      '🤛',
      '🤜',
      '🤞',
      '✌️',
      '🤟',
      '🤘',
      '🤙',
      '👌',
      '👈',
      '👉',
      '👆',
      '👇',
      '☝️',
      '✋',
      '🤚',
      '🖖',
      '👐',
    ],
    animals: [
      '🐱',
      '🐶',
      '🐭',
      '🐹',
      '🐰',
      '🦊',
      '🐻',
      '🐼',
      '🐻‍❄️',
      '🐨',
      '🐯',
      '🦁',
      '🐮',
      '🐷',
      '🐽',
      '🐸',
      '🐵',
      '🙈',
      '🙉',
      '🙊',
      '🐒',
      '🐔',
      '🐧',
      '🐦',
      '🐤',
      '🐣',
      '🐥',
      '🦆',
      '🦅',
      '🦉',
      '🦇',
      '🐺',
      '🐗',
      '🐴',
      '🦄',
      '🐝',
      '🐛',
      '🦋',
      '🐌',
      '🐞',
      '🐜',
      '🦗',
      '🕷',
      '🕸',
      '🦂',
      '🐍',
      '🦎',
      '🦖',
      '🦕',
      '🐙',
      '🦑',
      '🦐',
      '🦞',
      '🦀',
      '🐡',
      '🐠',
      '🐟',
      '🐬',
      '🐳',
      '🐋',
      '🦈',
      '🐊',
      '🐅',
      '🐆',
      '🦓',
      '🦍',
      '🦧',
      '🐘',
      '🦛',
      '🦏',
      '🐪',
      '🐫',
      '🦒',
      '🦘',
      '🐃',
      '🐂',
      '🐄',
      '🐎',
      '🐖',
      '🐏',
      '🐑',
      '🦙',
      '🐐',
      '🦌',
      '🐕',
      '🐩',
      '🦮',
      '🐕‍🦺',
      '🐈',
      '🐈‍⬛',
      '🐓',
      '🦃',
      '🦚',
      '🦜',
      '🦢',
      '🦩',
      '🕊',
      '🐇',
      '🦝',
      '🦨',
      '🦡',
      '🦦',
      '🦥',
      '🐁',
      '🐀',
      '🐿',
      '🦔',
    ],
  }

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const newHeight = Math.min(textareaRef.current.scrollHeight, 200)
      textareaRef.current.style.height = `${newHeight}px`
      onHeightChange?.(newHeight)
    }
  }, [onHeightChange])

  // Send message
  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || !isConnected) return

    try {
      await sendMessage(inputValue.trim(), replyingTo ? 'reply' : 'text')
      setInputValue('')
      setUploadFiles([])
      if (replyingTo) {
        onCancelReply()
      }
      // Stop typing indicator
      sendTypingIndicator(false)
      adjustTextareaHeight()
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }, [
    inputValue,
    isConnected,
    replyingTo,
    sendMessage,
    onCancelReply,
    sendTypingIndicator,
    adjustTextareaHeight,
  ])

  // Handle typing
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value)
      adjustTextareaHeight()
    },
    [adjustTextareaHeight]
  )

  // Typing indicator
  useEffect(() => {
    if (isTyping) {
      sendTypingIndicator(true)
      const timer = setTimeout(() => sendTypingIndicator(false), 2000)
      return () => clearTimeout(timer)
    } else {
      sendTypingIndicator(false)
    }
  }, [isTyping, sendTypingIndicator])

  // Keyboard shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      } else if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        setInputValue((prev) => prev + '\n')
        adjustTextareaHeight()
      } else if (e.key === 'Escape') {
        if (replyingTo) {
          onCancelReply()
        }
        setShowEmojiPicker(false)
        setShowQuickPrompts(false)
      }
    },
    [handleSend, replyingTo, onCancelReply, adjustTextareaHeight]
  )

  // File handling
  const handleFileSelect = useCallback((files: FileList | File[]) => {
    const newFiles = Array.from(files).filter((file) => {
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB limit
      const isValidType = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'application/pdf',
        'text/plain',
      ].includes(file.type)
      return isValidSize && isValidType
    })

    setUploadFiles((prev) => [...prev, ...newFiles])
  }, [])

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        handleFileSelect(e.target.files)
      }
    },
    [handleFileSelect]
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)

      if (e.dataTransfer.files) {
        handleFileSelect(e.dataTransfer.files)
      }
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const removeFile = useCallback((index: number) => {
    setUploadFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Quick prompt insertion
  const handleQuickPrompt = useCallback((text: string) => {
    setInputValue(text)
    setShowQuickPrompts(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Emoji insertion
  const insertEmoji = useCallback((emoji: string) => {
    setInputValue((prev) => prev + emoji)
    setShowEmojiPicker(false)
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  // Voice recording (placeholder for actual implementation)
  const startRecording = useCallback(() => {
    setIsRecording(true)
    // Implement actual voice recording here
  }, [])

  const stopRecording = useCallback(() => {
    setIsRecording(false)
    // Implement actual voice recording stop here
  }, [])

  const isSendable = inputValue.trim().length > 0 || uploadFiles.length > 0

  return (
    <div className={`relative ${className}`}>
      {/* Drag & Drop Overlay */}
      <AnimatePresence>
        {isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className="absolute inset-0 z-50 bg-blue-500/10 backdrop-blur-sm rounded-2xl border-2 border-dashed border-blue-500/50 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 mx-auto"
              >
                <Paperclip className="w-8 h-8 text-white" />
              </motion.div>
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-2">
                ファイルをドロップ
              </p>
              <p className="text-sm text-blue-500 dark:text-blue-300">
                画像、PDF、テキストファイルをアップロード
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reply Preview */}
      <AnimatePresence>
        {replyingTo && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="mb-3 p-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <Reply className="w-4 h-4 text-blue-500" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {replyingTo.sender.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  {replyingTo.content}
                </p>
              </div>
              <button
                onClick={onCancelReply}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* File Upload Preview */}
      <AnimatePresence>
        {uploadFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-3 flex gap-2 flex-wrap"
          >
            {uploadFiles.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center">
                  {file.type.startsWith('image/') ? (
                    <Image className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  ) : file.type === 'application/pdf' ? (
                    <FileText className="w-4 h-4 text-red-600" />
                  ) : (
                    <Paperclip className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(0)} KB</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className="flex items-end gap-2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          {/* File Upload */}
          <div className="relative">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf,.txt"
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
            >
              <Paperclip className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Quick Prompts */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQuickPrompts(!showQuickPrompts)}
              className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
            >
              <Plus className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showQuickPrompts && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full left-0 mb-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 z-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      クイックプロンプト
                    </h3>
                    <button
                      onClick={() => setShowQuickPrompts(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {quickPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => handleQuickPrompt(prompt.text)}
                        className="w-full p-3 bg-gray-50/80 dark:bg-gray-700/80 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{prompt.icon}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {prompt.short}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {prompt.text}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-200/50 dark:bg-gray-600/50 px-2 py-1 rounded-full">
                            {prompt.category}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Main Textarea */}
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={isRecording ? '録音中...' : 'メッセージを入力...'}
              disabled={!isConnected || isRecording}
              className="w-full resize-none border-0 focus:outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-base leading-relaxed"
              rows={1}
            />
          </div>

          {/* Emoji Picker */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors rounded-xl hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
            >
              <Smile className="w-5 h-5" />
            </motion.button>

            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-full right-0 mb-2 w-80 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 z-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">絵文字</h3>
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        笑顔
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {emojiCategories.smileys.slice(0, 20).map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => insertEmoji(emoji)}
                            className="w-8 h-8 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                        ジェスチャー
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {emojiCategories.gestures.slice(0, 10).map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => insertEmoji(emoji)}
                            className="w-8 h-8 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center text-lg"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Voice Input */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 transition-colors rounded-xl ${
              isRecording
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
            }`}
          >
            {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          {/* Send Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSend}
            disabled={!isSendable}
            className={`p-3 rounded-xl transition-all duration-200 ${
              isSendable
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isSendable ? 'send' : 'disabled'}
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
              >
                {isSendable ? <PaperPlane className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Character Counter */}
      <AnimatePresence>
        {inputValue.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -bottom-6 right-0 text-xs text-gray-400 dark:text-gray-500"
          >
            {inputValue.length}/1000
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
