'use client'

import { useTranslation } from '@/lib/i18n'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-8">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-muted-foreground mb-6">{t('notFound.title')}</p>
      <a
        href="/"
        className="text-primary hover:underline"
      >
        {t('notFound.backToHome')}
      </a>
    </div>
  )
}
