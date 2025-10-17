'use client'

import { motion, useAnimation, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  swayAmount?: number
}

interface SakuraPetal {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  swayAmount: number
}

export default function ParticleEffects() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [sakuraPetals, setSakuraPetals] = useState<SakuraPetal[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isInView = useInView(containerRef)

  // Generate particles on mount
  useEffect(() => {
    const newParticles: Particle[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }))

    const newPetals: SakuraPetal[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 20 + 15,
      duration: Math.random() * 15 + 20,
      delay: Math.random() * 10,
      swayAmount: Math.random() * 100 + 50,
    }))

    setParticles(newParticles)
    setSakuraPetals(newPetals)
  }, [])

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-red-400/30 to-pink-400/30 blur-sm"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, particle.swayAmount || 20, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Falling sakura petals */}
      {sakuraPetals.map((petal) => (
        <motion.div
          key={petal.id}
          className="absolute"
          style={{
            left: `${petal.x}%`,
            fontSize: `${petal.size}px`,
          }}
          animate={{
            y: ['-10vh', '110vh'],
            x: [0, petal.swayAmount, -petal.swayAmount / 2, petal.swayAmount],
            rotate: [0, 360, 720],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🌸
        </motion.div>
      ))}

      {/* Interactive cursor particles */}
      <CursorParticles />
    </div>
  )
}

// Interactive cursor particles component
function CursorParticles() {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Create new particle at cursor position
      if (Math.random() > 0.9) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
        }

        setParticles((prev) => [...prev.slice(-20), newParticle])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Clean up old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(-15))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
          style={{
            left: particle.x - 4,
            top: particle.y - 4,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
            y: [0, -20],
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}
