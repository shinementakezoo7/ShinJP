'use client'

import { motion } from 'framer-motion'

interface AnimatedBadgeProps {
  text: string
  icon?: React.ReactNode
  variant?: 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const variantStyles = {
  success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
}

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
}

export function AnimatedBadge({
  text,
  icon,
  variant = 'info',
  size = 'md',
  animated = true,
}: AnimatedBadgeProps) {
  return (
    <motion.span
      className={`inline-flex items-center gap-2 rounded-full font-semibold ${variantStyles[variant]} ${sizeStyles[size]}`}
      whileHover={animated ? { scale: 1.08 } : undefined}
      transition={animated ? { type: 'spring', stiffness: 400, damping: 30 } : undefined}
    >
      {icon && <span>{icon}</span>}
      {text}
    </motion.span>
  )
}
