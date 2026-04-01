'use client'

import Link from 'next/link'
import { useI18n } from '@/i18n/context'
import { motion } from 'framer-motion'
import FadeInSection, { StaggerContainer, StaggerItem } from '@/components/FadeInSection'
import ComplaintForm from '@/components/ComplaintForm'
import ComplaintFeed from '@/components/ComplaintFeed'

const stepIcons = [
  <svg key="s1" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>,
  <svg key="s2" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>,
  <svg key="s3" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" /></svg>,
  <svg key="s4" className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>,
]

const visionIcons = [
  <svg key="v1" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>,
  <svg key="v2" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>,
  <svg key="v3" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  <svg key="v4" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  <svg key="v5" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>,
]

export default function PugaarPettiPage() {
  const { t } = useI18n()
  const steps = [t.pugaarPetti.step1, t.pugaarPetti.step2, t.pugaarPetti.step3, t.pugaarPetti.step4]
  const visions = [t.pugaarPetti.vision1, t.pugaarPetti.vision2, t.pugaarPetti.vision3, t.pugaarPetti.vision4, t.pugaarPetti.vision5]

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="py-14 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-primary/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[150px] h-[150px] md:w-[300px] md:h-[300px] bg-primary/[0.02] rounded-full blur-3xl" />

        <div className="max-w-container mx-auto px-4 md:px-6 text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold text-text mb-3"
          >
            {t.pugaarPetti.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg sm:text-xl md:text-3xl text-primary/60 mb-3 font-tamil font-semibold"
          >
            {t.pugaarPetti.heroTamil}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-lg lg:text-xl text-muted mb-7 md:mb-10 max-w-xl mx-auto"
          >
            {t.pugaarPetti.heroSubtext}
          </motion.p>
          <motion.a
            href="#submit"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[#FF8533] text-white font-bold px-6 py-3 md:px-8 md:py-4 rounded-full hover:shadow-xl hover:shadow-primary/25 hover:scale-[1.02] transition-all"
          >
            {t.pugaarPetti.heroButton}
            <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
            </svg>
          </motion.a>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-12 md:py-24 bg-surface">
        <div className="max-w-container mx-auto px-4 md:px-6">
          <FadeInSection>
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-text text-center mb-4">
              {t.pugaarPetti.howItWorks}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-[#FF8533] rounded-full mx-auto mb-8 md:mb-14" />
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {steps.map((step, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="text-center bg-white rounded-2xl p-6 shadow-sm border border-border/50 hover:shadow-md transition-all"
                >
                  {/* Step connector line */}
                  <div className="relative mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-[#FF8533] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/20">
                      <span className="text-white font-bold text-lg">{i + 1}</span>
                    </div>
                  </div>
                  <div className="flex justify-center mb-3 text-primary">{stepIcons[i]}</div>
                  <p className="text-sm font-semibold text-text">{step}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============ SUBMIT FORM ============ */}
      <section id="submit" className="py-12 md:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-6">
          <FadeInSection>
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-text text-center mb-4">
              {t.pugaarPetti.formTitle}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-[#FF8533] rounded-full mx-auto mb-8 md:mb-12" />
          </FadeInSection>
          <ComplaintForm />
        </div>
      </section>

      {/* ============ LIVE FEED ============ */}
      <section id="feed" className="bg-surface">
        <div className="max-w-container mx-auto px-6 pt-20 pb-4">
          <FadeInSection>
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-text text-center mb-4">
              {t.pugaarPetti.feedTitle}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-[#FF8533] rounded-full mx-auto" />
          </FadeInSection>
        </div>
        <ComplaintFeed />
      </section>

      {/* ============ VISION ============ */}
      <section className="py-12 md:py-24 bg-white">
        <div className="max-w-container mx-auto px-4 md:px-6">
          <FadeInSection>
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-text text-center mb-4">
              {t.pugaarPetti.vision}
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-primary to-[#FF8533] rounded-full mx-auto mb-14" />
          </FadeInSection>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {visions.map((v, i) => (
              <StaggerItem key={i}>
                <motion.div
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-4 bg-surface rounded-2xl p-5 hover:shadow-md hover:bg-white border border-transparent hover:border-border/50 transition-all"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0 text-primary">
                    {visionIcons[i]}
                  </div>
                  <p className="text-sm font-semibold text-text">{v}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ============ TRUST STATEMENT ============ */}
      <FadeInSection>
        <section className="py-12 md:py-24 bg-surface">
          <div className="max-w-2xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-extrabold text-text mb-6 md:mb-10">
              {t.pugaarPetti.trustHeader}
            </h2>
            <div className="space-y-3 md:space-y-4">
              {[t.pugaarPetti.trustLine1, t.pugaarPetti.trustLine2, t.pugaarPetti.trustLine3].map((line, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="text-base md:text-xl text-muted leading-relaxed"
                >
                  {line}
                </motion.p>
              ))}
            </div>
          </div>
        </section>
      </FadeInSection>

      {/* ============ FINAL CTA ============ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-[#FF7A1A] to-[#FF8533]" />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }} />

        <FadeInSection>
          <div className="max-w-container mx-auto px-6 text-center relative z-10">
            <h2 className="text-2xl sm:text-3xl md:text-[44px] font-extrabold text-white mb-6 md:mb-10 leading-tight">
              {t.pugaarPetti.finalCtaHeader}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#submit"
                className="group inline-flex items-center justify-center gap-2 bg-white text-primary font-bold px-8 py-4 rounded-full hover:bg-white/90 hover:scale-[1.02] hover:shadow-2xl transition-all"
              >
                {t.pugaarPetti.finalCtaButton1}
                <svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
                </svg>
              </a>
              <a
                href="#feed"
                className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 hover:border-white/60 transition-all"
              >
                {t.pugaarPetti.finalCtaButton2}
              </a>
            </div>
          </div>
        </FadeInSection>
      </section>

      {/* Mobile FAB */}
      <motion.a
        href="#submit"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
        className="fixed bottom-6 right-6 md:hidden w-14 h-14 bg-gradient-to-br from-primary to-[#FF8533] text-white rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center hover:scale-105 transition-transform z-50"
        aria-label="Submit Complaint"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </motion.a>
    </>
  )
}
