# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-17)

**Core value:** 한국어 가능한 외국인이 자신의 국적에 맞는 채용 공고를 쉽게 찾고, 댓글로 질문할 수 있어야 한다.
**Current focus:** Phase 3 - Job Seeker Experience

## Current Position

Phase: 3 of 6 (Job Seeker Experience)
Plan: 0 of 4 in current phase
Status: Ready to start
Last activity: 2026-01-18 — Phase 2 verified and complete

Progress: [███████░░░] 33.3% of v1.0 milestone (6/18 plans complete)

## Performance Metrics

**Velocity:**
- Total plans completed: 6
- Average duration: 5.7min
- Total execution time: 0.57 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 3 | 14min | 4.7min |
| 02-authentication | 3 | 21min | 7.0min |

**Recent Trend:**
- Last 5 plans: 02-03 (8min), 02-02 (7min), 02-01 (6min), 01-03 (6min), 01-02 (4min)
- Trend: Authentication phase averaged 7min (UI + form handling complexity)

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-18
Stopped at: Phase 2 Authentication verified complete - ready for Phase 3 Job Seeker Experience
Resume file: None
