# _ORIGIN.md — Safety OS Phase A Origin Record

This project (`Projects/safety-os/`) is a Phase A independent prototype based on the workspace common
template infrastructure at `C:\git\` (workspace root). It will be promoted to `templates/co-safety/`
in Phase B via `scripts/l2-to-variant-pipeline.ts`.

## Workspace Common Version Snapshot

- **Workspace package version**: 1.0.0 (from `package.json`)
- **Snapshot date**: 2026-06-04
- **Git reference**: see `_COMMON_VERSION.md` for commit hash reference

## Files Inherited from Workspace Root

The following files were copied or adapted from the workspace root. Each entry notes what
Safety OS-specific content was added to ensure SHA-256 divergence and reconcile survival.

| File | Source | Safety OS Additions (reconcile survival) |
|------|--------|------------------------------------------|
| `CLAUDE.md` | `C:\git\CLAUDE.md` | Added `## Safety OS Context` section — CSO role override, EHS lifecycle rules, legal disclaimer |
| `GEMINI.md` | `C:\git\GEMINI.md` | Added identical `## Safety OS Context` section for platform parity |
| `AGENTS.md` | `C:\git\AGENTS.md` | Added `## Safety OS Agents` section with 7-agent EHS roster |
| `CHANGELOG.md` | Standard format | Safety OS-specific initial entry |

## Reconcile Survival Notes

The reconcile pipeline (`scripts/l2-to-variant-pipeline.ts`) performs SHA-256 hash comparison.
Files with identical content to workspace root will be stripped during Phase B promotion.

### Files that WILL survive reconcile (contain Safety OS content)
- `CLAUDE.md` — differs due to `## Safety OS Context` section
- `GEMINI.md` — differs due to `## Safety OS Context` section
- `AGENTS.md` — differs due to `## Safety OS Agents` section
- All files in `agents/`, `skills/`, `workflows/`, `regulations/`, `evidence-models/` — Safety OS originals, no workspace root equivalents
- `industry-profiles/manufacturing.yaml` — Safety OS original
- `PROMOTION_CHECKLIST.md`, `_ORIGIN.md`, `_COMMON_VERSION.md` — Safety OS originals
- `.mcp.json` — Safety OS-specific MCP config: `k_skill`, `legalize_kr`, `mcp_kr_legislation` (Korean legislation)

## Root Skills (`skills/`) — Deployment Record

### Source of Truth

Root-level `skills/` contains two categories of skills that co-exist:

| Category | Count | Source | Purpose |
|---|---|---|---|
| **Safety OS domain skills** | 4 | Created in Phase A | EHS-specific workflows (risk-assessment, permit-to-work, emergency-response, compliance-gap) |
| **Common platform skills** | 11 | `templates/common/skills/` | Platform-neutral skills for all variants |

**Total**: 15 skills in `skills/`

### Common Skills List (from `templates/common/skills/`)

Copied on 2026-06-05. These must be kept in sync with `templates/common/skills/` source.

| Skill | Purpose |
|---|---|
| `agent-lifecycle-manager` | Agent file lifecycle management |
| `audit-workspace` | Workspace audit orchestration |
| `meeting-facilitation` | Multi-agent meeting facilitation |
| `project-review` | Project review workflow |
| `script-lifecycle-manager` | Script versioning lifecycle |
| `security-scan` | Security scan workflow |
| `skill-lifecycle-manager` | Skill file lifecycle management |
| `team-builder` | Agent team composition |
| `translate` | README translation workflow |
| `ui-ux-pro-max` | UI/UX design intelligence (complex — includes data/, scripts/ subdirs) |
| `validate-docs-links` | Documentation link validation |

**Re-sync command** (run from workspace root when `templates/common/skills/` is updated):
```bash
cp -r templates/common/skills/. Projects/safety-os/skills/
# Note: this overwrites common skills but preserves Safety OS skills
# (Safety OS skills are not in common, so they are safe)
```

### Antigravity Skill Recognition

