'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Link from 'next/link'

// Mock data for community content
const MOCK_POSTS = [
  {
    id: 1,
    author: {
      name: 'Yuki Tanaka',
      avatar: '🦊',
      level: 'N3',
      points: 2840,
    },
    content:
      'Just passed my N3 exam! 🎉 The grammar section was tough but the listening practice from this community really helped. ありがとうございました！',
    likes: 42,
    comments: 15,
    timeAgo: '2h ago',
    topic: 'study-tips',
  },
  {
    id: 2,
    author: {
      name: 'Alex Chen',
      avatar: '🐼',
      level: 'N4',
      points: 1560,
    },
    content:
      "Looking for a language exchange partner! Native English speaker learning Japanese. Can help with business English. Let's practice together! 📚",
    likes: 28,
    comments: 12,
    timeAgo: '4h ago',
    topic: 'language-exchange',
  },
  {
    id: 3,
    author: {
      name: 'Sakura Yamamoto',
      avatar: '🌸',
      level: 'N1',
      points: 8920,
    },
    content:
      "Recommendation: Check out the new Genki III textbook series. It's perfect for bridging N4 to N2 level. The exercises are practical and fun! 📖",
    likes: 67,
    comments: 23,
    timeAgo: '6h ago',
    topic: 'resources',
  },
  {
    id: 4,
    author: {
      name: 'Marcus Johnson',
      avatar: '🦅',
      level: 'N2',
      points: 4250,
    },
    content:
      "Grammar help needed: What's the difference between ～てしまう and ～ちゃう? I keep mixing them up in conversation. Anyone have good examples? 🤔",
    likes: 19,
    comments: 31,
    timeAgo: '1d ago',
    topic: 'grammar-help',
  },
  {
    id: 5,
    author: {
      name: 'Kenji Watanabe',
      avatar: '⚡',
      level: 'Native',
      points: 12500,
    },
    content:
      'Native speaker here! Happy to answer any questions about natural Japanese expressions or cultural nuances. Ask me anything! 🇯🇵',
    likes: 93,
    comments: 47,
    timeAgo: '1d ago',
    topic: 'general',
  },
]

const STUDY_GROUPS = [
  {
    id: 1,
    name: 'JLPT N3 Warriors',
    description: 'Daily study sessions for N3 exam preparation',
    members: 145,
    icon: '⚔️',
    color: 'from-red-500 to-orange-500',
    active: true,
  },
  {
    id: 2,
    name: 'Kanji Masters',
    description: 'Master 2000+ kanji together through interactive practice',
    members: 289,
    icon: '漢',
    color: 'from-purple-500 to-pink-500',
    active: true,
  },
  {
    id: 3,
    name: 'Anime Learning Club',
    description: 'Learn Japanese through anime and pop culture',
    members: 421,
    icon: '🎬',
    color: 'from-blue-500 to-cyan-500',
    active: true,
  },
  {
    id: 4,
    name: 'Business Japanese',
    description: 'Professional Japanese for workplace communication',
    members: 97,
    icon: '💼',
    color: 'from-green-500 to-teal-500',
    active: true,
  },
  {
    id: 5,
    name: 'Speaking Practice',
    description: 'Daily voice chat sessions for conversation practice',
    members: 234,
    icon: '🎤',
    color: 'from-amber-500 to-yellow-500',
    active: true,
  },
  {
    id: 6,
    name: 'Reading Circle',
    description: 'Read Japanese books and manga together',
    members: 178,
    icon: '📚',
    color: 'from-indigo-500 to-purple-500',
    active: false,
  },
]

const LEADERBOARD = [
  { rank: 1, name: 'Kenji Watanabe', avatar: '⚡', points: 12500, badge: '👑' },
  { rank: 2, name: 'Sakura Yamamoto', avatar: '🌸', points: 8920, badge: '🥈' },
  { rank: 3, name: 'Marcus Johnson', avatar: '🦅', points: 4250, badge: '🥉' },
  { rank: 4, name: 'Yuki Tanaka', avatar: '🦊', points: 2840, badge: '' },
  { rank: 5, name: 'Alex Chen', avatar: '🐼', points: 1560, badge: '' },
]

