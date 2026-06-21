# Meeting Transcript
**Date**: 2026-06-21
**Topic**: Workspace Tooling/Governance Hygiene — (1) Code Graph remnant removal, (2) Superpowers plugin policy, (3) Skill registration parity (derived)
**Participants**: safety-governance-manager, docs-writer, compliance-agent (synthesizer: audit-agent)
**Rounds**: 2
**Language**: Korean (transcript archived in English)
**Status**: Complete — recommendations pending user decision on Q1/Q2

---

## Context (data gathered pre-meeting)

- **Code graph remnant**: On 2026-06-16 the user removed the **codegraph MCP** runtime integration (`codegraph_search` / `codegraph_mutate` from `.mcp.json`, settings cleanup, `J-codegraph-integration.md` deleted). However remnants remain: `evidence-models/graph-schema.json` (0 references), `docs/_meta/architecture/knowledge-graph-ingestion.md`, `docs/_meta/blueprint/18-knowledge-graph.md` + `19-graph-schema.md` + `appendix/H-knowledge-graph-examples.md`, `_ORIGIN.md:37`, `AGENTS.md:32`, and **`training-agent.md`** (declares a Neo4j read-only MCP dependency), plus `docs/_meta/v4.0-playbook-2026-06-06.md` (extensive CodeGraph / Neo4j / Knowledge Graph references). **Neo4j is NOT in `.mcp.json`** → the training-agent Neo4j dependency and the playbook's "Knowledge Graph Traceability Model" are unimplemented design aspirations.
- **Superpowers**: CLAUDE.md (§238-239) and GEMINI.md (§145-146) contain a "Superpowers Plugin & Cost Optimization" section instructing the PM to "MUST leverage the superpowers plugin" (`subagent-driven-development`, `dispatching-parallel-agents`). The Skill Resolution Priority table references `superpowers/brainstorming` + `superpowers/writing-plans` as Priority 3. Separately, `docs/_meta/superpowers/` is a directory of MCP-server design/implementation docs (historical naming) whose plan files state "REQUIRED: Use superpowers:subagent-driven-development". User's position: both Claude and Antigravity now have these capabilities built-in, so separate install/use instructions are no longer appropriate.
- **Skill registration parity (derived)**: `meeting-facilitation` is registered only as the `/meeting` command (`.claude/commands/meeting.md` + `.gemini/commands/meeting.md`, parity OK) and as a stub in `skills/meeting-facilitation/SKILL.md` (Safety-OS internal registry). It is absent from `.claude/skills/` and `.gemini/skills/`, which are the only paths the native Skill tool scans — hence "Unknown skill". Also `.claude/skills` has 8 entries vs `.gemini/skills` 5 (3 missing in Gemini: api-documentation, research-analysis, documentation-writing).

---

## Transcript

**[safety-governance-manager]** (Round 1): Both items share one root cause — **unimplemented design specifications and obsolete tool instructions persist in governance docs**. The codegraph MCP was removed at runtime in June, yet the "Knowledge Graph Traceability Model" concept (Evidence→Workflow→Regulation) still lives in the v4.0 playbook and training-agent, with the audit-agent described as automatically compiling inspection-readiness reports from that graph (line 766) — but Neo4j is not even connected. For a GxP-regulated platform this overstates audit traceability, which is trust-critical. Superpowers is the same shape: "the PM must install and leverage the superpowers plugin" is a historical relic now that both platforms ship native subagents and plan mode. In both cases the governance-aligned answer is **source removal or explicit "not-implemented / replaced by native" annotation**. docs-writer, how do you classify the remnant scope?

**[docs-writer]** (Round 1): Three tiers. **(A) Clear remnants — delete**: `graph-schema.json` (0 refs), `_ORIGIN.md:37` codegraph mention, the playbook codegraph MCP table (lines 1402-1412). **(B) "Unimplemented design" — archive or annotate**: blueprint `18-knowledge-graph.md`, `19-graph-schema.md`, `appendix/H-*`, `knowledge-graph-ingestion.md`, and the playbook's Neo4j/Knowledge-Graph sections — roadmap docs with no implementation. **(C) Functional impact — rewrite**: `training-agent.md` actually *assumes* Neo4j MCP queries in its procedure; this is agent behavior-spec modification, not doc cleanup. Superpowers mirrors the same tiers: (a) the CLAUDE/GEMINI "Superpowers Plugin" section → **delete**; (b) the Skill Resolution Priority `superpowers/*` rows → **replace with native** (Priority 3 = "Platform-native skills"); (c) the `docs/_meta/superpowers/` directory → keep the MCP design docs but swap the plan-header "Use superpowers:..." line for native guidance. compliance-agent, cautions on the training-agent rewrite?

**[compliance-agent]** (Round 1): The crux is **audit-evidence integrity**. Declaring (playbook line 766) that the audit-agent auto-compiles inspection reports from a graph that has no Neo4j is a **false traceability claim** — severe under SAPA / OSHA-KR. So for tier (B) I recommend **explicit "Not Implemented — roadmap only" annotation or move to `_meta/archive/`** rather than plain deletion: preserve design intent while making "does not currently operate" unambiguous. The training-agent rewrite must be reviewed by compliance-agent directly: its `legal_basis` tracking must resolve to **evidence-models JSON + schema.yaml `legal_basis` fields** (the live source of truth), not a graph — consistent with the A-02 glossary SSOT. The superpowers removal is harmless (pure tooling instruction), so I endorse docs-writer's plan there.

