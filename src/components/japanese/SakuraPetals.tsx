'use client'

import { useEffect, useState } from 'react'

interface Petal {
  id: number
  left: number
  animationDuration: number
  animationDelay: number
  size: number
  rotationSpeed: number
}

export default function SakuraPetals({ count = 15 }: { count?: number }) {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    const newPetals: Petal[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 10 + Math.random() * 20,
      animationDelay: Math.random() * 10,
      size: 15 + Math.random() * 15,
      rotationSpeed: 3 + Math.random() * 5,
    }))
    setPetals(newPetals)
  }, [count])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-20 dark:opacity-10">
      {petals.map((petal) => (
        <div
          key={petal.id}
          className="absolute animate-sakura-fall"
          style={
            {
              left: `${petal.left}%`,
              animationDuration: `${petal.animationDuration}s`,
              animationDelay: `${petal.animationDelay}s`,
              fontSize: `${petal.size}px`,
              '--rotation-speed': `${petal.rotationSpeed}s`,
            } as React.CSSProperties
          }
        >
          🌸
        </div>
      ))}
    </div>
  )
}
