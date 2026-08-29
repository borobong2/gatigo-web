# GatiGo Web Loop Queue

## Control state

- roadmap: GitHub #12
- active: none
- ready: A0 / GitHub #15 travel-time accuracy investigation
- terminal: false

Machine-readable state lives in `docs/loop/tasks.json`.

## Queue

| ID  | Issue | Kind           | Status  | Depends on |
| --- | ----: | -------------- | ------- | ---------- |
| H1  |    #1 | history        | done    | -          |
| E0  |    #7 | environment    | done    | H1         |
| L0  |    #8 | implementation | done    | E0         |
| A0  |   #15 | investigation  | pending | L0         |
| G0  |    #9 | gate           | pending | A0         |
| L1A |    #2 | implementation | pending | G0         |
| L1B |    #3 | implementation | pending | L1A        |
| G1  |   #10 | gate           | pending | L1B        |
| L2  |    #4 | implementation | pending | G1         |
| G2  |   #11 | gate           | pending | L2         |

G0 requires #15 to resolve the meaning and acceptable accuracy of displayed
travel time, plus approved production deployment, analytics, and real non-team
traffic. Do not resolve it or start L1A without that evidence.

## State transitions

```text
pending → active → verify → done
                 ↘ diagnose ↗
pending → blocked
```

- `diagnose` handles ordinary test and implementation failures.
- `blocked` is only for missing authority, credentials, source data, or license.
- A gate becomes `done` only after real behavior evidence and a recorded resolution.
- The coordinator activates every dependency-free implementation task and continues until a gate.
