# Meeting Transcript
**Date**: 2026-06-17
**Topic**: MSDS / Chemical Substance Safety Domain Addition — Scope, Architecture, Component Definition
**Participants**: pm (CSO), chemical-safety-agent (SME), sgm, legal-agent, compliance-agent
**Rounds**: 3
**Language**: Korean (transcript archived in English per skill policy)
**Status**: Complete
**Trigger**: User request to add MSDS/chemical safety as new domain after PSM/GMP module completions

---

## Context

After PSM (existing) and GMP (v1 just added), the user identified MSDS / chemical substance safety as the next critical gap. Current state assessment:

| Asset | Current State | Required State |
|-------|---------------|----------------|
| Agent | `agents/_shared/chemical-safety-agent.md` (titled "MSDS Agent") | Promote to `agents/domains/msds/msds-agent.md` |
| Workflows | None | 6-7 new workflows |
| Evidence Models | None | 5-6 new evidence models |
| Skills | None | 2-3 new skills |
| Industry Profile | `chemical.yaml` is PSM-focused (not MSDS-specific) | New MSDS-focused profile |
| Regulations | None | `regulations/KR/OSHA-KR-MSDS.yaml` + `regulations/KR/K-REACH.yaml` |

The existing `chemical-safety-agent` was incorrectly classified as `_shared/` when it is actually domain-specific. The MSDS domain creation corrects this misclassification.

**Mode**: Dialogue enabled for substantive architectural decisions.

---

## Transcript

### Facilitator Opening (pm / CSO)

Opened meeting to plan MSDS/chemical safety domain addition. Stated five goals: (1) domain naming, (2) scope (pure MSDS vs integrated chemical safety), (3) component definition, (4) regulatory framework, (5) relationship with existing assets. Assigned: chemical-safety-agent → current state assessment, legal-agent → regulatory scope, sgm → architecture, compliance-agent → synthesis.

---

### Round 1 — Diagnosis and Scope

**pm (Round 1)**: Posed core questions: (1) scope (pure MSDS vs broader chemical safety including storage/handling/transport/emergency), (2) naming (`msds` vs `chemsafety` vs `sds`), (3) extend existing chemical-safety-agent or create new MSDS-specific agent.

**chemical-safety-agent (Round 1)**: Clarified current role (MSDS lifecycle, GHS classification extraction, chemical inventory, labeling, new chemical approval review) and limitations: zero workflows, zero evidence models, zero skills, ambiguous boundary with PSM. Recommended: focus v1 on MSDS/SDS document management + chemical registration/approval + GHS classification + labeling (core MSDS). Extended scope (exposure monitoring, spill response) optional via separate workflows with occupational-health-agent / emergency-agent collaboration. Recommended domain name `msds` with role description encompassing "chemical safety" broadly. Defined PSM vs MSDS boundary: PSM = process-level, MSDS = substance-level.

**legal-agent (Round 1)**: Identified multi-ministry regulatory stack:

| Law | Ministry | Key Articles | Application |
|-----|---------|--------------|-------------|
| OSHA-KR | MOEL | Articles 110-114 (MSDS submission/posting), Article 243 (GHS classification) | All workplaces handling chemicals |
| K-REACH (화학물질등록 및 평가 등에 관한 법률) | ME | New chemical registration, existing chemical evaluation | Manufacturers/importers ≥1 ton/year |
| TCCL (유해화학물질 관리법) | ME | Toxic/permitted/prohibited substance management | Toxic chemical handlers |
| 위험물안전관리법 | Fire Agency | Hazardous material storage/handling | Designated quantities |
| GHS (UN) | International | Rev 9 (2021) — Korean GHS basis | SDS 16 sections, label elements |

Recommended: (1) multi-source legal_basis (min 2 sources) per workflow, (2) v1 scope = MSDS + K-REACH + toxic chemical permit/reporting (3 pillars), (3) GHS as mandatory base format for all SDS. Warned: OSHA-KR MSDS regulations significantly strengthened in 2024 (mandatory reporting, posting duty strengthened) — must design for latest revision.

**sgm (Round 1)**: Architectural analysis. MSDS doesn't fit existing `ehs<industry>` or GxP family patterns — it is **independent domain** because: (1) horizontal nature (all industries handle chemicals), (2) cross-domain dependency (PSM, GMP, EHS all reference chemical data), (3) regulatory independence. Recommended domain name `msds`. Component estimate: 1 agent (migrate chemical-safety-agent), 6-7 workflows, 5-6 evidence models, 2-3 skills, 1 industry profile. Migration: move existing chemical-safety-agent from `_shared/` to `domains/msds/` — corrects misclassification.

**compliance-agent (Round 1)**: Identified cross-cutting implications: (1) PSM ↔ MSDS bidirectional reference (PSI includes chemical data), (2) GMP ↔ MSDS (cleaning-validation uses cleaning agents, supplier-qualification verifies chemical MSDS), (3) audit script v2.3.0 extension needed, (4) `industry-profiles/chemical.yaml` is PSM-focused (needs cleanup or new MSDS profile), (5) `docs/_shared/domain-onboarding-guide.md` SOP applies directly — first new domain addition test case.

