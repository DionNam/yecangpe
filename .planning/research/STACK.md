# Stack Research: Job Board Platform

**Project:** 외국인 구인/구직 플랫폼 (Job board for Korean-speaking foreigners)
**Researched:** 2026-01-17
**Stack Decision:** Next.js + Supabase + Tailwind + shadcn/ui (pre-decided)

## Recommended Stack

### Core Framework

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Next.js | 15.5.x (or 16.1.3 if stable) | Full-stack React framework | App Router is the standard for 2025. Server Components, Server Actions, and Turbopack provide excellent DX and performance. Vercel deployment is seamless. | HIGH |
| React | 19.x | UI library | Next.js 15+ uses React 19. Required for `useActionState` and new hooks. | HIGH |
| TypeScript | 5.x | Type safety | Non-negotiable for any production project. Next.js has first-class TS support with typed routes in 15.5+. | HIGH |

**Note on Next.js version:** Next.js 16 was released October 2025 with Cache Components and improved PPR. However, 15.5.x is more battle-tested. Start with 15.5.x unless you need 16-specific features.

### Database & Backend

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Supabase | Latest | BaaS (Database, Auth, Storage) | Postgres under the hood, excellent DX, built-in auth with Google OAuth, real-time capabilities, Row Level Security for authorization. Perfect for MVPs and scales well. | HIGH |
| @supabase/supabase-js | ^2.x | Client library | Official Supabase JavaScript client. | HIGH |
| @supabase/ssr | ^0.5.x | Server-side auth | **Use this, NOT @supabase/auth-helpers-nextjs** (deprecated). Handles cookies for App Router properly. | HIGH |

### Styling

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Tailwind CSS | 4.1.x | Utility-first CSS | v4.0 released Jan 2025 with 5x faster builds and 100x faster incremental builds. CSS-first config, automatic content detection. | HIGH |
| shadcn/ui | Latest | UI component library | Not a package - copy-paste components you own. Built on Radix UI primitives, fully accessible, customizable. Works with Tailwind v4. | HIGH |
| tailwind-merge | ^3.x | Class merging utility | Intelligently merges Tailwind classes without conflicts. Essential for component composition. | HIGH |
| clsx | ^2.x | Conditional classes | Lightweight utility for conditional class names. Often used with tailwind-merge via `cn()` helper. | HIGH |

### Authentication

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Supabase Auth | (built-in) | Authentication | Google OAuth built-in, email/password, magic links. Integrates with RLS for authorization. No need for separate auth library. | HIGH |

**Setup pattern:**
```typescript
// utils/supabase/server.ts - Server client
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// utils/supabase/client.ts - Browser client
import { createBrowserClient } from '@supabase/ssr'

// middleware.ts - Session refresh
// Required for App Router to refresh auth tokens
```

### Forms & Validation

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| react-hook-form | 7.71.x | Form state management | De facto standard. Uncontrolled inputs = performance. Works with Server Actions. | HIGH |
| @hookform/resolvers | ^5.x | Schema integration | Connects react-hook-form to Zod schemas. | HIGH |
| zod | 4.3.x | Schema validation | Type-safe schemas for both client and server validation. Share schemas between form and Server Actions. | HIGH |

**Pattern:**
```typescript
// schemas/job-post.ts - Shared schema
export const jobPostSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(50),
  // ...
})

export type JobPostInput = z.infer<typeof jobPostSchema>

// Use in both client form (via zodResolver) and Server Action (via .parse())
```

### Data Fetching & State Management

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @tanstack/react-query | 5.90.x | Server state management | Caching, background refetching, optimistic updates, devtools. Essential for client-side data fetching. | HIGH |
| @supabase-cache-helpers/postgrest-react-query | 1.13.x | Supabase + React Query | Auto-generates query keys from Supabase queries. Automatic cache invalidation on mutations. | MEDIUM |
| zustand | 5.0.x | Client state management | For global UI state (modals, sidebars, user preferences). Simple API, no boilerplate. | HIGH |
| nuqs | 2.5.x | URL state management | Type-safe URL query params. Perfect for filters, pagination, search. Shareable URLs. | HIGH |

