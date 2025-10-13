#!/usr/bin/env node

/**
 * Fix TypeScript nested object commas
 * Add commas after closing braces of nested objects (Row, Insert, Update)
 */

const fs = require('node:fs')
const path = require('node:path')

const filePath = path.join(process.cwd(), 'src/lib/supabase/client.ts')

console.log('Reading file:', filePath)
let content = fs.readFileSync(filePath, 'utf-8')

const lines = content.split('\n')
const fixedLines = []
let fixCount = 0

for (let i = 0; i < lines.length; i++) {
  const currentLine = lines[i]
  const nextLine = lines[i + 1]

  // Check if current line is a closing brace (just spaces and })
  // AND next line starts with Row:, Insert:, Update:, or is another table definition
  if (currentLine.match(/^\s+}$/) && nextLine) {
    const nextTrimmed = nextLine.trim()
    // If next line starts with a nested object property or is a new table
    if (nextTrimmed.match(/^(Row|Insert|Update|[\w_]+):/) && !currentLine.includes(',')) {
      fixCount++
      fixedLines.push(currentLine.replace('}', '},'))
      continue
    }
  }

  fixedLines.push(currentLine)
}

content = fixedLines.join('\n')

console.log(`Fixed ${fixCount} nested object commas`)

// Write back
fs.writeFileSync(filePath, content, 'utf-8')
console.log('✅ File fixed successfully!')
console.log('Run: npm run build')
