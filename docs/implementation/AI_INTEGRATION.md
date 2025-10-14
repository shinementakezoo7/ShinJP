
# AI Integration Architecture

## Overview

This document outlines the AI integration architecture for the Shinmen Takezo Japanese learning platform. The system is powered exclusively by NVIDIA's specialized Japanese language models, providing high-quality content generation and conversational AI capabilities.

## 1. AI Services Architecture

### 1.1 NVIDIA NIM Integration

The platform uses NVIDIA's NIM (NVIDIA Inference Microservice) API to access specialized Japanese language models:

```typescript
// src/lib/ai/nvidia-client.ts
import { createOpenAI } from '@ai-sdk/openai'

// Configure NVIDIA provider
const nvidia = createOpenAI({
  apiKey: process.env.NVIDIA_API_KEY || '',
  baseURL: process.env.NVIDIA_BASE_URL || 'https://integrate.api.nvidia.com/v1',
})

// Primary model for Japanese content
const JAPANESE_MODEL = 'stockmark/stockmark-2-100b-instruct'
```

### 1.2 Model Router

The model router handles different AI tasks and selects appropriate models:

```typescript
// src/lib/ai/model-router.ts
export enum ModelTask {
  TEXTBOOK_GENERATION = 'textbook_generation',
  CONVERSATION_PRACTICE = 'conversation_practice',
  GRAMMAR_EXPLANATION = 'grammar_explanation',
  VOCABULARY_GENERATION = 'vocabulary_generation',
  KANJI_STROKE_ORDER = 'kanji_stroke_order',
}

export class ModelRouter {
  async route(params: {
    task: ModelTask
    messages: Array<{ role: string; content: string }>
    temperature?: number
    maxTokens?: number
  }) {
    const model = this.selectModel(params.task)

    return await nvidia.chat.completions.create({
      model,
      messages: params.messages,
      temperature: params.temperature || 0.7,
      max_tokens: params.maxTokens || 2000,
    })
  }

  private selectModel(task: ModelTask): string {
    switch (task) {
      case ModelTask.TEXTBOOK_GENERATION:
        return 'stockmark/stockmark-2-100b-instruct'
      case ModelTask.CONVERSATION_PRACTICE:
        return 'meta/llama-3.1-8b-instruct'
      case ModelTask.GRAMMAR_EXPLANATION:
        return 'stockmark/stockmark-2-100b-instruct'
      case ModelTask.VOCABULARY_GENERATION:
        return 'stockmark/stockmark-2-100b-instruct'
      case ModelTask.KANJI_STROKE_ORDER:
        return 'stockmark/stockmark-2-100b-instruct'
      default:
        return 'stockmark/stockmark-2-100b-instruct'
    }
  }
}
```

## 2. Content Generation Services

### 2.1 JLPT-Compliant Content Generator

The content generator creates Japanese learning materials that adhere to JLPT specifications:

