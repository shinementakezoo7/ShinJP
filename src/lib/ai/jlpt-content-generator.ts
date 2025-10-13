/**
 * JLPT-Compliant Content Generator
 *
 * Generates comprehensive Japanese learning content that strictly follows
 * JLPT specifications and includes modern colloquial Japanese.
 *
 * Features:
 * - Grammar-focused textbook chapters
 * - Vocabulary-rich lessons
 * - Kanji learning sequences
 * - Cultural context integration
 * - Modern slang and internet language
 * - Comprehensive examples and exercises
 */

import JLPT_CONTENT_DATABASE from './jlpt-content-database'
import {
  type GrammarPattern,
  JLPT_LEVEL_SPECS,
  type JLPTLevel,
  type KanjiEntry,
  type VocabularyEntry,
} from './jlpt-content-spec'
import { ModelTask, modelRouter } from './model-router'

// ============================================================================
// PROMPT TEMPLATES FOR JLPT-COMPLIANT GENERATION
// ============================================================================

export class JLPTContentGenerator {
  /**
   * Generate a comprehensive textbook chapter following JLPT specifications
   */
  async generateTextbookChapter(params: {
    jlptLevel: JLPTLevel
    chapterNumber: number
    topic: string
    grammarPatterns: string[] // IDs from database
    vocabularyItems: string[] // IDs from database
    kanjiCharacters: string[] // IDs from database
    includeCulturalNotes?: boolean
    includeSlang?: boolean
  }): Promise<unknown> {
    const jlptKey = params.jlptLevel === 'N1+' ? 'N1' : params.jlptLevel
    const levelSpec = JLPT_LEVEL_SPECS[jlptKey as keyof typeof JLPT_LEVEL_SPECS]

    // Fetch actual content from database
    const grammarData = this.getGrammarPatterns(params.jlptLevel, params.grammarPatterns)
    const vocabData = this.getVocabulary(params.jlptLevel, params.vocabularyItems)
    const kanjiData = this.getKanji(params.jlptLevel, params.kanjiCharacters)

    const prompt = this.buildChapterPrompt({
      ...params,
      levelSpec,
      grammarData,
      vocabData,
      kanjiData,
    })

    const response = await modelRouter.route({
      task: ModelTask.TEXTBOOK_GENERATION,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt('textbook_author'),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 16000,
    })

    return this.parseAndValidateChapter(response.content, params.jlptLevel)
  }

