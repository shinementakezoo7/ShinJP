/**
 * JLPT Content Database
 *
 * Comprehensive seed data for Japanese language learning
 * Includes grammar patterns, vocabulary, kanji, slang, and cultural content
 * organized by JLPT level (N5-N1)
 */

import type {
  GrammarPattern,
  KanjiEntry,
  KeigoPattern,
  SlangExpression,
  VocabularyEntry,
} from './jlpt-content-spec'

// ============================================================================
// N5 GRAMMAR PATTERNS (Foundation - 80 patterns)
// ============================================================================

export const N5_GRAMMAR_PATTERNS: GrammarPattern[] = [
  {
    id: 'gp-n5-001',
    pattern: '～ている',
    pattern_hiragana: 'ている',
    jlpt_level: 'N5',
    frequency_score: 100,

    meanings: {
      primary: 'Continuous action or resultant state',
      secondary: [
        'Ongoing action (progressive aspect)',
        'Resultant state (perfect aspect)',
        'Habitual action',
      ],
      nuances: 'Context determines whether it expresses ongoing action or a state',
    },

    formation_rules: {
      structure: 'Verb (て-form) + いる',
      verb_forms: [
        'Group 1 (u-verbs): 書く → 書いて → 書いている',
        'Group 2 (ru-verbs): 食べる → 食べて → 食べている',
        'Irregular: する → して → している',
        'Irregular: 来る → 来て → 来ている',
      ],
    },

    usage_contexts: [
      'Describing actions happening right now',
      'Describing states that continue as result of past action',
      'Describing habitual or repeated actions',
      'Describing current occupation or residence',
    ],

    formality_level: 'neutral',

    examples: [
      {
        japanese: '今、勉強しています。',
        romaji: 'Ima, benkyō shite imasu.',
        english: 'I am studying now.',
        formality: 'formal',
        context: 'Ongoing action - present progressive',
        breakdown: [
          { word: '今', reading: 'いま', meaning: 'now', part_of_speech: 'adverb' },
          { word: '勉強', reading: 'べんきょう', meaning: 'study', part_of_speech: 'noun' },
          { word: 'して', reading: 'して', meaning: 'doing', part_of_speech: 'te-form verb' },
          {
            word: 'います',
            reading: 'います',
            meaning: 'to be (polite)',
            part_of_speech: 'auxiliary verb',
          },
        ],
      },
      {
        japanese: '雨が降っている。',
        romaji: 'Ame ga futte iru.',
        english: "It's raining.",
        formality: 'casual',
        context: 'Ongoing natural phenomenon',
        breakdown: [
          { word: '雨', reading: 'あめ', meaning: 'rain', part_of_speech: 'noun' },
          { word: 'が', reading: 'が', meaning: 'subject marker', part_of_speech: 'particle' },
          { word: '降って', reading: 'ふって', meaning: 'falling', part_of_speech: 'te-form verb' },
          { word: 'いる', reading: 'いる', meaning: 'to be', part_of_speech: 'auxiliary verb' },
        ],
      },
      {
        japanese: '窓が開いている。',
        romaji: 'Mado ga aite iru.',
        english: 'The window is open.',
        formality: 'neutral',
        context: 'Resultant state - the window was opened and remains open',
        breakdown: [
          { word: '窓', reading: 'まど', meaning: 'window', part_of_speech: 'noun' },
          { word: 'が', reading: 'が', meaning: 'subject marker', part_of_speech: 'particle' },
          { word: '開いて', reading: 'あいて', meaning: 'opened', part_of_speech: 'te-form verb' },
          { word: 'いる', reading: 'いる', meaning: 'to be', part_of_speech: 'auxiliary verb' },
        ],
      },
      {
        japanese: '彼は結婚している。',
        romaji: 'Kare wa kekkon shite iru.',
        english: 'He is married.',
        formality: 'neutral',
        context: 'Resultant state - got married and still is',
        breakdown: [
          { word: '彼', reading: 'かれ', meaning: 'he', part_of_speech: 'pronoun' },
          { word: 'は', reading: 'は', meaning: 'topic marker', part_of_speech: 'particle' },
          { word: '結婚', reading: 'けっこん', meaning: 'marriage', part_of_speech: 'noun' },
          { word: 'して', reading: 'して', meaning: 'doing', part_of_speech: 'te-form verb' },
          { word: 'いる', reading: 'いる', meaning: 'to be', part_of_speech: 'auxiliary verb' },
        ],
      },
      {
        japanese: '毎日走っています。',
        romaji: 'Mainichi hashitte imasu.',
        english: 'I run every day.',
        formality: 'formal',
        context: 'Habitual action',
        breakdown: [
          { word: '毎日', reading: 'まいにち', meaning: 'every day', part_of_speech: 'adverb' },
          {
            word: '走って',
            reading: 'はしって',
            meaning: 'running',
            part_of_speech: 'te-form verb',
          },
          {
            word: 'います',
            reading: 'います',
            meaning: 'to be (polite)',
            part_of_speech: 'auxiliary verb',
          },
        ],
      },
      {
        japanese: '何してるの？',
        romaji: 'Nani shiteru no?',
        english: 'What are you doing?',
        formality: 'casual',
        context: 'Casual question with contraction',
        breakdown: [
          { word: '何', reading: 'なに', meaning: 'what', part_of_speech: 'pronoun' },
          {
            word: 'してる',
            reading: 'してる',
            meaning: 'doing (contracted)',
            part_of_speech: 'te-form verb',
          },
          {
            word: 'の',
            reading: 'の',
            meaning: 'question marker (casual)',
            part_of_speech: 'particle',
          },
        ],
      },
      {
        japanese: '兄は東京に住んでいます。',
        romaji: 'Ani wa Tōkyō ni sunde imasu.',
        english: 'My older brother lives in Tokyo.',
        formality: 'formal',
        context: 'Current residence',
        breakdown: [
          { word: '兄', reading: 'あに', meaning: 'older brother', part_of_speech: 'noun' },
          { word: 'は', reading: 'は', meaning: 'topic marker', part_of_speech: 'particle' },
          { word: '東京', reading: 'とうきょう', meaning: 'Tokyo', part_of_speech: 'proper noun' },
          { word: 'に', reading: 'に', meaning: 'in/at', part_of_speech: 'particle' },
          { word: '住んで', reading: 'すんで', meaning: 'living', part_of_speech: 'te-form verb' },
          {
            word: 'います',
            reading: 'います',
            meaning: 'to be (polite)',
            part_of_speech: 'auxiliary verb',
          },
        ],
      },
    ],

    common_mistakes: [
      {
        error: 'Using dictionary form instead of te-form',
        correction: 'Must use て-form + いる, not dictionary form',
        explanation: 'The pattern requires the て-form of the verb, not the dictionary form',
        example_wrong: '×今、勉強するいる',
        example_correct: '○今、勉強している',
      },
      {
        error: 'Confusing ongoing action with habitual action',
        correction: 'Use time markers: 今 (now) vs 毎日 (every day)',
        explanation: 'Context determines meaning; time expressions clarify intention',
        example_wrong: 'Ambiguous without context',
        example_correct: '今走っている (running now) vs 毎日走っている (run every day)',
      },
      {
        error: 'Using with stative verbs incorrectly',
        correction: 'Some stative verbs MUST use ている form',
        explanation: 'Verbs like 知る (to know) require ている: 知っている (to know)',
        example_wrong: '×日本語を知る',
        example_correct: '○日本語を知っている',
      },
    ],

    related_grammar: ['gp-n5-te-form', 'gp-n4-te-aru', 'gp-n4-te-oku'],
    prerequisites: ['gp-n5-te-form-basic', 'gp-n5-iru-aru'],

    casual_variations: [
      'ている → てる (食べている → 食べてる)',
      'ているの → てんの (何してるの → 何してんの)',
      'ているんだ → てんだ (知ってるんだ → 知ってんだ)',
    ],

    cultural_notes:
      'Essential for phone etiquette: "今、話しているんですが..." (I\'m talking right now...) is a common polite way to indicate you\'re busy.',

    practice_exercises: [
      {
        type: 'fill_in_blank',
        question: "今、雨が＿＿＿＿。(It's raining now.)",
        answer: '降っている',
        explanation: 'Use ている form to express ongoing weather',
        difficulty: 1,
      },
      {
        type: 'transformation',
        question: 'Transform to casual: 勉強しています',
        answer: '勉強してる',
        explanation: 'Drop います → いる, contract to てる',
        difficulty: 2,
      },
      {
        type: 'choice',
        question: 'Which expresses a current state? A) 窓を開けた B) 窓が開いている',
        options: ['A) 窓を開けた', 'B) 窓が開いている'],
        answer: 'B) 窓が開いている',
        explanation: 'B expresses the current state (window IS open), A is simple past (opened)',
        difficulty: 3,
      },
    ],
  },

  {
    id: 'gp-n5-002',
    pattern: '～てください',
    pattern_hiragana: 'てください',
    jlpt_level: 'N5',
    frequency_score: 95,

    meanings: {
      primary: 'Please do (polite request)',
      secondary: ['Making polite requests', 'Giving polite instructions'],
      nuances: 'Standard polite form; not the most formal but appropriate for most situations',
    },

    formation_rules: {
      structure: 'Verb (て-form) + ください',
      verb_forms: [
        'Group 1: 書く → 書いて → 書いてください',
        'Group 2: 食べる → 食べて → 食べてください',
        'Irregular: する → して → してください',
        'Irregular: 来る → 来て → 来てください',
      ],
    },

    usage_contexts: [
      'Making requests in daily life',
      'Instructions in classroom or work',
      'Service situations (shops, restaurants)',
      'Asking for help or favors',
    ],

    formality_level: 'formal',

    examples: [
      {
        japanese: 'ちょっと待ってください。',
        romaji: 'Chotto matte kudasai.',
        english: 'Please wait a moment.',
        formality: 'formal',
        context: 'Common request in daily situations',
      },
      {
        japanese: '窓を開けてください。',
        romaji: 'Mado wo akete kudasai.',
        english: 'Please open the window.',
        formality: 'formal',
        context: 'Polite instruction',
      },
      {
        japanese: 'ここに名前を書いてください。',
        romaji: 'Koko ni namae wo kaite kudasai.',
        english: 'Please write your name here.',
        formality: 'formal',
        context: 'Filling out forms',
      },
      {
        japanese: 'もう一度言ってください。',
        romaji: 'Mō ichido itte kudasai.',
        english: 'Please say it one more time.',
        formality: 'formal',
        context: 'Asking for repetition',
      },
      {
        japanese: '静かにしてください。',
        romaji: 'Shizuka ni shite kudasai.',
        english: 'Please be quiet.',
        formality: 'formal',
        context: 'Polite instruction to be quiet',
      },
    ],

    common_mistakes: [
      {
        error: 'Using wrong verb form',
        correction: 'Must use て-form, not dictionary form or ます form',
        explanation: 'ください attaches to the て-form specifically',
        example_wrong: '×待つください or ×待いますください',
        example_correct: '○待ってください',
      },
      {
        error: 'Being too direct with superiors',
        correction: 'Add もらえませんか or いただけませんか for more politeness',
        explanation: 'てください is polite but not the most respectful form',
        example_wrong: '社長、これを見てください (too direct)',
        example_correct: '社長、これを見ていただけませんか',
      },
    ],

    related_grammar: ['gp-n5-te-form', 'gp-n4-te-moraemasu-ka', 'gp-n3-te-itadakemasu-ka'],
    prerequisites: ['gp-n5-te-form-basic'],

    casual_variations: [
      'てください → て (食べてください → 食べて)',
      'Very casual: てくれ (among close friends/family)',
    ],

    cultural_notes:
      'Adding すみません (excuse me) before the request makes it more polite: すみません、ちょっと待ってください。',

    practice_exercises: [
      {
        type: 'fill_in_blank',
        question: '静かに＿＿＿＿。(Please be quiet.)',
        answer: 'してください',
        explanation: 'Use てください form for polite requests',
        difficulty: 1,
      },
      {
        type: 'transformation',
        question: 'Make a polite request: 食べる → ?',
        answer: '食べてください',
        explanation: 'Convert to て-form and add ください',
        difficulty: 1,
      },
    ],
  },

  {
    id: 'gp-n5-003',
    pattern: '～たい',
    pattern_hiragana: 'たい',
    jlpt_level: 'N5',
    frequency_score: 98,

    meanings: {
      primary: 'Want to do (desire to perform action)',
      secondary: ['Expressing personal wishes', 'Talking about desires'],
      nuances: "Conjugates like an い-adjective; only for speaker's desires in statements",
    },

    formation_rules: {
      structure: 'Verb (ます-stem) + たい',
      verb_forms: [
        'Group 1: 書きます → 書き → 書きたい',
        'Group 2: 食べます → 食べ → 食べたい',
        'Irregular: します → し → したい',
        'Irregular: 来ます → 来 → 来たい (きたい)',
      ],
    },

    usage_contexts: [
      'Expressing personal wants',
      'Talking about desires and wishes',
      'Planning future activities',
      "Questions about others' wants",
    ],

    formality_level: 'neutral',

    examples: [
      {
        japanese: '寿司が食べたい。',
        romaji: 'Sushi ga tabetai.',
        english: 'I want to eat sushi.',
        formality: 'casual',
        context: 'Expressing personal desire',
      },
      {
        japanese: '日本に行きたいです。',
        romaji: 'Nihon ni ikitai desu.',
        english: 'I want to go to Japan.',
        formality: 'formal',
        context: 'Polite expression of desire',
      },
      {
        japanese: '何が飲みたいですか。',
        romaji: 'Nani ga nomitai desu ka.',
        english: 'What do you want to drink?',
        formality: 'formal',
        context: "Asking about someone's preference",
      },
      {
        japanese: '映画を見たくない。',
        romaji: 'Eiga wo mitakunai.',
        english: "I don't want to watch a movie.",
        formality: 'casual',
        context: 'Negative form of desire',
      },
      {
        japanese: '早く帰りたいです。',
        romaji: 'Hayaku kaeritai desu.',
        english: 'I want to go home early.',
        formality: 'formal',
        context: 'Expressing wish to leave',
      },
    ],

    common_mistakes: [
      {
        error: 'Using を instead of が with たい',
        correction: 'Object takes が particle, not を',
        explanation: 'たい functions like an adjective, so the object takes が',
        example_wrong: '×寿司を食べたい',
        example_correct: '○寿司が食べたい (though を is also acceptable in modern usage)',
      },
      {
        error: "Using for others' desires in statements",
        correction: 'Use たがっている for third person',
        explanation: "たい is only for speaker's desires; use たがっている for others",
        example_wrong: '×田中さんは行きたい',
        example_correct: '○田中さんは行きたがっている',
      },
    ],

    related_grammar: ['gp-n4-tagaru', 'gp-n5-hoshii', 'gp-n4-tai-to-omou'],
    prerequisites: ['gp-n5-masu-stem'],

    casual_variations: [
      'たいです → たい (食べたいです → 食べたい)',
      'Very casual: てー (行きたい → 行きてー)',
    ],

    cultural_notes:
      "In formal situations with superiors, use もう少し～たいんですが (I'd like to... but...) to sound less direct and more humble.",

    practice_exercises: [
      {
        type: 'fill_in_blank',
        question: '日本語を勉強＿＿＿。(I want to study Japanese.)',
        answer: 'したい',
        explanation: 'Add たい to the ます-stem',
        difficulty: 1,
      },
      {
        type: 'transformation',
        question: 'Make negative: 行きたい → ?',
        answer: '行きたくない',
        explanation: 'Change たい to たくない (like い-adjective)',
        difficulty: 2,
      },
    ],
  },

  // Additional N5 patterns would continue here...
  // Total target: 80 patterns
]

