import React, { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { createMockSupabaseClient } from './mockSupabase'

// Mock providers for testing
const MockProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

// Enhanced render function with all providers
interface RenderWithProvidersOptions {
  supabase?: ReturnType<typeof createMockSupabaseClient>
  router?: any
  // Add other providers as needed
}

export const renderWithProviders = (ui: ReactElement, options: RenderWithProvidersOptions = {}) => {
  const { supabase, router, ...renderOptions } = options

  // Mock Supabase if not provided
  const mockSupabase = supabase || createMockSupabaseClient()

  // Mock router if not provided
  const mockRouter = router || {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
  }

  // Mock Supabase context
  vi.mock('@/lib/supabase/client', () => ({
    createClient: () => mockSupabase,
  }))

  // Mock Next.js router
  vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => '/',
    useSearchParams: () => new URLSearchParams(),
  }))

  return render(ui, { wrapper: MockProviders, ...renderOptions })
}

// Helper to create test environments
export const createTestEnvironment = () => {
  const supabase = createMockSupabaseClient()

  return {
    supabase,
    render: (ui: ReactElement) => renderWithProviders(ui, { supabase }),
  }
}
