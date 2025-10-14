'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

interface Lesson {
  id: number
  title: string
  description: string
  level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
  category: 'grammar' | 'vocabulary' | 'kanji' | 'reading' | 'listening'
  duration: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  completed: boolean
  progress: number
  icon: string
  locked: boolean
}

export default function LessonsPage() {
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const lessons: Lesson[] = [
    {
      id: 1,
      title: 'Hiragana Basics',
      description: 'Master the foundational Japanese writing system',
      level: 'N5',
      category: 'reading',
      duration: 30,
      difficulty: 'beginner',
      completed: true,
      progress: 100,
      icon: 'あ',
      locked: false,
    },
    {
      id: 2,
      title: 'Katakana Mastery',
      description: 'Learn to read and write katakana characters',
      level: 'N5',
      category: 'reading',
      duration: 30,
      difficulty: 'beginner',
      completed: true,
      progress: 100,
      icon: 'ア',
      locked: false,
    },
    {
      id: 3,
      title: 'Basic Greetings',
      description: 'Common phrases for everyday conversation',
      level: 'N5',
      category: 'vocabulary',
      duration: 20,
      difficulty: 'beginner',
      completed: false,
      progress: 60,
      icon: '👋',
      locked: false,
    },
    {
      id: 4,
      title: 'Particles は & が',
      description: 'Understanding topic and subject particles',
      level: 'N4',
      category: 'grammar',
      duration: 45,
      difficulty: 'intermediate',
      completed: false,
      progress: 30,
      icon: '⚡',
      locked: false,
    },
    {
      id: 5,
      title: 'N3 Kanji: Part 1',
      description: 'First 100 kanji characters for N3 level',
      level: 'N3',
      category: 'kanji',
      duration: 60,
      difficulty: 'intermediate',
      completed: false,
      progress: 0,
      icon: '漢',
      locked: false,
    },
    {
      id: 6,
      title: 'Business Japanese',
      description: 'Polite expressions for professional settings',
      level: 'N2',
      category: 'vocabulary',
      duration: 50,
      difficulty: 'advanced',
      completed: false,
      progress: 0,
      icon: '💼',
      locked: true,
    },
    {
      id: 7,
      title: 'Advanced Grammar Patterns',
      description: 'Complex sentence structures for N1',
      level: 'N1',
      category: 'grammar',
      duration: 90,
      difficulty: 'advanced',
      completed: false,
      progress: 0,
      icon: '📖',
      locked: true,
    },
    {
      id: 8,
      title: 'Listening Comprehension',
      description: 'Practice understanding natural conversation',
      level: 'N3',
      category: 'listening',
      duration: 40,
      difficulty: 'intermediate',
      completed: false,
      progress: 0,
      icon: '🎧',
      locked: false,
    },
  ]

  const levels = ['all', 'N5', 'N4', 'N3', 'N2', 'N1']
  const categories = ['all', 'grammar', 'vocabulary', 'kanji', 'reading', 'listening']

  const filteredLessons = lessons.filter((lesson) => {
    const levelMatch = selectedLevel === 'all' || lesson.level === selectedLevel
    const categoryMatch = selectedCategory === 'all' || lesson.category === selectedCategory
    return levelMatch && categoryMatch
  })

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'N5':
        return 'from-green-500 to-emerald-600'
      case 'N4':
        return 'from-blue-500 to-cyan-600'
      case 'N3':
        return 'from-purple-500 to-pink-600'
      case 'N2':
        return 'from-orange-500 to-red-600'
      case 'N1':
        return 'from-red-500 to-rose-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'grammar':
        return '📖'
      case 'vocabulary':
        return '✨'
      case 'kanji':
        return '漢'
      case 'reading':
        return '📚'
      case 'listening':
        return '🎧'
      default:
        return '📝'
    }
  }

  const completedCount = lessons.filter((l) => l.completed).length
  const totalCount = lessons.length
  const overallProgress = (completedCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl shadow-xl">
              📚
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-2">
                Japanese Lessons
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Master Japanese with structured lessons •{' '}
                <span className="japanese-text text-blue-600">勉強</span>
              </p>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Overall Progress
                </span>
                <span className="text-3xl">📊</span>
              </div>
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {Math.round(overallProgress)}%
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${overallProgress}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"
                />
              </div>
            </div>

            <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Completed
                </span>
                <span className="text-3xl">✅</span>
              </div>
              <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {completedCount}/{totalCount}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">lessons finished</div>
            </div>

            <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  Study Time
                </span>
                <span className="text-3xl">⏱️</span>
              </div>
              <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                12.5h
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">total hours</div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            {/* Level Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                JLPT Level
              </h3>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                      selectedLevel === level
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-105'
                    }`}
                  >
                    {level === 'all' ? 'All Levels' : level}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:scale-105'
                    }`}
                  >
                    <span>{category === 'all' ? '🌟' : getCategoryIcon(category)}</span>
                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group"
            >
              <Link href={lesson.locked ? '#' : `/lessons/${lesson.id}`}>
                <div
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                    lesson.locked
                      ? 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 cursor-not-allowed'
                      : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 hover:scale-105'
                  }`}
                >
                  {/* Locked Overlay */}
                  {lesson.locked && (
                    <div className="absolute inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center z-10">
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 text-gray-400 mx-auto mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                        <p className="text-sm font-bold text-gray-400">Complete previous lessons</p>
                      </div>
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getLevelColor(
                      lesson.level
                    )} flex items-center justify-center text-3xl shadow-lg mb-4 ${
                      !lesson.locked && 'group-hover:scale-110 group-hover:rotate-6'
                    } transition-all duration-300`}
                  >
                    {lesson.icon}
                  </div>

                  {/* Content */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-black bg-gradient-to-r ${getLevelColor(
                          lesson.level
                        )} text-white`}
                      >
                        {lesson.level}
                      </span>
                      <span className="px-2 py-1 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                        {lesson.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      {lesson.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {lesson.description}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <span>⏱️</span>
                        <span>{lesson.duration} min</span>
                      </div>
                      <span>•</span>
                      <div className="capitalize">{lesson.difficulty}</div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {lesson.progress > 0 && !lesson.locked && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <span>Progress</span>
                        <span>{lesson.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getLevelColor(lesson.level)} rounded-full transition-all duration-1000`}
                          style={{ width: `${lesson.progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Completed Badge */}
                  {lesson.completed && (
                    <div className="absolute top-4 right-4 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredLessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="text-8xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No Lessons Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your filters to see more lessons
            </p>
            <button
              onClick={() => {
                setSelectedLevel('all')
                setSelectedCategory('all')
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
            >
              Reset Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