// ============================================================================
// N5 VOCABULARY (Foundation - 800 words)
// ============================================================================

export const N5_VOCABULARY: VocabularyEntry[] = [
  {
    id: 'vocab-n5-001',
    word: '食べる',
    reading: 'たべる',
    romaji: 'taberu',

    word_type: 'verb_ichidan',
    jlpt_level: 'N5',
    frequency_rank: 234,

    meanings: {
      primary: 'to eat',
      secondary: ['to consume', 'to have a meal'],
      context_specific: [
        {
          context: 'formal/polite',
          meaning: '召し上がる (honorific)',
          example: 'どうぞ召し上がってください',
        },
        { context: 'humble', meaning: 'いただく', example: 'ごはんをいただきます' },
      ],
    },

    kanji_breakdown: [{ kanji: '食', reading_in_word: 'た', reading_type: 'kun_yomi' }],

    conjugations: {
      dictionary_form: '食べる',
      masu_form: '食べます',
      te_form: '食べて',
      ta_form: '食べた',
      nai_form: '食べない',
      potential: '食べられる',
      passive: '食べられる',
      causative: '食べさせる',
      causative_passive: '食べさせられる',
      volitional: '食べよう',
      conditional: '食べれば',
      imperative: '食べろ / 食べなさい',
      provisional: '食べたら',
    },

    example_sentences: [
      {
        japanese: '朝ごはんを食べます。',
        romaji: 'Asa gohan wo tabemasu.',
        english: 'I eat breakfast.',
        formality: 'formal',
        context: 'Daily routine',
      },
      {
        japanese: '寿司を食べたい！',
        romaji: 'Sushi wo tabetai!',
        english: 'I want to eat sushi!',
        formality: 'casual',
        context: 'Expressing desire',
      },
      {
        japanese: '昨日、ラーメンを食べました。',
        romaji: 'Kinō, rāmen wo tabemashita.',
        english: 'I ate ramen yesterday.',
        formality: 'formal',
        context: 'Past action',
      },
      {
        japanese: '何か食べましょうか。',
        romaji: 'Nanika tabemashō ka.',
        english: 'Shall we eat something?',
        formality: 'formal',
        context: 'Making suggestion',
      },
    ],

    collocations: [
      'ご飯を食べる (to eat rice/meal)',
      '朝食を食べる (to eat breakfast)',
      '外で食べる (to eat out)',
      '一緒に食べる (to eat together)',
    ],

    synonyms: [
      {
        word: '召し上がる',
        reading: 'めしあがる',
        meaning: 'to eat (honorific)',
        note: 'Use for superiors',
      },
      {
        word: 'いただく',
        reading: 'いただく',
        meaning: 'to eat/receive (humble)',
        note: 'Use for yourself in formal situations',
      },
    ],

    antonyms: [],

    related_words: [
      { word: '飲む', reading: 'のむ', meaning: 'to drink', note: 'Sister verb for liquids' },
      { word: '料理', reading: 'りょうり', meaning: 'cooking, cuisine' },
      { word: 'レストラン', reading: 'れすとらん', meaning: 'restaurant' },
    ],

    formality_level: 'neutral',

    usage_notes: 'Essential verb for daily life. Remember: を marks the object being eaten.',

    cultural_context:
      'Japanese say いただきます (itadakimasu) before eating and ごちそうさまでした (gochisōsama deshita) after finishing.',

    slang_casual_forms: [
      {
        form: '食う',
        usage: 'Crude/masculine form',
        formality: 'very_casual',
        age_group: 'Primarily male speech',
      },
      {
        form: '食べちゃう',
        usage: 'Casual contraction',
        formality: 'casual',
        age_group: 'All ages',
      },
    ],

    pitch_accent_pattern: 'LHL',
    pitch_accent_type: 'nakadaka',

    audio_files: ['/audio/vocab/taberu.mp3'],

    common_mistakes: [
      {
        error: 'Using wrong particle',
        correction: 'Use を for the object being eaten, not は or が',
        explanation: '食べる is a transitive verb requiring を',
        example_wrong: '×ご飯が食べる',
        example_correct: '○ご飯を食べる',
      },
    ],
  },

  // Additional 799 vocabulary entries would continue...
]

