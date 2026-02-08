'use client'

import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@supabase/supabase-js'
import { useTranslation } from '@/lib/i18n'

interface UserMenuProps {
  user: User
  role: 'seeker' | 'employer' | 'admin' | null
}

export function UserMenu({ user, role }: UserMenuProps) {
  const initials = user.email?.charAt(0).toUpperCase() || 'U'
  const { t } = useTranslation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{t('userMenu.myAccount')}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {role === 'employer' && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard">{t('userMenu.employerDashboard')}</Link>
          </DropdownMenuItem>
        )}

        {role === 'seeker' && (
          <DropdownMenuItem asChild>
            <Link href="/dashboard">{t('userMenu.myPage')}</Link>
          </DropdownMenuItem>
        )}

        {role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin">{t('userMenu.adminDashboard')}</Link>
          </DropdownMenuItem>
        )}

        {(role === 'employer' || role === 'seeker' || role === 'admin') && <DropdownMenuSeparator />}

        <DropdownMenuItem asChild>
          <form action="/auth/signout" method="POST" className="w-full">
            <button type="submit" className="w-full text-left text-destructive">
              {t('userMenu.logout')}
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
