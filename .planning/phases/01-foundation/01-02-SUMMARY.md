---
phase: 01-foundation
plan: 02
subsystem: infra
tags: [turborepo, pnpm, nextjs, monorepo, workspace]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: Project structure, research, and planning framework
provides:
  - Turborepo monorepo with pnpm workspaces
  - apps/web Next.js 15 app on port 3000
  - apps/admin Next.js 15 app on port 3001
  - Shared TypeScript configuration package
  - @repo/supabase package structure (placeholder)
  - @repo/lib with 16 nationality constants
affects: [01-03-database-setup, all future phases requiring shared code]

# Tech tracking
tech-stack:
  added: [turbo@2.4.0, next@15.1.0, react@19.0.0, pnpm@9.15.0, typescript@5.7.0, @supabase/ssr@0.5.0, @supabase/supabase-js@2.47.0]
  patterns: [monorepo workspace structure, shared TypeScript configs, standalone Next.js builds]

key-files:
  created:
    - package.json
    - pnpm-workspace.yaml
    - turbo.json
    - packages/typescript-config/base.json
    - packages/typescript-config/nextjs.json
    - apps/web/package.json
    - apps/web/app/layout.tsx
    - apps/web/app/page.tsx
    - apps/admin/package.json
    - apps/admin/app/layout.tsx
    - apps/admin/app/page.tsx
    - packages/supabase/package.json
    - packages/lib/src/constants/nationalities.ts
  modified:
    - .gitignore
    - apps/web/tsconfig.json
    - apps/admin/tsconfig.json

key-decisions:
  - "Use pnpm workspace protocol (workspace:*) for internal package dependencies"
  - "Configure standalone builds with outputFileTracingRoot for monorepo support"
  - "Set Turborepo dev task with cache:false and persistent:true"
  - "16 nationality codes defined based on Korea's foreign worker demographics"

patterns-established:
  - "Monorepo structure: apps/* for Next.js applications, packages/* for shared code"
  - "Each app has independent ports (web:3000, admin:3001)"
  - "Shared packages export via dist/ with TypeScript compilation"
  - "Workspace dependencies enable code sharing across apps"

# Metrics
duration: 4min
completed: 2026-01-17
---

# Phase 01 Plan 02: Monorepo Setup Summary

**Turborepo monorepo with pnpm workspaces, dual Next.js 15 apps (web:3000, admin:3001), and shared packages for Supabase and nationality constants**

## Performance

- **Duration:** 4 min 13 sec
- **Started:** 2026-01-17T22:19:11Z
- **Completed:** 2026-01-17T22:23:24Z
- **Tasks:** 3
- **Files modified:** 33

## Accomplishments
- Fully functional Turborepo monorepo with efficient build caching
- Two Next.js 15 applications running concurrently on separate ports
- Shared package structure enabling code reuse across apps
- TypeScript configuration shared via @repo/typescript-config
- 16 nationality constants defined for job filtering

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize monorepo structure with root configuration** - `71e3920` (chore)
2. **Task 2: Create apps/web and apps/admin Next.js applications** - `b23de1e` (feat)
3. **Task 3: Create shared packages and verify monorepo works** - `cf11f43` (feat)

## Files Created/Modified

### Root Configuration
- `package.json` - Root package with Turborepo scripts (dev, build, lint, type-check)
- `pnpm-workspace.yaml` - Workspace definition for apps/* and packages/*
- `turbo.json` - Task configuration with caching and dependency management
- `.npmrc` - Peer dependency handling configuration
- `.gitignore` - Monorepo-specific ignores (node_modules, .next, .turbo, dist)

### Shared Packages
- `packages/typescript-config/base.json` - Base TypeScript config with strict mode
- `packages/typescript-config/nextjs.json` - Next.js-specific TypeScript config
- `packages/supabase/package.json` - Supabase client package structure with exports
- `packages/supabase/src/types.ts` - Placeholder Database type for future type generation
- `packages/lib/package.json` - Shared library package with constants exports
- `packages/lib/src/constants/nationalities.ts` - 16 nationality codes (ID, VN, PH, TH, MN, etc.)

### Web App (port 3000)
- `apps/web/package.json` - Next.js 15 app with workspace dependencies
- `apps/web/next.config.ts` - Standalone build with transpilePackages for monorepo
- `apps/web/tsconfig.json` - TypeScript config extending @repo/typescript-config
- `apps/web/app/layout.tsx` - Root layout with Korean language and metadata
- `apps/web/app/page.tsx` - Homepage displaying "외국인 구인구직"

### Admin App (port 3001)
- `apps/admin/package.json` - Next.js 15 app with workspace dependencies
- `apps/admin/next.config.ts` - Standalone build with transpilePackages for monorepo
- `apps/admin/tsconfig.json` - TypeScript config extending @repo/typescript-config
- `apps/admin/app/layout.tsx` - Root layout with Korean language and metadata
- `apps/admin/app/page.tsx` - Homepage displaying "관리자 패널"

## Decisions Made

1. **pnpm workspace protocol**: Use "workspace:*" for internal dependencies instead of file: protocol - enables proper version resolution and better IDE support

2. **Standalone builds with outputFileTracingRoot**: Configure Next.js standalone output with monorepo root tracing - required for Docker deployment and correct dependency bundling

3. **Turborepo dev task configuration**: Set cache:false and persistent:true for dev task - dev servers should never cache and must stay running

4. **Nationality constants**: Defined 16 codes based on Korean foreign worker demographics - covers major source countries (Indonesia, Vietnam, Philippines, Thailand, Mongolia, Central Asia, South Asia, China, Japan) plus "ANY" for nationality-agnostic positions

5. **Next.js 15 with React 19**: Use latest stable versions - benefit from improved performance and new features

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed pnpm globally**
- **Found during:** Task 1 verification (pnpm install)
- **Issue:** pnpm command not found, blocking monorepo setup
- **Fix:** Ran `npm install -g pnpm@9.15.0` to install pnpm globally
- **Files modified:** None (global installation)
- **Verification:** `pnpm install` succeeded after installation
- **Committed in:** Not committed (environment setup)

**2. [Rule 2 - Missing Critical] Added resolveJsonModule to tsconfig.json**
- **Found during:** Task 3 verification (first Next.js build)
- **Issue:** Next.js requires resolveJsonModule for proper JSON import handling
- **Fix:** Next.js automatically added resolveJsonModule:true to both apps' tsconfig.json
- **Files modified:** apps/web/tsconfig.json, apps/admin/tsconfig.json
- **Verification:** Build succeeded after automatic configuration
- **Committed in:** cf11f43 (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both auto-fixes necessary for monorepo functionality. pnpm installation is environment setup (not code change). resolveJsonModule is Next.js requirement for correct JSON handling. No scope creep.

## Issues Encountered

None - plan executed smoothly. Turborepo caching verified working on second build (packages/lib and packages/supabase showed cache hits).

## User Setup Required

None - no external service configuration required. Environment variables (.env.local) will be needed when Supabase clients are implemented in Plan 01-03.

## Next Phase Readiness

**Ready for database setup:**
- Monorepo structure complete and verified working
- @repo/supabase package structure ready for client implementation
- Both apps can import shared packages
- Concurrent development possible on ports 3000 and 3001

**Blockers:** None

**Next steps:**
- Plan 01-03 will implement Supabase clients in @repo/supabase
- Type generation script already configured (db:gen-types)
- Environment variable examples already created

---
*Phase: 01-foundation*
*Completed: 2026-01-17*
