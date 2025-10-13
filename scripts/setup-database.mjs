#!/usr/bin/env node

/**
 * Database Setup Script
 * Sets up the Shinmen Takezo database schema in Supabase
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
const envPath = join(process.cwd(), '.env.local')
let SUPABASE_URL, SUPABASE_SERVICE_KEY

try {
  const envContent = readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')

  for (const line of lines) {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      SUPABASE_URL = line.split('=')[1].trim()
    }
    if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) {
      SUPABASE_SERVICE_KEY = line.split('=')[1].trim()
    }
  }
} catch (error) {
  console.error('Error reading .env.local:', error.message)
  process.exit(1)
}

console.log('\n🗄️  Shinmen Takezo Database Setup\n')
console.log('='.repeat(60))

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('\n❌ Missing Supabase configuration')
  console.error('Please ensure .env.local has:')
  console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  console.error('  - SUPABASE_SERVICE_ROLE_KEY\n')
  process.exit(1)
}

console.log('\n📋 Configuration:')
console.log(`   URL: ${SUPABASE_URL}`)
console.log(`   Service Key: ${SUPABASE_SERVICE_KEY.substring(0, 20)}...`)

// Create Supabase client with service role
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function setupDatabase() {
  try {
    console.log('\n🚀 Running database migration...\n')

    // Read migration file
    const migrationPath = join(process.cwd(), 'database/migrations/001_initial_schema.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')

    console.log('   📄 Migration file loaded')
    console.log(`   📏 Size: ${(migrationSQL.length / 1024).toFixed(2)} KB`)

    // Execute migration
    console.log('\n   ⏳ Executing SQL...')

    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL,
    })

    if (error) {
      // If the RPC function doesn't exist, try alternative method
      console.log('\n   💡 Trying alternative method (SQL Editor)...')
      console.log('\n   ⚠️  Direct SQL execution not available via client.')
      console.log('   📋 Please run the migration manually:\n')
      console.log('   1. Go to: https://supabase.com/dashboard/project/zsehtkeycyapjevgbzrd')
      console.log('   2. Navigate to SQL Editor')
      console.log('   3. Copy contents of: database/migrations/001_initial_schema.sql')
      console.log('   4. Paste and run in SQL Editor\n')

      // Try to verify if tables exist
      await verifySetup()
      return
    }

    console.log('   ✅ Migration executed successfully!')

    await verifySetup()
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message)
    console.log('\n💡 Manual setup required:')
    console.log('   See: database/README.md for instructions\n')
    process.exit(1)
  }
}

async function verifySetup() {
  console.log('\n🔍 Verifying database setup...\n')

  try {
    // Check if key tables exist
    const tablesToCheck = [
      'users',
      'textbooks',
      'textbook_chapters',
      'lessons',
      'vocabulary',
      'kanji',
      'grammar_points',
      'srs_cards',
    ]

    let allTablesExist = true

    for (const table of tablesToCheck) {
      try {
        const { error } = await supabase.from(table).select('id').limit(1)

        if (error?.message.includes('does not exist')) {
          console.log(`   ❌ Table '${table}' not found`)
          allTablesExist = false
        } else {
          console.log(`   ✅ Table '${table}' exists`)
        }
      } catch (_err) {
        console.log(`   ❓ Could not verify '${table}'`)
      }
    }

    if (allTablesExist) {
      console.log(`\n${'='.repeat(60)}`)
      console.log('✅ Database setup complete!')
      console.log('='.repeat(60))
      console.log('\n📚 Your database is ready for:')
      console.log('   • AI textbook generation')
      console.log('   • User progress tracking')
      console.log('   • SRS flashcard system')
      console.log('   • Vocabulary & kanji learning')
      console.log('   • AI conversation practice\n')
      console.log('🚀 Next steps:')
      console.log('   1. Start the dev server: npm run dev')
      console.log('   2. Visit: http://localhost:3001/textbooks/generate')
      console.log('   3. Generate your first AI textbook!\n')
    } else {
      console.log('\n⚠️  Some tables are missing.')
      console.log('   Please run the migration manually.')
      console.log('   See: database/README.md\n')
    }
  } catch (error) {
    console.log('\n⚠️  Could not verify setup completely')
    console.log('   Error:', error.message)
    console.log('\n   If tables were created, you can ignore this message.')
    console.log('   Test by creating a textbook at: http://localhost:3001\n')
  }
}

// Run setup
setupDatabase()
