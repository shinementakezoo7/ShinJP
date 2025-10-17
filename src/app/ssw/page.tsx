'use client'

import SectionHeader from '@/components/navigation/SectionHeader'
import EnhancedFeatureCard from '@/components/ssw/EnhancedFeatureCard'
import EnhancedProgramCard from '@/components/ssw/EnhancedProgramCard'
import EnhancedSectorCard from '@/components/ssw/EnhancedSectorCard'
import SSWHero from '@/components/ssw/SSWHero'
import { SSW_PROGRAMS, SSW_SECTORS } from '@/lib/ssw/sectors-data'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

export default function SSWPage() {
  const [activeProgram, setActiveProgram] = useState(0)
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-950 dark:via-slate-900 dark:to-purple-950">
      {/* Enhanced Navigation Header with Back Button */}
      <SectionHeader
        title="Specified Skilled Worker Program"
        titleJP="特定技能"
        subtitle="Japanese Training for 14 Industry Sectors"
        icon="🏭"
        backHref="/"
        backLabel="Back to Home"
        gradient="from-blue-600 to-cyan-600"
      >
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: 0.2 }}
        >
          <Link
            href="/ssw/textbooks"
            className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all hover:scale-105 border-2 border-gray-200 dark:border-gray-700"
          >
            📚 Textbooks
          </Link>
          <Link
            href="/ssw/generate"
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            ✨ Generate
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Dashboard
          </Link>
        </motion.div>
      </SectionHeader>

      {/* Hero Section */}
      <SSWHero />

      {/* SSW Program Types Section - Enhanced with Tabs */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Animation */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 dark:from-purple-400 dark:via-indigo-400 dark:to-blue-400 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              SSW Program Types
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
              <motion.span
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl"
              >
                📋
              </motion.span>
              <motion.div
                className="h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-purple-600 to-transparent rounded-full"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
            </motion.div>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.4,
                duration: shouldReduceMotion ? 0 : 0.5,
              }}
            >
              Choose the program that matches your Japanese proficiency and career goals
            </motion.p>
          </motion.div>

          {/* Interactive Program Selector Tabs */}
          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
              delay: shouldReduceMotion ? 0 : 0.2,
              duration: shouldReduceMotion ? 0 : 0.3,
            }}
          >
            {SSW_PROGRAMS.map((program, index) => (
              <motion.button
                key={program.id}
                onClick={() => setActiveProgram(index)}
                className={`relative px-6 py-3 rounded-2xl font-bold text-sm md:text-base transition-all duration-300 overflow-hidden group min-h-[48px] ${
                  activeProgram === index
                    ? 'text-white shadow-2xl scale-105'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-600'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ touchAction: 'manipulation' }}
              >
                {activeProgram === index && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600"
                    layoutId="programTab"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-2">
                  <span className="text-xl">{program.icon}</span>
                  {program.name}
                </span>
              </motion.button>
            ))}
          </motion.div>

          {/* Enhanced Program Cards Grid with Active Tab */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            key={activeProgram}
            initial="initial"
            animate="animate"
            variants={{
              animate: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {SSW_PROGRAMS.map((program, index) => (
              <motion.div
                key={program.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <EnhancedProgramCard program={program} index={index} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Sectors Section */}
      <section
        id="sectors"
        className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white/30 via-purple-50/20 to-transparent dark:from-gray-900/30 dark:via-purple-950/20 dark:to-transparent overflow-hidden"
      >
        {/* Decorative animated blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], rotate: [360, 180, 0] }}
            transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              14 Specialized Sectors
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
              <motion.span
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl"
              >
                🏭
              </motion.span>
              <motion.div
                className="h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-blue-600 to-transparent rounded-full"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
            </motion.div>
            <motion.p
              className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: shouldReduceMotion ? 0 : 0.4,
                duration: shouldReduceMotion ? 0 : 0.5,
              }}
            >
              Comprehensive Japanese training for every SSW industry sector with specialized content
              and real-world scenarios
            </motion.p>
          </motion.div>

          {/* Enhanced Sector Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              animate: {
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {SSW_SECTORS.map((sector, index) => (
              <EnhancedSectorCard key={sector.id} sector={sector} index={index} />
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ delay: 0.3 }}
          >
            <Link
              href="/ssw/generate"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <motion.span
                animate={{
                  scale: [1, 1.1, 1],
                  transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                ✨
              </motion.span>
              <span className="text-2xl mr-2">Generate Custom Textbook</span>
              <motion.svg
                className="w-5 h-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </motion.svg>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-red-400/5 to-orange-400/5 rounded-full blur-3xl"
            animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 dark:from-red-400 dark:via-orange-400 dark:to-amber-400 bg-clip-text text-transparent mb-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            >
              Why Choose Our SSW Program
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-4 mb-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
              <motion.span
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl"
              >
                ⭐
              </motion.span>
              <motion.div
                className="h-1 w-20 sm:w-32 bg-gradient-to-r from-transparent via-red-600 to-transparent rounded-full"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
            </motion.div>
          </motion.div>

          {/* Enhanced Feature Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              animate: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {[
              {
                icon: '🎯',
                title: 'Sector-Specific',
                desc: 'Tailored content for each industry with specialized vocabulary',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: '⚠️',
                title: 'Safety Focus',
                desc: 'Emphasis on workplace safety vocabulary and protocols',
                color: 'from-red-500 to-orange-600',
              },
              {
                icon: '💼',
                title: 'Real Scenarios',
                desc: 'Authentic workplace conversations and situations',
                color: 'from-purple-500 to-pink-600',
              },
              {
                icon: '🤖',
                title: 'AI-Powered',
                desc: 'Generated with advanced AI technology for accuracy',
                color: 'from-green-500 to-emerald-600',
              },
            ].map((feature, i) => (
              <EnhancedFeatureCard key={i} feature={feature} index={i} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <motion.section
        className="relative py-28 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 dark:from-blue-800 dark:via-cyan-800 dark:to-teal-800"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white/5 text-[20rem]"
              style={{
                left: `${i * 30}%`,
                top: `${i % 2 === 0 ? 0 : 'auto'}`,
                bottom: `${i % 2 === 0 ? 'auto' : 0}`,
              }}
              animate={{
                y: [0, 30, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.3,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight"
              whileHover={{ scale: 1.02 }}
            >
              Ready to Start Your SSW Journey?
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl text-white/90 mb-10 font-medium leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
            >
              Access comprehensive training materials for all 14 sectors with personalized learning
              paths
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link
                href="/ssw/textbooks"
                className="group relative inline-flex items-center px-10 py-5 bg-white text-blue-600 font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 overflow-hidden text-lg"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '0%' }}
                  transition={{ duration: 0.5 }}
                />
                <span className="relative flex items-center gap-3">
                  <motion.span
                    className="text-2xl"
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    📚
                  </motion.span>
                  Browse Textbooks
                </span>
              </Link>
              <Link
                href="/ssw/generate"
                className="group relative inline-flex items-center px-10 py-5 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-2xl hover:shadow-3xl transform transition-all duration-300 overflow-hidden text-lg"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative flex items-center gap-3">
                  <motion.span
                    className="text-2xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ✨
                  </motion.span>
                  Generate Custom Textbook
                  <motion.svg
                    className="w-5 h-5"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </motion.svg>
                </span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
