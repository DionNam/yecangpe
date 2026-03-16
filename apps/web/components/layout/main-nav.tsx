import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserMenu } from './user-menu'
import { createClient } from '@repo/supabase/server'
import { User } from '@supabase/supabase-js'

interface MainNavProps {
  user: User | null
}

export async function MainNav({ user }: MainNavProps) {
  let userRole: 'seeker' | 'employer' | 'admin' | null = null

  if (user) {
    const supabase = await createClient()
    const { data: userData } = await (supabase as any)
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    userRole = userData?.role || null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg">HangulJobs</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              채용 공고
            </Link>
            {user ? (
              <UserMenu user={user} role={userRole} />
            ) : (
              <Button asChild size="sm" variant="ghost">
                <Link href="/login">로그인</Link>
              </Button>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
