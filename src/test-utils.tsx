import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Re-export everything from testing-library
export * from '@testing-library/react'
export * from '@testing-library/user-event'

// Custom render function with providers
interface TestOptions extends Omit<RenderOptions, 'queries'> {
  // Add any custom options here if needed
  customOption?: string
}

export const renderWithProviders = (ui: ReactElement, options: TestOptions = {}) => {
  const { wrapper: Wrapper = ({ children }) => <>{children}</>, ...renderOptions } = options

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

// Mock Supabase client
export const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockReturnThis(),
  data: null,
  error: null,
}

// Mock Next.js router
export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  route: '/',
  pathname: '/',
  query: {},
  asPath: '/',
  back: vi.fn(),
  beforePopState: vi.fn(),
  events: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
  isFallback: false,
  isLocaleDomain: false,
  isPreview: false,
  isReady: true,
}

// Mock Next.js hooks
export const mockUseRouter = vi.fn(() => mockRouter)

// Mock window.matchMedia
export const mockMatchMedia = (matches = true) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  })
}

// Mock IntersectionObserver
export const mockIntersectionObserver = () => {
  const mockIntersectionObserverInstance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(),
    root: null,
    rootMargin: '',
    thresholds: [],
  }

  window.IntersectionObserver = vi.fn(
    () => mockIntersectionObserverInstance as unknown as IntersectionObserver
  )
  return mockIntersectionObserverInstance
}

// Mock ResizeObserver
export const mockResizeObserver = () => {
  const mockResizeObserverInstance = {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }

  window.ResizeObserver = vi.fn(() => mockResizeObserverInstance as unknown as ResizeObserver)
  return mockResizeObserverInstance
}