**When to use what:**
- **Server Components**: Direct Supabase queries (no React Query needed)
- **Client Components**: React Query for async data
- **UI state** (modals, theme): Zustand
- **URL state** (filters, pagination): nuqs

### UI Components & Utilities

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| lucide-react | ^0.469.x | Icons | Default icon library for shadcn/ui. Tree-shakable, consistent style. | HIGH |
| sonner | ^1.7.x | Toast notifications | Modern toast library. Replaces deprecated shadcn toast component. | HIGH |
| date-fns | ^4.x | Date manipulation | Functional, tree-shakable, supports Korean locale. | HIGH |
| next-intl | ^4.x | Internationalization | Best i18n for App Router. Korean/English support. Type-safe message keys. | MEDIUM |

### Tables & Data Display

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @tanstack/react-table | 8.x | Headless table | For admin dashboard tables. Sorting, filtering, pagination. Headless = style with Tailwind. | HIGH |

**Note:** For simple job listings, you likely don't need TanStack Table. Use it for the admin panel where you need sorting, filtering, and pagination controls.

### File Upload

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| Supabase Storage | (built-in) | File storage | Already part of Supabase. Use signed URLs for large files to bypass Next.js 1MB body limit. | HIGH |

**Pattern for large files:**
1. Get signed upload URL from Server Action
2. Upload directly from client to Supabase Storage
3. Store URL reference in database

### Testing

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| vitest | ^3.x | Unit testing | Faster than Jest, native ESM, great with React Testing Library. | HIGH |
| @testing-library/react | ^16.x | Component testing | Standard for React component testing. Test behavior, not implementation. | HIGH |
| playwright | ^1.49.x | E2E testing | Cross-browser E2E tests. Best for testing async Server Components. Microsoft-maintained, active development. | HIGH |

### Development Tools

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| eslint | 9.x | Linting | `next lint` uses ESLint. Consider flat config migration. | HIGH |
| prettier | ^3.x | Formatting | Consistent code style. Use prettier-plugin-tailwindcss for class sorting. | HIGH |
| prettier-plugin-tailwindcss | ^0.6.x | Tailwind class sorting | Automatic class order. Reduces PR noise. | HIGH |

## Installation Commands

```bash
# Create project (if starting fresh)
npx create-next-app@latest --typescript --tailwind --eslint --app --src-dir

# Core packages
npm install @supabase/supabase-js @supabase/ssr

# Forms & Validation
npm install react-hook-form @hookform/resolvers zod

# Data fetching & State
npm install @tanstack/react-query zustand nuqs
npm install @supabase-cache-helpers/postgrest-react-query

# UI utilities
npm install lucide-react sonner date-fns clsx tailwind-merge

# Internationalization (if needed)
npm install next-intl

# Tables (for admin dashboard)
npm install @tanstack/react-table

# Dev dependencies
npm install -D vitest @testing-library/react @testing-library/dom jsdom
npm install -D @vitejs/plugin-react vite-tsconfig-paths
npm install -D playwright @playwright/test
npm install -D prettier prettier-plugin-tailwindcss

# shadcn/ui initialization
npx shadcn@latest init
```

## Not Recommended

### Avoid These Packages

