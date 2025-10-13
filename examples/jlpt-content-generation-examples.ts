/**
 * JLPT Content Generation - Practical Examples
 *
 * This file demonstrates how to use the JLPT-compliant content generation
 * system to create comprehensive Japanese learning materials.
 */

import { generateJLPTContent } from '../src/lib/ai/content-generator'

// ============================================================================
// EXAMPLE 1: Generate N5 Grammar Lesson for ～ている
// ============================================================================

export async function example1_GrammarLesson() {
  console.log('📚 Example 1: Generating N5 Grammar Lesson for ～ている')

  const grammarLesson = await generateJLPTContent({
    type: 'grammar_lesson',
    jlptLevel: 'N5',
    specificContent: {
      grammarPatterns: ['gp-n5-001'], // ～ている pattern
    },
    options: {
      includeExamples: true, // Get 15+ example sentences
      includeExercises: true, // Include practice exercises
      includeCulturalNotes: true, // Add cultural context
    },
  })

  console.log('✅ Generated Grammar Lesson:')
  console.log('Pattern:', (grammarLesson as Record<string, any>).grammar_pattern?.pattern)
  console.log('Examples:', (grammarLesson as Record<string, any>).grammar_pattern?.examples?.length)
  console.log(
    'Content:',
    `${(grammarLesson as Record<string, any>).lesson_content?.substring(0, 500)}...`
  )

  return grammarLesson
}

// ============================================================================
// EXAMPLE 2: Generate N5 Vocabulary Lesson - Daily Life Theme
// ============================================================================

export async function example2_VocabularyLesson() {
  console.log('📚 Example 2: Generating N5 Vocabulary Lesson - Daily Life')

  const vocabLesson = await generateJLPTContent({
    type: 'vocabulary_lesson',
    jlptLevel: 'N5',
    topic: 'Daily Life and Routines',
    specificContent: {
      vocabularyIds: [
        'vocab-n5-001', // 食べる (to eat)
        // Add more vocab IDs as needed
      ],
    },
    options: {
      includeExamples: true,
      includeMnemonics: true, // Memory aids for learning
    },
  })

  console.log('✅ Generated Vocabulary Lesson:')
  console.log('Theme:', (vocabLesson as any).theme)
  console.log('Words:', (vocabLesson as any).vocabulary_items?.length)
  console.log('Content:', `${(vocabLesson as any).lesson_content?.substring(0, 500)}...`)

  return vocabLesson
}

// ============================================================================
// EXAMPLE 3: Generate N5 Kanji Lesson
// ============================================================================

export async function example3_KanjiLesson() {
  console.log('📚 Example 3: Generating N5 Kanji Lesson')

  const kanjiLesson = await generateJLPTContent({
    type: 'kanji_lesson',
    jlptLevel: 'N5',
    specificContent: {
      kanjiIds: [
        'kanji-n5-001', // 日 (day, sun)
        // Add more kanji IDs
      ],
    },
    options: {
      includeMnemonics: true, // Visual memory aids
    },
  })

  console.log('✅ Generated Kanji Lesson:')
  console.log('Characters:', (kanjiLesson as any).kanji_items?.length)
  console.log('Content:', `${(kanjiLesson as any).lesson_content?.substring(0, 500)}...`)

  return kanjiLesson
}

// ============================================================================
// EXAMPLE 4: Generate Modern Slang Lesson
// ============================================================================

export async function example4_SlangLesson() {
  console.log('📚 Example 4: Generating Modern Slang Lesson')

  const slangLesson = await generateJLPTContent({
    type: 'colloquial_lesson',
    jlptLevel: 'N5',
    specificContent: {
      slangIds: [
        'slang-001', // やばい (awesome/terrible)
        'slang-002', // マジ (seriously)
        'slang-003', // 草 (LOL)
      ],
    },
    options: {
      includeExamples: true,
    },
  })

  console.log('✅ Generated Slang Lesson:')
  console.log('Category:', (slangLesson as any).category)
  console.log('Expressions:', (slangLesson as any).expressions?.length)
  console.log('Content:', `${(slangLesson as any).lesson_content?.substring(0, 500)}...`)

  return slangLesson
}

// ============================================================================
// EXAMPLE 5: Generate Complete Textbook Chapter
// ============================================================================

export async function example5_TextbookChapter() {
  console.log('📚 Example 5: Generating Complete Textbook Chapter')

  const chapter = await generateJLPTContent({
    type: 'textbook_chapter',
    jlptLevel: 'N5',
    topic: 'Introduction to Japanese Verbs',
    specificContent: {
      grammarPatterns: [
        'gp-n5-001', // ～ている
        'gp-n5-002', // ～てください
        'gp-n5-003', // ～たい
      ],
      vocabularyIds: [
        'vocab-n5-001', // 食べる
        // More vocab...
      ],
      kanjiIds: [
        'kanji-n5-001', // 日
        // More kanji...
      ],
    },
    options: {
      includeExamples: true,
      includeExercises: true,
      includeCulturalNotes: true,
      includeSlang: false, // Can optionally add modern usage
    },
  })

  console.log('✅ Generated Textbook Chapter:')
  console.log('JLPT Level:', (chapter as any).jlpt_level)
  console.log('Validated:', (chapter as any).validated)
  console.log('Title:', (chapter as any).title)
  console.log('Sections:', (chapter as any).sections?.length)
  console.log('Vocabulary:', (chapter as any).vocabulary?.length)
  console.log('Grammar:', (chapter as any).grammarPoints?.length)
  console.log('Exercises:', (chapter as any).exercises?.length)

  return chapter
}

