'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import InstagramPost from '@/components/social/InstagramPost'
import InstagramReel from '@/components/social/InstagramReel'
import SectionHeader from '@/components/navigation/SectionHeader'
import { usePexelsPhotos, usePexelsVideos } from '@/hooks/usePexelsAssets'
import { japanThemes } from '@/services/pexels.service'

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'all'>('all')
  const [mounted, setMounted] = useState(false)

  // Fetch 10 photos for Instagram posts
  const { photos, loading: photosLoading } = usePexelsPhotos(japanThemes.cherryBlossom, 10)

  // Fetch 10 videos for Instagram reels
  const { videos, loading: videosLoading } = usePexelsVideos(japanThemes.tokyo, 10)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isLoading = photosLoading || videosLoading

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-red-50 dark:from-gray-900 dark:via-purple-950/20 dark:to-pink-950/20">
      {/* Header */}
      <SectionHeader
        title="Japanese Social Gallery"
        titleJP="ソーシャル"
        subtitle="Explore Japan through stunning photos and videos"
        icon="📸"
        backHref="/dashboard"
        backLabel="Back to Dashboard"
        gradient="from-pink-600 via-purple-600 to-red-600"
      />

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <motion.div
              className="text-5xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              📱
            </motion.div>
            <h2 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
              Immersive Japan Experience
            </h2>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Discover Japan through Instagram-style posts and reels powered by{' '}
            <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Pexels API
            </span>
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex items-center justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
            }`}
          >
            <span className="mr-2">🌐</span>
            All Content
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'posts'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
            }`}
          >
            <span className="mr-2">🖼️</span>
            Posts ({photos.length})
          </button>
          <button
            onClick={() => setActiveTab('reels')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm sm:text-base transition-all duration-300 ${
              activeTab === 'reels'
                ? 'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg scale-105'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:scale-105'
            }`}
          >
            <span className="mr-2">🎬</span>
            Reels ({videos.length})
          </button>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20">
            <motion.div
              className="text-8xl mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              🌸
            </motion.div>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              Loading amazing Japan content...
            </p>
            <p className="text-sm text-gray-500 mt-2">Fetching high-quality assets from Pexels</p>
          </div>
        )}

        {/* Instagram Posts Section */}
        {!isLoading && (activeTab === 'all' || activeTab === 'posts') && photos.length > 0 && (
          <motion.section
            className="mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
              <h3 className="text-3xl font-black flex items-center gap-3">
                <span>🖼️</span>
                <span className="bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Instagram Posts
                </span>
                <span className="text-sm font-bold px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                  {photos.length}
                </span>
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {photos.slice(0, 10).map((photo, index) => (
                <InstagramPost key={photo.id} photo={photo} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Instagram Reels Section */}
        {!isLoading && (activeTab === 'all' || activeTab === 'reels') && videos.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: activeTab === 'all' ? 0.6 : 0.3 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent" />
              <h3 className="text-3xl font-black flex items-center gap-3">
                <span>🎬</span>
                <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                  Instagram Reels
                </span>
                <span className="text-sm font-bold px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-full">
                  {videos.length}
                </span>
              </h3>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {videos.slice(0, 10).map((video, index) => (
                <InstagramReel key={video.id} video={video} index={index} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Stats Section */}
        {!isLoading && (
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-5xl mb-4">📸</div>
              <div className="text-4xl font-black mb-2">{photos.length}</div>
              <div className="text-lg font-semibold opacity-90">High-Quality Photos</div>
              <p className="text-sm opacity-70 mt-2">From Pexels API</p>
            </div>

            <div className="bg-gradient-to-br from-red-600 to-pink-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-5xl mb-4">🎬</div>
              <div className="text-4xl font-black mb-2">{videos.length}</div>
              <div className="text-lg font-semibold opacity-90">HD Videos</div>
              <p className="text-sm opacity-70 mt-2">Stunning reels</p>
            </div>

            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl">
              <div className="text-5xl mb-4">⚡</div>
              <div className="text-4xl font-black mb-2">100%</div>
              <div className="text-lg font-semibold opacity-90">Optimized</div>
              <p className="text-sm opacity-70 mt-2">Lazy loading & caching</p>
            </div>
          </motion.div>
        )}

        {/* Features Section */}
        <motion.div
          className="mt-16 bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 }}
        >
          <h3 className="text-3xl font-black text-center mb-8">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              ✨ Powered by Advanced Technology
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: '🚀',
                title: 'Pexels API',
                desc: 'High-quality Japan assets',
                color: 'from-blue-500 to-cyan-600',
              },
              {
                icon: '💾',
                title: 'Smart Caching',
                desc: 'Request deduplication',
                color: 'from-purple-500 to-pink-600',
              },
              {
                icon: '🎨',
                title: 'Next.js Image',
                desc: 'Optimized lazy loading',
                color: 'from-green-500 to-emerald-600',
              },
              {
                icon: '✨',
                title: 'Framer Motion',
                desc: 'Smooth animations',
                color: 'from-red-500 to-orange-600',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:scale-105 transition-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.1 }}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