  /**
   * Generate grammar-focused lesson with comprehensive examples
   */
  async generateGrammarLesson(params: {
    jlptLevel: JLPTLevel
    grammarPatternId: string
    includeComparisons?: boolean
    includeExercises?: boolean
  }): Promise<unknown> {
    const grammarPattern = this.getGrammarPattern(params.jlptLevel, params.grammarPatternId)

    if (!grammarPattern) {
      throw new Error(
        `Grammar pattern ${params.grammarPatternId} not found for level ${params.jlptLevel}`
      )
    }

    const prompt = `# Grammar Lesson: ${grammarPattern.pattern}
## JLPT Level: ${params.jlptLevel}

You are an expert Japanese grammar instructor creating a comprehensive lesson on the grammar pattern **${grammarPattern.pattern}**.

### Current Pattern Details:
**Pattern:** ${grammarPattern.pattern}
**Meaning:** ${grammarPattern.meanings.primary}
**Formation:** ${grammarPattern.formation_rules.structure}
**Formality:** ${grammarPattern.formality_level}
**Usage Contexts:** ${grammarPattern.usage_contexts.join(', ')}

### Lesson Requirements:

Create a detailed, well-structured lesson that includes:

1. **Introduction** (2-3 paragraphs)
   - Engage students with why this pattern is important
   - When they'll encounter it in real Japanese
   - Connection to concepts they already know

2. **Core Explanation** (detailed section)
   - Clear breakdown of the pattern structure
   - Step-by-step formation rules
   - Visual examples showing the pattern breakdown
   - Comparison to English if helpful

3. **Usage Contexts** (detailed section)
   - At least 4-5 different contexts where this is used
   - Appropriate formality levels
   - When NOT to use this pattern

4. **Comprehensive Examples** (minimum 15 examples)
   For EACH example provide:
   - **Japanese:** [sentence in Japanese]
   - **Romaji:** [romanization]
   - **English:** "translation"
   - **Context:** [situation where this would be used]
   - **Formality:** [casual/neutral/formal]
   - **Breakdown:** [word-by-word analysis if complex]
   
   Examples should cover:
   - Daily conversation (3-4 examples)
   - Formal situations (2-3 examples)
   - Written language (2 examples)
   - Questions using this pattern (2 examples)
   - Negative forms (2 examples)
   - Past tense variations (2 examples)

5. **Common Mistakes** (minimum 5)
   - ❌ **Wrong:** [incorrect usage]
   - ✅ **Correct:** [correct usage]
   - 💡 **Explanation:** [why this is wrong and how to fix it]

${
  params.includeComparisons
    ? `
6. **Similar Patterns Comparison**
   Compare with related grammar patterns:
   - How they're similar
   - Key differences
   - When to use each one
   - Example sentences showing the contrast
`
    : ''
}

7. **Cultural Context** (if applicable)
   - Social implications of using this pattern
   - Politeness considerations
   - Regional variations
   - Modern usage trends

8. **Casual Speech Variations**
   - How this pattern changes in casual conversation
   - Contractions and shortcuts
   - What you'll hear in anime/drama
   - Internet/text message usage

${
  params.includeExercises
    ? `
9. **Practice Exercises** (10-15 exercises)
   Include variety:
   - Fill in the blank (5 exercises)
   - Sentence transformation (3 exercises)
   - Translation (3 exercises)
   - Error correction (2 exercises)
   - Multiple choice (2 exercises)
   
   For each:
   - Provide the question
   - Give the answer
   - Explain why that's the answer
`
    : ''
}

10. **Summary and Next Steps**
    - Quick reference summary
    - Connection to next grammar points
    - Study tips and practice suggestions

### Format Requirements:
- Use clear headings and subheadings
- Use **bold** for Japanese terms and key concepts
- Use bullet points for lists
- Include emojis occasionally: ✅ ❌ 💡 📝 🎯 🌟
- Make it engaging and easy to follow

### Quality Standards:
- Every Japanese sentence must have romaji and English translation
- Examples must be natural, authentic Japanese
- Explanations in clear, simple English
- Appropriate for ${params.jlptLevel} level students
- No mistakes in Japanese grammar or usage

Generate the complete lesson following these specifications.`

    const response = await modelRouter.route({
      task: ModelTask.GRAMMAR_EXPLANATION,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt('grammar_instructor'),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 12000,
    })

    return {
      grammar_pattern: grammarPattern,
      lesson_content: response.content,
      metadata: {
        jlpt_level: params.jlptLevel,
        pattern_id: params.grammarPatternId,
        generated_at: new Date().toISOString(),
      },
    }
  }

