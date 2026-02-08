'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { translations, type Language } from './translations'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => any
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'hanguljobs-lang'

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ko')

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ko') {
      setLanguageState(stored)
    }
  }, [])

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }, [])

  const t = useCallback(
    (key: string): any => {
      const value = getNestedValue(translations[language] as unknown as Record<string, any>, key)
      if (value === undefined) {
        // Fallback to ko
        return getNestedValue(translations.ko as unknown as Record<string, any>, key) ?? key
      }
      return value
    },
    [language],
  )

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useTranslation must be used within a LanguageProvider')
  }
  return ctx
}
