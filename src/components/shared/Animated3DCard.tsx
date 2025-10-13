'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ReactNode, useRef } from 'react'

interface Animated3DCardProps {
  children: ReactNode
  className?: string
  glowColor?: string
  intensity?: number
}

export default function Animated3DCard({
  children,
  className = '',
  glowColor = 'red',
  intensity = 1,
}: Animated3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Mouse position tracking
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Smooth spring animations
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10 * intensity, -10 * intensity]), {
    stiffness: 300,
    damping: 30,
  })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10 * intensity, 10 * intensity]), {
    stiffness: 300,
    damping: 30,
  })

  // Shine effect position
  const shineX = useTransform(mouseX, [-0.5, 0.5], ['0%', '100%'])
  const shineY = useTransform(mouseY, [-0.5, 0.5], ['0%', '100%'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseXPos = e.clientX - rect.left
    const mouseYPos = e.clientY - rect.top

    const xPct = mouseXPos / width - 0.5
    const yPct = mouseYPos / height - 0.5

    mouseX.set(xPct)
    mouseY.set(yPct)
  }

  const handleMouseLeave = () => {
    mouseX.set(0)
    mouseY.set(0)
  }

  const glowColors = {
    red: 'rgba(220, 20, 60, 0.3)',
    orange: 'rgba(255, 140, 0, 0.3)',
    amber: 'rgba(255, 191, 0, 0.3)',
    purple: 'rgba(147, 51, 234, 0.3)',
    pink: 'rgba(236, 72, 153, 0.3)',
  }

  return (
    <motion.div
      ref={cardRef}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Base card with glass effect */}
      <div className="relative rounded-3xl overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-2xl h-full">
        {/* Shine effect */}
        <motion.div
          style={{
            background: `radial-gradient(circle at ${shineX} ${shineY}, rgba(255,255,255,0.2) 0%, transparent 60%)`,
          }}
          className="absolute inset-0 pointer-events-none"
        />

        {/* Glow effect */}
        <motion.div
          style={{
            boxShadow: useTransform(
              [mouseX, mouseY],
              ([x, y]) =>
                `${(x as number) * 20}px ${(y as number) * 20}px 60px ${glowColors[glowColor as keyof typeof glowColors] || glowColors.red}`
            ),
          }}
          className="absolute inset-0 rounded-3xl pointer-events-none"
        />

        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern
              id={`card-pattern-${glowColor}`}
              x="0"
              y="0"
              width="50"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="25"
                cy="25"
                r="20"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-red-800 dark:text-red-400"
              />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#card-pattern-${glowColor})`} />
          </svg>
        </div>

        {/* Content with 3D transform */}
        <div className="relative p-8 h-full" style={{ transform: 'translateZ(20px)' }}>
          {children}
        </div>

        {/* Border glow animation */}
        <motion.div
          className="absolute inset-0 rounded-3xl border-2 border-transparent"
          animate={{
            borderColor: ['rgba(220, 20, 60, 0)', 'rgba(220, 20, 60, 0.5)', 'rgba(220, 20, 60, 0)'],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>
    </motion.div>
  )
}

// Feature Card Component
interface FeatureCardProps {
  icon: string
  title: string | ReactNode
  description: string
  kanji: string
  gradient: string
  index?: number
}

export function FeatureCard3D({
  icon,
  title,
  description,
  kanji,
  gradient,
  index = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
    >
      <Animated3DCard>
        {/* Kanji decoration */}
        <div className="absolute top-4 right-4 text-8xl japanese-text text-red-800/5 dark:text-red-400/5 pointer-events-none select-none font-black">
          {kanji}
        </div>

        {/* Icon badge with 3D effect */}
        <div className="relative flex justify-center mb-6">
          <motion.div
            className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${gradient} rounded-2xl shadow-xl`}
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.span
              className="text-4xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              {icon}
            </motion.span>
          </motion.div>
        </div>

        <div className="relative">
          <motion.h3
            className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center"
            whileHover={{ scale: 1.05 }}
          >
            {title}
          </motion.h3>
          <p className="text-base text-gray-700 dark:text-gray-300 text-center leading-relaxed">
            {description}
          </p>
        </div>

        {/* Decorative element */}
        <motion.div
          className="absolute -bottom-2 -right-2 text-3xl opacity-20"
          animate={{
            rotate: [12, 0, 12],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        >
          🌸
        </motion.div>
      </Animated3DCard>
    </motion.div>
  )
}

// Stat Card Component
interface StatCardProps {
  value: string
  label: string
  kanji: string
  gradient: string
  index?: number
}

export function StatCard3D({ value, label, kanji, gradient, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.2, type: 'spring', stiffness: 100 }}
    >
      <Animated3DCard intensity={1.5}>
        {/* Background kanji */}
        <div className="absolute top-0 right-0 text-9xl japanese-text text-red-800/5 dark:text-red-400/5 pointer-events-none select-none font-black">
          {kanji.charAt(0)}
        </div>

        <div className="relative text-center">
          <motion.div
            className={`text-7xl font-black bg-gradient-to-br ${gradient} bg-clip-text text-transparent mb-3`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: index * 0.3 }}
          >
            {value}
          </motion.div>
          <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
            {label}
          </div>
          <motion.div
            className="text-2xl japanese-text text-red-700/50 dark:text-red-400/50 mt-2"
            whileHover={{ scale: 1.2 }}
          >
            {kanji}
          </motion.div>
        </div>
      </Animated3DCard>
    </motion.div>
  )
}
