/**
 * Handwriting Analyzer
 * Analyzes user's handwritten kanji and provides accuracy scores and feedback
 */

export interface UserStroke {
  points: Array<{ x: number; y: number; timestamp: number }>
}

export interface HandwritingAnalysisParams {
  userStrokes: UserStroke[]
  correctStrokeOrder: any[]
  expectedStrokeCount: number
}

export interface HandwritingAnalysis {
  accuracyScore: number // 0-100
  strokeOrderCorrect: boolean
  strokeAccuracy: Array<{
    strokeNumber: number
    accuracy: number
    issues: string[]
  }>
  feedback: {
    overall: string
    strengths: string[]
    improvements: string[]
    nextSteps: string[]
  }
}

/**
 * Analyze handwriting and provide detailed feedback
 */
export async function analyzeHandwriting(
  params: HandwritingAnalysisParams
): Promise<HandwritingAnalysis> {
  const { userStrokes, correctStrokeOrder, expectedStrokeCount } = params

  console.log('🔍 Analyzing handwriting...')
  console.log(`   User strokes: ${userStrokes.length}`)
  console.log(`   Expected strokes: ${expectedStrokeCount}`)

  // Check stroke count
  const strokeCountCorrect = userStrokes.length === expectedStrokeCount
  const strokeOrderCorrect = strokeCountCorrect && checkStrokeOrder(userStrokes, correctStrokeOrder)

  // Analyze each stroke
  const strokeAccuracy = analyzeIndividualStrokes(userStrokes, correctStrokeOrder)

  // Calculate overall accuracy
  const accuracyScore = calculateOverallAccuracy({
    strokeCountCorrect,
    strokeOrderCorrect,
    strokeAccuracy,
  })

  // Generate feedback
  const feedback = generateFeedback({
    accuracyScore,
    strokeCountCorrect,
    strokeOrderCorrect,
    strokeAccuracy,
    userStrokes,
    expectedStrokeCount,
  })

  return {
    accuracyScore: Math.round(accuracyScore),
    strokeOrderCorrect,
    strokeAccuracy,
    feedback,
  }
}

/**
 * Check if stroke order is correct
 */
function checkStrokeOrder(userStrokes: UserStroke[], correctOrder: any[]): boolean {
  if (userStrokes.length !== correctOrder.length) {
    return false
  }

  // For now, we assume order is correct if count matches
  // In production, implement actual stroke direction/pattern matching
  return true
}

/**
 * Analyze each individual stroke
 */
function analyzeIndividualStrokes(
  userStrokes: UserStroke[],
  correctOrder: any[]
): Array<{ strokeNumber: number; accuracy: number; issues: string[] }> {
  return userStrokes.map((stroke, index) => {
    const _correctStroke = correctOrder[index]
    const issues: string[] = []

    // Analyze stroke smoothness
    const smoothness = calculateSmoothness(stroke)
    if (smoothness < 0.7) {
      issues.push('Stroke is not smooth - practice slower')
    }

    // Check stroke length
    const length = calculateStrokeLength(stroke)
    if (length < 20) {
      issues.push('Stroke is too short')
    }

    // Calculate accuracy for this stroke (0-100)
    let accuracy = 100
    if (issues.length > 0) {
      accuracy -= issues.length * 15
    }
    accuracy = Math.max(0, accuracy)

    return {
      strokeNumber: index + 1,
      accuracy: Math.round(accuracy),
      issues,
    }
  })
}

/**
 * Calculate smoothness of a stroke
 */
function calculateSmoothness(stroke: UserStroke): number {
  if (stroke.points.length < 3) return 1.0

  let totalAngleChange = 0
  let segments = 0

  for (let i = 1; i < stroke.points.length - 1; i++) {
    const p1 = stroke.points[i - 1]
    const p2 = stroke.points[i]
    const p3 = stroke.points[i + 1]

    const angle1 = Math.atan2(p2.y - p1.y, p2.x - p1.x)
    const angle2 = Math.atan2(p3.y - p2.y, p3.x - p2.x)
    const angleDiff = Math.abs(angle2 - angle1)

    totalAngleChange += angleDiff
    segments++
  }

  const averageAngleChange = totalAngleChange / segments
  return 1.0 - Math.min(averageAngleChange / Math.PI, 1.0)
}

