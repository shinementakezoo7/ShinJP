'use client'

export default function SeigaihaWaves({ className = '' }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <svg
        className="w-full h-full opacity-[0.04] dark:opacity-[0.06]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="seigaiha" x="0" y="0" width="140" height="70" patternUnits="userSpaceOnUse">
            <g
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-blue-600 dark:text-cyan-400"
            >
              {/* Blue waves (Seigaiha) */}
              <path d="M0,35 Q17.5,17.5 35,35 T70,35" />
              <path d="M0,35 Q17.5,22.5 35,35 T70,35" transform="translate(0,5)" opacity="0.7" />
              <path d="M0,35 Q17.5,27.5 35,35 T70,35" transform="translate(0,10)" opacity="0.4" />

              <path d="M35,35 Q52.5,17.5 70,35 T105,35" />
              <path d="M35,35 Q52.5,22.5 70,35 T105,35" transform="translate(0,5)" opacity="0.7" />
              <path d="M35,35 Q52.5,27.5 70,35 T105,35" transform="translate(0,10)" opacity="0.4" />

              <path d="M70,35 Q87.5,17.5 105,35 T140,35" />
              <path d="M70,35 Q87.5,22.5 105,35 T140,35" transform="translate(0,5)" opacity="0.7" />
              <path
                d="M70,35 Q87.5,27.5 105,35 T140,35"
                transform="translate(0,10)"
                opacity="0.4"
              />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#seigaiha)" />
      </svg>
    </div>
  )
}