```typescript
// src/lib/ai/jlpt-content-generator.ts
export class JLPTContentGenerator {
  async generateTextbookChapter(params: {
    jlptLevel: JLPTLevel
    chapterNumber: number
    topic: string
    grammarPatterns?: string[]
    vocabularyItems?: string[]
    includeCulturalNotes?: boolean
    includeSlang?: boolean
  }) {
    const prompt = this.createJLPTPrompt(params)

    const response = await modelRouter.route({
      task: ModelTask.TEXTBOOK_GENERATION,
      messages: [
        {
          role: 'system',
          content: `You are an expert Japanese language instructor creating JLPT ${params.jlptLevel} content. All content must be accurate, culturally appropriate, and follow official JLPT specifications.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      maxTokens: 4000,
    })

    return this.parseAndValidateResponse(response.choices[0].message.content)
  }

  private createJLPTPrompt(params: {
    jlptLevel: JLPTLevel
    chapterNumber: number
    topic: string
    grammarPatterns?: string[]
    vocabularyItems?: string[]
    includeCulturalNotes?: boolean
    includeSlang?: boolean
  }): string {
    return `
      Create Chapter ${params.chapterNumber} of a JLPT ${params.jlptLevel} textbook on: ${params.topic}

      Requirements:
      - Include 15-20 vocabulary items appropriate for ${params.jlptLevel}
      - Include 3-5 grammar patterns with detailed explanations
      - Provide 10+ example sentences with translations
      - Include cultural notes about usage context
      - Add practice exercises with answer keys
      ${params.includeSlang ? 'Include relevant slang/colloquial expressions' : ''}

      Format as JSON with this structure:
      {
        "title": "Chapter title",
        "introduction": "Brief introduction",
        "vocabulary": [
          {
            "word": "日本語",
            "reading": "にほんご",
            "meaning": "Japanese language",
            "type": "noun",
            "jlptLevel": "${params.jlptLevel}",
            "examples": [
              {
                "japanese": "日本語を勉強しています。",
                "romaji": "Nihongo o benkyou shiteimasu.",
                "english": "I am studying Japanese."
              }
            ]
          }
        ],
        "grammarPoints": [
          {
            "pattern": "〜ています",
            "meaning": "Present progressive tense",
            "formation": "Verb stem + ています",
            "usage": "Actions in progress",
            "examples": [
              {
                "japanese": "今、勉強しています。",
                "romaji": "Ima, benkyou shiteimasu.",
                "english": "I am studying now."
              }
            ]
          }
        ],
        "exercises": [
          {
            "type": "fill_in_blank",
            "question": "日本語を______います。",
            "answer": "勉強し",
            "explanation": "Present progressive form of 勉強する (benkyou suru)"
          }
        ],
        "culturalNotes": [
          {
            "topic": "Language learning in Japan",
            "content": "Japanese people appreciate when foreigners make an effort to learn their language..."
          }
        ]
      }
    `
  }
}
```

### 2.2 Conversation Partner

The AI conversation partner provides interactive Japanese practice:

```typescript
// src/app/api/ai/chat/route.ts
export async function POST(req: NextRequest) {
  const startTime = Date.now()

  try {
    const { messages, conversationId, model = 'meta/llama-3.1-8b-instruct' } = await req.json()

    if (!messages || !Array.isArray(messages)) {
      return new Response('Messages array is required', { status: 400 })
    }

    // Track chat message sent
    const lastMessage = messages[messages.length - 1]
  async processMessage(userId, message, context = {}) {
    // Get conversation history
    const history = this.getConversationHistory(userId);

    // Build prompt with context
    const prompt = this.buildConversationPrompt(message, history, context);

    // Get AI response
    const response = await this.openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: prompt,
      temperature: context.temperature || 0.7,
      max_tokens: 500
    });

    const aiMessage = response.choices[0].message.content;

    // Save conversation turn
    this.saveConversationTurn(userId, message, aiMessage);

    // Analyze sentiment if needed
    if (context.analyzeSentiment) {
      const sentiment = await this.analyzeSentiment(aiMessage);
      return { message: aiMessage, sentiment };
    }

    return { message: aiMessage };
  }

  buildConversationPrompt(userMessage, history, context) {
    const systemMessage = {
      role: "system",
      content: `You are a Japanese conversation partner and tutor.
                JLPT Level: ${context.jlptLevel || 'N5'}
                Teaching Style: ${context.teachingStyle || 'friendly'}
                Current Topic: ${context.topic || 'general conversation'}

                Provide corrections when appropriate and explain grammar points.
                Respond in Japanese unless the user switches to English.`
    };

    const conversationMessages = history.map(turn => [
      { role: "user", content: turn.user },
      { role: "assistant", content: turn.ai }
    ]).flat();

    return [
      systemMessage,
      ...conversationMessages,
      { role: "user", content: userMessage }
    ];
  }

  getConversationHistory(userId) {
    return this.conversationHistory.get(userId) || [];
  }

  saveConversationTurn(userId, userMessage, aiMessage) {
    const history = this.getConversationHistory(userId);
    history.push({ user: userMessage, ai: aiMessage, timestamp: Date.now() });

    // Keep only last 10 turns
    if (history.length > 10) {
      history.shift();
    }

    this.conversationHistory.set(userId, history);
  }

  async analyzeSentiment(text) {
    const prompt = `
      Analyze the sentiment of this Japanese text:
      "${text}"

      Return JSON with:
      {
        "sentiment": "positive|neutral|negative",
        "confidence": 0.0-1.0,
        "emotional_tone": "encouraging|neutral|concerned",
        "feedback_suggestion": "Suggested response tone"
      }
    `;

    const response = await this.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 200,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }
}

