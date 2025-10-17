// Mock textbook data factory
export interface MockTextbook {
  id: string
  title: string
  description: string
  jlptLevel: string
  sswType: string
  targetSector: string
  totalChapters: number
  status: 'draft' | 'generating' | 'completed' | 'failed'
  createdAt: Date
  updatedAt: Date
  userId: string
  content?: string
  chapters?: MockChapter[]
}

export interface MockChapter {
  id: string
  textbookId: string
  title: string
  content: string
  order: number
  vocabulary: string[]
  grammarPoints: string[]
  exercises: MockExercise[]
}

export interface MockExercise {
  id: string
  chapterId: string
  type: 'vocabulary' | 'grammar' | 'listening' | 'reading'
  question: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
}

export const createTextbook = (overrides: Partial<MockTextbook> = {}): MockTextbook => {
  return {
    id: 'test-textbook-id',
    title: 'Test SSW Textbook',
    description: 'A test textbook for SSW workers',
    jlptLevel: 'N4',
    sswType: 'ssw1',
    targetSector: 'nursing-care',
    totalChapters: 10,
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: 'test-user-id',
    ...overrides,
  }
}

export const createChapter = (overrides: Partial<MockChapter> = {}): MockChapter => {
  return {
    id: 'test-chapter-id',
    textbookId: 'test-textbook-id',
    title: 'Test Chapter',
    content: 'This is test chapter content',
    order: 1,
    vocabulary: ['テスト', '単語', '例文'],
    grammarPoints: ['Test grammar point 1', 'Test grammar point 2'],
    exercises: [],
    ...overrides,
  }
}

export const createExercise = (overrides: Partial<MockExercise> = {}): MockExercise => {
  return {
    id: 'test-exercise-id',
    chapterId: 'test-chapter-id',
    type: 'vocabulary',
    question: 'What does テスト mean?',
    options: ['Test', 'Exam', 'Practice', 'Quiz'],
    correctAnswer: 0,
    explanation: 'テスト means "test" in English',
    ...overrides,
  }
}

export const createTextbooks = (count: number): MockTextbook[] => {
  return Array.from({ length: count }, (_, i) =>
    createTextbook({
      id: `textbook-${i}`,
      title: `Test Textbook ${i + 1}`,
    })
  )
}

export const createChapters = (count: number, textbookId: string): MockChapter[] => {
  return Array.from({ length: count }, (_, i) =>
    createChapter({
      id: `chapter-${i}`,
      textbookId,
      title: `Chapter ${i + 1}`,
      order: i + 1,
    })
  )
}

export const createExercises = (count: number, chapterId: string): MockExercise[] => {
  return Array.from({ length: count }, (_, i) =>
    createExercise({
      id: `exercise-${i}`,
      chapterId,
      question: `Test question ${i + 1}`,
    })
  )
}
