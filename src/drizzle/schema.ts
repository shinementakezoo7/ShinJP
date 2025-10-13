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

// Add more table schemas as needed...
// This is a starting point - you'll want to add all your tables here
