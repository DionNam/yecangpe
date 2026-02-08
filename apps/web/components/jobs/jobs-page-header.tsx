'use client'

import { useTranslation } from '@/lib/i18n'

export function JobsPageHeader() {
  const { t } = useTranslation()

  return (
    <div className="text-center mb-16 space-y-4">
      <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-3">{t('jobsPage.eyebrow')}</p>
      <div className="inline-block relative">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 relative z-10">
          {t('jobsPage.title')}
        </h1>
        <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/10 -rotate-1 -z-10 rounded-full"></div>
      </div>
      <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-6">
        {t('jobsPage.subtitle')}
      </p>
    </div>
  )
}
