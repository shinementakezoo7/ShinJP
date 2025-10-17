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
  colorClass: string
}

interface SakuraPetal {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  swayAmount: number
  rotationSpeed: number
}

interface FloatingOrb {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  colorClass: string
  floatDirection: 'up' | 'down' | 'diagonal'
}

export default function ParticleEffects() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [sakuraPetals, setSakuraPetals] = useState<SakuraPetal[]>([])
  const [floatingOrbs, setFloatingOrbs] = useState<FloatingOrb[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const controls = useAnimation()
  const isInView = useInView(containerRef)

  // Generate particles on mount
  useEffect(() => {
    // Enhanced floating particles with varied colors
    const newParticles: Particle[] = Array.from({ length: 25 }, (_, i) => {
      const colorClasses = [
        'from-red-400/30 to-pink-400/30',
        'from-blue-400/30 to-purple-400/30',
        'from-amber-400/30 to-orange-400/30',
        'from-emerald-400/30 to-teal-400/30',
        'from-indigo-400/30 to-cyan-400/30',
      ]

      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        duration: Math.random() * 25 + 15,
        delay: Math.random() * 8,
        swayAmount: Math.random() * 40 + 20,
        colorClass: colorClasses[Math.floor(Math.random() * colorClasses.length)],
      }
    })

    // Enhanced sakura petals with varied rotation speeds
    const newPetals: SakuraPetal[] = Array.from({ length: 12 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      size: Math.random() * 25 + 20,
      duration: Math.random() * 20 + 25,
      delay: Math.random() * 15,
      swayAmount: Math.random() * 120 + 60,
      rotationSpeed: Math.random() * 2 + 1,
    }))

    // New floating orbs for additional depth
    const newOrbs: FloatingOrb[] = Array.from({ length: 8 }, (_, i) => {
      const colorClasses = [
        'from-red-500/20 to-pink-500/20',
        'from-blue-500/20 to-purple-500/20',
        'from-amber-500/20 to-orange-500/20',
        'from-emerald-500/20 to-teal-500/20',
      ]

      const directions: ('up' | 'down' | 'diagonal')[] = ['up', 'down', 'diagonal']

      return {
        id: i + 100,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 40 + 30,
        duration: Math.random() * 30 + 20,
        delay: Math.random() * 10,
        colorClass: colorClasses[Math.floor(Math.random() * colorClasses.length)],
        floatDirection: directions[Math.floor(Math.random() * directions.length)],
      }
    })

    setParticles(newParticles)
    setSakuraPetals(newPetals)
    setFloatingOrbs(newOrbs)
  }, [])

  // Animate when in view
  useEffect(() => {
    if (isInView) {
      controls.start('visible')
    }
  }, [isInView, controls])

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Large floating orbs for depth */}
      {floatingOrbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute rounded-full bg-gradient-to-r ${orb.colorClass} blur-xl`}
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
          }}
          animate={{
            y:
              orb.floatDirection === 'up'
                ? [0, -100, 0]
                : orb.floatDirection === 'down'
                  ? [0, 100, 0]
                  : [0, -50, 0],
            x: orb.floatDirection === 'diagonal' ? [0, 50, 0] : [0, 20, 0],
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-gradient-to-r ${particle.colorClass} blur-sm`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, particle.swayAmount, -particle.swayAmount / 2, 0],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.3, 1],
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
            x: [0, petal.swayAmount, -petal.swayAmount / 2, petal.swayAmount / 3, 0],
            rotate: [0, 360 * petal.rotationSpeed, 720 * petal.rotationSpeed],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: petal.duration,
            delay: petal.delay,
            repeat: Infinity,
            ease: 'easeOut',
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
  const [particles, setParticles] = useState<
    Array<{ id: number; x: number; y: number; size: number }>
  >([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Create new particle at cursor position with random size
      if (Math.random() > 0.7) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 8 + 4,
        }

        setParticles((prev) => [...prev.slice(-30), newParticle])
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Clean up old particles
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles((prev) => prev.slice(-25))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-pink-400 to-purple-400"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.5, 0],
            opacity: [1, 0.8, 0],
            y: [0, -30],
            x: [0, (Math.random() - 0.5) * 20],
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
