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
  const isInView = useInView(ref, { once: true, margin: '-40px' })
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
    <div ref={ref} className="text-center px-1">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="font-heading text-3xl uppercase tracking-tighter text-white tabular-nums sm:text-4xl md:text-5xl"
      >
        {prefix}{formatted}{suffix}
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="text-[10px] sm:text-xs text-white/75 mt-2 sm:mt-3 font-medium uppercase tracking-widest leading-snug"
      >
        {label}
      </motion.p>
    </div>
  )
}
