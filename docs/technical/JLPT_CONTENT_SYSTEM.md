# JLPT-Compliant Content Generation System

## Overview

This system provides comprehensive, JLPT-aligned Japanese language learning content generation with complete coverage from N5 (beginner) to N1 (advanced), plus modern colloquial Japanese including youth slang, internet language, and dialects.

## Features

✅ **Complete JLPT Coverage** (N5-N1)
- Grammar patterns (600+ total across all levels)
- Vocabulary (18,000+ words)
- Kanji (2,136 Jōyō kanji)
- Listening, reading, writing, speaking integration

✅ **Modern Colloquial Japanese**
- Youth slang (若者言葉)
- Internet/social media language (ネット用語)
- Regional dialects (方言)
- Business casual expressions

✅ **Cultural Competency**
- Keigo system (honorific/humble/polite language)
- Cultural context and etiquette
- Appropriate usage guidelines
- Regional variations

✅ **Comprehensive Examples**
- 10-15+ examples per grammar pattern
- Multiple contexts and formality levels
- Natural, authentic Japanese
- Pitch accent information

✅ **Practice Exercises**
- Fill-in-the-blank
- Sentence transformation
- Multiple choice
- Translation practice
- Error correction

## Architecture

### Core Files

```
src/lib/ai/
├── jlpt-content-spec.ts          # Type definitions & specifications
├── jlpt-content-database.ts      # Seed data (grammar, vocab, kanji, slang)
├── jlpt-content-generator.ts     # Content generation engine
├── content-generator.ts           # Main API (includes new system)
└── model-router.ts                # AI model routing
```

### Data Structure

```typescript
// Hierarchical organization
JLPT_CONTENT_DATABASE
├── grammar
│   ├── N5: 80 patterns
│   ├── N4: 150 patterns
│   ├── N3: 200 patterns
│   ├── N2: 200 patterns
│   └── N1: 240+ patterns
├── vocabulary
│   ├── N5: 800 words
│   ├── N4: 1,500 words (cumulative)
│   ├── N3: 3,750 words (cumulative)
│   ├── N2: 6,000 words (cumulative)
│   └── N1: 10,000+ words (cumulative)
├── kanji
│   ├── N5: 103 characters
│   ├── N4: 300 characters (cumulative)
│   ├── N3: 650 characters (cumulative)
│   ├── N2: 1,000 characters (cumulative)
│   └── N1: 2,136 characters (cumulative)
└── colloquial
    ├── slang: Modern expressions
    ├── keigo: Honorific language
    └── dialects: Regional variations
```

## Usage Examples

### 1. Generate Grammar Lesson

```typescript
import { generateJLPTContent } from '@/lib/ai/content-generator'

// Generate comprehensive grammar lesson for ～ている pattern
const grammarLesson = await generateJLPTContent({
  type: 'grammar_lesson',
  jlptLevel: 'N5',
  specificContent: {
    grammarPatterns: ['gp-n5-001'] // ～ている pattern
  },
  options: {
    includeExamples: true,
    includeExercises: true,
    includeCulturalNotes: true
  }
})

// Returns comprehensive lesson with:
// - Detailed explanation
// - 15+ example sentences
// - Common mistakes
// - Casual variations
// - Practice exercises
console.log(grammarLesson.lesson_content)
```

### 2. Generate Vocabulary Lesson

```typescript
// Generate themed vocabulary lesson
const vocabLesson = await generateJLPTContent({
  type: 'vocabulary_lesson',
  jlptLevel: 'N5',
  topic: 'Daily Life and Routines',
  specificContent: {
    vocabularyIds: ['vocab-n5-001', 'vocab-n5-002', ...] // List of vocab IDs
  },
  options: {
    includeExamples: true,
    includeMnemonics: true
  }
})

// Returns:
// - Detailed word breakdowns
// - Multiple context examples
// - Collocations
// - Cultural notes
// - Memory techniques
```

### 3. Generate Kanji Lesson

