# Template Foundation

## Purpose

This repository is the starting point for small, independent JustRunDev web services.
It optimizes for a service shipping quickly on Vercel, with Supabase available when
authentication or persisted user data is needed.

## Chosen Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase SSR for database and email/social OAuth authentication
- Vercel deployment
- Vitest, ESLint, Prettier, and TypeScript checks

## Structure

This is the `sokind-web` structure in a deliberately smaller form.

```text
src/
  app/          # routing and route-level metadata only
  screens/      # page UI and page-specific _components, _hooks, _constants
  components/   # UI shared by two or more screens; ui/ is shadcn source
  hooks/
  constants/
  lib/          # Supabase clients and small utilities
  providers/    # client-side global providers
  styles/
  types/
```

Use `app/` as a thin route layer. A route imports one screen from `screens/`.
Keep screen-only code beside that screen under underscore-prefixed folders. Do
not add an abstraction until two services actually need it.

## Theme

The default is **Obsidian Indigo**, a dark neutral theme. Product identity comes
from semantic tokens, not hard-coded component colors. Change `--primary` and
its foreground token for a new product; keep the neutral and semantic tokens
unless a product has a real brand requirement.

## Included Modules

- Public home page and authenticated dashboard example
- Email/password and OAuth entry points through Supabase
- Auth callback and protected-route session refresh
- `next-intl` locale routing with Korean at `/` and English at `/en`
- shadcn/ui primitives, including accessible toggle groups, and toast provider
- Root loading, not-found, and error states
- Site metadata driven by one config object, with canonical, Open Graph, and Twitter defaults

## Add Only When Needed

- Payments: the first paid customer or a concrete price page
- Analytics or error monitoring: after a deployed service has users
- TanStack Query: client-side polling, infinite lists, or non-Supabase APIs
- Generated API clients: a maintained OpenAPI backend exists

## Sources and What We Took

| Source                                                                             | Used                                                                                                             | Not copied                                                                               |
| ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `creatived-digital-lab/sokind-web`                                                 | Thin routes, `screens/` boundary, common-vs-local file rules, provider and error boundaries, quality conventions | Corporate SSO, custom token refresh, product UI/tokens, generated API client, app bridge |
| [Supabase Next.js Starter](https://examples.vercel.com/templates/next.js/supabase) | SSR client/server/browser split, cookie session refresh, auth callback pattern                                   | Its page design and product copy                                                         |
| [shadcn/ui](https://ui.shadcn.com/)                                                | Source-owned components, CSS variable tokens, component CLI                                                      | A private component registry; add one only after repeated shared blocks exist            |
| [Next.js SaaS Starter](https://github.com/nextjs/saas-starter)                     | Reference for protected routes and dashboard separation                                                          | Stripe, teams, RBAC, custom auth, activity log                                           |
| [Better Auth Next.js example](https://better-auth.com/docs/examples/next-js)       | Reference only for a future non-Supabase auth decision                                                           | Dependency and implementation; it overlaps with Supabase Auth                            |
| [Ixartz SaaS Boilerplate](https://github.com/ixartz/SaaS-Boilerplate)              | Reference for documented customization and quality checks                                                        | Multi-tenancy, roles, billing, testing stack                                             |
| [Realtime Colors](https://www.realtimecolors.com/)                                 | Palette preview workflow                                                                                         | Runtime dependency                                                                       |
| [Radix Colors](https://www.radix-ui.com/colors/docs/overview/usage)                | Dark theme uses semantic neutral/accent scales                                                                   | Runtime dependency                                                                       |
| [next-intl](https://next-intl.dev/)                                                | `ko/en` locale routing, message loading, locale-aware navigation, localized metadata                             | A translation-management system or more than two launch locales                          |

## Security Baseline

- Browser code uses only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
- Never expose a Supabase service-role key to the browser or commit `.env.local`.
- Enable RLS for every user-data table and write policies before deploying it.
- OAuth redirect URLs must include the deployed subdomain and local development URL.
