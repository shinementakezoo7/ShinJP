#!/usr/bin/env node

/**
 * Fix TypeScript type definitions to add semicolons
 * This makes the types compatible with Turbopack's stricter parser
 */

const fs = require('node:fs')
const path = require('node:path')

const filePath = path.join(process.cwd(), 'src/lib/supabase/client.ts')

console.log('Reading file:', filePath)
let content = fs.readFileSync(filePath, 'utf-8')

// Count original issues
const _originalLines = content.split('\n')
let fixCount = 0

// Fix: Add semicolons after type properties that don't have them
// Match lines like "    property: type" or "    property?: type" without semicolon
const lines = content.split('\n')
const fixedLines = lines.map((line, _index) => {
  // Skip lines that already have semicolons, commas, or braces at the end
  if (line.match(/[;,{}]$/)) {
    return line
  }

  // Match property definitions inside type definitions
  // Pattern: whitespace + property name + optional ? + : + type
  if (line.match(/^\s+\w+\??\s*:\s*.+[^;,{}]$/)) {
    fixCount++
    return `${line};`
  }

  return line
})

content = fixedLines.join('\n')

console.log(`Fixed ${fixCount} properties by adding semicolons`)

// Write back
fs.writeFileSync(filePath, content, 'utf-8')
console.log('✅ File fixed successfully!')
console.log('Run: npm run dev')
