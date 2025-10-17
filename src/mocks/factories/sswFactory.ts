import { SSWSector, SSW_PROGRAMS, SSW_SECTORS } from '@/lib/ssw/sectors-data'

// Mock SSW sector data factory
export interface MockSSWSector extends SSWSector {
  id: string
  name: string
  nameJP: string
  icon: string
  color: string
  gradient: string
  description: string
  jlptLevel: string
  workers: string
  categories: string[]
  keywords: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const createSSWSector = (overrides: Partial<MockSSWSector> = {}): MockSSWSector => {
  const baseSector = SSW_SECTORS[0] // Use first sector as base
  return {
    ...baseSector,
    ...overrides,
  }
}

export const createSSWSectors = (count: number): MockSSWSector[] => {
  // Return first N sectors or all if count exceeds available sectors
  return SSW_SECTORS.slice(0, Math.min(count, SSW_SECTORS.length)).map((sector) => ({
    ...sector,
  }))
}

// Mock SSW program data factory
export interface MockSSWProgram {
  id: string
  name: string
  nameJP: string
  level: string
  description: string
  requirements: string
  icon: string
  color: string
  maxStay: string
  familyBringing: boolean
}

export const createSSWProgram = (overrides: Partial<MockSSWProgram> = {}): MockSSWProgram => {
  const baseProgram = SSW_PROGRAMS[0] // Use first program as base
  return {
    ...baseProgram,
    ...overrides,
  }
}

export const createSSWPrograms = (count: number): MockSSWProgram[] => {
  // Return first N programs or all if count exceeds available programs
  return SSW_PROGRAMS.slice(0, Math.min(count, SSW_PROGRAMS.length)).map((program) => ({
    ...program,
  }))
}

// Mock textbook generation request
export interface MockTextbookRequest {
  title: string
  targetSector: string
  sswType: string
  jlptLevel: number
  chapters: number
  includeExercises: boolean
  includeGlossary: boolean
  userId: string
}

export const createTextbookRequest = (
  overrides: Partial<MockTextbookRequest> = {}
): MockTextbookRequest => {
  return {
    title: 'Test SSW Textbook',
    targetSector: 'nursing-care',
    sswType: 'ssw1',
    jlptLevel: 4,
    chapters: 10,
    includeExercises: true,
    includeGlossary: true,
    userId: 'test-user-id',
    ...overrides,
  }
}