// ============================================================================
// N5 KANJI (Foundation - 103 characters)
// ============================================================================

export const N5_KANJI: KanjiEntry[] = [
  {
    id: 'kanji-n5-001',
    character: '日',

    jlpt_level: 'N5',
    joyo_grade: 1,
    frequency_rank: 5,

    stroke_count: 4,
    stroke_order: {
      sequence: ['left_vertical', 'top_horizontal', 'bottom_horizontal', 'right_vertical'],
      animation_url: '/animations/kanji/日.gif',
      image_url: '/images/kanji/日.png',
      description:
        'Draw left vertical, then top horizontal, bottom horizontal, close with right vertical',
    },

    radicals: {
      primary: '日',
      components: ['日'],
      position: 'other',
    },

    meanings: ['day', 'sun', 'Japan', 'counter for days'],

    readings: {
      on_yomi: [
        { reading: 'ニチ', compounds: ['日曜日', '毎日', '本日'] },
        { reading: 'ジツ', compounds: ['日時', '日数'] },
      ],
      kun_yomi: [
        { reading: 'ひ', variations: ['び'], compounds: ['日', '日差し', '休日'] },
        { reading: 'か', compounds: ['三日', '四日', '二十日'] },
      ],
      special_readings: [
        { word: '今日', reading: 'きょう', meaning: 'today', note: 'Irregular reading' },
        { word: '明日', reading: 'あした', meaning: 'tomorrow', note: 'Irregular reading' },
        { word: '昨日', reading: 'きのう', meaning: 'yesterday', note: 'Irregular reading' },
      ],
    },

    visual_etymology:
      'Originally a circle with a dot representing the sun. Evolved into current rectangular form.',
    historical_forms: ['☉', '◎'],

    common_words: [
      {
        word: '日本',
        reading: 'にほん',
        meaning: 'Japan',
        frequency: 'very_high',
        jlpt_level: 'N5',
      },
      {
        word: '毎日',
        reading: 'まいにち',
        meaning: 'every day',
        frequency: 'very_high',
        jlpt_level: 'N5',
      },
      {
        word: '日曜日',
        reading: 'にちようび',
        meaning: 'Sunday',
        frequency: 'very_high',
        jlpt_level: 'N5',
      },
      {
        word: '今日',
        reading: 'きょう',
        meaning: 'today',
        frequency: 'very_high',
        jlpt_level: 'N5',
      },
      {
        word: '明日',
        reading: 'あした',
        meaning: 'tomorrow',
        frequency: 'very_high',
        jlpt_level: 'N5',
      },
      {
        word: '昨日',
        reading: 'きのう',
        meaning: 'yesterday',
        frequency: 'very_high',
        jlpt_level: 'N5',
      },
      {
        word: '誕生日',
        reading: 'たんじょうび',
        meaning: 'birthday',
        frequency: 'high',
        jlpt_level: 'N5',
      },
      {
        word: '休日',
        reading: 'きゅうじつ',
        meaning: 'holiday',
        frequency: 'high',
        jlpt_level: 'N4',
      },
    ],

    example_sentences: [
      {
        japanese: '今日は日曜日です。',
        romaji: 'Kyō wa nichiyōbi desu.',
        english: 'Today is Sunday.',
        jlpt_level: 'N5',
        kanji_focus: ['日'],
      },
      {
        japanese: '日本の夏は暑いです。',
        romaji: 'Nihon no natsu wa atsui desu.',
        english: 'Summer in Japan is hot.',
        jlpt_level: 'N5',
        kanji_focus: ['日', '本'],
      },
      {
        japanese: '毎日、勉強します。',
        romaji: 'Mainichi, benkyō shimasu.',
        english: 'I study every day.',
        jlpt_level: 'N5',
        kanji_focus: ['日'],
      },
    ],

    mnemonics: [
      'Picture a window (口) with the sun shining through it',
      'The sun rises every DAY',
      'Japan (日本) is the land of the rising SUN',
    ],

    similar_looking: ['目', '田', '白', '百'],
    similar_meaning: ['陽', '太陽'],

    writing_tips:
      'Ensure the rectangle is wider than it is tall. The horizontal strokes should not extend beyond the vertical strokes.',

    common_mistakes: [
      {
        error: 'Making it too square',
        correction: 'It should be clearly rectangular (wider than tall)',
        explanation: 'Proper proportions distinguish it from similar kanji like 目 (eye)',
      },
      {
        error: 'Forgetting special readings',
        correction: 'Memorize 今日(きょう), 明日(あした), 昨日(きのう)',
        explanation: 'These are irregular but extremely common',
      },
    ],

    cultural_notes:
      '日 is fundamental to Japanese identity, appearing in the country name 日本 (nihon/nippon), meaning "origin of the sun" or "land of the rising sun".',

    idioms_proverbs: [
      {
        expression: '日日是好日',
        reading: 'にちにちこれこうじつ',
        meaning: 'Every day is a good day',
        origin: 'Zen Buddhism',
      },
    ],
  },

  // Additional 102 kanji entries would continue...
]

