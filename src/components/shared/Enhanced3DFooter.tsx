'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Enhanced3DFooter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const footerLinks = [
    { href: '/dashboard', label: 'Dashboard', kanji: '道' },
    { href: '/ssw', label: 'SSW Program', kanji: '特' },
    { href: '/demo', label: 'Demo', kanji: '試' },
    { href: '/showcase', label: 'UI Showcase', kanji: '展' },
    { href: '/about', label: 'About', kanji: '概' },
    { href: '/contact', label: 'Contact', kanji: '連' },
  ]

  const socialLinks = [
    { icon: '📧', label: 'Email', href: 'mailto:contact@shinmentakezo.com' },
    { icon: '🐦', label: 'Twitter', href: '#' },
    { icon: '📘', label: 'Facebook', href: '#' },
    { icon: '📸', label: 'Instagram', href: '#' },
  ]

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* 3D Background Layers */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-red-950 to-orange-950 dark:from-gray-950 dark:via-red-950/50 dark:to-orange-950/50" />

        {/* Animated wave pattern */}
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
                <motion.path
                  d="M0,35 Q17.5,15 35,35 T70,35"
                  animate={{ d: ['M0,35 Q17.5,15 35,35 T70,35', 'M0,35 Q17.5,25 35,35 T70,35'] }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: 'reverse',
                  }}
                />
                <motion.path
                  d="M35,35 Q52.5,15 70,35 T105,35"
                  animate={{
                    d: ['M35,35 Q52.5,15 70,35 T105,35', 'M35,35 Q52.5,25 70,35 T105,35'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    repeatType: 'reverse',
                    delay: 0.5,
                  }}
                />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-wave)" />
        </svg>

        {/* Torii gates decoration */}
        <motion.div
          className="absolute top-10 left-10 text-9xl opacity-5 pointer-events-none"
          animate={{ rotate: [0, 5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        >
          ⛩️
        </motion.div>
        <motion.div
          className="absolute bottom-10 right-10 text-9xl opacity-5 pointer-events-none"
          animate={{ rotate: [0, -5, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, delay: 5 }}
        >
          ⛩️
        </motion.div>
      </div>

      {/* Floating sakura petals */}
      {mounted && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl"
              initial={{ x: Math.random() * 100 + '%', y: -50, rotate: 0, opacity: 0.1 }}
              animate={{
                y: '120%',
                rotate: 360,
                opacity: [0.1, 0.2, 0.1],
              }}
              transition={{
                duration: 15 + i * 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 2,
                ease: 'linear',
              }}
            >
              🌸
            </motion.div>
          ))}
        </div>
      )}

      <div className="relative max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        {/* Logo Section with 3D Effect */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-block relative mb-6">
            {/* Giant background kanji */}
            <motion.div
              className="text-9xl font-black japanese-text text-red-800/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            >
              道
            </motion.div>

            {/* Logo */}
            <motion.h3
              className="relative text-4xl sm:text-5xl font-bold text-white mb-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                className="japanese-text text-6xl sm:text-7xl text-red-400 drop-shadow-lg inline-block"
                animate={{
                  textShadow: [
                    '2px 2px 0px rgba(255,0,0,0.5), 4px 4px 0px rgba(255,100,0,0.3)',
                    '3px 3px 0px rgba(255,0,0,0.6), 6px 6px 0px rgba(255,100,0,0.4)',
                    '2px 2px 0px rgba(255,0,0,0.5), 4px 4px 0px rgba(255,100,0,0.3)',
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                侍
              </motion.span>{' '}
              <motion.span
                className="bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: '200% auto' }}
              >
                Shinmen Takezo
              </motion.span>
            </motion.h3>
          </div>

          {/* Divider with animation */}
          <div className="flex items-center justify-center gap-4 my-8">
            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-red-400 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            />
            <motion.span
              animate={{ rotate: [0, 360], scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="text-3xl"
            >
              🌸
            </motion.span>
            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-red-400 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto font-medium"
          >
            Empowering learners on their{' '}
            <span className="japanese-text text-red-400 font-bold">道</span> to Japanese mastery
            through <span className="text-red-400 font-bold">AI-driven</span> innovation
          </motion.p>
        </motion.div>

        {/* Navigation Links with 3D Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
        >
          {footerLinks.map((link, index) => (
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={link.href}>
                <motion.div
                  className="group relative p-4 rounded-xl overflow-hidden cursor-pointer"
                  whileHover={{ scale: 1.05, rotateY: 10 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* 3D Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-red-800/30 to-orange-800/30 backdrop-blur-sm border border-red-600/30" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-600/50 to-orange-600/50 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative text-center">
                    <div className="text-gray-300 group-hover:text-white font-medium text-sm mb-1 transition-colors">
                      {link.label}
                    </div>
                    <div className="text-2xl japanese-text text-red-400 group-hover:text-red-300 transition-colors">
                      {link.kanji}
                    </div>
                  </div>

                  {/* Bottom highlight */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-400 to-amber-400"
                    initial={{ width: '0%' }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-4 mb-10"
        >
          {socialLinks.map((social, index) => (
            <motion.a
              key={social.label}
              href={social.href}
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.2, rotate: 360 }}
              whileTap={{ scale: 0.9 }}
              className="w-12 h-12 rounded-full bg-gradient-to-br from-red-800/50 to-orange-800/50 backdrop-blur-sm border border-red-600/30 flex items-center justify-center text-2xl hover:from-red-600 hover:to-orange-600 transition-all"
            >
              {social.icon}
            </motion.a>
          ))}
        </motion.div>

        {/* Copyright Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="border-t border-red-800/30 pt-8"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-400">
              <motion.p
                whileHover={{ scale: 1.05 }}
                className="hover:text-red-400 transition-colors"
              >
                © 2025 <span className="japanese-text">侍</span> Shinmen Takezo
              </motion.p>
              <span className="hidden sm:block">•</span>
              <p className="japanese-text">すべての権利予約</p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap justify-center">
              <span>Built with</span>
              <motion.span whileHover={{ scale: 1.1 }} className="text-red-400 font-bold">
                Next.js
              </motion.span>
              <span>•</span>
              <motion.span whileHover={{ scale: 1.1 }} className="text-red-400 font-bold">
                React
              </motion.span>
              <span>•</span>
              <motion.span whileHover={{ scale: 1.1 }} className="text-red-400 font-bold">
                Three.js
              </motion.span>
              <span>•</span>
              <span>Powered by</span>
              <motion.span whileHover={{ scale: 1.1 }} className="text-red-400 font-bold">
                NVIDIA AI
              </motion.span>
            </div>

            {/* Decorative elements */}
            <div className="mt-6 flex items-center gap-4 text-2xl">
              {['🌸', '⛩️', '🍂', '🎋'].map((emoji, i) => (
                <motion.span
                  key={i}
                  className="opacity-30"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
