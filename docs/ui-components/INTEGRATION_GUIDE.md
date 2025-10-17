# Integration Guide: Complete Japanese-Themed Hero Section

## Overview
This guide provides step-by-step instructions for integrating all Japanese-themed hero components into a cohesive, performant, and culturally authentic experience.

## Final Integration Architecture

### Master Component Structure
```typescript
// src/components/hero/JapaneseHeroMaster.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/lib/theme/theme-context'
import { useKotoSound } from '@/hooks/useKotoSound'

// Core visual components
import KintsugiGoldDivider from '@/components/japanese/KintsugiGoldDivider'
import ParallaxMountFuji from '@/components/japanese/ParallaxMountFuji'
import KanjiCalligraphy from '@/components/japanese/KanjiCalligraphy'
import ShojiGridOverlay from '@/components/japanese/ShojiGridOverlay'
import EnhancedOrigamiCrane from '@/components/japanese/EnhancedOrigamiCrane'
import InkSakuraGradient from '@/components/japanese/InkSakuraGradient'

// Enhanced components
import SakuraPetals from '@/components/japanese/SakuraPetals'
import SeigaihaWaves from '@/components/japanese/SeigaihaWaves'

export default function JapaneseHeroMaster() {
  const { resolvedTheme } = useTheme()
  const [scrollY, setScrollY] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Koto sound system
  const { playClick } = useKotoSound({
    volume: 0.5,
    stringPattern: [0, 2, 4, 7],
    tuning: 'hirajoshi'
  })

  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    setIsMounted(true)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleCTAClick = () => {
    playClick()
    // Navigate to dashboard or trigger next action
    window.location.href = '/dashboard'
  }

  return (
    <section 
      ref={heroRef}
      className={`japanese-hero-master theme-${resolvedTheme}`}
      data-mounted={isMounted}
    >
      {/* Layer 1: Background Gradient System */}
      <InkSakuraGradient 
        gradientType="conic"
        animationSpeed={15}
        particleDensity={50}
      />

      {/* Layer 2: Shoji Grid Overlay */}
      <ShojiGridOverlay 
        gridSize={80}
        opacity={0.06}
        flexIntensity={0.4}
        scrollResponsiveness={0.8}
      />

      {/* Layer 3: Parallax Mount Fuji */}
      <ParallaxMountFuji 
        layers={7}
        scrollSpeed={0.3}
        vanishPoint={75}
        opacityCurve="ease"
      />

      {/* Layer 4: Traditional Patterns */}
      <div className="traditional-patterns">
        <SeigaihaWaves className="opacity-20" />
      </div>

      {/* Layer 5: Floating Elements */}
      <SakuraPetals count={20} />

      {/* Layer 6: Main Content */}
      <div className="hero-content-container">
        <div className="hero-content">
          {/* Top Kintsugi Divider */}
          <KintsugiGoldDivider 
            orientation="horizontal"
            thickness={4}
            animationSpeed={8}
            glowIntensity={0.7}
            className="mb-12"
          />

          {/* Main Title with Kanji */}
          <div className="hero-title-section">
            <div className="kanji-decoration">
              <KanjiCalligraphy kanji="侍" size={120} sparklerIntensity="intense" />
              <KanjiCalligraphy kanji="道" size={100} sparklerIntensity="medium" />
              <KanjiCalligraphy kanji="武" size={100} sparklerIntensity="medium" />
            </div>

            <h1 className="hero-title">
              <span className="title-main">Master Japanese</span>
              <span className="title-sub">from N5 to N1</span>
            </h1>
          </div>

          {/* Middle Kintsugi Divider */}
          <KintsugiGoldDivider 
            orientation="horizontal"
            thickness={3}
            animationSpeed={6}
            glowIntensity={0.5}
            className="my-12"
          />

          {/* Description */}
          <p className="hero-description">
            Begin your <span className="japanese-text">武道</span> (budō) journey with 
            AI-powered personalized learning, traditional teaching methods, and 
            immersive cultural experiences.
          </p>

          {/* CTA Section with Origami Crane */}
          <div className="hero-cta-section">
            <EnhancedOrigamiCrane
              initialPosition={{ x: 0, y: 0, z: 0 }}
              foldDuration={2500}
              ctaText="Begin Your Journey"
              onTransformComplete={handleCTAClick}
            />
          </div>

          {/* Stats Section */}
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">5</div>
              <div className="stat-label">JLPT Levels</div>
              <div className="stat-japanese">五段階</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1K+</div>
              <div className="stat-label">Vocabulary</div>
              <div className="stat-japanese">語彙</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">AI</div>
              <div className="stat-label">Powered</div>
              <div className="stat-japanese">人工知能</div>
            </div>
          </div>

          {/* Bottom Kintsugi Divider */}
          <KintsugiGoldDivider 
            orientation="horizontal"
            thickness={2}
            animationSpeed={10}
            glowIntensity={0.3}
            className="mt-16"
          />

          {/* Scroll Indicator */}
          <div className="scroll-indicator">
            <p className="scroll-text">Scroll to Discover</p>
            <div className="scroll-icon">
              <div className="scroll-dot"></div>
            </div>
            <span className="scroll-kanji">↓</span>
          </div>
        </div>
      </div>

      {/* Bottom Fade */}
      <div className="hero-fade-bottom"></div>
    </section>
  )
}
```

