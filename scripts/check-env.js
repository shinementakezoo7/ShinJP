#!/usr/bin/env node

/**
 * Environment Check Script
 * Run with: node scripts/check-env.js
 */

// Simple .env.local reader (doesn't require dotenv package)
try {
  const fs = require('node:fs')
  const path = require('node:path')
  const envPath = path.join(process.cwd(), '.env.local')

  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach((line) => {
      const match = line.match(/^([^=:#]+)=(.*)$/)
      if (match) {
        const key = match[1].trim()
        const value = match[2].trim().replace(/^["']|["']$/g, '')
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  }
} catch (_error) {
  // .env.local not found or unreadable - continue with system env vars
}

const ENV_VARS = [
  // NVIDIA (Optional)
  {
    key: 'NVIDIA_API_KEY_1',
    required: false,
    description: 'Primary NVIDIA API key',
  },
  {
    key: 'NVIDIA_API_KEY_2',
    required: false,
    description: 'Secondary NVIDIA API key',
  },

  // OpenAI (Fallback)
  {
    key: 'OPENAI_API_KEY',
    required: false,
    description: 'OpenAI API key (fallback)',
  },

  // Supabase (Required)
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    description: 'Supabase service role key',
  },

  // NextAuth
  {
    key: 'NEXTAUTH_URL',
    required: true,
    description: 'NextAuth base URL',
  },
  {
    key: 'NEXTAUTH_SECRET',
    required: true,
    description: 'NextAuth secret key',
  },
]

function checkEnvironment() {
  console.log('\n🔍 Shinmen Takezo Environment Check\n')
  console.log('='.repeat(70))

  const missing = []
  const warnings = []

  ENV_VARS.forEach((envVar) => {
    const value = process.env[envVar.key]

    if (!value) {
      if (envVar.required) {
        missing.push(envVar)
      } else {
        warnings.push(envVar)
      }
    }
  })

  // Check AI
  const hasNvidia = Boolean(process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY_2)
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY)

  // Results
  if (missing.length > 0) {
    console.log('\n❌ MISSING REQUIRED:\n')
    missing.forEach((v) => console.log(`   • ${v.key} - ${v.description}`))
  }

  if (warnings.length > 0) {
    console.log('\n⚠️  OPTIONAL (not configured):\n')
    warnings.forEach((v) => console.log(`   • ${v.key} - ${v.description}`))
  }

  console.log('\n🤖 AI Status:\n')
  console.log(`   NVIDIA: ${hasNvidia ? '✅' : '❌'}`)
  console.log(`   OpenAI: ${hasOpenAI ? '✅' : '❌'}`)

  if (!hasNvidia && !hasOpenAI) {
    console.log('\n   ⚠️  No AI providers configured!')
  }

  console.log(`\n${'='.repeat(70)}`)

  if (missing.length === 0 && (hasNvidia || hasOpenAI)) {
    console.log('✅ Ready to run! Use: npm run dev\n')
    process.exit(0)
  } else if (missing.length === 0) {
    console.log('⚠️  Ready but no AI configured\n')
    process.exit(0)
  } else {
    console.log('❌ Fix missing variables in .env.local\n')
    process.exit(1)
  }
}

checkEnvironment()
