# Component Implementation Guide: Japanese-Themed Hero Section

## Quick Start Guide

This guide provides step-by-step implementation instructions for each component in the Japanese-themed hero section.

## 1. KintsugiGoldDivider Component

### File Structure
```
src/components/japanese/KintsugiGoldDivider.tsx
src/components/japanese/kintsugi-gold-divider.css
```

### Implementation Steps

#### Step 1: Create the Component File
```typescript
// src/components/japanese/KintsugiGoldDivider.tsx
'use client'

import { useEffect, useRef } from 'react'
import './kintsugi-gold-divider.css'

interface KintsugiGoldDividerProps {
  orientation?: 'horizontal' | 'vertical' | 'diagonal'
  thickness?: number
  animationSpeed?: number
  glowIntensity?: number
  className?: string
}

export default function KintsugiGoldDivider({
  orientation = 'horizontal',
  thickness = 4,
  animationSpeed = 8,
  glowIntensity = 0.6,
  className = ''
}: KintsugiGoldDividerProps) {
  const dividerRef = useRef<HTMLDivElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    if (!pathRef.current) return

    const pathLength = pathRef.current.getTotalLength()
    pathRef.current.style.strokeDasharray = `${pathLength} ${pathLength}`
    pathRef.current.style.strokeDashoffset = `${pathLength}`

    // Animate the path
    const animatePath = () => {
      if (!pathRef.current) return
      
      pathRef.current.style.transition = `stroke-dashoffset ${animationSpeed}s ease-in-out`
      pathRef.current.style.strokeDashoffset = '0'
      
      setTimeout(() => {
        if (pathRef.current) {
          pathRef.current.style.strokeDashoffset = `${pathLength}`
        }
        setTimeout(animatePath, animationSpeed * 1000)
      }, animationSpeed * 1000)
    }

    animatePath()
  }, [animationSpeed])

  const getPathData = () => {
    switch (orientation) {
      case 'horizontal':
        return 'M 0 50 Q 250 20 500 50 T 1000 50'
      case 'vertical':
        return 'M 50 0 Q 20 250 50 500 T 50 1000'
      case 'diagonal':
        return 'M 0 100 Q 250 50 500 100 T 1000 0'
      default:
        return 'M 0 50 Q 250 20 500 50 T 1000 50'
    }
  }

  return (
    <div 
      ref={dividerRef}
      className={`kintsugi-divider kintsugi-divider--${orientation} ${className}`}
      style={{
        '--thickness': `${thickness}px`,
        '--animation-speed': `${animationSpeed}s`,
        '--glow-intensity': glowIntensity
      } as React.CSSProperties}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox={orientation === 'horizontal' ? '0 0 1000 100' : '0 0 100 1000'}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="kintsugiGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#DAA520" stopOpacity="0.8" />
            <stop offset="25%" stopColor="#FFD700" stopOpacity="1" />
            <stop offset="50%" stopColor="#DAA520" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#FFA500" stopOpacity="1" />
            <stop offset="100%" stopColor="#DAA520" stopOpacity="0.8" />
          </linearGradient>
          
          <filter id="kintsugiGlow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <path
          ref={pathRef}
          d={getPathData()}
          stroke="url(#kintsugiGold)"
          strokeWidth={thickness}
          fill="none"
          filter="url(#kintsugiGlow)"
          className="kintsugi-path"
        />
      </svg>
    </div>
  )
}
```

