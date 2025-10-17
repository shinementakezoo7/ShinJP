'use client'

import React from 'react'

// Mobile Performance HOC
export const withMobileOptimization = <P extends object>(Component: React.ComponentType<P>) => {
  const WithMobileOptimization = React.forwardRef<any, P>((props, ref) => {
    const [isMobile, setIsMobile] = React.useState(false)

    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return React.createElement(Component, {
      ...props,
      ref,
      isMobile,
      disableAnimations: isMobile,
      reduceMotion: isMobile,
    })
  })

  WithMobileOptimization.displayName = `withMobileOptimization(${Component.displayName || Component.name || 'Component'})`

  return WithMobileOptimization
}

// Animation reduction for mobile
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false

  // Check system preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Check mobile device
  const isMobile = window.innerWidth < 768

  // Check battery level
  const batteryLevel = (navigator as any).getBattery?.().then((battery: any) => battery.level)
  const lowBattery = batteryLevel && batteryLevel < 0.2

  return prefersReducedMotion || isMobile || lowBattery
}

// Battery-aware optimizations
export const useBatteryOptimization = () => {
  const [batteryLevel, setBatteryLevel] = React.useState(1)
  const [charging, setCharging] = React.useState(false)

  React.useEffect(() => {
    if (!('getBattery' in navigator)) return

    navigator.getBattery().then((battery: any) => {
      setBatteryLevel(battery.level)
      setCharging(battery.charging)

      const handleLevelChange = () => setBatteryLevel(battery.level)
      const handleChargingChange = () => setCharging(battery.charging)

      battery.addEventListener('levelchange', handleLevelChange)
      battery.addEventListener('chargingchange', handleChargingChange)

      return () => {
        battery.removeEventListener('levelchange', handleLevelChange)
        battery.removeEventListener('chargingchange', handleChargingChange)
      }
    })
  }, [])

  return {
    batteryLevel,
    isCharging: charging,
    shouldReduceAnimations: batteryLevel < 0.2 && !charging,
    shouldReduceQuality: batteryLevel < 0.4 && !charging,
  }
}

// Touch gesture handling for mobile
export const useTouchGestures = () => {
  const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right' | null>(null)
  const [touchStart, setTouchStart] = React.useState({ x: 0, y: 0 })
  const [touchEnd, setTouchEnd] = React.useState({ x: 0, y: 0 })

  const handleTouchStart = React.useCallback((e: TouchEvent) => {
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }, [])

  const handleTouchMove = React.useCallback((e: TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    })
  }, [])

  const handleTouchEnd = React.useCallback(() => {
    if (!touchStart.x || !touchEnd.x) return

    const distanceX = touchStart.x - touchEnd.x
    const distanceY = touchStart.y - touchEnd.y

    // Only register significant swipes
    if (Math.abs(distanceX) < 30) return

    if (distanceX > 0) {
      setSwipeDirection('left')
    } else {
      setSwipeDirection('right')
    }

    // Reset after a brief delay
    setTimeout(() => setSwipeDirection(null), 300)
  }, [touchStart, touchEnd])

  return {
    swipeDirection,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}

// Keyboard handling improvements for mobile
export const useMobileKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = React.useState(false)
  const [keyboardHeight, setKeyboardHeight] = React.useState(0)

  React.useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        setIsKeyboardOpen(true)
        // iOS specific
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
          setKeyboardHeight(
            Math.max(250, window.innerHeight - document.documentElement.clientHeight)
          )
        }
      }
    }

    const handleFocusOut = () => {
      setIsKeyboardOpen(false)
      setKeyboardHeight(0)
    }

    const handleResize = () => {
      // Handle virtual keyboard visibility on mobile
      const height = window.innerHeight
      setKeyboardHeight(height && height > 0 ? Math.max(0, window.screen.height - height) : 0)
      setIsKeyboardOpen(height && height > 0 ? window.screen.height - height > 100 : false)
    }

    document.addEventListener('focusin', handleFocusIn)
    document.addEventListener('focusout', handleFocusOut)
    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('focusin', handleFocusIn)
      document.removeEventListener('focusout', handleFocusOut)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return {
    isKeyboardOpen,
    keyboardHeight,
    adjustForKeyboard: (element: HTMLElement) => {
      if (isKeyboardOpen && keyboardHeight > 0) {
        element.style.paddingBottom = `${keyboardHeight + 20}px`
      } else {
        element.style.paddingBottom = '0px'
      }
    },
  }
}
