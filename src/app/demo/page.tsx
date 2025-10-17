'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AudioPlayer from '@/components/audio/AudioPlayer'
import StrokeAnimator from '@/components/kanji/StrokeAnimator'
import PoweredByAIBadge from '@/components/shared/PoweredByAIBadge'
import FontSizeControl from '@/components/theme/FontSizeControl'
import ThemeToggle from '@/components/theme/ThemeToggle'
import ParticleEffects from '@/components/demo/ParticleEffects'

export default function DemoPage() {
  const [selectedKanji, setSelectedKanji] = useState('日')
  const availableKanji = ['一', '二', '三', '日', '月']

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Particle Effects */}
      <ParticleEffects />

      {/* Animated Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-950 dark:via-blue-950 dark:to-indigo-950">
        {/* Liquid morphing blobs */}
        <motion.div
          className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full liquid-morph blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full liquid-morph blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full liquid-morph blur-3xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -180, -360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Japanese pattern overlay */}
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id="seigaiha"
                x="0"
                y="0"
                width="100"
                height="100"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-red-800 dark:text-red-400"
                />
                <circle
                  cx="0"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-red-800 dark:text-red-400"
                />
                <circle
                  cx="100"
                  cy="50"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-red-800 dark:text-red-400"
                />
                <circle
                  cx="50"
                  cy="0"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-red-800 dark:text-red-400"
                />
                <circle
                  cx="50"
                  cy="100"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="text-red-800 dark:text-red-400"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#seigaiha)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring' }}
          >
            {/* Floating kanji background */}
            <motion.div
              className="absolute top-0 left-1/2 transform -translate-x-1/2 text-[20rem] japanese-text text-red-800/5 dark:text-red-400/5 pointer-events-none select-none font-black"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              侍
            </motion.div>

            <div className="relative">
              <motion.h1
                className="text-5xl sm:text-7xl font-bold mb-6 flex items-center justify-center gap-4"
                whileHover={{ scale: 1.02 }}
              >
                <motion.span
                  className="japanese-text text-6xl sm:text-8xl liquid-gradient-text bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent"
                  animate={{
                    textShadow: [
                      '0 0 20px rgba(220, 20, 60, 0.5)',
                      '0 0 40px rgba(236, 72, 153, 0.8)',
                      '0 0 20px rgba(147, 51, 234, 0.5)',
                    ],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  侍
                </motion.span>
                <motion.span
                  className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0%', '100%', '0%'] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: '200% auto' }}
                >
                  Shinmen Takezo Demo
                </motion.span>
              </motion.h1>

              <motion.p
                className="text-2xl sm:text-3xl text-gray-700 dark:text-gray-300 mb-8 font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Experience our{' '}
                <motion.span
                  className="japanese-text text-red-600 dark:text-red-400 font-bold liquid-text-morph"
                  whileHover={{ scale: 1.1 }}
                >
                  AI-powered
                </motion.span>{' '}
                learning features
              </motion.p>

              {/* Glassmorphism control panel */}
              <motion.div
                className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl glass-morphism-enhanced border border-red-800/20 dark:border-red-400/20 shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
              >
                <PoweredByAIBadge />
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
                <ThemeToggle />
                <div className="w-px h-8 bg-gradient-to-b from-transparent via-red-600/50 to-transparent" />
                <FontSizeControl />
              </motion.div>

              {/* Animated divider */}
              <motion.div
                className="flex items-center justify-center gap-6 mt-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <motion.div
                  className="h-px w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
                <motion.img
                  src="/icons/sakura.svg"
                  alt="Sakura"
                  className="w-10 h-10"
                  animate={{
                    rotate: [0, 360],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                  className="h-px w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced Feature Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Audio Pronunciation Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <div className="relative h-full">
                {/* Glow effect on hover */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative glass-morphism-enhanced rounded-3xl p-8 border border-indigo-800/20 dark:border-indigo-400/20 shadow-2xl h-full">
                  {/* Floating kanji decoration */}
                  <motion.div
                    className="absolute top-4 right-4 text-6xl japanese-text text-indigo-800/10 dark:text-indigo-400/10 pointer-events-none select-none font-black"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    音
                  </motion.div>

                  <motion.h2
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 00-5.656 0"
                        />
                      </svg>
                    </motion.div>
                    Audio Pronunciation
                  </motion.h2>

                  <motion.p
                    className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Listen to native Japanese pronunciation with adjustable speed controls
                  </motion.p>

                  <div className="space-y-6">
                    {/* Enhanced Japanese Examples */}
                    {[
                      { text: 'こんにちは', romaji: 'Konnichiwa', meaning: 'Hello' },
                      {
                        text: 'ありがとうございます',
                        romaji: 'Arigatou gozaimasu',
                        meaning: 'Thank you',
                      },
                      {
                        text: '日本語を勉強しています',
                        romaji: 'Nihongo o benkyou shiteimasu',
                        meaning: 'I am studying Japanese',
                      },
                    ].map((example, index) => (
                      <motion.div
                        key={index}
                        className="relative group/item"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.02 }}
                      >
                        {/* Glow effect */}
                        <motion.div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />

                        <div className="relative glass-effect rounded-2xl p-6 border border-indigo-800/20 dark:border-indigo-400/20 hover:border-indigo-600/40 dark:hover:border-indigo-400/60 transition-all duration-300">
                          <motion.p
                            className="japanese-text text-4xl font-bold text-gray-900 dark:text-white mb-3"
                            whileHover={{ scale: 1.05 }}
                          >
                            {example.text}
                          </motion.p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 font-medium">
                            {example.romaji}
                          </p>
                          <p className="text-base text-gray-700 dark:text-gray-300 mb-4 font-semibold">
                            {example.meaning}
                          </p>
                          <AudioPlayer text={example.text} />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Kanji Stroke Order Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <div className="relative h-full">
                {/* Glow effect on hover */}
                <motion.div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative glass-morphism-enhanced rounded-3xl p-8 border border-amber-800/20 dark:border-amber-400/20 shadow-2xl h-full">
                  {/* Floating kanji decoration */}
                  <motion.div
                    className="absolute top-4 right-4 text-6xl japanese-text text-amber-800/10 dark:text-amber-400/10 pointer-events-none select-none font-black"
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    字
                  </motion.div>

                  <motion.h2
                    className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div
                      className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl shadow-lg"
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </motion.div>
                    Kanji Stroke Order
                  </motion.h2>

                  <motion.p
                    className="text-gray-700 dark:text-gray-300 mb-6 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    Learn proper stroke order with animated demonstrations
                  </motion.p>

                  {/* Enhanced Kanji Selector */}
                  <div className="flex gap-3 mb-6 flex-wrap justify-center">
                    {availableKanji.map((kanji, index) => (
                      <motion.button
                        key={kanji}
                        onClick={() => setSelectedKanji(kanji)}
                        className={`
                          relative px-6 py-3 rounded-2xl text-3xl japanese-text font-bold transition-all overflow-hidden
                          ${
                            selectedKanji === kanji
                              ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-xl scale-110'
                              : 'bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white hover:bg-amber-100 dark:hover:bg-amber-900/30 border border-amber-800/20 dark:border-amber-400/20'
                          }
                        `}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {selectedKanji === kanji && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500"
                            layoutId="selectedKanji"
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{kanji}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Enhanced Stroke Animator */}
                  <motion.div
                    className="glass-effect rounded-2xl p-6 border border-amber-800/20 dark:border-amber-400/20"
                    whileHover={{ scale: 1.02 }}
                  >
                    <StrokeAnimator kanji={selectedKanji} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Enhanced AI Model Status Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-12"
          >
            <div className="relative group">
              {/* Glow effect */}
              <motion.div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative glass-morphism-enhanced rounded-3xl p-8 border border-purple-800/20 dark:border-purple-400/20 shadow-2xl">
                {/* Floating kanji decoration */}
                <motion.div
                  className="absolute top-4 right-4 text-6xl japanese-text text-purple-800/10 dark:text-purple-400/10 pointer-events-none select-none font-black"
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 5, repeat: Infinity }}
                >
                  知
                </motion.div>

                <motion.h2
                  className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3"
                  whileHover={{ x: 5 }}
                >
                  <motion.div
                    className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      />
                    </svg>
                  </motion.div>
                  AI Model Routing
                </motion.h2>

                <motion.p
                  className="text-gray-700 dark:text-gray-300 mb-8 text-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  Shinmen Takezo intelligently routes tasks to the best AI model
                </motion.p>

                {/* Enhanced AI Model Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Vision Tasks',
                      description: 'Image analysis, OCR',
                      model: 'llama-3.2-11b-vision',
                      gradient: 'from-purple-500 to-pink-600',
                      icon: '👁️',
                      kanji: '見',
                    },
                    {
                      title: 'Grammar & Stories',
                      description: 'Explanations, textbooks',
                      model: 'stockmark-2-100b',
                      gradient: 'from-blue-500 to-cyan-600',
                      icon: '📚',
                      kanji: '文',
                    },
                    {
                      title: 'Quizzes & Roleplay',
                      description: 'Adaptive assessments',
                      model: 'mistral-medium-3',
                      gradient: 'from-green-500 to-emerald-600',
                      icon: '🎮',
                      kanji: '試',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      className="group/item"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, y: -5 }}
                    >
                      {/* Glow effect */}
                      <motion.div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />

                      <div className="relative glass-effect rounded-2xl p-6 border border-purple-800/20 dark:border-purple-400/20 hover:border-purple-600/40 dark:hover:border-purple-400/60 transition-all duration-300 h-full">
                        {/* Floating icon */}
                        <motion.div
                          className="text-4xl mb-4"
                          animate={{
                            y: [0, -5, 0],
                            rotate: [0, 5, -5, 0],
                          }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                        >
                          {item.icon}
                        </motion.div>

                        <motion.h3
                          className="font-bold text-xl text-gray-900 dark:text-white mb-3"
                          whileHover={{ scale: 1.05 }}
                        >
                          {item.title}
                        </motion.h3>

                        <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                          {item.description}
                        </p>

                        <motion.div
                          className={`
                            text-sm font-bold px-4 py-2 rounded-xl bg-gradient-to-r ${item.gradient} 
                            text-white shadow-lg inline-block
                          `}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {item.model}
                        </motion.div>

                        {/* Decorative kanji */}
                        <motion.div
                          className="absolute bottom-2 right-2 text-2xl japanese-text text-purple-800/10 dark:text-purple-400/10 pointer-events-none select-none"
                          animate={{ rotate: [0, 360] }}
                          transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                            delay: index * 5,
                          }}
                        >
                          {item.kanji}
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced Feature Highlights */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: '🔄',
                title: 'Round-Robin Load Balancing',
                description: 'Distributes requests across multiple endpoints',
                gradient: 'from-indigo-500 to-purple-600',
                kanji: '回',
              },
              {
                icon: '🔁',
                title: 'Automatic Retry Logic',
                description: '3 attempts with exponential backoff',
                gradient: 'from-pink-500 to-red-600',
                kanji: '再',
              },
              {
                icon: '🔑',
                title: 'API Key Rotation',
                description: 'Switches keys on rate limits (429)',
                gradient: 'from-green-500 to-teal-600',
                kanji: '鍵',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="group"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05, y: -10 }}
              >
                {/* Glow effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl"
                  style={{
                    background: `linear-gradient(135deg, ${feature.gradient.includes('indigo') ? 'rgba(99, 102, 241, 0.3)' : feature.gradient.includes('pink') ? 'rgba(236, 72, 153, 0.3)' : 'rgba(34, 197, 94, 0.3)'}, transparent)`,
                  }}
                />

                <div className="relative glass-morphism-enhanced rounded-2xl p-8 text-center border border-white/20 dark:border-white/10 shadow-2xl h-full">
                  {/* Floating icon */}
                  <motion.div
                    className="text-5xl mb-4 mx-auto"
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.7 }}
                  >
                    {feature.icon}
                  </motion.div>

                  <motion.h3
                    className="font-bold text-xl text-gray-900 dark:text-white mb-3"
                    whileHover={{ scale: 1.05 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <p className="text-sm text-gray-700 dark:text-gray-300 opacity-90">
                    {feature.description}
                  </p>

                  {/* Decorative kanji */}
                  <motion.div
                    className="absolute top-4 right-4 text-3xl japanese-text opacity-10 pointer-events-none select-none"
                    animate={{ rotate: [0, 360] }}
                    transition={{
                      duration: 25,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: index * 8,
                    }}
                  >
                    {feature.kanji}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
