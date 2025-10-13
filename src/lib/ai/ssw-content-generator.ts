/**
 * SSW Content Generator
 * Generates JLPT-aligned workplace Japanese content for Specified Skilled Workers
 * Supports SSW Type 1 (N4), Type 2 (N3), and JFT-Basic test preparation
 */

import { ModelTask, modelRouter } from './model-router'

// ============================================================================
// SECTOR SPECIFICATIONS
// ============================================================================

export const SECTOR_SPECIFICATIONS = {
  caregiving: {
    name: '介護 (Caregiving)',
    critical_vocabulary: [
      { word: '利用者', reading: 'りようしゃ', meaning: 'care service user', critical: true },
      { word: '服薬', reading: 'ふくやく', meaning: 'taking medication', critical: true },
      {
        word: '緊急連絡',
        reading: 'きんきゅうれんらく',
        meaning: 'emergency contact',
        critical: true,
      },
      { word: '転倒', reading: 'てんとう', meaning: 'fall/tumble', critical: true },
      { word: '入浴', reading: 'にゅうよく', meaning: 'bathing', critical: true },
      {
        word: '食事介助',
        reading: 'しょくじかいじょ',
        meaning: 'meal assistance',
        critical: false,
      },
      { word: '排泄', reading: 'はいせつ', meaning: 'excretion', critical: false },
      { word: '体位変換', reading: 'たいいへんかん', meaning: 'position change', critical: false },
    ],
    common_scenarios: [
      'morning_care',
      'medication',
      'emergency',
      'communication_with_family',
      'meal_assistance',
    ],
    safety_priorities: [
      'fall_prevention',
      'medication_safety',
      'infection_control',
      'emergency_response',
    ],
    cultural_notes:
      'Use respectful language (keigo) when addressing elderly care users. Always confirm understanding.',
  },

  construction: {
    name: '建設 (Construction)',
    critical_vocabulary: [
      { word: '安全帯', reading: 'あんぜんたい', meaning: 'safety harness', critical: true },
      { word: '現場', reading: 'げんば', meaning: 'construction site', critical: false },
      { word: '危険', reading: 'きけん', meaning: 'danger', critical: true },
      { word: '立入禁止', reading: 'たちいりきんし', meaning: 'no entry', critical: true },
      { word: 'ヘルメット', reading: 'へるめっと', meaning: 'helmet', critical: true },
      { word: '作業員', reading: 'さぎょういん', meaning: 'worker', critical: false },
      { word: '資材', reading: 'しざい', meaning: 'materials', critical: false },
      { word: '工程', reading: 'こうてい', meaning: 'process', critical: false },
    ],
    common_scenarios: ['safety_briefing', 'tool_usage', 'emergency_procedures', 'daily_operations'],
    safety_priorities: ['ppe_usage', 'hazard_awareness', 'emergency_response', 'equipment_safety'],
    cultural_notes:
      'Hierarchical structure is important. Always follow supervisor instructions precisely.',
  },

  agriculture: {
    name: '農業 (Agriculture)',
    critical_vocabulary: [
      { word: '農薬', reading: 'のうやく', meaning: 'pesticide', critical: true },
      { word: '収穫', reading: 'しゅうかく', meaning: 'harvest', critical: false },
      { word: '種まき', reading: 'たねまき', meaning: 'sowing seeds', critical: false },
      { word: '水やり', reading: 'みずやり', meaning: 'watering', critical: false },
      { word: '温室', reading: 'おんしつ', meaning: 'greenhouse', critical: false },
      { word: '肥料', reading: 'ひりょう', meaning: 'fertilizer', critical: false },
    ],
    common_scenarios: ['daily_tasks', 'harvest_season', 'equipment_operation', 'weather_concerns'],
    safety_priorities: ['pesticide_handling', 'equipment_safety', 'weather_awareness'],
    cultural_notes: 'Agricultural work requires early morning starts. Punctuality is crucial.',
  },

  food_service: {
    name: '外食業 (Food Service)',
    critical_vocabulary: [
      { word: 'アレルギー', reading: 'あれるぎー', meaning: 'allergy', critical: true },
      { word: '食中毒', reading: 'しょくちゅうどく', meaning: 'food poisoning', critical: true },
      { word: 'お客様', reading: 'おきゃくさま', meaning: 'customer (honorific)', critical: false },
      { word: '注文', reading: 'ちゅうもん', meaning: 'order', critical: false },
      { word: '衛生', reading: 'えいせい', meaning: 'hygiene', critical: true },
      { word: '調理', reading: 'ちょうり', meaning: 'cooking', critical: false },
    ],
    common_scenarios: ['taking_orders', 'food_safety', 'customer_service', 'kitchen_operations'],
    safety_priorities: ['food_safety', 'hygiene', 'allergy_awareness'],
    cultural_notes:
      'Customer service (omotenashi) is paramount. Always use polite language with customers.',
  },

  building_cleaning: {
    name: 'ビルクリーニング (Building Cleaning)',
    critical_vocabulary: [
      { word: '洗剤', reading: 'せんざい', meaning: 'detergent', critical: true },
      { word: '清掃', reading: 'せいそう', meaning: 'cleaning', critical: false },
      { word: '消毒', reading: 'しょうどく', meaning: 'disinfection', critical: true },
      { word: '廃棄物', reading: 'はいきぶつ', meaning: 'waste', critical: false },
    ],
    common_scenarios: ['daily_cleaning', 'chemical_handling', 'waste_management'],
    safety_priorities: ['chemical_safety', 'proper_ppe', 'waste_handling'],
    cultural_notes: 'Attention to detail is crucial. Work must be thorough and efficient.',
  },

  manufacturing: {
    name: '製造業 (Manufacturing)',
    critical_vocabulary: [
      { word: '機械', reading: 'きかい', meaning: 'machinery', critical: true },
      { word: '不良品', reading: 'ふりょうひん', meaning: 'defective product', critical: false },
      { word: '品質管理', reading: 'ひんしつかんり', meaning: 'quality control', critical: false },
      { word: '組立', reading: 'くみたて', meaning: 'assembly', critical: false },
      { word: '検査', reading: 'けんさ', meaning: 'inspection', critical: false },
    ],
    common_scenarios: ['production_line', 'quality_check', 'equipment_maintenance'],
    safety_priorities: ['machine_safety', 'quality_assurance', 'safety_procedures'],
    cultural_notes: 'Precision and consistency are valued. Follow procedures exactly.',
  },

  accommodation: {
    name: '宿泊 (Accommodation)',
    critical_vocabulary: [
      { word: 'チェックイン', reading: 'ちぇっくいん', meaning: 'check-in', critical: false },
      { word: 'お客様', reading: 'おきゃくさま', meaning: 'guest (honorific)', critical: false },
      { word: '予約', reading: 'よやく', meaning: 'reservation', critical: false },
      { word: '清掃', reading: 'せいそう', meaning: 'cleaning', critical: false },
      { word: 'フロント', reading: 'ふろんと', meaning: 'front desk', critical: false },
    ],
    common_scenarios: ['check_in', 'room_service', 'guest_requests', 'problem_resolution'],
    safety_priorities: ['guest_safety', 'emergency_procedures', 'security'],
    cultural_notes: 'Hospitality (omotenashi) is key. Anticipate guest needs before they ask.',
  },

  fishery: {
    name: '漁業 (Fishery)',
    critical_vocabulary: [
      { word: '漁', reading: 'りょう', meaning: 'fishing', critical: false },
      { word: '網', reading: 'あみ', meaning: 'net', critical: false },
      { word: '船', reading: 'ふね', meaning: 'boat/ship', critical: false },
      { word: '養殖', reading: 'ようしょく', meaning: 'aquaculture', critical: false },
    ],
    common_scenarios: ['fishing_operations', 'equipment_handling', 'catch_processing'],
    safety_priorities: ['maritime_safety', 'weather_awareness', 'equipment_safety'],
    cultural_notes: 'Maritime work requires teamwork and quick response to changing conditions.',
  },

  aviation: {
    name: '航空 (Aviation)',
    critical_vocabulary: [
      { word: '搭乗', reading: 'とうじょう', meaning: 'boarding', critical: false },
      { word: '手荷物', reading: 'てにもつ', meaning: 'baggage', critical: false },
      { word: '保安検査', reading: 'ほあんけんさ', meaning: 'security check', critical: true },
      { word: '出発', reading: 'しゅっぱつ', meaning: 'departure', critical: false },
    ],
    common_scenarios: ['check_in', 'security', 'boarding', 'baggage_handling'],
    safety_priorities: ['security_procedures', 'safety_protocols', 'emergency_response'],
    cultural_notes: 'Precision and protocol adherence are critical. Safety is the top priority.',
  },

  automotive: {
    name: '自動車整備 (Automotive Maintenance)',
    critical_vocabulary: [
      { word: '整備', reading: 'せいび', meaning: 'maintenance', critical: false },
      { word: '点検', reading: 'てんけん', meaning: 'inspection', critical: false },
      { word: '部品', reading: 'ぶひん', meaning: 'parts', critical: false },
      { word: '修理', reading: 'しゅうり', meaning: 'repair', critical: false },
    ],
    common_scenarios: ['vehicle_inspection', 'repair_work', 'customer_explanation'],
    safety_priorities: ['equipment_safety', 'proper_procedures', 'quality_work'],
    cultural_notes: 'Customer trust is paramount. Explain work clearly and honestly.',
  },

  shipbuilding: {
    name: '造船 (Shipbuilding)',
    critical_vocabulary: [
      { word: '溶接', reading: 'ようせつ', meaning: 'welding', critical: true },
      { word: '船体', reading: 'せんたい', meaning: 'hull', critical: false },
      { word: '設計図', reading: 'せっけいず', meaning: 'blueprint', critical: false },
    ],
    common_scenarios: ['construction_work', 'safety_procedures', 'quality_control'],
    safety_priorities: ['welding_safety', 'height_safety', 'equipment_operation'],
    cultural_notes: 'Precision work requiring high skill. Follow blueprints exactly.',
  },

  food_manufacturing: {
    name: '飲食料品製造 (Food Manufacturing)',
    critical_vocabulary: [
      {
        word: '衛生管理',
        reading: 'えいせいかんり',
        meaning: 'hygiene management',
        critical: true,
      },
      { word: '原材料', reading: 'げんざいりょう', meaning: 'raw materials', critical: false },
      { word: '賞味期限', reading: 'しょうみきげん', meaning: 'best before date', critical: true },
      { word: '製造', reading: 'せいぞう', meaning: 'manufacturing', critical: false },
    ],
    common_scenarios: ['production', 'quality_check', 'hygiene_procedures', 'packaging'],
    safety_priorities: ['food_safety', 'hygiene', 'quality_control'],
    cultural_notes: 'Food safety is non-negotiable. Strict hygiene standards must be followed.',
  },

  material_processing: {
    name: '素形材産業 (Material Processing)',
    critical_vocabulary: [
      { word: '金属', reading: 'きんぞく', meaning: 'metal', critical: false },
      { word: '加工', reading: 'かこう', meaning: 'processing', critical: false },
      { word: '機械', reading: 'きかい', meaning: 'machinery', critical: true },
    ],
    common_scenarios: ['material_handling', 'machine_operation', 'quality_inspection'],
    safety_priorities: ['machine_safety', 'protective_equipment', 'proper_procedures'],
    cultural_notes: 'Precision is critical. Even small errors can affect quality.',
  },

  industrial_machinery: {
    name: '産業機械製造 (Industrial Machinery Manufacturing)',
    critical_vocabulary: [
      {
        word: '機械製造',
        reading: 'きかいせいぞう',
        meaning: 'machinery manufacturing',
        critical: false,
      },
      { word: '設計', reading: 'せっけい', meaning: 'design', critical: false },
      { word: '組立', reading: 'くみたて', meaning: 'assembly', critical: false },
    ],
    common_scenarios: ['assembly', 'testing', 'quality_assurance'],
    safety_priorities: ['equipment_safety', 'precision_work', 'testing_procedures'],
    cultural_notes: 'High precision work. Quality and safety standards are strict.',
  },
} as const

