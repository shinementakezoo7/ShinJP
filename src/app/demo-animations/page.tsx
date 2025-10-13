'use client'

import { useState } from 'react'
import StrokeAnimatorGSAP from '@/components/kanji/StrokeAnimatorGSAP'
import LottieReward from '@/components/rewards/LottieReward'
import ScrollRevealKanji from '@/components/hero/ScrollRevealKanji'
import Link from 'next/link'

export default function AnimationDemoPage() {
  const [showAchievement, setShowAchievement] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showStreak, setShowStreak] = useState(false)
  const [showPerfect, setShowPerfect] = useState(false)
  const [selectedKanji, setSelectedKanji] = useState('日')

  const availableKanji = ['一', '二', '三', '日', '月', '木', '山']

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                🎨 Animation Showcase
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                GSAP + Lottie + ScrollTrigger Demos
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ← Back Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 space-y-16">
        {/* Section 1: GSAP Kanji Stroke Animator */}
        <section>
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              1️⃣ GSAP Kanji Stroke Animator
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Professional 60fps kanji animations with timeline control, pause/resume, and reverse
              playback
            </p>
          </div>

          {/* Kanji selector */}
          <div className="mb-6 flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-gray-700 dark:text-gray-300">Select Kanji:</span>
            {availableKanji.map((kanji) => (
              <button
                key={kanji}
                onClick={() => setSelectedKanji(kanji)}
                className={`px-4 py-2 rounded-lg font-bold japanese-text text-2xl transition-all ${
                  selectedKanji === kanji
                    ? 'bg-indigo-600 text-white shadow-lg scale-110'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-indigo-100 dark:hover:bg-gray-700'
                }`}
              >
                {kanji}
              </button>
            ))}
          </div>

          {/* Animator */}
          <div className="max-w-2xl">
            <StrokeAnimatorGSAP kanji={selectedKanji} strokeDuration={0.8} strokeDelay={0.3} />
          </div>

          {/* Features list */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">✨ Features:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
              <li>✅ Timeline-based animation control</li>
              <li>✅ Pause, resume, and reverse</li>
              <li>✅ Adjustable speed (0.5x - 2x)</li>
              <li>✅ Progress tracking</li>
              <li>✅ 60fps smooth strokes</li>
              <li>✅ Show all strokes instantly</li>
              <li>✅ GPU-accelerated</li>
              <li>✅ Dark mode support</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Lottie Reward Animations */}
        <section>
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              2️⃣ Lottie Reward Animations
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Celebration animations for achievements, level ups, streaks, and perfect scores
            </p>
          </div>

          {/* Trigger buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => setShowAchievement(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-3">🏆</div>
              <div className="font-bold text-lg">Achievement</div>
              <div className="text-sm opacity-90">Badge unlocked</div>
            </button>

            <button
              onClick={() => setShowLevelUp(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-3">⬆️</div>
              <div className="font-bold text-lg">Level Up</div>
              <div className="text-sm opacity-90">Next level reached</div>
            </button>

            <button
              onClick={() => setShowStreak(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-3">🔥</div>
              <div className="font-bold text-lg">Streak</div>
              <div className="text-sm opacity-90">7 days in a row</div>
            </button>

            <button
              onClick={() => setShowPerfect(true)}
              className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <div className="text-5xl mb-3">⭐</div>
              <div className="font-bold text-lg">Perfect</div>
              <div className="text-sm opacity-90">100% correct</div>
            </button>
          </div>

          {/* Features */}
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">✨ Features:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 dark:text-gray-300">
              <li>✅ Multiple reward types</li>
              <li>✅ Auto-hide with customizable duration</li>
              <li>✅ Animated confetti particles</li>
              <li>✅ Custom titles and subtitles</li>
              <li>✅ Lottie JSON support</li>
              <li>✅ OnComplete callbacks</li>
              <li>✅ Backdrop blur effect</li>
              <li>✅ Responsive design</li>
            </ul>
          </div>

          {/* Note about Lottie files */}
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              📝 <strong>Note:</strong> Currently using placeholder emoji animations. Download free
              Lottie animations from{' '}
              <a
                href="https://lottiefiles.com/search?q=japanese"
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-semibold hover:text-blue-700"
              >
                LottieFiles.com
              </a>{' '}
              to replace with professional animations.
            </p>
          </div>
        </section>

        {/* Section 3: Scroll-triggered Kanji Reveals */}
        <section>
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-3 text-gray-900 dark:text-white">
              3️⃣ GSAP ScrollTrigger Kanji Reveals
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Scroll down to see kanji animate in with 3D rotation and parallax effects
            </p>
          </div>

          <ScrollRevealKanji />
        </section>

        {/* Installation Guide */}
        <section className="mt-20">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
            <h2 className="text-3xl font-bold mb-4">🚀 Implementation Guide</h2>
            <p className="text-lg mb-6 text-indigo-100">
              All these animations are production-ready and optimized for performance.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <strong className="block mb-1">Libraries Used:</strong>
                  <code className="text-indigo-200">
                    gsap@3.13.0, @gsap/react@2.1.2, lottie-react@2.4.1, framer-motion@12.23.22
                  </code>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">📁</span>
                <div>
                  <strong className="block mb-1">Components Location:</strong>
                  <ul className="list-disc list-inside text-indigo-200 space-y-1">
                    <li>src/components/kanji/StrokeAnimatorGSAP.tsx</li>
                    <li>src/components/rewards/LottieReward.tsx</li>
                    <li>src/components/hero/ScrollRevealKanji.tsx</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-2xl">⚡</span>
                <div>
                  <strong className="block mb-1">Performance:</strong>
                  <span className="text-indigo-200">
                    60fps animations • GPU-accelerated • Bundle size optimized
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Reward Animations (hidden until triggered) */}
      <LottieReward
        show={showAchievement}
        type="achievement"
        title="Achievement Unlocked!"
        subtitle="You've completed N5 Level 1"
        onComplete={() => setShowAchievement(false)}
      />

      <LottieReward
        show={showLevelUp}
        type="levelUp"
        title="Level Up!"
        subtitle="You're now N4 level"
        onComplete={() => setShowLevelUp(false)}
      />

      <LottieReward
        show={showStreak}
        type="streak"
        title="7 Day Streak! 🔥"
        subtitle="Keep up the amazing work!"
        onComplete={() => setShowStreak(false)}
      />

      <LottieReward
        show={showPerfect}
        type="perfect"
        title="Perfect Score!"
        subtitle="100% correct answers!"
        onComplete={() => setShowPerfect(false)}
      />
    </div>
  )
}