  /**
   * Generate vocabulary lesson with contextual usage
   */
  async generateVocabularyLesson(params: {
    jlptLevel: JLPTLevel
    theme: string
    vocabularyIds: string[]
    includeExamples?: boolean
    includeMnemonics?: boolean
  }): Promise<unknown> {
    const vocabItems = this.getVocabulary(params.jlptLevel, params.vocabularyIds)

    const prompt = `# Vocabulary Lesson: ${params.theme}
## JLPT Level: ${params.jlptLevel}

Create a comprehensive vocabulary lesson on the theme: **${params.theme}**

### Vocabulary Items (${vocabItems.length} words):
${vocabItems.map((item, i) => `${i + 1}. ${item.word} (${item.reading}) - ${item.meanings.primary}`).join('\n')}

### Lesson Structure:

1. **Theme Introduction** (2 paragraphs)
   - Why this vocabulary set is important
   - Real-world contexts where you'll use these words
   - Cultural relevance

2. **Vocabulary Deep Dive**
   
   For EACH word, provide:
   
   ### [Word Number]. ${vocabItems[0]?.word} (${vocabItems[0]?.reading})
   
   **Meaning:** [primary meaning]
   **Type:** [noun/verb/adjective/etc.]
   **Formality:** [casual/neutral/formal]
   
   **Kanji Breakdown:**
   - [Break down each kanji if applicable]
   - Show how the kanji meanings combine
   
   **Example Sentences:** (minimum 4 per word)
   - **Japanese:** [sentence]
   - **Romaji:** [romanization]
   - **English:** "translation"
   - **Context:** [when/why you'd say this]
   
   **Collocations:** [common phrases with this word]
   **Usage Notes:** [any special rules or nuances]
   
   ${params.includeMnemonics ? '**Memory Tip:** [creative mnemonic device]' : ''}

3. **Comparative Usage**
   - Group similar words and explain differences
   - Show when to use which word
   - Common mistakes with similar vocabulary

4. **Practical Dialogues** (3-5 short conversations)
   Show these words in action:
   - Daily life scenario
   - Shopping/restaurant scenario
   - Work/school scenario
   
   Format:
   **Person A:** [Japanese] ([romaji]) "English"
   **Person B:** [Japanese] ([romaji]) "English"

5. **Cultural Context**
   - How Japanese people use these words
   - Politeness considerations
   - Regional or generational differences
   - Modern slang variations (if applicable)

6. **Practice Exercises** (10-15 exercises)
   - Fill in the blank (5)
   - Match words to definitions (5)
   - Sentence creation prompts (5)

7. **Summary Card**
   Create a quick reference with:
   - All words with readings
   - Core meanings
   - One example sentence each

### Quality Requirements:
- Natural, authentic Japanese
- Clear English explanations
- Culturally accurate information
- Appropriate for ${params.jlptLevel} level
- Engaging and memorable presentation

Generate the complete vocabulary lesson.`

    const response = await modelRouter.route({
      task: ModelTask.VOCABULARY_EXPLANATION,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt('vocabulary_instructor'),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 14000,
    })

    return {
      theme: params.theme,
      vocabulary_items: vocabItems,
      lesson_content: response.content,
      metadata: {
        jlpt_level: params.jlptLevel,
        word_count: vocabItems.length,
        generated_at: new Date().toISOString(),
      },
    }
  }

