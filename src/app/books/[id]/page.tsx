'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface Chapter {
  id: string
  number: number
  title: string
  content: string
  vocabulary: Array<{ word: string; reading: string; meaning: string }>
  grammar: Array<{ point: string; explanation: string; example: string }>
}

export default function BookReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null)
  const _router = useRouter()
  const [currentChapter, setCurrentChapter] = useState(0)
  const [showVocabulary, setShowVocabulary] = useState(false)
  const [showGrammar, setShowGrammar] = useState(false)
  const [fontSize, setFontSize] = useState(16)

  useEffect(() => {
    params.then(setResolvedParams)
  }, [params])

  if (!resolvedParams) {
    return <div>Loading...</div>
  }

  // Sample book data (replace with actual API call)
  const book = {
    id: params.id,
    title: 'Daily Conversations in Japanese',
    author: 'AI Generated',
    jlptLevel: 5,
    totalChapters: 10,
    chapters: [
      {
        id: '1',
        number: 1,
        title: 'Greetings and Introductions',
        content: `
# Chapter 1: Greetings and Introductions

こんにちは (Konnichiwa)! Welcome to your Japanese learning journey!

## Basic Greetings

Learning how to greet people is essential in Japanese culture. Let's start with the most common greetings:

**おはようございます (Ohayou gozaimasu)** - Good morning
This is the polite way to say good morning. You can use "おはよう" (ohayou) with close friends and family.

**こんにちは (Konnichiwa)** - Hello / Good afternoon
This is used during the daytime, typically from late morning until evening.

**こんばんは (Konbanwa)** - Good evening
Use this greeting when meeting someone in the evening.

**おやすみなさい (Oyasumi nasai)** - Good night
This is said before going to bed or when parting in the evening.

## Self-Introduction

When meeting someone for the first time, you&apos;ll want to introduce yourself:

**はじめまして (Hajimemashite)** - Nice to meet you (first time)

**私は [name] です (Watashi wa [name] desu)** - I am [name]

**どうぞよろしくお願いします (Douzo yoroshiku onegaishimasu)** - Please treat me well

## Example Conversation

A: おはようございます。
B: おはようございます。

A: はじめまして。私は田中です。
B: はじめまして。私はスミスです。

A: どうぞよろしくお願いします。
B: こちらこそ、よろしくお願いします。

## Practice

Try introducing yourself in Japanese! Think about:
- What time of day it is (choose appropriate greeting)
- Your name
- Where you&apos;re from
- Your interests

Remember, practice makes perfect! 頑張って (ganbatte) - Do your best!
        `,
        vocabulary: [
          { word: 'おはよう', reading: 'ohayou', meaning: 'good morning' },
          { word: 'こんにちは', reading: 'konnichiwa', meaning: 'hello' },
          { word: 'こんばんは', reading: 'konbanwa', meaning: 'good evening' },
          { word: 'はじめまして', reading: 'hajimemashite', meaning: 'nice to meet you' },
          { word: '私', reading: 'watashi', meaning: 'I, me' },
        ],
        grammar: [
          {
            point: '～は～です',
            explanation: 'This is the basic sentence pattern for identifying something or someone.',
            example: '私は学生です (I am a student)',
          },
          {
            point: 'Honorific Expressions',
            explanation: 'Adding ございます makes expressions more polite and formal.',
            example: 'おはよう → おはようございます',
          },
        ],
      },
    ],
  }

  const currentChapterData = book.chapters[currentChapter]
  const progress = ((currentChapter + 1) / book.totalChapters) * 100

  const handleNextChapter = () => {
    if (currentChapter < book.totalChapters - 1) {
      setCurrentChapter(currentChapter + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b-2 border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/books"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="hidden sm:inline font-medium">Back to Library</span>
            </Link>

            <div className="flex items-center gap-3">
              {/* Font Size Control */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl p-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Decrease font size"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 12H4"
                    />
                  </svg>
                </button>
                <span className="text-xs font-medium w-6 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Increase font size"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </button>
              </div>

              {/* Bookmark */}
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
              <span>{book.title}</span>
              <span>
                Chapter {currentChapterData.number} of {book.totalChapters}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-7">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            {/* Vocabulary Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowVocabulary(!showVocabulary)}
                className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-colors"
              >
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">📝</span>
                  Vocabulary
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${showVocabulary ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showVocabulary && (
                <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                  {currentChapterData.vocabulary.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="japanese-text text-lg font-bold text-gray-900 dark:text-white">
                        {item.word}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {item.reading}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                        {item.meaning}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Grammar Panel */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={() => setShowGrammar(!showGrammar)}
                className="w-full p-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 transition-colors"
              >
                <span className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="text-xl">📚</span>
                  Grammar
                </span>
                <svg
                  className={`w-5 h-5 transition-transform ${showGrammar ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showGrammar && (
                <div className="p-4 space-y-4 max-h-80 overflow-y-auto">
                  {currentChapterData.grammar.map((item, index) => (
                    <div key={index} className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {item.point}
                      </div>
                      <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        {item.explanation}
                      </div>
                      <div className="text-sm japanese-text text-gray-600 dark:text-gray-400 italic">
                        例: {item.example}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Book Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-700 p-6 sm:p-8 min-h-[600px]">
              {/* Chapter Title */}
              <div className="mb-6 pb-6 border-b-2 border-gray-200 dark:border-gray-700">
                <div className="inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-semibold mb-3">
                  Chapter {currentChapterData.number}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentChapterData.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                    JLPT N{book.jlptLevel}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    ~15 min read
                  </span>
                </div>
              </div>

              {/* Chapter Content */}
              <div
                className="prose prose-lg dark:prose-invert max-w-none japanese-text"
                style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
                dangerouslySetInnerHTML={{
                  __html: currentChapterData.content
                    .split('\n')
                    .map((line) => {
                      if (line.startsWith('# '))
                        return `<h1 class="text-2xl font-bold mb-4 mt-6">${line.slice(2)}</h1>`
                      if (line.startsWith('## '))
                        return `<h2 class="text-xl font-bold mb-3 mt-5">${line.slice(3)}</h2>`
                      if (line.startsWith('**') && line.endsWith('**')) {
                        const parts = line.split('**')
                        return `<p class="mb-3"><strong class="text-purple-600 dark:text-purple-400">${parts[1]}</strong> ${parts[2] || ''}</p>`
                      }
                      if (line.trim() === '') return '<br/>'
                      return `<p class="mb-3 text-gray-700 dark:text-gray-300">${line}</p>`
                    })
                    .join(''),
                }}
              />
            </div>

            {/* Navigation Buttons */}
            <div className="mt-6 flex items-center justify-between">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapter === 0}
                className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:border-purple-500 dark:hover:border-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Previous Chapter</span>
                <span className="sm:hidden">Previous</span>
              </button>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {currentChapter + 1} / {book.totalChapters}
              </div>

              <button
                onClick={handleNextChapter}
                disabled={currentChapter === book.totalChapters - 1}
                className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Next Chapter</span>
                <span className="sm:hidden">Next</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
