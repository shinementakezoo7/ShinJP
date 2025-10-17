'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { EnhancedIconBadge } from './EnhancedIconBadge'

interface EnhancedQuickActionCardProps {
  name: string
  icon: ReactNode
  link: string
  description: string
  gradient: string
  progress: number
  recommended: boolean
  index?: number
}

export function EnhancedQuickActionCard({
  name,
  icon,
  link,
  description,
  gradient,
  progress,
  recommended,
  index = 0,
}: EnhancedQuickActionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.6 + (index ?? 0) * 0.1 }}
    >
      <Link href={link}>
        <div className="group relative cursor-pointer">
          {recommended && (
            <div className="absolute -top-3 -right-3 z-10 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce-slow">
              ⭐ Recommended
            </div>
          )}

          <div className="relative p-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4 mb-4">
              <EnhancedIconBadge icon={icon} gradient={gradient} size="md" />
              <div className="flex-1 min-w-0">
                <motion.h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {name}
                </motion.h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                  {description}
                </p>
              </div>
              <motion.svg
                className="w-6 h-6 text-gray-400 group-hover:translate-x-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
                whileHover={{ x: 3 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </motion.svg>
            </div>

            {/* Progress */}
            {progress > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <span>In Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
