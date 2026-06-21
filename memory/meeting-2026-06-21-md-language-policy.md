# Meeting Transcript
**Date**: 2026-06-21
**Topic**: Reducing Korean in English-only .md files — policy refinement, categorization & enforcement
**Participants**: safety-governance-manager, docs-writer, compliance-agent, safety-workflow-manager (synthesizer: audit-agent)
**Rounds**: 2
**Language**: Korean (transcript archived in English)
**Status**: Complete

---

## Context (data gathered pre-meeting)

- ~164 non-exception `.md` files contain Korean: workflows/ 92, docs/ (non-_ko) 29, skills/ 23, agents/ 16, governance (CLAUDE/GEMINI/AGENTS/CHANGELOG) 4.
- Two distinct Korean patterns observed:
  1. **Workflow READMEs**: Korean-first titles (`# 변경관리 (Change Control)`) + mostly-English body + inline Korean statute names.
  2. **Governance files**: Korean ONLY in legal citations using the `Korean-statute (English gloss)` bilingual pattern (e.g., `산업안전보건법 (OSHA-KR)`).
- Existing tooling: `validate-md-language.ts` v1.3.0 exists but (a) validates only allowlisted paths (`agents/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) — **workflows/ is NOT covered**; (b) has locale-suffix/prefix exceptions (`_ko.md`, `ko/`, `locales/ko/`) but **NO legal-term allowlist**.

---

## Transcript

**[safety-governance-manager]** (Round 1): The §4 Language Policy is clear but under-specified and under-enforced. The current binary ("English required, ko/ excepted") forces every author to re-decide whether statute names may be Korean. Proposed a **3-tier classification**:
- **Tier 1 — Korean-REQUIRED (preserve)**: statute proper nouns (산업안전보건법, 중대재해처벌법, 의약품등기준규정) and article citations (제36조). Translation would damage regulatory precision and audit-trail integrity. Preserve as `Korean (English gloss)`.
- **Tier 2 — English-REQUIRED (translate)**: prose, headings, instructions, explanations. Workflow README Korean titles fall here.
- **Tier 3 — Exception zones**: `_ko.md`, `ko/`, `locales/ko/`, `docs/_shared/*_ko.md` (existing rule).
Asked docs-writer whether this is applicable in practice.

**[docs-writer]** (Round 1): The 3-tier model is directly usable as an authoring guide. Two practical points:
1. In workflow READMEs, Tier 2 (Korean title) and Tier 1 (inline statute name) **coexist in one file** — so the migration is precision surgery (English-normalize headings + preserve legal gloss), not blanket Korean removal.
2. `validate-md-language.ts` v1.3.0 already exists but does **not cover workflows/** and has **no legal-term allowlist** — so if extended to workflows/ naively it would flag legitimate statute names as violations. The enforcement tool must be fixed before migration is meaningful. Asked compliance-agent for the boundary of statute preservation.

**[compliance-agent]** (Round 1): Statute names and article citations are **never translation targets**. "산업안전보건법 제36조" is the official Korean statute name and article number; translating to "Article 36 of the Industrial Safety and Health Act" breaks audit traceability (English renderings are unofficial/variable) and damages `legal_basis` audit-evidence integrity. Therefore Tier 1 must be `Korean original + (English gloss)` **mandatory**. To prevent inconsistent glosses, proposed a **legal/regulatory glossary as a single source of truth** (`legal-glossary.yaml` under `regulations/KR/` or `docs/_meta/`); the validator would treat only glossary keys as the Korean allowlist, and authors reference it for consistent citations. Asked SWM for acceptability from the end-user angle.

**[safety-workflow-manager]** (Round 1): Agreed on the glossary. Emphasized that workflow READMEs are read by **Korean EHS/GxP operators** — full Englishization reduces usability. Proposed a two-axis approach:
1. **English-canonical first**: normalize README body/headings to English (Tier 2), preserving statute glosses (Tier 1).
2. **`_ko.md` mirrors for high-traffic user docs only**: extend the `docs/_shared/` bilingual pattern to workflows, but only for the top 10–15 core workflows to avoid maintenance explosion; the rest get English-canonical + legal gloss only.

**[safety-governance-manager]** (Round 2): Convergence is forming on four elements: (1) 3-tier classification documented, (2) legal glossary SSOT, (3) validator extension (scope + allowlist), (4) workflow README English-normalization + selective `_ko.md`. Argued **sequencing matters**: policy §4 + glossary must be fixed first, because extending the validator without a glossary leaves the allowlist empty.

**[docs-writer]** (Round 2): Agreed on sequence: **policy → glossary → validator → migration**. Added that migrating all 92 workflow READMEs in one PR is unmanageable; proposed **per-domain incremental migration** starting with gmp (11 files) to validate the pattern, then gcp/gdp/glp/gvp/ehsconst/gasterm/ehschem, each as a separate PR. Suggested the validator enroll domains into scope **progressively** as each is migrated (gradual gate).

**[compliance-agent]** (Round 2): Agreed on sequence and incremental split. Volunteered to draft the glossary, covering all statutes the system touches (산업안전보건법, 중대재해처벌법, 약사법, K-REACH, 고압가스법, 의약품등기준규정, etc.) and articles into `legal-glossary.yaml`, which becomes the validator allowlist input. Stressed that **evidence-models JSON and workflow schema.yaml `legal_basis` fields must reference the same glossary keys**, so "docs in English, evidence citing Korean statutes" connects through a single source — otherwise a new dual-truth emerges.

**[safety-workflow-manager]** (Round 2): Agreed. Practical constraint: doing Englishization and `_ko.md` mirrors **simultaneously** doubles the workload. Recommended **sequential**: phase 1 = English-canonical only (with legal gloss preserved); phase 2 = add `_ko.md` mirrors by traffic/criticality ranking. The `docs/_shared/` pair pattern is already mature and can be replicated for the top-N workflows. This achieves "minimize Korean + English principle + exception support" in stages.

---

## Synthesis (audit-agent)

### Points of Agreement
1. Introduce **3-tier language classification** (Tier 1 statute/article = Korean + gloss preserved; Tier 2 prose/heading = English; Tier 3 exception zones `_ko.md`/`ko/`/`locales/ko/`/`docs/_shared/*_ko.md`) — unanimous.
2. **Execution sequence**: refine §4 → legal glossary SSOT → extend `validate-md-language.ts` → workflow README English-normalization (per-domain incremental) — unanimous.
3. Statute names/articles are **not translation targets**; audit-evidence integrity preserved — unanimous.
4. **`_ko.md` mirrors added to only top-N workflows, sequentially**, not blanket-applied to all 92 — unanimous.

### Open Questions / Unresolved
- **Q1**: Glossary location — `regulations/KR/legal-glossary.yaml` vs `docs/_meta/legal-glossary.yaml`. (compliance-agent recommends `regulations/KR/` alongside regulatory sources.)
- **Q2**: When the validator enrolls workflows/, whether unregistered Korean should be `error` (block) or `warn`. Recommended: warn during transition, escalate to error after stabilization.
- **Q3**: Concrete mechanism for aligning evidence-models / schema.yaml `legal_basis` fields with glossary keys (separate design task).

### Platform Parity Check (mandatory)
All deliverables affect CLAUDE.md §4 (and GEMINI.md §4 mirror), shared scripts, and shared docs/glossary → **every Action Item is Platform = Both**. No Claude-only / Antigravity-only items. ✅ No parity violation.

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | safety-governance-manager | Medium | Document 3-tier classification in §4 Language Policy (CLAUDE.md + GEMINI.md parity) | Both | Phase 1 |
| A-02 | compliance-agent | Medium | Author legal/regulatory glossary SSOT (`legal-glossary.yaml`) — includes resolving Q1 location | Both | Phase 1 |
| A-03 | automation-engineer | Low | Extend `validate-md-language.ts`: enroll workflows/ + glossary allowlist integration (resolve Q2 warn/error policy) | Both | Phase 2 (after A-02) |
| A-04 | docs-writer | Medium | Workflow README English-normalization — gmp domain (11 files) pilot PR, validate pattern | Both | Phase 2 |
| A-05 | docs-writer | Medium | After phase-1 English normalization, add `_ko.md` mirrors to top-N workflows (phase 2) | Both | Phase 3 |

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-01 | §4 documents the 3-tier classification in English with CLAUDE↔GEMINI parity | `validate-templates.ts` P-01 parity + manual review |
| AC-02 | `legal-glossary.yaml` covers all system statutes and is verified as the validator allowlist input | validator dry-run passes glossary keys |
| AC-03 | `validate-md-language.ts` covers workflows/ but passes glossary-registered Korean (warn during transition) | lint run on migrated domain |
| AC-04 | gmp domain 11 READMEs converted to English-canonical + legal gloss, safety-audit 0 errors | `bun scripts/safety-audit.ts` |
