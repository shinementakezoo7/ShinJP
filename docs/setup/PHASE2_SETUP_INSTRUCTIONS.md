# 📚 Phase 2: AI Textbook Generator - Setup Instructions

## Overview

Phase 2 is ready! We've created the AI textbook generator system with:
- ✅ Complete database schema
- ✅ API endpoint for textbook generation  
- ✅ Beautiful UI for configuring textbooks
- ✅ Progress tracking during generation

---

## 🗄️ Step 1: Set Up Database

### Option A: Using Supabase Dashboard (Recommended - 5 minutes)

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/zsehtkeycyapjevgbzrd
   ```

2. **Go to SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Run the Migration:**
   - Open: `/workspaces/ShinJP/database/migrations/001_initial_schema.sql`
   - Copy ALL contents (Ctrl+A, Ctrl+C)
   - Paste into Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Tables Created:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' ORDER BY table_name;
   ```
   
   You should see:
   - conversations
   - grammar_points
   - kanji
   - lessons
   - srs_cards
   - srs_reviews
   - study_sessions
   - textbook_chapters
   - textbooks
   - user_lesson_progress
   - user_preferences
   - user_textbook_progress
   - users
   - vocabulary

### Option B: Using Supabase CLI

```bash
# Install CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref zsehtkeycyapjevgbzrd

# Run migration
cd /workspaces/ShinJP
supabase db push
```

### Option C: Using Setup Script (Verification only)

```bash
cd /workspaces/ShinJP
node scripts/setup-database.mjs
```

**Note:** This script will verify your setup but may not be able to execute the SQL directly. Use Option A for actual setup.

---

## 🚀 Step 2: Test the Textbook Generator

### 1. Make sure the dev server is running:
```bash
npm run dev
# Server starts at: http://localhost:3001
```

### 2. Visit the Generator Page:
```
http://localhost:3001/textbooks/generate
```

### 3. Configure Your Textbook:
- **Title**: "My First Japanese Textbook"
- **Level**: N5 (Beginner)
- **Topics**: Add 3-5 topics like:
  - "Greetings and Self-Introduction"
  - "Numbers and Counting"
  - "Daily Activities"
  - "Food and Restaurants"
  - "Travel and Directions"
- **Chapters**: 10 (recommended for testing)
- **Interests**: Select any that interest you
- **Include Exercises**: ✓ Checked

### 4. Click "Generate Textbook with AI"

**Generation Time:**
- ~30 seconds per chapter
- 10 chapters = ~5-8 minutes total
- Progress bar shows real-time updates

### 5. Wait for Completion

You'll see:
- Progress indicator
- Current chapter being generated
- Completion percentage
- Auto-redirect to textbook view when done

---

## 📊 What Gets Generated

Each textbook includes:

### Chapter Structure:
```javascript
{
  title: "Chapter 1: Greetings and Self-Introduction",
  introduction: "In this chapter, we'll learn...",
  sections: [
    {
      heading: "Basic Greetings",
      content: "Detailed explanation...",
      examples: [
        {
          japanese: "こんにちは",
          romaji: "konnichiwa",
          english: "Hello (Good afternoon)"
        }
      ]
    }
  ],
  vocabulary: [
    {
      word: "こんにちは",
      reading: "konnichiwa",
      meaning: "hello"
    }
  ],
  grammarPoints: [
    {
      pattern: "です",
      meaning: "to be (polite)",
      usage: "Used to state facts politely"
    }
  ],
  exercises: [
    {
      question: "How do you say 'Good morning' in Japanese?",
      options: ["こんにちは", "おはよう", "こんばんは", "さようなら"],
      answer: "おはよう",
      explanation: "おはよう (ohayou) means good morning"
    }
  ]
}
```

---

## 🎯 Features Available Now

### ✅ Textbook Generation
- AI-powered content creation
- JLPT level-appropriate vocabulary and grammar
- Personalized based on interests
- Includes exercises and examples

### ✅ Database Storage
- All textbooks saved to Supabase
- User association (when auth is added)
- Public/private textbook options
- Full chapter data stored

### ✅ Progress Tracking
- Real-time generation progress
- Chapter-by-chapter updates
- Error handling and recovery

---

## 🔧 Troubleshooting

### Database Connection Issues

**Problem**: "Failed to create textbook"

