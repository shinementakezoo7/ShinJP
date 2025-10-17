'use client'

import { motion } from 'framer-motion'

interface FloatingParticleProps {
  count?: number
  speed?: number
  color?: string
}

export function FloatingParticles({
  count = 8,
  speed = 4,
  color = 'from-pink-400/60 to-purple-400/60',
}: FloatingParticleProps) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
      {[...Array(count)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute w-2 h-2 bg-gradient-to-r ${color} rounded-full blur-sm`}
          style={{
            left: `${20 + i * (80 / count)}%`,
            top: `${30 + i * (40 / count)}%`,
          }}
          animate={{
            y: [0, -25, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{
            duration: speed + i * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  )
}
