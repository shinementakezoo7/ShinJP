'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { SSWSector } from '@/lib/ssw/sectors-data'

interface EnhancedSectorCardProps {
  sector: SSWSector
  index?: number
}

const cardVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 1,
    },
  },
  hover: {
    y: -12,
    scale: 1.02,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
  },
}

const gradientVariants = {
  initial: {
    opacity: 0,
  },
  hover: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
}

const iconVariants = {
  initial: {
    scale: 1,
    rotate: 0,
  },
  hover: {
    scale: 1.1,
    rotate: 3,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 35,
    },
  },
}

const japaneseTextVariants = {
  initial: {
    opacity: 0.05,
  },
  hover: {
    opacity: 0.15,
    transition: {
      duration: 0.5,
    },
  },
}

export default function EnhancedSectorCard({ sector, index = 0 }: EnhancedSectorCardProps) {
  return (
    <Link href={`/ssw/sectors/${sector.id}`} className="group relative block h-full">
      <motion.div
        className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl p-6 transition-all duration-300"
        variants={cardVariants}
        initial="initial"
        whileInView="animate"
        whileHover="hover"
        viewport={{ once: true, margin: '-50px' }}
        custom={index}
        style={{ zIndex: 1 }}
      >
        {/* Enhanced Gradient Background on Hover */}
        <AnimatePresence>
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${sector.color} pointer-events-none rounded-3xl`}
            variants={gradientVariants}
            initial="initial"
            whileHover="hover"
            style={{ zIndex: -1 }}
          />
        </AnimatePresence>

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5 rounded-3xl">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern
              id={`pattern-${sector.id}`}
              x="0"
              y="0"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1" fill="none" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#pattern-${sector.id})`} />
          </svg>
        </div>

        {/* Enhanced Japanese Text Background with Animation */}
        <motion.div
          className="absolute top-2 right-2 text-8xl font-black pointer-events-none select-none text-gray-900/5 dark:text-white/5 group-hover:text-gray-900/10 dark:group-hover:text-white/10 transition-all duration-300"
          variants={japaneseTextVariants}
          initial="initial"
          whileHover="hover"
        >
          {sector.nameJP.charAt(0)}
        </motion.div>

        <motion.div className="relative z-10 h-full flex flex-col" style={{ zIndex: 2 }}>
          {/* Enhanced Icon and Difficulty Badge */}
          <motion.div
            className="flex items-start justify-between mb-5"
            variants={{
              hover: {
                y: -2,
                transition: {
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                },
              },
            }}
            initial={{ y: 0 }}
            whileHover="hover"
          >
            <motion.div
              className={`flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gradient-to-br ${sector.color} rounded-3xl shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
              variants={iconVariants}
            >
              <span className="text-5xl">{sector.icon}</span>
            </motion.div>

            <motion.span
              className={`px-4 py-2 rounded-full text-xs font-black whitespace-nowrap ${
                sector.difficulty === 'beginner'
                  ? 'bg-green-100/80 dark:bg-green-900/40 text-green-700 dark:text-green-300 backdrop-blur-sm'
                  : sector.difficulty === 'intermediate'
                    ? 'bg-amber-100/80 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 backdrop-blur-sm'
                    : 'bg-red-100/80 dark:bg-red-900/40 text-red-700 dark:text-red-300 backdrop-blur-sm'
              }`}
              whileHover={{
                scale: 1.08,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 30,
              }}
            >
              {sector.difficulty.toUpperCase()}
            </motion.span>
          </motion.div>

          {/* Title with Staggered Animation */}
          <motion.h3
            className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-2 group-hover:text-white transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            aria-label={`${sector.name} sector`}
          >
            {sector.name}
          </motion.h3>

          {/* Japanese Name */}
          <motion.p
            className="text-base font-bold text-gray-600 dark:text-gray-400 mb-3 japanese-text group-hover:text-white/90 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            aria-label={`Japanese name: ${sector.nameJP}`}
          >
            {sector.nameJP}
          </motion.p>

          {/* Description with Line Clamp */}
          <motion.p
            className="text-sm text-gray-700 dark:text-gray-300 mb-5 line-clamp-2 flex-grow leading-relaxed group-hover:text-white/80 transition-colors duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            aria-label={`Description: ${sector.description}`}
          >
            {sector.description}
          </motion.p>

          {/* Stats with Staggered Animation */}
          <motion.div
            className="flex flex-wrap gap-3 mb-5"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <motion.span
              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 text-blue-700 dark:text-blue-300 group-hover:text-white rounded-xl text-xs font-bold backdrop-blur-sm transition-all duration-300"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <span>📚</span>
              {sector.jlptLevel}
            </motion.span>
            <motion.span
              className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 text-purple-700 dark:text-purple-300 group-hover:text-white rounded-xl text-xs font-bold backdrop-blur-sm transition-all duration-300"
              whileHover={{ scale: 1.08, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.05 }}
            >
              <span>👥</span>
              {sector.workers}
            </motion.span>
          </motion.div>

          {/* Categories with Cascade Animation */}
          <motion.div
            className="flex flex-wrap gap-2 mb-5"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {sector.categories.slice(0, 2).map((cat, catIndex) => (
              <motion.span
                key={cat}
                className="px-3 py-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-300 hover:text-white group-hover:text-white rounded-lg text-xs font-semibold backdrop-blur-sm transition-all duration-300"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.35 + catIndex * 0.05,
                  type: 'spring',
                  stiffness: 400,
                  damping: 30,
                }}
                whileHover={{
                  scale: 1.08,
                  y: -2,
                }}
              >
                {cat}
              </motion.span>
            ))}
          </motion.div>

          {/* Learn More Link with Enhanced Animation */}
          <motion.div
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mt-auto group-hover:text-white transition-colors duration-300"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{
              x: 5,
              transition: {
                x: { type: 'spring', stiffness: 400, damping: 30 },
              },
            }}
            tabIndex={0}
            role="link"
            aria-label={`Learn more about ${sector.name} sector`}
          >
            <span>View Details</span>
            <motion.svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Enhanced Decorative Element */}
        <motion.div
          className="absolute -bottom-4 -right-4 text-5xl pointer-events-none text-gray-900/5 dark:text-white/5 group-hover:text-gray-900/10 dark:group-hover:text-white/10 transition-all duration-300"
          initial={{ opacity: 0.1, rotate: 12 }}
          whileHover={{
            opacity: 0.2,
            rotate: 0,
            scale: 1.3,
          }}
          transition={{
            opacity: { duration: 0.5 },
            rotate: { type: 'spring', stiffness: 300, damping: 25 },
            scale: { type: 'spring', stiffness: 400, damping: 30 },
          }}
        >
          🌸
        </motion.div>

        {/* Floating Particles Animation */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-pink-400/60 to-purple-400/60 rounded-full blur-sm"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 15}%`,
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      </motion.div>
    </Link>
  )
}
