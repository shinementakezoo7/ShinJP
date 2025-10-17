'use client'

import { motion } from 'framer-motion'

interface EnhancedSectionHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  gradient?: string
  align?: 'left' | 'center'
}

export function EnhancedSectionHeader({
  title,
  subtitle,
  icon,
  gradient = 'from-blue-500 to-purple-600',
  align = 'left',
}: EnhancedSectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex items-center gap-4 mb-6 ${align === 'center' ? 'justify-center text-center' : ''}`}
    >
      {icon && (
        <motion.div
          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          {icon}
        </motion.div>
      )}
      <div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