export const conversationPartner = new ConversationPartner();
```

## 3. Speech Recognition Integration

### 3.1 Google Cloud Speech-to-Text

#### Pronunciation Analyzer
```javascript
// lib/ai/google-speech/pronunciation-analyzer.js
import speech from '@google-cloud/speech';

class PronunciationAnalyzer {
  constructor() {
    this.client = new speech.SpeechClient();
  }

  async analyzePronunciation(audioBuffer, referenceText) {
    const config = {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: 48000,
      languageCode: 'ja-JP',
      enableWordTimeOffsets: true,
      enableAutomaticPunctuation: true,
      model: 'latest_long',
      useEnhanced: true
    };

    const audio = {
      content: audioBuffer.toString('base64')
    };

    const request = {
      config: config,
      audio: audio
    };

    const [response] = await this.client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    // Analyze pronunciation quality
    const pronunciationScore = await this.calculatePronunciationScore(
      transcription,
      referenceText
    );

    return {
      transcription,
      confidence: response.results[0]?.alternatives[0]?.confidence || 0,
      pronunciationScore,
      wordLevelAnalysis: this.analyzeWordLevel(response.results, referenceText)
    };
  }

  async calculatePronunciationScore(transcription, referenceText) {
    // Use OpenAI to compare pronunciation accuracy
    const prompt = `
      Compare these two Japanese texts for pronunciation practice:
      Reference: "${referenceText}"
      User transcription: "${transcription}"

      Rate pronunciation accuracy 0-100 and provide specific feedback.
      Return JSON:
      {
        "score": 0-100,
        "feedback": "Detailed feedback",
        "mispronounced_words": ["word1", "word2"],
        "suggestions": ["suggestion1", "suggestion2"]
      }
    `;

    const response = await aiServiceManager.getService('openai').chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  analyzeWordLevel(results, referenceText) {
    const words = [];
    results.forEach(result => {
      result.alternatives[0].words.forEach(wordInfo => {
        words.push({
          word: wordInfo.word,
          startTime: wordInfo.startTime,
          endTime: wordInfo.endTime,
          confidence: wordInfo.confidence
        });
      });
    });
    return words;
  }
}

export const pronunciationAnalyzer = new PronunciationAnalyzer();
```

## 4. Text-to-Speech Integration

### 4.1 ElevenLabs Integration

#### Speech Synthesizer
```javascript
// lib/ai/elevenlabs/tts-service.js
class TTSService {
  constructor() {
    this.apiKey = process.env.ELEVENLABS_API_KEY;
    this.baseUrl = 'https://api.elevenlabs.io/v1';
  }

  async generateSpeech(text, voiceId = 'default_japanese_voice', options = {}) {
    const response = await fetch(`${this.baseUrl}/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': this.apiKey
      },
      body: JSON.stringify({
        text: text,
        model_id: options.modelId || 'eleven_multilingual_v2',
        voice_settings: {
          stability: options.stability || 0.5,
          similarity_boost: options.similarityBoost || 0.75,
          style: options.style || 0.0,
          useSpeaker_boost: options.useSpeakerBoost || true
        }
      })
    });

    if (!response.ok) {
      throw new Error(`TTS API error: ${response.statusText}`);
    }

    const audioBuffer = await response.arrayBuffer();
    return Buffer.from(audioBuffer);
  }

  async getVoices() {
    const response = await fetch(`${this.baseUrl}/voices`, {
      headers: {
        'xi-api-key': this.apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Voices API error: ${response.statusText}`);
    }

    return await response.json();
  }

