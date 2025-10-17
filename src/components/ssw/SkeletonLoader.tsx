'use client'

import { SSW_CONSTANTS } from '@/lib/ssw/constants'
import { motion } from 'framer-motion'

interface SkeletonLoaderProps {
  type?: 'text' | 'card' | 'button' | 'input' | 'progress'
  className?: string
  width?: string
  height?: string
  count?: number
}

export function SkeletonLoader({
  type = 'text',
  className = '',
  width,
  height,
  count = 1,
}: SkeletonLoaderProps) {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 rounded animate-pulse'

  const getTypeClasses = () => {
    switch (type) {
      case 'text':
        return 'h-4 bg-gray-200 dark:bg-gray-700 rounded'
      case 'card':
        return 'h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl'
      case 'button':
        return 'h-10 bg-gray-200 dark:bg-gray-700 rounded-xl'
      case 'input':
        return 'h-12 bg-gray-200 dark:bg-gray-700 rounded-xl'
      case 'progress':
        return 'h-2 bg-gray-200 dark:bg-gray-700 rounded-full'
      default:
        return 'h-4 bg-gray-200 dark:bg-gray-700 rounded'
    }
  }

  return (
    <div className="space-y-2">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          className={`${baseClasses} ${getTypeClasses()} ${className}`}
          style={{
            width: width || '100%',
            height: height || undefined,
          }}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: SSW_CONSTANTS.ANIMATION.DURATION.SLOW,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}
    </div>
  )
}

// Specific skeleton components for SSW section
export function SSWSectorSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="p-5 rounded-2xl border-2 border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            <div className="w-6 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
            <div className="space-y-1 mt-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-2/3"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function SSWFormSkeleton() {
  return (
    <div className="space-y-8">
      {/* Title Input Skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      </div>

      {/* SSW Type Selection Skeleton */}
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"
            ></div>
          ))}
        </div>
      </div>

      {/* Navigation Button Skeleton */}
      <div className="flex justify-end">
        <div className="h-12 w-48 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
      </div>
    </div>
  )
}

export function SSWGenerationProgressSkeleton() {
  return (
    <div className="py-16 text-center">
      <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <div className="space-y-3 max-w-md mx-auto">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto animate-pulse"></div>
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mx-auto animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>

        {/* Progress bar skeleton */}
        <div className="mt-8 space-y-2">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mx-auto animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