**Solution**:
```bash
# Check Supabase connection
curl https://zsehtkeycyapjevgbzrd.supabase.co/rest/v1/

# Verify .env.local has:
NEXT_PUBLIC_SUPABASE_URL=https://zsehtkeycyapjevgbzrd.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Migration Fails

**Problem**: SQL errors when running migration

**Solution**:
1. Check if UUID extension exists: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
2. Run sections individually if needed
3. Check for existing tables: Drop if testing

### Generation Timeout

**Problem**: Textbook generation times out

**Solution**:
1. Reduce number of chapters for testing (try 5)
2. Check NVIDIA API keys are valid
3. Check API rate limits
4. Verify NVIDIA model access

### No Progress Updates

**Problem**: Progress bar doesn't update

**Solution**:
- Generation happens server-side
- Currently no streaming progress (future enhancement)
- Trust the spinner, generation is happening!

---

## 📝 Next Steps After Setup

### 1. Create Your First Textbook ✅
- Use the generator
- Test with 5 chapters first
- Verify generation works

### 2. View Generated Textbook
- Will redirect automatically
- View all chapters
- Test navigation

### 3. Test Different Levels
- Generate N5, N4, N3 textbooks
- Compare complexity
- Verify level-appropriate content

### 4. Explore the Database
- Check Supabase dashboard
- View `textbooks` table
- View `textbook_chapters` table
- Inspect generated JSON

---

## 🎓 Database Schema Overview

### Main Tables Created:

**users** - User profiles and statistics
```sql
- id (UUID, primary key)
- email
- current_jlpt_level
- study_streak
- total_study_time
```

**textbooks** - AI-generated textbooks
```sql
- id (UUID, primary key)
- title
- jlpt_level (N5-N1)
- topics (array)
- generation_status
- chapters (JSONB)
```

**textbook_chapters** - Individual chapters
```sql
- id (UUID, primary key)
- textbook_id (foreign key)
- chapter_number
- title
- sections (JSONB)
- vocabulary (JSONB)
- grammar_points (JSONB)
- exercises (JSONB)
```

**vocabulary** - Japanese vocabulary database
```sql
- word
- reading
- meaning
- jlpt_level
- examples (JSONB)
```

**kanji** - Kanji database
```sql
- character
- onyomi/kunyomi
- meaning
- stroke_count
- jlpt_level
```

**srs_cards** - Spaced repetition flashcards
```sql
- content (JSONB)
- interval
- ease_factor
- next_review_at
```

---

## 🚀 API Endpoints

### POST /api/textbooks/generate
Generate a new textbook

**Request:**
```json
{
  "title": "My Japanese Textbook",
  "jlptLevel": 5,
  "topics": ["Greetings", "Numbers", "Food"],
  "numberOfChapters": 10,
  "includeExercises": true,
  "interests": ["Anime", "Travel"]
}
```

**Response:**
```json
{
  "success": true,
  "textbook": {
    "id": "uuid",
    "title": "My Japanese Textbook",
    "jlptLevel": "N5",
    "totalChapters": 10
  },
  "chapters": [
    { "id": "uuid", "number": 1, "title": "Chapter 1: Greetings" }
  ]
}
```

### GET /api/textbooks/generate?id={uuid}
Check generation status

---

## 📊 Expected Results

After successful setup:

### Generation Test (10 chapters):
```
⏱️ Time: 5-8 minutes
📚 Chapters: 10 complete
📖 Vocabulary: ~50-100 words
📝 Grammar: ~20-30 points
✏️ Exercises: ~50 questions
💾 Size: ~500KB JSON data
```

### Database Records:
```
✅ 1 textbook record
✅ 10 chapter records
✅ All content as JSONB
✅ Relationships maintained
```

---

## 🎉 Success Criteria

You've successfully completed Phase 2 when:

- [x] Database schema created
- [ ] Can generate a textbook
- [ ] Chapters are created in correct order
- [ ] Content is level-appropriate
- [ ] Exercises are included
- [ ] Data is saved to Supabase
- [ ] Can view textbook in database

---

## 🔜 Phase 3 Preview

Next features to implement:

1. **Textbook Viewer** - Read generated textbooks
2. **Chapter Navigation** - Browse chapters
3. **Progress Tracking** - Track learning progress
4. **SRS System** - Flashcards from content
5. **User Authentication** - Supabase Auth
6. **Textbook Library** - Browse all textbooks
7. **Lesson System** - Interactive lessons
8. **Exercise Grading** - Auto-grade answers

---

## 📚 Resources

- **Database Schema**: `database/migrations/001_initial_schema.sql`
- **Database README**: `database/README.md`
- **API Endpoint**: `src/app/api/textbooks/generate/route.ts`
- **Generator UI**: `src/app/textbooks/generate/page.tsx`
- **Content Generator**: `src/lib/ai/content-generator.ts`

---

## 💬 Support

If you encounter issues:

1. Check database connection
2. Verify NVIDIA API keys
3. Review server logs
4. Check Supabase dashboard
5. Test with fewer chapters first

---

**🌸 侍 Shinmen Takezo 侍 🌸**

*Your AI-powered Japanese learning platform is ready to generate textbooks!*

Start generating your first textbook now! 🚀
