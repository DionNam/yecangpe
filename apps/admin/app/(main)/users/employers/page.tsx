import { createClient } from '@repo/supabase/server'
import { EmployersTable } from '@/components/users/employers-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function EmployersPage() {
  const supabase = await createClient()

  // Join users with employer_profiles
  const { data: employers } = await (supabase as any)
    .from('users')
    .select(`
      id,
      email,
      is_active,
      created_at,
      employer_profiles (
        company_name
      )
    `)
    .eq('role', 'employer')
    .order('created_at', { ascending: false })

  // Fetch post counts for each employer
  const employersWithCounts = await Promise.all(
    ((employers || []) as any[]).map(async (employer: any) => {
      const { count } = await (supabase as any)
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .eq('author_id', employer.id)

      return {
        ...employer,
        post_count: count || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">구인자 목록</h1>
          <p className="text-muted-foreground">
            등록된 구인자 계정을 조회하고 관리합니다.
          </p>
        </div>
      </div>

      <EmployersTable employers={employersWithCounts} />
    </div>
  )
}
