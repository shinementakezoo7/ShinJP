'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

interface DayData {
  date: string
  count: number
  level: number // 0-4 intensity levels
  lessons?: number
  vocabulary?: number
  kanji?: number
}

// Japanese themed color palette
const getJapaneseLevelColor = (level: number, theme: string) => {
  const isDark = theme === 'dark'
  switch (level) {
    case 0:
      return isDark ? 'bg-gray-800/50' : 'bg-gray-100'
    case 1:
      return isDark ? 'bg-emerald-900/60' : 'bg-emerald-100'
    case 2:
      return isDark ? 'bg-emerald-700/70' : 'bg-emerald-300'
    case 3:
      return isDark ? 'bg-emerald-600/80' : 'bg-emerald-500'
    case 4:
      return isDark ? 'bg-emerald-500/90' : 'bg-emerald-600'
    default:
      return isDark ? 'bg-gray-800/50' : 'bg-gray-100'
  }
}

const getJapaneseGradient = (level: number) => {
  switch (level) {
    case 0:
      return 'from-gray-300 to-gray-400'
    case 1:
      return 'from-emerald-300 to-emerald-400'
    case 2:
      return 'from-emerald-400 to-emerald-500'
    case 3:
      return 'from-emerald-500 to-emerald-600'
    case 4:
      return 'from-emerald-600 to-emerald-700'
    default:
      return 'from-gray-300 to-gray-400'
  }
}

