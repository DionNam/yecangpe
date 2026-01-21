import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserMenu } from './user-menu'
import { User } from '@supabase/supabase-js'

interface MainNavProps {
  user: User | null
}

export function MainNav({ user }: MainNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex flex-1 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="font-bold text-lg">PotenHire</span>
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
              <UserMenu user={user} />
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
