'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { ErrorBoundary } from 'react-error-boundary'

// Dynamic import with loading fallback
const ModernChatInterface = dynamic(() => import('@/components/chat/ModernChatInterface'), {
  loading: () => <ChatLoadingFallback />,
  ssr: false,
})

function ChatLoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl">💬</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          チャットを読み込み中...
        </h2>
        <p className="text-gray-600 dark:text-gray-400">最先端のチャット体験をお楽しみください</p>
      </div>
    </div>
  )
}

function ChatErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-purple-50/30 to-pink-50/30 dark:from-gray-900/90 dark:via-gray-800/90 dark:to-gray-900/90 flex items-center justify-center">
      <div className="text-center p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-white text-2xl">⚠️</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          エラーが発生しました
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          チャットの読み込み中に問題が発生しました。
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
        >
          再試行
        </button>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <div className="min-h-screen">
      {/* Skip to main content for accessibility */}
      <a
        href="#main-chat-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
      >
        メインチャットに移動
      </a>

      <main id="main-chat-content" className="min-h-screen">
        <ErrorBoundary FallbackComponent={ChatErrorFallback}>
          <Suspense fallback={<ChatLoadingFallback />}>
            <ModernChatInterface />
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Accessibility indicators */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        チャットが利用可能です
      </div>
    </div>
  )
}
