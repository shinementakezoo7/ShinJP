/**
 * Advanced Prompt Enhancement System
 *
 * Implements 3-step process:
 * 1. Analyze user query and add context
 * 2. Enhance with teaching-specific instructions
 * 3. Add detail requirements for comprehensive responses
 *
 * Based on research:
 * - Chain of Thought (CoT) prompting
 * - Query expansion techniques
 * - Self-Ask methodology
 * - Structured prompting strategies
 */

interface PromptEnhancement {
  originalQuery: string
  enhancedQuery: string
  teachingInstructions: string
  detailRequirements: string
  fullEnhancedPrompt: string
}

/**
 * Japanese language learning query types
 */
enum QueryType {
  GRAMMAR = 'grammar',
  VOCABULARY = 'vocabulary',
  KANJI = 'kanji',
  CONVERSATION = 'conversation',
  CULTURE = 'culture',
  GENERAL = 'general',
}

/**
 * Step 1: Analyze and classify the user's query
 */
function analyzeQuery(query: string): QueryType {
  const lowerQuery = query.toLowerCase()

  // Grammar indicators
  if (
    lowerQuery.match(
      /particle|grammar|verb|adjective|conjugat|tense|sentence|structure|は|が|を|に|で/
    )
  ) {
    return QueryType.GRAMMAR
  }

  // Vocabulary indicators
  if (lowerQuery.match(/word|vocabulary|vocab|mean|translate|say|phrase|expression/)) {
    return QueryType.VOCABULARY
  }

  // Kanji indicators
  if (lowerQuery.match(/kanji|character|writing|stroke|hiragana|katakana|kana/)) {
    return QueryType.KANJI
  }

  // Conversation indicators
  if (lowerQuery.match(/convers|speak|talk|greet|introduc|polite|casual|formal|keigo/)) {
    return QueryType.CONVERSATION
  }

  // Culture indicators
  if (lowerQuery.match(/cultur|custom|etiquette|tradition|manner|social|japan|honor/)) {
    return QueryType.CULTURE
  }

  return QueryType.GENERAL
}

/**
 * Step 2: Enhance the query with context and detail requests
 */
function enhanceQueryWithContext(query: string, queryType: QueryType): string {
  const contextEnhancements = {
    [QueryType.GRAMMAR]: `
Please provide a comprehensive explanation of: "${query}"

Include in your response:
1. What this grammar concept is in simple English terms
2. How it compares to English (if applicable)
3. The basic structure/pattern with examples
4. At least 4-5 different usage examples showing:
   - Casual conversation usage
   - Polite/formal usage
   - Written vs. spoken differences (if any)
5. Common mistakes learners make and how to avoid them
6. Related grammar points that connect to this concept
7. Practice exercises or tips for mastering this
`,

    [QueryType.VOCABULARY]: `
Please teach me about: "${query}"

Provide detailed information including:
1. The exact Japanese word(s) or phrase(s)
2. Romaji (romanization) for pronunciation
3. Kanji breakdown (if applicable) with individual meanings
4. Multiple English translations/meanings
5. Context of when to use this (formal/casual/written/spoken)
6. 4-5 example sentences showing different contexts
7. Common collocations (words often used together)
8. Similar words or phrases and how they differ
9. Cultural notes about usage
`,

    [QueryType.KANJI]: `
Please teach me about: "${query}"

Give comprehensive details on:
1. The kanji character(s) in question
2. Stroke order and how to write it
3. All readings (on'yomi and kun'yomi) with examples
4. Meaning and etymology (origin story if interesting)
5. Common compounds using this kanji
6. Mnemonics or memory tricks to remember it
7. Similar-looking kanji and how to distinguish them
8. JLPT level and frequency of use
9. Example sentences using the kanji
`,

    [QueryType.CONVERSATION]: `
Please help me with: "${query}"

Provide detailed guidance including:
1. The conversation situation/context
2. Appropriate phrases for this situation
3. Different politeness levels (casual, polite, formal, keigo)
4. Step-by-step breakdown of what to say
5. Full dialogue examples with translations
6. Cultural context and social rules to know
7. What NOT to say (common mistakes by foreigners)
8. Body language or non-verbal cues to be aware of
9. Practice scenarios to try
`,

    [QueryType.CULTURE]: `
Please explain: "${query}"

Give thorough cultural insight covering:
1. What this cultural aspect is
2. Historical background and why it exists
3. How it's practiced in modern Japan
4. Regional differences (if any)
5. Do's and don'ts for foreigners
6. Real-life examples or anecdotes
7. How this relates to language usage
8. Common misunderstandings by non-Japanese
9. Tips for respectful participation/observation
`,

    [QueryType.GENERAL]: `
Please teach me about: "${query}"

Provide a comprehensive lesson including:
1. Clear explanation in simple English
2. All relevant Japanese vocabulary with translations
3. Multiple examples showing usage
4. Cultural or contextual information
5. Common mistakes to avoid
6. Related topics or concepts
7. Practice suggestions
8. Any important nuances to understand
`,
  }

  return contextEnhancements[queryType]
}

/**
 * Step 3: Add teacher-specific instructions for detailed responses
 */
