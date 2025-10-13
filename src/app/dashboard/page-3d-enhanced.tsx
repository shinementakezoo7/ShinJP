'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Animated3DCard from '@/components/3d/cards/Animated3DCard'
import { usePexelsPhotos } from '@/hooks/usePexelsAssets'

const CherryBlossomScene = dynamic(() => import('@/components/japanese/CherryBlossomScene'), {
  ssr: false,
})

export default function Enhanced3DDashboard() {
  const [mounted, setMounted] = useState(false)
  const { photos } = usePexelsPhotos('japan cherry blossom', 5)

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
      glowColor: 'rgba(22, 94, 131, 0.4)',
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
      glowColor: 'rgba(108, 141, 47, 0.4)',
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
      glowColor: 'rgba(255, 177, 27, 0.4)',
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
      glowColor: 'rgba(217, 51, 63, 0.4)',
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
      color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      id: 2,
      title: 'Kanji Writing Practice',
      type: 'Practice',
      score: '15 chars',
      time: 'Yesterday',
      icon: '✍️',
      color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 3,
      title: 'JLPT N3 Prep',
      type: 'Study Group',
      score: '12 members',
      time: '2 days ago',
      icon: '👥',
      color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      gradient: 'from-purple-500 to-pink-600',
    },
  ]

  const quickActions = [
    {
      name: 'Continue Learning',
      icon: '📚',
      link: '/lessons',
      description: 'Resume your last lesson',
      gradient: 'from-blue-500 to-indigo-600',
      glowColor: 'rgba(59, 130, 246, 0.4)',
    },
    {
      name: 'AI Books',
      icon: '📕',
      link: '/books',
      description: 'Generate personalized content',
      gradient: 'from-purple-500 to-pink-600',
      glowColor: 'rgba(168, 85, 247, 0.4)',
    },
    {
      name: 'Chat Practice',
      icon: '💬',
      link: '/chat',
      description: 'Converse with AI sensei',
      gradient: 'from-cyan-500 to-blue-600',
      glowColor: 'rgba(6, 182, 212, 0.4)',
    },
    {
      name: 'Practice Drills',
      icon: '⚡',
      link: '/practice',
      description: 'Strengthen your skills',
      gradient: 'from-green-500 to-emerald-600',
      glowColor: 'rgba(34, 197, 94, 0.4)',
    },
  ]

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-950/20">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            🏯
          </motion.div>
          <div className="text-2xl japanese-text font-bold text-gray-700 dark:text-gray-300">
            読み込み中...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-red-950/20 relative overflow-hidden">
      {/* 3D Background */}
      <CherryBlossomScene />

      {/* Pexels Background Image */}
      {photos.length > 0 && (
        <div className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none">
          <img
            src={photos[0].src.large}
            alt="Japan background"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 360],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          >
            {['🌸', '🏯', '⛩️', '🎋', '🏮'][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-4 mb-6">
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.div
              className="text-6xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🏯
            </motion.div>
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-4 japanese-heading">
            <motion.span
              className="inline-block japanese-text bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 bg-clip-text text-transparent"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              道場
            </motion.span>
          </h1>

          <p className="text-2xl sm:text-3xl font-bold mb-2">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Student
            </span>
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Your journey to mastering Japanese continues here
          </p>
        </motion.div>

        {/* 3D Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={stat.link}>
                <Animated3DCard intensity={15} glowColor={stat.glowColor}>
                  <div className="p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                    {/* Icon and Badge */}
                    <div className="flex items-center justify-between mb-6">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-3xl shadow-xl`}
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        {stat.icon}
                      </motion.div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                      >
                        {stat.change}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="text-center space-y-2">
                      <div className="text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                      <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {stat.name}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{stat.subtext}</div>
                    </div>

                    {/* Kanji Background */}
                    <div className="absolute top-4 right-4 text-6xl japanese-text opacity-5 pointer-events-none">
                      {stat.kanji}
                    </div>
                  </div>
                </Animated3DCard>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <motion.h2
              className="text-3xl font-bold flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span>📊</span>
              <span>Recent Activity</span>
              <span className="japanese-text text-2xl text-gray-500">歴</span>
            </motion.h2>

            {recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Animated3DCard intensity={10} glowColor="rgba(168, 85, 247, 0.3)">
                  <div className="p-6 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${activity.color} shadow-lg`}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                      >
                        {activity.icon}
                      </motion.div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                            {activity.title}
                          </h3>
                          <span
                            className={`text-xs font-bold px-3 py-1 bg-gradient-to-r ${activity.gradient} text-white rounded-full whitespace-nowrap`}
                          >
                            {activity.type}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {activity.score}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-600 dark:text-gray-400">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Animated3DCard>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <motion.h2
              className="text-3xl font-bold flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <span>🚀</span>
              <span>Quick Start</span>
              <span className="japanese-text text-2xl text-gray-500">始</span>
            </motion.h2>

            {quickActions.map((action, index) => (
              <motion.div
                key={action.name}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={action.link}>
                  <Animated3DCard intensity={12} glowColor={action.glowColor}>
                    <div className="p-6 bg-white dark:bg-gray-800">
                      <div className="flex items-center gap-4">
                        <motion.div
                          className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center text-2xl shadow-lg`}
                          whileHover={{ scale: 1.3, rotate: -15 }}
                        >
                          {action.icon}
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                            {action.name}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {action.description}
                          </div>
                        </div>

                        <motion.svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          whileHover={{ x: 5 }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                          />
                        </motion.svg>
                      </div>
                    </div>
                  </Animated3DCard>
                </Link>
              </motion.div>
            ))}

            {/* Motivational Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Animated3DCard intensity={15} glowColor="rgba(236, 72, 153, 0.4)">
                <div className="p-8 bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 text-white">
                  <div className="flex items-start gap-4">
                    <motion.div
                      className="text-5xl"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                    >
                      💪
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-black mb-2 japanese-text">頑張って！</h3>
                      <p className="text-white/90 font-medium">
                        You&apos;re making great progress. Every lesson brings you closer to
                        fluency!
                      </p>
                    </div>
                  </div>
                </div>
              </Animated3DCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
