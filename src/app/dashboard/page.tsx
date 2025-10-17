'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUserStore } from '@/stores/userStore'
import { useDashboard } from '@/hooks/useDashboard'
import { useAnalytics } from '@/hooks/useAnalytics'
import { createStudySession, endStudySession } from '@/lib/database/functions/analytics'
import { EnhancedStatCard } from '@/components/dashboard/EnhancedStatCard'
import { EnhancedActivityCard } from '@/components/dashboard/EnhancedActivityCard'
import { EnhancedQuickActionCard } from '@/components/dashboard/EnhancedQuickActionCard'

// Dynamically import heavy dashboard widgets with skeleton fallbacks to improve
// initial navigation responsiveness and reduce main bundle size.
const DailyQuests = dynamic(() => import('@/components/dashboard/DailyQuests'), {
  ssr: false,
  loading: () => <ComponentSkeleton title="Daily Quests" />,
})
const AchievementShowcase = dynamic(() => import('@/components/dashboard/AchievementShowcase'), {
  ssr: false,
  loading: () => <ComponentSkeleton title="Achievements" />,
})
const CalendarHeatmap = dynamic(() => import('@/components/dashboard/CalendarHeatmap'), {
  ssr: false,
  loading: () => <ComponentSkeleton title="Study Heatmap" />,
})
const SmartStudySchedule = dynamic(() => import('@/components/dashboard/SmartStudySchedule'), {
  ssr: false,
  loading: () => <ComponentSkeleton title="Smart Study" />,
})
const LiveLeaderboards = dynamic(() => import('@/components/dashboard/LiveLeaderboards'), {
  ssr: false,
  loading: () => <ComponentSkeleton title="Leaderboards" />,
})

const CherryBlossomScene = dynamic(() => import('@/components/japanese/CherryBlossomScene'), {
  ssr: false,
  loading: () => null,
})

