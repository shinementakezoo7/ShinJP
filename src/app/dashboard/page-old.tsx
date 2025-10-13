'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function DashboardPage() {
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
      change: '+4 today',
      link: '/lessons',
      gradientClass: 'traditional-gradient',
    },
    {
      id: 2,
      name: 'Vocabulary',
      value: '342',
      kanji: '語',
      change: '+23 this week',
      link: '/vocabulary',
      gradientClass: 'moss-gradient',
    },
    {
      id: 3,
      name: 'Streak',
      value: '7',
      kanji: '日',
      change: 'Keep going!',
      link: '/study',
      gradientClass: 'gold-accent',
    },
    {
      id: 4,
      name: 'Level',
      value: 'N3',
      kanji: '級',
      change: '15% progress',
      link: '/progress',
      gradientClass: 'sakura-gradient',
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
    },
    {
      id: 2,
      title: 'Kanji Writing Practice',
      type: 'Practice',
      score: '15 chars',
      time: 'Yesterday',
      icon: '✍️',
    },
    {
      id: 3,
      title: 'JLPT N3 Prep Study Group',
      type: 'Community',
      score: '12 members',
      time: '2 days ago',
      icon: '👥',
    },
  ]

  const quickActions = [
    {
      name: 'Continue Learning',
      icon: '📚',
      link: '/lessons',
      description: 'Resume your last lesson',
    },
    {
      name: 'AI Books',
      icon: '📕',
      link: '/books',
      description: 'Generate personalized content',
    },
    {
      name: 'Chat Practice',
      icon: '💬',
      link: '/chat',
      description: 'Converse with AI sensei',
    },
    {
      name: 'Practice Drills',
      icon: '⚡',
      link: '/practice',
      description: 'Strengthen your skills',
    },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl japanese-text">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen shoji-pattern">
      {/* Hero Section with Ma (Negative Space) */}
      <section className="ma-spacing animate-fade-in">
        <div className="max-w-7xl mx-auto">
          <div className="text-center ma-vertical">
            <h1 className="japanese-heading text-5xl sm:text-6xl lg:text-7xl mb-6">
              <span className="japanese-text stat-value">道場</span>
            </h1>
            <p className="japanese-subtitle text-xl sm:text-2xl max-w-2xl mx-auto">
              Welcome back to your{' '}
              <span className="font-bold text-[var(--indigo-blue)] dark:text-[var(--primary)]">
                Learning Sanctuary
              </span>
            </p>
          </div>

          {/* Stats Grid with Japanese Minimalism */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mt-12 animate-slide-up">
            {stats.map((stat, index) => (
              <Link
                key={stat.id}
                href={stat.link}
                className={`japanese-card sakura-pattern p-6 sm:p-8 group animate-fade-in stagger-${index + 1}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="stat-minimal">
                  <div className="text-4xl sm:text-5xl japanese-text mb-2 opacity-30 group-hover:opacity-50 transition-opacity">
                    {stat.kanji}
                  </div>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{stat.change}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content with Asymmetric Layout */}
      <section className="ma-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Recent Activity - 2 columns */}
            <div className="lg:col-span-2 animate-slide-in-left">
              <div className="mb-8">
                <h2 className="japanese-heading text-3xl sm:text-4xl mb-2">Recent Activity</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[var(--indigo-blue)] to-[var(--traditional-red)] rounded-full"></div>
              </div>

              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`japanese-card p-6 wabi-sabi-texture animate-fade-in stagger-${index + 1}`}
                    style={{ animationDelay: `${(index + 4) * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-3xl flex-shrink-0">{activity.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <span className="text-xs font-semibold px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full whitespace-nowrap">
                            {activity.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-[var(--indigo-blue)] dark:text-[var(--primary)]">
                              {activity.score}
                            </span>
                          </span>
                          <span className="opacity-50">•</span>
                          <span>{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - 1 column */}
            <div className="animate-slide-in-right">
              <div className="mb-8">
                <h2 className="japanese-heading text-3xl sm:text-4xl mb-2">Quick Start</h2>
                <div className="w-16 h-1 bg-gradient-to-r from-[var(--traditional-gold)] to-[var(--warm-ochre)] rounded-full"></div>
              </div>

              <div className="space-y-4">
                {quickActions.map((action, _index) => (
                  <Link
                    key={action.name}
                    href={action.link}
                    className="block zen-simplicity rounded-xl p-5 hover:shadow-lg transition-all duration-300 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {action.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base text-gray-900 dark:text-white group-hover:text-[var(--indigo-blue)] dark:group-hover:text-[var(--primary)] transition-colors">
                          {action.name}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          {action.description}
                        </div>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400 group-hover:text-[var(--indigo-blue)] dark:group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all flex-shrink-0"
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
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Progress Overview with Zen Simplicity */}
      <section className="ma-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="japanese-card p-8 sm:p-12 animate-slide-up">
            <div className="text-center mb-12">
              <h2 className="japanese-heading text-3xl sm:text-4xl mb-2">Your Journey</h2>
              <div className="w-16 h-1 bg-gradient-to-r from-[var(--moss-green)] to-[var(--warm-ochre)] rounded-full mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
              {/* Overall Progress */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="stat-value mb-2">68%</div>
                  <div className="stat-label">Overall Progress</div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full traditional-gradient progress-animate"
                    style={{ width: '68%' }}
                  ></div>
                </div>
              </div>

              {/* JLPT Level */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="stat-value mb-2">N3</div>
                  <div className="stat-label">Current Level</div>
                </div>
                <div className="flex justify-center gap-2">
                  {['N5', 'N4', 'N3', 'N2', 'N1'].map((level, i) => (
                    <div
                      key={level}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                        i <= 2
                          ? 'bg-[var(--indigo-blue)] text-white shadow-md'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                      }`}
                    >
                      {level.slice(-1)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Study Time */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="stat-value mb-2">24h</div>
                  <div className="stat-label">This Week</div>
                </div>
                <div className="flex justify-center items-end gap-2 h-20">
                  {[3, 5, 4, 6, 3, 4, 3].map((hours, hourIndex) => (
                    <div
                      key={hourIndex}
                      className="w-8 rounded-t transition-all hover:opacity-80"
                      style={{
                        height: `${(hours / 6) * 100}%`,
                        background:
                          'linear-gradient(to top, var(--indigo-blue), var(--traditional-red))',
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
