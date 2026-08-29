# GatiGo Web Loop Environment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make gatigo-web green in CI and install a cross-issue Loop Engineering coordinator environment.

**Architecture:** Keep GitHub Issues as scope, a small JSON DAG as locally checkable state, and a fresh Orca Run as supervised runtime state. Do not implement product behavior in this issue.

**Tech Stack:** Node 22, pnpm 10.24.0, GitHub Actions, JavaScript ESM, Markdown, Orca orchestration.

**Spec:** `docs/superpowers/specs/2026-08-30-gatigo-loop-environment-design.md`

## Global Constraints

- Work only on `feat/issue-7`.
- Preserve Issue #1 implementation and evidence.
- Do not implement #8, #2, #3, or #4.
- Do not deploy or configure external analytics/Supabase accounts.
- Run test, lint, typecheck, format check, and build before completion.

---

### Task 1: Green Baseline and CI

**Files:**

- Create: `.github/workflows/ci.yml`
- Modify: `docs/loop/INBOX.md`
- Modify: `pnpm-lock.yaml`

- [ ] Run `pnpm format:check` and retain the two failing file names as red evidence.
- [ ] Run `pnpm exec prettier --write docs/loop/INBOX.md pnpm-lock.yaml`.
- [ ] Add CI using Node 22, `pnpm/action-setup@v4`, `actions/setup-node@v4`, pnpm cache, frozen install, and the five checks.
- [ ] Run all five checks locally.
- [ ] Commit as `ci: enforce the product quality gate`.

### Task 2: Cross-issue State Machine

**Files:**

- Create: `scripts/loop-state.mjs`
- Create: `scripts/loop-state.test.mjs`
- Modify: `scripts/loop-status.mjs`
- Modify: `docs/loop/tasks.json`
- Modify: `docs/loop/TASKS.md`
- Modify: `docs/loop/STATE.md`
- Create: `docs/loop/ROADMAP.md`

- [ ] Write failing tests for dependency-derived ready tasks, invalid statuses, missing dependencies, and terminal state.
- [ ] Implement `deriveLoopStatus(state)` in `scripts/loop-state.mjs`.
- [ ] Make `loop-status.mjs` print `{ terminal, active, ready, blocked }`.
- [ ] Replace Issue #1-only active state with the #7→#8→#9→#2→#3→#10→#4→#11 DAG; retain Issue #1 as completed history.
- [ ] Run `pnpm test` and `node scripts/loop-status.mjs`.
- [ ] Commit as `chore: add cross-issue loop state`.

### Task 3: Coordinator Workflow and Runbook

**Files:**

- Modify: `.ai/skills/loop-engineering/SKILL.md`
- Modify: `docs/loop/WORKFLOW.md`
- Create: `docs/runbooks/gatigo-loop-execution.md`
- Modify: `README.md`
- Add: design and plan documents from this issue

- [ ] Document the coordinator continuation contract and decision-gate stop rules.
- [ ] Add preflight, start, resume, and sync prompts that read Roadmap #12 and the fresh Orca Run.
- [ ] Link the runbook from README.
- [ ] Run `pnpm format:check`.
- [ ] Commit as `docs: define the GatiGo coordinator loop`.

### Task 4: Runtime DAG and Final Verification

**External state:**

- Create one gatigo-web-only Orca Run.
- Create tasks for #8, #9, #2, #3, #10, #4, and #11 with matching dependencies.
- Create coordinator gates for #9, #10, and #11.
- Do not dispatch workers.

- [ ] Record the Run and gate IDs in `docs/loop/STATE.md` and the runbook.
- [ ] Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm format:check`, and `pnpm build`.
- [ ] Run `node scripts/loop-status.mjs`; expected ready issue is #8 only.
- [ ] Review `git diff --check` and the final issue diff.
- [ ] Commit runtime references as `docs: record the gatigo web loop run`.
- [ ] Comment verification evidence on #7 and close it only after all checks pass.