export default function DashboardPageRedesigned() {
  // Keep mounted state only for client-side animations; do not gate initial render
  const [mounted, setMounted] = useState(false)
  const [showCherryBlossoms, setShowCherryBlossoms] = useState(false)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [counters, setCounters] = useState({
    lessons: 0,
    vocabulary: 0,
    streak: 0,
  })
  const { profile } = useUserStore()
  const userId = profile?.id || 'anonymous'
  const { stats, achievementsCount, loading: dashLoading, error: dashError } = useDashboard(userId)
  const { trackFeatureUsed } = useAnalytics()
  const sessionIdRef = useRef<number | null>(null)
  const sessionStartRef = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
    // Show cherry blossoms after main content loads
    const timer = setTimeout(() => {
      setShowCherryBlossoms(true)
    }, 800) // After main animations complete
    return () => clearTimeout(timer)
  }, [])

  // Animate counters when stats arrive
  useEffect(() => {
    if (!mounted) return
    const targets = {
      lessons: stats.lessonsCompleted || 0,
      vocabulary: stats.vocabularyLearned || 0,
      streak: stats.streakDays || 0,
    }
    const timers: NodeJS.Timeout[] = []
    ;(Object.keys(targets) as Array<'lessons' | 'vocabulary' | 'streak'>).forEach((key) => {
      let current = 0
      const target = targets[key]
      const steps = 40
      const increment = target / steps
      const t = setInterval(() => {
        current += increment
        if (current >= target) {
          setCounters((prev) => ({ ...prev, [key]: target }))
          clearInterval(t)
        } else {
          setCounters((prev) => ({ ...prev, [key]: Math.floor(current) }))
        }
      }, 20)
      timers.push(t)
    })
    return () => timers.forEach(clearInterval)
  }, [mounted, stats.lessonsCompleted, stats.vocabularyLearned, stats.streakDays])

  // Lightweight session tracking for dashboard
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const start = new Date()
        sessionStartRef.current = start.getTime()
        const s = await createStudySession({
          user_id: userId,
          start_time: start.toISOString(),
          end_time: null,
          duration: null,
          activities: { page: 'dashboard' },
        } as any)
        if (mounted && s) sessionIdRef.current = (s as any).id
      } catch (e) {
        // Silent fail
      }
    })()
    return () => {
      mounted = false
    }
  }, [userId])

  useEffect(() => {
    const handleUnload = async () => {
      if (!sessionStartRef.current || !sessionIdRef.current) return
      const end = new Date()
      const durationSec = Math.max(1, Math.floor((end.getTime() - sessionStartRef.current) / 1000))
      try {
        await endStudySession(sessionIdRef.current, end.toISOString(), durationSec, {
          page: 'dashboard',
        })
      } catch {}
    }
    window.addEventListener('beforeunload', handleUnload)
    return () => {
      handleUnload()
      window.removeEventListener('beforeunload', handleUnload)
    }
  }, [])

  const statsCards = [
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
      name: 'Achievements',
      value: achievementsCount,
      kanji: '級',
      subtext: 'Unlocked so far',
      link: '/dashboard',
      icon: '🏆',
      color: 'from-amber-500 via-yellow-500 to-orange-500',
      bgGlow: 'bg-amber-500/20',
      progress: Math.min(100, Math.floor((achievementsCount / 20) * 100)),
      trend: achievementsCount > 0 ? '+1 this week' : '—',
      trendUp: achievementsCount > 0,
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

  // Prefetch popular destinations to ensure instant navigation from dashboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Soft hint: Next.js prefetches visible links automatically, but we can
      // opportunistically warm up a few routes users often navigate to.
      try {
        const prefetchLinks = ['/lessons', '/vocabulary', '/practice', '/chat']
        prefetchLinks.forEach((href) => {
          const link = document.createElement('link')
          link.rel = 'prefetch'
          link.href = href
          document.head.appendChild(link)
        })
      } catch (_) {
        // no-op
      }
    }
  }, [])

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

  // Do not block initial render; heavy widgets load progressively with fallbacks

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-950/20 dark:to-purple-950/10 motion-smooth">
      {/* Enhanced Background Effects - Load after main content */}
      {showCherryBlossoms && <CherryBlossomScene />}

      {/* Animated gradient orbs - do not block interactions */}
      <div
        className="pointer-events-none absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse-slow"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse-slow"
        style={{ animationDelay: '2s' }}
        aria-hidden="true"
      />

      <div className="relative z-10 motion-smooth">
        {/* Hero Section - Enhanced */}
        <section className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-10 sm:pb-12 content-auto">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Header - Enhanced */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <div className="flex items-center gap-4 mb-3">
                    <motion.span
                      className="text-5xl"
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      👋
                    </motion.span>
                    <div>
                      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-2">
                        Welcome back,{' '}
                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
                          Student
                        </span>
                      </h1>
                      <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
                        Your learning journey continues •{' '}
                        <span className="japanese-text text-red-600 dark:text-red-400 font-bold">
                          道場
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Summary - Enhanced */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl hover:shadow-2xl transition-all"
                >
                  {[
                    {
                      value: '24h',
                      label: 'Study Time',
                      color: 'text-blue-600 dark:text-blue-400',
                    },
                    {
                      value: '85%',
                      label: 'Accuracy',
                      color: 'text-purple-600 dark:text-purple-400',
                    },
                    { value: '#12', label: 'Rank', color: 'text-green-600 dark:text-green-400' },
                  ].map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      className="text-center px-4 border-r border-gray-300 dark:border-gray-600 last:border-r-0"
                      whileHover={{ scale: 1.08, y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    >
                      <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                        {stat.label}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>

            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
              {statsCards.map((stat, index) => (
                <EnhancedStatCard
                  key={stat.id}
                  id={stat.id}
                  name={stat.name}
                  value={stat.value}
                  kanji={stat.kanji}
                  subtext={stat.subtext}
                  link={stat.link}
                  icon={stat.icon}
                  color={stat.color}
                  bgGlow={stat.bgGlow}
                  progress={stat.progress}
                  trend={stat.trend}
                  trendUp={stat.trendUp}
                  index={index}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Main Content Grid */}
        <section className="px-4 sm:px-6 lg:px-8 pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 content-auto">
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

                    {/* Filter Buttons - Enhanced */}
                    <motion.div className="flex items-center gap-2 p-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl">
                      {['all', 'lessons', 'practice'].map((filter) => (
                        <motion.button
                          key={filter}
                          onClick={() => setActiveFilter(filter)}
                          className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                            activeFilter === filter
                              ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-md'
                              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </motion.button>
                      ))}
                    </motion.div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="space-y-4">
                    <AnimatePresence>
                      {activities.map((activity, index) => (
                        <EnhancedActivityCard
                          key={activity.id}
                          id={activity.id}
                          title={activity.title}
                          type={activity.type}
                          score={activity.score}
                          time={activity.time}
                          icon={activity.icon}
                          colorGradient={activity.color}
                          index={index}
                          onRetry={() => console.log(`Retry ${activity.id}`)}
                          onShare={() => console.log(`Share ${activity.id}`)}
                        />
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
                      <EnhancedQuickActionCard
                        key={action.name}
                        name={action.name}
                        icon={action.icon}
                        link={action.link}
                        description={action.description}
                        gradient={action.gradient}
                        progress={action.progress}
                        recommended={action.recommended}
                        index={index}
                      />
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
        <section className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 content-auto">
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
        <section className="px-4 sm:px-6 lg:px-8 pb-10 sm:pb-12 content-auto">
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

// Lightweight component skeleton used as dynamic import fallbacks
function ComponentSkeleton({ title }: { title?: string }) {
  return (
    <div className="p-4 sm:p-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-sm animate-pulse">
      {title && (
        <div
          className="h-5 w-32 mb-4 bg-gray-300 dark:bg-gray-700 rounded"
          aria-label={`${title} loading`}
        />
      )}
      <div className="grid grid-cols-3 gap-3">
        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded" />
        <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded" />
      </div>
    </div>
  )
}
