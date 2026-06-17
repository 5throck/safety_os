# Meeting Transcript
**Date**: 2026-06-17
**Topic**: GMP (Good Manufacturing Practice) Implementation Planning — Benchmarking Existing PSM Implementation Level
**Participants**: pm (CSO), psm-agent, sgm (Safety Governance Manager), compliance-agent
**Rounds**: 3
**Language**: Korean (transcript archived in English per skill policy)
**Status**: Complete

---

## Context

Safety-OS has an established Process Safety Management (PSM) module at the following level:
- 1 agent (`agents/psm-agent.md` — OSHA-KR Article 44)
- 7 workflows (`workflows/psm/`: psi-management, pha-hazop, moc-process, pssr-review, mi-inspection, sop-management, contractor-management)
- 7 evidence models (`evidence-models/psm-*.json`)
- 1 skill (`skills/psm-moc/`)

The user requested a meeting to plan an equivalent-level GMP module implementation, benchmarking the PSM architecture.

**Agent substitution note**: `architect` agent is not registered in the safety-os variant; `psm-agent` substituted as the PSM baseline expert (provides benchmarking source).

**Mode deviation**: Dialogue mode was enabled for substantive planning (default is Silent) to surface reasoning for user validation.

---

## Transcript

### Facilitator Opening (pm / CSO)

Opened the meeting to plan GMP module implementation as the next safety-os extension. Established three framing questions: (1) regulatory scope (KP-GMP only vs PIC/S alignment vs FDA cGMP), (2) mirror PSM architecture vs adapt, (3) safety-os role limited to compliance documentation vs MES/QMS integration. PM acted solely as facilitator without injecting opinions during rounds.

---

### Round 1 — Baseline and Scope

**pm (Round 1)**: Posed the three framing questions. Requested PSM baseline summary from psm-agent, regulatory scope from sgm, and gap analysis from compliance-agent.

**psm-agent (Round 1)**: Summarized PSM architecture (1 agent + 7 workflows + 7 evidence models + 1 skill, all under OSHA-KR Article 44). Identified three key lessons: (1) `legal_basis` field is mandatory per `safety-audit.ts`, (2) evidence-model JSON must follow ALCOA+ principles, (3) 1-agent-N-workflows pattern works well. Highlighted essential difference: PSM = worker safety; GMP = product quality + patient safety — must remain parallel modules, not merged. Noted MOC pattern is 90% reusable for GMP Change Control.

**sgm (Round 1)**: Presented four regulatory framework options (KP-GMP, PIC/S, WHO, ICH Q7/Q10). Recommended KP-GMP as base with PIC/S alignment (most Korean pharma companies export). Proposed `industry-profiles/pharma-manufacturing/` with sub-variants (sterile, API, biologics); v1 focused on `pharma-general`. Asked compliance-agent for gap analysis.

**compliance-agent (Round 1)**: Identified 5 PQS pillars GMP requires beyond PSM scope (Quality System/ICH Q10, Personnel & Hygiene, Premises & Equipment, Documentation & Records with ALCOA+ and 21 CFR Part 11, Self-Inspection). Listed GMP-unique workflow requirements: Deviation Management, CAPA, Cleaning Validation, CSV, Stability Testing, Supplier Qualification. Flagged risk: PSM uses single legal basis (OSHA-KR Article 44), but GMP requires multi-source (약사법 Article 34 + 의약품등기준규정 + ICH Q7/Q10 + PIC/S Annexes). Recommended extending `evidence-models/base/` with multi-legal-basis schema.

---

### Round 2 — Detailed Design

**pm (Round 2)**: Crystallized Round 1 agreement — KP-GMP + PIC/S alignment, mirror PSM architecture. Posed new question: include sub-domains (sterile/API/biologics) in v1 or defer to v2?

**psm-agent (Round 2)**: Provided PSM → GMP element mapping table:

| PSM Element | GMP Equivalent | Reusability |
|-------------|----------------|-------------|
| PSI | Site Master File + Quality Manual | New design |
| PHA-HAZOP | Process Validation Risk Assessment | Partial reuse |
| MOC | Change Control | 90% reuse (incl. skill) |
| PSSR | Process Performance Qualification (PPQ) | Pattern reuse |
| MI | Equipment Qualification + Calibration | Partial reuse |
| SOP | Batch Manufacturing Records (BMR) | New design |
| Contractor Mgmt | Supplier Qualification + Contract Manufacturer | Partial reuse |

