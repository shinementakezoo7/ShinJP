export interface SSWSector {
  id: string
  name: string
  nameJP: string
  icon: string
  color: string
  gradient: string
  description: string
  jlptLevel: string
  workers: string
  categories: string[]
  keywords: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export const SSW_SECTORS: SSWSector[] = [
  {
    id: 'nursing-care',
    name: 'Nursing Care',
    nameJP: '介護',
    icon: '🏥',
    color: 'from-pink-500 to-rose-600',
    gradient: 'bg-gradient-to-br from-pink-500 to-rose-600',
    description: 'Care for elderly and disabled individuals in facilities and homes',
    jlptLevel: 'N4-N3',
    workers: '~60,000',
    categories: ['Healthcare', 'Social Services'],
    keywords: ['caregiving', 'elderly care', 'nursing', 'rehabilitation'],
    difficulty: 'intermediate',
  },
  {
    id: 'building-cleaning',
    name: 'Building Cleaning',
    nameJP: 'ビルクリーニング',
    icon: '🧹',
    color: 'from-blue-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-600',
    description: 'Professional cleaning and maintenance of commercial buildings',
    jlptLevel: 'N4',
    workers: '~37,000',
    categories: ['Facilities', 'Maintenance'],
    keywords: ['cleaning', 'maintenance', 'sanitation', 'facilities'],
    difficulty: 'beginner',
  },
  {
    id: 'machine-parts-tooling',
    name: 'Machine Parts & Tooling',
    nameJP: '素形材産業',
    icon: '⚙️',
    color: 'from-gray-500 to-slate-600',
    gradient: 'bg-gradient-to-br from-gray-500 to-slate-600',
    description: 'Manufacturing and processing of machine components and tools',
    jlptLevel: 'N4-N3',
    workers: '~21,500',
    categories: ['Manufacturing', 'Engineering'],
    keywords: ['machining', 'tooling', 'precision', 'manufacturing'],
    difficulty: 'intermediate',
  },
  {
    id: 'industrial-machinery',
    name: 'Industrial Machinery',
    nameJP: '産業機械製造業',
    icon: '🏭',
    color: 'from-orange-500 to-amber-600',
    gradient: 'bg-gradient-to-br from-orange-500 to-amber-600',
    description: 'Production and maintenance of industrial machinery and equipment',
    jlptLevel: 'N4-N3',
    workers: '~5,250',
    categories: ['Manufacturing', 'Heavy Industry'],
    keywords: ['machinery', 'equipment', 'assembly', 'maintenance'],
    difficulty: 'intermediate',
  },
  {
    id: 'electric-electronics',
    name: 'Electric & Electronics',
    nameJP: '電気・電子情報関連産業',
    icon: '💡',
    color: 'from-yellow-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-yellow-500 to-orange-600',
    description: 'Electronics manufacturing and electrical equipment production',
    jlptLevel: 'N4-N3',
    workers: '~4,700',
    categories: ['Technology', 'Manufacturing'],
    keywords: ['electronics', 'electrical', 'circuits', 'assembly'],
    difficulty: 'intermediate',
  },
  {
    id: 'construction',
    name: 'Construction',
    nameJP: '建設',
    icon: '🏗️',
    color: 'from-stone-500 to-zinc-600',
    gradient: 'bg-gradient-to-br from-stone-500 to-zinc-600',
    description: 'Building construction, renovation, and infrastructure work',
    jlptLevel: 'N4',
    workers: '~40,000',
    categories: ['Construction', 'Infrastructure'],
    keywords: ['construction', 'building', 'scaffolding', 'carpentry'],
    difficulty: 'intermediate',
  },
  {
    id: 'shipbuilding',
    name: 'Shipbuilding',
    nameJP: '造船・舶用工業',
    icon: '⚓',
    color: 'from-cyan-500 to-blue-600',
    gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600',
    description: 'Ship construction, repair, and marine equipment manufacturing',
    jlptLevel: 'N4-N3',
    workers: '~13,000',
    categories: ['Maritime', 'Heavy Industry'],
    keywords: ['shipbuilding', 'welding', 'marine', 'vessel'],
    difficulty: 'advanced',
  },
  {
    id: 'auto-repair',
    name: 'Automobile Repair',
    nameJP: '自動車整備',
    icon: '🔧',
    color: 'from-red-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-red-500 to-orange-600',
    description: 'Vehicle maintenance, repair, and automotive services',
    jlptLevel: 'N4-N3',
    workers: '~7,000',
    categories: ['Automotive', 'Maintenance'],
    keywords: ['automotive', 'repair', 'maintenance', 'mechanics'],
    difficulty: 'intermediate',
  },
  {
    id: 'aviation',
    name: 'Aviation',
    nameJP: '航空',
    icon: '✈️',
    color: 'from-sky-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-sky-500 to-indigo-600',
    description: 'Aircraft ground support and aviation maintenance services',
    jlptLevel: 'N4-N3',
    workers: '~2,200',
    categories: ['Aviation', 'Transportation'],
    keywords: ['aviation', 'aircraft', 'ground support', 'maintenance'],
    difficulty: 'advanced',
  },
  {
    id: 'accommodation',
    name: 'Accommodation',
    nameJP: '宿泊',
    icon: '🏨',
    color: 'from-purple-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-600',
    description: 'Hotel and hospitality services for guests',
    jlptLevel: 'N4-N3',
    workers: '~22,000',
    categories: ['Hospitality', 'Service'],
    keywords: ['hotel', 'hospitality', 'guest service', 'accommodation'],
    difficulty: 'intermediate',
  },
  {
    id: 'agriculture',
    name: 'Agriculture',
    nameJP: '農業',
    icon: '🌾',
    color: 'from-green-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-green-500 to-emerald-600',
    description: 'Crop cultivation, farming, and agricultural operations',
    jlptLevel: 'N4',
    workers: '~36,500',
    categories: ['Agriculture', 'Primary Industry'],
    keywords: ['farming', 'crops', 'agriculture', 'cultivation'],
    difficulty: 'beginner',
  },
  {
    id: 'fishery',
    name: 'Fishery & Aquaculture',
    nameJP: '漁業',
    icon: '🎣',
    color: 'from-teal-500 to-cyan-600',
    gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600',
    description: 'Fishing operations and aquaculture farming',
    jlptLevel: 'N4',
    workers: '~9,000',
    categories: ['Fishery', 'Primary Industry'],
    keywords: ['fishing', 'aquaculture', 'marine', 'seafood'],
    difficulty: 'beginner',
  },
  {
    id: 'food-beverage',
    name: 'Food & Beverage Manufacturing',
    nameJP: '飲食料品製造業',
    icon: '🍱',
    color: 'from-amber-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
    description: 'Food processing and beverage production facilities',
    jlptLevel: 'N4',
    workers: '~34,000',
    categories: ['Food Industry', 'Manufacturing'],
    keywords: ['food processing', 'production', 'quality control', 'manufacturing'],
    difficulty: 'beginner',
  },
  {
    id: 'food-service',
    name: 'Food Service',
    nameJP: '外食業',
    icon: '🍜',
    color: 'from-rose-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-rose-500 to-pink-600',
    description: 'Restaurant and food service industry operations',
    jlptLevel: 'N4-N3',
    workers: '~53,000',
    categories: ['Hospitality', 'Service'],
    keywords: ['restaurant', 'cooking', 'service', 'hospitality'],
    difficulty: 'intermediate',
  },
]

export interface SSWProgram {
  id: string
  name: string
  nameJP: string
  level: string
  description: string
  requirements: string
  icon: string
  color: string
  maxStay: string
  familyBringing: boolean
}

export const SSW_PROGRAMS: SSWProgram[] = [
  {
    id: 'ssw1',
    name: 'SSW Type 1',
    nameJP: '特定技能1号',
    level: 'N4 Equivalent',
    description: 'Basic workplace Japanese for skilled workers',
    requirements: 'Pass skills test and Japanese language test (N4 level)',
    icon: '🏢',
    color: 'from-blue-500 to-cyan-600',
    maxStay: '5 years',
    familyBringing: false,
  },
  {
    id: 'ssw2',
    name: 'SSW Type 2',
    nameJP: '特定技能2号',
    level: 'N3+ Equivalent',
    description: 'Advanced workplace communication for experienced workers',
    requirements: 'Advanced skills and higher Japanese proficiency',
    icon: '🎯',
    color: 'from-purple-500 to-indigo-600',
    maxStay: 'Renewable indefinitely',
    familyBringing: true,
  },
  {
    id: 'jft-basic',
    name: 'JFT-Basic',
    nameJP: '国際交流基金日本語基礎テスト',
    level: 'A2 Level',
    description: 'Basic Japanese test for daily life communication',
    requirements: 'Basic conversation and reading skills',
    icon: '📝',
    color: 'from-green-500 to-emerald-600',
    maxStay: 'N/A (Qualifying test)',
    familyBringing: false,
  },
]

export function getSectorById(id: string): SSWSector | undefined {
  return SSW_SECTORS.find((sector) => sector.id === id)
}

export function getSectorsByCategory(category: string): SSWSector[] {
  return SSW_SECTORS.filter((sector) => sector.categories.includes(category))
}

export function getSectorsByDifficulty(difficulty: SSWSector['difficulty']): SSWSector[] {
  return SSW_SECTORS.filter((sector) => sector.difficulty === difficulty)
}
