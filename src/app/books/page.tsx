'use client'

import Link from 'next/link'
import { useState } from 'react'
import CalligraphyDivider from '@/components/japanese/CalligraphyDivider'
import JapaneseCard from '@/components/japanese/JapaneseCard'
import SakuraPetals from '@/components/japanese/SakuraPetals'
import SectionHeader from '@/components/navigation/SectionHeader'

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  jlptLevel: number
  pages: number
  progress: number
  description: string
  category: string
  isAIGenerated: boolean
  createdAt: string
}

export default function BooksPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Sample books data (replace with actual API call)
  const sampleBooks: Book[] = [
    {
      id: '1',
      title: 'Daily Conversations in Japanese',
      author: 'AI Generated',
      coverImage: '/books/cover1.jpg',
      jlptLevel: 5,
      pages: 150,
      progress: 45,
      description: 'Learn essential daily conversation phrases and expressions for beginners',
      category: 'conversation',
      isAIGenerated: true,
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Business Japanese Mastery',
      author: 'AI Generated',
      coverImage: '/books/cover2.jpg',
      jlptLevel: 2,
      pages: 280,
      progress: 12,
      description: 'Professional Japanese for the workplace and business settings',
      category: 'business',
      isAIGenerated: true,
      createdAt: '2024-01-20',
    },
    {
      id: '3',
      title: 'Anime & Manga Japanese',
      author: 'AI Generated',
      coverImage: '/books/cover3.jpg',
      jlptLevel: 4,
      pages: 200,
      progress: 78,
      description: 'Understanding Japanese through popular anime and manga expressions',
      category: 'culture',
      isAIGenerated: true,
      createdAt: '2024-01-10',
    },
  ]

  const categories = [
    { id: 'all', name: 'All Books', icon: '📚' },
    { id: 'conversation', name: 'Conversation', icon: '💬' },
    { id: 'grammar', name: 'Grammar', icon: '📖' },
    { id: 'business', name: 'Business', icon: '💼' },
    { id: 'culture', name: 'Culture', icon: '🎎' },
    { id: 'ai-generated', name: 'AI Generated', icon: '🤖' },
  ]

  const jlptLevels = [
    { value: 'all', label: 'All Levels' },
    { value: '5', label: 'N5' },
    { value: '4', label: 'N4' },
    { value: '3', label: 'N3' },
    { value: '2', label: 'N2' },
    { value: '1', label: 'N1' },
  ]

  return (
    <div className="min-h-screen relative">
      {/* Floating Sakura Petals */}
      <SakuraPetals count={10} />

      {/* Enhanced Header with Back Button */}
      <SectionHeader
        title="Japanese Books Library"
        titleJP="図書館"
        subtitle="Explore and create AI-powered Japanese textbooks"
        icon="📚"
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        gradient="from-purple-600 to-pink-600"
      >
        <Link
          href="/textbooks/generate"
          className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate New Book
        </Link>
      </SectionHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7 relative z-10">
        {/* Mobile Generate Button */}
        <Link
          href="/textbooks/generate"
          className="sm:hidden w-full flex items-center justify-center gap-2 px-4 py-3 mb-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Generate New Book with AI
        </Link>

        {/* Search and Filters */}
        <div className="mb-7 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books by title, topic, or description..."
              className="w-full p-3 sm:p-4 pr-11 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-500 dark:focus:border-purple-400 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all focus:outline-none focus:ring-4 focus:ring-purple-100 dark:focus:ring-purple-900/50 shadow-lg text-sm sm:text-base"
            />
            <svg
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>

          {/* JLPT Level Filter */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {jlptLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => setSelectedLevel(level.value)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  selectedLevel === level.value
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-2 border-purple-500'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-transparent hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Books Grid with Japanese Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-7">
          {sampleBooks.map((book, index) => (
            <div key={book.id} className={`group animate-slide-up stagger-${(index % 3) + 1}`}>
              <JapaneseCard
                pattern="seigaiha"
                className="relative h-full transition-all hover:scale-105 overflow-hidden"
              >
                {/* Book Cover with Japanese Design */}
                <div className="relative h-52 bg-gradient-to-br from-[#E8DCC4] via-[#FFB7C5] to-[#DAA520]/30 dark:from-gray-800 dark:via-[#FF8FAB]/20 dark:to-[#DAA520]/10">
                  <div className="absolute inset-0 shoji-pattern opacity-30"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-6xl mb-2">📖</div>
                    <span className="japanese-text text-3xl font-bold text-gray-700 dark:text-gray-300 opacity-50">
                      {['本', '書', '学', '道'][index % 4]}
                    </span>
                  </div>
                  {book.isAIGenerated && (
                    <div className="absolute top-3 right-3 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg text-xs font-bold shadow-lg">
                      🤖 AI
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2 py-1 bg-white dark:bg-gray-900 rounded-lg text-xs font-bold text-gray-900 dark:text-white shadow-lg">
                    N{book.jlptLevel}
                  </div>
                </div>

                {/* Book Info */}
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">by {book.author}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                    {book.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{book.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
                        style={{ width: `${book.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/books/${book.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                    >
                      {book.progress > 0 ? 'Continue' : 'Start Reading'}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {book.pages} pages
                    </span>
                  </div>
                </div>
              </JapaneseCard>
            </div>
          ))}
        </div>

        {/* Calligraphy Divider */}
        <CalligraphyDivider kanji="統" />

        {/* Stats Section with Japanese Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <JapaneseCard pattern="shippo" className="p-6">
            <div className="text-5xl mb-3">📚</div>
            <div className="text-4xl font-bold stat-value mb-1">3</div>
            <div className="stat-label">Books in Library</div>
          </JapaneseCard>
          <JapaneseCard pattern="shippo" className="p-6">
            <div className="text-5xl mb-3">⚡</div>
            <div className="text-4xl font-bold stat-value mb-1">45%</div>
            <div className="stat-label">Average Progress</div>
          </JapaneseCard>
          <JapaneseCard pattern="shippo" className="p-6">
            <div className="text-5xl mb-3">🎯</div>
            <div className="text-4xl font-bold stat-value mb-1">125</div>
            <div className="stat-label">Pages Read</div>
          </JapaneseCard>
        </div>
      </div>
    </div>
  )
}
