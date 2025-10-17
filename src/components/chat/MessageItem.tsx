'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { format, formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'
import { User, Message } from '@/lib/websocket/types'
import { useSocketConnection, useChatMessages } from '@/lib/websocket/socket-client'
import MessageThread from './MessageThread'
import TypingIndicator from './TypingIndicator'
import Image from 'next/image'
import { MoreVertical, Reply, Heart, ThumbsUp, Laugh, Copy, Share, Flag } from 'lucide-react'

interface MessageItemProps {
  message: Message
  isOwnMessage: boolean
  onReply: (message: Message) => void
  onReact: (messageId: string, emoji: string) => void
  onCopy: (content: string) => void
  onShare: (message: Message) => void
  onReport: (messageId: string) => void
  currentUser: User
}

const MessageItem = React.memo(
  ({
    message,
    isOwnMessage,
    onReply,
    onReact,
    onCopy,
    onShare,
    onReport,
    currentUser,
  }: MessageItemProps) => {
    const [showActions, setShowActions] = useState(false)
    const [showReactionPicker, setShowReactionPicker] = useState(false)
    const messageRef = useRef<HTMLDivElement>(null)

    const quickReactions = ['👍', '❤️', '😂', '😮', '😢', '🔥']

    const handleMouseEnter = useCallback(() => setShowActions(true), [])
    const handleMouseLeave = useCallback(() => {
      setShowActions(false)
      setShowReactionPicker(false)
    }, [])

    const handleCopy = useCallback(() => {
      onCopy(message.content)
      setShowActions(false)
    }, [message.content, onCopy])

    const handleReply = useCallback(() => {
      onReply(message)
      setShowActions(false)
    }, [message, onReply])

    const handleShare = useCallback(() => {
      onShare(message)
      setShowActions(false)
    }, [message, onShare])

    const handleReport = useCallback(() => {
      onReport(message.id)
      setShowActions(false)
    }, [message.id, onReport])

    const handleReaction = useCallback(
      (emoji: string) => {
        onReact(message.id, emoji)
        setShowReactionPicker(false)
        setShowActions(false)
      },
      [message.id, onReact]
    )

    return (
      <motion.div
        ref={messageRef}
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.9 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 25,
          duration: 0.3,
        }}
        className={`group relative flex gap-3 p-4 rounded-2xl transition-all duration-200 ${
          isOwnMessage
            ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-blue-500/30 ml-auto max-w-2xl'
            : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 max-w-2xl'
        }`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative">
            {message.sender.avatar ? (
              <Image
                src={message.sender.avatar}
                alt={message.sender.name}
                width={40}
                height={40}
                className="rounded-full object-cover ring-2 ring-white/50 dark:ring-gray-800/50"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                {message.sender.name.charAt(0).toUpperCase()}
              </div>
            )}
            {message.sender.status === 'online' && (
              <motion.div
                layoutId={`status-${message.sender.id}`}
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </motion.div>
        </div>

        {/* Message Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-gray-900 dark:text-white text-sm">
              {message.sender.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(message.timestamp), {
                addSuffix: true,
                locale: ja,
              })}
            </span>
            {message.editedAt && (
              <span className="text-xs text-gray-400 dark:text-gray-500">(編集済)</span>
            )}
          </div>

          <motion.div
            className={`text-gray-800 dark:text-gray-200 leading-relaxed text-sm md:text-base ${
              message.type === 'emoji' ? 'text-2xl' : ''
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {message.content}
          </motion.div>

          {/* File Attachment */}
          {message.file && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">📄</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {message.file.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {(message.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => window.open(message.file?.url, '_blank')}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  開く
                </button>
              </div>
            </motion.div>
          )}

          {/* Message Thread */}
          {message.threadCount && message.threadCount > 0 && (
            <MessageThread messageId={message.id} threadCount={message.threadCount} />
          )}

          {/* Reactions */}
          <AnimatePresence>
            {Object.keys(message.reactions).length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                className="flex gap-1 mt-2"
              >
                {Object.entries(message.reactions).map(([emoji, userIds]) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReaction(emoji)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm transition-all ${
                      userIds.includes(currentUser.id)
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'bg-gray-100/80 dark:bg-gray-700/80 text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="text-xs font-medium">{userIds.length}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions Menu */}
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              className="absolute top-4 right-4 flex gap-1"
            >
              {/* Quick Reactions */}
              <div className="flex gap-1">
                {quickReactions.slice(0, 3).map((emoji) => (
                  <motion.button
                    key={emoji}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReaction(emoji)}
                    className="w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-xs"
                  >
                    {emoji}
                  </motion.button>
                ))}
              </div>

              {/* Actions Dropdown */}
              <div className="relative group">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowReactionPicker(!showReactionPicker)}
                  className="w-7 h-7 rounded-full bg-white/80 dark:bg-gray-800/80 border border-gray-200/50 dark:border-gray-700/50 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center text-gray-600 dark:text-gray-300"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>

                {/* Extended Menu */}
                <AnimatePresence>
                  {showReactionPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className="absolute top-full right-0 mt-2 w-48 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-2 z-50"
                    >
                      {/* Reaction Picker */}
                      <div className="px-3 py-2 border-b border-gray-200/50 dark:border-gray-700/50">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                          リアクション
                        </p>
                        <div className="flex gap-1 flex-wrap">
                          {quickReactions.concat(['🎉', '👏', '🔥', '💯']).map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => handleReaction(emoji)}
                              className="w-8 h-8 rounded-lg hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors flex items-center justify-center"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Action Items */}
                      <div className="py-1">
                        <button
                          onClick={handleReply}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-200"
                        >
                          <Reply className="w-4 h-4" />
                          返信する
                        </button>
                        <button
                          onClick={handleCopy}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-200"
                        >
                          <Copy className="w-4 h-4" />
                          コピー
                        </button>
                        <button
                          onClick={handleShare}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors text-sm text-gray-700 dark:text-gray-200"
                        >
                          <Share className="w-4 h-4" />
                          共有
                        </button>
                        <button
                          onClick={handleReport}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-red-500/10 text-red-600 dark:text-red-400 transition-colors text-sm"
                        >
                          <Flag className="w-4 h-4" />
                          通報
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }
)

MessageItem.displayName = 'MessageItem'

export default MessageItem
