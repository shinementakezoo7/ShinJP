#!/usr/bin/env node

/**
 * Setup Textbooks Database
 * Creates all necessary tables for the textbook generation system
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

console.log('🚀 Setting up Textbooks Database...\n')

// Read .env.local file
const envPath = join(process.cwd(), '.env.local')
const envContent = readFileSync(envPath, 'utf8')
const lines = envContent.split('\n')

let SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
let SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

for (const line of lines) {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
    SUPABASE_URL = line.split('=')[1].trim()
  }
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
    SUPABASE_KEY = line.split('=')[1].trim()
  }
}

console.log(`   URL: ${SUPABASE_URL}`)
console.log(`   Key: ${SUPABASE_KEY ? '✅ Configured' : '❌ Missing'}\n`)

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local!')
  console.error('   Required:')
  console.error('   - NEXT_PUBLIC_SUPABASE_URL')
  console.error('   - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

async function setupDatabase() {
  try {
    // Read the migration SQL
    const migrationPath = join(
      process.cwd(),
      'database',
      'migrations',
      '000_create_textbooks_tables.sql'
    )
    const _migrationSQL = readFileSync(migrationPath, 'utf8')

    console.log('📝 Applying database migration...')
    console.log('   File: database/migrations/000_create_textbooks_tables.sql\n')

    // Note: Supabase doesn't have a direct SQL execution API from JS
    // We need to use the SQL Editor in the dashboard
    console.log('⚠️  Please apply this migration manually:')
    console.log('   1. Go to: https://app.supabase.com/project/_/sql')
    console.log('   2. Copy the SQL from: database/migrations/000_create_textbooks_tables.sql')
    console.log('   3. Paste and run in SQL Editor')
    console.log('')
    console.log('Or use the Supabase CLI:')
    console.log('   supabase db push')
    console.log('')

    // Try to verify if tables exist
    console.log('🔍 Checking if tables already exist...\n')

    const { data: textbooks, error: textbooksError } = await supabase
      .from('textbooks')
      .select('*')
      .limit(0)

    if (textbooksError) {
      if (
        textbooksError.message.includes('does not exist') ||
        textbooksError.message.includes('not find')
      ) {
        console.log('❌ Tables do not exist yet.')
        console.log('   Please run the SQL migration above.')
        process.exit(1)
      }
      throw textbooksError
    }

    console.log('✅ Tables already exist!')
    console.log('   - textbooks')
    console.log('   - textbook_chapters')
    console.log('   - user_textbook_progress')
    console.log('')
    console.log('✅ Database setup complete!\n')
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

setupDatabase()
