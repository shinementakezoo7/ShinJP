'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import FontSizeControl from '@/components/theme/FontSizeControl'
import ThemeToggle from '@/components/theme/ThemeToggle'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = {
    name: 'Guest User',
    email: 'guest@shinmentakezo.com',
    image: null,
    level: 'N3',
    streak: 7,
    completedLessons: 12,
    totalXP: 2450,
    nextLevelXP: 3000,
    achievements: 8,
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
      gradient: 'from-indigo-500 to-purple-600',
      emoji: '🏠',
    },
    {
      name: 'Lessons',
      href: '/lessons',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      gradient: 'from-blue-500 to-cyan-600',
      emoji: '📚',
    },
    {
      name: 'Books',
      href: '/books',
      icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
      gradient: 'from-purple-500 to-pink-600',
      emoji: '📕',
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      gradient: 'from-cyan-500 to-blue-600',
      emoji: '💬',
    },
    {
      name: 'Practice',
      href: '/practice',
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      gradient: 'from-green-500 to-emerald-600',
      emoji: '⚡',
    },
    {
      name: 'Vocabulary',
      href: '/vocabulary',
      icon: 'M4 6h16M4 12h16M4 18h7',
      gradient: 'from-yellow-500 to-orange-600',
      emoji: '✨',
    },
    {
      name: 'Grammar',
      href: '/grammar',
      icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      gradient: 'from-pink-500 to-red-600',
      emoji: '📖',
    },
    {
      name: 'Community',
      href: '/community',
      icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      gradient: 'from-orange-500 to-red-600',
      emoji: '👥',
    },
    {
      name: 'Social Gallery',
      href: '/social',
      icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      gradient: 'from-pink-500 to-purple-600',
      emoji: '📸',
    },
  ]

  return (
    <div className="min-h-screen bg-[var(--ashen-white)] dark:bg-[var(--ink-black)] transition-colors duration-300">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-80 bg-white dark:bg-[var(--card-bg)] border-r border-[var(--border)] animate-slide-in-left shadow-2xl">
            <SidebarContent
              navigation={navigation}
              pathname={pathname}
              user={user}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-80 lg:flex-col z-30">
        <div className="flex flex-col flex-1 bg-white dark:bg-[var(--card-bg)] border-r border-[var(--border)] shoji-pattern shadow-xl">
          <SidebarContent navigation={navigation} pathname={pathname} user={user} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar */}
        <div className="sticky top-0 z-20 bg-white/95 dark:bg-[var(--card-bg)]/95 backdrop-blur-sm border-b border-[var(--border)] lg:hidden">
          <div className="flex items-center justify-between p-4">
            <button
              type="button"
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-lg font-bold flex items-center gap-2">
              <span className="japanese-text text-2xl" style={{ color: 'var(--indigo-blue)' }}>
                侍
              </span>
              <span className="japanese-heading text-base">Shinmen Takezo</span>
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <FontSizeControl />
            </div>
          </div>
        </div>

        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  )
}

interface NavigationItem {
  name: string
  href: string
  icon: string
  gradient: string
  emoji: string
}

interface UserInfo {
  name: string
  email: string
  image: string | null
  level: string
  streak: number
  completedLessons: number
  totalXP: number
  nextLevelXP: number
  achievements: number
}

