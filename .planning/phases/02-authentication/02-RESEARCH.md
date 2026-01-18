# Phase 2: Authentication - Research

**Researched:** 2026-01-18
**Domain:** Google OAuth, Supabase Auth, Next.js 15 App Router, Onboarding Flow
**Confidence:** HIGH

## Summary

Phase 2 implements the complete authentication and onboarding flow for the platform. This includes Google OAuth sign-in using Supabase Auth with PKCE flow, role selection (seeker/employer) on first login, and role-specific profile creation forms. The implementation leverages the `@supabase/ssr` package already set up in Phase 1.

The standard approach for Supabase OAuth with Next.js App Router involves: (1) a client-side sign-in trigger that redirects to Google, (2) a callback route handler that exchanges the auth code for a session using `exchangeCodeForSession`, (3) middleware that validates and refreshes tokens on every request, and (4) an onboarding flow that redirects users without profiles to complete their setup.

**Primary recommendation:** Implement OAuth flow using existing `@supabase/ssr` setup, create a dedicated `/auth/callback` route handler, use middleware to enforce onboarding completion, and build forms with shadcn/ui Form + React Hook Form + Zod for type-safe validation.

## Standard Stack

The established libraries/tools for Phase 2 authentication.

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/ssr | ^0.5.x | OAuth + session management | Already installed; handles PKCE flow and cookie-based sessions |
| react-hook-form | ^7.54.x | Form state management | De facto standard for React forms; minimal re-renders |
| @hookform/resolvers | ^3.9.x | Validation resolvers | Bridges Zod to React Hook Form |
| zod | ^3.24.x | Schema validation | Type-safe, composable validation; infers TypeScript types |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| shadcn/ui Form | Latest | Form UI components | Pre-built accessible form primitives |
| shadcn/ui Select | Latest | Dropdown selections | Nationality, TOPIK level selectors |
| shadcn/ui RadioGroup | Latest | Role selection | seeker/employer choice |
| shadcn/ui Button | Latest | Form actions | Sign-in, submit buttons |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| React Hook Form | useActionState alone | RHF provides better DX, field-level validation, and shadcn integration |
| Zod | Yup | Zod has better TypeScript inference; both work with shadcn |
| Client-side OAuth trigger | Server Action | OAuth requires browser redirect; must initiate from client |

**Installation:**

```bash
# In apps/web
pnpm add react-hook-form @hookform/resolvers zod

# Add shadcn components
pnpm dlx shadcn@latest add form input select radio-group button label card
```

## Architecture Patterns

### Recommended Project Structure

```
apps/web/
├── app/
│   ├── (auth)/                    # Auth route group (public)
│   │   ├── login/
│   │   │   └── page.tsx           # Login page with Google button
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts       # OAuth callback handler
│   ├── (onboarding)/              # Onboarding route group (auth required)
│   │   └── onboarding/
│   │       ├── page.tsx           # Role selection
│   │       ├── seeker/
│   │       │   └── page.tsx       # Seeker profile form
│   │       └── employer/
│   │           └── page.tsx       # Employer profile form
│   ├── (main)/                    # Protected main app routes
│   │   └── ...
│   └── actions/
│       └── auth.ts                # Auth-related server actions
├── components/
│   └── auth/
│       ├── login-button.tsx       # Google sign-in button
│       ├── role-selector.tsx      # seeker/employer choice
│       ├── seeker-form.tsx        # Seeker onboarding form
│       └── employer-form.tsx      # Employer onboarding form
├── lib/
│   └── validations/
│       └── auth.ts                # Zod schemas for auth forms
└── middleware.ts                  # Enhanced with onboarding redirect
```

### Pattern 1: Google OAuth Sign-In (Client Component)

**What:** Trigger Google OAuth from a client component using signInWithOAuth
**When to use:** Login page, any sign-in button

