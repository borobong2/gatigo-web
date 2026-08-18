# Next Service Template Design

## Goal

Build a reusable dark Next.js starter for JustRunDev subdomain services, using the
familiar `app` and `screens` separation from `sokind-web` without its enterprise
or product-specific complexity.

## Architecture

Routes remain thin and render screens under `app/[locale]`. Korean is served at
`/` and English at `/en`; Supabase owns sessions and OAuth. A single proxy applies
next-intl routing, refreshes the session, and redirects unauthenticated visitors
from protected paths. UI components use shadcn source files and semantic CSS tokens.

## Scope

- Scaffold Next.js, Tailwind, shadcn/ui, Supabase SSR, and test tooling.
- Add public/authenticated route examples and an Auth callback.
- Add theme tokens, metadata config, errors, not-found, loading, toast provider,
  environment example, and usage documentation.
- Include `next-intl` with `ko/en` messages, locale-aware navigation, and localized metadata.
- Exclude billing, teams, RBAC, analytics, Sentry, Orval, Storybook, and custom API clients.

## Acceptance Criteria

- `npm run test`, `npm run lint`, `npm run typecheck`, and `npm run build` pass.
- With Supabase environment variables configured, an unauthenticated request to
  `/dashboard` redirects to `/login` and preserves the next path.
- The public landing page renders without Supabase environment variables.
- All visual colors come from semantic theme tokens, with Obsidian Indigo as the
  default dark palette.
- `docs/template-foundation.md` records sources, decisions, and security baseline.
