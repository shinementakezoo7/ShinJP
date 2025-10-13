'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

// Particle Field Component
function ParticleField() {
  const ref = useRef<THREE.Points>(null!)
  const [sphere] = useState(() => {
    const positions = new Float32Array(5000 * 3)
    for (let i = 0; i < 5000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(Math.random() * 2 - 1)
      const radius = 2 + Math.random() * 1
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = radius * Math.cos(phi)
    }
    return positions
  })

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.rotation.x = time * 0.05
      ref.current.rotation.y = time * 0.075
    }
  })

  return (
    <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ff6b6b"
        size={0.01}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

// Floating Kanji Component
function FloatingKanji({ position, kanji }: { position: [number, number, number]; kanji: string }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    if (ref.current) {
      ref.current.position.y = position[1] + Math.sin(time + position[0]) * 0.2
      ref.current.rotation.y = time * 0.3
    }
  })

  return (
    <mesh ref={ref} position={position}>
      <planeGeometry args={[0.5, 0.5]} />
      <meshStandardMaterial color="#dc143c" transparent opacity={0.3} side={THREE.DoubleSide} />
    </mesh>
  )
}

// Enhanced 3D Scene
function Scene3D() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff6b6b" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffa500" />
      <ParticleField />
      <FloatingKanji position={[-2, 0, 0]} kanji="道" />
      <FloatingKanji position={[2, 0, 0]} kanji="武" />
      <FloatingKanji position={[0, 1.5, -1]} kanji="侍" />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  )
}

