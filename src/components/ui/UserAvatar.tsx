'use client'

import React from 'react'
import Image from 'next/image'

interface UserAvatarProps {
  /**
   * User's initials or avatar image URL
   */
  src?: string | null
  /**
   * User's full name (used for fallback initials)
   */
  name: string
  /**
   * Avatar size in pixels
   */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /**
   * CSS classes for additional styling
   */
  className?: string
  /**
   * Show online indicator badge
   */
  showOnlineBadge?: boolean
  /**
   * Custom gradient classes for fallback
   */
  gradientClass?: string
  /**
   * Whether this is a premium member
   */
  isPremium?: boolean
}

const sizeMap = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-3xl',
  xl: 'w-24 h-24 text-4xl',
}

/**
 * Enhanced User Avatar Component
 * Supports both image URLs and initials fallback with modern styling
 * Includes optional online badge and premium indicators
 */
export function UserAvatar({
  src,
  name,
  size = 'md',
  className = '',
  showOnlineBadge = true,
  gradientClass = 'from-indigo-600 via-purple-600 to-pink-600',
  isPremium = false,
}: UserAvatarProps) {
  const initials = name
    .split(' ')
    .map((n) => n.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative inline-block group">
      {/* Main Avatar Container */}
      <div
        className={`
          relative rounded-2xl flex items-center justify-center shadow-2xl ring-4
          ring-white/40 dark:ring-black/40 transform group-hover:scale-110
          group-hover:rotate-3 transition-all duration-300 overflow-hidden
          bg-gradient-to-br ${gradientClass} ${sizeMap[size]} ${className}
        `}
      >
        {src ? (
          <Image
            src={src}
            alt={name}
            fill
            className="w-full h-full object-cover"
            sizes={`${parseInt(sizeMap[size].split('-')[1])}px`}
          />
        ) : (
          <span className="text-white font-black japanese-text">{initials}</span>
        )}
      </div>

      {/* Online Indicator Badge */}
      {showOnlineBadge && (
        <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
          <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-3 border-white dark:border-gray-900 shadow-lg ring-2 ring-green-500/50">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-75" />
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {isPremium && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-1 shadow-lg ring-2 ring-white dark:ring-gray-900">
          <span className="text-xs">✨</span>
        </div>
      )}
    </div>
  )
}

/**
 * Compact avatar variant for smaller spaces
 */
export function AvatarSmall({
  src,
  name,
  className = '',
}: {
  src?: string | null
  name: string
  className?: string
}) {
  return (
    <UserAvatar src={src} name={name} size="sm" className={className} showOnlineBadge={false} />
  )
}

/**
 * Avatar group component for displaying multiple users
 */
interface AvatarGroupProps {
  users: Array<{ id: string; name: string; image?: string | null }>
  maxDisplay?: number
  size?: 'sm' | 'md' | 'lg'
}

export function AvatarGroup({ users, maxDisplay = 3, size = 'sm' }: AvatarGroupProps) {
  const displayUsers = users.slice(0, maxDisplay)
  const remaining = Math.max(0, users.length - maxDisplay)

  return (
    <div className="flex items-center -space-x-2">
      {displayUsers.map((user) => (
        <UserAvatar
          key={user.id}
          src={user.image}
          name={user.name}
          size={size}
          className="ring-4 ring-white dark:ring-gray-900 hover:z-10"
          showOnlineBadge={false}
        />
      ))}
      {remaining > 0 && (
        <div
          className={`flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 font-bold text-gray-900 dark:text-white ring-4 ring-white dark:ring-gray-900 ${sizeMap[size]}`}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
