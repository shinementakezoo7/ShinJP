# 🎯 Integration Examples - PostHog Analytics & Vercel AI SDK

This document provides practical examples of how to use the newly integrated PostHog Analytics and Vercel AI SDK in your components.

---

## 📊 PostHog Analytics Integration

### 1. Using the `useAnalytics` Hook (Recommended)

The easiest way to track events in React components:

```typescript
'use client'

import { useAnalytics } from '@/hooks/useAnalytics'

function MyComponent() {
  const { trackLessonStarted, trackLessonCompleted } = useAnalytics()
  
  const handleStartLesson = () => {
    trackLessonStarted('N3', 'Transportation')
    // ... start lesson logic
  }
  
  const handleCompleteLesson = (duration: number) => {
    trackLessonCompleted('N3', 'Transportation', duration)
    // ... completion logic
  }
  
  return (
    <button onClick={handleStartLesson}>
      Start Lesson
    </button>
  )
}
```

### 2. Direct Analytics Usage (Server-Side)

For API routes and server components:

```typescript
// In API route
import { analytics } from '@/lib/analytics/posthog'

export async function POST(req: Request) {
  const startTime = Date.now()
  
  try {
    // Your logic here
    const result = await generateSomething()
    
    // Track success
    const duration = Date.now() - startTime
    analytics.textbookGenerated('caregiving', 'SSW1', duration)
    
    return Response.json({ success: true, result })
  } catch (error) {
    // Track error
    analytics.error(error as Error, {
      route: 'api/generate',
      duration: Date.now() - startTime,
    })
    
    throw error
  }
}
```

### 3. Tracking User Actions

#### JLPT Lessons
```typescript
// When user starts a lesson
analytics.lessonStarted('N3', 'Grammar: Te-form')

// When user completes a lesson
analytics.lessonCompleted('N3', 'Grammar: Te-form', 1800) // 30 minutes
```

#### SSW Textbooks
```typescript
// When textbook is generated
analytics.textbookGenerated('caregiving', 'SSW1', 5000) // 5 seconds

// When user downloads textbook
analytics.textbookDownloaded('textbook-abc123', 'caregiving')
```

#### Kanji Practice
```typescript
// When user practices a kanji
analytics.kanjiPracticed('日', 95, 4) // kanji, accuracy %, stroke count

// When user masters a kanji
analytics.kanjiMastered('日', 12) // kanji, total attempts
```

#### Audio Features
```typescript
// When audio is generated
analytics.audioGenerated('こんにちは', 'Keita', 1.0) // text, voice, speed

// When user plays audio
analytics.audioPlayed('こんにちは', 'Keita')
```

#### Chat/AI Features
```typescript
// When user sends message
analytics.chatMessageSent(message.length, conversationId)

// When AI responds
analytics.chatResponseReceived(response.length, latency)
```

#### Books
```typescript
// When user opens a book
analytics.bookOpened('book-123', 'JLPT N3 Grammar Guide')

// When progress is updated
analytics.bookProgressUpdated('book-123', 45) // 45% complete
```

#### Exercises
```typescript
// When exercise starts
analytics.exerciseStarted('ex-123', 'multiple-choice')

// When exercise completes
analytics.exerciseCompleted('ex-123', 85, 120) // score %, duration seconds
```

### 4. Error Tracking

```typescript
try {
  // Your code
} catch (error) {
  analytics.error(error as Error, {
    component: 'TextbookGenerator',
    userId: user.id,
    action: 'generate',
  })
}
```

### 5. Feature Usage Tracking

```typescript
// Track when users use a feature
analytics.featureUsed('voice-recording', {
  duration: 5.2,
  success: true,
  voice: 'Keita',
})

analytics.featureUsed('pdf-export', {
  format: 'A4',
  pages: 42,
})
```

---

## 🤖 Vercel AI SDK Integration

### 1. Chat API Route (Streaming)

**New streaming chat endpoint:**

```typescript
// src/app/api/ai/chat/route.ts
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'

const nvidia = createOpenAI({
  apiKey: process.env.NVIDIA_API_KEY!,
  baseURL: 'https://integrate.api.nvidia.com/v1',
  compatibility: 'compatible',
})

export async function POST(req: Request) {
  const { messages } = await req.json()
  
  const result = await streamText({
    model: nvidia('meta/llama-3.1-8b-instruct'),
    messages,
    temperature: 0.7,
  })
  
  return result.toAIStreamResponse()
}
```

