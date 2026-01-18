import { createClient } from '@repo/supabase/server'
import { SeekerDetailCard } from '@/components/users/seeker-detail-card'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

interface SeekerDetailPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SeekerDetailPage({ params }: SeekerDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch seeker with profile
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
        occupation,
        referral_source
      )
    `)
    .eq('id', id)
    .eq('role', 'seeker')

  if (!seekers || seekers.length === 0) {
    notFound()
  }

  const seeker = seekers[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link href="/users/seekers">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">구직자 상세</h1>
          <p className="text-muted-foreground">구직자 정보를 확인하고 관리합니다.</p>
        </div>
      </div>

      <SeekerDetailCard seeker={seeker} />
    </div>
  )
}
