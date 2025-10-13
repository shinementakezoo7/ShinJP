'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface EnhancedBackButtonProps {
  href?: string
  label?: string
  className?: string
  variant?: 'default' | 'floating' | 'minimal'
}

export default function EnhancedBackButton({
  href,
  label = 'Back',
  className = '',
  variant = 'default',
}: EnhancedBackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const baseStyles = {
    default:
      'inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold shadow-lg hover:shadow-xl border-2 border-gray-200 dark:border-gray-700',
    floating:
      'fixed bottom-8 left-8 z-50 flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-2xl',
    minimal:
      'inline-flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium',
  }

  return (
    <motion.button
      onClick={handleBack}
      className={`${baseStyles[variant]} ${className} transition-all duration-300 hover:scale-105`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        whileHover={{ x: -3 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </motion.svg>
      <span>{label}</span>
    </motion.button>
  )
}