```typescript
// Generate kanji learning lesson
const kanjiLesson = await generateJLPTContent({
  type: 'kanji_lesson',
  jlptLevel: 'N5',
  specificContent: {
    kanjiIds: ['kanji-n5-001', 'kanji-n5-002', ...] // 日, 食, etc.
  },
  options: {
    includeMnemonics: true
  }
})

// Returns:
// - Stroke order instructions
// - Reading examples (on'yomi, kun'yomi)
// - Common compounds
// - Visual mnemonics
// - Similar-looking kanji comparisons
// - Practice exercises
```

### 4. Generate Colloquial/Slang Lesson

```typescript
// Generate modern Japanese lesson
const slangLesson = await generateJLPTContent({
  type: 'colloquial_lesson',
  jlptLevel: 'N5',
  specificContent: {
    slangIds: ['slang-001', 'slang-002', 'slang-003'] // やばい, マジ, 草
  },
  options: {
    includeExamples: true
  }
})

// Returns:
// - Etymology and origin
// - Usage context and warnings
// - Conversation examples
// - Appropriateness guidelines
// - Platform-specific usage
// - Formal equivalents
```

### 5. Generate Complete Textbook Chapter

```typescript
// Generate comprehensive chapter with mixed content
const chapter = await generateJLPTContent({
  type: 'textbook_chapter',
  jlptLevel: 'N5',
  topic: 'Introduction to Japanese Verbs',
  specificContent: {
    grammarPatterns: ['gp-n5-001', 'gp-n5-002'],
    vocabularyIds: ['vocab-n5-001', 'vocab-n5-002', ...],
    kanjiIds: ['kanji-n5-001', 'kanji-n5-002', ...]
  },
  options: {
    includeExamples: true,
    includeExercises: true,
    includeCulturalNotes: true,
    includeSlang: false // Optional
  }
})

// Returns complete chapter with:
// - Introduction
// - Multiple sections
// - Integrated grammar, vocab, and kanji
// - Cultural context
// - Comprehensive exercises
// - Assessment questions
```

## JLPT Level Specifications

### N5 (Beginner)
- **Study Hours:** 250-400 hours
- **Kanji:** 103 characters
- **Vocabulary:** 800 words
- **Grammar:** 80 patterns
- **Can Do:** Understand basic Japanese mainly learned in classroom settings

### N4 (Elementary)
- **Study Hours:** 550-900 hours
- **Kanji:** 300 characters (cumulative)
- **Vocabulary:** 1,500 words (cumulative)
- **Grammar:** 150 patterns
- **Can Do:** Understand basic Japanese and daily conversations

### N3 (Intermediate)
- **Study Hours:** 900-1,400 hours
- **Kanji:** 650 characters (cumulative)
- **Vocabulary:** 3,750 words (cumulative)
- **Grammar:** 200 patterns
- **Can Do:** Understand Japanese in everyday situations to a certain degree

### N2 (Upper-Intermediate)
- **Study Hours:** 1,400-2,200 hours
- **Kanji:** 1,000 characters (cumulative)
- **Vocabulary:** 6,000 words (cumulative)
- **Grammar:** 197 patterns (350 cumulative)
- **Can Do:** Understand Japanese in various circumstances

### N1 (Advanced)
- **Study Hours:** 3,100-4,500 hours
- **Kanji:** 2,136 characters (complete Jōyō set)
- **Vocabulary:** 10,000+ words (cumulative)
- **Grammar:** 240+ patterns (600 cumulative)
- **Can Do:** Understand Japanese in all contexts and situations

## Content Database Structure

### Grammar Pattern Example

```typescript
{
  id: 'gp-n5-001',
  pattern: '～ている',
  jlpt_level: 'N5',
  frequency_score: 100,
  
  meanings: {
    primary: 'Continuous action or resultant state',
    secondary: ['Ongoing action', 'Resultant state', 'Habitual action']
  },
  
  formation_rules: {
    structure: 'Verb (て-form) + いる',
    verb_forms: [...]
  },
  
  examples: [
    {
      japanese: '今、勉強しています。',
      romaji: 'Ima, benkyō shite imasu.',
      english: 'I am studying now.',
      formality: 'formal',
      context: 'Ongoing action',
      breakdown: [...]  // Word-by-word analysis
    },
    // 14+ more examples...
  ],
  
  common_mistakes: [
    {
      error: 'Using dictionary form instead of て-form',
      correction: 'Must use て-form + いる',
      example_wrong: '×今、勉強するいる',
      example_correct: '○今、勉強している'
    },
    // More mistakes...
  ],
  
  casual_variations: [
    'ている → てる',
    'ているの → てんの'
  ],
  
  practice_exercises: [...]
}
```

