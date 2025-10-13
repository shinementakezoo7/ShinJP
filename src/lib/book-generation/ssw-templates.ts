/**
 * SSW Sector Book Templates
 *
 * Comprehensive templates for generating 500-page textbooks
 * for all 14 Specified Skilled Worker sectors
 *
 * Based on 360+ research sources and actual SSW requirements
 */

import type { BookTemplate } from './types'

export const SSW_SECTORS = [
  'caregiving',
  'construction',
  'agriculture',
  'food_service',
  'building_cleaning',
  'manufacturing',
  'accommodation',
  'shipbuilding',
  'automotive_repair',
  'aviation',
  'fishery',
  'food_manufacturing',
  'industrial_machinery',
  'electrical_electronics',
] as const

export type SSWSector = (typeof SSW_SECTORS)[number]

export const SSW_SECTOR_INFO: Record<
  SSWSector,
  {
    name: string
    japaneseeName: string
    description: string
    vocabularyTarget: number
    safetyFocus: boolean
    customerFacing: boolean
  }
> = {
  caregiving: {
    name: 'Caregiving',
    japaneseeName: '介護',
    description: 'Elderly and disabled care services',
    vocabularyTarget: 1000,
    safetyFocus: true,
    customerFacing: true,
  },
  construction: {
    name: 'Construction',
    japaneseeName: '建設',
    description: 'Building construction and site work',
    vocabularyTarget: 500,
    safetyFocus: true,
    customerFacing: false,
  },
  agriculture: {
    name: 'Agriculture',
    japaneseeName: '農業',
    description: 'Farming and crop cultivation',
    vocabularyTarget: 500,
    safetyFocus: true,
    customerFacing: false,
  },
  food_service: {
    name: 'Food Service',
    japaneseeName: '外食業',
    description: 'Restaurants and food preparation',
    vocabularyTarget: 500,
    safetyFocus: true,
    customerFacing: true,
  },
  building_cleaning: {
    name: 'Building Cleaning',
    japaneseeName: 'ビルクリーニング',
    description: 'Commercial facility cleaning and maintenance',
    vocabularyTarget: 300,
    safetyFocus: true,
    customerFacing: false,
  },
  manufacturing: {
    name: 'Manufacturing',
    japaneseeName: '製造業',
    description: 'Industrial production and assembly',
    vocabularyTarget: 350,
    safetyFocus: true,
    customerFacing: false,
  },
  accommodation: {
    name: 'Accommodation',
    japaneseeName: '宿泊',
    description: 'Hotels and hospitality services',
    vocabularyTarget: 300,
    safetyFocus: false,
    customerFacing: true,
  },
  shipbuilding: {
    name: 'Shipbuilding',
    japaneseeName: '造船・舶用工業',
    description: 'Ship construction and marine engineering',
    vocabularyTarget: 400,
    safetyFocus: true,
    customerFacing: false,
  },
  automotive_repair: {
    name: 'Automotive Repair',
    japaneseeName: '自動車整備',
    description: 'Vehicle maintenance and repair',
    vocabularyTarget: 400,
    safetyFocus: true,
    customerFacing: true,
  },
  aviation: {
    name: 'Aviation',
    japaneseeName: '航空',
    description: 'Airport ground operations and aircraft maintenance',
    vocabularyTarget: 350,
    safetyFocus: true,
    customerFacing: true,
  },
  fishery: {
    name: 'Fishery & Aquaculture',
    japaneseeName: '漁業',
    description: 'Fishing and aquaculture operations',
    vocabularyTarget: 400,
    safetyFocus: true,
    customerFacing: false,
  },
  food_manufacturing: {
    name: 'Food Manufacturing',
    japaneseeName: '飲食料品製造業',
    description: 'Food processing and production',
    vocabularyTarget: 350,
    safetyFocus: true,
    customerFacing: false,
  },
  industrial_machinery: {
    name: 'Industrial Machinery',
    japaneseeName: '産業機械製造業',
    description: 'Machine manufacturing and assembly',
    vocabularyTarget: 350,
    safetyFocus: true,
    customerFacing: false,
  },
  electrical_electronics: {
    name: 'Electrical & Electronics',
    japaneseeName: '電気・電子情報関連産業',
    description: 'Electronics manufacturing and assembly',
    vocabularyTarget: 350,
    safetyFocus: true,
    customerFacing: false,
  },
}

/**
 * Generate SSW sector book template
 */
