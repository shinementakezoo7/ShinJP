import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

// Example Textbooks table schema
export const textbooks = pgTable('textbooks', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  jlptLevel: text('jlpt_level'),
  sswType: text('ssw_type'),
  targetSector: text('target_sector'),
  totalChapters: integer('total_chapters').default(0),
  status: text('status').default('draft'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Example Kanji Stroke Order table
export const kanjiStrokeOrder = pgTable('kanji_stroke_order', {
  id: uuid('id').defaultRandom().primaryKey(),
  kanji: text('kanji').notNull().unique(),
  totalStrokes: integer('total_strokes').notNull(),
  strokeData: jsonb('stroke_data'),
  svgPath: text('svg_path'),
  writingTips: text('writing_tips'),
  commonMistakes: text('common_mistakes'),
  difficulty: integer('difficulty'),
  jlptLevel: text('jlpt_level'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Audio Files table
export const audioFiles = pgTable('audio_files', {
  id: uuid('id').defaultRandom().primaryKey(),
  text: text('text').notNull(),
  speaker: text('speaker'),
  speed: text('speed'),
  audioUrl: text('audio_url'),
  durationMs: integer('duration_ms'),
  fileSize: integer('file_size'),
  createdAt: timestamp('created_at').defaultNow(),
})

// Book Generation Jobs table
export const generationJobs = pgTable('generation_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  bookType: text('book_type').notNull(), // 'jlpt', 'ssw', etc.
  targetSector: text('target_sector'),
  jlptLevel: text('jlpt_level'),
  targetPages: integer('target_pages'),
  targetChapters: integer('target_chapters'),
  status: text('status').default('pending'), // 'pending', 'in_progress', 'completed', 'failed', 'cancelled'
  progress: integer('progress').default(0),
  chaptersCompleted: integer('chapters_completed').default(0),
  chaptersFailed: integer('chapters_failed').default(0),
  chaptersInProgress: integer('chapters_in_progress').default(0),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  aiModel: text('ai_model'),
  totalTokensUsed: integer('total_tokens_used').default(0),
  totalCostUsd: integer('total_cost_usd').default(0), // stored as cents to avoid floating point issues
  retryCount: integer('retry_count').default(0),
  errorMessage: text('error_message'),
  outputFiles: jsonb('output_files').default([]),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Book Generation Tasks table
export const generationTasks = pgTable('generation_tasks', {
  id: uuid('id').defaultRandom().primaryKey(),
  jobId: uuid('job_id')
    .references(() => generationJobs.id, { onDelete: 'cascade' })
    .notNull(),
  chapterNumber: integer('chapter_number').notNull(),
  chapterTitle: text('chapter_title'),
  status: text('status').default('pending'), // 'pending', 'in_progress', 'completed', 'failed'
  content: text('content'),
  wordCount: integer('word_count'),
  tokenCount: integer('token_count'),
  costUsd: integer('cost_usd').default(0), // stored as cents
  errorMessage: text('error_message'),
  retries: integer('retries').default(0),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Conversations table for chat functionality
export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull(),
  title: text('title').notNull(),
  model: text('model').notNull(),
  contextWindow: integer('context_window').default(4096),
  totalTokens: integer('total_tokens').default(0),
  messageCount: integer('message_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Messages table for chat functionality
export const messages = pgTable('messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id')
    .notNull()
    .references(() => conversations.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // 'user', 'assistant', 'system'
  content: text('content').notNull(),
  tokens: integer('tokens').default(0),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at').defaultNow(),
})

// Add more table schemas as needed...
// This is a starting point - you'll want to add all your tables here
