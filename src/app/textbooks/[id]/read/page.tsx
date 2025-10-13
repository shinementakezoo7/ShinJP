'use client'

import { BookOpen, ChevronLeft, ChevronRight, Download, List } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Textbook {
  id: string
  title: string
  jlpt_level: string
  total_chapters: number
  description?: string
  topics: string[]
}

interface Chapter {
  id: string
  chapter_number: number
  title: string
  introduction: string
  sections: unknown[]
  vocabulary: Array<{
    word?: string
    japanese?: string
    reading?: string
    meaning?: string
    english?: string
  }>
  grammar_points: Array<{
    structure?: string
    pattern?: string
    meaning?: string
    explanation?: string
    example?: string
  }>
  exercises: unknown[]
  content: string | Record<string, unknown>
}

export default function ReadTextbookPage() {
  const params = useParams()
  const router = useRouter()
  const textbookId = params?.id as string

  const [textbook, setTextbook] = useState<Textbook | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [currentChapter, setCurrentChapter] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showSidebar, setShowSidebar] = useState(true)
  const [fontSize, setFontSize] = useState(16)
  const [showFurigana] = useState(true)
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (textbookId) {
      loadTextbook()
    }
     
  }, [textbookId, loadTextbook])

  async function loadTextbook() {
    setLoading(true)
    try {
      const response = await fetch(`/api/textbooks/${textbookId}`)
      if (!response.ok) throw new Error('Failed to load textbook')

      const data = await response.json()
      setTextbook(data.textbook)
      setChapters(data.chapters || [])
    } catch (error) {
      console.error('Error loading textbook:', error)
    } finally {
      setLoading(false)
    }
  }

  async function downloadPDF() {
    setDownloading(true)
    try {
      const response = await fetch(`/api/textbooks/${textbookId}/download`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to download PDF')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${textbook?.title || 'textbook'}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading PDF:', error)
      alert('Failed to download PDF. Please try again.')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-slate-600 dark:text-slate-300">Loading textbook...</p>
        </div>
      </div>
    )
  }

  if (!textbook || chapters.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Textbook Not Found
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mb-4">
            This textbook doesn&apos;t exist or hasn&apos;t been generated yet.
          </p>
          <button
            onClick={() => router.push('/textbooks')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Textbooks
          </button>
        </div>
      </div>
    )
  }

  const chapter = chapters[currentChapter]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/textbooks')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">{textbook.title}</h1>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {textbook.jlpt_level} • Chapter {currentChapter + 1} of {chapters.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Font Size Control */}
            <div className="flex items-center gap-2 mr-4">
              <button
                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                A-
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">{fontSize}px</span>
              <button
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-700 rounded hover:bg-slate-200 dark:hover:bg-slate-600"
              >
                A+
              </button>
            </div>

            {/* Download PDF Button */}
            <button
              onClick={downloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {downloading ? 'Downloading...' : 'Download PDF'}
            </button>

            {/* Sidebar Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Chapter List */}
        {showSidebar && (
          <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 min-h-[calc(100vh-73px)] p-4">
            <h2 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Chapters</h2>
            <nav className="space-y-1">
              {chapters.map((ch, idx) => (
                <button
                  key={ch.id}
                  onClick={() => setCurrentChapter(idx)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    idx === currentChapter
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="font-medium text-sm">
                    {ch.chapter_number}. {ch.title}
                  </div>
                </button>
              ))}
            </nav>
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <article
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 mb-8"
              style={{ fontSize: `${fontSize}px` }}
            >
              {/* Chapter Title */}
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                Chapter {chapter.chapter_number}: {chapter.title}
              </h1>

              {/* Introduction */}
              {chapter.introduction && (
                <div className="text-slate-600 dark:text-slate-300 mb-8 pb-8 border-b border-slate-200 dark:border-slate-700">
                  {chapter.introduction}
                </div>
              )}

              {/* Vocabulary Section */}
              {chapter.vocabulary && chapter.vocabulary.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    📝 Vocabulary
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chapter.vocabulary.map((vocab, idx: number) => (
                      <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                        <div className="font-bold text-lg text-slate-800 dark:text-white">
                          {vocab.word || vocab.japanese}
                        </div>
                        {showFurigana && vocab.reading && (
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {vocab.reading}
                          </div>
                        )}
                        <div className="text-slate-600 dark:text-slate-300 mt-1">
                          {vocab.meaning || vocab.english}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Grammar Section */}
              {chapter.grammar_points && chapter.grammar_points.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    📖 Grammar Points
                  </h2>
                  <div className="space-y-4">
                    {chapter.grammar_points.map((grammar, idx: number) => (
                      <div
                        key={idx}
                        className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600"
                      >
                        <div className="font-bold text-lg text-slate-800 dark:text-white mb-2">
                          {grammar.structure || grammar.pattern}
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 mb-2">
                          {grammar.meaning || grammar.explanation}
                        </div>
                        {grammar.example && (
                          <div className="mt-2 pl-4 border-l-2 border-slate-300 dark:border-slate-600">
                            <div className="text-slate-700 dark:text-slate-200">
                              {grammar.example}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Sections */}
              {chapter.sections && chapter.sections.length > 0 && (
                <section className="mb-8">
                  {(chapter.sections as Record<string, unknown>[]).map((section, idx) => {
                    const title = section.title as string | undefined
                    const content = (section.content || section.text) as string | undefined
                    return (
                      <div key={idx} className="mb-6">
                        {title && (
                          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                            {title}
                          </h3>
                        )}
                        <div className="text-slate-700 dark:text-slate-200 space-y-4">
                          {content || ''}
                        </div>
                      </div>
                    )
                  })}
                </section>
              )}

              {/* Exercises */}
              {chapter.exercises && chapter.exercises.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">
                    ✏️ Practice Exercises
                  </h2>
                  <div className="space-y-4">
                    {(chapter.exercises as Record<string, unknown>[]).map((exercise, idx) => {
                      const question = (exercise.question || exercise.prompt) as string | undefined
                      const options = exercise.options as string[] | undefined
                      return (
                        <div key={idx} className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="font-medium text-slate-800 dark:text-white mb-2">
                            {idx + 1}. {question || ''}
                          </div>
                          {options && (
                            <div className="space-y-1 ml-4">
                              {options.map((opt, oidx) => (
                                <div key={oidx} className="text-slate-600 dark:text-slate-300">
                                  {String.fromCharCode(97 + oidx)}. {opt}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </section>
              )}
            </article>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentChapter(Math.max(0, currentChapter - 1))}
                disabled={currentChapter === 0}
                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous Chapter
              </button>

              <span className="text-slate-600 dark:text-slate-300">
                Chapter {currentChapter + 1} of {chapters.length}
              </span>

              <button
                onClick={() => setCurrentChapter(Math.min(chapters.length - 1, currentChapter + 1))}
                disabled={currentChapter === chapters.length - 1}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Chapter
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
