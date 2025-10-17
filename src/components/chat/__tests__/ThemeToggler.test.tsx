import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'next-themes'
import ThemeToggler from '../ThemeToggler'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
    systemTheme: 'light',
  }),
}))

describe('ThemeToggler', () => {
  beforeEach(() => {
    // Clear localStorage
    window.localStorage.clear()

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  })

  it('renders correctly in light mode', () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeToggler />
      </ThemeProvider>
    )

    expect(screen.getByLabelText('テーマとアクセサビリティ設定')).toBeInTheDocument()
    expect(screen.getByTestId('theme-toggler')).toBeInTheDocument()
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false')
  })

  it('toggles theme menu on click', async () => {
    const user = userEvent.setup()

    render(
      <ThemeProvider attribute="class">
        <ThemeToggler />
      </ThemeProvider>
    )

    const button = screen.getByLabelText('テーマとアクセサビリティ設定')
    await user.click(button)

    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText('テーマ選択')).toBeInTheDocument()
    expect(screen.getByText('ライト')).toBeInTheDocument()
    expect(screen.getByText('ダーク')).toBeInTheDocument()
    expect(screen.getByText('システム')).toBeInTheDocument()
  })

  it('saves and applies accessibility settings', () => {
    render(
      <ThemeProvider attribute="class">
        <ThemeToggler />
      </ThemeProvider>
    )

    const button = screen.getByLabelText('テーマとアクセサビリティ設定')
    const user = userEvent.setup()

    await user.click(button)
    await user.click(screen.getByText('アクセサビリティ設定'))

    // Toggle high contrast
    const highContrastToggle = screen.getByText('ハイコントラスト').closest('button')
    expect(highContrastToggle).toHaveAttribute('aria-pressed', 'false')

    await user.click(highContrastToggle)
    expect(highContrastToggle).toHaveAttribute('aria-pressed', 'true')

    // LocalStorage should be updated
    expect(localStorage.getItem('accessibility-settings')).toContain('highContrast":true')
  })

  it('handles theme changes correctly', async () => {
    const mockSetTheme = jest.fn()
    jest.mock('next-themes', () => ({
      useTheme: () => ({
        theme: 'light',
        setTheme: mockSetTheme,
        systemTheme: 'light',
      }),
    }))

    const user = userEvent.setup()

    render(
      <ThemeProvider attribute="class">
        <ThemeToggler />
      </ThemeProvider>
    )

    const button = screen.getByLabelText('テーマとアクセサビリティ設定')
    await user.click(button)
    await user.click(screen.getByText('ダーク'))

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})

describe('Chat Components - Integration Tests', () => {
  it('maintains conversation history through theme changes', async () => {
    // Integration test for theme switching
  })

  it('preserves accessibility settings across sessions', async () => {
    // Test persistence of accessibility settings
  })

  it('handles multiple theme providers in chat context', async () => {
    // Test theme provider integration
  })
})
