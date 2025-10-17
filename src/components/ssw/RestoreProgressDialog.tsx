'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'

interface ProgressSummary {
  step: number
  title: string
  sector: string
  sswType: string
  chapters: number
  savedAt: string
}

interface RestoreProgressDialogProps {
  isOpen: boolean
  progress: ProgressSummary | null
  onRestore: () => void
  onDismiss: () => void
  onClear: () => void
}

const RestoreProgressDialog = ({
  isOpen,
  progress,
  onRestore,
  onDismiss,
  onClear,
}: RestoreProgressDialogProps) => {
  const shouldReduceMotion = useReducedMotion()

  if (!isOpen || !progress) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onDismiss}
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-600 flex items-center justify-center">
              <span className="text-lg">🔄</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Restore Progress?</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We found your previous work
              </p>
            </div>
          </div>

          {/* Progress Details */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Title:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {progress.title}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                SSW Type:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {progress.sswType}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sector:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white capitalize">
                {progress.sector?.replace('-', ' ') || 'Not selected'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Chapters:
              </span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {progress.chapters}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Saved:</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {progress.savedAt}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClear}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Clear
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestore}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 rounded-lg transition-all shadow-lg"
            >
              Restore
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default RestoreProgressDialog
