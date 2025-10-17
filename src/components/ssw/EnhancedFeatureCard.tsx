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
    rotate: [0, 1, -1, 0],
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
    rotate: [0, 5, -5, 0],
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
      className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl cursor-pointer"
      variants={featureCardVariants}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      custom={index}
      viewport={{ once: true, margin: '-50px' }}
    >
      {/* Animated Gradient Icon Container */}
      <motion.div
        className={`w-16 h-16 mb-4 mx-auto flex items-center justify-center bg-gradient-to-br ${feature.color} rounded-xl shadow-lg`}
        variants={iconVariants}
      >
        <span className="text-3xl">{feature.icon}</span>
      </motion.div>

      {/* Content with Staggered Animation */}
      <motion.div
        className="text-center"
        variants={contentVariants}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.h3
          className="text-xl font-bold text-gray-900 dark:text-white mb-2"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {feature.title}
        </motion.h3>
        <motion.p
          className="text-sm text-gray-700 dark:text-gray-300"
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
        className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/50 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* Subtle wave pattern */}
        <motion.div
          className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/5 to-transparent"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
