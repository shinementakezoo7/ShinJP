import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { generateTextbookPDF } from '@/lib/pdf/textbook-pdf-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
)

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: textbookId } = await params

    if (!textbookId) {
      return NextResponse.json({ error: 'Textbook ID required' }, { status: 400 })
    }

    console.log(`📥 Generating PDF for textbook: ${textbookId}`)

    // Fetch textbook and chapters
    const { data: textbook, error: textbookError } = await supabase
      .from('textbooks')
      .select('*')
      .eq('id', textbookId)
      .single()

    if (textbookError || !textbook) {
      return NextResponse.json({ error: 'Textbook not found' }, { status: 404 })
    }

    const { data: chapters, error: chaptersError } = await supabase
      .from('textbook_chapters')
      .select('*')
      .eq('textbook_id', textbookId)
      .order('chapter_number', { ascending: true })

    if (chaptersError) {
      return NextResponse.json({ error: 'Failed to load chapters' }, { status: 500 })
    }

    // Generate PDF
    const pdfBuffer = await generateTextbookPDF({
      textbook,
      chapters: chapters || [],
    })

    // Increment download count
    await supabase
      .from('textbooks')
      .update({ download_count: (textbook.download_count || 0) + 1 })
      .eq('id', textbookId)

    console.log(`   ✅ PDF generated successfully`)

    // Return PDF as downloadable file
    return new NextResponse(Uint8Array.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${textbook.title.replace(/[^a-z0-9]/gi, '_')}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    })
  } catch (error: unknown) {
    console.error('❌ Error generating PDF:', error)
    return NextResponse.json(
      {
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
