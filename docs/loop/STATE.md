# GatiGo Web Loop State

## Current

- roadmap: GitHub #12
- branch: `feat/issue-15`
- completed: GitHub #8 merged in PR #14 and deployed with GA4; GitHub #15 investigation completed locally
- ready: none; the bounded static-calibration follow-up draft in #15 needs approval and an issue
- first decision gate: GitHub #9, blocked until the approved correction is implemented
- deployment: `https://gatigo.justrunlab.com` is verified on Vercel
- baseline: 12-route accuracy MAE 8.5 minutes; 42 tests, lint, typecheck, format, and build pass
- accuracy decision: prefer credential-free track/transfer static calibration; holdout MAE must be at most 5 minutes
- locked: GitHub #2 remains blocked until #9 is resolved from real behavior data

## History

- Issue #1 completed in PR #6 at main `c69cb92`.
- Issue #8 merged in PR #14 at main `85c5c18`; production and GA4 were verified.
- Human feedback GATIGO-WEB-002 routed to GitHub #15 before Gate 0.
- Issue #15 reproduced `신대방삼거리 → 당산` as 13 static minutes versus a
  22:10 timetable journey (23 minutes rounded), benchmarked 12 routes, and drafted one
  bounded static-calibration follow-up in `docs/issues/15-travel-time-accuracy.md`.
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
