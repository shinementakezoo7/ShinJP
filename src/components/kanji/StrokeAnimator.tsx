'use client'

import { useEffect, useState } from 'react'

interface StrokeAnimatorProps {
  kanji: string
  className?: string
}

// Simplified stroke data - in production, this would come from a comprehensive database
const STROKE_DATA: Record<string, { strokes: string[]; viewBox: string }> = {
  一: {
    viewBox: '0 0 109 109',
    strokes: ['M 19.25 53.75 L 89.25 53.75'],
  },
  二: {
    viewBox: '0 0 109 109',
    strokes: ['M 19.5 35.75 L 88.75 35.75', 'M 18.5 69.75 L 90.25 69.75'],
  },
  三: {
    viewBox: '0 0 109 109',
    strokes: ['M 20.25 25.5 L 87.5 25.5', 'M 19.75 53.75 L 88.75 53.75', 'M 18.5 83 L 90.25 83'],
  },
  日: {
    viewBox: '0 0 109 109',
    strokes: ['M 18 23 L 18 86 L 90 86 L 90 23 Z', 'M 18 54 L 90 54'],
  },
  月: {
    viewBox: '0 0 109 109',
    strokes: ['M 18 23 L 18 86 L 78 86 L 78 23 Z', 'M 18 41 L 78 41', 'M 18 59 L 78 59'],
  },
}

export default function StrokeAnimator({ kanji, className = '' }: StrokeAnimatorProps) {
  const [currentStroke, setCurrentStroke] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showAll, setShowAll] = useState(false)

  const strokeData = STROKE_DATA[kanji]

  useEffect(() => {
    if (isAnimating && strokeData && currentStroke < strokeData.strokes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStroke((prev) => prev + 1)
      }, 1000) // 1 second per stroke

      return () => clearTimeout(timer)
    } else if (isAnimating && strokeData && currentStroke >= strokeData.strokes.length - 1) {
      setTimeout(() => {
        setIsAnimating(false)
        setShowAll(true)
      }, 1000)
    }
  }, [isAnimating, currentStroke, strokeData])

  const startAnimation = () => {
    setCurrentStroke(0)
    setIsAnimating(true)
    setShowAll(false)
  }

  const reset = () => {
    setCurrentStroke(0)
    setIsAnimating(false)
    setShowAll(false)
  }

  const showAllStrokes = () => {
    setShowAll(true)
    setIsAnimating(false)
    setCurrentStroke(strokeData ? strokeData.strokes.length - 1 : 0)
  }

  if (!strokeData) {
    return (
      <div className={`text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <p className="text-6xl japanese-text mb-4">{kanji}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stroke data not available for this character
        </p>
      </div>
    )
  }

  const strokesToShow = showAll ? strokeData.strokes.length : currentStroke + 1

  return (
    <div className={`${className}`}>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* SVG Canvas */}
        <div className="relative w-full aspect-square bg-gray-50 dark:bg-gray-900 rounded-lg mb-4 overflow-hidden">
          <svg
            viewBox={strokeData.viewBox}
            className="w-full h-full"
            style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }}
          >
            {/* Grid lines for reference */}
            <line
              x1="54.5"
              y1="0"
              x2="54.5"
              y2="109"
              stroke="#e5e7eb"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <line
              x1="0"
              y1="54.5"
              x2="109"
              y2="54.5"
              stroke="#e5e7eb"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />

            {/* Strokes */}
            {strokeData.strokes.slice(0, strokesToShow).map((stroke, index) => (
              <path
                key={index}
                d={stroke}
                fill="none"
                stroke={index === currentStroke && isAnimating ? '#6366f1' : '#1f2937'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`
                  ${index === currentStroke && isAnimating ? 'animate-draw' : ''}
                  transition-opacity duration-300
                `}
                style={{
                  strokeDasharray: isAnimating && index === currentStroke ? '1000' : 'none',
                  strokeDashoffset: isAnimating && index === currentStroke ? '1000' : '0',
                  animation:
                    isAnimating && index === currentStroke
                      ? 'draw 1s ease-in-out forwards'
                      : 'none',
                }}
              />
            ))}
          </svg>

          {/* Stroke counter */}
          <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-medium shadow-md">
            <span className="text-indigo-600 dark:text-indigo-400">{strokesToShow}</span>
            <span className="text-gray-500 dark:text-gray-400"> / {strokeData.strokes.length}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {isAnimating ? 'Animating...' : 'Animate Strokes'}
          </button>

          <button
            onClick={showAllStrokes}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
          >
            Show All
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-colors"
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
        </div>

        {/* Info */}
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Follow the stroke order to write{' '}
            <span className="japanese-text text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {kanji}
            </span>{' '}
            correctly
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  )
}
