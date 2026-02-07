'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { updateJobAlert, deleteJobAlert } from '@/app/actions/job-alerts'
import { COUNTRIES, JOB_TYPES } from '@repo/lib'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

  function handleToggle(alertId: string, currentState: boolean) {
    startTransition(async () => {
      const result = await updateJobAlert(alertId, { is_active: !currentState })
      if (result.error) {
        alert(`상태 변경 실패: ${result.error}`)
      }
    })
  }

  function handleDelete(alertId: string) {
    if (!window.confirm('이 알림을 삭제하시겠습니까?')) {
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
        설정된 잡 알림이 없습니다
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.map((alert) => {
        // Lookup display names
        const countryName = alert.country
          ? COUNTRIES.find((c) => c.code === alert.country)?.name || '모든 국가'
          : '모든 국가'
        const jobTypeName = alert.job_type
          ? JOB_TYPES.find((t) => t.code === alert.job_type)?.nameKo || '모든 고용형태'
          : '모든 고용형태'

        const frequencyText =
          alert.frequency === 'instant'
            ? '즉시'
            : alert.frequency === 'daily'
            ? '매일'
            : '주간'

        return (
          <div
            key={alert.id}
            className="border rounded-lg p-4 flex items-start justify-between gap-4"
          >
            <div className="flex-1 space-y-2">
              <div>
                <p className="font-medium text-slate-900">
                  {alert.keywords || '키워드 없음'}
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
                  {alert.is_active ? '활성' : '비활성'}
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
