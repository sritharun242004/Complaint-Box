'use client'

import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  sparkles?: number
  duration?: number
}

export default function SparkleCard({ children, className = '' }: Props) {
  return (
    <div
      className={`group relative rounded-lg border border-border bg-white p-5 transition-colors duration-200 active:border-primary/40 sm:p-6 sm:hover:border-primary/40 ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}
