'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type JLPT = 'N5' | 'N4' | 'N3' | 'N2' | 'N1' | 'ALL'
type ChallengeType = 'kanji' | 'speaking' | 'grammar' | 'listening' | 'reading'

interface Challenge {
  id: number
  title: string
  description: string
  type: ChallengeType
  jlptLevel: JLPT
  participants: number
  daysLeft: number
  reward: string
  color: string
  icon: string
}

const CHALLENGES: Challenge[] = [
  {
    id: 1,
    title: '30-Day Kanji Challenge',
    description: 'Learn 10 new kanji every day for 30 days',
    type: 'kanji',
    jlptLevel: 'N3',
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
    type: 'speaking',
    jlptLevel: 'N4',
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
    type: 'grammar',
    jlptLevel: 'N2',
    participants: 389,
    daysLeft: 7,
    reward: '750 pts',
    color: 'from-green-500 to-teal-500',
    icon: '📝',
  },
  {
    id: 4,
    title: 'Listening Sprint',
    description: '30 minutes daily listening drills for 2 weeks',
    type: 'listening',
    jlptLevel: 'N5',
    participants: 198,
    daysLeft: 9,
    reward: '400 pts',
    color: 'from-amber-500 to-orange-500',
    icon: '🎧',
  },
  {
    id: 5,
    title: 'Reading Circle',
    description: 'Read 5 short stories and summarize',
    type: 'reading',
    jlptLevel: 'N3',
    participants: 312,
    daysLeft: 5,
    reward: '600 pts',
    color: 'from-indigo-500 to-purple-500',
    icon: '📚',
  },
]

