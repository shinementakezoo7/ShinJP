#!/usr/bin/env node

/**
 * Test NVIDIA API Integration
 * Tests the stockmark-2-100b-instruct model
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import axios from 'axios'

// Read .env.local file
const envPath = join(process.cwd(), '.env.local')
let NVIDIA_API_KEY = process.env.NVIDIA_API_KEY_1
let NVIDIA_ENDPOINT =
  process.env.NVIDIA_ENDPOINT_1 || 'https://integrate.api.nvidia.com/v1/chat/completions'

try {
  const envContent = readFileSync(envPath, 'utf8')
  const lines = envContent.split('\n')

  for (const line of lines) {
    if (line.startsWith('NVIDIA_API_KEY_1=')) {
      NVIDIA_API_KEY = line.split('=')[1].trim()
    }
    if (line.startsWith('NVIDIA_ENDPOINT_1=')) {
      NVIDIA_ENDPOINT = line.split('=')[1].trim()
    }
  }
} catch (error) {
  console.error('Could not read .env.local:', error.message)
}

console.log('\n🧪 Testing NVIDIA API Integration\n')
console.log('='.repeat(60))

if (!NVIDIA_API_KEY) {
  console.error('\n❌ ERROR: NVIDIA_API_KEY_1 not found in environment')
  console.log('Please set it in .env.local\n')
  process.exit(1)
}

console.log('\n📋 Configuration:')
console.log(`   API Key: ${NVIDIA_API_KEY.substring(0, 20)}...`)
console.log(`   Endpoint: ${NVIDIA_ENDPOINT}`)
console.log(`   Model: stockmark/stockmark-2-100b-instruct`)

async function testNVIDIA() {
  try {
    console.log('\n🚀 Sending test request...')
    console.log('   Prompt: "日本語でこんにちはと言ってください。"\n')

    const startTime = Date.now()

    const response = await axios.post(
      NVIDIA_ENDPOINT,
      {
        model: 'stockmark/stockmark-2-100b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful Japanese language assistant. Respond in Japanese.',
          },
          {
            role: 'user',
            content: '日本語でこんにちはと言ってください。短く答えてください。',
          },
        ],
        temperature: 0.7,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    )

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)

    console.log('✅ Success!\n')
    console.log('📊 Response:')
    console.log(`   Model: ${response.data.model}`)
    console.log(`   Response: ${response.data.choices[0]?.message?.content}`)
    console.log(`   Duration: ${duration}s`)
    console.log(
      `   Tokens: ${response.data.usage.total_tokens} (${response.data.usage.prompt_tokens} prompt + ${response.data.usage.completion_tokens} completion)`
    )

    console.log(`\n${'='.repeat(60)}`)
    console.log('✅ NVIDIA Integration Test: PASSED')
    console.log('🎉 Your platform is ready to generate Japanese content!')
    console.log('='.repeat(60))
    console.log('\n📚 Next steps:')
    console.log('   1. Start the dev server: npm run dev')
    console.log('   2. Visit: http://localhost:3001')
    console.log('   3. Start generating Japanese textbooks!\n')
  } catch (error) {
    console.error('\n❌ Test Failed!\n')

    if (error.response) {
      console.error('Error Details:')
      console.error(`   Status: ${error.response.status}`)
      console.error(`   Message: ${error.response.data?.detail || error.response.statusText}`)

      if (error.response.status === 401) {
        console.error('\n💡 Tip: Check your API key is valid and has access to stockmark models')
      } else if (error.response.status === 404) {
        console.error(
          '\n💡 Tip: The model might not be available. Try requesting access at https://build.nvidia.com/'
        )
      } else if (error.response.status === 429) {
        console.error('\n💡 Tip: Rate limit exceeded. Wait a moment and try again.')
      }
    } else if (error.code === 'ECONNREFUSED') {
      console.error('Cannot connect to NVIDIA API')
      console.error('Check your internet connection')
    } else {
      console.error(`Error: ${error.message}`)
    }

    console.log('\n')
    process.exit(1)
  }
}

testNVIDIA()
