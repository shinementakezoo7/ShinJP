'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useState } from 'react'
import type { PexelsImage } from '@/services/pexels.service'

interface InstagramPostProps {
  photo: PexelsImage
  index: number
}

export default function InstagramPost({ photo, index }: InstagramPostProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showLikeAnimation, setShowLikeAnimation] = useState(false)

  const likes = Math.floor(Math.random() * 10000) + 100
  const comments = Math.floor(Math.random() * 500) + 10

  const handleDoubleTap = () => {
    if (!liked) {
      setLiked(true)
      setShowLikeAnimation(true)
      setTimeout(() => setShowLikeAnimation(false), 1000)
    }
  }

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-700">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-0.5">
          <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
            <span className="text-lg">🏯</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-gray-900 dark:text-white">japanese_learning</p>
          <p className="text-xs text-gray-500">Tokyo, Japan</p>
        </div>
        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-gray-100 dark:bg-gray-700 cursor-pointer group">
        <Image
          src={photo.src.large}
          alt={`Photo by ${photo.photographer}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          onDoubleClick={handleDoubleTap}
        />

        {/* Double-tap like animation */}
        {showLikeAnimation && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-9xl">❤️</div>
          </motion.div>
        )}

        {/* Photo credit overlay */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-xs text-white">📷 {photo.photographer}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 1.2 }}
              onClick={() => setLiked(!liked)}
              className="focus:outline-none"
            >
              <motion.svg
                className="w-7 h-7"
                fill={liked ? '#ef4444' : 'none'}
                stroke={liked ? '#ef4444' : 'currentColor'}
                strokeWidth="2"
                viewBox="0 0 24 24"
                animate={liked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                />
              </motion.svg>
            </motion.button>

            <motion.button whileTap={{ scale: 1.2 }} className="focus:outline-none">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                />
              </svg>
            </motion.button>

            <motion.button whileTap={{ scale: 1.2 }} className="focus:outline-none">
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 1.2 }}
            onClick={() => setSaved(!saved)}
            className="focus:outline-none"
          >
            <svg
              className="w-7 h-7"
              fill={saved ? 'currentColor' : 'none'}
              stroke="currentColor"
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

        {/* Likes */}
        <p className="font-bold text-sm text-gray-900 dark:text-white">
          {(likes + (liked ? 1 : 0)).toLocaleString()} likes
        </p>

        {/* Caption */}
        <div className="text-sm text-gray-900 dark:text-white">
          <span className="font-bold mr-2">japanese_learning</span>
          <span className="text-gray-700 dark:text-gray-300">
            Beautiful Japan! Learn Japanese with immersive content 🏯🌸
          </span>
        </div>

        {/* View comments */}
        <button className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          View all {comments} comments
        </button>

        {/* Time */}
        <p className="text-xs text-gray-400 uppercase">
          {Math.floor(Math.random() * 24)} hours ago
        </p>
      </div>
    </motion.div>
  )
}
