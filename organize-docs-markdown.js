#!/usr/bin/env node

const fs = require('node:fs')
const path = require('node:path')

// Define the organization plan
const organizationPlan = {
  // Files from project root to docs subdirectories
  projectRoot: {
    'CHAT_ANIMATIONS_ADDED.md': 'docs/chat/',
    'CHAT_REDESIGN_SUMMARY.md': 'docs/summaries/',
    'DATABASE_ENHANCEMENTS_README.md': 'docs/implementation/',
    'README_SHINMEN_TAKEZO.md': 'docs/setup/',
    'README_UPDATED.md': 'docs/miscellaneous/',
  },

  // Files from docs root to subdirectories
  docsRoot: {
    'DATABASE_ENHANCEMENT_SUMMARY.md': 'docs/summaries/',
  },

  // Keep these files in their current location
  keep: [
    'README.md', // Main project README
    'docs/README.md', // Docs index
  ],
}

const projectRoot = '/workspaces/ShinJP'

function moveFile(sourcePath, destDir, fileName) {
  const fullSourcePath = path.join(projectRoot, sourcePath)
  const fullDestPath = path.join(projectRoot, destDir, fileName)

  // Check if source exists
  if (!fs.existsSync(fullSourcePath)) {
    console.log(`⚠️  Source not found: ${sourcePath}`)
    return false
  }

  // Create destination directory if it doesn't exist
  const destDirFull = path.join(projectRoot, destDir)
  if (!fs.existsSync(destDirFull)) {
    fs.mkdirSync(destDirFull, { recursive: true })
    console.log(`📁 Created directory: ${destDir}`)
  }

  // Check if destination already exists
  if (fs.existsSync(fullDestPath)) {
    console.log(`⚠️  Destination already exists: ${path.join(destDir, fileName)}`)
    console.log(`   Skipping to avoid overwrite.`)
    return false
  }

  // Move the file
  try {
    fs.renameSync(fullSourcePath, fullDestPath)
    console.log(`✅ Moved: ${sourcePath} → ${path.join(destDir, fileName)}`)
    return true
  } catch (error) {
    console.error(`❌ Error moving ${sourcePath}:`, error.message)
    return false
  }
}

function organizeFiles() {
  console.log('╔════════════════════════════════════════════════════════╗')
  console.log('║     📚 Organizing Markdown Files in Docs              ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  let movedCount = 0
  let skippedCount = 0

  // Move files from project root
  console.log('📦 Moving files from project root...\n')
  for (const [fileName, destDir] of Object.entries(organizationPlan.projectRoot)) {
    if (moveFile(fileName, destDir, fileName)) {
      movedCount++
    } else {
      skippedCount++
    }
  }

  console.log('\n📦 Moving files from docs root...\n')
  // Move files from docs root
  for (const [fileName, destDir] of Object.entries(organizationPlan.docsRoot)) {
    if (moveFile(path.join('docs', fileName), destDir, fileName)) {
      movedCount++
    } else {
      skippedCount++
    }
  }

  console.log('\n✓ Files kept in place:')
  organizationPlan.keep.forEach((file) => {
    const fullPath = path.join(projectRoot, file)
    if (fs.existsSync(fullPath)) {
      console.log(`  ✓ ${file}`)
    } else {
      console.log(`  ⚠️  ${file} (not found)`)
    }
  })

  console.log(`\n${'═'.repeat(58)}`)
  console.log(`📊 Summary: ${movedCount} moved, ${skippedCount} skipped`)
  console.log('═'.repeat(58))
}

function verifyOrganization() {
  console.log('\n\n╔════════════════════════════════════════════════════════╗')
  console.log('║     🔍 Verification Report                             ║')
  console.log('╚════════════════════════════════════════════════════════╝\n')

  const docsDir = path.join(projectRoot, 'docs')
  const subdirs = fs.readdirSync(docsDir).filter((item) => {
    const itemPath = path.join(docsDir, item)
    return fs.statSync(itemPath).isDirectory()
  })

  console.log('📁 Current docs directory structure:\n')

  // Check each subdirectory
  subdirs.sort().forEach((subdir) => {
    const subdirPath = path.join(docsDir, subdir)
    const mdFiles = fs.readdirSync(subdirPath).filter((f) => f.endsWith('.md'))

    console.log(`  📂 ${subdir}/ (${mdFiles.length} markdown files)`)
    if (mdFiles.length > 0 && mdFiles.length <= 10) {
      mdFiles.forEach((file) => {
        console.log(`     • ${file}`)
      })
    }
  })

  // Check docs root
  const docsRootFiles = fs
    .readdirSync(docsDir)
    .filter((f) => f.endsWith('.md') && fs.statSync(path.join(docsDir, f)).isFile())

  console.log(`\n  📄 docs/ root (${docsRootFiles.length} markdown files)`)
  docsRootFiles.forEach((file) => {
    console.log(`     • ${file}`)
  })

  // Check project root
  const projectRootFiles = fs
    .readdirSync(projectRoot)
    .filter((f) => f.endsWith('.md') && fs.statSync(path.join(projectRoot, f)).isFile())

  console.log(`\n  📄 project root (${projectRootFiles.length} markdown files)`)
  projectRootFiles.forEach((file) => {
    console.log(`     • ${file}`)
  })

  console.log(`\n${'═'.repeat(58)}`)
  console.log('✅ Verification complete!')
  console.log('═'.repeat(58))
}

// Main execution
console.log('\n')
organizeFiles()
verifyOrganization()
console.log('\n🎉 Documentation organization complete!\n')
