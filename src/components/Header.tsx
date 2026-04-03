'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { useI18n } from '@/i18n/context'
import { motion, AnimatePresence } from 'framer-motion'
import LanguageSwitcher from './LanguageSwitcher'

export default function Header() {
  const { t } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastScroll = useRef(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        raf = 0
        const y = window.scrollY
        setHidden(y > 80 && y > lastScroll.current)
        setScrolled(y > 10)
        lastScroll.current = y
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <motion.header
      animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      className={`sticky top-0 z-40 bg-white transition-colors duration-200 ${
        scrolled ? 'border-b border-border' : 'border-b border-transparent'
      }`}
    >
      <div className="layout-container flex min-h-[52px] items-center justify-between gap-4 sm:min-h-[56px] md:h-16 md:gap-6">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0 touch-manipulation py-2 -my-2">
          <img
            src="/BJP Logo.png"
            alt="BJP"
            className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 object-contain"
          />
          <div className="flex flex-col min-w-0 text-left">
            <span className="font-heading max-w-[11rem] text-left text-xs uppercase leading-tight tracking-tight text-text break-words sm:max-w-[16rem] sm:text-sm md:max-w-none md:text-base">
              {t.footer.titleLine}
            </span>
            <span className="text-[10px] text-primary font-medium uppercase tracking-wider leading-tight">
              Mylapore
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {[
            { href: '/#about', label: t.nav.about },
            { href: '/#journey', label: t.nav.journey },
            { href: '/#vision', label: t.nav.vision },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-light hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
          <LanguageSwitcher />
          <Link href="/pugaar-petti" className="btn-primary text-sm px-5 py-2">
            {t.nav.pugaarPetti}
          </Link>
        </nav>

        <div className="flex md:hidden items-center gap-2">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-md border border-border text-text touch-manipulation active:bg-primary-light/50"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            <div className="w-5 h-3.5 flex flex-col justify-between">
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-text block origin-center"
                transition={{ duration: 0.2 }}
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-5 h-0.5 bg-text block"
                transition={{ duration: 0.1 }}
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-5 h-0.5 bg-text block origin-center"
                transition={{ duration: 0.2 }}
              />
            </div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-border bg-white"
          >
            <nav className="flex flex-col p-3 gap-0.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
              {[
                { href: '/#about', label: t.nav.about },
                { href: '/#journey', label: t.nav.journey },
                { href: '/#vision', label: t.nav.vision },
              ].map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="min-h-[48px] flex items-center text-base font-medium text-text px-3 rounded-md active:bg-primary-light"
                >
                  {item.label}
                </a>
              ))}
              <Link
                href="/pugaar-petti"
                onClick={() => setMenuOpen(false)}
                className="btn-primary w-full justify-center mt-2"
              >
                {t.nav.pugaarPetti}
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
