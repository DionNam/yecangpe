'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { updateJobAlert, deleteJobAlert } from '@/app/actions/job-alerts'
import { COUNTRIES, JOB_TYPES } from '@repo/lib'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'

interface JobAlert {
  id: string
  keywords: string | null
  country: string | null
  job_type: string | null
  frequency: string
  is_active: boolean
  created_at: string
}

interface JobAlertListProps {
  alerts: JobAlert[]
}

export function JobAlertList({ alerts }: JobAlertListProps) {
  const [isPending, startTransition] = useTransition()
  const { t, language } = useTranslation()

  function handleToggle(alertId: string, currentState: boolean) {
    startTransition(async () => {
      const result = await updateJobAlert(alertId, { is_active: !currentState })
      if (result.error) {
        alert(`상태 변경 실패: ${result.error}`)
      }
    })
  }

  function handleDelete(alertId: string) {
    if (!window.confirm(t('jobAlertList.deleteConfirm'))) {
      return
    }

    startTransition(async () => {
      const result = await deleteJobAlert(alertId)
      if (result.error) {
        alert(`삭제 실패: ${result.error}`)
      }
    })
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-slate-600">
        {t('jobAlertList.noAlerts')}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        // Lookup display names
        const countryName = alert.country
          ? COUNTRIES.find((c) => c.code === alert.country)?.name || t('jobAlertForm.allCountries')
          : t('jobAlertForm.allCountries')
        const jobTypeEntry = alert.job_type
          ? JOB_TYPES.find((jt) => jt.code === alert.job_type)
          : null
        const jobTypeName = jobTypeEntry
          ? (language === 'en' ? jobTypeEntry.name : jobTypeEntry.nameKo)
          : t('jobAlertForm.allJobTypes')

        const frequencyText =
          alert.frequency === 'instant'
            ? t('jobAlertForm.instant')
            : alert.frequency === 'daily'
            ? t('jobAlertForm.daily')
            : t('jobAlertForm.weekly')

        return (
          <div
            key={alert.id}
            className="border rounded-lg p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-medium text-slate-900">
                  {alert.keywords || t('jobAlertList.noKeywords')}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="outline">{countryName}</Badge>
                  <Badge variant="outline">{jobTypeName}</Badge>
                  <Badge variant="secondary">{frequencyText}</Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">
                  {alert.is_active ? t('jobAlertList.active') : t('jobAlertList.inactive')}
                </span>
                <Switch
                  checked={alert.is_active}
                  onCheckedChange={() => handleToggle(alert.id, alert.is_active)}
                  disabled={isPending}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(alert.id)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
