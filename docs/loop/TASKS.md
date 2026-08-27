# Issue #1 Task Queue

## Control state

- issue: #1
- active: none
- phase: done
- next: none
- terminal: true

## State transitions

`pending → active → red → implement → verify → done`

- A failed check transitions to `diagnose`, not to the next task.
- `done` requires the listed verification output and a commit SHA.
- Only one task may be `active` or `diagnose`.
- The first non-`done` task becomes active immediately after a successful commit.
- `blocked` is allowed only for missing authority, unavailable source data, or a license conflict; it must name the exact unblock action.

## Tasks

| ID                                | Status | Completion evidence                                                 |
| --------------------------------- | ------ | ------------------------------------------------------------------- |
| T1 static network data            | done   | `d3a56a9`, generator, source document, coverage test                |
| T2 minimax engine                 | done   | `d3a56a9`, N-origin, tie-break, and transfer tests                  |
| T3 static API                     | done   | `d3a56a9`, local graph, duplicate and request-limit tests           |
| T4 meeting UI                     | done   | `d3a56a9`, serialized N-origin input, add/remove, localized results |
| T5 removal and final verification | done   | `d3a56a9`, dead code removed, full checks and HTTP smoke            |