Proposed 3 GMP-unique workflows: `deviation-capa.md`, `cleaning-validation.md`, `csv-validation.md`. Total: 10 workflows. Proposed 2 skills: `skills/gmp-change-control/` (reuse psm-moc pattern), `skills/gmp-deviation-capa/`.

**sgm (Round 2)**: Provided Phase planning:

| Phase | Deliverable | Owner | Tier |
|-------|-------------|-------|------|
| Phase 1 | GMP scope doc + `regulations/KR/MFDS-GMP.md` | sgm | Medium |
| Phase 2 | `agents/gmp-agent.md` + `industry-profiles/pharma-general/` | sgm + pm | Medium |
| Phase 4 | 10 workflows + 10 evidence models + 2 skills | swm + automation-engineer | Medium |
| Phase 6 | GMP compliance audit (`safety-audit.ts` extension) | audit-agent | Low |

Recommended v1 focus on `pharma-general`; defer sterile/API/biologics to v2 variants. Listed required gmp-agent.md Section A items: 약사법 Article 34, 의약품등기준규정 (MFDS 고시), ICH Q7/Q10, PIC/S PE 009.

**compliance-agent (Round 2)**: Proposed 10 evidence models with ALCOA+ fields: gmp-change-control, gmp-deviation, gmp-capa, gmp-batch, gmp-supplier, gmp-stability, gmp-self-inspection, gmp-cleaning-validation, gmp-csv, gmp-equipment-qualification. Defined 5 GMP KPIs for gmp-agent.md (100% critical process validation, <2% deviation rate, 100% batch review within 30 days, 0 CAPAs >90 days overdue, 100% supplier qualification). Recommended v1 limit to compliance documentation; defer MES/QMS/LIMS integration to v2 webhook APIs.

---

### Round 3 — Convergence and Execution Plan

**pm (Round 3)**: Confirmed convergence on (1) mirror PSM architecture, (2) KP-GMP + PIC/S alignment, (3) v1 limited to `pharma-general`, (4) v1 documentation-only scope. Asked whether single-epic or multi-PR strategy preferred.

**psm-agent (Round 3)**: Recommended single epic split across multiple PRs (same pattern as PSM). 4-PR split: PR-1 (Phase 1-2), PR-2 (Phase 4-a workflows + evidence models), PR-3 (Phase 4-b skills + audit script), PR-4 (Phase 6 audit pass). Critical lesson: PSM's single-source legal_basis caused migration cost during regulation updates; GMP must start with multi-source legal_basis structure.

**sgm (Round 3)**: Agreed with PR split strategy. Provided target schedule:

| Phase | Deliverable | Target Date |
|-------|-------------|-------------|
| Phase 1 | Regulations + scope doc | 2026-06-24 (1 week) |
| Phase 2 | gmp-agent + industry profile | 2026-06-30 (1 week) |
| Phase 4-a | 10 workflows + 10 evidence models | 2026-07-15 (2 weeks) |
| Phase 4-b | 2 skills + audit script extension | 2026-07-22 (1 week) |
| Phase 6 | Audit pass + CHANGELOG | 2026-07-25 |

**compliance-agent (Round 3)**: Delivered synthesis.

---

## Synthesis (compliance-agent)

### Points of Agreement

1. **Architecture Principle**: Mirror PSM architecture — `gmp-agent.md` + `workflows/gmp/` (10) + `evidence-models/gmp-*.json` (10) + `skills/gmp-*` (2)
2. **Regulatory Scope**: KP-GMP base (약사법 Article 34 + 의약품등기준규정) + PIC/S PE 009 alignment + ICH Q7/Q10 reflection
3. **v1 Domain Limit**: `pharma-general` (general pharmaceuticals). Sterile / API / biologics deferred to v2 variants.
4. **PSM Element Reusability**: MOC → Change Control 90% reusable (incl. skill). Other 6 elements partial reuse or new design.
5. **Multi-source legal_basis**: Every GMP workflow must reference ≥2 regulatory sources (PSM lesson applied).
6. **External System Integration**: v1 limited to compliance documentation. MES/QMS/LIMS integration deferred to v2 webhook APIs.
7. **PR Split**: 4 PRs across phases (Phase 1-2 / 4-a / 4-b / 6).

### Open Disagreements / Unresolved Questions

