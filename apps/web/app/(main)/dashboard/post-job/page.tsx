import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JobPostForm } from '@/components/employer/job-post-form'
import type { Database } from '@repo/supabase/types'

type EmployerProfile = Database['public']['Tables']['employer_profiles']['Row']

export const metadata = {
  title: '새 공고 작성',
}

export default async function PostJobPage() {
  const supabase = await createClient()

  // Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check for employer profile
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!employerProfile) {
    redirect('/onboarding')
  }

  // TypeScript assertion: employerProfile is guaranteed to exist after the check above
  const profile = employerProfile as EmployerProfile
  const defaultCompanyName = profile.company_name || ''

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-slate-600 font-medium text-xs tracking-widest uppercase mb-2">
            새 공고 작성
          </p>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            구인 공고 등록
          </h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>공고 정보</CardTitle>
            <CardDescription>
              구인 공고에 필요한 정보를 입력해주세요. 관리자 승인 후 공개됩니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <JobPostForm defaultCompanyName={defaultCompanyName} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
