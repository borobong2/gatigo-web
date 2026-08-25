# GatiGo Web

GatiGo helps a group choose a fair meeting place by public-transit travel time.
This Next.js app is the shareable, no-install participant experience embedded in
the native GatiGo shell.

## Local setup

```bash
pnpm install
pnpm dev
```

## Meeting suggestions

Meeting recommendations use the bundled static capital-area rail network.
They make no runtime external API calls and require no API key.

## Repository

- [gatigo-mobile](https://github.com/borobong2/gatigo-mobile): React Native
  shell for host notifications, deep links, and map handoff.

No backend or authentication is configured yet. Add them only after the first
share-link flow needs persisted rooms and responses.

## Checks

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```
