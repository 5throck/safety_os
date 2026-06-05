# SCRIPTS.md — Script Lifecycle Registry

> This file is the Single Source of Truth for all scripts in `scripts/`.
>
> **Machine parsing**: `verify-scripts.ts --verify` reads the `## Registry` section only.

---

## Architecture: Tier 2 Scripts (Bun/TS + package.json)

All project scripts are written in TypeScript and executed via the Bun runtime.

---

## Registry

<!-- verify-scripts.ts parses rows between the Registry header and the next ## header. -->
<!-- Required columns: script | source | version | status | removal-date | security-advisory | layer | pair -->
<!-- status: active | deprecated | experimental -->
<!-- removal-date: YYYY-MM-DD (required when status=deprecated) or — -->
<!-- security-advisory: CVE-XXXX or — -->
<!-- layer: common = available in all projects | L0-only = workspace root only | L1-only = generated project only -->
<!-- pair: <script-name> or — -->

| script | source | version | status | removal-date | security-advisory | layer | pair |
|--------|--------|---------|--------|--------------|-------------------|-------|------|
| `audit.ts` | L0 | 2.5.2 | active | — | — | common | — |
| `dev-sync.ts` | L0 | 1.2.0 | active | — | — | common | — |
| `sync-md.ts` | L0 | 1.2.0 | active | — | — | common | — |
| `gen-pr-body.ts` | L0 | 1.1.0 | active | — | — | common | — |
| `retry-handler.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `archive-memory.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `qa-gate.ts` | L0 | 1.0.2 | active | — | — | common | — |
| `verify-memory.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `validate-md-language.ts` | L0 | 1.3.0 | active | — | — | common | — |
| `agent-lifecycle-audit.ts` | L0 | 1.1.1 | active | — | — | common | — |
| `skill-lifecycle-audit.ts` | L0 | 1.1.3 | active | — | — | common | — |
| `lifecycle-sync-audit.ts` | L0 | 1.3.2 | active | — | — | common | — |
| `verify-platform-lifecycle.ts` | L0 | 1.1.0 | active | — | — | common | — |
| `verify-scripts.ts` | L0 | 1.1.0 | active | — | — | common | — |
| `hooks/post-write-lifecycle-check.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `safety-audit.ts` | L0 | 2.0.0 | active | — | — | common | — |
| `test-runner.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `lib/platform-context.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `lib/platform-dispatcher.ts` | L0 | 1.0.0 | active | — | — | common | workspace-only: cross-platform dispatch abstraction for PM auto-mode (Claude Code + Antigravity) |
| `lib/encoding-utils.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `lib/error-handling.ts` | L0 | 1.1.0 | active | — | — | common | — |
| `lib/pipeline-state.ts` | L0 | 1.1.0 | active | — | — | common | — |
| `lib/plan-parser.ts` | L0 | 1.0.0 | active | — | — | common | workspace-only: parses ExitPlanMode Markdown plans for auto-mode execution |
| `lib/checkpoint-manager.ts` | L0 | 1.0.0 | active | — | — | common | workspace-only: session-only checkpoint management for PM auto-mode |
| `lib/auto-executor.ts` | L0 | 1.0.0 | active | — | — | common | workspace-only: phase group execution orchestration for PM auto-mode |
| `agent-create.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `agent-delete.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `agent-list.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `agent-verify.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `analyze-git-history.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `check-pm-approval.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `clear-pm-approval.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `dispatch-parallel.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `dispatch-serial.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `dispatch.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `generate-version-manifest.ts` | L0 | 1.0.1 | active | — | — | common | — |
| `hooks/pre-commit.ts` | L0 | 1.5.3 | active | — | — | common | — |
| `hooks/pre-push.ts` | L0 | 1.2.0 | active | — | — | common | — |
| `readme-lifecycle-audit.ts` | L0 | 1.0.1 | active | — | — | common | — |
| `skill-dependency-analysis.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `sync-agent-status.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `sync-skill-status.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `sync-skills.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `translate-readme.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `validate-agents.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `validate-doc-folder.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `validate-model-registry.ts` | L0 | 1.0.1 | active | — | — | common | — |
| `validate-skills.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `verify-agent-deliverables.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `verify-new-project-tests.ts` | L0 | 1.0.2 | active | — | — | common | — |
| `verify-readme-sync.ts` | L0 | 1.1.0 | active | — | — | common | — |
| `verify-skills.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `verify-template-integrity.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `lib/mcp-cache.ts` | L0 | 1.0.0 | active | — | — | common | — |
| `start-mcp.ts` | L0 | 1.0.0 | active | — | — | common | — |

---

## Ownership Layers

| Layer | Location | Owner | Update Policy |
|-------|----------|-------|---------------|
| **L0 — Project SSOT** | `scripts/` (project root) | project team | Versioned via this file |

---

## Lifecycle States

| Status | Meaning | Action Required |
|--------|---------|-----------------|
| `active` | In production use | Changes require version bump in Registry |
| `deprecated` | Scheduled for removal | `removal-date` field required |
| `experimental` | Not guaranteed stable | Not synced automatically |

---

## Guide

### `audit.ts`
**Purpose**: Documentation audit gate. Checks CHANGELOG.md, AGENTS.md, agent frontmatter, skill health.
**Usage**: `bun run scripts/audit.ts`

### `dev-sync.ts`
**Purpose**: Full sync pipeline — session log → MEMORY.md → CHANGELOG → audit → commit → push → PR.
**Usage**: `bun run scripts/dev-sync.ts "feat: description"` or `/sync "feat: description"`

### `sync-md.ts`
**Purpose**: Updates `memory/MEMORY.md` index with today's session entry.
**Usage**: Called automatically by `dev-sync.ts`.

### `safety-audit.ts`
**Purpose**: Safety OS legal_basis field validator. Checks all workflow YAML files for required `legal_basis` fields referencing Korean EHS law articles.
**Usage**: `bun run scripts/safety-audit.ts`
**Runs automatically**: PostToolUse hook after every Write/Edit

---

*SCRIPTS.md maintained by: project team*
*Last updated: 2026-06-04 — initial scaffold, added safety-audit.ts entry*
