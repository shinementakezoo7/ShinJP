'use client'

import type { ReactNode } from 'react'

interface BambooSectionProps {
  children: ReactNode
  title?: string
  titleKanji?: string
  className?: string
}

export default function BambooSection({
  children,
  title,
  titleKanji,
  className = '',
}: BambooSectionProps) {
  return (
    <section className={`relative ${className}`}>
      {/* Bamboo-inspired decorative elements */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#8A9A5B] via-[#9BAF6B] to-[#8A9A5B] dark:from-[#9BAF6B] dark:via-[#8A9A5B] dark:to-[#9BAF6B] opacity-30"></div>
      <div className="absolute left-0 top-0 w-4 h-4 border-2 border-[#8A9A5B] dark:border-[#9BAF6B] rounded-full bg-white dark:bg-gray-900"></div>
      <div className="absolute left-0 bottom-0 w-4 h-4 border-2 border-[#8A9A5B] dark:border-[#9BAF6B] rounded-full bg-white dark:bg-gray-900"></div>

      {/* Content container */}
      <div className="pl-8">
        {(title || titleKanji) && (
          <div className="mb-6 flex items-center gap-4">
            {titleKanji && (
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#8A9A5B] to-[#9BAF6B] flex items-center justify-center shadow-lg">
                <span className="japanese-text text-2xl font-bold text-white">{titleKanji}</span>
              </div>
            )}
            {title && (
              <h2 className="japanese-heading text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
          </div>
        )}

        {children}
      </div>
    </section>
  )
}
