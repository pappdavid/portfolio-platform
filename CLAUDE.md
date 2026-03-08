# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Summary

Portfolio platform forked from `Kiranism/next-shadcn-dashboard-starter`. Built with Next.js 16 (App Router), React 19, TypeScript 5.7 (strict), Tailwind CSS v4, shadcn/ui, and Clerk auth. Features MCP Sentinel, Custom Training, RAG + 3D Chat pages backed by Supabase, Upstash rate limiting, and Thesys C1.

## Commands

```bash
npm run dev          # Dev server at http://localhost:3000
npm run build        # Production build (uses Turbopack)
npm run start        # Serve production build
npm run lint         # ESLint
npm run lint:fix     # ESLint fix + Prettier format
npm run lint:strict  # Zero-warning ESLint
npm run format       # Prettier
```

No test framework is configured yet.

## Architecture

### Route Structure

```
src/app/
├── (marketing)/page.tsx          # Landing page (public, maps to /)
├── (products)/                   # Public product showcase pages
│   ├── mcp/page.tsx              # MCP Sentinel page
│   ├── training/page.tsx         # Custom Training page
│   ├── chat/page.tsx             # RAG + 3D Chat page
│   └── projects/page.tsx         # Projects portfolio
├── dashboard/                    # Protected by Clerk (see proxy.ts)
│   ├── layout.tsx                # Sidebar shell + KBar + InfoSidebar
│   ├── overview/                 # Parallel routes: @area_stats, @bar_stats, @pie_stats, @sales
│   ├── mcp/page.tsx              # MCP keys & event logs
│   ├── training/page.tsx         # Datasets & training jobs
│   └── referrals/page.tsx        # Referral link tracking
├── auth/                         # Clerk sign-in/sign-up (catch-all routes)
├── api/                          # API routes (mcp/, chat/, training/, ref/)
├── r/                            # Referral redirect handler
├── about/, privacy-policy/, terms-of-service/
└── layout.tsx                    # Root: ThemeProvider → NuqsAdapter → ClerkProvider
```

### Key Architectural Patterns

**Auth (Clerk):** `src/proxy.ts` is the Next.js 16 middleware (NOT `middleware.ts`). It protects `/dashboard(.*)` routes via `clerkMiddleware`. Clerk wraps the app in `src/components/layout/providers.tsx`.

**Supabase:** Browser client at `src/lib/supabase/client.ts`, server client at `src/lib/supabase/server.ts` (uses service role key). Migration SQL in `supabase/migrations/001_initial.sql`. Tables: `ref_links`, `ref_events`, `mcp_api_keys`, `mcp_events`, `datasets`, `training_jobs` — all have RLS enabled.

**Rate Limiting:** `src/lib/rate-limit.ts` exports factories using `@upstash/ratelimit` sliding windows: `chatRateLimit` (10/hr), `chatAuthRateLimit` (50/hr), `mcpRateLimit` (100/min), `trainingRateLimit` (5/hr).

**Navigation:** Two exports in `src/config/nav-config.ts`: `publicNavItems` (marketing header) and `navItems` (dashboard sidebar). Icons registered in `src/components/icons.tsx` using `@tabler/icons-react`. RBAC filtering via `useFilteredNavItems()` hook in `src/hooks/use-nav.ts`.

**Feature modules** go in `src/features/{name}/components/`. Shared UI in `src/components/ui/`. Layout components in `src/components/layout/`.

### Theme System

Six themes in `src/styles/themes/` (vercel default, claude, supabase, neobrutualism, mono, notebook). Applied via `data-theme` attribute on `<html>`. CSS variables use OKLCH color format. Theme persisted in `active_theme` cookie. Config at `src/components/themes/theme.config.ts`, fonts at `font.config.ts`.

## Code Conventions

- **Formatting:** Single quotes, JSX single quotes, no trailing commas, 2-space indent, LF line endings (Prettier + `prettier-plugin-tailwindcss`)
- **Imports:** Use `@/*` alias for `src/`, `~/*` for `public/`
- **Components:** Server components by default; add `'use client'` only when needed. Use `cn()` from `@/lib/utils` for className merging
- **shadcn/ui:** Don't modify `src/components/ui/` files directly — extend or wrap them
- **Icons:** Add new icons to `src/components/icons.tsx` mapping, then reference by key in nav config
- **Aceternity UI:** Installed via shadcn registry (`@aceternity/` prefix in `components.json`). Available: spotlight, background-beams, hover-border-gradient, text-generate-effect, bento-grid

## Environment Variables

Required: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

Optional: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `THESYS_API_KEY`, `OPENAI_API_KEY`, `MCP_HMAC_SECRET`

See `.env.example` for full list.
