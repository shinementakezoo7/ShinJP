'use client'

import { createContext, type ReactNode, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  fontSize: number
  setFontSize: (size: number) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const THEME_STORAGE_KEY = 'shinmen-takezo-theme'
const FONT_SIZE_STORAGE_KEY = 'shinmen-takezo-font-size'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light')
  const [fontSize, setFontSizeState] = useState<number>(16)
  const [_mounted, setMounted] = useState(false)

  // Get system theme preference
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Resolve theme based on user preference and system
  const resolveTheme = (themeValue: Theme): ResolvedTheme => {
    if (themeValue === 'system') {
      return getSystemTheme()
    }
    return themeValue as ResolvedTheme
  }

  // Set theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)

    const resolved = resolveTheme(newTheme)
    setResolvedTheme(resolved)

    // Update HTML class
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(resolved)
  }

  // Set font size
  const setFontSize = (size: number) => {
    const clampedSize = Math.max(12, Math.min(24, size))
    setFontSizeState(clampedSize)
    localStorage.setItem(FONT_SIZE_STORAGE_KEY, clampedSize.toString())
    document.documentElement.style.fontSize = `${clampedSize}px`
  }

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)

    // Load saved theme
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme
    const initialTheme = savedTheme || 'system'
    setThemeState(initialTheme)

    const resolved = resolveTheme(initialTheme)
    setResolvedTheme(resolved)
    document.documentElement.classList.add(resolved)

    // Load saved font size
    const savedFontSize = localStorage.getItem(FONT_SIZE_STORAGE_KEY)
    const initialFontSize = savedFontSize ? parseInt(savedFontSize, 10) : 16
    setFontSizeState(initialFontSize)
    document.documentElement.style.fontSize = `${initialFontSize}px`

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      if (theme === 'system') {
        const newResolved = getSystemTheme()
        setResolvedTheme(newResolved)
        document.documentElement.classList.remove('light', 'dark')
        document.documentElement.classList.add(newResolved)
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, getSystemTheme, resolveTheme])

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, fontSize, setFontSize }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider')
  }
  return context
}