---

### Round 2 — Component Design

**pm (Round 2)**: Confirmed Round 1 agreements: domain name `msds`, v1 scope (MSDS + K-REACH + toxic chemicals, excluding spill/transport/disposal), migrate existing agent. Requested workflow finalization, evidence model schema (especially GHS 16 sections), skill definitions, and cross-domain reference plan.

**chemical-safety-agent (Round 2)**: Final workflow list:

1. **msds-intake** — Receive MSDS from suppliers, format validation, parsing (OSHA-KR Article 110)
2. **ghs-classification** — Extract GHS Rev 9 hazard classification (16 sections) (OSHA-KR Article 243 + GHS)
3. **chemical-approval** — New chemical introduction approval (verify permitted/prohibited) (OSHA-KR Article 113, TCCL)
4. **chemical-inventory** — Onsite inventory management, monthly change reporting (K-REACH Article 10)
5. **kreach-registration** — Annual ≥1 ton chemical registration with Ministry of Environment (K-REACH Article 11)
6. **hazard-labeling** — GHS warning label/sign generation and attachment verification (OSHA-KR Article 114, GHS)
7. *(optional)* **spill-response** — Chemical spill emergency response procedure (위험물안전관리법)

Proposed 6 evidence models (1:1 with workflows). Detailed `msds-record.json` schema covering GHS 16 sections (Identification, Hazard ID, Composition, First-aid, Fire-fighting, Accidental release, Handling/storage, Exposure controls/PPE, Physical/chemical properties, Stability/reactivity, Toxicological, Ecological, Disposal, Transport, Regulatory, Other).

**legal-agent (Round 2)**: Required multi-source legal_basis per workflow:

| Workflow | Legal Basis (min 2) |
|----------|---------------------|
| msds-intake | OSHA-KR Article 110 + GHS Rev 9 |
| ghs-classification | OSHA-KR Article 243 + GHS Rev 9 |
| chemical-approval | OSHA-KR Article 113 + TCCL |
| chemical-inventory | K-REACH Article 10 + OSHA-KR Article 110 |
| kreach-registration | K-REACH Article 11 + 환경부 고시 |
| hazard-labeling | OSHA-KR Article 114 + GHS Rev 9 |
| spill-response | 위험물안전관리법 + OSHA-KR |

New regulations files: `regulations/KR/OSHA-KR-MSDS.yaml` + `regulations/KR/K-REACH.yaml`. Noted GHS Rev 9 → Rev 10 transition expected 2025; version field mandatory.

**sgm (Round 2)**: Phase planning (PSM/GMP pattern):

| Phase | Deliverable | Owner | Tier | ETA |
|-------|-------------|-------|------|-----|
| Phase 1 | regulations + scope doc | sgm + legal-agent | Medium | 1 week |
| Phase 2 | msds-agent.md + industry-profiles/chemical-handling.yaml | sgm + pm | Medium | 1 week |
| Phase 4-a | 6-7 workflows + 6 evidence models (GHS 16 sections) | swm + automation-engineer | Medium | 2 weeks |
| Phase 4-b | 2-3 skills | swm + automation-engineer | Medium | 1 week |
| Phase 6 | safety-audit.ts v2.3.0 + audit pass | audit-agent | Low | 3 days |

Defined cross-domain reference fields:
- PSM psi-management: add `msds_record_ids` field
- GMP cleaning-validation: add `cleaning_agent_msds_ref` field
- GMP supplier-qualification: add `msds_verification_required` attribute

Three skills defined:
1. **msds-parser** — PDF/HTML MSDS document parsing with format variations (top 30 Korean chemical supplier formats)
2. **ghs-classifier** — Auto GHS classification from composition, H/P-Statement mapping
3. **chemical-risk-assessment** — Use-scenario based hazard evaluation (inhalation/dermal/ingestion exposure)

**compliance-agent (Round 2)**: Delivered synthesis.

---

## Synthesis (compliance-agent)

### Points of Agreement

1. **Domain name**: `msds` (Material Safety Data Sheet domain / 화학물질안전보건자료)
2. **v1 scope**: MSDS lifecycle + GHS classification + chemical approval + inventory + K-REACH registration + labeling (6 core workflows)
3. **v2 exclusions**: spill-response, transport, disposal (covered by 위험물안전관리법 / 폐기물법)
4. **Existing asset migration**: `chemical-safety-agent` from `agents/_shared/` → `agents/domains/msds/msds-agent.md` (corrects misclassification)
5. **Multi-source legal_basis**: every workflow min 3 sources (OSHA-KR + TCCL/K-REACH + GHS)
6. **GHS 16 sections**: `msds-record.json` includes all standard GHS sections (international compatibility)
7. **Cross-domain references**: PSM (PSI), GMP (cleaning-validation, supplier-qualification) bidirectionally link to MSDS records

### Open Disagreements / Unresolved Questions

