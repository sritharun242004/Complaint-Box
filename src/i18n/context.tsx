'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import en from './en.json'
import ta from './ta.json'
import hi from './hi.json'

type Lang = 'en' | 'ta' | 'hi'

const translations = { en, ta, hi } as const

type Translations = typeof en

interface I18nContextType {
  t: Translations
  lang: Lang
  setLang: (lang: Lang) => void
  langName: string
}

const I18nContext = createContext<I18nContextType>({
  t: en,
  lang: 'en',
  setLang: () => {},
  langName: 'English',
})

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang | null
    if (saved && translations[saved]) {
      setLangState(saved)
    }
  }, [])

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    localStorage.setItem('lang', newLang)
  }, [])

  const t = translations[lang]

  return (
    <I18nContext.Provider value={{ t, lang, setLang, langName: t.langName }}>
      <div className={lang === 'ta' ? 'font-tamil' : lang === 'hi' ? 'font-hindi' : ''}>
        {children}
      </div>
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
