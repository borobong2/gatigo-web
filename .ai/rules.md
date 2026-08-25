# GatiGo Hard Rules

- Use `app/` only for routes and metadata; render page UI from `screens/`.
- Keep screen-private files under `screens/<name>/_*`; share components only
  after two screens need them.
- Use semantic CSS tokens; do not add arbitrary Tailwind colors.
- Keep secrets server-only. Never commit `.env.local` or expose service-role
  keys to browser code.
- Before a completion claim, run `pnpm test`, `pnpm lint`, `pnpm typecheck`,
  and `pnpm build`.
- An issue branch contains its implementation, tests, documentation, and
  verification record. Do not create documentation-only implementation PRs.