export default function CalendarHeatmap() {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Generate realistic mock data for the last 12 weeks
  const generateHeatmapData = (): DayData[] => {
    const data: DayData[] = []
    const today = new Date()

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // More realistic activity patterns
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      const baseActivity = isWeekend ? 0.6 : 1 // More activity on weekdays
      const randomFactor = 0.3 + Math.random() * 0.7
      const count = Math.floor(Math.random() * 50 * baseActivity * randomFactor)

      const level = count === 0 ? 0 : count < 10 ? 1 : count < 20 ? 2 : count < 35 ? 3 : 4

      // Add detailed learning metrics
      const lessons = Math.floor(Math.random() * 5)
      const vocabulary = Math.floor(Math.random() * 20)
      const kanji = Math.floor(Math.random() * 10)

      data.push({
        date: date.toISOString().split('T')[0],
        count,
        level,
        lessons,
        vocabulary,
        kanji,
      })
    }

    return data
  }

  const [heatmapData] = useState<DayData[]>(generateHeatmapData())

  // Organize data by weeks
  const organizeByWeeks = () => {
    const weeks: DayData[][] = []
    let currentWeek: DayData[] = []

    heatmapData.forEach((day, index) => {
      const dayOfWeek = new Date(day.date).getDay()

      if (dayOfWeek === 0 && currentWeek.length > 0) {
        weeks.push(currentWeek)
        currentWeek = []
      }

      currentWeek.push(day)

      if (index === heatmapData.length - 1) {
        weeks.push(currentWeek)
      }
    })

    return weeks
  }

  const weeks = organizeByWeeks()

  const totalDays = heatmapData.filter((d) => d.count > 0).length
  const currentStreak = (() => {
    let streak = 0
    for (let i = heatmapData.length - 1; i >= 0; i--) {
      if (heatmapData[i].count > 0) {
        streak++
      } else {
        break
      }
    }
    return streak
  })()

  const longestStreak = (() => {
    let max = 0
    let current = 0
    heatmapData.forEach((day) => {
      if (day.count > 0) {
        current++
        max = Math.max(max, current)
      } else {
        current = 0
      }
    })
    return max
  })()

  const totalMinutes = heatmapData.reduce((sum, day) => sum + day.count, 0)
  const totalLessons = heatmapData.reduce((sum, day) => sum + (day.lessons || 0), 0)
  const totalVocabulary = heatmapData.reduce((sum, day) => sum + (day.vocabulary || 0), 0)
  const totalKanji = heatmapData.reduce((sum, day) => sum + (day.kanji || 0), 0)

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  // Get motivational message based on activity
  const getMotivationalMessage = () => {
    if (currentStreak >= 30)
      return {
        emoji: '🏆',
        title: 'Legendary Dedication!',
        message: 'You are a true master of consistency!',
      }
    if (currentStreak >= 14)
      return { emoji: '⚡', title: 'Amazing Streak!', message: 'Your dedication is inspiring!' }
    if (currentStreak >= 7)
      return { emoji: '🔥', title: 'On Fire!', message: 'Keep up the excellent work!' }
    if (currentStreak >= 3)
      return { emoji: '✨', title: 'Great Progress!', message: "You're building great habits!" }
    return {
      emoji: '🌱',
      title: 'Keep Growing!',
      message: 'Every day is a new opportunity to learn!',
    }
  }

  const motivational = getMotivationalMessage()

  if (!mounted) return null

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Japanese Theme */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 flex items-center justify-center text-2xl shadow-xl"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="relative z-10">📅</span>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl" />
          </motion.div>
          <div>
            <motion.h2
              className="text-3xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              学習活動
              <span className="ml-2 text-gray-900 dark:text-white">Activity Heatmap</span>
            </motion.h2>
            <motion.p
              className="text-sm text-gray-600 dark:text-gray-400 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Last 12 weeks of your Japanese learning journey
            </motion.p>
          </div>
        </div>

        {/* Japanese Pattern Decoration */}
        <div className="hidden sm:block relative w-24 h-16 opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/30 via-teal-400/30 to-cyan-400/30 rounded-full blur-xl" />
          <div className="absolute top-2 right-2 text-4xl japanese-text text-emerald-600/40 dark:text-emerald-400/40 font-black">
            勉
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Summary with Japanese Theme */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="group relative p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            日
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
            {totalDays}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Active Days</div>
          <div className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            {totalLessons} lessons completed
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="group relative p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            連
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
            {currentStreak}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Current Streak
          </div>
          <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 font-medium">
            {longestStreak} day record
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="group relative p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            時
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            {totalMinutes}m
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total Time</div>
          <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-medium">
            {Math.round(totalMinutes / 60)}h {totalMinutes % 60}m
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="group relative p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
        >
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
            語
          </div>
          <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {totalVocabulary}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Words Learned
          </div>
          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 font-medium">
            {totalKanji} kanji mastered
          </div>
        </motion.div>
      </div>

      {/* Enhanced Heatmap with Japanese Aesthetics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl overflow-hidden"
      >
        {/* Japanese Pattern Background */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern
              id="seigaiha"
              x="0"
              y="0"
              width="100"
              height="86.6"
              patternUnits="userSpaceOnUse"
            >
              <g stroke="currentColor" strokeWidth="1" fill="none" className="text-emerald-600">
                <path d="M50,0 L75,43.3 L50,86.6 L25,43.3 Z" />
              </g>
            </pattern>
            <rect width="100%" height="100%" fill="url(#seigaiha)" />
          </svg>
        </div>

        {/* Decorative Kanji */}
        <div className="absolute top-4 right-4 text-9xl japanese-text text-emerald-800/5 dark:text-emerald-400/5 pointer-events-none select-none font-black">
          勉
        </div>

        <div className="relative z-10">
          <div className="min-w-[600px]">
            {/* Month Labels with Japanese Style */}
            <div className="flex mb-3 pl-8">
              {monthNames.map((month, index) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="flex-1 text-xs font-bold text-gray-600 dark:text-gray-400 text-center tracking-wide"
                >
                  {month}
                </motion.div>
              ))}
            </div>

            {/* Heatmap Grid */}
            <div className="flex gap-1">
              {/* Day labels with Japanese characters */}
              <div className="flex flex-col gap-1 pr-3">
                {dayNames.map((day, index) => (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.05 }}
                    className="h-3 flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400"
                  >
                    {index % 2 === 1 ? (
                      <span className="flex items-center gap-1">
                        <span className="japanese-text text-xs opacity-70">
                          {['日', '月', '火', '水', '木', '金', '土'][index]}
                        </span>
                        <span className="hidden lg:inline">{day}</span>
                      </span>
                    ) : (
                      ''
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Weeks */}
              <div className="flex gap-1 flex-1">
                {weeks.map((week, weekIndex) => (
                  <motion.div
                    key={weekIndex}
                    className="flex flex-col gap-1 flex-1"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: weekIndex * 0.02 }}
                  >
                    {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                      const dayData = week.find((d) => new Date(d.date).getDay() === dayIndex)

                      if (!dayData) {
                        return <div key={dayIndex} className="h-3" />
                      }

                      return (
                        <motion.div
                          key={dayData.date}
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: weekIndex * 0.02 + dayIndex * 0.01,
                            type: 'spring',
                            stiffness: 300,
                          }}
                          onMouseEnter={() => setHoveredDay(dayData)}
                          onMouseLeave={() => setHoveredDay(null)}
                          className={`h-3 rounded-sm ${getJapaneseLevelColor(dayData.level, theme || 'light')} 
                            cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-emerald-500 hover:scale-150 
                            hover:shadow-lg hover:z-10 relative overflow-hidden`}
                          whileHover={{ scale: 1.5, zIndex: 10 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Subtle shine effect on hover */}
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 
                            opacity-0 hover:opacity-100 transition-opacity duration-300 transform -skew-x-12"
                          />
                        </motion.div>
                      )
                    })}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Enhanced Legend with Japanese Style */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="japanese-text">少</span>
                <span>Less</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((level) => (
                  <motion.div
                    key={level}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + level * 0.1 }}
                    className={`w-4 h-4 rounded-sm ${getJapaneseLevelColor(level, theme || 'light')} 
                      border border-gray-300/20 dark:border-gray-600/20`}
                  />
                ))}
              </div>
              <div className="text-xs font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span>More</span>
                <span className="japanese-text">多</span>
              </div>
            </div>
          </div>

          {/* Enhanced Hover Tooltip */}
          <AnimatePresence>
            {hoveredDay && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="mt-4 p-6 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl shadow-2xl border border-white/20"
              >
                <div className="text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-black text-lg">
                      {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-2xl japanese-text opacity-80">勉強</div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="font-bold mb-1">⏰ Study Time</div>
                      <div className="text-lg font-black">
                        {hoveredDay.count > 0 ? `${hoveredDay.count} min` : 'No study'}
                      </div>
                    </div>

                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="font-bold mb-1">📚 Lessons</div>
                      <div className="text-lg font-black">{hoveredDay.lessons || 0} completed</div>
                    </div>

                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="font-bold mb-1">✨ Vocabulary</div>
                      <div className="text-lg font-black">{hoveredDay.vocabulary || 0} words</div>
                    </div>

                    <div className="bg-white/20 rounded-lg p-3">
                      <div className="font-bold mb-1">漢字 Kanji</div>
                      <div className="text-lg font-black">{hoveredDay.kanji || 0} characters</div>
                    </div>
                  </div>

                  {hoveredDay.count === 0 && (
                    <div className="mt-4 p-3 bg-white/10 rounded-lg text-center">
                      <div className="text-sm opacity-90">
                        Take a break today, tomorrow is a new day to learn!
                      </div>
                      <div className="text-xs japanese-text mt-1">明日頑張りましょう</div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Enhanced Motivational Message with Japanese Theme */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative p-8 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 rounded-2xl shadow-2xl text-white overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl" />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-6">
          <motion.div
            className="text-5xl"
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {motivational.emoji}
          </motion.div>

          <div className="flex-1">
            <motion.h3
              className="text-2xl font-black mb-2 flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              {motivational.title}
              <span className="text-3xl japanese-text opacity-80">頑張って！</span>
            </motion.h3>

            <motion.p
              className="text-lg opacity-95 font-medium"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              {motivational.message}
            </motion.p>

            <motion.div
              className="mt-4 flex items-center gap-4 text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
                {totalDays} days active
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
                {Math.round(totalMinutes / 60)} hours studied
              </span>
              <span className="bg-white/20 px-3 py-1 rounded-full font-bold">
                {totalVocabulary} words learned
              </span>
            </motion.div>
          </div>

          {/* Decorative Elements */}
          <div className="hidden lg:block relative">
            <div className="text-8xl japanese-text text-white/20 font-black">道</div>
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-white/40 rounded-full animate-pulse" />
            <div
              className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/30 rounded-full animate-pulse"
              style={{ animationDelay: '0.5s' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
