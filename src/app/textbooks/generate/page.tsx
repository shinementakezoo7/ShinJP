'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import CalligraphyDivider from '@/components/japanese/CalligraphyDivider'
import JapaneseCard from '@/components/japanese/JapaneseCard'
import SakuraPetals from '@/components/japanese/SakuraPetals'

interface TextbookConfig {
  title: string
  jlptLevel: number
  contentType:
    | 'textbook_chapter'
    | 'grammar_lesson'
    | 'vocabulary_lesson'
    | 'kanji_lesson'
    | 'colloquial_lesson'
  topics: string[]
  numberOfChapters: number
  includeExercises: boolean
  includeCulturalNotes: boolean
  includeSlang: boolean
  includeMnemonics: boolean
  includeExamples: boolean
  specificContent: {
    grammarPatterns: string[]
    vocabularyIds: string[]
    kanjiIds: string[]
    slangIds: string[]
  }
  interests: string[]
}

export default function GenerateTextbookPageEnhanced() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<TextbookConfig>({
    title: '',
    jlptLevel: 5,
    contentType: 'textbook_chapter',
    topics: [''],
    numberOfChapters: 10,
    includeExercises: true,
    includeCulturalNotes: true,
    includeSlang: false,
    includeMnemonics: true,
    includeExamples: true,
    specificContent: {
      grammarPatterns: [],
      vocabularyIds: [],
      kanjiIds: [],
      slangIds: [],
    },
    interests: [],
  })

  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState<{
    current: number
    total: number
    message: string
  } | null>(null)
  const [error, setError] = useState<string | null>(null)

  const jlptLevels = [
    {
      value: 5,
      label: 'N5',
      name: 'Foundation',
      description: 'Basic Japanese',
      stats: '800 words • 103 kanji • 80 patterns',
      color: 'from-green-400 to-emerald-600',
      icon: '🌱',
    },
    {
      value: 4,
      label: 'N4',
      name: 'Elementary',
      description: 'Daily conversations',
      stats: '1,500 words • 300 kanji • 150 patterns',
      color: 'from-blue-400 to-cyan-600',
      icon: '🌊',
    },
    {
      value: 3,
      label: 'N3',
      name: 'Intermediate',
      description: 'Bridge to advanced',
      stats: '3,750 words • 650 kanji • 200 patterns',
      color: 'from-yellow-400 to-orange-600',
      icon: '⛰️',
    },
    {
      value: 2,
      label: 'N2',
      name: 'Upper-Intermediate',
      description: 'Various circumstances',
      stats: '6,000 words • 1,000 kanji • 197 patterns',
      color: 'from-purple-400 to-violet-600',
      icon: '🏔️',
    },
    {
      value: 1,
      label: 'N1',
      name: 'Advanced',
      description: 'Native-level comprehension',
      stats: '10,000+ words • 2,136 kanji • 240+ patterns',
      color: 'from-red-400 to-rose-600',
      icon: '🌸',
    },
  ]

  const contentTypes = [
    {
      value: 'textbook_chapter',
      name: 'Complete Textbook',
      description: 'Comprehensive chapters with grammar, vocabulary, kanji, and exercises',
      icon: '📚',
      features: ['Mixed Content', 'Progressive Learning', 'Cultural Context', 'Full JLPT Coverage'],
    },
    {
      value: 'grammar_lesson',
      name: 'Grammar Focus',
      description: 'Deep dive into specific grammar patterns with 15+ examples',
      icon: '📖',
      features: ['15+ Examples', 'Common Mistakes', 'Casual Forms', 'Practice Exercises'],
    },
    {
      value: 'vocabulary_lesson',
      name: 'Vocabulary Builder',
      description: 'Themed vocabulary lessons with contextual usage',
      icon: '📝',
      features: ['Collocations', 'Memory Aids', 'Multiple Contexts', 'Cultural Notes'],
    },
    {
      value: 'kanji_lesson',
      name: 'Kanji Mastery',
      description: 'Character learning with stroke order and mnemonics',
      icon: '🀄',
      features: ['Stroke Order', 'Compounds', 'Visual Mnemonics', 'Similar Kanji'],
    },
    {
      value: 'colloquial_lesson',
      name: 'Modern Japanese',
      description: 'Youth slang, internet language, and contemporary expressions',
      icon: '💬',
      features: ['Slang Terms', 'Social Media', 'Usage Warnings', 'Platform Context'],
    },
  ]

  const suggestedInterests = [
    { name: 'Anime & Manga', icon: '🎬', color: 'purple' },
    { name: 'Business Japanese', icon: '💼', color: 'blue' },
    { name: 'Travel & Tourism', icon: '✈️', color: 'cyan' },
    { name: 'Food & Cooking', icon: '🍱', color: 'orange' },
    { name: 'Technology', icon: '💻', color: 'indigo' },
    { name: 'History & Culture', icon: '🏯', color: 'red' },
    { name: 'Daily Conversation', icon: '💬', color: 'green' },
    { name: 'Sports', icon: '⚽', color: 'yellow' },
    { name: 'Music & Entertainment', icon: '🎵', color: 'pink' },
    { name: 'Art & Design', icon: '🎨', color: 'violet' },
    { name: 'Science & Nature', icon: '🔬', color: 'teal' },
    { name: 'Literature', icon: '📚', color: 'amber' },
  ]

  const handleGenerate = async () => {
    // Validation
    if (!config.title.trim()) {
      setError('Please enter a textbook title')
      return
    }

    if (config.topics.length === 0 || config.topics[0].trim() === '') {
      setError('Please add at least one topic')
      return
    }

    setError(null)
    setGenerating(true)
    setProgress({
      current: 0,
      total: config.numberOfChapters,
      message: 'Preparing JLPT-compliant content...',
    })

    try {
      const response = await fetch('/api/textbooks/generate', {
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
        message: '✨ Textbook generated successfully with JLPT specifications!',
      })

      // Redirect to textbook view after a short delay
      setTimeout(() => {
        router.push(`/books/${data.textbook.id}`)
      }, 2000)
    } catch (err: unknown) {
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
          <span className="japanese-text text-xl mr-2">📖</span>
          Textbook Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={config.title}
          onChange={(e) => setConfig({ ...config, title: e.target.value })}
          placeholder="e.g., My Japanese Journey to N3"
          className="w-full px-5 py-4 rounded-2xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50 focus:border-purple-500 transition-all text-lg"
        />
      </div>

      {/* JLPT Level Selection - Enhanced */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="japanese-text text-xl mr-2">🎯</span>
          Target JLPT Level <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {jlptLevels.map((level) => (
            <button
              key={level.value}
              onClick={() => setConfig({ ...config, jlptLevel: level.value })}
              className={`relative group p-5 rounded-2xl border-2 transition-all duration-300 ${
                config.jlptLevel === level.value
                  ? `border-transparent bg-gradient-to-br ${level.color} text-white shadow-2xl scale-105`
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600 hover:scale-102'
              }`}
            >
              <div className="text-4xl mb-2">{level.icon}</div>
              <div className="font-bold text-2xl mb-1">{level.label}</div>
              <div
                className={`text-sm font-semibold mb-2 ${
                  config.jlptLevel === level.value
                    ? 'text-white'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                {level.name}
              </div>
              <div
                className={`text-xs mb-3 ${
                  config.jlptLevel === level.value
                    ? 'text-white/90'
                    : 'text-gray-500 dark:text-gray-500'
                }`}
              >
                {level.description}
              </div>
              <div
                className={`text-xs font-mono ${
                  config.jlptLevel === level.value
                    ? 'text-white/80'
                    : 'text-gray-400 dark:text-gray-600'
                }`}
              >
                {level.stats}
              </div>
              {config.jlptLevel === level.value && (
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

      {/* Content Type Selection - New */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="japanese-text text-xl mr-2">📚</span>
          Content Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {contentTypes.map((type) => (
            <button
              key={type.value}
              onClick={() =>
                setConfig({
                  ...config,
                  contentType: type.value as
                    | 'textbook_chapter'
                    | 'grammar_lesson'
                    | 'vocabulary_lesson'
                    | 'kanji_lesson'
                    | 'colloquial_lesson',
                })
              }
              className={`relative group p-5 rounded-2xl border-2 transition-all text-left ${
                config.contentType === type.value
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-lg scale-105'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-600'
              }`}
            >
              <div className="text-3xl mb-3">{type.icon}</div>
              <div className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                {type.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                {type.description}
              </div>
              <div className="space-y-1">
                {type.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500"
                  >
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
              {config.contentType === type.value && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
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
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
        >
          Continue to Topics
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
      {/* Topics */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
          <span className="japanese-text text-xl mr-2">📋</span>
          Chapter Topics <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Add topics that will be covered in your textbook chapters
        </p>
        <div className="space-y-3">
          {config.topics.map((topic, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0 w-10 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold">
                {index + 1}
              </div>
              <input
                type="text"
                value={topic}
                onChange={(e) => {
                  const newTopics = [...config.topics]
                  newTopics[index] = e.target.value
                  setConfig({ ...config, topics: newTopics })
                }}
                placeholder={`Topic ${index + 1} (e.g., Greetings and Introductions)`}
                className="flex-1 px-5 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500"
              />
              {config.topics.length > 1 && (
                <button
                  onClick={() =>
                    setConfig({ ...config, topics: config.topics.filter((_, i) => i !== index) })
                  }
                  className="flex-shrink-0 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={() => setConfig({ ...config, topics: [...config.topics, ''] })}
          className="mt-4 px-6 py-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-xl font-semibold hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all"
        >
          <svg
            className="inline-block w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Another Topic
        </button>
      </div>

      {/* Number of Chapters */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-3">
          <span className="japanese-text text-xl mr-2">📊</span>
          Number of Chapters:{' '}
          <span className="text-purple-600 dark:text-purple-400">{config.numberOfChapters}</span>
        </label>
        <input
          type="range"
          min="5"
          max="30"
          step="5"
          value={config.numberOfChapters}
          onChange={(e) => setConfig({ ...config, numberOfChapters: parseInt(e.target.value, 10) })}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-700"
          style={{
            background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${((config.numberOfChapters - 5) / 25) * 100}%, rgb(229 231 235) ${((config.numberOfChapters - 5) / 25) * 100}%, rgb(229 231 235) 100%)`,
          }}
        />
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-2">
          <span>5 chapters</span>
          <span>30 chapters</span>
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
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
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
          <span className="japanese-text text-xl mr-2">⚙️</span>
          Content Enhancement Options
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeExamples}
              onChange={(e) => setConfig({ ...config, includeExamples: e.target.checked })}
              className="w-6 h-6 mt-1 text-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                📝 Comprehensive Examples
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                15+ example sentences per grammar pattern with context and breakdowns
              </div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeExercises}
              onChange={(e) => setConfig({ ...config, includeExercises: e.target.checked })}
              className="w-6 h-6 mt-1 text-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                ✏️ Practice Exercises
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                10-15 exercises per chapter with detailed explanations
              </div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeCulturalNotes}
              onChange={(e) => setConfig({ ...config, includeCulturalNotes: e.target.checked })}
              className="w-6 h-6 mt-1 text-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">
                🎎 Cultural Context
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Japanese culture, etiquette, and usage appropriateness
              </div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeMnemonics}
              onChange={(e) => setConfig({ ...config, includeMnemonics: e.target.checked })}
              className="w-6 h-6 mt-1 text-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">🧠 Memory Aids</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Visual mnemonics and memory techniques for kanji and vocabulary
              </div>
            </div>
          </label>

          <label className="flex items-start gap-4 p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 cursor-pointer hover:border-purple-300 dark:hover:border-purple-600 transition-all">
            <input
              type="checkbox"
              checked={config.includeSlang}
              onChange={(e) => setConfig({ ...config, includeSlang: e.target.checked })}
              className="w-6 h-6 mt-1 text-purple-600 rounded-lg focus:ring-2 focus:ring-purple-500 flex-shrink-0"
            />
            <div className="flex-1">
              <div className="font-bold text-gray-900 dark:text-white mb-1">💬 Modern Japanese</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Youth slang, internet language, and contemporary expressions
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Interests */}
      <div>
        <label className="block text-base font-bold text-gray-900 dark:text-white mb-4">
          <span className="japanese-text text-xl mr-2">❤️</span>
          Personalize with Your Interests (Optional)
        </label>
        <div className="flex flex-wrap gap-3">
          {suggestedInterests.map((interest) => (
            <button
              key={interest.name}
              onClick={() => {
                if (config.interests.includes(interest.name)) {
                  setConfig({
                    ...config,
                    interests: config.interests.filter((i) => i !== interest.name),
                  })
                } else {
                  setConfig({ ...config, interests: [...config.interests, interest.name] })
                }
              }}
              className={`group px-5 py-3 rounded-2xl text-sm font-semibold transition-all ${
                config.interests.includes(interest.name)
                  ? `bg-gradient-to-br from-${interest.color}-400 to-${interest.color}-600 text-white shadow-lg scale-105`
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{interest.icon}</span>
              {interest.name}
            </button>
          ))}
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
          disabled={generating || !config.title || config.topics[0] === ''}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
          Generate with AI
        </button>
      </div>

      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
        ⏱️ Estimated time: {Math.ceil(config.numberOfChapters * 0.75)} -{' '}
        {config.numberOfChapters * 2} minutes
      </p>
    </div>
  )

  return (
    <div className="min-h-screen relative">
      {/* Floating Sakura Petals */}
      <SakuraPetals count={15} />

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <JapaneseCard pattern="asanoha" className="max-w-4xl mx-auto shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl shadow-xl flex items-center justify-center animate-pulse-glow">
                  <span className="text-3xl">🤖</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold">
                  <span className="gradient-text">AI Textbook Generator</span>
                </h1>
              </div>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-2">
                Create <span className="font-bold gradient-text">JLPT-compliant</span> Japanese
                textbooks powered by NVIDIA AI
              </p>
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full font-semibold">
                  🚀 stockmark-2-100b-instruct
                </span>
                <span className="px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full font-semibold">
                  ✨ 100B parameters
                </span>
                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-semibold">
                  📚 Full JLPT Coverage
                </span>
              </div>
            </div>
          </JapaneseCard>
        </div>

        <CalligraphyDivider kanji="創" />

        {/* Progress Steps */}
        {!generating && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex items-center justify-center gap-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all ${
                      step >= s
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg scale-110'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-16 h-1 mx-2 rounded-full transition-all ${
                        step > s
                          ? 'bg-gradient-to-r from-purple-500 to-pink-600'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 px-6">
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Basics</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Topics</span>
              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                Options
              </span>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="max-w-6xl mx-auto">
          <JapaneseCard pattern="seigaiha" className="shadow-2xl">
            <div className="p-8">
              {!generating ? (
                <>
                  {step === 1 && renderStep1()}
                  {step === 2 && renderStep2()}
                  {step === 3 && renderStep3()}
                </>
              ) : (
                /* Generation Progress */
                <div className="py-16 text-center animate-fade-in">
                  <div className="mb-8">
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                      <div className="absolute inset-0 border-4 border-purple-200 dark:border-purple-800 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-purple-600 border-r-pink-600 rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center text-3xl">
                        🤖
                      </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                      Generating Your Textbook
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
                      {progress?.message || 'Please wait...'}
                    </p>
                    <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                      Creating JLPT-compliant content with comprehensive examples and exercises
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
                          className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 transition-all duration-500 animate-shimmer"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        {Math.round((progress.current / progress.total) * 100)}% Complete
                      </div>
                    </div>
                  )}

                  <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                      <div className="text-2xl mb-2">✨</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        JLPT Compliant
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Following official specifications
                      </div>
                    </div>
                    <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-xl">
                      <div className="text-2xl mb-2">📝</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        15+ Examples Each
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Comprehensive coverage
                      </div>
                    </div>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                      <div className="text-2xl mb-2">🎎</div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        Cultural Context
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        Authentic usage notes
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-5 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl animate-shake">
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
          </JapaneseCard>
        </div>

        {/* Info Cards */}
        {!generating && (
          <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <JapaneseCard pattern="shippo" className="p-6">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Comprehensive
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Grammar, vocabulary, kanji, and cultural context—all in one
              </p>
            </JapaneseCard>
            <JapaneseCard pattern="shippo" className="p-6">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">JLPT Aligned</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Exact specifications for each level (N5-N1)
              </p>
            </JapaneseCard>
            <JapaneseCard pattern="shippo" className="p-6">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                Modern Japanese
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Includes youth slang, internet language, and contemporary usage
              </p>
            </JapaneseCard>
            <JapaneseCard pattern="shippo" className="p-6">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                100B parameter model trained on Japanese language
              </p>
            </JapaneseCard>
          </div>
        )}
      </div>
    </div>
  )
}
