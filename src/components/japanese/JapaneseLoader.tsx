'use client'

import { cn } from '@/lib/utils'

interface JapaneseLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'sakura' | 'kanji' | 'wave' | 'enso'
  className?: string
  message?: string
}

const sizes = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
}

export default function JapaneseLoader({
  size = 'md',
  variant = 'sakura',
  className,
  message,
}: JapaneseLoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'sakura':
        return (
          <div className={cn('relative', sizes[size], className)}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin text-4xl">🌸</div>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center animate-spin"
              style={{ animationDuration: '3s', animationDirection: 'reverse' }}
            >
              <div className="text-3xl" style={{ transform: 'translateX(20px)' }}>
                🌸
              </div>
            </div>
            <div
              className="absolute inset-0 flex items-center justify-center animate-spin"
              style={{ animationDuration: '2s' }}
            >
              <div className="text-2xl" style={{ transform: 'translateX(-20px)' }}>
                🌸
              </div>
            </div>
          </div>
        )

      case 'kanji':
        return (
          <div className={cn('relative', sizes[size], className)}>
            <div className="japanese-text text-5xl font-black text-red-600 dark:text-red-400 animate-pulse">
              道
            </div>
            <div className="absolute inset-0 japanese-text text-5xl font-black text-red-600/50 dark:text-red-400/50 animate-ping">
              道
            </div>
          </div>
        )

      case 'wave':
        return (
          <div className={cn('relative flex items-center gap-1', sizes[size], className)}>
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-red-600 to-pink-600 dark:from-red-400 dark:to-pink-400 rounded-full animate-wave-loading"
                style={{
                  height: '100%',
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>
        )

      case 'enso':
        return (
          <div className={cn('relative', sizes[size], className)}>
            <svg className="animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="280"
                strokeDashoffset="75"
                className="text-red-600 dark:text-red-400"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="japanese-text text-xl font-bold text-red-600 dark:text-red-400">
                禅
              </span>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {renderLoader()}
      {message && (
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 animate-pulse japanese-text">
          {message}
        </p>
      )}
    </div>
  )
}

// Pre-styled loading states
export function SakuraSpinner({ className, ...props }: JapaneseLoaderProps) {
  return <JapaneseLoader variant="sakura" className={className} {...props} />
}

export function KanjiPulse({ className, ...props }: JapaneseLoaderProps) {
  return <JapaneseLoader variant="kanji" className={className} {...props} />
}

export function WaveLoader({ className, ...props }: JapaneseLoaderProps) {
  return <JapaneseLoader variant="wave" className={className} {...props} />
}

export function EnsoSpinner({ className, ...props }: JapaneseLoaderProps) {
  return <JapaneseLoader variant="enso" className={className} {...props} />
}

// Page loading overlay
export function JapaneseLoadingOverlay({ message = '読み込み中...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-black/80 backdrop-blur-xl">
      <div className="flex flex-col items-center gap-8">
        <JapaneseLoader variant="enso" size="xl" />
        <div className="text-center">
          <p className="text-2xl font-bold japanese-text text-red-600 dark:text-red-400 mb-2">
            {message}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Please wait a moment...</p>
        </div>
      </div>

      {/* Decorative sakura petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sakura-float"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${10 + i * 2}s`,
              top: '-50px',
            }}
          >
            <div className="text-3xl opacity-30">🌸</div>
          </div>
        ))}
      </div>
    </div>
  )
}
