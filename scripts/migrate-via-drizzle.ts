/**
 * Alternative: Add book generation tables to Drizzle schema
 * This creates the tables using Drizzle ORM push instead of raw SQL
 */

import { sql } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  varchar,
  text,
  jsonb,
  integer,
  boolean,
  timestamp,
  decimal,
  index,
  check,
  uniqueIndex,
} from 'drizzle-orm/pg-core'

// Book Templates Table
export const bookTemplates = pgTable(
  'book_templates',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 200 }).notNull(),
    description: text('description'),
    templateType: varchar('template_type', { length: 50 }).notNull(),
    structure: jsonb('structure')
      .notNull()
      .default(sql`'{"parts": [], "total_chapters": 25, "total_pages": 500}'`),
    contentRequirements: jsonb('content_requirements').default(sql`'{}'`),
    chapterPromptTemplate: text('chapter_prompt_template'),
    sectionPromptTemplate: text('section_prompt_template'),
    vocabularyPromptTemplate: text('vocabulary_prompt_template'),
    dialoguePromptTemplate: text('dialogue_prompt_template'),
    exercisePromptTemplate: text('exercise_prompt_template'),
    validationRules: jsonb('validation_rules').default(sql`'{}'`),
    isPublic: boolean('is_public').default(false),
    isActive: boolean('is_active').default(true),
    usageCount: integer('usage_count').default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    typeIdx: index('idx_templates_type').on(table.templateType),
    activeIdx: index('idx_templates_active').on(table.isActive),
  })
)

// Book Generation Jobs Table
export const bookGenerationJobs = pgTable(
  'book_generation_jobs',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id'),
    bookType: varchar('book_type', { length: 50 }).notNull(),
    sectorId: varchar('sector_id', { length: 50 }),
    jlptLevel: varchar('jlpt_level', { length: 10 }),
    customConfig: jsonb('custom_config'),
    templateId: uuid('template_id').references(() => bookTemplates.id),
    targetPages: integer('target_pages').default(500),
    targetChapters: integer('target_chapters').default(25),
    bookTitle: varchar('book_title', { length: 500 }),
    generationConfig: jsonb('generation_config').default(sql`'{}'`),
    status: varchar('status', { length: 20 }).default('pending'),
    progressPercentage: integer('progress_percentage').default(0),
    currentStage: varchar('current_stage', { length: 100 }),
    chaptersTotal: integer('chapters_total').default(0),
    chaptersCompleted: integer('chapters_completed').default(0),
    chaptersFailed: integer('chapters_failed').default(0),
    chaptersInProgress: integer('chapters_in_progress').default(0),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    estimatedCompletionTime: timestamp('estimated_completion_time', { withTimezone: true }),
    totalGenerationTimeSeconds: integer('total_generation_time_seconds'),
    outputBookId: uuid('output_book_id'),
    outputFiles: jsonb('output_files').default(sql`'[]'`),
    errorMessage: text('error_message'),
    errorDetails: jsonb('error_details'),
    retryCount: integer('retry_count').default(0),
    aiModel: varchar('ai_model', { length: 100 }).default('NVIDIA stockmark-2-100b-instruct'),
    totalTokensUsed: integer('total_tokens_used').default(0),
    totalCostUsd: decimal('total_cost_usd', { precision: 10, scale: 4 }).default('0'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    statusIdx: index('idx_jobs_status').on(table.status),
    userIdx: index('idx_jobs_user').on(table.userId),
    typeIdx: index('idx_jobs_type').on(table.bookType),
    createdIdx: index('idx_jobs_created').on(table.createdAt),
  })
)

// Chapter Generation Tasks Table
export const chapterGenerationTasks = pgTable(
  'chapter_generation_tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    jobId: uuid('job_id')
      .notNull()
      .references(() => bookGenerationJobs.id, { onDelete: 'cascade' }),
    chapterNumber: integer('chapter_number').notNull(),
    chapterTitle: varchar('chapter_title', { length: 500 }),
    partNumber: integer('part_number'),
    partTitle: varchar('part_title', { length: 200 }),
    targetWordCount: integer('target_word_count').default(5000),
    vocabularyList: jsonb('vocabulary_list').default(sql`'[]'`),
    grammarPoints: jsonb('grammar_points').default(sql`'[]'`),
    dialogueScenarios: text('dialogue_scenarios').array(),
    prompt: text('prompt'),
    generationParams: jsonb('generation_params').default(sql`'{}'`),
    status: varchar('status', { length: 20 }).default('pending'),
    retryCount: integer('retry_count').default(0),
    maxRetries: integer('max_retries').default(3),
    outputChapterId: uuid('output_chapter_id'),
    generatedContent: jsonb('generated_content'),
    generatedMarkdown: text('generated_markdown'),
    wordCount: integer('word_count'),
    validationStatus: varchar('validation_status', { length: 20 }),
    validationResults: jsonb('validation_results'),
    qualityScore: decimal('quality_score', { precision: 3, scale: 2 }),
    startedAt: timestamp('started_at', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    generationTimeSeconds: integer('generation_time_seconds'),
    errorMessage: text('error_message'),
    errorStack: text('error_stack'),
    tokensUsed: integer('tokens_used'),
    aiModel: varchar('ai_model', { length: 100 }),
    costUsd: decimal('cost_usd', { precision: 10, scale: 4 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    jobIdx: index('idx_tasks_job').on(table.jobId),
    statusIdx: index('idx_tasks_status').on(table.status),
    uniqueChapter: uniqueIndex('unique_job_chapter').on(table.jobId, table.chapterNumber),
  })
)

console.log('✅ Drizzle schema types created for book generation system')
console.log('   Run: npm run db:push')
console.log('   This will create all tables in the database')
