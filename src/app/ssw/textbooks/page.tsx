'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SSW_SECTORS } from '@/lib/ssw/sectors-data'

export default function SSWTextbooksPage() {
  const [filter, setFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSectors = SSW_SECTORS.filter((sector) => {
    const matchesFilter = filter === 'all' || sector.difficulty === filter
    const matchesSearch =
      sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sector.nameJP.includes(searchQuery) ||
      sector.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 group">
                <span className="text-2xl">侍</span>
                <span className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Shinmen Takezo
                </span>
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/ssw"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                SSW
              </Link>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/ssw/generate"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                ✨ Generate
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              📚 SSW Textbook Library
            </h1>
            <p className="text-xl text-white/90 mb-6">
              Comprehensive Japanese training materials for all 14 SSW sectors
            </p>
            <div className="flex items-center justify-center gap-4">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl text-white font-semibold">
                500+ Pages per Textbook
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl text-white font-semibold">
                AI-Generated Content
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl text-white font-semibold">
                Workplace Focused
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search sectors, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
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

            {/* Difficulty Filters */}
            <div className="flex gap-2">
              {[
                { value: 'all' as const, label: 'All Levels', icon: '📚' },
                { value: 'beginner' as const, label: 'Beginner', icon: '🌱' },
                { value: 'intermediate' as const, label: 'Intermediate', icon: '📈' },
                { value: 'advanced' as const, label: 'Advanced', icon: '🎯' },
              ].map((item) => (
                <button
                  key={item.value}
                  onClick={() => setFilter(item.value)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                    filter === item.value
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-600'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
            Showing{' '}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              {filteredSectors.length}
            </span>{' '}
            of {SSW_SECTORS.length} textbooks
          </div>
        </div>
      </section>

      {/* Textbook Grid */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filteredSectors.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSectors.map((sector) => (
                <Link key={sector.id} href={`/ssw/sectors/${sector.id}`} className="group block">
                  <div className="relative h-full rounded-2xl overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-transparent">
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    ></div>

                    {/* Content */}
                    <div className="relative z-10 p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-white group-hover:to-white rounded-xl shadow-md transform group-hover:scale-110 transition-all duration-300">
                          <span className="text-3xl">{sector.icon}</span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            sector.difficulty === 'beginner'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : sector.difficulty === 'intermediate'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                                : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          } group-hover:bg-white/90 group-hover:text-gray-900 transition-colors duration-300`}
                        >
                          {sector.difficulty.toUpperCase()}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300 mb-2">
                        {sector.name}
                      </h3>

                      {/* Japanese Name */}
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300 mb-3 japanese-text">
                        {sector.nameJP}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white/80 transition-colors duration-300 mb-4 line-clamp-2">
                        {sector.description}
                      </p>

                      {/* Stats */}
                      <div className="flex gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 group-hover:bg-white/20 text-blue-700 dark:text-blue-300 group-hover:text-white rounded-lg text-xs font-semibold transition-colors duration-300">
                          📚 {sector.jlptLevel}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 group-hover:bg-white/20 text-purple-700 dark:text-purple-300 group-hover:text-white rounded-lg text-xs font-semibold transition-colors duration-300">
                          📄 500+ pages
                        </span>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-white font-semibold text-sm transition-colors duration-300">
                        <span>View Details</span>
                        <svg
                          className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
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
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                No textbooks found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-800 dark:to-emerald-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Need a Custom Textbook?</h2>
          <p className="text-xl text-white/90 mb-8">
            Generate a personalized SSW textbook tailored to your specific needs
          </p>
          <Link
            href="/ssw/generate"
            className="inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="text-2xl mr-2">✨</span>
            <span>Generate Custom Textbook</span>
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
