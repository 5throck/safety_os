# Meeting Transcript
**Date**: 2026-06-16
**Topic**: Review of renaming vendor/ folder to mcp/
**Participants**: architect, automation-engineer, docs-writer (pm as facilitator)
**Rounds**: 2
**Language**: Korean (transcript saved in English)
**Status**: Complete

---

## Transcript

### Round 1

**[Architect]** (Round 1)

Supports the `vendor → mcp` rename. Core reason: **semantic clarity**.

`vendor/` has long signified "third-party dependency copies" in the Node.js/npm ecosystem. But k_skill, legalize_kr, and mcp_kr_legislation are **first-party MCP servers** we built ourselves. The name `vendor/` obscures this fact and gives new developers the wrong mental model: "this must contain copied external packages."

`mcp/` makes the folder's purpose immediately self-evident. Seeing `mcp/k-skill/`, `mcp/shared/` conveys the structure at a glance: "this project maintains its own MCP servers." The core infrastructure of Safety OS becomes readable from the directory tree alone.

The filesystem change scope is narrow. Internal relative paths (`../shared/logger.js`, etc.) are unaffected by the folder rename. The key item to confirm with automation-engineer is the absolute path references in `.mcp.json`. Also interested in docs-writer's assessment of the documentation reference scope.

---

**[Automation-Engineer]** (Round 1)

Agrees with architect's semantic clarity argument. Presenting the concrete change scope from an implementation perspective.

**Required changes:**
1. `.mcp.json` — `./vendor/k-skill/index.ts` → `./mcp/k-skill/index.ts` (3 entries)
2. `CLAUDE.md` — any vendor/ mentions (if present)
3. `CHANGELOG.md` — historical entries with vendor/ paths

**No changes needed:**
- Relative imports inside `vendor/shared/` (`../../scripts/lib/mcp-cache.js`, etc.) — unaffected by folder rename
- Cross-references within `vendor/*/tools/` — all relative paths

**Execution procedure:**
```bash
# 1. Move folder
git mv vendor mcp

# 2. Update .mcp.json paths (3 lines)
# ./vendor/k-skill → ./mcp/k-skill
# ./vendor/legalize-kr → ./mcp/legalize-kr
# ./vendor/mcp-kr-legislation → ./mcp/mcp-kr-legislation

# 3. Verify
MOCK_API=true SKIP_GIT_SYNC=true timeout 3 bun run mcp/k-skill/index.ts
```

Risk is low. Using `git mv` preserves git history. One open question: the path `mcp/mcp-kr-legislation/` looks redundant with the `mcp-` prefix. Raises the question of whether to clean it up to `mcp/kr-legislation/` — needs discussion with docs-writer.

---

**[Docs-Writer]** (Round 1)

Reviewed documentation impact based on the two prior contributions.

The `mcp/mcp-kr-legislation/` redundancy raised by automation-engineer is a **real readability problem in documentation**. External developers reading API docs or README will see `mcp/mcp-kr-legislation` and wonder "why does mcp appear twice?" Recommend cleaning up to `mcp/kr-legislation/` in this change.

Documentation impact scope:

| File | vendor/ mentions | Action needed |
|------|-----------------|---------------|
| `CHANGELOG.md` | Historical entries (2026-06-05, 2026-06-16) | Cannot modify history — add new entry |
| `docs/superpowers/specs/2026-06-05-mcp-server-design.md` | Directory structure section | Update required |
| `docs/superpowers/plans/2026-06-16-mcp-servers-implementation.md` | File paths | Update required |
| `AGENTS.md` | Not applicable | Not needed |

CHANGELOG principle: historical entries with vendor/ paths **must not be modified**. Add a new entry under `[Unreleased]` with "refactor: rename vendor/ to mcp/" per Keep a Changelog conventions.

---

### Round 2

**[Architect]** (Round 2)

Incorporating feedback from automation-engineer and docs-writer to finalize the design decision.

**`mcp/mcp-kr-legislation/` → `mcp/kr-legislation/`: Adopted**

This redundancy is more than a cosmetic issue — it is a design smell. Since the folder already lives under `mcp/`, there is no reason to retain the `mcp-` prefix in the subdirectory name. The other servers (`k-skill`, `legalize-kr`) are already consistently named, so this cleanup improves overall coherence.

