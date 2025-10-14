'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LeaderboardUser {
  id: number
  rank: number
  name: string
  avatar: string
  xp: number
  level: string
  streak: number
  league: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  change: number // +3, -1, 0 (rank change)
  isCurrentUser?: boolean
}

export default function LiveLeaderboards() {
  const [activeTab, setActiveTab] = useState<'friends' | 'global' | 'league'>('friends')
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'alltime'>('week')

  const leaderboardData: LeaderboardUser[] = [
    {
      id: 1,
      rank: 1,
      name: 'Sakura_Master',
      avatar: '🌸',
      xp: 5420,
      level: 'N2',
      streak: 45,
      league: 'diamond',
      change: 2,
    },
    {
      id: 2,
      rank: 2,
      name: 'KanjiNinja',
      avatar: '🥷',
      xp: 4890,
      level: 'N2',
      streak: 32,
      league: 'diamond',
      change: -1,
    },
    {
      id: 3,
      rank: 3,
      name: 'TokyoDreamer',
      avatar: '🗼',
      xp: 4520,
      level: 'N3',
      streak: 28,
      league: 'platinum',
      change: 1,
    },
    {
      id: 4,
      rank: 4,
      name: 'You',
      avatar: '👤',
      xp: 4210,
      level: 'N3',
      streak: 7,
      league: 'platinum',
      change: 0,
      isCurrentUser: true,
    },
    {
      id: 5,
      rank: 5,
      name: 'HiraganaHero',
      avatar: '🦸',
      xp: 3980,
      level: 'N3',
      streak: 15,
      league: 'platinum',
      change: -2,
    },
    {
      id: 6,
      rank: 6,
      name: 'SushiSensei',
      avatar: '🍣',
      xp: 3750,
      level: 'N4',
      streak: 21,
      league: 'gold',
      change: 3,
    },
    {
      id: 7,
      rank: 7,
      name: 'AnimeFan_2k',
      avatar: '⚡',
      xp: 3520,
      level: 'N4',
      streak: 12,
      league: 'gold',
      change: 0,
    },
    {
      id: 8,
      rank: 8,
      name: 'OsakaBoss',
      avatar: '🏯',
      xp: 3280,
      level: 'N4',
      streak: 9,
      league: 'gold',
      change: 1,
    },
  ]

  const getLeagueColor = (league: string) => {
    switch (league) {
      case 'bronze':
        return 'from-orange-600 to-amber-700'
      case 'silver':
        return 'from-gray-400 to-gray-500'
      case 'gold':
        return 'from-yellow-400 to-amber-500'
      case 'platinum':
        return 'from-cyan-400 to-blue-500'
      case 'diamond':
        return 'from-blue-400 to-purple-600'
      default:
        return 'from-gray-400 to-gray-500'
    }
  }

  const getLeagueBadge = (league: string) => {
    switch (league) {
      case 'bronze':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      case 'silver':
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
      case 'gold':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
      case 'platinum':
        return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400'
      case 'diamond':
        return 'bg-gradient-to-r from-blue-400 to-purple-500 text-white shadow-lg'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
    }
  }

  const getRankMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return '🥇'
      case 2:
        return '🥈'
      case 3:
        return '🥉'
      default:
        return rank
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return { icon: '↑', color: 'text-green-600 dark:text-green-400' }
    if (change < 0) return { icon: '↓', color: 'text-red-600 dark:text-red-400' }
    return { icon: '—', color: 'text-gray-400' }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg">
            🏆
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Leaderboards</h2>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg" />
              <span className="text-xs font-bold text-green-600 dark:text-green-400">LIVE</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Compete with learners worldwide
            </p>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
          {['week', 'month', 'alltime'].map((time) => (
            <button
              key={time}
              onClick={() => setTimeframe(time as typeof timeframe)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                timeframe === time
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {time === 'alltime' ? 'All Time' : time.charAt(0).toUpperCase() + time.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl">
        {[
          { key: 'friends', label: 'Friends', icon: '👥' },
          { key: 'global', label: 'Global', icon: '🌍' },
          { key: 'league', label: 'My League', icon: '🏅' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex-1 px-4 py-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === tab.key
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Your Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl animate-pulse"
            style={{ animationDelay: '1s' }}
          />
        </div>

        <div className="relative z-10 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl shadow-lg">
                👤
              </div>
              <div>
                <h3 className="font-black text-2xl mb-1">Rank #4</h3>
                <p className="text-sm opacity-90">You&apos;re in the top 5%!</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black mb-1">4,210 XP</div>
              <div className="text-xs opacity-90">210 XP to next rank</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-center">
              <div className="text-2xl font-black mb-1">N3</div>
              <div className="text-xs opacity-90">Level</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-center">
              <div className="text-2xl font-black mb-1">7🔥</div>
              <div className="text-xs opacity-90">Streak</div>
            </div>
            <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl text-center">
              <div className="text-2xl font-black mb-1">💎</div>
              <div className="text-xs opacity-90">Platinum</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard List */}
      <div className="space-y-3">
        <AnimatePresence>
          {leaderboardData.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="group"
            >
              <div
                className={`relative p-5 rounded-2xl border-2 transition-all duration-300 shadow-lg hover:shadow-xl ${
                  user.isCurrentUser
                    ? 'bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-blue-500/50 dark:border-blue-400/50 scale-105'
                    : 'bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-gray-200/50 dark:border-gray-700/50 hover:scale-[1.02]'
                }`}
              >
                {/* Current User Badge */}
                {user.isCurrentUser && (
                  <div className="absolute -top-3 -right-3 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg animate-bounce-slow">
                    ⭐ You
                  </div>
                )}

                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg ${
                      user.rank <= 3
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300'
                    } group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    {typeof getRankMedal(user.rank) === 'string' ? (
                      <span className="text-3xl">{getRankMedal(user.rank)}</span>
                    ) : (
                      <span>#{getRankMedal(user.rank)}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-3xl shadow-md group-hover:scale-110 transition-transform">
                    {user.avatar}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">
                        {user.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-black ${getLeagueBadge(
                          user.league
                        )}`}
                      >
                        {user.league.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold text-gray-600 dark:text-gray-400">
                      <span>Level: {user.level}</span>
                      <span>•</span>
                      <span>{user.streak}🔥 Streak</span>
                    </div>
                  </div>

                  {/* XP & Change */}
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {user.xp.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">XP</div>
                  </div>

                  {/* Rank Change */}
                  <div className="flex-shrink-0 w-12 text-center">
                    <div className={`text-2xl font-black ${getChangeIcon(user.change).color}`}>
                      {getChangeIcon(user.change).icon}
                    </div>
                    {user.change !== 0 && (
                      <div className="text-xs font-bold text-gray-500 dark:text-gray-400">
                        {Math.abs(user.change)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                  {!user.isCurrentUser && (
                    <>
                      <button className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:scale-110 transition-transform shadow-md">
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
                            d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                          />
                        </svg>
                      </button>
                      <button className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform shadow-md">
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load More Button */}
      <button className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-yellow-500 dark:hover:border-yellow-400 transition-all text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 font-bold group">
        <span className="inline-flex items-center gap-2">
          Load More Rankings
          <svg
            className="w-5 h-5 group-hover:translate-y-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
    </div>
  )
}
