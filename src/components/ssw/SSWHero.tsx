'use client'

export default function SSWHero() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="ssw-wave"
              x="0"
              y="0"
              width="200"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <g
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-blue-800 dark:text-blue-400"
              >
                <path d="M0,50 Q25,30 50,50 T100,50 T150,50 T200,50" className="animate-wave" />
                <path
                  d="M0,60 Q25,40 50,60 T100,60 T150,60 T200,60"
                  className="animate-wave"
                  style={{ animationDelay: '0.5s' }}
                />
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ssw-wave)" />
        </svg>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {['🏥', '🏗️', '🍜', '🌾', '⚙️', '✈️', '🏨', '🎣'].map((icon, i) => (
          <div
            key={i}
            className="absolute animate-float-slow opacity-10 dark:opacity-20"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 0.8}s`,
              fontSize: `${3 + (i % 3)}rem`,
            }}
          >
            {icon}
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
        {/* Main Title */}
        <div className="mb-8 animate-fade-in">
          <div className="inline-block relative mb-4">
            <div className="absolute inset-0 bg-blue-600/20 dark:bg-blue-400/20 blur-3xl rounded-full"></div>
            <h1 className="relative text-6xl sm:text-7xl md:text-8xl font-black">
              <span className="japanese-text text-blue-600 dark:text-blue-400 drop-shadow-lg">
                特
              </span>
              <span className="japanese-text text-cyan-600 dark:text-cyan-400 drop-shadow-lg">
                定
              </span>
              <span className="japanese-text text-indigo-600 dark:text-indigo-400 drop-shadow-lg">
                技
              </span>
              <span className="japanese-text text-purple-600 dark:text-purple-400 drop-shadow-lg">
                能
              </span>
            </h1>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 dark:from-blue-400 dark:via-cyan-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Specified Skilled Worker
            </span>
          </h2>

          <p className="text-xl sm:text-2xl text-blue-600 dark:text-blue-400 font-semibold mb-2">
            SSW Program Training Hub
          </p>
        </div>

        {/* Description */}
        <p
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          Master workplace Japanese for{' '}
          <span className="font-bold text-blue-600 dark:text-blue-400">14 specialized sectors</span>
          .
          <br className="hidden sm:block" />
          From{' '}
          <span className="japanese-text font-bold text-blue-600 dark:text-blue-400">
            介護
          </span> to{' '}
          <span className="japanese-text font-bold text-blue-600 dark:text-blue-400">建設</span> —
          comprehensive training materials designed for SSW success.
        </p>

        {/* Stats Cards */}
        <div
          className="flex flex-wrap justify-center gap-4 mb-10 animate-fade-in"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-blue-200 dark:border-blue-800 shadow-xl">
            <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mb-1">14</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Sectors</div>
          </div>

          <div className="px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-cyan-200 dark:border-cyan-800 shadow-xl">
            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mb-1">3</div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Program Types
            </div>
          </div>

          <div className="px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 shadow-xl">
            <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 mb-1">
              N4-N3
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">JLPT Level</div>
          </div>

          <div className="px-6 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border-2 border-purple-200 dark:border-purple-800 shadow-xl">
            <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mb-1">
              500+
            </div>
            <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">Pages/Book</div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="flex flex-wrap justify-center gap-4 animate-fade-in"
          style={{ animationDelay: '0.6s' }}
        >
          <a
            href="#sectors"
            className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            <span className="text-2xl mr-2">🏭</span>
            <span>Explore Sectors</span>
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          <a
            href="/ssw/textbooks"
            className="group relative inline-flex items-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transform hover:scale-105 transition-all duration-300"
          >
            <span className="text-2xl mr-2">📚</span>
            <span>View Textbooks</span>
            <svg
              className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex items-center justify-center gap-4 text-3xl opacity-30 animate-bounce-slow">
          <span>🌸</span>
          <span>⛩️</span>
          <span>🌸</span>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg
          className="w-full h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0,60 C300,100 600,20 900,60 L900,120 L0,120 Z"
            fill="currentColor"
            className="text-white dark:text-gray-900 opacity-50"
          />
          <path
            d="M0,80 C300,40 600,100 900,80 C1050,70 1125,75 1200,80 L1200,120 L0,120 Z"
            fill="currentColor"
            className="text-white dark:text-gray-900"
          />
        </svg>
      </div>
    </section>
  )
}
