'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { useEffect, useRef } from 'react'

interface VerticalMarqueeProps {
  children: ReactNode
  pauseOnHover?: boolean
  reverse?: boolean
  className?: string
  speed?: number
  onItemsRef?: (items: HTMLElement[]) => void
}

function VerticalMarquee({
  children,
  pauseOnHover = false,
  reverse = false,
  className,
  speed = 30,
  onItemsRef,
}: VerticalMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (onItemsRef && containerRef.current) {
      const items = Array.from(containerRef.current.querySelectorAll('.marquee-item')) as HTMLElement[]
      onItemsRef(items)
    }
  }, [onItemsRef])

  return (
    <div
      ref={containerRef}
      className={cn('group flex flex-col overflow-hidden', className)}
      style={{ '--duration': `${speed}s` } as CSSProperties}
    >
      <div
        className={cn(
          'flex shrink-0 flex-col animate-marquee-vertical',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          'flex shrink-0 flex-col animate-marquee-vertical',
          reverse && '[animation-direction:reverse]',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
        aria-hidden="true"
      >
        {children}
      </div>
    </div>
  )
}

export interface CTAWithTextMarqueeProps {
  eyebrow?: string
  headline: string
  subtext: string
  primaryLabel: string
  primaryHref: string
  secondaryLabel?: string
  secondaryHref?: string
  marqueeItems: string[]
  /** Marquee column on large screens */
  marqueeSide?: 'left' | 'right'
  marqueeSpeed?: number
  className?: string
}

export function CTAWithTextMarquee({
  eyebrow,
  headline,
  subtext,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  marqueeItems,
  marqueeSide = 'right',
  marqueeSpeed = 22,
  className,
}: CTAWithTextMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const marqueeContainer = marqueeRef.current
    if (!marqueeContainer) return

    const updateOpacity = () => {
      const items = marqueeContainer.querySelectorAll('.marquee-item')
      const containerRect = marqueeContainer.getBoundingClientRect()
      const centerY = containerRect.top + containerRect.height / 2

      items.forEach((item) => {
        const itemRect = item.getBoundingClientRect()
        const itemCenterY = itemRect.top + itemRect.height / 2
        const distance = Math.abs(centerY - itemCenterY)
        const maxDistance = containerRect.height / 2
        const normalizedDistance = Math.min(distance / maxDistance, 1)
        const opacity = 1 - normalizedDistance * 0.72
        ;(item as HTMLElement).style.opacity = opacity.toString()
      })
    }

    let rafId = 0
    const loop = () => {
      updateOpacity()
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const marqueeCol = (
    <div
      ref={marqueeRef}
      className={cn(
        'relative flex h-[min(52vh,28rem)] items-center justify-center sm:h-[min(56vh,32rem)] lg:h-[min(62vh,36rem)]',
        'opacity-0 animate-fade-in-up [animation-delay:400ms] [animation-fill-mode:forwards]',
        marqueeSide === 'left' ? 'lg:order-1' : 'lg:order-2'
      )}
    >
      <div className="relative h-full w-full">
        <VerticalMarquee speed={marqueeSpeed} className="h-full">
          {marqueeItems.map((item, idx) => (
            <div
              key={idx}
              className="marquee-item font-display text-3xl font-light tracking-tight text-text py-6 sm:text-4xl md:text-5xl lg:py-8 lg:text-6xl"
            >
              {item}
            </div>
          ))}
        </VerticalMarquee>
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-cream via-cream/55 to-transparent sm:h-40"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-32 bg-gradient-to-t from-cream via-cream/55 to-transparent sm:h-40"
          aria-hidden
        />
      </div>
    </div>
  )

  const copyCol = (
    <div
      className={cn(
        'max-w-xl space-y-6 sm:space-y-8',
        marqueeSide === 'left' ? 'lg:order-2' : 'lg:order-1'
      )}
    >
      {eyebrow ? (
        <p className="text-[10px] font-semibold uppercase tracking-widest text-primary opacity-0 animate-fade-in-up [animation-fill-mode:forwards] sm:text-xs">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-heading text-3xl uppercase tracking-tighter leading-[1.05] text-text opacity-0 animate-fade-in-up [animation-delay:120ms] [animation-fill-mode:forwards] sm:text-4xl md:text-5xl lg:text-6xl">
        {headline}
      </h2>
      <p className="text-base leading-[1.72] text-muted opacity-0 animate-fade-in-up [animation-delay:240ms] [animation-fill-mode:forwards] sm:text-lg sm:leading-[1.75] md:text-xl">
        {subtext}
      </p>
      <div className="flex flex-col gap-4 opacity-0 animate-fade-in-up [animation-delay:360ms] [animation-fill-mode:forwards] sm:flex-row sm:flex-wrap sm:gap-5">
        <Link href={primaryHref} className="btn-primary w-full justify-center sm:w-auto">
          {primaryLabel}
        </Link>
        {secondaryLabel && secondaryHref ? (
          <Link href={secondaryHref} className="btn-outline w-full justify-center sm:w-auto">
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  )

  return (
    <section
      className={cn(
        'layout-section relative overflow-hidden border-t border-border bg-cream',
        className
      )}
    >
      <div className="layout-container opacity-0 animate-fade-in-up [animation-fill-mode:forwards]">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-28">
          {marqueeSide === 'left' ? (
            <>
              {marqueeCol}
              {copyCol}
            </>
          ) : (
            <>
              {copyCol}
              {marqueeCol}
            </>
          )}
        </div>
      </div>
    </section>
  )
}

export default CTAWithTextMarquee
