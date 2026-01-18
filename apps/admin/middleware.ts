import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@repo/supabase/middleware'
import type { Database } from '@repo/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

const publicRoutes = ['/login']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Allow public routes
  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return supabaseResponse
  }

  // Redirect unauthenticated users to web app login
  if (!user) {
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'
    return NextResponse.redirect(new URL('/login', webUrl))
  }

  // Verify admin role
  const { data: profile } = await (supabase as any)
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    // Not admin - redirect to web app home
    const webUrl = process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'
    return NextResponse.redirect(new URL('/', webUrl))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
