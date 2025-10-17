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
      <div className="flex flex-col flex-1 p-6">
        {/* Enhanced Logo with Brand */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3 group flex-1">
            {/* Logo Container with shadow and hover effect */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-all duration-300"></div>
              <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 ring-2 ring-white/20 dark:ring-black/30">
                <span className="japanese-text text-3xl transition-transform group-hover:rotate-12">
                  侍
                </span>
              </div>
            </div>
            <div className="flex flex-col flex-1">
              <span className="text-lg font-black japanese-heading leading-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Shinmen
              </span>
              <span className="text-sm font-bold text-gray-600 dark:text-gray-400 leading-tight">
                Takezo
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
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
        <div className="mb-8 p-6 relative overflow-hidden rounded-3xl">
          {/* Gradient Background Layer */}
          <div className="absolute inset-0 bg-gradient-to-br from-gradient-start via-gradient-middle to-gradient-end backdrop-blur-xl rounded-3xl border border-white/30 dark:border-gray-700/50 shadow-2xl" />

          {/* Animated accent glow */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-3xl animate-pulse-slow" />
          <div
            className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse-slow"
            style={{ animationDelay: '1s' }}
          />

          {/* Decorative Background Kanji */}
          <div className="absolute top-4 right-4 text-5xl japanese-text opacity-10 select-none pointer-events-none">
            学
          </div>

          <div className="relative z-10">
            {/* User Info with Avatar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative group flex-shrink-0">
                {/* Avatar with image or fallback */}
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl ring-4 ring-white/40 dark:ring-black/40 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 overflow-hidden">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-3xl font-black japanese-text">
                      {user.name.charAt(0)}
                    </span>
                  )}
                </div>
                {/* Premium Online Indicator */}
                <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
                  <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white dark:border-gray-900 shadow-lg ring-2 ring-green-500/50">
                    <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold japanese-heading truncate text-gray-900 dark:text-white">
                  {user.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate font-medium">
                  {user.email}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 font-semibold">
                  Premium Member ✨
                </p>
              </div>
            </div>

            {/* Enhanced Stats Grid - Better layout */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              {/* Level */}
              <div className="relative group p-4 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/40 dark:to-blue-800/30 backdrop-blur-sm rounded-2xl text-center transform hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border border-blue-200/50 dark:border-blue-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:scale-125 transition-transform">
                    {user.level}
                  </div>
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2 uppercase tracking-wider">
                    Level
                  </div>
                </div>
              </div>

              {/* Streak */}
              <div className="relative group p-4 bg-gradient-to-br from-orange-50 to-red-100/50 dark:from-orange-900/40 dark:to-red-800/30 backdrop-blur-sm rounded-2xl text-center transform hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border border-orange-200/50 dark:border-red-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-red-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-3xl font-black bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent group-hover:scale-125 transition-transform">
                      {user.streak}
                    </span>
                    <span className="text-2xl animate-bounce">🔥</span>
                  </div>
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2 uppercase tracking-wider">
                    Streak
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="relative group p-4 bg-gradient-to-br from-purple-50 to-pink-100/50 dark:from-purple-900/40 dark:to-pink-800/30 backdrop-blur-sm rounded-2xl text-center transform hover:scale-110 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border border-purple-200/50 dark:border-pink-700/50">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="text-3xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:scale-125 transition-transform">
                    {user.achievements}
                  </div>
                  <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mt-2 uppercase tracking-wider">
                    Badges
                  </div>
                </div>
              </div>
            </div>

            {/* XP Progress Bar with gradient - Enhanced */}
            <div className="p-5 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm mb-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent uppercase tracking-wider">
                    XP Progress to Next Level
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-black">
                    {Math.round(xpProgress)}%
                  </span>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner ring-1 ring-white/50 dark:ring-black/50">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-700 shadow-lg relative overflow-hidden"
                    style={{ width: `${xpProgress}%` }}
                  >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-600 dark:text-gray-400">
                  <span>
                    <span className="font-black text-gray-900 dark:text-gray-200">
                      {user.totalXP}
                    </span>{' '}
                    / {user.nextLevelXP} XP
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    {user.nextLevelXP - user.totalXP} more to level up
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Section - Enhanced */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-4 px-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></span>
            Navigation
          </h3>
          <nav className="space-y-1">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 relative overflow-hidden
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-xl shadow-purple-500/40 scale-[1.02]'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 hover:scale-[1.01]'
                    }
                  `}
                >
                  {/* Background shimmer effect on hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  )}

                  {/* Icon Container */}
                  <div
                    className={`
                    flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all duration-300 relative z-10 font-bold
                    ${
                      isActive
                        ? 'bg-white/25 shadow-lg'
                        : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 group-hover:scale-125 group-hover:rotate-12 shadow-md'
                    }
                  `}
                  >
                    {item.emoji}
                  </div>

                  {/* Label */}
                  <span className="flex-1 text-sm font-bold relative z-10">{item.name}</span>

                  {/* Notification Badge */}
                  {['Lessons', 'Chat', 'Community'].includes(item.name) && !isActive && (
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-xs font-black text-white shadow-xl animate-bounce relative z-10 ring-2 ring-orange-300/50">
                      {item.name === 'Lessons' ? '3' : item.name === 'Chat' ? '5' : '2'}
                    </div>
                  )}

                  {/* Active indicator */}
                  {isActive && (
                    <svg
                      className="w-5 h-5 animate-pulse flex-shrink-0 relative z-10"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Quick Actions - Enhanced */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-500 mb-4 px-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"></span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <button className="w-full p-4 rounded-2xl bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <span className="text-2xl group-hover:scale-125 transition-transform">🎯</span>
              <div className="relative z-10">
                <div className="text-sm font-black">Start Learning</div>
                <div className="text-xs opacity-90">Continue where you left</div>
              </div>
            </button>
            <button className="w-full p-4 rounded-2xl border-2 border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 font-bold hover:border-indigo-500 dark:hover:border-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-300 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3 group bg-indigo-50/50 dark:bg-indigo-900/20 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30">
              <span className="text-2xl group-hover:scale-125 transition-transform">📊</span>
              <div>
                <div className="text-sm font-black">View Progress</div>
                <div className="text-xs opacity-90">Check your stats</div>
              </div>
            </button>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        {/* Footer Actions - Enhanced */}
        <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="hidden lg:flex items-center gap-2 mb-4 p-3 bg-gray-50/80 dark:bg-gray-800/50 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
            <ThemeToggle />
            <FontSizeControl />
          </div>

          {/* Profile Settings */}
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all font-semibold group hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-200 to-purple-200 dark:from-blue-900/40 dark:to-purple-900/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold">Profile</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Settings & info</div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {/* Back to Home */}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 dark:hover:from-orange-900/20 dark:hover:to-pink-900/20 transition-all font-semibold group hover:scale-105"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-200 to-pink-200 dark:from-orange-900/40 dark:to-pink-900/40 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <svg
                className="w-5 h-5 text-orange-600 dark:text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold">Home</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Back to landing</div>
            </div>
            <svg
              className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
