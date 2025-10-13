'use client'

interface CalligraphyDividerProps {
  kanji?: string
  className?: string
}

export default function CalligraphyDivider({
  kanji = '道',
  className = '',
}: CalligraphyDividerProps) {
  return (
    <div className={`relative flex items-center justify-center py-8 ${className}`}>
      {/* Left brush stroke */}
      <div className="flex-1 h-1 bg-gradient-to-r from-transparent via-[#1E3A8A] to-[#DC143C] dark:via-[#3B5998] dark:to-[#E63946] rounded-full opacity-60"></div>

      {/* Center kanji with circle */}
      <div className="relative mx-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1E3A8A] to-[#DC143C] dark:from-[#3B5998] dark:to-[#E63946] flex items-center justify-center shadow-xl animate-pulse-glow">
          <span className="japanese-text text-3xl font-bold text-white">{kanji}</span>
        </div>
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-2 border-[#DAA520] opacity-50 animate-ping"
          style={{ animationDuration: '3s' }}
        ></div>
      </div>

      {/* Right brush stroke */}
      <div className="flex-1 h-1 bg-gradient-to-l from-transparent via-[#DC143C] to-[#DAA520] dark:via-[#E63946] dark:to-[#DAA520] rounded-full opacity-60"></div>
    </div>
  )
}
