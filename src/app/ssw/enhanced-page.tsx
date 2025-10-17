'use client'

import Link from 'next/link'
import EnhancedSectorCard from '@/components/ssw/EnhancedSectorCard'
import EnhancedProgramCard from '@/components/ssw/EnhancedProgramCard'
import EnhancedFeatureCard from '@/components/ssw/EnhancedFeatureCard'
import SSWHero from '@/components/ssw/SSWHero'
import SectionHeader from '@/components/navigation/SectionHeader'
import { SSW_PROGRAMS, SSW_SECTORS } from '@/lib/ssw/sectors-data'
import { motion } from 'framer-motion'

export default function EnhancedSSWPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-950">
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

      {/* SSW Program Types Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header with Animation */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                SSW Program Types
              </span>
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-purple-600 to-transparent"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.span
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                📋
              </motion.span>
              <motion.div
                className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-purple-600 to-transparent"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Choose the program that matches your Japanese proficiency and career goals
            </motion.p>
          </motion.div>

          {/* Enhanced Program Cards Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              animate: {
                transition: { staggerChildren: 0.15 },
              },
            }}
          >
            {SSW_PROGRAMS.map((program, index) => (
              <EnhancedProgramCard key={program.id} program={program} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Sectors Section */}
      <section
        id="sectors"
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                14 Specialized Sectors
              </span>
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.span
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                🏭
              </motion.span>
              <motion.div
                className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </motion.div>
            <motion.p
              className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Comprehensive Japanese training for every SSW industry sector
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

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6 }}
          >
            <motion.h2
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ scale: 0.9 }}
              whileInView={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <span className="bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                Why Choose Our SSW Program
              </span>
            </motion.h2>
            <motion.div
              className="flex items-center justify-center gap-4 mb-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div
                className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.span
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                ⭐
              </motion.span>
              <motion.div
                className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"
                animate={{ scaleX: [0, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
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
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {[
              {
                icon: '🎯',
                title: 'Sector-Specific',
                desc: 'Tailored content for each industry',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: '⚠️',
                title: 'Safety Focus',
                desc: 'Emphasis on workplace safety vocabulary',
                color: 'from-red-500 to-orange-600',
              },
              {
                icon: '💼',
                title: 'Real Scenarios',
                desc: 'Authentic workplace conversations',
                color: 'from-purple-500 to-pink-600',
              },
              {
                icon: '🤖',
                title: 'AI-Powered',
                desc: 'Generated with advanced AI technology',
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
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            initial={{ scale: 0.9 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Ready to Start Your SSW Journey?
          </motion.h2>
          <motion.p
            className="text-xl text-white/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Access comprehensive training materials for all 14 sectors
          </motion.p>
          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/ssw/textbooks"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <motion.span
                animate={{
                  scale: [1, 1.05, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                📚
              </motion.span>
              <span className="text-2xl mr-2">Browse Textbooks</span>
            </Link>
            <Link
              href="/ssw/generate"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <motion.span
                animate={{
                  scale: [1, 1.05, 1],
                  transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              >
                ✨
              </motion.span>
              <span className="text-2xl mr-2">Generate Textbook</span>
            </Link>
          </motion.div>
        </div>
      </motion.section>
    </div>
  )
}
