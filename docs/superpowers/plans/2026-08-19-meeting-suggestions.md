# Meeting Suggestions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let two people choose Seoul subway stations and compare three fair meeting stations using Kakao public-transit travel times.

**Architecture:** The public home route remains thin and renders one client screen. A static station catalog supplies validated IDs, display names, coordinates, and a small subway graph that prefilters three candidates; a server-only Kakao client then fetches both people’s actual travel times in parallel and ranks those candidates. The Route Handler is the only browser/server boundary and returns minimal card data including Kakao’s map landing URL.

**Tech Stack:** Next.js App Router, React, TypeScript, Vitest, native `fetch`, Kakao Maps REST API.

**Spec:** `docs/issues/1-station-ranking.md`

## Global Constraints

- Start from `main@5da95ab`; do not modify the held `borobong2/web-1-station-ranking` worktree.
- Keep `app/` for routes only; keep screen-private UI under `screens/home/_*`.
- Read `KAKAO_REST_API_KEY` only in server modules; never prefix it with `NEXT_PUBLIC_`.
- No database, authentication, share links, map SDK, or third-party client dependency.
- Use semantic CSS tokens only; do not add arbitrary Tailwind colors.
- Verify API behavior with mocked `fetch`; perform one live request only after a key is supplied.

---

## File Structure

- `src/lib/subway/stations.ts` — station IDs, names, WGS84 coordinates, and the small static graph used to prefilter candidate IDs.
- `src/lib/subway/ranking.ts` — deterministic prefilter and actual-duration final sort.
- `src/lib/kakao/public-traffic.ts` — server-only Kakao request and response parsing.
- `src/app/api/meeting-suggestions/route.ts` — validates two station IDs and composes ranking with Kakao travel data.
- `src/screens/home/index.tsx` — server route target that renders the meeting form screen.
- `src/screens/home/_components/meeting-form.tsx` — client form, request state, and result cards.
- `src/screens/home/_constants/stations.ts` — serializable station options for the form.

### Task 1: Define a coordinate-backed station catalog and candidate ranking

**Files:**

- Create: `src/lib/subway/stations.ts`, `src/lib/subway/stations.test.ts`, `src/lib/subway/ranking.ts`, `src/lib/subway/ranking.test.ts`

**Interfaces:**

- Produces: `Station = { id: string; name: string; longitude: number; latitude: number }`
- Produces: `getStation(id: string): Station | undefined`
- Produces: `prefilterMeetingStations(originIds: readonly [string, string]): Station[]`
- Produces: `rankActualCandidates(candidates: readonly CandidateWithDurations[]): CandidateWithDurations[]`

- [ ] **Step 1: Write failing catalog and ranking tests**

```ts
expect(getStation('gangnam')).toMatchObject({ name: '강남역' });
expect(prefilterMeetingStations(['gangnam', 'hongik-university'])).toHaveLength(
  3,
);
expect(
  rankActualCandidates([
    { maxSeconds: 1200, totalSeconds: 2400 },
    { maxSeconds: 1100, totalSeconds: 2500 },
  ])[0].maxSeconds,
).toBe(1100);
```

- [ ] **Step 2: Run the focused tests and confirm they fail because the modules do not exist**

Run: `npm test -- src/lib/subway/stations.test.ts src/lib/subway/ranking.test.ts`

- [ ] **Step 3: Implement the minimal catalog and ranking functions**

```ts
export const getStation = (id: string) =>
  STATIONS.find((station) => station.id === id);

export const rankActualCandidates = <
  T extends { maxSeconds: number; totalSeconds: number; station: Station },
>(
  candidates: readonly T[],
) =>
  [...candidates].sort(
    (a, b) =>
      a.maxSeconds - b.maxSeconds ||
      a.totalSeconds - b.totalSeconds ||
      a.station.id.localeCompare(b.station.id),
  );
```

The graph only exists to select three candidate station IDs. It must reject unknown origins and use IDs rather than display names.

- [ ] **Step 4: Run focused tests and then the full suite**

Run: `npm test -- src/lib/subway/stations.test.ts src/lib/subway/ranking.test.ts && npm test`

- [ ] **Step 5: Commit**

```bash
git add src/lib/subway
git commit -m "feat: add station catalog and candidate ranking"
```

### Task 2: Add the server-only Kakao public-transit client

**Files:**

- Create: `src/lib/kakao/public-traffic.ts`, `src/lib/kakao/public-traffic.test.ts`
- Modify: `.env.example`

**Interfaces:**

- Consumes: `Station`
- Produces: `getPublicTransitRoute(from: Station, to: Station): Promise<{ durationSeconds: number; landingUrl: string }>`

- [ ] **Step 1: Write failing mocked-fetch tests**

```ts
vi.stubGlobal(
  'fetch',
  vi.fn().mockResolvedValue(
    new Response(
      JSON.stringify({
        status: 'OK',
        properties: { landingURL: 'https://map.kakao.com/' },
        routes: [{ properties: { totalTime: 1234 } }],
      }),
    ),
  ),
);

await expect(getPublicTransitRoute(gangnam, hongikUniversity)).resolves.toEqual(
  { durationSeconds: 1234, landingUrl: 'https://map.kakao.com/' },
);
```

Also test a missing key, a non-OK HTTP response, and Kakao `NO_RESULTS` response.

- [ ] **Step 2: Run the focused test and confirm it fails because the client does not exist**