export function getSSWSectorTemplate(sector: SSWSector): BookTemplate {
  const info = SSW_SECTOR_INFO[sector]

  return {
    id: `ssw_${sector}`,
    name: `SSW ${info.name} - Complete Japanese Textbook`,
    description: `Comprehensive 500-page Japanese language textbook for SSW ${info.name} sector workers. Covers workplace vocabulary, essential grammar, cultural context, safety procedures, and test preparation.`,
    templateType: 'ssw_sector',
    structure: {
      parts: [
        {
          title: 'Part 1: Foundation & SSW Requirements',
          chapters: 5,
          pages: 100,
          sections: [
            'Chapter 1: SSW Program & Visa Requirements',
            'Chapter 2: Japanese Workplace Culture & Etiquette',
            'Chapter 3: Essential Japanese Grammar (N5-N4)',
            'Chapter 4: Keigo & Honorific Language Basics',
            'Chapter 5: Safety Vocabulary & Emergency Procedures',
          ],
        },
        {
          title: 'Part 2: Core Vocabulary',
          chapters: 5,
          pages: 150,
          sections: [
            `Chapter 6: ${info.name} Equipment & Tools`,
            `Chapter 7: Daily ${info.name} Operations`,
            `Chapter 8: Technical Terminology`,
            `Chapter 9: Safety & Compliance Vocabulary`,
            info.customerFacing
              ? `Chapter 10: Customer/Client Communication`
              : `Chapter 10: Team Communication`,
          ],
        },
        {
          title: 'Part 3: Practical Workplace Skills',
          chapters: 5,
          pages: 150,
          sections: [
            `Chapter 11: Morning Meetings & Daily Routines`,
            `Chapter 12: ${info.name} Procedures & Best Practices`,
            `Chapter 13: Problem-Solving Scenarios`,
            `Chapter 14: Working with Supervisors`,
            `Chapter 15: Documentation & Reporting`,
          ],
        },
        {
          title: 'Part 4: Advanced Topics & Integration',
          chapters: 4,
          pages: 80,
          sections: [
            `Chapter 16: ${info.name} Regulations & Standards`,
            `Chapter 17: Quality Control & Excellence`,
            `Chapter 18: Career Development Pathways`,
            `Chapter 19: Cultural Integration & Life in Japan`,
          ],
        },
        {
          title: 'Part 5: Test Preparation & Assessment',
          chapters: 6,
          pages: 20,
          sections: [
            'Chapter 20: JFT-Basic Test Overview & Strategy',
            'Chapter 21: JFT-Basic Practice Questions (Part 1)',
            'Chapter 22: JFT-Basic Practice Questions (Part 2)',
            `Chapter 23: ${info.name} Skills Test Guide`,
            `Chapter 24: ${info.name} Skills Test Practice`,
            'Chapter 25: Mock Interviews & Final Preparation',
          ],
        },
      ],
      totalChapters: 25,
      totalPages: 500,
    },
    contentRequirements: {
      vocabularyPerChapter: Math.ceil(info.vocabularyTarget / 25),
      grammarPointsPerChapter: 10,
      examplesPerGrammar: 5,
      dialoguesPerChapter: 2,
      exercisesPerChapter: 10,
      minWordCount: 4000,
      maxWordCount: 8000,
    },
    validationRules: {
      requireSafetyContent: info.safetyFocus,
      requireCulturalNotes: true,
      jlptCompliance: true,
      minVocabulary: 30,
      minGrammarPoints: 8,
    },
    prompts: {
      chapterPrompt: `You are creating Chapter {chapter_number} of a comprehensive Japanese textbook for SSW ${info.name} workers.

**Sector**: ${info.name} (${info.japaneseeName})
**Chapter Title**: {chapter_title}
**Target Audience**: Foreign workers preparing for SSW visa in ${info.name} sector
**JLPT Level**: N4-N3 (intermediate workplace Japanese)

**Chapter Requirements**:
- Must include {vocabulary_count} sector-specific vocabulary terms
- Must include {grammar_count} grammar points with workplace examples
- Must include 2 realistic workplace dialogues
- Must include 10 practice exercises
${info.safetyFocus ? '- Must highlight safety-critical information with ⚠️ warnings' : ''}
${info.customerFacing ? '- Must include customer/client interaction phrases' : ''}

**Content Structure**:
1. Introduction (2-3 paragraphs explaining chapter importance)
2. Main Content Sections (3-4 detailed sections)
3. Vocabulary with readings, meanings, and example sentences
4. Grammar points with formation rules and examples
5. Workplace dialogues with translations and cultural notes
6. Practice exercises with answers

**Quality Standards**:
- Natural, authentic Japanese appropriate for workplace
- Clear English explanations
- Cultural context integrated throughout
- Safety information clearly marked
- JLPT N4-N3 level compliance

Generate the complete chapter content in structured format.`,

      vocabularyPrompt: `Generate a comprehensive vocabulary section for ${info.name} sector.

**Requirements**:
- {count} vocabulary terms
- Each term must include: kanji/kana, reading (hiragana), romaji, English meaning
- 2-3 example sentences per term (Japanese with English translation)
- Usage notes and context
${info.safetyFocus ? '- Mark safety-critical terms with ⚠️' : ''}
- Group by categories (equipment, actions, materials, etc.)

Make vocabulary practical and immediately useful in ${info.name} workplace.`,

      dialoguePrompt: `Create a realistic workplace dialogue for ${info.name} sector.

**Scenario**: {scenario}
**Participants**: 2-3 people (SSW worker, supervisor, ${info.customerFacing ? 'customer' : 'colleague'})
**Situation**: {situation}

**Requirements**:
- Natural Japanese at N4-N3 level
- Include sector-specific vocabulary
- Use appropriate keigo/formality
- Provide line-by-line translation
- Add cultural notes
- Highlight key phrases
${info.safetyFocus ? '- Include safety communication if relevant' : ''}

Make dialogue authentic to real ${info.name} workplace situations.`,

      exercisePrompt: `Create 10 practice exercises for ${info.name} vocabulary and grammar.

**Exercise Types** (mix of):
- Multiple choice (vocabulary/grammar): 4 questions
- Fill in the blank (workplace situations): 3 questions
- Translation (Japanese ↔ English): 2 questions
- Sentence ordering: 1 question

**Requirements**:
- Use ${info.name} sector vocabulary and scenarios
- Appropriate difficulty (N4-N3 level)
- Clear instructions in English
- Provide correct answers
- Include explanations for each answer
- Make exercises practical and workplace-relevant

Focus on vocabulary and grammar that workers will actually use in ${info.name} sector.`,
    },
  }
}

/**
 * Get all SSW sector templates
 */
export function getAllSSWTemplates(): BookTemplate[] {
  return SSW_SECTORS.map((sector) => getSSWSectorTemplate(sector))
}

/**
 * Get template by sector ID
 */
export function getTemplateById(sectorId: string): BookTemplate | null {
  if (!SSW_SECTORS.includes(sectorId as SSWSector)) {
    return null
  }
  return getSSWSectorTemplate(sectorId as SSWSector)
}