```typescript
// components/auth/login-button.tsx
'use client'

import { createClient } from '@repo/supabase/client'
import { Button } from '@/components/ui/button'

export function LoginButton() {
  const handleLogin = async () => {
    const supabase = createClient()

    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })
  }

  return (
    <Button onClick={handleLogin} variant="outline" className="w-full">
      <GoogleIcon className="mr-2 h-4 w-4" />
      Google로 계속하기
    </Button>
  )
}
```

### Pattern 2: OAuth Callback Route Handler (PKCE Flow)

**What:** Exchange auth code for session tokens in a route handler
**When to use:** Required for server-side auth flow

```typescript
// app/(auth)/auth/callback/route.ts
import { createClient } from '@repo/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user needs onboarding
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check for existing profile (either seeker or employer)
        const { data: seekerProfile } = await supabase
          .from('seeker_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        const { data: employerProfile } = await supabase
          .from('employer_profiles')
          .select('id')
          .eq('user_id', user.id)
          .single()

        // Redirect based on profile status
        if (!seekerProfile && !employerProfile) {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }

      return NextResponse.redirect(origin)
    }
  }

  // Auth error - redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth`)
}
```

### Pattern 3: Enhanced Middleware with Onboarding Enforcement

**What:** Extend existing middleware to redirect incomplete users to onboarding
**When to use:** Protect main app routes from users without profiles

```typescript
// apps/web/middleware.ts
import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@repo/supabase/middleware'
import { createServerClient } from '@supabase/ssr'

// Routes that don't require authentication
const publicRoutes = ['/login', '/auth/callback', '/']

