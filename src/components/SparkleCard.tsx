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
    <div className={`relative p-4 sm:p-5 border border-border bg-white rounded-lg active:border-primary/40 sm:hover:border-primary/40 transition-colors duration-200 group ${className}`}>
      <div className="relative z-10">{children}</div>
    </div>
  )
}
