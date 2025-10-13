'use client'

import { useEffect, useState } from 'react'
import Lottie from 'lottie-react'
import { motion, AnimatePresence } from 'framer-motion'

interface LottieRewardProps {
  /**
   * Show the reward animation
   */
  show: boolean

  /**
   * Type of reward to show
   * 'achievement' - Badge/trophy animation
   * 'levelUp' - Level up celebration
   * 'streak' - Streak milestone
   * 'perfect' - Perfect score celebration
   * 'custom' - Use custom animation data
   */
  type: 'achievement' | 'levelUp' | 'streak' | 'perfect' | 'custom'

  /**
   * Custom animation data (JSON from Lottie)
   * Required if type is 'custom'
   */
  animationData?: object

  /**
   * Title to display with the reward
   */
  title?: string

  /**
   * Subtitle/description
   */
  subtitle?: string

  /**
   * Callback when animation completes
   */
  onComplete?: () => void

  /**
   * Duration to show the reward (ms)
   */
  duration?: number

  /**
   * Auto-hide after duration
   */
  autoHide?: boolean
}

// Placeholder animation data (replace with actual Lottie JSON files)
const ANIMATIONS = {
  achievement: {
    // Download from: https://lottiefiles.com/search?q=trophy
    // For now, we'll use a simple placeholder
    placeholder: true,
    emoji: '🏆',
  },
  levelUp: {
    // Download from: https://lottiefiles.com/search?q=level+up
    placeholder: true,
    emoji: '⬆️',
  },
  streak: {
    // Download from: https://lottiefiles.com/search?q=fire+streak
    placeholder: true,
    emoji: '🔥',
  },
  perfect: {
    // Download from: https://lottiefiles.com/search?q=star+celebration
    placeholder: true,
    emoji: '⭐',
  },
}

export default function LottieReward({
  show,
  type,
  animationData,
  title,
  subtitle,
  onComplete,
  duration = 3000,
  autoHide = true,
}: LottieRewardProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)

      if (autoHide) {
        const timer = setTimeout(() => {
          setVisible(false)
          onComplete?.()
        }, duration)

        return () => clearTimeout(timer)
      }
    } else {
      setVisible(false)
    }
  }, [show, autoHide, duration, onComplete])

  const animation = type === 'custom' ? animationData : ANIMATIONS[type]
  const isPlaceholder = animation && 'placeholder' in animation && animation.placeholder

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => {
              setVisible(false)
              onComplete?.()
            }}
          />

          {/* Reward Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: 'spring',
                damping: 15,
                stiffness: 300,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: -50,
              transition: { duration: 0.3 },
            }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <div className="pointer-events-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 border-4 border-gradient-to-r from-yellow-400 via-pink-500 to-purple-500">
              {/* Animation */}
              <div className="flex justify-center mb-6">
                {isPlaceholder ? (
                  // Placeholder emoji animation
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{
                      scale: [0, 1.2, 1],
                      rotate: [0, 360, 360],
                    }}
                    transition={{
                      duration: 0.6,
                      times: [0, 0.6, 1],
                      ease: 'easeOut',
                    }}
                    className="text-9xl"
                  >
                    {(animation as any).emoji}
                  </motion.div>
                ) : (
                  // Actual Lottie animation
                  <div className="w-64 h-64">
                    <Lottie
                      animationData={animationData}
                      loop={false}
                      onComplete={() => {
                        if (!autoHide) {
                          onComplete?.()
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Title */}
              {title && (
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-center mb-3 bg-gradient-to-r from-yellow-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
                >
                  {title}
                </motion.h2>
              )}

              {/* Subtitle */}
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center text-gray-600 dark:text-gray-300 mb-6"
                >
                  {subtitle}
                </motion.p>
              )}

              {/* Confetti particles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0,
                      opacity: 1,
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      scale: Math.random() * 2,
                      opacity: 0,
                      rotate: Math.random() * 720,
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.05,
                      ease: 'easeOut',
                    }}
                    className="absolute w-3 h-3 rounded-full"
                    style={{
                      background: ['#fbbf24', '#f472b6', '#a78bfa', '#60a5fa'][i % 4],
                    }}
                  />
                ))}
              </div>

              {/* Close button */}
              {!autoHide && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  onClick={() => {
                    setVisible(false)
                    onComplete?.()
                  }}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                >
                  Continue
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/**
 * USAGE EXAMPLES:
 *
 * 1. Achievement Badge:
 * <LottieReward
 *   show={showReward}
 *   type="achievement"
 *   title="Achievement Unlocked!"
 *   subtitle="You've completed N5 Level 1"
 *   onComplete={() => setShowReward(false)}
 * />
 *
 * 2. Level Up:
 * <LottieReward
 *   show={showLevelUp}
 *   type="levelUp"
 *   title="Level Up!"
 *   subtitle="You're now N4 level"
 *   duration={4000}
 * />
 *
 * 3. Streak Milestone:
 * <LottieReward
 *   show={showStreak}
 *   type="streak"
 *   title="7 Day Streak! 🔥"
 *   subtitle="Keep it up!"
 * />
 *
 * 4. Perfect Score:
 * <LottieReward
 *   show={showPerfect}
 *   type="perfect"
 *   title="Perfect! 100%"
 *   subtitle="All answers correct!"
 * />
 *
 * 5. Custom Lottie Animation:
 * import customAnimation from '@/assets/animations/sakura-celebration.json'
 *
 * <LottieReward
 *   show={showCustom}
 *   type="custom"
 *   animationData={customAnimation}
 *   title="Sakura Festival!"
 *   subtitle="Special cultural achievement"
 *   autoHide={false}
 * />
 */
