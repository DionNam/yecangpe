import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@repo/supabase/middleware'
import type { Database } from '@repo/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

// Define route arrays for access control
const publicRoutes = ['/', '/login', '/jobs']
const authRoutes = ['/auth/callback']
const onboardingRoutes = ['/onboarding']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Allow public routes and auth routes without checking authentication
  if (
    publicRoutes.includes(pathname) ||
    pathname.startsWith('/jobs') ||
    authRoutes.some(route => pathname.startsWith(route))
  ) {
    return supabaseResponse
  }

  // Redirect unauthenticated users to login
  if (!user && !publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // For authenticated users, check if profile is complete
  if (user && !onboardingRoutes.some(route => pathname.startsWith(route))) {
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single<{ role: UserRole | null }>()

    // Redirect to onboarding if no role set
    if (!profile || !profile.role) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - icon, apple-icon, opengraph-image (dynamic image routes)
     * - sitemap.xml, robots.txt (SEO files)
     * - public files (images, etc.)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|icon|apple-icon|opengraph-image|sitemap\\.xml|robots\\.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
