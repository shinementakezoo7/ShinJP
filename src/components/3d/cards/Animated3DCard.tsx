'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState } from 'react'

interface Animated3DCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glowColor?: string
  onClick?: () => void
}

export default function Animated3DCard({
  children,
  className = '',
  intensity = 20,
  glowColor = 'rgba(168, 85, 247, 0.4)',
  onClick,
}: Animated3DCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [intensity, -intensity])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-intensity, intensity])

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`relative ${className} ${onClick ? 'cursor-pointer' : ''}`}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow Effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0 blur-xl"
        style={{
          background: `radial-gradient(circle at center, ${glowColor}, transparent)`,
        }}
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Card Content */}
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        style={{
          transform: 'translateZ(50px)',
          transformStyle: 'preserve-3d',
        }}
      >
        {children}
      </div>

      {/* Reflection Effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)`,
          transform: 'translateZ(75px)',
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0,
        }}
      />
    </motion.div>
  )
}
