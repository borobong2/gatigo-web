# Issue #1 Task Queue

## Control state

- issue: #1
- active: T5
- phase: verify
- next: run final checks and inspect the local screen
- terminal: false

## State transitions

`pending → active → red → implement → verify → done`

- A failed check transitions to `diagnose`, not to the next task.
- `done` requires the listed verification output and a commit SHA.
- Only one task may be `active` or `diagnose`.
- The first non-`done` task becomes active immediately after a successful commit.
- `blocked` is allowed only for missing authority, unavailable source data, or a license conflict; it must name the exact unblock action.

## Tasks

| ID                                | Status | Completion evidence                                        |
| --------------------------------- | ------ | ---------------------------------------------------------- |
| T1 static network data            | done   | `ad1a07b`, source document, positive-edge test             |
| T2 minimax engine                 | done   | `d98d759`, `c4934fb`, N-origin tests                       |
| T3 static API                     | done   | `f7e73bf`, external-route mocks removed                    |
| T4 meeting UI                     | done   | `5353880`, `4284de5`, static results and multi-origin form |
| T5 removal and final verification | active | No Kakao source/key, full checks, browser evidence         |
