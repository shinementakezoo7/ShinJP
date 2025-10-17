'use client'

import { motion } from 'framer-motion'

interface EnhancedFeatureCardProps {
  feature: {
    icon: string
    title: string
    desc: string
    color: string
  }
  index: number
}

const featureCardVariants = {
  initial: {
    opacity: 0,
    y: 50,
    scale: 0.95,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 25,
      delay: index * 0.15,
    },
  }),
  hover: {
    y: -8,
    scale: 1.04,
    rotate: [0, 1, 0],
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
      mass: 1,
    },
  },
}

const iconVariants = {
  initial: {
    scale: 0.9,
    rotate: 0,
  },
  hover: {
    scale: 1.15,
    rotate: [0, 5, 0],
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

const contentVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
}

export default function EnhancedFeatureCard({ feature, index }: EnhancedFeatureCardProps) {
  return (
    <motion.div
      className="group relative p-8 rounded-3xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-2 border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl cursor-pointer overflow-hidden"
      variants={featureCardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      custom={index}
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Animated gradient background overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl`}
      />

      {/* Animated Gradient Icon Container */}
      <motion.div
        className={`relative w-20 h-20 mb-6 mx-auto flex items-center justify-center bg-gradient-to-br ${feature.color} rounded-2xl shadow-lg`}
        variants={iconVariants}
      >
        <span className="text-4xl">{feature.icon}</span>
      </motion.div>

      {/* Content with Staggered Animation */}
      <motion.div
        className="relative text-center z-10"
        variants={contentVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.h3
          className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent mb-3"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p
          className="text-base text-gray-700 dark:text-gray-300 leading-relaxed font-medium"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          {feature.desc}
        </motion.p>
      </motion.div>

      {/* Interactive Elements */}
      <motion.div
        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/40 rounded-full blur-sm"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + i * 15}%`,
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4 + i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2,
              }}
            />
          ))}
        </div>

        {/* Subtle wave pattern */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/10 dark:from-white/5 to-transparent"
          animate={{
            opacity: [0.05, 0.15, 0.05],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
