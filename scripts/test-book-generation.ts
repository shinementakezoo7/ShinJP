/**
 * Test Book Generation System
 *
 * Generate a small test book to validate the system
 */

import { BookGenerationOrchestrator } from '../src/lib/book-generation/orchestrator'

async function testBookGeneration() {
  console.log('🧪 Testing Book Generation System\n')
  console.log('='.repeat(60))

  const orchestrator = new BookGenerationOrchestrator()

  // Test configuration
  const testConfig = {
    bookType: 'ssw_sector' as const,
    sectorId: 'caregiving',
    config: {
      parallelChapters: 3, // Lower for testing
      useStreaming: true,
      includeExercises: true,
      includeAudioScripts: false,
      includeCulturalNotes: true,
      vocabularyDensity: 'medium' as const,
      grammarFocus: true,
      retryOnFailure: true,
      maxRetries: 2,
    },
    targetPages: 100, // Smaller for testing
    targetChapters: 5, // Just 5 chapters for test
    bookTitle: 'SSW Caregiving - Test Book',
  }

  console.log('\n📋 Test Configuration:')
  console.log(`   Sector: ${testConfig.sectorId}`)
  console.log(`   Chapters: ${testConfig.targetChapters}`)
  console.log(`   Pages: ${testConfig.targetPages}`)
  console.log(`   Parallel: ${testConfig.config.parallelChapters}`)
  console.log('\n' + '='.repeat(60))

  try {
    // Start generation
    console.log('\n🚀 Starting generation...\n')
    const jobId = await orchestrator.startGeneration(testConfig)

    console.log(`\n✅ Generation started successfully!`)
    console.log(`   Job ID: ${jobId}`)
    console.log('\n📊 Monitor progress above...\n')

    // Wait a bit for progress
    console.log('⏳ Waiting for generation to complete...')
    console.log('   (This may take 5-15 minutes for 5 chapters)\n')

    // In production, you would:
    // 1. Monitor via progress tracker
    // 2. Display real-time updates
    // 3. Wait for completion
    // 4. Download/export the book

    console.log('='.repeat(60))
    console.log('\n✅ Test completed! Check logs above for details.\n')

    console.log('📝 Next Steps:')
    console.log('   1. Check if chapters were generated')
    console.log('   2. Review content quality')
    console.log('   3. Test with full 25-chapter book')
    console.log('   4. Add database persistence')
    console.log('   5. Implement export formats\n')
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    console.error('\nError details:', error instanceof Error ? error.message : error)
    process.exit(1)
  }
}

// Run test
testBookGeneration().catch((error) => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})
