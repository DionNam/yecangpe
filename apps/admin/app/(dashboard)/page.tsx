import Link from 'next/link'
import { createClient } from '@repo/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock } from 'lucide-react'

export default async function DashboardHome() {
  const supabase = await createClient()

  // Get count of pending posts
  const { count: pendingCount } = await (supabase as any)
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'pending')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-gray-600 mt-1">관리자 패널에 오신 것을 환영합니다</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">승인 대기 공고</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
            <CardDescription>심사가 필요한 공고</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">{pendingCount ?? 0}</div>
              {pendingCount && pendingCount > 0 ? (
                <Link
                  href="/posts/pending"
                  className="text-sm text-blue-600 hover:underline"
                >
                  승인 대기 공고 보기 →
                </Link>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
