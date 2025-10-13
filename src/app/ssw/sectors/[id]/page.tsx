'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getSectorById } from '@/lib/ssw/sectors-data'

export default function SectorDetailPage() {
  const params = useParams()
  const sectorId = params.id as string
  const sector = getSectorById(sectorId)

  if (!sector) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-950">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sector Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The sector you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/ssw"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Back to SSW Home
          </Link>
        </div>
      </div>
    )
  }

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
              <span className="text-gray-400">/</span>
              <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                {sector.name}
              </span>
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="/ssw/textbooks"
                className="text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                📚 All Textbooks
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

      {/* Hero Section */}
      <section className={`relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br ${sector.color}`}>
        <div className="absolute inset-0 bg-black/10"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern
              id={`hero-pattern-${sector.id}`}
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="40" cy="40" r="30" stroke="white" strokeWidth="2" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#hero-pattern-${sector.id})`} />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-28 h-28 bg-white rounded-3xl shadow-2xl mb-6 transform hover:scale-110 transition-all duration-300">
            <span className="text-7xl">{sector.icon}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">{sector.name}</h1>

          {/* Japanese Name */}
          <p className="text-3xl font-bold text-white/90 mb-6 japanese-text">{sector.nameJP}</p>

          {/* Description */}
          <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">{sector.description}</p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <span
              className={`px-4 py-2 rounded-full text-sm font-bold ${
                sector.difficulty === 'beginner'
                  ? 'bg-green-600 text-white'
                  : sector.difficulty === 'intermediate'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-red-600 text-white'
              }`}
            >
              {sector.difficulty.toUpperCase()} LEVEL
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full text-white font-semibold text-sm">
              📚 {sector.jlptLevel}
            </span>
            <span className="px-4 py-2 bg-white/20 backdrop-blur-xl rounded-full text-white font-semibold text-sm">
              👥 {sector.workers} Workers
            </span>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-4xl mb-3">📚</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">JLPT Level</h3>
              <p className="text-gray-700 dark:text-gray-300">{sector.jlptLevel}</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-4xl mb-3">👥</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                Total Workers
              </h3>
              <p className="text-gray-700 dark:text-gray-300">{sector.workers}</p>
            </div>

            <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Difficulty</h3>
              <p className="text-gray-700 dark:text-gray-300 capitalize">{sector.difficulty}</p>
            </div>
          </div>

          {/* Categories */}
          <div className="mb-12 p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🏷️</span>
              Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              {sector.categories.map((cat) => (
                <span
                  key={cat}
                  className={`px-4 py-2 bg-gradient-to-r ${sector.color} text-white rounded-xl font-semibold shadow-md`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div className="mb-12 p-8 bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span>🔑</span>
              Key Topics & Vocabulary
            </h2>
            <div className="flex flex-wrap gap-2">
              {sector.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg text-sm font-medium"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Textbook Content Preview */}
          <div className="mb-12 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <span>📖</span>
              What&apos;s Inside the Textbook
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Foundation (100 pages)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Sector overview, essential grammar, keigo, safety vocabulary, and workplace
                    culture
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-600 text-white rounded-lg flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Core Vocabulary (150 pages)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    1000+ sector-specific terms, equipment, operations, technical terminology, and
                    safety compliance
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Practical Skills (150 pages)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    50+ real workplace dialogues, procedures, problem-solving, team communication
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Advanced Topics (80 pages)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    Industry regulations, quality control, career development, and sector innovation
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-pink-600 text-white rounded-lg flex items-center justify-center font-bold">
                  5
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Test Preparation (20 pages)
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 text-sm">
                    SSW skills test preparation guide and practice materials
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/ssw/generate"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl mr-2">✨</span>
              <span>Generate This Textbook</span>
            </Link>

            <Link
              href="/ssw/textbooks"
              className="inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-gray-300 dark:border-gray-600 transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl mr-2">📚</span>
              <span>View All Textbooks</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
