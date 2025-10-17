'use client'

import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'
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
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Liquid morphing blobs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full liquid-morph blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full liquid-morph blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Japanese pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="textbooks-wave"
                x="0"
                y="0"
                width="140"
                height="70"
                patternUnits="userSpaceOnUse"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-blue-800 dark:text-blue-400"
                >
                  <path d="M0,35 Q17.5,15 35,35 T70,35" />
                  <path d="M35,35 Q52.5,15 70,35 T105,35" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#textbooks-wave)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10">
        {/* Enhanced Navigation Bar */}
        <nav className="sticky top-0 z-40 glass-morphism-enhanced border-b border-blue-800/20 dark:border-blue-400/20 shadow-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2 group">
                  <div className="relative">
                    <span className="text-2xl japanese-text text-red-700 dark:text-red-400 liquid-text-morph">
                      侍
                    </span>
                    <div className="absolute inset-0 bg-red-600/30 dark:bg-red-400/30 blur-xl rounded-full"></div>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
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
                  className="group relative px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <span className="flex items-center gap-2">
                    <span className="transform group-hover:scale-110 transition-transform">✨</span>
                    Generate
                  </span>
                </Link>
                <Link
                  href="/dashboard"
                  className="group relative px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    Dashboard
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Enhanced Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Floating kanji background */}
          <motion.div
            className="absolute top-10 right-10 text-[12rem] japanese-text text-beni-red/5 dark:text-beni-red/10 pointer-events-none select-none font-black"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
          >
            書
          </motion.div>

          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              <motion.h1
                className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 flex items-center justify-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.span
                  className="japanese-text text-6xl sm:text-7xl md:text-8xl liquid-gradient-text bg-gradient-to-r from-red-600 via-amber-600 to-pink-600 bg-clip-text text-transparent"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(220, 38, 38, 0.3)',
                      '0 0 30px rgba(217, 119, 6, 0.4)',
                      '0 0 20px rgba(219, 39, 119, 0.3)',
                    ],
                  }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  📚
                </motion.span>
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
                  SSW Textbook Library
                </span>
              </motion.h1>

              <motion.p
                className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Comprehensive{' '}
                <span className="japanese-text font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-cyan-600 to-purple-600 dark:from-blue-400 dark:via-cyan-400 dark:to-purple-400">
                  日本語
                </span>{' '}
                training materials for all 14 SSW sectors
              </motion.p>

              {/* Enhanced Feature Pills */}
              <motion.div
                className="flex flex-wrap items-center justify-center gap-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {[
                  {
                    icon: '📖',
                    text: '500+ Pages per Textbook',
                    color: 'from-indigo-600 to-blue-700',
                  },
                  {
                    icon: '🤖',
                    text: 'AI-Generated Content',
                    color: 'from-purple-600 to-pink-700',
                  },
                  { icon: '💼', text: 'Workplace Focused', color: 'from-emerald-600 to-green-700' },
                  { icon: '🎯', text: 'JLPT Aligned', color: 'from-red-600 to-orange-700' },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                  >
                    <div
                      className={`relative px-6 py-3 rounded-2xl bg-gradient-to-r ${feature.color} text-white font-semibold shadow-lg transform transition-all duration-300`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl"></div>
                      <span className="relative flex items-center gap-2">
                        <span className="text-xl transform group-hover:scale-110 transition-transform">
                          {feature.icon}
                        </span>
                        {feature.text}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Animated divider */}
              <motion.div
                className="flex items-center justify-center gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <motion.div
                  className="h-px w-32 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                />
                <motion.img
                  src="/icons/sakura.svg"
                  alt="Sakura"
                  className="w-10 h-10"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <motion.div
                  className="h-px w-32 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Filters and Search */}
        <section className="relative py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="glass-morphism-enhanced rounded-3xl p-6 border border-blue-800/20 dark:border-blue-400/20 shadow-2xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
                {/* Enhanced Search Bar */}
                <div className="relative flex-1 max-w-lg w-full">
                  <motion.div className="relative" whileFocus={{ scale: 1.02 }}>
                    <input
                      type="text"
                      placeholder="Search sectors, keywords, or Japanese terms..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-6 py-4 pl-14 rounded-2xl border-2 border-blue-200 dark:border-blue-800 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 shadow-lg"
                    />
                    <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
                      <motion.svg
                        className="w-6 h-6 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        animate={{ rotate: searchQuery ? [0, 360] : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </motion.svg>
                    </div>
                    {searchQuery && (
                      <motion.button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </motion.button>
                    )}
                  </motion.div>
                </div>

                {/* Enhanced Difficulty Filters */}
                <div className="flex flex-wrap gap-3">
                  {[
                    {
                      value: 'all' as const,
                      label: 'All Levels',
                      icon: '📚',
                      color: 'from-gray-600 to-slate-700',
                    },
                    {
                      value: 'beginner' as const,
                      label: 'Beginner',
                      icon: '🌱',
                      color: 'from-emerald-600 to-green-700',
                    },
                    {
                      value: 'intermediate' as const,
                      label: 'Intermediate',
                      icon: '📈',
                      color: 'from-amber-600 to-orange-700',
                    },
                    {
                      value: 'advanced' as const,
                      label: 'Advanced',
                      icon: '🎯',
                      color: 'from-red-600 to-pink-700',
                    },
                  ].map((item, index) => (
                    <motion.button
                      key={item.value}
                      onClick={() => setFilter(item.value)}
                      className={`relative px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden ${
                        filter === item.value
                          ? 'text-white shadow-xl scale-105'
                          : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-600'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {filter === item.value && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.color}`}
                          layoutId="activeFilter"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative flex items-center gap-2">
                        <motion.span
                          className="text-lg"
                          animate={{ rotate: filter === item.value ? [0, 360] : 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.icon}
                        </motion.span>
                        {item.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Enhanced Results Count */}
              <motion.div
                className="mt-6 flex items-center justify-between"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Showing{' '}
                  <motion.span
                    className="font-bold text-blue-600 dark:text-blue-400"
                    key={filteredSectors.length}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                  >
                    {filteredSectors.length}
                  </motion.span>{' '}
                  of {SSW_SECTORS.length} textbooks
                </div>

                {searchQuery && (
                  <motion.button
                    onClick={() => setSearchQuery('')}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Clear search
                  </motion.button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Textbook Grid */}
        <section className="relative py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {filteredSectors.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {filteredSectors.map((sector, index) => (
                  <motion.div
                    key={sector.id}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <Link href={`/ssw/sectors/${sector.id}`} className="group block h-full">
                      <div className="relative h-full rounded-3xl overflow-hidden glass-morphism-enhanced border-2 border-gray-200 dark:border-gray-700 shadow-2xl transition-all duration-500 hover:scale-[1.03] hover:shadow-3xl hover:border-transparent premium-card">
                        {/* Animated Gradient Background */}
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                          initial={false}
                          animate={{ opacity: 0 }}
                          whileHover={{ opacity: 0.9 }}
                        />

                        {/* Floating Pattern */}
                        <div className="absolute inset-0 opacity-5 dark:opacity-10">
                          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                              <pattern
                                id={`pattern-${sector.id}`}
                                x="0"
                                y="0"
                                width="40"
                                height="40"
                                patternUnits="userSpaceOnUse"
                              >
                                <circle
                                  cx="20"
                                  cy="20"
                                  r="15"
                                  stroke="currentColor"
                                  strokeWidth="1"
                                  fill="none"
                                  className="text-gray-600 dark:text-gray-400"
                                />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#pattern-${sector.id})`} />
                          </svg>
                        </div>

                        {/* Content */}
                        <div className="relative z-10 p-6">
                          {/* Enhanced Header */}
                          <div className="flex items-start justify-between mb-4">
                            <motion.div
                              className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-white group-hover:to-white rounded-2xl shadow-lg transform transition-all duration-300"
                              whileHover={{ scale: 1.1, rotate: [0, 5, 0] }}
                            >
                              <motion.span
                                className="text-3xl"
                                animate={{ rotate: [0, 10, 0] }}
                                transition={{ duration: 4, repeat: Infinity, delay: index * 0.2 }}
                              >
                                {sector.icon}
                              </motion.span>
                            </motion.div>

                            <motion.span
                              className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                                sector.difficulty === 'beginner'
                                  ? 'bg-green-500/20 text-green-700 dark:text-green-300 border border-green-500/30'
                                  : sector.difficulty === 'intermediate'
                                    ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border border-yellow-500/30'
                                    : 'bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30'
                              } group-hover:bg-white/90 group-hover:text-gray-900 transition-all duration-300`}
                              whileHover={{ scale: 1.1 }}
                            >
                              {sector.difficulty.toUpperCase()}
                            </motion.span>
                          </div>

                          {/* Enhanced Title */}
                          <motion.h3
                            className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300 mb-2 japanese-text"
                            whileHover={{ x: 5 }}
                          >
                            {sector.name}
                          </motion.h3>

                          {/* Japanese Name */}
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300 mb-3 japanese-text">
                            {sector.nameJP}
                          </p>

                          {/* Enhanced Description */}
                          <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white/80 transition-colors duration-300 mb-4 line-clamp-3">
                            {sector.description}
                          </p>

                          {/* Enhanced Stats */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            <motion.span
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-indigo-500/20 to-blue-600/20 group-hover:from-indigo-500/30 group-hover:to-blue-600/30 text-indigo-700 dark:text-indigo-300 group-hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 backdrop-blur-sm"
                              whileHover={{ scale: 1.05 }}
                            >
                              📚 {sector.jlptLevel}
                            </motion.span>
                            <motion.span
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-600/20 group-hover:from-purple-500/30 group-hover:to-pink-600/30 text-purple-700 dark:text-purple-300 group-hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 backdrop-blur-sm"
                              whileHover={{ scale: 1.05 }}
                            >
                              📄 500+ pages
                            </motion.span>
                            <motion.span
                              className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-600/20 group-hover:from-green-500/30 group-hover:to-emerald-600/30 text-green-700 dark:text-green-300 group-hover:text-white rounded-xl text-xs font-semibold transition-all duration-300 backdrop-blur-sm"
                              whileHover={{ scale: 1.05 }}
                            >
                              👥 {sector.workers}
                            </motion.span>
                          </div>

                          {/* Enhanced Action */}
                          <motion.div
                            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-white font-semibold text-sm transition-all duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <span>View Details</span>
                            <motion.svg
                              className="w-4 h-4"
                              animate={{ x: [0, 3, 0] }}
                              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
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
                            </motion.svg>
                          </motion.div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🔍
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No textbooks found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Try adjusting your search or filters
                </p>
                <motion.button
                  onClick={() => {
                    setSearchQuery('')
                    setFilter('all')
                  }}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Filters
                </motion.button>
              </motion.div>
            )}
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-amber-600 dark:from-red-800 dark:to-amber-800">
            <div className="absolute inset-0 bg-black/20"></div>
            {/* Floating elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-white/10"
                style={{
                  left: `${i * 20}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 10 + i * 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.5,
                }}
              >
                📚
              </motion.div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2
                className="text-4xl md:text-5xl font-bold text-white mb-6"
                whileHover={{ scale: 1.02 }}
              >
                Need a Custom Textbook?
              </motion.h2>
              <motion.p
                className="text-xl text-white/90 mb-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
              >
                Generate a personalized SSW textbook tailored to your specific needs and learning
                goals
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row items-center justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Link
                  href="/ssw/generate"
                  className="group relative inline-flex items-center px-8 py-4 bg-white text-green-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                  <span className="relative flex items-center gap-3">
                    <motion.span
                      className="text-2xl"
                      animate={{ rotate: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      ✨
                    </motion.span>
                    <span>Generate Custom Textbook</span>
                    <motion.svg
                      className="w-5 h-5"
                      animate={{ x: [0, 3, 0] }}
                      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </motion.svg>
                  </span>
                </Link>

                <Link
                  href="/ssw"
                  className="px-8 py-4 bg-white/20 backdrop-blur-xl text-white font-bold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all duration-300"
                >
                  Browse All Sectors
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