#### Step 2: Create the CSS File
```css
/* src/components/japanese/kintsugi-gold-divider.css */
.kintsugi-divider {
  position: relative;
  overflow: hidden;
  opacity: 0.8;
}

.kintsugi-divider--horizontal {
  width: 100%;
  height: 100px;
}

.kintsugi-divider--vertical {
  width: 100px;
  height: 100vh;
}

.kintsugi-divider--diagonal {
  width: 100%;
  height: 100px;
  transform: rotate(-5deg);
}

.kintsugi-path {
  filter: drop-shadow(0 0 calc(var(--glow-intensity) * 10px) #DAA520)
          drop-shadow(0 0 calc(var(--glow-intensity) * 20px) #FFD700);
  animation: kintsugi-glow var(--animation-speed) ease-in-out infinite;
}

@keyframes kintsugi-glow {
  0%, 100% {
    filter: drop-shadow(0 0 calc(var(--glow-intensity) * 5px) #DAA520)
            drop-shadow(0 0 calc(var(--glow-intensity) * 10px) #FFD700);
  }
  50% {
    filter: drop-shadow(0 0 calc(var(--glow-intensity) * 15px) #DAA520)
            drop-shadow(0 0 calc(var(--glow-intensity) * 25px) #FFD700)
            drop-shadow(0 0 calc(var(--glow-intensity) * 35px) #FFA500);
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .kintsugi-divider--horizontal,
  .kintsugi-divider--diagonal {
    height: 60px;
  }
  
  .kintsugi-divider--vertical {
    width: 60px;
  }
}

/* Dark mode support */
.dark .kintsugi-path {
  filter: drop-shadow(0 0 calc(var(--glow-intensity) * 15px) #FFD700)
          drop-shadow(0 0 calc(var(--glow-intensity) * 25px) #FFA500);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .kintsugi-path {
    animation: none;
  }
}
```

## 2. ParallaxMountFuji Component

### Implementation Steps

#### Step 1: Create the Component File
```typescript
// src/components/japanese/ParallaxMountFuji.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ParallaxMountFujiProps {
  layers?: number
  scrollSpeed?: number
  vanishPoint?: number
  opacityCurve?: 'linear' | 'ease' | 'custom'
  className?: string
}

export default function ParallaxMountFuji({
  layers = 5,
  scrollSpeed = 0.5,
  vanishPoint = 80,
  opacityCurve = 'ease',
  className = ''
}: ParallaxMountFujiProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const sceneRef = useRef<THREE.Scene>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const mountainLayersRef = useRef<THREE.Mesh[]>([])

  useEffect(() => {
    if (!containerRef.current) return

    // Initialize Three.js scene
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 5, 50)
    
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    containerRef.current.appendChild(renderer.domElement)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Create mountain layers
    const mountainLayers: THREE.Mesh[] = []
    
    for (let i = 0; i < layers; i++) {
      const geometry = new THREE.ConeGeometry(
        15 - i * 2, // decreasing size for depth
        25 - i * 3,
        32
      )
      
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6, 0.1, 0.3 - i * 0.05), // ink wash effect
        transparent: true,
        opacity: 0.8 - i * 0.15,
        flatShading: true
      })
      
      const mountain = new THREE.Mesh(geometry, material)
      mountain.position.set(
        (i - layers / 2) * 5, // stagger positions
        -10 + i * 2,
        -i * 10 // depth layering
      )
      
      scene.add(mountain)
      mountainLayers.push(mountain)
    }
    
    mountainLayersRef.current = mountainLayers

    // Add atmospheric fog
    scene.fog = new THREE.Fog(0xffffff, 50, 200)
    
    // Add ambient lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(10, 20, 10)
    scene.add(directionalLight)

    // Handle scroll
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      
      // Update mountain positions based on scroll
      mountainLayers.forEach((mountain, index) => {
        const parallaxOffset = scrollY * scrollSpeed * (index + 1) * 0.1
        mountain.position.y = -10 + index * 2 + parallaxOffset
        
        // Vanishing effect
        const vanishOpacity = Math.max(0, 1 - (scrollY / (window.innerHeight * vanishPoint / 100)))
        mountain.material.opacity = (0.8 - index * 0.15) * vanishOpacity
        
        // Rotation for subtle movement
        mountain.rotation.y += 0.001 * (index + 1)
      })
      
      renderer.render(scene, camera)
    }
    
    animate()

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      
      // Cleanup
      mountainLayers.forEach(mountain => {
        mountain.geometry.dispose()
        mountain.material.dispose()
      })
      
      renderer.dispose()
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [layers, scrollSpeed, vanishPoint])

  return (
    <div 
      ref={containerRef}
      className={`parallax-mount-fuji ${className}`}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1
      }}
    />
  )
}
```

## 3. KanjiCalligraphy Component

### Implementation Steps

