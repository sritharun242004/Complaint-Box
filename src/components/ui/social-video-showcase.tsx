'use client'

import { cn } from '@/lib/utils'
import { useState } from 'react'
import FadeInSection from '@/components/FadeInSection'

export type MediaShowcaseItem = {
  tweetId: string
  title: string
  description: string
  thumbnail: string
  postUrl: string
}

export type SocialVideoShowcaseProps = {
  eyebrow: string
  header: string
  subtext?: string
  viewOnX: string
  embedHint?: string
  items: MediaShowcaseItem[]
}

const sectionEyebrow =
  'text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-primary'
const sectionTitle =
  'font-heading uppercase tracking-tighter text-xl sm:text-2xl md:text-3xl lg:text-[2.35rem] xl:text-[2.5rem] text-text leading-[1.05]'

function tweetEmbedSrc(tweetId: string) {
  return `https://platform.twitter.com/embed/Tweet.html?id=${encodeURIComponent(tweetId)}&theme=light&dnt=true`
}

export function SocialVideoShowcase({
  eyebrow,
  header,
  subtext,
  viewOnX,
  embedHint,
  items,
}: SocialVideoShowcaseProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const [selected, setSelected] = useState(0)
  const activeIndex = hovered ?? selected

  return (
    <section id="vision" className="bg-cream py-12 sm:py-16 md:py-20">
      <div className="mx-auto max-w-container px-4 sm:px-5 md:px-8">
        <FadeInSection>
          <p className={`${sectionEyebrow} mb-2`}>{eyebrow}</p>
          <h2 className={`${sectionTitle} mb-3 sm:mb-4`}>{header}</h2>
          {subtext ? (
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-text-light sm:mb-10 sm:text-base">
              {subtext}
            </p>
          ) : (
            <div className="mb-8 sm:mb-10" />
          )}
          {embedHint ? (
            <p className="sr-only">{embedHint}</p>
          ) : null}
        </FadeInSection>

        <div
          className="flex flex-col gap-3 md:h-[min(56vh,440px)] md:flex-row md:gap-2"
          onMouseLeave={() => setHovered(null)}
        >
          {items.map((item, i) => {
            const expanded = activeIndex === i
            return (
              <article
                key={item.tweetId}
                className={cn(
                  'relative overflow-hidden rounded-lg border border-border bg-white shadow-sm transition-all duration-500 ease-out',
                  'md:min-h-0',
                  expanded
                    ? 'z-[1] min-h-[min(72vh,460px)] md:min-h-0 md:flex-[3] md:min-w-[min(100%,640px)]'
                    : 'z-0 max-h-[72px] min-h-[72px] md:max-h-none md:min-h-full md:flex-[0.65] md:min-w-[3.25rem]',
                  expanded && 'max-md:order-first',
                )}
                onMouseEnter={() => setHovered(i)}
              >
                <button
                  type="button"
                  className={cn(
                    'absolute inset-0 z-[5] md:hidden',
                    expanded && 'pointer-events-none',
                  )}
                  aria-label={`${item.title} — ${expanded ? 'expanded' : 'show post'}`}
                  aria-expanded={expanded}
                  onClick={() => setSelected(i)}
                />

                {/* Desktop + mobile: poster when collapsed */}
                <div
                  className={cn(
                    'absolute inset-0 transition-opacity duration-300',
                    expanded ? 'opacity-0 md:opacity-40' : 'opacity-100',
                  )}
                  aria-hidden={expanded}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.thumbnail}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E]/88 via-[#1A1A2E]/25 to-transparent" />
                </div>

                {/* Mobile collapsed: thumb + text row */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 z-[3] flex items-stretch bg-white md:hidden',
                    expanded ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  <div className="relative h-full w-20 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.thumbnail}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="pointer-events-auto flex min-w-0 flex-1 flex-col justify-center px-3 py-2">
                    <p className="font-heading text-left text-xs font-semibold uppercase tracking-wide text-text">
                      {item.title}
                    </p>
                    <p className="mt-1 line-clamp-2 text-left text-[11px] leading-snug text-text-light">
                      {item.description}
                    </p>
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex w-fit text-[11px] font-semibold text-primary underline-offset-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {viewOnX}
                    </a>
                  </div>
                </div>

                {/* Desktop collapsed: vertical title in strip */}
                <div
                  className={cn(
                    'pointer-events-none absolute inset-0 z-[3] hidden items-center justify-center md:flex',
                    expanded ? 'opacity-0' : 'opacity-100',
                  )}
                >
                  <div className="pointer-events-auto flex flex-col items-center justify-end pb-4 pt-8">
                    <p className="font-heading text-center text-[10px] font-semibold uppercase tracking-wide text-white [writing-mode:vertical-rl] rotate-180">
                      {item.title}
                    </p>
                    <a
                      href={item.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 text-[10px] font-semibold text-primary underline-offset-2 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {viewOnX}
                    </a>
                  </div>
                </div>

                {expanded ? (
                  <div className="relative z-10 flex h-full min-h-[min(68vh,440px)] w-full flex-col bg-cream md:min-h-0">
                    <iframe
                      title={item.title}
                      src={tweetEmbedSrc(item.tweetId)}
                      className="min-h-[min(64vh,400px)] w-full flex-1 border-0 md:min-h-[360px]"
                      loading="lazy"
                      allow="encrypted-media; picture-in-picture"
                    />
                  </div>
                ) : null}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
