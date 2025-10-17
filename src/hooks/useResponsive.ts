'use client'

import React, { useEffect, useState } from 'react'
import { useMediaQuery } from 'react-responsive'

// Responsive breakpoints
export const BREAKPOINTS = {
  mobile: '767px',
  tablet: '1024px',
  desktop: '1280px',
}

export const useResponsive = () => {
  const [viewport, setViewport] = useState('desktop')

  const isMobile = useMediaQuery({ maxWidth: 767 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1024 })
  const isDesktop = useMediaQuery({ minWidth: 1281 })
  const isLargeDesktop = useMediaQuery({ minWidth: 1536 })

  useEffect(() => {
    if (isMobile) setViewport('mobile')
    else if (isTablet) setViewport('tablet')
    else if (isDesktop) setViewport('desktop')
    else setViewport('large-desktop')
  }, [isMobile, isTablet, isDesktop, isLargeDesktop])

  return {
    viewport,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
  }
}

// Adaptive UI components based on viewport
export const useAdaptiveUI = () => {
  const { viewport, isMobile, isTablet } = useResponsive()

  return {
    // Layout adjustments
    containerPadding: {
      mobile: 'p-2',
      tablet: 'p-4',
      desktop: 'p-6',
    }[viewport],

    // Font sizes based on viewport
    fontSize: {
      mobile: 'text-sm',
      tablet: 'text-base',
      desktop: 'text-base',
    }[viewport],

    // Shadow intensities
    shadow: {
      mobile: 'shadow-sm',
      tablet: 'shadow-md',
      desktop: 'shadow-lg',
    }[viewport],

    // Animation complexities
    animate: !isMobile && !isTablet,
    reduceMotion: isMobile,

    // Touch vs click interactions
    useTouch: isMobile || isTablet,
    useHover: !isMobile,
  }
}

// Component-specific responsive utilities
export const useChatResponsive = () => {
  const { viewport, isMobile, isTablet, isDesktop } = useResponsive()

  return {
    // Sidebar behavior
    sidebarCollapsed: isMobile,
    drawerMode: isMobile,
    sidebarWidth: isMobile ? '100%' : isTablet ? '280px' : '320px',

    // Message layout
    messageSpacing: isMobile ? 'space-y-2' : 'space-y-4',
    messagePadding: isMobile ? 'p-3' : 'p-4',
    avatarSize: isMobile ? 'w-8 h-8' : 'w-10 h-10',

    // Input adjustments
    inputMinHeight: isMobile ? '48px' : '60px',
    inputMaxHeight: isMobile ? '120px' : '200px',
    buttonSize: isMobile ? 'w-10 h-10' : 'w-12 h-12',

    // Typography
    messageTextSize: isMobile ? 'text-sm' : 'text-base',
    timestampSize: isMobile ? 'text-xs' : 'text-sm',

    // Gestures
    swipeEnabled: isMobile || isTablet,

    // Performance flags
    virtualizeMessages: isMobile && messages.length > 100,
    batchUpdates: isMobile,
  }
}

// Hook for adaptive image loading
export const useAdaptiveImage = () => {
  const { viewport, isMobile, isTablet } = useResponsive()

  const getImageSize = (originalSize: number) => {
    if (isMobile) return originalSize * 0.5 // Mobile: 50% smaller
    if (isTablet) return originalSize * 0.75 // Tablet: 25% smaller
    return originalSize // Desktop: original size
  }

  const getImageQuality = () => {
    if (isMobile) return 'low'
    if (isTablet) return 'medium'
    return 'high'
  }

  const shouldUseWebP = () => {
    return !isMobile || ('supportsWebP' in window && (window as any).supportsWebP)
  }

  return {
    getImageSize,
    getImageQuality,
    shouldUseWebP,
    lazyLoad: isMobile,
    preload: !isMobile,
  }
}

// Hook for responsive animations
export const useResponsiveAnimations = () => {
  const { viewport, isMobile, isTablet } = useResponsive()

  const animationConfig = {
    // Reduced animations for mobile
    messageEnter: {
      mobile: { opacity: 1, y: 0, scale: 1 },
      tablet: { opacity: 1, y: 0, scale: 1 },
      desktop: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    }[viewport],

    messageVariants: {
      mobile: {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        transition: { duration: 0.2 },
      },
      tablet: {
        initial: { opacity: 0, y: 15, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -15, scale: 0.95 },
        transition: { duration: 0.3 },
      },
      desktop: {
        initial: { opacity: 0, y: 20, scale: 0.9 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: -20, scale: 0.9 },
        transition: { type: 'spring', stiffness: 300, damping: 30 },
      },
    }[viewport],

    // Performance-based transitions
    shouldAnimate: !isMobile && !isTablet,
    useTransitions: !isMobile,
    enableSpring: !isMobile,
  }

  return animationConfig
}

// Hook for adaptive component rendering
export const useAdaptiveRendering = () => {
  const { viewport, isMobile, isTablet } = useResponsive()

  return {
    // Render based on viewport
    renderMessageThread: !isMobile,
    renderUserPresence: !isMobile,
    renderFilePreview: !isMobile || isTablet,
    renderEmojiPicker: !isMobile,
    renderVoiceInput: !isMobile,
    renderQuickPrompts: !isMobile,

    // Feature flags
    enableThreading: !isMobile,
    enableReactions: !isMobile,
    enableFileSharing: !isMobile || isTablet,
    enableVoiceMessages: !isMobile,
    enableVideoCalls: isDesktop,
  }
}
