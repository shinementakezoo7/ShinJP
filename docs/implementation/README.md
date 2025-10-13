# Database Setup Guide

## Overview

This directory contains the database schema and migrations for the Shinmen Takezo Japanese learning platform.

## Database Structure

### Core Tables:
- **users** - User profiles and statistics
- **user_preferences** - User settings and preferences
- **textbooks** - AI-generated textbooks
- **textbook_chapters** - Individual chapters
- **lessons** - Reusable learning units
- **user_textbook_progress** - Progress tracking
- **user_lesson_progress** - Lesson completion tracking
- **study_sessions** - Analytics and time tracking

### Learning Content:
- **vocabulary** - Japanese vocabulary database
- **kanji** - Kanji characters database
- **grammar_points** - Grammar patterns database

### SRS (Spaced Repetition):
- **srs_cards** - Flashcards with SM-2 algorithm
- **srs_reviews** - Review history

### AI Features:
- **conversations** - AI conversation sessions

## Setup Instructions

### 1. Connect to Supabase

Your Supabase project is already configured in `.env.local`:
```
SUPABASE_URL=https://zsehtkeycyapjevgbzrd.supabase.co
```

### 2. Run Migrations

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard/project/zsehtkeycyapjevgbzrd
2. Navigate to **SQL Editor**
3. Copy the contents of `migrations/001_initial_schema.sql`
4. Paste and run the SQL

#### Option B: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref zsehtkeycyapjevgbzrd

# Run migration
supabase db push
```

#### Option C: Using psql

```bash
# Connect to database
psql "postgres://postgres.zsehtkeycyapjevgbzrd:Woc2vDYW6Gae3aOK@aws-1-us-east-1.pooler.supabase.com:5432/postgres?sslmode=require"

# Run migration
\i database/migrations/001_initial_schema.sql
```

### 3. Verify Setup

After running the migration, verify tables were created:

```sql
-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Should show:
-- conversations
-- grammar_points
-- kanji
-- lessons
-- srs_cards
-- srs_reviews
-- study_sessions
-- textbook_chapters
-- textbooks
-- user_lesson_progress
-- user_preferences
-- user_textbook_progress
-- users
-- vocabulary
```

## Security

### Row Level Security (RLS)

All tables have RLS enabled with appropriate policies:

- **Users can only access their own data**
- **Public textbooks are visible to all**
- **Lessons, vocabulary, kanji, grammar are public**

### Policies Created:
- Users can view/update own profile
- Users can create/manage own textbooks
- Users can view public textbooks
- Users can only access own progress
- Users can only access own SRS cards

## Database Features

### Triggers:
- **Auto-update timestamps** - Updates `updated_at` on record changes
- **Auto-update stats** - Updates user statistics on study sessions

### Indexes:
- Optimized for common queries
- User lookups
- Textbook searches
- SRS card reviews
- Progress tracking

## JLPT Levels

All content is classified by JLPT level:
- **N5** - Beginner (800 vocabulary, 100 kanji)
- **N4** - Elementary (1,500 vocabulary, 300 kanji)
- **N3** - Intermediate (4,000 vocabulary, 650 kanji)
- **N2** - Advanced (6,000 vocabulary, 1,000 kanji)
- **N1** - Expert (10,000 vocabulary, 2,000 kanji)

## Next Steps

After setting up the database:

1. **Populate vocabulary** - Import JLPT vocabulary lists
2. **Populate kanji** - Import kanji data with stroke orders
3. **Populate grammar** - Add grammar patterns
4. **Test textbook generation** - Create your first AI textbook
5. **Test SRS system** - Add flashcards and review

## Backup & Maintenance

Supabase automatically backs up your database. You can also:

```bash
# Export data
pg_dump -h aws-1-us-east-1.pooler.supabase.com \
        -U postgres.zsehtkeycyapjevgbzrd \
        -d postgres > backup.sql

# Import data
psql -h aws-1-us-east-1.pooler.supabase.com \
     -U postgres.zsehtkeycyapjevgbzrd \
     -d postgres < backup.sql
```

## Troubleshooting

### Migration Fails

If migration fails:
1. Check Supabase dashboard for errors
2. Ensure UUID extension is enabled
3. Verify auth schema exists
4. Run each section separately if needed

### Permission Issues

If you get permission errors:
1. Verify you're using service role key for server-side operations
2. Check RLS policies
3. Ensure user is authenticated

### Performance Issues

If queries are slow:
1. Check indexes are created
2. Analyze query plans
3. Add additional indexes if needed

## Schema Version

Current Version: **1.0.0**
Migration: **001_initial_schema.sql**
Last Updated: 2024-01-09
