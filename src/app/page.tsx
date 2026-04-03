'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'
import FadeInSection, { StaggerContainer, StaggerItem } from '@/components/FadeInSection'
import AnimatedHeroText from '@/components/AnimatedHeroText'
import AnimatedCounter from '@/components/AnimatedCounter'
import SparkleCard from '@/components/SparkleCard'
import BJPLotus from '@/components/BJPLotus'
import LotusWatermark from '@/components/LotusWatermark'
import { CTAWithTextMarquee } from '@/components/ui/cta-with-text-marquee'
import { SocialVideoShowcase } from '@/components/ui/social-video-showcase'
import TimelineSection from '@/components/TimelineSection'
import { AchievementsBento } from '@/components/AchievementsBento'

const trustIcons = [
  <svg key="ear" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m-4-4h8" /></svg>,
  <svg key="cal" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>,
  <svg key="heart" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>,
  <svg key="cog" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="users" className="w-6 h-6 sm:w-7 sm:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>,
]

const achievementIcons = [
  <svg key="a1" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" /></svg>,
  <svg key="a2" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>,
  <svg key="a3" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg>,
  <svg key="a4" className="w-7 h-7 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 110-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 01-1.44-4.282m3.102.069a18.03 18.03 0 01-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 018.835 2.535M10.34 6.66a23.847 23.847 0 008.835-2.535m0 0A23.74 23.74 0 0018.795 3m.38 1.125a23.91 23.91 0 011.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 001.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 010 3.46" /></svg>,
]

const sectionEyebrow = 'text-xs sm:text-sm font-bold uppercase tracking-widest text-primary'
const sectionTitleBase =
  'font-black tracking-tighter text-xl sm:text-2xl md:text-3xl lg:text-[2.35rem] xl:text-[2.5rem] text-text leading-[1.05]'

/** One image per About bullet; swap files in /public anytime. */
const WHO_I_AM_IMAGES = [
  '/Dr Tamilisai Soundararajan Main Pic.jpg',
  '/Tamilisai Thumbnail.jpg',
  'https://staticprintenglish.theprint.in/wp-content/uploads/2021/02/Tamilisai-Soundarajan.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Tamilisai_Soundararajan_with_Bathukamma_in_Raj_Bhavan%2C_Hyderabad_%2830.09.2019%29_03.jpg/1280px-Tamilisai_Soundararajan_with_Bathukamma_in_Raj_Bhavan%2C_Hyderabad_%2830.09.2019%29_03.jpg',
  'https://www.pondiuni.edu.in/wp-content/uploads/2021/06/HappeningPU18.06.2021-img2-1024x575.jpg',
] as const