export default function ChallengesPage() {
  const [typeFilter, setTypeFilter] = useState<ChallengeType | 'all'>('all')
  const [jlptFilter, setJlptFilter] = useState<JLPT>('ALL')
  const [sortKey, setSortKey] = useState<'popular' | 'endingSoon'>('popular')
  const [search, setSearch] = useState('')
  const [joined, setJoined] = useState<Set<number>>(new Set())
  const [selected, setSelected] = useState<Challenge | null>(null)
  const uniqueTypes = Array.from(new Set(CHALLENGES.map((c) => c.type)))

  useEffect(() => {
    try {
      const raw = localStorage.getItem('joinedChallenges')
      if (raw) setJoined(new Set(JSON.parse(raw)))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('joinedChallenges', JSON.stringify(Array.from(joined)))
    } catch {}
  }, [joined])

  const filtered = useMemo(() => {
    let list = CHALLENGES.slice()
    if (typeFilter !== 'all') list = list.filter((c) => c.type === typeFilter)
    if (jlptFilter !== 'ALL') list = list.filter((c) => c.jlptLevel === jlptFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      )
    }
    if (sortKey === 'popular') list.sort((a, b) => b.participants - a.participants)
    else list.sort((a, b) => a.daysLeft - b.daysLeft)
    return list
  }, [typeFilter, jlptFilter, sortKey, search])

  const toggleJoin = (id: number) => {
    setJoined((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    // TODO: Persist to server (Supabase/TRPC) for authenticated users
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative mb-6 rounded-2xl overflow-hidden"
        >
          <div className="relative z-10 bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 p-6 rounded-2xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white">
                  Community Challenges
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level up with goal-based learning and friendly competition
                </p>
              </div>
              <Link
                href="/community"
                className="px-4 py-2 rounded-lg border-2 border-red-600/40 text-red-700 dark:text-red-400 text-sm font-bold hover:scale-105 transition-transform"
              >
                ← Back to Community
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl p-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Type</label>
              <div className="flex flex-wrap gap-2">
                {(['all', ...uniqueTypes] as Array<ChallengeType | 'all'>).map((t) => (
                  <motion.button
                    key={t}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTypeFilter(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${
                      typeFilter === t
                        ? 'bg-gradient-to-r from-red-600 to-orange-600 text-white border-transparent'
                        : 'bg-white/80 dark:bg-gray-900 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700'
                    }`}
                  >
                    {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">JLPT</label>
              <select
                value={jlptFilter}
                onChange={(e) => setJlptFilter(e.target.value as JLPT)}
                className="w-full px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm"
              >
                {['ALL', 'N5', 'N4', 'N3', 'N2', 'N1'].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Sort</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm"
              >
                <option value="popular">Most Popular</option>
                <option value="endingSoon">Ending Soon</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Search</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Find a challenge..."
                className="w-full px-3 py-2 rounded-lg bg-white/80 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.05 * idx }}
                whileHover={{ scale: 1.02, y: -2 }}
                className="relative p-4 rounded-2xl bg-white/70 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/10 dark:border-red-400/10 shadow-xl overflow-hidden group"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${c.color} opacity-10`} />
                <div className="relative z-10">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{c.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-white/80 dark:bg-gray-800 text-[10px] border border-gray-200 dark:border-gray-700">
                          {c.jlptLevel}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-white/80 dark:bg-gray-800 text-[10px] border border-gray-200 dark:border-gray-700 capitalize">
                          {c.type}
                        </span>
                      </div>
                      <h3 className="mt-1 font-bold text-gray-900 dark:text-white text-sm">
                        {c.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        {c.description}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 dark:text-gray-400">
                          👥 {c.participants} joined
                        </span>
                        <span className="font-bold text-red-600 dark:text-red-400">
                          ⏰ {c.daysLeft}d left
                        </span>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                          🏆 {c.reward}
                        </span>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelected(c)}
                            className="px-3 py-1.5 rounded-lg border-2 border-red-600/40 text-red-700 dark:text-red-400 text-xs font-bold hover:scale-105 transition-transform"
                          >
                            Details
                          </motion.button>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleJoin(c.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold hover:shadow-lg ${
                              joined.has(c.id)
                                ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                            }`}
                          >
                            {joined.has(c.id) ? 'Joined' : 'Join'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Progress preview */}
                  <div className="mt-3">
                    <div className="h-2 bg-gray-200/60 dark:bg-gray-700/60 rounded-full overflow-hidden">
                      <motion.div
                        className="h-2 bg-gradient-to-r from-red-600 via-orange-600 to-amber-600"
                        initial={{ width: '15%' }}
                        animate={{ width: `${25 + (idx % 4) * 15}%` }}
                        transition={{ duration: 0.7, delay: 0.05 * idx }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400">
                      <span>Goal progress</span>
                      <span>{25 + (idx % 4) * 15}%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              className="fixed inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="absolute inset-0 bg-black/40"
                onClick={() => setSelected(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
              <motion.div
                className="absolute inset-0 flex items-center justify-center p-4"
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 10, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              >
                <div className="w-full max-w-lg rounded-2xl bg-white/80 dark:bg-black/60 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-2xl overflow-hidden">
                  <div className={`relative p-5`}>
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${selected.color} opacity-10`}
                    />
                    <div className="relative z-10">
                      <div className="flex items-start gap-3 mb-2">
                        <div className="text-3xl">{selected.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {selected.title}
                          </h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            JLPT {selected.jlptLevel} • {selected.type}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-gray-800 dark:text-gray-200">
                        {selected.description}
                      </p>
                      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-white/70 dark:bg-black/40 border border-gray-200/60 dark:border-gray-700/60">
                          👥 Participants
                          <div className="text-sm font-bold">{selected.participants}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/70 dark:bg-black/40 border border-gray-200/60 dark:border-gray-700/60">
                          ⏰ Days Left
                          <div className="text-sm font-bold">{selected.daysLeft}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/70 dark:bg-black/40 border border-gray-200/60 dark:border-gray-700/60">
                          🏆 Reward
                          <div className="text-sm font-bold">{selected.reward}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-white/70 dark:bg-black/40 border border-gray-200/60 dark:border-gray-700/60">
                          🎯 Focus
                          <div className="text-sm font-bold capitalize">{selected.type}</div>
                        </div>
                      </div>
                      {/* Suggested tasks */}
                      <div className="mt-4">
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                          Suggested tasks
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {['Practice 20 mins', 'Review mistakes', 'Share progress'].map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 rounded-lg bg-white/70 dark:bg-black/40 border border-gray-200/60 dark:border-gray-700/60 text-[11px]"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="mt-5 flex items-center justify-end gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelected(null)}
                          className="px-3 py-2 rounded-lg border-2 border-red-600/40 text-red-700 dark:text-red-400 text-xs font-bold"
                        >
                          Close
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            toggleJoin(selected.id)
                            setSelected(null)
                          }}
                          className={`px-3 py-2 rounded-lg text-xs font-bold ${
                            joined.has(selected.id)
                              ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white'
                              : 'bg-gradient-to-r from-red-600 to-orange-600 text-white'
                          }`}
                        >
                          {joined.has(selected.id) ? 'Joined' : 'Join'}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