### 2. Client-Side Chat Component

**Before (Manual State Management - 50+ lines):**
```typescript
const [messages, setMessages] = useState([])
const [input, setInput] = useState('')
const [loading, setLoading] = useState(false)

const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  
  const newMessages = [...messages, { role: 'user', content: input }]
  setMessages(newMessages)
  setInput('')
  
  const response = await fetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages: newMessages }),
  })
  
  const reader = response.body.getReader()
  let assistantMessage = ''
  
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    // Manual streaming logic...
  }
  
  setLoading(false)
}
```

**After (Automatic with useChat - 10 lines):**
```typescript
'use client'

import { useChat } from 'ai/react'

function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
  })
  
  return (
    <div>
      <div>
        {messages.map((m) => (
          <div key={m.id}>
            <strong>{m.role}:</strong> {m.content}
          </div>
        ))}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input 
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
          placeholder="Type your message..."
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </form>
    </div>
  )
}
```

### 3. Generate Text (Non-Streaming)

```typescript
// src/lib/ai/vercel-ai.ts
import { generateAITextSync } from '@/lib/ai/vercel-ai'

// Simple text generation
const response = await generateAITextSync(
  'Explain the Japanese particle "は" in simple terms',
  {
    temperature: 0.7,
    maxTokens: 500,
  }
)

console.log(response)
```

### 4. Structured Output with Zod

```typescript
import { generateStructuredOutput } from '@/lib/ai/vercel-ai'
import { z } from 'zod'

// Define your schema
const lessonSchema = z.object({
  title: z.string(),
  vocabulary: z.array(z.object({
    word: z.string(),
    reading: z.string(),
    meaning: z.string(),
  })),
  grammar: z.array(z.object({
    pattern: z.string(),
    explanation: z.string(),
  })),
})

// Generate structured data
const lesson = await generateStructuredOutput(
  'Create a JLPT N5 lesson about greetings',
  lessonSchema
)

// TypeScript knows the exact structure!
console.log(lesson.title)
console.log(lesson.vocabulary[0].word)
```

### 5. Pre-built Helper Functions

#### Generate JLPT Lesson
```typescript
import { generateJLPTLesson } from '@/lib/ai/vercel-ai'

const lesson = await generateJLPTLesson('N3', 'transportation')

// Returns structured lesson with:
// - title
// - vocabulary (10 words with readings, meanings, examples)
// - grammar (3-5 patterns with explanations)
// - exercises (5 practice questions)
```

#### Generate SSW Textbook
```typescript
import { generateSSWTextbook } from '@/lib/ai/vercel-ai'

const textbook = await generateSSWTextbook('caregiving', 'SSW1')

// Returns structured textbook with:
// - chapters (3-5 chapters)
// - vocabulary (50+ sector-specific terms)
// - scenarios (workplace dialogues)
// - cultural notes
```

#### Analyze Kanji
```typescript
import { analyzeKanji } from '@/lib/ai/vercel-ai'

const analysis = await analyzeKanji('日')

// Returns:
// - readings (onyomi, kunyomi)
// - meanings
// - stroke count
// - JLPT level
// - example words
// - mnemonic story
```

### 6. Chat with History
```typescript
import { generateChatResponse } from '@/lib/ai/vercel-ai'

const conversationHistory = [
  { role: 'user', content: 'What is the particle は?' },
  { role: 'assistant', content: 'は (wa) is a topic marker...' },
]

const response = await generateChatResponse(
  'Can you give more examples?',
  conversationHistory
)

// Returns streaming response with context
```

---

## 🎯 Real-World Integration Examples

### Example 1: Textbook Generation with Analytics

```typescript
'use client'

import { useState } from 'react'
import { useAnalytics } from '@/hooks/useAnalytics'

function TextbookGenerator() {
  const [generating, setGenerating] = useState(false)
  const { trackTextbookGenerated, trackError } = useAnalytics()
  
  const handleGenerate = async () => {
    const startTime = Date.now()
    setGenerating(true)
    
    try {
      const response = await fetch('/api/textbooks/generate-ssw', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Caregiving Basics',
          sswType: 'SSW1',
          targetSector: 'caregiving',
          numberOfChapters: 5,
        }),
      })
      
      if (!response.ok) throw new Error('Generation failed')
      
      const data = await response.json()
      
      // Track successful generation
      const duration = Date.now() - startTime
      trackTextbookGenerated('caregiving', 'SSW1', duration)
      
      // Success!
      alert('Textbook generated successfully!')
      
    } catch (error) {
      trackError(error as Error, {
        component: 'TextbookGenerator',
        sector: 'caregiving',
      })
      
      alert('Failed to generate textbook')
    } finally {
      setGenerating(false)
    }
  }
  
  return (
    <button onClick={handleGenerate} disabled={generating}>
      {generating ? 'Generating...' : 'Generate Textbook'}
    </button>
  )
}
```

