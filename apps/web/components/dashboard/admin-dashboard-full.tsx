'use client'

import { useState } from 'react'
import {
  FileText,
  Clock,
  Users,
  Briefcase,
  Settings,
  Mail,
  Search,
  BarChart3,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { AdminPostsSection } from './admin/admin-posts-section'
import { AdminPendingSection } from './admin/admin-pending-section'
import { AdminSeekersSection } from './admin/admin-seekers-section'
import { AdminEmployersSection } from './admin/admin-employers-section'
import { AdminSettingsSection } from './admin/admin-settings-section'
import { AdminSubscribersSection } from './admin/admin-subscribers-section'
import { SeekerBrowseSection } from './seeker-browse-section'

import type { Database } from '@repo/supabase/types'

type JobPost = Database['public']['Tables']['job_posts']['Row']

interface Subscriber {
  id: string
  email: string
  name: string | null
  type: string
  is_active: boolean
  created_at: string
}

interface AdminDashboardFullProps {
  posts: JobPost[]
  pendingPosts: JobPost[]
  seekers: any[]
  employers: any[]
  subscribers: Subscriber[]
  metricsConfig: any
  siteConfig: any
  stats: {
    totalPosts: number
    pendingCount: number
    seekerCount: number
    employerCount: number
    subscriberCount: number
  }
}

type Tab = 'posts' | 'pending' | 'seekers' | 'employers' | 'settings' | 'subscribers' | 'talent'

const tabs: { id: Tab; label: string; icon: any; badge?: string }[] = [
  { id: 'posts', label: '전체 공고', icon: FileText },
  { id: 'pending', label: '승인 대기', icon: Clock },
  { id: 'seekers', label: '구직자', icon: Users },
  { id: 'employers', label: '고용주', icon: Briefcase },
  { id: 'subscribers', label: '뉴스레터', icon: Mail },
  { id: 'talent', label: '인재 탐색', icon: Search },
  { id: 'settings', label: '설정', icon: Settings },
]

export function AdminDashboardFull({
  posts,
  pendingPosts,
  seekers,
  employers,
  subscribers,
  metricsConfig,
  siteConfig,
  stats,
}: AdminDashboardFullProps) {
  const [activeTab, setActiveTab] = useState<Tab>('posts')

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row">
          {/* Mobile tab bar */}
          <div className="md:hidden flex overflow-x-auto gap-2 p-4 border-b bg-white">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
                {tab.id === 'pending' && stats.pendingCount > 0 && (
                  <Badge variant="destructive" className="text-xs px-1.5">
                    {stats.pendingCount}
                  </Badge>
                )}
              </button>
            ))}
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 bg-white border-r border-slate-200 min-h-screen pt-6 flex-shrink-0">
            <div className="px-6 mb-6">
              <h1 className="text-xl font-bold text-gray-900">관리자 패널</h1>
              <p className="text-sm text-slate-500 mt-1">Admin Dashboard</p>
            </div>

            {/* Stats */}
            <div className="px-4 mb-6 space-y-2">
              <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                <span className="text-slate-500">전체 공고</span>
                <span className="font-semibold text-slate-900">{stats.totalPosts}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                <span className="text-slate-500">승인 대기</span>
                <Badge variant="secondary" className="text-xs">{stats.pendingCount}</Badge>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                <span className="text-slate-500">구직자</span>
                <span className="font-semibold text-slate-900">{stats.seekerCount}</span>
              </div>
              <div className="flex items-center justify-between px-2 py-1.5 text-xs">
                <span className="text-slate-500">고용주</span>
                <span className="font-semibold text-slate-900">{stats.employerCount}</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 px-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === 'pending' && stats.pendingCount > 0 && (
                    <Badge variant="destructive" className="ml-auto text-xs px-1.5">
                      {stats.pendingCount}
                    </Badge>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0 p-4 md:p-6 lg:p-8 overflow-x-auto">
            {activeTab === 'posts' && (
              <AdminPostsSection posts={posts} />
            )}
            {activeTab === 'pending' && (
              <AdminPendingSection posts={pendingPosts} />
            )}
            {activeTab === 'seekers' && (
              <AdminSeekersSection seekers={seekers} />
            )}
            {activeTab === 'employers' && (
              <AdminEmployersSection employers={employers} />
            )}
            {activeTab === 'subscribers' && (
              <AdminSubscribersSection subscribers={subscribers} />
            )}
            {activeTab === 'talent' && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                <SeekerBrowseSection />
              </div>
            )}
            {activeTab === 'settings' && (
              <AdminSettingsSection
                metricsConfig={metricsConfig}
                siteConfig={siteConfig}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
