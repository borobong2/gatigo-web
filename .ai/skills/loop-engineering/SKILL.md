---
name: loop-engineering
description: Execute a GitHub Issue through one complete implementation PR without stopping after intermediate commits.
---

# Loop Engineering

Read `.ai/rules.md`, `.ai/common/workflows/operating-model.md`, and the target
GitHub Issue first.

1. Confirm `feat|fix|refactor/issue-<number>` branch naming.
2. Create tasks with testable acceptance evidence.
3. Repair normal failures within the active task; do not convert defects into
   blockers.
4. Commit each smallest coherent implementation unit and continue immediately.
5. Finish with the full quality gate, browser evidence for UI changes, and a
   final diff review.
