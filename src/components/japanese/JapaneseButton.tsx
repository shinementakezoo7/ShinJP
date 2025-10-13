'use client'

import Link from 'next/link'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface JapaneseButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'sakura'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  href?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  ripple?: boolean
  className?: string
}

const variants = {
  primary: `
    bg-gradient-to-r from-red-700 via-orange-600 to-amber-600
    hover:from-amber-600 hover:via-orange-600 hover:to-red-700
    text-white font-bold
    shadow-2xl hover:shadow-3xl
    border-2 border-transparent
  `,
  secondary: `
    bg-white/70 dark:bg-black/50 
    backdrop-blur-xl
    border-4 border-red-700 dark:border-red-400
    text-red-900 dark:text-red-300
    hover:bg-gradient-to-r hover:from-red-700 hover:to-amber-600
    hover:text-white
    shadow-xl hover:shadow-2xl
  `,
  ghost: `
    bg-transparent
    border-2 border-gray-400/50 dark:border-gray-600/50
    text-gray-700 dark:text-gray-300
    hover:border-red-600 dark:hover:border-red-400
    hover:text-red-700 dark:hover:text-red-400
    hover:bg-red-50/50 dark:hover:bg-red-950/20
  `,
  sakura: `
    bg-gradient-to-r from-pink-400 via-pink-500 to-purple-500
    hover:from-purple-500 hover:via-pink-500 hover:to-pink-400
    text-white font-bold
    shadow-2xl hover:shadow-3xl
    border-2 border-pink-300/50 dark:border-pink-700/50
  `,
}

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-xl',
  md: 'px-6 py-3 text-base rounded-2xl',
  lg: 'px-8 py-4 text-lg rounded-2xl',
  xl: 'px-10 py-5 text-xl rounded-3xl',
}

export default function JapaneseButton({
  children,
  variant = 'primary',
  size = 'md',
  href,
  leftIcon,
  rightIcon,
  ripple = true,
  className,
  disabled,
  onClick,
  ...props
}: JapaneseButtonProps) {
  const buttonClasses = cn(
    'relative inline-flex items-center justify-center gap-3',
    'overflow-hidden transition-all duration-500',
    'transform hover:scale-105 active:scale-95',
    'group liquid-button',
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
    className
  )

  const content = (
    <>
      {/* Liquid Morph Background */}
      <div className="absolute inset-0 liquid-morph-fast opacity-50" />

      {/* Ripple Effect Container */}
      {ripple && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="ripple-container" />
        </div>
      )}

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {/* Japanese Pattern Overlay */}
      <svg
        className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern
          id="button-pattern"
          x="0"
          y="0"
          width="50"
          height="50"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#button-pattern)" />
      </svg>

      {/* Button Content */}
      <div className="relative flex items-center gap-2">
        {leftIcon && <span className="text-current">{leftIcon}</span>}
        <span className="font-bold tracking-wide">{children}</span>
        {rightIcon && <span className="text-current">{rightIcon}</span>}
      </div>

      {/* Decorative Elements */}
      {variant === 'sakura' && (
        <>
          <div className="absolute -top-2 -right-2 text-2xl opacity-40 animate-bounce-slow">🌸</div>
          <div
            className="absolute -bottom-2 -left-2 text-2xl opacity-40 animate-bounce-slow"
            style={{ animationDelay: '1s' }}
          >
            🌸
          </div>
        </>
      )}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        {content}
      </Link>
    )
  }

  return (
    <button className={buttonClasses} disabled={disabled} onClick={onClick} {...props}>
      {content}
    </button>
  )
}

// Additional styled components for Japanese UI
export function TojiGateButton({ children, ...props }: JapaneseButtonProps) {
  return (
    <JapaneseButton {...props} leftIcon="⛩️" rightIcon="⛩️" variant="primary">
      {children}
    </JapaneseButton>
  )
}

export function SakuraButton({ children, ...props }: JapaneseButtonProps) {
  return (
    <JapaneseButton {...props} leftIcon="🌸" rightIcon="🌸" variant="sakura">
      {children}
    </JapaneseButton>
  )
}

export function BambooButton({ children, ...props }: JapaneseButtonProps) {
  return (
    <JapaneseButton {...props} leftIcon="🎋" rightIcon="🎋" variant="secondary">
      {children}
    </JapaneseButton>
  )
}
