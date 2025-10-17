'use client'

import { motion, AnimatePresence } from 'framer-motion'

interface EnhancedProgramCardProps {
  program: {
    id: string
    name: string
    nameJP: string
    level: string
    description: string
    requirements: string
    icon: string
    color: string
    maxStay: string
    familyBringing: boolean
  }
  index: number
}

const programCardVariants = {
  initial: {
    opacity: 0,
    y: 60,
    scale: 0.9,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      mass: 1,
      delay: index * 0.1,
    },
  }),
  hover: {
    y: -16,
    scale: 1.03,
    rotateX: 5,
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
  },
}

const gradientBackgroundVariants = {
  initial: {
    opacity: 0,
    scale: 0.8,
  },
  hover: {
    opacity: 0.15,
    scale: 1.1,
    transition: {
      duration: 0.6,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
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
    scale: 1.15,
    rotate: [0, 2, 0],
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 35,
      duration: 2,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  },
}

const statsVariants = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.1 },
  },
}

export default function EnhancedProgramCard({ program, index }: EnhancedProgramCardProps) {
  return (
    <motion.div
      className="group relative rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl p-8"
      variants={programCardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      custom={index}
      viewport={{ once: true, margin: '-100px' }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Enhanced Animated Gradient Background */}
      <AnimatePresence>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${program.color}`}
          variants={gradientBackgroundVariants}
          initial="initial"
          whileHover="hover"
          style={{ zIndex: -1 }}
        />
      </AnimatePresence>

      {/* Subtle Animated Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id={`program-pattern-${program.id}`}
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0,30 Q15,15 30,30 T60,30"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#program-pattern-${program.id})`} />
        </svg>
      </div>

      <motion.div className="relative z-10 text-center" style={{ zIndex: 2 }}>
        {/* Enhanced Icon with Floating Animation */}
        <motion.div
          className="mb-6 flex justify-center"
          variants={{
            hover: {
              y: [-5, 5, -5],
              transition: {
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            },
          }}
          initial={{ y: 0 }}
          whileHover="hover"
        >
          <motion.div
            className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl shadow-lg"
            variants={iconVariants}
          >
            <span className="text-4xl">{program.icon}</span>
          </motion.div>
        </motion.div>

        {/* Title with Typing Effect */}
        <motion.h3
          className="text-2xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {program.name}
        </motion.h3>

        {/* Japanese Name */}
        <motion.p
          className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 japanese-text"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          {program.nameJP}
        </motion.p>

        {/* Level Badge with Pulse Animation */}
        <motion.div
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <motion.span
            className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl text-sm font-bold"
            animate={{
              scale: [1, 1.05, 1],
              transition: {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          >
            {program.level}
          </motion.span>
        </motion.div>

        {/* Description */}
        <motion.p
          className="text-sm text-gray-700 dark:text-gray-300 mb-4 text-center leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35 }}
        >
          {program.description}
        </motion.p>

        {/* Requirements Card */}
        <motion.div
          className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          whileHover={{
            y: -2,
            transition: { type: 'spring', stiffness: 400, damping: 30 },
          }}
        >
          <motion.p
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.45 }}
          >
            Requirements:
          </motion.p>
          <motion.p
            className="text-sm text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {program.requirements}
          </motion.p>
        </motion.div>

        {/* Stats Grid with Staggered Animation */}
        <motion.div
          className="grid grid-cols-2 gap-3 mb-4"
          variants={statsVariants}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          transition={{ delay: 0.55 }}
        >
          {/* Max Stay Stat */}
          <motion.div
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
            whileHover={{
              scale: 1.05,
              y: -3,
              transition: { type: 'spring', stiffness: 400, damping: 30 },
            }}
          >
            <motion.p
              className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              Max Stay
            </motion.p>
            <motion.p
              className="text-sm font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 }}
            >
              {program.maxStay}
            </motion.p>
          </motion.div>

          {/* Family Bringing Stat */}
          <motion.div
            className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3"
            whileHover={{
              scale: 1.05,
              y: -3,
              transition: { type: 'spring', stiffness: 400, damping: 30 },
            }}
          >
            <motion.p
              className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 }}
            >
              Family
            </motion.p>
            <motion.p
              className="text-sm font-bold text-gray-900 dark:text-white"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.75 }}
            >
              {program.familyBringing ? '✓ Yes' : '✗ No'}
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Floating Particles for Extra Polish */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${10 + i * 25}%`,
                top: `${20 + i * 15}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Enhanced Shadow and Depth on Hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/10 to-transparent opacity-0"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: -2 }}
      />
    </motion.div>
  )
}
