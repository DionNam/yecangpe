'use client'

import { Heart, User, Bell } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SeekerLikedJobs } from './seeker-liked-jobs'
import { SeekerProfileSection } from './seeker-profile-section'
import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']
type SeekerProfile = Database['public']['Tables']['seeker_profiles']['Row']

interface LikedJob {
  id: string
  created_at: string
  post: JobPost | null
}

interface SeekerDashboardProps {
  profile: SeekerProfile
  likedJobs: LikedJob[]
  alerts: any[] // job_alerts table will be added in Plan 17-05
}

export function SeekerDashboard({ profile, likedJobs, alerts }: SeekerDashboardProps) {
  // Calculate stats
  const likedJobsCount = likedJobs.length
  const activeAlertsCount = alerts.filter((a) => a.is_active).length

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">
            구직자 대시보드
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            마이페이지
          </h1>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">관심 공고</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {likedJobsCount}
                </p>
              </div>
              <Heart className="h-8 w-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">활성 알림</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {activeAlertsCount}
                </p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <Tabs defaultValue="liked-jobs" className="space-y-6">
          <TabsList>
            <TabsTrigger value="liked-jobs">관심 공고</TabsTrigger>
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="alerts">잡 알림</TabsTrigger>
          </TabsList>

          <TabsContent value="liked-jobs">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <SeekerLikedJobs jobs={likedJobs} />
            </div>
          </TabsContent>

          <TabsContent value="profile">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <SeekerProfileSection profile={profile} />
            </div>
          </TabsContent>

          <TabsContent value="alerts">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
              <p className="text-center py-12 text-slate-600">
                잡 알림 기능 준비 중
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
