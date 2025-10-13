import { z } from 'zod'
import { getSupabaseClient } from '@/lib/database/client'
import { publicProcedure, router } from '../trpc'

export const kanjiRouter = router({
  getStrokeOrder: publicProcedure
    .input(z.object({ kanji: z.string().length(1) }))
    .query(async ({ input }) => {
      const supabase = getSupabaseClient()

      const { data, error } = await supabase
        .from('kanji_stroke_order')
        .select('*')
        .eq('kanji', input.kanji)
        .single()

      if (error) throw new Error(error.message)
      return data
    }),

  submitHandwriting: publicProcedure
    .input(
      z.object({
        kanji: z.string().length(1),
        strokeData: z.array(
          z.object({
            points: z.array(
              z.object({
                x: z.number(),
                y: z.number(),
                timestamp: z.number(),
              })
            ),
          })
        ),
        userId: z.string().uuid(),
      })
    )
    .mutation(async ({ input: _input }) => {
      // This would call your handwriting analysis logic
      // For now, return a placeholder result
      return {
        accuracy: 85,
        strengths: ['Good stroke order', 'Consistent pressure'],
        improvements: ['Work on stroke 3 smoothness'],
        nextSteps: 'Practice similar characters',
      }
    }),
})