Antigravity (Gemini CLI) resolves skills in this order (per `GEMINI.md §Skill Resolution Priority`):
1. `skills/<name>/SKILL.md` — **highest priority** (both Safety OS + common skills live here)
2. `.gemini/skills/<name>/SKILL.md` — platform config skills
3. Global plugin skills

All 15 root skills are accessible to Antigravity without additional configuration.

---

## Common Skills — Sync Policy

### Source of Truth

The 4 common platform skills in `.claude/skills/` and `.gemini/skills/` are sourced from
`templates/common/.claude/skills/` and `templates/common/.gemini/skills/` respectively.

| Common Skill | .claude/skills/ | .gemini/skills/ | Sync Status |
|---|---|---|---|
| `finishing-a-development-branch` | ✅ | ✅ | Synced from common (verified 2026-06-05) |
| `platform-command-lifecycle-manager` | ✅ | ✅ | Synced from common (verified 2026-06-05) |
| `platform-skill-lifecycle-manager` | ✅ | ✅ | Synced from common (verified 2026-06-05) |
| `simulate-project-creation` | ✅ | ✅ | Synced from common (verified 2026-06-05) |

**When re-syncing**: always use `templates/common/.claude(gemini)/skills/` as the source, not
`templates/co-work/` or workspace root `.claude/skills/`.

```bash
# Re-sync command (run from workspace root):
cp -r templates/common/.claude/skills/. Projects/safety-os/.claude/skills/
cp -r templates/common/.gemini/skills/. Projects/safety-os/.gemini/skills/
```

### Phase B Reconcile Warning — Common Skills

> ⚠️ **RISK**: During `l2-to-variant-pipeline.ts` execution, `.claude/skills/` and `.gemini/skills/`
> files that are byte-identical to workspace root (L0) will be classified as **"identical"** by
> `reconcile-with-l0-l1.ts` and **removed** from the generated `templates/co-safety/`.
>
> This may be **intentional behavior** — `new-project.sh` re-injects common skills from
> `templates/common/` at project creation time via `cp -r "$COMMON_DIR/." "$PROJECT_DIR/"`.
>
> **Verification step**: After Phase B pipeline runs, confirm that:
> 1. `templates/co-safety/.claude/skills/` contains the 4 common skills (may be missing if reconcile strips them)
> 2. If missing, manually copy from `templates/common/.claude/skills/`
> 3. Confirm `new-project.sh` correctly injects them for new `co-safety` instances

### Pending Workspace Item

- **A-14**: `agent-lifecycle-manager` SKILL.md is present in safety-os and all other variants
  but is NOT in `templates/common/`. Proposed for promotion to common — tracked in workspace
  roadmap. Until resolved, `agent-lifecycle-manager` must be explicitly present in
  `templates/co-safety/.claude(gemini)/skills/` after Phase B.

---

## Manual Phase B Steps

> **CRITICAL**: The following directories are NOT auto-scanned by the reconcile pipeline.
> They MUST be manually copied to `templates/co-safety/` during Phase B promotion.

| Directory | Contents | Manual Copy Required |
|-----------|----------|----------------------|
| `workflows/` | Daily, compliance, and emergency workflow definitions | Yes — copy entire tree |
| `regulations/` | Korean law metadata YAML files | Yes — copy entire tree |
| `evidence-models/` | JSON evidence model schemas | Yes — copy entire tree |
| `industry-profiles/` | Industry profile YAML stubs | Yes — copy entire tree |
| `memory/` | Incident, finding, corrective-action logs | No — runtime data, do not copy to template |

### Phase B Promotion Command (reference)
```bash
# After all Phase A tasks are complete and PROMOTION_CHECKLIST.md conditions are met:
bun scripts/l2-to-variant-pipeline.ts --source Projects/safety-os --target templates/co-safety

# Then manually copy pipeline-excluded directories:
cp -r Projects/safety-os/workflows templates/co-safety/workflows
cp -r Projects/safety-os/regulations templates/co-safety/regulations
cp -r Projects/safety-os/evidence-models templates/co-safety/evidence-models
cp -r Projects/safety-os/industry-profiles templates/co-safety/industry-profiles

# Publish template tag:
bun scripts/tag-template.ts
```
