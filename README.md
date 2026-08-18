# GatiGo Web

GatiGo helps a group choose a fair meeting place by public-transit travel time.
This Next.js app is the shareable, no-install participant experience embedded in
the native GatiGo shell.

## Local setup

```bash
npm install
npm run dev
```

## Repository

- [gatigo-mobile](https://github.com/borobong2/gatigo-mobile): React Native
  shell for host notifications, deep links, and map handoff.

No backend or authentication is configured yet. Add them only after the first
share-link flow needs persisted rooms and responses.

## Checks

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
```