1. **Data Integrity (21 CFR Part 11 equivalent)**: Include electronic signature logic in v1? (PSM did not require it; GMP effectively mandates it.)
2. **Self-Inspection Cadence**: KP-GMP mandates annual minimum; some companies run quarterly. Default cadence undecided.
3. **ICH Q9 (Quality Risk Management) Integration**: Embed inside gmp-agent, or extract as standalone workflow?
4. **Korean vs English Terminology**: GMP has mixed Korean terminology (예: 적격성평가 vs 자격부여). Decision on JSON key language (English) vs display name (Korean) pending.

### Action Items

**Platform Parity Check**: Action Items affect `agents/*.md`, `workflows/*.md`, `evidence-models/*.json` — these are domain-specific content shared across Claude/Antigravity platforms (per AGENTS.md §5). All Action Items marked Platform = Both. CLAUDE.md/GEMINI.md not modified → no platform parity work needed.

| # | Owner | Tier | Deliverable | Platform | Phase / ETA |
|---|-------|------|-------------|----------|-------------|
| A-01 | sgm | Medium | `regulations/KR/MFDS-GMP.md` + GMP scope document (KP-GMP + PIC/S + ICH mapping) | Both | Phase 1 / 2026-06-24 |
| A-02 | sgm + pm | Medium | `agents/gmp-agent.md` (Section A: 약사법 Art 34 + 의약품등기준규정 + ICH Q7/Q10; 5 KPIs) | Both | Phase 2 / 2026-06-30 |
| A-03 | swm + automation-engineer | Medium | `workflows/gmp/` 10 workflows (change-control, deviation-capa, cleaning-validation, csv-validation, batch-mfg, supplier-qualification, stability, self-inspection, equipment-qualification, pqr) — all with multi-source legal_basis | Both | Phase 4-a / 2026-07-15 |
| A-04 | swm + automation-engineer | Low | `evidence-models/gmp-*.json` 10 evidence models (ALCOA+ fields + audit_trail field) | Both | Phase 4-a / 2026-07-15 |
| A-05 | swm + automation-engineer | Medium | `skills/gmp-change-control/SKILL.md` (psm-moc pattern) + `skills/gmp-deviation-capa/SKILL.md` (new) | Both | Phase 4-b / 2026-07-22 |
| A-06 | audit-agent | Low | `scripts/safety-audit.ts` GMP extension — multi-source legal_basis validation for gmp-* workflows | Both | Phase 4-b / 2026-07-22 |

### Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-01 | A-02 gmp-agent.md includes ≥3 regulatory references in Section A | `bun scripts/safety-audit.ts` passes |
| AC-02 | A-03 all workflows include multi-source legal_basis | `bun scripts/safety-audit.ts` passes |
| AC-03 | A-04 all evidence models include `audit_trail` field (ALCOA+) | JSON schema validation |
| AC-04 | A-06 audit script recognizes all 10 GMP workflows | Dry-run output inspection |
| AC-05 | v1 release notes in CHANGELOG.md mention "GMP module v1" | Pre-merge verification |

---

## PSM → GMP Element Mapping (Reference)

| PSM Element | GMP Equivalent | Reusability |
|-------------|----------------|-------------|
| PSI (Process Safety Information) | Site Master File + Quality Manual | New design |
| PHA-HAZOP | Process Validation Risk Assessment | Partial reuse |
| MOC (Management of Change) | Change Control | 90% reuse (incl. skill) |
| PSSR (Pre-Startup Safety Review) | Process Performance Qualification (PPQ) | Pattern reuse |
| MI (Mechanical Integrity) | Equipment Qualification + Calibration | Partial reuse |
| SOP | Batch Manufacturing Records (BMR) | New design |
| Contractor Management | Supplier Qualification + Contract Manufacturer | Partial reuse |

**GMP-Unique New Workflows**: deviation-capa, cleaning-validation, csv-validation
**Total GMP Workflows**: 10 (PSM 7 mapped + 3 new)

---

## Regulatory Framework Stack (Reference)

| Framework | Basis | Application |
|-----------|-------|-------------|
| KP-GMP | MFDS 고시 「의약품 등의 기준 및 규정」 + 약사법 Art 34 | Domestic manufacture/import (mandatory) |
| PIC/S GMP | PE 009 Annexes | Mutual recognition for export (recommended) |
| WHO GMP | WHO TRS | Developing country public procurement |
| ICH Q7/Q10 | ICH Guidelines | API quality systems (global standard) |

---
