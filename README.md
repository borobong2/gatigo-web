# GatiGo Web

GatiGo helps a group choose a fair meeting place by public-transit travel time.
This Next.js app is the shareable, no-install participant experience embedded in
the native GatiGo shell.

## Local setup

```bash
pnpm install
pnpm dev
```

## Meeting suggestions local smoke test

The meeting-suggestions API calls Kakao public-transit routing. Create a Kakao
REST API key, keep it local, and start the app with it available only to the
server:

```bash
KAKAO_REST_API_KEY=... pnpm dev
```

In a second terminal, run the live smoke request:

```bash
curl -X POST http://localhost:3000/api/meeting-suggestions \
  -H 'content-type: application/json' \
  --data '{"originIds":["gangnam","hongik-university"]}'
```

Expect HTTP 200 with three `candidates`. Each candidate should have finite
`durations`, `maxSeconds`, and `totalSeconds`, plus a Kakao `landingUrl`.
Never commit the key or expose it with a `NEXT_PUBLIC_` prefix.

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