  async cloneVoice(audioSample, voiceName) {
    const formData = new FormData();
    formData.append('name', voiceName);
    formData.append('files', new Blob([audioSample]), 'sample.mp3');

    const response = await fetch(`${this.baseUrl}/voices/add`, {
      method: 'POST',
      headers: {
        'xi-api-key': this.apiKey
      },
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Voice cloning error: ${response.statusText}`);
    }

    return await response.json();
  }
}

export const ttsService = new TTSService();
```

## 5. Handwriting Recognition

### 5.1 Azure Cognitive Services Integration

#### Handwriting Recognizer
```javascript
// lib/ai/azure/handwriting-recognizer.js
class HandwritingRecognizer {
  constructor() {
    this.subscriptionKey = process.env.AZURE_COGNITIVE_KEY;
    this.endpoint = process.env.AZURE_COGNITIVE_ENDPOINT;
  }

  async recognizeHandwriting(imageBuffer) {
    // First, submit the image for analysis
    const operationResponse = await fetch(
      `${this.endpoint}/formrecognizer/v3.0-preview.2/documentModels/prebuilt-handwrittenJpn:analyze`,
      {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey,
          'Content-Type': 'image/png'
        },
        body: imageBuffer
      }
    );

    if (!operationResponse.ok) {
      throw new Error(`Handwriting recognition submission failed: ${operationResponse.statusText}`);
    }

    const operationLocation = operationResponse.headers.get('operation-location');
    if (!operationLocation) {
      throw new Error('No operation location returned');
    }

    // Poll for results
    return await this.pollForResult(operationLocation);
  }

  async pollForResult(operationLocation) {
    let retries = 0;
    const maxRetries = 30;

    while (retries < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second

      const resultResponse = await fetch(operationLocation, {
        headers: {
          'Ocp-Apim-Subscription-Key': this.subscriptionKey
        }
      });

      if (!resultResponse.ok) {
        throw new Error(`Result polling failed: ${resultResponse.statusText}`);
      }

      const result = await resultResponse.json();

      if (result.status === 'succeeded') {
        return this.processRecognitionResult(result);
      } else if (result.status === 'failed') {
        throw new Error('Handwriting recognition failed');
      }

      retries++;
    }

    throw new Error('Handwriting recognition timed out');
  }

  processRecognitionResult(result) {
    const pages = result.analyzeResult.pages;
    const recognizedText = [];

    pages.forEach(page => {
      page.lines.forEach(line => {
        recognizedText.push({
          text: line.content,
          boundingBox: line.boundingBox,
          words: line.words.map(word => ({
            text: word.content,
            confidence: word.confidence
          }))
        });
      });
    });

    return {
      fullText: recognizedText.map(line => line.text).join('\n'),
      lines: recognizedText,
      confidence: this.calculateOverallConfidence(recognizedText)
    };
  }

  calculateOverallConfidence(lines) {
    let totalConfidence = 0;
    let wordCount = 0;

    lines.forEach(line => {
      line.words.forEach(word => {
        totalConfidence += word.confidence;
        wordCount++;
      });
    });

    return wordCount > 0 ? totalConfidence / wordCount : 0;
  }
}

export const handwritingRecognizer = new HandwritingRecognizer();
```

## 6. AI Orchestration Layer

### 6.1 AI Workflow Manager

#### Learning Assistant Orchestrator
```javascript
// lib/ai/orchestrator.js
class AIOrchestrator {
  constructor() {
    this.serviceManager = aiServiceManager;
  }

  async generatePersonalizedLesson(userId, lessonParams) {
    // Step 1: Get user profile and learning history
    const userProfile = await this.getUserProfile(userId);

    // Step 2: Generate content with OpenAI
    const content = await contentGenerator.generateLessonContent({
      jlptLevel: userProfile.jlptLevel,
      interests: userProfile.interests,
      objectives: lessonParams.objectives,
      weakAreas: userProfile.weakAreas
    });

    // Step 3: Generate audio narration
    const audioNarration = await ttsService.generateSpeech(
      content.vocabulary.map(v => v.example_sentence).join(' '),
      'japanese_female_voice'
    );

    // Step 4: Store generated content
    const storedContent = await this.storeGeneratedContent({
      userId,
      content,
      audio: audioNarration,
      contentType: 'lesson'
    });

    return storedContent;
  }

  async processConversationTurn(userId, message, context) {
    // Analyze user message
    const sentiment = await conversationPartner.analyzeSentiment(message);

    // Process with conversation partner
    const response = await conversationPartner.processMessage(userId, message, {
      ...context,
      analyzeSentiment: true
    });

    // Generate speech for response if needed
    let audioResponse = null;
    if (context.requiresAudio) {
      audioResponse = await ttsService.generateSpeech(response.message);
    }

    // Save conversation
    await this.saveConversationTurn(userId, {
      userMessage: message,
      aiResponse: response.message,
      sentiment: sentiment,
      audio: audioResponse
    });

    return {
      message: response.message,
      sentiment: response.sentiment,
      audio: audioResponse
    };
  }

  async analyzeHandwritingPractice(userId, imageBuffer, expectedText) {
    // Recognize handwriting
    const recognitionResult = await handwritingRecognizer.recognizeHandwriting(imageBuffer);

    // Compare with expected text
    const comparisonResult = await this.compareTexts(
      recognitionResult.fullText,
      expectedText
    );

    // Provide feedback
    const feedback = await this.generateFeedback(
      recognitionResult,
      comparisonResult,
      userId
    );

    return {
      recognizedText: recognitionResult.fullText,
      accuracy: comparisonResult.accuracy,
      feedback: feedback,
      confidence: recognitionResult.confidence
    };
  }

  async analyzePronunciationPractice(userId, audioBuffer, referenceText) {
    // Analyze pronunciation
    const pronunciationResult = await pronunciationAnalyzer.analyzePronunciation(
      audioBuffer,
      referenceText
    );

    // Generate feedback
    const feedback = await this.generatePronunciationFeedback(
      pronunciationResult,
      userId
    );

    return {
      transcription: pronunciationResult.transcription,
      score: pronunciationResult.pronunciationScore.score,
      feedback: feedback,
      wordAnalysis: pronunciationResult.wordLevelAnalysis
    };
  }

  async getUserProfile(userId) {
    // In practice, this would fetch from database
    return {
      jlptLevel: 3,
      interests: ['technology', 'travel'],
      weakAreas: ['particles', 'keigo'],
      learningStyle: 'visual'
    };
  }

  async compareTexts(recognizedText, expectedText) {
    // Use OpenAI to compare texts
    const prompt = `
      Compare these Japanese texts:
      Expected: "${expectedText}"
      Recognized: "${recognizedText}"

      Return JSON with:
      {
        "accuracy": 0-100,
        "errors": [{"expected": "char", "recognized": "char", "position": 0}],
        "feedback": "Overall feedback"
      }
    `;

    const response = await aiServiceManager.getService('openai').chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
      max_tokens: 300,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async generateFeedback(recognitionResult, comparisonResult, userId) {
    const prompt = `
      Provide detailed feedback for Japanese handwriting practice:
      Recognized text: "${recognitionResult.fullText}"
      Accuracy: ${comparisonResult.accuracy}%
      Confidence: ${recognitionResult.confidence}

      User ID: ${userId}

      Return JSON with:
      {
        "overall_score": 0-100,
        "strengths": ["strength1", "strength2"],
        "areas_for_improvement": ["area1", "area2"],
        "specific_suggestions": ["suggestion1", "suggestion2"],
        "next_steps": "Recommendations for improvement"
      }
    `;

    const response = await aiServiceManager.getService('openai').chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 400,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async generatePronunciationFeedback(pronunciationResult, userId) {
    const prompt = `
      Provide feedback for Japanese pronunciation practice:
      Transcription: "${pronunciationResult.transcription}"
      Pronunciation Score: ${pronunciationResult.pronunciationScore.score}

      Return JSON with:
      {
        "overall_assessment": "Overall assessment",
        "strengths": ["strength1", "strength2"],
        "problem_areas": ["area1", "area2"],
        "pronunciation_tips": ["tip1", "tip2"],
        "practice_recommendations": ["recommendation1", "recommendation2"]
      }
    `;

    const response = await aiServiceManager.getService('openai').chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
      max_tokens: 400,
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async storeGeneratedContent(contentData) {
    // In practice, this would store in database
    return {
      id: Date.now(),
      ...contentData,
      createdAt: new Date().toISOString()
    };
  }

  async saveConversationTurn(userId, conversationData) {
    // In practice, this would store in database
    console.log(`Saving conversation for user ${userId}:`, conversationData);
  }
}

export const aiOrchestrator = new AIOrchestrator();
```

## 7. AI Monitoring and Analytics

### 7.1 AI Usage Tracking

#### AI Metrics Collector
```javascript
// lib/ai/analytics/metrics-collector.js
class AIMetricsCollector {
  constructor() {
    this.metrics = {
      openai: { calls: 0, tokens: 0, errors: 0 },
      googleSpeech: { calls: 0, seconds: 0, errors: 0 },
      azureCognitive: { calls: 0, characters: 0, errors: 0 },
      elevenLabs: { calls: 0, characters: 0, errors: 0 }
    };
  }

  trackAPICall(service, tokensOrUnits, success = true) {
    if (!this.metrics[service]) {
      this.metrics[service] = { calls: 0, tokens: 0, errors: 0 };
    }

    this.metrics[service].calls += 1;

    if (typeof tokensOrUnits === 'number') {
      if (service === 'openai') {
        this.metrics[service].tokens += tokensOrUnits;
      } else if (service === 'googleSpeech') {
        this.metrics[service].seconds += tokensOrUnits;
      } else {
        this.metrics[service].characters += tokensOrUnits;
      }
    }

    if (!success) {
      this.metrics[service].errors += 1;
    }
  }

  getMetrics() {
    return this.metrics;
  }

  resetMetrics() {
    Object.keys(this.metrics).forEach(service => {
      this.metrics[service] = { calls: 0, tokens: 0, errors: 0 };
    });
  }

  async logUsageToDatabase(userId, service, usageData) {
    // In production, log to database
    console.log(`User ${userId} used ${service}:`, usageData);
  }
}

export const aiMetricsCollector = new AIMetricsCollector();
```

## 8. Error Handling and Fallbacks

### 8.1 AI Service Error Handler

#### Resilient AI Service Client
```javascript
// lib/ai/error-handler.js
class AIErrorHandler {
  constructor() {
    this.retryAttempts = 3;
    this.backoffBase = 1000; // 1 second
  }

  async executeWithRetry(serviceFunction, ...args) {
    let lastError;

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const result = await serviceFunction(...args);
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`AI service attempt ${attempt} failed:`, error.message);

        if (attempt < this.retryAttempts) {
          // Exponential backoff
          const delay = Math.pow(2, attempt - 1) * this.backoffBase;
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw new Error(`AI service failed after ${this.retryAttempts} attempts: ${lastError.message}`);
  }

  async executeWithFallback(primaryService, fallbackServices, ...args) {
    try {
      return await this.executeWithRetry(primaryService, ...args);
    } catch (primaryError) {
      console.warn('Primary AI service failed, trying fallbacks:', primaryError.message);

      for (const fallbackService of fallbackServices) {
        try {
          return await this.executeWithRetry(fallbackService, ...args);
        } catch (fallbackError) {
          console.warn(`Fallback service failed:`, fallbackError.message);
        }
      }

      throw new Error('All AI services failed');
    }
  }
}

export const aiErrorHandler = new AIErrorHandler();
```

## 9. Implementation Roadmap

### Phase 1: Core AI Services
- OpenAI integration for content generation
- Basic conversation partner functionality
- Simple TTS implementation

### Phase 2: Advanced Features
- Speech recognition for pronunciation practice
- Handwriting recognition integration
- Sentiment analysis for adaptive responses

### Phase 3: Orchestration & Analytics
- AI workflow orchestration
- Usage tracking and analytics
- Advanced error handling

### Phase 4: Optimization
- Caching strategies
- Performance monitoring
- Cost optimization
