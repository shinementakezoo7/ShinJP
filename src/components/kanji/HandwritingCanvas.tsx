'use client'

import { useEffect, useRef, useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

interface AnalysisResult {
  accuracyScore: number
  feedback: {
    overall: string
    strengths: string[]
    improvements: string[]
  }
}

interface HandwritingCanvasProps {
  kanji: string
  userId: string
  onSubmit?: (analysis: AnalysisResult) => void
  showFeedback?: boolean
  className?: string
}

interface Point {
  x: number
  y: number
  timestamp: number
}

interface Stroke {
  points: Point[]
}

export default function HandwritingCanvas({
  kanji,
  userId,
  onSubmit,
  showFeedback = true,
  className = '',
}: HandwritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [currentStroke, setCurrentStroke] = useState<Point[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attemptCount, setAttemptCount] = useState(0)
  const { trackKanjiPracticed, trackKanjiMastered, trackError } = useAnalytics()

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 1
    ctx.setLineDash([4, 4])

    // Center lines
    ctx.beginPath()
    ctx.moveTo(width / 2, 0)
    ctx.lineTo(width / 2, height)
    ctx.moveTo(0, height / 2)
    ctx.lineTo(width, height / 2)
    ctx.stroke()

    ctx.setLineDash([])
  }

  const redrawStrokes = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    strokes.forEach((stroke) => {
      if (stroke.points.length < 2) return

      ctx.beginPath()
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y)

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
      }

      ctx.stroke()
    })
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    // Clear and set up
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid(ctx, canvas.width, canvas.height)
    redrawStrokes(ctx)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokes])

  const getCanvasPoint = (e: React.MouseEvent | React.TouchEvent): Point | null => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()
    let clientX: number, clientY: number

    if ('touches' in e) {
      if (e.touches.length === 0) return null
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    } else {
      clientX = e.clientX
      clientY = e.clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
      timestamp: Date.now(),
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    const point = getCanvasPoint(e)
    if (!point) return

    setIsDrawing(true)
    setCurrentStroke([point])
    setAnalysis(null)
    setError(null)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return

    const point = getCanvasPoint(e)
    if (!point) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    const newStroke = [...currentStroke, point]
    setCurrentStroke(newStroke)

    // Draw the new segment
    ctx.strokeStyle = '#1f2937'
    ctx.lineWidth = 4
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    if (currentStroke.length > 0) {
      const lastPoint = currentStroke[currentStroke.length - 1]
      ctx.beginPath()
      ctx.moveTo(lastPoint.x, lastPoint.y)
      ctx.lineTo(point.x, point.y)
      ctx.stroke()
    }
  }

  const stopDrawing = () => {
    if (isDrawing && currentStroke.length > 0) {
      setStrokes([...strokes, { points: currentStroke }])
      setCurrentStroke([])
    }
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx || !canvas) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawGrid(ctx, canvas.width, canvas.height)
    setStrokes([])
    setCurrentStroke([])
    setAnalysis(null)
    setError(null)
  }

  const undoStroke = () => {
    if (strokes.length > 0) {
      setStrokes(strokes.slice(0, -1))
      setAnalysis(null)
    }
  }

  const submitHandwriting = async () => {
    if (strokes.length === 0) {
      setError('Please draw the kanji first')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/handwriting/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          kanji: kanji,
          practiceData: { strokes },
          practiceMode: 'free',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze handwriting')
      }

      const data = await response.json()
      setAnalysis(data.analysis)

      // Track kanji practice
      const accuracy = data.analysis?.accuracyScore || 0
      trackKanjiPracticed(kanji, accuracy, strokes.length)

      // Track mastery if high accuracy
      if (accuracy >= 90) {
        const newAttemptCount = attemptCount + 1
        setAttemptCount(newAttemptCount)
        trackKanjiMastered(kanji, newAttemptCount)
      }

      if (onSubmit) {
        onSubmit(data.analysis)
      }
    } catch (err) {
      console.error('Handwriting submission error:', err)
      const error = err instanceof Error ? err : new Error('Failed to analyze handwriting')
      setError(error.message)

      // Track error
      trackError(error, {
        kanji,
        strokeCount: strokes.length,
        userId,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Canvas */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full aspect-square bg-white dark:bg-gray-900 rounded-2xl border-4 border-gray-300 dark:border-gray-700 cursor-crosshair shadow-lg touch-none"
          style={{ maxWidth: '400px', margin: '0 auto' }}
        />

        {/* Target Kanji Overlay (faded) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
          <span className="text-9xl font-japanese">{kanji}</span>
        </div>

        {/* Stroke Counter */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold shadow-lg">
          {strokes.length} strokes
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 justify-center flex-wrap">
        <button
          onClick={undoStroke}
          disabled={strokes.length === 0 || submitting}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="inline-block w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
            />
          </svg>
          Undo
        </button>

        <button
          onClick={clearCanvas}
          disabled={strokes.length === 0 || submitting}
          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg
            className="inline-block w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Clear
        </button>

        <button
          onClick={submitHandwriting}
          disabled={strokes.length === 0 || submitting}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white rounded-lg font-bold shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <svg
                className="inline-block w-4 h-4 mr-2 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg
                className="inline-block w-4 h-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Check My Writing
            </>
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl">
          <p className="text-red-600 dark:text-red-400 font-semibold">{error}</p>
        </div>
      )}

      {/* Analysis Results */}
      {showFeedback && analysis && (
        <div className="space-y-4">
          {/* Accuracy Score */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-blue-900 dark:text-blue-300">Your Score</h3>
              <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">
                {analysis.accuracyScore}%
              </div>
            </div>
            <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  analysis.accuracyScore >= 80
                    ? 'bg-green-500'
                    : analysis.accuracyScore >= 60
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
                style={{ width: `${analysis.accuracyScore}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-blue-800 dark:text-blue-300">
              {analysis.feedback.overall}
            </p>
          </div>

          {/* Strengths */}
          {analysis.feedback.strengths.length > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6">
              <h4 className="font-bold text-green-900 dark:text-green-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Strengths
              </h4>
              <ul className="space-y-1">
                {analysis.feedback.strengths.map((strength: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2"
                  >
                    <span className="text-green-500">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {analysis.feedback.improvements.length > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-6">
              <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Areas for Improvement
              </h4>
              <ul className="space-y-1">
                {analysis.feedback.improvements.map((improvement: string, index: number) => (
                  <li
                    key={index}
                    className="text-sm text-orange-800 dark:text-orange-300 flex items-start gap-2"
                  >
                    <span className="text-orange-500">→</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Steps - Currently not available in analysis feedback */}
        </div>
      )}
    </div>
  )
}
