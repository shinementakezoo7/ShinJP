/**
 * Kanji Stroke Order Service
 * Fetches and processes kanji stroke order data
 * Data sources: KanjiVG, local database, or fallback generation
 */

export interface StrokeData {
  order: number
  type: string
  svg_path: string
  direction: string
  description: string
}

export interface StrokeOrderData {
  kanji: string
  strokeCount: number
  strokes: StrokeData[]
  radical?: string
  radicalPosition?: string
  radicalMeaning?: string
  animationUrl?: string
  animationSvg?: string
  writingTips?: string[]
  commonMistakes?: Array<{
    mistake: string
    correction: string
    visual: string
  }>
  similarKanji?: string[]
  difficultyRating?: number
  jlptLevel?: string
  joyoGrade?: number
}

// Basic kanji data for common characters
const BASIC_KANJI_DATA: Record<string, StrokeOrderData> = {
  日: {
    kanji: '日',
    strokeCount: 4,
    strokes: [
      {
        order: 1,
        type: 'vertical',
        svg_path: 'M 25 20 L 25 80',
        direction: 'top_to_bottom',
        description: 'Left vertical stroke',
      },
      {
        order: 2,
        type: 'horizontal',
        svg_path: 'M 25 20 L 75 20',
        direction: 'left_to_right',
        description: 'Top horizontal stroke',
      },
      {
        order: 3,
        type: 'horizontal',
        svg_path: 'M 25 80 L 75 80',
        direction: 'left_to_right',
        description: 'Bottom horizontal stroke',
      },
      {
        order: 4,
        type: 'vertical',
        svg_path: 'M 75 20 L 75 80',
        direction: 'top_to_bottom',
        description: 'Right vertical stroke',
      },
    ],
    radical: '日',
    radicalPosition: 'other',
    radicalMeaning: 'sun, day',
    writingTips: [
      'Make it wider than tall (rectangular)',
      'Horizontal strokes stay within vertical strokes',
      'All strokes should be straight',
    ],
    commonMistakes: [
      {
        mistake: 'Making it square',
        correction: 'Make it rectangular (wider)',
        visual: '日 not 口',
      },
    ],
    similarKanji: ['目', '田', '白'],
    difficultyRating: 1,
    jlptLevel: 'N5',
    joyoGrade: 1,
  },

  人: {
    kanji: '人',
    strokeCount: 2,
    strokes: [
      {
        order: 1,
        type: 'diagonal_down_right',
        svg_path: 'M 30 20 L 50 80',
        direction: 'down_right',
        description: 'Left diagonal (pie stroke)',
      },
      {
        order: 2,
        type: 'diagonal_down_right',
        svg_path: 'M 50 40 L 70 80',
        direction: 'down_right',
        description: 'Right diagonal (na stroke)',
      },
    ],
    radical: '人',
    radicalPosition: 'other',
    radicalMeaning: 'person, human',
    writingTips: [
      'Left stroke is steeper than right',
      'Left stroke starts higher',
      'Strokes meet at the bottom forming a V',
    ],
    commonMistakes: [
      {
        mistake: 'Making strokes equal',
        correction: 'Left stroke should be steeper',
        visual: 'Proper vs symmetrical',
      },
    ],
    similarKanji: ['入', '八'],
    difficultyRating: 1,
    jlptLevel: 'N5',
    joyoGrade: 1,
  },

  月: {
    kanji: '月',
    strokeCount: 4,
    strokes: [
      {
        order: 1,
        type: 'vertical',
        svg_path: 'M 25 20 L 25 80',
        direction: 'top_to_bottom',
        description: 'Left vertical stroke',
      },
      {
        order: 2,
        type: 'horizontal',
        svg_path: 'M 25 35 L 75 35',
        direction: 'left_to_right',
        description: 'First horizontal',
      },
      {
        order: 3,
        type: 'horizontal',
        svg_path: 'M 25 50 L 75 50',
        direction: 'left_to_right',
        description: 'Second horizontal',
      },
      {
        order: 4,
        type: 'curve',
        svg_path: 'M 75 20 Q 78 50 75 80',
        direction: 'top_to_bottom',
        description: 'Right curved stroke',
      },
    ],
    radical: '月',
    radicalPosition: 'other',
    radicalMeaning: 'moon, month',
    writingTips: [
      'Right stroke has a gentle curve',
      'Two horizontal strokes divide into thirds',
      'Left stroke is straight vertical',
    ],
    difficultyRating: 2,
    jlptLevel: 'N5',
    joyoGrade: 1,
  },

  火: {
    kanji: '火',
    strokeCount: 4,
    strokes: [
      {
        order: 1,
        type: 'diagonal_down_left',
        svg_path: 'M 50 20 L 30 50',
        direction: 'down_left',
        description: 'Top left diagonal',
      },
      {
        order: 2,
        type: 'diagonal_down_right',
        svg_path: 'M 50 20 L 70 50',
        direction: 'down_right',
        description: 'Top right diagonal',
      },
      {
        order: 3,
        type: 'vertical',
        svg_path: 'M 50 40 L 50 80',
        direction: 'top_to_bottom',
        description: 'Center vertical',
      },
      {
        order: 4,
        type: 'dot',
        svg_path: 'M 35 70 L 38 72',
        direction: 'hook',
        description: 'Bottom left hook',
      },
    ],
    radical: '火',
    radicalPosition: 'bottom',
    radicalMeaning: 'fire',
    writingTips: [
      'Top forms a V shape',
      'Center stroke goes through the V',
      'Bottom hook curves outward',
    ],
    difficultyRating: 2,
    jlptLevel: 'N5',
    joyoGrade: 1,
  },

  水: {
    kanji: '水',
    strokeCount: 4,
    strokes: [
      {
        order: 1,
        type: 'vertical',
        svg_path: 'M 50 10 L 50 50',
        direction: 'top_to_bottom',
        description: 'Center vertical',
      },
      {
        order: 2,
        type: 'diagonal_down_left',
        svg_path: 'M 30 30 L 25 70',
        direction: 'down_left',
        description: 'Left diagonal',
      },
      {
        order: 3,
        type: 'curve',
        svg_path: 'M 40 55 Q 50 60 70 50',
        direction: 'complex',
        description: 'Bottom horizontal with hook',
      },
      {
        order: 4,
        type: 'dot',
        svg_path: 'M 72 40 L 75 42',
        direction: 'down_right',
        description: 'Right dot',
      },
    ],
    radical: '水',
    radicalPosition: 'left',
    radicalMeaning: 'water',
    writingTips: [
      'Center vertical is longest',
      'Bottom stroke has a gentle curve',
      'Right dot is separate',
    ],
    difficultyRating: 2,
    jlptLevel: 'N5',
    joyoGrade: 1,
  },
}

