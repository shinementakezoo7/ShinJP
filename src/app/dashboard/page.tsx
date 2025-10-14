'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DailyQuests from '@/components/dashboard/DailyQuests'
import AchievementShowcase from '@/components/dashboard/AchievementShowcase'
import CalendarHeatmap from '@/components/dashboard/CalendarHeatmap'
import SmartStudySchedule from '@/components/dashboard/SmartStudySchedule'
import LiveLeaderboards from '@/components/dashboard/LiveLeaderboards'

const CherryBlossomScene = dynamic(() => import('@/components/japanese/CherryBlossomScene'), {
  ssr: false,
})

export default function DashboardPageRedesigned() {
  const [mounted, setMounted] = useState(false)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [counters, setCounters] = useState({
    lessons: 0,
    vocabulary: 0,
    streak: 0,
  })

  useEffect(() => {
    setMounted(true)

    // Animated counters
    const animateCounter = (target: number, key: 'lessons' | 'vocabulary' | 'streak') => {
      let current = 0
      const increment = target / 50
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          setCounters((prev) => ({ ...prev, [key]: target }))
          clearInterval(timer)
        } else {
          setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
        }
      }, 20)
    }

    if (mounted) {
      animateCounter(12, 'lessons')
      animateCounter(342, 'vocabulary')
      animateCounter(7, 'streak')
    }
  }, [mounted])

  const stats = [
    {
      id: 1,
      name: 'Lessons Completed',
      value: counters.lessons,
      kanji: '課',
      subtext: '+4 today',
      link: '/lessons',
      icon: '📚',
      color: 'from-blue-500 via-cyan-500 to-teal-500',
      bgGlow: 'bg-blue-500/20',
      progress: 75,
      trend: '+12%',
      trendUp: true,
    },
    {
      id: 2,
      name: 'Vocabulary Words',
      value: counters.vocabulary,
      kanji: '語',
      subtext: '+23 this week',
      link: '/vocabulary',
      icon: '✨',
      color: 'from-purple-500 via-pink-500 to-rose-500',
      bgGlow: 'bg-purple-500/20',
      progress: 65,
      trend: '+8%',
      trendUp: true,
    },
    {
      id: 3,
      name: 'Day Streak',
      value: counters.streak,
      kanji: '日',
      subtext: 'Keep going!',
      link: '/study',
      icon: '🔥',
      color: 'from-orange-500 via-red-500 to-pink-500',
      bgGlow: 'bg-orange-500/20',
      progress: 100,
      trend: '+2 days',
      trendUp: true,
    },
    {
      id: 4,
      name: 'Current Level',
      value: 'N3',
      kanji: '級',
      subtext: '15% to N2',
      link: '/progress',
      icon: '⭐',
      color: 'from-amber-500 via-yellow-500 to-orange-500',
      bgGlow: 'bg-amber-500/20',
      progress: 45,
      trend: 'Expert',
      trendUp: true,
    },
  ]

  const activities = [
    {
      id: 1,
      title: 'Completed Hiragana Mastery',
      type: 'Lesson',
      score: 95,
      time: '2 hours ago',
      icon: '📖',
      color: 'blue',
      date: 'Today',
    },
    {
      id: 2,
      title: 'Practiced 50 Kanji Characters',
      type: 'Practice',
      score: 88,
      time: '5 hours ago',
      icon: '✍️',
      color: 'green',
      date: 'Today',
    },
    {
      id: 3,
      title: 'Joined JLPT N3 Study Group',
      type: 'Community',
      score: null,
      time: 'Yesterday',
      icon: '👥',
      color: 'purple',
      date: 'Yesterday',
    },
    {
      id: 4,
      title: 'Daily Vocabulary Review',
      type: 'Review',
      score: 92,
      time: '2 days ago',
      icon: '🔄',
      color: 'orange',
      date: 'This Week',
    },
  ]

  const quickActions = [
    {
      name: 'Continue Learning',
      icon: '📚',
      link: '/lessons',
      description: 'Lesson 13: Particles は & が',
      gradient: 'from-blue-500 to-cyan-600',
      progress: 60,
      recommended: true,
    },
    {
      name: 'Daily Challenge',
      icon: '🎯',
      link: '/challenges',
      description: '5 challenges remaining today',
      gradient: 'from-purple-500 to-pink-600',
      progress: 40,
      recommended: true,
    },
    {
      name: 'AI Chat Practice',
      icon: '💬',
      link: '/chat',
      description: 'Practice conversation',
      gradient: 'from-cyan-500 to-blue-600',
      progress: 0,
      recommended: false,
    },
    {
      name: 'Vocabulary Drill',
      icon: '⚡',
      link: '/practice',
      description: '15 new words ready',
      gradient: 'from-green-500 to-emerald-600',
      progress: 0,
      recommended: true,
    },
  ]

  if (!mounted) {
    return <LoadingSkeleton />
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10">
      {/* Enhanced Background Effects */}
      <CherryBlossomScene />

      {/* Animated gradient orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow" />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10">
        {/* Hero Section - Enhanced */}
        <section className="px-4 sm:px-6 lg:px-8 pt-8 pb-12">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-5xl animate-bounce-slow">👋</span>
                    <div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-2">
                        Welcome back,{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                          Student
                        </span>
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                        Your learning journey continues •{' '}
                        <span className="japanese-text text-red-600 dark:text-red-400">道場</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Summary */}
                <div className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl">
                  <div className="text-center px-4 border-r border-gray-300 dark:border-gray-600">
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400">24h</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                      Study Time
                    </div>
                  </div>
                  <div className="text-center px-4 border-r border-gray-300 dark:border-gray-600">
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                      85%
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                      Accuracy
                    </div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-2xl font-black text-green-600 dark:text-green-400">
                      #12
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                      Rank
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredStat(stat.id)}
                  onHoverEnd={() => setHoveredStat(null)}
                >
                  <Link href={stat.link}>
                    <div className="group relative h-full">
                      {/* Glow effect */}
                      <div
                        className={`absolute -inset-1 ${stat.bgGlow} rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                      />

                      <div className="relative h-full p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}
                          >
                            {stat.icon}
                          </div>

                          {/* Trend Badge */}
                          <div
                            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${stat.trendUp ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}
                          >
                            <span>{stat.trendUp ? '↑' : '↓'}</span>
                            <span>{stat.trend}</span>
                          </div>
                        </div>

                        {/* Value */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2 mb-2">
                            <span
                              className={`text-5xl font-black bg-gradient-to-br ${stat.color} bg-clip-text text-transparent`}
                            >
                              {stat.value}
                            </span>
                            <span className="text-3xl japanese-text text-gray-400 dark:text-gray-500">
                              {stat.kanji}
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
                            {stat.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                            {stat.subtext}
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                            <span>Progress</span>
                            <span>{stat.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${stat.progress}%` }}
                              transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                              className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                            />
                          </div>
                        </div>

                        {/* Hover Arrow */}
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M17 8l4 4m0 0l-4 4m4-4H3"
                            />
                          </svg>
                        </div>

                        {/* Background Kanji */}
                        <div className="absolute bottom-2 right-2 text-8xl japanese-text text-gray-100 dark:text-gray-800 opacity-50 pointer-events-none select-none font-black">
                          {stat.kanji}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity - 2 columns */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                        📊
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                          Recent Activity
                        </h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Your learning timeline
                        </p>
                      </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
                      {['all', 'lessons', 'practice'].map((filter) => (
                        <button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeFilter === filter
                              ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {activities.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group relative"
                        >
                          <div className="relative p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                            <div className="flex items-center gap-5">
                              {/* Icon */}
                              <div
                                className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 ${
                                  activity.color === 'blue'
                                    ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
                                    : activity.color === 'green'
                                      ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                                      : activity.color === 'purple'
                                        ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                        : 'bg-gradient-to-br from-orange-500 to-red-500'
                                }`}
                              >
                                {activity.icon}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                    {activity.title}
                                  </h3>
                                  <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-full whitespace-nowrap">
                                    {activity.type}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 text-sm">
                                  {activity.score && (
                                    <div className="flex items-center gap-2">
                                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
                                        <span className="text-white font-black text-sm">
                                          {activity.score}
                                        </span>
                                      </div>
                                      <span className="text-gray-600 dark:text-gray-400 font-medium">
                                        Score
                                      </span>
                                    </div>
                                  )}
                                  <span className="text-gray-400">•</span>
                                  <span className="text-gray-600 dark:text-gray-400 font-medium">
                                    {activity.time}
                                  </span>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex-shrink-0 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform">
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
                                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                    />
                                  </svg>
                                </button>
                                <button className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform">
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
                                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>

                    {/* View All Button */}
                    <Link href="/activity">
                      <div className="group p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-400 transition-all text-center cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/10">
                        <span className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 font-bold">
                          View All Activity
                          <svg
                            className="w-5 h-5 group-hover:translate-x-2 transition-transform"
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
                      </div>
                    </Link>
                  </div>
                </motion.div>
              </div>

              {/* Quick Actions - 1 column */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-2xl shadow-lg">
                      🚀
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                        Quick Start
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Recommended for you
                      </p>
                    </div>
                  </div>

                  {/* Action Cards */}
                  <div className="space-y-4">
                    {quickActions.map((action, index) => (
                      <motion.div
                        key={action.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      >
                        <Link href={action.link}>
                          <div className="group relative">
                            {action.recommended && (
                              <div className="absolute -top-3 -right-3 z-10 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold rounded-full shadow-lg animate-bounce-slow">
                                ⭐ Recommended
                              </div>
                            )}

                            <div className="relative p-5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                              <div className="flex items-center gap-4 mb-4">
                                <div
                                  className={`flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500`}
                                >
                                  {action.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                    {action.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {action.description}
                                  </p>
                                </div>
                                <svg
                                  className="w-6 h-6 text-gray-400 group-hover:translate-x-2 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-all flex-shrink-0"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={3}
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                  />
                                </svg>
                              </div>

                              {/* Progress */}
                              {action.progress > 0 && (
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                                    <span>In Progress</span>
                                    <span>{action.progress}%</span>
                                  </div>
                                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full bg-gradient-to-r ${action.gradient} rounded-full transition-all duration-1000`}
                                      style={{ width: `${action.progress}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>

                  {/* Motivational Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1 }}
                    className="mt-6"
                  >
                    <div className="relative p-8 bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 rounded-3xl shadow-2xl overflow-hidden">
                      {/* Animated background pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
                        <div
                          className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"
                          style={{ animationDelay: '1s' }}
                        />
                      </div>

                      <div className="relative z-10 flex items-start gap-4">
                        <div className="text-5xl animate-bounce-slow">💪</div>
                        <div>
                          <h3 className="font-black text-2xl japanese-text text-white mb-3 drop-shadow-lg">
                            頑張って！
                          </h3>
                          <p className="text-white/95 font-medium leading-relaxed mb-4">
                            You&apos;re making excellent progress! Keep up the great work.
                          </p>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-white/30 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: '68%' }}
                                transition={{ duration: 2, delay: 1.2 }}
                                className="h-full bg-white rounded-full"
                              />
                            </div>
                            <span className="text-white font-bold text-sm">68%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Daily Quests Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <DailyQuests />
            </motion.div>
          </div>
        </section>

        {/* Two Column: Calendar Heatmap & Leaderboards */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <CalendarHeatmap />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                <LiveLeaderboards />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Achievement Showcase Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <AchievementShowcase />
            </motion.div>
          </div>
        </section>

        {/* Smart Study Schedule Section */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
            >
              <SmartStudySchedule />
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10 p-8">
      <div className="max-w-7xl mx-auto animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-xl w-1/2 mb-4" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/3" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6">
              <div className="h-14 w-14 bg-gray-300 dark:bg-gray-700 rounded-2xl mb-4" />
              <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg mb-3" />
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
            </div>
          ))}
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-white/80 dark:bg-gray-800/80 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-white/80 dark:bg-gray-800/80 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
