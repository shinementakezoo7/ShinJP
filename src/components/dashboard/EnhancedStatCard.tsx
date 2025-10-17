'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { EnhancedIconBadge } from './EnhancedIconBadge'

interface EnhancedStatCardProps {
  id: number
  name: string
  value: number | string
  kanji: string
  subtext: string
  link: string
  icon: ReactNode
  color: string
  bgGlow: string
  progress: number
  trend: string
  trendUp: boolean
  index?: number
}

export function EnhancedStatCard({
  id,
  name,
  value,
  kanji,
  subtext,
  link,
  icon,
  color,
  bgGlow,
  progress,
  trend,
  trendUp,
  index = 0,
}: EnhancedStatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={link}>
        <div className="group relative h-full motion-smooth cursor-pointer">
          {/* Glow effect */}
          <div
            className={`absolute -inset-1 ${bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
          />

          <div className="relative h-full p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <EnhancedIconBadge icon={icon} gradient={color} size="lg" />

              {/* Trend Badge */}
              <motion.div
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${trendUp ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}
                whileHover={{ scale: 1.1, y: -2 }}
              >
                <span>{trendUp ? '↑' : '↓'}</span>
                <span>{trend}</span>
              </motion.div>
            </div>

            {/* Value */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-2">
                <motion.span
                  className={`text-5xl font-black bg-gradient-to-br ${color} bg-clip-text text-transparent`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                >
                  {value}
                </motion.span>
                <span className="text-3xl japanese-text text-gray-400 dark:text-gray-500">
                  {kanji}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">{name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{subtext}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                  className={`h-full bg-gradient-to-r ${color} rounded-full`}
                />
              </div>
            </div>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
              <svg
                className="w-6 h-6 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* Background Kanji */}
            <div className="absolute bottom-2 right-2 text-8xl japanese-text text-gray-100 dark:text-gray-800 opacity-50 pointer-events-none select-none font-black">
              {kanji}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
