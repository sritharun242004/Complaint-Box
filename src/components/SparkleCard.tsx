'use client'

import { motion } from 'framer-motion'
import { useEffect, useState, ReactNode } from 'react'

type Sparkle = { id: number; x: number; y: number }

function getRandomSparkle(id: number): Sparkle {
  return { id, x: Math.random() * 100, y: Math.random() * 100 }
}

interface Props {
  children: ReactNode
  className?: string
  sparkles?: number
  duration?: number
}

export default function SparkleCard({ children, className = '', sparkles = 12, duration = 3 }: Props) {
  const [dots, setDots] = useState<Sparkle[]>([])

  useEffect(() => {
    setDots(Array.from({ length: sparkles }, (_, i) => getRandomSparkle(i)))
  }, [sparkles])

  const respawnSparkle = (id: number) => {
    setDots((prev) => prev.map((dot) => (dot.id === id ? getRandomSparkle(id) : dot)))
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/50 p-6 bg-white shadow-sm hover:shadow-lg hover:shadow-primary/5 transition-all ${className}`}>
      {/* Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {dots.map((dot) => (
          <motion.span
            key={`${dot.id}-${dot.x}-${dot.y}`}
            className="absolute"
            style={{ top: `${dot.y}%`, left: `${dot.x}%` }}
            animate={{ opacity: [0, 0.6, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration, repeat: 0, delay: Math.random() * duration }}
            onAnimationComplete={() => respawnSparkle(dot.id)}
          >
            <span className="block w-1 h-1 rounded-full bg-primary/40" />
          </motion.span>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
