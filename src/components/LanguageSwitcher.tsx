'use client'

import { useI18n } from '@/i18n/context'
import { useState, useRef, useEffect } from 'react'

const languages = [
  { code: 'en' as const, name: 'EN', full: 'English' },
  { code: 'ta' as const, name: 'த', full: 'தமிழ்' },
  { code: 'hi' as const, name: 'हि', full: 'हिन्दी' },
]

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const current = languages.find(l => l.code === lang)!

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-sm font-medium hover:bg-surface transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z" />
        </svg>
        {current.name}
        <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-border py-1 min-w-[140px] z-50">
          {languages.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code); setOpen(false) }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-surface transition-colors flex items-center gap-2 ${
                lang === l.code ? 'text-primary font-semibold' : 'text-text'
              }`}
            >
              <span className="w-6 text-center font-medium">{l.name}</span>
              <span>{l.full}</span>
              {lang === l.code && (
                <svg className="w-4 h-4 ml-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
