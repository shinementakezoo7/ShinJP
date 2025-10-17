'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TypingIndicator } from '@/lib/websocket/types'

interface TypingIndicatorProps {
  typingUsers: TypingIndicator[]
  currentUser: any
}

export default function TypingIndicator({ typingUsers, currentUser }: TypingIndicatorProps) {
  if (typingUsers.length === 0) return null

  const otherTypingUsers = typingUsers.filter((user) => user.userId !== currentUser.id)

  if (otherTypingUsers.length === 0) return null

  const getTypingText = () => {
    if (otherTypingUsers.length === 1) {
      return '入力中...'
    } else if (otherTypingUsers.length === 2) {
      return '複数人が入力中...'
    } else {
      return `${otherTypingUsers.length}人が入力中...`
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 px-4 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
    >
      {/* Typing Animation Dots */}
      <div className="flex gap-1">
        <motion.span
          animate={{ opacity: [1, 0.3, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
          className="w-2 h-2 bg-blue-500 rounded-full"
        />
        <motion.span
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
          className="w-2 h-2 bg-blue-500 rounded-full"
        />
        <motion.span
          animate={{ opacity: [0.3, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
          className="w-2 h-2 bg-blue-500 rounded-full"
        />
      </div>

      {/* Text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-sm text-gray-600 dark:text-gray-400 font-medium"
      >
        {getTypingText()}
      </motion.span>

      {/* User Avatar Indicators */}
      {otherTypingUsers.length <= 3 && (
        <div className="flex -space-x-1">
          {otherTypingUsers.slice(0, 3).map((user, index) => (
            <motion.div
              key={user.userId}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold"
            >
              {user.userId.charAt(0).toUpperCase()}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
