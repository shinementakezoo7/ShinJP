'use client'

export default function AsanohaPattern({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className="w-full h-full opacity-[0.03] dark:opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="asanoha" x="0" y="0" width="100" height="86.6" patternUnits="userSpaceOnUse">
            <g
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
              className="text-indigo-900 dark:text-blue-300"
            >
              {/* Hemp leaf pattern (Asanoha) */}
              <path d="M50,0 L75,43.3 L50,86.6 L25,43.3 Z" />
              <path d="M50,0 L50,86.6" />
              <path d="M25,43.3 L75,43.3" />
              <path d="M37.5,21.65 L62.5,65" />
              <path d="M62.5,21.65 L37.5,65" />

              {/* Repeat pattern */}
              <path d="M0,0 L25,43.3 L0,86.6 L-25,43.3 Z" />
              <path d="M100,0 L125,43.3 L100,86.6 L75,43.3 Z" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#asanoha)" />
      </svg>
    </div>
  )
}
