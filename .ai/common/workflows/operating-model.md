# AI Operating Model

## Branch and PR contract

- Start work from a GitHub Issue and read the issue before changing code.
- Use exactly one issue branch: `feat/issue-<number>`, `fix/issue-<number>`,
  or `refactor/issue-<number>`. Do not append a feature slug.
- One branch produces one PR containing the issue's code, tests, docs, and
  verification evidence as one set.
- Do not commit or push directly to `main` unless the user explicitly asks.

## Issue execution loop

1. Create small tasks with acceptance evidence.
2. Complete one task: failing test, minimal implementation, focused checks.
3. Investigate failures inside the same task; search authoritative alternatives
   before declaring a blocker.
4. Commit the smallest coherent file set, including related docs and tests.
5. Immediately execute the next incomplete task. A progress message is not a
   stop signal.
6. Stop only after every acceptance condition is verified, or a genuinely
   external authority/data/license decision is required.

## Completion evidence

- Keep task state in one source only.
- Record command or browser evidence before marking work done.
- Do not call work "in progress" unless a process is actually running.
- Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, and `pnpm build` before a
  completion claim.
