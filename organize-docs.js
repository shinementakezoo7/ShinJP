#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

// Define categories based on file naming patterns and content analysis
const categoryRules = {
  setup: [
    'START_HERE.md',
    'QUICK_START.md',
    'ENV_SETUP_INSTRUCTIONS.md',
    'PHASE2_SETUP_INSTRUCTIONS.md',
    'TEXTBOOK_GENERATOR_SETUP.md',
  ],
  chat: [/^CHAT_.*\.md$/, 'COMPLETE_CHAT_UPGRADE_SUMMARY.md'],
  textbook: [/^TEXTBOOK_GENERATOR_.*\.md$/],
  dashboard: [/^DASHBOARD_.*\.md$/, 'JAPANESE_DASHBOARD_REDESIGN.md'],
  design: ['VISUAL_DESIGN_GUIDE.md', 'JAPANESE_DESIGN_ENHANCEMENT.md', 'UI_IMPROVEMENTS.md'],
  'bugs-and-fixes': [
    'BUGS_FIXED_SUMMARY.md',
    'BUG_FIXES.md',
    'ALL_ERRORS_FIXED.md',
    'ENGLISH_TEACHING_FIX.md',
    'CHAT_ERROR_FIXED.md',
    'FINAL_FIX_SUMMARY.md',
    'JSON_FIX_AND_ENHANCEMENT_COMPLETE.md',
  ],
  implementation: [
    'IMPLEMENTATION_SUMMARY.md',
    'JLPT_CONTENT_SYSTEM.md',
    'JLPT_SYSTEM_IMPLEMENTATION_SUMMARY.md',
    'PROMPT_ENHANCEMENT_SYSTEM.md',
  ],
  features: [
    'AI_UX_ENHANCEMENTS_SUMMARY.md',
    'BOOKS_SECTION_COMPLETE.md',
    'PHASE2_COMPLETE.md',
    'AUTH_REMOVED.md',
    'CHAT_ENHANCEMENT_COMPLETE.md',
    'DASHBOARD_ENHANCEMENT_COMPLETE.md',
    'DASHBOARD_TRANSFORMATION_SUMMARY.md',
  ],
  summaries: [
    'CHAT_SUMMARY.md',
    'FINAL_CHAT_SUMMARY.md',
    'SENSEI_TANAKA_UPGRADE.md',
    'CHAT_UI_IMPROVEMENTS.md',
    'CHAT_UI_SENSEI_UPGRADE.md',
    'CHAT_SIZE_REDUCTION.md',
  ],
}

// Files to exclude
const excludeFiles = ['README.md', 'README_SHINMEN_TAKEZO.md', 'README_UPDATED.md']

const rootDir = __dirname
const docsBaseDir = path.join(rootDir, 'docs')

// Get all markdown files in root directory
function getMarkdownFiles() {
  const files = fs.readdirSync(rootDir)
  return files.filter((file) => {
    return (
      file.endsWith('.md') &&
      !excludeFiles.includes(file) &&
      fs.statSync(path.join(rootDir, file)).isFile()
    )
  })
}

// Determine category for a file
function getCategoryForFile(filename) {
  for (const [category, rules] of Object.entries(categoryRules)) {
    for (const rule of rules) {
      if (typeof rule === 'string' && rule === filename) {
        return category
      }
      if (rule instanceof RegExp && rule.test(filename)) {
        return category
      }
    }
  }
  return 'miscellaneous' // Default category
}

// Create category folders and organize files
function organizeFiles() {
  console.log('🗂️  Organizing markdown files by category...\n')

  const markdownFiles = getMarkdownFiles()
  console.log(`Found ${markdownFiles.length} markdown files to organize\n`)

  // Create base docs directory if it doesn't exist
  if (!fs.existsSync(docsBaseDir)) {
    fs.mkdirSync(docsBaseDir, { recursive: true })
    console.log(`✅ Created base directory: docs/\n`)
  }

  // Group files by category
  const filesByCategory = {}
  markdownFiles.forEach((file) => {
    const category = getCategoryForFile(file)
    if (!filesByCategory[category]) {
      filesByCategory[category] = []
    }
    filesByCategory[category].push(file)
  })

  // Create category folders and move files
  let totalMoved = 0
  Object.entries(filesByCategory).forEach(([category, files]) => {
    const categoryDir = path.join(docsBaseDir, category)

    // Create category directory
    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true })
      console.log(`📁 Created category: docs/${category}/`)
    }

    // Move files to category directory
    files.forEach((file) => {
      const sourcePath = path.join(rootDir, file)
      const destPath = path.join(categoryDir, file)

      try {
        fs.renameSync(sourcePath, destPath)
        console.log(`   ➡️  ${file} → docs/${category}/`)
        totalMoved++
      } catch (error) {
        console.error(`   ❌ Error moving ${file}:`, error.message)
      }
    })

    console.log('')
  })

  console.log(`\n✨ Organization complete!`)
  console.log(`   📊 Total files organized: ${totalMoved}`)
  console.log(`   📂 Categories created: ${Object.keys(filesByCategory).length}`)
  console.log('\nCategory breakdown:')
  Object.entries(filesByCategory).forEach(([category, files]) => {
    console.log(`   - ${category}: ${files.length} file(s)`)
  })
}

// Run the organization
try {
  organizeFiles()
} catch (error) {
  console.error('❌ Error during organization:', error)
  process.exit(1)
}