export default function Home() {
  const { t, lang } = useI18n()
  const fontClass = lang === 'ta' ? 'font-tamil font-extrabold' : lang === 'hi' ? 'font-hindi font-extrabold' : 'font-heading uppercase'
  const sectionTitle = `${fontClass} ${sectionTitleBase}`
  const [aboutImageIndex, setAboutImageIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Auto-cycle about images on mobile
  useEffect(() => {
    if (!isMobile) return
    const timer = setInterval(() => {
      setAboutImageIndex(prev => (prev + 1) % WHO_I_AM_IMAGES.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [isMobile])

  const whoPoints = [
    t.whoIAm.point1,
    t.whoIAm.point2,
    t.whoIAm.point3,
    t.whoIAm.point4,
    t.whoIAm.point5,
  ]

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-white md:min-h-[calc(100dvh-120px)] md:flex md:items-center">
        <LotusWatermark variant="on-light" />
        <div className="layout-hero-inner">
          <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-14 lg:gap-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="w-full order-1 md:order-2 md:flex-[2]"
            >
              <div className="mx-auto w-full max-w-[260px] sm:max-w-[300px] md:max-w-none">
                <div className="aspect-[3/4] sm:aspect-[3/4] md:aspect-[3/4] max-h-[320px] sm:max-h-[380px] md:max-h-none overflow-hidden border border-border bg-white">
                  <img
                    src="/Dr Tamilisai Soundararajan Main Pic.jpg"
                    alt="Dr. Tamilisai Soundararajan"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <div className="mt-3 flex justify-end opacity-70">
                  <BJPLotus size={24} animate={false} />
                </div>
              </div>
            </motion.div>

            <div className="order-2 flex-[3] text-center md:order-1 md:text-left">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                <span className={`${sectionEyebrow} mb-4 inline-block sm:mb-5`}>{t.hero.eyebrow}</span>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <AnimatedHeroText
                  staticText={t.hero.nameLine}
                  rotatingWords={t.hero.rotatingPhrases}
                  staticClassName={lang === 'hi' ? 'font-hindi normal-case' : 'font-tamil normal-case'}
                  className="mb-5 font-heading text-[1.75rem] font-black uppercase tracking-tighter leading-[1.05] text-text sm:mb-6 sm:text-4xl md:text-5xl lg:text-6xl"
                  interval={2200}
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="mx-auto mb-8 max-w-lg text-sm text-center leading-[1.75] text-muted sm:mb-10 sm:text-base md:mx-0 md:text-left md:text-lg md:leading-[1.7]"
              >
                {t.hero.subtext}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="flex w-full flex-col gap-4 sm:flex-row sm:justify-center md:justify-start md:gap-5"
              >
                <Link href="/pugaar-petti" className="btn-primary w-full sm:w-auto sm:min-w-[160px]">
                  {t.hero.cta1}
                  <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <a href="#journey" className="btn-outline w-full sm:w-auto sm:min-w-[160px]">
                  {t.hero.cta2}
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <FadeInSection>
        <section id="about" className="layout-section border-b border-border bg-cream">
          <div className="layout-container">
            <div className="flex flex-col gap-10 md:flex-row md:items-stretch md:gap-14 lg:gap-16">
              <motion.div
                className="w-full md:w-5/12 md:flex md:flex-col"
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -16 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
              >
                <div
                  className="relative mx-auto w-full max-w-xs overflow-hidden border border-border bg-white sm:max-w-sm md:mx-0 md:max-w-none md:flex-1 md:min-h-[min(72vh,560px)] min-h-[280px] aspect-[4/5] md:aspect-auto"
                  aria-live="polite"
                >
                  {WHO_I_AM_IMAGES.map((src, i) => (
                    <motion.img
                      key={`about-img-${i}`}
                      src={src}
                      alt=""
                      className="pointer-events-none absolute inset-0 z-[1] h-full w-full object-cover object-center"
                      style={{ zIndex: aboutImageIndex === i ? 2 : 1 }}
                      initial={false}
                      animate={{
                        opacity: aboutImageIndex === i ? 1 : 0,
                        scale: aboutImageIndex === i ? 1 : 1.06,
                      }}
                      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                    />
                  ))}
                </div>
              </motion.div>

              <div className="flex w-full flex-col md:w-7/12">
                <p className={`${sectionEyebrow} mb-3`}>About</p>
                <h2 className={`${sectionTitle} mb-8 sm:mb-10`}>{t.whoIAm.header}</h2>
                <StaggerContainer
                  className="divide-y divide-border border-y border-border bg-white"
                  onMouseLeave={() => setAboutImageIndex(0)}
                >
                  {whoPoints.map((point, i) => (
                    <StaggerItem key={i}>
                      <div
                        role="button"
                        tabIndex={0}
                        className="flex cursor-pointer gap-4 px-4 py-5 outline-none transition-colors duration-300 hover:bg-primary/[0.04] focus-visible:bg-primary/[0.06] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary sm:gap-5 sm:px-5 sm:py-6"
                        onMouseEnter={() => setAboutImageIndex(i)}
                        onFocus={() => setAboutImageIndex(i)}
                        onClick={() => setAboutImageIndex(i)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            setAboutImageIndex(i)
                          }
                        }}
                      >
                        <span className="w-7 shrink-0 pt-0.5 text-xs font-semibold text-primary tabular-nums sm:w-8">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <p className="text-sm leading-[1.7] text-text-light sm:text-base sm:leading-[1.72]">{point}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </div>
          </div>
        </section>
      </FadeInSection>

      <section className="layout-section border-b border-border bg-cream">
        <div className="layout-container">
          <FadeInSection>
            <p className={`${sectionEyebrow} mb-3 text-center`}>Trust</p>
            <h2 className={`${sectionTitle} mb-10 text-center sm:mb-12 md:mb-14`}>{t.trust.header}</h2>
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-5 lg:gap-5">
            {[t.trust.card1, t.trust.card2, t.trust.card3, t.trust.card4, t.trust.card5].map((card, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group h-full rounded-2xl border border-border bg-white p-4 sm:p-5 md:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20"
                >
                  <div className="flex items-center gap-3.5 sm:flex-col sm:text-center">
                    <div className={`flex h-12 w-12 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-2xl sm:mx-auto sm:mb-2 shadow-sm ${
                      i % 2 === 0
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 text-primary ring-1 ring-primary/10'
                        : 'bg-gradient-to-br from-accent/10 to-accent/5 text-accent ring-1 ring-accent/10'
                    }`}>
                      {trustIcons[i]}
                    </div>
                    <p className="text-sm font-semibold leading-relaxed text-text sm:text-[13px] sm:leading-[1.6]">{card}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      <AchievementsBento
        eyebrow={t.achievements.eyebrow}
        tamilNameLine={t.achievements.tamilNameLine}
        header={t.achievements.header}
        icons={achievementIcons}
        cards={[
          { title: t.achievements.card1title, desc: t.achievements.card1desc },
          { title: t.achievements.card2title, desc: t.achievements.card2desc },
          { title: t.achievements.card3title, desc: t.achievements.card3desc },
          { title: t.achievements.card4title, desc: t.achievements.card4desc },
        ]}
      />

      <section className="border-b border-border bg-primary py-12 sm:py-16 md:py-20">
        <div className="layout-container">
          <FadeInSection>
            <div className="grid grid-cols-2 gap-7 sm:gap-10 md:grid-cols-4 md:gap-8">
              <AnimatedCounter end={25} suffix="+" label="Years of Service" />
              <AnimatedCounter end={5} label="States Served" />
              <AnimatedCounter end={1000} suffix="+" label="Public Events" />
              <AnimatedCounter end={2} suffix="M+" label="People Reached" />
            </div>
          </FadeInSection>
        </div>
      </section>

      <TimelineSection items={t.timeline.items} header={t.timeline.header} subtext={t.timeline.subtext} headerClassName={fontClass} />

      <SocialVideoShowcase
        eyebrow={t.mediaShowcase.eyebrow}
        header={t.mediaShowcase.header}
        subtext={t.mediaShowcase.subtext}
        viewOnX={t.mediaShowcase.viewOnX}
        embedHint={t.mediaShowcase.embedHint}
        items={t.mediaShowcase.items}
      />

      <CTAWithTextMarquee
        eyebrow={t.ctaBanner.eyebrow}
        headline={t.ctaBanner.header}
        subtext={t.ctaBanner.subtext}
        primaryLabel={t.ctaBanner.button}
        primaryHref="/pugaar-petti"
        secondaryLabel={t.ctaBanner.secondaryCta}
        secondaryHref="/#journey"
        marqueeItems={t.ctaBanner.marquee}
        marqueeSide="right"
        marqueeSpeed={22}
      />
    </>
  )
}
