'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  staticText: string
  rotatingWords: string[]
  interval?: number
  className?: string
}

export default function AnimatedHeroText({ staticText, rotatingWords, interval = 2500, className = '' }: Props) {
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
      <span className="block">{staticText}</span>
      {/*
        Line-height at leading-[1.1] = font-size × 1.1.
        We use 1.15em so the container is exactly tall enough for one line
        without letting the wrapped second line bleed through.
        whitespace-nowrap prevents the text from ever wrapping.
      */}
      <span
        className="relative block overflow-hidden w-full"
        style={{ height: '1.15em', lineHeight: '1.15em' }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            className="absolute left-0 right-0 top-0 bottom-0 flex items-center
                       justify-center md:justify-start
                       font-extrabold whitespace-nowrap
                       bg-gradient-to-r from-primary to-[#FF8533] bg-clip-text text-transparent"
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