## CSS Integration

### Master Styles
```css
/* src/components/hero/japanese-hero-master.css */
.japanese-hero-master {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, 
    var(--ink-black) 0%, 
    var(--sakura-pink) 50%, 
    var(--traditional-gold) 100%);
}

.japanese-hero-master[data-mounted="true"] {
  animation: hero-fade-in 1s ease-out;
}

/* Content Container */
.hero-content-container {
  position: relative;
  z-index: 20;
  width: 100%;
  max-width: 1200px;
  padding: 2rem;
}

.hero-content {
  text-align: center;
  color: var(--foreground);
}

/* Title Section */
.hero-title-section {
  position: relative;
  margin-bottom: 3rem;
}

.kanji-decoration {
  position: absolute;
  top: -2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 2rem;
  opacity: 0.3;
  pointer-events: none;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.title-main {
  display: block;
  background: linear-gradient(135deg, 
    var(--foreground) 0%, 
    var(--traditional-red) 50%, 
    var(--traditional-gold) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: title-glow 3s ease-in-out infinite;
}

.title-sub {
  display: block;
  font-size: 0.6em;
  margin-top: 0.5rem;
  opacity: 0.9;
}

/* Description */
.hero-description {
  font-size: clamp(1.25rem, 2.5vw, 1.75rem);
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  opacity: 0.9;
}

.japanese-text {
  font-family: var(--font-noto-sans-jp), sans-serif;
  font-weight: 700;
  color: var(--traditional-red);
}

/* CTA Section */
.hero-cta-section {
  margin: 4rem 0;
  display: flex;
  justify-content: center;
}

/* Stats Section */
.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 600px;
  margin: 3rem auto 0;
}

.stat-item {
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-number {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, 
    var(--traditional-gold) 0%, 
    var(--traditional-red) 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.5rem;
  opacity: 0.8;
}

.stat-japanese {
  font-family: var(--font-noto-sans-jp), sans-serif;
  font-size: 1.5rem;
  opacity: 0.6;
  margin-top: 0.5rem;
}

/* Scroll Indicator */
.scroll-indicator {
  margin-top: 4rem;
  text-align: center;
  opacity: 0.7;
}

.scroll-text {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.scroll-icon {
  width: 30px;
  height: 50px;
  border: 2px solid var(--foreground);
  border-radius: 15px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.scroll-dot {
  width: 6px;
  height: 12px;
  background: var(--foreground);
  border-radius: 3px;
  animation: scroll-bounce 2s infinite;
}

.scroll-kanji {
  font-family: var(--font-noto-sans-jp), sans-serif;
  font-size: 2rem;
  margin-top: 1rem;
  color: var(--traditional-red);
}

/* Bottom Fade */
.hero-fade-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    var(--background) 100%);
  pointer-events: none;
}

/* Animations */
@keyframes hero-fade-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes title-glow {
  0%, 100% {
    filter: drop-shadow(0 0 20px rgba(218, 165, 32, 0.3));
  }
  50% {
    filter: drop-shadow(0 0 40px rgba(220, 20, 60, 0.5));
  }
}

@keyframes scroll-bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-content-container {
    padding: 1rem;
  }
  
  .kanji-decoration {
    gap: 1rem;
    top: -1rem;
  }
  
  .hero-stats {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .stat-item {
    padding: 1.5rem;
  }
}

/* Dark Mode Support */
.dark .japanese-hero-master {
  background: linear-gradient(135deg, 
    var(--ink-black) 0%, 
    var(--murasaki-purple) 30%,
    var(--sakura-pink) 60%, 
    var(--traditional-gold) 100%);
}

.dark .hero-description {
  opacity: 0.95;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  .japanese-hero-master[data-mounted="true"] {
    animation: none;
  }
  
  .title-main {
    animation: none;
  }
  
  .scroll-dot {
    animation: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .hero-title {
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  }
  
  .hero-description {
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  }
}
```

