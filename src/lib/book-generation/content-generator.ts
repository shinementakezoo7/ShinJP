/**
 * Book Content Generator
 *
 * Generates book chapters using AI with proper structure and content
 */

import { ModelTask, modelRouter } from '../ai/model-router'
import type { GeneratedChapter, ChapterSection, ExampleSentence } from './types'

export interface ChapterGenerationParams {
  chapterNumber: number
  chapterTitle: string
  prompt: string
  targetWordCount: number
  vocabularyTarget: number
  grammarTarget: number
  includeExercises: boolean
  includeDialogues: boolean
}

export class BookContentGenerator {
  /**
   * Generate a complete chapter
   */
  async generateChapter(params: ChapterGenerationParams): Promise<GeneratedChapter> {
    console.log(`      🤖 AI generating content for Chapter ${params.chapterNumber}...`)

    try {
      const response = await modelRouter.route({
        task: ModelTask.TEXTBOOK_GENERATION,
        messages: [
          {
            role: 'system',
            content: `You are an expert Japanese textbook author creating comprehensive educational content. 
Generate content in valid JSON format only. No markdown, no code blocks.

Create well-structured, pedagogically sound content appropriate for Japanese language learners.
Include practical examples, clear explanations, and engaging exercises.`,
          },
          {
            role: 'user',
            content: this.buildDetailedPrompt(params),
          },
        ],
        temperature: 0.7,
        maxTokens: 16000,
      })

      // Parse AI response
      const content = this.parseAIResponse(response.content)

      // Validate and structure
      const chapter: GeneratedChapter = {
        chapterNumber: params.chapterNumber,
        title: content.title || params.chapterTitle,
        introduction: content.introduction || '',
        sections: this.formatSections(content.sections || []),
        vocabulary: this.formatVocabulary(content.vocabulary || []),
        grammarPoints: this.formatGrammar(content.grammarPoints || []),
        dialogues: this.formatDialogues(content.dialogues || []),
        exercises: this.formatExercises(content.exercises || []),
        culturalNotes: content.culturalNotes || [],
        summary: content.summary || '',
        metadata: {
          wordCount: this.estimateWordCount(content),
          vocabularyCount: (content.vocabulary || []).length,
          grammarCount: (content.grammarPoints || []).length,
          dialogueCount: (content.dialogues || []).length,
          exerciseCount: (content.exercises || []).length,
          estimatedReadingTime: Math.ceil(this.estimateWordCount(content) / 200),
          difficulty: this.calculateDifficulty(content),
          jlptLevel: 'N4', // Default, should be dynamic
        },
      }

      console.log(`      ✅ Generated ${chapter.metadata.wordCount} words`)
      return chapter
    } catch (error) {
      console.error(`      ❌ Generation failed:`, error)
      throw new Error(
        `Failed to generate chapter: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Build detailed generation prompt
   */
  private buildDetailedPrompt(params: ChapterGenerationParams): string {
    return `Create Chapter ${params.chapterNumber}: "${params.chapterTitle}"

**Requirements:**
- Target length: ~${params.targetWordCount} words
- ${params.vocabularyTarget} vocabulary terms with examples
- ${params.grammarTarget} grammar points with explanations
${params.includeDialogues ? '- 2 realistic dialogues' : ''}
${params.includeExercises ? '- 10 practice exercises' : ''}

**Required JSON Structure:**
{
  "title": "Chapter title",
  "introduction": "Engaging 2-3 paragraph introduction explaining the chapter's importance and what students will learn",
  
  "sections": [
    {
      "heading": "Section heading",
      "content": "Detailed explanation with multiple paragraphs",
      "examples": [
        {
          "japanese": "日本語の例文",
          "romaji": "nihongo no reibun",
          "english": "Japanese example sentence",
          "context": "When/where this would be used"
        }
      ]
    }
  ],
  
  "vocabulary": [
    {
      "word": "単語",
      "reading": "たんご",
      "romaji": "tango",
      "meaning": "vocabulary word",
      "partOfSpeech": "noun",
      "exampleSentence": {
        "japanese": "新しい単語を覚えます。",
        "romaji": "atarashii tango wo oboemasu",
        "english": "I memorize new vocabulary words."
      }
    }
  ],
  
  "grammarPoints": [
    {
      "pattern": "〜ます",
      "meaning": "Polite present/future tense",
      "usage": "Used for polite speech",
      "examples": [
        {
          "japanese": "日本語を勉強します。",
          "romaji": "nihongo wo benkyou shimasu",
          "english": "I study Japanese."
        }
      ]
    }
  ],
  
  "dialogues": [
    {
      "title": "Dialogue title",
      "setting": "Where this conversation happens",
      "participants": ["Person A", "Person B"],
      "lines": [
        {
          "speaker": "Person A",
          "japanese": "こんにちは。",
          "romaji": "konnichiwa",
          "english": "Hello."
        }
      ],
      "keyPhrases": [
        {
          "phrase": "こんにちは",
          "meaning": "Hello (daytime greeting)",
          "usage": "Use when greeting someone during the day"
        }
      ]
    }
  ],
  
  "exercises": [
    {
      "type": "multiple_choice",
      "question": "Question in English",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswer": "Option 1",
      "explanation": "Why this is correct"
    }
  ],
  
  "culturalNotes": [
    "Interesting cultural context about the content"
  ],
  
  "summary": "Brief summary of key points covered"
}

**Quality Standards:**
- All Japanese text must include romaji
- Examples must be natural and authentic
- Explanations in clear, simple English
- Content appropriate for intermediate learners
- Include practical, real-world applications
- Make it engaging and memorable

Generate the complete chapter content as valid JSON.`
  }

  /**
   * Parse AI response and extract JSON
   */
  private parseAIResponse(content: string): any {
    try {
      // Clean the content
      let cleanContent = content.trim()

      // Remove markdown code blocks if present
      cleanContent = cleanContent.replace(/```json\s*/gi, '').replace(/```\s*$/gi, '')
      cleanContent = cleanContent.replace(/^```\s*/gi, '').replace(/```\s*$/gi, '')

      // Try to extract JSON if wrapped in text
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        cleanContent = jsonMatch[0]
      }

      return JSON.parse(cleanContent)
    } catch (error) {
      console.error('Failed to parse AI response:', content.substring(0, 200))
      throw new Error('Invalid JSON response from AI')
    }
  }

  /**
   * Format sections
   */
  private formatSections(sections: any[]): ChapterSection[] {
    return sections.map((section) => ({
      heading: section.heading || 'Section',
      content: section.content || '',
      examples: (section.examples || []).map((ex: any) => ({
        japanese: ex.japanese || '',
        romaji: ex.romaji || '',
        english: ex.english || '',
        context: ex.context,
      })),
      notes: section.notes || [],
    }))
  }

  /**
   * Format vocabulary
   */
  private formatVocabulary(vocabulary: any[]): any[] {
    return vocabulary.map((v) => ({
      word: v.word || '',
      reading: v.reading || '',
      romaji: v.romaji || '',
      primaryMeaning: v.meaning || v.primaryMeaning || '',
      partOfSpeech: v.partOfSpeech || 'unknown',
      exampleSentences: v.exampleSentence
        ? [
            {
              japanese: v.exampleSentence.japanese || '',
              romaji: v.exampleSentence.romaji || '',
              english: v.exampleSentence.english || '',
            },
          ]
        : [],
    }))
  }

  /**
   * Format grammar points
   */
  private formatGrammar(grammarPoints: any[]): any[] {
    return grammarPoints.map((g) => ({
      pattern: g.pattern || '',
      meaning: g.meaning || '',
      usage: g.usage || '',
      examples: (g.examples || []).map((ex: any) => ({
        japanese: ex.japanese || '',
        romaji: ex.romaji || '',
        english: ex.english || '',
      })),
    }))
  }

  /**
   * Format dialogues
   */
  private formatDialogues(dialogues: any[]): any[] {
    return dialogues.map((d) => ({
      title: d.title || 'Dialogue',
      setting: d.setting || '',
      participants: d.participants || [],
      lines: (d.lines || []).map((line: any) => ({
        speaker: line.speaker || '',
        japanese: line.japanese || '',
        romaji: line.romaji || '',
        english: line.english || '',
        notes: line.notes,
      })),
      keyPhrases: (d.keyPhrases || []).map((phrase: any) => ({
        phrase: phrase.phrase || '',
        meaning: phrase.meaning || '',
        usage: phrase.usage || '',
      })),
    }))
  }

  /**
   * Format exercises
   */
  private formatExercises(exercises: any[]): any[] {
    return exercises.map((e) => ({
      type: e.type || 'multiple_choice',
      question: e.question || '',
      options: e.options || [],
      correctAnswer: e.correctAnswer || e.answer || '',
      explanation: e.explanation || '',
      difficulty: e.difficulty || 3,
    }))
  }

  /**
   * Estimate word count
   */
  private estimateWordCount(content: any): number {
    const text = JSON.stringify(content)
    return text.split(/\s+/).filter((w) => w.length > 0).length
  }

  /**
   * Calculate difficulty level
   */
  private calculateDifficulty(content: any): number {
    // Simple heuristic: based on vocabulary and grammar count
    const vocabCount = (content.vocabulary || []).length
    const grammarCount = (content.grammarPoints || []).length

    if (vocabCount < 20 && grammarCount < 5) return 2 // Easy
    if (vocabCount < 40 && grammarCount < 10) return 3 // Medium
    return 4 // Hard
  }

  /**
   * Generate multiple chapters in batch
   */
  async generateChaptersBatch(
    chapters: ChapterGenerationParams[],
    concurrency: number = 5
  ): Promise<GeneratedChapter[]> {
    console.log(`📦 Batch generating ${chapters.length} chapters (${concurrency} concurrent)...`)

    const results: GeneratedChapter[] = []

    // Process in batches
    for (let i = 0; i < chapters.length; i += concurrency) {
      const batch = chapters.slice(i, i + concurrency)
      console.log(
        `   Processing batch ${i / concurrency + 1}/${Math.ceil(chapters.length / concurrency)}...`
      )

      const batchResults = await Promise.all(batch.map((params) => this.generateChapter(params)))

      results.push(...batchResults)
    }

    return results
  }
}
