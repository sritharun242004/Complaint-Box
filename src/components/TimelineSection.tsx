'use client'

import { useRef, useState, useEffect } from 'react'
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
  headerClassName?: string
}

function useResponsiveValues() {
  const [values, setValues] = useState({ cardWidth: 300, gap: 48, isMobile: false })
  useEffect(() => {
    function calc() {
      const w = window.innerWidth
      const isMobile = w < 768
      setValues({
        cardWidth: Math.min(300, w * 0.82),
        gap: isMobile ? 28 : 48,
        isMobile,
      })
    }
    calc()
    window.addEventListener('resize', calc)
    return () => window.removeEventListener('resize', calc)
  }, [])
  return values
}

function TimelineCard({
  item,
  index,
  totalItems,
  progress,
  cardWidth,
}: {
  item: TimelineItem
  index: number
  totalItems: number
  progress: number
  cardWidth: number
}) {
  const cardCenter = totalItems > 1 ? (index / (totalItems - 1)) * 0.85 : 0
  const isRevealed = progress > cardCenter - 0.08
  const revealAmount = Math.min(1, Math.max(0, 1 - (Math.max(0, cardCenter - progress) * (totalItems - 1)) * 0.7))

  return (
    <div className="flex flex-col items-center shrink-0" style={{ width: cardWidth }}>
      <div
        className="overflow-hidden mb-3 sm:mb-6 relative bg-primary-light/40 border border-border"
        style={{
          width: cardWidth - 16,
          height: 160,
          clipPath: `inset(0 ${Math.max(0, (1 - revealAmount) * 100)}% 0 0)`,
          transition: 'clip-path 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
      >
        {item.image ? (
          <div
            className="relative w-full h-full"
            style={{
              transform: `translateX(${Math.max(0, (1 - revealAmount) * 16)}px)`,
              transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <span className="absolute bottom-2 left-2 text-xl sm:text-3xl font-semibold font-display text-white select-none drop-shadow-md">{item.year}</span>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center bg-primary-light/30"
            style={{
              transform: `translateX(${Math.max(0, (1 - revealAmount) * 16)}px)`,
              transition: 'transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
            }}
          >
            <span className="text-3xl sm:text-5xl font-semibold font-display text-primary/25 select-none">{item.year}</span>
          </div>
        )}
      </div>

      <span
        className={`inline-block text-white text-[10px] sm:text-xs font-semibold px-3 py-1 mb-2 sm:mb-4 uppercase tracking-widest ${
          index % 2 === 0 ? 'bg-primary' : 'bg-accent'
        }`}
        style={{
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.35s ease, transform 0.35s ease',
        }}
      >
        {item.year}
      </span>

      <div className="relative z-10 mb-2 sm:mb-4">
        <div
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full ring-2 ring-white ${
            index % 2 === 0 ? 'bg-primary' : 'bg-accent'
          }`}
          style={{
            transform: isRevealed ? 'scale(1)' : 'scale(0)',
            transition: 'transform 0.25s ease',
          }}
        />
      </div>

      <div
        className="border border-border bg-white p-4 transition-colors duration-200 sm:p-6 sm:hover:border-primary/30"
        style={{
          width: cardWidth - 16,
          minHeight: 120,
          opacity: isRevealed ? 1 : 0,
          transform: isRevealed ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.45s ease 0.06s, transform 0.45s ease 0.06s',
        }}
      >
        <h3 className="mb-1.5 text-sm font-bold text-text sm:mb-2.5 sm:text-lg">{item.title}</h3>
        <p className="text-xs leading-[1.6] text-muted sm:text-sm sm:leading-[1.72]">{item.desc}</p>
      </div>
    </div>
  )
}

export default function TimelineSection({ items, header, subtext, headerClassName }: Props) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const { cardWidth, gap, isMobile } = useResponsiveValues()

  const maxTranslate = Math.max(0, (items.length - 1) * (cardWidth + gap))

  // On mobile: shorter scroll height so it doesn't feel endless
  const sectionHeight = isMobile
    ? `${Math.max(180, items.length * 32)}vh`
    : `${Math.max(220, items.length * 38)}vh`

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Snappier spring on mobile
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: isMobile ? 120 : 80,
    damping: isMobile ? 30 : 25,
    restDelta: 0.001,
  })

  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    setScrollProgress(latest)
  })

  const translateX = useTransform(smoothProgress, [0, 1], [0, -maxTranslate])
  const lineWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%'])
  const headerY = useTransform(scrollYProgress, [0, 0.25], [0, -16])

  // Mobile: horizontal swipe scroll with progress line
  const mobileScrollRef = useRef<HTMLDivElement>(null)
  const [mobileProgress, setMobileProgress] = useState(0)

  useEffect(() => {
    const el = mobileScrollRef.current
    if (!el || !isMobile) return
    const onScroll = () => {
      const maxScroll = el.scrollWidth - el.clientWidth
      setMobileProgress(maxScroll > 0 ? el.scrollLeft / maxScroll : 0)
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [isMobile])

  if (isMobile) {
    return (
      <section id="journey" className="relative bg-white border-t border-border py-10">
        <div className="px-5 pb-6 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
            Journey
          </p>
          <h2 className={`mb-2 px-2 text-xl leading-[1.05] tracking-tighter text-text ${headerClassName || 'font-heading uppercase'}`}>
            {header}
          </h2>
          <p className="mx-auto max-w-md px-2 text-xs leading-[1.6] text-muted">{subtext}</p>
        </div>

        <div className="flex justify-center mb-3">
          <div className="flex items-center gap-1.5 text-[10px] text-muted uppercase tracking-widest">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Swipe
          </div>
        </div>

        <div ref={mobileScrollRef} className="overflow-x-auto overflow-y-hidden scrollbar-hide">
          <div
            className="flex items-start px-5"
            style={{ gap, width: 'max-content' }}
          >
            {items.map((item, i) => (
              <TimelineCard
                key={i}
                item={item}
                index={i}
                totalItems={items.length}
                progress={1}
                cardWidth={cardWidth}
              />
            ))}
          </div>
        </div>

        <div className="px-5 pt-4">
          <div className="max-w-xs mx-auto">
            <div className="relative h-[2px] bg-border overflow-hidden">
              <div
                className="absolute top-0 left-0 h-full bg-primary"
                style={{ width: `${mobileProgress * 100}%`, transition: 'width 0.15s ease-out' }}
              />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted uppercase tracking-widest">
              <span>{items[0]?.year}</span>
              <span>{items[items.length - 1]?.year}</span>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Desktop: vertical scroll driven horizontal animation
  return (
    <section
      id="journey"
      ref={sectionRef}
      className="relative bg-white border-t border-border"
      style={{ height: sectionHeight }}
    >
      <div className="sticky top-0 min-h-[100dvh] h-[100dvh] overflow-hidden flex flex-col">
        <motion.div
          className="shrink-0 px-5 pb-4 pt-12 text-center sm:px-8 sm:pb-8 sm:pt-20 md:pt-24"
          style={{ y: headerY }}
        >
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-primary sm:mb-4 sm:text-sm">
            Journey
          </p>
          <h2 className={`mb-2 px-2 text-xl leading-[1.05] tracking-tighter text-text sm:mb-4 sm:text-3xl md:text-4xl lg:text-5xl ${headerClassName || 'font-heading uppercase'}`}>
            {header}
          </h2>
          <p className="mx-auto max-w-md px-2 text-xs leading-[1.6] text-muted sm:text-base sm:leading-[1.75]">{subtext}</p>
        </motion.div>

        <div className="flex justify-center mb-1 sm:mb-2 shrink-0">
          <motion.div
            className="flex items-center gap-1.5 text-[10px] sm:text-xs text-muted uppercase tracking-widest"
            animate={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          >
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden>
              <path d="M4 10h12M12 6l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Scroll
          </motion.div>
        </div>

        <div className="flex-1 flex items-center relative overflow-hidden min-h-0">
          <div className="absolute left-0 right-0 pointer-events-none z-0" style={{ top: '50%', marginTop: 40 }}>
            <div className="h-px bg-border w-full" />
            <motion.div
              className="absolute top-0 left-0 h-px bg-primary origin-left"
              style={{ width: lineWidth }}
            />
          </div>

          <motion.div
            className="flex items-start relative z-10"
            style={{
              gap,
              paddingLeft: `calc(50vw - ${cardWidth / 2}px)`,
              paddingRight: `calc(50vw - ${cardWidth / 2}px)`,
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
                cardWidth={cardWidth}
              />
            ))}
          </motion.div>
        </div>

        <div className="shrink-0 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8 sm:pb-8">
          <div className="max-w-xs mx-auto">
            <div className="h-px bg-border overflow-hidden">
              <motion.div className="h-full bg-accent" style={{ width: lineWidth }} />
            </div>
            <div className="flex justify-between mt-2 text-[10px] text-muted uppercase tracking-widest">
              <span>{items[0]?.year}</span>
              <span>{items[items.length - 1]?.year}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
