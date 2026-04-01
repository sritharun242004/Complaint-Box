'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import FadeInSection from './FadeInSection'

interface TimelineItem {
  year: string
  title: string
  desc: string
}

interface Props {
  items: TimelineItem[]
  header: string
  subtext: string
}

function TimelineCard({ title, desc }: { title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: 'spring' as const, stiffness: 300, damping: 20 }}
      className="bg-[#FFFAF5] rounded-2xl p-6 shadow-[0_1px_4px_rgba(0,0,0,0.06),0_6px_20px_rgba(0,0,0,0.04)] border border-[#E8DDD2] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08),0_8px_28px_rgba(0,0,0,0.06)] transition-shadow"
    >
      <h3 className="font-bold text-text text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted leading-relaxed">{desc}</p>
    </motion.div>
  )
}

function YearBadge({ year, index }: { year: string; index: number }) {
  return (
    <motion.span
      initial={{ scale: 0.8, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ type: 'spring' as const, stiffness: 200, damping: 15 }}
      className={`inline-block text-white text-sm font-bold px-5 py-2 rounded-xl whitespace-nowrap shadow-sm ${
        index % 2 === 0 ? 'bg-text' : 'bg-[#138808]'
      }`}
    >
      {year}
    </motion.span>
  )
}

export default function TimelineSection({ items, header, subtext }: Props) {
  const containerRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  })

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section id="journey" ref={containerRef} className="py-24 bg-cream">
      <div className="max-w-container mx-auto px-6">
        <FadeInSection>
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-[40px] font-extrabold text-text mb-4">
              {header}
            </h2>
            <p className="text-lg text-muted max-w-xl mx-auto">{subtext}</p>
          </div>
        </FadeInSection>

        <div className="relative max-w-5xl mx-auto">
          {/* Background track */}
          <div className="absolute left-6 md:left-1/2 md:-translate-x-[1px] top-0 bottom-0 w-[2px] bg-[#E8DDD2]" />
          {/* Liquid fill: saffron at top → green at bottom */}
          <motion.div
            className="absolute left-6 md:left-1/2 md:-translate-x-[1px] top-0 w-[2px] bg-gradient-to-b from-primary via-[#FF8533] to-[#138808] origin-top"
            style={{ height: lineHeight }}
          />

          <div className="flex flex-col gap-14 md:gap-16">
            {items.map((item, i) => {
              const isLeft = i % 2 === 0
              const dotColor = i % 2 === 0 ? 'bg-primary' : 'bg-[#138808]'

              return (
                <FadeInSection key={i} delay={i * 0.03}>
                  {/* Mobile */}
                  <div className="md:hidden flex gap-5 items-start">
                    <div className="relative z-10 mt-2 shrink-0">
                      <div className={`w-3 h-3 ${dotColor} rounded-full ring-4 ring-[#FFFAF5]`} />
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <div className="mb-3">
                        <YearBadge year={item.year} index={i} />
                      </div>
                      <TimelineCard title={item.title} desc={item.desc} />
                    </div>
                  </div>

                  {/* Desktop: Alternating left/right */}
                  <div className="hidden md:block">
                    <div className="flex items-center">
                      <div className="w-[calc(50%-28px)] flex justify-end">
                        {isLeft && (
                          <div className="flex items-center gap-5 max-w-md w-full">
                            <TimelineCard title={item.title} desc={item.desc} />
                            <div className={`w-3 h-3 ${dotColor} rounded-full ring-4 ring-[#FFFAF5] shrink-0 relative z-10`} />
                          </div>
                        )}
                      </div>

                      <div className="w-14 flex justify-center relative z-10 mx-[14px]">
                        <YearBadge year={item.year} index={i} />
                      </div>

                      <div className="w-[calc(50%-28px)] flex justify-start">
                        {!isLeft && (
                          <div className="flex items-center gap-5 max-w-md w-full">
                            <div className={`w-3 h-3 ${dotColor} rounded-full ring-4 ring-[#FFFAF5] shrink-0 relative z-10`} />
                            <TimelineCard title={item.title} desc={item.desc} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeInSection>
              )
            })}
          </div>

          {/* End dot — green to match the bottom of the gradient */}
          <div className="absolute left-[21px] md:left-1/2 md:-translate-x-[5px] bottom-0 w-2.5 h-2.5 bg-[#138808] rounded-full ring-4 ring-[#FFFAF5] z-10" />
        </div>
      </div>
    </section>
  )
}
