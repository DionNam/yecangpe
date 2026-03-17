'use client'

import { Heart, User } from 'lucide-react'
import { useState } from 'react'
import { SeekerLikedJobs } from './seeker-liked-jobs'
import { SeekerProfileSection } from './seeker-profile-section'
import type { Database } from '@repo/supabase/types'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

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
  alerts: any[]
}

export function SeekerDashboard({ profile, likedJobs }: SeekerDashboardProps) {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'profile' | 'liked-jobs'>('profile')

  const likedJobsCount = likedJobs.length

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Mobile tab bar */}
          <div className="md:hidden flex overflow-x-auto gap-2 p-4 border-b bg-white">
            <button
              onClick={() => setActiveTab('profile')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === 'profile'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <User className="h-4 w-4" />
              {t('seekerDashboard.profile')}
            </button>
            <button
              onClick={() => setActiveTab('liked-jobs')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                activeTab === 'liked-jobs'
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <Heart className="h-4 w-4" />
              {t('seekerDashboard.likedJobs')}
              {likedJobsCount > 0 && (
                <span className="bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {likedJobsCount}
                </span>
              )}
            </button>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 bg-white border-r border-slate-200 min-h-screen pt-6">
            <div className="px-6 mb-8">
              <h1 className="text-2xl font-bold text-gray-900">{t('seekerDashboard.myPage')}</h1>
            </div>

            <nav className="space-y-1 px-3">
              <button
                onClick={() => setActiveTab('profile')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <User className="h-5 w-5" />
                {t('seekerDashboard.profile')}
              </button>

              <button
                onClick={() => setActiveTab('liked-jobs')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'liked-jobs'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <Heart className="h-5 w-5" />
                {t('seekerDashboard.likedJobs')}
                {likedJobsCount > 0 && (
                  <span className="ml-auto bg-slate-200 text-slate-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {likedJobsCount}
                  </span>
                )}
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <SeekerProfileSection profile={profile} />
              </div>
            )}

            {activeTab === 'liked-jobs' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <SeekerLikedJobs jobs={likedJobs} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
