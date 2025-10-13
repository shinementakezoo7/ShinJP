'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface KanjiRevealProps {
  kanji: string
  meaning: string
  reading: string
  color?: string
}

const KANJI_DATA: KanjiRevealProps[] = [
  { kanji: '日', meaning: 'Sun / Day', reading: 'にち・ひ', color: 'from-red-500 to-orange-500' },
  { kanji: '本', meaning: 'Book / Origin', reading: 'ほん', color: 'from-blue-500 to-cyan-500' },
  { kanji: '語', meaning: 'Language', reading: 'ご', color: 'from-purple-500 to-pink-500' },
  {
    kanji: '学',
    meaning: 'Study / Learning',
    reading: 'がく',
    color: 'from-green-500 to-emerald-500',
  },
  {
    kanji: '生',
    meaning: 'Life / Student',
    reading: 'せい',
    color: 'from-amber-500 to-yellow-500',
  },
]

function KanjiRevealItem({ kanji, meaning, reading, color }: KanjiRevealProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const kanjiRef = useRef<HTMLDivElement>(null)
  const meaningRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!cardRef.current || !kanjiRef.current || !meaningRef.current) return

    // Create timeline for this kanji
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 1,
        toggleActions: 'play none none reverse',
      },
    })

    // Kanji animation
    tl.from(kanjiRef.current, {
      scale: 0.3,
      opacity: 0,
      rotationY: -180,
      duration: 1,
      ease: 'back.out(1.7)',
    })

    // Meaning animation
    tl.from(
      meaningRef.current,
      {
        y: 50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
      },
      '-=0.3'
    )

    // Parallax effect on card
    gsap.to(cardRef.current, {
      y: -30,
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    })
  }, [])

  return (
    <div ref={cardRef} className="kanji-reveal-item">
      <div className="relative group">
        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border-2 border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-300">
          {/* Background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-5 rounded-3xl`} />

          {/* Kanji */}
          <div ref={kanjiRef} className="relative">
            <div
              className={`text-9xl japanese-text font-bold text-center mb-4 bg-gradient-to-br ${color} bg-clip-text text-transparent`}
            >
              {kanji}
            </div>
          </div>

          {/* Meaning & Reading */}
          <div ref={meaningRef} className="text-center space-y-2">
            <div className="text-xl font-semibold text-gray-900 dark:text-white">{meaning}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 japanese-text">{reading}</div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full blur-lg opacity-50" />
          <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full blur-lg opacity-50" />
        </div>
      </div>
    </div>
  )
}

export default function ScrollRevealKanji() {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    if (!titleRef.current) return

    // Title animation
    gsap.from(titleRef.current, {
      y: 100,
      opacity: 0,
      scrollTrigger: {
        trigger: titleRef.current,
        start: 'top 90%',
        end: 'top 60%',
        scrub: 1,
      },
    })

    // Stagger animation for all kanji cards
    gsap.from('.kanji-reveal-item', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
      },
      opacity: 0,
      y: 100,
      stagger: 0.2,
      duration: 1,
      ease: 'power2.out',
    })
  }, [])

  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="kanji-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <text
                x="50"
                y="50"
                fontSize="60"
                textAnchor="middle"
                className="japanese-text"
                fill="currentColor"
              >
                語
              </text>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#kanji-pattern)" />
        </svg>
      </div>

      <div ref={containerRef} className="max-w-7xl mx-auto relative z-10">
        {/* Section Title */}
        <div ref={titleRef} className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-red-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
            Master Kanji with <span className="japanese-text">日本語</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Learn Japanese characters through scroll-based animations powered by GSAP ScrollTrigger
          </p>
        </div>

        {/* Kanji Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {KANJI_DATA.map((data, index) => (
            <KanjiRevealItem key={index} {...data} />
          ))}
        </div>

        {/* Call to action */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer">
            <span>Start Learning</span>
            <span className="text-2xl">→</span>
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * USAGE:
 *
 * Add this component to any page where you want scroll-based kanji reveals:
 *
 * import ScrollRevealKanji from '@/components/hero/ScrollRevealKanji'
 *
 * export default function LearningPage() {
 *   return (
 *     <div>
 *       <Hero />
 *       <ScrollRevealKanji />
 *       <OtherContent />
 *     </div>
 *   )
 * }
 *
 * Features:
 * - Scroll-triggered animations with GSAP ScrollTrigger
 * - 3D rotation effects on kanji
 * - Parallax scrolling for depth
 * - Staggered reveals for visual impact
 * - Fully responsive design
 * - Dark mode support
 */
