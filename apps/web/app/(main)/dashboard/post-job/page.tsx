import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { JobPostForm } from '@/components/employer/job-post-form'
import type { Database } from '@repo/supabase/types'

type EmployerProfile = Database['public']['Tables']['employer_profiles']['Row']

export const metadata = {
  title: '새 공고 작성',
}

export default async function PostJobPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!employerProfile) {
    redirect('/onboarding')
  }

  const profile = employerProfile as EmployerProfile
  const defaultCompanyName = profile.company_name || ''

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-3xl mx-auto px-6 lg:px-8">
        <JobPostForm defaultCompanyName={defaultCompanyName} />
      </div>
    </div>
  )
}
