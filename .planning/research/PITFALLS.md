# Pitfalls Research: 외국인 구인/구직 플랫폼

**Domain:** Job board for Korean-speaking foreigners
**Stack:** Next.js + Supabase + Tailwind + shadcn/ui
**Researched:** 2026-01-17
**Confidence:** HIGH (verified with official docs and multiple sources)

---

## Critical Pitfalls

Mistakes that cause rewrites, security breaches, or major issues.

### 1. RLS Not Enabled on Tables

**What goes wrong:** Tables created without Row-Level Security allow anyone with the anon API key to read/write all data. CVE-2025-48757 exposed 170+ applications due to missing RLS policies.

**Why it happens:** Supabase auto-generates REST APIs from your schema, but RLS is opt-in, not default. During prototyping, developers skip RLS "to make it work" and forget before launch.

**Consequences:**
- Complete database exposure via public anon key
- Data leaks (job applications, personal info, resumes)
- Account takeovers if password reset tokens exposed

**Warning Signs:**
- Empty arrays when fetching data (RLS enabled but no policies)
- Everything works without user authentication
- No policies visible in Supabase Dashboard > Authentication > Policies

**Prevention:**
1. Enable RLS on EVERY table immediately after creation
2. Use Supabase Security Advisor in dashboard regularly
3. Add RLS check to CI pipeline (e.g., [supashield](https://github.com/Rodrigotari1/supashield))
4. Never use `service_role` key in client code

**Phase:** Phase 1 (Foundation) - Must be established from first table creation

**Sources:**
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Security Flaw: 170+ Apps Exposed](https://byteiota.com/supabase-security-flaw-170-apps-exposed-by-missing-rls/)

---

### 2. RLS Policy Performance Destruction

**What goes wrong:** RLS functions that seem simple cause O(n) complexity, creating an n+1-like problem where queries returning many rows trigger massive overhead.

**Why it happens:** Functions like `auth.uid()` get called for EACH row checked by RLS. With 10,000 job listings, a single query triggers 10,000 `auth.uid()` calls.

**Consequences:**
- Database timeouts on list pages
- Slow job search results
- Realtime subscriptions delayed or dropped
- Users see empty results or errors

**Warning Signs:**
- Query times increase linearly with data growth
- Realtime updates delayed
- "Database bottleneck" errors in logs
- Slow queries that were fast during development

**Prevention:**
1. Wrap unchanging values in SELECT: `(SELECT auth.uid())` instead of `auth.uid()` - this "caches" the value
2. For public data (job listings), consider separate tables without RLS for read operations
3. Use Supabase Performance Advisor to identify slow RLS policies
4. Test with realistic data volumes early

**Phase:** Phase 3+ (when data grows) - but design patterns established in Phase 1

**Sources:**
- [Supabase Best Practices](https://www.leanware.co/insights/supabase-best-practices)
- [Supabase Common Mistakes](https://hrekov.com/blog/supabase-common-mistakes)

---

### 3. Missing WITH CHECK on UPDATE Policies

**What goes wrong:** UPDATE policies without `WITH CHECK` clause allow users to modify row ownership, potentially stealing jobs or applications.

**Why it happens:** Developers understand `USING` (can I access this row?) but miss that `WITH CHECK` validates the NEW values after update.

**Consequences:**
- User A updates their job posting to have `employer_id = User B`
- Job applications can be reassigned to different jobs
- Data integrity completely compromised

**Warning Signs:**
- Users can change foreign key references they shouldn't
- Audit logs show impossible state transitions
- Jobs or applications appearing in wrong accounts

**Prevention:**
```sql
-- WRONG: Only checks current ownership
CREATE POLICY "users_update" ON jobs
FOR UPDATE USING (employer_id = auth.uid());

-- CORRECT: Validates both before and after
CREATE POLICY "users_update" ON jobs
FOR UPDATE
USING (employer_id = auth.uid())
WITH CHECK (employer_id = auth.uid());
```

**Phase:** Phase 1 (Foundation) - every UPDATE policy must have WITH CHECK

**Sources:**
- [Supabase RLS Issues](https://prosperasoft.com/blog/database/supabase/supabase-rls-issues/)

---

### 4. INSERT Requires SELECT Policy

**What goes wrong:** INSERTs fail silently or return errors because PostgreSQL SELECTs newly inserted rows to return them.

**Why it happens:** Non-obvious PostgreSQL behavior. INSERT operation internally does a SELECT to return the inserted row.

**Consequences:**
- Job creation fails with cryptic errors
- Application submissions don't work
- Developers add `service_role` as workaround (security disaster)

**Warning Signs:**
- INSERT returns empty or errors despite permissions
- Works with `service_role` but not `authenticated`
- Error messages about SELECT policy

**Prevention:**
1. Always create SELECT policy alongside INSERT policy
2. Test CRUD operations with authenticated user, not service role
3. Check Supabase logs for policy denial messages

**Phase:** Phase 1 (Foundation) - part of basic policy setup

---

### 5. Views Bypass RLS by Default

**What goes wrong:** Views created for convenience (e.g., `job_listings_with_company`) bypass all RLS because they run as postgres user.

**Why it happens:** PostgreSQL behavior - views use the definer's permissions, not the invoker's.

**Consequences:**
- Views expose all data regardless of policies
- Security audit passes on tables but misses views
- Data leakage through "helpful" views

**Warning Signs:**
- Views return more data than expected
- Same query returns different results from table vs view

**Prevention:**
```sql
-- PostgreSQL 15+: Make view respect RLS
CREATE VIEW job_listings_public
WITH (security_invoker = true) AS
SELECT * FROM jobs WHERE status = 'published';
```

**Phase:** Phase 2+ (when views are introduced)

---

### 6. user_metadata in RLS Policies

**What goes wrong:** RLS policies using `auth.jwt()->>'user_metadata'` are bypassable because users can modify their own user_metadata.

**Why it happens:** Confusion between `user_metadata` (user-editable) and `app_metadata` (admin-only).

**Consequences:**
- Users can escalate privileges by modifying metadata
- Role-based access completely bypassable
- Admin functions accessible to regular users

**Warning Signs:**
- Roles stored in user_metadata
- Users can call `supabase.auth.updateUser({ data: {...} })`

**Prevention:**
1. Use `app_metadata` for roles (only settable via admin API)
2. Or use separate `user_roles` table with proper RLS
3. Use Custom Claims pattern from Supabase docs

**Phase:** Phase 1 (Foundation) - role system design

**Sources:**
- [Supabase Custom Claims RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)

---

## Authentication & Session Pitfalls

### 7. Manual Token Management

**What goes wrong:** Developers write custom JWT handling, refresh token logic, or session storage instead of using `@supabase/ssr`.

**Why it happens:** Familiarity with other auth systems or distrust of "magic" helpers.

**Consequences:**
- Token refresh failures causing random logouts
- SSR/client state desync (logged in on server, logged out on client)
- Security vulnerabilities in custom code
- "Weird" behavior as sessions expire

**Warning Signs:**
- Using `localStorage` for tokens directly
- Custom fetch interceptors for auth headers
- `supabase-js` without `@supabase/ssr` in Next.js project

**Prevention:**
1. Use `@supabase/ssr` package
2. Implement middleware.ts with `updateSession`
3. Create separate clients for client/server contexts
4. Follow official Supabase Next.js guide exactly

**Phase:** Phase 1 (Foundation) - auth setup

**Sources:**
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Next.js Supabase Auth Troubleshooting](https://supabase.com/docs/guides/troubleshooting/how-do-you-troubleshoot-nextjs---supabase-auth-issues-riMCZV)

---

### 8. Missing Middleware for Session Refresh

**What goes wrong:** Without middleware, user sessions expire and the app behaves erratically - sometimes logged in, sometimes not.

**Why it happens:** Middleware seems optional, app works initially without it.

**Consequences:**
- Sessions expire mid-use
- Protected routes accessible when they shouldn't be
- Inconsistent auth state between pages

**Warning Signs:**
- Random "unauthenticated" errors during active use
- Users complain about being logged out
- Auth works locally but fails in production

**Prevention:**
```typescript
// middleware.ts in project root
import { updateSession } from '@/utils/supabase/middleware'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

**Phase:** Phase 1 (Foundation) - auth setup

---

### 9. Google OAuth Refresh Token One-Time Issue

**What goes wrong:** Google only provides refresh token on FIRST sign-in. Subsequent logins don't get refresh capability.

**Why it happens:** Google OAuth spec - refresh tokens are issued once unless explicitly re-requested.

**Consequences:**
- Users can't stay logged in long-term
- Sessions expire requiring full re-authentication
- Inconsistent behavior between first-time and returning users

**Warning Signs:**
- New users stay logged in, returning users don't
- Token refresh fails for some users

**Prevention:**
1. Configure OAuth to always request refresh: `access_type: 'offline'`, `prompt: 'consent'`
2. Or accept the tradeoff (users re-auth occasionally)
3. Document this behavior for debugging

**Phase:** Phase 1 (Foundation) - OAuth setup

**Sources:**
- [NextAuth Google Provider](https://next-auth.js.org/providers/google)

---

### 10. OAuth Redirect URI Mismatches

**What goes wrong:** Authentication fails in production with "redirect_uri_mismatch" errors.

**Why it happens:** Google OAuth is extremely strict about exact URL matching including protocols, ports, and trailing slashes.

**Consequences:**
- Auth works locally, breaks in production
- Users can't sign in
- Difficult to debug

**Warning Signs:**
- `redirect_uri_mismatch` errors
- Auth works in one environment but not another

**Prevention:**
1. Configure ALL environments in Google Console:
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://yourdomain.com/api/auth/callback/google` (prod)
   - `https://staging.yourdomain.com/api/auth/callback/google` (staging)
2. No trailing slashes (Google is picky)
3. HTTPS required for production

**Phase:** Phase 1 (Foundation) - before first deployment

---

## Database & Performance Pitfalls

### 11. Schema Changes via UI in Production

**What goes wrong:** Developers modify production database schema directly through Supabase Studio UI.

**Why it happens:** Easy during prototyping, becomes habit.

**Consequences:**
- No rollback capability
- Schema drift between environments
- Team members can't replicate changes
- Breaking changes deployed without review

**Warning Signs:**
- No migration files in repository
- "It works on my local" issues
- Schema differs between staging and production

**Prevention:**
1. Use Supabase CLI for all schema changes
2. Write migration files: `supabase migration new <name>`
3. Version control all migrations
4. CI/CD runs migrations, never manual UI changes

**Phase:** Phase 1 (Foundation) - from first table

**Sources:**
- [Supabase Common Mistakes](https://hrekov.com/blog/supabase-common-mistakes)

---

### 12. Overridable Timestamps and IDs

**What goes wrong:** `created_at`, `updated_at`, and even `id` fields can be freely set by clients.

**Why it happens:** Default table setup doesn't prevent client from specifying these values.

**Consequences:**
- Users can backdate applications
- Fake "early" job postings for priority
- ID manipulation for reference attacks
- Audit trails unreliable

**Warning Signs:**
- Timestamps that don't match reality
- UUIDs that look suspiciously non-random

**Prevention:**
```sql
-- Use database defaults and triggers
CREATE TABLE jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Column-level security: prevent client from setting these
-- Or use trigger to override any client-provided values
CREATE OR REPLACE FUNCTION set_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    NEW.created_at = now();
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Phase:** Phase 1 (Foundation) - table design

---

### 13. Realtime Subscriptions Without Filters

**What goes wrong:** Subscribing to entire tables without filters overloads connections and hits rate limits.

**Why it happens:** Simple examples show unfiltered subscriptions. Works fine with small data.

**Consequences:**
- Rate limit errors: `too_many_messages`
- Client disconnections
- Slow or missed updates
- Higher costs ($2.50 per million messages)

**Warning Signs:**
- Realtime errors in console
- Updates seem delayed or missing
- Billing surprises

**Prevention:**
```typescript
// WRONG: Subscribe to all changes
supabase.channel('jobs').on('postgres_changes', {
  event: '*',
  schema: 'public',
  table: 'jobs'
}, callback)

// CORRECT: Filter to relevant data
supabase.channel('my-jobs').on('postgres_changes', {
  event: '*',
  schema: 'public',
  table: 'jobs',
  filter: 'employer_id=eq.${userId}'
}, callback)
```

**Phase:** Phase 2+ (when implementing realtime features)

**Sources:**
- [Supabase Realtime Limits](https://supabase.com/docs/guides/realtime/limits)

---

### 14. Realtime with RLS at Scale

**What goes wrong:** Every realtime change event must be checked against RLS for EACH subscriber. 100 subscribers = 100 database reads per change.

**Why it happens:** Non-obvious Supabase architecture. Realtime security requires per-user checks.

**Consequences:**
- Database bottleneck
- Message delays and timeouts
- Realtime becomes unusable at scale

**Warning Signs:**
- Realtime delays increase with user count
- Timeout errors during high activity
- Database CPU spikes on changes

**Prevention:**
1. Use Broadcast for public updates (no RLS check needed)
2. Create separate "public" tables without RLS for read-heavy realtime
3. Use filters to reduce subscription scope
4. Consider polling for non-critical updates

**Phase:** Phase 3+ (scaling) - but architecture decision in Phase 1

**Sources:**
- [Supabase Realtime Benchmarks](https://supabase.com/docs/guides/realtime/benchmarks)

---

## Next.js App Router Pitfalls

### 15. "use client" Everywhere

**What goes wrong:** Developers add "use client" to every component that doesn't immediately work, losing SSR benefits.

**Why it happens:** Quick fix for hydration errors or hook usage. Path of least resistance.

**Consequences:**
- Larger bundle sizes
- Slower initial page loads
- SEO degradation (less server-rendered content)
- Lost ability to use server-only features

**Warning Signs:**
- Most components have "use client"
- Bundle size growing
- Lighthouse scores dropping

**Prevention:**
1. Understand: Server Components are default in App Router
2. Only add "use client" when you need: useState, useEffect, event handlers, browser APIs
3. Keep client boundaries small - extract interactive parts to separate components
4. Pass Server Components as children to Client Components

**Phase:** All phases - ongoing discipline

**Sources:**
- [Common Next.js App Router Mistakes](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them)

---

### 16. Client-Side Data Fetching When SSR is Better

**What goes wrong:** Using useEffect + fetch in components when data could be fetched server-side.

**Why it happens:** Habit from React SPA development. useEffect is familiar.

**Consequences:**
- Waterfall requests (page loads, then data fetches)
- Loading spinners everywhere
- Poor SEO (content not in initial HTML)
- Extra network round-trips

**Warning Signs:**
- useEffect for data that doesn't change based on user interaction
- Loading states on every page
- Slow perceived performance

**Prevention:**
```typescript
// WRONG: Client-side fetch
'use client'
export default function JobsList() {
  const [jobs, setJobs] = useState([])
  useEffect(() => {
    fetch('/api/jobs').then(r => r.json()).then(setJobs)
  }, [])
  return <div>{jobs.map(...)}</div>
}

// CORRECT: Server Component with direct fetch
export default async function JobsList() {
  const jobs = await getJobs() // Direct database call
  return <div>{jobs.map(...)}</div>
}
```

**Phase:** All phases - fundamental architecture

**Sources:**
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)

---

### 17. Window/Document Access in Client Components During SSR

**What goes wrong:** Client Components are pre-rendered on server, but code tries to access browser APIs.

**Why it happens:** Assumption that "use client" means "client-only". It doesn't - Client Components still SSR.

**Consequences:**
- "window is not defined" errors
- Hydration mismatches
- Broken pages

**Warning Signs:**
- Errors only in production/build
- Works in dev sometimes, fails other times

**Prevention:**
```typescript
'use client'
export default function LocationButton() {
  const [location, setLocation] = useState(null)

  // WRONG: Direct access
  const currentUrl = window.location.href // Fails during SSR

  // CORRECT: Check for browser
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setLocation(window.location.href)
    }
  }, [])
}
```

**Phase:** All phases - when using browser APIs

---

### 18. Forgetting to Revalidate After Mutations

**What goes wrong:** Data changes (job posted, application submitted) but UI shows stale data.

**Why it happens:** Next.js caches aggressively. Mutations don't automatically invalidate cache.

**Consequences:**
- User posts job but doesn't see it in list
- Application submitted but status shows "not applied"
- Users think actions failed

**Warning Signs:**
- Data visible after hard refresh
- Actions seem to not work then suddenly appear

**Prevention:**
```typescript
// After mutation, revalidate:
import { revalidatePath, revalidateTag } from 'next/cache'

async function createJob(data) {
  await supabase.from('jobs').insert(data)
  revalidatePath('/jobs') // Revalidate the jobs list page
  // OR
  revalidateTag('jobs') // Revalidate all fetches tagged 'jobs'
}
```

**Phase:** Phase 2+ (when implementing mutations)

---

## Monorepo Pitfalls

### 19. Standalone Build Path Issues

**What goes wrong:** `output: 'standalone'` generates deeply nested paths instead of expected structure, breaking deployment.

**Why it happens:** Turborepo monorepo structure causes Next.js to replicate full path in standalone output.

**Consequences:**
- Deployment scripts fail
- server.js not where expected
- CI/CD pipelines break

**Warning Signs:**
- Build succeeds but deployment fails
- Path to server.js is `apps/web/.next/standalone/apps/web/server.js` instead of `apps/web/.next/standalone/server.js`

**Prevention:**
```javascript
// next.config.js
module.exports = {
  output: 'standalone',
  outputFileTracingRoot: path.join(__dirname, '../../'), // Point to monorepo root
}
```

**Phase:** Phase 1 (Foundation) - monorepo setup

**Sources:**
- [Turborepo Next.js Guide](https://turborepo.dev/docs/guides/frameworks/nextjs)

---

### 20. "use client" Directive Lost with tsup

**What goes wrong:** Shared UI packages compiled with tsup lose "use client" directives, breaking component usage.

**Why it happens:** tsup's default behavior compiles everything to single file, stripping directives.

**Consequences:**
- Shared components cause hydration errors
- Components work in one app but not another

**Prevention:**
```javascript
// tsup.config.ts for shared packages
export default defineConfig({
  splitting: true, // Generate separate files
  // This preserves "use client" in output
})
```

**Phase:** Phase 1 (Foundation) - shared packages setup

---

### 21. Shared Environment Variables

**What goes wrong:** Single .env file for entire monorepo causes variable conflicts or secrets leaking to wrong apps.

**Why it happens:** Convenience of single source of truth.

**Consequences:**
- Admin secrets exposed to user app
- Different environments need different values
- Build failures from missing variables

**Prevention:**
1. Per-app `.env.local` files
2. Shared variables in root `.env` only if truly shared
3. Never put secrets in root `.env`
4. Use environment-specific files: `.env.development`, `.env.production`

**Phase:** Phase 1 (Foundation) - monorepo setup

---

## Job Board Domain Pitfalls

### 22. Ghost Jobs and Spam

**What goes wrong:** Platform fills with fake job postings, expired listings, or spam.

**Why it happens:** No moderation, no expiration, easy to abuse.

**Consequences:**
- Users lose trust
- SEO damaged by low-quality content
- Legal issues with fraudulent postings

**Warning Signs:**
- Job posts with unrealistic promises
- Same content posted repeatedly
- Jobs with no real company information

**Prevention:**
1. Admin approval workflow (you have this planned)
2. Automatic expiration after 30-60 days
3. Required company verification
4. Report/flag system for users
5. Rate limiting on job posts

**Phase:** Phase 2 (Core features) - admin approval workflow

**Sources:**
- [Job Board Problems and Solutions](https://www.jobboardly.com/blog/8-common-job-board-problems-and-their-solutions)
- [Fake Job Posting Detection](https://qualitydigest.com/inside/lean-article/combating-fake-job-postings-advanced-detection-and-reporting-systems-032425)

---

### 23. Manipulated Metrics Backfiring

**What goes wrong:** Fake view counts or application numbers become obvious or cause technical issues.

**Why it happens:** Social proof is valuable, but artificial inflation has risks.

**Consequences:**
- Users lose trust when metrics don't match reality
- Inconsistent data between views
- Difficulty transitioning to real metrics later

**Warning Signs:**
- Metrics don't correlate with actual activity
- Support tickets about "fake numbers"
- Analytics show different numbers than displayed

**Prevention:**
1. Document clearly what's real vs manipulated
2. Use ranges or "hidden" actual counts for internal use
3. Plan transition path to real metrics as you grow
4. Consider "50+ views" style display instead of exact fake numbers

**Phase:** Phase 2-3 - metrics implementation

---

### 24. Poor Search and Filter UX

**What goes wrong:** Users can't find relevant jobs, leading to frustration and abandonment.

**Why it happens:** Basic keyword search without proper filtering. No relevance ranking.

**Consequences:**
- High bounce rates
- Users complain "no good jobs"
- Employers get unqualified applicants

**Warning Signs:**
- Search returns too many or too few results
- Users re-search multiple times
- Common jobs hard to find

**Prevention:**
1. Essential filters: location, job type, salary range, visa status
2. Full-text search with Korean support
3. Save search preferences
4. Mobile-friendly filter interface

**Phase:** Phase 2 (Core features) - search implementation

**Sources:**
- [How to Create a Job Board](https://dropboardhq.com/blog/how-to-create-job-board-successful-platform/)

---

### 25. Application Tracking Complexity

**What goes wrong:** Simple status field becomes insufficient, causing lost applications or unclear state.

**Why it happens:** Underestimating the workflow complexity of hiring.

**Consequences:**
- Employers lose track of candidates
- Job seekers don't know application status
- No clear hiring pipeline

**Warning Signs:**
- Status transitions that don't make sense
- Multiple sources of truth for application state
- Employers requesting features for tracking

**Prevention:**
1. Design proper state machine: applied -> reviewed -> interviewed -> offered -> hired/rejected
2. Separate table for status history/audit trail
3. Notifications on status changes
4. Clear display for both parties

**Phase:** Phase 2-3 - application system

**Sources:**
- [Database for Job Portal](https://vertabelo.com/blog/designing-a-database-for-an-online-job-portal/)

---

## Localization Pitfalls

### 26. Korean Placeholder Handling

**What goes wrong:** Korean grammar requires different particles based on whether previous word ends in consonant or vowel.

**Why it happens:** Simple string interpolation doesn't handle Korean grammar rules.

**Consequences:**
- Grammatically incorrect UI text
- Awkward, unprofessional appearance
- User confusion

**Warning Signs:**
- Text like "서울에서" vs "부산에서" needing different particles
- Complaints about "bad Korean"

**Prevention:**
1. Use i18n library with Korean particle support
2. Avoid placeholders for nouns when possible
3. Have native Korean speakers review all translated strings

**Phase:** Phase 3+ (localization refinement)

**Sources:**
- [Korean Localization Challenges](https://multilingual.com/articles/korean-introduces-new-challenges-to-localization/)

---

### 27. Text Expansion Breaking Layouts

**What goes wrong:** Korean text takes ~2x the space of English, breaking carefully designed layouts.

**Why it happens:** Designing with English text first, Korean as afterthought.

**Consequences:**
- Truncated text
- Broken layouts
- Overflow issues

**Prevention:**
1. Design with Korean text from the start
2. Use flexible layouts that accommodate longer text
3. Test all UI with longest expected Korean strings

**Phase:** All phases - from initial design

---

## SEO Pitfalls

### 28. Dynamic Routes Not Indexed

**What goes wrong:** Job detail pages (`/jobs/[id]`) get soft 404 errors in Google Search Console.

**Why it happens:** Next.js 15 async params handling, or improper rendering strategy.

**Consequences:**
- Jobs not appearing in search results
- SEO traffic lost
- Discovery suffers

**Warning Signs:**
- Google Search Console shows "Soft 404" for job pages
- Pages drop from search results
- Organic traffic declining

**Prevention:**
1. Use SSR (not client-side rendering) for job pages
2. Implement proper sitemap with all job URLs
3. Add `robots.txt` with `Disallow: /_next/static/chunks/app/`
4. Test with Google's URL Inspection tool

**Phase:** Phase 2+ (after launch, SEO optimization)

**Sources:**
- [Dynamic Route SEO Issues](https://www.academicjobs.com/dyn/failing-dynamic-routes-in-next-js)
- [Next.js Dynamic Route SEO](https://webpeak.org/blog/nextjs-dynamic-route-seo-best-practices/)

---

### 29. Numeric IDs in URLs

**What goes wrong:** URLs like `/jobs/12345` provide no SEO value and are harder to share.

**Why it happens:** Using database ID directly in URL is easiest.

**Consequences:**
- Poor SEO (no keywords in URL)
- URLs not human-readable
- Harder to remember/share

**Prevention:**
1. Generate slugs from job title: `/jobs/frontend-developer-seoul-abc123`
2. Keep ID for uniqueness, add slug for readability
3. Ensure slug updates don't break existing links (redirects)

**Phase:** Phase 1 (Foundation) - URL structure design

---

## Storage Pitfalls

### 30. File Uploads Through Serverless Functions

**What goes wrong:** Resume/document uploads fail for files larger than 5MB due to Vercel payload limits.

**Why it happens:** Serverless platforms limit request body size. Files routed through server hit this limit.

**Consequences:**
- Large file uploads fail
- Users can't upload resumes
- Workarounds create security issues

**Warning Signs:**
- 413 Payload Too Large errors
- Uploads fail only for larger files

**Prevention:**
1. Use Supabase signed upload URLs
2. Upload directly from client to Supabase Storage
3. Generate signed URL on server, upload from client
4. Set appropriate file size limits in UI before upload

**Phase:** Phase 2 (Core features) - file upload implementation

**Sources:**
- [Signed URL File Uploads with NextJs and Supabase](https://medium.com/@olliedoesdev/signed-url-file-uploads-with-nextjs-and-supabase-74ba91b65fe0)

---

### 31. Public Storage Buckets for Private Files

**What goes wrong:** Resumes and personal documents accessible to anyone with the URL.

**Why it happens:** Public buckets are easier to set up and use.

**Consequences:**
- Privacy violation
- Legal issues (especially with Korean personal data laws)
- Leaked personal information

**Prevention:**
1. Private buckets for all user-uploaded documents
2. Signed URLs with short expiration for downloads
3. RLS policies on `storage.objects` table
4. Never expose direct storage URLs for private files

**Phase:** Phase 2 (Core features) - storage setup

---

## Phase-Specific Warning Summary

| Phase | Critical Pitfalls to Address |
|-------|------------------------------|
| Phase 1 (Foundation) | RLS on all tables, WITH CHECK clauses, proper auth setup, migration workflow, monorepo config, URL structure |
| Phase 2 (Core) | Admin approval workflow, search UX, file upload security, application tracking design |
| Phase 3 (Growth) | RLS performance optimization, realtime scaling, SEO fixes, localization refinement |
| Phase 4+ (Scale) | Realtime architecture changes, metrics transition, spam prevention maturity |

---

## Sources Summary

### Official Documentation
- [Supabase RLS Documentation](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase Realtime Limits](https://supabase.com/docs/guides/realtime/limits)
- [Supabase Next.js Quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Custom Claims RBAC](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- [Next.js Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components)
- [Turborepo Next.js Guide](https://turborepo.dev/docs/guides/frameworks/nextjs)

### Community & Industry Resources
- [Supabase Common Mistakes](https://hrekov.com/blog/supabase-common-mistakes)
- [Supabase Best Practices](https://www.leanware.co/insights/supabase-best-practices)
- [Common Next.js App Router Mistakes](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them)
- [Supabase Security Flaw: 170+ Apps Exposed](https://byteiota.com/supabase-security-flaw-170-apps-exposed-by-missing-rls/)
- [Supabase RLS Issues](https://prosperasoft.com/blog/database/supabase/supabase-rls-issues/)
- [Job Board Problems and Solutions](https://www.jobboardly.com/blog/8-common-job-board-problems-and-their-solutions)
- [How to Create a Job Board](https://dropboardhq.com/blog/how-to-create-job-board-successful-platform/)
- [Korean Localization Challenges](https://multilingual.com/articles/korean-introduces-new-challenges-to-localization/)