**[safety-governance-manager]** (Round 2): I agree with compliance-agent's (B) "annotate unimplemented" — safer for audit than deletion. The `v4.0-playbook-2026-06-06.md` is already a dated snapshot under `_meta/` with zero active references, so moving it whole to `archive/` is cleanest. I propose one governing principle: **"Truth-in-Documentation"** — documented capability must equal implemented capability; anything unimplemented must carry a "roadmap / not-implemented" tag. This principle spans all three agenda items. The derived skill-registration gap is the same: if docs say "used in both platforms", it must actually be registered in both.

**[docs-writer]** (Round 2): Principle accepted. Execution units: **PR-1 code-graph cleanup** ((A) delete + (C) rewrite, with compliance-agent review) → **PR-2 superpowers policy** (delete CLAUDE/GEMINI section, native-ize Priority table, swap plan headers, tidy validator paths) → **PR-3 skill registration parity** (add `.claude/.gemini/skills/meeting-facilitation/`, backfill the 3 missing Gemini skills). Three separated PRs are safest for review; each gated on `bun scripts/safety-audit.ts`.

**[compliance-agent]** (Round 2): Separated PRs with per-PR audit gate — agreed. Caveat: PR-1's training-agent rewrite is **re-specifying the legal_basis traceability path to the evidence-models/glossary SSOT**, not merely deleting the Neo4j wording — it must restate "how regulatory traceability is achieved" via the replacement path. compliance-agent owns that item; I endorse docs-writer on the rest.

---

## Synthesis (audit-agent)

### Points of Agreement
1. **Adopt "Truth-in-Documentation" principle**: documented capability = implemented capability; unimplemented items must be marked "roadmap/not-implemented". Common yardstick for all three items. (unanimous)
2. **Code-graph remnant 3-tier handling**: (A) `graph-schema.json`, `_ORIGIN.md:37`, playbook codegraph table = **delete**; (B) Knowledge-Graph/Neo4j design docs + v4.0-playbook snapshot = **move to `_meta/archive/` + "not-implemented" annotation** (not deletion); (C) training-agent = **remove Neo4j dependency, re-spec legal_basis traceability to the evidence-models/glossary SSOT**. (unanimous)
3. **Superpowers policy cleanup**: delete the CLAUDE/GEMINI "Superpowers Plugin" section; replace the Skill Resolution Priority Priority-3 `superpowers/*` rows with "Platform-native skills"; swap the `docs/_meta/superpowers/` plan-header "Use superpowers:..." line for native subagent/plan-mode guidance (directory preserved). (unanimous)
4. **Skill registration parity (derived)**: register `meeting-facilitation` in `.claude/skills/` + `.gemini/skills/` pairs; backfill the 3 missing Gemini skills. (unanimous)

### Open / Unresolved
- **Q1**: Rename `docs/_meta/superpowers/` itself (e.g. to `mcp-design/`) vs keep the name — majority view: keep the name (historical context), only swap internal "Use superpowers" wording. *Recommend user decides.*
- **Q2**: v4.0-playbook → `archive/` move vs wholesale delete — compliance-agent recommends archive move (audit-history preservation). *Recommend user decides.*

### Platform Parity Check (mandatory)
Every Action Item touches CLAUDE.md / GEMINI.md / agents/* / .claude/ / .gemini/ → all items are **Platform = Both**. No Claude-only / Antigravity-only item. No parity violation.

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | docs-writer | Medium | Code-graph (A) delete remnants: `graph-schema.json`, `_ORIGIN.md:37`, v4.0-playbook codegraph MCP table (lines 1402-1412) | Both | 1 (PR-1) |
| A-02 | docs-writer | Medium | Code-graph (B) move design docs to `_meta/archive/` + "not-implemented" annotation: blueprint 18/19/H, `knowledge-graph-ingestion.md`, v4.0-playbook snapshot | Both | 1 (PR-1) |
| A-03 | compliance-agent | Medium | Code-graph (C) training-agent re-spec: remove Neo4j MCP dependency → re-describe `legal_basis` traceability via evidence-models + glossary SSOT | Both | 1 (PR-1) |
| A-04 | docs-writer | Medium | Superpowers policy cleanup: delete CLAUDE.md + GEMINI.md "Superpowers Plugin" section; Skill Resolution Priority-3 row → "Platform-native skills" | Both | 2 (PR-2) |
| A-05 | docs-writer | Low | `docs/_meta/superpowers/` plan headers "Use superpowers:subagent-driven-development" → native subagent/plan-mode guidance; tidy validator paths (`validate-md-language.ts`, `validate-doc-folder.ts`) | Both | 2 (PR-2) |
| A-06 | docs-writer | Low | Skill registration parity: add `.claude/skills/meeting-facilitation/` + `.gemini/skills/meeting-facilitation/` pairs; backfill 3 missing Gemini skills; propagate per §10 | Both | 3 (PR-3) |

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-01 | `grep -riE "codegraph|neo4j|knowledge graph"` returns 0 hits in active agents/workflows/evidence-models (archive excluded) | grep + safety-audit |
| AC-02 | CLAUDE.md + GEMINI.md contain 0 "superpowers" install/leverage instructions | grep + validate-templates P-01 parity |
| AC-03 | `Skill(skill="meeting-facilitation")` recognized on both platforms; `.claude/skills` ↔ `.gemini/skills` skill counts equal | skill-lifecycle-audit.ts |
