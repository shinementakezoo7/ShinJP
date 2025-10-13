'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

interface StrokeAnimatorGSAPProps {
  kanji: string
  className?: string
  autoPlay?: boolean
  strokeDuration?: number // Duration per stroke in seconds
  strokeDelay?: number // Delay between strokes
}

// Simplified stroke data - in production, integrate with AnimCJK dataset
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
  木: {
    viewBox: '0 0 109 109',
    strokes: ['M 54 20 L 54 85', 'M 27 45 L 81 45', 'M 35 70 L 15 90', 'M 73 70 L 93 90'],
  },
  山: {
    viewBox: '0 0 109 109',
    strokes: ['M 54 20 L 54 85', 'M 20 55 L 54 20 L 88 55', 'M 20 85 L 88 85'],
  },
}

export default function StrokeAnimatorGSAP({
  kanji,
  className = '',
  autoPlay = false,
  strokeDuration = 0.8,
  strokeDelay = 0.3,
}: StrokeAnimatorGSAPProps) {
  const strokeRefs = useRef<(SVGPathElement | null)[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStroke, setCurrentStroke] = useState(0)

  const strokeData = STROKE_DATA[kanji]

  // Calculate stroke lengths for accurate animation
  const getStrokeLength = (path: SVGPathElement) => {
    return path.getTotalLength()
  }

  useGSAP(() => {
    if (!strokeData || !containerRef.current) return

    // Clear previous timeline
    if (timelineRef.current) {
      timelineRef.current.kill()
    }

    // Create master timeline with callbacks
    const tl = gsap.timeline({
      paused: true,
      onStart: () => setIsPlaying(true),
      onComplete: () => {
        setIsPlaying(false)
        setIsPaused(false)
        setProgress(100)
      },
      onUpdate: function () {
        const prog = this.progress() * 100
        setProgress(Math.round(prog))

        // Calculate current stroke based on progress
        const strokeCount = strokeData.strokes.length
        const strokeIndex = Math.min(Math.floor(this.progress() * strokeCount), strokeCount - 1)
        setCurrentStroke(strokeIndex)
      },
    })

    // Animate each stroke with GSAP timeline
    strokeRefs.current.forEach((pathEl, index) => {
      if (!pathEl) return

      const length = getStrokeLength(pathEl)

      // Set initial state
      gsap.set(pathEl, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 0.3,
      })

      // Add to timeline with stagger
      tl.to(
        pathEl,
        {
          strokeDashoffset: 0,
          opacity: 1,
          duration: strokeDuration,
          ease: 'power2.out',
          onStart: () => {
            // Highlight current stroke
            gsap.to(pathEl, {
              stroke: '#6366f1',
              strokeWidth: 5,
              duration: 0.2,
            })
          },
          onComplete: () => {
            // Return to normal color after animation
            gsap.to(pathEl, {
              stroke: '#1f2937',
              strokeWidth: 4,
              duration: 0.3,
              delay: 0.2,
            })
          },
        },
        index * strokeDelay // Stagger each stroke
      )
    })

    timelineRef.current = tl

    // Auto-play if enabled
    if (autoPlay) {
      tl.play()
    }

    return () => {
      tl.kill()
    }
  }, [kanji, strokeData, strokeDuration, strokeDelay, autoPlay])

  // Control functions
  const play = () => {
    if (timelineRef.current) {
      if (timelineRef.current.progress() === 1) {
        timelineRef.current.restart()
      } else {
        timelineRef.current.play()
      }
      setIsPaused(false)
    }
  }

  const pause = () => {
    if (timelineRef.current) {
      timelineRef.current.pause()
      setIsPaused(true)
    }
  }

  const reverse = () => {
    if (timelineRef.current) {
      timelineRef.current.reverse()
      setIsPaused(false)
    }
  }

  const reset = () => {
    if (timelineRef.current) {
      timelineRef.current.pause(0)
      setIsPlaying(false)
      setIsPaused(false)
      setProgress(0)
      setCurrentStroke(0)
    }
  }

  const showAll = () => {
    if (timelineRef.current) {
      timelineRef.current.progress(1)
    }
  }

  // Speed controls
  const setSpeed = (speed: number) => {
    if (timelineRef.current) {
      timelineRef.current.timeScale(speed)
    }
  }

  if (!strokeData) {
    return (
      <div className={`text-center p-8 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <p className="text-6xl japanese-text mb-4">{kanji}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Stroke data not available for this character
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Available: 一, 二, 三, 日, 月, 木, 山
        </p>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Kanji Stroke Order:{' '}
            <span className="japanese-text text-2xl text-indigo-600 dark:text-indigo-400">
              {kanji}
            </span>
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Stroke {currentStroke + 1} / {strokeData.strokes.length}
            </span>
          </div>
        </div>

        {/* SVG Canvas with GSAP-powered animations */}
        <div
          ref={containerRef}
          className="relative w-full aspect-square bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl mb-4 overflow-hidden border-2 border-gray-200 dark:border-gray-700"
        >
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
              stroke="currentColor"
              className="text-gray-300 dark:text-gray-600"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
            <line
              x1="0"
              y1="54.5"
              x2="109"
              y2="54.5"
              stroke="currentColor"
              className="text-gray-300 dark:text-gray-600"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />

            {/* Strokes with GSAP refs */}
            {strokeData.strokes.map((stroke, index) => (
              <path
                key={index}
                ref={(el) => {
                  strokeRefs.current[index] = el
                }}
                d={stroke}
                fill="none"
                stroke="#1f2937"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="dark:stroke-gray-200"
              />
            ))}
          </svg>

          {/* Progress indicator */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-3">
          {/* Main controls */}
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={play}
              disabled={isPlaying && !isPaused}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
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
              {isPlaying && !isPaused ? 'Playing...' : 'Play'}
            </button>

            <button
              onClick={pause}
              disabled={!isPlaying || isPaused}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Pause
            </button>

            <button
              onClick={reverse}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"
                />
              </svg>
              Reverse
            </button>

            <button
              onClick={reset}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all shadow-md hover:shadow-lg"
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
              onClick={showAll}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg transition-all shadow-md hover:shadow-lg"
            >
              Show All
            </button>
          </div>

          {/* Speed controls */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
            {[0.5, 1, 1.5, 2].map((speed) => (
              <button
                key={speed}
                onClick={() => setSpeed(speed)}
                className="px-3 py-1 text-xs bg-gray-100 hover:bg-indigo-100 dark:bg-gray-700 dark:hover:bg-indigo-900 text-gray-700 dark:text-gray-300 rounded-md transition-colors"
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
          <p className="text-sm text-center text-indigo-900 dark:text-indigo-300">
            ✨ <strong>GSAP-Powered Animation</strong> • 60fps smooth strokes • Timeline control •{' '}
            {progress}% complete
          </p>
        </div>
      </div>
    </div>
  )
}
