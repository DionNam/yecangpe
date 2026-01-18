---
phase: 02-authentication
plan: 01
subsystem: auth
tags: [google-oauth, pkce, zod, shadcn-ui, middleware, session-management]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Supabase client utilities, middleware setup, database schema
provides:
  - Google OAuth authentication with PKCE flow
  - Login page with Google sign-in button
  - OAuth callback handler with session exchange
  - Middleware-based authentication and onboarding enforcement
  - Zod validation schemas for seeker and employer profiles
affects: [02-02-onboarding, 02-03-role-selection, profile-management, job-posting]

# Tech tracking
tech-stack:
  added: [react-hook-form, @hookform/resolvers, zod, @tailwindcss/postcss, shadcn/ui components]
  patterns: [PKCE OAuth flow, middleware-based route protection, Zod schema validation]

key-files:
  created:
    - apps/web/components/ui/button.tsx
    - apps/web/components/ui/card.tsx
    - apps/web/lib/validations/auth.ts
    - apps/web/app/(auth)/login/page.tsx
    - apps/web/app/(auth)/auth/callback/route.ts
    - apps/web/components/auth/login-button.tsx
    - apps/web/postcss.config.mjs
    - apps/web/tailwind.config.ts
  modified:
    - packages/supabase/src/middleware.ts
    - apps/web/middleware.ts
    - apps/web/package.json

key-decisions:
  - "Use TailwindCSS v4 with @tailwindcss/postcss plugin"
  - "Implement PKCE flow with exchangeCodeForSession for OAuth security"
  - "Check user role field to determine onboarding completion"
  - "Use explicit TypeScript type assertions for Supabase query results"
  - "Define route arrays (public, auth, onboarding) for middleware logic"

patterns-established:
  - "Zod schemas with nationality validation excluding 'ANY' for user profiles"
  - "Middleware returns supabase client for additional queries"
  - "OAuth callback checks profile completion and redirects appropriately"
  - "Loading states on OAuth buttons to prevent duplicate clicks"

# Metrics
duration: 6min
completed: 2026-01-18
---

# Phase 2 Plan 1: OAuth & Middleware Summary

**Google OAuth with PKCE flow, middleware-based auth enforcement, and Zod validation schemas for downstream onboarding forms**

## Performance

- **Duration:** 6 min
- **Started:** 2026-01-18T08:45:05Z
- **Completed:** 2026-01-18T08:51:14Z
- **Tasks:** 4
- **Files modified:** 14

## Accomplishments
- Google OAuth authentication flow with PKCE code exchange
- Login page with styled Google sign-in button using shadcn/ui
- Middleware that redirects unauthenticated users to /login
- Middleware that redirects users without role to /onboarding
- Zod validation schemas ready for seeker and employer profile forms

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and add shadcn/ui components** - `c8c037f` (chore)
2. **Task 2: Create Zod validation schemas for profiles** - `a819209` (feat)
3. **Task 3: Create OAuth callback route and login page** - `2963b67` (feat)
4. **Task 4: Enhance middleware with onboarding enforcement** - `5b5c6ae` (feat)

## Files Created/Modified

### Created
- `apps/web/components/ui/button.tsx` - shadcn/ui Button component with variants
- `apps/web/components/ui/card.tsx` - shadcn/ui Card components for layouts
- `apps/web/lib/utils.ts` - cn() utility for Tailwind class merging
- `apps/web/lib/validations/auth.ts` - Zod schemas for seeker/employer profiles
- `apps/web/app/(auth)/login/page.tsx` - Login page with Google OAuth button
- `apps/web/app/(auth)/auth/callback/route.ts` - OAuth callback handler with PKCE exchange
- `apps/web/components/auth/login-button.tsx` - Google sign-in button component
- `apps/web/postcss.config.mjs` - PostCSS config with @tailwindcss/postcss
- `apps/web/tailwind.config.ts` - TailwindCSS v4 configuration
- `apps/web/app/globals.css` - Global styles with Tailwind directives

### Modified
- `packages/supabase/src/middleware.ts` - Return supabase client for additional queries
- `apps/web/middleware.ts` - Auth and onboarding enforcement logic
- `apps/web/package.json` - Add form dependencies and shadcn/ui packages
- `pnpm-lock.yaml` - Dependency lockfile updates

## Decisions Made

**1. Use TailwindCSS v4 with @tailwindcss/postcss plugin**
- Rationale: TailwindCSS v4 requires separate @tailwindcss/postcss package instead of using tailwindcss directly as PostCSS plugin
- Impact: Updated PostCSS config and fixed darkMode format (string instead of array)

