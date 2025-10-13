'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { httpBatchLink } from '@trpc/client'
// Conditionally import devtools only in development
import dynamic from 'next/dynamic'
import { type ReactNode, useState } from 'react'
import { Toaster } from 'sonner'
import superjson from 'superjson'
import { trpc } from '@/lib/trpc/client'

const ReactQueryDevtools =
  process.env.NODE_ENV === 'development'
    ? dynamic(
        () => import('@tanstack/react-query-devtools').then((mod) => mod.ReactQueryDevtools),
        { ssr: false }
      )
    : () => null

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache data for 5 minutes by default
            staleTime: 5 * 60 * 1000,
            // Don't refetch on window focus in development
            refetchOnWindowFocus: process.env.NODE_ENV === 'production',
            // Retry failed requests
            retry: 1,
          },
          mutations: {
            // Show error toast on mutation failure
            onError: (error) => {
              console.error('Mutation error:', error)
            },
          },
        },
      })
  )

  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: process.env.NEXT_PUBLIC_APP_URL
            ? `${process.env.NEXT_PUBLIC_APP_URL}/api/trpc`
            : 'http://localhost:3000/api/trpc',
          transformer: superjson,
        }),
      ],
    })
  )

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {/* Toast notifications */}
        <Toaster position="top-right" richColors closeButton duration={4000} />
        {/* React Query DevTools (only in dev) */}
        <ReactQueryDevtools initialIsOpen={false} position="bottom" />
      </QueryClientProvider>
    </trpc.Provider>
  )
}
