#!/usr/bin/env tsx
/**
 * Generate a complete SSW Sector Book
 *
 * Usage:
 *   npm run generate-book caregiving
 *   npm run generate-book construction
 *   npm run generate-book agriculture
 */

import { BookGenerationOrchestrator } from '../src/lib/book-generation/orchestrator'
import { SSW_SECTORS, SSW_SECTOR_INFO } from '../src/lib/book-generation/ssw-templates'

async function main() {
  const args = process.argv.slice(2)
  const sectorId = args[0] || 'caregiving'

  // Validate sector
  if (!SSW_SECTORS.includes(sectorId as any)) {
    console.error(`❌ Invalid sector: ${sectorId}`)
    console.error(`\nAvailable sectors:`)
    SSW_SECTORS.forEach((s) => console.error(`   - ${s}`))
    process.exit(1)
  }

  const sectorInfo = SSW_SECTOR_INFO[sectorId as keyof typeof SSW_SECTOR_INFO]

  console.log('📚 Generating SSW Sector Book')
  console.log('='.repeat(70))
  console.log(`\n📋 Configuration:`)
  console.log(`   Sector: ${sectorInfo.name} (${sectorInfo.japaneseeName})`)
  console.log(`   Description: ${sectorInfo.description}`)
  console.log(`   Vocabulary Target: ${sectorInfo.vocabularyTarget} terms`)
  console.log(`   Safety Focus: ${sectorInfo.safetyFocus ? '⚠️  Yes' : 'No'}`)
  console.log(`   Customer Facing: ${sectorInfo.customerFacing ? 'Yes' : 'No'}`)
  console.log(`\n📖 Book Structure:`)
  console.log(`   Total Pages: 500`)
  console.log(`   Total Chapters: 25`)
  console.log(`   Parallel Generation: 10 chapters at once`)
  console.log(`\n⏱️  Estimated Time: 10-15 minutes`)
  console.log('='.repeat(70) + '\n')

  const orchestrator = new BookGenerationOrchestrator()

  try {
    const jobId = await orchestrator.startGeneration({
      bookType: 'ssw_sector',
      sectorId: sectorId,
      config: {
        parallelChapters: 10,
        useStreaming: true,
        includeExercises: true,
        includeAudioScripts: true,
        includeCulturalNotes: true,
        vocabularyDensity: 'high',
        grammarFocus: true,
        retryOnFailure: true,
        maxRetries: 3,
      },
      targetPages: 500,
      targetChapters: 25,
      bookTitle: `SSW ${sectorInfo.name} - Complete Japanese Textbook`,
    })

    console.log(`\n✅ Generation started!`)
    console.log(`   Job ID: ${jobId}`)
    console.log(`\n📊 Monitor the progress above...`)
    console.log(`\n💡 To check status later:`)
    console.log(`   Job ID: ${jobId}`)

    // Keep process alive to see progress
    console.log('\n⏳ Generation in progress...')
    console.log('   Press Ctrl+C to detach (generation continues in background)\n')

    // Wait indefinitely
    await new Promise(() => {})
  } catch (error) {
    console.error('\n❌ Generation failed:', error)
    process.exit(1)
  }
}

main().catch((error) => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