const CHALLENGES = [
  {
    id: 1,
    title: '30-Day Kanji Challenge',
    description: 'Learn 10 new kanji every day for 30 days',
    participants: 567,
    daysLeft: 12,
    reward: '1000 pts',
    color: 'from-red-500 to-pink-500',
    icon: '🔥',
  },
  {
    id: 2,
    title: 'Speaking Marathon',
    description: 'Practice speaking for 1 hour every day this week',
    participants: 234,
    daysLeft: 3,
    reward: '500 pts',
    color: 'from-blue-500 to-purple-500',
    icon: '🎯',
  },
  {
    id: 3,
    title: 'Grammar Guru',
    description: 'Complete 100 grammar exercises with 90% accuracy',
    participants: 389,
    daysLeft: 7,
    reward: '750 pts',
    color: 'from-green-500 to-teal-500',
    icon: '📝',
  },
]

const TOPICS = [
  { id: 'all', name: 'All Posts', icon: '🌐', count: 432 },
  { id: 'grammar-help', name: 'Grammar Help', icon: '📖', count: 127 },
  { id: 'study-tips', name: 'Study Tips', icon: '💡', count: 89 },
  { id: 'resources', name: 'Resources', icon: '📚', count: 156 },
  { id: 'language-exchange', name: 'Language Exchange', icon: '💬', count: 34 },
  { id: 'general', name: 'General', icon: '✨', count: 26 },
]

const STATS = [
  { label: 'Active Members', value: '2,847', icon: '👥', color: 'from-blue-500 to-cyan-500' },
  { label: 'Study Groups', value: '24', icon: '📚', color: 'from-purple-500 to-pink-500' },
  { label: 'Weekly Posts', value: '432', icon: '✍️', color: 'from-green-500 to-teal-500' },
  { label: 'Total Points', value: '125K', icon: '⭐', color: 'from-amber-500 to-orange-500' },
]

