import { createClient } from '@repo/supabase/server'
import { SeekersTable } from '@/components/users/seekers-table'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default async function SeekersPage() {
  const supabase = await createClient()

  // Join users with seeker_profiles to avoid N+1 queries
  const { data: seekers } = await (supabase as any)
    .from('users')
    .select(`
      id,
      email,
      is_active,
      created_at,
      seeker_profiles (
        nationality,
        topik_level,
        occupation
      )
    `)
    .eq('role', 'seeker')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">구직자 목록</h1>
          <p className="text-muted-foreground">
            등록된 구직자 계정을 조회하고 관리합니다.
          </p>
        </div>
      </div>

      <SeekersTable seekers={seekers || []} />
    </div>
  )
}
