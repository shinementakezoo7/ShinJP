import { vi } from 'vitest'

// Mock Supabase client with realistic methods
export const createMockSupabaseClient = () => {
  const mockFrom = vi.fn().mockReturnThis()
  const mockSelect = vi.fn().mockReturnThis()
  const mockInsert = vi.fn().mockReturnThis()
  const mockUpdate = vi.fn().mockReturnThis()
  const mockDelete = vi.fn().mockReturnThis()
  const mockEq = vi.fn().mockReturnThis()
  const mockSingle = vi.fn().mockReturnThis()
  const mockOrder = vi.fn().mockReturnThis()
  const mockLimit = vi.fn().mockReturnThis()

  return {
    from: mockFrom,
    select: mockSelect,
    insert: mockInsert,
    update: mockUpdate,
    delete: mockDelete,
    eq: mockEq,
    single: mockSingle,
    order: mockOrder,
    limit: mockLimit,
    rpc: vi.fn().mockReturnThis(),
    auth: {
      signIn: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
    storage: {
      from: vi.fn().mockReturnThis(),
      upload: vi.fn(),
      download: vi.fn(),
      remove: vi.fn(),
    },
  }
}

// Mock data builders
export const mockQueryResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
  count: Array.isArray(data) ? data.length : data ? 1 : 0,
})

export const mockSingleResponse = <T>(data: T, error: any = null) => ({
  data,
  error,
})

// Reset all mocks
export const resetSupabaseMocks = () => {
  vi.clearAllMocks()
}
