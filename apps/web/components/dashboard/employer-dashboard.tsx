'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, MousePointerClick, FileText, CheckCircle2 } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { JobPostTable } from './job-post-table'
import { CompanySettingsForm } from './company-settings-form'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']
type EmployerProfile = Database['public']['Tables']['employer_profiles']['Row']

interface EmployerDashboardProps {
  profile: EmployerProfile
  posts: JobPost[]
  likeCounts: Record<string, number>
}

export function EmployerDashboard({ profile, posts, likeCounts }: EmployerDashboardProps) {
  const router = useRouter()

  // Calculate stats
  const totalPosts = posts.length
  const now = new Date()
  const activePosts = posts.filter((post) => {
    if (!post.expires_at) return true
    return new Date(post.expires_at) > now
  }).length
  const totalViews = posts.reduce((sum, post) => sum + (post.view_count || 0), 0)
  const totalApplyClicks = posts.reduce((sum, post) => sum + (post.apply_click_count || 0), 0)

  const handlePostDeleted = () => {
    // Refresh the page to show updated data
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">
            고용주 대시보드
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {profile.company_name || '내 회사'}
          </h1>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">전체 공고</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalPosts}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">활성 공고</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{activePosts}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">총 조회수</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">총 지원클릭</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalApplyClicks.toLocaleString()}</p>
              </div>
              <MousePointerClick className="h-8 w-8 text-amber-500" />
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="posts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="posts">공고 관리</TabsTrigger>
            <TabsTrigger value="settings">계정 설정</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-6">
            {/* New Post Button */}
            <div className="flex justify-end">
              <Button asChild>
                <Link href="/dashboard/post-job">새 공고 작성</Link>
              </Button>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <JobPostTable posts={posts} likeCounts={likeCounts} onPostDeleted={handlePostDeleted} />
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">회사 정보</h2>
              <CompanySettingsForm profile={profile} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
