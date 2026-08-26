# Issue #1 Task Queue

## Control state

- issue: #1
- active: T5
- phase: verify
- next: commit verified implementation and record its SHA
- terminal: false

## State transitions

`pending → active → red → implement → verify → done`

- A failed check transitions to `diagnose`, not to the next task.
- `done` requires the listed verification output and a commit SHA.
- Only one task may be `active` or `diagnose`.
- The first non-`done` task becomes active immediately after a successful commit.
- `blocked` is allowed only for missing authority, unavailable source data, or a license conflict; it must name the exact unblock action.

## Tasks

| ID                                | Status | Completion evidence                                      |
| --------------------------------- | ------ | -------------------------------------------------------- |
| T1 static network data            | done   | generator, source document, coverage test                |
| T2 minimax engine                 | done   | N-origin, tie-break, and transfer tests                  |
| T3 static API                     | done   | local graph, duplicate and request-limit tests           |
| T4 meeting UI                     | done   | serialized N-origin input, add/remove, localized results |
| T5 removal and final verification | verify | dead code removed; commit SHA pending                    |
