import { createClient } from '@repo/supabase/server'
import { EmployerDetailCard } from '@/components/users/employer-detail-card'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface EmployerDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EmployerDetailPage({ params }: EmployerDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch employer with profile
  const { data: employers } = await (supabase as any)
    .from('users')
    .select(`
      id,
      email,
      is_active,
      created_at,
      employer_profiles (
        company_name,
        referral_source
      )
    `)
    .eq('id', id)
    .eq('role', 'employer')

  if (!employers || employers.length === 0) {
    notFound()
  }

  const employer = employers[0]

  // Fetch employer's job posts
  const { data: posts } = await (supabase as any)
    .from('job_posts')
    .select('id, title, review_status, created_at')
    .eq('author_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/users/employers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">구인자 상세</h1>
          <p className="text-muted-foreground">구인자 정보를 확인하고 관리합니다.</p>
        </div>
      </div>

      <EmployerDetailCard employer={employer} posts={posts || []} />
    </div>
  )
}
