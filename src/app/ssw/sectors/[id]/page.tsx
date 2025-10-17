'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { getSectorById } from '@/lib/ssw/sectors-data'

export default function SectorDetailPage() {
  const params = useParams()
  const sectorId = params.id as string
  const sector = getSectorById(sectorId)

  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            ❌
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sector Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The sector you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/ssw"
            className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Back to SSW Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Liquid morphing blobs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full liquid-morph blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full liquid-morph blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
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
                <span className="text-gray-400">/</span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {sector.name}
                </span>
              </div>

              <div className="flex items-center gap-6">
                <Link
                  href="/ssw/textbooks"
                  className="group relative px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <span className="flex items-center gap-2">
                    <span className="transform group-hover:scale-110 transition-transform">📚</span>
                    All Textbooks
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
        <section
          className={`relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br ${sector.color} overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/20"></div>

          {/* Enhanced Background Pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-20">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id={`hero-pattern-${sector.id}`}
                  x="0"
                  y="0"
                  width="120"
                  height="120"
                  patternUnits="userSpaceOnUse"
                >
                  <g stroke="white" strokeWidth="2" fill="none" className="opacity-30">
                    <circle cx="60" cy="60" r="40" />
                    <circle cx="0" cy="60" r="40" />
                    <circle cx="120" cy="60" r="40" />
                    <circle cx="60" cy="0" r="40" />
                    <circle cx="60" cy="120" r="40" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#hero-pattern-${sector.id})`} />
            </svg>
          </div>

          {/* Floating elements */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10 text-2xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.5,
              }}
            >
              📚
            </motion.div>
          ))}

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
            >
              {/* Enhanced Icon */}
              <motion.div
                className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-3xl shadow-2xl mb-8"
                whileHover={{ scale: 1.1, rotate: [0, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                <motion.span
                  className="text-8xl"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  {sector.icon}
                </motion.span>
              </motion.div>

              {/* Enhanced Title */}
              <motion.h1
                className="text-5xl md:text-7xl font-bold text-white mb-4"
                whileHover={{ scale: 1.02 }}
              >
                {sector.name}
              </motion.h1>

              {/* Japanese Name */}
              <motion.p
                className="text-3xl md:text-4xl font-bold text-white/90 mb-6 japanese-text"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(255,255,255,0.3)',
                    '0 0 30px rgba(255,255,255,0.5)',
                    '0 0 20px rgba(255,255,255,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                {sector.nameJP}
              </motion.p>

              {/* Enhanced Description */}
              <motion.p
                className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {sector.description}
              </motion.p>

              {/* Enhanced Badges */}
              <motion.div
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.span
                  className={`px-6 py-3 rounded-full text-sm font-bold shadow-lg backdrop-blur-sm ${
                    sector.difficulty === 'beginner'
                      ? 'bg-green-500/90 text-white border border-green-400'
                      : sector.difficulty === 'intermediate'
                        ? 'bg-yellow-500/90 text-white border border-yellow-400'
                        : 'bg-red-500/90 text-white border border-red-400'
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  {sector.difficulty.toUpperCase()} LEVEL
                </motion.span>
                <motion.span
                  className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full text-white font-semibold text-sm border border-white/30 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  📚 {sector.jlptLevel}
                </motion.span>
                <motion.span
                  className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-full text-white font-semibold text-sm border border-white/30 shadow-lg"
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  👥 {sector.workers} Workers
                </motion.span>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Content Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Quick Info Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              <motion.div
                className="glass-morphism-enhanced rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:scale-105 transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  📚
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">JLPT Level</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                  {sector.jlptLevel}
                </p>
                <div className="mt-4 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
              </motion.div>

              <motion.div
                className="glass-morphism-enhanced rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:scale-105 transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  👥
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Workforce</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium">
                  {sector.workers} Workers
                </p>
                <div className="mt-4 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
              </motion.div>

              <motion.div
                className="glass-morphism-enhanced rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl hover:scale-105 transition-all duration-300"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="text-5xl mb-4"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                >
                  🎯
                </motion.div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Difficulty</h3>
                <p className="text-lg text-gray-700 dark:text-gray-300 font-medium capitalize">
                  {sector.difficulty}
                </p>
                <div className="mt-4 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
              </motion.div>
            </motion.div>

            {/* Categories and Keywords */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* Categories */}
              <motion.div
                className="glass-morphism-enhanced rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl"
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🏷️</span>
                  Categories
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sector.categories.map((category, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold text-sm shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {category}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Keywords */}
              <motion.div
                className="glass-morphism-enhanced rounded-3xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-xl"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">🔑</span>
                  Keywords
                </h3>
                <div className="flex flex-wrap gap-3">
                  {sector.keywords.map((keyword, index) => (
                    <motion.span
                      key={index}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-sm shadow-lg"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {keyword}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* CTA Section */}
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Master {sector.name}?
              </h3>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Generate a comprehensive 500-page textbook tailored specifically for the{' '}
                {sector.nameJP} sector
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/ssw/generate"
                  className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600"
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
                    <span>Generate Textbook</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </span>
                </Link>

                <Link
                  href="/ssw/textbooks"
                  className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 font-bold rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Browse All Sectors
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
