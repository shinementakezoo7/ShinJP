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
  const navBlur = useTransform(scrollY, [0, 100], [10, 20])
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.9])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
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
      style={{ opacity: navOpacity }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'py-2 shadow-2xl shadow-red-900/20 dark:shadow-red-500/10' : 'py-4 shadow-xl'
      }`}
    >
      {/* Glassmorphism Background with Enhanced Blur */}
      <motion.div
        style={{ backdropFilter: `blur(${navBlur}px)` }}
        className="absolute inset-0 bg-gradient-to-br from-white/80 via-red-50/70 to-orange-50/60 dark:from-gray-900/90 dark:via-red-950/80 dark:to-orange-950/70 border-b-2 border-red-200/50 dark:border-red-800/30"
      />

      {/* Animated Wave Pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="nav-wave"
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
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: 'reverse',
                }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#nav-wave)" />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo with 3D Effect */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              style={{ scale: logoScale }}
              className="relative"
              whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
              transition={{ duration: 0.5 }}
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
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  侍
                </motion.span>
                {/* Glow effect */}
                <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full animate-pulse" />
              </div>
            </motion.div>

            {/* Brand Name with Perspective */}
            <div className="hidden md:block">
              <motion.div
                className="text-xl font-black text-gray-900 dark:text-white tracking-tight"
                whileHover={{ x: 5 }}
              >
                Shinmen Takezo
              </motion.div>
              <motion.div
                className="text-xs text-gray-600 dark:text-gray-400 japanese-text tracking-wider"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                新免武蔵 • 日本語学習
              </motion.div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {menuItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={item.href}>
                  <motion.div
                    className="relative px-4 py-2 rounded-xl overflow-hidden group cursor-pointer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* 3D Background Layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-orange-500/10 dark:from-red-500/20 dark:to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-amber-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Content */}
                    <div className="relative flex items-center gap-2">
                      <motion.span
                        className="block"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
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
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs japanese-text text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400">
                        {item.kanji}
                      </span>
                    </div>

                    {/* Bottom bar animation */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 to-amber-600"
                      initial={{ width: '0%' }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center gap-3">
            {/* Theme and Font Controls */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="hidden sm:flex items-center gap-2">
                <ThemeToggle />
                <FontSizeControl />
              </div>
            </motion.div>

            {/* CTA Button with 3D Effect */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/dashboard">
                <motion.div
                  className="relative px-6 py-2 rounded-full overflow-hidden group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* 3D Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-600 to-amber-600" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />

                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                  />

                  {/* Content */}
                  <div className="relative flex items-center gap-2 text-white font-bold text-sm">
                    <span className="hidden sm:inline">Dashboard</span>
                    <motion.img
                      src="/icons/torii.svg"
                      alt="Torii"
                      className="w-4 h-4 opacity-90"
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                    />
                  </div>
                </motion.div>
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <motion.button
              className="lg:hidden p-2 rounded-lg bg-red-100 dark:bg-red-900/30"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
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
        transition={{ duration: 0.3 }}
        className="lg:hidden overflow-hidden"
      >
        <div className="relative px-4 pb-4 pt-4 space-y-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-t border-red-200/50 dark:border-red-800/30">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isMenuOpen ? 1 : 0, x: isMenuOpen ? 0 : -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={item.href} onClick={() => setIsMenuOpen(false)}>
                <motion.div
                  className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 hover:from-red-100 hover:to-orange-100 dark:hover:from-red-900/50 dark:hover:to-orange-900/50 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  {item.icon?.endsWith('.svg') ? (
                    <img
                      src={item.icon}
                      alt={`${item.label} icon`}
                      className="w-6 h-6 opacity-90"
                    />
                  ) : (
                    <span className="text-2xl">{String(item.icon ?? '')}</span>
                  )}
                  <span className="flex-1 font-bold text-gray-900 dark:text-white">
                    {item.label}
                  </span>
                  <span className="text-lg japanese-text text-red-600 dark:text-red-400">
                    {item.kanji}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Animated Bottom Border */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-600 via-orange-500 to-amber-600"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
    </motion.header>
  )
}
