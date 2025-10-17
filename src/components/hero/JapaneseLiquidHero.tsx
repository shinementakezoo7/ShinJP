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
  const [reducedMotion, setReducedMotion] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Check if mobile device
  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handleReduced = () => setReducedMotion(media.matches)
    handleReduced()
    media.addEventListener('change', handleReduced)

    return () => {
      window.removeEventListener('resize', checkMobile)
      media.removeEventListener('change', handleReduced)
    }
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
  const koiFish = mounted
    ? reducedMotion
      ? []
      : allKoiFish.slice(0, isMobile ? 3 : 5)
    : allKoiFish

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
  const sparkles = mounted
    ? reducedMotion
      ? []
      : allSparkles.slice(0, isMobile ? 15 : 25)
    : allSparkles

  return (
    <section
      ref={liquidRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20 transition-colors duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Koi Fish Background Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
      <div
        className="absolute bottom-0 left-0 right-0 h-96 pointer-events-none overflow-hidden"
        aria-hidden="true"
      >
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
      <div className="absolute top-10 right-10 pointer-events-none" aria-hidden="true">
        <div className="opacity-5 dark:opacity-10 transform rotate-12 animate-pulse-slow">
          <img src="/icons/torii.svg" alt="Torii" className="w-16 h-16 sm:w-20 sm:h-20" />
        </div>
      </div>

      {/* Enhanced Floating Sakura Petals with Variety */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {(!reducedMotion ? [...Array(isMobile ? 10 : 18)] : []).map((_, i) => (
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
              {i % 3 === 0 ? (
                <img src="/icons/sakura.svg" alt="Sakura" className="w-6 h-6 opacity-70" />
              ) : i % 3 === 1 ? (
                <img src="/icons/leaf.svg" alt="Leaf" className="w-6 h-6 opacity-70" />
              ) : (
                <img src="/icons/sakura.svg" alt="Flower" className="w-6 h-6 opacity-70" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Animated Lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {!isMobile &&
          !reducedMotion &&
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
              <div className="opacity-30 dark:opacity-20 drop-shadow-xl">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                  <rect
                    x="7"
                    y="4"
                    width="10"
                    height="16"
                    rx="5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M7 8h10M7 16h10" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M12 20v2" stroke="currentColor" strokeWidth="1.2" />
                </svg>
              </div>
            </div>
          ))}
      </div>

      {/* Ambient Sparkles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6">
              <div className="flex flex-col items-center gap-6">
                {/* Enhanced Japanese Text with Liquid Effect and Calligraphy */}
                <div className="relative inline-block group cursor-pointer">
                  <span className="japanese-text text-red-800 dark:text-red-400 block liquid-text-morph text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-black drop-shadow-2xl group-hover:scale-110 transition-all duration-500 ease-out brush-stroke select-none">
                    侍
                  </span>
                  {/* Multi-layered glow effects for depth */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 opacity-30 blur-3xl animate-pulse-slow"></div>
                  <div
                    className="absolute -inset-8 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 opacity-20 blur-[80px] animate-pulse"
                    style={{ animationDelay: '1s' }}
                  ></div>
                  <div
                    className="absolute -inset-10 bg-gradient-to-r from-amber-400 via-red-400 to-orange-400 opacity-15 blur-[100px] animate-pulse"
                    style={{ animationDelay: '2s' }}
                  ></div>
                  {/* Subtle animated ring */}
                  <div
                    className="absolute inset-0 rounded-full border-4 border-red-600/10 dark:border-red-400/10 animate-ping"
                    style={{ animationDuration: '3s' }}
                  ></div>
                </div>

                {/* Main Title with improved spacing */}
                <div className="relative space-y-2">
                  <span className="block text-gray-900 dark:text-white text-center leading-tight">
                    <span className="block sm:inline">Master </span>
                    <span className="relative inline-block group/text">
                      <span className="liquid-gradient-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 group-hover/text:scale-105 transition-transform duration-300 inline-block">
                        Japanese
                      </span>
                      <div className="absolute -inset-3 bg-gradient-to-r from-red-500/30 to-amber-500/30 blur-2xl animate-pulse-slow -z-10"></div>
                      {/* Underline effect */}
                      <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 rounded-full opacity-50 blur-sm"></div>
                    </span>
                  </span>
                </div>

                {/* Subtitle with Wave Effect and better hierarchy */}
                <div className="relative mt-2">
                  <span className="block text-gray-800 dark:text-gray-100 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center leading-tight">
                    <span className="text-gray-600 dark:text-gray-400 font-semibold">from </span>
                    <span className="relative inline-block group/n5 mx-2">
                      <span className="liquid-gradient-text bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 font-extrabold group-hover/n5:scale-110 transition-transform duration-300 inline-block">
                        N5
                      </span>
                      <div className="absolute -inset-2 bg-amber-500/20 blur-xl group-hover/n5:bg-amber-500/30 transition-colors duration-300 -z-10"></div>
                    </span>
                    <span className="text-gray-600 dark:text-gray-400 font-semibold"> to </span>
                    <span className="relative inline-block group/n1 mx-2">
                      <span className="liquid-gradient-text bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 font-extrabold group-hover/n1:scale-110 transition-transform duration-300 inline-block">
                        N1
                      </span>
                      <div className="absolute -inset-2 bg-red-500/20 blur-xl group-hover/n1:bg-red-500/30 transition-colors duration-300 -z-10"></div>
                    </span>
                  </span>
                </div>
              </div>
            </h1>

            {/* Traditional Divider with Seasonal Elements - Enhanced */}
            <div className="flex items-center justify-center gap-3 sm:gap-6 my-8 sm:my-10 animate-fade-in stagger-1">
              <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent via-red-600 dark:via-red-400 to-transparent"></div>
              <span className="text-2xl sm:text-3xl japanese-text text-red-700 dark:text-red-400 animate-bounce-slow relative">
                {new Date().getMonth() >= 3 && new Date().getMonth() <= 5 ? (
                  <img
                    src="/icons/sakura.svg"
                    alt="Sakura"
                    className="w-8 h-8 sm:w-10 sm:h-10 inline drop-shadow-lg hover:scale-125 transition-transform duration-300"
                  />
                ) : new Date().getMonth() >= 6 && new Date().getMonth() <= 8 ? (
                  <img
                    src="/icons/leaf.svg"
                    alt="Bamboo"
                    className="w-8 h-8 sm:w-10 sm:h-10 inline drop-shadow-lg hover:scale-125 transition-transform duration-300"
                  />
                ) : new Date().getMonth() >= 9 && new Date().getMonth() <= 11 ? (
                  <img
                    src="/icons/leaf.svg"
                    alt="Maple"
                    className="w-8 h-8 sm:w-10 sm:h-10 inline drop-shadow-lg hover:scale-125 transition-transform duration-300"
                  />
                ) : (
                  <img
                    src="/icons/sakura.svg"
                    alt="Snowflake"
                    className="w-8 h-8 sm:w-10 sm:h-10 inline drop-shadow-lg hover:scale-125 transition-transform duration-300"
                  />
                )}
                <div className="absolute -inset-2 bg-red-500/20 blur-xl rounded-full -z-10"></div>
              </span>
              <div className="h-px w-20 sm:w-32 bg-gradient-to-r from-transparent via-red-600 dark:via-red-400 to-transparent"></div>
            </div>
          </div>

          {/* Description with Enhanced Japanese Style */}
          <div className="animate-fade-in stagger-2 mb-12">
            <div className="max-w-4xl mx-auto relative px-4">
              <div className="relative p-8 sm:p-10 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-2xl liquid-morph hover:scale-[1.02] hover:border-red-600/40 dark:hover:border-red-400/40 transition-all duration-500 group/desc overflow-hidden">
                {/* Animated gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-orange-500/5 to-amber-500/5 opacity-0 group-hover/desc:opacity-100 transition-opacity duration-500"></div>

                <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium relative z-10 text-center">
                  Begin your{' '}
                  <span className="font-bold text-red-700 dark:text-red-400 japanese-text relative inline-block group/budo">
                    武道
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-700 dark:bg-red-400 scale-x-0 group-hover/budo:scale-x-100 transition-transform duration-300"></span>
                  </span>{' '}
                  <span className="text-gray-600 dark:text-gray-400 text-base sm:text-lg">
                    (budō)
                  </span>{' '}
                  journey with{' '}
                  <span className="liquid-gradient-text bg-gradient-to-r from-red-600 to-amber-600 dark:from-red-400 dark:to-amber-400 font-extrabold relative inline-block group/ai">
                    AI-powered personalized learning
                    <span className="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-amber-500/20 blur-lg -z-10 group-hover/ai:blur-xl group-hover/ai:scale-110 transition-all duration-300 block"></span>
                  </span>
                  , traditional teaching methods, and{' '}
                  <span className="font-bold text-orange-600 dark:text-orange-400">
                    immersive cultural experiences
                  </span>
                  .
                </div>

                {/* Decorative Pattern Overlay - Enhanced */}
                <div className="absolute top-4 right-4 text-7xl sm:text-8xl japanese-text text-red-800/8 dark:text-red-400/8 pointer-events-none select-none transition-all duration-500 group-hover/desc:scale-110 group-hover/desc:rotate-12">
                  桜
                </div>
                <div className="absolute bottom-4 left-4 text-7xl sm:text-8xl japanese-text text-amber-800/8 dark:text-amber-400/8 pointer-events-none select-none transition-all duration-500 group-hover/desc:scale-110 group-hover/desc:-rotate-12">
                  鶴
                </div>

                {/* Corner decorative elements */}
                <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-red-600/20 dark:border-red-400/20 rounded-tl-3xl group-hover/desc:border-red-600/40 dark:group-hover/desc:border-red-400/40 transition-colors duration-500"></div>
                <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-amber-600/20 dark:border-amber-400/20 rounded-br-3xl group-hover/desc:border-amber-600/40 dark:group-hover/desc:border-amber-400/40 transition-colors duration-500"></div>
              </div>
            </div>
          </div>

          {/* CTAs with Enhanced Japanese Style */}
          <div className="animate-fade-in stagger-3 mb-16 px-4">
            <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 justify-center items-stretch sm:items-center">
              {/* Primary CTA - Enhanced */}
              <Link
                href="/dashboard"
                aria-label="Begin your Japanese learning journey"
                className="group relative inline-flex items-center justify-center px-10 sm:px-14 py-5 sm:py-6 text-lg sm:text-xl font-bold text-white rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 w-full sm:w-auto liquid-button shadow-2xl transform hover:shadow-red-900/50 dark:hover:shadow-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500/50"
              >
                {/* Animated gradient background */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 liquid-morph-fast"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Ripple effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0 h-0 group-hover:w-full group-hover:h-full bg-white rounded-full transition-all duration-700"></div>
                </div>

                {/* Shimmer effect */}
                <div className="absolute inset-0 -skew-x-12">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>

                {/* Content */}
                <div className="relative flex items-center gap-3 z-10">
                  <span className="text-2xl sm:text-3xl animate-bounce-slow">⛩️</span>
                  <span className="tracking-wide">Begin Your Journey</span>
                  <span className="text-2xl sm:text-3xl japanese-text font-black">道</span>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-500 -z-10"></div>
              </Link>

              {/* Secondary CTA - Enhanced */}
              <Link
                href="/demo"
                aria-label="Explore the demo of our Japanese learning platform"
                className="group relative inline-flex items-center justify-center px-10 sm:px-14 py-5 sm:py-6 text-lg sm:text-xl font-bold rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95 w-full sm:w-auto shadow-2xl liquid-button-outline transform hover:shadow-red-900/30 dark:hover:shadow-red-500/30 focus:outline-none focus:ring-4 focus:ring-red-500/30"
              >
                {/* Glass background */}
                <div className="absolute inset-0 bg-white/80 dark:bg-black/60 backdrop-blur-2xl"></div>

                {/* Animated border */}
                <div className="absolute inset-0 border-4 border-red-700 dark:border-red-400 rounded-full group-hover:border-orange-600 dark:group-hover:border-orange-400 transition-colors duration-500"></div>

                {/* Gradient fill on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-600 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Sweep effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                {/* Content */}
                <span className="relative text-red-900 dark:text-red-300 group-hover:text-white transition-colors duration-500 flex items-center gap-3 z-10">
                  <img
                    src="/icons/leaf.svg"
                    alt="Leaf"
                    className="w-6 h-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                  <span className="tracking-wide">Explore Demo</span>
                  <img
                    src="/icons/leaf.svg"
                    alt="Leaf"
                    className="w-6 h-6 opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                  />
                </span>

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-amber-600 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500 -z-10"></div>
              </Link>
            </div>

            {/* Micro copy under CTAs */}
            <div className="mt-6 text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                ✨ Free trial available • No credit card required
              </p>
            </div>
          </div>

          {/* Stats with Enhanced Japanese Style */}
          <div className="animate-fade-in stagger-4 px-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {/* Stat 1 - 5 JLPT Levels */}
              <div className="group relative liquid-card cursor-pointer">
                <div className="relative p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-black/50 backdrop-blur-2xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-red-600/50 dark:group-hover:border-red-400/50 overflow-hidden group-hover:-rotate-1 group-hover:shadow-2xl group-hover:shadow-red-900/20 dark:group-hover:shadow-red-500/20">
                  {/* Background kanji - Enhanced */}
                  <div className="absolute top-2 right-2 text-[8rem] sm:text-[10rem] japanese-text text-red-800/5 dark:text-red-400/5 pointer-events-none select-none font-black transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    五
                  </div>

                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    {/* Number with enhanced animation */}
                    <div className="text-6xl sm:text-7xl md:text-8xl font-black liquid-gradient-text bg-gradient-to-br from-red-700 via-orange-600 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 mb-4 animate-number-count group-hover:scale-110 transition-transform duration-300">
                      5
                    </div>

                    {/* Label */}
                    <div className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors duration-300">
                      JLPT Levels
                    </div>

                    {/* Japanese text */}
                    <div className="text-2xl sm:text-3xl japanese-text text-red-700/60 dark:text-red-400/60 mt-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors duration-300">
                      五段階
                    </div>

                    {/* Progress bar decoration */}
                    <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 to-orange-600 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat 2 - 1K+ Vocabulary */}
              <div className="group relative liquid-card cursor-pointer">
                <div className="relative p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-black/50 backdrop-blur-2xl border-2 border-amber-800/20 dark:border-amber-400/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-amber-600/50 dark:group-hover:border-amber-400/50 overflow-hidden group-hover:rotate-1 group-hover:shadow-2xl group-hover:shadow-amber-900/20 dark:group-hover:shadow-amber-500/20">
                  {/* Background kanji - Enhanced */}
                  <div className="absolute top-2 right-2 text-[8rem] sm:text-[10rem] japanese-text text-amber-800/5 dark:text-amber-400/5 pointer-events-none select-none font-black transition-all duration-500 group-hover:scale-110 group-hover:-rotate-12">
                    千
                  </div>

                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    {/* Number with enhanced animation */}
                    <div
                      className="text-6xl sm:text-7xl md:text-8xl font-black liquid-gradient-text bg-gradient-to-br from-amber-700 via-orange-600 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 mb-4 animate-number-count group-hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: '0.15s' }}
                    >
                      1K+
                    </div>

                    {/* Label */}
                    <div className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300">
                      Vocabulary
                    </div>

                    {/* Japanese text */}
                    <div className="text-2xl sm:text-3xl japanese-text text-amber-700/60 dark:text-amber-400/60 mt-2 group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors duration-300">
                      語彙
                    </div>

                    {/* Progress bar decoration */}
                    <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-red-600 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"
                        style={{ transitionDelay: '0.1s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stat 3 - AI Powered */}
              <div className="group relative liquid-card cursor-pointer">
                <div className="relative p-8 sm:p-10 rounded-3xl bg-white/70 dark:bg-black/50 backdrop-blur-2xl border-2 border-orange-800/20 dark:border-orange-400/20 shadow-xl transition-all duration-500 group-hover:scale-105 group-hover:border-orange-600/50 dark:group-hover:border-orange-400/50 overflow-hidden group-hover:-rotate-1 group-hover:shadow-2xl group-hover:shadow-orange-900/20 dark:group-hover:shadow-orange-500/20">
                  {/* Background kanji - Enhanced */}
                  <div className="absolute top-2 right-2 text-[8rem] sm:text-[10rem] japanese-text text-orange-800/5 dark:text-orange-400/5 pointer-events-none select-none font-black transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                    智
                  </div>

                  {/* Animated background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-transparent to-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative z-10">
                    {/* Number with enhanced animation */}
                    <div
                      className="text-6xl sm:text-7xl md:text-8xl font-black liquid-gradient-text bg-gradient-to-br from-orange-700 via-red-600 to-amber-600 dark:from-orange-400 dark:via-red-400 dark:to-amber-400 mb-4 animate-number-count group-hover:scale-110 transition-transform duration-300"
                      style={{ animationDelay: '0.3s' }}
                    >
                      AI
                    </div>

                    {/* Label */}
                    <div className="text-sm sm:text-base font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest mb-2 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors duration-300">
                      Powered
                    </div>

                    {/* Japanese text */}
                    <div className="text-2xl sm:text-3xl japanese-text text-orange-700/60 dark:text-orange-400/60 mt-2 group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors duration-300">
                      人工知能
                    </div>

                    {/* Progress bar decoration */}
                    <div className="mt-4 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-600 to-amber-600 rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out"
                        style={{ transitionDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll Indicator with Enhanced Japanese Style */}
          <div className="mt-16 sm:mt-20 animate-fade-in stagger-5">
            <div className="flex flex-col items-center gap-4 sm:gap-5">
              {/* Scroll text */}
              <p className="text-xs sm:text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-[0.2em] japanese-text">
                {isMobile ? '下へスクロール' : 'Scroll to Discover More'}
              </p>

              {/* Enhanced scroll mouse indicator */}
              <div
                className="relative group cursor-pointer"
                role="button"
                aria-label="Scroll down"
                tabIndex={0}
              >
                {/* Outer animated ring */}
                <div className="absolute -inset-3 border-2 border-red-700/20 dark:border-red-400/20 rounded-full animate-ping opacity-75"></div>
                <div className="absolute -inset-2 border border-red-700/30 dark:border-red-400/30 rounded-full animate-pulse"></div>

                {/* Mouse shape */}
                <div className="relative w-8 h-14 border-3 border-red-700 dark:border-red-400 rounded-full flex items-start justify-center p-2 group-hover:scale-110 group-hover:border-orange-600 dark:group-hover:border-orange-400 transition-all duration-300 bg-white/30 dark:bg-black/30 backdrop-blur-sm">
                  {/* Scrolling dot */}
                  <div className="w-2 h-4 bg-red-700 dark:bg-red-400 rounded-full animate-bounce liquid-morph group-hover:bg-orange-600 dark:group-hover:bg-orange-400 transition-colors duration-300"></div>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-2 bg-gradient-to-b from-red-500/20 to-amber-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </div>

              {/* Animated arrow */}
              <span className="text-2xl sm:text-3xl japanese-text text-red-700 dark:text-red-400 animate-bounce-slow">
                ↓
              </span>

              {/* Small decorative element */}
              <div className="flex items-center gap-2 opacity-50">
                <img
                  src="/icons/sakura.svg"
                  alt=""
                  className="w-4 h-4 animate-pulse-slow"
                  aria-hidden="true"
                />
                <div className="h-px w-12 bg-gradient-to-r from-transparent via-red-600 dark:via-red-400 to-transparent"></div>
                <img
                  src="/icons/sakura.svg"
                  alt=""
                  className="w-4 h-4 animate-pulse-slow"
                  style={{ animationDelay: '1s' }}
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Fade with Liquid Edge */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none liquid-fade"></div>
    </section>
  )
}
