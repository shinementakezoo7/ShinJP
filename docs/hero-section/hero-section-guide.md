# Hero Section Quick Reference Guide

## 🎯 Quick Start

### Using the Enhanced Hero Section

```tsx
import EnhancedHeroSection from '@/components/hero/EnhancedHeroSection'

export default function Page() {
  return <EnhancedHeroSection />
}
```

## 🎨 Customization Options

### 1. Adjust Particle Count
```tsx
// In EnhancedHeroSection.tsx, line 30
const particleCount = 50 // Change this number (recommended: 30-80)
```

### 2. Modify Color Scheme
```css
/* In globals.css */
:root {
  --primary: #1E3A8A;      /* Change primary color */
  --secondary: #DC143C;     /* Change secondary color */
  --accent: #DAA520;        /* Change accent color */
}
```

### 3. Adjust Animation Speed
```css
/* In globals.css */
.animate-float {
  animation: float 3s ease-in-out infinite; /* Change duration */
}

.animate-gradient-x {
  animation: gradient-x 3s ease infinite; /* Change duration */
}
```

### 4. Customize Stats
```tsx
// In EnhancedHeroSection.tsx, lines 150-210
// Modify the stat cards content:
<div className="text-6xl">5</div>  {/* Change number */}
<div className="text-sm">JLPT Levels</div>  {/* Change label */}
```

## 🔧 Common Modifications

### Change Hero Text
```tsx
// In EnhancedHeroSection.tsx, line 94
<h1>
  <span>Master <span className="holographic">Japanese</span></span>
  <span>from <span className="neon-text gradient-text">N5 to N1</span></span>
</h1>
```

### Add More Stats
```tsx
// Copy this pattern and add to the grid:
<div className="group relative stat-card-glow">
  <div className="relative glass-morphism rounded-3xl p-8">
    <div className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-cyan-600">
      10K+
    </div>
    <div className="text-sm font-bold uppercase tracking-wider">
      Users
    </div>
  </div>
</div>
```

### Modify CTA Buttons
```tsx
// In EnhancedHeroSection.tsx, lines 115-145
<Link href="/your-route">
  <span>Your CTA Text</span>
</Link>
```

## 🎭 Available CSS Classes

### Animation Classes
```css
.animate-fade-in          /* Fade in with scale */
.animate-bounce-in        /* Elastic bounce entrance */
.animate-slide-up         /* Slide up from bottom */
.animate-float            /* Floating up and down */
.animate-pulse-glow       /* Glowing pulse effect */
.animate-gradient-x       /* Horizontal gradient shift */
.animate-shimmer          /* Shimmer sweep effect */
```

### Style Classes
```css
.glass-morphism          /* Frosted glass effect */
.glass-morphism-enhanced /* Enhanced glass with more blur */
.futuristic-card         /* Cyberpunk-style card */
.interactive-card        /* Card with hover shimmer */
.holographic             /* Rainbow holographic text */
.neon-text              /* Neon glowing text */
.gradient-text          /* Animated gradient text */
.cyber-grid             /* Cyber grid background */
```

### Layout Classes
```css
.stat-card-glow         /* Stat card with hover glow */
.neon-border            /* Animated neon border */
```

## 📱 Responsive Utilities

### Tailwind Breakpoints Used
```tsx
// Mobile: base styles
className="text-4xl"

// Small devices (640px+)
className="sm:text-5xl"

// Medium devices (768px+)
className="md:text-6xl"

// Large devices (1024px+)
className="lg:text-7xl"

// Extra large (1280px+)
className="xl:text-8xl"
```

### Common Responsive Patterns
```tsx
// Hide on mobile, show on desktop
className="hidden sm:inline"

// Full width mobile, auto desktop
className="w-full sm:w-auto"

// Column mobile, row desktop
className="flex-col sm:flex-row"
```

## 🎨 Color Gradients

### Pre-built Gradients
```tsx
// Indigo to Purple to Pink
bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600

// Cyan to Blue
bg-gradient-to-br from-cyan-500 to-blue-600

// Purple to Pink
bg-gradient-to-br from-purple-500 to-pink-600

// Emerald to Green
bg-gradient-to-br from-emerald-500 to-green-600
```

## 🔥 Performance Tips

### 1. Reduce Particle Count on Mobile
```tsx
const isMobile = typeof window !== 'undefined' && window.innerWidth < 640
const particleCount = isMobile ? 30 : 50
```

### 2. Disable Canvas on Low-End Devices
```tsx
const preferReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (preferReducedMotion) return // Skip canvas animations
```

### 3. Lazy Load Heavy Components
```tsx
import dynamic from 'next/dynamic'

const EnhancedHeroSection = dynamic(
  () => import('@/components/hero/EnhancedHeroSection'),
  { ssr: true }
)
```

## 🐛 Troubleshooting

### Issue: Canvas not rendering
**Solution:** Check if canvas ref is properly initialized
```tsx
useEffect(() => {
  if (!canvasRef.current) return
  // Your canvas code
}, [])
```

### Issue: Theme not switching smoothly
**Solution:** Ensure transition classes are applied
```css
* {
  transition: background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Issue: Particles laggy on mobile
**Solution:** Reduce particle count or disable on mobile
```tsx
const particleCount = window.innerWidth < 640 ? 20 : 50
```

### Issue: Text not gradient
**Solution:** Ensure all required classes are present
```tsx
<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
  Text
</span>
```

## 📚 Component Structure

```
EnhancedHeroSection
├── Canvas Background (Interactive Particles)
├── Gradient Orbs (Floating Animation)
├── Cyber Grid Pattern
├── Neon Accent Lines
└── Main Content
    ├── AI Badge (Animated)
    ├── Hero Heading (Holographic Effect)
    ├── Subtitle (Gradient Underline)
    ├── CTA Buttons (Gradient Effects)
    ├── Stats Grid (Glass Morphism)
    └── Scroll Indicator
```

## 🎯 Best Practices

### DO:
- ✅ Use semantic HTML
- ✅ Add ARIA labels for accessibility
- ✅ Test on multiple devices
- ✅ Optimize images and assets
- ✅ Use CSS variables for theming
- ✅ Implement loading states

### DON'T:
- ❌ Hardcode colors (use CSS variables)
- ❌ Ignore accessibility
- ❌ Skip responsive testing
- ❌ Over-animate (respect reduced-motion)
- ❌ Use inline styles excessively
- ❌ Forget hover/focus states

## 🔗 Related Components

### Theme Toggle
```tsx
import ThemeToggle from '@/components/theme/ThemeToggle'
```

### Font Size Control
```tsx
import FontSizeControl from '@/components/theme/FontSizeControl'
```

### AI Badge
```tsx
import PoweredByAIBadge from '@/components/shared/PoweredByAIBadge'
```

## 📖 Further Reading

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [React useEffect Hook](https://react.dev/reference/react/useEffect)
- [Canvas API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Need Help?** Check the main documentation in `HERO_SECTION_ENHANCEMENT.md`
