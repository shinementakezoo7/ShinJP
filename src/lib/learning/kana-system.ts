// Kana Learning System - Complete implementation for Hiragana and Katakana
import { supabase } from '@/lib/supabase/client'

export interface KanaCharacter {
  id: number
  character: string
  type: 'hiragana' | 'katakana'
  romaji: string
  strokeCount: number
  strokeOrderSvg?: string
  audioUrl?: string
  mnemonics?: string
  exampleWords?: Array<{
    word: string
    reading: string
    meaning: string
  }>
}

export interface KanaProgress {
  hiragana_mastery: number
  katakana_mastery: number
  kana_reading_speed?: number
}

export class KanaLearningSystem {
  // Complete Hiragana Chart
  static readonly HIRAGANA_CHART = {
    // Vowels
    vowels: [
      { char: 'あ', romaji: 'a' },
      { char: 'い', romaji: 'i' },
      { char: 'う', romaji: 'u' },
      { char: 'え', romaji: 'e' },
      { char: 'お', romaji: 'o' },
    ],
    // K-row
    k_row: [
      { char: 'か', romaji: 'ka' },
      { char: 'き', romaji: 'ki' },
      { char: 'く', romaji: 'ku' },
      { char: 'け', romaji: 'ke' },
      { char: 'こ', romaji: 'ko' },
    ],
    // S-row
    s_row: [
      { char: 'さ', romaji: 'sa' },
      { char: 'し', romaji: 'shi' },
      { char: 'す', romaji: 'su' },
      { char: 'せ', romaji: 'se' },
      { char: 'そ', romaji: 'so' },
    ],
    // T-row
    t_row: [
      { char: 'た', romaji: 'ta' },
      { char: 'ち', romaji: 'chi' },
      { char: 'つ', romaji: 'tsu' },
      { char: 'て', romaji: 'te' },
      { char: 'と', romaji: 'to' },
    ],
    // N-row
    n_row: [
      { char: 'な', romaji: 'na' },
      { char: 'に', romaji: 'ni' },
      { char: 'ぬ', romaji: 'nu' },
      { char: 'ね', romaji: 'ne' },
      { char: 'の', romaji: 'no' },
    ],
    // H-row
    h_row: [
      { char: 'は', romaji: 'ha' },
      { char: 'ひ', romaji: 'hi' },
      { char: 'ふ', romaji: 'fu' },
      { char: 'へ', romaji: 'he' },
      { char: 'ほ', romaji: 'ho' },
    ],
    // M-row
    m_row: [
      { char: 'ま', romaji: 'ma' },
      { char: 'み', romaji: 'mi' },
      { char: 'む', romaji: 'mu' },
      { char: 'め', romaji: 'me' },
      { char: 'も', romaji: 'mo' },
    ],
    // Y-row
    y_row: [
      { char: 'や', romaji: 'ya' },
      { char: 'ゆ', romaji: 'yu' },
      { char: 'よ', romaji: 'yo' },
    ],
    // R-row
    r_row: [
      { char: 'ら', romaji: 'ra' },
      { char: 'り', romaji: 'ri' },
      { char: 'る', romaji: 'ru' },
      { char: 'れ', romaji: 're' },
      { char: 'ろ', romaji: 'ro' },
    ],
    // W-row
    w_row: [
      { char: 'わ', romaji: 'wa' },
      { char: 'を', romaji: 'wo' },
    ],
    // N
    n: [{ char: 'ん', romaji: 'n' }],

    // Dakuten (voiced)
    dakuten: [
      { char: 'が', romaji: 'ga' },
      { char: 'ぎ', romaji: 'gi' },
      { char: 'ぐ', romaji: 'gu' },
      { char: 'げ', romaji: 'ge' },
      { char: 'ご', romaji: 'go' },
      { char: 'ざ', romaji: 'za' },
      { char: 'じ', romaji: 'ji' },
      { char: 'ず', romaji: 'zu' },
      { char: 'ぜ', romaji: 'ze' },
      { char: 'ぞ', romaji: 'zo' },
      { char: 'だ', romaji: 'da' },
      { char: 'ぢ', romaji: 'ji' },
      { char: 'づ', romaji: 'zu' },
      { char: 'で', romaji: 'de' },
      { char: 'ど', romaji: 'do' },
      { char: 'ば', romaji: 'ba' },
      { char: 'び', romaji: 'bi' },
      { char: 'ぶ', romaji: 'bu' },
      { char: 'べ', romaji: 'be' },
      { char: 'ぼ', romaji: 'bo' },
    ],

    // Handakuten
    handakuten: [
      { char: 'ぱ', romaji: 'pa' },
      { char: 'ぴ', romaji: 'pi' },
      { char: 'ぷ', romaji: 'pu' },
      { char: 'ぺ', romaji: 'pe' },
      { char: 'ぽ', romaji: 'po' },
    ],

    // Yoon (combination sounds)
    yoon: [
      { char: 'きゃ', romaji: 'kya' },
      { char: 'きゅ', romaji: 'kyu' },
      { char: 'きょ', romaji: 'kyo' },
      { char: 'しゃ', romaji: 'sha' },
      { char: 'しゅ', romaji: 'shu' },
      { char: 'しょ', romaji: 'sho' },
      { char: 'ちゃ', romaji: 'cha' },
      { char: 'ちゅ', romaji: 'chu' },
      { char: 'ちょ', romaji: 'cho' },
      { char: 'にゃ', romaji: 'nya' },
      { char: 'にゅ', romaji: 'nyu' },
      { char: 'にょ', romaji: 'nyo' },
      { char: 'ひゃ', romaji: 'hya' },
      { char: 'ひゅ', romaji: 'hyu' },
      { char: 'ひょ', romaji: 'hyo' },
      { char: 'みゃ', romaji: 'mya' },
      { char: 'みゅ', romaji: 'myu' },
      { char: 'みょ', romaji: 'myo' },
      { char: 'りゃ', romaji: 'rya' },
      { char: 'りゅ', romaji: 'ryu' },
      { char: 'りょ', romaji: 'ryo' },
    ],
  }