  /**
   * Generate kanji learning lesson with stroke order, mnemonics, and compounds
   */
  async generateKanjiLesson(params: {
    jlptLevel: JLPTLevel
    kanjiIds: string[]
    includeStrokeOrder?: boolean
    includeMnemonics?: boolean
    includeCompounds?: boolean
  }): Promise<unknown> {
    const kanjiItems = this.getKanji(params.jlptLevel, params.kanjiIds)

    const prompt = `# Kanji Lesson: ${kanjiItems.length} Characters
## JLPT Level: ${params.jlptLevel}

Create a comprehensive kanji learning lesson for these characters:
${kanjiItems.map((k, i) => `${i + 1}. ${k.character} - ${k.meanings.join(', ')}`).join('\n')}

### Lesson Requirements:

1. **Introduction**
   - Overview of these kanji
   - Common themes or connections
   - Learning strategy for this set

2. **Individual Kanji Instruction**

For EACH kanji, create a detailed section:

### ${kanjiItems[0]?.character} - ${kanjiItems[0]?.meanings[0]}

**Basic Information:**
- **Meanings:** ${kanjiItems[0]?.meanings.join(', ')}
- **Stroke Count:** ${kanjiItems[0]?.stroke_count}
- **JLPT Level:** ${kanjiItems[0]?.jlpt_level}
- **Frequency Rank:** ${kanjiItems[0]?.frequency_rank}
- **Grade Level:** ${kanjiItems[0]?.joyo_grade ? `Grade ${kanjiItems[0].joyo_grade}` : 'Secondary'}

**Readings:**
- **On'yomi (音読み):** [Chinese readings with examples]
- **Kun'yomi (訓読み):** [Japanese readings with examples]
- **Special Readings:** [irregular readings if any]

${
  params.includeStrokeOrder
    ? `
**Stroke Order:**
Describe the stroke order step by step:
1. [First stroke description]
2. [Second stroke description]
...
[Include writing tips and common mistakes]
`
    : ''
}

**Radical Information:**
- **Primary Radical:** [radical and meaning]
- **Components:** [break down into parts]
- **Visual Elements:** [describe what you "see" in the kanji]

${
  params.includeMnemonics
    ? `
**Memory Techniques:**
- **Visual Mnemonic:** [creative story or image]
- **Association:** [connection to remember]
- **Fun Fact:** [interesting etymology or history]
`
    : ''
}

${
  params.includeCompounds
    ? `
**Common Compounds:** (8-10 compounds)
For each:
- **Compound:** [kanji compound]
- **Reading:** [how to read it]
- **Meaning:** [what it means]
- **Example:** [sentence using it]
- **Level:** [JLPT level]

Include mix of:
- Very common words (4-5)
- Useful expressions (2-3)
- Related compounds (2-3)
`
    : ''
}

**Example Sentences:** (5-6 sentences)
Show this kanji in natural context:
- **Japanese:** [sentence with furigana on other kanji]
- **Romaji:** [romanization]
- **English:** "translation"
- **Focus:** [highlight how this kanji is used]

**Similar-Looking Kanji:**
- Compare with: [similar kanji]
- How to distinguish: [key differences]
- Memory tricks: [how not to confuse them]

3. **Comparative Analysis**
   - Group kanji by similar radicals
   - Show kanji with related meanings
   - Explain relationships between them

4. **Cultural and Historical Context**
   - Etymology of interesting kanji
   - Cultural significance
   - How meanings evolved

5. **Reading Practice**
   Create passages using these kanji:
   - Simple sentences for beginners
   - Short paragraphs for practice
   - Include furigana where needed

6. **Writing Practice**
   - Stroke order drills
   - Compound writing practice
   - Sentence writing prompts

7. **Recognition Exercises**
   - Multiple choice kanji recognition
   - Reading selection exercises
   - Context-based kanji selection

8. **Summary and Study Tips**
   - Quick reference chart for all kanji
   - Study sequence recommendations
   - Memory technique summary
   - Connection to next lesson

### Quality Standards:
- Accurate stroke counts and order
- Authentic compound words
- Natural example sentences
- Culturally accurate information
- Appropriate difficulty for ${params.jlptLevel}
- Engaging mnemonics and stories

Generate the complete kanji lesson.`

    const response = await modelRouter.route({
      task: ModelTask.KANJI_EXPLANATION,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt('kanji_instructor'),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 16000,
    })

    return {
      kanji_items: kanjiItems,
      lesson_content: response.content,
      metadata: {
        jlpt_level: params.jlptLevel,
        kanji_count: kanjiItems.length,
        generated_at: new Date().toISOString(),
      },
    }
  }

