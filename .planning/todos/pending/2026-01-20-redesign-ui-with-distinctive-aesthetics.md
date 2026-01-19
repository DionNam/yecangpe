---
created: 2026-01-20T21:30
title: Redesign UI with distinctive aesthetics for admin and web apps
area: ui
files:
  - apps/web/app/page.tsx
  - apps/admin/app/(dashboard)/*
  - apps/web/app/jobs/*
---

## Problem

Current UI across both admin and web applications is generic and lacks visual appeal:
- Landing page doesn't look like a proper landing page
- Both admin and web UIs feel bland and generic
- Missing images and visual elements
- Overall aesthetic is uninspiring and looks like typical "AI slop"

The landing page at apps/web/app/page.tsx should be compelling and memorable, but currently lacks the visual impact needed to attract users.

## Solution

Apply frontend-design skill to create distinctive, production-grade interfaces:

**Design Direction to Consider:**
- Choose a bold aesthetic direction (e.g., modern editorial, industrial-refined, organic-natural, etc.)
- Use distinctive typography (avoid Inter, Roboto, Arial)
- Implement cohesive color palette with CSS variables
- Add meaningful animations and micro-interactions
- Incorporate images and visual depth (gradients, textures, shadows)
- Create asymmetric/unexpected layouts where appropriate

**Scope:**
1. Redesign landing page (apps/web/app/page.tsx) with hero section, benefits, and compelling visuals
2. Enhance web app UI (job listings, detail pages, profile pages)
3. Modernize admin panel aesthetic (dashboard, tables, forms)

**Technical Constraints:**
- Next.js 15 App Router
- TailwindCSS v4
- Maintain existing functionality
- Keep responsive design
- Preserve accessibility

**Key Principle:** Each interface should have a clear conceptual direction executed with precision - avoid generic patterns, create memorable experiences.
