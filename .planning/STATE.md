# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-01-17)

**Core value:** 한국어 가능한 외국인이 자신의 국적에 맞는 채용 공고를 쉽게 찾고, 댓글로 질문할 수 있어야 한다.
**Current focus:** Phase 1 - Foundation

## Current Position

Phase: 1 of 6 (Foundation)
Plan: 2 of 3 in current phase
Status: In progress
Last activity: 2026-01-17 — Completed 01-01-PLAN.md

Progress: [███░░░░░░░] 33%

## Performance Metrics

**Velocity:**
- Total plans completed: 2
- Average duration: 4min
- Total execution time: 0.13 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-foundation | 2 | 8min | 4min |

**Recent Trend:**
- Last 5 plans: 01-02 (4min), 01-01 (4min)
- Trend: Consistent 4min execution time

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

### Pending Todos

None yet.

### Blockers/Concerns

None yet.

## Session Continuity

Last session: 2026-01-17T22:31:18Z
Stopped at: Completed 01-01-PLAN.md (Database Schema and RLS Setup)
Resume file: None