## Performance Optimization

### 1. Lazy Loading Strategy
```typescript
// src/components/hero/JapaneseHeroMaster.tsx
import dynamic from 'next/dynamic'

const ParallaxMountFuji = dynamic(
  () => import('@/components/japanese/ParallaxMountFuji'),
  { 
    ssr: false,
    loading: () => <div className="mount-fuji-placeholder" />
  }
)

const EnhancedOrigamiCrane = dynamic(
  () => import('@/components/japanese/EnhancedOrigamiCrane'),
  { 
    ssr: false,
    loading: () => <div className="origami-placeholder">Loading...</div>
  }
)
```

### 2. Intersection Observer for Animations
```typescript
// src/hooks/useIntersectionObserver.ts
export function useIntersectionObserver(
  ref: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, options)

    observer.observe(ref.current)

    return () => {
      observer.disconnect()
    }
  }, [ref, options])

  return isIntersecting
}

// Usage in component
const isHeroVisible = useIntersectionObserver(heroRef, {
  threshold: 0.1,
  rootMargin: '50px'
})
```

### 3. Animation Performance
```css
/* GPU-accelerated animations */
.kintsugi-path,
.kanji-character,
.shoji-cell {
  will-change: transform, opacity;
  transform: translateZ(0); /* Force GPU layer */
}

/* Reduce paint areas */
.hero-content-container {
  contain: layout style;
}
```

## Testing Strategy

### 1. Visual Regression Testing
```typescript
// tests/visual/hero-visual.test.ts
describe('Japanese Hero Visual Tests', () => {
  test('renders all components correctly', async () => {
    const { container } = render(<JapaneseHeroMaster />)
    
    expect(container.querySelector('.kintsugi-divider')).toBeInTheDocument()
    expect(container.querySelector('.kanji-calligraphy')).toBeInTheDocument()
    expect(container.querySelector('.shoji-grid-overlay')).toBeInTheDocument()
  })

  test('animates on scroll', async () => {
    const { container } = render(<JapaneseHeroMaster />)
    
    // Simulate scroll
    fireEvent.scroll(window, { target: { scrollY: 100 } })
    
    await waitFor(() => {
      expect(container.querySelector('[data-scroll-y="100"]')).toBeTruthy()
    })
  })
})
```

### 2. Performance Testing
```typescript
// tests/performance/hero-performance.test.ts
describe('Hero Performance Tests', () => {
  test('meets performance benchmarks', async () => {
    const metrics = await measurePerformance(() => {
      render(<JapaneseHeroMaster />)
    })

    expect(metrics.renderTime).toBeLessThan(100) // ms
    expect(metrics.memoryUsage).toBeLessThan(50) // MB
  })
})
```

## Deployment Checklist

### Pre-deployment
- [ ] All components render without errors
- [ ] Animations run at 60fps on target devices
- [ ] Audio system works across browsers
- [ ] Accessibility features tested
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility verified

### Production Optimization
- [ ] Code splitting implemented
- [ ] Images optimized and compressed
- [ ] CSS minified and purged
- [ ] Audio files compressed
- [ ] CDN configured for assets
- [ ] Monitoring and analytics set up

This integration guide provides a complete roadmap for implementing the Japanese-themed hero section with all specified features, ensuring both technical excellence and cultural authenticity.