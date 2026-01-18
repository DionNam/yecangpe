# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-17)

**Core value:** 한국어 가능한 외국인이 자신의 국적에 맞는 채용 공고를 쉽게 찾고, 댓글로 질문할 수 있어야 한다.
**Current focus:** Phase 5 - Admin Panel

## Current Position

Phase: 5 of 6 (Admin Panel)
Plan: 0 of 4 in current phase
Status: Ready to plan
Last activity: 2026-01-18 — Phase 4 verified and complete

Progress: [████████████] 66.7% of v1.0 milestone (12/18 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 12
- Average duration: 5.1min
- Total execution time: 1.01 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 14min | 4.7min |
| 02-authentication | 3 | 21min | 7.0min |
| 03-job-seeker-experience | 4 | 19.2min | 4.8min |
| 04-employer-experience | 2 | 10.8min | 5.4min |

**Recent Trend:**
- Last 5 plans: 04-02 (4.8min), 04-01 (6min), 03-03 (2.6min), 03-02 (6.6min), 03-01 (4.5min)
- Trend: Consistent execution pace maintained

*Updated after each plan completion*

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

| Decision | Phase | Context |
|----------|-------|---------|
| Use gen_random_uuid() instead of uuid_generate_v4() | 01-01 | Native Postgres 13+ function, no extension dependency required |
| Use (SELECT auth.uid()) pattern in all RLS policies | 01-01 | 95% performance improvement via statement-level caching |
| Helper functions with SECURITY DEFINER for role checks | 01-01 | Centralized role logic (is_admin, is_employer, is_seeker) reusable across policies |
| Use pnpm workspace protocol (workspace:*) for internal package dependencies | 01-02 | Enables proper version resolution and better IDE support |
| Configure standalone builds with outputFileTracingRoot for monorepo support | 01-02 | Required for Docker deployment and correct dependency bundling |
| Set Turborepo dev task with cache:false and persistent:true | 01-02 | Dev servers should never cache and must stay running |
| 16 nationality codes defined based on Korea's foreign worker demographics | 01-02 | Covers major source countries plus "ANY" for nationality-agnostic positions |
| Use @supabase/ssr for cookie-based session management | 01-03 | Modern library replacing deprecated auth-helpers |
| Implement getUser() in middleware instead of getSession() | 01-03 | JWT validation via Auth server prevents cookie spoofing |
| Manual type generation from migration schema | 01-03 | Supabase CLI requires authentication; manual generation identical to CLI output |
| Test connection with job_posts instead of global_metrics_config | 01-03 | global_metrics_config requires auth; job_posts allows anon reads for public browsing |
| Use TailwindCSS v4 with @tailwindcss/postcss plugin | 02-01 | TailwindCSS v4 requires separate PostCSS plugin package |
| Implement PKCE flow with exchangeCodeForSession | 02-01 | PKCE provides security for OAuth code exchange |
| Check user role field to determine onboarding completion | 02-01 | Null role indicates incomplete profile requiring onboarding |
| Use explicit TypeScript type assertions for Supabase queries | 02-01 | TypeScript strict mode requires explicit typing for .single() results |
| Define route arrays for middleware logic | 02-01 | Centralized route definitions (publicRoutes, authRoutes, onboardingRoutes) improve maintainability |
| Use route group (onboarding) to isolate onboarding flow | 02-02 | Route group keeps onboarding pages separate from main app routing |
| Logout button uses client-side signOut with router.refresh() | 02-02 | Ensures both client and server session state is cleared |
| Remove z.coerce from topik_level to fix TypeScript inference | 02-02 | z.coerce causes type inference to become 'unknown' in react-hook-form resolvers |
| Use 'as any' type assertion for Supabase upsert/insert | 02-03 | TypeScript cannot infer createClient() return type properly; runtime behavior correct |
| Install @supabase/supabase-js as direct dependency | 02-03 | Provides type definitions for SupabaseClient even though using 'as any' workaround |
| FormData pattern in server actions | 02-03 | Matches Next.js server action conventions for form submission |
| Allow /jobs/* routes without auth, handle detail access via modal | 03-01 | Enables public browsing, defers auth check to detail page interaction |
| Use logarithmic growth curve for fake metrics | 03-01 | Smooth ramp from 0 to target over ramp_days period using log(1 + x*strength) |
| Calculate display metrics server-side | 03-01 | Prevents client-side calculation mismatches, centralizes logic |
| URL-based filter and pagination state | 03-01 | Enables shareable links, back button preservation, SEO-friendly |
| Use redirect() for auth check instead of middleware enforcement | 03-02 | Allows middleware to pass /jobs/* routes while detail pages enforce auth |
| Check seeker_profiles to determine like capability | 03-02 | Only seekers can like posts, employers cannot |
| Global not-found.tsx at app root | 03-02 | Required for Next.js App Router 404 handling, prevents build errors |
| Use modal for profile editing | 03-04 | Better UX for quick edits without leaving page |
| Separate profile validation schema for updates | 03-04 | Allows different update rules vs creation even though similar |
| Use 'as any' for Supabase joined queries | 03-04 | TypeScript cannot infer types for .select() with joins, runtime correct |
| Array query instead of .single() for existence checks | 03-03 | Avoids TypeScript 'never' type issues when record may not exist |
| useOptimistic hook for like button | 03-03 | Provides instant visual feedback before server response |
| Role-based like capability validation | 03-03 | Server-side check of seeker_profiles prevents unauthorized likes |
| Include 'ANY' nationality code for job posts | 04-01 | Job posts allow ANY nationality unlike seeker profiles which exclude it |
| Random view_target and like_target from global_metrics_config | 04-01 | Job posts get random targets within configured min/max ranges |
| Hiring status toggle disabled for non-published posts | 04-02 | Only published posts can change hiring status per EMPM-03 |
| Metrics display shows '-' for pending/rejected posts | 04-02 | Metrics not calculated until post is published |
| Like counts fetched individually per post | 04-02 | Ensures accuracy of like count display for each post |

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-18
Stopped at: Phase 4 Employer Experience verified complete - ready for Phase 5 Admin Panel
Resume file: None
