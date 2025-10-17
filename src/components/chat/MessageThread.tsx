'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MessageThreadProps {
  messageId: string
  threadCount: number
  onClick?: () => void
}

export default function MessageThread({ messageId, threadCount, onClick }: MessageThreadProps) {
  if (threadCount === 0) return null

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="mt-3 flex items-center gap-2 px-3 py-2 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 rounded-xl border border-blue-200/50 dark:border-blue-800/50 transition-all duration-200 group"
    >
      <div className="flex items-center gap-1">
        <div className="flex -space-x-1">
          {[...Array(Math.min(threadCount, 3))].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="w-5 h-5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-semibold"
            >
              {index + 1}
            </motion.div>
          ))}
        </div>
        <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
          {threadCount} 件の返信
        </span>
      </div>

      <motion.div
        animate={{ x: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:scale-110"
      />
    </motion.button>
  )
}
