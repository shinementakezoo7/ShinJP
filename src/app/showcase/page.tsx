'use client'

import Link from 'next/link'
import { useState } from 'react'
import JapaneseButton, {
  BambooButton,
  SakuraButton,
  TojiGateButton,
} from '@/components/japanese/JapaneseButton'
import JapaneseCard from '@/components/japanese/JapaneseCard'
import JapaneseLoader, {
  EnsoSpinner,
  KanjiPulse,
  SakuraSpinner,
  WaveLoader,
} from '@/components/japanese/JapaneseLoader'
import ThemeToggle from '@/components/theme/ThemeToggle'

export default function ShowcasePage() {
  const [showLoader, setShowLoader] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-red-200/20 dark:border-red-800/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <span className="text-3xl japanese-text text-red-600 dark:text-red-400">侍</span>
            <span className="text-xl font-bold">Japanese UI Showcase</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm font-medium hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <span className="japanese-text text-red-600 dark:text-red-400">日本風</span>{' '}
            <span className="gradient-text bg-gradient-to-r from-red-600 via-pink-600 to-purple-600">
              UI Components
            </span>
          </h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
            A collection of beautifully crafted Japanese-themed UI components featuring traditional
            patterns, seasonal elements, and authentic cultural motifs.
          </p>
        </section>

        {/* Japanese Cards Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="japanese-text">和風カード</span> - Japanese Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <JapaneseCard pattern="seigaiha" gradient="sakura" kanji="桜">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Seigaiha Pattern</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Traditional wave pattern representing peace and tranquility.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🌊</span>
                  <span className="japanese-text text-xl text-red-600 dark:text-red-400">
                    青海波
                  </span>
                </div>
              </div>
            </JapaneseCard>

            <JapaneseCard pattern="asanoha" gradient="autumn" kanji="紅">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Asanoha Pattern</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Hemp leaf pattern symbolizing growth and vitality.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🍁</span>
                  <span className="japanese-text text-xl text-amber-600 dark:text-amber-400">
                    麻の葉
                  </span>
                </div>
              </div>
            </JapaneseCard>

            <JapaneseCard pattern="shippo" gradient="ocean" kanji="海">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Shippo Pattern</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Seven treasures pattern representing harmony and fortune.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">💎</span>
                  <span className="japanese-text text-xl text-blue-600 dark:text-blue-400">
                    七宝
                  </span>
                </div>
              </div>
            </JapaneseCard>

            <JapaneseCard pattern="kikko" gradient="sunset" kanji="亀">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Kikko Pattern</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Tortoise shell pattern symbolizing longevity and wisdom.
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">🐢</span>
                  <span className="japanese-text text-xl text-purple-600 dark:text-purple-400">
                    亀甲
                  </span>
                </div>
              </div>
            </JapaneseCard>

            <JapaneseCard pattern="seigaiha" gradient="sakura" kanji="道">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Interactive Card</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Hover over this card to see the beautiful transition effects.
                </p>
                <button
                  onClick={() => setShowLoader(true)}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
                >
                  Show Loader
                </button>
              </div>
            </JapaneseCard>

            <JapaneseCard pattern="asanoha" gradient="autumn" kanji="侍">
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-4">Seasonal Card</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Cards adapt to the current season with appropriate colors.
                </p>
                <div className="text-4xl text-center mt-4">
                  {new Date().getMonth() >= 3 && new Date().getMonth() <= 5
                    ? '🌸'
                    : new Date().getMonth() >= 6 && new Date().getMonth() <= 8
                      ? '🎋'
                      : new Date().getMonth() >= 9 && new Date().getMonth() <= 11
                        ? '🍁'
                        : '❄️'}
                </div>
              </div>
            </JapaneseCard>
          </div>
        </section>

        {/* Japanese Buttons Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="japanese-text">ボタン</span> - Buttons
          </h2>
          <div className="space-y-8">
            {/* Primary Buttons */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Primary Variants</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <JapaneseButton variant="primary" size="sm">
                  Small Button
                </JapaneseButton>
                <JapaneseButton variant="primary" size="md">
                  Medium Button
                </JapaneseButton>
                <JapaneseButton variant="primary" size="lg">
                  Large Button
                </JapaneseButton>
                <JapaneseButton variant="primary" size="xl">
                  Extra Large
                </JapaneseButton>
              </div>
            </div>

            {/* Secondary Buttons */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Secondary & Ghost</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <JapaneseButton variant="secondary">Secondary</JapaneseButton>
                <JapaneseButton variant="ghost">Ghost Button</JapaneseButton>
                <JapaneseButton variant="sakura">Sakura Theme</JapaneseButton>
                <JapaneseButton variant="primary" disabled>
                  Disabled
                </JapaneseButton>
              </div>
            </div>

            {/* Themed Buttons */}
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Themed Buttons</h3>
              <div className="flex flex-wrap justify-center gap-4">
                <TojiGateButton>Enter Temple</TojiGateButton>
                <SakuraButton>Cherry Blossom</SakuraButton>
                <BambooButton>Bamboo Grove</BambooButton>
                <JapaneseButton variant="primary" leftIcon="🗾" rightIcon="🏯">
                  Explore Japan
                </JapaneseButton>
              </div>
            </div>
          </div>
        </section>

        {/* Japanese Loaders Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="japanese-text">ローディング</span> - Loaders
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-24 flex items-center justify-center mb-4">
                <SakuraSpinner size="lg" />
              </div>
              <p className="text-sm font-medium">Sakura Spinner</p>
            </div>

            <div className="text-center">
              <div className="h-24 flex items-center justify-center mb-4">
                <KanjiPulse size="lg" />
              </div>
              <p className="text-sm font-medium">Kanji Pulse</p>
            </div>

            <div className="text-center">
              <div className="h-24 flex items-center justify-center mb-4">
                <WaveLoader size="lg" />
              </div>
              <p className="text-sm font-medium">Wave Loader</p>
            </div>

            <div className="text-center">
              <div className="h-24 flex items-center justify-center mb-4">
                <EnsoSpinner size="lg" />
              </div>
              <p className="text-sm font-medium">Enso Spinner</p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setShowLoader(true)}
              className="px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
            >
              Show Full Screen Loader
            </button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="japanese-text">特徴</span> - Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Traditional Patterns',
                desc: 'Authentic Japanese patterns like Seigaiha and Asanoha',
              },
              {
                icon: '🌸',
                title: 'Seasonal Elements',
                desc: 'Dynamic seasonal decorations that change with time',
              },
              {
                icon: '📱',
                title: 'Mobile Optimized',
                desc: 'Fully responsive design for all device sizes',
              },
              {
                icon: '🌙',
                title: 'Dark Mode',
                desc: 'Beautiful dark mode with carefully chosen colors',
              },
              {
                icon: '⚡',
                title: 'Performance',
                desc: 'Optimized animations with GPU acceleration',
              },
              { icon: '♿', title: 'Accessible', desc: 'WCAG 2.1 AA compliant components' },
              {
                icon: '🎭',
                title: 'Cultural Authenticity',
                desc: 'Respectful representation of Japanese culture',
              },
              { icon: '🎯', title: 'Interactive', desc: 'Smooth transitions and hover effects' },
              { icon: '🛠️', title: 'Customizable', desc: 'Flexible props for easy customization' },
            ].map((feature, i) => (
              <JapaneseCard
                key={i}
                pattern={i % 2 === 0 ? 'seigaiha' : 'asanoha'}
                gradient={
                  i % 4 === 0 ? 'sakura' : i % 4 === 1 ? 'autumn' : i % 4 === 2 ? 'ocean' : 'sunset'
                }
              >
                <div className="p-6 text-center">
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </JapaneseCard>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-red-200/20 dark:border-red-800/20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-5xl japanese-text text-red-600 dark:text-red-400">侍</span>
            <span className="text-2xl font-bold">Shinmen Takezo</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Crafted with love and respect for Japanese culture
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
              Home
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/demo"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Demo
            </Link>
          </div>
        </div>
      </footer>

      {/* Full Screen Loader Overlay */}
      {showLoader && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 dark:bg-black/90 backdrop-blur-xl cursor-pointer"
          onClick={() => setShowLoader(false)}
        >
          <div className="flex flex-col items-center gap-8">
            <JapaneseLoader variant="enso" size="xl" message="読み込み中..." />
            <p className="text-sm text-gray-600 dark:text-gray-400">Click anywhere to close</p>
          </div>

          {/* Decorative sakura petals */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-sakura-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${i * 1.5}s`,
                  animationDuration: `${10 + i * 2}s`,
                  top: '-50px',
                }}
              >
                <div className="text-4xl opacity-30">🌸</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
