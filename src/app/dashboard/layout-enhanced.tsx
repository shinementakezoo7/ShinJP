'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import FontSizeControl from '@/components/theme/FontSizeControl'
import ThemeToggle from '@/components/theme/ThemeToggle'

export default function EnhancedDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = {
    name: 'Guest User',
    email: 'guest@shinmentakezo.com',
    image: null,
    level: 'N3',
    streak: 7,
    xp: 1250,
    rank: 'Samurai Apprentice',
  }

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '🏯',
      kanji: '道場',
      gradient: 'from-red-500 to-pink-600',
    },
    {
      name: 'Lessons',
      href: '/lessons',
      icon: '📚',
      kanji: '課',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      name: 'Books',
      href: '/books',
      icon: '📕',
      kanji: '本',
      gradient: 'from-purple-500 to-pink-600',
    },
    { name: 'Chat', href: '/chat', icon: '💬', kanji: '話', gradient: 'from-cyan-500 to-blue-600' },
    {
      name: 'Practice',
      href: '/practice',
      icon: '⚡',
      kanji: '練',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Vocabulary',
      href: '/vocabulary',
      icon: '🌸',
      kanji: '語',
      gradient: 'from-yellow-500 to-amber-600',
    },
    {
      name: 'Grammar',
      href: '/grammar',
      icon: '📝',
      kanji: '文',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      name: 'Community',
      href: '/community',
      icon: '👥',
      kanji: '友',
      gradient: 'from-indigo-500 to-purple-600',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-950 dark:via-red-950/10 dark:to-purple-950/10 transition-colors duration-300">
      {/* Mobile menu overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          ></div>
          <div className="fixed inset-y-0 left-0 w-80 animate-slide-in-left">
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
        <SidebarContent navigation={navigation} pathname={pathname} user={user} />
      </div>

      {/* Main content */}
      <div className="lg:pl-80">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-20 bg-white/90 dark:bg-black/50 backdrop-blur-xl border-b-2 border-red-200/30 dark:border-red-800/30 lg:hidden shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              type="button"
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-all"
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

            <div className="flex items-center gap-2">
              <span className="japanese-text text-3xl text-red-600 dark:text-red-400">侍</span>
              <span className="text-lg font-bold">Shinmen Takezo</span>
            </div>

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
  kanji: string
  gradient: string
}

interface UserInfo {
  name: string
  email: string
  image: string | null
  level: string
  streak: number
  xp: number
  rank: string
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
  return (
    <div className="flex flex-col h-full bg-white/95 dark:bg-black/60 backdrop-blur-xl border-r-2 border-red-200/30 dark:border-red-800/30 shadow-2xl">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="sidebar-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-red-800 dark:text-red-400"
              >
                <circle cx="50" cy="50" r="35" />
                <circle cx="0" cy="50" r="35" />
                <circle cx="100" cy="50" r="35" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#sidebar-pattern)" />
        </svg>
      </div>

      <div className="relative flex flex-col flex-1 p-5">
        {/* Logo Section */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <span className="japanese-text text-5xl text-red-600 dark:text-red-400 drop-shadow-lg transition-transform group-hover:scale-110">
                侍
              </span>
              <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full animate-pulse-slow"></div>
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">Shinmen</span>
              <span className="block text-xs text-gray-600 dark:text-gray-400 japanese-text">
                新免武蔵
              </span>
            </div>
          </Link>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-600 dark:text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
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

        {/* User Profile Card */}
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-br from-red-500 via-pink-600 to-purple-600 shadow-xl animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-white">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold truncate">{user.name}</p>
              <p className="text-white/80 text-xs truncate">{user.rank}</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">{user.level}</div>
              <div className="text-[10px] text-white/80">Level</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white flex items-center justify-center gap-1">
                {user.streak}
                <span className="text-xs">🔥</span>
              </div>
              <div className="text-[10px] text-white/80">Streak</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 text-center">
              <div className="text-lg font-bold text-white">{user.xp}</div>
              <div className="text-[10px] text-white/80">XP</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[10px] text-white/80 mb-1">
              <span>Progress to N2</span>
              <span>68%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-white to-yellow-300 rounded-full shadow-sm"
                style={{ width: '68%' }}
              ></div>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-1 mb-6 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg scale-[1.02]'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 hover:scale-[1.01]'
                  }
                `}
              >
                {/* Icon with Background */}
                <div
                  className={`
                  p-2 rounded-lg transition-all duration-300 flex items-center justify-center
                  ${
                    isActive
                      ? 'bg-white/25 shadow-md'
                      : `bg-gradient-to-br ${item.gradient} shadow-md group-hover:scale-110 group-hover:rotate-3`
                  }
                `}
                >
                  <span className={`text-xl ${isActive ? '' : 'drop-shadow-md'}`}>{item.icon}</span>
                </div>

                {/* Text and Kanji */}
                <div className="flex-1 flex items-center justify-between">
                  <span className="font-medium">{item.name}</span>
                  <span
                    className={`japanese-text text-lg ${isActive ? 'text-white/80' : 'text-gray-400 dark:text-gray-600'}`}
                  >
                    {item.kanji}
                  </span>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <svg
                    className="w-4 h-4 text-white"
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

        {/* Daily Tip */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border border-amber-200 dark:border-amber-800 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900 dark:text-white mb-1">今日のヒント</p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                Did you know? The kanji 侍 (samurai) combines &ldquo;person&rdquo; and
                &ldquo;temple&rdquo; - warriors who served nobility.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-4 border-t border-red-200/30 dark:border-red-800/30">
          <div className="hidden lg:flex items-center justify-center gap-2 mb-3">
            <ThemeToggle />
            <FontSizeControl />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/profile"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>Profile</span>
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