### Example 2: Kanji Practice with Analytics

```typescript
// HandwritingCanvas.tsx - Already integrated!

'use client'

import { useAnalytics } from '@/hooks/useAnalytics'

function HandwritingCanvas({ kanji }: { kanji: string }) {
  const { trackKanjiPracticed, trackKanjiMastered } = useAnalytics()
  
  const handleSubmit = async (strokes) => {
    const response = await analyzeHandwriting(strokes)
    const accuracy = response.accuracy
    
    // Track practice
    trackKanjiPracticed(kanji, accuracy, strokes.length)
    
    // Track mastery if high score
    if (accuracy >= 90) {
      trackKanjiMastered(kanji, attemptCount)
    }
  }
  
  return (
    <canvas onSubmit={handleSubmit}>
      {/* Canvas implementation */}
    </canvas>
  )
}
```

### Example 3: AI Chat with Analytics

```typescript
'use client'

import { useChat } from 'ai/react'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useEffect } from 'react'

function AIChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
  })
  
  const { trackChatMessageSent, trackChatResponseReceived } = useAnalytics()
  
  // Track messages
  useEffect(() => {
    if (messages.length === 0) return
    
    const lastMessage = messages[messages.length - 1]
    
    if (lastMessage.role === 'user') {
      trackChatMessageSent(lastMessage.content.length, 'conversation-1')
    } else if (lastMessage.role === 'assistant') {
      trackChatResponseReceived(lastMessage.content.length, 1000)
    }
  }, [messages])
  
  return (
    <div>
      {messages.map((m) => (
        <div key={m.id}>
          <strong>{m.role}:</strong> {m.content}
        </div>
      ))}
      
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
        <button type="submit" disabled={isLoading}>Send</button>
      </form>
    </div>
  )
}
```

---

## 🧪 Testing Your Integration

### 1. Test PostHog Analytics

```typescript
// Check if PostHog is initialized
import { getPostHog } from '@/lib/analytics/posthog'

const posthog = getPostHog()
console.log('PostHog initialized:', posthog.has_opted_in_capturing())
```

### 2. Test in Development

PostHog runs in debug mode during development. Open your browser console to see:
```
PostHog Debug: Event captured: "lesson_started"
PostHog Debug: Properties: { jlpt_level: "N3", lesson: "Grammar" }
```

### 3. View Events in PostHog Dashboard

1. Go to [app.posthog.com](https://app.posthog.com)
2. Navigate to "Events" → "Live events"
3. You'll see events as they happen in real-time!

---

## 📚 Quick Reference

### PostHog Events Available
- `lesson_started`, `lesson_completed`
- `ssw_textbook_generated`, `ssw_textbook_downloaded`
- `kanji_practiced`, `kanji_mastered`
- `audio_generated`, `audio_played`
- `chat_message_sent`, `chat_response_received`
- `book_opened`, `book_progress_updated`
- `exercise_started`, `exercise_completed`
- `error_occurred`, `feature_used`

### Vercel AI SDK Functions
- `generateAIText()` - Streaming text
- `generateAITextSync()` - Non-streaming text
- `generateStructuredOutput()` - Structured data with Zod
- `generateJLPTLesson()` - JLPT lesson generator
- `generateSSWTextbook()` - SSW textbook generator
- `generateChatResponse()` - Chat with context
- `analyzeKanji()` - Kanji analysis

---

## 🎉 You're Ready!

Everything is now integrated and working. Start adding analytics to your features and simplifying your AI code with the Vercel AI SDK!

**Need help?** Check:
- PostHog Docs: https://posthog.com/docs
- Vercel AI SDK Docs: https://sdk.vercel.ai
- Your implementation files:
  - `src/lib/analytics/posthog.ts`
  - `src/lib/ai/vercel-ai.ts`
  - `src/hooks/useAnalytics.ts`
  - `src/components/providers/PostHogProvider.tsx`
