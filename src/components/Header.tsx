'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useI18n } from '@/i18n/context'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'
import BJPLotus from './BJPLotus'

export default function Header() {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-border/50'
          : 'bg-white border-b border-border'
      }`}
    >
      <div className="max-w-container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2">
          <BJPLotus size={32} animate={false} />
          <span className="text-lg font-bold text-text tracking-tight">
            Dr. Tamilisai
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            { href: '/#about', label: t.nav.about },
            { href: '/#journey', label: t.nav.journey },
            { href: '/#vision', label: t.nav.vision },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="relative px-4 py-2 text-sm font-medium text-muted hover:text-text transition-colors rounded-lg hover:bg-surface"
            >
              {item.label}
            </a>
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          <LanguageSwitcher />
          <Link
            href="/pugaar-petti"
            className="ml-2 bg-gradient-to-r from-primary to-[#FF8533] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] transition-all"
          >
            {t.nav.pugaarPetti}
          </Link>
        </nav>

        {/* Mobile */}
        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl hover:bg-surface transition-colors"
            aria-label="Menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-text block origin-center"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-0.5 bg-text block"
                transition={{ duration: 0.1 }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-text block origin-center"
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden overflow-hidden bg-white border-t border-border"
          >
            <nav className="flex flex-col p-4 sm:p-6 gap-1">
              {[
                { href: '/#about', label: t.nav.about },
                { href: '/#journey', label: t.nav.journey },
                { href: '/#vision', label: t.nav.vision },
              ].map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="text-base font-medium text-text py-3 px-4 rounded-xl hover:bg-surface transition-colors"
                >
                  {item.label}
                </motion.a>
              ))}
              <Link
                href="/pugaar-petti"
                onClick={() => setMenuOpen(false)}
                className="bg-gradient-to-r from-primary to-[#FF8533] text-white text-center font-bold px-5 py-3.5 rounded-full mt-3"
              >
                {t.nav.pugaarPetti}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
