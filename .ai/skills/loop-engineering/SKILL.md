---
name: loop-engineering
description: Execute GatiGo's GitHub Issue DAG through implementation and behavior gates without stopping after intermediate commits or waves.
---

# Loop Engineering

Read `.ai/rules.md`, `.ai/common/workflows/operating-model.md`,
`docs/runbooks/gatigo-loop-execution.md`, and the target GitHub Issue first.

1. Read GitHub Roadmap #12 and the current gatigo-web-only Orca Run.
2. Execute only tasks whose dependencies are complete.
3. Confirm `feat|fix|refactor/issue-<number>` branch naming.
4. Create tasks with testable acceptance evidence.
5. Repair normal failures within the active task; do not convert defects into
   blockers.
6. Commit each smallest coherent implementation unit and continue immediately.
7. After worker completion, verify and integrate, then dispatch newly ready tasks.
8. Stop at behavior gates for real evidence; never auto-resolve them.
9. Finish each implementation issue with the full quality gate, browser evidence
   for UI changes, and a final diff review.