#### Step 1: Create the Component File
```typescript
// src/components/japanese/KanjiCalligraphy.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import './kanji-calligraphy.css'

interface KanjiCalligraphyProps {
  kanji: string
  size?: 'small' | 'medium' | 'large' | number
  sparklerIntensity?: 'subtle' | 'medium' | 'intense'
  brushStyle?: 'kaisho' | 'gyosho' | 'sosho'
  animationTrigger?: 'hover' | 'scroll' | 'auto'
  className?: string
}

export default function KanjiCalligraphy({
  kanji,
  size = 'medium',
  sparklerIntensity = 'medium',
  brushStyle = 'kaisho',
  animationTrigger = 'hover',
  className = ''
}: KanjiCalligraphyProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [particles, setParticles] = useState<Array<{
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
    color: string
    size: number
  }>>([])
  
  const animationFrameRef = useRef<number>()

  const getFontSize = () => {
    if (typeof size === 'number') return size
    switch (size) {
      case 'small': return 48
      case 'medium': return 96
      case 'large': return 144
      default: return 96
    }
  }

  const getSparklerCount = () => {
    switch (sparklerIntensity) {
      case 'subtle': return 15
      case 'medium': return 30
      case 'intense': return 50
      default: return 30
    }
  }

  const createSparkler = (x: number, y: number) => {
    const colors = ['#FFD700', '#FFA500', '#FF6B35', '#F7931E', '#FFFF99']
    const newParticles = Array.from({ length: getSparklerCount() }, (_, i) => ({
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2,
      life: 60,
      maxLife: 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 3 + 1
    }))
    
    setParticles(prev => [...prev, ...newParticles])
  }

  const animateSparklers = () => {
    if (!canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    setParticles(prev => {
      const updated = prev.map(particle => ({
        ...particle,
        x: particle.x + particle.vx,
        y: particle.y + particle.vy,
        vy: particle.vy + 0.1, // gravity
        life: particle.life - 1
      })).filter(particle => particle.life > 0)
      
      // Draw particles
      updated.forEach(particle => {
        const alpha = particle.life / particle.maxLife
        ctx.globalAlpha = alpha
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        
        // Add glow effect
        ctx.globalAlpha = alpha * 0.3
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2)
        ctx.fill()
      })
      
      return updated
    })
    
    if (particles.length > 0) {
      animationFrameRef.current = requestAnimationFrame(animateSparklers)
    } else {
      setIsAnimating(false)
    }
  }

  const handleMouseEnter = () => {
    if (!containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    createSparkler(centerX, centerY)
    setIsAnimating(true)
  }

  const handleMouseLeave = () => {
    // Particles will naturally fade out
  }

  useEffect(() => {
    if (isAnimating) {
      animateSparklers()
    }
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [isAnimating, particles.length])

  return (
    <div 
      ref={containerRef}
      className={`kanji-calligraphy kanji-calligraphy--${brushStyle} ${className}`}
      onMouseEnter={animationTrigger === 'hover' ? handleMouseEnter : undefined}
      style={{
        '--font-size': `${getFontSize()}px`
      } as React.CSSProperties}
    >
      <span className="kanji-character">{kanji}</span>
      <canvas
        ref={canvasRef}
        className="kanji-sparkler-canvas"
        width={getFontSize() * 2}
        height={getFontSize() * 2}
      />
    </div>
  )
}
```

#### Step 2: Create the CSS File
```css
/* src/components/japanese/kanji-calligraphy.css */
.kanji-calligraphy {
  position: relative;
  display: inline-block;
  cursor: pointer;
  user-select: none;
}

.kanji-character {
  font-family: 'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;
  font-size: var(--font-size);
  font-weight: 900;
  color: #1C1C1C;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.kanji-calligraphy--kaisho .kanji-character {
  font-style: normal;
}

.kanji-calligraphy--gyosho .kanji-character {
  font-style: italic;
  transform: skewX(-5deg);
}

.kanji-calligraphy--sosho .kanji-character {
  font-style: italic;
  transform: skewX(-10deg) scaleY(1.1);
}

.kanji-sparkler-canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
}

/* Hover effects */
.kanji-calligraphy:hover .kanji-character {
  filter: drop-shadow(0 0 10px #FFD700)
          drop-shadow(0 0 20px #FFA500);
  transform: scale(1.05);
}

/* Dark mode */
.dark .kanji-character {
  color: #F5F5F5;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .kanji-character {
    transition: none;
  }
}
```

## 4. ShojiGridOverlay Component

### Implementation Steps

