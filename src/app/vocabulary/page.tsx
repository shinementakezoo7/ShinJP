'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

// Types
type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
type Category = 'verbs' | 'adjectives' | 'nouns' | 'expressions'
type StudyMode = 'flashcards' | 'quiz' | 'matching'
type CardStatus = 'new' | 'reviewing' | 'mastered'

interface VocabWord {
  id: string
  kanji: string
  hiragana: string
  romaji: string
  english: string
  example: string
  exampleTranslation: string
  level: JLPTLevel
  category: Category
  status: CardStatus
  nextReview: Date
  reviewCount: number
}

// Sample vocabulary data
const sampleVocabulary: VocabWord[] = [
  {
    id: '1',
    kanji: '食べる',
    hiragana: 'たべる',
    romaji: 'taberu',
    english: 'to eat',
    example: '毎日朝ごはんを食べます。',
    exampleTranslation: 'I eat breakfast every day.',
    level: 'N5',
    category: 'verbs',
    status: 'mastered',
    nextReview: new Date(Date.now() + 86400000 * 7),
    reviewCount: 12,
  },
  {
    id: '2',
    kanji: '美しい',
    hiragana: 'うつくしい',
    romaji: 'utsukushii',
    english: 'beautiful',
    example: '桜の花はとても美しいです。',
    exampleTranslation: 'Cherry blossoms are very beautiful.',
    level: 'N4',
    category: 'adjectives',
    status: 'reviewing',
    nextReview: new Date(Date.now() + 86400000 * 3),
    reviewCount: 5,
  },
  {
    id: '3',
    kanji: '図書館',
    hiragana: 'としょかん',
    romaji: 'toshokan',
    english: 'library',
    example: '図書館で勉強しています。',
    exampleTranslation: 'I am studying at the library.',
    level: 'N5',
    category: 'nouns',
    status: 'new',
    nextReview: new Date(Date.now() + 86400000),
    reviewCount: 0,
  },
  {
    id: '4',
    kanji: 'お疲れ様',
    hiragana: 'おつかれさま',
    romaji: 'otsukaresama',
    english: 'good work, thank you for your effort',
    example: 'お疲れ様でした！',
    exampleTranslation: 'Thank you for your hard work!',
    level: 'N4',
    category: 'expressions',
    status: 'mastered',
    nextReview: new Date(Date.now() + 86400000 * 14),
    reviewCount: 20,
  },
  {
    id: '5',
    kanji: '実現',
    hiragana: 'じつげん',
    romaji: 'jitsugen',
    english: 'realization, actualization',
    example: '夢を実現するために努力する。',
    exampleTranslation: 'I work hard to realize my dreams.',
    level: 'N2',
    category: 'nouns',
    status: 'reviewing',
    nextReview: new Date(Date.now() + 86400000 * 2),
    reviewCount: 3,
  },
  {
    id: '6',
    kanji: '顕著',
    hiragana: 'けんちょ',
    romaji: 'kencho',
    english: 'remarkable, conspicuous',
    example: '顕著な進歩が見られる。',
    exampleTranslation: 'Remarkable progress can be seen.',
    level: 'N1',
    category: 'adjectives',
    status: 'new',
    nextReview: new Date(Date.now() + 86400000),
    reviewCount: 0,
  },
]