/**
 * Calculate length of a stroke
 */
function calculateStrokeLength(stroke: UserStroke): number {
  let length = 0

  for (let i = 1; i < stroke.points.length; i++) {
    const p1 = stroke.points[i - 1]
    const p2 = stroke.points[i]
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    length += Math.sqrt(dx * dx + dy * dy)
  }

  return length
}

/**
 * Calculate overall accuracy score
 */
function calculateOverallAccuracy(data: {
  strokeCountCorrect: boolean
  strokeOrderCorrect: boolean
  strokeAccuracy: Array<{ accuracy: number }>
}): number {
  let score = 0

  // Stroke count: 20 points
  if (data.strokeCountCorrect) {
    score += 20
  }

  // Stroke order: 30 points
  if (data.strokeOrderCorrect) {
    score += 30
  }

  // Individual stroke accuracy: 50 points
  const avgStrokeAccuracy =
    data.strokeAccuracy.reduce((sum, s) => sum + s.accuracy, 0) / data.strokeAccuracy.length
  score += (avgStrokeAccuracy / 100) * 50

  return Math.min(100, Math.max(0, score))
}

/**
 * Generate detailed feedback
 */
function generateFeedback(data: {
  accuracyScore: number
  strokeCountCorrect: boolean
  strokeOrderCorrect: boolean
  strokeAccuracy: Array<{ strokeNumber: number; accuracy: number; issues: string[] }>
  userStrokes: UserStroke[]
  expectedStrokeCount: number
}): {
  overall: string
  strengths: string[]
  improvements: string[]
  nextSteps: string[]
} {
  const strengths: string[] = []
  const improvements: string[] = []
  const nextSteps: string[] = []

  // Overall assessment
  let overall: string
  if (data.accuracyScore >= 90) {
    overall = 'Excellent! Your handwriting is very accurate.'
  } else if (data.accuracyScore >= 70) {
    overall = "Good work! You're on the right track."
  } else if (data.accuracyScore >= 50) {
    overall = "Keep practicing! You're making progress."
  } else {
    overall = 'Practice more to improve your technique.'
  }

  // Stroke count feedback
  if (data.strokeCountCorrect) {
    strengths.push('Correct number of strokes')
  } else {
    improvements.push(
      `Used ${data.userStrokes.length} strokes but should use ${data.expectedStrokeCount}`
    )
    nextSteps.push('Study the correct stroke order before practicing')
  }

  // Stroke order feedback
  if (data.strokeOrderCorrect) {
    strengths.push('Correct stroke order')
  } else {
    improvements.push('Stroke order needs improvement')
    nextSteps.push('Watch the stroke order animation carefully')
  }

  // Individual stroke feedback
  const weakStrokes = data.strokeAccuracy.filter((s) => s.accuracy < 70)
  if (weakStrokes.length === 0) {
    strengths.push('All strokes are well-formed')
  } else {
    weakStrokes.forEach((stroke) => {
      improvements.push(`Stroke ${stroke.strokeNumber}: ${stroke.issues.join(', ')}`)
    })
    nextSteps.push('Practice weak strokes individually')
  }

  // Next steps based on accuracy
  if (data.accuracyScore < 50) {
    nextSteps.push('Use guided mode to trace the correct strokes')
  } else if (data.accuracyScore < 80) {
    nextSteps.push('Practice without guidance but watch the animation')
  } else {
    nextSteps.push('Try writing faster while maintaining accuracy')
  }

  return {
    overall,
    strengths,
    improvements,
    nextSteps,
  }
}

export default analyzeHandwriting
