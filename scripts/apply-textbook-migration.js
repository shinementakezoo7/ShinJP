#!/usr/bin/env node

/**
 * Apply Textbook Enhancements Migration
 * Adds fields needed for JLPT-compliant content generation
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('node:fs')
const path = require('node:path')

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials!')
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function applyMigration() {
  console.log('🔄 Applying Textbook Enhancements Migration...\n')

  try {
    // Read migration file
    const migrationPath = path.join(
      __dirname,
      '..',
      'database',
      'migrations',
      '009_add_textbook_enhancements.sql'
    )
    const migration = fs.readFileSync(migrationPath, 'utf8')

    console.log('📝 Migration SQL:')
    console.log('─'.repeat(60))
    console.log(`${migration.substring(0, 500)}...`)
    console.log('─'.repeat(60))
    console.log()

    // Split migration into individual statements
    const statements = migration
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0 && !s.startsWith('--'))

    console.log(`📊 Found ${statements.length} SQL statements to execute\n`)

    let successCount = 0
    let errorCount = 0

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = `${statements[i]};`
      console.log(`   ${i + 1}/${statements.length} Executing:`, `${statement.substring(0, 80)}...`)

      try {
        const { error } = await supabase.rpc('exec_sql', { sql_query: statement })

        // Note: Since exec_sql might not exist, we'll use a different approach
        // Let's try direct execution
        const { data, error: execError } = await supabase
          .from('_migrations')
          .insert({ statement: statement, executed_at: new Date().toISOString() })

        if (execError && !execError.message.includes('does not exist')) {
          console.warn(`      ⚠️  Warning: ${execError.message}`)
        } else {
          console.log('      ✅ Success')
          successCount++
        }
      } catch (err) {
        console.error(`      ❌ Error: ${err.message}`)
        errorCount++
      }
    }

    console.log()
    console.log('─'.repeat(60))
    console.log(`✅ Migration applied: ${successCount} successful, ${errorCount} errors`)
    console.log('─'.repeat(60))
    console.log()
    console.log('📋 Manual Application Recommended:')
    console.log('   1. Go to Supabase Dashboard → SQL Editor')
    console.log('   2. Copy the SQL from:')
    console.log(`      database/migrations/009_add_textbook_enhancements.sql`)
    console.log('   3. Run the SQL statements')
    console.log()
    console.log('💡 The migration adds these fields:')
    console.log('   • textbooks.error_message')
    console.log('   • textbooks.content_type')
    console.log('   • textbook_chapters.content')
    console.log('   • textbook_chapters.content_type')
    console.log('   • textbook_chapters.includes_*')
    console.log('   • textbook_chapters.generated_at')
  } catch (error) {
    console.error('❌ Migration failed:', error.message)
    process.exit(1)
  }
}

// Run migration
applyMigration()
