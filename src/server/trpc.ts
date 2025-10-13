import { initTRPC } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import superjson from 'superjson'

// Create context for each request
export const createContext = async (opts: FetchCreateContextFnOptions) => {
  return {
    headers: opts.req.headers,
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>

// Initialize tRPC with context
const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

// Export reusable router and procedure helpers
export const router = t.router
export const publicProcedure = t.procedure
