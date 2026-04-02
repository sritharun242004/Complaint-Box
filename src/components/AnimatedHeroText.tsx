'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Props {
  staticText: string
  rotatingWords: string[]
  interval?: number
  className?: string
  /** e.g. font-tamil / font-hindi so the name line matches script while the h1 stays font-heading for rotating EN */
  staticClassName?: string
}

export default function AnimatedHeroText({
  staticText,
  rotatingWords,
  interval = 2500,
  className = '',
  staticClassName,
}: Props) {
  const [index, setIndex] = useState(0)
  const words = useMemo(() => rotatingWords, [rotatingWords])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev === words.length - 1 ? 0 : prev + 1))
    }, interval)
    return () => clearTimeout(timer)
  }, [index, words, interval])

  return (
    <h1 className={className}>
      <span className={cn('block font-black', staticClassName)}>{staticText}</span>
      <span
        className="relative block overflow-hidden w-full"
        style={{ height: '1.15em', lineHeight: '1.15em' }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            className="absolute left-0 right-0 top-0 bottom-0 flex items-center
                       justify-center md:justify-start
                       whitespace-nowrap font-black text-primary"
            initial={{ y: '110%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-110%' }}
            transition={{ type: 'spring', stiffness: 100, damping: 20, mass: 0.8 }}
          >
            {words[index]}
          </motion.span>
        </AnimatePresence>
      </span>
    </h1>
  )
}
