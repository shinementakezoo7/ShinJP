'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface JapaneseCardProps {
  children: ReactNode
  className?: string
  pattern?: 'seigaiha' | 'asanoha' | 'shippo' | 'kikko'
  hover?: boolean
  gradient?: 'sakura' | 'autumn' | 'sunset' | 'ocean'
  kanji?: string
}

const patterns = {
  seigaiha: `
    <pattern id="seigaiha-card" x="0" y="0" width="140" height="70" patternUnits="userSpaceOnUse">
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        <path d="M0,35 Q17.5,15 35,35 T70,35" />
        <path d="M35,35 Q52.5,15 70,35 T105,35" />
        <path d="M70,35 Q87.5,15 105,35 T140,35" />
      </g>
    </pattern>
  `,
  asanoha: `
    <pattern id="asanoha-card" x="0" y="0" width="100" height="86.6" patternUnits="userSpaceOnUse">
      <g stroke="currentColor" strokeWidth="1" fill="none">
        <path d="M50,0 L75,43.3 L50,86.6 L25,43.3 Z" />
        <path d="M50,0 L50,86.6" />
        <path d="M25,43.3 L75,43.3" />
      </g>
    </pattern>
  `,
  shippo: `
    <pattern id="shippo-card" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
      <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="0" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <circle cx="100" cy="50" r="35" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </pattern>
  `,
  kikko: `
    <pattern id="kikko-card" x="0" y="0" width="100" height="115.47" patternUnits="userSpaceOnUse">
      <polygon points="50,0 100,28.87 100,86.6 50,115.47 0,86.6 0,28.87" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </pattern>
  `,
}

const gradients = {
  sakura: 'from-pink-500/20 via-red-500/20 to-purple-500/20',
  autumn: 'from-orange-500/20 via-red-500/20 to-amber-500/20',
  sunset: 'from-purple-500/20 via-pink-500/20 to-orange-500/20',
  ocean: 'from-blue-500/20 via-cyan-500/20 to-teal-500/20',
}

export default function JapaneseCard({
  children,
  className,
  pattern = 'seigaiha',
  hover = true,
  gradient = 'sakura',
  kanji,
}: JapaneseCardProps) {
  return (
    <div
      className={cn(
        'relative rounded-3xl overflow-hidden group',
        'bg-white/60 dark:bg-black/40 backdrop-blur-xl',
        'border-2 border-red-800/20 dark:border-red-400/20',
        'shadow-xl',
        'transition-all duration-500',
        hover && 'hover:scale-[1.02] hover:shadow-2xl hover:border-red-600/40',
        className
      )}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="w-full h-full opacity-[0.05] dark:opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs dangerouslySetInnerHTML={{ __html: patterns[pattern] }} />
          <rect
            width="100%"
            height="100%"
            fill={`url(#${pattern}-card)`}
            className="text-red-800 dark:text-red-400"
          />
        </svg>
      </div>

      {/* Gradient Overlay */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-br opacity-20',
          gradients[gradient],
          'pointer-events-none'
        )}
      />

      {/* Kanji Watermark */}
      {kanji && (
        <div className="absolute top-4 right-4 text-6xl japanese-text text-red-800/10 dark:text-red-400/10 pointer-events-none select-none font-black">
          {kanji}
        </div>
      )}

      {/* Animated Border Glow */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-[-2px] bg-gradient-to-r from-red-500 via-pink-500 to-purple-500 rounded-3xl blur-sm animate-gradient-x" />
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Sakura Petal Decoration */}
      <div className="absolute -bottom-2 -right-2 text-4xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rotate-12 group-hover:rotate-0 transform transition-transform">
        🌸
      </div>
    </div>
  )
}
