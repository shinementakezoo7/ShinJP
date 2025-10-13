#!/usr/bin/env node

/**
 * Test Supabase Connection and Table Structure
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { createClient } from '@supabase/supabase-js'

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

console.log('🔍 Testing Supabase Connection...\n')
console.log(`   URL: ${SUPABASE_URL}`)
console.log(`   Key: ${SUPABASE_KEY ? `✅ Set (${SUPABASE_KEY.length} chars)` : '❌ Not set'}\n`)

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase credentials!')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testConnection() {
  try {
    // Test 1: Check textbooks table structure
    console.log('📋 Test 1: Checking textbooks table structure...')
    const { data: columns, error: columnsError } = await supabase
      .from('textbooks')
      .select('*')
      .limit(0)

    if (columnsError) {
      console.error('   ❌ Error querying textbooks table:', columnsError.message)
      return false
    }
    console.log('   ✅ Textbooks table exists and is accessible\n')

    // Test 2: Try to insert a test record
    console.log('📝 Test 2: Attempting to insert test textbook...')
    const testData = {
      title: 'Test Textbook - DELETE ME',
      jlpt_level: 'N5',
      topics: ['test'],
      keywords: [],
      total_chapters: 1,
      generation_status: 'draft',
      is_public: false,
      is_published: false,
      generated_by: 'Test Script',
      generation_params: { test: true },
    }

    console.log('   Attempting insert with data:', JSON.stringify(testData, null, 2))

    const { data: insertedData, error: insertError } = await supabase
      .from('textbooks')
      .insert(testData)
      .select()
      .single()

    if (insertError) {
      console.error('   ❌ Insert failed:', insertError.message)
      console.error('   Error code:', insertError.code)
      console.error('   Error details:', insertError.details)
      console.error('   Error hint:', insertError.hint)

      // Check if it's a column issue
      if (insertError.message.includes('column') || insertError.code === '42703') {
        console.log('\n   💡 This looks like a missing column issue.')
        console.log('   Run this SQL in Supabase SQL Editor:')
        console.log('   ---')
        console.log('   -- Check which columns exist')
        console.log('   SELECT column_name, data_type ')
        console.log('   FROM information_schema.columns ')
        console.log("   WHERE table_name = 'textbooks';")
        console.log('   ---')
      }

      return false
    }

    console.log('   ✅ Insert successful!')
    console.log('   Inserted ID:', insertedData.id)

    // Test 3: Clean up test record
    console.log('\n🧹 Test 3: Cleaning up test record...')
    const { error: deleteError } = await supabase
      .from('textbooks')
      .delete()
      .eq('id', insertedData.id)

    if (deleteError) {
      console.error('   ⚠️  Could not delete test record:', deleteError.message)
      console.log('   Please manually delete record with ID:', insertedData.id)
    } else {
      console.log('   ✅ Test record deleted\n')
    }

    return true
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
    console.error('   Stack:', error.stack)
    return false
  }
}

// Run tests
testConnection().then((success) => {
  if (success) {
    console.log('✅ All tests passed! Supabase connection is working.')
  } else {
    console.log('❌ Some tests failed. Please check the errors above.')
    process.exit(1)
  }
})
