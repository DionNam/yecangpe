import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { SeekerBrowseSection } from '@/components/dashboard/seeker-browse-section'
import Link from 'next/link'

export const metadata = {
  title: '인재 탐색 | HangulJobs',
  description: '한국어 가능한 외국인 구직자 프로필을 탐색하세요.',
}

export default async function TalentPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if employer or admin
  const { data: userRecord } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  const role = userRecord?.role

  if (role !== 'employer' && role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            대시보드로 돌아가기
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            인재 탐색
          </h1>
          <p className="text-slate-600 mt-2">
            프로필을 공개한 한국어 가능 구직자를 찾아보세요
          </p>
        </div>

        {/* Seeker Browse */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <SeekerBrowseSection />
        </div>
      </div>
    </div>
  )
}
