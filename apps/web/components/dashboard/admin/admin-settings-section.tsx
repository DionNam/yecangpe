'use client'

import { MetricsForm } from './metrics-form'
import { SiteConfigForm } from './site-config-form'

interface AdminSettingsSectionProps {
  metricsConfig: any
  siteConfig: any
}

export function AdminSettingsSection({ metricsConfig, siteConfig }: AdminSettingsSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">설정</h2>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4">회원 수 설정</h3>
          <SiteConfigForm memberCountOffset={siteConfig?.value || '0'} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <h3 className="text-lg font-semibold mb-4">지표 설정</h3>
          <MetricsForm defaultValues={metricsConfig} />
        </div>
      </div>
    </div>
  )
}
