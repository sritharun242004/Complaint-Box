'use client'

import { motion, useSpring, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

interface Props {
  end: number
  suffix?: string
  prefix?: string
  label: string
  duration?: number
}

export default function AnimatedCounter({ end, suffix = '', prefix = '', label, duration = 1.5 }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [display, setDisplay] = useState(0)
  const spring = useSpring(0, { bounce: 0, duration: duration * 1000 })

  useEffect(() => {
    spring.on('change', (v) => setDisplay(Math.round(v)))
  }, [spring])

  useEffect(() => {
    if (isInView) spring.set(end)
  }, [isInView, spring, end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-extrabold text-text tabular-nums">
        {prefix}{display.toLocaleString()}{suffix}
      </div>
      <p className="text-sm text-muted mt-2 font-medium">{label}</p>
    </div>
  )
}