**Proposed final directory structure:**
```
mcp/
  shared/              ← formerly vendor/shared
  k-skill/             ← formerly vendor/k-skill (MCP server name: k_skill preserved)
  legalize-kr/         ← formerly vendor/legalize-kr (MCP server name: legalize_kr preserved)
  kr-legislation/      ← formerly vendor/mcp-kr-legislation (MCP server name: mcp_kr_legislation preserved)
```

Important: **folder names change but MCP server `name` fields stay the same.** The server names registered in `.mcp.json` (`k_skill`, `legalize_kr`, `mcp_kr_legislation`) are the agent interface and must not change. Internal directory restructuring must not affect the external interface.

---

**[Automation-Engineer]** (Round 2)

Agrees with architect's final structure. Keeping `mcp_kr_legislation` as the MCP server name while renaming the folder to `kr-legislation/` is the cleanest outcome.

Finalizing the complete execution plan:

```bash
# Step 1: Move folders (preserving git history)
git mv vendor/k-skill mcp/k-skill
git mv vendor/legalize-kr mcp/legalize-kr
git mv vendor/mcp-kr-legislation mcp/kr-legislation
git mv vendor/shared mcp/shared
rmdir vendor  # remove empty directory

# Step 2: Update .mcp.json paths
# ./vendor/k-skill → ./mcp/k-skill
# ./vendor/legalize-kr → ./mcp/legalize-kr
# ./vendor/mcp-kr-legislation → ./mcp/kr-legislation

# Step 3: Smoke test all servers
MOCK_API=true SKIP_GIT_SYNC=true timeout 3 bun run mcp/k-skill/index.ts
SKIP_GIT_SYNC=true timeout 3 bun run mcp/legalize-kr/index.ts
MOCK_API=true timeout 3 bun run mcp/kr-legislation/index.ts

# Step 4: Audit
bun scripts/audit.ts
```

Risk reassessment: The two-step change on `vendor/mcp-kr-legislation` (folder rename + prefix removal) means `.mcp.json` path mapping is the only realistic failure point. Immediately verifiable via smoke test.

---

**[Docs-Writer]** (Synthesis)

Synthesizing two rounds of discussion.

**Points of Agreement:**

1. **`vendor/` → `mcp/` rename: Adopted** — semantic clarity, reflects first-party server identity
2. **`vendor/mcp-kr-legislation` → `mcp/kr-legislation/`** — removes redundant prefix, improves folder consistency
3. **MCP server names (k_skill, legalize_kr, mcp_kr_legislation): Unchanged** — agent interface must remain stable
4. **CHANGELOG handling** — historical entries untouched; new `refactor` entry added to `[Unreleased]`
5. **Internal relative path imports: Unaffected**

**Open Disagreements or Unresolved Questions:** None. All issues reached consensus.

**Platform Parity Check:** This change does not directly affect `CLAUDE.md`, `.claude/`, or `.gemini/` files. `.mcp.json` is a shared config file used by both Claude Code and Gemini CLI — a single update applies to both platforms.

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | automation-engineer | Low | `git mv` 4 folders: `vendor/k-skill→mcp/k-skill`, `vendor/legalize-kr→mcp/legalize-kr`, `vendor/mcp-kr-legislation→mcp/kr-legislation`, `vendor/shared→mcp/shared` | Both | Phase 4 |
| A-02 | automation-engineer | Low | Update `.mcp.json` paths (3 entries) + pass smoke test for all 3 servers | Both | Phase 4 |
| A-03 | docs-writer | Low | Update directory structure section in `docs/superpowers/specs/2026-06-05-mcp-server-design.md` | Both | Phase 4 |
| A-04 | docs-writer | Low | Update file paths in `docs/superpowers/plans/2026-06-16-mcp-servers-implementation.md` | Both | Phase 4 |
| A-05 | pm | Low | Add `refactor: rename vendor/ to mcp/, mcp-kr-legislation/ to kr-legislation/` entry to `CHANGELOG.md [Unreleased]` | Both | Phase 4 |

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | All 3 MCP servers start without error after rename | `timeout 3 bun run mcp/<server>/index.ts` shows INFO startup line |
| AC-2 | `.mcp.json` paths resolve correctly | Server connection succeeds in Claude Code session |
| AC-3 | `bun scripts/audit.ts` exits 0 | Audit output shows `✅ All checks passed` |
| AC-4 | git history preserved for moved files | `git log --follow mcp/k-skill/index.ts` shows pre-rename commits |
