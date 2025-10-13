'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme/theme-context'

export default function JapaneseLiquidHero() {
  const { resolvedTheme } = useTheme()
  const liquidRef = useRef<HTMLDivElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if mobile device
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Liquid blob following mouse with touch support
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (liquidRef.current) {
        const rect = liquidRef.current.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
        setMousePos({
          x: ((clientX - rect.left) / rect.width) * 100,
          y: ((clientY - rect.top) / rect.height) * 100,
        })
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleMouseMove)
    }
  }, [])

  // Generate Koi fish positions with stable values (max count for hydration consistency)
  const allKoiFish = useMemo(
    () =>
      [...Array(5)].map((_, i) => ({
        id: i,
        left: 10 + i * 18 + ((i * 7) % 30), // Deterministic positioning
        animationDelay: i * 2.5,
        scale: 0.8 + ((i * 0.1) % 0.4),
        duration: 20 + ((i * 3) % 15),
      })),
    []
  )

  // Use subset based on mobile state
  const koiFish = mounted ? allKoiFish.slice(0, isMobile ? 3 : 5) : allKoiFish

  // Generate sparkles with stable values (max count for hydration consistency)
  const allSparkles = useMemo(
    () =>
      [...Array(25)].map((_, i) => ({
        id: i,
        left: (i * 37 + 13) % 100, // Deterministic but varied
        top: (i * 43 + 7) % 100,
        animationDelay: (i * 0.3) % 3,
        animationDuration: 2 + ((i * 0.3) % 3),
        opacity: 0.2 + ((i * 0.1) % 0.4),
      })),
    []
  )

  // Use subset based on mobile state
  const sparkles = mounted ? allSparkles.slice(0, isMobile ? 15 : 25) : allSparkles

  return (
    <section
      ref={liquidRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20 transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Koi Fish Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {koiFish.map((fish) => (
          <div
            key={fish.id}
            className="absolute w-16 h-16 animate-koi-swim"
            style={{
              left: `${fish.left}%`,
              animationDelay: `${fish.animationDelay}s`,
              animationDuration: `${fish.duration}s`,
              transform: `scale(${fish.scale})`,
            }}
          >
            <div className="text-5xl opacity-20 dark:opacity-10 drop-shadow-lg">🐟</div>
          </div>
        ))}
      </div>

      {/* Mount Fuji Silhouette */}
      <div className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none overflow-hidden">
        <svg
          viewBox="0 0 1440 400"
          className="absolute bottom-0 w-full opacity-5 dark:opacity-10"
          preserveAspectRatio="none"
        >
          <path
            d="M0 400 L480 150 L720 100 L960 150 L1440 400 Z"
            fill="currentColor"
            className="text-gray-800 dark:text-gray-200"
          />
        </svg>
      </div>

      {/* Traditional Japanese Patterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Enhanced Seigaiha Waves Pattern with Animation */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08] dark:opacity-[0.12] animate-wave-flow"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="seigaiha-hero"
              x="0"
              y="0"
              width="140"
              height="70"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-red-800 dark:text-red-400"
              >
                <path d="M0,35 Q17.5,15 35,35 T70,35" />
                <path d="M0,35 Q17.5,20 35,35 T70,35" transform="translate(0,5)" opacity="0.7" />
                <path d="M0,35 Q17.5,25 35,35 T70,35" transform="translate(0,10)" opacity="0.5" />
                <path d="M35,35 Q52.5,15 70,35 T105,35" />
                <path d="M35,35 Q52.5,20 70,35 T105,35" transform="translate(0,5)" opacity="0.7" />
                <path d="M70,35 Q87.5,15 105,35 T140,35" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#seigaiha-hero)" />
        </svg>

        {/* Asanoha Hemp Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="asanoha-hero"
              x="0"
              y="0"
              width="100"
              height="86.6"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                className="text-amber-800 dark:text-amber-400"
              >
                <path d="M50,0 L75,43.3 L50,86.6 L25,43.3 Z" />
                <path d="M50,0 L50,86.6" />
                <path d="M25,43.3 L75,43.3" />
                <path d="M37.5,21.65 L62.5,65" />
                <path d="M62.5,21.65 L37.5,65" />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#asanoha-hero)" />
        </svg>
      </div>

      {/* Enhanced Liquid Morphing Blobs with More Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Large Red Blob with Glow */}
        <div
          className="absolute w-[700px] h-[700px] rounded-full blur-3xl opacity-35 dark:opacity-25 liquid-blob"
          style={{
            background:
              'radial-gradient(circle, #DC143C 0%, #FF6B6B 40%, #FFA07A 70%, transparent 85%)',
            top: '5%',
            left: '2%',
            transform: `translate(${mousePos.x * 0.08}px, ${mousePos.y * 0.08}px)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'blur(60px) brightness(1.1)',
          }}
        />

        {/* Gold Blob with Enhanced Shimmer */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-35 dark:opacity-25 liquid-blob"
          style={{
            background:
              'radial-gradient(circle, #DAA520 0%, #FFD700 40%, #FFA500 70%, transparent 85%)',
            top: '15%',
            right: '5%',
            transform: `translate(-${mousePos.x * 0.06}px, ${mousePos.y * 0.06}px) rotate(${mousePos.x * 0.1}deg)`,
            transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'blur(60px) brightness(1.15)',
          }}
        />

        {/* Orange Blob with Depth */}
        <div
          className="absolute w-[550px] h-[550px] rounded-full blur-3xl opacity-30 dark:opacity-20 liquid-blob"
          style={{
            background:
              'radial-gradient(circle, #FF8C00 0%, #FFA500 40%, #FFB347 70%, transparent 85%)',
            bottom: '10%',
            left: '45%',
            transform: `translate(${mousePos.x * 0.07}px, -${mousePos.y * 0.07}px) scale(${1 + mousePos.x * 0.0001})`,
            transition: 'transform 0.55s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'blur(60px)',
          }}
        />

        {/* Additional Purple Accent Blob */}
        <div
          className="absolute w-[400px] h-[400px] rounded-full blur-3xl opacity-20 dark:opacity-15 liquid-blob"
          style={{
            background: 'radial-gradient(circle, #FF69B4 0%, #FF1493 40%, transparent 70%)',
            top: '40%',
            right: '20%',
            transform: `translate(${mousePos.x * 0.04}px, ${mousePos.y * 0.04}px)`,
            transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      {/* Torii Gate Decoration */}
      <div className="absolute top-10 right-10 pointer-events-none">
        <div className="text-6xl sm:text-8xl opacity-5 dark:opacity-10 transform rotate-12 animate-pulse-slow">
          ⛩️
        </div>
      </div>

      {/* Enhanced Floating Sakura Petals with Variety */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(isMobile ? 10 : 18)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-sakura-float"
            style={{
              left: `${(i * 5.5) % 100}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${12 + i * 1.5}s`,
              transform: `scale(${0.8 + (i % 3) * 0.2})`,
            }}
          >
            <div
              className="text-2xl sm:text-4xl opacity-40 dark:opacity-25 transition-transform hover:scale-110"
              style={{
                filter: `hue-rotate(${i * 15}deg) brightness(1.1)`,
                textShadow: '0 2px 8px rgba(255, 182, 193, 0.5)',
              }}
            >
              {i % 3 === 0 ? '🌸' : i % 3 === 1 ? '🍂' : '🌺'}
            </div>
          </div>
        ))}
      </div>

      {/* Animated Lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {!isMobile &&
          [...Array(4)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-lantern-float"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + i * 5}%`,
                animationDelay: `${i * 3}s`,
                animationDuration: `${15 + i * 2}s`,
              }}
            >
              <div className="text-4xl opacity-30 dark:opacity-20 drop-shadow-xl">🏮</div>
            </div>
          ))}
      </div>

      {/* Ambient Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.animationDelay}s`,
              animationDuration: `${sparkle.animationDuration}s`,
              opacity: sparkle.opacity,
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Enhanced Traditional Japanese Kanji Decoration with Rotation */}
          <div className="mb-8 animate-fade-in">
            <div className="inline-block relative">
              <div className="text-7xl sm:text-9xl md:text-[12rem] font-black japanese-text text-red-800 dark:text-red-400 opacity-[0.07] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none animate-kanji-rotate">
                {isHovered ? '武' : '道'}
              </div>
              <div className="relative px-8 py-4">
                <div className="inline-flex items-center gap-3 sm:gap-4 bg-white/50 dark:bg-black/40 backdrop-blur-2xl rounded-full px-6 sm:px-8 py-2 sm:py-3 border-2 border-red-800/30 dark:border-red-400/30 shadow-2xl liquid-morph hover:scale-105 transition-transform duration-300">
                  <span className="text-xl sm:text-2xl animate-bounce-in">🎌</span>
                  <span className="text-xs sm:text-base font-black text-red-900 dark:text-red-300 tracking-wider uppercase">
                    {isMobile ? '日本語道' : 'Way of Japanese Mastery'}
                  </span>
                  <span
                    className="text-xl sm:text-2xl animate-bounce-in"
                    style={{ animationDelay: '0.1s' }}
                  >
                    🎌
                  </span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-amber-500/20 blur-2xl rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Hero Title with Liquid Morphing */}
          <div className="animate-bounce-in mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6">
              <div className="flex flex-col items-center gap-4">
                {/* Enhanced Japanese Text with Liquid Effect and Calligraphy */}
                <div className="relative inline-block group">
                  <span className="japanese-text text-red-800 dark:text-red-400 block liquid-text-morph text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-black drop-shadow-2xl group-hover:scale-105 transition-transform duration-300 brush-stroke">
                    侍
                  </span>
                  <div className="absolute -inset-6 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 opacity-25 blur-3xl animate-pulse-slow"></div>
                  <div
                    className="absolute -inset-8 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 opacity-15 blur-[80px] animate-pulse"
                    style={{ animationDelay: '1s' }}
                  ></div>
                </div>

                {/* Main Title */}
                <div className="relative">
                  <span className="block text-gray-900 dark:text-white">
                    Master{' '}
                    <span className="relative inline-block">
                      <span className="liquid-gradient-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400">
                        Japanese
                      </span>
                      <div className="absolute -inset-2 bg-gradient-to-r from-red-500/30 to-amber-500/30 blur-xl animate-pulse-slow"></div>
                    </span>
                  </span>
                </div>

                {/* Subtitle with Wave Effect */}
                <div className="relative mt-4">
                  <span className="block text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl">
                    from{' '}
                    <span className="liquid-gradient-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 font-extrabold">
                      N5
                    </span>{' '}
                    to{' '}
                    <span className="liquid-gradient-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 font-extrabold">
                      N1
                    </span>
                  </span>
                </div>
              </div>
            </h1>

            {/* Traditional Divider with Seasonal Elements */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 my-6 sm:my-8 animate-fade-in stagger-1">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              <span className="text-2xl sm:text-3xl japanese-text text-red-700 dark:text-red-400 animate-bounce">
                {new Date().getMonth() >= 3 && new Date().getMonth() <= 5
                  ? '🌸'
                  : new Date().getMonth() >= 6 && new Date().getMonth() <= 8
                    ? '🎋'
                    : new Date().getMonth() >= 9 && new Date().getMonth() <= 11
                      ? '🍁'
                      : '❄️'}
              </span>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
            </div>
          </div>

          {/* Description with Enhanced Japanese Style */}
          <div className="animate-fade-in stagger-2 mb-12">
            <div className="max-w-4xl mx-auto relative px-4">
              <div className="relative p-6 sm:p-8 rounded-3xl bg-white/50 dark:bg-black/30 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-2xl liquid-morph hover:scale-[1.02] transition-transform duration-300">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  Begin your{' '}
                  <span className="font-bold text-red-700 dark:text-red-400 japanese-text">
                    武道
                  </span>{' '}
                  (budō) journey with{' '}
                  <span className="liquid-gradient-text bg-gradient-to-r from-red-600 to-amber-600 dark:from-red-400 dark:to-amber-400 font-bold">
                    AI-powered personalized learning
                  </span>
                  , traditional teaching methods, and immersive cultural experiences.
                </p>

                {/* Decorative Pattern Overlay */}
                <div className="absolute top-0 right-0 text-6xl japanese-text text-red-800/10 dark:text-red-400/10 pointer-events-none select-none">
                  桜
                </div>
                <div className="absolute bottom-0 left-0 text-6xl japanese-text text-amber-800/10 dark:text-amber-400/10 pointer-events-none select-none">
                  鶴
                </div>
              </div>
            </div>
          </div>

          {/* CTAs with Enhanced Japanese Style */}
          <div className="animate-fade-in stagger-3 mb-16 px-4">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
              {/* Primary CTA */}
              <Link
                href="/dashboard"
                className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold text-white rounded-full overflow-hidden transition-all duration-500 hover:scale-105 w-full sm:w-auto liquid-button shadow-2xl transform hover:rotate-1"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 liquid-morph-fast"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center gap-3">
                  <span className="text-2xl">⛩️</span>
                  <span>Begin Your Journey</span>
                  <span className="text-2xl japanese-text">道</span>
                </div>
              </Link>

              {/* Secondary CTA */}
              <Link
                href="/demo"
                className="group relative inline-flex items-center justify-center px-8 sm:px-12 py-4 sm:py-5 text-lg sm:text-xl font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 w-full sm:w-auto shadow-2xl liquid-button-outline transform hover:-rotate-1"
              >
                <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-xl"></div>
                <div className="absolute inset-0 border-4 border-red-700 dark:border-red-400 rounded-full liquid-morph-fast"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <span className="relative text-red-900 dark:text-red-300 group-hover:text-white transition-colors duration-500 flex items-center gap-3">
                  <span className="text-2xl">🎋</span>
                  <span>Explore Demo</span>
                  <span className="text-2xl">🎋</span>
                </span>
              </Link>
            </div>
          </div>

          {/* Stats with Enhanced Japanese Style */}
          <div className="animate-fade-in stagger-4 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Stat 1 */}
              <div className="group relative liquid-card">
                <div className="relative p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-red-600/40 overflow-hidden group-hover:rotate-1">
                  <div className="absolute top-0 right-0 text-9xl japanese-text text-red-800/5 dark:text-red-400/5 pointer-events-none select-none font-black">
                    五
                  </div>
                  <div className="relative">
                    <div className="text-5xl sm:text-6xl md:text-7xl font-black liquid-gradient-text bg-gradient-to-br from-red-700 via-orange-600 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 mb-3 animate-number-count">
                      5
                    </div>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                      JLPT Levels
                    </div>
                    <div className="text-2xl japanese-text text-red-700/50 dark:text-red-400/50 mt-2">
                      五段階
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="group relative liquid-card">
                <div className="relative p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-amber-800/20 dark:border-amber-400/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-amber-600/40 overflow-hidden group-hover:-rotate-1">
                  <div className="absolute top-0 right-0 text-9xl japanese-text text-amber-800/5 dark:text-amber-400/5 pointer-events-none select-none font-black">
                    千
                  </div>
                  <div className="relative">
                    <div
                      className="text-5xl sm:text-6xl md:text-7xl font-black liquid-gradient-text bg-gradient-to-br from-amber-700 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 mb-3 animate-number-count"
                      style={{ animationDelay: '0.3s' }}
                    >
                      1K+
                    </div>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                      Vocabulary
                    </div>
                    <div className="text-2xl japanese-text text-amber-700/50 dark:text-amber-400/50 mt-2">
                      語彙
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="group relative liquid-card">
                <div className="relative p-6 sm:p-8 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-orange-800/20 dark:border-orange-400/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-orange-600/40 overflow-hidden group-hover:rotate-1">
                  <div className="absolute top-0 right-0 text-9xl japanese-text text-orange-800/5 dark:text-orange-400/5 pointer-events-none select-none font-black">
                    智
                  </div>
                  <div className="relative">
                    <div
                      className="text-5xl sm:text-6xl md:text-7xl font-black liquid-gradient-text bg-gradient-to-br from-orange-700 via-red-600 to-amber-600 dark:from-orange-400 dark:via-red-400 dark:to-amber-400 mb-3 animate-number-count"
                      style={{ animationDelay: '0.6s' }}
                    >
                      AI
                    </div>
                    <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                      Powered
                    </div>
                    <div className="text-2xl japanese-text text-orange-700/50 dark:text-orange-400/50 mt-2">
                      人工知能
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator with Enhanced Japanese Style */}
          <div className="mt-16 sm:mt-20 animate-fade-in stagger-5">
            <div className="flex flex-col items-center gap-3 sm:gap-4">
              <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest japanese-text">
                {isMobile ? '下へ' : 'Scroll to Discover'}
              </p>
              <div className="relative group cursor-pointer">
                <div className="w-8 h-14 border-3 border-red-700 dark:border-red-400 rounded-full flex items-start justify-center p-2 group-hover:scale-110 transition-transform">
                  <div className="w-2 h-4 bg-red-700 dark:bg-red-400 rounded-full animate-bounce liquid-morph"></div>
                </div>
                <div className="absolute -inset-2 border-2 border-red-700/20 dark:border-red-400/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-xl sm:text-2xl japanese-text text-red-700 dark:text-red-400 animate-bounce-slow">
                ↓
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade with Liquid Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none liquid-fade"></div>
    </section>
  )
}
