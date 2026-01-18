import { redirect } from 'next/navigation'
import { createClient } from '@repo/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { JobPostForm } from '@/components/employer/job-post-form'

export default async function NewPostPage() {
  const supabase = await createClient()

  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check employer role
  const { data: employerProfile } = await (supabase as any)
    .from('employer_profiles')
    .select('company_name')
    .eq('user_id', user.id)
    .single()

  // If not employer, redirect to home
  if (!employerProfile) {
    redirect('/')
  }

  const companyName = (employerProfile as { company_name: string }).company_name

  return (
    <div className="container py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">구인글 작성</CardTitle>
          <CardDescription>
            새로운 구인 공고를 작성합니다. 작성된 공고는 관리자 승인 후 게시됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <JobPostForm defaultCompanyName={companyName} />
        </CardContent>
      </Card>
    </div>
  )
}
