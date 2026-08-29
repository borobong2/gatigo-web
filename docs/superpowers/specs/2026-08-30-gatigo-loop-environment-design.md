# GatiGo Web Loop Engineering Environment Design

## Status

- issue: https://github.com/borobong2/gatigo-web/issues/7
- branch: `feat/issue-7`
- state: approved
- date: 2026-08-30

## Goal

현재 정적 만남역 추천 데모를 실제 사용자 행동으로 검증하고, 행동 Gate를 통과한
기능만 #2, #3, #4로 순차 승격하는 실행 환경을 만든다.

## Current Evidence

- Issue #1 정적 수도권 전철망 추천은 main에 병합됐다.
- 테스트 35개, lint, typecheck, production build는 통과한다.
- `format:check`는 `docs/loop/INBOX.md`, `pnpm-lock.yaml` 때문에 실패한다.
- `https://gatigo-web.vercel.app`은 `DEPLOYMENT_NOT_FOUND`를 반환한다.
- GitHub Actions와 GitHub Deployment 기록이 없다.
- 기존 Orca Run은 web과 mobile task가 섞여 있고 #2 storage decision에서 blocked다.

## Product Loop

```text
Loop 0
green CI → 공개 가능한 현재 데모 → 후보 선택 → 공유 의도

Gate 0
추천 결과를 본 사람이 실제로 후보를 선택하고 공유하려 하는가

Loop 1
#2 방 생성·링크 → #3 게스트 출발역 응답

Gate 1
공유 링크가 실제 참여자 응답을 만드는가

Loop 2
#4 장소 확정·지도 handoff

Gate 2
합의 결과가 실제 길찾기로 이어지는가
```

## Why Not Start #2 Yet

현재는 공개 서비스와 행동 데이터가 없다. 이 상태에서 Supabase 방 저장부터 만들면
사용자가 추천 결과를 선택하거나 공유하고 싶은지 확인하지 않은 채 백엔드 범위를
확장한다. Loop 0의 로컬 선택과 정직한 공유 fake door가 더 싼 검증이다.

## Execution Sources

- Product truth: `docs/loop/PRODUCT.md`
- Roadmap: `docs/loop/ROADMAP.md` and GitHub Roadmap #12
- Machine state: `docs/loop/tasks.json`
- State summary: `docs/loop/STATE.md`
- Execution rules: `docs/loop/WORKFLOW.md`
- Runtime runbook: `docs/runbooks/gatigo-loop-execution.md`
- Runtime DAG: a new gatigo-web-only Orca Run

GitHub Issues define scope. `tasks.json` mirrors dependency readiness for local checks. Orca
is the supervised execution state. Status changes must be updated together by the coordinator;
ordinary workers only change their assigned issue files.

## Coordinator Contract

The coordinator repeats:

```text
ready tasks
→ dispatch independent tasks
→ wait for worker_done / escalation / question
→ verify and integrate
→ update GitHub and local state
→ dispatch newly ready tasks
```

Progress reports, commits, successful checks, and completed waves are not stop signals.

Stop only for:

- Gate #9, #10, or #11 waiting for real behavior data
- deployment or another external mutation requiring approval
- missing credentials, license, or source data
- three consecutive attempts without meaningful improvement
- unrecoverable conflict or security blocker
- direct user stop

## Issue DAG

```text
#7 loop environment
→ #8 activation/share-intent experiment
→ #9 Gate 0
→ #2 persistent room link
→ #3 guest response
→ #10 Gate 1
→ #4 confirm place and map handoff
→ #11 Gate 2
```

Mobile tasks are not imported from the historical mixed Run. Gate 2 must pass before any
native notification or deep-link loop is planned.

## CI

GitHub Actions runs on pull requests and pushes to main:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

Use Node 22 and pnpm 10.24.0 from `package.json`.

## Local State Contract

`tasks.json` contains:

- `roadmapIssue`
- `terminal`
- tasks with `id`, `issue`, `kind`, `status`, `deps`, and optional `evidence`

Allowed statuses are `pending`, `active`, `diagnose`, `verify`, `done`, and `blocked`.
The status script derives `ready` tasks from completed dependencies. A gate stays pending
until the coordinator records a real resolution.

## Gate Thresholds

### Gate 0

Minimum 30 non-team `suggestions_generated` events.

- candidate selection rate: at least 40%
- share intent among selected candidates: at least 25%

### Gate 1

Minimum 20 non-team created rooms.

- room share/copy rate: at least 50%
- participant response per shared room: at least 40%
- rooms with at least two responses: at least 30%

### Gate 2

Minimum 20 rooms with at least two participant responses.

- host confirmation rate: at least 40%
- map handoff per confirmed room: at least 40%

Each failed gate permits one change to the directly preceding interaction, then one
remeasurement. A second miss stops later-loop expansion.

## Non-goals

- production deployment in Issue #7
- product analytics implementation in Issue #7
- Supabase project creation in Issue #7
- real-time transport APIs
- restaurant recommendations, reservations, chat, payment, or automatic location
- gatigo-mobile work before Gate 2

## Acceptance Criteria

- The repository is format-clean and all five checks pass locally.
- CI runs the same five checks.
- `node scripts/loop-status.mjs` reports #8 as the only ready task after #7 completes.
- Docs and the local skill describe the cross-issue coordinator continuation loop.
- GitHub issues #2, #3, and #4 are blocked by explicit gates.
- A fresh gatigo-web-only Orca Run mirrors the issue dependencies and gates.
- The execution runbook contains preflight, start, resume, sync, and stop rules.
