# 🎨 Enhanced UI/UX Guide - Shinmen Takezo

## Overview

This document outlines the new enhanced 3D UI components with Three.js, Spline-like effects, and advanced Framer Motion animations.

## 🚀 New Components

### 1. **EnhancedNavbar3D** (`/src/components/hero/EnhancedNavbar3D.tsx`)

**Features:**
- ✨ 3D rotating kanji logo with layered shadows
- 🌊 Animated wave pattern background
- 💫 Glassmorphism with dynamic blur
- 🎯 Smooth hover animations with scale and rotation
- 📱 Responsive mobile menu with staggered animations
- 🌈 Gradient shine effects on CTA button
- ⚡ Parallax scrolling effects

**Key Animations:**
```tsx
- Logo rotation on hover: [0, -5, 5, -5, 0]
- Text shadow pulsing effect
- Menu item 3D transform on hover
- Smooth transitions with spring physics
```

### 2. **Enhanced3DHero** (`/src/components/hero/Enhanced3DHero.tsx`)

**Features:**
- 🌌 Three.js particle field with 5000+ particles
- 🎯 Floating 3D kanji elements
- 🌸 Physics-based sakura petal animation
- 💎 3D card effects with mouse tracking
- 🎨 Dynamic gradient backgrounds
- ⛩️ Animated Torii gates
- 🔄 Rotating kanji backdrop

**Three.js Elements:**
```tsx
- Particle sphere with orbital rotation
- Point lights with color gradients
- Floating meshes with sine wave animation
- Auto-rotating camera controls
```

**Key Features:**
- Parallax scrolling with depth
- Multi-layer glows and shadows
- Animated CTA buttons with shine effects
- Real-time mouse interaction

### 3. **Animated3DCard** (`/src/components/shared/Animated3DCard.tsx`)

**Features:**
- 🎯 Mouse-tracking 3D rotation
- ✨ Dynamic shine effect following cursor
- 💫 Glow shadows based on mouse position
- 🌊 Pattern overlays with customizable colors
- ⚡ Spring physics animations

**Usage:**
```tsx
import Animated3DCard from '@/components/shared/Animated3DCard'

<Animated3DCard glowColor="red" intensity={1}>
  <YourContent />
</Animated3DCard>
```

**Sub-components:**
- `FeatureCard3D`: Feature cards with icons and animations
- `StatCard3D`: Statistics cards with number animations

### 4. **Enhanced3DFooter** (`/src/components/shared/Enhanced3DFooter.tsx`)

**Features:**
- 🌊 Animated wave pattern background
- ⛩️ Rotating Torii gate decorations
- 🌸 Floating sakura petals
- 💫 3D link cards with hover effects
- 🎨 Rotating background kanji
- 🌈 Social media icons with 360° rotation

### 5. **EnhancedFeaturesSection** (`/src/components/shared/EnhancedFeaturesSection.tsx`)

**Features:**
- 🎯 Grid of 3D feature cards
- 🔄 Rotating background patterns
- ⛩️ Animated Torii gate decoration
- 💫 Staggered entrance animations
- 🌸 Japanese divider with animations

## 🎭 Animation Techniques

### Spring Physics
```tsx
const rotateX = useSpring(
  useTransform(mouseY, [-0.5, 0.5], [10, -10]),
  { stiffness: 300, damping: 30 }
)
```

### Parallax Scrolling
```tsx
const y = useTransform(scrollY, [0, 500], [0, 150])
const opacity = useTransform(scrollY, [0, 300], [1, 0])
```

### Mouse Tracking
```tsx
// Calculates relative mouse position for 3D rotation
const xPct = mouseXPos / width - 0.5
const yPct = mouseYPos / height - 0.5
```

### Particle Systems
```tsx
// Three.js particle field with 5000 particles
const positions = new Float32Array(5000 * 3)
// Spherical distribution
const theta = Math.random() * Math.PI * 2
const phi = Math.acos(Math.random() * 2 - 1)
```

## 🎨 Color System

### Gradient Palettes
- **Red to Amber**: Primary actions, hero elements
- **Purple to Pink**: Feature highlights
- **Orange to Red**: Secondary elements

### Glow Effects
```css
Red: rgba(220, 20, 60, 0.3)
Orange: rgba(255, 140, 0, 0.3)
Purple: rgba(147, 51, 234, 0.3)
```

## 📦 Usage Examples

### Basic Page Setup
```tsx
import EnhancedNavbar3D from '@/components/hero/EnhancedNavbar3D'
import Enhanced3DHero from '@/components/hero/Enhanced3DHero'
import EnhancedFeaturesSection from '@/components/shared/EnhancedFeaturesSection'
import Enhanced3DFooter from '@/components/shared/Enhanced3DFooter'

export default function Page() {
  return (
    <>
      <EnhancedNavbar3D />
      <Enhanced3DHero />
      <EnhancedFeaturesSection />
      <Enhanced3DFooter />
    </>
  )
}
```

### Custom 3D Card
```tsx
<Animated3DCard 
  glowColor="purple" 
  intensity={1.5}
  className="p-8"
>
  <h3>Your Title</h3>
  <p>Your content with 3D effects</p>
</Animated3DCard>
```

## 🎯 Performance Optimizations

### Lazy Loading
```tsx
<Suspense fallback={null}>
  <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
    <Scene3D />
  </Canvas>
</Suspense>
```

### Conditional Rendering
```tsx
{mounted && (
  <div className="3d-content">
    {/* Heavy 3D content */}
  </div>
)}
```

### Mobile Optimization
```tsx
const [isMobile, setIsMobile] = useState(false)

// Reduced particle count on mobile
const particleCount = isMobile ? 2000 : 5000
```

## 🌐 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Note**: Three.js requires WebGL support

## 🎓 Animation Principles

### 1. **Depth & Perspective**
- Multi-layer shadows for 3D effect
- Transform preserve-3d for true 3D rotation
- Z-axis transformations for depth

### 2. **Smooth Transitions**
- Spring physics for natural movement
- Easing functions: cubic-bezier(0.4, 0, 0.2, 1)
- Duration optimization: 0.3-0.8s for most interactions

### 3. **Visual Feedback**
- Immediate hover response
- Scale transforms for tactile feel
- Color transitions for state changes

### 4. **Performance**
- Hardware acceleration with transform3d
- RequestAnimationFrame for smooth 60fps
- Throttled event handlers

## 🔧 Customization

### Colors
Edit glow colors in `Animated3DCard.tsx`:
```tsx
const glowColors = {
  red: 'rgba(220, 20, 60, 0.3)',
  // Add your custom colors
}
```

### Animation Speed
```tsx
transition={{ 
  duration: 2, // Adjust timing
  repeat: Infinity,
  ease: "easeInOut"
}}
```

### Intensity
```tsx
<Animated3DCard intensity={2}> // 0.5 - 2.0 range
```

## 📚 Additional Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Three.js Docs](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/)

## 🎨 Design Philosophy

**Japanese Aesthetic (侍 - Samurai)**
- Minimalism with depth
- Subtle animations (和 - harmony)
- Cultural elements (kanji, sakura, torii)
- Balance between modern and traditional

**3D Enhancements**
- Depth perception through shadows
- Interactive elements respond to user
- Smooth, natural physics
- Performance-optimized for web

---

Built with ❤️ using Next.js, Three.js, Framer Motion, and Japanese aesthetics.
