# Research Summary

**Project:** 외국인 구인/구직 플랫폼 (Job board for Korean-speaking foreigners)
**Domain:** Two-sided job marketplace
**Researched:** 2026-01-17
**Confidence:** HIGH

## Stack Decision

The stack is pre-decided and well-suited for this project: **Next.js 15.5+ (App Router) + Supabase + Tailwind CSS 4.x + shadcn/ui**.

**Core stack:**
- **Next.js 15.5.x**: Server Components and Server Actions provide excellent DX, eliminate most API route boilerplate. Turbopack for fast development. Use RSC for data fetching, Server Actions for mutations.
- **Supabase**: PostgreSQL with Row Level Security handles auth, database, and storage in one platform. Google OAuth built-in. RLS is the security boundary, not application code.
- **react-hook-form + zod**: Industry standard for forms. Share schemas between client validation and Server Actions.
- **TanStack Query + zustand + nuqs**: Server state, client state, and URL state respectively. No Redux needed.

**Key version requirements:**
- Use `@supabase/ssr` (NOT deprecated `@supabase/auth-helpers-nextjs`)
- Tailwind CSS 4.x with CSS-first config
- Zod 4.x for TypeScript inference

**Avoid:** axios (use Supabase client), moment.js (use date-fns), formik (use react-hook-form), SWR (use TanStack Query), Redux.

## Table Stakes Features

Users expect these features from any job board. Missing any creates friction or abandonment:

1. **Job listings display** with pagination and basic browsing
2. **Search and filtering** (nationality filter is core differentiator)
3. **Job detail view** with full information
4. **User registration/login** (Google OAuth)
5. **Role-based access** (Job Seeker vs Employer)
6. **Mobile-responsive design** (60%+ Korean traffic is mobile)
7. **Basic profile management**
8. **Saved/liked jobs** (heart toggle)
9. **Contact method** (comment-based Q&A serves this)

The current project scope covers these well. Verify during implementation: mobile-first design, loading states, error handling, basic SEO.

## Differentiators

What sets this platform apart from KOWORK, KLiK, Jobploy, KoMate:

1. **Nationality-based filtering** - Core differentiator. Korean competitors mix all foreigners together.
2. **Comment-based Q&A on jobs** - Creates community feel, reduces formal application friction.
3. **Admin approval workflow** - Addresses "ghost posting" trust issue plaguing competitors.
4. **Manipulated metrics** - Honest social proof for cold start (view/like targets, not fake users).
5. **Korean-only UI** - Counter-intuitive but correct positioning. Filters for Korean-proficient foreigners.

**Post-MVP differentiators:** Visa type filter, TOPIK level display, employer verification badge, job categories, notification system.

**Anti-features (deliberately NOT building):** One-click apply (generates spam), complex application forms (57% abandon rate), resume upload requirement, multi-language toggle, native mobile app, real-time messaging.

## Architecture Highlights

**Monorepo structure (Turborepo):**
- `apps/web` - Main user-facing application
- `apps/admin` - Separate admin panel (security isolation, different UI needs)
- `packages/supabase` - Shared clients, types, query helpers
- `packages/ui` - Shared shadcn/ui components
- `packages/lib` - Constants (nationalities, TOPIK levels), Zod schemas

**Data layer pattern:**
- Server Components for data fetching (direct Supabase queries)
- Server Actions for mutations (createPost, toggleLike, approvePost)
- RLS policies as primary security boundary
- Views with `security_invoker = true` for computed metrics

**Key design decisions:**
1. Separate metrics table storing targets, NOT computed values. Manipulated counts calculated at request time.
2. Role derived from profile table existence (seeker vs employer), not stored field.
3. Admin auth via email allowlist or `app_metadata.role` (never `user_metadata`).

## Critical Pitfalls to Avoid

### Security (Address in Phase 1)

1. **RLS not enabled on tables** - Enable on EVERY table immediately. CVE-2025-48757 exposed 170+ apps. Use `security_invoker = true` on views.

2. **Missing WITH CHECK on UPDATE policies** - Allows users to steal data by modifying ownership. Every UPDATE policy needs both USING and WITH CHECK.

3. **Using user_metadata for roles** - User-editable, bypassable. Use `app_metadata` (admin-only) or separate roles table.