// ============================================================================
// CONTENT GENERATION FUNCTIONS
// ============================================================================

export interface SSWContentGenerationParams {
  sswType: 'SSW1' | 'SSW2' | 'JFT-Basic'
  sector: string
  chapterNumber: number
  focusAreas: string[]
  includeWorkplaceScenarios: boolean
  includeSafetyVocabulary: boolean
}

export async function generateSSWContent(params: SSWContentGenerationParams) {
  const sectorKey = params.sector as keyof typeof SECTOR_SPECIFICATIONS
  const sectorSpec = SECTOR_SPECIFICATIONS[sectorKey] || SECTOR_SPECIFICATIONS.caregiving

  console.log(`🎯 Generating SSW ${params.sswType} content for ${sectorSpec.name}`)
  console.log(`   Chapter: ${params.chapterNumber}`)
  console.log(`   Focus: ${params.focusAreas.join(', ') || 'General'}`)

  const jlptLevel = params.sswType === 'SSW1' ? 'N4' : params.sswType === 'SSW2' ? 'N3' : 'N4'

  const prompt = buildSSWPrompt(params, sectorSpec, jlptLevel)

  try {
    const response = await modelRouter.route({
      task: ModelTask.TEXTBOOK_GENERATION,
      messages: [
        {
          role: 'system',
          content: getSSWSystemPrompt(params.sswType, params.sector),
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      maxTokens: 12000,
    })

    // Parse and validate response
    let content = response.content.trim()

    // Remove markdown code blocks if present
    content = content
      .replace(/```json\s*/gi, '')
      .replace(/```\s*$/gi, '')
      .trim()

    // Try to extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      content = jsonMatch[0]
    }

    const parsedContent = JSON.parse(content)

    // Validate required fields
    if (!parsedContent.title) {
      parsedContent.title = `Chapter ${params.chapterNumber}: ${sectorSpec.name} Basics`
    }

    if (!parsedContent.introduction) {
      parsedContent.introduction = `This chapter covers essential workplace Japanese for the ${sectorSpec.name} sector.`
    }

    console.log(`✅ Generated SSW content: "${parsedContent.title}"`)

    return parsedContent
  } catch (error) {
    console.error('❌ Error generating SSW content:', error)
    throw new Error(
      `Failed to generate SSW content: ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

function buildSSWPrompt(
  params: SSWContentGenerationParams,
  sectorSpec: any,
  jlptLevel: string
): string {
  const criticalVocab = sectorSpec.critical_vocabulary.filter((v: any) => v.critical)
  const regularVocab = sectorSpec.critical_vocabulary.filter((v: any) => !v.critical)

  return `Create Chapter ${params.chapterNumber} for ${params.sswType} (JLPT ${jlptLevel} level) workplace Japanese training.

SECTOR: ${sectorSpec.name}
AUDIENCE: Foreign workers preparing for ${params.sswType} visa
LANGUAGE LEVEL: ${jlptLevel} (${params.sswType === 'SSW1' ? 'Basic workplace communication' : 'Advanced workplace communication'})

CRITICAL SAFETY VOCABULARY (MUST INCLUDE ALL):
${criticalVocab.map((v: any, i: number) => `${i + 1}. ${v.word} (${v.reading}) - ${v.meaning}`).join('\n')}

ADDITIONAL SECTOR VOCABULARY:
${regularVocab
  .slice(0, 10)
  .map((v: any, i: number) => `${i + 1}. ${v.word} (${v.reading}) - ${v.meaning}`)
  .join('\n')}

COMMON WORKPLACE SCENARIOS:
${sectorSpec.common_scenarios.map((s: string, i: number) => `${i + 1}. ${s}`).join('\n')}

SAFETY PRIORITIES:
${sectorSpec.safety_priorities.map((p: string, i: number) => `${i + 1}. ${p}`).join('\n')}

CULTURAL CONTEXT:
${sectorSpec.cultural_notes}

OUTPUT REQUIREMENTS (MUST BE VALID JSON):
{
  "title": "Engaging chapter title relevant to ${params.sector}",
  "introduction": "2-3 paragraph introduction explaining why this chapter matters for ${params.sector} workers",
  "vocabulary": [
    {
      "word": "Japanese word",
      "reading": "Hiragana reading",
      "romaji": "Romanization",
      "meaning": "English meaning",
      "usage_context": "When/how to use in ${params.sector} workplace",
      "is_safety_critical": true/false,
      "example_sentence": {
        "japanese": "Example sentence using the word",
        "english": "English translation",
        "workplace_context": "Specific work situation"
      },
      "formality_level": "casual/polite/formal"
    }
  ],
  ${
    params.includeWorkplaceScenarios
      ? `"workplaceScenarios": [
    {
      "title": "Scenario title",
      "setting": "Detailed description of the workplace setting",
      "dialogue": [
        {"speaker": "Name", "role": "Position (e.g., Supervisor)", "japanese": "Japanese sentence", "romaji": "Romanization", "english": "Translation"}
      ],
      "key_phrases": ["Important phrase 1", "Important phrase 2"],
      "cultural_notes": "Important cultural or etiquette notes for this scenario",
      "vocabulary_used": ["vocab1", "vocab2"]
    }
  ],`
      : ''
  }
  ${
    params.includeSafetyVocabulary
      ? `"safetyNotes": [
    {
      "topic": "Safety topic",
      "warning": "What workers need to be aware of",
      "proper_procedure": "Correct way to handle/respond",
      "critical_vocabulary": ["term1", "term2"],
      "consequences": "What happens if not followed"
    }
  ],`
      : ''
  }
  "grammarPoints": [
    {
      "pattern": "Grammar pattern (e.g., ～てください)",
      "meaning": "What it means",
      "usage": "When to use in workplace",
      "examples": [
        {"japanese": "Example", "english": "Translation", "context": "Workplace situation"}
      ]
    }
  ],
  "practiceExercises": [
    {
      "type": "fill_in_blank",
      "question": "Question with blank for vocabulary/grammar",
      "options": ["option1", "option2", "option3", "option4"],
      "answer": "Correct option",
      "explanation": "Why this is correct",
      "workplace_relevance": "Why this matters at work"
    }
  ],
  "culturalInsights": [
    {
      "topic": "Cultural topic",
      "explanation": "What workers need to know",
      "dos": ["What to do"],
      "donts": ["What to avoid"],
      "real_example": "Real workplace scenario"
    }
  ]
}

IMPORTANT REQUIREMENTS:
1. ALL vocabulary must be appropriate for ${jlptLevel} level
2. MUST include all critical safety vocabulary
3. Examples must be realistic workplace situations
4. Use natural, conversational Japanese
5. Include both formal and casual workplace language
6. Focus on practical, immediately useful communication
7. Emphasize safety and proper procedures
8. Include cultural context for workplace behavior
9. Output MUST be valid JSON only (no markdown, no code blocks)
10. Make content relevant to actual ${params.sector} work tasks

Generate the complete chapter content now as valid JSON.`
}

function getSSWSystemPrompt(sswType: string, sector: string): string {
  return `You are an expert instructor specializing in teaching workplace Japanese to foreign workers pursuing the ${sswType} (Specified Skilled Worker) visa. 

You have deep expertise in:
- Japanese workplace culture and communication
- The ${sector} industry in Japan
- JLPT language standards (N4 for SSW1, N3 for SSW2)
- Safety procedures and critical workplace vocabulary
- Cross-cultural workplace communication
- Practical language that workers will use daily

Your teaching approach:
- Focuses on immediate practical use in workplace
- Emphasizes safety-critical vocabulary and procedures
- Provides cultural context for proper workplace behavior
- Uses realistic workplace scenarios and dialogues
- Teaches both formal business language and casual workplace communication
- Includes warnings about common mistakes or cultural misunderstandings

You always respond with VALID JSON only. No markdown, no code blocks, just pure JSON.`
}

export default generateSSWContent
