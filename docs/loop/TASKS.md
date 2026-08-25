# Issue #1 Task Queue

## Control state

- issue: #1
- active: T1
- phase: diagnose
- next: replace the provisional XLSX parser with a canonical station mapping
- terminal: false

## State transitions

`pending → active → red → implement → verify → done`

- A failed check transitions to `diagnose`, not to the next task.
- `done` requires the listed verification output and a commit SHA.
- Only one task may be `active` or `diagnose`.
- The first non-`done` task becomes active immediately after a successful commit.
- `blocked` is allowed only for missing authority, unavailable source data, or a license conflict; it must name the exact unblock action.

## Tasks

| ID                                | Status   | Completion evidence                                                             |
| --------------------------------- | -------- | ------------------------------------------------------------------------------- |
| T1 static network data            | diagnose | Canonical station mapping, positive static edges, source document, test, commit |
| T2 minimax engine                 | pending  | N-origin worst→total tests, commit                                              |
| T3 static API                     | pending  | No external fetch/key tests, commit                                             |
| T4 meeting UI                     | pending  | N-person form and static result tests, commit                                   |
| T5 removal and final verification | pending  | No Kakao source/key, full checks, browser evidence, commit                      |
