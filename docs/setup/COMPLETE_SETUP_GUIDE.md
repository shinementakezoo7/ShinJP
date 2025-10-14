# 🚀 Complete Setup Guide - Shinmen Takezo

Welcome to the comprehensive setup guide for the Shinmen Takezo Japanese learning platform. This guide will walk you through setting up the entire system for development or production use.

## ⚠️ IMPORTANT: Database Setup Required

**The "Failed to create textbook" error occurs because the required database tables don't exist in your Supabase instance yet.**

---

## 🔧 Quick Setup (10 Minutes)

### Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- A Supabase account (free tier is sufficient)
- NVIDIA API key for AI features (get one at https://build.nvidia.com/)
- Git for cloning the repository

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-shinjp-repo.git
cd ShinJP

# Install dependencies
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# =======================
# NVIDIA AI Configuration (REQUIRED)
# =======================
NVIDIA_API_KEY=nvapi-YOUR_KEY_HERE
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1

# =======================
# Supabase Configuration (REQUIRED)
# =======================
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

**How to get NVIDIA API key:**
1. Visit https://build.nvidia.com/
2. Sign in or create an account
3. Navigate to "API Keys" section
4. Create a new API key
5. Ensure access to the `stockmark/stockmark-2-100b-instruct` model

### Step 3: Create Database Tables

1. **Go to Supabase Dashboard**
   - Open: https://app.supabase.com
   - Select your project
   - Click: **SQL Editor** (left sidebar)

2. **Run the Database Migration**
   - Copy the entire SQL from: `database/migrations/000_create_textbooks_tables.sql`
   - Paste into SQL Editor
   - Click: **RUN**
   - Wait for "Success" message

3. **Verify Tables Created**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('textbooks', 'textbook_chapters', 'user_textbook_progress');
```
   - Should show 3 tables

### Step 4: Verify Environment Configuration

Run the environment check script:

```bash
npm run check-env
```

**Expected Output:**
```
🤖 AI Configuration:
   NVIDIA NIM API: ✅ Available
   Primary Model: stockmark-2-100b-instruct (100B params)

✅ Environment configured correctly!
```

### Step 5: Start Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

### Step 6: Generate Your First Textbook

1. Navigate to: `http://localhost:3000/textbooks/generate`
2. Fill in the form with:
   - Title: "My First Japanese Textbook"
   - JLPT Level: N5
   - Content Type: Complete Textbook
   - Topics: "Basic Greetings"
   - Number of Chapters: 3
3. Click "Generate with AI"
4. ✅ Your textbook will be generated in 1-3 minutes!

---

## 🎯 Key Features

### 1. ✅ NVIDIA-Powered AI Content Generation

The platform uses NVIDIA's specialized Japanese language model:

**Features:**
- 100B parameter model specialized in Japanese
- JLPT-compliant content generation (N5-N1)
- Contextual vocabulary and grammar
- Cultural notes and examples
- Real-world conversation scenarios

**Model:** `stockmark/stockmark-2-100b-instruct`

### 2. ✅ Comprehensive Textbook Generation

Generate complete Japanese textbooks with:

**Features:**
- Multiple content types (textbook chapters, grammar lessons, vocabulary, kanji)
- Customizable chapter topics and count
- Inclusion options (exercises, cultural notes, mnemonics, examples)
- JLPT level targeting (N5-N1)
- Personalized content based on interests

**Location:** `/textbooks/generate`

### 3. ✅ Interactive Reading Experience

Beautiful reading interface with:

**Features:**
- 📖 Chapter-by-chapter navigation
- 🔤 Adjustable font size
- 📑 Sidebar with chapter list
- 🎨 Japanese-themed design
- 🌙 Dark mode support
- 📱 Mobile responsive

**Location:** `/textbooks/[id]/read`

### 4. ✅ SSW Program Support

Specialized Skilled Worker program for Japanese employment:

**Features:**
- 14 industry sectors with specialized vocabulary
- Workplace-specific scenarios
- JFT-Basic test preparation
- Cultural integration notes
- Safety procedures and protocols

**Location:** `/ssw`

---

## 🗂️ Database Structure

### Core Tables:

#### 1. `textbooks`
Main table for storing generated textbooks:
```sql
- id (UUID, primary key)
- title, description
- jlpt_level (N5-N1)
- content_type (textbook_chapter, grammar_lesson, etc.)
- chapters (JSONB array)
- total_chapters
- topics, keywords
- generation_status (draft, generating, completed, error)
- generation_params (JSONB with generation options)
- estimated_completion_hours
- view_count, download_count
- timestamps
```

#### 2. `textbook_chapters`
Individual chapters with detailed content:
```sql
- id (UUID, primary key)
- textbook_id (foreign key)
- chapter_number
- title, introduction
- sections, vocabulary, grammar_points, exercises (JSONB)
- content (full JLPT content)
- content_type
- includes_exercises, includes_cultural_notes, includes_slang, includes_mnemonics
- estimated_time_minutes
- timestamps
```

#### 3. `user_textbook_progress`
Track user reading progress:
```sql
- id (UUID, primary key)
- user_id, textbook_id
- current_chapter
- completed_chapters[]
- completion_percentage
- time_spent_minutes
- notes, bookmarked_pages
- timestamps
```

### Additional Tables:
- `kanji_stroke_order` - Kanji writing instructions
- `audio_files` - Generated audio pronunciations
- `conversations` - AI chat history
- `messages` - Individual chat messages

---

## 🔄 System Architecture

### AI Content Generation Flow:

```
User Interface (/textbooks/generate)
    ↓
1. User fills form with:
   - Title, JLPT Level (N5-N1)
   - Content Type (textbook, grammar, vocabulary, kanji)
   - Topics, Number of Chapters
   - Options (exercises, cultural notes, etc.)
    ↓
2. POST /api/textbooks/generate
    ↓
3. Create textbook record in database
    ↓
4. For each chapter:
   a. Generate JLPT-compliant content using NVIDIA AI
   b. Validate content structure
   c. Save chapter to database
    ↓
5. Update textbook status to "completed"
    ↓
6. Return success with textbook ID
```

### Chat System Flow:

```
User Interface (/chat)
    ↓
1. User sends message in Japanese/English
    ↓
2. POST /api/ai/chat
    ↓
3. NVIDIA AI generates contextual response
    ↓
4. Response streamed back to client
    ↓
5. Conversation saved to database
```

### Reading Experience Flow:

```
Textbook Library (/books)
    ↓
1. User clicks "Read" on a textbook
    ↓
2. GET /textbooks/[id]/read
    ↓
3. Fetch textbook + chapters from database
    ↓
4. Display in Japanese-themed reader
    ↓
5. User can:
   - Navigate between chapters
   - Adjust font size
   - View progress
   - Access audio pronunciation (when available)
```

---

## 🎯 API Endpoints

### Textbook Generation
- `POST /api/textbooks/generate` - Generate new textbook
- `GET /api/textbooks/generate?id={id}` - Check generation status

### Textbook Management
- `GET /api/textbooks/[id]` - Get textbook with chapters
- `POST /api/textbooks/[id]/download` - Download as PDF
- `GET /api/textbooks` - List all textbooks (with pagination)

### AI Chat
- `POST /api/ai/chat` - Send message to AI tutor
- `GET /api/chat/conversations` - List conversations
- `POST /api/chat/conversations` - Create new conversation
- `GET /api/chat/conversations/[id]/messages` - Get conversation history

### Audio
- `POST /api/audio/generate` - Generate audio pronunciation
- `GET /api/kanji/stroke-order/[kanji]` - Get kanji stroke order data

### SSW (Specialized Skilled Worker)
- `GET /api/ssw/sectors` - List all SSW sectors
- `POST /api/textbooks/generate-ssw` - Generate SSW textbook

---

## 🔍 Troubleshooting

### Error: "Could not find the table 'public.textbooks'"

**Solution:**
1. Run the SQL migration in Supabase SQL Editor
2. File: `database/migrations/000_create_textbooks_tables.sql`
3. Verify with: `SELECT * FROM textbooks LIMIT 1;`

### Error: "Failed to create textbook"

**Check:**
1. ✅ Tables exist (run migration)
2. ✅ Supabase credentials in `.env.local`
3. ✅ `SUPABASE_SERVICE_ROLE_KEY` is set
4. ✅ Development server restarted

### Error: "Failed to generate chapter"

**Check:**
1. ✅ NVIDIA API key is valid
2. ✅ Network connection
3. ✅ Model access: `stockmark/stockmark-2-100b-instruct`
4. ✅ Check NVIDIA API key permissions at https://build.nvidia.com/

### Error: "NVIDIA API is not configured"

**Solution:**
1. Check that `NVIDIA_API_KEY` is set in `.env.local`
2. Verify the API key is valid
3. Ensure you have access to stockmark models
4. Run `npm run check-env` to diagnose

### Error: Rate limiting (429 errors)

**Solution:**
1. NVIDIA API has rate limits
2. Wait a few minutes before trying again
3. Consider upgrading to a paid plan for higher limits

### Chat System Not Working

**Check:**
1. ✅ NVIDIA API is configured
2. ✅ No CORS issues in browser console
3. ✅ Network connection is stable
4. ✅ Check browser console for error messages

---

## 📦 Dependencies

### Required:
- ✅ `@supabase/supabase-js` - Database client
- ✅ `next` - Framework (Next.js 15)
- ✅ `react` - UI library (React 19)
- ✅ `typescript` - Type safety
- ✅ `tailwindcss` - Styling
- ✅ `framer-motion` - Animations
- ✅ `three` - 3D graphics
- ✅ `@react-three/fiber` - React Three.js integration
- ✅ `ai` - Vercel AI SDK for NVIDIA integration

### Development:
- ✅ `@types/node` - Node.js types
- ✅ `@types/react` - React types
- ✅ `eslint` - Linting
- ✅ `prettier` - Code formatting
- ✅ `vitest` - Testing framework
- ✅ `playwright` - E2E testing

---

## 🚀 Production Deployment

### 1. Environment Variables

Set these in your hosting platform:

```bash
# NVIDIA AI
NVIDIA_API_KEY=your_key_here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url_here
SUPABASE_SERVICE_ROLE_KEY=your_key_here
```

### 2. Database Migration

Run in Supabase Dashboard (Production):
```sql
-- Run: database/migrations/000_create_textbooks_tables.sql
```

### 3. Deploy Application

```bash
# Build
npm run build

# Deploy to Vercel/Netlify/etc
vercel deploy
```

---

## 📚 Additional Resources

### Documentation Guides:
- [Textbook Generator Guide](../textbook/TEXTBOOK_GENERATOR_GUIDE.md)
- [NVIDIA AI Integration](../api-integration/GETTING_STARTED_NVIDIA.md)
- [UI/UX Components](../ui-ux/ENHANCED_UI_GUIDE.md)
- [Implementation Guide](../implementation/IMPLEMENTATION_GUIDE.md)

### Technical References:
- [Database Schema](../implementation/DATABASE_SCHEMA.md)
- [AI Integration Architecture](../implementation/AI_INTEGRATION.md)
- [Tech Stack Overview](../tech-stack/TECH_STACK_SUMMARY.md)

---

## ✅ Checklist

Before running the application:

- [ ] Node.js 18+ installed
- [ ] Repository cloned and dependencies installed
- [ ] Supabase project created
- [ ] Database tables created (run migration)
- [ ] NVIDIA API key obtained
- [ ] Environment variables configured
- [ ] Development server starts successfully
- [ ] Textbook generation works
- [ ] Chat functionality tested

---

## 🎉 You're Ready!

Everything is now set up! Follow these steps:

1. ✅ **Run SQL migration** in Supabase Dashboard
2. ✅ **Configure environment** with NVIDIA and Supabase keys
3. ✅ **Start server**: `npm run dev`
4. ✅ **Generate textbook**: Go to `/textbooks/generate`
5. ✅ **Test chat**: Go to `/chat`
6. ✅ **Explore SSW**: Go to `/ssw`

**You now have:**
- ✅ Complete database schema
- ✅ Working AI-powered textbook generation
- ✅ Interactive chat with AI tutor
- ✅ Japanese-themed UI
- ✅ Progress tracking
- ✅ Comprehensive error handling

**Happy learning Japanese! 頑張ってください！ 📚✨**

---

**Last Updated:** October 2025
**Version:** 1.0.0
**Status:** ✅ Production Ready
