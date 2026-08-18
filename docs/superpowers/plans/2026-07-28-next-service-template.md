# Next Service Template Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a small, deployable Next.js service template with a dark shadcn theme and optional Supabase authentication.

**Architecture:** App Router routes are thin and delegate to `screens/`. Supabase SSR clients and `proxy.ts` own session refresh and protected-route redirects. shadcn components consume semantic CSS tokens, so a product rebrands by changing tokens rather than component classes.

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, Supabase SSR, Vitest, ESLint, Prettier.

## Global Constraints

- Target Vercel and independent `*.justrundev.com` deployments.
- Keep `app/` routing-only and page-specific code under `screens/*/_*`.
- Use Supabase only through publishable browser variables; RLS is required for user data.
- Do not include payments, teams, RBAC, analytics, i18n, Orval, Storybook, or custom API clients.
- Use Obsidian Indigo semantic dark tokens; no arbitrary component color values.

---

### Task 1: Bootstrap and document the template

**Files:**

- Create: Next.js project files, `AGENTS.md`, `.env.example`, `docs/template-foundation.md`
- Modify: `package.json`, `src/styles/globals.css`

- [x] Create the Next.js project in the existing repository with TypeScript, Tailwind, ESLint, App Router, and `src/`.
- [x] Initialize shadcn-compatible CSS variables and install Button, Input, Label, and Sonner.
- [x] Add scripts for `test`, `typecheck`, `lint`, and `format:check`.
- [x] Add the provenance, usage, and security document.

### Task 2: Implement route policy with a test-first flow

**Files:**

- Create: `src/lib/auth/route-policy.test.ts`, `src/lib/auth/route-policy.ts`

**Interfaces:**

- Produces: `isProtectedRoute(pathname: string): boolean`

- [x] Write a failing Vitest test showing `/dashboard` is protected and `/`, `/login`, and `/auth/callback` are public.
- [x] Run the test and confirm it fails because `isProtectedRoute` does not exist.
- [x] Implement the smallest pathname check that passes the test.
- [x] Run the test again and confirm it passes.

### Task 3: Add Supabase SSR authentication boundary

**Files:**

- Create: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/proxy.ts`, `src/app/auth/callback/route.ts`, `src/proxy.ts`
- Modify: `.env.example`

- [x] Install `@supabase/ssr` and `@supabase/supabase-js`.
- [x] Add browser/server clients that read only public Supabase variables.
- [x] Add a proxy that refreshes sessions and redirects unauthenticated protected requests to `/login?next=...`.
- [x] Add an OAuth callback route that exchanges the code, validates a relative next path, and redirects.

### Task 4: Build thin routes and reusable UI shell

**Files:**

- Create: `src/app/(public)/page.tsx`, `src/app/(public)/login/page.tsx`, `src/app/(protected)/dashboard/page.tsx`, `src/screens/home/index.tsx`, `src/screens/auth/login/index.tsx`, `src/screens/dashboard/index.tsx`, `src/config/site.ts`, `src/providers/index.tsx`, root error/loading/not-found files
- Modify: `src/app/layout.tsx`, `src/styles/globals.css`

- [x] Add Obsidian Indigo semantic CSS tokens and a minimal dark UI shell.
- [x] Add a landing screen explaining the template modules.
- [x] Add a login screen with email and Google OAuth entry points and usable configuration errors.
- [x] Add a server-rendered dashboard that reads the Supabase user and displays the authenticated state.
- [x] Add metadata from `site.config`, Sonner, and root error states.

### Task 5: Verify, document, and commit

**Files:**

- Modify: `README.md`, `docs/template-foundation.md`, plan checklist

- [x] Add setup, Supabase dashboard, OAuth redirect, RLS, and Vercel deployment instructions.
- [x] Run `npm run test`, `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm run build`.
- [x] Commit all generated source, documentation, configuration, and lockfile with one focused conventional commit.
