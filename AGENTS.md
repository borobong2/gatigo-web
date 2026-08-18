# Template Guide

Read `docs/template-foundation.md` before changing the starter.

- Use `app/` for routes and metadata only; render UI from `screens/`.
- Put a page's private files under its `screens/<name>/_*` folders.
- Use `components/` only after two screens need the same UI.
- Use semantic CSS tokens. Do not add arbitrary Tailwind colors to components.
- Keep Supabase service-role keys server-only. Enable RLS before adding user data.
- Run `npm test && npm run lint && npm run typecheck && npm run build` before committing.
