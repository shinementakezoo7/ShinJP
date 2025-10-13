'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useTheme } from '@/lib/theme/theme-context'

// Will use JapaneseCard components in a future enhancement
// const JapaneseCard = dynamic(() => import('@/components/japanese/JapaneseCard'), { ssr: false })

export default function EnhancedDashboardPage() {
  const {} = useTheme() // Theme context available if needed
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    setMounted(true)
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      id: 1,
      name: 'Lessons',
      value: '12',
      kanji: '課',
      subtext: 'Completed this week',
      change: '+4',
      trend: 'up',
      link: '/lessons',
      icon: '📚',
      color: 'from-red-500 to-pink-600',
      pattern: 'seigaiha',
    },
    {
      id: 2,
      name: 'Vocabulary',
      value: '342',
      kanji: '語彙',
      subtext: 'Words Mastered',
      change: '+23',
      trend: 'up',
      link: '/vocabulary',
      icon: '🌸',
      color: 'from-pink-500 to-purple-600',
      pattern: 'asanoha',
    },
    {
      id: 3,
      name: 'Study Streak',
      value: '7',
      kanji: '連続',
      subtext: 'Days Active',
      change: 'Keep going!',
      trend: 'stable',
      link: '/study',
      icon: '🔥',
      color: 'from-amber-500 to-orange-600',
      pattern: 'shippo',
    },
    {
      id: 4,
      name: 'JLPT Level',
      value: 'N3',
      kanji: '級',
      subtext: 'Current Rank',
      change: '15%',
      trend: 'up',
      link: '/progress',
      icon: '⭐',
      color: 'from-purple-500 to-indigo-600',
      pattern: 'kikko',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'Mastered Hiragana Basics',
      type: 'Achievement',
      description: 'Completed all hiragana characters with 95% accuracy',
      score: '95%',
      time: '2 hours ago',
      icon: '🏆',
      kanji: '成',
      color: 'from-yellow-500 to-amber-600',
    },
    {
      id: 2,
      title: 'Kanji Writing Practice',
      type: 'Practice',
      description: 'Practiced 15 new kanji characters',
      score: '15 chars',
      time: 'Yesterday',
      icon: '✍️',
      kanji: '書',
      color: 'from-green-500 to-emerald-600',
    },
    {
      id: 3,
      title: 'JLPT N3 Study Group',
      type: 'Community',
      description: 'Joined discussion on grammar points',
      score: '12 members',
      time: '2 days ago',
      icon: '👥',
      kanji: '友',
      color: 'from-blue-500 to-cyan-600',
    },
  ]

  const quickActions = [
    {
      name: 'Continue Learning',
      icon: '📚',
      emoji: '道',
      link: '/lessons',
      description: 'Resume your journey',
      gradient: 'from-red-500 to-pink-600',
    },
    {
      name: 'AI Textbooks',
      icon: '📕',
      emoji: '本',
      link: '/books',
      description: 'Generate personalized content',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Chat with Sensei',
      icon: '💬',
      emoji: '話',
      link: '/chat',
      description: 'Practice conversation',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      name: 'Practice Drills',
      icon: '⚡',
      emoji: '練',
      link: '/practice',
      description: 'Strengthen your skills',
      gradient: 'from-green-500 to-emerald-600',
    },
  ]

  // Japanese greeting based on time
  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 10) return { text: 'おはようございます', english: 'Good Morning', icon: '🌅' }
    if (hour < 17) return { text: 'こんにちは', english: 'Good Afternoon', icon: '☀️' }
    if (hour < 20) return { text: 'こんばんは', english: 'Good Evening', icon: '🌆' }
    return { text: 'おやすみなさい', english: 'Good Night', icon: '🌙' }
  }

  const greeting = getGreeting()

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-red-950/10 dark:to-purple-950/10">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🏯</div>
          <div className="text-2xl japanese-text font-bold text-red-600 dark:text-red-400">
            読み込み中...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-red-950/10 dark:to-purple-950/10 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Kanji Watermarks */}
        <div className="absolute top-20 left-20 text-[300px] japanese-text text-red-500/[0.02] dark:text-red-400/[0.02] select-none animate-float">
          学
        </div>
        <div
          className="absolute bottom-20 right-20 text-[300px] japanese-text text-purple-500/[0.02] dark:text-purple-400/[0.02] select-none animate-float"
          style={{ animationDelay: '2s' }}
        >
          道
        </div>

        {/* Seigaiha Wave Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.03]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="dash-seigaiha"
              x="0"
              y="0"
              width="140"
              height="70"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-red-800 dark:text-red-400"
              >
                <path d="M0,35 Q17.5,15 35,35 T70,35" />
                <path d="M35,35 Q52.5,15 70,35 T105,35" />
                <path d="M70,35 Q87.5,15 105,35 T140,35" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dash-seigaiha)" />
        </svg>
      </div>

      {/* Floating Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sakura-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${20 + i * 3}s`,
              top: '-50px',
            }}
          >
            <div className="text-4xl opacity-10 dark:opacity-5">🌸</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header */}
            <div className="mb-12 text-center">
              {/* Time-based Greeting */}
              <div className="inline-block relative mb-6">
                <div className="text-9xl opacity-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                  {greeting.icon}
                </div>
                <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-bold mb-3">
                  <span className="japanese-text text-red-600 dark:text-red-400 block mb-2">
                    {greeting.text}
                  </span>
                  <span className="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300">
                    {greeting.english}, Student
                  </span>
                </h1>
              </div>

              {/* Japanese Divider */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
                <span className="text-2xl">⛩️</span>
                <div className="h-px w-24 bg-gradient-to-r from-transparent via-red-500 to-transparent"></div>
              </div>

              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Your journey to mastering{' '}
                <span className="japanese-text font-bold text-red-600 dark:text-red-400">
                  日本語
                </span>{' '}
                continues with dedication and harmony
              </p>
            </div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {stats.map((stat, index) => (
                <div
                  key={stat.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={stat.link} className="block group">
                    <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl border-2 border-red-200/30 dark:border-red-800/30 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:border-red-500/50 p-6">
                      {/* Pattern Background */}
                      <div className="absolute inset-0 pointer-events-none opacity-5">
                        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                          <pattern
                            id={`pattern-${stat.id}`}
                            x="0"
                            y="0"
                            width="50"
                            height="50"
                            patternUnits="userSpaceOnUse"
                          >
                            <circle
                              cx="25"
                              cy="25"
                              r="20"
                              stroke="currentColor"
                              strokeWidth="1"
                              fill="none"
                              className="text-red-800 dark:text-red-400"
                            />
                          </pattern>
                          <rect width="100%" height="100%" fill={`url(#pattern-${stat.id})`} />
                        </svg>
                      </div>

                      {/* Large Kanji Background */}
                      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-7xl japanese-text text-red-800/10 dark:text-red-400/10 font-black select-none">
                        {stat.kanji}
                      </div>

                      {/* Content */}
                      <div className="relative">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                          >
                            {stat.icon}
                          </div>
                          {stat.trend === 'up' && (
                            <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-bold">
                              {stat.change}
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                                />
                              </svg>
                            </div>
                          )}
                          {stat.trend === 'stable' && (
                            <div className="text-amber-600 dark:text-amber-400 text-sm font-bold">
                              {stat.change}
                            </div>
                          )}
                        </div>

                        {/* Value */}
                        <div className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                          {stat.value}
                        </div>

                        {/* Labels */}
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {stat.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {stat.subtext}
                        </div>
                      </div>

                      {/* Hover Effect - Arrow */}
                      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg
                          className="w-5 h-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Activity - 2 columns */}
              <div className="lg:col-span-2 animate-slide-in-left">
                <div className="rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl border-2 border-red-200/30 dark:border-red-800/30 shadow-xl p-6">
                  {/* Section Header */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <span className="japanese-text text-3xl text-red-600 dark:text-red-400">
                        活動
                      </span>
                      <span>Recent Activity</span>
                    </h2>
                    <Link
                      href="/activity"
                      className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 font-medium"
                    >
                      View All →
                    </Link>
                  </div>

                  {/* Activity Cards */}
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-5 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] animate-fade-in"
                        style={{ animationDelay: `${(index + 4) * 100}ms` }}
                      >
                        {/* Background Kanji */}
                        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 text-6xl japanese-text text-gray-300/20 dark:text-gray-700/20 font-black select-none">
                          {activity.kanji}
                        </div>

                        <div className="relative flex items-center gap-4">
                          {/* Icon Badge */}
                          <div
                            className={`flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br ${activity.color} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform`}
                          >
                            {activity.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                                  {activity.title}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {activity.description}
                                </p>
                              </div>
                              <span className="flex-shrink-0 px-3 py-1 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full">
                                {activity.type}
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-4 h-4 text-green-500"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                  {activity.score}
                                </span>
                              </div>

                              <span className="text-gray-400">•</span>

                              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{activity.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Actions & Progress - 1 column */}
              <div className="space-y-8 animate-slide-in-right">
                {/* Quick Actions */}
                <div className="rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl border-2 border-purple-200/30 dark:border-purple-800/30 shadow-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-6">
                    <span className="japanese-text text-3xl text-purple-600 dark:text-purple-400">
                      始
                    </span>
                    <span>Quick Start</span>
                  </h2>

                  <div className="space-y-3">
                    {quickActions.map((action, index) => (
                      <Link
                        key={action.name}
                        href={action.link}
                        className="block group animate-fade-in"
                        style={{ animationDelay: `${(index + 7) * 100}ms` }}
                      >
                        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-white/50 to-white/30 dark:from-gray-800/50 dark:to-gray-900/30 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                          {/* Background Emoji */}
                          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-4xl japanese-text text-gray-300/20 dark:text-gray-700/20 font-black select-none">
                            {action.emoji}
                          </div>

                          <div className="relative flex items-center gap-3">
                            {/* Icon */}
                            <div
                              className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}
                            >
                              {action.icon}
                            </div>

                            {/* Text */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                {action.name}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {action.description}
                              </div>
                            </div>

                            {/* Arrow */}
                            <svg
                              className="w-5 h-5 text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 group-hover:translate-x-1 transition-all flex-shrink-0"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Motivational Card */}
                <div
                  className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 p-6 shadow-xl animate-fade-in"
                  style={{ animationDelay: '1100ms' }}
                >
                  <div className="absolute top-0 right-0 text-9xl opacity-10 pointer-events-none select-none">
                    🌸
                  </div>
                  <div className="relative text-white">
                    <h3 className="text-2xl font-bold japanese-text mb-3">頑張って！</h3>
                    <p className="text-sm opacity-90 leading-relaxed">
                      Every kanji learned, every grammar point mastered, brings you closer to
                      fluency. Your dedication today shapes your mastery tomorrow.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        💪
                      </div>
                      <span className="text-xs font-medium">Keep up the great work!</span>
                    </div>
                  </div>
                </div>

                {/* Daily Progress */}
                <div
                  className="rounded-2xl bg-white/80 dark:bg-black/40 backdrop-blur-xl border-2 border-green-200/30 dark:border-green-800/30 shadow-xl p-6 animate-fade-in"
                  style={{ animationDelay: '1200ms' }}
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <span className="japanese-text text-2xl text-green-600 dark:text-green-400">
                      今日
                    </span>
                    <span>Today&apos;s Progress</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Study Time</span>
                      <span className="font-bold text-gray-900 dark:text-white">2h 45m</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Words Learned</span>
                      <span className="font-bold text-gray-900 dark:text-white">23</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Accuracy</span>
                      <span className="font-bold text-green-600 dark:text-green-400">92%</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">Daily Goal</span>
                      <span className="text-xs font-bold text-gray-900 dark:text-white">68%</span>
                    </div>
                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 shadow-sm"
                        style={{ width: '68%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
