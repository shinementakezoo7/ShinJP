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

  // Add custom animations
  if (typeof window !== 'undefined') {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
      .delay-1000 {
        animation-delay: 1s;
      }
      .delay-2000 {
        animation-delay: 2s;
      }
    `
    if (!document.head.querySelector('style[data-lessons-animations]')) {
      style.setAttribute('data-lessons-animations', 'true')
      document.head.appendChild(style)
    }
  }

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

  const getLevelJapaneseName = (level: string) => {
    switch (level) {
      case 'N5':
        return '初心者 (Shoshinsha)'
      case 'N4':
        return '初級 (Shokyuu)'
      case 'N3':
        return '中級 (Chuukyuu)'
      case 'N2':
        return '準上級 (Jun-joukyuu)'
      case 'N1':
        return '上級 (Joukyuu)'
      default:
        return 'すべて'
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

  const getCategoryJapaneseName = (category: string) => {
    switch (category) {
      case 'grammar':
        return '文法 (Bunpou)'
      case 'vocabulary':
        return '語彙 (Goi)'
      case 'kanji':
        return '漢字 (Kanji)'
      case 'reading':
        return '読解 (Dokkai)'
      case 'listening':
        return '聴解 (Choukai)'
      default:
        return 'すべて'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'from-green-400 to-emerald-500'
      case 'intermediate':
        return 'from-blue-400 to-cyan-500'
      case 'advanced':
        return 'from-purple-400 to-pink-500'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const completedCount = lessons.filter((l) => l.completed).length
  const totalCount = lessons.length
  const overallProgress = (completedCount / totalCount) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50/30 to-blue-50/40 dark:from-gray-900 via-purple-950/20 to-blue-950/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-full">
          {/* Floating gradient orbs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-rose-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-purple-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-gradient-to-br from-amber-400/15 to-orange-600/15 rounded-full blur-3xl animate-pulse delay-2000"></div>

          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-12"
        >
          <div className="text-center mb-12">
            <motion.div
              className="inline-flex items-center justify-center relative mb-8"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, type: 'spring' }}
            >
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-purple-600 flex items-center justify-center text-6xl shadow-2xl border-4 border-white/80 dark:border-gray-800/80 backdrop-blur-sm">
                📚
              </div>
              <motion.div
                className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-sm font-black text-white shadow-lg border-2 border-white dark:border-gray-800"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.8, type: 'spring' }}
              >
                {completedCount}
              </motion.div>
              {/* Animated ring effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-rose-400 to-purple-600 opacity-30 blur-xl animate-ping"></div>
            </motion.div>

            <motion.h1
              className="text-5xl sm:text-7xl font-black bg-gradient-to-r from-gray-900 via-rose-800 to-purple-900 dark:from-white dark:via-rose-200 dark:to-purple-200 bg-clip-text text-transparent mb-6 leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              日本語のレッスン
            </motion.h1>
            <motion.p
              className="text-2xl text-gray-600 dark:text-gray-300 font-medium mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Master Japanese with structured lessons •{' '}
              <span className="bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent font-bold">
                勉強しましょう
              </span>
            </motion.p>
            <motion.div
              className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span>🎯 {filteredLessons.length} lessons available</span>
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-1000"></span>
            </motion.div>
          </div>

          {/* Enhanced Progress Summary */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-4 gap-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.div
              className="group relative p-7 bg-gradient-to-br from-amber-50/90 to-orange-50/90 dark:from-amber-950/50 dark:to-orange-950/50 backdrop-blur-xl rounded-3xl border border-amber-200/60 dark:border-amber-800/40 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-orange-500/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-amber-800 dark:text-amber-200 uppercase tracking-wider">
                    学習進捗
                  </span>
                  <motion.span
                    className="text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                  >
                    📈
                  </motion.span>
                </div>
                <div className="text-5xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-3">
                  {Math.round(overallProgress)}%
                </div>
                <div className="h-3 bg-amber-200/50 dark:bg-amber-900/40 rounded-full overflow-hidden shadow-inner">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${overallProgress}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.8 }}
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full shadow-lg relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </motion.div>
                </div>
                <div className="text-xs text-amber-700 dark:text-amber-300 mt-2 font-medium">
                  Progress
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-7 bg-gradient-to-br from-blue-50/90 to-cyan-50/90 dark:from-blue-950/50 dark:to-cyan-950/50 backdrop-blur-xl rounded-3xl border border-blue-200/60 dark:border-blue-800/40 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-cyan-500/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-blue-800 dark:text-blue-200 uppercase tracking-wider">
                    完了済み
                  </span>
                  <motion.span
                    className="text-4xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 4 }}
                  >
                    ✅
                  </motion.span>
                </div>
                <div className="text-5xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  {completedCount}/{totalCount}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(completedCount, 5))].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-blue-500 rounded-full border border-white dark:border-gray-800"
                      ></div>
                    ))}
                  </div>
                  <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                    レッスン完了
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-7 bg-gradient-to-br from-purple-50/90 to-pink-50/90 dark:from-purple-950/50 dark:to-pink-950/50 backdrop-blur-xl rounded-3xl border border-purple-200/60 dark:border-purple-800/40 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/30 to-pink-500/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-purple-800 dark:text-purple-200 uppercase tracking-wider">
                    学習時間
                  </span>
                  <motion.span
                    className="text-4xl"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                  >
                    ⏱️
                  </motion.span>
                </div>
                <div className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-3">
                  12.5h
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                  合計時間
                </div>
              </div>
            </motion.div>

            <motion.div
              className="group relative p-7 bg-gradient-to-br from-green-50/90 to-emerald-50/90 dark:from-green-950/50 dark:to-emerald-950/50 backdrop-blur-xl rounded-3xl border border-green-200/60 dark:border-green-800/40 shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
              whileHover={{ y: -5 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/30 to-emerald-500/30 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-black text-green-800 dark:text-green-200 uppercase tracking-wider">
                    次の目標
                  </span>
                  <motion.span
                    className="text-4xl"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  >
                    🎯
                  </motion.span>
                </div>
                <div className="text-5xl font-black bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3">
                  N4
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                  次のレベル
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-12"
        >
          <div className="p-10 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-2xl rounded-4xl border border-white/40 dark:border-gray-700/40 shadow-3xl relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5">
              <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full blur-2xl"></div>
              <div className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full blur-2xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
                <div>
                  <motion.h2
                    className="text-3xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    レッスンをフィルター
                  </motion.h2>
                  <motion.p
                    className="text-lg text-gray-600 dark:text-gray-400 font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    Find the perfect lesson for your level
                  </motion.p>
                </div>
                <motion.div
                  className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-rose-100 to-purple-100 dark:from-rose-900/30 dark:to-purple-900/30 rounded-2xl border border-rose-200/50 dark:border-purple-700/30"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="relative">
                    <span className="text-2xl">🎯</span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  </div>
                  <span className="text-sm font-bold text-rose-800 dark:text-rose-200">
                    {filteredLessons.length} lessons available
                  </span>
                </motion.div>
              </div>

              {/* Enhanced Level Filter */}
              <div className="mb-10">
                <motion.h3
                  className="text-xl font-black text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    JLPT
                  </span>
                  <span>JLPT Level • 日本語能力試験</span>
                </motion.h3>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  {levels.map((level, index) => (
                    <motion.button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`group relative px-6 py-4 rounded-3xl font-bold text-sm transition-all duration-500 transform hover:scale-105 overflow-hidden ${
                        selectedLevel === level
                          ? 'bg-gradient-to-r from-red-500 via-orange-600 to-rose-600 text-white shadow-2xl shadow-red-500/30 border border-red-500/40'
                          : 'bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80'
                      }`}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.3 + index * 0.1 }}
                    >
                      {selectedLevel === level && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
                      )}
                      <div className="flex flex-col items-center relative z-10">
                        <span className="font-black text-lg">
                          {level === 'all' ? 'すべて' : level}
                        </span>
                        <span className="text-xs mt-1 opacity-80 font-medium">
                          {level === 'all' ? 'All Levels' : getLevelJapaneseName(level)}
                        </span>
                      </div>
                    </motion.button>
                  ))}
                </motion.div>
              </div>

              {/* Enhanced Category Filter */}
              <div>
                <motion.h3
                  className="text-xl font-black text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    分類
                  </span>
                  <span>Category • カテゴリー</span>
                </motion.h3>
                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  {categories.map((category, index) => (
                    <motion.button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`group relative px-6 py-4 rounded-3xl font-bold text-sm transition-all duration-500 transform hover:scale-105 flex flex-col items-center min-w-[100px] overflow-hidden ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white shadow-2xl shadow-blue-500/30 border border-blue-500/40'
                          : 'bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border border-gray-200/60 dark:border-gray-600/60 hover:border-gray-300/80 dark:hover:border-gray-500/80'
                      }`}
                      whileHover={{ y: -3, rotate: [-1, 1, -1] }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.6 + index * 0.1 }}
                    >
                      {selectedCategory === category && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
                      )}
                      <span className="text-2xl mb-2 relative z-10">
                        {category === 'all' ? '🌟' : getCategoryIcon(category)}
                      </span>
                      <span className="font-black text-xs relative z-10">
                        {category === 'all' ? 'すべて' : getCategoryJapaneseName(category)}
                      </span>
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Enhanced Lessons Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 2.0 + index * 0.15, type: 'spring' }}
              whileHover={{ y: -10 }}
              className="group"
            >
              <Link href={lesson.locked ? '#' : `/lessons/${lesson.id}`}>
                <div
                  className={`relative p-8 rounded-4xl border-2 transition-all duration-700 shadow-2xl hover:shadow-4xl overflow-hidden ${
                    lesson.locked
                      ? 'bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-900/80 border-gray-300/60 dark:border-gray-700/60 cursor-not-allowed'
                      : 'bg-gradient-to-br from-white/90 via-white/70 to-gray-50/90 dark:from-gray-800/90 dark:via-gray-800/70 dark:to-gray-900/90 backdrop-blur-2xl border-gray-200/40 dark:border-gray-700/40 hover:scale-[1.03] hover:border-gray-300/80 dark:hover:border-gray-600/80'
                  }`}
                >
                  {/* Enhanced Background Pattern */}
                  {!lesson.locked && (
                    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.08]">
                      <div
                        className="w-full h-full bg-repeat"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20v20h20v-20H20zm10 10a5 5 0 110-10 5 5 0 010 10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                          backgroundSize: '80px',
                        }}
                      />
                    </div>
                  )}

                  {/* Gradient Overlay for non-locked cards */}
                  {!lesson.locked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/20 dark:to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  )}

                  {/* Enhanced Locked Overlay */}
                  {lesson.locked && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-black/70 to-gray-900/80 backdrop-blur-md rounded-4xl flex items-center justify-center z-20">
                      <motion.div
                        className="text-center"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="w-20 h-20 bg-gradient-to-br from-gray-600 to-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl"
                        >
                          <svg
                            className="w-12 h-12 text-gray-300"
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
                        </motion.div>
                        <p className="text-xl font-bold text-gray-200 mb-2">
                          レッスンがロックされています
                        </p>
                        <p className="text-sm text-gray-400 max-w-xs">
                          Complete previous lessons to unlock this content
                        </p>
                      </motion.div>
                    </div>
                  )}

                  {/* Enhanced Icon Section */}
                  <div className="relative mb-6">
                    <motion.div
                      className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${getLevelColor(
                        lesson.level
                      )} flex items-center justify-center text-5xl shadow-3xl border-4 border-white/80 dark:border-gray-800/80 backdrop-blur-sm relative overflow-hidden ${
                        !lesson.locked && 'group-hover:scale-110 group-hover:rotate-6'
                      } transition-all duration-700`}
                      whileHover={!lesson.locked ? { scale: 1.1, rotate: 6 } : {}}
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-shimmer"></div>
                      <span className="relative z-10">{lesson.icon}</span>
                    </motion.div>

                    {/* Floating particles for unlocked lessons */}
                    {!lesson.locked && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
                    )}
                  </div>

                  {/* Enhanced Content */}
                  <div className="mb-6 relative z-10">
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`px-4 py-2 rounded-2xl text-sm font-black bg-gradient-to-r ${getLevelColor(
                          lesson.level
                        )} text-white shadow-lg border border-white/20`}
                      >
                        {lesson.level} • {getLevelJapaneseName(lesson.level)}
                      </motion.span>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className="px-4 py-2 rounded-2xl text-sm font-bold bg-white/90 dark:bg-gray-700/90 text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-600/60 capitalize shadow-md backdrop-blur-sm"
                      >
                        {getCategoryJapaneseName(lesson.category)}
                      </motion.span>
                    </div>

                    <motion.h3
                      className="font-black text-2xl text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-700 dark:group-hover:from-white dark:group-hover:to-gray-300 group-hover:bg-clip-text transition-all duration-300"
                      whileHover={{ x: 5 }}
                    >
                      {lesson.title}
                    </motion.h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-5 leading-relaxed text-sm font-medium">
                      {lesson.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-sm font-bold text-gray-600 dark:text-gray-400">
                        <motion.div
                          className="flex items-center gap-2 px-3 py-1.5 bg-amber-100/80 dark:bg-amber-900/30 rounded-xl"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-amber-600 dark:text-amber-400">⏱️</span>
                          <span>{lesson.duration} min</span>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r ${getDifficultyColor(lesson.difficulty)} text-white shadow-md`}
                        >
                          {lesson.difficulty}
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Progress Bar */}
                  {lesson.progress > 0 && !lesson.locked && (
                    <motion.div
                      className="space-y-3 relative z-10"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center justify-between text-sm font-black text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">
                          <span className="text-green-500">📊</span>
                          進捗 (Progress)
                        </span>
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {lesson.progress}%
                        </span>
                      </div>
                      <div className="h-4 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden shadow-inner">
                        <motion.div
                          className={`h-full bg-gradient-to-r ${getLevelColor(lesson.level)} rounded-full shadow-lg relative overflow-hidden`}
                          style={{ width: `${lesson.progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${lesson.progress}%` }}
                          transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Enhanced Completed Badge */}
                  {lesson.completed && (
                    <motion.div
                      className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl flex items-center justify-center shadow-3xl border-4 border-white dark:border-gray-800 z-30"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.6, delay: 0.8, type: 'spring' }}
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <svg
                        className="w-9 h-9 text-white"
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
                    </motion.div>
                  )}

                  {/* Interactive Glow Effect */}
                  {!lesson.locked && (
                    <div className="absolute inset-0 rounded-4xl bg-gradient-to-t from-transparent via-transparent to-white/10 dark:to-black/10 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none"></div>
                  )}
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredLessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center py-24"
          >
            <motion.div
              className="relative inline-block mb-8"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <div className="text-9xl filter drop-shadow-2xl">🌸</div>
              <div className="absolute inset-0 text-9xl filter blur-xl opacity-50 animate-pulse">
                🌸
              </div>
            </motion.div>

            <motion.h3
              className="text-4xl font-black bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              レッスンが見つかりません
            </motion.h3>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Try adjusting your filters to discover more Japanese lessons.
              <span className="block mt-3 text-gray-500 dark:text-gray-500 font-medium">
                フィルターを調整して、より多くのレッスンを見つけてください。
              </span>
            </motion.p>

            <motion.button
              onClick={() => {
                setSelectedLevel('all')
                setSelectedCategory('all')
              }}
              className="group relative px-10 py-5 bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 text-white rounded-3xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all duration-500 border border-white/20 overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 flex items-center gap-3">
                <span>🔄</span>
                <span>フィルターをリセット</span>
              </span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