4. **Client-side auth checks only** - Always validate server-side with `supabase.auth.getUser()`. RLS provides defense in depth.

### Performance (Design in Phase 1, Monitor in Phase 3+)

5. **RLS policy performance** - Wrap `auth.uid()` in SELECT: `(SELECT auth.uid())` to cache per query. Index RLS columns.

6. **Realtime subscriptions without filters** - Always filter to relevant data. Unfiltered subscriptions hit rate limits and cause delays.

### Next.js (Ongoing discipline)

7. **"use client" everywhere** - Keep client boundaries small. Most components should be Server Components. Extract only interactive parts.

8. **Forgetting revalidatePath after mutations** - Data changes but UI shows stale. Always revalidate after Server Actions.

### Monorepo

9. **Standalone build path issues** - Set `outputFileTracingRoot` in next.config.js to monorepo root for proper deployment.

10. **"use client" lost with tsup** - Use `splitting: true` in tsup config for shared packages.

## Build Order Recommendation

Based on dependency analysis from ARCHITECTURE.md:

### Phase 1: Foundation
- Database schema, RLS policies, type generation
- Shared packages setup (supabase, ui, lib, config)
- Supabase clients (browser + server)
- Monorepo configuration (Turborepo, tsconfig, eslint)

**Rationale:** Everything depends on database types and shared infrastructure.
**Critical pitfalls:** RLS on all tables, WITH CHECK clauses, proper migration workflow.

### Phase 2: Authentication
- Middleware for session refresh
- OAuth callback route
- Login page
- Role selection after login
- Onboarding flows (seeker + employer profiles)

**Rationale:** All protected features require auth.
**Critical pitfalls:** Use @supabase/ssr not deprecated helpers, configure all OAuth redirect URIs.

### Phase 3: Job Seeker Experience
- Job list page (public, limited info)
- Job detail page (authenticated, full info)
- Heart/save functionality
- Comment system (write + read)
- User profile page (mypage)

**Rationale:** Core value proposition. Seekers are primary users.
**Critical pitfalls:** Server Components for SSR, revalidate after mutations.

### Phase 4: Employer Experience
- Job posting form with validation
- My posts management
- Post editing
- Comment replies

**Rationale:** Builds on seeker foundation, secondary user type.
**Research flag:** Job posting form complexity, state management for drafts.

### Phase 5: Admin Panel
- Admin auth (separate from user auth)
- Approval queue
- User management (seekers + employers)
- Metrics configuration (global settings)
- Direct post creation

**Rationale:** Operational tooling, not user-facing MVP. Separate app for security.
**Standard patterns:** TanStack Table for data grids, shadcn/ui admin components.

### Phase 6: Growth Features
- Manipulated metrics display
- SEO optimization (sitemaps, meta tags)
- Mobile responsiveness polish
- Performance optimization

**Rationale:** Polish after core functionality works.
**Research flag:** Metrics calculation formula, SEO for dynamic routes.

## Open Questions

1. **Next.js version** - 15.5.x is battle-tested, 16.x has Cache Components. Start with 15.5.x unless specific 16 features needed.

2. **Internationalization** - Korean-only for MVP. Consider next-intl only if adding English later.

3. **Realtime** - Not needed for MVP. Architecture supports it for future comment updates.

4. **File uploads** - Use signed URLs for direct-to-Supabase upload. Avoid serverless function limits.

5. **Slug generation** - Use slugs in URLs for SEO (`/jobs/frontend-developer-seoul-abc123`), not just numeric IDs.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Pre-decided, verified against official docs, industry standard |
| Features | HIGH | Competitor analysis complete, anti-features well-reasoned |
| Architecture | HIGH | Supabase patterns well-documented, monorepo patterns established |
| Pitfalls | HIGH | Official security advisories, CVE references, community consensus |

**Overall confidence:** HIGH

### Gaps to Address

- **Manipulated metrics formula** - Log curve parameters need tuning during implementation
- **Korean text rendering** - Test layouts with actual Korean content early
- **Google OAuth refresh tokens** - May need `access_type: 'offline', prompt: 'consent'` for long sessions
- **Admin allowlist implementation** - Decide between email allowlist vs app_metadata role

---
*Research completed: 2026-01-17*
*Ready for roadmap: yes*