#### Step 1: Create the Component File
```typescript
// src/components/japanese/ShojiGridOverlay.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import './shoji-grid-overlay.css'

interface ShojiGridOverlayProps {
  gridSize?: number
  opacity?: number
  flexIntensity?: number
  scrollResponsiveness?: number
  className?: string
}

export default function ShojiGridOverlay({
  gridSize = 60,
  opacity = 0.08,
  flexIntensity = 0.5,
  scrollResponsiveness = 0.8,
  className = ''
}: ShojiGridOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [windowHeight, setWindowHeight] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleResize = () => {
      setWindowHeight(window.innerHeight)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
    
    // Initialize
    handleResize()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // Calculate grid deformation based on scroll
  const calculateDeformation = (index: number) => {
    const row = Math.floor(index / Math.ceil(window.innerWidth / gridSize))
    const time = scrollY * scrollResponsiveness * 0.01
    const wave = Math.sin(time + row * 0.5) * flexIntensity
    return wave
  }

  // Generate grid cells
  const generateGrid = () => {
    const cols = Math.ceil(window.innerWidth / gridSize) + 1
    const rows = Math.ceil(windowHeight / gridSize) + 1
    const totalCells = cols * rows
    
    return Array.from({ length: totalCells }, (_, index) => {
      const deformation = calculateDeformation(index)
      
      return (
        <div
          key={index}
          className="shoji-cell"
          style={{
            '--deformation': deformation,
            '--opacity': opacity * (1 - Math.abs(deformation) * 0.5)
          } as React.CSSProperties}
        />
      )
    })
  }

  return (
    <div 
      ref={containerRef}
      className={`shoji-grid-overlay ${className}`}
      style={{
        '--grid-size': `${gridSize}px`,
        '--opacity': opacity
      } as React.CSSProperties}
    >
      <div className="shoji-grid">
        {generateGrid()}
      </div>
    </div>
  )
}
```

#### Step 2: Create the CSS File
```css
/* src/components/japanese/shoji-grid-overlay.css */
.shoji-grid-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
  overflow: hidden;
}

.shoji-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--grid-size));
  grid-auto-rows: var(--grid-size);
  width: 100%;
  height: 100%;
  transform-origin: center;
}

.shoji-cell {
  background: rgba(30, 58, 138, calc(var(--opacity) * 0.5));
  border: 1px solid rgba(30, 58, 138, calc(var(--opacity) * 0.8));
  transform: translateY(calc(var(--deformation) * 10px)) 
             rotate(calc(var(--deformation) * 2deg));
  transition: transform 0.3s ease-out;
  transform-origin: center;
}

/* Dark mode */
.dark .shoji-cell {
  background: rgba(59, 89, 152, calc(var(--opacity) * 0.3));
  border-color: rgba(59, 89, 152, calc(var(--opacity) * 0.6));
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .shoji-grid-overlay {
    --grid-size: 40px !important;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .shoji-cell {
    transform: none !important;
    transition: none;
  }
}
```

## Integration Example

### Master Hero Component
```typescript
// src/components/hero/JapaneseHeroMaster.tsx
import KintsugiGoldDivider from '@/components/japanese/KintsugiGoldDivider'
import ParallaxMountFuji from '@/components/japanese/ParallaxMountFuji'
import KanjiCalligraphy from '@/components/japanese/KanjiCalligraphy'
import ShojiGridOverlay from '@/components/japanese/ShojiGridOverlay'

export default function JapaneseHeroMaster() {
  return (
    <section className="japanese-hero-master">
      <ShojiGridOverlay opacity={0.06} flexIntensity={0.3} />
      <ParallaxMountFuji layers={5} scrollSpeed={0.3} vanishPoint={70} />
      
      <div className="hero-content">
        <KintsugiGoldDivider orientation="horizontal" thickness={3} />
        
        <div className="kanji-container">
          <KanjiCalligraphy kanji="侍" size="large" sparklerIntensity="intense" />
          <KanjiCalligraphy kanji="道" size="medium" sparklerIntensity="medium" />
          <KanjiCalligraphy kanji="武" size="medium" sparklerIntensity="medium" />
        </div>
        
        <KintsugiGoldDivider orientation="horizontal" thickness={2} />
      </div>
    </section>
  )
}
```

This implementation guide provides the complete foundation for building the Japanese-themed hero section with all the specified visual and interactive elements.