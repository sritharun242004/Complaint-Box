'use client'

import { useI18n } from '@/i18n/context'
import Link from 'next/link'
import BJPLotus from './BJPLotus'
import { motion } from 'framer-motion'

export default function Footer() {
  const { t } = useI18n()

  return (
    <footer className="bg-[#121212] text-white relative overflow-hidden">
      {/* Top saffron accent bar */}
      <div className="h-1.5 bg-gradient-to-r from-[#FF6B00] via-[#FF8533] to-[#FF6B00]" />

      {/* Soft grey wash across the full footer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/[0.03] to-transparent pointer-events-none"
      />

      {/* BJP Logo watermark from actual image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/BJP Logo.jpg"
        alt=""
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                   w-[560px] sm:w-[760px] md:w-[980px] max-w-none h-auto
                   opacity-[0.06] pointer-events-none select-none grayscale brightness-200 mix-blend-lighten"
        draggable={false}
      />

      <div className="max-w-container mx-auto px-4 md:px-6 py-10 md:py-16 relative z-10">
        {/* Animated BJP Lotus - center hero */}
        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: 'spring' as const, stiffness: 100 }}
        >
          <BJPLotus size={90} animate={true} />
        </motion.div>

        {/* Brand name */}
        <div className="text-center mb-10">
          <h3 className="font-extrabold text-2xl text-white mb-1">Dr. Tamilisai Soundararajan</h3>
          <p className="text-sm text-[#FF6B00] font-medium">{t.hero.eyebrow}</p>
          <p className="text-xs text-white/30 mt-1">Bharatiya Janata Party</p>
        </div>

        {/* Nav links */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm mb-10">
          <a href="/#about" className="text-white/50 hover:text-[#FF6B00] transition-colors">{t.nav.about}</a>
          <span className="text-white/10">|</span>
          <a href="/#journey" className="text-white/50 hover:text-[#FF6B00] transition-colors">{t.nav.journey}</a>
          <span className="text-white/10">|</span>
          <a href="/#vision" className="text-white/50 hover:text-[#FF6B00] transition-colors">{t.nav.vision}</a>
          <span className="text-white/10">|</span>
          <Link href="/pugaar-petti" className="text-white/50 hover:text-[#FF6B00] transition-colors">{t.nav.pugaarPetti}</Link>
        </div>

        {/* Social Icons */}
        <div className="flex items-center justify-center gap-3 mb-12">
          {[
            { href: 'https://twitter.com/DrTamilisaiGuv', label: 'X', icon: <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /> },
            { href: 'https://instagram.com/drtamilisai', label: 'Instagram', icon: <><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></> },
            { href: 'https://facebook.com/DrTamilisai', label: 'Facebook', icon: <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /> },
          ].map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-[#FF6B00]/20 border border-white/[0.05] hover:border-[#FF6B00]/30 flex items-center justify-center transition-all hover:scale-110 group"
              aria-label={s.label}
            >
              <svg className="w-4 h-4 text-white/50 group-hover:text-[#FF6B00] transition-colors" fill="currentColor" viewBox="0 0 24 24">{s.icon}</svg>
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">&copy; {t.footer.copy}</p>
          <div className="flex items-center gap-2">
            <BJPLotus size={18} animate={false} />
            <span className="text-xs text-white/20">Bharatiya Janata Party</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