### Vocabulary Entry Example

```typescript
{
  id: 'vocab-n5-001',
  word: '食べる',
  reading: 'たべる',
  romaji: 'taberu',
  word_type: 'verb_ichidan',
  jlpt_level: 'N5',
  frequency_rank: 234,
  
  meanings: {
    primary: 'to eat',
    secondary: ['to consume', 'to have a meal'],
    context_specific: [
      { context: 'formal', meaning: '召し上がる (honorific)' },
      { context: 'humble', meaning: 'いただく' }
    ]
  },
  
  conjugations: {
    dictionary_form: '食べる',
    masu_form: '食べます',
    te_form: '食べて',
    ta_form: '食べた',
    // All conjugation forms...
  },
  
  example_sentences: [
    {
      japanese: '朝ごはんを食べます。',
      romaji: 'Asa gohan wo tabemasu.',
      english: 'I eat breakfast.',
      formality: 'formal',
      context: 'Daily routine'
    },
    // 4+ more examples...
  ],
  
  collocations: [
    'ご飯を食べる',
    '外で食べる'
  ],
  
  slang_casual_forms: [
    { form: '食う', usage: 'Crude/masculine', formality: 'very_casual' }
  ],
  
  pitch_accent_pattern: 'LHL',
  pitch_accent_type: 'nakadaka'
}
```

### Kanji Entry Example

```typescript
{
  id: 'kanji-n5-001',
  character: '日',
  jlpt_level: 'N5',
  joyo_grade: 1,
  frequency_rank: 5,
  stroke_count: 4,
  
  meanings: ['day', 'sun', 'Japan'],
  
  readings: {
    on_yomi: [
      { reading: 'ニチ', compounds: ['日曜日', '毎日'] },
      { reading: 'ジツ', compounds: ['日時'] }
    ],
    kun_yomi: [
      { reading: 'ひ', compounds: ['日', '日差し'] }
    ],
    special_readings: [
      { word: '今日', reading: 'きょう', meaning: 'today' },
      { word: '明日', reading: 'あした', meaning: 'tomorrow' }
    ]
  },
  
  common_words: [
    { word: '日本', reading: 'にほん', meaning: 'Japan', frequency: 'very_high' },
    { word: '毎日', reading: 'まいにち', meaning: 'every day', frequency: 'very_high' }
    // 6+ more...
  ],
  
  mnemonics: [
    'Picture a window with the sun shining through',
    'The sun rises every DAY'
  ],
  
  similar_looking: ['目', '田', '白'],
  
  cultural_notes: '日 is fundamental to Japanese identity...'
}
```

### Slang Expression Example

```typescript
{
  id: 'slang-001',
  expression: 'やばい',
  romaji: 'yabai',
  category: 'youth_slang',
  
  origin: 'Originally criminal slang meaning "dangerous/risky"',
  
  meanings: [
    'Awesome, amazing (positive)',
    'Terrible, dangerous (negative)',
    'Very, extremely (intensifier)'
  ],
  
  variations: [
    { form: 'ヤバっ', usage: 'Shortened exclamation' },
    { form: 'やばみ', usage: 'Noun form (internet slang)' }
  ],
  
  example_conversations: [
    {
      context: 'Seeing amazing food',
      dialogue: [
        { speaker: 'A', japanese: 'このラーメン見て！', english: 'Look at this ramen!' },
        { speaker: 'B', japanese: 'やばっ！', english: 'Wow!' }
      ]
    }
  ],
  
  formality_level: 'very_casual',
  age_group: 'Teens to 30s',
  trending_status: 'stable',
  
  platforms: ['street', 'LINE', 'Twitter', 'TikTok'],
  
  appropriateness: [
    { situation: 'With friends', appropriate: true },
    { situation: 'Business meeting', appropriate: false, note: 'Too casual' }
  ]
}
```

