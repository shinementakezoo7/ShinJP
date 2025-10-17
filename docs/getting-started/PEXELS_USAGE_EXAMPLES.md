# 🎨 Pexels API - Usage Examples

## Quick Start

### 1. Import the Hook

```typescript
import { usePexelsPhotos, usePexelsVideos, useRandomJapanPhoto } from '@/hooks/usePexelsAssets'
```

### 2. Basic Photo Usage

```typescript
function MyComponent() {
  const { photos, loading, error } = usePexelsPhotos('japan cherry blossom', 10)

  if (loading) return <div>Loading beautiful Japan photos...</div>
  if (error) return <div>Error loading photos</div>

  return (
    <div className="grid grid-cols-3 gap-4">
      {photos.map(photo => (
        <img 
          key={photo.id}
          src={photo.src.large}
          alt={`Photo by ${photo.photographer}`}
          className="rounded-lg shadow-lg"
        />
      ))}
    </div>
  )
}
```

### 3. Random Japan Background

```typescript
function HeroSection() {
  const { photo, loading } = useRandomJapanPhoto()

  return (
    <div className="relative h-screen">
      {/* Background Image */}
      {photo && (
        <div className="absolute inset-0">
          <img 
            src={photo.src.large2x}
            alt="Japan"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
      
      {/* Your content */}
      <div className="relative z-10">
        <h1>Welcome!</h1>
      </div>
    </div>
  )
}
```

### 4. Video Background

```typescript
function VideoHero() {
  const { videos, loading } = usePexelsVideos('tokyo night city', 5)

  return (
    <div className="relative h-screen overflow-hidden">
      {videos.length > 0 && (
        <video 
          autoPlay 
          loop 
          muted 
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source 
            src={videos[0].video_files[0].link} 
            type="video/mp4" 
          />
        </video>
      )}
    </div>
  )
}
```

### 5. Gallery with Multiple Themes

```typescript
function JapanGallery() {
  const sakura = usePexelsPhotos('japan cherry blossom', 6)
  const temples = usePexelsPhotos('japanese temple', 6)
  const fuji = usePexelsPhotos('mount fuji', 6)

  return (
    <div className="space-y-8">
      <Section title="Cherry Blossoms" photos={sakura.photos} />
      <Section title="Temples" photos={temples.photos} />
      <Section title="Mount Fuji" photos={fuji.photos} />
    </div>
  )
}
```

## 🎯 All Available Japan Themes

```typescript
import { japanThemes } from '@/services/pexels.service'

// Use any of these:
japanThemes.cherryBlossom  // 'japan cherry blossom sakura'
japanThemes.garden         // 'japanese garden zen'
japanThemes.tokyo          // 'tokyo night city'
japanThemes.mountFuji      // 'mount fuji japan'
japanThemes.temple         // 'japanese temple shrine'
japanThemes.street         // 'japanese street kyoto'
japanThemes.culture        // 'japanese culture traditional'
japanThemes.nature         // 'japan nature landscape'
japanThemes.architecture   // 'japanese architecture'
japanThemes.food           // 'japanese food sushi'
```

## 🖼️ Image Size Options

Each photo has multiple sizes:

```typescript
photo.src.original   // Original full size
photo.src.large2x    // Large retina (best for hero)
photo.src.large      // Large (1920x1280)
photo.src.medium     // Medium (1280x850)
photo.src.small      // Small (640x426)
photo.src.portrait   // Portrait orientation
photo.src.landscape  // Landscape orientation
photo.src.tiny       // Tiny thumbnail (280x200)
```

## 🎬 Video Quality Options

```typescript
const video = videos[0]

// Find best quality
const hdVideo = video.video_files.find(f => f.quality === 'hd')
const sdVideo = video.video_files.find(f => f.quality === 'sd')

// Use the link
<video src={hdVideo?.link} />
```

## 💾 Caching

The service automatically caches results to avoid unnecessary API calls:

```typescript
// First call - fetches from API
const { photos } = usePexelsPhotos('japan', 10)

// Second call with same query - uses cache
const { photos: cachedPhotos } = usePexelsPhotos('japan', 10)

// Clear cache if needed
import { pexelsService } from '@/services/pexels.service'
pexelsService.clearCache()
```

## 🎨 Advanced Examples

### Slideshow Component

```typescript
function JapanSlideshow() {
  const { photos, loading } = usePexelsPhotos('japan', 20)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (photos.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [photos])

  if (loading || photos.length === 0) return null

  return (
    <div className="relative h-screen">
      <img 
        src={photos[currentIndex].src.large}
        alt="Japan"
        className="w-full h-full object-cover transition-opacity duration-1000"
      />
    </div>
  )
}
```

### Lazy Loading Gallery

```typescript
function LazyGallery() {
  const [count, setCount] = useState(12)
  const { photos, loading } = usePexelsPhotos('japan', count)

  return (
    <div>
      <div className="grid grid-cols-4 gap-4">
        {photos.map(photo => (
          <img key={photo.id} src={photo.src.medium} />
        ))}
      </div>
      
      <button 
        onClick={() => setCount(prev => prev + 12)}
        disabled={loading}
      >
        Load More
      </button>
    </div>
  )
}
```

### Parallax Background

```typescript
function ParallaxSection() {
  const { photo } = useRandomJapanPhoto()
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative h-screen overflow-hidden">
      {photo && (
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `translateY(${scrollY * 0.5}px)`,
            backgroundImage: `url(${photo.src.large})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      
      <div className="relative z-10 flex items-center justify-center h-full">
        <h1 className="text-6xl text-white font-bold">Welcome to Japan</h1>
      </div>
    </div>
  )
}
```

## 🔒 API Key Info

- **Your API Key**: `SGYiBk9dYciptDCkYsSln50aNltKpkCKcTrn5U2aQwoOF8DfxwNA9jsW`
- **Location**: `/src/services/pexels.service.ts`
- **Rate Limits**: 200 requests/hour (Pexels free tier)
- **Attribution**: Automatically included in photo data

## 📝 Attribution

Always credit photographers:

```typescript
<div className="text-sm text-gray-600">
  Photo by {photo.photographer} on Pexels
</div>
```

## 🚀 Performance Tips

1. **Use appropriate sizes**: Don't load `original` when `medium` works
2. **Lazy load images**: Use `loading="lazy"` attribute
3. **Preload hero images**: Use `<link rel="preload">`
4. **Cache aggressively**: The service caches automatically
5. **Optimize with Next.js Image**:

```typescript
import Image from 'next/image'

<Image
  src={photo.src.large}
  alt="Japan"
  width={1920}
  height={1280}
  quality={85}
  priority
/>
```

## ✅ Ready to Use Everywhere!

The Pexels system is fully integrated and ready to use in:
- ✅ Homepage hero backgrounds
- ✅ Dashboard sections
- ✅ Blog post headers
- ✅ Gallery pages
- ✅ Loading screens
- ✅ About page backgrounds
- ✅ Category headers
- ✅ Anywhere you need beautiful Japan photos/videos!

**Happy coding! 🎌🌸**
