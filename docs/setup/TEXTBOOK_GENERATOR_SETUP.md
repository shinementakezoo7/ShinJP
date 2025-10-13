# AI Textbook Generator - Setup Guide

## 🚀 Quick Start

Follow these steps to get the enhanced AI Textbook Generator working with NVIDIA stockmark-2-100b-instruct model.

---

## 1. Environment Configuration

### ✅ Verify Environment Variables

Your `.env.local` should have:

```bash
# NVIDIA API Configuration (REQUIRED)
NVIDIA_API_KEY_1=your_nvidia_api_key_here
NVIDIA_API_KEY_2=your_backup_nvidia_api_key_here  # Optional

# NVIDIA Endpoints
NVIDIA_ENDPOINT_1=https://integrate.api.nvidia.com/v1/chat/completions
NVIDIA_ENDPOINT_2=https://integrate.api.nvidia.com/v1

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Get NVIDIA API Key

1. Go to [NVIDIA AI](https://build.nvidia.com/)
2. Sign in or create account
3. Navigate to API Keys section
4. Generate API key for `stockmark/stockmark-2-100b-instruct`
5. Copy to your `.env.local`

---

## 2. Database Migration

### Apply Schema Changes

The enhanced textbook generator requires new database fields. Apply the migration:

#### Option A: Manual (Recommended)

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Navigate to: **SQL Editor**
3. Open and run: `database/migrations/009_add_textbook_enhancements.sql`
4. Click **RUN** to execute

#### Option B: Script

```bash
cd /workspaces/ShinJP
node scripts/apply-textbook-migration.js
```

### Migration Adds:

**To `textbooks` table:**
- `error_message` TEXT
- `content_type` VARCHAR(50)

**To `textbook_chapters` table:**
- `content` JSONB
- `content_type` VARCHAR(50)
- `includes_exercises` BOOLEAN
- `includes_cultural_notes` BOOLEAN
- `includes_slang` BOOLEAN
- `includes_mnemonics` BOOLEAN
- `generated_at` TIMESTAMP

---

## 3. Verify NVIDIA Connection

Test that the NVIDIA API is working:

```bash
# Test NVIDIA API connection
node test-nvidia.mjs
```

Expected output:
```
🚀 Testing NVIDIA API Connection...
✅ NVIDIA API is working!
   Model: stockmark/stockmark-2-100b-instruct
   Response: [Generated Japanese content]
```

If it fails:
- ❌ Check your NVIDIA_API_KEY_1 in `.env.local`
- ❌ Ensure the model name is correct: `stockmark/stockmark-2-100b-instruct`
- ❌ Verify your API key has access to this model

---

## 4. Model Configuration

The system is configured to use:

### Primary Model: **stockmark-2-100b-instruct**

**Model Details:**
- **Provider:** NVIDIA NIM
- **Parameters:** 100 billion
- **Specialization:** Japanese language
- **Context Window:** 122,000 tokens
- **Endpoint:** `https://integrate.api.nvidia.com/v1/chat/completions`

**Configured For:**
- ✅ Textbook generation
- ✅ Grammar explanations
- ✅ Vocabulary lessons
- ✅ Kanji lessons
- ✅ Conversation practice
- ✅ Story generation
- ✅ Exercise generation

### Configuration Files:

**Model Router:** `src/lib/ai/model-router.ts`
```typescript
[ModelTask.TEXTBOOK_GENERATION]: [
  'stockmark/stockmark-2-100b-instruct'
],
[ModelTask.GRAMMAR_EXPLANATION]: [
  'stockmark/stockmark-2-100b-instruct'
],
// ... all Japanese tasks use stockmark
```

**NVIDIA Client:** `src/lib/ai/nvidia-client.ts`
```typescript
endpoints: [
  'https://integrate.api.nvidia.com/v1/chat/completions',
  // ...
],
modelEndpointMap: {
  'stockmark/stockmark-2-100b-instruct': 
    'https://integrate.api.nvidia.com/v1/chat/completions'
}
```

---

## 5. API Endpoints

### Generate Textbook

**Endpoint:** `POST /api/textbooks/generate`

**Request Body:**
```json
{
  "title": "My Japanese Journey",
  "jlptLevel": 5,
  "contentType": "textbook_chapter",
  "topics": ["Greetings", "Daily Routines"],
  "numberOfChapters": 10,
  "includeExercises": true,
  "includeCulturalNotes": true,
  "includeSlang": false,
  "includeMnemonics": true,
  "includeExamples": true,
  "specificContent": {
    "grammarPatterns": [],
    "vocabularyIds": [],
    "kanjiIds": [],
    "slangIds": []
  },
  "interests": ["Anime & Manga", "Technology"]
}
```

**Content Types:**
- `textbook_chapter` - Complete comprehensive chapters
- `grammar_lesson` - Grammar-focused lessons
- `vocabulary_lesson` - Vocabulary-focused lessons
- `kanji_lesson` - Kanji-focused lessons
- `colloquial_lesson` - Modern Japanese/slang lessons

**Response:**
```json
{
  "success": true,
  "textbook": {
    "id": "uuid",
    "title": "My Japanese Journey",
    "jlptLevel": "N5",
    "totalChapters": 10,
    "estimatedHours": 8
  },
  "chapters": [
    {
      "id": "uuid",
      "number": 1,
      "title": "Chapter 1: Greetings"
    }
  ]
}
```

---

## 6. Frontend Usage

### Navigate to Generator

1. Go to: `http://localhost:3000/textbooks/generate`
2. You'll see the enhanced 3-step interface