| Package | Why Avoid | Use Instead |
|---------|-----------|-------------|
| `@supabase/auth-helpers-nextjs` | **Deprecated.** No longer maintained. Security risk. | `@supabase/ssr` |
| `next-i18next` | Not compatible with App Router. | `next-intl` |
| `moment.js` | Deprecated, large bundle size, mutable API. | `date-fns` |
| `redux` / `@reduxjs/toolkit` | Overkill for this project. Unnecessary boilerplate. React Query + Zustand covers all needs. | `@tanstack/react-query` (server state) + `zustand` (client state) |
| `axios` | Native `fetch` works well. Supabase client handles API calls. | Supabase client or native `fetch` |
| `react-icons` | Bundle contains all icons. Inconsistent styles across sets. | `lucide-react` |
| `formik` | Older API, larger bundle. react-hook-form is the modern standard. | `react-hook-form` |
| `yup` | Works but Zod has better TypeScript inference and is more popular in 2025. | `zod` |
| `swr` | Good but TanStack Query has more features (mutations, devtools, better caching). | `@tanstack/react-query` |

### Avoid These Patterns

| Pattern | Why Avoid | Do Instead |
|---------|-----------|------------|
| `getServerSideProps` / `getStaticProps` | Pages Router patterns. App Router uses different patterns. | Server Components, `generateStaticParams`, Server Actions |
| `useEffect` for data fetching | Race conditions, no caching, no loading states. | React Query `useQuery` or Server Components |
| Client-side auth checks only | Security vulnerability. Can be bypassed. | Server-side auth with `getUser()` + RLS policies |
| Storing auth state in Redux/Zustand | Out of sync with actual session. | Use Supabase auth hooks or server-side `getUser()` |
| Environment variables without `NEXT_PUBLIC_` prefix in client | Will be undefined in browser. | Use `NEXT_PUBLIC_` for client-accessible vars, keep secrets server-only |

## Confidence Assessment

| Category | Confidence | Rationale |
|----------|------------|-----------|
| Core stack (Next.js, Supabase, Tailwind) | HIGH | Verified from official sources, widely adopted, pre-decided by project |
| Forms (react-hook-form + zod) | HIGH | Industry standard combination, excellent shadcn integration |
| Data fetching (TanStack Query) | HIGH | De facto standard for React server state management |
| State management (Zustand) | HIGH | Simple, lightweight, recommended for non-Redux projects |
| URL state (nuqs) | HIGH | Next.js Conf 2025 featured, used by Vercel/Supabase/Sentry |
| Supabase Cache Helpers | MEDIUM | Useful but adds abstraction layer. Can use raw React Query if preferred. |
| Internationalization (next-intl) | MEDIUM | Best option for App Router, but assess if i18n is needed for MVP |
| Testing (Vitest + Playwright) | HIGH | Official Next.js docs recommend this combination |

## Sources

### Official Documentation
- [Next.js 15.5 Release](https://nextjs.org/blog/next-15-5)
- [Tailwind CSS v4.0](https://tailwindcss.com/blog/tailwindcss-v4)
- [shadcn/ui Changelog](https://ui.shadcn.com/docs/changelog)
- [Supabase SSR Documentation](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

### Package Registries (Version Verification)
- [Next.js Releases](https://github.com/vercel/next.js/releases) - v16.1.3 latest
- [Tailwind CSS Releases](https://github.com/tailwindlabs/tailwindcss/releases) - v4.1.18 latest
- [TanStack Query Releases](https://github.com/tanstack/query/releases) - v5.90.18 latest
- [react-hook-form Releases](https://github.com/react-hook-form/react-hook-form/releases) - v7.71.1 latest
- [Zod Releases](https://github.com/colinhacks/zod/releases) - v4.3.5 latest
- [Zustand Releases](https://github.com/pmndrs/zustand/releases) - v5.0.10 latest

### Community & Best Practices
- [State Management in 2025](https://dev.to/hijazi313/state-management-in-2025-when-to-use-context-redux-zustand-or-jotai-2d2k)
- [nuqs at Next.js Conf 2025](https://nextjs.org/conf/session/type-safe-url-state-in-nextjs-with-nuqs)
- [Next.js Testing Guide](https://nextjs.org/docs/app/guides/testing/vitest)
- [Supabase Cache Helpers Documentation](https://supabase-cache-helpers.vercel.app/)
