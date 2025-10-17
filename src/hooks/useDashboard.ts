'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { getStudySessions } from '@/lib/database/functions/analytics'
import { getUserLessonProgress, getLessonModules } from '@/lib/database/functions/lessons'
import { getExercises } from '@/lib/database/functions/exercises'
import { getUserAchievements } from '@/lib/database/functions/achievements'
import type { StudySession, UserLessonProgress, Exercise } from '@/lib/database/types'

interface DashboardStats {
  lessonsCompleted: number
  vocabularyLearned: number
  streakDays: number
}

interface DashboardData {
  stats: DashboardStats
  sessions: StudySession[]
  lessonProgress: UserLessonProgress[]
  exercises: Exercise[]
  achievementsCount: number
  loading: boolean
  error: string | null
}

function computeStreak(sessions: StudySession[]): number {
  if (!sessions || sessions.length === 0) return 0
  const days = new Set(sessions.map((s) => new Date(s.start_time).toISOString().split('T')[0]))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().split('T')[0]
    if (days.has(key)) streak++
    else break
  }
  return streak
}

export function useDashboard(userId?: string): DashboardData {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>([])
  const [lessonProgress, setLessonProgress] = useState<UserLessonProgress[]>([])
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [achievementsCount, setAchievementsCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    async function fetchAll() {
      setLoading(true)
      setError(null)
      try {
        const effectiveUserId = userId || 'anonymous'

        // Study sessions
        const s = effectiveUserId && supabase ? await getStudySessions(effectiveUserId, 50) : null
        if (isMounted && s) setSessions(s)

        // Lessons
        const lp = effectiveUserId && supabase ? await getUserLessonProgress(effectiveUserId) : null
        if (isMounted && lp) setLessonProgress(lp)
        // Helpful to warm lesson modules (ids/names)
        if (supabase) await getLessonModules()

        // Exercises
        const ex = supabase ? await getExercises() : null
        if (isMounted && ex) setExercises(ex)

        // Achievements
        const ach = effectiveUserId && supabase ? await getUserAchievements(effectiveUserId) : null
        if (isMounted && ach) setAchievementsCount(ach.length)
      } catch (e) {
        console.error('Dashboard data error:', e)
        if (isMounted) setError('Failed to load dashboard data')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchAll()
    return () => {
      isMounted = false
    }
  }, [userId])

  const stats = useMemo<DashboardStats>(() => {
    const lessonsCompleted = lessonProgress.filter((p) => p.completed_at).length
    // Rough vocabulary learned estimate from sessions activities if present
    let vocabularyLearned = 0
    for (const s of sessions) {
      const activities = s.activities as any
      if (activities && typeof activities === 'object') {
        const v = activities.vocabulary || activities.vocab || 0
        vocabularyLearned += typeof v === 'number' ? v : 0
      }
    }
    // fallback: proportional to exercises length if not available
    if (vocabularyLearned === 0 && exercises.length > 0) {
      vocabularyLearned = Math.min(300, exercises.length * 3)
    }
    const streakDays = computeStreak(sessions)
    return { lessonsCompleted, vocabularyLearned, streakDays }
  }, [lessonProgress, sessions, exercises])

  return {
    stats,
    sessions,
    lessonProgress,
    exercises,
    achievementsCount,
    loading,
    error,
  }
}
