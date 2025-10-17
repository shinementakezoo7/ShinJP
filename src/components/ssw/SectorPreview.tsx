'use client'

import { SSW_SECTORS } from '@/lib/ssw/sectors-data'
import { motion, useReducedMotion } from 'framer-motion'
import { memo } from 'react'

interface SectorPreviewProps {
  sectorId: string
  sswType: 'SSW1' | 'SSW2' | 'JFT-Basic'
  numberOfChapters: number
  includeWorkplaceScenarios: boolean
  includeSafetyVocabulary: boolean
  includeAudio: boolean
}

const SectorPreview = ({
  sectorId,
  sswType,
  numberOfChapters,
  includeWorkplaceScenarios,
  includeSafetyVocabulary,
  includeAudio,
}: SectorPreviewProps) => {
  const shouldReduceMotion = useReducedMotion()
  const sector = SSW_SECTORS.find((s) => s.id === sectorId)

  if (!sector) {
    return null
  }

  // Get sector-specific vocabulary based on sector ID
  const getSectorVocabulary = () => {
    const vocabMap: Record<string, string[]> = {
      'nursing-care': [
        '利用者 (riyousha) - user/client',
        '服薬 (fukuyaku) - medication',
        '緊急連絡 (kinkyuu renraku) - emergency contact',
        '介護 (kaigo) - nursing care',
        '体位変換 (taii henkan) - position change',
      ],
      'building-cleaning': [
        '洗剤 (senzai) - detergent',
        '消毒 (shoudoku) - disinfection',
        '廃棄物 (haikibutsu) - waste',
        '清掃 (seisou) - cleaning',
        '衛生 (eisei) - hygiene',
      ],
      'machine-parts-tooling': [
        '金属 (kinzoku) - metal',
        '加工 (kakou) - processing',
        '機械 (kikai) - machine',
        '精度 (seido) - precision',
        '工具 (kougu) - tools',
      ],
      'industrial-machinery': [
        '機械製造 (kikai seizou) - machinery manufacturing',
        '設計 (sekkei) - design',
        '組立 (kumitate) - assembly',
        '保守 (hoshuu) - maintenance',
        '点検 (tenken) - inspection',
      ],
      'electric-electronics': [
        '電子回路 (denshi kairo) - electronic circuit',
        '配線 (haisen) - wiring',
        '安全確認 (anzen kakunin) - safety check',
        '電源 (dengen) - power supply',
        '故障 (koshou) - malfunction',
      ],
      construction: [
        '安全帯 (anzen tai) - safety harness',
        '危険 (kiken) - danger',
        '立入禁止 (tachiiri kinshi) - no entry',
        '作業 (sagyou) - work',
        '資材 (shizai) - materials',
      ],
      shipbuilding: [
        '溶接 (yousetsu) - welding',
        '船体 (sentai) - hull',
        '設計図 (sekkeizu) - blueprint',
        '甲板 (kouhan) - deck',
        '艤装 (gizou) - outfitting',
      ],
      'auto-repair': [
        '整備 (seibi) - maintenance',
        '点検 (tenken) - inspection',
        '修理 (shuuri) - repair',
        '部品 (buhin) - parts',
        'エンジン (enjin) - engine',
      ],
      aviation: [
        '搭乗 (toujou) - boarding',
        '保安検査 (hoan kensa) - security check',
        '手荷物 (tenimotsu) - baggage',
        '搭乗券 (toujouken) - boarding pass',
        'ゲート (geeto) - gate',
      ],
      accommodation: [
        'チェックイン (chekkuin) - check-in',
        'お客様 (okyakusama) - guest',
        '予約 (yoyaku) - reservation',
        'フロント (furonto) - front desk',
        'サービス (saabisu) - service',
      ],
      agriculture: [
        '農薬 (nouyaku) - pesticide',
        '収穫 (shuukaku) - harvest',
        '種まき (tanemaki) - sowing',
        '灌漑 (kankou) - irrigation',
        '肥料 (hiryou) - fertilizer',
      ],
      fishery: [
        '漁 (ryou) - fishing',
        '網 (ami) - net',
        '船 (fune) - boat',
        '水揚げ (mizuage) - landing catch',
        '養殖 (youshoku) - aquaculture',
      ],
      'food-beverage': [
        '衛生管理 (eisei kanri) - hygiene management',
        '賞味期限 (shoumi kigen) - expiration date',
        '原材料 (genzairyou) - raw materials',
        '製造 (seizou) - manufacturing',
        '品質 (hinshitsu) - quality',
      ],
      'food-service': [
        'アレルギー (arerugii) - allergy',
        '食中毒 (shokuchuudoku) - food poisoning',
        '衛生 (eisei) - hygiene',
        '調理 (chouri) - cooking',
        '提供 (teikyou) - serving',
      ],
    }
    return vocabMap[sectorId] || sector.keywords.map((k) => `${k} (sector-specific)`)
  }

  const getLearningObjectives = () => {
    const objectives = []

    if (sswType === 'SSW1') {
      objectives.push('Basic workplace communication (N4 level)')
      objectives.push('Essential vocabulary for daily tasks')
      objectives.push('Simple sentence structures for instructions')
    } else if (sswType === 'SSW2') {
      objectives.push('Advanced workplace communication (N3+ level)')
      objectives.push('Complex technical terminology')
      objectives.push('Professional conversation skills')
    } else {
      objectives.push('Basic Japanese for daily life (A2 level)')
      objectives.push('Fundamental vocabulary and grammar')
      objectives.push('Simple conversational patterns')
    }

    if (includeWorkplaceScenarios) {
      objectives.push('Realistic workplace dialogues and situations')
    }

    if (includeSafetyVocabulary) {
      objectives.push('Safety-critical terminology and procedures')
    }

    if (includeAudio) {
      objectives.push('Audio pronunciation for key vocabulary')
    }

    return objectives
  }

  const getWorkplaceScenarios = () => {
    if (!includeWorkplaceScenarios) return []

    const scenariosMap: Record<string, string[]> = {
      'nursing-care': [
        'Morning care routine with elderly client',
        'Emergency response to medical situation',
        'Communication with family members',
      ],
      'building-cleaning': [
        'Handling cleaning chemicals safely',
        'Reporting maintenance issues',
        'Coordinating with building management',
      ],
      'machine-parts-tooling': [
        'Quality control inspection procedures',
        'Machine operation instructions',
        'Tool maintenance and safety',
      ],
      'industrial-machinery': [
        'Equipment assembly instructions',
        'Safety protocol during maintenance',
        'Technical problem reporting',
      ],
      'electric-electronics': [
        'Circuit troubleshooting procedures',
        'Safety checks before maintenance',
        'Component replacement instructions',
      ],
      construction: [
        'Safety briefing before work starts',
        'Reporting hazardous conditions',
        'Coordinating with team members',
      ],
      shipbuilding: [
        'Welding safety procedures',
        'Blueprint reading and interpretation',
        'Quality inspection protocols',
      ],
      'auto-repair': [
        'Vehicle diagnostic procedures',
        'Customer service for repairs',
        'Parts ordering and inventory',
      ],
      aviation: [
        'Passenger assistance procedures',
        'Security screening protocols',
        'Baggage handling instructions',
      ],
      accommodation: [
        'Guest check-in and check-out',
        'Handling room service requests',
        'Emergency evacuation procedures',
      ],
      agriculture: [
        'Pesticide application safety',
        'Harvest coordination',
        'Equipment operation instructions',
      ],
      fishery: [
        'Boat safety procedures',
        'Catch handling and storage',
        'Weather condition reporting',
      ],
      'food-beverage': [
        'Hygiene protocol compliance',
        'Quality control inspections',
        'Production line coordination',
      ],
      'food-service': [
        'Allergy awareness and handling',
        'Food safety procedures',
        'Customer service scenarios',
      ],
    }

    return scenariosMap[sectorId] || ['General workplace communication scenarios']
  }

  const sectorVocabulary = getSectorVocabulary()
  const learningObjectives = getLearningObjectives()
  const workplaceScenarios = getWorkplaceScenarios()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 border border-blue-200 dark:border-gray-600"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-2xl shadow-lg">
          {sector.icon}
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {sector.name} ({sector.nameJP})
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{sector.description}</p>
        </div>
      </div>

      {/* Content Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-lg">📚</span>
            Content Overview
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Chapters:</span>
              <span className="font-medium text-gray-900 dark:text-white">{numberOfChapters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">SSW Type:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {sswType === 'SSW1'
                  ? 'Type 1 (N4)'
                  : sswType === 'SSW2'
                    ? 'Type 2 (N3+)'
                    : 'JFT-Basic (A2)'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Estimated Time:</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {Math.ceil(numberOfChapters * 1)}-{numberOfChapters * 2} hours
              </span>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-lg">🎯</span>
            Learning Objectives
          </h4>
          <ul className="space-y-1 text-sm">
            {learningObjectives.map((objective, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span className="text-gray-700 dark:text-gray-300">{objective}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Sector Vocabulary */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <span className="text-lg">🇯🇵</span>
          Sector-Specific Vocabulary
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {sectorVocabulary.slice(0, 6).map((vocab, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="inline-block px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600"
            >
              {vocab}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Workplace Scenarios */}
      {workplaceScenarios.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <span className="text-lg">💼</span>
            Workplace Scenarios
          </h4>
          <div className="space-y-2">
            {workplaceScenarios.map((scenario, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
              >
                {scenario}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default memo(SectorPreview)
