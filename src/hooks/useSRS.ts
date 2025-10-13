import { useEffect, useState } from 'react'
import {
  calculateEnhancedSM2,
  createSRSCard,
  getDueSRSCards,
  getSRSCardByContent,
  getUserPerformance,
  getUserSRSCards,
  updateSRSCard,
  updateUserPerformance,
} from '@/lib/database/functions/srs'
import type { SRSCard } from '@/lib/database/types'
import { supabase } from '@/lib/supabase/client'

export const useSRS = (userId: string | undefined) => {
  const [srsCards, setSrsCards] = useState<SRSCard[]>([])
  const [dueCards, setDueCards] = useState<SRSCard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !supabase) return

    const fetchSRSCards = async () => {
      setLoading(true)
      try {
        const cards = await getUserSRSCards(userId)
        if (cards) {
          setSrsCards(cards)
        }

        const due = await getDueSRSCards(userId)
        if (due) {
          setDueCards(due)
        }
      } catch (err) {
        setError('Failed to fetch SRS cards')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSRSCards()

    // Set up real-time subscription
    const channel = supabase
      .channel('srs-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'srs_cards',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setSrsCards((prev) => [...prev, payload.new as SRSCard])
          // Check if this is a due card
          if (new Date(payload.new.next_review) <= new Date()) {
            setDueCards((prev) => [...prev, payload.new as SRSCard])
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'srs_cards',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setSrsCards((prev) =>
            prev.map((card) => (card.id === payload.new.id ? (payload.new as SRSCard) : card))
          )
          // Update due cards if necessary
          setDueCards((prev) =>
            prev.map((card) => (card.id === payload.new.id ? (payload.new as SRSCard) : card))
          )
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'srs_cards',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setSrsCards((prev) => prev.filter((card) => card.id !== payload.old.id))
          setDueCards((prev) => prev.filter((card) => card.id !== payload.old.id))
        }
      )
      .subscribe()

    return () => {
      if (supabase) {
        supabase.removeChannel(channel)
      }
    }
  }, [userId])

  const reviewCard = async (cardId: number, quality: number, responseTime: number) => {
    if (!userId) return null

    try {
      // Get the current card
      const card = srsCards.find((c) => c.id === cardId)
      if (!card) return null

      // Fetch user performance history for this specific item
      const performanceHistory = await getUserPerformance(
        userId,
        card.content_type,
        card.content_id
      )

      // Calculate item difficulty based on historical performance (if available)
      let itemDifficulty: number | undefined
      if (performanceHistory && performanceHistory.length > 0) {
        const recentAttempts = performanceHistory.slice(0, 10) // Last 10 attempts
        const avgAccuracy =
          recentAttempts.reduce((sum, p) => sum + (p.accuracy_rate || 0), 0) / recentAttempts.length
        itemDifficulty = 1 - avgAccuracy / 100 // Convert accuracy to difficulty (0-1 scale)
      }

      // Format performance history for the enhanced algorithm
      const formattedHistory =
        performanceHistory?.map((p) => ({
          quality: p.accuracy_rate
            ? p.accuracy_rate >= 80
              ? 5
              : p.accuracy_rate >= 60
                ? 4
                : p.accuracy_rate >= 40
                  ? 3
                  : p.accuracy_rate >= 20
                    ? 2
                    : 1
            : 3,
          responseTime: p.avg_response_time || responseTime,
        })) || []

      // Calculate new SRS values using enhanced SM-2 algorithm
      const sm2Result = calculateEnhancedSM2(
        quality,
        card.repetitions,
        card.ease_factor,
        card.interval,
        itemDifficulty,
        formattedHistory
      )

      // Calculate next review date
      const nextReview = new Date()
      nextReview.setDate(nextReview.getDate() + sm2Result.interval)

      // Update the SRS card
      const updatedCard = await updateSRSCard(cardId, {
        interval: sm2Result.interval,
        repetitions: sm2Result.repetitions,
        ease_factor: sm2Result.easeFactor,
        last_reviewed: new Date().toISOString(),
        next_review: nextReview.toISOString(),
      })

      // Update user performance
      await updateUserPerformance(
        userId,
        card.content_type,
        card.content_id,
        quality >= 3, // Consider 3+ as correct
        responseTime
      )

      if (updatedCard) {
        // Update local state
        setSrsCards((prev) => prev.map((c) => (c.id === cardId ? updatedCard : c)))
        setDueCards((prev) => prev.filter((c) => c.id !== cardId))
      }

      return updatedCard
    } catch (err) {
      setError('Failed to review card')
      console.error(err)
      return null
    }
  }

  const addToSRS = async (contentType: 'character' | 'word' | 'grammar', contentId: number) => {
    if (!userId) return null

    try {
      // Check if card already exists
      const existingCard = await getSRSCardByContent(userId, contentType, contentId)
      if (existingCard) return existingCard

      // Create new SRS card
      const newCard = await createSRSCard({
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        ease_factor: 2.5,
        interval: 0,
        repetitions: 0,
        next_review: new Date().toISOString(),
        last_reviewed: null,
      })

      if (newCard) {
        setSrsCards((prev) => [...prev, newCard])
        // If it's due now, add to due cards
        if (new Date(newCard.next_review!) <= new Date()) {
          setDueCards((prev) => [...prev, newCard])
        }
      }

      return newCard
    } catch (err) {
      setError('Failed to add card to SRS')
      console.error(err)
      return null
    }
  }

  return {
    srsCards,
    dueCards,
    loading,
    error,
    reviewCard,
    addToSRS,
  }
}
