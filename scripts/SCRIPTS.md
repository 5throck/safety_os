# SCRIPTS.md — Script Lifecycle Registry

> This file is the Single Source of Truth (SSOT) for all scripts in `scripts/` in this project.
> `scripts/README.md` is a generated human-readable view of this registry, produced by `bun scripts/generate-scripts-readme.ts` — do not hand-edit README.md's registry table, edit this file and regenerate.
> This is a standalone deployment (no `templates/` directory, no further L1/L2 propagation happens from this repo) — the `source`/`layer` columns below are retained for structural compatibility with `scripts/audit.ts`'s parser but carry no propagation meaning here.

---

## Architecture: Tier 1 (Bootstrap) vs Tier 2 (Bun/TypeScript)

This project has not adopted a TypeScript-only policy — both tiers are legitimate and in active use:

### Tier 1: Bootstrap & Native Scripts (`.sh` / `.ps1`)
- **Purpose**: Environment setup, bootstrapping, or scenarios where no external runtime (Bun/Node) is guaranteed yet (e.g. installing Bun itself).
- **Examples**: `install-bun.sh/.ps1`, `setup.sh/.ps1`, `upgrade-project.sh/.ps1`, `cleanup-completed-md.sh/.ps1`.
- Some Tier 1 scripts are thin wrappers delegating to a Tier 2 `.ts` equivalent (see `pair` column) and are individually marked deprecated in favor of the `.ts` version; others (e.g. `audit.sh`/`audit.ps1`) are genuine standalone parallel implementations kept for environments without Bun.

### Tier 2: Ops & Automation Scripts (Bun/TypeScript)
- **Purpose**: Everyday pipeline tasks — audits, syncing, agent/skill lifecycle management, dispatch orchestration.
- **Execution**: `bun scripts/<name>.ts`.

---

## Registry

<!-- scripts/audit.ts's verifyScriptVersionHeaders/verifyScriptRegistryConsistency parse this file by substring match (script name + version must appear somewhere in this file). The S-04 parity check additionally parses rows starting with "| `" for the pair field — keep that exact row format for any row you want parity-checked. -->
<!-- Required columns: script | source | version | status | removal-date | security-advisory | layer | pair -->
<!-- status: active | deprecated | experimental -->
<!-- removal-date: YYYY-MM-DD (required when status=deprecated) or — -->
<!-- security-advisory: CVE-XXXX or — -->
<!-- source / layer: retained for parser column-position compatibility only; not meaningful in this standalone deployment (always "—") -->
<!-- pair: <script-name> — declares a counterpart that must be modified together (enables S-04 parity check); "—" if none -->

