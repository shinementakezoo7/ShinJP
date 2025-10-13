import { createClient } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

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

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: textbookId } = await params

    if (!textbookId) {
      return NextResponse.json({ error: 'Textbook ID required' }, { status: 400 })
    }

    // Fetch textbook
    const { data: textbook, error: textbookError } = await supabase
      .from('textbooks')
      .select('*')
      .eq('id', textbookId)
      .single()

    if (textbookError || !textbook) {
      return NextResponse.json({ error: 'Textbook not found' }, { status: 404 })
    }

    // Fetch chapters
    const { data: chapters, error: chaptersError } = await supabase
      .from('textbook_chapters')
      .select('*')
      .eq('textbook_id', textbookId)
      .order('chapter_number', { ascending: true })

    if (chaptersError) {
      return NextResponse.json({ error: 'Failed to load chapters' }, { status: 500 })
    }

    // Increment view count
    await supabase
      .from('textbooks')
      .update({ view_count: (textbook.view_count || 0) + 1 })
      .eq('id', textbookId)

    return NextResponse.json({
      textbook,
      chapters: chapters || [],
    })
  } catch (error: unknown) {
    console.error('Error fetching textbook:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