// ============================================================================
// EXAMPLE 6: Generate N4 Grammar Comparison Lesson
// ============================================================================

export async function example6_AdvancedGrammar() {
  console.log('📚 Example 6: Generating N4 Grammar Lesson with Comparisons')

  // Note: This would require N4 grammar patterns in the database
  const grammarLesson = await generateJLPTContent({
    type: 'grammar_lesson',
    jlptLevel: 'N4',
    specificContent: {
      grammarPatterns: ['gp-n4-001'], // Example: たことがある
    },
    options: {
      includeExamples: true,
      includeExercises: true,
      includeCulturalNotes: true,
    },
  })

  console.log('✅ Generated N4 Grammar Lesson')
  return grammarLesson
}

// ============================================================================
// EXAMPLE 7: Batch Generation for Full Course
// ============================================================================

export async function example7_BatchGeneration() {
  console.log('📚 Example 7: Batch Generation for Complete N5 Course')

  // Generate multiple lessons in sequence
  const course = {
    level: 'N5',
    chapters: [] as any[],
  }

  // Chapter 1: Basics
  console.log('Generating Chapter 1...')
  const chapter1 = await generateJLPTContent({
    type: 'textbook_chapter',
    jlptLevel: 'N5',
    topic: 'Japanese Writing Systems and Greetings',
    specificContent: {
      grammarPatterns: ['gp-n5-001'],
      vocabularyIds: ['vocab-n5-001'],
      kanjiIds: ['kanji-n5-001'],
    },
    options: {
      includeExamples: true,
      includeExercises: true,
    },
  })
  course.chapters.push(chapter1)

  // Chapter 2: Verbs
  console.log('Generating Chapter 2...')
  const chapter2 = await generateJLPTContent({
    type: 'textbook_chapter',
    jlptLevel: 'N5',
    topic: 'Introduction to Verbs',
    specificContent: {
      grammarPatterns: ['gp-n5-002', 'gp-n5-003'],
      vocabularyIds: ['vocab-n5-001'],
      kanjiIds: [],
    },
    options: {
      includeExamples: true,
      includeExercises: true,
    },
  })
  course.chapters.push(chapter2)

  // ... Continue for more chapters

  console.log(`✅ Generated complete course with ${course.chapters.length} chapters`)
  return course
}

// ============================================================================
// EXAMPLE 8: Custom Content with Specific Focus
// ============================================================================

export async function example8_CustomFocus() {
  console.log('📚 Example 8: Custom Content - Focus on Business Japanese')

  // Generate content focused on business Japanese
  const businessLesson = await generateJLPTContent({
    type: 'vocabulary_lesson',
    jlptLevel: 'N3', // Intermediate level for business
    topic: 'Business Meetings and Presentations',
    specificContent: {
      vocabularyIds: [], // Would include business vocab IDs
    },
    options: {
      includeExamples: true,
      includeCulturalNotes: true, // Important for business etiquette
    },
  })

  console.log('✅ Generated Business Japanese Lesson')
  return businessLesson
}

// ============================================================================
// EXAMPLE 9: Progressive Learning Path
// ============================================================================

export async function example9_ProgressivePath() {
  console.log('📚 Example 9: Progressive Learning Path')

  // Start with basics, progressively increase difficulty
  const learningPath = []

  // Week 1: Grammar basics
  const week1 = await generateJLPTContent({
    type: 'grammar_lesson',
    jlptLevel: 'N5',
    specificContent: { grammarPatterns: ['gp-n5-001'] },
    options: { includeExamples: true, includeExercises: true },
  })
  learningPath.push({ week: 1, content: week1 })

  // Week 2: Vocabulary building
  const week2 = await generateJLPTContent({
    type: 'vocabulary_lesson',
    jlptLevel: 'N5',
    topic: 'Daily Activities',
    specificContent: { vocabularyIds: ['vocab-n5-001'] },
    options: { includeExamples: true, includeMnemonics: true },
  })
  learningPath.push({ week: 2, content: week2 })

  // Week 3: Kanji introduction
  const week3 = await generateJLPTContent({
    type: 'kanji_lesson',
    jlptLevel: 'N5',
    specificContent: { kanjiIds: ['kanji-n5-001'] },
    options: { includeMnemonics: true },
  })
  learningPath.push({ week: 3, content: week3 })

  // Week 4: Modern usage
  const week4 = await generateJLPTContent({
    type: 'colloquial_lesson',
    jlptLevel: 'N5',
    specificContent: { slangIds: ['slang-001'] },
    options: { includeExamples: true },
  })
  learningPath.push({ week: 4, content: week4 })

  console.log(`✅ Generated ${learningPath.length}-week learning path`)
  return learningPath
}

// ============================================================================
// UTILITY: Run All Examples
// ============================================================================

export async function runAllExamples() {
  console.log('🚀 Running All JLPT Content Generation Examples\n')

  try {
    await example1_GrammarLesson()
    console.log('\n---\n')

    await example2_VocabularyLesson()
    console.log('\n---\n')

    await example3_KanjiLesson()
    console.log('\n---\n')

    await example4_SlangLesson()
    console.log('\n---\n')

    await example5_TextbookChapter()
    console.log('\n---\n')

    // Can add more examples as needed

    console.log('✅ All examples completed successfully!')
  } catch (error) {
    console.error('❌ Error running examples:', error)
    throw error
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  example1_GrammarLesson,
  example2_VocabularyLesson,
  example3_KanjiLesson,
  example4_SlangLesson,
  example5_TextbookChapter,
  example6_AdvancedGrammar,
  example7_BatchGeneration,
  example8_CustomFocus,
  example9_ProgressivePath,
  runAllExamples,
}
