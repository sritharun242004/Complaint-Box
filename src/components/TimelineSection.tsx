'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'framer-motion'

interface TimelineItem {
  year: string
  title: string
  desc: string
  image?: string
}

interface Props {
  items: TimelineItem[]
  header: string
  subtext: string
}

/* placeholder images per milestone */
function generatePlaceholderImage(index: number, year: string): string {
  const colors = index % 2 === 0
    ? { bg: '#FFF3E6', accent: '#FF6B00' }
    : { bg: '#E8F5E9', accent: '#138808' }
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="280" viewBox="0 0 400 280">
      <rect fill="${colors.bg}" width="400" height="280" rx="16"/>
      <circle cx="200" cy="120" r="50" fill="${colors.accent}" opacity="0.15"/>
      <circle cx="200" cy="120" r="30" fill="${colors.accent}" opacity="0.25"/>
      <text x="200" y="128" text-anchor="middle" font-family="system-ui" font-size="20" font-weight="bold" fill="${colors.accent}">${year}</text>
      <text x="200" y="220" text-anchor="middle" font-family="system-ui" font-size="13" fill="${colors.accent}" opacity="0.6">Journey milestone</text>
    </svg>
  `)}`
}

const CARD_WIDTH = 320
const CARD_GAP = 48

function TimelineCard({
  item,
  index,
  totalItems,
  progress,
}: {
  item: TimelineItem
  index: number
  totalItems: number
  progress: number
}) {
  const dotColor = index % 2 === 0 ? 'bg-primary' : 'bg-[#138808]'
  const badgeBg = index % 2 === 0 ? 'bg-text' : 'bg-[#138808]'
  const imgSrc = item.image || generatePlaceholderImage(index, item.year)

  // Each card reveals when it becomes the "center" card
  const cardCenter = totalItems > 1 ? index / (totalItems - 1) : 0
  const distance = Math.abs(progress - cardCenter)
  const isRevealed = distance < 0.12 || progress > cardCenter
  const revealAmount = Math.min(1, Math.max(0, 1 - (Math.max(0, cardCenter - progress) * (totalItems - 1)) * 0.8))

  return (
    <div className="flex flex-col items-center shrink-0" style={{ width: CARD_WIDTH }}>
      {/* Image reveal with clip / parallax */}
      <div
        className="rounded-2xl overflow-hidden mb-5 relative"
        style={{
          width: CARD_WIDTH - 20,
          height: 200,
          clipPath: `inset(0 ${Math.max(0, (1 - revealAmount) * 100)}% 0 0)`,
          transition: 'clip-path 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        <img
          src={imgSrc}
          alt={item.title}
          className="w-full h-full object-cover"
          style={{
            transform: `translateX(${Math.max(0, (1 - revealAmount) * 25)}px) scale(${1 + (1 - revealAmount) * 0.05})`,
            transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
        {/* Shimmer */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none"
          style={{
            transform: `translateX(${(1 - revealAmount) * 120}%)`,
            transition: 'transform 0.7s cubic-bezier(0.25, 0.1, 0.25, 1)',
            opacity: revealAmount < 0.95 ? 1 : 0,
          }}
        />
      </div>

      {/* Year badge */}
      <span
        className={`inline-block text-white text-sm font-bold px-5 py-2 rounded-xl shadow-sm mb-4 ${badgeBg}`}
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(8px)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        {item.year}
      </span>

      {/* Dot on the line */}
      <div className="relative z-10 mb-4">
        <div
          className={`w-4 h-4 ${dotColor} rounded-full ring-4 ring-cream`}
          style={{
            transform: isRevealed ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
      </div>

      {/* Card content */}
      <div
        className="bg-[#FFFAF5] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_6px_20px_rgba(0,0,0,0.04)] border border-[#E8DDD2]"
        style={{
          width: CARD_WIDTH - 20,
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) 0.08s',
        }}
      >
        <h3 className="font-bold text-text text-lg mb-2">{item.title}</h3>
        <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
      </div>
    </div>
  )
}

export default function TimelineSection({ items, header, subtext }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  // Max translation = distance from first card center to last card center
  const maxTranslate = Math.max(0, (items.length - 1) * (CARD_WIDTH + CARD_GAP))

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  })

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    setScrollProgress(latest)
  })

  // Horizontal translate: moves the track so active card is centered
  const translateX = useTransform(
    smoothProgress,
    [0, 1],
    [0, -maxTranslate]
  )

  // Line width follows progress
  const lineWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])

  // Parallax for header
  const headerY = useTransform(scrollYProgress, [0, 0.3], [0, -30])

  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative bg-cream"
      style={{ height: `${Math.max(250, items.length * 40)}vh` }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header with parallax */}
        <motion.div className="text-center pt-14 pb-6 px-6 shrink-0" style={{ y: headerY }}>
          <h2 className="text-3xl md:text-[40px] font-extrabold text-text mb-3">
            {header}
          </h2>
          <p className="text-lg text-muted max-w-xl mx-auto">{subtext}</p>
        </motion.div>

        {/* Scroll hint */}
        <div className="flex justify-center mb-3 shrink-0">
          <motion.div
            className="flex items-center gap-2 text-sm text-muted/50"
            animate={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="animate-pulse">
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scroll to explore
          </motion.div>
        </div>

        {/* Timeline area */}
        <div className="flex-1 flex items-center relative overflow-hidden">
          {/* Horizontal liquid line — full width, at the dot row level */}
          <div className="absolute left-0 right-0 pointer-events-none z-0" style={{ top: '50%', marginTop: 56 }}>
            <div className="h-[2px] bg-[#E8DDD2] w-full" />
            <motion.div
              className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-primary via-[#FF8533] to-[#138808] origin-left"
              style={{ width: lineWidth }}
            />
          </div>

          {/* Sliding track — starts with first card centered via left padding */}
          <motion.div
            className="flex items-start relative z-10"
            style={{
              gap: CARD_GAP,
              paddingLeft: `calc(50vw - ${CARD_WIDTH / 2}px)`,
              paddingRight: `calc(50vw - ${CARD_WIDTH / 2}px)`,
              x: translateX,
            }}
          >
            {items.map((item, i) => (
              <TimelineCard
                key={i}
                item={item}
                index={i}
                totalItems={items.length}
                progress={scrollProgress}
              />
            ))}
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="px-6 pb-5 shrink-0">
          <div className="max-w-sm mx-auto">
            <div className="h-1 bg-[#E8DDD2] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-[#138808] rounded-full"
                style={{ width: lineWidth }}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-xs text-muted/40 font-medium">
              <span>{items[0]?.year}</span>
              <span>{items[items.length - 1]?.year}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