export default function VocabularyPage() {
  const [selectedLevel, setSelectedLevel] = useState<JLPTLevel | 'all'>('all')
  const [selectedCategory, setSelectedCategory] = useState<Category | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards')
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [vocabulary, setVocabulary] = useState<VocabWord[]>(sampleVocabulary)
  const [showStats, setShowStats] = useState(false)

  // Filter vocabulary
  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter((word) => {
      const matchesLevel = selectedLevel === 'all' || word.level === selectedLevel
      const matchesCategory = selectedCategory === 'all' || word.category === selectedCategory
      const matchesSearch =
        searchQuery === '' ||
        word.kanji.includes(searchQuery) ||
        word.hiragana.includes(searchQuery) ||
        word.romaji.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.english.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesLevel && matchesCategory && matchesSearch
    })
  }, [vocabulary, selectedLevel, selectedCategory, searchQuery])

  // Calculate stats
  const stats = useMemo(() => {
    const total = vocabulary.length
    const mastered = vocabulary.filter((w) => w.status === 'mastered').length
    const reviewing = vocabulary.filter((w) => w.status === 'reviewing').length
    const newWords = vocabulary.filter((w) => w.status === 'new').length
    return { total, mastered, reviewing, new: newWords }
  }, [vocabulary])

  // Level stats
  const levelStats = useMemo(() => {
    const levels: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']
    return levels.map((level) => ({
      level,
      count: vocabulary.filter((w) => w.level === level).length,
    }))
  }, [vocabulary])

  // Reset card when filters change
  useEffect(() => {
    setCurrentCardIndex(0)
    setIsFlipped(false)
  }, [selectedLevel, selectedCategory, searchQuery])

  const currentCard = filteredVocabulary[currentCardIndex]

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentCardIndex((prev) => (prev + 1) % filteredVocabulary.length)
    }, 200)
  }

  const handlePrevious = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentCardIndex(
        (prev) => (prev - 1 + filteredVocabulary.length) % filteredVocabulary.length
      )
    }, 200)
  }

  const getLevelColor = (level: JLPTLevel) => {
    const colors = {
      N5: 'from-green-500 to-emerald-600',
      N4: 'from-blue-500 to-cyan-600',
      N3: 'from-yellow-500 to-amber-600',
      N2: 'from-orange-500 to-red-600',
      N1: 'from-purple-500 to-pink-600',
    }
    return colors[level]
  }

  const getCategoryIcon = (category: Category) => {
    const icons = {
      verbs: '🏃',
      adjectives: '✨',
      nouns: '📦',
      expressions: '💬',
    }
    return icons[category]
  }

  const getStatusColor = (status: CardStatus) => {
    const colors = {
      new: 'text-blue-600 dark:text-blue-400',
      reviewing: 'text-yellow-600 dark:text-yellow-400',
      mastered: 'text-green-600 dark:text-green-400',
    }
    return colors[status]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -100,
              rotate: 0,
              opacity: 0.6,
            }}
            animate={{
              y: window.innerHeight + 100,
              x: Math.random() * window.innerWidth,
              rotate: 360,
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 0.5,
              ease: 'linear',
            }}
          >
            <img src="/icons/sakura.svg" alt="Sakura" className="w-6 h-6 opacity-70" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <header className="navbar-liquid-enhanced sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div
                className="text-5xl japanese-text text-red-700 dark:text-red-400"
                whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5 }}
              >
                語
              </motion.div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">Vocabulary</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 japanese-text">語彙学習</p>
              </div>
            </Link>

            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-full bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Dashboard
            </Link>
          </div>
        </div>
        <div className="navbar-border-animation"></div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Dashboard - Toggle */}
        <motion.button
          onClick={() => setShowStats(!showStats)}
          className="mb-8 w-full rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6 hover:scale-[1.02] transition-all duration-300"
          whileHover={{ y: -4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-6xl">📊</div>
              <div className="text-left">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                  Your Progress
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click to {showStats ? 'hide' : 'show'} detailed statistics
                </p>
              </div>
            </div>
            <motion.div
              animate={{ rotate: showStats ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl"
            >
              ▼
            </motion.div>
          </div>
        </motion.button>

        {/* Stats Dashboard - Expandable */}
        <AnimatePresence>
          {showStats && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                {[
                  {
                    label: 'Total Words',
                    value: stats.total,
                    icon: '📚',
                    color: 'from-blue-500 to-cyan-600',
                  },
                  {
                    label: 'Mastered',
                    value: stats.mastered,
                    icon: '⭐',
                    color: 'from-green-500 to-emerald-600',
                  },
                  {
                    label: 'Reviewing',
                    value: stats.reviewing,
                    icon: '📝',
                    color: 'from-yellow-500 to-amber-600',
                  },
                  {
                    label: 'New',
                    value: stats.new,
                    icon: '🆕',
                    color: 'from-purple-500 to-pink-600',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative rounded-3xl overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6"
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-5xl">{stat.icon}</div>
                      <motion.div
                        className={`text-5xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        {stat.value}
                      </motion.div>
                    </div>
                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Level Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-8"
              >
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-4xl">📈</span>
                  Words by JLPT Level
                </h3>
                <div className="grid grid-cols-5 gap-4">
                  {levelStats.map((level, index) => (
                    <motion.div
                      key={level.level}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-center"
                    >
                      <div
                        className={`h-32 rounded-2xl bg-gradient-to-br ${getLevelColor(level.level)} flex items-end justify-center p-4 shadow-lg`}
                      >
                        <motion.div
                          className="bg-white/90 dark:bg-black/80 rounded-xl px-4 py-2"
                          whileHover={{ scale: 1.1 }}
                        >
                          <div className="text-3xl font-black text-gray-900 dark:text-white">
                            {level.count}
                          </div>
                        </motion.div>
                      </div>
                      <p className="mt-2 text-lg font-bold text-gray-700 dark:text-gray-300">
                        {level.level}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6"
        >
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by kanji, hiragana, romaji, or English..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pl-14 rounded-2xl bg-white/80 dark:bg-black/60 border-2 border-red-800/30 dark:border-red-400/30 focus:border-red-600 dark:focus:border-red-400 outline-none text-lg transition-all duration-300"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">🔍</div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              JLPT Level
            </h3>
            <div className="flex flex-wrap gap-3">
              {['all', 'N5', 'N4', 'N3', 'N2', 'N1'].map((level) => (
                <motion.button
                  key={level}
                  onClick={() => setSelectedLevel(level as JLPTLevel | 'all')}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${
                    selectedLevel === level
                      ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 text-white shadow-lg scale-105'
                      : 'bg-white/80 dark:bg-black/60 text-gray-700 dark:text-gray-300 hover:scale-105'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {level.toUpperCase()}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Category
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'all', label: 'All', icon: '🌐' },
                { value: 'verbs', label: 'Verbs', icon: '🏃' },
                { value: 'adjectives', label: 'Adjectives', icon: '✨' },
                { value: 'nouns', label: 'Nouns', icon: '📦' },
                { value: 'expressions', label: 'Expressions', icon: '💬' },
              ].map((cat) => (
                <motion.button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value as Category | 'all')}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
                    selectedCategory === cat.value
                      ? 'bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 text-white shadow-lg scale-105'
                      : 'bg-white/80 dark:bg-black/60 text-gray-700 dark:text-gray-300 hover:scale-105'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{cat.icon}</span>
                  {cat.label}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Study Mode */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wider">
              Study Mode
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                { value: 'flashcards', label: 'Flashcards', icon: '🎴' },
                { value: 'quiz', label: 'Quiz', icon: '❓' },
                { value: 'matching', label: 'Matching Game', icon: '🎯' },
              ].map((mode) => (
                <motion.button
                  key={mode.value}
                  onClick={() => setStudyMode(mode.value as StudyMode)}
                  className={`px-6 py-3 rounded-full font-bold transition-all duration-300 flex items-center gap-2 ${
                    studyMode === mode.value
                      ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white shadow-lg scale-105'
                      : 'bg-white/80 dark:bg-black/60 text-gray-700 dark:text-gray-300 hover:scale-105'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-xl">{mode.icon}</span>
                  {mode.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Study Area */}
        {filteredVocabulary.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-12 text-center"
          >
            <div className="text-8xl mb-4">😢</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              No words found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your filters or search query
            </p>
          </motion.div>
        ) : (
          <>
            {/* Flashcards Mode */}
            {studyMode === 'flashcards' && currentCard && (
              <div>
                {/* Progress */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-bold text-gray-700 dark:text-gray-300">
                      {currentCardIndex + 1} / {filteredVocabulary.length}
                    </span>
                    <div className="h-2 w-64 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-600"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((currentCardIndex + 1) / filteredVocabulary.length) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-4 py-2 rounded-full font-bold ${getStatusColor(currentCard.status)} bg-white/80 dark:bg-black/60`}
                    >
                      {currentCard.status.toUpperCase()}
                    </div>
                    <div className="px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600">
                      📅 {currentCard.reviewCount} reviews
                    </div>
                  </div>
                </div>

                {/* Flashcard */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="perspective-1000 mb-8"
                >
                  <motion.div
                    className="relative w-full h-[500px] cursor-pointer"
                    onClick={() => setIsFlipped(!isFlipped)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <AnimatePresence mode="wait">
                      {!isFlipped ? (
                        <motion.div
                          key="front"
                          initial={{ rotateY: 0 }}
                          exit={{ rotateY: 90 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white via-red-50 to-orange-50 dark:from-gray-900 dark:via-red-950/50 dark:to-orange-950/50 backdrop-blur-xl border-4 border-red-800/30 dark:border-red-400/30 shadow-2xl p-12 flex flex-col items-center justify-center"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          {/* Front Side - Kanji */}
                          <motion.div
                            className="absolute top-6 right-6 flex items-center gap-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <div
                              className={`px-4 py-2 rounded-full font-bold text-white bg-gradient-to-r ${getLevelColor(currentCard.level)}`}
                            >
                              {currentCard.level}
                            </div>
                            <div className="text-4xl">{getCategoryIcon(currentCard.category)}</div>
                          </motion.div>

                          <motion.div
                            className="japanese-text text-9xl font-black text-gray-900 dark:text-white mb-6"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {currentCard.kanji}
                          </motion.div>

                          <div className="text-center mb-8">
                            <p className="text-3xl japanese-text text-gray-700 dark:text-gray-300 mb-2">
                              {currentCard.hiragana}
                            </p>
                            <p className="text-2xl text-gray-600 dark:text-gray-400">
                              {currentCard.romaji}
                            </p>
                          </div>

                          <motion.div
                            className="text-gray-500 dark:text-gray-500 flex items-center gap-2 text-lg"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span>💡</span>
                            Click to reveal meaning
                          </motion.div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="back"
                          initial={{ rotateY: -90 }}
                          animate={{ rotateY: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 dark:from-purple-950/50 dark:via-pink-950/50 dark:to-red-950/50 backdrop-blur-xl border-4 border-purple-800/30 dark:border-purple-400/30 shadow-2xl p-12 flex flex-col items-center justify-center"
                          style={{ backfaceVisibility: 'hidden' }}
                        >
                          {/* Back Side - Meaning */}
                          <motion.div
                            className="text-6xl font-black text-gray-900 dark:text-white mb-8 text-center"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                          >
                            {currentCard.english}
                          </motion.div>

                          <div className="w-full max-w-2xl space-y-6">
                            <div className="p-6 rounded-2xl bg-white/60 dark:bg-black/40">
                              <p className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">
                                EXAMPLE SENTENCE
                              </p>
                              <p className="text-2xl japanese-text text-gray-900 dark:text-white mb-3">
                                {currentCard.example}
                              </p>
                              <p className="text-lg text-gray-700 dark:text-gray-300">
                                {currentCard.exampleTranslation}
                              </p>
                            </div>
                          </div>

                          <motion.div
                            className="mt-8 text-gray-500 dark:text-gray-500 flex items-center gap-2 text-lg"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <span>🔄</span>
                            Click to flip back
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>

                {/* Navigation & Actions */}
                <div className="flex items-center justify-between gap-4">
                  <motion.button
                    onClick={handlePrevious}
                    className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-black/60 border-2 border-red-800/30 dark:border-red-400/30 font-bold text-gray-900 dark:text-white hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">←</span>
                    Previous
                  </motion.button>

                  <div className="flex gap-4">
                    {['Again', 'Hard', 'Good', 'Easy'].map((action, index) => (
                      <motion.button
                        key={action}
                        onClick={handleNext}
                        className={`px-6 py-4 rounded-2xl font-bold text-white shadow-lg hover:scale-105 transition-all duration-300 ${
                          index === 0
                            ? 'bg-gradient-to-r from-red-600 to-red-700'
                            : index === 1
                              ? 'bg-gradient-to-r from-orange-600 to-orange-700'
                              : index === 2
                                ? 'bg-gradient-to-r from-green-600 to-green-700'
                                : 'bg-gradient-to-r from-blue-600 to-blue-700'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {action}
                      </motion.button>
                    ))}
                  </div>

                  <motion.button
                    onClick={handleNext}
                    className="px-8 py-4 rounded-2xl bg-white/80 dark:bg-black/60 border-2 border-red-800/30 dark:border-red-400/30 font-bold text-gray-900 dark:text-white hover:scale-105 transition-all duration-300 flex items-center gap-3"
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                    <span className="text-2xl">→</span>
                  </motion.button>
                </div>
              </div>
            )}

            {/* Quiz Mode */}
            {studyMode === 'quiz' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-12 text-center"
              >
                <div className="text-8xl mb-4">🎓</div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                  Quiz Mode
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Test your knowledge with interactive quizzes
                </p>
                <motion.button
                  className="px-12 py-4 rounded-full bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold text-xl shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Quiz
                </motion.button>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">Coming Soon! 🚧</p>
              </motion.div>
            )}

            {/* Matching Game Mode */}
            {studyMode === 'matching' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-12 text-center"
              >
                <div className="text-8xl mb-4">🎮</div>
                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                  Matching Game
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Match Japanese words with their English meanings
                </p>
                <motion.button
                  className="px-12 py-4 rounded-full bg-gradient-to-r from-green-600 via-emerald-600 to-cyan-600 text-white font-bold text-xl shadow-lg hover:shadow-xl"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Start Game
                </motion.button>
                <p className="mt-6 text-sm text-gray-500 dark:text-gray-500">Coming Soon! 🚧</p>
              </motion.div>
            )}
          </>
        )}

        {/* Word List View */}
        {studyMode === 'flashcards' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-8"
          >
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="text-4xl">📋</span>
              Word List ({filteredVocabulary.length} words)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVocabulary.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    setCurrentCardIndex(index)
                    setIsFlipped(false)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="p-4 rounded-2xl bg-white/80 dark:bg-black/60 border-2 border-red-800/20 dark:border-red-400/20 cursor-pointer hover:scale-105 hover:border-red-600 dark:hover:border-red-400 transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getLevelColor(word.level)}`}
                    >
                      {word.level}
                    </div>
                    <div className="text-2xl">{getCategoryIcon(word.category)}</div>
                  </div>
                  <div className="japanese-text text-3xl font-black text-gray-900 dark:text-white mb-1">
                    {word.kanji}
                  </div>
                  <div className="text-sm japanese-text text-gray-600 dark:text-gray-400 mb-2">
                    {word.hiragana}
                  </div>
                  <div className="text-base font-bold text-gray-700 dark:text-gray-300">
                    {word.english}
                  </div>
                  <div className={`mt-2 text-xs font-bold ${getStatusColor(word.status)}`}>
                    ● {word.status}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative mt-24 py-12 bg-gradient-to-br from-gray-900 via-red-950 to-orange-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2025 <span className="japanese-text text-red-400">侍</span> Shinmen Takezo. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
