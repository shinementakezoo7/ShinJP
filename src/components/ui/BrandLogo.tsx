'use client'

import React from 'react'

interface BrandLogoProps {
  /**
   * Size of the logo
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * Show text alongside the logo
   */
  withText?: boolean
  /**
   * Show full branding text or abbreviated
   */
  fullText?: boolean
  /**
   * Custom className
   */
  className?: string
  /**
   * Animation on hover
   */
  animated?: boolean
}

const sizeMap = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
}

const fontSizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
  xl: 'text-2xl',
}

/**
 * Shinmen Takezo Main Brand Logo
 * Samurai-inspired design with modern aesthetics
 */
export function ShinmenTakzeoLogo({
  size = 'md',
  withText = true,
  fullText = true,
  className = '',
  animated = true,
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 group ${className}`}>
      {/* Logo Container */}
      <div className="relative">
        <div
          className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-40 ${animated ? 'group-hover:opacity-60' : ''} transition-all duration-300`}
        />
        <div
          className={`
            relative ${sizeMap[size]} rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600
            flex items-center justify-center shadow-xl ${animated ? 'group-hover:shadow-2xl group-hover:scale-110' : ''}
            transition-all duration-300 ring-2 ring-white/20 dark:ring-black/30
          `}
        >
          <span
            className={`japanese-text ${animated ? 'transition-transform group-hover:rotate-12' : ''}`}
            style={{ fontSize: '1.5em' }}
          >
            侍
          </span>
        </div>
      </div>

      {/* Text Label */}
      {withText && (
        <div className={`flex flex-col leading-tight ${fontSizeMap[size]}`}>
          <span className="font-black japanese-heading bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Shinmen
          </span>
          {fullText && (
            <span className="font-bold text-gray-600 dark:text-gray-400 text-xs">Takezo</span>
          )}
        </div>
      )}
    </div>
  )
}

/**
 * Compact Samurai Icon Logo (Icon only)
 */
export function ShinmenIcon({
  size = 'md',
  className = '',
  animated = true,
}: Omit<BrandLogoProps, 'withText' | 'fullText'>) {
  return (
    <div className={`relative group ${className}`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-40 ${animated ? 'group-hover:opacity-60' : ''} transition-all duration-300`}
      />
      <div
        className={`
          relative ${sizeMap[size]} rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600
          flex items-center justify-center shadow-xl ${animated ? 'group-hover:shadow-2xl group-hover:scale-110' : ''}
          transition-all duration-300 ring-2 ring-white/20 dark:ring-black/30
        `}
      >
        <span
          className={`japanese-text ${animated ? 'transition-transform group-hover:rotate-12' : ''}`}
          style={{ fontSize: '1.5em' }}
        >
          侍
        </span>
      </div>
    </div>
  )
}

/**
 * Full branding header with logo and tagline
 */
export function BrandingHeader({ animated = true }: { animated?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <ShinmenTakzeoLogo size="lg" withText={true} fullText={true} animated={animated} />
      <div className="text-center">
        <h1 className="text-3xl font-black japanese-heading mb-2">Japanese Learning Dojo</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
          Master the Japanese language through interactive lessons, practice, and community
          engagement. 道場でがんばって！
        </p>
      </div>
    </div>
  )
}

/**
 * Minimal brand text component
 */
export function BrandText({ full = true }: { full?: boolean }) {
  return (
    <div className="font-black japanese-heading">
      {full ? (
        <>
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Shinmen
          </span>
          <span className="text-gray-600 dark:text-gray-400 text-sm"> Takezo</span>
        </>
      ) : (
        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          侍
        </span>
      )}
    </div>
  )
}

/**
 * Animated logo with loading state
 */
export function AnimatedLogo({
  size = 'md',
  loading = false,
}: {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
}) {
  return (
    <div className={`${sizeMap[size]} relative`}>
      <div
        className={`absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 rounded-2xl ${loading ? 'animate-pulse' : ''}`}
      />
      <div
        className={`relative w-full h-full rounded-2xl flex items-center justify-center text-white japanese-text transform ${loading ? 'animate-spin' : ''}`}
        style={{ fontSize: '1.5em' }}
      >
        侍
      </div>
    </div>
  )
}
