'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface TextbookConfig {
  title: string
  jlptLevel: number
  topics: string[]
  numberOfChapters: number
  includeExercises: boolean
  interests: string[]
}

export default function GenerateTextbookPage() {
  const router = useRouter()
  const [config, setConfig] = useState<TextbookConfig>({
    title: '',
    jlptLevel: 5,
    topics: [''],
    numberOfChapters: 10,
    includeExercises: true,
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
    { value: 5, label: 'N5', description: 'Beginner (800 words, 100 kanji)' },
    { value: 4, label: 'N4', description: 'Elementary (1,500 words, 300 kanji)' },
    { value: 3, label: 'N3', description: 'Intermediate (4,000 words, 650 kanji)' },
    { value: 2, label: 'N2', description: 'Advanced (6,000 words, 1,000 kanji)' },
    { value: 1, label: 'N1', description: 'Expert (10,000 words, 2,000 kanji)' },
  ]

  const suggestedInterests = [
    'Anime & Manga',
    'Business Japanese',
    'Travel & Tourism',
    'Food & Cooking',
    'Technology',
    'History & Culture',
    'Daily Conversation',
    'Sports',
    'Music',
    'Art',
    'Science',
    'Literature',
  ]

  const handleAddTopic = () => {
    setConfig({
      ...config,
      topics: [...config.topics, ''],
    })
  }

  const handleRemoveTopic = (index: number) => {
    setConfig({
      ...config,
      topics: config.topics.filter((_, i) => i !== index),
    })
  }

  const handleTopicChange = (index: number, value: string) => {
    const newTopics = [...config.topics]
    newTopics[index] = value
    setConfig({ ...config, topics: newTopics })
  }

  const toggleInterest = (interest: string) => {
    if (config.interests.includes(interest)) {
      setConfig({
        ...config,
        interests: config.interests.filter((i) => i !== interest),
      })
    } else {
      setConfig({
        ...config,
        interests: [...config.interests, interest],
      })
    }
  }

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
    setProgress({ current: 0, total: config.numberOfChapters, message: 'Initializing...' })

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
        message: 'Textbook generated successfully!',
      })

      // Redirect to textbook view after a short delay
      setTimeout(() => {
        router.push(`/textbooks/${data.textbook.id}`)
      }, 2000)
    } catch (err: unknown) {
      console.error('Generation error:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate textbook')
      setGenerating(false)
      setProgress(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🤖 AI Textbook Generator
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create personalized Japanese textbooks powered by NVIDIA AI
          </p>
          <p className="text-sm text-indigo-600 dark:text-indigo-400 mt-2">
            Using stockmark-2-100b-instruct (100B parameters)
          </p>
        </div>

        {/* Main Form */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {!generating ? (
            <div className="space-y-8">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Textbook Title *
                </label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  placeholder="e.g., My Japanese Journey to N3"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* JLPT Level */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Target JLPT Level *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {jlptLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => setConfig({ ...config, jlptLevel: level.value })}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        config.jlptLevel === level.value
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-gray-200 dark:border-gray-600 hover:border-indigo-300'
                      }`}
                    >
                      <div className="font-bold text-lg text-gray-900 dark:text-white">
                        {level.label}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Topics */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Chapter Topics *
                </label>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Add topics that will be covered in your textbook chapters
                </p>
                <div className="space-y-2">
                  {config.topics.map((topic, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => handleTopicChange(index, e.target.value)}
                        placeholder={`Topic ${index + 1} (e.g., Greetings and Introductions)`}
                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {config.topics.length > 1 && (
                        <button
                          onClick={() => handleRemoveTopic(index)}
                          className="px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleAddTopic}
                  className="mt-3 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Another Topic
                </button>
              </div>

              {/* Number of Chapters */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Number of Chapters: {config.numberOfChapters}
                </label>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="5"
                  value={config.numberOfChapters}
                  onChange={(e) =>
                    setConfig({ ...config, numberOfChapters: parseInt(e.target.value, 10) })
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                  <span>5 chapters</span>
                  <span>30 chapters</span>
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  Personalize with Your Interests (Optional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {suggestedInterests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        config.interests.includes(interest)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.includeExercises}
                    onChange={(e) => setConfig({ ...config, includeExercises: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    Include practice exercises in each chapter
                  </span>
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 Generate Textbook with AI
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                Estimated generation time: {Math.ceil(config.numberOfChapters * 0.5)} -{' '}
                {config.numberOfChapters} minutes
              </p>
            </div>
          ) : (
            /* Generation Progress */
            <div className="py-12 text-center">
              <div className="mb-8">
                <div className="w-20 h-20 mx-auto mb-4 relative">
                  <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-t-indigo-600 rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Generating Your Textbook
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {progress?.message || 'Please wait...'}
                </p>
              </div>

              {progress && (
                <div className="max-w-md mx-auto">
                  <div className="mb-2 flex justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>Progress</span>
                    <span>
                      {progress.current} / {progress.total} chapters
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-500"
                      style={{ width: `${(progress.current / progress.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                <p>🤖 Using NVIDIA stockmark-2-100b-instruct</p>
                <p className="mt-1">✨ Powered by 100B parameter AI model</p>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">📚</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Comprehensive</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete lessons with grammar, vocabulary, and cultural notes
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">Personalized</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Tailored to your interests and learning goals
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-2">AI-Powered</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generated by state-of-the-art Japanese language AI
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
