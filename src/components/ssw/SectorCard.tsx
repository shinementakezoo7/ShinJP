'use client'

import Link from 'next/link'
import type { SSWSector } from '@/lib/ssw/sectors-data'

interface SectorCardProps {
  sector: SSWSector
}

export default function SectorCard({ sector }: SectorCardProps) {
  return (
    <Link href={`/ssw/sectors/${sector.id}`} className="group relative block h-full">
      <div className="relative h-full rounded-3xl overflow-hidden bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 shadow-lg transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:border-transparent p-6">
        {/* Gradient Background on Hover */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${sector.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        ></div>

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

        {/* Large Japanese Text Background */}
        <div className="absolute top-4 right-4 text-7xl font-black opacity-5 group-hover:opacity-10 pointer-events-none select-none transition-opacity duration-500">
          {sector.nameJP.charAt(0)}
        </div>

        <div className="relative z-10">
          {/* Icon and Difficulty Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 group-hover:from-white group-hover:to-white dark:group-hover:from-white dark:group-hover:to-white rounded-2xl shadow-md transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                {sector.icon}
              </span>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${
                sector.difficulty === 'beginner'
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : sector.difficulty === 'intermediate'
                    ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                    : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              } group-hover:bg-white/90 group-hover:text-gray-900 transition-colors duration-300`}
            >
              {sector.difficulty.toUpperCase()}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-white transition-colors duration-300 mb-2">
            {sector.name}
          </h3>

          {/* Japanese Name */}
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-white/90 transition-colors duration-300 mb-3 japanese-text">
            {sector.nameJP}
          </p>

          {/* Description */}
          <p className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-white/80 transition-colors duration-300 mb-4 line-clamp-2">
            {sector.description}
          </p>

          {/* Stats */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-900/20 group-hover:bg-white/20 text-blue-700 dark:text-blue-300 group-hover:text-white rounded-lg text-xs font-semibold transition-colors duration-300">
              <span>📚</span>
              {sector.jlptLevel}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 dark:bg-purple-900/20 group-hover:bg-white/20 text-purple-700 dark:text-purple-300 group-hover:text-white rounded-lg text-xs font-semibold transition-colors duration-300">
              <span>👥</span>
              {sector.workers}
            </span>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-1 mb-4">
            {sector.categories.map((cat) => (
              <span
                key={cat}
                className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 group-hover:bg-white/20 text-gray-700 dark:text-gray-300 group-hover:text-white rounded text-xs transition-colors duration-300"
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Learn More Link */}
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 group-hover:text-white font-semibold text-sm transition-colors duration-300">
            <span>Learn More</span>
            <svg
              className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute -bottom-2 -right-2 text-4xl opacity-10 group-hover:opacity-20 transition-opacity duration-500 rotate-12 group-hover:rotate-0 transform transition-transform">
          🌸
        </div>
      </div>
    </Link>
  )
}
