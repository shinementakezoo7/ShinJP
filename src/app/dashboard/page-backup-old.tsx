'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const CherryBlossomScene = dynamic(() => import('@/components/japanese/CherryBlossomScene'), {
  ssr: false,
})

export default function DashboardPage() {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [counters, setCounters] = useState({
    lessons: 0,
    vocabulary: 0,
    streak: 0,
  })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const stats = [
    {
      id: 1,
      name: 'Lessons',
      value: '12',
      kanji: '課',
      subtext: 'Completed',
      change: '+4 today',
      link: '/lessons',
      icon: '📚',
      color: 'from-[#165E83] to-[#3A7CA5]',
      pattern: 'seigaiha' as const,
      gradient: 'ocean' as const,
    },
    {
      id: 2,
      name: 'Vocabulary',
      value: '342',
      kanji: '語',
      subtext: 'Words Mastered',
      change: '+23 this week',
      link: '/vocabulary',
      icon: '✨',
      color: 'from-[#6C8D2F] to-[#87A330]',
      pattern: 'asanoha' as const,
      gradient: 'autumn' as const,
    },
    {
      id: 3,
      name: 'Streak',
      value: '7',
      kanji: '日',
      subtext: 'Days Active',
      change: 'Keep going!',
      link: '/study',
      icon: '🔥',
      color: 'from-[#FFB11B] to-[#FFD166]',
      pattern: 'shippo' as const,
      gradient: 'sunset' as const,
    },
    {
      id: 4,
      name: 'Level',
      value: 'N3',
      kanji: '級',
      subtext: 'Current Rank',
      change: '15% to N2',
      link: '/progress',
      icon: '⭐',
      color: 'from-[#D9333F] to-[#F05959]',
      pattern: 'kikko' as const,
      gradient: 'sakura' as const,
    },
  ]

  const recentActivities = [
    {
      id: 1,
      title: 'Hiragana Basics',
      type: 'Lesson',
      score: '95%',
      time: '2 hours ago',
      icon: '📖',
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400',
    },
    {
      id: 2,
      title: 'Kanji Writing Practice',
      type: 'Practice',
      score: '15 chars',
      time: 'Yesterday',
      icon: '✍️',
      color: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
    },
    {
      id: 3,
      title: 'JLPT N3 Prep Study Group',
      type: 'Community',
      score: '12 members',
      time: '2 days ago',
      icon: '👥',
      color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
    },
  ]

  const quickActions = [
    {
      name: 'Continue Learning',
      icon: '📚',
      link: '/lessons',
      description: 'Resume your last lesson',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      name: 'AI Books',
      icon: '📕',
      link: '/books',
      description: 'Generate personalized content',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      name: 'Chat Practice',
      icon: '💬',
      link: '/chat',
      description: 'Converse with AI sensei',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      name: 'Practice Drills',
      icon: '⚡',
      link: '/practice',
      description: 'Strengthen your skills',
      gradient: 'from-green-500 to-emerald-600',
    },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-bg">
        <div className="text-center">
          <div className="text-5xl japanese-text mb-4 icon-pulse">🏯</div>
          <div className="text-2xl japanese-text stat-value">読み込み中...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden">
      {/* Three.js Background Layers */}
      <CherryBlossomScene />
      <MountFuji />

      {/* Traditional Japanese Patterns */}
      <AsanohaPattern className="opacity-50" />
      <SeigaihaWaves />

      {/* Komorebi Light Effect */}
      <div className="komorebi-light" style={{ top: '10%', left: '20%' }} />
      <div className="komorebi-light" style={{ top: '50%', right: '15%', animationDelay: '3s' }} />

      {/* Hero Section with Enhanced Design */}
      <section className="relative ma-spacing overflow-hidden z-10 kamon-accent">
        {/* Decorative Background Elements */}
        <div className="absolute top-10 right-10 text-9xl japanese-text opacity-[0.05] pointer-events-none select-none animate-float">
          桜
        </div>
        <div
          className="absolute bottom-10 left-10 text-9xl japanese-text opacity-[0.05] pointer-events-none select-none animate-float"
          style={{ animationDelay: '1s' }}
        >
          武
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[12rem] japanese-text opacity-[0.02] pointer-events-none select-none">
          学
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Welcome Header */}
          <div className="text-center ma-vertical animate-fade-in">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--indigo-blue)] to-transparent rounded-full"></div>
              <div className="text-6xl icon-pulse">🏯</div>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[var(--traditional-red)] to-transparent rounded-full"></div>
            </div>

            <h1 className="japanese-heading text-6xl sm:text-7xl lg:text-8xl mb-6 relative">
              <span className="japanese-text stat-value inline-block hover:scale-110 transition-transform cursor-default">
                道場
              </span>
            </h1>

            <p className="japanese-subtitle text-xl sm:text-2xl lg:text-3xl max-w-3xl mx-auto mb-3">
              Welcome back,{' '}
              <span className="font-bold text-[var(--indigo-blue)] dark:text-[var(--primary)]">
                Student
              </span>
            </p>
            <p className="text-base text-gray-600 dark:text-gray-400">
              Your journey to mastering Japanese continues here
            </p>
          </div>

          {/* Enhanced Stats Grid with Japanese Patterns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mt-16 animate-slide-up">
            {stats.map((stat, index) => (
              <Link
                key={stat.id}
                href={stat.link}
                className={`group animate-fade-in stagger-${index + 1} block`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <JapaneseCard
                  pattern={stat.pattern}
                  gradient={stat.gradient}
                  kanji={stat.kanji}
                  className="h-full"
                >
                  <div className="p-8">
                    {/* Icon and Badge */}
                    <div className="flex items-center justify-between mb-8">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl shadow-xl transform group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}
                      >
                        {stat.icon}
                      </div>
                      <div
                        className={`px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                      >
                        {stat.change}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-center space-y-3">
                      <div className="text-5xl sm:text-6xl font-black mb-3 stat-value drop-shadow-lg">
                        {stat.value}
                      </div>
                      <div className="text-base font-bold text-gray-800 dark:text-gray-200 tracking-wide">
                        {stat.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {stat.subtext}
                      </div>
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1">
                      <svg
                        className="w-6 h-6 text-red-700 dark:text-red-400"
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
                  </div>
                </JapaneseCard>
              </Link>
            ))}
          </div>
        </div>

        {/* Noren Divider */}
        <div className="noren-divider mt-16" />

        {/* Wave Pattern Decoration */}
        <div className="relative w-full mt-8">
          <WavePattern />
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Recent Activity - 2 columns */}
            <div className="lg:col-span-2 animate-slide-in-left relative">
              <BambooSection title="Recent Activity" titleKanji="歴" className="mb-8 relative z-10">
                {/* Activity Cards */}
                <div className="space-y-5">
                  {recentActivities.map((activity, index) => (
                    <JapaneseCard
                      key={activity.id}
                      pattern={index % 2 === 0 ? 'seigaiha' : 'asanoha'}
                      gradient={
                        index % 4 === 0
                          ? 'ocean'
                          : index % 4 === 1
                            ? 'sakura'
                            : index % 4 === 2
                              ? 'autumn'
                              : 'sunset'
                      }
                      className={`animate-fade-in stagger-${index + 4}`}
                    >
                      <div className="p-6">
                        <div className="flex items-center gap-5">
                          {/* Icon with Background */}
                          <div
                            className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${activity.color} shadow-xl transform hover:scale-110 hover:rotate-6 transition-all duration-300`}
                          >
                            {activity.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <h3 className="font-bold text-xl text-gray-900 dark:text-white tracking-tight">
                                {activity.title}
                              </h3>
                              <span className="text-xs font-bold px-4 py-2 bg-gradient-to-r from-red-700/80 to-orange-600/80 text-white rounded-full whitespace-nowrap shadow-md">
                                {activity.type}
                              </span>
                            </div>

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <svg
                                  className="w-5 h-5 text-green-600 dark:text-green-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="font-bold text-gray-800 dark:text-gray-200">
                                  {activity.score}
                                </span>
                              </div>

                              <span className="text-gray-400 font-bold">•</span>

                              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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
                    </JapaneseCard>
                  ))}

                  {/* View All Button */}
                  <Link
                    href="/activity"
                    className="block w-full p-4 text-center rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-[var(--indigo-blue)] dark:hover:border-[var(--primary)] text-gray-600 dark:text-gray-400 hover:text-[var(--indigo-blue)] dark:hover:text-[var(--primary)] font-semibold transition-all group"
                  >
                    <span className="inline-flex items-center gap-2">
                      View All Activity
                      <svg
                        className="w-5 h-5 group-hover:translate-x-1 transition-transform"
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
                  </Link>
                </div>
              </BambooSection>
            </div>

            {/* Quick Actions - 1 column */}
            <div className="animate-slide-in-right relative">
              {/* 3D Origami Crane decoration */}
              <div className="absolute -top-10 -right-10 z-0 opacity-40">
                <OrigamiCrane color={0xff6b9d} />
              </div>

              <BambooSection title="Quick Start" titleKanji="始" className="mb-8 relative z-10">
                {/* Action Buttons */}
                <div className="space-y-4">
                  {quickActions.map((action, index) => (
                    <Link
                      key={action.name}
                      href={action.link}
                      className={`block group animate-fade-in stagger-${index + 7}`}
                      style={{ animationDelay: `${(index + 7) * 100}ms` }}
                    >
                      <JapaneseCard
                        pattern={
                          index % 4 === 0
                            ? 'seigaiha'
                            : index % 4 === 1
                              ? 'asanoha'
                              : index % 4 === 2
                                ? 'shippo'
                                : 'kikko'
                        }
                        gradient={
                          index % 4 === 0
                            ? 'ocean'
                            : index % 4 === 1
                              ? 'sakura'
                              : index % 4 === 2
                                ? 'sunset'
                                : 'autumn'
                        }
                        hover={true}
                      >
                        <div className="p-6">
                          <div className="flex items-center gap-4">
                            {/* Gradient Icon */}
                            <div
                              className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-3xl shadow-xl group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500`}
                            >
                              {action.icon}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors mb-1 tracking-tight">
                                {action.name}
                              </div>
                              <div className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                {action.description}
                              </div>
                            </div>

                            {/* Arrow */}
                            <svg
                              className="w-7 h-7 text-red-700 dark:text-red-400 group-hover:translate-x-2 transition-all flex-shrink-0 drop-shadow-md"
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
                        </div>
                      </JapaneseCard>
                    </Link>
                  ))}
                </div>

                {/* Motivational Card with Lantern */}
                <div
                  className="mt-6 animate-fade-in stagger-11 relative"
                  style={{ animationDelay: '1100ms' }}
                >
                  <JapaneseCard
                    pattern="shippo"
                    gradient="sakura"
                    kanji="頑"
                    className="relative overflow-visible"
                  >
                    <div className="absolute -top-8 -right-8 z-20">
                      <LanternGlow />
                    </div>
                    <div className="p-8 bg-gradient-to-br from-red-600/90 via-pink-600/90 to-purple-600/90 rounded-3xl">
                      <div className="flex items-start gap-5 relative z-10">
                        <div className="text-5xl flex-shrink-0 animate-bounce-slow">💪</div>
                        <div>
                          <h3 className="font-black text-2xl mb-3 japanese-text text-white drop-shadow-lg">
                            頑張って！
                          </h3>
                          <p className="text-base text-white/95 font-medium leading-relaxed">
                            You&apos;re making great progress. Every lesson brings you closer to
                            fluency!
                          </p>
                        </div>
                      </div>
                    </div>
                  </JapaneseCard>
                </div>
              </BambooSection>
            </div>
          </div>
        </div>
      </section>

      {/* Noren Divider */}
      <div className="noren-divider" />

      {/* Progress Overview Section */}
      <section className="ma-section z-10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="yuzen-card card-depth-3 p-8 sm:p-12 animate-slide-up shimmer-effect relative overflow-hidden">
            {/* Bokashi fade overlay */}
            <div className="absolute inset-0 bokashi-fade pointer-events-none" />
            {/* Section Header */}
            <div className="text-center mb-12 relative z-10">
              <div className="inline-flex items-center gap-4 mb-4">
                <div className="text-4xl">📊</div>
                <h2 className="japanese-heading text-4xl sm:text-5xl">
                  <span className="japanese-text">学習の旅</span>
                </h2>
                <div className="text-4xl">🎯</div>
              </div>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">Your Learning Journey</p>
              <div className="section-divider w-48 mx-auto"></div>
            </div>

            {/* Progress Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 relative z-10">
              {/* Overall Progress */}
              <div className="text-center group">
                <JapaneseCard pattern="seigaiha" gradient="ocean" kanji="進">
                  <div className="p-8">
                    <div className="mb-8">
                      <div className="text-6xl sm:text-7xl font-black stat-value mb-4 drop-shadow-lg">
                        68%
                      </div>
                      <div className="stat-label text-base font-bold">Overall Progress</div>
                    </div>

                    <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-5 overflow-hidden shadow-inner">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[#165E83] via-[#D9333F] to-[#FFB11B] progress-animate shadow-xl"
                        style={{ width: '68%' }}
                      ></div>
                      <div className="absolute inset-0 shimmer-effect"></div>
                    </div>
                  </div>
                </JapaneseCard>

                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-6">
                  32% remaining to reach your goal
                </p>
              </div>

              {/* JLPT Level */}
              <div className="text-center group">
                <JapaneseCard pattern="asanoha" gradient="sakura" kanji="級">
                  <div className="p-8">
                    <div className="mb-8">
                      <div className="text-6xl sm:text-7xl font-black stat-value mb-4 drop-shadow-lg">
                        N3
                      </div>
                      <div className="stat-label text-base font-bold">Current Level</div>
                    </div>

                    <div className="flex justify-center gap-3">
                      {['N5', 'N4', 'N3', 'N2', 'N1'].map((level, i) => (
                        <div
                          key={level}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-base font-black transition-all duration-300 ${
                            i <= 2
                              ? 'bg-gradient-to-br from-[#D9333F] to-[#FFB11B] text-white shadow-xl transform hover:scale-125 hover:-rotate-6'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600 hover:scale-110'
                          }`}
                        >
                          {level.slice(-1)}
                        </div>
                      ))}
                    </div>
                  </div>
                </JapaneseCard>

                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-6">
                  15% progress towards N2
                </p>
              </div>

              {/* Study Time */}
              <div className="text-center group">
                <JapaneseCard pattern="kikko" gradient="sunset" kanji="時">
                  <div className="p-8">
                    <div className="mb-8">
                      <div className="text-6xl sm:text-7xl font-black stat-value mb-4 drop-shadow-lg">
                        24h
                      </div>
                      <div className="stat-label text-base font-bold">Study Time</div>
                    </div>

                    <div className="flex justify-center items-end gap-2 h-28">
                      {[3, 5, 4, 6, 3, 4, 3].map((hours, hourIndex) => (
                        <div
                          key={hourIndex}
                          className="w-12 rounded-t-xl transition-all duration-300 hover:opacity-90 cursor-pointer shadow-lg hover:scale-105"
                          style={{
                            height: `${(hours / 6) * 100}%`,
                            background: 'linear-gradient(to top, #FFB11B, #D9333F)',
                          }}
                          title={`${hours} hours`}
                        ></div>
                      ))}
                    </div>
                  </div>
                </JapaneseCard>

                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mt-6">
                  Last 7 days of study
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
