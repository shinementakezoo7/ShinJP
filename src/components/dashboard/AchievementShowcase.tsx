'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

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
}

export default function AchievementShowcase() {
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [filter, setFilter] = useState<string>('all')

  const achievements: Achievement[] = [
    {
      id: 1,
      title: 'First Steps',
      description: 'Complete your first lesson',
      icon: '👣',
      rarity: 'common',
      unlocked: true,
      unlockedDate: '2 days ago',
      category: 'lessons',
    },
    {
      id: 2,
      title: 'Week Warrior',
      description: 'Maintain a 7-day streak',
      icon: '🔥',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: 'Today',
      category: 'streak',
    },
    {
      id: 3,
      title: 'Vocabulary Master',
      description: 'Learn 500 vocabulary words',
      icon: '📚',
      rarity: 'epic',
      unlocked: false,
      progress: 342,
      requirement: 500,
      category: 'vocabulary',
    },
    {
      id: 4,
      title: 'Kanji Legend',
      description: 'Master all N3 kanji characters',
      icon: '🏯',
      rarity: 'legendary',
      unlocked: false,
      progress: 120,
      requirement: 370,
      category: 'mastery',
    },
    {
      id: 5,
      title: 'Social Butterfly',
      description: 'Join 3 study groups',
      icon: '🦋',
      rarity: 'rare',
      unlocked: true,
      unlockedDate: 'Yesterday',
      category: 'social',
    },
    {
      id: 6,
      title: 'Perfect Score',
      description: 'Get 100% on any lesson',
      icon: '💯',
      rarity: 'epic',
      unlocked: false,
      progress: 95,
      requirement: 100,
      category: 'lessons',
    },
    {
      id: 7,
      title: 'Century Club',
      description: 'Reach a 100-day streak',
      icon: '💎',
      rarity: 'legendary',
      unlocked: false,
      progress: 7,
      requirement: 100,
      category: 'streak',
    },
    {
      id: 8,
      title: 'Speed Reader',
      description: 'Complete 10 lessons in one day',
      icon: '⚡',
      rarity: 'epic',
      unlocked: false,
      progress: 3,
      requirement: 10,
      category: 'lessons',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl shadow-lg">
            🏆
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Achievements</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {unlockedCount} of {totalCount} unlocked
            </p>
          </div>
        </div>

        {/* Progress Badge */}
        <div className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-full shadow-lg">
          <div className="text-center">
            <div className="text-2xl font-black">
              {Math.round((unlockedCount / totalCount) * 100)}%
            </div>
            <div className="text-xs font-semibold opacity-90">Complete</div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-1 bg-gray-200 dark:bg-gray-800 rounded-xl overflow-x-auto">
        {['all', 'unlocked', 'locked', 'streak', 'vocabulary', 'lessons', 'social', 'mastery'].map(
          (f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                filter === f
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md scale-105'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          )
        )}
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AnimatePresence>
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              onClick={() => setSelectedAchievement(achievement)}
              className="group cursor-pointer"
            >
              <div
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  achievement.unlocked
                    ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} border-transparent shadow-xl ${getRarityGlow(achievement.rarity)} hover:scale-105`
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 hover:scale-102'
                }`}
              >
                {/* Locked Overlay */}
                {!achievement.unlocked && (
                  <div className="absolute inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div
                    className={`text-5xl mb-3 ${achievement.unlocked ? 'animate-bounce-slow' : 'grayscale opacity-50'}`}
                  >
                    {achievement.icon}
                  </div>

                  <h3
                    className={`font-bold text-sm mb-1 ${
                      achievement.unlocked ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {achievement.title}
                  </h3>

                  {achievement.unlocked ? (
                    <p className="text-xs text-white/80 font-medium">{achievement.unlockedDate}</p>
                  ) : (
                    achievement.progress !== undefined &&
                    achievement.requirement && (
                      <div className="mt-2">
                        <div className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">
                          {achievement.progress}/{achievement.requirement}
                        </div>
                        <div className="h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                            style={{
                              width: `${(achievement.progress / achievement.requirement) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* Rarity Badge */}
                {achievement.unlocked && (
                  <div className="absolute top-2 right-2">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-black ${getRarityBadge(achievement.rarity)}`}
                    >
                      {achievement.rarity.toUpperCase()}
                    </div>
                  </div>
                )}

                {/* Sparkle Effect for Legendary */}
                {achievement.unlocked && achievement.rarity === 'legendary' && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-2 left-2 w-2 h-2 bg-white rounded-full animate-ping" />
                    <div
                      className="absolute bottom-2 right-2 w-2 h-2 bg-white rounded-full animate-ping"
                      style={{ animationDelay: '0.5s' }}
                    />
                  </div>
                )}
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