// ============================================================================
// MODERN COLLOQUIAL JAPANESE (Youth Slang & Internet Language)
// ============================================================================

export const MODERN_SLANG: SlangExpression[] = [
  {
    id: 'slang-001',
    expression: 'やばい',
    reading: 'やばい',
    romaji: 'yabai',

    category: 'youth_slang',

    origin: 'Originally criminal slang meaning "dangerous/risky"',
    etymology: 'From や (arrow) + ばい (bad), or possibly from 厄場い (yakubai)',

    meanings: [
      'Awesome, amazing, incredible (positive)',
      'Terrible, dangerous, oh no (negative)',
      'Very, extremely (intensifier)',
    ],

    variations: [
      { form: 'ヤバい', usage: 'Written with katakana for emphasis' },
      { form: 'ヤバっ', usage: 'Shortened exclamation' },
      { form: 'やばみ', usage: 'Noun form (internet slang)' },
      { form: 'やばたん', usage: 'Cute/playful variation' },
      { form: 'ヤバすぎる', usage: 'Too amazing/terrible' },
    ],

    example_conversations: [
      {
        context: 'Seeing amazing food',
        dialogue: [
          {
            speaker: 'A',
            japanese: 'このラーメン見て！',
            romaji: 'Kono rāmen mite!',
            english: 'Look at this ramen!',
          },
          {
            speaker: 'B',
            japanese: 'やばっ！めっちゃ美味しそう！',
            romaji: 'Yaba! Meccha oishisō!',
            english: 'Wow! It looks super delicious!',
          },
        ],
        formality: 'very_casual',
        age_group: 'teens-30s',
      },
      {
        context: 'Realizing a problem',
        dialogue: [
          {
            speaker: 'A',
            japanese: 'やばい、宿題忘れた！',
            romaji: 'Yabai, shukudai wasureta!',
            english: 'Oh no, I forgot my homework!',
          },
        ],
        formality: 'casual',
        age_group: 'students',
      },
      {
        context: 'Reacting to impressive skill',
        dialogue: [
          {
            speaker: 'A',
            japanese: 'この曲弾けるの？',
            romaji: 'Kono kyoku hikeru no?',
            english: 'You can play this song?',
          },
          {
            speaker: 'B',
            japanese: 'うん、ちょっとね。',
            romaji: 'Un, chotto ne.',
            english: 'Yeah, a little.',
          },
          {
            speaker: 'A',
            japanese: 'やばい！すごい！',
            romaji: 'Yabai! Sugoi!',
            english: "Wow! That's amazing!",
          },
        ],
        formality: 'casual',
      },
    ],

    formality_level: 'very_casual',
    age_group: 'Mainly teens to 30s, but understood by all',
    region: 'Nationwide',

    usage_period: '1990s-present (evolved from negative to positive)',
    trending_status: 'stable',

    platforms: ['street', 'LINE', 'Twitter', 'Instagram', 'TikTok', 'YouTube'],

    equivalent_formal_expression: 'すごい (sugoi) / 大変だ (taihen da)',
    equivalent_standard_japanese: 'とても良い (totemo yoi) / とても悪い (totemo warui)',

    usage_warnings:
      'Avoid in business settings, formal situations, or with people much older. Can sound immature if overused.',

    appropriateness: [
      { situation: 'With friends', appropriate: true, note: 'Very common and natural' },
      {
        situation: 'Business meeting',
        appropriate: false,
        note: 'Too casual, sounds unprofessional',
      },
      { situation: 'Social media', appropriate: true, note: 'Widely used and accepted' },
      {
        situation: 'With elders',
        appropriate: false,
        note: 'Can be seen as disrespectful unless very close',
      },
      { situation: 'Casual restaurant', appropriate: true, note: 'Fine among peers' },
    ],
  },

  {
    id: 'slang-002',
    expression: 'マジ',
    reading: 'まじ',
    romaji: 'maji',

    category: 'youth_slang',

    origin: 'Shortened from 真面目 (majime - serious)',
    etymology: 'Originally from the word for "serious/earnest"',

    meanings: [
      'Seriously, really, for real',
      'Genuine, not joking',
      'Very, extremely (as intensifier)',
    ],

    variations: [
      { form: 'マジで', usage: 'Adverbial form - "seriously"' },
      { form: 'マジ？', usage: 'Question - "Really?"' },
      { form: 'マジか', usage: 'Masculine exclamation - "Seriously?"' },
      { form: 'マジ卍', usage: 'Internet slang, emphasis' },
    ],

    example_conversations: [
      {
        context: 'Confirming information',
        dialogue: [
          {
            speaker: 'A',
            japanese: '明日テストだって。',
            romaji: 'Ashita tesuto da tte.',
            english: "I heard there's a test tomorrow.",
          },
          {
            speaker: 'B',
            japanese: 'マジ？知らなかった！',
            romaji: 'Maji? Shiranakatta!',
            english: "Seriously? I didn't know!",
          },
        ],
        formality: 'casual',
      },
      {
        context: 'Emphasizing',
        dialogue: [
          {
            speaker: 'A',
            japanese: 'この映画マジで面白いよ。',
            romaji: 'Kono eiga maji de omoshiroi yo.',
            english: 'This movie is seriously interesting.',
          },
        ],
        formality: 'casual',
      },
    ],

    formality_level: 'casual',
    age_group: 'All ages under 60',
    region: 'Nationwide',

    usage_period: '1980s-present',
    trending_status: 'stable',

    platforms: ['street', 'LINE', 'Twitter', 'Instagram', 'gaming'],

    equivalent_formal_expression: '本当に (hontō ni)',
    equivalent_standard_japanese: '本当に、実に (hontō ni, jitsu ni)',

    appropriateness: [
      { situation: 'With friends', appropriate: true, note: 'Very natural' },
      { situation: 'Business', appropriate: false, note: 'Use 本当に instead' },
      { situation: 'Family', appropriate: true, note: 'Common in casual family talk' },
    ],
  },

  {
    id: 'slang-003',
    expression: '草',
    reading: 'くさ',
    romaji: 'kusa',

    category: 'internet_slang',

    origin: 'From wwww (warau - laugh), which looks like grass',
    etymology: 'ｗ represents laughter (warau); multiple ｗｗｗｗ looks like grass (草)',

    meanings: ['LOL, haha (internet laughter)', "That's funny", 'Laughing'],

    variations: [
      { form: 'ｗ', usage: 'Single w = slight laugh' },
      { form: 'ｗｗｗ', usage: 'Multiple w = laughing' },
      { form: '草生える', usage: 'Literally "grass grows" = very funny' },
      { form: '大草原', usage: 'Great grassland = hilarious' },
    ],

    example_conversations: [
      {
        context: 'Online chat',
        dialogue: [
          {
            speaker: 'A',
            japanese: '今日派手に転んだｗｗｗ',
            romaji: 'Kyō hade ni koronda www',
            english: 'I tripped spectacularly today lol',
          },
          { speaker: 'B', japanese: '草', romaji: 'Kusa', english: 'lol' },
        ],
        formality: 'very_casual',
      },
    ],

    formality_level: 'very_casual',
    age_group: 'Teens to 30s',
    region: 'Nationwide',

    usage_period: '2010s-present',
    trending_status: 'stable',

    platforms: ['Twitter', '2channel', 'Niconico', 'Discord', 'gaming'],

    equivalent_standard_japanese: '笑う (warau)',

    appropriateness: [
      { situation: 'Online chat', appropriate: true, note: 'Very common' },
      { situation: 'Spoken conversation', appropriate: false, note: 'Primarily text-based' },
      { situation: 'Formal writing', appropriate: false, note: 'Internet slang only' },
    ],
  },

  // Additional slang entries would continue...
]

