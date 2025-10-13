'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SectorSelector from '@/components/ssw/SectorSelector'

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
  const [config, setConfig] = useState<SSWGenerationConfig>({
    title: '',
    sswType: 'SSW1',
    targetSector: '',
    numberOfChapters: 10,
    focusAreas: [],
    includeWorkplaceScenarios: true,
    includeSafetyVocabulary: true,
    includeAudio: false,
  })

  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState<{
    current: number
    total: number
    message: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

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
    // Validation
    if (!config.title.trim()) {
      setError('Please enter a textbook title')
      return
    }

    if (!config.targetSector) {
      setError('Please select a target sector')
      return
    }

    setError(null)
    setGenerating(true)
    setProgress({
      current: 0,
      total: config.numberOfChapters,
      message: 'Starting SSW content generation...',
    })

    try {
      const response = await fetch('/api/textbooks/generate-ssw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate textbook')
      }

      // Success!
      setProgress({
        current: config.numberOfChapters,
        total: config.numberOfChapters,
        message: '✨ SSW textbook generated successfully!',
      })

      // Redirect to textbook view after a short delay
      setTimeout(() => {
        router.push(`/books/${data.textbook.id}`)
      }, 2000)
    } catch (err) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate textbook')
      setGenerating(false)
      setProgress(null)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
          <span className="text-xl mr-2">📖</span>
          Textbook Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          placeholder="e.g., SSW Caregiving Essential Japanese"
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 focus:border-blue-500 transition-all text-lg"
        />
      </div>

      {/* SSW Type Selection */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="text-xl mr-2">🎯</span>
          SSW Type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sswTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setConfig({ ...config, sswType: type.value as any })}
              className={`relative group p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                config.sswType === type.value
                  ? `border-transparent bg-gradient-to-br ${type.color} text-white shadow-2xl scale-105`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-102'
              }`}
            >
              <div className="text-4xl mb-3">{type.icon}</div>
              <div className="font-bold text-xl mb-1">{type.name}</div>
              <div
                className={`text-sm font-semibold mb-2 ${
                  config.sswType === type.value ? 'text-white' : 'text-gray-600 dark:text-gray-400'
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
                className={`text-xs ${
                  config.sswType === type.value
                    ? 'text-white/80'
                    : 'text-gray-500 dark:text-gray-500'
                }`}
              >
                {type.requirements}
              </div>
              {config.sswType === type.value && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end gap-4 pt-6">
        <button
          onClick={() => setStep(2)}
          disabled={!config.title || !config.sswType}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          Continue to Sector Selection
          <svg
            className="inline-block w-5 h-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Sector Selection */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="text-xl mr-2">🏭</span>
          Target Sector <span className="text-red-500">*</span>
        </label>
        <SectorSelector
          value={config.targetSector}
          onChange={(sector) => setConfig({ ...config, targetSector: sector })}
        />
      </div>

      {/* Number of Chapters */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
          <span className="text-xl mr-2">📊</span>
          Number of Chapters:{' '}
          <span className="text-blue-600 dark:text-blue-400">{config.numberOfChapters}</span>
        </label>
        <input
          type="range"
          min="3"
          max="20"
          step="1"
          value={config.numberOfChapters}
          onChange={(e) => setConfig({ ...config, numberOfChapters: parseInt(e.target.value, 10) })}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>3 chapters</span>
          <span>20 chapters</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-6">
        <button
          onClick={() => setStep(1)}
          className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <svg
            className="inline-block w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <button
          onClick={() => setStep(3)}
          disabled={!config.targetSector}
          className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Options
          <svg
            className="inline-block w-5 h-5 ml-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Content Options */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="text-xl mr-2">⚙️</span>
          Content Options
        </label>
        <div className="space-y-4">
          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeWorkplaceScenarios}
              onChange={(e) =>
                setConfig({ ...config, includeWorkplaceScenarios: e.target.checked })
              }
              className="w-6 h-6 mt-1 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                💼 Workplace Scenarios
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Include realistic workplace dialogues and situations
              </div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeSafetyVocabulary}
              onChange={(e) => setConfig({ ...config, includeSafetyVocabulary: e.target.checked })}
              className="w-6 h-6 mt-1 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                ⚠️ Safety Vocabulary
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Emphasize safety-critical terminology and procedures
              </div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeAudio}
              onChange={(e) => setConfig({ ...config, includeAudio: e.target.checked })}
              className="w-6 h-6 mt-1 text-blue-600 rounded-lg focus:ring-2 focus:ring-blue-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                🔊 Audio Generation
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Generate audio pronunciation for key vocabulary (adds processing time)
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-6">
        <button
          onClick={() => setStep(2)}
          className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          <svg
            className="inline-block w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>
        <button
          onClick={handleGenerate}
          disabled={generating || !config.title || !config.targetSector}
          className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <svg
            className="inline-block w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          Generate SSW Textbook
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        ⏱️ Estimated time: {Math.ceil(config.numberOfChapters * 1)} - {config.numberOfChapters * 2}{' '}
        minutes
      </p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl shadow-xl flex items-center justify-center animate-pulse-glow">
              <span className="text-3xl">🏢</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SSW Textbook Generator
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
            Create workplace Japanese textbooks for Specified Skilled Workers
          </p>
          <div className="flex items-center justify-center gap-2 text-sm flex-wrap">
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
              🏭 14 Sectors
            </span>
            <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full font-semibold">
              ⚠️ Safety Focus
            </span>
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-semibold">
              💼 Workplace Scenarios
            </span>
          </div>
        </div>

        {/* Progress Steps */}
        {!generating && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      step >= s
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded-full transition-all ${
                        step > s
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 px-6">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Basic Info
              </span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Sector</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Options
              </span>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            {!generating ? (
              <>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
              </>
            ) : (
              /* Generation Progress */
              <div className="py-16 text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-blue-600 border-r-cyan-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center text-3xl">
                      🏢
                    </div>
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Generating SSW Textbook
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                    {progress?.message || 'Please wait...'}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                    Creating workplace-focused content with safety vocabulary
                  </p>
                </div>

                {progress && (
                  <div className="max-w-md mx-auto">
                    <div className="mb-3 flex justify-between text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <span>Progress</span>
                      <span>
                        {progress.current} / {progress.total} chapters
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${(progress.current / progress.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      {Math.round((progress.current / progress.total) * 100)}% Complete
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="font-bold text-red-600 dark:text-red-400">Error</p>
                    <p className="text-red-600 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
