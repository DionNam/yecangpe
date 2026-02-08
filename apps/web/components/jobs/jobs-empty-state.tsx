'use client'

import { useTranslation } from '@/lib/i18n'

export function JobsEmptyState() {
  const { t } = useTranslation()

  return (
    <div className="text-center py-32">
      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-2xl">🔍</span>
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{t('jobsPage.emptyTitle')}</h3>
      <p className="text-slate-500">
        {t('jobsPage.emptyMessage')}
      </p>
    </div>
  )
}
