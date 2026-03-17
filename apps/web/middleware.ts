import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@repo/supabase/middleware'
import type { Database } from '@repo/supabase/types'

type UserRole = Database['public']['Enums']['user_role']

// Protected routes that require authentication (blacklist approach)
const protectedRoutes = ['/my-page', '/dashboard', '/employer/posts', '/employer/new-post', '/employer/talent']
const authRoutes = ['/auth/callback']
const onboardingRoutes = ['/onboarding']

// Routes that require employer role
const employerOnlyRoutes = ['/dashboard/post-job', '/employer/talent']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request)
  const { pathname } = request.nextUrl

  // Set IP-based cookies (only on first visit)
  const ipCountry = request.headers.get('x-vercel-ip-country') ?? ''
  if (ipCountry && !request.cookies.has('hanguljobs-ip-country')) {
    supabaseResponse.cookies.set('hanguljobs-ip-country', ipCountry, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    })
  }
  if (ipCountry) {
    // Only set language cookie when we have IP-based country info
    if (!request.cookies.has('hanguljobs-lang-default')) {
      const defaultLang = ipCountry === 'KR' ? 'ko' : 'en'
      supabaseResponse.cookies.set('hanguljobs-lang-default', defaultLang, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      })
    }
  }

  // Allow auth callback routes
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return supabaseResponse
  }

  // Check if this is a protected route (including onboarding)
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isOnboardingRoute = onboardingRoutes.some(route => pathname.startsWith(route))

  // Non-protected, non-onboarding routes are accessible without authentication
  if (!isProtectedRoute && !isOnboardingRoute) {
    return supabaseResponse
  }

  // Redirect unauthenticated users to login for protected/onboarding routes
  if (!user) {
    if (isOnboardingRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return supabaseResponse
  }

  // For authenticated users, fetch their role
  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single<{ role: UserRole | null }>()

  const userRole = profile?.role

  // If user already has a role, block onboarding access
  if (isOnboardingRoute && userRole) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If user has no role and is on a protected route, send to onboarding
  if (isProtectedRoute && !userRole) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }

  // Employer-only route checks
  const isEmployerOnlyRoute = employerOnlyRoutes.some(route => pathname.startsWith(route))
  if (isEmployerOnlyRoute && userRole !== 'employer' && userRole !== 'admin') {
    // Redirect seeker to dashboard with a query param to show a toast
    return NextResponse.redirect(new URL('/dashboard?role_error=employer_only', request.url))
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
