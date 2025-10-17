'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface EnhancedSectionCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  animate?: boolean
}

export function EnhancedSectionCard({
  children,
  className = '',
  glowColor = 'from-blue-500/20 to-purple-500/20',
  animate = true,
}: EnhancedSectionCardProps) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={animate ? { once: true } : undefined}
      transition={animate ? { duration: 0.6 } : undefined}
      className={`relative p-6 sm:p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 group ${className}`}
    >
      {/* Glow effect on hover */}
      <div
        className={`absolute -inset-1 bg-gradient-to-br ${glowColor} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10`}
      />
      {children}
    </motion.div>
  )
}
