'use client'

import { SSW_SECTORS } from '@/lib/ssw/sectors-data'
import { motion, AnimatePresence } from 'framer-motion'
import { useReducedMotion } from 'framer-motion'
import { memo } from 'react'

export interface SectorSelectorProps {
  value: string
  onChange: (sector: string) => void
  disabled?: boolean
  showDetails?: boolean
  layout?: 'grid' | 'list'
}

const SECTORS = SSW_SECTORS.map((sector) => ({
  id: sector.id,
  name: sector.nameJP,
  english: sector.name,
  icon: sector.icon,
  description: sector.description,
  color: sector.gradient.replace('bg-gradient-to-br ', ''),
  difficulty: sector.difficulty,
  workers: sector.workers,
  jlptLevel: sector.jlptLevel,
  categories: sector.categories,
  critical: (() => {
    // Map sectors to actual Japanese vocabulary based on sector ID
    const vocabMap: Record<string, string[]> = {
      'nursing-care': ['利用者', '服薬', '緊急連絡'],
      'building-cleaning': ['洗剤', '消毒', '廃棄物'],
      'machine-parts-tooling': ['金属', '加工', '機械'],
      'industrial-machinery': ['機械製造', '設計', '組立'],
      'electric-electronics': ['電子回路', '配線', '安全確認'],
      construction: ['安全帯', '危険', '立入禁止'],
      shipbuilding: ['溶接', '船体', '設計図'],
      'auto-repair': ['整備', '点検', '修理'],
      aviation: ['搭乗', '保安検査', '手荷物'],
      accommodation: ['チェックイン', 'お客様', '予約'],
      agriculture: ['農薬', '収穫', '種まき'],
      fishery: ['漁', '網', '船'],
      'food-beverage': ['衛生管理', '賞味期限', '原材料'],
      'food-service': ['アレルギー', '食中毒', '衛生'],
    }
    return vocabMap[sector.id] || sector.keywords.slice(0, 3)
  })(),
}))

const DIFFICULTY_COLORS = {
  beginner: 'from-green-500 to-emerald-600',
  intermediate: 'from-yellow-500 to-orange-600',
  advanced: 'from-red-500 to-orange-600',
}

const SectorCard = ({
  sector,
  selected,
  onSelect,
  disabled = false,
  showDetails = true,
}: {
  sector: (typeof SECTORS)[0]
  selected: boolean
  onSelect: () => void
  disabled?: boolean
  showDetails?: boolean
}) => {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.button
      whileHover={!disabled && !selected ? { y: -4, scale: 1.01 } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onSelect}
      disabled={disabled}
      aria-label={`Select ${sector.english} sector for SSW textbook generation`}
      aria-pressed={selected}
      className={`group relative p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 transition-all duration-300 text-left focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-opacity-50 min-h-[180px] sm:min-h-[200px] ${
        selected
          ? `border-transparent bg-gradient-to-br ${sector.color} text-white shadow-xl sm:shadow-2xl scale-102 sm:scale-105 z-10`
          : disabled
            ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:scale-101 sm:hover:scale-102 hover:shadow-md sm:hover:shadow-lg'
      } ${disabled ? 'opacity-50' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
    >
      {/* Enhanced Background Gradient */}
      <div
        className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-5 sm:group-hover:opacity-10 transition-opacity pointer-events-none"
        style={{
          background: `linear-gradient(to bottom right, ${sector.color})`,
          filter: 'blur(8px)',
        }}
      />

      {/* Main Content */}
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="text-3xl sm:text-4xl"
              animate={{ scale: selected ? 1.1 : 1 }}
              transition={{ duration: 0.3 }}
            >
              {sector.icon}
            </motion.div>

            {/* Difficulty Badge */}
            <div
              className={`px-2 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                selected
                  ? 'bg-white/20 text-white'
                  : `bg-gradient-to-r ${DIFFICULTY_COLORS[sector.difficulty]} text-white shadow-md`
              }`}
            >
              {sector.difficulty === 'beginner'
                ? 'Beginner'
                : sector.difficulty === 'intermediate'
                  ? 'Intermediate'
                  : 'Advanced'}
            </div>
          </div>

          {/* Selected Checkmark */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                aria-hidden="true"
              >
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-4 h-4 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <motion.path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Names */}
        <div className="font-bold text-base sm:text-lg mb-1 truncate">{sector.name}</div>
        <div
          className={`text-xs sm:text-sm font-semibold mb-2 ${
            selected ? 'text-white/90' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {sector.english}
        </div>

        {/* Japanese Level Indicator */}
        <div
          className={`text-xs mb-2 ${
            selected ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <span className="font-semibold">JLPT Level:</span> {sector.jlptLevel}
        </div>

        {/* Description */}
        <div
          className={`text-xs mb-3 leading-relaxed ${
            selected ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          <div className="line-clamp-2">{sector.description}</div>
        </div>

        {/* Enhanced Details Section */}
        {showDetails && (
          <div className="space-y-2">
            {/* Worker Statistics */}
            <div
              className={`text-xs ${
                selected ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'
              }`}
            >
              <div className="font-semibold flex items-center gap-1">
                <span>👥</span> Workers in Japan
              </div>
              <div className="ml-4">{sector.workers}</div>
            </div>

            {/* Categories */}
            <div
              className={`text-xs ${
                selected ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'
              }`}
            >
              <div className="font-semibold">Industry Categories</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {sector.categories.map((category, i) => (
                  <span
                    key={i}
                    className={`px-2 py-1 rounded text-xs ${
                      selected
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>

            {/* Critical Vocabulary Preview */}
            <div
              className={`text-xs space-y-1 ${
                selected ? 'text-white/70' : 'text-gray-500 dark:text-gray-500'
              }`}
            >
              <div className="font-semibold flex items-center gap-1">
                <span>📚</span> Critical Vocabulary
              </div>
              <div className="grid grid-cols-1 gap-1 ml-4">
                {sector.critical.slice(0, 3).map((word, i) => (
                  <span
                    key={i}
                    className={`inline-block px-2 py-1 rounded text-xs ${
                      selected
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hover Overlay Effect */}
        <motion.div
          className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
          style={{ background: `linear-gradient(to bottom right, ${sector.color})` }}
        />
      </div>

      {/* Selection Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-xl sm:rounded-2xl bg-white"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

const SectorSelectorComponent = ({
  value,
  onChange,
  disabled = false,
  showDetails = true,
  layout = 'grid',
}: SectorSelectorProps) => {
  const shouldReduceMotion = useReducedMotion()

  const handleSelect = (sectorId: string) => {
    if (!disabled) {
      onChange(sectorId)
    }
  }

  const gridClasses = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
  const listClasses = 'flex flex-col gap-3 sm:gap-4'

  return (
    <motion.div
      className={layout === 'grid' ? gridClasses : listClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.1 }}
    >
      {SECTORS.map((sector, index) => (
        <SectorCard
          key={sector.id}
          sector={sector}
          selected={value === sector.id}
          onSelect={() => handleSelect(sector.id)}
          disabled={disabled}
          showDetails={showDetails}
        />
      ))}
    </motion.div>
  )
}

export default memo(SectorSelectorComponent)
