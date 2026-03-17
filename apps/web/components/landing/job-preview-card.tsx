'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from '@/lib/i18n'

interface JobPreview {
  id: string
  title: string
  company_name: string
  target_nationality: string
  hiring_status: 'hiring' | 'closed'
  published_at: string | null
}

interface JobPreviewCardProps {
  job: JobPreview
}

export function JobPreviewCard({ job }: JobPreviewCardProps) {
  const { t } = useTranslation()
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  return (
    <Link href="/jobs" className="block">
      <Card className="hover:shadow-lg transition-shadow h-full">
        <CardHeader>
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant={job.hiring_status === 'hiring' ? 'default' : 'secondary'}>
              {job.hiring_status === 'hiring' ? t('jobPostForm.hiring') : t('jobPostForm.closed')}
            </Badge>
            <Badge variant="outline">
              {job.target_nationality}
            </Badge>
          </div>
          <h3 className="font-semibold text-lg line-clamp-2">{job.title}</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>{job.company_name}</p>
            <p className="text-xs">{formatDate(job.published_at)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
