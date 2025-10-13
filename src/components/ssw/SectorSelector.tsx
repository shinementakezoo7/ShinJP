'use client'

interface SectorSelectorProps {
  value: string
  onChange: (sector: string) => void
}

const SECTORS = [
  {
    id: 'caregiving',
    name: '介護',
    english: 'Caregiving',
    icon: '🏥',
    description: 'Elderly care and assistance',
    color: 'from-pink-400 to-rose-500',
    critical: ['利用者', '服薬', '緊急連絡'],
  },
  {
    id: 'construction',
    name: '建設',
    english: 'Construction',
    icon: '🏗️',
    description: 'Building and construction work',
    color: 'from-orange-400 to-amber-500',
    critical: ['安全帯', '危険', '立入禁止'],
  },
  {
    id: 'agriculture',
    name: '農業',
    english: 'Agriculture',
    icon: '🌾',
    description: 'Farming and crop cultivation',
    color: 'from-green-400 to-emerald-500',
    critical: ['農薬', '収穫', '種まき'],
  },
  {
    id: 'food_service',
    name: '外食業',
    english: 'Food Service',
    icon: '🍽️',
    description: 'Restaurants and food service',
    color: 'from-yellow-400 to-orange-500',
    critical: ['アレルギー', '食中毒', '衛生'],
  },
  {
    id: 'building_cleaning',
    name: 'ビルクリーニング',
    english: 'Building Cleaning',
    icon: '🧹',
    description: 'Facility cleaning and management',
    color: 'from-blue-400 to-cyan-500',
    critical: ['洗剤', '消毒', '廃棄物'],
  },
  {
    id: 'manufacturing',
    name: '製造業',
    english: 'Manufacturing',
    icon: '🏭',
    description: 'Factory and production work',
    color: 'from-gray-400 to-slate-500',
    critical: ['機械', '不良品', '品質管理'],
  },
  {
    id: 'accommodation',
    name: '宿泊',
    english: 'Accommodation',
    icon: '🏨',
    description: 'Hotels and lodging',
    color: 'from-purple-400 to-violet-500',
    critical: ['チェックイン', 'お客様', '予約'],
  },
  {
    id: 'fishery',
    name: '漁業',
    english: 'Fishery',
    icon: '🎣',
    description: 'Fishing and aquaculture',
    color: 'from-cyan-400 to-blue-500',
    critical: ['漁', '網', '船'],
  },
  {
    id: 'aviation',
    name: '航空',
    english: 'Aviation',
    icon: '✈️',
    description: 'Airport and aviation services',
    color: 'from-indigo-400 to-purple-500',
    critical: ['搭乗', '保安検査', '手荷物'],
  },
  {
    id: 'automotive',
    name: '自動車整備',
    english: 'Automotive',
    icon: '🔧',
    description: 'Vehicle maintenance and repair',
    color: 'from-red-400 to-rose-500',
    critical: ['整備', '点検', '修理'],
  },
  {
    id: 'shipbuilding',
    name: '造船',
    english: 'Shipbuilding',
    icon: '🚢',
    description: 'Ship construction and repair',
    color: 'from-blue-400 to-indigo-500',
    critical: ['溶接', '船体', '設計図'],
  },
  {
    id: 'food_manufacturing',
    name: '飲食料品製造',
    english: 'Food Manufacturing',
    icon: '🏭',
    description: 'Food production and processing',
    color: 'from-amber-400 to-orange-500',
    critical: ['衛生管理', '賞味期限', '原材料'],
  },
  {
    id: 'material_processing',
    name: '素形材産業',
    english: 'Material Processing',
    icon: '⚙️',
    description: 'Material and metal processing',
    color: 'from-slate-400 to-gray-500',
    critical: ['金属', '加工', '機械'],
  },
  {
    id: 'industrial_machinery',
    name: '産業機械製造',
    english: 'Industrial Machinery',
    icon: '🔩',
    description: 'Industrial equipment manufacturing',
    color: 'from-zinc-400 to-slate-500',
    critical: ['機械製造', '設計', '組立'],
  },
]

export default function SectorSelector({ value, onChange }: SectorSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {SECTORS.map((sector) => (
        <button
          key={sector.id}
          onClick={() => onChange(sector.id)}
          className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
            value === sector.id
              ? `border-transparent bg-gradient-to-br ${sector.color} text-white shadow-2xl scale-105 z-10`
              : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600 hover:scale-102 hover:shadow-lg'
          }`}
        >
          {/* Icon */}
          <div className="text-4xl mb-3">{sector.icon}</div>

          {/* Names */}
          <div className="font-bold text-lg mb-1">{sector.name}</div>
          <div
            className={`text-sm font-semibold mb-2 ${
              value === sector.id ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {sector.english}
          </div>

          {/* Description */}
          <div
            className={`text-xs mb-3 ${
              value === sector.id ? 'text-white/90' : 'text-gray-500 dark:text-gray-500'
            }`}
          >
            {sector.description}
          </div>

          {/* Critical Vocabulary Preview */}
          <div
            className={`text-xs space-y-1 ${
              value === sector.id ? 'text-white/80' : 'text-gray-400 dark:text-gray-600'
            }`}
          >
            <div className="font-semibold">Critical vocab:</div>
            {sector.critical.slice(0, 3).map((word, i) => (
              <div key={i} className="truncate">
                • {word}
              </div>
            ))}
          </div>

          {/* Selected Checkmark */}
          {value === sector.id && (
            <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {/* Hover Effect */}
          {value !== sector.id && (
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none"
              style={{ background: `linear-gradient(to bottom right, ${sector.color})` }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
