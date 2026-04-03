'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import FadeInSection, { StaggerContainer, StaggerItem } from '@/components/FadeInSection'

export type AchievementCard = {
  title: string
  desc: string
}

type Props = {
  eyebrow: string
  tamilNameLine: string
  header: string
  cards: AchievementCard[]
  icons: ReactNode[]
}

const bentoCell = (i: number) =>
  cn(
    i === 0 &&
      'md:col-span-2 lg:col-span-6 lg:row-start-1',
    i === 1 && 'md:col-span-1 lg:col-span-3 lg:row-start-2',
    i === 2 && 'md:col-span-1 lg:col-span-3 lg:row-span-2 lg:row-start-2',
    i === 3 && 'md:col-span-2 lg:col-span-3 lg:row-start-3',
  )

export function AchievementsBento({ eyebrow, tamilNameLine, header, cards, icons }: Props) {
  return (
    <section className="layout-section border-b border-border bg-cream">
      <div className="layout-container">
        <FadeInSection>
          <p className={`mb-3 text-center text-xs font-bold uppercase tracking-widest text-primary sm:text-sm`}>
            {eyebrow}
          </p>
          <p className="mb-4 text-center font-tamil text-xl font-black leading-snug text-text/90 sm:text-2xl md:mb-5 md:text-3xl">
            {tamilNameLine}
          </p>
          <h2 className="mb-10 text-center font-heading text-xl uppercase tracking-tighter text-text sm:mb-12 sm:text-2xl md:mb-14 md:text-3xl lg:text-[2.35rem] xl:text-[2.5rem] leading-[1.05]">
            {header}
          </h2>
        </FadeInSection>

        <StaggerContainer className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-6 lg:gap-5">
          {cards.map((card, i) => (
            <StaggerItem key={`achievement-${i}`} className={bentoCell(i)}>
              <article
                className={cn(
                  'group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/90 bg-white p-6 shadow-sm transition-all duration-300 sm:p-8',
                  'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.06]',
                  i === 0 && 'lg:p-10',
                  i === 2 && 'lg:min-h-[min(52vh,420px)]',
                )}
              >
                <div
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-primary/[0.07] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  aria-hidden
                />
                <div
                  className={cn(
                    'relative z-10 mb-5 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 sm:mb-6 sm:h-14 sm:w-14',
                    i % 2 === 0 ? 'bg-primary/12 text-primary' : 'bg-accent/12 text-accent',
                  )}
                >
                  <span className="[&>svg]:h-6 [&>svg]:w-6 sm:[&>svg]:h-7 sm:[&>svg]:w-7">{icons[i]}</span>
                </div>
                <h3
                  className={cn(
                    'relative z-10 mb-3 font-heading uppercase tracking-tight text-text',
                    i === 0 ? 'text-lg sm:text-xl lg:text-2xl' : 'text-base sm:text-lg',
                  )}
                >
                  {card.title}
                </h3>
                <p className="relative z-10 flex-1 text-sm leading-[1.72] text-muted sm:text-base sm:leading-[1.75]">
                  {card.desc}
                </p>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  )
}
