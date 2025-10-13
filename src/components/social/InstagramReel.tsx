'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'
import type { PexelsVideo } from '@/services/pexels.service'

interface InstagramReelProps {
  video: PexelsVideo
  index: number
}

export default function InstagramReel({ video, index }: InstagramReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [liked, setLiked] = useState(false)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

  const likes = Math.floor(Math.random() * 50000) + 1000
  const comments = Math.floor(Math.random() * 1000) + 50
  const shares = Math.floor(Math.random() * 500) + 10

  // Get HD video file
  const hdVideo = video.video_files.find((f) => f.quality === 'hd') || video.video_files[0]

  // Get poster image from video_pictures or image
  const posterImage = video.video_pictures?.[0]?.picture || video.image

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true)
      setShowLikeAnimation(true)
      setTimeout(() => setShowLikeAnimation(false), 1000)
    }
  }

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
      style={{ aspectRatio: '9/16' }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onClick={togglePlay}
      onDoubleClick={handleDoubleTap}
    >
      {/* Video */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
        poster={posterImage}
      >
        <source src={hdVideo.link} type={hdVideo.file_type} />
      </video>

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

      {/* Play/Pause overlay */}
      {!isPlaying && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-20 h-20 rounded-full bg-white/90 flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg className="w-10 h-10 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.div>
        </motion.div>
      )}

      {/* Double-tap like animation */}
      {showLikeAnimation && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-9xl">❤️</div>
        </motion.div>
      )}

      {/* Top info */}
      <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-0.5">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center">
              <span className="text-lg">🎌</span>
            </div>
          </div>
          <div>
            <p className="font-bold text-sm text-white drop-shadow-lg">japanese_reels</p>
            <p className="text-xs text-white/80">Tokyo, Japan</p>
          </div>
        </div>
        <button className="text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Side actions */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center gap-6 z-10">
        {/* Like */}
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={(e) => {
            e.stopPropagation()
            setLiked(!liked)
          }}
          className="flex flex-col items-center gap-1"
        >
          <motion.div animate={liked ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.3 }}>
            <svg
              className="w-8 h-8 drop-shadow-lg"
              fill={liked ? '#ef4444' : 'white'}
              stroke={liked ? 'none' : 'white'}
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </motion.div>
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {(likes + (liked ? 1 : 0)).toLocaleString()}
          </span>
        </motion.button>

        {/* Comment */}
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1"
        >
          <svg
            className="w-8 h-8 drop-shadow-lg"
            fill="white"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {comments.toLocaleString()}
          </span>
        </motion.button>

        {/* Share */}
        <motion.button
          whileTap={{ scale: 1.3 }}
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col items-center gap-1"
        >
          <svg
            className="w-8 h-8 drop-shadow-lg"
            fill="white"
            viewBox="0 0 24 24"
            stroke="white"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
            />
          </svg>
          <span className="text-xs font-bold text-white drop-shadow-lg">
            {shares.toLocaleString()}
          </span>
        </motion.button>

        {/* Save */}
        <motion.button whileTap={{ scale: 1.3 }} onClick={(e) => e.stopPropagation()}>
          <svg
            className="w-8 h-8 drop-shadow-lg"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
            />
          </svg>
        </motion.button>
      </div>

      {/* Bottom caption */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <p className="text-sm text-white drop-shadow-lg font-medium line-clamp-2">
          <span className="font-bold">japanese_reels</span> Discover the beauty of Japan! 🗾✨ Learn
          Japanese through immersive videos #Japan #Japanese #LearningJapanese
        </p>
        <p className="text-xs text-white/80 mt-1">
          Original video by {video.user.name} from Pexels
        </p>
      </div>

      {/* Muted indicator */}
      <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2 z-10">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
        </svg>
      </div>
    </motion.div>
  )
}
