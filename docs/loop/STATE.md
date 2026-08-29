# GatiGo Web Loop State

## Current

- roadmap: GitHub #12
- branch: `feat/issue-15`
- completed: GitHub #8 merged in PR #14 and deployed with GA4
- ready: GitHub #15 travel-time accuracy investigation
- first decision gate: GitHub #9
- deployment: `https://gatigo.justrunlab.com` is verified on Vercel
- baseline: 42 tests pass; full issue checks remain pending
- accuracy blocker: static `신대방삼거리 → 당산` is 13 minutes versus a 23-minute reference journey
- locked: GitHub #2 remains blocked until #9 is resolved from real behavior data

## History

- Issue #1 completed in PR #6 at main `c69cb92`.
- Issue #8 merged in PR #14 at main `85c5c18`; production and GA4 were verified.
- Human feedback GATIGO-WEB-002 routed to GitHub #15 before Gate 0.
- Static network implementation evidence is retained in `docs/issues/1-station-ranking.md`
  and `docs/loop/STATIC-NETWORK.md`.
- Historical Orca Run `run_7240ae5216eb` mixed web and mobile work; do not resume it for
  the new web-only loop.

## Sources of truth

- scope: GitHub Issues
- dependency mirror: `docs/loop/tasks.json`
- supervised runtime: the gatigo-web-only Orca Run recorded below after creation
- execution procedure: `docs/runbooks/gatigo-loop-execution.md`

## Runtime

- orca_run: `run_4fbe8ce89af1`
- gate_0: `gate_3d445b6f5476`
- gate_1: `gate_9573d1010ce0`
- gate_2: `gate_016472214b96`
