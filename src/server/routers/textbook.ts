import { z } from 'zod'
import { getSupabaseClient } from '@/lib/database/client'
import { sswTextbookSchema } from '@/lib/validations/schemas'
import { publicProcedure, router } from '../trpc'

export const textbookRouter = router({
  list: publicProcedure
    .input(
      z.object({
        jlptLevel: z.enum(['N5', 'N4', 'N3', 'N2', 'N1', 'ALL']).default('ALL'),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const supabase = getSupabaseClient()

      let query = supabase
        .from('textbooks')
        .select('*')
        .range(input.offset, input.offset + input.limit - 1)
        .order('created_at', { ascending: false })

      if (input.jlptLevel !== 'ALL') {
        query = query.eq('jlpt_level', input.jlptLevel)
      }

      const { data, error } = await query

      if (error) throw new Error(error.message)
      return data
    }),

  getById: publicProcedure.input(z.object({ id: z.string().uuid() })).query(async ({ input }) => {
    const supabase = getSupabaseClient()

    const { data, error } = await supabase.from('textbooks').select('*').eq('id', input.id).single()

    if (error) throw new Error(error.message)
    return data
  }),

  generateSSW: publicProcedure.input(sswTextbookSchema).mutation(async ({ input }) => {
    // This would call your existing SSW generation logic
    // For now, just create a placeholder textbook
    const supabase = getSupabaseClient()

    const { data, error } = await supabase
      .from('textbooks')
      .insert({
        title: input.title,
        ssw_type: input.sswType,
        target_sector: input.targetSector,
        total_chapters: input.numberOfChapters,
        status: 'generating',
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    // TODO: Trigger background job for actual generation

    return data
  }),
})
