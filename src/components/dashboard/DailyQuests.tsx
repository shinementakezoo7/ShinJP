'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

interface Quest {
  id: number
  title: string
  description: string
  type: 'vocabulary' | 'practice' | 'lesson' | 'streak'
  progress: number
  goal: number
  reward: {
    xp: number
    coins?: number
  }
  icon: string
  completed: boolean
  difficulty: 'easy' | 'medium' | 'hard'
}

export default function DailyQuests() {
  const [quests, setQuests] = useState<Quest[]>([
    {
      id: 1,
      title: 'Vocabulary Master',
      description: 'Learn 20 new vocabulary words',
      type: 'vocabulary',
      progress: 12,
      goal: 20,
      reward: { xp: 100, coins: 10 },
      icon: '📚',
      completed: false,
      difficulty: 'medium',
    },
    {
      id: 2,
      title: 'Practice Makes Perfect',
      description: 'Complete 5 practice exercises',
      type: 'practice',
      progress: 5,
      goal: 5,
      reward: { xp: 150, coins: 15 },
      icon: '⚡',
      completed: true,
      difficulty: 'easy',
    },
    {
      id: 3,
      title: 'Daily Dedication',
      description: 'Maintain your streak for today',
      type: 'streak',
      progress: 1,
      goal: 1,
      reward: { xp: 50 },
      icon: '🔥',
      completed: true,
      difficulty: 'easy',
    },
  ])

  const [showReward, setShowReward] = useState<number | null>(null)
  const [totalXP, setTotalXP] = useState(0)

  const completedQuests = quests.filter((q) => q.completed).length
  const totalQuests = quests.length
  const overallProgress = (completedQuests / totalQuests) * 100

  const claimReward = (questId: number) => {
    const quest = quests.find((q) => q.id === questId)
    if (quest && quest.completed) {
      setShowReward(questId)
      setTotalXP((prev) => prev + quest.reward.xp)

      setTimeout(() => {
        setShowReward(null)
      }, 2000)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'from-green-500 to-emerald-600'
      case 'medium':
        return 'from-orange-500 to-amber-600'
      case 'hard':
        return 'from-red-500 to-pink-600'
      default:
        return 'from-gray-500 to-gray-600'
    }
  }

  const getDifficultyBadgeColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'medium':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
      case 'hard':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-2xl shadow-lg">
            ⚔️
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">Daily Quests</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete quests to earn XP and rewards
            </p>
          </div>
        </div>

        {/* Quest Progress Badge */}
        <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-full shadow-lg">
          <span className="font-bold text-sm">
            {completedQuests}/{totalQuests} Complete
          </span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">Daily Progress</span>
          <span className="text-sm font-bold text-orange-600 dark:text-orange-400">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${overallProgress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-orange-500 to-red-600 rounded-full relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>

      {/* Quests Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {quests.map((quest, index) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative"
            >
              <div
                className={`relative p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border-2 ${
                  quest.completed
                    ? 'border-green-500/50 dark:border-green-400/50'
                    : 'border-gray-200/50 dark:border-gray-700/50'
                } shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                {/* Completion Overlay */}
                {quest.completed && (
                  <div className="absolute inset-0 bg-green-500/5 dark:bg-green-400/5 rounded-2xl" />
                )}

                <div className="flex items-start gap-5">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getDifficultyColor(
                      quest.difficulty
                    )} flex items-center justify-center text-3xl shadow-lg ${
                      quest.completed ? 'scale-100' : 'group-hover:scale-110 group-hover:rotate-12'
                    } transition-all duration-500 relative`}
                  >
                    {quest.icon}
                    {quest.completed && (
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                          {quest.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {quest.description}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getDifficultyBadgeColor(
                          quest.difficulty
                        )}`}
                      >
                        {quest.difficulty.toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs font-semibold mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span
                          className={
                            quest.completed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-900 dark:text-white'
                          }
                        >
                          {quest.progress} / {quest.goal}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(quest.progress / quest.goal) * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          className={`h-full bg-gradient-to-r ${getDifficultyColor(
                            quest.difficulty
                          )} rounded-full`}
                        />
                      </div>
                    </div>

                    {/* Rewards & Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <span className="text-lg">⭐</span>
                          <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                            +{quest.reward.xp} XP
                          </span>
                        </div>
                        {quest.reward.coins && (
                          <div className="flex items-center gap-1 px-3 py-1.5 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <span className="text-lg">🪙</span>
                            <span className="text-sm font-bold text-amber-700 dark:text-amber-400">
                              +{quest.reward.coins}
                            </span>
                          </div>
                        )}
                      </div>

                      {quest.completed ? (
                        <button
                          onClick={() => claimReward(quest.id)}
                          className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          Claim Reward
                        </button>
                      ) : (
                        <Link
                          href={`/${quest.type}`}
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                        >
                          Start Quest
                        </Link>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reward Popup */}
                <AnimatePresence>
                  {showReward === quest.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: -10 }}
                      exit={{ opacity: 0, scale: 0.5, y: -30 }}
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
                    >
                      <div className="px-8 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-2xl shadow-2xl">
                        <div className="text-center">
                          <div className="text-4xl mb-2">🎉</div>
                          <div className="font-black text-xl">+{quest.reward.xp} XP</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* All Quests Complete Banner */}
      {completedQuests === totalQuests && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl overflow-hidden relative"
        >
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" />
            <div
              className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </div>

          <div className="relative z-10 text-center text-white">
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-3xl font-black mb-2">All Quests Complete!</h3>
            <p className="text-lg mb-4 opacity-95">
              You&apos;ve completed all daily quests. Come back tomorrow for new challenges!
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-xl">Total: +{totalXP} XP Today</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
