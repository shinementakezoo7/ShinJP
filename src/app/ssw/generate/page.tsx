'use client'

import SectorPreview from '@/components/ssw/SectorPreview'
import SectorSelector from '@/components/ssw/SectorSelector'
import { SSWFormSkeleton, SSWGenerationProgressSkeleton } from '@/components/ssw/SkeletonLoader'
import { SSW_CONSTANTS } from '@/lib/ssw/constants'
import { SSW_SECTORS } from '@/lib/ssw/sectors-data'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

interface SSWGenerationConfig {
  title: string
  sswType: 'SSW1' | 'SSW2' | 'JFT-Basic'
  targetSector: string
  numberOfChapters: number
  focusAreas: string[]
  includeWorkplaceScenarios: boolean
  includeSafetyVocabulary: boolean
  includeAudio: boolean
  userId?: string
}

export default function GenerateSSWPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [direction, setDirection] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [config, setConfig] = useState<SSWGenerationConfig>({
    title: '',
    sswType: 'SSW1',
    targetSector: '',
    numberOfChapters: SSW_CONSTANTS.VALIDATION.CHAPTERS.DEFAULT,
    focusAreas: [],
    includeWorkplaceScenarios: true,
    includeSafetyVocabulary: true,
    includeAudio: false,
  })

  // Loading state for initial data fetching
  const [initialLoading, setInitialLoading] = useState(true)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState<{
    current: number
    total: number
    message: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Performance optimization: detect reduced motion preference
  const shouldReduceMotion = useReducedMotion()

  // Cleanup ref for aborting fetch requests
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup effect for animations and requests
  useEffect(() => {
    return () => {
      // Abort any ongoing fetch request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  const sswTypes = [
    {
      value: 'SSW1',
      name: 'SSW Type 1',
      level: 'N4 Equivalent',
      description: 'Basic workplace Japanese',
      requirements: 'Basic daily conversations and workplace instructions',
      icon: '🏢',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      value: 'SSW2',
      name: 'SSW Type 2',
      level: 'N3 Equivalent',
      description: 'Advanced workplace communication',
      requirements: 'Complex workplace situations and technical discussions',
      icon: '🎯',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      value: 'JFT-Basic',
      name: 'JFT-Basic',
      level: 'Basic Test',
      description: 'Japan Foundation Test preparation',
      requirements: 'Daily life communication in Japan',
      icon: '📝',
      color: 'from-green-500 to-emerald-600',
    },
  ]

  const handleGenerate = async () => {
    // Enhanced Validation with specific error messages
    if (!config.title.trim()) {
      setError('Please enter a textbook title (minimum 1 character)')
      return
    }

    if (config.title.trim().length < SSW_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH) {
      setError(
        `Textbook title must be at least ${SSW_CONSTANTS.VALIDATION.TITLE.MIN_LENGTH} characters long`
      )
      return
    }

    if (config.title.trim().length > SSW_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH) {
      setError(
        `Textbook title cannot exceed ${SSW_CONSTANTS.VALIDATION.TITLE.MAX_LENGTH} characters`
      )
      return
    }

    if (!config.targetSector) {
      setError('Please select a target sector from the list above')
      return
    }

    // Validate that the selected sector exists in SSW_SECTORS
    const validSector = SSW_SECTORS.find((sector) => sector.id === config.targetSector)
    if (!validSector) {
      setError('Invalid sector selected. Please choose a valid SSW sector.')
      return
    }

    setError(null)
    setGenerating(true)
    setProgress({
      current: 0,
      total: config.numberOfChapters,
      message: 'Starting SSW content generation...',
    })

    // Create abort controller for cleanup
    const abortController = new AbortController()
    abortControllerRef.current = abortController

    try {
      const response = await fetch('/api/textbooks/generate-ssw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
        signal: abortController.signal,
      })

      const data = await response.json()

      if (!response.ok) {
        // Enhanced error handling with user-friendly messages
        let errorMessage = 'Failed to generate textbook'

        if (response.status === 400) {
          errorMessage = data.error || 'Invalid request parameters'
        } else if (response.status === 503) {
          if (data.error?.includes('Supabase')) {
            errorMessage = 'Database service is currently unavailable. Please try again later.'
          } else if (data.error?.includes('NVIDIA API')) {
            errorMessage = 'AI service is currently unavailable. Please try again later.'
          } else {
            errorMessage = 'Service is temporarily unavailable. Please try again later.'
          }
        } else if (response.status === 500) {
          if (data.details?.includes('chapter')) {
            errorMessage = `Textbook generation failed at chapter ${data.completedChapters || 1}. This may be due to temporary AI service issues. Please try again with fewer chapters.`
          } else {
            errorMessage = 'An unexpected error occurred during generation. Please try again.'
          }
        } else if (response.status === 429) {
          errorMessage = 'Too many requests. Please wait a few minutes before trying again.'
        }

        throw new Error(errorMessage)
      }

      // Success!
      setProgress({
        current: config.numberOfChapters,
        total: config.numberOfChapters,
        message: '✨ SSW textbook generated successfully!',
      })

      // Redirect to textbook view after a short delay
      const redirectTimeout = setTimeout(() => {
        router.push(`/books/${data.textbook.id}`)
      }, 2000)

      // Cleanup timeout on unmount
      return () => clearTimeout(redirectTimeout)
    } catch (err) {
      if (abortController.signal.aborted) {
        return // Request was aborted, don't show error
      }

      console.error('Generation error:', err)
      const userFriendlyError =
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please check your internet connection and try again.'

      setError(userFriendlyError)
      setGenerating(false)
      setProgress(null)
    }
  }

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="space-y-8"
    >
      {/* Title Input Section */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wider">
          <span className="mr-2">📖</span>Textbook Title
        </label>
        <div className="relative group">
          <div id="title-help" className="sr-only">
            Enter a descriptive title for your SSW textbook. Minimum 3 characters, maximum 100
            characters.
          </div>
          <input
            type="text"
            id="textbook-title"
            value={config.title}
            onChange={(e) => setConfig({ ...config, title: e.target.value })}
            placeholder="e.g., SSW Caregiving Essential Japanese"
            aria-label="Textbook title"
            aria-describedby="title-help"
            className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 focus:border-blue-500 transition-all text-base placeholder-gray-400 dark:placeholder-gray-500 min-h-[48px]"
          />
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-cyan-600 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
        </div>
      </motion.div>

      {/* SSW Type Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 uppercase tracking-wider">
          <span className="mr-2">🎯</span>SSW Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sswTypes.map((type, index) => (
            <motion.button
              key={type.value}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.2 + index * 0.1,
                duration: shouldReduceMotion ? 0 : 0.3,
              }}
              onClick={() =>
                setConfig({ ...config, sswType: type.value as 'SSW1' | 'SSW2' | 'JFT-Basic' })
              }
              className={`relative overflow-hidden p-6 rounded-2xl border-2 transition-all duration-300 text-left group ${
                config.sswType === type.value
                  ? `border-transparent bg-gradient-to-br ${type.color} text-white shadow-xl`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              {/* Animated background gradient */}
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${type.color}`}
              ></div>

              <div className="relative z-10">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {type.icon}
                </div>
                <div className="font-bold text-lg mb-1">{type.name}</div>
                <div
                  className={`text-xs font-semibold mb-2 ${
                    config.sswType === type.value
                      ? 'text-white/80'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {type.level}
                </div>
                <div
                  className={`text-sm mb-3 ${
                    config.sswType === type.value
                      ? 'text-white/90'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {type.description}
                </div>
                <div
                  className={`text-xs leading-relaxed ${
                    config.sswType === type.value
                      ? 'text-white/70'
                      : 'text-gray-500 dark:text-gray-500'
                  }`}
                >
                  {type.requirements}
                </div>
              </div>

              {/* Selection Indicator */}
              <AnimatePresence>
                {config.sswType === type.value && (
                  <motion.div
                    layoutId="selected-indicator"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                  >
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-4 h-4 text-green-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.3 }}
        className="flex justify-end gap-4 pt-6"
      >
        <button
          onClick={() => {
            setDirection(1)
            setStep(2)
          }}
          disabled={!config.title || !config.sswType}
          className="group relative px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            Continue to Sector
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: 4 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </span>
        </button>
      </motion.div>
    </motion.div>
  )

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="space-y-8"
    >
      {/* Sector Selection */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 uppercase tracking-wider">
          <span className="mr-2">🏭</span>Target Sector
        </label>
        <SectorSelector
          value={config.targetSector}
          onChange={(sector) => setConfig({ ...config, targetSector: sector })}
        />
      </motion.div>

      {/* Number of Chapters */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.2, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-700/30 dark:to-gray-700/20 rounded-2xl p-6">
          <div id="chapters-help" className="sr-only">
            Select the number of chapters for your textbook. Minimum 3 chapters, maximum 20
            chapters.
          </div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              <span className="mr-2">📊</span>Number of Chapters
            </label>
            <motion.span
              key={config.numberOfChapters}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent"
            >
              {config.numberOfChapters}
            </motion.span>
          </div>

          {/* Enhanced Range Slider */}
          <div className="relative">
            <input
              type="range"
              id="chapter-count"
              min={SSW_CONSTANTS.VALIDATION.CHAPTERS.MIN.toString()}
              max={SSW_CONSTANTS.VALIDATION.CHAPTERS.MAX.toString()}
              step="1"
              value={config.numberOfChapters}
              onChange={(e) =>
                setConfig({ ...config, numberOfChapters: parseInt(e.target.value, 10) })
              }
              aria-label="Number of chapters"
              aria-describedby="chapters-help"
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-300 dark:bg-gray-600 accent-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              style={{
                background: `linear-gradient(to right, #3b82f6, #06b6d4 ${((config.numberOfChapters - SSW_CONSTANTS.VALIDATION.CHAPTERS.MIN) / (SSW_CONSTANTS.VALIDATION.CHAPTERS.MAX - SSW_CONSTANTS.VALIDATION.CHAPTERS.MIN)) * 100}%, #d1d5db ${((config.numberOfChapters - SSW_CONSTANTS.VALIDATION.CHAPTERS.MIN) / (SSW_CONSTANTS.VALIDATION.CHAPTERS.MAX - SSW_CONSTANTS.VALIDATION.CHAPTERS.MIN)) * 100}%, #d1d5db 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between text-xs font-semibold text-gray-600 dark:text-gray-400 mt-3">
            <span>3 chapters</span>
            <span>20 chapters</span>
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
            ⏱️ Estimated time:{' '}
            {Math.ceil(
              config.numberOfChapters * SSW_CONSTANTS.LOADING.ESTIMATED_TIME_PER_CHAPTER.MIN
            )}
            -{config.numberOfChapters * SSW_CONSTANTS.LOADING.ESTIMATED_TIME_PER_CHAPTER.MAX}{' '}
            minutes
          </p>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.3, duration: shouldReduceMotion ? 0 : 0.3 }}
        className="flex justify-between gap-4 pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setDirection(-1)
            setStep(1)
          }}
          className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: -4 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </motion.svg>
            Back
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setDirection(1)
            setStep(3)
          }}
          disabled={!config.targetSector}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            Continue to Options
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: 4 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  )

  const renderPreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">📋 Textbook Preview</h3>
        <button
          onClick={() => setShowPreview(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <SectorPreview
        sectorId={config.targetSector}
        sswType={config.sswType}
        numberOfChapters={config.numberOfChapters}
        includeWorkplaceScenarios={config.includeWorkplaceScenarios}
        includeSafetyVocabulary={config.includeSafetyVocabulary}
        includeAudio={config.includeAudio}
      />

      <div className="flex justify-end gap-4 pt-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowPreview(false)
            setDirection(-1)
            setStep(3)
          }}
          className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: -4 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </motion.svg>
            Back to Options
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={generating || !config.title || !config.targetSector}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ rotate: 20 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </motion.svg>
            Generate Textbook
          </span>
        </motion.button>
      </div>
    </motion.div>
  )

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="space-y-8"
    >
      {/* Content Options */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.1, duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        <label className="block text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4 uppercase tracking-wider">
          <span className="mr-2">⚙️</span>Content Options
        </label>
        <div className="space-y-3">
          {[
            {
              key: 'workplaceScenarios',
              icon: '💼',
              title: 'Workplace Scenarios',
              desc: 'Include realistic workplace dialogues and situations',
              checked: config.includeWorkplaceScenarios,
              onChange: (checked: boolean) =>
                setConfig({ ...config, includeWorkplaceScenarios: checked }),
            },
            {
              key: 'safetyVocabulary',
              icon: '⚠️',
              title: 'Safety Vocabulary',
              desc: 'Emphasize safety-critical terminology and procedures',
              checked: config.includeSafetyVocabulary,
              onChange: (checked: boolean) =>
                setConfig({ ...config, includeSafetyVocabulary: checked }),
            },
            {
              key: 'audio',
              icon: '🔊',
              title: 'Audio Generation',
              desc: 'Generate audio pronunciation for key vocabulary',
              checked: config.includeAudio,
              onChange: (checked: boolean) => setConfig({ ...config, includeAudio: checked }),
            },
          ].map((option, index) => (
            <motion.label
              key={option.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.15 + index * 0.1,
                duration: shouldReduceMotion ? 0 : 0.3,
              }}
              whileHover={{ x: 4 }}
              className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${
                option.checked
                  ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <input
                type="checkbox"
                id={`option-${option.key}`}
                checked={option.checked}
                onChange={(e) => option.onChange(e.target.checked)}
                aria-label={option.title}
                className="w-5 h-5 mt-1 text-blue-600 rounded accent-blue-600 flex-shrink-0 cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              />
              <div className="flex-1">
                <div
                  className={`font-semibold mb-1 ${
                    option.checked
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  <span className="mr-2">{option.icon}</span>
                  {option.title}
                </div>
                <div
                  className={`text-sm ${
                    option.checked
                      ? 'text-gray-700 dark:text-gray-300'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {option.desc}
                </div>
              </div>
              <motion.div animate={{ scale: option.checked ? 1.1 : 1 }} className="flex-shrink-0">
                {option.checked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </motion.div>
            </motion.label>
          ))}
        </div>
      </motion.div>

      {/* Summary Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: shouldReduceMotion ? 0 : 0.45,
          duration: shouldReduceMotion ? 0 : 0.3,
        }}
        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-200 dark:border-green-800"
      >
        <div className="flex items-start gap-3">
          <span className="text-2xl mt-1">✨</span>
          <div>
            <div className="font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Generate
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold">{config.numberOfChapters}</span> chapters will be
              created for <span className="font-semibold">{config.targetSector}</span> sector with{' '}
              {config.includeWorkplaceScenarios && 'workplace scenarios, '}
              {config.includeSafetyVocabulary && 'safety vocabulary, '}
              {config.includeAudio && 'and audio generation'}.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              ⏱️ Estimated time:{' '}
              {Math.ceil(
                config.numberOfChapters * SSW_CONSTANTS.LOADING.ESTIMATED_TIME_PER_CHAPTER.MIN
              )}
              -{config.numberOfChapters * SSW_CONSTANTS.LOADING.ESTIMATED_TIME_PER_CHAPTER.MAX}{' '}
              minutes
            </p>
          </div>
        </div>
      </motion.div>

      {/* Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: shouldReduceMotion ? 0 : 0.5, duration: shouldReduceMotion ? 0 : 0.3 }}
        className="flex justify-between gap-4 pt-6"
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setDirection(-1)
            setStep(2)
          }}
          className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: -4 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </motion.svg>
            Back
          </span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          disabled={generating || !config.title || !config.targetSector}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ rotate: 20 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </motion.svg>
            Generate Textbook
          </span>
        </motion.button>

        {/* Preview Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setShowPreview(true)
            setDirection(1)
            setStep(4)
          }}
          disabled={!config.title || !config.targetSector}
          className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all duration-200 min-h-[48px]"
        >
          <span className="flex items-center gap-2">
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ scale: 1.1 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </motion.svg>
            Preview Content
          </span>
        </motion.button>
      </motion.div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 sm:gap-4 mb-4">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl flex items-center justify-center"
            >
              <span className="text-3xl">🏢</span>
            </motion.div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SSW Textbook
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Generator
              </span>
            </h1>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.2,
              duration: shouldReduceMotion ? 0 : 0.5,
            }}
            className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-3"
          >
            Create workplace Japanese textbooks for Specified Skilled Workers
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.3,
              duration: shouldReduceMotion ? 0 : 0.5,
            }}
            className="flex items-center justify-center gap-2 text-xs sm:text-sm flex-wrap"
          >
            {[
              { icon: '🏭', text: '14 Sectors', color: 'blue' },
              { icon: '⚠️', text: 'Safety Focus', color: 'green' },
              { icon: '💼', text: 'Workplace Scenarios', color: 'purple' },
            ].map((badge, index) => (
              <motion.span
                key={badge.text}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: shouldReduceMotion ? 0 : 0.35 + index * 0.1,
                  duration: shouldReduceMotion ? 0 : 0.3,
                }}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold backdrop-blur-sm text-xs sm:text-sm ${
                  badge.color === 'blue'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : badge.color === 'green'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                }`}
              >
                {badge.icon} {badge.text}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Progress Steps */}
        <AnimatePresence mode="wait">
          {!generating && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              className="max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-12"
            >
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3].map((s, index) => (
                  <div key={s} className="flex items-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all cursor-pointer ${
                        step >= s
                          ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg'
                          : step === s
                            ? 'ring-2 ring-blue-400 dark:ring-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {step > s ? (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-6 h-6"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </motion.svg>
                      ) : (
                        s
                      )}
                    </motion.div>
                    {s < 3 && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: step > s ? 1 : 0 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`w-12 h-1 mx-2 rounded-full origin-left ${
                          step > s
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                            : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="flex justify-between mt-6 px-2"
              >
                {['Basic Info', 'Sector', 'Options'].map((label, index) => (
                  <motion.span
                    key={label}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + index * 0.1, duration: 0.3 }}
                    className={`text-sm font-semibold ${
                      step > index
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {label}
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Form */}
        <motion.div layout className="max-w-4xl mx-auto">
          <motion.div
            layout
            className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {initialLoading ? (
                <SSWFormSkeleton />
              ) : !generating ? (
                <>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                  {step === 4 && renderPreview()}
                </>
              ) : (
                /* Generation Progress */
                <SSWGenerationProgressSkeleton />
              )}
            </AnimatePresence>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                  className="mt-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl"
                >
                  <div className="flex items-start gap-3">
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </motion.svg>
                    <div>
                      <p className="font-bold text-red-600 dark:text-red-400">Error</p>
                      <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
