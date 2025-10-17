'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
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

// Showcase items data
const showcaseItems = [
  {
    id: 1,
    category: 'components',
    title: 'Japanese Cards',
    tagline: 'Traditional patterns meet modern design',
    description:
      'Beautiful cards featuring authentic Japanese patterns like Seigaiha waves and Asanoha hemp leaves.',
    image: '🎴',
    gradient: 'sakura',
    pattern: 'seigaiha',
    kanji: '和',
    featured: true,
  },
  {
    id: 2,
    category: 'components',
    title: 'Dynamic Buttons',
    tagline: 'Interactive elements with liquid effects',
    description: 'Buttons with smooth animations, ripple effects, and Japanese-themed styling.',
    image: '🎋',
    gradient: 'autumn',
    pattern: 'asanoha',
    kanji: '押',
    featured: true,
  },
  {
    id: 3,
    category: 'components',
    title: 'Cultural Loaders',
    tagline: 'Authentic Japanese loading animations',
    description:
      'Loading spinners inspired by Japanese culture - from Sakura petals to Enso circles.',
    image: '⭕',
    gradient: 'ocean',
    pattern: 'shippo',
    kanji: '待',
    featured: false,
  },
  {
    id: 4,
    category: 'patterns',
    title: 'Seigaiha Waves',
    tagline: 'Blue waves of tranquility',
    description: 'Traditional wave patterns representing peace and the endless flow of water.',
    image: '🌊',
    gradient: 'ocean',
    pattern: 'seigaiha',
    kanji: '波',
    featured: false,
  },
  {
    id: 5,
    category: 'patterns',
    title: 'Asanoha Hemp',
    tagline: 'Growth and vitality',
    description: 'Hexagonal hemp leaf patterns symbolizing growth, health, and vitality.',
    image: '🌿',
    gradient: 'autumn',
    pattern: 'asanoha',
    kanji: '麻',
    featured: false,
  },
  {
    id: 6,
    category: 'patterns',
    title: 'Shippo Treasures',
    tagline: 'Seven treasures of harmony',
    description:
      'Overlapping circles creating flower-like patterns representing interconnectedness.',
    image: '💎',
    gradient: 'sunset',
    pattern: 'shippo',
    kanji: '宝',
    featured: false,
  },
  {
    id: 7,
    category: 'patterns',
    title: 'Kikko Tortoise',
    tagline: 'Longevity and wisdom',
    description: 'Hexagonal tortoise shell patterns symbolizing long life and wisdom.',
    image: '🐢',
    gradient: 'sunset',
    pattern: 'kikko',
    kanji: '亀',
    featured: false,
  },
  {
    id: 8,
    category: 'seasonal',
    title: 'Sakura Spring',
    tagline: 'Cherry blossom elegance',
    description: 'Delicate pink hues and falling petals capturing the essence of spring in Japan.',
    image: '🌸',
    gradient: 'sakura',
    pattern: 'seigaiha',
    kanji: '桜',
    featured: true,
  },
  {
    id: 9,
    category: 'seasonal',
    title: 'Autumn Maple',
    tagline: 'Fiery fall colors',
    description: 'Warm reds and oranges inspired by Japanese maple trees in autumn.',
    image: '🍁',
    gradient: 'autumn',
    pattern: 'asanoha',
    kanji: '紅',
    featured: false,
  },
]

const categories = [
  { id: 'all', name: 'All Items', icon: '🌟' },
  { id: 'components', name: 'Components', icon: '🎨' },
  { id: 'patterns', name: 'Patterns', icon: '🔷' },
  { id: 'seasonal', name: 'Seasonal', icon: '🍂' },
]

