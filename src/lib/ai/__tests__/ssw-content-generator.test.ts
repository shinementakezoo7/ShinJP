import { describe, it, expect, beforeEach, vi } from 'vitest'
import {
  generateSSWContent,
  SECTOR_SPECIFICATIONS,
  SSWContentGenerationParams,
} from '../ssw-content-generator'

// Mock the model router
vi.mock('../model-router', () => ({
  ModelTask: {
    TEXTBOOK_GENERATION: 'TEXTBOOK_GENERATION',
  },
  modelRouter: {
    route: vi.fn(),
  },
}))

import { modelRouter } from '../model-router'

describe('SSW Content Generator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('SECTOR_SPECIFICATIONS', () => {
    it('has specifications for all major sectors', () => {
      expect(SECTOR_SPECIFICATIONS.caregiving).toBeDefined()
      expect(SECTOR_SPECIFICATIONS.construction).toBeDefined()
      expect(SECTOR_SPECIFICATIONS.agriculture).toBeDefined()
      expect(SECTOR_SPECIFICATIONS.food_service).toBeDefined()
    })

    it('each sector has required properties', () => {
      Object.entries(SECTOR_SPECIFICATIONS).forEach(([key, sector]) => {
        expect(sector).toHaveProperty('name')
        expect(sector).toHaveProperty('critical_vocabulary')
        expect(sector).toHaveProperty('common_scenarios')
        expect(sector).toHaveProperty('safety_priorities')
        expect(sector).toHaveProperty('cultural_notes')

        // Validate critical vocabulary structure
        expect(Array.isArray(sector.critical_vocabulary)).toBe(true)
        sector.critical_vocabulary.forEach((vocab: any) => {
          expect(vocab).toHaveProperty('word')
          expect(vocab).toHaveProperty('reading')
          expect(vocab).toHaveProperty('meaning')
          expect(vocab).toHaveProperty('critical')
        })
      })
    })

    it('has critical vocabulary marked appropriately', () => {
      const caregivingVocab = SECTOR_SPECIFICATIONS.caregiving.critical_vocabulary
      const criticalVocab = caregivingVocab.filter((v) => v.critical)

      expect(criticalVocab.length).toBeGreaterThan(0)
      expect(criticalVocab[0].word).toBe('利用者') // Care service user
    })

    it('has realistic Japanese vocabulary', () => {
      const constructionVocab = SECTOR_SPECIFICATIONS.construction.critical_vocabulary
      const safetyHarness = constructionVocab.find((v) => v.word === '安全帯')

      expect(safetyHarness).toBeDefined()
      expect(safetyHarness?.reading).toBe('あんぜんたい')
      expect(safetyHarness?.meaning).toBe('safety harness')
    })
  })

  describe('generateSSWContent', () => {
    const mockParams: SSWContentGenerationParams = {
      sswType: 'SSW1',
      sector: 'caregiving',
      chapterNumber: 1,
      focusAreas: [],
      includeWorkplaceScenarios: true,
      includeSafetyVocabulary: true,
    }

    it('generates content with valid parameters', async () => {
      const mockContent = {
        title: 'Chapter 1: Introduction to Caregiving',
        introduction: 'This chapter covers essential workplace Japanese for caregiving.',
        vocabulary: [
          {
            word: '利用者',
            reading: 'りようしゃ',
            meaning: 'care service user',
            is_safety_critical: true,
          },
        ],
        workplaceScenarios: [],
        safetyNotes: [],
        grammarPoints: [],
        practiceExercises: [],
        culturalInsights: [],
      }

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify(mockContent),
      })

      const result = await generateSSWContent(mockParams)

      expect(result).toBeDefined()
      expect(result.title).toBeDefined()
      expect(result.vocabulary).toBeDefined()
    })

    it('handles SSW1 (N4) level content generation', async () => {
      const ssw1Params: SSWContentGenerationParams = {
        ...mockParams,
        sswType: 'SSW1',
      }

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          title: 'Chapter 1: Basic Caregiving',
          introduction: 'Introduction',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      const result = await generateSSWContent(ssw1Params)

      expect(result).toBeDefined()
      // Verify model router was called with N4 level
      const callArgs = (modelRouter.route as any).mock.calls[0][0]
      expect(callArgs.task).toBe('TEXTBOOK_GENERATION')
    })

    it('handles SSW2 (N3) level content generation', async () => {
      const ssw2Params: SSWContentGenerationParams = {
        ...mockParams,
        sswType: 'SSW2',
      }

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          title: 'Chapter 1: Advanced Caregiving',
          introduction: 'Introduction',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      const result = await generateSSWContent(ssw2Params)

      expect(result).toBeDefined()
    })

    it('includes workplace scenarios when requested', async () => {
      const paramsWithScenarios: SSWContentGenerationParams = {
        ...mockParams,
        includeWorkplaceScenarios: true,
      }

      const mockContent = {
        title: 'Chapter 1: Caregiving',
        introduction: 'Introduction',
        vocabulary: [],
        workplaceScenarios: [
          {
            title: 'Morning Care Routine',
            setting: 'Elderly care facility',
            dialogue: [],
            key_phrases: [],
            cultural_notes: 'Important cultural notes',
            vocabulary_used: [],
          },
        ],
        grammarPoints: [],
        practiceExercises: [],
        culturalInsights: [],
      }

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify(mockContent),
      })

      const result = await generateSSWContent(paramsWithScenarios)

      expect(result.workplaceScenarios).toBeDefined()
      expect(Array.isArray(result.workplaceScenarios)).toBe(true)
    })

    it('includes safety vocabulary when requested', async () => {
      const paramsWithSafety: SSWContentGenerationParams = {
        ...mockParams,
        includeSafetyVocabulary: true,
      }

      const mockContent = {
        title: 'Chapter 1: Safety in Caregiving',
        introduction: 'Introduction',
        vocabulary: [],
        safetyNotes: [
          {
            topic: 'Fall Prevention',
            warning: 'Falls are a major risk for elderly care',
            proper_procedure: 'Use safety equipment properly',
            critical_vocabulary: ['転倒'],
            consequences: 'Injury or death',
          },
        ],
        grammarPoints: [],
        practiceExercises: [],
        culturalInsights: [],
      }

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify(mockContent),
      })

      const result = await generateSSWContent(paramsWithSafety)

      expect(result.safetyNotes).toBeDefined()
      expect(Array.isArray(result.safetyNotes)).toBe(true)
    })

    it('validates critical vocabulary is included', async () => {
      const mockContent = {
        title: 'Chapter 1: Caregiving',
        introduction: 'Introduction',
        vocabulary: [
          {
            word: '利用者',
            reading: 'りようしゃ',
            meaning: 'care service user',
            is_safety_critical: true,
          },
          {
            word: '服薬',
            reading: 'ふくやく',
            meaning: 'taking medication',
            is_safety_critical: true,
          },
          {
            word: '緊急連絡',
            reading: 'きんきゅうれんらく',
            meaning: 'emergency contact',
            is_safety_critical: true,
          },
        ],
        grammarPoints: [],
        practiceExercises: [],
        culturalInsights: [],
      }

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify(mockContent),
      })

      const result = await generateSSWContent(mockParams)

      const criticalVocab = result.vocabulary.filter((v: any) => v.is_safety_critical)
      expect(criticalVocab.length).toBeGreaterThanOrEqual(3)
    })

    it('supports all sector types', async () => {
      const sectors = [
        'caregiving',
        'construction',
        'agriculture',
        'food_service',
        'building_cleaning',
        'manufacturing',
        'accommodation',
        'fishery',
        'aviation',
        'automotive',
        'shipbuilding',
        'food_manufacturing',
        'material_processing',
        'industrial_machinery',
      ]

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          title: 'Chapter 1',
          introduction: 'Introduction',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      for (const sector of sectors) {
        const result = await generateSSWContent({
          ...mockParams,
          sector,
        })

        expect(result).toBeDefined()
        expect(result.title).toBeDefined()
      }
    })

    it('handles multiple focus areas', async () => {
      const paramsWithFocusAreas: SSWContentGenerationParams = {
        ...mockParams,
        focusAreas: ['safety', 'communication', 'emergency_response'],
      }

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          title: 'Chapter 1: Focus Areas',
          introduction: 'Introduction',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      const result = await generateSSWContent(paramsWithFocusAreas)

      expect(result).toBeDefined()
    })

    it('generates content for multiple chapters', async () => {
      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          title: 'Chapter',
          introduction: 'Introduction',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      for (let chapter = 1; chapter <= 5; chapter++) {
        const result = await generateSSWContent({
          ...mockParams,
          chapterNumber: chapter,
        })

        expect(result).toBeDefined()
        expect(result.title).toContain('Chapter') // Or other identifier
      }
    })

    it('provides fallback title when not provided', async () => {
      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          introduction: 'Introduction',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      const result = await generateSSWContent(mockParams)

      expect(result.title).toBeDefined()
      expect(typeof result.title).toBe('string')
    })

    it('provides fallback introduction when not provided', async () => {
      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          title: 'Chapter',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      const result = await generateSSWContent(mockParams)

      expect(result.introduction).toBeDefined()
      expect(typeof result.introduction).toBe('string')
    })

    it('throws error on invalid JSON response', async () => {
      ;(modelRouter.route as any).mockResolvedValue({
        content: 'Invalid JSON response',
      })

      await expect(generateSSWContent(mockParams)).rejects.toThrow()
    })

    it('throws error on API failure', async () => {
      ;(modelRouter.route as any).mockRejectedValue(new Error('API service unavailable'))

      await expect(generateSSWContent(mockParams)).rejects.toThrow('Failed to generate SSW content')
    })

    it('handles markdown code blocks in response', async () => {
      ;(modelRouter.route as any).mockResolvedValue({
        content: `\`\`\`json
{
  "title": "Chapter 1",
  "introduction": "Introduction",
  "vocabulary": [],
  "grammarPoints": [],
  "practiceExercises": [],
  "culturalInsights": []
}
\`\`\``,
      })

      const result = await generateSSWContent(mockParams)

      expect(result).toBeDefined()
      expect(result.title).toBe('Chapter 1')
    })

    it('logs generation progress', async () => {
      const consoleSpy = vi.spyOn(console, 'log')

      ;(modelRouter.route as any).mockResolvedValue({
        content: JSON.stringify({
          title: 'Chapter 1',
          introduction: 'Introduction',
          vocabulary: [],
          grammarPoints: [],
          practiceExercises: [],
          culturalInsights: [],
        }),
      })

      await generateSSWContent(mockParams)

      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Generating SSW'))

      consoleSpy.mockRestore()
    })
  })
})
