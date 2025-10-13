'use client'

import { useState } from 'react'
import AudioPlayer from '@/components/audio/AudioPlayer'
import StrokeAnimator from '@/components/kanji/StrokeAnimator'
import PoweredByAIBadge from '@/components/shared/PoweredByAIBadge'
import FontSizeControl from '@/components/theme/FontSizeControl'
import ThemeToggle from '@/components/theme/ThemeToggle'

export default function DemoPage() {
  const [selectedKanji, setSelectedKanji] = useState('日')
  const availableKanji = ['一', '二', '三', '日', '月']

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-center gap-3">
            <span className="japanese-text text-5xl sm:text-6xl gradient-text">侍</span>
            Shinmen Takezo Demo
          </h1>
          <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-6 font-medium">
            Experience our AI-powered learning features
          </p>
          <div className="flex justify-center items-center gap-4 mb-6">
            <PoweredByAIBadge />
            <ThemeToggle />
            <FontSizeControl />
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Audio Pronunciation Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 00-5.656 0"
                />
              </svg>
              Audio Pronunciation
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg">
              Listen to native Japanese pronunciation with adjustable speed controls
            </p>

            <div className="space-y-6">
              {/* Japanese Examples */}
              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                <p className="japanese-text text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  こんにちは
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  Hello (Konnichiwa)
                </p>
                <AudioPlayer text="こんにちは" />
              </div>

              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                <p className="japanese-text text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  ありがとうございます
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  Thank you (Arigatou gozaimasu)
                </p>
                <AudioPlayer text="ありがとうございます" />
              </div>

              <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-indigo-300 dark:hover:border-indigo-600 transition-colors">
                <p className="japanese-text text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  日本語を勉強しています
                </p>
                <p className="text-base text-gray-700 dark:text-gray-300 mb-4 font-medium">
                  I am studying Japanese
                </p>
                <AudioPlayer text="日本語を勉強しています" />
              </div>
            </div>
          </div>

          {/* Kanji Stroke Order Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <svg
                className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
              Kanji Stroke Order
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg">
              Learn proper stroke order with animated demonstrations
            </p>

            {/* Kanji Selector */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {availableKanji.map((kanji) => (
                <button
                  key={kanji}
                  onClick={() => setSelectedKanji(kanji)}
                  className={`
                    px-4 py-2 rounded-lg text-2xl japanese-text transition-all
                    ${
                      selectedKanji === kanji
                        ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg scale-110'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  {kanji}
                </button>
              ))}
            </div>

            {/* Stroke Animator */}
            <StrokeAnimator kanji={selectedKanji} />
          </div>
        </div>

        {/* AI Model Status Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <svg
              className="w-7 h-7 text-indigo-600 dark:text-indigo-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
            AI Model Routing
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6 text-base sm:text-lg">
            Shinmen Takezo intelligently routes tasks to the best AI model
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-purple-300 dark:hover:border-purple-600 transition-all hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">Vision Tasks</h3>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4">Image analysis, OCR</p>
              <div className="text-sm font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-3 py-2 rounded-lg">
                llama-3.2-11b-vision
              </div>
            </div>

            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-blue-300 dark:hover:border-blue-600 transition-all hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                Grammar & Stories
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                Explanations, textbooks
              </p>
              <div className="text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-2 rounded-lg">
                stockmark-2-100b
              </div>
            </div>

            <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-green-300 dark:hover:border-green-600 transition-all hover:shadow-lg">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
                Quizzes & Roleplay
              </h3>
              <p className="text-base text-gray-700 dark:text-gray-300 mb-4">
                Adaptive assessments
              </p>
              <div className="text-sm font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-2 rounded-lg">
                mistral-medium-3
              </div>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-lg text-white">
            <div className="text-4xl mb-2">🔄</div>
            <h3 className="font-bold text-lg mb-2">Round-Robin Load Balancing</h3>
            <p className="text-sm opacity-90">Distributes requests across multiple endpoints</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-pink-500 to-red-600 rounded-lg shadow-lg text-white">
            <div className="text-4xl mb-2">🔁</div>
            <h3 className="font-bold text-lg mb-2">Automatic Retry Logic</h3>
            <p className="text-sm opacity-90">3 attempts with exponential backoff</p>
          </div>

          <div className="text-center p-6 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg text-white">
            <div className="text-4xl mb-2">🔑</div>
            <h3 className="font-bold text-lg mb-2">API Key Rotation</h3>
            <p className="text-sm opacity-90">Switches keys on rate limits (429)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
