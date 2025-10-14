'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

// TypeScript Interfaces
interface Exercise {
  id: string
  title: string
  description: string
  category: 'vocabulary' | 'kanji' | 'grammar' | 'listening'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  icon: string
  progress: number
  totalQuestions: number
  completedQuestions: number
  estimatedTime: number
  accuracy: number
}

interface UserStats {
  totalExercises: number
  completedExercises: number
  accuracyRate: number
  practiceTime: number
  currentStreak: number
}

interface Question {
  id: string
  type: 'vocabulary' | 'kanji' | 'grammar' | 'listening'
  question: string
  options: string[]
  correctAnswer: number
}

export default function PracticePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [isTimerActive, setIsTimerActive] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Mock exercises data
  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'N5 Vocabulary Quiz',
      description: 'Master essential Japanese vocabulary for beginners',
      category: 'vocabulary',
      difficulty: 'beginner',
      icon: '📚',
      progress: 65,
      totalQuestions: 50,
      completedQuestions: 32,
      estimatedTime: 15,
      accuracy: 82,
    },
    {
      id: '2',
      title: 'Kanji Writing Practice',
      description: 'Learn to write and recognize basic kanji characters',
      category: 'kanji',
      difficulty: 'beginner',
      icon: '✍️',
      progress: 40,
      totalQuestions: 100,
      completedQuestions: 40,
      estimatedTime: 30,
      accuracy: 75,
    },
    {
      id: '3',
      title: 'Grammar Drills N4',
      description: 'Practice intermediate grammar patterns',
      category: 'grammar',
      difficulty: 'intermediate',
      icon: '📖',
      progress: 55,
      totalQuestions: 60,
      completedQuestions: 33,
      estimatedTime: 20,
      accuracy: 88,
    },
    {
      id: '4',
      title: 'Listening Comprehension',
      description: 'Improve your listening skills with real conversations',
      category: 'listening',
      difficulty: 'intermediate',
      icon: '🎧',
      progress: 30,
      totalQuestions: 40,
      completedQuestions: 12,
      estimatedTime: 25,
      accuracy: 70,
    },
    {
      id: '5',
      title: 'Advanced Kanji',
      description: 'Master complex kanji for N2-N1 level',
      category: 'kanji',
      difficulty: 'advanced',
      icon: '🈯',
      progress: 20,
      totalQuestions: 150,
      completedQuestions: 30,
      estimatedTime: 45,
      accuracy: 65,
    },
    {
      id: '6',
      title: 'Business Japanese',
      description: 'Learn professional vocabulary and keigo',
      category: 'vocabulary',
      difficulty: 'advanced',
      icon: '💼',
      progress: 15,
      totalQuestions: 80,
      completedQuestions: 12,
      estimatedTime: 35,
      accuracy: 72,
    },
  ]

  // Mock user stats
  const userStats: UserStats = {
    totalExercises: 24,
    completedExercises: 18,
    accuracyRate: 78,
    practiceTime: 1260, // minutes
    currentStreak: 7,
  }

  // Mock questions
  const mockQuestions: Question[] = [
    {
      id: '1',
      type: 'vocabulary',
      question: 'What does "ありがとう" mean?',
      options: ['Hello', 'Thank you', 'Goodbye', 'Sorry'],
      correctAnswer: 1,
    },
    {
      id: '2',
      type: 'vocabulary',
      question: 'How do you say "good morning" in Japanese?',
      options: ['こんにちは', 'おはよう', 'こんばんは', 'さようなら'],
      correctAnswer: 1,
    },
    {
      id: '3',
      type: 'vocabulary',
      question: 'What is the Japanese word for "book"?',
      options: ['ペン', '本', '机', '椅子'],
      correctAnswer: 1,
    },
  ]

  // Filter exercises
  const filteredExercises = exercises.filter((exercise) => {
    const categoryMatch = selectedCategory === 'all' || exercise.category === selectedCategory
    const difficultyMatch =
      selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerActive && timeLeft > 0 && activeExercise) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && activeExercise) {
      handleFinishExercise()
    }
    return () => clearInterval(interval)
  }, [isTimerActive, timeLeft, activeExercise])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStartExercise = (exercise: Exercise) => {
    setActiveExercise(exercise)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setTimeLeft(300)
    setIsTimerActive(true)
    setShowResults(false)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === mockQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
    } else {
      handleFinishExercise()
    }
  }

  const handleFinishExercise = () => {
    setIsTimerActive(false)
    setShowResults(true)
  }

  const handleReturnToList = () => {
    setActiveExercise(null)
    setShowResults(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vocabulary':
        return 'from-blue-600 to-blue-800'
      case 'kanji':
        return 'from-purple-600 to-purple-800'
      case 'grammar':
        return 'from-pink-600 to-pink-800'
      case 'listening':
        return 'from-orange-600 to-orange-800'
      default:
        return 'from-gray-600 to-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
      case 'intermediate':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30'
      case 'advanced':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-purple-50 to-blue-50 dark:from-gray-950 dark:via-purple-950/20 dark:to-blue-950/20">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="practice-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="0" cy="50" r="30" stroke="currentColor" strokeWidth="1" fill="none" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#practice-pattern)" />
        </svg>
      </div>

      {/* Floating Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{ x: Math.random() * 100 + '%', y: -20, opacity: 0 }}
            animate={{
              y: '110vh',
              x: Math.random() * 100 + '%',
              rotate: 360,
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: 'linear',
            }}
          >
            <img src="/icons/sakura.svg" alt="" className="w-6 h-6 opacity-40" />
          </motion.div>
        ))}
      </div>

      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-red-200 dark:border-red-800/30 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span className="font-medium">Dashboard</span>
              </Link>
              <div className="h-6 w-px bg-red-300 dark:bg-red-700"></div>
              <h1 className="text-2xl sm:text-3xl font-black gradient-text bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 dark:from-red-400 dark:via-purple-400 dark:to-blue-400">
                <span className="japanese-text text-3xl">練習</span> Practice
              </h1>
            </div>
            {activeExercise && !showResults && (
              <motion.div
                className="flex items-center gap-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{formatTime(timeLeft)}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!activeExercise ? (
          <>
            {/* Stats Summary */}
            <motion.section
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[
                  {
                    label: 'Total Exercises',
                    value: userStats.totalExercises,
                    icon: '📊',
                    gradient: 'from-blue-600 to-cyan-600',
                  },
                  {
                    label: 'Completed',
                    value: userStats.completedExercises,
                    icon: '✅',
                    gradient: 'from-green-600 to-emerald-600',
                  },
                  {
                    label: 'Accuracy',
                    value: `${userStats.accuracyRate}%`,
                    icon: '🎯',
                    gradient: 'from-purple-600 to-pink-600',
                  },
                  {
                    label: 'Practice Time',
                    value: `${Math.floor(userStats.practiceTime / 60)}h`,
                    icon: '⏱️',
                    gradient: 'from-orange-600 to-red-600',
                  },
                  {
                    label: 'Current Streak',
                    value: `${userStats.currentStreak} days`,
                    icon: '🔥',
                    gradient: 'from-red-600 to-orange-600',
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 p-6 shadow-xl">
                      {/* Gradient background */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-10 group-hover:opacity-20 transition-opacity`}
                      />

                      <div className="relative z-10">
                        <div className="text-4xl mb-3 filter drop-shadow-lg">{stat.icon}</div>
                        <div
                          className={`text-3xl font-black bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-1`}
                        >
                          {stat.value}
                        </div>
                        <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                          {stat.label}
                        </div>
                      </div>

                      {/* Shine effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* Filters */}
            <motion.section
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-col sm:flex-row gap-4 p-6 rounded-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 shadow-xl">
                {/* Category Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span className="text-xl">📁</span>
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {['all', 'vocabulary', 'kanji', 'grammar', 'listening'].map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg'
                            : 'bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-black/50'
                        }`}
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Filter */}
                <div className="flex-1">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                    <span className="text-xl">⚡</span>
                    Difficulty
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
                          selectedDifficulty === difficulty
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                            : 'bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-black/50'
                        }`}
                      >
                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Exercise Cards */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredExercises.map((exercise, index) => (
                    <motion.div
                      key={exercise.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -10, scale: 1.02 }}
                      className="group relative"
                    >
                      <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 p-6 shadow-xl hover:shadow-2xl transition-all">
                        {/* Category gradient background */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(
                            exercise.category
                          )} opacity-5 group-hover:opacity-10 transition-opacity`}
                        />

                        {/* Background Kanji */}
                        <div className="absolute top-2 right-2 text-8xl japanese-text opacity-5 pointer-events-none select-none">
                          練
                        </div>

                        <div className="relative z-10">
                          {/* Icon */}
                          <div className="text-5xl mb-4 filter drop-shadow-lg transform group-hover:scale-110 transition-transform">
                            {exercise.icon}
                          </div>

                          {/* Title & Description */}
                          <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                            {exercise.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {exercise.description}
                          </p>

                          {/* Difficulty Badge */}
                          <div className="flex items-center gap-2 mb-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(
                                exercise.difficulty
                              )}`}
                            >
                              {exercise.difficulty.charAt(0).toUpperCase() +
                                exercise.difficulty.slice(1)}
                            </span>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                              {exercise.completedQuestions}/{exercise.totalQuestions} questions
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                                Progress
                              </span>
                              <span className="text-xs font-bold text-gray-900 dark:text-white">
                                {exercise.progress}%
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <motion.div
                                className={`h-full bg-gradient-to-r ${getCategoryColor(
                                  exercise.category
                                )} rounded-full`}
                                initial={{ width: 0 }}
                                animate={{ width: `${exercise.progress}%` }}
                                transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                              />
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-4">
                            <div className="flex items-center gap-1">
                              <span>⏱️</span>
                              <span>{exercise.estimatedTime}min</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>🎯</span>
                              <span>{exercise.accuracy}% accuracy</span>
                            </div>
                          </div>

                          {/* Start Button */}
                          <motion.button
                            onClick={() => handleStartExercise(exercise)}
                            className={`w-full px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getCategoryColor(
                              exercise.category
                            )} shadow-lg hover:shadow-xl transition-all`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Start Practice
                          </motion.button>
                        </div>

                        {/* Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
                          initial={{ x: '-100%' }}
                          animate={{ x: '100%' }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 3 }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {filteredExercises.length === 0 && (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-8xl mb-4">🔍</div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    No exercises found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Try adjusting your filters to see more exercises.
                  </p>
                </motion.div>
              )}
            </motion.section>
          </>
        ) : showResults ? (
          // Results View
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 p-8 sm:p-12 shadow-2xl">
              {/* Confetti Background */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: ['#ef4444', '#8b5cf6', '#3b82f6', '#f59e0b'][i % 4],
                      left: `${Math.random() * 100}%`,
                      top: '-10%',
                    }}
                    animate={{
                      y: ['0vh', '110vh'],
                      rotate: [0, 360],
                      opacity: [1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </div>

              <div className="relative z-10 text-center">
                <motion.div
                  className="text-8xl mb-6"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {score / mockQuestions.length >= 0.8
                    ? '🎉'
                    : score / mockQuestions.length >= 0.6
                      ? '👍'
                      : '📚'}
                </motion.div>

                <h2 className="text-4xl font-black gradient-text bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 mb-4">
                  Exercise Complete!
                </h2>

                <div className="space-y-6 mb-8">
                  <div className="text-center">
                    <div className="text-6xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                      {score}/{mockQuestions.length}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-semibold">
                      Correct Answers
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-black/30">
                      <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {Math.round((score / mockQuestions.length) * 100)}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Accuracy
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-white/50 dark:bg-black/30">
                      <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                        {formatTime(300 - timeLeft)}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        Time Taken
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.button
                    onClick={handleReturnToList}
                    className="flex-1 px-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-purple-600 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Back to Exercises
                  </motion.button>
                  <motion.button
                    onClick={() => {
                      setCurrentQuestion(0)
                      setSelectedAnswer(null)
                      setScore(0)
                      setTimeLeft(300)
                      setIsTimerActive(true)
                      setShowResults(false)
                    }}
                    className="flex-1 px-6 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg hover:shadow-xl transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Try Again
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          // Exercise View
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Question {currentQuestion + 1} of {mockQuestions.length}
                </span>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  Score: {score}/{mockQuestions.length}
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                className="relative overflow-hidden rounded-3xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 p-8 sm:p-12 shadow-2xl"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Background Pattern */}
                <div className="absolute top-4 right-4 text-9xl japanese-text opacity-5 pointer-events-none select-none">
                  問
                </div>

                <div className="relative z-10">
                  {/* Question */}
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-8">
                    {mockQuestions[currentQuestion].question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-4 mb-8">
                    {mockQuestions[currentQuestion].options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left px-6 py-4 rounded-xl font-semibold transition-all ${
                          selectedAnswer === index
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105'
                            : 'bg-white/50 dark:bg-black/30 text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-black/50 hover:scale-102'
                        }`}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="mr-4 text-lg">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </motion.button>
                    ))}
                  </div>

                  {/* Next Button */}
                  <div className="flex gap-4">
                    <motion.button
                      onClick={handleReturnToList}
                      className="px-6 py-4 rounded-xl font-bold text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-black/30 hover:bg-white/80 dark:hover:bg-black/50 transition-all"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Exit
                    </motion.button>
                    <motion.button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null}
                      className={`flex-1 px-6 py-4 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all ${
                        selectedAnswer === null
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-green-600 to-emerald-600'
                      }`}
                      whileHover={selectedAnswer !== null ? { scale: 1.05 } : {}}
                      whileTap={selectedAnswer !== null ? { scale: 0.95 } : {}}
                    >
                      {currentQuestion === mockQuestions.length - 1 ? 'Finish' : 'Next Question'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  )
}