| script | source | version | status | removal-date | security-advisory | layer | pair |
|--------|--------|---------|--------|--------------|-------------------|-------|------|
| `agent-create.ts` | — | 1.0.0 | active | — | — | — | — |
| `agent-delete.ts` | — | 1.0.0 | active | — | — | — | — |
| `agent-lifecycle-audit.ts` | — | 1.1.2 | active | — | — | — | — |
| `agent-list.ts` | — | 1.0.0 | active | — | — | — | — |
| `agent-verify.ts` | — | 1.0.2 | active | — | — | — | — |
| `analyze-git-history.ts` | — | 1.0.0 | active | — | — | — | — |
| `archive-memory.ts` | — | 1.1.0 | active | — | — | — | — |
| `audit.ts` | — | 2.6.1 | active | — | — | — | — |
| `check-pm-approval.ts` | — | 1.0.1 | deprecated | 2026-11-30 | — | — | — |
| `clear-pm-approval.ts` | — | 1.0.0 | active | — | — | — | — |
| `dev-sync.ts` | — | 1.4.0 | active | — | — | — | — |
| `dispatch-parallel.ts` | — | 1.0.1 | active | — | — | — | — |
| `dispatch-serial.ts` | — | 1.0.0 | active | — | — | — | — |
| `dispatch.ts` | — | 1.0.0 | active | — | — | — | — |
| `domain-config.ts` | — | 1.3.0 | active | — | — | — | — |
| `fetch-legalize.ts` | — | 1.0.0 | active | — | — | — | — |
| `gen-pr-body.ts` | — | 1.1.4 | active | — | — | — | — |
| `generate-scripts-readme.ts` | — | 1.1.0 | active | — | — | — | — |
| `generate-version-manifest.ts` | — | 1.0.4 | active | — | — | — | — |
| `new-domain.ts` | — | 1.0.0 | active | — | — | — | — |
| `qa-gate.ts` | — | 1.0.2 | active | — | — | — | — |
| `readme-lifecycle-audit.ts` | — | 1.0.2 | active | — | — | — | — |
| `retry-handler.ts` | — | 1.0.2 | active | — | — | — | — |
| `safety-audit.ts` | — | 4.2.0 | active | — | — | — | — |
| `skill-dependency-analysis.ts` | — | 1.0.0 | active | — | — | — | — |
| `skill-lifecycle-audit.ts` | — | 1.1.4 | active | — | — | — | — |
| `start-mcp.ts` | — | 1.0.0 | active | — | — | — | — |
| `sync-agent-status.ts` | — | 1.0.0 | active | — | — | — | — |
| `sync-md.ts` | — | 1.3.0 | active | — | — | — | — |
| `sync-skill-status.ts` | — | 1.0.0 | active | — | — | — | — |
| `sync-skills.ts` | — | 1.1.0 | active | — | — | — | — |
| `team-builder.ts` | — | 1.2.0 | active | — | — | — | — |
| `test-chemical-handling-profile.ts` | — | 1.0.0 | active | — | — | — | — |
| `test-cross-domain-integration.ts` | — | 1.0.0 | active | — | — | — | — |
| `test-domain-scenarios.ts` | — | 1.1.0 | active | — | — | — | — |
| `test-pharma-general-profile.ts` | — | 1.0.0 | active | — | — | — | — |
| `test-runner.ts` | — | 1.0.0 | active | — | — | — | — |
| `translate-readme.ts` | — | 1.0.0 | active | — | — | — | — |
| `validate-agents.ts` | — | 1.0.0 | active | — | — | — | — |
| `validate-doc-folder.ts` | — | 1.0.1 | active | — | — | — | — |
| `validate-md-language.ts` | — | 1.4.1 | active | — | — | — | — |
| `validate-skills.ts` | — | 1.1.0 | active | — | — | — | — |
| `verify-agent-deliverables.ts` | — | 1.0.0 | active | — | — | — | — |
| `verify-memory.ts` | — | 1.0.0 | active | — | — | — | — |
| `verify-readme-sync.ts` | — | 1.1.1 | active | — | — | — | — |
| `verify-scripts.ts` | — | 1.0.0 | active | — | — | — | — |
| `verify-skills.ts` | — | 1.1.0 | active | — | — | — | — |
| `lib/auto-executor.ts` | — | 1.0.0 | active | — | — | — | — |
| `lib/checkpoint-manager.ts` | — | 1.0.0 | active | — | — | — | — |
| `lib/encoding-utils.ts` | — | 1.0.0 | active | — | — | — | — |
| `lib/error-handling.ts` | — | 1.1.0 | active | — | — | — | — |
| `lib/mcp-cache.ts` | — | 1.0.0 | active | — | — | — | — |
| `lib/pipeline-state.ts` | — | 1.1.0 | active | — | — | — | — |
| `lib/plan-parser.ts` | — | 1.0.0 | active | — | — | — | — |
| `lib/platform-context.ts` | — | 1.0.0 | active | — | — | — | — |
| `lib/platform-dispatcher.ts` | — | 1.0.0 | active | — | — | — | — |
| `audit.sh` | — | — | active | — | — | — | — |
| `audit.ps1` | — | — | active | — | — | — | — |
| `cleanup-completed-md.sh` | — | — | active | — | — | — | — |
| `cleanup-completed-md.ps1` | — | — | active | — | — | — | — |
| `install-bun.sh` | — | — | active | — | — | — | — |
| `install-bun.ps1` | — | — | active | — | — | — | — |
| `setup.sh` | — | — | active | — | — | — | — |
| `setup.ps1` | — | — | active | — | — | — | — |
| `upgrade-project.sh` | — | 1.1.0 | active | — | — | — | — |
| `upgrade-project.ps1` | — | 1.1.0 | active | — | — | — | — |
| `gen-pr-body.sh` | — | — | deprecated | 2026-08-29 | — | — | gen-pr-body.ts |
| `gen-pr-body.ps1` | — | — | deprecated | 2026-08-29 | — | — | gen-pr-body.ts |
| `sync-md.sh` | — | — | active | — | — | — | — |
| `sync-md.ps1` | — | — | deprecated | 2026-08-29 | — | — | sync-md.ts |

**Notes on the above:**
- `lib/*.ts` (9 files): internal library modules, not directly invoked as scripts. They are NOT scanned by `verifyScriptVersionHeaders`/`verifyScriptRegistryConsistency` (those checks only cover top-level `scripts/*.ts`); listed here for documentation completeness only.
- `audit.sh` / `audit.ps1`: genuine standalone parallel implementations of `audit.ts`'s checks for non-Bun environments — NOT thin wrappers, so no `pair` relationship.
- `sync-md.sh`: standalone implementation, NOT deprecated (no deprecation marker in file) — distinct from `sync-md.ps1`, which IS a deprecated thin wrapper around `sync-md.ts`.
- `gen-pr-body.sh` / `gen-pr-body.ps1`: both are deprecated thin wrappers delegating to `gen-pr-body.ts` (removal date 2026-08-29 per their own headers).
- `.sh`/`.ps1` files without an `@version` header are not scanned by the version-header check (only `.ts` files are) — version column is `—` for those without one.

---

## Lifecycle States

- **active** — in use; changes require a version bump in this registry to match the script's own `@version` header.
- **deprecated** — has a `removal-date` (minimum 90 days notice from the deprecation date); scheduled for removal, prefer the paired replacement if one is listed.
- **experimental** — not yet stable; behavior may change without notice.

## Guide

See `scripts/README.md` for full per-script usage documentation, auto-generated from this registry.

## Version Bump Policy

Bump the version here to match the script's own `@version` header whenever the script changes.