  // Complete Katakana Chart
  static readonly KATAKANA_CHART = {
    // Vowels
    vowels: [
      { char: 'ア', romaji: 'a' },
      { char: 'イ', romaji: 'i' },
      { char: 'ウ', romaji: 'u' },
      { char: 'エ', romaji: 'e' },
      { char: 'オ', romaji: 'o' },
    ],
    // K-row
    k_row: [
      { char: 'カ', romaji: 'ka' },
      { char: 'キ', romaji: 'ki' },
      { char: 'ク', romaji: 'ku' },
      { char: 'ケ', romaji: 'ke' },
      { char: 'コ', romaji: 'ko' },
    ],
    // S-row
    s_row: [
      { char: 'サ', romaji: 'sa' },
      { char: 'シ', romaji: 'shi' },
      { char: 'ス', romaji: 'su' },
      { char: 'セ', romaji: 'se' },
      { char: 'ソ', romaji: 'so' },
    ],
    // T-row
    t_row: [
      { char: 'タ', romaji: 'ta' },
      { char: 'チ', romaji: 'chi' },
      { char: 'ツ', romaji: 'tsu' },
      { char: 'テ', romaji: 'te' },
      { char: 'ト', romaji: 'to' },
    ],
    // N-row
    n_row: [
      { char: 'ナ', romaji: 'na' },
      { char: 'ニ', romaji: 'ni' },
      { char: 'ヌ', romaji: 'nu' },
      { char: 'ネ', romaji: 'ne' },
      { char: 'ノ', romaji: 'no' },
    ],
    // H-row
    h_row: [
      { char: 'ハ', romaji: 'ha' },
      { char: 'ヒ', romaji: 'hi' },
      { char: 'フ', romaji: 'fu' },
      { char: 'ヘ', romaji: 'he' },
      { char: 'ホ', romaji: 'ho' },
    ],
    // M-row
    m_row: [
      { char: 'マ', romaji: 'ma' },
      { char: 'ミ', romaji: 'mi' },
      { char: 'ム', romaji: 'mu' },
      { char: 'メ', romaji: 'me' },
      { char: 'モ', romaji: 'mo' },
    ],
    // Y-row
    y_row: [
      { char: 'ヤ', romaji: 'ya' },
      { char: 'ユ', romaji: 'yu' },
      { char: 'ヨ', romaji: 'yo' },
    ],
    // R-row
    r_row: [
      { char: 'ラ', romaji: 'ra' },
      { char: 'リ', romaji: 'ri' },
      { char: 'ル', romaji: 'ru' },
      { char: 'レ', romaji: 're' },
      { char: 'ロ', romaji: 'ro' },
    ],
    // W-row
    w_row: [
      { char: 'ワ', romaji: 'wa' },
      { char: 'ヲ', romaji: 'wo' },
    ],
    // N
    n: [{ char: 'ン', romaji: 'n' }],

    // Extended katakana for foreign words
    extended: [
      { char: 'ヴァ', romaji: 'va' },
      { char: 'ヴィ', romaji: 'vi' },
      { char: 'ヴ', romaji: 'vu' },
      { char: 'ヴェ', romaji: 've' },
      { char: 'ヴォ', romaji: 'vo' },
      { char: 'ファ', romaji: 'fa' },
      { char: 'フィ', romaji: 'fi' },
      { char: 'フェ', romaji: 'fe' },
      { char: 'フォ', romaji: 'fo' },
      { char: 'ウィ', romaji: 'wi' },
      { char: 'ウェ', romaji: 'we' },
      { char: 'ウォ', romaji: 'wo' },
      { char: 'ティ', romaji: 'ti' },
      { char: 'ディ', romaji: 'di' },
      { char: 'トゥ', romaji: 'tu' },
      { char: 'ドゥ', romaji: 'du' },
    ],
  }

