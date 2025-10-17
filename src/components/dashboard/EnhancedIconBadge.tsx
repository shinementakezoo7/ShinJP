'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface EnhancedIconBadgeProps {
  icon: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  gradient: string
  shadow?: boolean
  animated?: boolean
  rotate?: boolean
  className?: string
}

const sizeClasses = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-16 h-16 text-3xl',
  xl: 'w-20 h-20 text-4xl',
}

export function EnhancedIconBadge({
  icon,
  size = 'md',
  gradient,
  shadow = true,
  animated = true,
  rotate = true,
  className = '',
}: EnhancedIconBadgeProps) {
  const iconVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    hover: {
      scale: 1.15,
      rotate: rotate ? 12 : 0,
      transition: {
        type: 'spring',
        stiffness: 500,
        damping: 35,
      },
    },
  }

  return (
    <motion.div
      className={`rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center ${sizeClasses[size]} ${shadow ? 'shadow-lg' : ''} group-hover:shadow-xl transition-shadow duration-300 flex-shrink-0 ${className}`}
      initial="idle"
      whileHover={animated ? 'hover' : 'idle'}
      variants={animated ? iconVariants : undefined}
    >
      {icon}
    </motion.div>
  )
}