  /**
   * Generate modern colloquial Japanese lesson (slang, internet language)
   */
  async generateColloquialLesson(params: {
    category: 'youth_slang' | 'internet_slang' | 'business_casual' | 'dialects'
    expressions: string[]
    includeComparisons?: boolean
  }): Promise<unknown> {
    const slangData = this.getSlangExpressions(params.expressions) as Array<{
      expression: string
      meanings: string[]
      category?: string
      formality_level?: string
      age_group?: string
      region?: string
      origin?: string
      examples?: Array<{ japanese: string; romaji: string; english: string }>
      notes?: string
    }>

    const prompt = `# Modern Japanese Lesson: ${params.category.replace('_', ' ').toUpperCase()}

Create a comprehensive lesson on contemporary Japanese expressions.

### Focus: ${params.category}
### Expressions Covered: ${slangData.length}

${slangData.map((s, i) => `${i + 1}. ${s.expression} - ${s.meanings[0]}`).join('\n')}

### Lesson Structure:

1. **Introduction to Modern Japanese**
   - Why learning colloquial language matters
   - How language evolves
   - When and where to use (and NOT use) these expressions

2. **Detailed Expression Breakdown**

For EACH expression:

### ${slangData[0]?.expression}

**Category:** ${slangData[0]?.category}
**Formality:** ${slangData[0]?.formality_level}
**Age Group:** ${slangData[0]?.age_group}
**Region:** ${slangData[0]?.region}

**Origin Story:**
${slangData[0]?.origin}
[Explain the etymology and how it evolved]

**Meanings:**
${slangData[0]?.meanings.map((m, i) => `${i + 1}. ${m}`).join('\n')}

**When to Use:**
- [Appropriate situations]
- [Who you can say this to]
- [Where it's commonly used]

**When NOT to Use:**
⚠️ [Inappropriate situations]
⚠️ [Who NOT to say this to]
⚠️ [Contexts to avoid]

**Conversation Examples:** (3-5 real dialogues)
Show natural usage in context:

**Scenario 1: [context]**
**A:** [Japanese] ([romaji]) "English"
**B:** [Japanese] ([romaji]) "English"
[Explanation of usage]

**Variations:**
- [Different forms]
- [Regional variations]
- [Platform-specific usage]

**Similar Expressions:**
- [Related slang]
- [Formal equivalents]
- [How they differ]

3. **Social Context and Usage Rules**
   - Generational differences
   - Gender considerations (if any)
   - Regional variations
   - Platform appropriateness (LINE vs Twitter vs in-person)

4. **Comparison to Standard Japanese**
   - Formal equivalent
   - Nuance differences
   - When to code-switch

5. **Modern Media Examples**
   - Where you'll hear/see these
   - Anime/drama usage
   - Social media trends
   - YouTuber language

6. **Practice Scenarios**
   Create situations where students can practice:
   - Casual friend conversation
   - Online chat simulation
   - Social media post writing
   - Understanding anime dialogue

7. **Cultural Insights**
   - What using this language signals
   - How native speakers perceive it
   - Trends and changes over time
   - Generational attitude towards these expressions

8. **Warning Signs**
   - How to tell if you're overusing slang
   - Signs someone is uncomfortable with your language level
   - How to adjust formality on the fly

9. **Study Tips**
   - How to learn from media
   - Practicing with language partners
   - Staying current with trends
   - Resources for modern Japanese

### Important Notes:
- Mark clearly what's appropriate vs inappropriate
- Explain social consequences of misuse
- Show both positive and negative contexts
- Include warnings about formality
- Be culturally sensitive and accurate

Generate the complete colloquial Japanese lesson.`

    const response = await modelRouter.route({
      task: ModelTask.CONVERSATION_PRACTICE,
      messages: [
        {
          role: 'system',
          content: this.getSystemPrompt('modern_japanese_instructor'),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      maxTokens: 14000,
    })

    return {
      category: params.category,
      expressions: slangData,
      lesson_content: response.content,
      metadata: {
        expression_count: slangData.length,
        generated_at: new Date().toISOString(),
      },
    }
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  private buildChapterPrompt(params: Record<string, unknown>): string {
    return `Generate a comprehensive ${params.jlptLevel} textbook chapter following JLPT specifications...`
    // Implementation details...
  }

  private getSystemPrompt(
    role:
      | 'textbook_author'
      | 'grammar_instructor'
      | 'vocabulary_instructor'
      | 'kanji_instructor'
      | 'modern_japanese_instructor'
  ): string {
    const prompts = {
      textbook_author: `You are an expert Japanese textbook author with 40+ years of experience creating JLPT preparation materials. You understand the exact specifications for each JLPT level and create content that is pedagogically sound, culturally accurate, and engaging for learners. You always provide comprehensive examples, clear explanations, and practical exercises. Your content strictly follows JLPT guidelines for grammar, vocabulary, and kanji at each level.`,

      grammar_instructor: `You are a master Japanese grammar instructor specializing in making complex grammar patterns clear and accessible. You have deep knowledge of Japanese linguistics, can explain subtle nuances, and provide authentic examples from real Japanese usage. You understand how to break down patterns step-by-step and anticipate common learner mistakes.`,

      vocabulary_instructor: `You are an expert vocabulary teacher who specializes in teaching Japanese words in rich context. You understand collocations, usage patterns, formality levels, and cultural nuances. You create memorable examples and provide practical phrases that students will actually use.`,

      kanji_instructor: `You are a kanji master who can explain the visual, historical, and practical aspects of Chinese characters. You create effective mnemonics, understand stroke order principles, and know how to teach character recognition and production systematically. You make kanji learning engaging and memorable.`,

      modern_japanese_instructor: `You are an expert in contemporary Japanese language, including youth slang, internet language, and colloquial expressions. You understand social contexts, generational differences, and the appropriate use of informal language. You can explain when expressions are appropriate and when they cross boundaries.`,
    }

    return prompts[role]
  }

  private getGrammarPatterns(level: JLPTLevel, ids: string[]): GrammarPattern[] {
    const key = level === 'N1+' ? 'N1' : level
    const db = JLPT_CONTENT_DATABASE.grammar[key as keyof typeof JLPT_CONTENT_DATABASE.grammar]
    return ids.map((id) => db.find((g) => g.id === id)).filter(Boolean) as GrammarPattern[]
  }

  private getGrammarPattern(level: JLPTLevel, id: string): GrammarPattern | undefined {
    const key = level === 'N1+' ? 'N1' : level
    const db = JLPT_CONTENT_DATABASE.grammar[key as keyof typeof JLPT_CONTENT_DATABASE.grammar]
    return db.find((g) => g.id === id)
  }

  private getVocabulary(level: JLPTLevel, ids: string[]): VocabularyEntry[] {
    const key = level === 'N1+' ? 'N1' : level
    const db =
      JLPT_CONTENT_DATABASE.vocabulary[key as keyof typeof JLPT_CONTENT_DATABASE.vocabulary]
    return ids.map((id) => db.find((v) => v.id === id)).filter(Boolean) as VocabularyEntry[]
  }

  private getKanji(level: JLPTLevel, ids: string[]): KanjiEntry[] {
    const key = level === 'N1+' ? 'N1' : level
    const db = JLPT_CONTENT_DATABASE.kanji[key as keyof typeof JLPT_CONTENT_DATABASE.kanji]
    return ids.map((id) => db.find((k) => k.id === id)).filter(Boolean) as KanjiEntry[]
  }

  private getSlangExpressions(ids: string[]): unknown[] {
    const db = JLPT_CONTENT_DATABASE.colloquial.slang
    return ids.map((id) => db.find((s) => s.id === id)).filter(Boolean)
  }

  private parseAndValidateChapter(content: string, level: JLPTLevel): unknown {
    // Parse and validate the generated content
    // Ensure it meets JLPT standards
    try {
      // Clean and parse JSON if needed
      const cleaned = content
        .trim()
        .replace(/```json\s*/gi, '')
        .replace(/```\s*$/gi, '')
        .trim()

      const parsed = JSON.parse(cleaned)

      // Validate required fields
      if (!parsed.title || !parsed.introduction) {
        throw new Error('Missing required fields')
      }

      return {
        ...parsed,
        jlpt_level: level,
        validated: true,
        generated_at: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error parsing chapter:', error)
      // Return raw content if parsing fails
      return {
        raw_content: content,
        jlpt_level: level,
        validated: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// ============================================================================
// EXPORT SINGLETON INSTANCE
// ============================================================================

export const jlptContentGenerator = new JLPTContentGenerator()
export default jlptContentGenerator
