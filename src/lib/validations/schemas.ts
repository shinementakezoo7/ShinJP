import { z } from 'zod'

/**
 * SSW Textbook Generation Schema
 */
export const sswTextbookSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  sswType: z.enum(['SSW1', 'SSW2', 'JFT_BASIC'], {
    required_error: 'SSW type is required',
  }),
  targetSector: z.enum([
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
  ]),
  numberOfChapters: z.number().int().min(3).max(20),
  includeWorkplaceScenarios: z.boolean().default(true),
  includeSafetyVocabulary: z.boolean().default(true),
  includeAudio: z.boolean().default(false),
  userId: z.string().uuid().optional(),
})

export type SSWTextbookInput = z.infer<typeof sswTextbookSchema>

/**
 * Audio Generation Schema
 */
export const audioGenerationSchema = z.object({
  text: z.string().min(1, 'Text is required').max(500, 'Text is too long'),
  speaker: z.enum(['male', 'female', 'child', 'elderly']).default('female'),
  speed: z.enum(['slow', 'normal', 'fast']).default('normal'),
  userId: z.string().uuid().optional(),
})

export type AudioGenerationInput = z.infer<typeof audioGenerationSchema>

/**
 * Handwriting Submission Schema
 */
export const handwritingSubmissionSchema = z.object({
  kanji: z.string().length(1, 'Must be a single kanji character'),
  strokeData: z.array(
    z.object({
      points: z.array(
        z.object({
          x: z.number(),
          y: z.number(),
          timestamp: z.number(),
        })
      ),
    })
  ),
  userId: z.string().uuid(),
})

export type HandwritingSubmissionInput = z.infer<typeof handwritingSubmissionSchema>

/**
 * User Registration Schema
 */
export const userRegistrationSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'Name must be at least 2 characters').optional(),
    targetJLPTLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1']).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>

/**
 * Vocabulary Search Schema
 */
export const vocabularySearchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  jlptLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1', 'ALL']).default('ALL'),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

export type VocabularySearchInput = z.infer<typeof vocabularySearchSchema>

/**
 * Progress Update Schema
 */
export const progressUpdateSchema = z.object({
  userId: z.string().uuid(),
  contentType: z.enum(['textbook', 'chapter', 'vocabulary', 'grammar', 'kanji', 'exercise']),
  contentId: z.string().uuid(),
  completionStatus: z.enum(['not_started', 'in_progress', 'completed', 'mastered']),
  score: z.number().min(0).max(100).optional(),
  timeSpentSeconds: z.number().int().min(0).optional(),
})

export type ProgressUpdateInput = z.infer<typeof progressUpdateSchema>
