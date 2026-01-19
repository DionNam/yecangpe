import Link from 'next/link'
import { createClient } from '@repo/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock, Users, FileText, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'

export default async function DashboardHome() {
  const supabase = await createClient()

  // Get count of pending posts
  const { count: pendingCount } = await (supabase as any)
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'pending')

  // Get total published posts
  const { count: publishedCount } = await (supabase as any)
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('review_status', 'published')

  // Get total users count
  const { count: totalUsers } = await (supabase as any)
    .from('users')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground mt-2 text-lg">관리자 패널에 오신 것을 환영합니다</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Pending Posts - Highlighted */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">승인 대기 공고</CardTitle>
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-4xl font-bold tracking-tight">{pendingCount ?? 0}</div>
              {pendingCount && pendingCount > 0 ? (
                <Link
                  href="/posts/pending"
                  className="inline-flex items-center text-sm font-medium text-primary hover:underline"
                >
                  승인 대기 공고 보기 →
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  모든 공고 처리 완료
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Published Posts */}
        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">게시된 공고</CardTitle>
              <div className="p-2 rounded-lg bg-emerald-100">
                <FileText className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-4xl font-bold tracking-tight">{publishedCount ?? 0}</div>
              <p className="text-sm text-muted-foreground">활성 채용 공고</p>
            </div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">전체 사용자</CardTitle>
              <div className="p-2 rounded-lg bg-violet-100">
                <Users className="h-5 w-5 text-violet-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-4xl font-bold tracking-tight">{totalUsers ?? 0}</div>
              <p className="text-sm text-muted-foreground">등록된 회원</p>
            </div>
          </CardContent>
        </Card>

        {/* Platform Health - Placeholder */}
        <Card className="border border-border hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold text-muted-foreground">플랫폼 상태</CardTitle>
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xl font-bold">정상</span>
              </div>
              <p className="text-sm text-muted-foreground">모든 시스템 정상 작동</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              최근 활동
            </CardTitle>
            <CardDescription>플랫폼의 최근 활동 내역</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">승인 대기 공고: {pendingCount ?? 0}건</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground">게시된 공고: {publishedCount ?? 0}건</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-violet-500" />
                <span className="text-muted-foreground">전체 사용자: {totalUsers ?? 0}명</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              빠른 작업
            </CardTitle>
            <CardDescription>자주 사용하는 관리 작업</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link
                href="/posts/pending"
                className="block px-4 py-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
              >
                <span className="font-medium">공고 승인 관리</span>
              </Link>
              <Link
                href="/users"
                className="block px-4 py-3 rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <span className="font-medium">사용자 관리</span>
              </Link>
              <Link
                href="/settings"
                className="block px-4 py-3 rounded-lg bg-muted hover:bg-accent transition-colors"
              >
                <span className="font-medium">플랫폼 설정</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