## API Integration

### REST API Endpoint (example)

```typescript
// src/app/api/jlpt-content/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { generateJLPTContent } from '@/lib/ai/content-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const content = await generateJLPTContent(body)
    
    return NextResponse.json({
      success: true,
      data: content
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 })
  }
}
```

### Frontend Usage

```typescript
// Example: Generating content from a React component
const generateLesson = async () => {
  setLoading(true)
  
  try {
    const response = await fetch('/api/jlpt-content/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'grammar_lesson',
        jlptLevel: 'N5',
        specificContent: {
          grammarPatterns: ['gp-n5-001']
        },
        options: {
          includeExamples: true,
          includeExercises: true
        }
      })
    })
    
    const result = await response.json()
    if (result.success) {
      setLessonContent(result.data)
    }
  } catch (error) {
    console.error('Error generating lesson:', error)
  } finally {
    setLoading(false)
  }
}
```

## Quality Assurance

### Content Validation

All generated content is validated against:

✅ **Linguistic Accuracy**
- Grammar correctness
- Natural language usage
- Appropriate vocabulary for level

✅ **JLPT Compliance**
- Correct level assignment
- Coverage requirements met
- Test format alignment

✅ **Cultural Appropriateness**
- Accurate cultural context
- Appropriate formality levels
- Modern usage patterns

✅ **Pedagogical Soundness**
- Clear explanations
- Logical progression
- Adequate practice opportunities

## Extension and Customization

### Adding New Grammar Patterns

```typescript
// In jlpt-content-database.ts
export const N5_GRAMMAR_PATTERNS: GrammarPattern[] = [
  // ... existing patterns
  {
    id: 'gp-n5-NEW',
    pattern: '～たり～たり',
    // ... full specification
  }
]
```

### Adding New Vocabulary

```typescript
export const N5_VOCABULARY: VocabularyEntry[] = [
  // ... existing words
  {
    id: 'vocab-n5-NEW',
    word: '飲む',
    reading: 'のむ',
    // ... full specification
  }
]
```

### Adding New Slang

```typescript
export const MODERN_SLANG: SlangExpression[] = [
  // ... existing expressions
  {
    id: 'slang-NEW',
    expression: 'エモい',
    // ... full specification
  }
]
```

## Best Practices

### 1. Content Generation

- Always specify JLPT level accurately
- Include comprehensive examples (10-15+ per concept)
- Provide cultural context where relevant
- Add practice exercises for reinforcement

### 2. Example Sentences

- Use natural, authentic Japanese
- Include romaji for pronunciation
- Provide clear English translations
- Show multiple contexts and formality levels
- Include word-by-word breakdowns for complex sentences

### 3. Cultural Context

- Explain when and where to use expressions
- Clarify formality and politeness levels
- Note regional or generational differences
- Warn about potential misuse

### 4. Error Prevention

- Show common mistakes explicitly
- Explain why mistakes occur
- Provide correct alternatives
- Include practice exercises targeting common errors

## Future Enhancements

- [ ] Audio generation for all examples
- [ ] Visual aids and diagrams
- [ ] Interactive exercises
- [ ] Adaptive difficulty adjustment
- [ ] User progress tracking integration
- [ ] Community-contributed content
- [ ] Real-time Japanese media integration
- [ ] Speech recognition for pronunciation
- [ ] Handwriting recognition for kanji

## Support and Contribution

For questions, issues, or contributions:

1. Review existing content in `jlpt-content-database.ts`
2. Follow established patterns and specifications
3. Ensure all content is JLPT-compliant
4. Include comprehensive examples and explanations
5. Test generated content for quality

## References

- Official JLPT website: [jlpt.jp](https://www.jlpt.jp)
- Jōyō Kanji list: 2,136 characters
- Contemporary language research: Social media, anime, news sources
- Keigo guidelines: Business Japanese standards
- Regional dialect resources: NHK, academic research

---

**Last Updated:** 2024
**System Version:** 1.0.0
**Content Coverage:** N5-N1 + Modern Colloquial Japanese
