#!/usr/bin/env tsx
/**
 * Generate All 14 SSW Sector Books
 *
 * This will generate 7,000 pages of content across all sectors
 * Estimated time: 2-6 hours
 * Estimated cost: $28-56
 */

import { BookGenerationOrchestrator } from '../src/lib/book-generation/orchestrator'
import { SSW_SECTORS, SSW_SECTOR_INFO } from '../src/lib/book-generation/ssw-templates'

async function main() {
  console.log('🚀 GENERATING ALL 14 SSW SECTOR BOOKS')
  console.log('='.repeat(70))
  console.log(`\n📊 Overview:`)
  console.log(`   Sectors: ${SSW_SECTORS.length}`)
  console.log(`   Total Pages: 7,000 (500 per sector)`)
  console.log(`   Total Chapters: 350 (25 per sector)`)
  console.log(`   Parallel: 10 chapters per book`)
  console.log(`\n⏱️  Estimated Time: 2-6 hours`)
  console.log(`💰 Estimated Cost: $28-56`)
  console.log('='.repeat(70) + '\n')

  const orchestrator = new BookGenerationOrchestrator()
  const jobs: { sector: string; jobId: string }[] = []

  // Generate all sectors
  for (const sector of SSW_SECTORS) {
    const sectorInfo = SSW_SECTOR_INFO[sector]

    console.log(`\n📚 Starting: ${sectorInfo.name} (${sectorInfo.japaneseeName})`)

    try {
      const jobId = await orchestrator.startGeneration({
        bookType: 'ssw_sector',
        sectorId: sector,
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

      jobs.push({ sector: sectorInfo.name, jobId })
      console.log(`   ✅ Job started: ${jobId}`)

      // Small delay to avoid overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 5000))
    } catch (error) {
      console.error(`   ❌ Failed to start ${sectorInfo.name}:`, error)
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('\n✅ All jobs started!')
  console.log(`\n📋 Job Summary (${jobs.length} books):`)
  jobs.forEach(({ sector, jobId }) => {
    console.log(`   ${sector}: ${jobId}`)
  })

  console.log('\n📊 Monitor progress above...')
  console.log('   Generation continues in parallel\n')

  // Keep process alive
  console.log('⏳ Generating all books...')
  console.log('   This will take 2-6 hours')
  console.log('   Press Ctrl+C to detach (generation continues)\n')

  await new Promise(() => {})
}

main().catch((error) => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
