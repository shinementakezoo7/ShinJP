'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import ThemeToggle from '@/components/theme/ThemeToggle'
import FontSizeControl from '@/components/theme/FontSizeControl'

export default function EnhancedNavbar3D() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const { scrollY } = useScroll()

  // Transform navbar based on scroll
  const navOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  const navBlur = useTransform(scrollY, [0, 100], [20, 30])
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85])
  const navHeight = useTransform(scrollY, [0, 100], [80, 60])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '/icons/target.svg', kanji: '道' },
    { href: '/ssw', label: 'SSW', icon: '/icons/book.svg', kanji: '特' },
    { href: '/showcase', label: 'Showcase', icon: '/icons/sakura.svg', kanji: '展' },
    { href: '/demo', label: 'Demo', icon: '/icons/gamepad.svg', kanji: '試' },
  ]

  return (
    <motion.header
      ref={navRef}
      style={{
        opacity: navOpacity,
        height: navHeight,
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'py-2 shadow-2xl shadow-red-900/20 dark:shadow-red-500/10'
          : 'py-4 shadow-xl shadow-red-900/10 dark:shadow-red-500/5'
      }`}
    >
      {/* Enhanced Glassmorphism Background with Dynamic Gradient */}
      <motion.div
        style={{ backdropFilter: `blur(${navBlur}px)` }}
        className="absolute inset-0 bg-gradient-to-br from-white/80 via-red-50/60 to-orange-50/50 dark:from-gray-900/90 dark:via-red-950/70 dark:to-orange-950/60 border-b border-red-200/40 dark:border-red-800/30"
      />

      {/* Enhanced Animated Wave Pattern with Multiple Layers */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="nav-wave-primary"
              x="0"
              y="0"
              width="100"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <motion.path
                d="M0,25 Q25,15 50,25 T100,25"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-red-600 dark:text-red-400"
                animate={{ d: ['M0,25 Q25,15 50,25 T100,25', 'M0,25 Q25,35 50,25 T100,25'] }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                }}
              />
            </pattern>
            <pattern
              id="nav-wave-secondary"
              x="50"
              y="25"
              width="100"
              height="50"
              patternUnits="userSpaceOnUse"
            >
              <motion.path
                d="M0,25 Q25,10 50,25 T100,25"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-orange-500 dark:text-orange-400"
                animate={{ d: ['M0,25 Q25,10 50,25 T100,25', 'M0,25 Q25,40 50,25 T100,25'] }}
                transition={{
                  duration: 5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                  delay: 1,
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nav-wave-primary)" />
          <rect width="100%" height="100%" fill="url(#nav-wave-secondary)" opacity="0.6" />
        </svg>
      </div>

      {/* Floating Sakura Petals */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${15 + i * 25}%`,
              top: '-20px',
            }}
            animate={{
              y: [0, -60, 0],
              rotate: [0, 180, 360],
              opacity: [0, 0.4, 0],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 1.5,
            }}
          >
            <img
              src="/icons/sakura.svg"
              alt="Sakura petal"
              className="w-5 h-5 opacity-40 dark:opacity-30"
            />
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo with 3D Effect */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              style={{ scale: logoScale }}
              className="relative"
              whileHover={{ scale: 1.15, rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.6 }}
            >
              {/* 3D Layered Kanji */}
              <div className="relative">
                <motion.span
                  className="text-4xl japanese-text text-red-700 dark:text-red-400 font-black relative z-10"
                  animate={{
                    textShadow: [
                      '2px 2px 0px rgba(255,0,0,0.3), 4px 4px 0px rgba(255,100,0,0.2)',
                      '3px 3px 0px rgba(255,0,0,0.4), 6px 6px 0px rgba(255,100,0,0.3)',
                      '2px 2px 0px rgba(255,0,0,0.3), 4px 4px 0px rgba(255,100,0,0.2)',
                    ],
                  }}
                  transition={{ duration: 2.5, repeat: Number.POSITIVE_INFINITY }}
                >
                  侍
                </motion.span>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-red-600/30 blur-2xl rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Enhanced Brand Name with Perspective and Glow */}
            <div className="hidden md:block">
              <motion.div
                className="text-xl font-black text-gray-900 dark:text-white tracking-tight relative"
                whileHover={{ x: 10, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                Shinmen Takezo
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-600"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
              <motion.div
                className="text-xs text-gray-600 dark:text-gray-400 japanese-text tracking-wider mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                新免武蔵 • 日本語学習
              </motion.div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-3">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <motion.div
                    className="relative px-5 py-2.5 rounded-2xl overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    {/* Enhanced 3D Background Layer with Multiple Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 dark:from-red-500/30 dark:to-orange-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/30 to-amber-600/30 blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent dark:from-black/30 dark:to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300 rounded-2xl" />

                    {/* Content */}
                    <div className="relative flex items-center gap-2.5">
                      <motion.span
                        className="block"
                        animate={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      >
                        {item.icon?.endsWith('.svg') ? (
                          <img
                            src={item.icon}
                            alt={`${item.label} icon`}
                            className="w-5 h-5 opacity-90"
                          />
                        ) : (
                          <span className="text-lg">{String(item.icon ?? '')}</span>
                        )}
                      </motion.span>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs japanese-text text-gray-600 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-300">
                        {item.kanji}
                      </span>
                    </div>

                    {/* Enhanced Bottom bar animation with pulse effect */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-600"
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400/60 to-amber-400/60"
                      initial={{ width: '0%' }}
                      whileHover={{ width: '85%' }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-4">
            {/* Theme and Font Controls */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="hidden sm:flex items-center gap-2.5">
                <ThemeToggle />
                <FontSizeControl />
              </div>
            </motion.div>

            {/* CTA Button with 3D Effect */}
            <motion.div
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/dashboard">
                <motion.div
                  className="relative px-7 py-2.5 rounded-full overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  {/* 3D Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-600 to-amber-600" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.4 }}
                  />

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{
                      duration: 2.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 1.5,
                    }}
                  />

                  {/* Content */}
                  <div className="relative flex items-center gap-2.5 text-white font-bold text-sm">
                    <span className="hidden sm:inline">Dashboard</span>
                    <motion.img
                      src="/icons/torii.svg"
                      alt="Torii"
                      className="w-4.5 h-4.5 opacity-95"
                      animate={{ rotate: [0, 20, -20, 0] }}
                      transition={{ duration: 1.8, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>

                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 opacity-0 group-hover:opacity-40 blur-lg transition-opacity duration-300 -z-10 rounded-full" />
                </motion.div>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2.5 rounded-xl bg-red-100 dark:bg-red-900/40 shadow-md"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
                {isMenuOpen ? (
                  <span className="text-2xl">✕</span>
                ) : (
                  <span className="text-2xl">☰</span>
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: isMenuOpen ? 1 : 0,
          height: isMenuOpen ? 'auto' : 0,
        }}
        transition={{ duration: 0.4 }}
        className="lg:hidden overflow-hidden"
      >
        <div className="relative px-5 pb-5 pt-5 space-y-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border-t border-red-200/40 dark:border-red-800/20">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -25 }}
              animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -25 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                <motion.div
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/40 dark:to-orange-950/40 hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/60 dark:hover:to-orange-900/60 transition-all duration-300 shadow-lg hover:shadow-xl border border-red-200/30 dark:border-red-800/20"
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ x: 5 }}
                >
                  {item.icon?.endsWith('.svg') ? (
                    <img
                      src={item.icon}
                      alt={`${item.label} icon`}
                      className="w-7 h-7 opacity-90"
                    />
                  ) : (
                    <span className="text-2xl">{String(item.icon ?? '')}</span>
                  )}
                  <span className="flex-1 font-bold text-gray-900 dark:text-white text-lg">
                    {item.label}
                  </span>
                  <span className="text-xl japanese-text text-red-700 dark:text-red-300">
                    {item.kanji}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Enhanced Animated Bottom Border with Multiple Layers */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-400/60 via-orange-400/60 to-amber-400/60"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 0.95 }}
        transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
      />
    </motion.header>
  )
}
