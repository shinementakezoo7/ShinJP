'use client'

import EnhancedAIConfig from '@/components/config/EnhancedAIConfig'
import { motion } from 'framer-motion'

export default function AIConfigPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      <EnhancedAIConfig />
    </div>
  )
}
