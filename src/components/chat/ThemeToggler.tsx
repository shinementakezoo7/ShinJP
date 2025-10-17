'use client'

import React from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun, Palette, Contrast, Eye, EyeOff, MoreVertical } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ThemeTogglerProps {
  className?: string
  showTooltip?: boolean
}

const themeOptions = [
  {
    value: 'light',
    label: 'ライト',
    icon: Sun,
    description: '明るいテーマ',
    colors: { bg: 'bg-white', text: 'text-gray-900', accent: 'text-blue-600' },
  },
  {
    value: 'dark',
    label: 'ダーク',
    icon: Moon,
    description: '暗いテーマ',
    colors: { bg: 'bg-gray-900', text: 'text-white', accent: 'text-blue-400' },
  },
  {
    value: 'system',
    label: 'システム',
    icon: Palette,
    description: 'システム設定に合わせる',
    colors: {
      bg: 'bg-gradient-to-r from-blue-500 to-purple-600',
      text: 'text-white',
      accent: 'text-white',
    },
  },
]

const accessibilityOptions = [
  {
    id: 'high-contrast',
    label: 'ハイコントラスト',
    description: '視覚的な区別を向上',
    icon: Contrast,
  },
  {
    id: 'large-text',
    label: '大きな文字',
    description: 'フォントサイズを拡大',
    icon: Eye,
  },
  {
    id: 'reduced-motion',
    label: 'アニメーション軽減',
    description: '動きを最小化',
    icon: EyeOff,
  },
]

export default function ThemeToggler({ className = '', showTooltip = true }: ThemeTogglerProps) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [showMenu, setShowMenu] = React.useState(false)
  const [showAccessibility, setShowAccessibility] = React.useState(false)
  const [accessibilitySettings, setAccessibilitySettings] = React.useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
  })

  // Accessibility panel
  const toggleAccessibility = () => setShowAccessibility(!showAccessibility)

  const toggleAccessibilitySetting = (setting: string) => {
    setAccessibilitySettings((prev) => ({
      ...prev,
      [setting]: !prev[setting as keyof typeof accessibilitySettings],
    }))

    // Apply accessibility changes
    if (setting === 'high-contrast') {
      document.documentElement.classList.toggle(
        'high-contrast',
        !accessibilitySettings.highContrast
      )
    } else if (setting === 'large-text') {
      document.documentElement.classList.toggle('large-text', !accessibilitySettings.largeText)
    } else if (setting === 'reduced-motion') {
      document.documentElement.classList.toggle(
        'prefers-reduced-motion',
        !accessibilitySettings.reducedMotion
      )
    }
  }

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme)
    setShowMenu(false)
  }

  React.useEffect(() => {
    // Initialize accessibility from localStorage
    const saved = JSON.parse(localStorage.getItem('accessibility-settings') || '{}')
    setAccessibilitySettings(saved)

    // Apply saved settings
    if (saved.highContrast) document.documentElement.classList.add('high-contrast')
    if (saved.largeText) document.documentElement.classList.add('large-text')
    if (saved.reducedMotion) document.documentElement.classList.add('prefers-reduced-motion')
  }, [])

  React.useEffect(() => {
    // Save accessibility settings
    localStorage.setItem('accessibility-settings', JSON.stringify(accessibilitySettings))
  }, [accessibilitySettings])

  React.useEffect(() => {
    // Update CSS classes based on theme
    document.documentElement.classList.remove('light', 'dark', 'system')
    document.documentElement.classList.add(theme || 'system')

    // Handle system theme preference
    if (theme === 'system') {
      document.documentElement.classList.add(systemTheme || 'light')
    }
  }, [theme, systemTheme])

  const currentTheme = theme || 'system'

  return (
    <div className={`relative ${className}`}>
      {/* Main Theme Toggle */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowMenu(!showMenu)}
        className="relative p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
        aria-label="テーマとアクセサビリティ設定"
        aria-expanded={showMenu}
        aria-haspopup="true"
        data-testid="theme-toggler"
      >
        {theme === 'dark' ? (
          <Moon className="w-5 h-5" strokeWidth={1.5} />
        ) : theme === 'light' ? (
          <Sun className="w-5 h-5" strokeWidth={1.5} />
        ) : (
          <Palette className="w-5 h-5" strokeWidth={1.5} />
        )}

        {/* Accessibility indicators */}
        {accessibilitySettings.highContrast && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full" />
        )}
        {accessibilitySettings.largeText && (
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        )}
        {accessibilitySettings.reducedMotion && (
          <span className="absolute top-1/2 right-0 transform -translate-y-1/2 w-0.5 h-2 bg-blue-500" />
        )}
      </motion.button>

      {/* Theme Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 z-40"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 z-50"
              role="menu"
              aria-label="テーマメニュー"
            >
              {/* Theme Selection */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  テーマ選択
                </h3>
                <div className="grid gap-2">
                  {themeOptions.map((option) => {
                    const isSelected = currentTheme === option.value
                    const Icon = option.icon

                    return (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleThemeChange(option.value)}
                        className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-900/10'
                            : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/20 dark:hover:bg-gray-800/20'
                        }`}
                        role="menuitem"
                        aria-checked={isSelected}
                        aria-describedby={`theme-${option.value}-description`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isSelected
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 dark:text-white">
                              {option.label}
                            </p>
                            <p
                              id={`theme-${option.value}-description`}
                              className="text-xs text-gray-600 dark:text-gray-400"
                            >
                              {option.description}
                            </p>
                          </div>
                          {isSelected && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-gradient-to-r from-gray-200/0 via-gray-200 to-gray-200/0 dark:from-gray-700/0 dark:via-gray-700 dark:to-gray-700/0" />

              {/* Accessibility Settings */}
              <div>
                <button
                  onClick={toggleAccessibility}
                  className="w-full p-3 bg-gray-50/50 dark:bg-gray-700/50 hover:bg-gray-100/50 dark:hover:bg-gray-600/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50 transition-all duration-200 flex items-center gap-2"
                >
                  <Contrast className="w-4 h-4" />
                  <span className="font-medium text-gray-900 dark:text-white text-sm">
                    アクセサビリティ設定
                  </span>
                  <motion.div animate={{ rotate: showAccessibility ? 180 : 0 }} className="ml-auto">
                    <MoreVertical className="w-4 h-4" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {showAccessibility && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 space-y-2"
                    >
                      {accessibilityOptions.map((option) => {
                        const Icon = option.icon
                        const isEnabled =
                          accessibilitySettings[option.id as keyof typeof accessibilitySettings]

                        return (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => toggleAccessibilitySetting(option.id)}
                            className={`w-full p-3 rounded-xl border-2 transition-all duration-200 ${
                              isEnabled
                                ? 'border-green-500 bg-green-50/20 dark:bg-green-900/10'
                                : 'border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                            aria-pressed={isEnabled}
                            aria-describedby={`accessibility-${option.id}-description`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                  isEnabled
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 dark:text-white text-sm">
                                  {option.label}
                                </p>
                                <p
                                  id={`accessibility-${option.id}-description`}
                                  className="text-xs text-gray-600 dark:text-gray-400"
                                >
                                  {option.description}
                                </p>
                              </div>
                              {isEnabled && (
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                          </motion.button>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* System Info */}
              <div className="mt-4 pt-3 border-t border-gray-200/30 dark:border-gray-700/30">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  システム環境: {theme === 'system' ? systemTheme : theme}
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
