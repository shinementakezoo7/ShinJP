'use client'

import { useState } from 'react'
import { useTheme } from '@/lib/theme/theme-context'

export default function FontSizeControl() {
  const { fontSize, setFontSize } = useTheme()
  const [showSlider, setShowSlider] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowSlider(!showSlider)}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        aria-label="Adjust font size"
        title="Font size"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>

      {showSlider && (
        <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">{fontSize}px</span>
          </div>

          <input
            type="range"
            min="12"
            max="24"
            step="1"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />

          <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span>Small</span>
            <span>Large</span>
          </div>

          <button
            onClick={() => setFontSize(16)}
            className="mt-3 w-full py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          >
            Reset to Default
          </button>
        </div>
      )}
    </div>
  )
}
