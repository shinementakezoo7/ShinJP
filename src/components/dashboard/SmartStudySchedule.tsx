'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ScheduleItem {
  id: number
  time: string
  title: string
  description: string
  type: 'lesson' | 'review' | 'practice' | 'break'
  duration: number // minutes
  difficulty: 'easy' | 'medium' | 'hard'
  aiRecommended: boolean
  completed: boolean
  optimalScore: number // 0-100 AI confidence
}

export default function SmartStudySchedule() {
  const [selectedDay, setSelectedDay] = useState('today')
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: 1,
      time: '09:00',
      title: 'Morning Vocabulary Review',
      description: 'Review 50 vocabulary words from yesterday',
      type: 'review',
      duration: 15,
      difficulty: 'easy',
      aiRecommended: true,
      completed: true,
      optimalScore: 95,
    },
    {
      id: 2,
      time: '10:30',
      title: 'New Kanji Lesson',
      description: 'Learn N3 Kanji: 建物 (building)',
      type: 'lesson',
      duration: 30,
      difficulty: 'medium',
      aiRecommended: true,
      completed: false,
      optimalScore: 88,
    },
    {
      id: 3,
      time: '14:00',
      title: 'Grammar Practice',
      description: 'Practice particles with interactive exercises',
      type: 'practice',
      duration: 20,
      difficulty: 'medium',
      aiRecommended: true,
      completed: false,
      optimalScore: 92,
    },
    {
      id: 4,
      time: '15:30',
      title: 'Take a Break',
      description: 'Optimal break time for better retention',
      type: 'break',
      duration: 10,
      difficulty: 'easy',
      aiRecommended: true,
      completed: false,
      optimalScore: 100,
    },
    {
      id: 5,
      time: '19:00',
      title: 'Evening Spaced Repetition',
      description: 'Review words from 3 days ago (optimal timing)',
      type: 'review',
      duration: 25,
      difficulty: 'hard',
      aiRecommended: true,
      completed: false,
      optimalScore: 90,
    },
  ])

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'from-blue-500 to-cyan-600'
      case 'review':
        return 'from-purple-500 to-pink-600'
      case 'practice':
        return 'from-green-500 to-emerald-600'
      case 'break':
        return 'from-orange-500 to-amber-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return '📚'
      case 'review':
        return '🔄'
      case 'practice':
        return '⚡'
      case 'break':
        return '☕'
      default:
        return '📋'
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'lesson':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
      case 'review':
        return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
      case 'practice':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'break':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
    }
  }

  const completedCount = scheduleItems.filter((item) => item.completed).length
  const totalCount = scheduleItems.length
  const todayProgress = (completedCount / totalCount) * 100
  const totalMinutes = scheduleItems.reduce((sum, item) => sum + item.duration, 0)
  const completedMinutes = scheduleItems
    .filter((item) => item.completed)
    .reduce((sum, item) => sum + item.duration, 0)

  const toggleComplete = (id: number) => {
    setScheduleItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
            🎯
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                Smart Study Schedule
              </h2>
              <div className="px-2 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-md animate-pulse">
                AI
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Optimized for your learning patterns
            </p>
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
          {['yesterday', 'today', 'tomorrow'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {day.charAt(0).toUpperCase() + day.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              Tasks Complete
            </span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            {completedCount}/{totalCount}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {Math.round(todayProgress)}% done today
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Study Time</span>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {completedMinutes}m
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {totalMinutes}m total planned
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
              AI Confidence
            </span>
            <span className="text-2xl">🤖</span>
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
            92%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Optimal schedule</div>
        </motion.div>
      </div>

      {/* AI Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="relative p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 flex items-start gap-4 text-white">
          <div className="text-4xl animate-bounce-slow">💡</div>
          <div className="flex-1">
            <h3 className="font-black text-lg mb-2">AI Recommendation</h3>
            <p className="text-sm opacity-95 leading-relaxed">
              Your peak learning time is <strong>10:00-11:00 AM</strong>. We&apos;ve scheduled your
              hardest task during this window for maximum retention!
            </p>
          </div>
        </div>
      </motion.div>

      {/* Schedule Timeline */}
      <div className="space-y-3">
        <AnimatePresence>
          {scheduleItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group"
            >
              <div
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 ${
                  item.completed
                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-500/30 dark:border-green-400/30'
                    : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 hover:shadow-xl'
                } shadow-lg`}
              >
                {/* AI Recommended Badge */}
                {item.aiRecommended && !item.completed && (
                  <div className="absolute -top-2 -right-2 px-3 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <span>🤖</span>
                    <span>{item.optimalScore}% Optimal</span>
                  </div>
                )}

                <div className="flex items-start gap-5">
                  {/* Time Badge */}
                  <div
                    className={`flex-shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg ${
                      item.completed
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : `bg-gradient-to-br ${getTypeColor(item.type)}`
                    } ${!item.completed && 'group-hover:scale-110 group-hover:rotate-3'} transition-all duration-300`}
                  >
                    <div className="text-2xl mb-1">{getTypeIcon(item.type)}</div>
                    <div className="text-xs font-bold text-white">{item.time}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3
                          className={`font-bold text-lg mb-1 ${
                            item.completed
                              ? 'text-gray-500 dark:text-gray-400 line-through'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-sm ${
                            item.completed
                              ? 'text-gray-400 dark:text-gray-500'
                              : 'text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {item.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getTypeBadgeColor(
                            item.type
                          )}`}
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <span>⏱️</span>
                          <span>{item.duration} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📊</span>
                          <span className="capitalize">{item.difficulty}</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => toggleComplete(item.id)}
                        className={`px-6 py-2 rounded-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 ${
                          item.completed
                            ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl'
                        }`}
                      >
                        {item.completed ? 'Completed ✓' : 'Start Now'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Completion Overlay */}
                {item.completed && (
                  <div className="absolute top-4 right-4 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                    <svg
                      className="w-8 h-8 text-white"
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center gap-4">
        <button className="flex-1 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2">
          <span className="text-xl">🔄</span>
          <span>Regenerate Schedule</span>
        </button>
        <button className="flex-1 p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
          <span className="text-xl">➕</span>
          <span>Add Custom Task</span>
        </button>
      </div>
    </div>
  )
}