function addTeacherInstructions(_queryType: QueryType): string {
  return `
🎓 TEACHING APPROACH REQUIREMENTS:

As an experienced Japanese teacher with 40 years of experience, you must:

1. **START WITH ENCOURAGEMENT** (1-2 sentences)
   - Acknowledge the question positively
   - Show enthusiasm for teaching this topic

2. **PROVIDE CONTEXT** (2-3 sentences)
   - Explain why this is important to learn
   - Where/when students will use this
   - Connect to what they might already know

3. **MAIN EXPLANATION** (detailed section)
   - Use simple, clear English throughout
   - Break into numbered steps or bullet points
   - Use analogies to English when helpful
   - Include visual formatting (bold, headings)

4. **MULTIPLE EXAMPLES** (minimum 4-5)
   For EACH example provide:
   - **Japanese**: [Japanese text]
   - **Romaji**: [romanization]
   - **English**: "English translation"
   - **Breakdown**: [word-by-word analysis if helpful]
   - **Context**: [when/why you'd use this]

5. **COMMON MISTAKES** (2-3 examples)
   - ❌ **Wrong**: [what students often do wrong]
   - ✅ **Correct**: [the right way]
   - 💡 **Why**: [explanation of the mistake]

6. **CULTURAL CONTEXT** (if relevant)
   - Social implications
   - Politeness considerations
   - When/where this is appropriate
   - What native speakers think about usage

7. **PRACTICE STRATEGIES** (3-4 concrete suggestions)
   - "Try making 5 sentences with..."
   - "Practice by..."
   - "Listen for this when..."
   - "A good exercise is..."

8. **CONNECTION TO BROADER LEARNING** (1-2 sentences)
   - How this connects to other concepts
   - What to study next
   - Related topics to explore

9. **ENCOURAGEMENT & INVITATION** (closing)
   - Motivational statement
   - Invitation to ask follow-up questions
   - Reminder of progress they're making

📋 FORMATTING REQUIREMENTS:
- Use headings (##) for main sections
- Use **bold** for Japanese terms and key concepts
- Use bullet points for lists
- Include emojis occasionally: ✅ ❌ 💡 📝 🎯 🌟
- Keep paragraphs SHORT (2-3 sentences maximum)
- Add blank lines between sections for readability
- Use blockquotes (>) for important notes

🎯 DETAIL LEVEL:
- Minimum response length: 500-800 words
- Include at least 4-5 Japanese examples
- Provide multiple perspectives on the topic
- Show different usage contexts
- Give cultural insights where relevant

⚠️ CRITICAL REMINDERS:
- EVERY Japanese word must have English translation
- ALWAYS include romaji for pronunciation
- Explain in ENGLISH, use Japanese as examples only
- Assume student is intermediate learner unless question suggests otherwise
- Be thorough but not overwhelming
- Use storytelling when possible to make it memorable
`
}

/**
 * Main enhancement function - combines all 3 steps
 */
export function enhancePrompt(userQuery: string): PromptEnhancement {
  console.log('📝 Step 1: Analyzing user query...')
  const queryType = analyzeQuery(userQuery)
  console.log(`   Query type identified: ${queryType}`)

  console.log('📝 Step 2: Enhancing query with context...')
  const enhancedQuery = enhanceQueryWithContext(userQuery, queryType)

  console.log('📝 Step 3: Adding teacher-specific instructions...')
  const teachingInstructions = addTeacherInstructions(queryType)

  const detailRequirements = `
🔍 QUALITY CHECKLIST - Your response must include:
☐ Enthusiastic opening acknowledging the question
☐ Context about why this matters
☐ Clear explanation in simple English
☐ At least 4-5 Japanese examples with full translations
☐ Romaji for every Japanese word/phrase
☐ Word-by-word breakdown where helpful
☐ 2-3 common mistakes with corrections
☐ Cultural context if relevant
☐ 3-4 specific practice suggestions
☐ Connection to related concepts
☐ Encouraging closing statement

Remember: You're drawing on 40 years of teaching experience. Share insights, shortcuts, and wisdom that only an experienced teacher would know. Make this explanation memorable and helpful!
`

  const fullEnhancedPrompt = `${enhancedQuery}

${teachingInstructions}

${detailRequirements}

Now, please provide your comprehensive teaching response:`

  console.log('✅ Prompt enhancement complete!')
  console.log(`   Original length: ${userQuery.length} characters`)
  console.log(`   Enhanced length: ${fullEnhancedPrompt.length} characters`)
  console.log(`   Enhancement ratio: ${(fullEnhancedPrompt.length / userQuery.length).toFixed(1)}x`)

  return {
    originalQuery: userQuery,
    enhancedQuery,
    teachingInstructions,
    detailRequirements,
    fullEnhancedPrompt,
  }
}

/**
 * Simplified version for shorter queries that need less enhancement
 */
export function lightEnhancePrompt(userQuery: string): string {
  const _queryType = analyzeQuery(userQuery)

  return `${userQuery}

Please provide a detailed, thorough response as an experienced Japanese teacher. Include:
- Clear English explanations
- Multiple Japanese examples with romaji and translations
- Common mistakes to avoid
- Practice tips
- Cultural context if relevant

Make your response comprehensive and easy to understand.`
}

/**
 * Check if query needs full enhancement or light enhancement
 */
export function shouldUseFullEnhancement(query: string): boolean {
  // Use full enhancement for questions that seem to need detailed explanations
  const complexIndicators = [
    'explain',
    'how',
    'why',
    'what',
    'difference',
    'compare',
    'teach',
    'learn',
    'understand',
    'work',
    'use',
  ]

  const lowerQuery = query.toLowerCase()
  return complexIndicators.some((indicator) => lowerQuery.includes(indicator))
}
