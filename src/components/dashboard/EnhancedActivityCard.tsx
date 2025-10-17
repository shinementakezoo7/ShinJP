'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { EnhancedIconBadge } from './EnhancedIconBadge'

interface EnhancedActivityCardProps {
  id: number
  title: string
  type: string
  score?: number
  time: string
  icon: ReactNode
  colorGradient: string
  index?: number
  onRetry?: () => void
  onShare?: () => void
}

const colorGradients = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  purple: 'from-purple-500 to-pink-500',
  orange: 'from-orange-500 to-red-500',
}

export function EnhancedActivityCard({
  id,
  title,
  type,
  score,
  time,
  icon,
  colorGradient,
  index = 0,
  onRetry,
  onShare,
}: EnhancedActivityCardProps) {
  const gradient = colorGradients[colorGradient as keyof typeof colorGradients] || colorGradient

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="flex items-center gap-5">
          {/* Icon */}
          <EnhancedIconBadge icon={icon} gradient={gradient} size="lg" />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{title}</h3>
              <motion.span
                className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full whitespace-nowrap"
                whileHover={{ scale: 1.08 }}
              >
                {type}
              </motion.span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              {score && (
                <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.08 }}>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                    <span className="text-white font-black text-sm">{score}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400 font-medium">Score</span>
                </motion.div>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 dark:text-gray-400 font-medium">{time}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onRetry && (
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  onRetry()
                }}
                className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </motion.button>
            )}
            {onShare && (
              <motion.button
                onClick={(e) => {
                  e.preventDefault()
                  onShare()
                }}
                className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
