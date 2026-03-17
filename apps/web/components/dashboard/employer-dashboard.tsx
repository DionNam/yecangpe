'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, MousePointerClick, FileText, CheckCircle2, Settings, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { JobPostTable } from './job-post-table'
import { CompanySettingsForm } from './company-settings-form'
import type { Database } from '@repo/supabase/types'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { useState } from 'react'

type JobPost = Database['public']['Tables']['job_posts']['Row']
type EmployerProfile = Database['public']['Tables']['employer_profiles']['Row']

interface EmployerDashboardProps {
  profile: EmployerProfile
  posts: JobPost[]
  likeCounts: Record<string, number>
}

export function EmployerDashboard({ profile, posts, likeCounts }: EmployerDashboardProps) {
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<'posts' | 'settings'>('posts')

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
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-slate-200 min-h-screen pt-6">
            <div className="px-6 mb-2">
              <p className="text-slate-500 text-xs tracking-widest uppercase mb-1">
                {t('employerDashboardPage.title')}
              </p>
              <h1 className="text-xl font-bold text-gray-900 truncate">
                {profile.company_name || t('employerDashboardPage.myCompany')}
              </h1>
            </div>

            <nav className="space-y-1 px-3">
              <button
                onClick={() => setActiveTab('posts')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'posts'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <ClipboardList className="h-5 w-5" />
                {t('employerDashboardPage.postManagement')}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  activeTab === 'settings'
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <Settings className="h-5 w-5" />
                {t('employerDashboardPage.accountSettings')}
              </button>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-6 lg:p-8">
            {activeTab === 'posts' && (
              <>
                {/* Stats Summary */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{t('employerDashboardPage.totalPosts')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalPosts}</p>
                      </div>
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{t('employerDashboardPage.activePosts')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{activePosts}</p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{t('employerDashboardPage.totalViews')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalViews.toLocaleString()}</p>
                      </div>
                      <Eye className="h-8 w-8 text-purple-500" />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-600">{t('employerDashboardPage.totalApplyClicks')}</p>
                        <p className="text-2xl font-bold text-slate-900 mt-1">{totalApplyClicks.toLocaleString()}</p>
                      </div>
                      <MousePointerClick className="h-8 w-8 text-amber-500" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mb-6">
                  <Button asChild>
                    <Link href="/dashboard/post-job">{t('employerDashboardPage.newPost')}</Link>
                  </Button>
                </div>
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                  <JobPostTable posts={posts} likeCounts={likeCounts} onPostDeleted={handlePostDeleted} />
                </div>
              </>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <h2 className="text-xl font-semibold mb-6">{t('employerDashboardPage.companyInfo')}</h2>
                <CompanySettingsForm profile={profile} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
