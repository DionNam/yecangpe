import Link from 'next/link'
import { createClient } from '@repo/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Briefcase } from 'lucide-react'

export default async function UsersPage() {
  const supabase = await createClient()

  // Count seekers
  const { count: seekerCount } = await (supabase as any)
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'seeker')

  // Count employers
  const { count: employerCount } = await (supabase as any)
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('role', 'employer')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">사용자 관리</h1>
        <p className="text-muted-foreground">
          구직자와 구인자 계정을 조회하고 관리합니다.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              구직자
            </CardTitle>
            <CardDescription>
              등록된 구직자 목록을 확인하고 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">{seekerCount || 0}명</div>
              <Button asChild className="w-full">
                <Link href="/users/seekers">구직자 목록 보기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              구인자
            </CardTitle>
            <CardDescription>
              등록된 구인자 목록을 확인하고 관리합니다.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-3xl font-bold">{employerCount || 0}명</div>
              <Button asChild className="w-full">
                <Link href="/users/employers">구인자 목록 보기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
