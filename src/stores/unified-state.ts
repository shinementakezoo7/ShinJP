/**
 * Unified State Management Store
 * Consolidates Zustand + Jotai + React Query into single source of truth
 * This approach reduces state duplication and improves performance
 */

import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { persist as persistMiddleware } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

/**
 * Server State (from React Query)
 * - Data from API/database
 * - Handled by React Query
 * - DONT duplicate in Zustand
 */

/**
 * Client State (in Zustand)
 * - UI state (modals, dropdowns, etc.)
 * - User preferences
 * - Transient data
 */
interface UIState {
  // Modals
  isModalOpen: Record<string, boolean>
  openModal: (id: string) => void
  closeModal: (id: string) => void
  closeAllModals: () => void

  // Sidebar/Navigation
  isSidebarOpen: boolean
  toggleSidebar: () => void

  // Theme
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void

  // Notifications
  notifications: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration?: number
  }>
  addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) => void
  removeNotification: (id: string) => void

  // Loading states
  isLoading: Record<string, boolean>
  setLoading: (key: string, loading: boolean) => void

  // User preferences
  language: string
  setLanguage: (language: string) => void

  fontSize: number
  setFontSize: (size: number) => void
}

export const useUIStore = create<UIState>()(
  persistMiddleware(
    subscribeWithSelector(
      immer((set: any) => ({
        // Modals
        isModalOpen: {},
        openModal: (id: string) =>
          set((state: UIState) => {
            state.isModalOpen[id] = true
          }),
        closeModal: (id: string) =>
          set((state: UIState) => {
            state.isModalOpen[id] = false
          }),
        closeAllModals: () =>
          set((state: UIState) => {
            state.isModalOpen = {}
          }),

        // Sidebar
        isSidebarOpen: true,
        toggleSidebar: () =>
          set((state: UIState) => {
            state.isSidebarOpen = !state.isSidebarOpen
          }),

        // Theme
        theme: 'system' as const,
        setTheme: (theme: 'light' | 'dark' | 'system') =>
          set((state: UIState) => {
            state.theme = theme
          }),

        // Notifications
        notifications: [],
        addNotification: (notification: Omit<UIState['notifications'][0], 'id'>) =>
          set((state: UIState) => {
            state.notifications.push({
              ...notification,
              id: `${Date.now()}-${Math.random()}`,
            })

            // Auto-remove after duration
            if (notification.duration) {
              setTimeout(() => {
                set((s: UIState) => {
                  s.notifications = s.notifications.filter(
                    (n: any) => n.id !== (notification as any).id
                  )
                })
              }, notification.duration)
            }
          }),
        removeNotification: (id: string) =>
          set((state: UIState) => {
            state.notifications = state.notifications.filter((n: any) => n.id !== id)
          }),

        // Loading states
        isLoading: {},
        setLoading: (key: string, loading: boolean) =>
          set((state: UIState) => {
            state.isLoading[key] = loading
          }),

        // User preferences
        language: 'ja',
        setLanguage: (language: string) =>
          set((state: UIState) => {
            state.language = language
          }),

        fontSize: 16,
        setFontSize: (size: number) =>
          set((state: UIState) => {
            state.fontSize = size
          }),
      }))
    ),
    {
      name: 'ui-store',
      partialize: (state: UIState) => ({
        theme: state.theme,
        language: state.language,
        fontSize: state.fontSize,
      }),
    }
  )
)

/**
 * Migration guide from Jotai to this unified store:
 *
 * BEFORE (Jotai):
 * const isModalOpenAtom = atom(false);
 * const isOpen = useAtom(isModalOpenAtom)[0];
 *
 * AFTER (Zustand):
 * const isOpen = useUIStore(s => s.isModalOpen['modalId']);
 *
 * Benefits:
 * 1. Single store, easier debugging
 * 2. Better TypeScript support
 * 3. Persist capabilities built-in
 * 4. Derived state is automatic with selectors
 * 5. Performance optimization with subscribeWithSelector
 */

/**
 * React Query Integration Pattern
 * Use React Query for server state, Zustand only for UI state
 */
export const stateManagementPatterns = {
  /**
   * ✓ CORRECT: Keep in React Query
   */
  serverState: {
    'User profile data': 'useQuery',
    'Textbook content': 'useQuery with caching',
    'Progress data': 'useQuery with polling',
    'Leaderboard data': 'useQuery with refetch intervals',
  },

  /**
   * ✓ CORRECT: Keep in Zustand
   */
  clientState: {
    'Modal open/close': 'useUIStore',
    'Sidebar collapsed': 'useUIStore',
    'Theme preference': 'useUIStore (persisted)',
    'Toast notifications': 'useUIStore',
    'Form draft': 'useUIStore',
  },

  /**
   * ✗ WRONG: Don't duplicate
   */
  neverDuplicate: [
    'API response data in both Query and Zustand',
    'Authentication token in both Auth provider and Zustand',
    'Current user data in both Query and Zustand',
  ],
}
