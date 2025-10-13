/**
 * Environment Variables Checker
 * Validates required environment variables and provides helpful error messages
 */

interface EnvVar {
  key: string
  required: boolean
  description: string
  example?: string
}

const ENV_VARS: EnvVar[] = [
  // NVIDIA (REQUIRED - Primary AI Provider)
  {
    key: 'NVIDIA_API_KEY_1',
    required: true,
    description: 'Primary NVIDIA API key for stockmark-2-100b-instruct model',
    example: 'nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  {
    key: 'NVIDIA_API_KEY_2',
    required: false,
    description: 'Secondary NVIDIA API key for load balancing and redundancy',
    example: 'nvapi-yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
  },

  // Supabase (Required - already configured)
  {
    key: 'NEXT_PUBLIC_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL',
    example: 'https://xxxxx.supabase.co',
  },
  {
    key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  },
  {
    key: 'SUPABASE_SERVICE_ROLE_KEY',
    required: true,
    description: 'Supabase service role key for server-side operations',
  },

  // NextAuth
  {
    key: 'NEXTAUTH_URL',
    required: true,
    description: 'Base URL for NextAuth',
    example: 'http://localhost:3000',
  },
  {
    key: 'NEXTAUTH_SECRET',
    required: true,
    description: 'Secret for NextAuth JWT encryption',
    example: 'generate with: openssl rand -base64 32',
  },

  // Optional OAuth
  {
    key: 'GOOGLE_CLIENT_ID',
    required: false,
    description: 'Google OAuth client ID',
  },
  {
    key: 'GOOGLE_CLIENT_SECRET',
    required: false,
    description: 'Google OAuth client secret',
  },
]

interface CheckResult {
  isValid: boolean
  missing: EnvVar[]
  warnings: EnvVar[]
  aiStatus: {
    nvidia: boolean
    hasAI: boolean
  }
}

export function checkEnvironment(): CheckResult {
  const missing: EnvVar[] = []
  const warnings: EnvVar[] = []

  // Check each environment variable
  ENV_VARS.forEach((envVar) => {
    const value = process.env[envVar.key]

    if (!value || value === '') {
      if (envVar.required) {
        missing.push(envVar)
      } else {
        warnings.push(envVar)
      }
    }
  })

  // Check AI availability (NVIDIA only)
  const hasNvidia = Boolean(process.env.NVIDIA_API_KEY_1 || process.env.NVIDIA_API_KEY_2)

  const aiStatus = {
    nvidia: hasNvidia,
    hasAI: hasNvidia,
  }

  return {
    isValid: missing.length === 0,
    missing,
    warnings,
    aiStatus,
  }
}

export function printEnvironmentStatus(): void {
  const result = checkEnvironment()

  console.log('\n🔍 Environment Check\n')
  console.log('='.repeat(60))

  // Missing required vars
  if (result.missing.length > 0) {
    console.log('\n❌ MISSING REQUIRED VARIABLES:\n')
    result.missing.forEach((v) => {
      console.log(`   ${v.key}`)
      console.log(`   └─ ${v.description}`)
      if (v.example) {
        console.log(`   └─ Example: ${v.example}`)
      }
      console.log()
    })
  }

  // Optional warnings
  if (result.warnings.length > 0) {
    console.log('\n⚠️  OPTIONAL VARIABLES (warnings):\n')
    result.warnings.forEach((v) => {
      console.log(`   ${v.key}`)
      console.log(`   └─ ${v.description}`)
      console.log()
    })
  }

  // AI Status
  console.log('\n🤖 AI Configuration:\n')
  console.log(`   NVIDIA NIM API: ${result.aiStatus.nvidia ? '✅ Available' : '❌ Not configured'}`)
  console.log(`   Primary Model: stockmark-2-100b-instruct (100B params)`)

  if (!result.aiStatus.hasAI) {
    console.log('\n   ❌ ERROR: NVIDIA API not configured!')
    console.log('   Add NVIDIA_API_KEY_1 to enable AI features.')
    console.log('   Get your API key at: https://build.nvidia.com/')
  }

  // Overall status
  console.log(`\n${'='.repeat(60)}`)
  if (result.isValid && result.aiStatus.hasAI) {
    console.log('✅ Environment configured correctly!\n')
  } else if (result.isValid) {
    console.log('⚠️  Environment valid but AI not configured\n')
  } else {
    console.log('❌ Environment has missing required variables\n')
  }
}

// Export for use in other modules
export default {
  checkEnvironment,
  printEnvironmentStatus,
}