export default function CommunityPage() {
  const [selectedTopic, setSelectedTopic] = useState('all')
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredPosts =
    selectedTopic === 'all' ? MOCK_POSTS : MOCK_POSTS.filter((post) => post.topic === selectedTopic)

  const handleLike = (postId: number) => {
    setLikedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20">
      {/* Enhanced Navbar */}
      <header className="navbar-liquid-enhanced sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link href="/" className="navbar-logo-enhanced flex items-center gap-3 group">
              <div className="relative">
                <span className="japanese-text text-4xl text-red-700 dark:text-red-400 relative z-10 transition-all duration-300 group-hover:scale-110">
                  侍
                </span>
                <div className="absolute inset-0 bg-red-600/30 dark:bg-red-400/30 blur-xl rounded-full animate-pulse-slow"></div>
              </div>
              <div>
                <div className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Community
                </div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400 japanese-text">
                  コミュニティ
                </div>
              </div>
            </Link>

            <Link
              href="/"
              className="px-6 py-2.5 text-sm font-bold rounded-full bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 text-white hover:scale-105 transition-transform shadow-lg"
            >
              ← Back Home
            </Link>
          </div>
        </div>
        <div className="navbar-border-animation"></div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <div className="relative inline-block mb-6">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 dark:text-white mb-4">
              <span className="japanese-text text-6xl sm:text-7xl md:text-8xl text-red-700 dark:text-red-400">
                仲間
              </span>
              <br />
              <span className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent">
                Community
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            Connect, learn, and grow with fellow Japanese learners from around the world
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative p-6 rounded-2xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl overflow-hidden group hover:scale-105 transition-transform"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              ></div>
              <div className="relative z-10">
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Posts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Topic Filter */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🏷️</span> Filter by Topic
              </h2>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                      selectedTopic === topic.id
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg scale-105'
                        : 'bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:scale-105'
                    }`}
                  >
                    <span className="mr-1">{topic.icon}</span>
                    {topic.name}
                    <span className="ml-1 text-xs opacity-75">({topic.count})</span>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Discussion Posts */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedTopic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {filteredPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6 hover:scale-[1.02] transition-transform"
                  >
                    {/* Post Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="text-4xl">{post.author.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {post.author.name}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-orange-600 text-white">
                            {post.author.level}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {post.author.points} pts
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{post.timeAgo}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-gray-800 dark:text-gray-200 mb-4 leading-relaxed">
                      {post.content}
                    </p>

                    {/* Post Actions */}
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm transition-all ${
                          likedPosts.has(post.id)
                            ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg scale-105'
                            : 'bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:scale-105'
                        }`}
                      >
                        <span>{likedPosts.has(post.id) ? '❤️' : '🤍'}</span>
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform">
                        <span>💬</span>
                        {post.comments}
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-full font-medium text-sm bg-white/50 dark:bg-black/30 text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform">
                        <span>🔗</span>
                        Share
                      </button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🏆</span> Top Contributors
              </h2>
              <div className="space-y-3">
                {LEADERBOARD.map((user) => (
                  <div
                    key={user.rank}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/50 dark:bg-black/30 hover:scale-105 transition-transform"
                  >
                    <div className="text-xl font-black text-gray-500 dark:text-gray-400 w-6">
                      #{user.rank}
                    </div>
                    <div className="text-2xl">{user.avatar}</div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-gray-900 dark:text-white text-sm truncate">
                        {user.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        {user.points.toLocaleString()} pts
                      </div>
                    </div>
                    {user.badge && <div className="text-2xl">{user.badge}</div>}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Study Groups */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>👥</span> Study Groups
              </h2>
              <div className="space-y-3">
                {STUDY_GROUPS.slice(0, 4).map((group) => (
                  <div
                    key={group.id}
                    className="relative p-4 rounded-xl bg-white/50 dark:bg-black/30 overflow-hidden group hover:scale-105 transition-transform"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${group.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                    ></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="text-2xl">{group.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                            {group.name}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {group.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              👤 {group.members} members
                            </span>
                            {group.active && (
                              <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <button className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold hover:scale-105 transition-transform">
                        Join Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 px-4 py-2 rounded-lg border-2 border-red-600/40 text-red-700 dark:text-red-400 text-sm font-bold hover:scale-105 transition-transform">
                View All Groups →
              </button>
            </motion.div>

            {/* Community Challenges */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>🎯</span> Active Challenges
              </h2>
              <div className="space-y-3">
                {CHALLENGES.map((challenge) => (
                  <div
                    key={challenge.id}
                    className="relative p-4 rounded-xl bg-white/50 dark:bg-black/30 overflow-hidden group hover:scale-105 transition-transform"
                  >
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${challenge.color} opacity-10 group-hover:opacity-20 transition-opacity`}
                    ></div>
                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="text-2xl">{challenge.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1">
                            {challenge.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {challenge.description}
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500 dark:text-gray-400">
                              👥 {challenge.participants} joined
                            </span>
                            <span className="font-bold text-red-600 dark:text-red-400">
                              ⏰ {challenge.daysLeft}d left
                            </span>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                              🏆 {challenge.reward}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button className="w-full mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-orange-600 text-white text-sm font-bold hover:scale-105 transition-transform">
                        Join Challenge
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Floating Action Button */}
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 text-white text-3xl shadow-2xl hover:shadow-red-500/50 flex items-center justify-center z-50"
        >
          ✍️
        </motion.button>
      </main>

      {/* Floating Sakura Petals */}
      {mounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -100,
                rotate: 0,
              }}
              animate={{
                y: window.innerHeight + 100,
                x: Math.random() * window.innerWidth,
                rotate: 360,
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                delay: i * 2,
                ease: 'linear',
              }}
            >
              🌸
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