Run: `npm test -- src/lib/kakao/public-traffic.test.ts`

- [ ] **Step 3: Implement one small fetch wrapper**

```ts
const response = await fetch(`${PUBLIC_TRAFFIC_URL}?${params}`, {
  headers: { Authorization: `KakaoAK ${process.env.KAKAO_REST_API_KEY}` },
});
```

Use `cache: 'no-store'`, choose the shortest returned route’s `totalTime`, and throw stable errors that the route handler can expose safely. Add `KAKAO_REST_API_KEY=` to `.env.example` without a value.

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- src/lib/kakao/public-traffic.test.ts && npm test`

- [ ] **Step 5: Commit**

```bash
git add src/lib/kakao .env.example
git commit -m "feat: add Kakao public transit client"
```

### Task 3: Expose `POST /api/meeting-suggestions`

**Files:**

- Create: `src/app/api/meeting-suggestions/route.ts`, `src/app/api/meeting-suggestions/route.test.ts`

**Interfaces:**

- Consumes: JSON `{ originIds: [string, string] }`
- Produces: JSON `{ candidates: Array<{ station: Station; durations: [number, number]; maxSeconds: number; totalSeconds: number; landingUrl: string }> }`

- [ ] **Step 1: Write failing route tests**

```ts
const response = await POST(
  new Request('http://localhost/api/meeting-suggestions', {
    method: 'POST',
    body: JSON.stringify({ originIds: ['gangnam', 'hongik-university'] }),
  }),
);
expect(response.status).toBe(200);
expect((await response.json()).candidates).toHaveLength(3);
```

Mock the Kakao module; separately assert a malformed body and unknown ID return `400`, and an upstream failure returns `502`.

- [ ] **Step 2: Run the focused test and confirm it fails because the route does not exist**

Run: `npm test -- src/app/api/meeting-suggestions/route.test.ts`

- [ ] **Step 3: Implement validation, concurrent route calls, and final sorting**

```ts
const routes = await Promise.all(
  candidates.flatMap((candidate) =>
    originStations.map((origin) => getPublicTransitRoute(origin, candidate)),
  ),
);
```

Validate exactly two distinct known IDs before the API call. Convert Kakao seconds into final max/total ordering and include one candidate map URL. Do not return the API key or raw Kakao payload.

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- src/app/api/meeting-suggestions/route.test.ts && npm test`

- [ ] **Step 5: Commit**

```bash
git add src/app/api/meeting-suggestions src/lib/subway
git commit -m "feat: add meeting suggestions API"
```

### Task 4: Replace the template home with the visible meeting flow

**Files:**

- Create: `src/screens/home/_components/meeting-form.tsx`, `src/screens/home/_constants/stations.ts`
- Modify: `src/screens/home/index.tsx`
- Test: `src/screens/home/_components/meeting-form.test.tsx` if the existing Vitest configuration supports DOM rendering; otherwise test the extracted request serializer in `src/screens/home/_constants/stations.test.ts`.

**Interfaces:**

- Consumes: station options `{ id: string; name: string }[]`
- Consumes: `POST /api/meeting-suggestions`
- Produces: two accessible selects, submit state, candidate cards, and external Kakao navigation links.

- [ ] **Step 1: Write the smallest failing client-flow test supported by the current runner**

```ts
expect(toOriginIds({ first: 'gangnam', second: 'hongik-university' })).toEqual([
  'gangnam',
  'hongik-university',
]);
expect(() => toOriginIds({ first: 'gangnam', second: 'gangnam' })).toThrow(
  '서로 다른 출발역',
);
```

- [ ] **Step 2: Run the focused test and confirm it fails because the helper/component does not exist**

Run: `npm test -- src/screens/home/_constants/stations.test.ts`

- [ ] **Step 3: Implement the smallest accessible form**

Use native `<select>` elements and the installed `Button` component. On submit call the route with `fetch`, show a disabled loading button, render the three response cards with each person’s minutes, and use `<a target="_blank" rel="noreferrer">` for Kakao’s landing URL. Display Korean messages for duplicate selections, server `400`, and upstream `502` errors.

- [ ] **Step 4: Run focused and full tests**

Run: `npm test -- src/screens/home/_constants/stations.test.ts && npm test`

- [ ] **Step 5: Commit**

```bash
git add src/screens/home
git commit -m "feat: add meeting station comparison screen"
```

### Task 5: Verify the full slice and document the key handoff

**Files:**

- Modify: `README.md`

- [x] **Step 1: Document local key setup and the exact live smoke request**

```bash
KAKAO_REST_API_KEY=... npm run dev
curl -X POST http://localhost:3000/api/meeting-suggestions \
  -H 'content-type: application/json' \
  --data '{"originIds":["gangnam","hongik-university"]}'
```

- [ ] **Step 2: Run all repository checks**

Run: `npm test && npm run lint && npm run typecheck && npm run format:check && npm run build`

- [ ] **Step 3: With a supplied key, run the live smoke request and inspect three candidates, durations, and URLs**

Expected: HTTP 200 and three candidates with finite `durations`, `maxSeconds`, `totalSeconds`, and Kakao `landingUrl` values.

- [x] **Step 4: Commit the documentation**

```bash
git add README.md docs/superpowers/plans/2026-08-19-meeting-suggestions.md
git commit -m "docs: add meeting suggestions setup"
```