// ============================================================================
// KEIGO PATTERNS (Honorific Language System)
// ============================================================================

export const KEIGO_PATTERNS: KeigoPattern[] = [
  {
    id: 'keigo-001',
    plain_form: '行く',
    respectful_form: 'いらっしゃる / おいでになる',
    humble_form: '伺う / 参る',

    verb_type: 'motion_verb',
    jlpt_level: 'N4',

    usage_context: {
      respectful: ['Superior going somewhere', 'Customer/guest arriving', 'Formal situations'],
      humble: ['Speaking about your own going', 'Visiting someone of higher status'],
    },

    examples: [
      {
        situation: 'Customer service',
        sentence: 'いらっしゃいませ。',
        translation: 'Welcome (to our store).',
        formality: 'respectful',
        appropriate: true,
      },
      {
        situation: 'Business meeting',
        sentence: '社長はもういらっしゃいましたか。',
        translation: 'Has the president arrived yet?',
        formality: 'respectful',
        appropriate: true,
      },
      {
        situation: 'Visiting client',
        sentence: '明日、お宅に伺います。',
        translation: 'I will visit your home tomorrow.',
        formality: 'humble',
        appropriate: true,
      },
    ],

    common_mistakes: [
      {
        error: 'Using humble form for others',
        correction: 'Use respectful form for others, humble for yourself',
        explanation: "Never use humble form (伺う) for someone else's actions",
        example_wrong: '×社長が伺いました',
        example_correct: '○社長がいらっしゃいました',
      },
    ],
  },

  // Additional 49+ keigo patterns would continue...
]

// ============================================================================
// EXPORT ALL DATABASES
// ============================================================================

export const JLPT_CONTENT_DATABASE = {
  grammar: {
    N5: N5_GRAMMAR_PATTERNS,
    N4: [], // To be populated
    N3: [], // To be populated
    N2: [], // To be populated
    N1: [], // To be populated
  },
  vocabulary: {
    N5: N5_VOCABULARY,
    N4: [], // To be populated
    N3: [], // To be populated
    N2: [], // To be populated
    N1: [], // To be populated
  },
  kanji: {
    N5: N5_KANJI,
    N4: [], // To be populated
    N3: [], // To be populated
    N2: [], // To be populated
    N1: [], // To be populated
  },
  colloquial: {
    slang: MODERN_SLANG,
    keigo: KEIGO_PATTERNS,
    dialects: [], // To be populated
  },
}

export default JLPT_CONTENT_DATABASE
