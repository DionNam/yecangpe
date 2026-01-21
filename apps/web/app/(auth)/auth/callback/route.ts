import { createClient } from '@repo/supabase/server'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import type { Database } from '@repo/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    // Exchange code for session (PKCE flow)
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user has completed profile
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profile } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single<{ role: UserRole | null }>()

        // Redirect to onboarding if no role set
        if (!profile || !profile.role) {
          return NextResponse.redirect(new URL('/onboarding', request.url))
        }

        // Redirect admin users to admin dashboard
        if (profile.role === 'admin') {
          const adminUrl = process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'
          return NextResponse.redirect(new URL('/', adminUrl))
        }
      }

      // Success - redirect to home
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Error - redirect to login with error message
  return NextResponse.redirect(new URL('/login?error=auth', request.url))
}
