import { router } from '../trpc'
import { audioRouter } from './audio'
import { kanjiRouter } from './kanji'
import { textbookRouter } from './textbook'

export const appRouter = router({
  textbook: textbookRouter,
  audio: audioRouter,
  kanji: kanjiRouter,
})

export type AppRouter = typeof appRouter