export default function ShowcasePage() {
  const [showLoader, setShowLoader] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const [isFilterSticky, setIsFilterSticky] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // Handle scroll for parallax effects and sticky filter
  useEffect(() => {
    setIsMounted(true)
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Make filter sticky after hero section
      if (heroRef.current) {
        const heroBottom = heroRef.current.offsetTop + heroRef.current.offsetHeight
        setIsFilterSticky(window.scrollY > heroBottom - 100)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Filter items based on selected category
  const filteredItems =
    selectedCategory === 'all'
      ? showcaseItems
      : showcaseItems.filter((item) => item.category === selectedCategory)

  // Featured items for hero section
  const featuredItems = showcaseItems.filter((item) => item.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-amber-50 to-orange-50 dark:from-gray-950 dark:via-red-950/20 dark:to-orange-950/20 overflow-hidden">
      {/* Decorative Background Elements */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {/* Animated gradient orbs */}
          <div
            className="absolute w-[800px] h-[800px] rounded-full bg-gradient-to-r from-pink-300/20 to-purple-300/20 blur-3xl animate-parallax-float"
            style={{
              top: `${scrollY * 0.1}px`,
              left: `${-200 + scrollY * 0.05}px`,
            }}
          />
          <div
            className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-300/20 to-cyan-300/20 blur-3xl animate-parallax-float"
            style={{
              bottom: `${-300 - scrollY * 0.1}px`,
              right: `${-150 + scrollY * 0.03}px`,
              animationDelay: '2s',
            }}
          />
          <div
            className="absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r from-amber-300/20 to-orange-300/20 blur-3xl animate-parallax-float"
            style={{
              top: `${50 + scrollY * 0.08}%`,
              right: `${-200 + scrollY * 0.04}px`,
              animationDelay: '4s',
            }}
          />

          {/* Floating sakura petals */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`sakura-${i}`}
              className="absolute text-4xl opacity-20 animate-sakura-float"
              style={{
                left: `${15 + i * 15}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: `${15 + i * 3}s`,
              }}
            >
              🌸
            </div>
          ))}
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 dark:bg-black/70 border-b border-red-200/20 dark:border-red-800/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <span className="text-3xl japanese-text text-red-600 dark:text-red-400 transition-transform duration-300 group-hover:scale-110">
              侍
            </span>
            <span className="text-xl font-bold bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              Japanese UI Showcase
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/"
              className="text-sm font-medium hover:text-red-600 dark:hover:text-red-400 transition-colors relative group"
            >
              Back to Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center px-4 py-20"
      >
        {isMounted && (
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{
              transform: `translateY(${scrollY * 0.2}px)`,
            }}
          >
            <span className="text-[15rem] japanese-text text-red-800/5 dark:text-red-400/5 font-black select-none animate-hero-kanji-float">
              美
            </span>
          </div>
        )}
        <div className="text-center max-w-5xl mx-auto relative z-10">
          {/* Hero content */}
          <div className="relative z-10 animate-text-reveal">
            <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
              <span className="japanese-text text-red-600 dark:text-red-400 block animate-float">
                日本風
              </span>
              <span className="gradient-text bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 block">
                UI Components
              </span>
            </h1>
            <p
              className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-text-reveal"
              style={{ animationDelay: '0.3s' }}
            >
              A collection of beautifully crafted Japanese-themed UI components featuring
              traditional patterns, seasonal elements, and authentic cultural motifs.
            </p>

            {/* Featured items preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {featuredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="animate-card-entrance"
                  style={{ animationDelay: `${0.6 + index * 0.2}s` }}
                >
                  <JapaneseCard
                    pattern={item.pattern as any}
                    gradient={item.gradient as any}
                    kanji={item.kanji}
                    className="h-full showcase-card-hover gpu-accelerated"
                  >
                    <div className="p-6 text-center">
                      <div className="card-image text-5xl mb-4 transition-transform duration-500">
                        {item.image}
                      </div>
                      <h3 className="card-title text-xl font-bold mb-2 transition-all duration-300">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {item.tagline}
                      </p>
                      <JapaneseButton
                        size="sm"
                        variant="primary"
                        onClick={() => setHoveredItem(item.id)}
                        className="group/btn"
                      >
                        <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                          Explore
                        </span>
                        <span className="ml-1 transition-transform duration-300 group-hover/btn:translate-x-2">
                          →
                        </span>
                      </JapaneseButton>
                    </div>
                  </JapaneseCard>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <TojiGateButton size="lg">Explore Components</TojiGateButton>
              <SakuraButton size="lg">View Patterns</SakuraButton>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="text-2xl text-gray-400">↓</div>
        </div>
      </section>

      {/* Sticky Filter Section */}
      <div
        className={`relative z-30 transition-all duration-300 ${isFilterSticky ? 'sticky top-16' : ''}`}
      >
        <div
          className={`backdrop-blur-xl bg-white/80 dark:bg-black/80 border-b border-red-200/20 dark:border-red-800/20 py-4 transition-all duration-300 ${isFilterSticky ? 'filter-sticky' : ''}`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-2 animate-filter-slide">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`filter-button px-6 py-3 rounded-full font-medium transform hover:scale-105 ${
                    selectedCategory === category.id
                      ? 'active'
                      : 'bg-white/50 dark:bg-black/50 text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-950/20 border border-red-200/30 dark:border-red-800/30'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Showcase Grid */}
      <main className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-black mb-4 animate-text-reveal">
            <span className="japanese-text text-red-600 dark:text-red-400">作品集</span>
            <span className="block text-gray-800 dark:text-gray-200">Showcase Gallery</span>
          </h2>
          <p
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto animate-text-reveal"
            style={{ animationDelay: '0.2s' }}
          >
            Explore our collection of Japanese-inspired UI components, each crafted with attention
            to detail and cultural authenticity.
          </p>
        </div>

        {/* Showcase Items Grid */}
        <div className="showcase-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="showcase-item animate-card-entrance"
              style={{ animationDelay: `${0.4 + index * 0.1}s` }}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <JapaneseCard
                pattern={item.pattern as any}
                gradient={item.gradient as any}
                kanji={item.kanji}
                className="h-full group showcase-card-hover gpu-accelerated"
              >
                <div className="p-8 h-full flex flex-col">
                  {/* Item image with hover effect */}
                  <div className="text-center mb-6 relative overflow-hidden">
                    <div
                      className={`card-image text-6xl transition-all duration-500 ${
                        hoveredItem === item.id ? 'scale-125 rotate-12' : ''
                      }`}
                    >
                      {item.image}
                    </div>
                    {/* Decorative ring on hover */}
                    {hoveredItem === item.id && (
                      <div className="absolute inset-0 rounded-full border-4 border-red-400/30 animate-glow-pulse-slow"></div>
                    )}
                  </div>

                  {/* Item content */}
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="card-title text-2xl font-bold transition-all duration-300">
                        {item.title}
                      </h3>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 transition-all duration-300 group-hover:scale-105">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-3 italic transition-colors duration-300 group-hover:text-red-700 dark:group-hover:text-red-300">
                      {item.tagline}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-auto">
                    <JapaneseButton
                      variant="primary"
                      className="w-full group/btn"
                      onClick={() => setShowLoader(true)}
                    >
                      <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                        Explore {item.title}
                      </span>
                      <span className="ml-2 transition-transform duration-300 group-hover/btn:translate-x-2">
                        →
                      </span>
                    </JapaneseButton>
                  </div>
                </div>
              </JapaneseCard>
            </div>
          ))}
        </div>

        {/* Empty state for filtered results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2">No items found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try selecting a different category to explore more components.
            </p>
            <JapaneseButton variant="primary" onClick={() => setSelectedCategory('all')}>
              View All Items
            </JapaneseButton>
          </div>
        )}

        {/* Additional Features Section */}
        <section className="mt-24 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-4 animate-text-reveal">
              <span className="japanese-text text-red-600 dark:text-red-400">特徴</span>
              <span className="block text-gray-800 dark:text-gray-200">Key Features</span>
            </h2>
          </div>

          <div className="showcase-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Traditional Patterns',
                desc: 'Authentic Japanese patterns like Seigaiha and Asanoha',
                gradient: 'sakura',
              },
              {
                icon: '🌸',
                title: 'Seasonal Elements',
                desc: 'Dynamic seasonal decorations that change with time',
                gradient: 'autumn',
              },
              {
                icon: '📱',
                title: 'Mobile Optimized',
                desc: 'Fully responsive design for all device sizes',
                gradient: 'ocean',
              },
              {
                icon: '🌙',
                title: 'Dark Mode',
                desc: 'Beautiful dark mode with carefully chosen colors',
                gradient: 'sunset',
              },
              {
                icon: '⚡',
                title: 'Performance',
                desc: 'Optimized animations with GPU acceleration',
                gradient: 'sakura',
              },
              {
                icon: '♿',
                title: 'Accessible',
                desc: 'WCAG 2.1 AA compliant components',
                gradient: 'autumn',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="showcase-item animate-card-entrance"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <JapaneseCard
                  key={i}
                  pattern={i % 2 === 0 ? 'seigaiha' : 'asanoha'}
                  gradient={feature.gradient as any}
                  className="showcase-card-hover gpu-accelerated h-full"
                >
                  <div className="p-6 text-center h-full flex flex-col justify-center">
                    <div className="text-5xl mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                      {feature.icon}
                    </div>
                    <h3 className="card-title text-xl font-bold mb-2 transition-all duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
                  </div>
                </JapaneseCard>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-24 border-t border-red-200/20 dark:border-red-800/20 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-4 mb-4">
            <span className="text-5xl japanese-text text-red-600 dark:text-red-400">侍</span>
            <span className="text-2xl font-bold">Shinmen Takezo</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Crafted with love and respect for Japanese culture
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/dashboard"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors relative group"
            >
              Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/demo"
              className="hover:text-red-600 dark:hover:text-red-400 transition-colors relative group"
            >
              Demo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
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