function SidebarContent({
  navigation,
  pathname,
  user,
  onClose,
}: {
  navigation: NavigationItem[]
  pathname: string
  user: UserInfo
  onClose?: () => void
}) {
  const xpProgress = (user.totalXP / user.nextLevelXP) * 100

  return (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
      <div className="flex flex-col flex-1 p-5">
        {/* Logo */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="flex items-center gap-3 group">
            <span
              className="japanese-text text-4xl transition-transform group-hover:scale-110 group-hover:rotate-6"
              style={{ color: 'var(--indigo-blue)' }}
            >
              侍
            </span>
            <div className="flex flex-col">
              <span className="text-base font-bold japanese-heading leading-tight">Shinmen</span>
              <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 leading-tight">
                Takezo
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Enhanced User Card */}
        <div className="mb-6 p-5 relative overflow-hidden">
          {/* Glass morphism background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50" />

          {/* Animated background gradient */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse-slow" />

          {/* Decorative Background */}
          <div className="absolute top-0 right-0 text-6xl japanese-text opacity-5 select-none pointer-events-none animate-float">
            学
          </div>

          <div className="relative z-10">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-5">
              <div className="relative group">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-xl ring-4 ring-white/20 dark:ring-black/20 transform group-hover:scale-110 transition-all duration-300">
                  <span className="text-white text-2xl font-bold japanese-text">
                    {user.name.charAt(0)}
                  </span>
                </div>
                {/* Online indicator with pulse */}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white dark:border-gray-800 shadow-lg">
                  <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-bold japanese-heading truncate text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
              </div>
            </div>

            {/* Stats Grid with hover effects */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-3 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl text-center transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg group">
                <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                  {user.level}
                </div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">Level</div>
              </div>
              <div className="p-3 bg-white/80 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl text-center transform hover:scale-105 transition-all duration-300 cursor-pointer shadow-md hover:shadow-lg group">
                <div className="text-2xl font-black group-hover:scale-110 transition-transform">
                  <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    {user.streak}
                  </span>
                  <span>🔥</span>
                </div>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
                  Streak
                </div>
              </div>
            </div>

            {/* XP Progress Bar with gradient */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-gray-700 dark:text-gray-300">XP Progress</span>
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {user.totalXP} / {user.nextLevelXP}
                </span>
              </div>
              <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 shadow-md relative overflow-hidden"
                  style={{ width: `${xpProgress}%` }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>

            {/* Quick Stats with divider */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-center flex-1 group cursor-pointer">
                <div className="text-lg font-black text-gray-800 dark:text-gray-200 group-hover:scale-110 transition-transform">
                  {user.completedLessons}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Lessons</div>
              </div>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
              <div className="text-center flex-1 group cursor-pointer">
                <div className="text-lg font-black text-gray-800 dark:text-gray-200 group-hover:scale-110 transition-transform">
                  {user.achievements}
                </div>
                <div className="text-xs font-medium text-gray-500 dark:text-gray-400">Badges</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 px-3 py-3 rounded-xl font-semibold transition-all duration-200 relative overflow-hidden
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:scale-[1.01]'
                    }
                  `}
                >
                  {/* Background shimmer effect on hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  )}

                  <div
                    className={`
                    flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all duration-200 relative z-10
                    ${
                      isActive
                        ? 'bg-white/20 shadow-inner'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-hover:scale-110 group-hover:-rotate-6 shadow-md'
                    }
                  `}
                  >
                    {item.emoji}
                  </div>
                  <span className="flex-1 text-sm relative z-10">{item.name}</span>

                  {/* Notification Badge */}
                  {['Lessons', 'Chat', 'Community'].includes(item.name) && !isActive && (
                    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-xs font-black text-white shadow-lg animate-pulse relative z-10">
                      {item.name === 'Lessons' ? '3' : item.name === 'Chat' ? '5' : '2'}
                    </div>
                  )}

                  {isActive && (
                    <svg
                      className="w-5 h-5 animate-pulse flex-shrink-0 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-2">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full p-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 flex items-center justify-center gap-2">
              <span className="text-xl">🎯</span>
              <span className="text-sm">Start Learning</span>
            </button>
            <button className="w-full p-3 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all flex items-center justify-center gap-2">
              <span className="text-xl">📊</span>
              <span className="text-sm">View Progress</span>
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-[var(--border)]">
          <div className="hidden lg:flex items-center gap-2 mb-4 p-2 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
            <ThemeToggle />
            <FontSizeControl />
          </div>
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all font-medium group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <span className="text-sm">Profile Settings</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all font-medium group"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
            <span className="text-sm">Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
