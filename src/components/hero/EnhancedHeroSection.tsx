'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import PoweredByAIBadge from '@/components/shared/PoweredByAIBadge'
import { useTheme } from '@/lib/theme/theme-context'

interface ParticleType {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
}

export default function EnhancedHeroSection() {
  const { resolvedTheme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const particlesRef = useRef<ParticleType[]>([])

  // Interactive particle background
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    // Initialize particles
    const particleCount = 50
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }))

    let animationFrame: number

    const animate = () => {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      particlesRef.current.forEach((particle, i) => {
        // Move particles
        particle.x += particle.vx
        particle.y += particle.vy

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Mouse interaction
        if (isHovering) {
          const dx = mousePosition.x - particle.x
          const dy = mousePosition.y - particle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const force = (150 - distance) / 150
            particle.x -= (dx / distance) * force * 2
            particle.y -= (dy / distance) * force * 2
          }
        }

        // Draw particle
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size
        )

        if (resolvedTheme === 'dark') {
          gradient.addColorStop(0, `rgba(99, 102, 241, ${particle.opacity})`)
          gradient.addColorStop(1, 'rgba(99, 102, 241, 0)')
        } else {
          gradient.addColorStop(0, `rgba(79, 70, 229, ${particle.opacity})`)
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0)')
        }

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections
        particlesRef.current.slice(i + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.strokeStyle =
              resolvedTheme === 'dark'
                ? `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`
                : `rgba(79, 70, 229, ${0.1 * (1 - distance / 100)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
          }
        })
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      cancelAnimationFrame(animationFrame)
    }
  }, [resolvedTheme, mousePosition, isHovering])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Interactive Canvas Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ mixBlendMode: resolvedTheme === 'dark' ? 'screen' : 'multiply' }}
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-cyan-500/30 to-blue-600/30 dark:from-cyan-400/20 dark:to-blue-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-float"></div>
        <div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-purple-500/30 to-pink-600/30 dark:from-purple-400/20 dark:to-pink-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-80 h-80 bg-gradient-to-br from-emerald-500/30 to-green-600/30 dark:from-emerald-400/20 dark:to-green-500/20 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-70 animate-float"
          style={{ animationDelay: '4s' }}
        ></div>
      </div>

      {/* Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-5 dark:opacity-10 pointer-events-none"></div>

      {/* Neon Accent Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-500/20 dark:via-cyan-400/30 to-transparent animate-pulse"></div>
        <div
          className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/20 dark:via-purple-400/30 to-transparent animate-pulse"
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          {/* Animated Badge */}
          <div className="mb-8 flex justify-center animate-fade-in">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 rounded-full blur opacity-50 group-hover:opacity-75 transition-opacity animate-gradient-x"></div>
              <div className="relative">
                <PoweredByAIBadge />
              </div>
            </div>
          </div>

          {/* Main Heading with Morphing Effect */}
          <div className="animate-bounce-in">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none mb-4">
              <span className="block text-gray-900 dark:text-white transition-colors duration-300">
                Master{' '}
                <span className="holographic inline-block hover:scale-110 transition-transform cursor-default">
                  Japanese
                </span>
              </span>
              <span className="block mt-3 text-gray-900 dark:text-white transition-colors duration-300">
                from{' '}
                <span className="neon-text gradient-text inline-block hover:scale-110 transition-transform cursor-default">
                  N5 to N1
                </span>
              </span>
            </h1>
          </div>

          {/* Enhanced Subtitle with Typewriter Effect */}
          <div className="mt-8 animate-fade-in stagger-1">
            <p className="max-w-4xl mx-auto text-xl sm:text-2xl lg:text-3xl text-gray-700 dark:text-gray-200 leading-relaxed font-medium transition-colors duration-300">
              Shinmen Takezo guides you through every level of Japanese mastery with{' '}
              <span className="relative inline-block">
                <span className="relative z-10 font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 animate-gradient-x">
                  AI-powered personalized learning
                </span>
                <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 transform origin-left animate-gradient-x"></span>
              </span>
              , spaced repetition, and immersive practice.
            </p>
          </div>

          {/* Enhanced CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in stagger-2">
            {/* Primary CTA */}
            <Link
              href="/dashboard"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg sm:text-xl font-bold text-white rounded-2xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 transition-all duration-300 group-hover:scale-110"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <div className="relative flex items-center gap-3">
                <span>Start Your Journey</span>
                <svg
                  className="w-6 h-6 transform transition-transform group-hover:translate-x-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </Link>

            {/* Secondary CTA */}
            <Link
              href="/demo"
              className="group relative inline-flex items-center justify-center px-10 py-5 text-lg sm:text-xl font-bold rounded-2xl transition-all duration-300 hover:scale-105 w-full sm:w-auto overflow-hidden"
            >
              <div className="absolute inset-0 bg-white dark:bg-gray-800 transition-colors duration-300"></div>
              <div className="absolute inset-0 border-2 border-gray-900 dark:border-white rounded-2xl"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
              <span className="relative text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                Try Demo
              </span>
            </Link>
          </div>

          {/* Enhanced Stats Grid with Bento Layout */}
          <div className="mt-16 animate-fade-in stagger-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {/* Stat 1 */}
              <div className="group relative stat-card-glow">
                <div className="relative glass-morphism rounded-3xl p-8 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/30 transition-all duration-500 hover:border-indigo-500/50 overflow-hidden">
                  {/* Background Decoration */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8 transition-transform group-hover:scale-150"></div>

                  <div className="relative">
                    <div className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-3 animate-gradient-x leading-none">
                      5
                    </div>
                    <div className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      JLPT Levels
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group relative stat-card-glow">
                <div className="relative glass-morphism rounded-3xl p-8 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/30 transition-all duration-500 hover:border-purple-500/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8 transition-transform group-hover:scale-150"></div>
                  <div className="absolute top-0 right-0 text-8xl japanese-text text-pink-800/5 dark:text-pink-400/5 pointer-events-none select-none font-black">
                    千
                  </div>

                  <div className="relative">
                    <div className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 mb-3 animate-gradient-x leading-none">
                      1K+
                    </div>
                    <div className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Vocabulary
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="group relative stat-card-glow">
                <div className="relative glass-morphism rounded-3xl p-8 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/30 transition-all duration-500 hover:border-pink-500/50 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-transparent rounded-full blur-2xl transform translate-x-8 -translate-y-8 transition-transform group-hover:scale-150"></div>

                  <div className="relative">
                    <div className="text-6xl sm:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-br from-pink-600 via-red-600 to-orange-600 dark:from-pink-400 dark:via-red-400 dark:to-orange-400 mb-3 animate-gradient-x leading-none">
                      AI
                    </div>
                    <div className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                      Powered
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="mt-16 animate-fade-in stagger-4">
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Scroll to Explore
              </p>
              <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex items-start justify-center p-2">
                <div className="w-1.5 h-3 bg-gray-600 dark:bg-gray-400 rounded-full animate-bounce"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 dark:from-gray-950 to-transparent pointer-events-none"></div>
    </section>
  )
}