export default function Enhanced3DHero() {
  const [mounted, setMounted] = useState(false)
  const [currentKanji, setCurrentKanji] = useState(0)
  const kanjiList = ['道', '武', '侍', '心', '禅']
  const { scrollY } = useScroll()

  // Parallax transformations
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const scale = useTransform(scrollY, [0, 300], [1, 0.8])

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setCurrentKanji((prev) => (prev + 1) % kanjiList.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [kanjiList.length])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, stiffness: 100 },
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20">
      {/* 3D Canvas Background */}
      {mounted && (
        <div className="absolute inset-0 opacity-40 dark:opacity-60">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
              <Scene3D />
            </Canvas>
          </Suspense>
        </div>
      )}

      {/* Gradient Overlays */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-red-600/20 via-transparent to-amber-600/20"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(220,20,60,0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 70%, rgba(255,140,0,0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 30%, rgba(220,20,60,0.2) 0%, transparent 50%)',
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY }}
        />
      </div>

      {/* Floating Sakura Petals with Physics */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted &&
          [...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{
                x: Math.random() * window.innerWidth,
                y: -100,
                rotate: 0,
                opacity: 0.6,
              }}
              animate={{
                y: window.innerHeight + 100,
                x: Math.random() * window.innerWidth,
                rotate: 360,
                opacity: [0.6, 0.3, 0.6],
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.5,
                ease: 'linear',
              }}
            >
              🌸
            </motion.div>
          ))}
      </div>

      {/* Main Content */}
      <motion.div
        style={{ y, opacity, scale }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Animated Kanji Backdrop */}
          <motion.div className="mb-8 relative h-32" variants={itemVariants}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentKanji}
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 0.1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <span className="text-[20rem] font-black japanese-text text-red-800 dark:text-red-400">
                  {kanjiList[currentKanji]}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* Badge */}
            <motion.div
              variants={itemVariants}
              className="relative inline-flex items-center gap-3 bg-white/50 dark:bg-black/40 backdrop-blur-2xl rounded-full px-8 py-3 border-2 border-red-800/30 dark:border-red-400/30 shadow-2xl"
              whileHover={{ scale: 1.05 }}
            >
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="text-2xl"
              >
                🎌
              </motion.span>
              <span className="text-sm font-black text-red-900 dark:text-red-300 tracking-wider uppercase">
                Way of Japanese Mastery
              </span>
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                className="text-2xl"
              >
                🎌
              </motion.span>
            </motion.div>
          </motion.div>

          {/* Hero Title with 3D Effect */}
          <motion.div variants={itemVariants} className="mb-8">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none mb-6">
              <div className="flex flex-col items-center gap-6">
                {/* Giant Kanji with 3D Shadow */}
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    textShadow: [
                      '4px 4px 0px rgba(220,20,60,0.3), 8px 8px 0px rgba(255,140,0,0.2), 12px 12px 0px rgba(255,165,0,0.1)',
                      '6px 6px 0px rgba(220,20,60,0.4), 12px 12px 0px rgba(255,140,0,0.3), 18px 18px 0px rgba(255,165,0,0.2)',
                      '4px 4px 0px rgba(220,20,60,0.3), 8px 8px 0px rgba(255,140,0,0.2), 12px 12px 0px rgba(255,165,0,0.1)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  <span className="japanese-text text-red-800 dark:text-red-400 text-9xl sm:text-[12rem] font-black">
                    侍
                  </span>
                  {/* Multi-layer glow */}
                  <div className="absolute -inset-6 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 opacity-25 blur-3xl animate-pulse" />
                  <div className="absolute -inset-12 bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 opacity-15 blur-[80px]" />
                </motion.div>

                {/* Main Title */}
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5, type: 'spring' }}
                >
                  <span className="block text-gray-900 dark:text-white">
                    Master{' '}
                    <motion.span
                      className="relative inline-block bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent"
                      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                      transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                      style={{ backgroundSize: '200% auto' }}
                    >
                      Japanese
                    </motion.span>
                  </span>
                </motion.div>

                {/* Subtitle with Animated Levels */}
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                  className="text-4xl sm:text-5xl md:text-6xl"
                >
                  <span className="text-gray-900 dark:text-white">from </span>
                  <motion.span
                    className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 dark:from-amber-400 dark:via-orange-400 dark:to-red-400 bg-clip-text text-transparent font-extrabold"
                    whileHover={{ scale: 1.1 }}
                  >
                    N5
                  </motion.span>
                  <span className="text-gray-900 dark:text-white"> to </span>
                  <motion.span
                    className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent font-extrabold"
                    whileHover={{ scale: 1.1 }}
                  >
                    N1
                  </motion.span>
                </motion.div>
              </div>
            </h1>
          </motion.div>

          {/* Description with Glass Effect */}
          <motion.div variants={itemVariants} className="mb-12 max-w-4xl mx-auto">
            <motion.div
              className="relative p-8 rounded-3xl bg-white/50 dark:bg-black/30 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-2xl"
              whileHover={{ scale: 1.02, rotateY: 5 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                Begin your{' '}
                <span className="font-bold text-red-700 dark:text-red-400 japanese-text">武道</span>{' '}
                (budō) journey with{' '}
                <motion.span
                  className="bg-gradient-to-r from-red-600 to-amber-600 dark:from-red-400 dark:to-amber-400 bg-clip-text text-transparent font-bold"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  AI-powered personalized learning
                </motion.span>
                , traditional teaching methods, and immersive cultural experiences.
              </p>
            </motion.div>
          </motion.div>

          {/* CTAs with 3D Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            {/* Primary CTA */}
            <Link href="/dashboard">
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05, rotateX: 10 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative px-12 py-5 rounded-full overflow-hidden">
                  {/* Multi-layer 3D background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 via-orange-600 to-amber-600" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />
                  <div className="absolute inset-0 shadow-2xl shadow-red-900/50" />

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2 }}
                  />

                  <div className="relative flex items-center gap-3 text-white font-bold text-xl">
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                      className="text-2xl"
                    >
                      ⛩️
                    </motion.span>
                    <span>Begin Your Journey</span>
                    <span className="japanese-text text-2xl">道</span>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Secondary CTA */}
            <Link href="/demo">
              <motion.div
                className="relative group cursor-pointer"
                whileHover={{ scale: 1.05, rotateX: -10 }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative px-12 py-5 rounded-full overflow-hidden">
                  <div className="absolute inset-0 bg-white/70 dark:bg-black/50 backdrop-blur-xl" />
                  <div className="absolute inset-0 border-4 border-red-700 dark:border-red-400 rounded-full" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-red-700 to-amber-600 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.5 }}
                  />

                  <div className="relative flex items-center gap-3 font-bold text-xl text-red-900 dark:text-red-300 group-hover:text-white transition-colors">
                    <span className="text-2xl">🎋</span>
                    <span>Explore Demo</span>
                    <span className="text-2xl">🎋</span>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* Animated Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {[
              {
                value: '5',
                label: 'JLPT Levels',
                kanji: '五段階',
                gradient: 'from-red-700 to-orange-600',
              },
              {
                value: '1K+',
                label: 'Vocabulary',
                kanji: '語彙',
                gradient: 'from-amber-700 to-red-600',
              },
              {
                value: 'AI',
                label: 'Powered',
                kanji: '人工知能',
                gradient: 'from-orange-700 to-amber-600',
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2 }}
                whileHover={{ scale: 1.05, rotateY: 10 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="relative p-8 rounded-3xl bg-white/60 dark:bg-black/40 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl">
                  <motion.div
                    className={`text-7xl font-black bg-gradient-to-br ${stat.gradient} dark:${stat.gradient} bg-clip-text text-transparent mb-3`}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.3,
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-widest">
                    {stat.label}
                  </div>
                  <div className="text-xl japanese-text text-red-700/50 dark:text-red-400/50 mt-2">
                    {stat.kanji}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div variants={itemVariants} className="mt-20 flex flex-col items-center gap-4">
            <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
              Scroll to Discover
            </p>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              className="w-8 h-14 border-3 border-red-700 dark:border-red-400 rounded-full flex items-start justify-center p-2"
            >
              <motion.div
                className="w-2 h-4 bg-red-700 dark:bg-red-400 rounded-full"
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white dark:from-gray-950 to-transparent pointer-events-none" />
    </section>
  )
}
