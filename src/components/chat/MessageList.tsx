'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  useSocketConnection,
  useChatMessages,
  useTypingIndicators,
} from '@/lib/websocket/socket-client'
import MessageItem from './MessageItem'
import TypingIndicator from './TypingIndicator'
import { User } from '@/lib/websocket/types'

interface MessageListProps {
  currentUser: User
  onReply: (message: any) => void
  selectedThread?: string
}

export default function MessageList({ currentUser, onReply, selectedThread }: MessageListProps) {
  const { messages } = useChatMessages()
  const { isConnected } = useSocketConnection()
  const { typingUsers } = useTypingIndicators()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [autoScroll, setAutoScroll] = useState(true)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'instant',
      })
    }
  }, [])

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    const isBottom = Math.abs(scrollTop + clientHeight - scrollHeight) < 100

    setIsAtBottom(isBottom)
    setShowScrollButton(!isBottom && scrollTop > 500)

    if (isBottom) {
      setAutoScroll(true)
    } else if (scrollTop < scrollHeight - clientHeight - 200) {
      setAutoScroll(false)
    }
  }, [])

  const handleCopy = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content)
      // You can add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }, [])

  const handleShare = useCallback(async (message: any) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'メッセージを共有',
          text: message.content,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(message.content)
        // You can add a toast notification here
      }
    } catch (error) {
      console.error('Failed to share message:', error)
    }
  }, [])

  const handleReact = useCallback(async (messageId: string, emoji: string) => {
    try {
      // React to message - implementation would go here
      console.log(`Reacted with ${emoji} on message ${messageId}`)
    } catch (error) {
      console.error('Failed to react to message:', error)
    }
  }, [])

  const handleReport = useCallback(async (messageId: string) => {
    try {
      // Report message - implementation would go here
      console.log(`Reported message ${messageId}`)
    } catch (error) {
      console.error('Failed to report message:', error)
    }
  }, [])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && messages.length > 0) {
      scrollToBottom()
    }
  }, [messages, autoScroll, scrollToBottom])

  // Initial scroll to bottom with delay for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom(false)
    }, 100)
    return () => clearTimeout(timer)
  }, [scrollToBottom])

  const filteredMessages = selectedThread
    ? messages.filter((msg) => msg.parentId === selectedThread || msg.id === selectedThread)
    : messages.filter((msg) => !msg.parentId)

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 flex items-center justify-center bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-900/50 dark:to-gray-800/50 backdrop-blur-sm"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-12 h-12 border-4 border-gray-300 dark:border-gray-600 border-t-blue-500 rounded-full mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">接続中...</h3>
          <p className="text-gray-600 dark:text-gray-400">チャットに接続しています</p>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Messages Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="h-full overflow-y-auto overflow-x-hidden scroll-smooth"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#888 #f1f1f1',
        }}
      >
        <div className="min-h-full flex flex-col p-4 md:p-6">
          {/* Welcome Message */}
          {filteredMessages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 flex items-center justify-center"
            >
              <div className="text-center max-w-md mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.5 }}
                  className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl"
                >
                  <span className="text-white text-2xl">💬</span>
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  ようこそ！
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  日本語学習の旅を始めましょう！何か質問があれば、お気軽にお聞きください。
                </p>
              </div>
            </motion.div>
          )}

          {/* Messages */}
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {filteredMessages.map((message, index) => (
                <MessageItem
                  key={message.id}
                  message={message}
                  isOwnMessage={message.sender.id === currentUser.id}
                  onReply={onReply}
                  onReact={handleReact}
                  onCopy={handleCopy}
                  onShare={handleShare}
                  onReport={handleReport}
                  currentUser={currentUser}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Typing Indicators */}
          <AnimatePresence>
            {typingUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="mt-4"
              >
                <TypingIndicator typingUsers={typingUsers} currentUser={currentUser} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll to Bottom Button */}
          <AnimatePresence>
            {showScrollButton && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToBottom()}
                className="fixed bottom-20 right-6 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-10"
              >
                <span className="text-lg">⬇️</span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Connection Status Indicator */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: isConnected ? 0 : 1, x: isConnected ? -50 : 16 }}
        className="fixed top-4 left-4 z-50"
      >
        <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          接続が切れました
        </div>
      </motion.div>
    </div>
  )
}
