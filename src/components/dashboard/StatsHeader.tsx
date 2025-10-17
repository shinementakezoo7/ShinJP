'use client'

import { motion } from 'framer-motion'

interface StatsHeaderProps {
  title: string
  subtitle: string
  stats: { value: string | number; label: string; color: 'blue' | 'purple' | 'green' }[]
}

export function StatsHeader({ title, subtitle, stats }: StatsHeaderProps) {
  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    green: 'text-green-600 dark:text-green-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-12"
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-5xl animate-bounce-slow">👋</span>
            <div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white mb-2">
                {title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">{subtitle}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats Summary */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-4 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center px-4 border-r border-gray-300 dark:border-gray-600 last:border-r-0"
              whileHover={{ scale: 1.08, y: -2 }}
            >
              <div className={`text-2xl font-black ${colorClasses[stat.color]}`}>{stat.value}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