/**
 * Get stroke order data for a kanji
 */
export async function getStrokeOrderData(kanji: string): Promise<StrokeOrderData | null> {
  console.log(`📝 Getting stroke order for: ${kanji}`)

  // Check basic data first
  if (BASIC_KANJI_DATA[kanji]) {
    console.log(`✅ Found in basic kanji data`)
    return BASIC_KANJI_DATA[kanji]
  }

  // TODO: Implement KanjiVG data loading
  // For now, return null for unknown kanji
  console.log(`⚠️  Stroke order not available for: ${kanji}`)
  console.log(`   Add to BASIC_KANJI_DATA or implement KanjiVG loader`)

  return null
}

/**
 * Generate SVG animation for kanji stroke order
 */
export function generateStrokeAnimation(strokes: StrokeData[], _kanji: string): string {
  const animationDuration = 0.8 // seconds per stroke

  let svg = `<svg viewBox="0 0 109 109" xmlns="http://www.w3.org/2000/svg">
  <!-- Grid lines -->
  <line x1="0" y1="54.5" x2="109" y2="54.5" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>
  <line x1="54.5" y1="0" x2="54.5" y2="109" stroke="#ddd" stroke-width="1" stroke-dasharray="2,2"/>
  
  <!-- Strokes with animation -->
`

  strokes.forEach((stroke, index) => {
    const delay = index * animationDuration
    const pathLength = estimatePathLength(stroke.svg_path)

    svg += `  <path 
    d="${stroke.svg_path}" 
    stroke="#000" 
    stroke-width="3" 
    fill="none"
    stroke-dasharray="${pathLength}"
    stroke-dashoffset="${pathLength}">
    <animate 
      attributeName="stroke-dashoffset" 
      from="${pathLength}" 
      to="0" 
      begin="${delay}s" 
      dur="${animationDuration}s" 
      fill="freeze"/>
  </path>
`
  })

  svg += `</svg>`

  return svg
}

/**
 * Estimate SVG path length (rough approximation)
 */
function estimatePathLength(path: string): number {
  // Simple estimation based on path string length
  // In production, use actual SVG path length calculation
  return Math.max(100, path.length * 2)
}

/**
 * Get mnemonics for a kanji
 */
export async function getKanjiMnemonics(_kanji: string): Promise<any[]> {
  // This would query the database
  // For now, return empty array
  return []
}

/**
 * Load KanjiVG data (for future implementation)
 */
export async function loadKanjiVGData(kanji: string): Promise<StrokeOrderData | null> {
  // TODO: Implement KanjiVG XML parsing
  // KanjiVG provides SVG stroke order data for all Jōyō kanji
  // https://github.com/KanjiVG/kanjivg

  console.log(`📥 KanjiVG loader not implemented yet for: ${kanji}`)
  console.log(`   To implement: Parse KanjiVG XML files`)
  console.log(`   Location: https://github.com/KanjiVG/kanjivg/tree/master/kanji`)

  return null
}

export default getStrokeOrderData
