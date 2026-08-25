# GatiGo AI Foundation

Shared AI source of truth for Codex, Claude, and Gemini.

## Structure

- `rules.md` - hard project constraints
- `common/` - shared conventions and workflows
- `skills/` - shared skill source

## Boundary

- Shared project guidance goes in `.ai/`
- Claude-only runtime settings go in `.claude/`
- Codex-only runtime settings go in `.codex/`
- Gemini-only runtime settings go in `.gemini/`

## Rule

Read `rules.md` and `common/workflows/operating-model.md` before changing the
repository. Keep adapters thin.
