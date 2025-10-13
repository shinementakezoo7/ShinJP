#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

const rootDir = __dirname
const docsBaseDir = path.join(rootDir, 'docs')

// Files to exclude from moving
const excludeFiles = ['README.md']

// Define where specific files should go
const fileDestinations = {
  'ORGANIZATION_COMPLETE.md': 'summaries',
  'DATABASE_ANALYSIS_AND_ENHANCEMENTS.md': 'implementation',
}

console.log('🗂️  Moving remaining files to their respective folders...\n')

let filesMoved = 0

// Get all files in docs root directory
const files = fs.readdirSync(docsBaseDir)

files.forEach((file) => {
  // Skip directories and excluded files
  const fullPath = path.join(docsBaseDir, file)
  if (!fs.statSync(fullPath).isFile() || excludeFiles.includes(file)) {
    return
  }

  // Determine destination folder
  const destinationFolder = fileDestinations[file] || 'miscellaneous'
  const destinationDir = path.join(docsBaseDir, destinationFolder)

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true })
    console.log(`📁 Created directory: docs/${destinationFolder}/`)
  }

  // Move file
  const sourcePath = path.join(docsBaseDir, file)
  const destPath = path.join(destinationDir, file)

  try {
    fs.renameSync(sourcePath, destPath)
    console.log(`   ➡️  ${file} → docs/${destinationFolder}/`)
    filesMoved++
  } catch (error) {
    console.error(`   ❌ Error moving ${file}:`, error.message)
  }
})

console.log(`\n✨ Organization complete!`)
console.log(`   📊 Total files moved: ${filesMoved}`)

if (filesMoved === 0) {
  console.log(`   📂 No files needed to be moved.`)
}