// Routes that require auth but not profile completion
const onboardingRoutes = ['/onboarding', '/onboarding/seeker', '/onboarding/employer']

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // Public routes - allow access
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/'))) {
    return supabaseResponse
  }

  // No user - redirect to login
  if (!user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Check profile completion for protected routes
  if (!onboardingRoutes.some(route => pathname.startsWith(route))) {
    // Need to check if user has profile
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return request.cookies.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value)
            )
          },
        },
      }
    )

    // Check users table for role
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    // No role set - redirect to onboarding
    if (!userData?.role) {
      const url = request.nextUrl.clone()
      url.pathname = '/onboarding'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

### Pattern 4: Zod Schema with Type Inference

**What:** Define validation schemas that work for both client and server
**When to use:** All form validation

```typescript
// lib/validations/auth.ts
import { z } from 'zod'
import { NATIONALITIES } from '@repo/lib'

const nationalityCodes = NATIONALITIES.map(n => n.code) as [string, ...string[]]

export const seekerProfileSchema = z.object({
  nationality: z.enum(nationalityCodes, {
    required_error: '국적을 선택해주세요',
  }),
  topik_level: z.coerce.number().min(0).max(6).nullable().optional(),
  occupation: z.string().max(100).nullable().optional(),
  referral_source: z.string().max(200).nullable().optional(),
})

export const employerProfileSchema = z.object({
  company_name: z.string().min(1, '기업/개인명을 입력해주세요').max(100),
  referral_source: z.string().max(200).nullable().optional(),
})

export type SeekerProfileInput = z.infer<typeof seekerProfileSchema>
export type EmployerProfileInput = z.infer<typeof employerProfileSchema>
```

### Pattern 5: Server Action for Profile Creation

**What:** Create user profile with proper RLS and transaction handling
**When to use:** Onboarding form submission

```typescript
// app/actions/auth.ts
'use server'

import { createClient } from '@repo/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { seekerProfileSchema, employerProfileSchema } from '@/lib/validations/auth'

export async function createSeekerProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const rawData = {
    nationality: formData.get('nationality'),
    topik_level: formData.get('topik_level'),
    occupation: formData.get('occupation'),
    referral_source: formData.get('referral_source'),
  }

  const result = seekerProfileSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Update users table with role
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      role: 'seeker',
    })

  if (userError) throw userError

  // Create seeker profile
  const { error: profileError } = await supabase
    .from('seeker_profiles')
    .insert({
      user_id: user.id,
      ...result.data,
    })

  if (profileError) throw profileError

  revalidatePath('/')
  redirect('/')
}

export async function createEmployerProfile(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const rawData = {
    company_name: formData.get('company_name'),
    referral_source: formData.get('referral_source'),
  }

  const result = employerProfileSchema.safeParse(rawData)
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors }
  }

  // Update users table with role
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: user.id,
      email: user.email!,
      role: 'employer',
    })

  if (userError) throw userError

  // Create employer profile
  const { error: profileError } = await supabase
    .from('employer_profiles')
    .insert({
      user_id: user.id,
      ...result.data,
    })

  if (profileError) throw profileError

  revalidatePath('/')
  redirect('/')
}
```

### Pattern 6: Form Component with shadcn/ui

**What:** Build accessible, validated forms using shadcn Form components
**When to use:** All onboarding forms

```typescript
// components/auth/seeker-form.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { NATIONALITIES } from '@repo/lib'
import { seekerProfileSchema, type SeekerProfileInput } from '@/lib/validations/auth'
import { createSeekerProfile } from '@/app/actions/auth'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function SeekerForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<SeekerProfileInput>({
    resolver: zodResolver(seekerProfileSchema),
    defaultValues: {
      nationality: undefined,
      topik_level: null,
      occupation: '',
      referral_source: '',
    },
  })

  const onSubmit = (data: SeekerProfileInput) => {
    startTransition(async () => {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value))
        }
      })
      await createSeekerProfile(formData)
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nationality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>국적 *</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="국적을 선택하세요" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {NATIONALITIES.filter(n => n.code !== 'ANY').map((nat) => (
                    <SelectItem key={nat.code} value={nat.code}>
                      {nat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topik_level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>TOPIK 급수</FormLabel>
              <Select
                onValueChange={(v) => field.onChange(v ? parseInt(v) : null)}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="선택 안함" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">없음</SelectItem>
                  {[1, 2, 3, 4, 5, 6].map((level) => (
                    <SelectItem key={level} value={level.toString()}>
                      {level}급
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="occupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>직업/직종</FormLabel>
              <FormControl>
                <Input placeholder="예: 제조업, IT, 서비스업" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="referral_source"
          render={({ field }) => (
            <FormItem>
              <FormLabel>유입 경로</FormLabel>
              <FormControl>
                <Input placeholder="어떻게 알게 되셨나요?" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? '저장 중...' : '프로필 완성하기'}
        </Button>
      </form>
    </Form>
  )
}
```

### Anti-Patterns to Avoid

- **Triggering OAuth from Server Actions:** OAuth requires browser redirect; must use client component
- **Using getSession() to check auth:** Use getUser() which validates with Supabase Auth server
- **Checking profile in every component:** Use middleware for consistent enforcement
- **Creating users table entry before OAuth completes:** Wait for successful auth callback
- **Storing role in auth.users metadata:** Use public.users table for RLS compatibility

## Don't Hand-Roll

Problems that look simple but have existing solutions.

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token refresh | Manual JWT refresh | `@supabase/ssr` middleware | Race conditions, cookie handling complexity |
| Form validation | Manual validation logic | React Hook Form + Zod | Type inference, accessible error handling |
| OAuth state | Custom state management | Supabase PKCE flow | Security (code verifier), session handling |
| Select dropdowns | Custom dropdown | shadcn/ui Select | Accessibility, keyboard navigation |
| Loading states | Manual state tracking | useTransition / isPending | React 19 built-in, automatic |

**Key insight:** Supabase handles the entire OAuth flow including PKCE security. The callback route only needs to call `exchangeCodeForSession` - don't implement custom token handling.

## Common Pitfalls

### Pitfall 1: OAuth Callback on Different Domain/Port

**What goes wrong:** Auth code exchange fails; user stuck in redirect loop
**Why it happens:** `redirectTo` URL doesn't match Supabase allowed URLs
**How to avoid:**
1. Configure Supabase Dashboard: Authentication > URL Configuration > Redirect URLs
2. Add both development and production URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`
3. Use wildcard patterns for preview deployments: `https://*.vercel.app/auth/callback`
**Warning signs:** Error in callback URL params, network errors in exchange call

### Pitfall 2: Race Condition in Profile Check

**What goes wrong:** User redirected to onboarding even with existing profile
**Why it happens:** Middleware profile check races with callback profile creation
**How to avoid:**
- Check profile in callback route AFTER `exchangeCodeForSession` completes
- In middleware, only check for protected routes (not onboarding routes themselves)
- Use the users.role column as the source of truth for onboarding completion
**Warning signs:** Intermittent redirects to onboarding for existing users

### Pitfall 3: Missing User Record Before Profile Creation

**What goes wrong:** Foreign key constraint violation when creating profile
**Why it happens:** users table entry must exist before seeker_profiles/employer_profiles
**How to avoid:**
- Use `upsert` for users table first, then `insert` for profile
- The RLS policies use `(SELECT auth.uid())` which only works for authenticated users
**Warning signs:** Database error: "violates foreign key constraint"

### Pitfall 4: Form Data Type Coercion

**What goes wrong:** Zod validation fails on number fields from FormData
**Why it happens:** FormData.get() always returns string; Zod expects number
**How to avoid:**
- Use `z.coerce.number()` for numeric fields from FormData
- Or convert explicitly before validation: `parseInt(formData.get('field'))`
**Warning signs:** "Expected number, received string" validation errors

### Pitfall 5: Middleware Infinite Redirect Loop

**What goes wrong:** Page keeps redirecting to login or onboarding
**Why it happens:** Redirect target URL is also matched by middleware
**How to avoid:**
```typescript
// Explicitly exclude redirect targets from protection
const publicRoutes = ['/login', '/auth/callback']
const onboardingRoutes = ['/onboarding', '/onboarding/seeker', '/onboarding/employer']

if (publicRoutes.some(r => pathname === r)) return supabaseResponse
if (onboardingRoutes.some(r => pathname.startsWith(r)) && user) return supabaseResponse
```
**Warning signs:** Browser "too many redirects" error

### Pitfall 6: Losing Form State on Server Action Error

**What goes wrong:** User's input disappears when server returns validation error
**Why it happens:** Page re-renders without preserving form values
**How to avoid:**
- Use React Hook Form which preserves values
- Return errors as state, not redirect
- Use `useTransition` + `startTransition` for non-blocking submission
**Warning signs:** Users complain about re-typing data after errors

## Code Examples

Verified patterns from official sources.

### Environment Variables Needed

```bash
# apps/web/.env.local (already exists from Phase 1)
NEXT_PUBLIC_SUPABASE_URL=https://xztfqnznwcgjjbpyuchf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# No additional env vars needed - Google OAuth is configured in Supabase Dashboard
```

### Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create project or select existing
3. Navigate to APIs & Services > Credentials
4. Create OAuth 2.0 Client ID (Web application)
5. Configure:
   - Authorized JavaScript origins: `http://localhost:3000`, `https://yourdomain.com`
   - Authorized redirect URIs: `https://xztfqnznwcgjjbpyuchf.supabase.co/auth/v1/callback`
6. Copy Client ID and Client Secret

### Supabase Dashboard Configuration

1. Go to Authentication > Providers > Google
2. Enable Google provider
3. Paste Client ID and Client Secret from Google
4. Go to Authentication > URL Configuration
5. Add Site URL: `https://yourdomain.com` (or `http://localhost:3000` for dev)
6. Add Redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://yourdomain.com/auth/callback`

### Login Page

```typescript
// app/(auth)/login/page.tsx
import { LoginButton } from '@/components/auth/login-button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">외국인 구인구직</CardTitle>
          <CardDescription>
            한국어 가능한 외국인을 위한 구인구직 플랫폼
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LoginButton />
        </CardContent>
      </Card>
    </div>
  )
}
```

### Role Selection Page

```typescript
// app/(onboarding)/onboarding/page.tsx
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>어떤 목적으로 사용하시나요?</CardTitle>
          <CardDescription>
            가입 유형을 선택해주세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild variant="outline" className="w-full h-auto py-6">
            <Link href="/onboarding/seeker">
              <div className="text-left">
                <div className="font-semibold">일자리를 찾고 있어요</div>
                <div className="text-sm text-muted-foreground">
                  구직자로 가입합니다
                </div>
              </div>
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full h-auto py-6">
            <Link href="/onboarding/employer">
              <div className="text-left">
                <div className="font-semibold">인재를 찾고 있어요</div>
                <div className="text-sm text-muted-foreground">
                  구인자로 가입합니다
                </div>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
```

### Sign Out Function

```typescript
// components/auth/logout-button.tsx
'use client'

import { createClient } from '@repo/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button variant="ghost" onClick={handleLogout}>
      로그아웃
    </Button>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-nextjs` | `@supabase/ssr` | 2024 | Unified SSR auth handling, not Next.js specific |
| `createRouteHandlerClient` | `createClient` from server.ts | 2024 | Single server client factory handles all contexts |
| Implicit OAuth flow | PKCE flow | 2024 | Required for SSR; more secure |
| `useFormState` (react-dom) | `useActionState` (react) | React 19 | Moved to react package |
| Manual form validation | React Hook Form + Zod | Ongoing | Better DX, type safety, accessibility |

**Deprecated/outdated:**
- `@supabase/auth-helpers-nextjs`: Use `@supabase/ssr` instead
- `createRouteHandlerClient`, `createServerComponentClient`: Use unified `createClient` from server.ts
- `getSession()` for auth checks: Use `getUser()` which validates with server
- Implicit OAuth flow in SSR context: Use PKCE with `exchangeCodeForSession`

## Open Questions

Things that couldn't be fully resolved.

1. **Google OAuth Scope Limitations**
   - What we know: Default scopes include email and profile
   - What's unclear: Whether additional scopes needed for future features
   - Recommendation: Start with default scopes; can add later via `scopes` option

2. **Session Token Expiry Handling**
   - What we know: Middleware refreshes tokens automatically
   - What's unclear: Exact behavior when refresh fails during active session
   - Recommendation: Rely on @supabase/ssr's default handling; add error boundary if issues arise

3. **Mobile/PWA OAuth Flow**
   - What we know: Standard OAuth redirects work on mobile browsers
   - What's unclear: Any issues with PWA mode or deep linking
   - Recommendation: Test on mobile; may need to configure universal links later

## Sources

### Primary (HIGH confidence)
- [Supabase Server-Side Auth for Next.js](https://supabase.com/docs/guides/auth/server-side/nextjs) - Middleware, callback route, client setup
- [Supabase Google OAuth Setup](https://supabase.com/docs/guides/auth/social-login/auth-google) - Google Cloud configuration, scopes
- [Supabase PKCE Flow](https://supabase.com/docs/guides/auth/sessions/pkce-flow) - exchangeCodeForSession, auth code handling
- [shadcn/ui Form Component](https://ui.shadcn.com/docs/components/form) - React Hook Form integration pattern
- [React Hook Form with Next.js 15](https://markus.oberlehner.net/blog/using-react-hook-form-with-react-19-use-action-state-and-next-js-15-app-router/) - useActionState integration

### Secondary (MEDIUM confidence)
- [Clerk Onboarding Flow Pattern](https://clerk.com/docs/references/nextjs/add-onboarding-flow) - Middleware redirect pattern (adapted for Supabase)
- [Next.js Middleware Documentation](https://nextjs.org/docs/14/app/building-your-application/routing/middleware) - Matcher configuration

### Tertiary (LOW confidence)
- None - all patterns verified with official documentation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All packages from official Supabase/shadcn recommendations
- Architecture: HIGH - Patterns from official Supabase Next.js guide
- Pitfalls: HIGH - Based on documented gotchas and common Stack Overflow issues

**Research date:** 2026-01-18
**Valid until:** 45 days (auth patterns are relatively stable)
