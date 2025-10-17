'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

interface Achievement {
  id: number
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  unlockedDate?: string
  progress?: number
  requirement?: number
  category: 'streak' | 'vocabulary' | 'lessons' | 'social' | 'mastery'
  japaneseName?: string
  xpReward?: number
}

export default function AchievementShowcase() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [hoveredAchievement, setHoveredAchievement] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'First Steps',
      japaneseName: '初歩',
      description: 'Complete your first lesson',
      icon: '👣',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2 days ago',
      category: 'lessons',
      xpReward: 50,
    },
    {
      id: 2,
      title: 'Week Warrior',
      japaneseName: '七日間',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: 'Today',
      category: 'streak',
      xpReward: 150,
    },
    {
      id: 3,
      title: 'Vocabulary Master',
      japaneseName: '語彙の達人',
      description: 'Learn 500 vocabulary words',
      icon: '📚',
      rarity: 'epic',
      unlocked: false,
      progress: 342,
      requirement: 500,
      category: 'vocabulary',
      xpReward: 300,
    },
    {
      id: 4,
      title: 'Kanji Legend',
      japaneseName: '漢字の伝説',
      description: 'Master all N3 kanji characters',
      icon: '🏯',
      rarity: 'legendary',
      unlocked: false,
      progress: 120,
      requirement: 370,
      category: 'mastery',
      xpReward: 500,
    },
    {
      id: 5,
      title: 'Social Butterfly',
      japaneseName: '社交の蝶',
      description: 'Join 3 study groups',
      icon: '🦋',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: 'Yesterday',
      category: 'social',
      xpReward: 200,
    },
    {
      id: 6,
      title: 'Perfect Score',
      japaneseName: '満点',
      description: 'Get 100% on any lesson',
      icon: '💯',
      rarity: 'epic',
      unlocked: false,
      progress: 95,
      requirement: 100,
      category: 'lessons',
      xpReward: 250,
    },
    {
      id: 7,
      title: 'Century Club',
      japaneseName: '百年の会',
      description: 'Reach a 100-day streak',
      icon: '💎',
      rarity: 'legendary',
      unlocked: false,
      progress: 7,
      requirement: 100,
      category: 'streak',
      xpReward: 1000,
    },
    {
      id: 8,
      title: 'Speed Reader',
      japaneseName: '速読',
      description: 'Complete 10 lessons in one day',
      icon: '⚡',
      rarity: 'epic',
      unlocked: false,
      progress: 3,
      requirement: 10,
      category: 'lessons',
      xpReward: 200,
    },
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600'
      case 'rare':
        return 'from-blue-400 to-blue-600'
      case 'epic':
        return 'from-purple-400 to-purple-600'
      case 'legendary':
        return 'from-amber-400 to-orange-600'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'shadow-gray-500/50'
      case 'rare':
        return 'shadow-blue-500/50'
      case 'epic':
        return 'shadow-purple-500/50'
      case 'legendary':
        return 'shadow-orange-500/50'
      default:
        return 'shadow-gray-500/50'
    }
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300'
      case 'rare':
        return 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
      case 'epic':
        return 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300'
      case 'legendary':
        return 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
      default:
        return 'bg-gray-100 dark:bg-gray-900/50 text-gray-700 dark:text-gray-300'
    }
  }

  const filteredAchievements =
    filter === 'all'
      ? achievements
      : filter === 'unlocked'
        ? achievements.filter((a) => a.unlocked)
        : filter === 'locked'
          ? achievements.filter((a) => !a.unlocked)
          : achievements.filter((a) => a.category === filter)

  const unlockedCount = achievements.filter((a) => a.unlocked).length
  const totalCount = achievements.length
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100)

  // Trigger celebration animation when unlocking
  useEffect(() => {
    if (unlockedCount === 3 && isAnimating === false) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 3000)
    }
  }, [unlockedCount, isAnimating])

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Traditional Japanese Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="achievements-seigaiha"
              x="0"
              y="0"
              width="100"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-red-600 dark:text-red-400"
              >
                <path d="M0,25 Q12.5,12.5 25,25 T50,25" />
                <path d="M25,25 Q37.5,12.5 50,25 T75,25" />
                <path d="M50,25 Q62.5,12.5 75,25 T100,25" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#achievements-seigaiha)" />
        </svg>
      </div>

      {/* Enhanced Header with Japanese Theme */}
      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Trophy Icon with Japanese Accent */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-600 via-pink-600 to-orange-600 dark:from-red-500 dark:via-pink-500 dark:to-orange-500 flex items-center justify-center text-3xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              🏆
            </div>
            {/* Glow Effect */}
            <div className="absolute -inset-2 bg-gradient-to-r from-red-600/20 to-orange-600/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {/* Torii Gate Decoration */}
            <div className="absolute -bottom-1 -right-1 text-lg japanese-text text-amber-600 dark:text-amber-400 animate-pulse">
              伝
            </div>
          </div>

          <div className="space-y-1">
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              Achievements
              <span className="text-xl sm:text-2xl japanese-text text-red-600 dark:text-red-400">
                勲章
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold text-gray-600 dark:text-gray-300">
                {unlockedCount} of {totalCount} unlocked
              </p>
              {/* Achievement Counter with Animation */}
              <motion.div
                key={unlockedCount}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Progress Badge with Japanese Design */}
        <div className="relative">
          <div
            className={`px-8 py-4 bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 dark:from-red-500 dark:via-pink-500 dark:to-orange-500 text-white rounded-2xl shadow-2xl ${isAnimating ? 'animate-bounce' : ''}`}
          >
            <div className="text-center relative z-10">
              <div className="text-3xl font-black">
                {completionPercentage}
                <span className="text-xl ml-1">%</span>
              </div>
              <div className="text-xs font-bold opacity-90 mt-1 tracking-wider">COMPLETE</div>
              <div className="text-xs mt-1 japanese-text opacity-80">達成度</div>
            </div>
            {/* Decorative Cherry Blossoms */}
            {isAnimating && (
              <div className="absolute -top-2 -left-2 text-lg animate-spin-slow">🌸</div>
            )}
            {/* XP Reward Summary */}
            <div className="absolute -bottom-2 right-0 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
              <span className="text-xs font-bold">
                {achievements
                  .filter((a) => a.unlocked)
                  .reduce((sum, a) => sum + (a.xpReward || 0), 0)}{' '}
                XP earned
              </span>
            </div>
          </div>
          {/* Progress Ring Background */}
          <svg className="absolute inset-0 w-32 h-16 -top-4 -left-2">
            <circle
              cx="64"
              cy="32"
              r="60"
              stroke="rgba(239, 68, 68, 0.2)"
              strokeWidth="3"
              fill="none"
            />
          </svg>
        </div>
      </div>

      {/* Enhanced Progress Overview Section */}
      <div className="relative p-6 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-2xl border border-red-200/50 dark:border-red-800/50 backdrop-blur-sm">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.08]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="progress-seigaiha"
                x="0"
                y="0"
                width="80"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <g
                  stroke="currentColor"
                  strokeWidth="1"
                  fill="none"
                  className="text-red-600 dark:text-red-400"
                >
                  <path d="M0,20 Q10,10 20,20 T40,20" />
                  <path d="M20,20 Q30,10 40,20 T60,20" />
                  <path d="M40,20 Q50,10 60,20 T80,20" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#progress-seigaiha)" />
          </svg>
        </div>

        <div className="relative z-10">
          {/* Progress Summary */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                Achievement Progress
                <span className="ml-2 text-base japanese-text text-red-600 dark:text-red-400">
                  進捗
                </span>
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-semibold">
                  {unlockedCount} of {totalCount} achievements unlocked
                </span>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-bold ${
                    completionPercentage >= 50
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                  }`}
                >
                  {completionPercentage}% Complete
                </div>
              </div>
            </div>

            {/* Visual Progress Dots */}
            <div className="flex items-center gap-2">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-transparent shadow-lg`
                      : 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
                  }`}
                >
                  {achievement.unlocked && (
                    <div className="absolute inset-0 flex items-center justify-center text-xs">
                      <span className="filter drop-shadow-sm">{achievement.icon}</span>
                    </div>
                  )}
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded-lg opacity-0 hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity duration-200 z-50">
                    <div className="font-bold">{achievement.title}</div>
                    {achievement.japaneseName && (
                      <div className="text-xs opacity-80 japanese-text">
                        {achievement.japaneseName}
                      </div>
                    )}
                    <div className="text-xs">
                      {achievement.unlocked ? '✨ Unlocked' : '🔒 Locked'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* XP Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 rounded-full">
                <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                  {achievements
                    .filter((a) => a.unlocked)
                    .reduce((sum, a) => sum + (a.xpReward || 0), 0)}{' '}
                  XP
                </span>
                <span className="text-xs">⭐</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <span className="text-sm font-bold text-blue-700 dark:text-blue-300">
                  {achievements.filter((a) => a.unlocked && a.rarity === 'legendary').length}{' '}
                  Legendary
                </span>
                <span className="text-xs">🏆</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                <span className="text-sm font-bold text-purple-700 dark:text-purple-300">
                  {achievements.filter((a) => a.unlocked && a.rarity === 'epic').length} Epic
                </span>
                <span className="text-xs">💜</span>
              </div>
            </div>

            {/* Next Achievement Hint */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedCount < totalCount ? (
                <span className="flex items-center gap-1">
                  <span>Next:</span>
                  <span className="font-semibold">
                    {achievements.find((a) => !a.unlocked)?.title || 'Complete more lessons!'}
                  </span>
                </span>
              ) : (
                <span className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                  🎉 All Achievements Unlocked!
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filter Tabs with Japanese Styling */}
      <div className="relative">
        {/* Subtle Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 rounded-xl"></div>

        <div className="relative flex items-center gap-1 p-1 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-xl overflow-x-auto border border-red-200/50 dark:border-red-800/50">
          {[
            { key: 'all', label: 'All', japaneseLabel: '全て' },
            { key: 'unlocked', label: 'Unlocked', japaneseLabel: '解除済' },
            { key: 'locked', label: 'Locked', japaneseLabel: '未解除' },
            { key: 'streak', label: 'Streak', japaneseLabel: '連続' },
            { key: 'vocabulary', label: 'Vocabulary', japaneseLabel: '語彙' },
            { key: 'lessons', label: 'Lessons', japaneseLabel: 'レッスン' },
            { key: 'social', label: 'Social', japaneseLabel: '社交' },
            { key: 'mastery', label: 'Mastery', japaneseLabel: '習得' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`relative px-3 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap group ${
                filter === f.key
                  ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
              }`}
            >
              <span className="flex items-center gap-1">
                <span>{f.label}</span>
                <span className="text-xs opacity-70 japanese-text">{f.japaneseLabel}</span>
              </span>
              {filter === f.key && <div className="absolute inset-0 bg-white/20 rounded-lg"></div>}
            </button>
          ))}
        </div>
      </div>

      {/* Enhanced Achievements Grid with Japanese Design */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                rotate: hoveredAchievement === achievement.id ? [0, -2, 2, -2, 0] : 0,
              }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                rotate: {
                  duration: 0.5,
                  repeat: hoveredAchievement === achievement.id ? Infinity : 0,
                },
              }}
              whileHover={{
                scale: 1.08,
                y: -5,
                transition: { duration: 0.2 },
              }}
              onClick={() => setSelectedAchievement(achievement)}
              onMouseEnter={() => setHoveredAchievement(achievement.id)}
              onMouseLeave={() => setHoveredAchievement(null)}
              className="group cursor-pointer relative"
            >
              {/* Enhanced Card with Japanese Aesthetics */}
              <div
                className={`relative p-6 rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-transparent shadow-2xl ${getRarityGlow(achievement.rarity)}`
                    : 'bg-white/70 dark:bg-gray-800/70 border-gray-300 dark:border-gray-700 backdrop-blur-sm'
                }`}
              >
                {/* Traditional Japanese Pattern Background */}
                {achievement.unlocked && (
                  <div className="absolute inset-0 opacity-10">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern
                          id={`pattern-${achievement.id}`}
                          x="0"
                          y="0"
                          width="40"
                          height="40"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle
                            cx="20"
                            cy="20"
                            r="15"
                            stroke="white"
                            strokeWidth="0.5"
                            fill="none"
                          />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill={`url(#pattern-${achievement.id})`} />
                    </svg>
                  </div>
                )}

                {/* Locked Overlay with Japanese Lock */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-md rounded-3xl flex items-center justify-center z-20">
                    <div className="text-center">
                      <div className="text-4xl mb-2 animate-pulse bg-gray-200/20 dark:bg-gray-700/20 rounded-full p-3">
                        🔒
                      </div>
                      <div className="text-xs font-bold text-gray-400 japanese-text">未解除</div>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-30 text-center">
                  {/* Enhanced Icon with Animation */}
                  <div
                    className={`text-6xl mb-3 ${
                      achievement.unlocked
                        ? 'animate-bounce-slow filter drop-shadow-lg'
                        : 'grayscale opacity-50'
                    } ${hoveredAchievement === achievement.id ? 'scale-110' : ''} transition-transform duration-300`}
                  >
                    {achievement.icon}
                  </div>

                  {/* Japanese Name */}
                  {achievement.unlocked && achievement.japaneseName && (
                    <div className="text-xs font-bold text-white/90 dark:text-white/80 mb-1 japanese-text">
                      {achievement.japaneseName}
                    </div>
                  )}

                  {/* Title */}
                  <h3
                    className={`font-bold text-sm mb-1 ${
                      achievement.unlocked
                        ? 'text-white drop-shadow-md'
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {achievement.title}
                  </h3>

                  {/* XP Reward Badge */}
                  {achievement.unlocked && achievement.xpReward && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full mb-2">
                      <span className="text-xs font-bold text-white">
                        +{achievement.xpReward} XP
                      </span>
                      <span className="text-xs">⭐</span>
                    </div>
                  )}

                  {/* Unlock Status */}
                  {achievement.unlocked ? (
                    <div className="space-y-1">
                      <p className="text-xs text-white/80 font-medium">
                        ✨ {achievement.unlockedDate}
                      </p>
                    </div>
                  ) : (
                    achievement.progress !== undefined &&
                    achievement.requirement && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-gray-900 dark:text-white">
                            {achievement.progress}/{achievement.requirement}
                          </span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full relative"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(achievement.progress / achievement.requirement) * 100}%`,
                            }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                          >
                            {/* Progress Indicator Glow */}
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"></div>
                          </motion.div>
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Enhanced Rarity Badge */}
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-black shadow-lg backdrop-blur-sm ${getRarityBadge(achievement.rarity)}`}
                    >
                      {achievement.rarity.toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Enhanced Sparkle Effects for Legendary */}
                {achievement.unlocked && achievement.rarity === 'legendary' && (
                  <div className="absolute inset-0 pointer-events-none z-40">
                    <div className="absolute top-2 left-2 w-3 h-3 bg-white rounded-full animate-ping opacity-60"></div>
                    <div
                      className="absolute bottom-3 right-3 w-2 h-2 bg-amber-300 rounded-full animate-ping"
                      style={{ animationDelay: '0.7s' }}
                    ></div>
                    <div
                      className="absolute top-3 right-2 w-2 h-2 bg-pink-300 rounded-full animate-ping"
                      style={{ animationDelay: '1.4s' }}
                    ></div>
                    {hoveredAchievement === achievement.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-3xl animate-pulse"></div>
                    )}
                  </div>
                )}

                {/* Hover Effect Border */}
                <div
                  className={`absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 ${
                    hoveredAchievement === achievement.id
                      ? 'opacity-100 border-2 border-white/30'
                      : 'opacity-0'
                  }`}
                ></div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedAchievement(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md p-8 rounded-3xl shadow-2xl ${
                selectedAchievement.unlocked
                  ? `bg-gradient-to-br ${getRarityColor(selectedAchievement.rarity)}`
                  : 'bg-white dark:bg-gray-800'
              }`}
            >
              <div className="text-center">
                <div className="text-8xl mb-6 animate-bounce-slow">{selectedAchievement.icon}</div>
                <h2
                  className={`text-3xl font-black mb-3 ${
                    selectedAchievement.unlocked ? 'text-white' : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {selectedAchievement.title}
                </h2>
                <p
                  className={`text-lg mb-6 ${
                    selectedAchievement.unlocked
                      ? 'text-white/90'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {selectedAchievement.description}
                </p>

                {selectedAchievement.unlocked ? (
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
                      <span className="font-bold text-white">
                        Unlocked {selectedAchievement.unlockedDate}
                      </span>
                    </div>
                    <div
                      className={`inline-block px-4 py-2 rounded-full text-sm font-black ${getRarityBadge(selectedAchievement.rarity)}`}
                    >
                      {selectedAchievement.rarity.toUpperCase()} ACHIEVEMENT
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedAchievement.progress !== undefined &&
                      selectedAchievement.requirement && (
                        <div>
                          <div className="flex items-center justify-between text-sm font-bold mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Progress</span>
                            <span className="text-gray-900 dark:text-white">
                              {selectedAchievement.progress} / {selectedAchievement.requirement}
                            </span>
                          </div>
                          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                              style={{
                                width: `${(selectedAchievement.progress / selectedAchievement.requirement) * 100}%`,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      Keep going to unlock this achievement!
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="mt-6 px-8 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-bold rounded-xl transition-all hover:scale-105"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
