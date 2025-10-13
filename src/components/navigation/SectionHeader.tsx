'use client'

import { motion } from 'framer-motion'
import EnhancedBackButton from './EnhancedBackButton'

interface SectionHeaderProps {
  title: string
  titleJP?: string
  subtitle?: string
  icon?: string
  backHref?: string
  backLabel?: string
  children?: React.ReactNode
  gradient?: string
}

export default function SectionHeader({
  title,
  titleJP,
  subtitle,
  icon,
  backHref,
  backLabel = 'Back',
  children,
  gradient = 'from-purple-600 to-pink-600',
}: SectionHeaderProps) {
  return (
    <motion.div
      className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Back Button */}
          {backHref && <EnhancedBackButton href={backHref} label={backLabel} />}

          {/* Title Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3">
              {icon && (
                <motion.span
                  className="text-4xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {icon}
                </motion.span>
              )}
              <div className="flex-1">
                <h1
                  className={`text-2xl sm:text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                >
                  {title}
                  {titleJP && (
                    <span className="ml-3 japanese-text text-xl text-gray-600 dark:text-gray-400">
                      {titleJP}
                    </span>
                  )}
                </h1>
                {subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
                )}
              </div>
            </div>
          </div>

          {/* Optional Right Content */}
          {children && <div className="flex items-center gap-3">{children}</div>}
        </div>
      </div>
    </motion.div>
  )
}
