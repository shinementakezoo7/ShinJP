# 🚀 Getting Started with Shinmen Takezo (NVIDIA-Powered)

## Quick Start Guide

Your Japanese learning platform is now powered exclusively by NVIDIA's **stockmark-2-100b-instruct** model - a 100B parameter AI specialized in Japanese language!

---

## Step 1: Get Your NVIDIA API Key 🔑

### Option A: Using NVIDIA Build Platform (Recommended)

1. **Visit** https://build.nvidia.com/
2. **Sign in** or create an account
3. **Navigate** to "API Keys" section
4. **Create** a new API key
5. **Ensure** access to the following models:
   - `stockmark/stockmark-2-100b-instruct` (Primary)
   - `mistralai/mistral-medium-3-instruct` (Fallback)
   - `meta/llama-3.2-11b-vision-instruct` (Multimodal)

### Option B: Using NVIDIA NGC

1. Visit https://ngc.nvidia.com/
2. Sign up for NGC account
3. Generate API key from NGC dashboard
4. Configure NIM endpoints

---

## Step 2: Configure Environment Variables ⚙️

### Create .env.local file:

```bash
cd /workspaces/ShinJP
cp .env.example .env.local
```

### Edit .env.local and add your API key:

```env
# =======================
# NVIDIA API Configuration (REQUIRED)
# =======================
NVIDIA_API_KEY_1=nvapi-YOUR_KEY_HERE
NVIDIA_API_KEY_2=nvapi-YOUR_SECOND_KEY_HERE  # Optional but recommended

# NVIDIA NIM API Endpoints
NVIDIA_ENDPOINT_1=https://integrate.api.nvidia.com/v1/chat/completions
NVIDIA_ENDPOINT_2=https://integrate.api.nvidia.com/v1
```

**💡 Pro Tip:** Get two API keys for:
- Load balancing
- Redundancy
- Higher rate limits

---

## Step 3: Install Dependencies 📦

```bash
npm install
```

**Note:** OpenAI package has been removed. We're NVIDIA-only now! 🎉

---

## Step 4: Run the Development Server 🏃

```bash
npm run dev
```

The app will start at: **http://localhost:3000**

---

## Step 5: Verify NVIDIA Integration ✅

### Check Environment:

```bash
npm run check-env
```

You should see:
```
🤖 AI Configuration:
   NVIDIA NIM API: ✅ Available
   Primary Model: stockmark-2-100b-instruct (100B params)

✅ Environment configured correctly!
```

### Test API Connection:

Open your browser console and run:

```javascript
// Test content generation
fetch('/api/nvidia/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    task: 'textbook_generation',
    messages: [
      { role: 'system', content: 'You are a Japanese teacher.' },
      { role: 'user', content: 'Explain the は particle in Japanese.' }
    ]
  })
})
.then(r => r.json())
.then(console.log)
```

---

## Features Powered by NVIDIA AI 🤖

### 1. **AI Textbook Generator**
Generate complete Japanese textbooks tailored to:
- JLPT levels (N5 to N1)
- Your interests (anime, business, travel)
- Custom topics and themes

### 2. **Interactive Lessons**
- Grammar explanations
- Example dialogues
- Practice exercises
- Cultural notes

### 3. **Conversation Practice**
Chat with AI in Japanese:
- Scenario-based conversations
- Real-time feedback
- Grammar corrections
- Natural language practice

### 4. **Story Generation**
Create reading materials:
- JLPT-appropriate vocabulary
- Engaging narratives
- Vocabulary lists
- Comprehension questions

### 5. **Exercise Creator**
Generate practice exercises:
- Multiple choice
- Fill in the blank
- Translation practice
- Listening comprehension

---

## Model Information 📊

### Primary Model: stockmark-2-100b-instruct

```yaml
Parameters: 100 billion
Context Window: 32,000 tokens
Training Data: 2 trillion tokens
  - 60% English
  - 30% Japanese ✨
  - 10% Code

Specialization:
  - Japanese language instruction
  - JLPT content generation
  - Grammar explanations
  - Natural conversation

Performance:
  - Exceeds GPT-4o in Japanese comprehension
  - Superior for textbook generation
  - Excellent at maintaining consistency
  - Native-level Japanese understanding
```

---

## API Usage Examples 💻

### Generate a Story:

```typescript
import { generateAIContent } from '@/lib/ai/content-generator'

const story = await generateAIContent({
  type: 'story',
  jlptLevel: 3,  // N3 level
  topic: 'A day in Tokyo',
  keywords: ['電車', '友達', '買い物'],
  length: 'medium'
})

console.log(story.content)
// {
//   title: "東京での一日",
//   content: "...",
//   vocabulary: [...],
//   grammarPoints: [...]
// }
```

### Generate a Textbook Chapter:

```typescript
import { generateTextbookChapter } from '@/lib/ai/content-generator'

const chapter = await generateTextbookChapter(
  4,  // N4 level
  1,  // Chapter 1
  'Basic Greetings and Introductions',
  true  // Include exercises
)

console.log(chapter)
// {
//   title: "Chapter 1: Basic Greetings...",
//   sections: [...],
//   vocabulary: [...],
//   exercises: [...]
// }
```

### Generate Conversation:

```typescript
import { generateConversationScenario } from '@/lib/ai/content-generator'

const conversation = await generateConversationScenario(
  5,  // N5 level
  'Ordering food at a restaurant',
  2   // 2 participants
)

console.log(conversation)
// {
//   title: "レストランで注文",
//   dialogue: [...],
//   keyPhrases: [...],
//   culturalNotes: "..."
// }
```

---

## Troubleshooting 🔧

### Problem: "NVIDIA API is not configured"

**Solution:**
1. Check that `NVIDIA_API_KEY_1` is set in `.env.local`
2. Verify the API key is valid
3. Ensure you have access to stockmark models
4. Run `npm run check-env` to diagnose

### Problem: "Model not found" error

**Solution:**
1. Check your NVIDIA account has access to stockmark-2-100b-instruct
2. Try requesting access at https://build.nvidia.com/
3. Use fallback models if needed

### Problem: Rate limiting (429 errors)

**Solution:**
1. Add `NVIDIA_API_KEY_2` for load balancing
2. The system will auto-rotate between keys
3. Built-in exponential backoff handles retries

### Problem: Slow responses

**Solution:**
1. stockmark-2-100b is a large model (100B params)
2. Typical response time: 5-15 seconds
3. Consider using streaming for real-time feedback
4. Use smaller models for simple tasks

---

## Rate Limits & Costs 💰

### NVIDIA NIM API:

- **Free Tier**: Limited requests per month
- **Paid Tier**: Pay-per-request pricing
- **Enterprise**: Custom pricing

**Check current pricing:** https://build.nvidia.com/pricing

### Tips to Optimize Usage:

1. Cache frequently generated content
2. Use smaller models for simple tasks
3. Batch requests when possible
4. Implement client-side caching
5. Use streaming for long responses

---

## Next Steps 🎯

Now that NVIDIA is configured, proceed with Phase 2:

### 1. Set Up Database
```bash
# Follow database setup guide
# See: IMPLEMENTATION_SUMMARY.md
```

### 2. Build Textbook Generator UI
- Create textbook configuration form
- Implement generation progress bar
- Add textbook library view

### 3. Implement Lesson System
- Lesson viewer component
- Progress tracking
- Quiz interface

### 4. Add SRS Flashcards
- SM-2 algorithm
- Daily review system
- Statistics dashboard

---

## Resources 📚

- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Complete implementation plan
- [OPENAI_REMOVAL_COMPLETE.md](./OPENAI_REMOVAL_COMPLETE.md) - Changes made
- [NVIDIA NIM Docs](https://docs.nvidia.com/nim/) - Official documentation
- [stockmark Model Card](https://huggingface.co/stockmark/Stockmark-2-100B-Instruct) - Model details

---

## Support 💬

### Common Questions:

**Q: Why NVIDIA instead of OpenAI?**
A: stockmark-2-100b-instruct is specifically trained for Japanese (30% of training data), making it superior for our use case.

**Q: Can I use other models?**
A: Yes! The system supports any NVIDIA NIM compatible model. Edit `model-router.ts` to add new models.

**Q: What if NVIDIA is down?**
A: The system includes retry logic and can failover to secondary models (mistral, llama).

**Q: Is my data secure?**
A: Yes! All API calls use HTTPS. Data is not stored by NVIDIA beyond processing.

---

**🌸 侍 Shinmen Takezo 侍 🌸**

*Your AI-powered journey to Japanese mastery begins now!*

Ready to learn Japanese? Start generating content with NVIDIA's most powerful Japanese language model! 🚀
