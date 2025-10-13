'use client'

import Link from 'next/link'
import JapaneseLiquidHero from '@/components/hero/JapaneseLiquidHero'
import FontSizeControl from '@/components/theme/FontSizeControl'
import ThemeToggle from '@/components/theme/ThemeToggle'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Enhanced Compact Japanese-Themed Navbar */}
      <header className="navbar-liquid-enhanced sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo with Japanese Style */}
            <Link href="/" className="navbar-logo-enhanced flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <span className="japanese-text text-2xl sm:text-3xl text-red-700 dark:text-red-400 liquid-text-morph relative z-10">
                  侍
                </span>
                <div className="absolute inset-0 bg-red-600/20 blur-lg rounded-full animate-pulse-slow"></div>
              </div>
              <div className="hidden sm:block">
                <div className="text-lg sm:text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  Shinmen Takezo
                </div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400 japanese-text tracking-wider">
                  新免武蔵 • 日本語学習
                </div>
              </div>
              <span className="sm:hidden text-base font-bold text-gray-900 dark:text-white">
                侍
              </span>
            </Link>

            {/* Right Side Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="navbar-controls-wrapper">
                <ThemeToggle />
                <FontSizeControl />
              </div>
              <Link
                href="/ssw"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                <span className="hidden sm:inline">SSW</span>
                <span className="sm:hidden">特</span>
              </Link>
              <Link
                href="/showcase"
                className="px-3 py-1.5 text-xs sm:text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
              >
                UI Showcase
              </Link>
              <Link
                href="/dashboard"
                className="navbar-cta-button group relative inline-flex items-center px-4 sm:px-6 py-1.5 sm:py-2 text-xs sm:text-sm font-bold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-600 to-amber-600"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative text-white flex items-center gap-1.5 sm:gap-2">
                  <span className="hidden sm:inline">Dashboard</span>
                  <span className="sm:hidden">道</span>
                  <span className="text-sm">⛩️</span>
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Animated bottom border */}
        <div className="navbar-border-animation"></div>
      </header>

      {/* Japanese Liquid Hero Section */}
      <main>
        <JapaneseLiquidHero />

        {/* Enhanced Features Section with Japanese Theme */}
        <section className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          {/* Traditional Wave Background Pattern */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern
                  id="features-wave"
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
                    <path d="M35,35 Q52.5,15 70,35 T105,35" />
                  </g>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#features-wave)" />
            </svg>
          </div>

          {/* Decorative Torii Gate */}
          <div className="absolute top-10 right-10 text-8xl opacity-5 dark:opacity-10 pointer-events-none animate-pulse-slow">
            ⛩️
          </div>

          <div className="max-w-7xl mx-auto relative z-10">
            {/* Section Header with Japanese Style */}
            <div className="text-center mb-16 animate-fade-in">
              <div className="inline-block relative mb-6">
                <div className="text-8xl sm:text-9xl font-black japanese-text text-red-800/5 dark:text-red-400/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                  特
                </div>
                <h2 className="relative text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Why Choose{' '}
                  <span className="japanese-text text-red-600 dark:text-red-400">侍</span>{' '}
                  <span className="gradient-text bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 dark:from-red-400 dark:via-pink-400 dark:to-purple-400">
                    Shinmen Takezo
                  </span>
                </h2>
              </div>

              {/* Japanese Divider */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
                <span className="text-2xl sm:text-3xl">🌸</span>
                <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              </div>

              <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium">
                Experience the future of{' '}
                <span className="japanese-text text-red-600 dark:text-red-400 font-bold">
                  日本語
                </span>{' '}
                learning
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 - AI Learning */}
              <div className="group relative animate-fade-in">
                <div className="relative rounded-3xl overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-red-600/40 p-8 h-full">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 pointer-events-none opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <pattern
                        id="feat1-pattern"
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
                      <rect width="100%" height="100%" fill="url(#feat1-pattern)" />
                    </svg>
                  </div>

                  {/* Kanji Decoration */}
                  <div className="absolute top-4 right-4 text-8xl japanese-text text-red-800/5 dark:text-red-400/5 pointer-events-none select-none font-black">
                    智
                  </div>

                  {/* Icon Badge */}
                  <div className="relative flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 dark:from-red-400 dark:to-pink-500 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-4xl">🤖</span>
                    </div>
                  </div>

                  <div className="relative">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                      <span className="japanese-text text-red-600 dark:text-red-400">AI</span>{' '}
                      Powered Learning
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                      Personalized content generation and intelligent tutoring powered by advanced{' '}
                      <span className="font-bold text-red-600 dark:text-red-400">NVIDIA</span> and{' '}
                      <span className="font-bold text-red-600 dark:text-red-400">OpenAI</span>{' '}
                      models.
                    </p>
                  </div>

                  {/* Decorative Sakura */}
                  <div className="absolute -bottom-2 -right-2 text-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rotate-12 group-hover:rotate-0 transform transition-transform">
                    🌸
                  </div>
                </div>
              </div>

              {/* Feature 2 - Spaced Repetition */}
              <div className="group relative animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="relative rounded-3xl overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-amber-800/20 dark:border-amber-400/20 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-amber-600/40 p-8 h-full">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 pointer-events-none opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <pattern
                        id="feat2-pattern"
                        x="0"
                        y="0"
                        width="100"
                        height="86.6"
                        patternUnits="userSpaceOnUse"
                      >
                        <g
                          stroke="currentColor"
                          strokeWidth="1"
                          fill="none"
                          className="text-amber-800 dark:text-amber-400"
                        >
                          <path d="M50,0 L75,43.3 L50,86.6 L25,43.3 Z" />
                        </g>
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#feat2-pattern)" />
                    </svg>
                  </div>

                  {/* Kanji Decoration */}
                  <div className="absolute top-4 right-4 text-8xl japanese-text text-amber-800/5 dark:text-amber-400/5 pointer-events-none select-none font-black">
                    記
                  </div>

                  {/* Icon Badge */}
                  <div className="relative flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-4xl">🔄</span>
                    </div>
                  </div>

                  <div className="relative">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                      <span className="japanese-text text-amber-600 dark:text-amber-400">反復</span>{' '}
                      Spaced Repetition
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                      Optimized review scheduling ensures long-term retention of vocabulary and
                      grammar from{' '}
                      <span className="font-bold text-amber-600 dark:text-amber-400">N5 to N1</span>
                      .
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute -bottom-2 -right-2 text-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rotate-12 group-hover:rotate-0 transform transition-transform">
                    🍂
                  </div>
                </div>
              </div>

              {/* Feature 3 - Immersive Practice */}
              <div className="group relative animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <div className="relative rounded-3xl overflow-hidden bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-purple-800/20 dark:border-purple-400/20 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-purple-600/40 p-8 h-full">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 pointer-events-none opacity-5">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <pattern
                        id="feat3-pattern"
                        x="0"
                        y="0"
                        width="100"
                        height="100"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle
                          cx="50"
                          cy="50"
                          r="35"
                          stroke="currentColor"
                          strokeWidth="1"
                          fill="none"
                          className="text-purple-800 dark:text-purple-400"
                        />
                        <circle
                          cx="0"
                          cy="50"
                          r="35"
                          stroke="currentColor"
                          strokeWidth="1"
                          fill="none"
                          className="text-purple-800 dark:text-purple-400"
                        />
                      </pattern>
                      <rect width="100%" height="100%" fill="url(#feat3-pattern)" />
                    </svg>
                  </div>

                  {/* Kanji Decoration */}
                  <div className="absolute top-4 right-4 text-8xl japanese-text text-purple-800/5 dark:text-purple-400/5 pointer-events-none select-none font-black">
                    練
                  </div>

                  {/* Icon Badge */}
                  <div className="relative flex justify-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500 rounded-2xl shadow-xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-4xl">🎮</span>
                    </div>
                  </div>

                  <div className="relative">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                      <span className="japanese-text text-purple-600 dark:text-purple-400">
                        没入
                      </span>{' '}
                      Immersive Practice
                    </h3>
                    <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 text-center leading-relaxed">
                      Interactive exercises, real conversations, and{' '}
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        gamified
                      </span>{' '}
                      experiences make learning enjoyable and effective.
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div className="absolute -bottom-2 -right-2 text-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 rotate-12 group-hover:rotate-0 transform transition-transform">
                    🎋
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enhanced Japanese-Themed Footer */}
      <footer className="mt-24 relative overflow-hidden">
        {/* Background with Traditional Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-orange-950 dark:from-gray-950 dark:via-red-950/50 dark:to-orange-950/50"></div>

        {/* Seigaiha Wave Pattern Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.05]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="footer-wave"
                x="0"
                y="0"
                width="140"
                height="70"
                patternUnits="userSpaceOnUse"
              >
                <g stroke="currentColor" strokeWidth="2" fill="none" className="text-red-400">
                  <path d="M0,35 Q17.5,15 35,35 T70,35" />
                  <path d="M35,35 Q52.5,15 70,35 T105,35" />
                  <path d="M70,35 Q87.5,15 105,35 T140,35" />
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#footer-wave)" />
          </svg>
        </div>

        {/* Decorative Torii Gates */}
        <div className="absolute top-0 left-10 text-9xl opacity-5 pointer-events-none">⛩️</div>
        <div className="absolute bottom-10 right-10 text-9xl opacity-5 pointer-events-none">⛩️</div>

        {/* Floating Sakura Petals */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-sakura-float"
              style={{
                left: `${i * 20}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + i * 3}s`,
                top: '-50px',
              }}
            >
              <div className="text-3xl opacity-10">🌸</div>
            </div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo Section */}
            <div className="mb-8 animate-fade-in">
              <div className="inline-block relative">
                <div className="text-9xl font-black japanese-text text-red-800/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
                  道
                </div>
                <h3 className="relative text-3xl sm:text-4xl font-bold text-white mb-2">
                  <span className="japanese-text text-5xl sm:text-6xl text-red-400 drop-shadow-lg">
                    侍
                  </span>{' '}
                  <span className="gradient-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400">
                    Shinmen Takezo
                  </span>
                </h3>
              </div>

              {/* Japanese Divider */}
              <div className="flex items-center justify-center gap-4 my-6">
                <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
                <span className="text-2xl">🌸</span>
                <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-400 to-transparent"></div>
              </div>

              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium">
                Empowering learners on their{' '}
                <span className="japanese-text text-red-400 font-bold">道</span> to Japanese mastery
                through <span className="text-red-400 font-bold">AI-driven</span> innovation
              </p>
            </div>

            {/* Navigation Links */}
            <div
              className="flex flex-wrap justify-center gap-6 sm:gap-8 mb-10 animate-fade-in"
              style={{ animationDelay: '0.2s' }}
            >
              <Link
                href="/dashboard"
                className="group relative text-gray-300 hover:text-red-400 transition-all duration-300 font-medium text-base sm:text-lg"
              >
                <span className="relative z-10">Dashboard</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/ssw"
                className="group relative text-gray-300 hover:text-red-400 transition-all duration-300 font-medium text-base sm:text-lg"
              >
                <span className="relative z-10">SSW Program</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/demo"
                className="group relative text-gray-300 hover:text-red-400 transition-all duration-300 font-medium text-base sm:text-lg"
              >
                <span className="relative z-10">Demo</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/showcase"
                className="group relative text-gray-300 hover:text-red-400 transition-all duration-300 font-medium text-base sm:text-lg"
              >
                <span className="relative z-10">UI Showcase</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/about"
                className="group relative text-gray-300 hover:text-red-400 transition-all duration-300 font-medium text-base sm:text-lg"
              >
                <span className="relative z-10">About</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="/contact"
                className="group relative text-gray-300 hover:text-red-400 transition-all duration-300 font-medium text-base sm:text-lg"
              >
                <span className="relative z-10">Contact</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-400 to-pink-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            {/* Copyright Section */}
            <div
              className="border-t border-red-800/30 pt-8 animate-fade-in"
              style={{ animationDelay: '0.4s' }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
                <p className="text-sm text-gray-400">
                  © 2025 <span className="japanese-text text-red-400">侍</span> Shinmen Takezo. All
                  rights reserved.
                </p>
                <span className="hidden sm:block text-gray-600">•</span>
                <p className="text-sm text-gray-400 japanese-text">すべての権利予約</p>
              </div>

              <p className="text-xs text-gray-500 mt-3 flex items-center justify-center gap-2 flex-wrap">
                <span>Built with</span>
                <span className="text-red-400 font-bold">Next.js</span>
                <span>•</span>
                <span className="text-red-400 font-bold">React</span>
                <span>•</span>
                <span>Powered by</span>
                <span className="text-red-400 font-bold">NVIDIA AI</span>
              </p>

              {/* Decorative Elements */}
              <div className="mt-6 flex items-center justify-center gap-4 text-2xl">
                <span className="opacity-30 animate-bounce-slow">🌸</span>
                <span className="opacity-30 animate-bounce-slow" style={{ animationDelay: '0.5s' }}>
                  ⛩️
                </span>
                <span className="opacity-30 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                  🍂
                </span>
                <span className="opacity-30 animate-bounce-slow" style={{ animationDelay: '1.5s' }}>
                  🎋
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
