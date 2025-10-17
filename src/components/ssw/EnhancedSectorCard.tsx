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
        className="relative h-full rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg p-6"
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
            className={`absolute inset-0 bg-gradient-to-br ${sector.color} pointer-events-none`}
            variants={gradientVariants}
            initial="initial"
            whileHover="hover"
            style={{ zIndex: -1 }}
          />
        </AnimatePresence>

        {/* Background Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-5">
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
          className="absolute top-4 right-4 text-7xl font-black pointer-events-none select-none"
          variants={japaneseTextVariants}
          initial="initial"
          whileHover="hover"
        >
          {sector.nameJP.charAt(0)}
        </motion.div>

        <motion.div className="relative z-10 h-full flex flex-col" style={{ zIndex: 2 }}>
          {/* Enhanced Icon and Difficulty Badge */}
          <motion.div
            className="flex items-start justify-between mb-4"
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
              className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-md"
              variants={iconVariants}
            >
              <span className="text-4xl">{sector.icon}</span>
            </motion.div>

            <motion.span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                sector.difficulty === 'beginner'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : sector.difficulty === 'intermediate'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              }`}
              whileHover={{
                scale: 1.05,
                backgroundColor:
                  sector.difficulty === 'beginner'
                    ? 'rgba(34, 197, 94, 0.9)'
                    : sector.difficulty === 'intermediate'
                      ? 'rgba(234, 179, 8, 0.9)'
                      : 'rgba(239, 68, 68, 0.9)',
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
            className="text-xl font-bold text-gray-900 dark:text-white mb-2"
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
            className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 japanese-text"
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
            className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 flex-grow"
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
            className="flex flex-wrap gap-2 mb-4"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
          >
            <motion.span
              className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <span>📚</span>
              {sector.jlptLevel}
            </motion.span>
            <motion.span
              className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30, delay: 0.05 }}
            >
              <span>👥</span>
              {sector.workers}
            </motion.span>
          </motion.div>

          {/* Categories with Cascade Animation */}
          <motion.div
            className="flex flex-wrap gap-1 mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            {sector.categories.map((cat, catIndex) => (
              <motion.span
                key={cat}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs"
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
                  scale: 1.05,
                  y: -2,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                }}
              >
                {cat}
              </motion.span>
            ))}
          </motion.div>

          {/* Learn More Link with Enhanced Animation */}
          <motion.div
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mt-auto"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{
              x: 5,
              color: 'white',
              transition: {
                x: { type: 'spring', stiffness: 400, damping: 30 },
                color: { duration: 0.3 },
              },
            }}
            tabIndex={0}
            role="link"
            aria-label={`Learn more about ${sector.name} sector`}
          >
            <span>Learn More</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              whileHover={{ x: 2 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Enhanced Decorative Element */}
        <motion.div
          className="absolute -bottom-2 -right-2 text-4xl pointer-events-none"
          initial={{ opacity: 0.1, rotate: 12 }}
          whileHover={{
            opacity: 0.2,
            rotate: 0,
            scale: 1.2,
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
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 0.5}s`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </Link>
  )
}
