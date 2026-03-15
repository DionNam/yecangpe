'use client'

import { Heart, User, Bell } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SeekerLikedJobs } from './seeker-liked-jobs'
import { SeekerProfileSection } from './seeker-profile-section'
import { JobAlertForm } from './job-alert-form'
import { JobAlertList } from './job-alert-list'
import type { Database } from '@repo/supabase/types'
import { useTranslation } from '@/lib/i18n'

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
  const { t } = useTranslation()
  // Calculate stats
  const likedJobsCount = likedJobs.length
  const activeAlertsCount = alerts.filter((a) => a.is_active).length

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">
            {t('seekerDashboard.title')}
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {t('seekerDashboard.myPage')}
          </h1>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">{t('seekerDashboard.likedJobs')}</p>
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
                <p className="text-sm font-medium text-slate-600">{t('seekerDashboard.activeAlerts')}</p>
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
            <TabsTrigger value="liked-jobs">{t('seekerDashboard.likedJobs')}</TabsTrigger>
            <TabsTrigger value="profile">{t('seekerDashboard.profile')}</TabsTrigger>
            <TabsTrigger value="alerts">{t('seekerDashboard.jobAlerts')}</TabsTrigger>
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

          <TabsContent value="alerts" className="mt-0 focus-visible:outline-none">
            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-lg font-semibold mb-4">{t('seekerDashboard.newAlertSetup')}</h3>
                <JobAlertForm />
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <h3 className="text-lg font-semibold mb-4">{t('seekerDashboard.myAlerts')} ({alerts.length})</h3>
                <JobAlertList alerts={alerts} />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
