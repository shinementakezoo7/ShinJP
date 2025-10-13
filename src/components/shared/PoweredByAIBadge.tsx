'use client'

import { useState } from 'react'

export default function PoweredByAIBadge() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full text-white text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        className={`w-4 h-4 transition-transform duration-500 ${isHovered ? 'rotate-180' : ''}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M13 7H7v6h6V7z" />
        <path
          fillRule="evenodd"
          d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z"
          clipRule="evenodd"
        />
      </svg>
      <span className="font-semibold">Powered by AI</span>
      {isHovered && <span className="text-xs opacity-90">NVIDIA + OpenAI</span>}
    </div>
  )
}
