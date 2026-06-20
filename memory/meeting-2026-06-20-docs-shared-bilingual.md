# Meeting Transcript
**Date**: 2026-06-20
**Topic**: docs/_shared folder bilingual document structure reorganization
**Participants**: docs-writer, compliance-agent, audit-agent (synthesizer)
**Rounds**: 2
**Language**: Korean (transcript saved in English)
**Status**: Complete

---

## Context

The `docs/_shared/` directory contains 8 user-facing markdown documents with inconsistent
bilingual handling. Investigation revealed:

- Only `user-scenarios.md` (EN) + `user-scenarios_ko.md` (KO) form a complete bilingual pair.
- 2 files are Korean content but lack the `_ko` suffix: `domain-classification-guide.md`
  (1288 Korean chars), `tutorial.md` (3377 Korean chars).
- 4 English-only files have no Korean counterpart: `domain-onboarding-guide.md`,
  `mcp-integration-guide.md`, `reference-workflow-pattern.md`, `user-guide.md`.
- README.md (EN) labels `domain-classification-guide.md` as "EN" though content is Korean.
- README_ko.md links English-only docs directly to Korean users.
- Tension with CLAUDE.md section 4 "docs/ English only" policy, though `_ko` convention
  already exists de facto via `user-scenarios_ko.md`.
- `.DS_Store` junk present in the folder.

## Transcript

### Round 1

**docs-writer**: The most urgent issue is naming-convention asymmetry. Only `user-scenarios`
follows the `<name>.md` (EN canonical) + `<name>_ko.md` (KO mirror) pattern. Proposal:
adopt this as the official convention for all `_shared` docs. EN should be the canonical
language — consistent with CLAUDE.md section 4, global contributor accessibility, and a
clean one-way translate flow. Requires 6 translation/new-doc tasks + 2 renames.

**compliance-agent**: Agree on EN-canonical, but the policy conflict must be resolved first.
CLAUDE.md section 4 says docs/ is English-only except `ko/` or `locales/ko/`. Yet
`user-scenarios_ko.md` already exists in `docs/_shared/` — the `_ko` suffix exception is
de facto allowed but not a documented rule. Proposal: formally amend the policy to state
"user-facing docs in `docs/_shared/` may use `<name>.md` (EN) + `<name>_ko.md` (KO) pairs;
governance/regulation documents (`docs/constitution/`, `docs/_meta/`, regulation sources)
remain English-only." This makes it a sanctioned exception category, not a violation. Also
add `.DS_Store` to `.gitignore`.

**audit-agent**: Both views support a verification angle. Manual link/pair checking will
re-drift — the recent classification-guide stale incident is evidence. Add a docs bilingual
consistency check to `safety-audit.ts`: (1) every EN base in `_shared/` must have a `_ko`
pair (warning if missing); (2) detect `_ko`-suffix-less files with Korean content (error);
(3) README.md links point to EN bases, README_ko.md to `_ko` versions. But the 6 translation
tasks are a prerequisite — adding the check first would flood errors. Order: rename +
translate -> add audit check -> CI gate. Policy amendment must also propagate to
README/CLAUDE.md.

### Round 2

**docs-writer**: Agree with the sequence. Add a workload classification: small
(`mcp-integration-guide` 2.4KB, `user-guide` 4KB); medium (`reference-workflow-pattern` 6.7KB,
`domain-onboarding-guide` 8.2KB); large/reverse (`domain-classification-guide` 8.1KB and
`tutorial` 17.9KB, both KO-original needing fresh EN canonical versions). For the large
reverse cases, docs-writer (Medium) authors the EN base while audit-agent verifies
legal_basis/structural consistency and compliance-agent verifies regulatory citation
accuracy — a 3-way check. README rows should use `**[EN](...) / [KO](..._ko.md)**` paired links.

**compliance-agent**: Endorse the 3-way check. Scope of policy amendment affects:
`CLAUDE.md` section 4 + `GEMINI.md` counterpart; `README.md` / `README_ko.md` index rebuild;
`.gitignore` for `.DS_Store`. Note `docs/domains/*/scope.md` bilingual state is a separate
agenda — recommend deferring scope-doc multilingualization to a later meeting to keep this
conclusion focused.

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | docs-writer | Medium | Author EN canonical `domain-classification-guide.md`; rename existing KO to `domain-classification-guide_ko.md` | Both | 1 |
| A-02 | docs-writer | Medium | Author EN canonical `tutorial.md`; rename existing KO to `tutorial_ko.md` | Both | 1 |
| A-03 | docs-writer | Medium | Author `_ko` mirrors for 4 EN-only docs (`user-guide`, `mcp-integration-guide`, `reference-workflow-pattern`, `domain-onboarding-guide`) | Both | 1 |
| A-04 | compliance-agent | Low | Amend CLAUDE.md section 4 + GEMINI.md to document `_shared` bilingual exception; add `.DS_Store` to `.gitignore` | Both | 1 |
| A-05 | docs-writer | Medium | Rebuild README.md / README_ko.md doc index with EN/KO paired links | Both | 2 |
| A-06 | audit-agent | Low | Add docs bilingual consistency check to `safety-audit.ts` (pair existence, `_ko`-less KO-content detection, README link language) | Both | 2 |

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | Every EN base in `_shared/` has a `_ko` pair | `bun scripts/safety-audit.ts` docs check 0 errors |
| AC-2 | Zero `_ko`-suffix-less files with Korean content | Same docs check |
| AC-3 | README.md links to EN bases; README_ko.md links to `_ko` versions | README link check PASS |
| AC-4 | CLAUDE.md / GEMINI.md section 4 documents the exception | Manual review + `bun scripts/audit.ts` |

## Open Questions (deferred)

- Translation quality cycle (one-time build vs continuous sync) — assumed one-time manual sync; automation deferred to v2.
- `docs/domains/*/scope.md` multilingualization scope/priority — separate meeting.
