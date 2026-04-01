'use client'

import { useSpring, useInView, motion } from 'framer-motion'
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
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(0)
  const spring = useSpring(0, { bounce: 0, duration: duration * 1000 })

  useEffect(() => {
    spring.on('change', (v) => setDisplay(Math.round(v)))
  }, [spring])

  useEffect(() => {
    if (isInView) spring.set(end)
  }, [isInView, spring, end])

  const formatted = display.toLocaleString()

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, rotateX: 90, y: 20 }}
        animate={isInView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ perspective: 400 }}
        className="text-4xl md:text-5xl font-extrabold text-white tabular-nums"
      >
        {prefix}{formatted}{suffix}
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="text-sm text-white/70 mt-2 font-medium"
      >
        {label}
      </motion.p>
    </div>
  )
}
