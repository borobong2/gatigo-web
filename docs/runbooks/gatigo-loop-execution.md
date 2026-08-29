# GatiGo Web Loop Execution Runbook

## Read Order

1. `AGENTS.md`
2. `.ai/rules.md`
3. `.ai/common/workflows/operating-model.md`
4. `docs/loop/PRODUCT.md`
5. `docs/loop/ROADMAP.md`
6. `docs/loop/STATE.md`
7. target GitHub Issue
8. target issue plan under `docs/issues` or `docs/superpowers/plans`

## Runtime

- GitHub Roadmap: https://github.com/borobong2/gatigo-web/issues/12
- Orca Run: `run_4fbe8ce89af1`
- Gate 0: `gate_3d445b6f5476`
- Gate 1: `gate_9573d1010ce0`
- Gate 2: `gate_016472214b96`
- historical mixed Run: `run_7240ae5216eb` — read-only history; do not resume

## Preflight

```bash
git status --short
git branch --show-current
node scripts/loop-status.mjs
gh issue view 12
orca orchestration task-list --run run_4fbe8ce89af1 --ready --brief --json
pnpm test
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

If the worktree is dirty, do not reset, stash, checkout, delete, or commit unknown changes.
Report overlap with the ready issue and request a baseline decision.

## Issue Branches

Use exactly one branch and PR per implementation issue.

```text
feat/issue-8
feat/issue-2
feat/issue-3
feat/issue-4
```

Gate issues do not create implementation branches. Gate resolutions are comments and Orca gate
resolutions backed by observed metrics.

## Coordinator Continuation Contract

```text
ready tasks
→ dispatch every independent implementation task
→ wait for worker_done / escalation / question
→ verify and integrate
→ update GitHub, local state, and Orca
→ dispatch newly ready tasks
```

Do not stop after a commit, verification success, worker completion, or wave completion.

Stop only at #9, #10, #11, new external authority, three consecutive no-improvement attempts,
an unrecoverable conflict/security blocker, or direct user stop.

## Gate Rules

- Gate 0 pass unlocks #2.
- Gate 1 pass unlocks #4.
- Gate 2 pass permits native-loop planning.
- First miss allows one preceding-interaction revision and remeasurement.
- Second miss stops later-loop expansion.
- Never resolve a gate from team traffic, opinions, or synthetic events.

## Verification

Every implementation issue:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

UI work also needs browser evidence for 360px mobile, keyboard use, happy path, and failure path.

## Start Prompt

```text
autoflow make --team --loop gatigo-web의 현재 Loop를 실행해줘.

먼저 AGENTS.md, .ai/rules.md, docs/runbooks/gatigo-loop-execution.md,
docs/loop/ROADMAP.md, docs/loop/STATE.md와 GitHub Roadmap #12를 읽어.

Orca Run run_4fbe8ce89af1에서 ready인 구현 task만 issue별 분리 worktree로 dispatch해.
각 issue branch는 feat/issue-<number> 규칙과 target issue acceptance를 따라야 해.
worker_done을 받으면 검증·통합·Issue 갱신 후 새 ready task를 즉시 dispatch해.

커밋, 성공 보고, worker 또는 wave 완료 뒤 멈추지 마. Coordinator Continuation Contract를
유지하고 #9, #10, #11 행동 gate 또는 진짜 blocker에서만 멈춰.
배포와 외부 credential 설정은 별도 승인 없이 하지 마.
```

## Resume Prompt

```text
autoflow make --team --loop gatigo-web Loop를 이어서 실행해줘.

docs/runbooks/gatigo-loop-execution.md와 Orca Run run_4fbe8ce89af1을 읽고,
GitHub Roadmap #12의 열린 issue와 Orca ready task를 대조해. 완료된 일을 반복하지 말고
현재 ready 구현 task만 dispatch해. 행동 gate를 자동 통과시키지 마.
```

## Sync Prompt

```text
autoflow sync --multi --loop gatigo-web의 현재 구현 Issue를 통합 검증해줘.

target Issue acceptance와 docs/loop/WORKFLOW.md를 기준으로 diff를 리뷰하고,
pnpm test, lint, typecheck, format:check, build와 browser QA를 수행해.
새 기능을 추가하지 말고 root-cause 수정만 허용해. 결과를 target Issue와 Roadmap #12에 기록해.
배포는 별도 승인 전까지 하지 마.
```