  // Get all kana characters for a specific type and level
  static getKanaByLevel(
    type: 'hiragana' | 'katakana',
    level: 'beginner' | 'intermediate' | 'advanced'
  ) {
    const chart =
      type === 'hiragana' ? KanaLearningSystem.HIRAGANA_CHART : KanaLearningSystem.KATAKANA_CHART

    switch (level) {
      case 'beginner':
        return [...chart.vowels, ...chart.k_row, ...chart.s_row, ...chart.t_row, ...chart.n_row]
      case 'intermediate':
        return [
          ...chart.h_row,
          ...chart.m_row,
          ...chart.y_row,
          ...chart.r_row,
          ...chart.w_row,
          ...chart.n,
          ...(chart.dakuten || []),
          ...(chart.handakuten || []),
        ]
      case 'advanced':
        return [...(chart.yoon || []), ...(chart.extended || [])]
      default:
        return []
    }
  }

  // Get learning progression path
  static getProgressionPath(currentMastery: number): {
    nextGroup: string
    characters: Array<{ char: string; romaji: string }>
    type: 'hiragana' | 'katakana'
  } {
    // Start with hiragana
    if (currentMastery < 20) {
      return {
        nextGroup: 'Hiragana Vowels',
        characters: KanaLearningSystem.HIRAGANA_CHART.vowels,
        type: 'hiragana',
      }
    } else if (currentMastery < 40) {
      return {
        nextGroup: 'Hiragana K & S rows',
        characters: [
          ...KanaLearningSystem.HIRAGANA_CHART.k_row,
          ...KanaLearningSystem.HIRAGANA_CHART.s_row,
        ],
        type: 'hiragana',
      }
    } else if (currentMastery < 60) {
      return {
        nextGroup: 'Katakana Vowels',
        characters: KanaLearningSystem.KATAKANA_CHART.vowels,
        type: 'katakana',
      }
    } else if (currentMastery < 80) {
      return {
        nextGroup: 'Katakana K & S rows',
        characters: [
          ...KanaLearningSystem.KATAKANA_CHART.k_row,
          ...KanaLearningSystem.KATAKANA_CHART.s_row,
        ],
        type: 'katakana',
      }
    } else {
      return {
        nextGroup: 'Advanced Combinations',
        characters: [...KanaLearningSystem.HIRAGANA_CHART.yoon.slice(0, 5)],
        type: 'hiragana',
      }
    }
  }

  // Fetch kana from database
  static async fetchKanaCharacters(type?: 'hiragana' | 'katakana'): Promise<KanaCharacter[]> {
    let query = supabase
      .from('kana_characters')
      .select('*')
      .order('position_in_chart', { ascending: true })

    if (type) {
      query = query.eq('type', type)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching kana:', error)
      return []
    }

    return data as KanaCharacter[]
  }

  // Get user's kana progress
  static async getUserKanaProgress(userId: string): Promise<KanaProgress | null> {
    const { data, error } = await supabase
      .from('user_japanese_progress')
      .select('hiragana_mastery, katakana_mastery, kana_reading_speed')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching kana progress:', error)
      return null
    }

