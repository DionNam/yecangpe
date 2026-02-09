import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@repo/supabase/middleware'
import type { Database } from '@repo/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

// Protected routes that require authentication (blacklist approach)
const protectedRoutes = ['/my-page', '/dashboard', '/employer/posts', '/employer/new-post', '/employer/talent']
const authRoutes = ['/auth/callback']
const onboardingRoutes = ['/onboarding']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Allow auth callback routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return supabaseResponse
  }

  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  // Non-protected routes are accessible without authentication
  if (!isProtectedRoute) {
    return supabaseResponse
  }

  // Redirect unauthenticated users to login for protected routes
  if (!user) {
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