**2. Implement PKCE flow with exchangeCodeForSession**
- Rationale: PKCE (Proof Key for Code Exchange) provides security for OAuth flow
- Impact: Callback route uses exchangeCodeForSession instead of direct token handling

**3. Check user role field to determine onboarding completion**
- Rationale: Role (seeker/employer) indicates profile is complete
- Impact: Middleware redirects users with null role to /onboarding

**4. Use explicit TypeScript type assertions for Supabase queries**
- Rationale: TypeScript strict mode requires explicit typing for .single() query results
- Impact: Added type parameter `.single<{ role: UserRole | null }>()` to queries

**5. Define route arrays for middleware logic clarity**
- Rationale: Centralized route definitions make auth logic easier to maintain
- Impact: publicRoutes, authRoutes, onboardingRoutes arrays control access

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed TailwindCSS v4 PostCSS plugin configuration**
- **Found during:** Task 1 (Build verification after shadcn installation)
- **Issue:** TailwindCSS v4 requires @tailwindcss/postcss package, not tailwindcss as PostCSS plugin
- **Fix:** Installed @tailwindcss/postcss and updated postcss.config.mjs to use '@tailwindcss/postcss' instead of 'tailwindcss'
- **Files modified:** apps/web/package.json, apps/web/postcss.config.mjs, pnpm-lock.yaml
- **Verification:** pnpm build succeeded
- **Committed in:** c8c037f (Task 1 commit)

**2. [Rule 3 - Blocking] Fixed TailwindCSS v4 darkMode configuration**
- **Found during:** Task 1 (Build verification after PostCSS fix)
- **Issue:** TailwindCSS v4 darkMode config changed format - array `["class"]` no longer valid, must be string `"class"`
- **Fix:** Changed darkMode from `["class"]` to `"class"` in tailwind.config.ts
- **Files modified:** apps/web/tailwind.config.ts
- **Verification:** pnpm build succeeded with TypeScript compilation
- **Committed in:** c8c037f (Task 1 commit)

**3. [Rule 3 - Blocking] Fixed Zod enum error message format**
- **Found during:** Task 2 (Build verification after creating validation schemas)
- **Issue:** z.enum() errorMap parameter not supported in current Zod version - should use message parameter directly
- **Fix:** Changed from `errorMap: () => ({ message: '...' })` to `message: '...'` in seekerProfileSchema
- **Files modified:** apps/web/lib/validations/auth.ts
- **Verification:** pnpm build succeeded
- **Committed in:** a819209 (Task 2 commit)

**4. [Rule 3 - Blocking] Fixed TypeScript type inference for Supabase query**
- **Found during:** Task 3 (Build verification after creating callback route)
- **Issue:** TypeScript couldn't infer role property type from .select('role').single() query
- **Fix:** Added explicit type parameter `.single<{ role: UserRole | null }>()` and imported UserRole type from Database types
- **Files modified:** apps/web/app/(auth)/auth/callback/route.ts
- **Verification:** pnpm build succeeded with no TypeScript errors
- **Committed in:** 2963b67 (Task 3 commit)

---

**Total deviations:** 4 auto-fixed (4 blocking configuration/type issues)
**Impact on plan:** All auto-fixes were necessary to unblock task completion. No scope creep - these were infrastructure compatibility issues with TailwindCSS v4 and TypeScript strict mode.

## Issues Encountered

**Network error during previous execution attempt**
- Previous attempt failed when running `shadcn add button card` due to ENOTFOUND ui.shadcn.com
- Resolved: Network connectivity restored - retry succeeded without changes
- No code modifications needed

## User Setup Required

**Google OAuth is already configured** according to plan frontmatter:
- Supabase Dashboard: Google OAuth provider enabled with Client ID and Secret
- Google Cloud Console: OAuth 2.0 Client ID created with Supabase callback URI
- Redirect URL configured: http://localhost:3000/auth/callback

No additional user setup required for this plan.

## Next Phase Readiness

**Ready for Phase 2 Plan 2 (Onboarding UI):**
- Zod schemas exported and available for onboarding forms
- Middleware enforces onboarding redirect for users without role
- OAuth callback redirects incomplete users to /onboarding
- shadcn/ui components ready for form building

**Ready for Phase 2 Plan 3 (Profile Creation):**
- Validation schemas define profile structure
- Middleware will allow access to /onboarding routes without role check

**No blockers or concerns.**

---
*Phase: 02-authentication*
*Completed: 2026-01-18*
