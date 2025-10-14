'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface DayData {
  date: string
  count: number
  level: number // 0-4 intensity levels
}

export default function CalendarHeatmap() {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())

  // Generate mock data for the last 12 weeks
  const generateHeatmapData = (): DayData[] => {
    const data: DayData[] = []
    const today = new Date()

    for (let i = 83; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      // Random activity levels (0-4)
      const count = Math.floor(Math.random() * 50)
      const level = count === 0 ? 0 : count < 10 ? 1 : count < 20 ? 2 : count < 35 ? 3 : 4

      data.push({
        date: date.toISOString().split('T')[0],
        count,
        level,
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

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0:
        return 'bg-gray-200 dark:bg-gray-800'
      case 1:
        return 'bg-green-200 dark:bg-green-900'
      case 2:
        return 'bg-green-400 dark:bg-green-700'
      case 3:
        return 'bg-green-500 dark:bg-green-600'
      case 4:
        return 'bg-green-600 dark:bg-green-500'
      default:
        return 'bg-gray-200 dark:bg-gray-800'
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-2xl shadow-lg">
            📅
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Activity Heatmap</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Last 12 weeks of activity</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="text-3xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
            {totalDays}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Active Days</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-1">
            {currentStreak}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Current Streak
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            {longestStreak}
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
            Longest Streak
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
        >
          <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-1">
            {totalMinutes}m
          </div>
          <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Total Time</div>
        </motion.div>
      </div>

      {/* Heatmap */}
      <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Month Labels */}
          <div className="flex mb-2 pl-8">
            {monthNames.map((month, index) => (
              <div
                key={month}
                className="flex-1 text-xs font-semibold text-gray-600 dark:text-gray-400 text-center"
              >
                {month}
              </div>
            ))}
          </div>

          {/* Heatmap Grid */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col gap-1 pr-2">
              {dayNames.map((day, index) => (
                <div
                  key={day}
                  className="h-3 flex items-center text-xs font-semibold text-gray-600 dark:text-gray-400"
                >
                  {index % 2 === 1 ? day : ''}
                </div>
              ))}
            </div>

            {/* Weeks */}
            <div className="flex gap-1 flex-1">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-1 flex-1">
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
                        transition={{ delay: weekIndex * 0.02 + dayIndex * 0.01 }}
                        onMouseEnter={() => setHoveredDay(dayData)}
                        onMouseLeave={() => setHoveredDay(null)}
                        className={`h-3 rounded-sm ${getLevelColor(dayData.level)} cursor-pointer transition-all duration-200 hover:ring-2 hover:ring-green-500 hover:scale-125`}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">Less</div>
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((level) => (
                <div key={level} className={`w-4 h-4 rounded-sm ${getLevelColor(level)}`} />
              ))}
            </div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">More</div>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredDay && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-xl"
          >
            <div className="text-white">
              <div className="font-bold text-sm mb-1">
                {new Date(hoveredDay.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>
              <div className="text-sm opacity-90">
                {hoveredDay.count > 0 ? `${hoveredDay.count} minutes studied` : 'No activity'}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Encouragement Message */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl text-white text-center"
      >
        <div className="text-3xl mb-3">🎯</div>
        <h3 className="text-xl font-black mb-2">Keep Up the Great Work!</h3>
        <p className="text-sm opacity-90">
          You&apos;ve been active for {totalDays} days. Consistency is key to mastering Japanese!
        </p>
      </motion.div>
    </div>
  )
}
