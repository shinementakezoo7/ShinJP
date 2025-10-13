'use client'

import { motion } from 'framer-motion'
import { FeatureCard3D } from './Animated3DCard'

export default function EnhancedFeaturesSection() {
  const features = [
    {
      icon: '🤖',
      title: 'AI Powered Learning',
      titleKanji: 'AI',
      description:
        'Personalized content generation and intelligent tutoring powered by advanced NVIDIA and OpenAI models.',
      kanji: '智',
      gradient: 'from-red-500 to-pink-600 dark:from-red-400 dark:to-pink-500',
    },
    {
      icon: '🔄',
      title: 'Spaced Repetition',
      titleKanji: '反復',
      description:
        'Optimized review scheduling ensures long-term retention of vocabulary and grammar from N5 to N1.',
      kanji: '記',
      gradient: 'from-amber-500 to-orange-600 dark:from-amber-400 dark:to-orange-500',
    },
    {
      icon: '🎮',
      title: 'Immersive Practice',
      titleKanji: '没入',
      description:
        'Interactive exercises, real conversations, and gamified experiences make learning enjoyable and effective.',
      kanji: '練',
      gradient: 'from-purple-500 to-pink-600 dark:from-purple-400 dark:to-pink-500',
    },
  ]

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Animated background patterns */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
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
        </motion.svg>
      </div>

      {/* Decorative Torii Gate */}
      <motion.div
        className="absolute top-10 right-10 text-8xl opacity-5 dark:opacity-10 pointer-events-none"
        animate={{
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
      >
        ⛩️
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-block relative mb-6">
            {/* Background kanji with rotation */}
            <motion.div
              className="text-9xl font-black japanese-text text-red-800/5 dark:text-red-400/5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
            >
              特
            </motion.div>

            <motion.h2
              className="relative text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              whileHover={{ scale: 1.02 }}
            >
              Why Choose{' '}
              <motion.span
                className="japanese-text text-red-600 dark:text-red-400"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                侍
              </motion.span>{' '}
              <motion.span
                className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 dark:from-red-400 dark:via-pink-400 dark:to-purple-400 bg-clip-text text-transparent"
                animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
                style={{ backgroundSize: '200% auto' }}
              >
                Shinmen Takezo
              </motion.span>
            </motion.h2>
          </div>

          {/* Japanese Divider with animation */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            />
            <motion.span
              className="text-3xl"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            >
              🌸
            </motion.span>
            <motion.div
              className="h-px w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium"
          >
            Experience the future of{' '}
            <span className="japanese-text text-red-600 dark:text-red-400 font-bold">日本語</span>{' '}
            learning
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard3D
              key={index}
              icon={feature.icon}
              title={`${feature.titleKanji} ${feature.title}`}
              description={feature.description}
              kanji={feature.kanji}
              gradient={feature.gradient}
              index={index}
            />
          ))}
        </div>

        {/* Additional animated elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <motion.div
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-xl border-2 border-red-800/20 dark:border-red-400/20 shadow-xl"
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              className="text-2xl"
            >
              🎯
            </motion.span>
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              Start your journey from <span className="text-red-600 dark:text-red-400">N5</span> to{' '}
              <span className="text-red-600 dark:text-red-400">N1</span>
            </span>
            <span className="japanese-text text-xl text-red-600 dark:text-red-400">道</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
