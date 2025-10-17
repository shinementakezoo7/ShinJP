'use client'

import { useState, useEffect, useCallback } from 'react'
import { SSW_SECTORS } from '@/lib/ssw/sectors-data'

export default function SSWHero() {
  const [mounted, setMounted] = useState(false)
  const [currentSector, setCurrentSector] = useState(0)
  const [hoveredSector, setHoveredSector] = useState<number | null>(null)
  const [isAutoRotate, setIsAutoRotate] = useState(true)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    setMounted(true)
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReducedMotion(media.matches)
    handler()
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (!isAutoRotate || reducedMotion) return
    const interval = setInterval(() => {
      setCurrentSector((prev) => (prev + 1) % SSW_SECTORS.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [isAutoRotate, reducedMotion])

  const handlePrev = useCallback(() => {
    setCurrentSector((prev) => (prev - 1 + SSW_SECTORS.length) % SSW_SECTORS.length)
  }, [])

  const handleNext = useCallback(() => {
    setCurrentSector((prev) => (prev + 1) % SSW_SECTORS.length)
  }, [])

  const activeSector =
    hoveredSector !== null ? SSW_SECTORS[hoveredSector] : SSW_SECTORS[currentSector]
  const gradientClass = activeSector.color

  return (
    <section
      className={`relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-br transition-all duration-1000 ${gradientClass.replace('from-', 'from-').replace('to-', 'to-')}/10 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950`}
    >
      {/* Dynamic Liquid Blobs - Sector Colored */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div
          className="absolute w-[600px] h-[600px] rounded-full blur-3xl opacity-20 dark:opacity-15 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${activeSector.color.includes('pink') ? '#ec4899' : activeSector.color.includes('blue') ? '#3b82f6' : activeSector.color.includes('green') ? '#10b981' : activeSector.color.includes('orange') ? '#f97316' : '#6366f1'} 0%, transparent 70%)`,
            top: '5%',
            left: '5%',
            animation: 'float 20s ease-in-out infinite',
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full blur-3xl opacity-20 dark:opacity-15 transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, ${activeSector.color.includes('cyan') ? '#06b6d4' : activeSector.color.includes('amber') ? '#f59e0b' : activeSector.color.includes('purple') ? '#a855f7' : '#0ea5e9'} 0%, transparent 70%)`,
            bottom: '10%',
            right: '5%',
            animation: 'float 25s ease-in-out infinite reverse',
          }}
        />
      </div>

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ssw-wave"
              x="0"
              y="0"
              width="200"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-blue-800 dark:text-blue-400"
              >
                <path d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50" className="animate-wave" />
                <path
                  d="M0,60 Q25,40 50,60 T100,60 T150,60 T200,60"
                  className="animate-wave"
                  style={{ animationDelay: '0.5s' }}
                />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ssw-wave)" />
        </svg>
      </div>

      {/* Floating Sector Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        {SSW_SECTORS.slice(0, 8).map((sector, i) => (
          <div
            key={sector.id}
            className="absolute animate-float-slow opacity-10 dark:opacity-20 transition-opacity duration-1000"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${3 + (i % 3)}rem`,
              opacity: currentSector === i ? 0.3 : 0.1,
            }}
          >
            {sector.icon}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Main Title with Dynamic Sector Background */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-block relative mb-4">
            {/* Animated Sector Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-[10rem] opacity-5 transition-all duration-1000 animate-pulse">
                {activeSector.icon}
              </div>
            </div>
            <div
              className={`absolute inset-0 bg-gradient-to-r ${activeSector.color} opacity-20 blur-3xl rounded-full transition-all duration-1000`}
            ></div>
            <h1 className="relative text-6xl sm:text-7xl md:text-8xl font-black">
              <span className="japanese-text text-blue-600 dark:text-blue-400 drop-shadow-lg">
                特
              </span>
              <span className="japanese-text text-cyan-600 dark:text-cyan-400 drop-shadow-lg">
                定
              </span>
              <span className="japanese-text text-indigo-600 dark:text-indigo-400 drop-shadow-lg">
                技
              </span>
              <span className="japanese-text text-purple-600 dark:text-purple-400 drop-shadow-lg">
                能
              </span>
            </h1>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            <span
              className={`bg-gradient-to-r ${activeSector.color} dark:${activeSector.color} bg-clip-text text-transparent transition-all duration-1000`}
            >
              Specified Skilled Worker
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-2">
            SSW Program Training Hub
          </p>

          {/* Dynamic Sector Display */}
          <div className="mt-4 inline-flex items-center gap-3 px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl transition-all duration-500 relative">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-indigo-500/10 blur-md -z-10" />
            <span className="text-3xl">{activeSector.icon}</span>
            <div className="text-left">
              <div className="text-sm font-bold text-gray-900 dark:text-white">
                {activeSector.name}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 japanese-text">
                {activeSector.nameJP}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <p
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Master workplace Japanese for{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">14 specialized sectors</span>
          .
          <br className="hidden sm:block" />
          From{' '}
          <span className="japanese-text font-bold text-blue-600 dark:text-blue-400">
            介護
          </span> to{' '}
          <span className="japanese-text font-bold text-blue-600 dark:text-blue-400">建設</span> —
          comprehensive training materials designed for SSW success.
        </p>

        {/* Interactive Sector Carousel */}
        <div className="mb-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-4">
            Explore All 14 Sectors
          </h3>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {SSW_SECTORS.map((sector, index) => (
              <button
                key={sector.id}
                onMouseEnter={() => setHoveredSector(index)}
                onMouseLeave={() => setHoveredSector(null)}
                onClick={() => setCurrentSector(index)}
                className={`group relative px-4 py-2 rounded-xl backdrop-blur-xl border-2 transition-all duration-300 hover:scale-110 ${
                  currentSector === index
                    ? 'bg-white/90 dark:bg-gray-800/90 border-blue-400 dark:border-blue-500 shadow-xl'
                    : 'bg-white/60 dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
                aria-label={`Select sector ${sector.name}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{sector.icon}</span>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
                      {sector.name}
                    </div>
                  </div>
                </div>
                {currentSector === index && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Carousel controls for sectors */}
        <div className="flex items-center justify-center gap-3 -mt-4 mb-10">
          <button
            type="button"
            onClick={handlePrev}
            className="px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-sm"
            aria-label="Previous sector"
          >
            ◀ Prev
          </button>
          <button
            type="button"
            onClick={() => setIsAutoRotate((v) => !v)}
            className="px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-sm"
            aria-pressed={!reducedMotion && isAutoRotate}
            aria-label={
              isAutoRotate && !reducedMotion ? 'Pause auto rotation' : 'Play auto rotation'
            }
          >
            {isAutoRotate && !reducedMotion ? '⏸ Pause' : '▶ Play'}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-3 py-2 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-sm"
            aria-label="Next sector"
          >
            Next ▶
          </button>
        </div>

        {/* Enhanced Stats Cards with Animation */}
        <div
          className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="group px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1 group-hover:scale-110 transition-transform">
              14
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Industries</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">特定技能分野</div>
          </div>

          <div className="group px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mb-1 group-hover:scale-110 transition-transform">
              200K+
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              SSW Workers
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">就労者数</div>
          </div>

          <div className="group px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1 group-hover:scale-110 transition-transform">
              N4-N3
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">JLPT Level</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">日本語能力</div>
          </div>

          <div className="group px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1 group-hover:scale-110 transition-transform">
              500+
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pages/Book</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">教材ページ数</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap justify-center gap-4 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <a
            href="#sectors"
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="text-2xl mr-2">🏭</span>
            <span>Explore Sectors</span>
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          <a
            href="/ssw/textbooks"
            className="group relative inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transform hover:scale-105 transition-all duration-300"
          >
            <span className="text-2xl mr-2">📚</span>
            <span>View Textbooks</span>
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-4 text-3xl opacity-30 animate-bounce-slow">
          <span>🌸</span>
          <span>⛩️</span>
          <span>🌸</span>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          className="w-full h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C300,100 600,20 900,60 L900,120 L0,120 Z"
            fill="currentColor"
            className="text-white dark:text-gray-900 opacity-50"
          />
          <path
            d="M0,80 C300,40 600,100 900,80 C1050,70 1125,75 1200,80 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-white dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  )
}