1. **Skill implementation difficulty**: `msds-parser` faces supplier format variation challenges — rule-based for v1, ML extension for v2?
2. **GHS classification update cadence**: GHS Rev 9 → Rev 10 (expected 2025) transition. Mandatory version field?
3. **Exposure monitoring boundary**: overlaps with occupational-health-agent. MSDS domain provides substance data, monitoring is occupational-health-agent responsibility — explicit boundary?
4. **K-REACH registration thresholds**: annual 1 ton vs 0.5 ton (specific substances). Threshold logic in skill?

### Concrete Action Items

**Platform Parity Check**: Action Items affect domain content — Both platforms.

| # | Owner | Tier | Deliverable | Platform | Phase / ETA |
|---|-------|------|-------------|----------|-------------|
| A-01 | sgm + legal-agent | Medium | `regulations/KR/OSHA-KR-MSDS.yaml` + `regulations/KR/K-REACH.yaml` + scope doc (GHS, MSDS, K-REACH mapping) | Both | Phase 1 / 2026-06-24 |
| A-02 | sgm + pm | Medium | `agents/domains/msds/msds-agent.md` (migrate + expand from chemical-safety-agent) + `industry-profiles/chemical-handling.yaml` | Both | Phase 2 / 2026-07-01 |
| A-03 | swm + automation-engineer | Medium | 6-7 workflows under `workflows/domains/msds/{msds-intake, ghs-classification, chemical-approval, chemical-inventory, kreach-registration, hazard-labeling, spill-response(optional)}/` — all multi-source legal_basis | Both | Phase 4-a / 2026-07-15 |
| A-04 | swm + automation-engineer | Medium | 6 evidence models under `evidence-models/domains/msds/` — `msds-record.json` with GHS 16 sections + 5 more | Both | Phase 4-a / 2026-07-15 |
| A-05 | swm + automation-engineer | Medium | 3 skills under `skills/domains/msds/{msds-parser, ghs-classifier, chemical-risk-assessment}/` | Both | Phase 4-b / 2026-07-22 |
| A-06 | audit-agent | Low | `scripts/safety-audit.ts` v2.3.0: MSDS domain validation (multi-source legal_basis + GHS 16 sections completeness) | Both | Phase 6 / 2026-07-25 |
| A-07 | pm + automation-engineer | Medium | Cross-domain reference fields: PSM psi-management `msds_record_ids`, GMP cleaning-validation `cleaning_agent_msds_ref`, supplier-qualification `msds_verification_required` | Both | Phase 4-a / 2026-07-15 |

### Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-01 | All MSDS workflows have multi-source legal_basis (≥3 entries: OSHA-KR + 환경부 + GHS) | `bun scripts/safety-audit.ts` passes |
| AC-02 | `msds-record.json` includes all GHS 16 sections fields | JSON schema validation |
| AC-03 | msds-agent.md Section A includes min 4 regulatory sources (OSHA-KR, K-REACH, TCCL, GHS) | File inspection |
| AC-04 | Legacy `chemical-safety-agent.md` removed from `_shared/` | git status check |
| AC-05 | PSM PSI and GMP cleaning-validation/supplier-qualification include MSDS reference fields | schema.yaml verification |
| AC-06 | `domain-onboarding-guide.md` 11-step procedure followed | Procedure checklist verification |

### Open Items (User Decision Required)

1. **spill-response inclusion**: 6 core + spill-response = 7 workflows total, or defer spill-response to v2?
2. **Skill implementation**: `msds-parser` rule-based (accurate but low extensibility) vs ML-based (flexible but lower initial accuracy)?
3. **GHS version management**: Fixed at Rev 9, or dynamic version field?
4. **Exposure monitoring boundary**: Explicitly state MSDS provides data only, occupational-health-agent handles monitoring?

---

## v1 vs v2 Scope Reference

### v1 (Included)
- MSDS document lifecycle (16 GHS sections)
- GHS Rev 9 classification
- New chemical approval (TCCL permitted/prohibited checks)
- Chemical inventory (monthly reporting)
- K-REACH registration (≥1 ton/year)
- GHS hazard labeling

### v2 (Deferred)
- Chemical spill emergency response
- Chemical transport (UN model regulations)
- Chemical waste disposal (폐기물법)
- ML-based msds-parser (advanced supplier format handling)
- GHS Rev 10 transition
- Real-time exposure monitoring integration

---

## Regulatory Framework Stack (Korea MSDS)

| Law | Korean Name | Ministry | Coverage |
|-----|-------------|---------|----------|
| OSHA-KR | 산업안전보건법 | MOEL | Articles 110-114 (MSDS), 243 (GHS) |
| K-REACH | 화학물질등록 및 평가 등에 관한 법률 | ME | Registration, evaluation |
| TCCL | 유해화학물질 관리법 | ME | Toxic substance management |
| 위험물안전관리법 | 위험물안전관리법 | 소방청 | Hazardous material storage (v2) |
| GHS | UN GHS Rev 9 | International | SDS 16 sections, label pictograms |

---
