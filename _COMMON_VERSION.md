# _COMMON_VERSION.md — Workspace Common Version Snapshot

Records the workspace root state at the time this Safety OS prototype was scaffolded.

## Snapshot Details

| Field | Value |
|-------|-------|
| Snapshot date | 2026-06-04 |
| Workspace package name | ai-workspace-scripts |
| Workspace package version | 1.0.0 |
| Git branch | main |
| Git commit (approximate) | see `git log --oneline -1` at C:\git at time of scaffold |

## Key Workspace Files Referenced

| File | Purpose |
|------|---------|
| `C:\git\CLAUDE.md` | Claude Code behavioral rules (base for this project's CLAUDE.md) |
| `C:\git\GEMINI.md` | Gemini CLI behavioral rules (base for this project's GEMINI.md) |
| `C:\git\AGENTS.md` | Agent roster (base for this project's AGENTS.md) |
| `C:\git\scripts\SCRIPTS.md` | Script lifecycle registry |
| `C:\git\package.json` | Version 1.0.0 reference |

## Upgrade Policy

When the workspace common version advances significantly, run a diff between the new workspace
CLAUDE.md/GEMINI.md/AGENTS.md and this project's files to identify changes that need to be
forward-ported. Update this file's snapshot date and version after each sync.

## Phase B Promotion Dependency

This snapshot version must be recorded in `templates/co-safety/_ORIGIN.md` after Phase B
promotion to track which workspace common base the variant was built on.