    return data as KanaProgress
  }

  // Update user's kana progress
  static async updateKanaProgress(
    userId: string,
    type: 'hiragana' | 'katakana',
    newMastery: number
  ): Promise<boolean> {
    const column = type === 'hiragana' ? 'hiragana_mastery' : 'katakana_mastery'

    const { error } = await supabase.from('user_japanese_progress').upsert(
      {
        user_id: userId,
        [column]: newMastery,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    )

    if (error) {
      console.error('Error updating kana progress:', error)
      return false
    }

    return true
  }

  // Generate kana practice exercises
  static generatePracticeExercise(
    type: 'hiragana' | 'katakana',
    exerciseType: 'recognition' | 'writing' | 'mixed',
    count: number = 10
  ) {
    const chart =
      type === 'hiragana' ? KanaLearningSystem.HIRAGANA_CHART : KanaLearningSystem.KATAKANA_CHART
    const allCharacters = [
      ...chart.vowels,
      ...chart.k_row,
      ...chart.s_row,
      ...chart.t_row,
      ...chart.n_row,
      ...chart.h_row,
      ...chart.m_row,
      ...chart.y_row,
      ...chart.r_row,
      ...chart.w_row,
      ...chart.n,
    ]

    // Shuffle and select random characters
    const shuffled = allCharacters.sort(() => Math.random() - 0.5)
    const selected = shuffled.slice(0, count)

    return selected.map((item) => {
      if (exerciseType === 'recognition') {
        // Show character, ask for romaji
        return {
          question: item.char,
          answer: item.romaji,
          type: 'recognition',
        }
      } else if (exerciseType === 'writing') {
        // Show romaji, ask for character
        return {
          question: item.romaji,
          answer: item.char,
          type: 'writing',
        }
      } else {
        // Mixed - randomly choose
        const isRecognition = Math.random() > 0.5
        return {
          question: isRecognition ? item.char : item.romaji,
          answer: isRecognition ? item.romaji : item.char,
          type: isRecognition ? 'recognition' : 'writing',
        }
      }
    })
  }

  // Check if character is hiragana
  static isHiragana(char: string): boolean {
    return /[\u3040-\u309F]/.test(char)
  }

  // Check if character is katakana
  static isKatakana(char: string): boolean {
    return /[\u30A0-\u30FF]/.test(char)
  }

  // Convert hiragana to katakana
  static hiraganaToKatakana(text: string): string {
    return text.replace(/[\u3041-\u3096]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) + 0x60)
    })
  }

  // Convert katakana to hiragana
  static katakanaToHiragana(text: string): string {
    return text.replace(/[\u30A1-\u30F6]/g, (match) => {
      return String.fromCharCode(match.charCodeAt(0) - 0x60)
    })
  }

  // Get similar looking kana (commonly confused)
  static getSimilarKana(character: string): string[] {
    const similarPairs: { [key: string]: string[] } = {
      // Hiragana
      ね: ['れ', 'わ'],
      れ: ['ね', 'わ'],
      わ: ['ね', 'れ'],
      ぬ: ['め'],
      め: ['ぬ'],
      る: ['ろ'],
      ろ: ['る'],
      は: ['ほ'],
      ほ: ['は'],

      // Katakana
      シ: ['ツ'],
      ツ: ['シ'],
      ソ: ['ン'],
      ン: ['ソ'],
      ク: ['ケ', 'タ'],
      ケ: ['ク'],
      タ: ['ク', 'ヌ'],
      ヌ: ['タ', 'ス'],
      ス: ['ヌ'],
    }

    return similarPairs[character] || []
  }

  // Generate mnemonics for kana
  static getMnemonic(character: string): string {
    const mnemonics: { [key: string]: string } = {
      // Hiragana mnemonics
      あ: '"Ah!" you say as you look at this letter that looks like an "a"',
      い: 'Two "i"vy vines growing side by side',
      う: 'Looks like an "oo"zing sideways "u"',
      え: 'An "e"legant person doing a dance',
      お: '"Oh!" - a golf ball on a tee',

      // Katakana mnemonics
      ア: 'An "a"xe leaning against a wall',
      イ: 'An "ea"gle spreading its wings',
      ウ: 'An "oo"pen box from above',
      エ: 'An "e"levator door',
      オ: '"Oh!" - a man doing a karate kick',

      // Add more mnemonics...
    }

    return mnemonics[character] || 'Create your own memory aid for this character!'
  }
}
