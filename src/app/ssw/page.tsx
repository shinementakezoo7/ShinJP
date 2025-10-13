'use client'

import Link from 'next/link'
import SectorCard from '@/components/ssw/SectorCard'
import SSWHero from '@/components/ssw/SSWHero'
import SectionHeader from '@/components/navigation/SectionHeader'
import { SSW_PROGRAMS, SSW_SECTORS } from '@/lib/ssw/sectors-data'

export default function SSWPage() {
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
        <div className="flex items-center gap-3">
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
        </div>
      </SectionHeader>

      {/* Hero Section */}
      <SSWHero />

      {/* SSW Program Types Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                SSW Program Types
              </span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
              <span className="text-2xl">📋</span>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-purple-600 to-transparent"></div>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Choose the program that matches your Japanese proficiency and career goals
            </p>
          </div>

          {/* Program Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {SSW_PROGRAMS.map((program) => (
              <div
                key={program.id}
                className="group relative rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl p-8"
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${program.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                ></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="mb-6 flex justify-center">
                    <div className="w-20 h-20 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-white group-hover:to-white rounded-2xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                      <span className="text-4xl">{program.icon}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300 text-center mb-2">
                    {program.name}
                  </h3>

                  {/* Japanese Name */}
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300 mb-3 japanese-text text-center">
                    {program.nameJP}
                  </p>

                  {/* Level Badge */}
                  <div className="flex justify-center mb-4">
                    <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 group-hover:bg-white/20 text-blue-700 dark:text-blue-300 group-hover:text-white rounded-xl text-sm font-bold transition-colors duration-300">
                      {program.level}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white/80 transition-colors duration-300 mb-4 text-center">
                    {program.description}
                  </p>

                  {/* Requirements */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 group-hover:bg-white/10 rounded-xl p-4 mb-4 transition-colors duration-300">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300 mb-1">
                      Requirements:
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">
                      {program.requirements}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700/50 group-hover:bg-white/10 rounded-xl p-3 transition-colors duration-300">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300 mb-1">
                        Max Stay
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                        {program.maxStay}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 group-hover:bg-white/10 rounded-xl p-3 transition-colors duration-300">
                      <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 group-hover:text-white/70 transition-colors duration-300 mb-1">
                        Family
                      </p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300">
                        {program.familyBringing ? '✓ Yes' : '✗ No'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Sectors Section */}
      <section
        id="sectors"
        className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-gray-900/50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                14 Specialized Sectors
              </span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
              <span className="text-2xl">🏭</span>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
            </div>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Comprehensive Japanese training for every SSW industry sector
            </p>
          </div>

          {/* Sector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {SSW_SECTORS.map((sector) => (
              <SectorCard key={sector.id} sector={sector} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/ssw/generate"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl mr-2">✨</span>
              <span>Generate Custom Textbook</span>
              <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 bg-clip-text text-transparent">
                Why Choose Our SSW Program
              </span>
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              <span className="text-2xl">⭐</span>
              <div className="h-px w-16 sm:w-24 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
              <div
                key={i}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div
                  className={`w-16 h-16 mb-4 mx-auto flex items-center justify-center bg-gradient-to-br ${feature.color} rounded-xl shadow-lg transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}
                >
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Your SSW Journey?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Access comprehensive training materials for all 14 sectors
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/ssw/textbooks"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl mr-2">📚</span>
              <span>Browse Textbooks</span>
            </Link>
            <Link
              href="/ssw/generate"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl mr-2">✨</span>
              <span>Generate Textbook</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