### Step 1: Basics
- Enter textbook title
- Select JLPT level (N5-N1)
- Choose content type (5 options)

### Step 2: Topics
- Add chapter topics
- Set number of chapters (5-30)

### Step 3: Options
- Enable comprehensive examples
- Include practice exercises
- Add cultural context
- Include memory aids
- Add modern Japanese (slang)
- Select your interests

### Generate
Click "Generate with AI" and wait for:
- 45-120 seconds per chapter
- Progress bar updates
- Completion message

---

## 7. Troubleshooting

### Problem: "NVIDIA API is not configured"

**Solution:**
1. Check `.env.local` has `NVIDIA_API_KEY_1`
2. Restart development server: `npm run dev`
3. Verify API key is valid

### Problem: "Failed to generate chapter"

**Solutions:**
1. Check NVIDIA API status
2. Verify model access: `stockmark/stockmark-2-100b-instruct`
3. Check API key rate limits
4. Try again (automatic retry built-in)

### Problem: "Database error" when saving

**Solutions:**
1. Apply database migration (see Step 2)
2. Verify Supabase connection
3. Check `SUPABASE_SERVICE_ROLE_KEY` is set
4. Ensure tables exist

### Problem: Generation is slow

**This is normal:**
- Comprehensive JLPT content takes time
- 100B parameter model is thorough
- Each chapter: 45-120 seconds
- More options = more time

**To speed up:**
- Reduce number of chapters
- Disable some options
- Generate in batches

### Problem: Content quality issues

**Solutions:**
1. Check JLPT level is appropriate
2. Provide more specific topics
3. Enable all enhancement options
4. Try regenerating that chapter

---

## 8. Verification Checklist

Before using the textbook generator, verify:

- [ ] NVIDIA API key is set in `.env.local`
- [ ] Supabase credentials are configured
- [ ] Database migration has been applied
- [ ] Test NVIDIA connection passes
- [ ] Development server is running
- [ ] Can access `/textbooks/generate` page
- [ ] Can see beautiful 3-step interface
- [ ] All JLPT levels display correctly
- [ ] All 5 content types are available

---

## 9. Testing the Flow

### Quick Test

1. Navigate to `/textbooks/generate`
2. Enter title: "Test Textbook"
3. Select: N5 level
4. Content type: Complete Textbook
5. Add topic: "Greetings"
6. Set chapters: 5
7. Enable all options
8. Click "Generate with AI"
9. Wait 4-10 minutes
10. Should redirect to generated textbook

### Expected Timeline:
- **5 chapters:** 4-10 minutes
- **10 chapters:** 8-20 minutes
- **20 chapters:** 15-40 minutes

---

## 10. Advanced Configuration

### Custom Model Endpoints

To use a different endpoint, modify `src/lib/ai/nvidia-client.ts`:

```typescript
modelEndpointMap: {
  'stockmark/stockmark-2-100b-instruct': 'YOUR_CUSTOM_ENDPOINT'
}
```

### Adjust Generation Parameters

In `src/lib/ai/model-router.ts`:

```typescript
// Increase max tokens for longer responses
const maxTokens = model === 'stockmark/stockmark-2-100b-instruct' 
  ? 16000  // Increase from 8000
  : 4000
```

### Add More Content Types

1. Add to type union in `jlpt-content-spec.ts`
2. Add case in `jlpt-content-generator.ts`
3. Update API route interface
4. Add to frontend UI options

---

## 11. Monitoring

### Check Generation Status

**API Endpoint:** `GET /api/textbooks/generate?id=<textbook_id>`

**Response:**
```json
{
  "id": "uuid",
  "title": "My Japanese Journey",
  "jlptLevel": "N5",
  "status": "generating",
  "totalChapters": 10,
  "completedChapters": 5,
  "chapters": [...]
}
```

### Log Messages

Watch server logs for:
```
📚 Starting textbook generation
   Level: N5
   Content Type: textbook_chapter
   Chapters: 10
   Options: exercises=true, cultural=true...
🎯 Routing task to NVIDIA model: stockmark/stockmark-2-100b-instruct
🚀 NVIDIA API Request (Attempt 1/3)
   Endpoint: https://integrate.api.nvidia.com/v1/chat/completions
   Model: stockmark/stockmark-2-100b-instruct
✅ NVIDIA API Success
✨ Generated comprehensive JLPT-compliant content
✅ Chapter 1 completed with JLPT specifications
```

---

## 12. Support

### Documentation

- **User Guide:** `TEXTBOOK_GENERATOR_GUIDE.md`
- **Technical Summary:** `TEXTBOOK_GENERATOR_ENHANCEMENTS.md`
- **JLPT System:** `JLPT_CONTENT_SYSTEM.md`

### Common Issues

1. **API Key Invalid:** Get new key from NVIDIA dashboard
2. **Rate Limited:** Wait or use backup API key
3. **Database Error:** Apply migration
4. **Generation Fails:** Check model access

### Debug Mode

Enable detailed logging:
```bash
# In your .env.local
DEBUG=true
LOG_LEVEL=verbose
```

---

## 🎉 You're Ready!

Everything should now be set up. Navigate to `/textbooks/generate` and create your first JLPT-compliant textbook powered by NVIDIA's 100B parameter stockmark model!

**Happy Learning! 頑張ってください！ 🌸**

---

**Last Updated:** January 2025  
**Version:** 1.0.0  
**Model:** stockmark-2-100b-instruct (NVIDIA NIM)  
**Base URL:** https://integrate.api.nvidia.com/v1
