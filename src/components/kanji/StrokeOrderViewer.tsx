'use client'

import { useEffect, useState } from 'react'

interface StrokeOrderViewerProps {
  kanji: string
  autoPlay?: boolean
  showTips?: boolean
  className?: string
}

interface StrokeData {
  order: number
  type: string
  svg_path: string
  direction: string
  description: string
}

interface StrokeOrderData {
  kanji: string
  strokeCount: number
  strokes: StrokeData[]
  writingTips?: string[]
  commonMistakes?: Array<{
    mistake: string
    correction: string
    visual: string
  }>
  similarKanji?: string[]
  difficultyRating?: number
  jlptLevel?: string
}

export default function StrokeOrderViewer({
  kanji,
  autoPlay = false,
  showTips = true,
  className = '',
}: StrokeOrderViewerProps) {
  const [data, setData] = useState<StrokeOrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentStroke, setCurrentStroke] = useState(0)
  const [isAnimating, setIsAnimating] = useState(autoPlay)

  const fetchStrokeOrder = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/kanji/stroke-order/${encodeURIComponent(kanji)}`)

      if (!response.ok) {
        throw new Error('Kanji stroke order not available')
      }

      const strokeData = await response.json()
      setData(strokeData)
    } catch (err) {
      console.error('Stroke order fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to load stroke order')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStrokeOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kanji])

  useEffect(() => {
    if (isAnimating && data) {
      const timer = setInterval(() => {
        setCurrentStroke((prev) => {
          if (prev >= data.strokeCount - 1) {
            setIsAnimating(false)
            return prev
          }
          return prev + 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isAnimating, data])

  const playAnimation = () => {
    setCurrentStroke(0)
    setIsAnimating(true)
  }

  const pauseAnimation = () => {
    setIsAnimating(false)
  }

  const resetAnimation = () => {
    setCurrentStroke(0)
    setIsAnimating(false)
  }

  const nextStroke = () => {
    if (data && currentStroke < data.strokeCount - 1) {
      setCurrentStroke(currentStroke + 1)
    }
  }

  const previousStroke = () => {
    if (currentStroke > 0) {
      setCurrentStroke(currentStroke - 1)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div
        className={`p-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl ${className}`}
      >
        <div className="flex items-start gap-3">
          <svg
            className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-bold text-yellow-800 dark:text-yellow-400">
              Stroke order not available
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-500">
              {error || `Stroke order data for ${kanji} is not yet in the database.`}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Kanji Display & Animation */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{kanji}</h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded font-semibold">
                {data.strokeCount} strokes
              </span>
              {data.jlptLevel && (
                <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded font-semibold">
                  {data.jlptLevel}
                </span>
              )}
              {data.difficultyRating && (
                <span className="text-gray-600 dark:text-gray-400">
                  {'⭐'.repeat(data.difficultyRating)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SVG Animation Area */}
        <div className="relative w-full aspect-square max-w-md mx-auto bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 overflow-hidden">
          <svg viewBox="0 0 109 109" className="w-full h-full">
            {/* Grid lines */}
            <line
              x1="0"
              y1="54.5"
              x2="109"
              y2="54.5"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="text-gray-300 dark:text-gray-700"
            />
            <line
              x1="54.5"
              y1="0"
              x2="54.5"
              y2="109"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2,2"
              className="text-gray-300 dark:text-gray-700"
            />

            {/* Strokes */}
            {data.strokes.slice(0, currentStroke + 1).map((stroke, index) => (
              <path
                key={index}
                d={stroke.svg_path}
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                className={
                  index === currentStroke ? 'text-blue-600' : 'text-gray-700 dark:text-gray-400'
                }
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </svg>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Stroke {currentStroke + 1} of {data.strokeCount}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {data.strokes[currentStroke]?.description}
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
              style={{ width: `${((currentStroke + 1) / data.strokeCount) * 100}%` }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={resetAnimation}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            title="Reset"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          </button>

          <button
            onClick={previousStroke}
            disabled={currentStroke === 0}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous stroke"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {isAnimating ? (
            <button
              onClick={pauseAnimation}
              className="p-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all"
              title="Pause"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          ) : (
            <button
              onClick={playAnimation}
              className="p-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white shadow-lg transition-all"
              title="Play"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}

          <button
            onClick={nextStroke}
            disabled={currentStroke >= data.strokeCount - 1}
            className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next stroke"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Writing Tips */}
      {showTips && data.writingTips && data.writingTips.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
          <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            Writing Tips
          </h4>
          <ul className="space-y-2">
            {data.writingTips.map((tip, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-300"
              >
                <span className="text-blue-500 dark:text-blue-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Mistakes */}
      {showTips && data.commonMistakes && data.commonMistakes.length > 0 && (
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-6">
          <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Common Mistakes
          </h4>
          <div className="space-y-3">
            {data.commonMistakes.map((mistake, index) => (
              <div key={index} className="text-sm">
                <p className="text-orange-800 dark:text-orange-300 font-semibold">
                  ❌ {mistake.mistake}
                </p>
                <p className="text-green-700 dark:text-green-400 mt-1">✅ {mistake.correction}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Similar Kanji */}
      {data.similarKanji && data.similarKanji.length > 0 && (
        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6">
          <h4 className="font-bold text-purple-900 dark:text-purple-300 mb-3">Similar Kanji</h4>
          <div className="flex gap-3">
            {data.similarKanji.map((similar, index) => (
              <button
                key={index}
                className="text-3xl hover:scale-110 transition-transform"
                title={`View ${similar}`}
              >
                {similar}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
