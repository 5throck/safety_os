# Meeting Transcript
**Date**: 2026-06-17
**Topic**: GMP v1 Open Questions Resolution — Electronic Signatures / Self-Inspection Cadence / ICH Q9 Integration / Terminology Policy
**Participants**: pm (CSO), legal-agent, swm (Safety Workflow Manager), compliance-agent
**Rounds**: 2
**Language**: Korean (transcript archived in English per skill policy)
**Status**: Complete
**Follow-up to**: `memory/meeting-2026-06-17-gmp-implementation-planning.md`

---

## Context

The prior GMP implementation planning meeting (2026-06-17) identified 4 open questions that required resolution before v1 implementation could begin:

- **Q1**: Electronic signature (21 CFR Part 11 equivalent) — include in v1?
- **Q2**: Self-inspection cadence — annual (KP-GMP minimum) vs quarterly?
- **Q3**: ICH Q9 (Quality Risk Management) integration — embed in gmp-agent vs standalone workflow vs cross-cutting skill?
- **Q4**: Korean vs English terminology policy for JSON keys and display names?

This meeting resolved all 4 questions with concrete JSON schema specifications.

**Agent roster rationale**: Added `legal-agent` (regulatory expertise for Q1/Q4) and `swm` (operational expertise for Q2/Q3) to the prior meeting's roster. Removed `psm-agent` and `sgm` since baseline mapping was already established.

**Mode**: Dialogue enabled for substantive decision transparency.

---

## Transcript

### Facilitator Opening (pm / CSO)

Opened follow-up meeting to resolve 4 open questions from prior planning meeting. Stated decision-oriented mode: concrete recommendations required, PM to make final call if consensus fails. Assigned primary domain leads: legal-agent → Q1/Q4, swm → Q2/Q3, compliance-agent → cross-cutting synthesis.

---

### Round 1 — Domain Recommendations

**legal-agent (Round 1)**:

**Q1 — Electronic Signature (21 CFR Part 11 equivalent)**:
- Korean regulatory basis: `식약처 고시` 「의약품 등의 기준 및 규정」 Article 12 + 「전자서명법」
- BMR/BPR and laboratory data effectively mandate electronic records/signatures
- 21 CFR Part 11 full compliance requires: (a) ALCOA+ data integrity, (b) audit trails, (c) cryptographic e-signatures, (d) access controls
- **Recommendation**: v1 includes **basic schema**, **defers cryptographic implementation to v2**. Rationale: MFDS audit practice accepts "schema-ready + policy-documented" as initial compliance state. Cryptographic module (PKI, HSM) requires separate infrastructure that would severely delay v1 timeline.

**Q4 — Korean/English Terminology Policy**:
- GMP terminology mixed in Korean regulations (e.g., `적격성평가` ↔ `자격부여` ↔ qualification)
- MFDS official audits mandate Korean official terminology
- Program stability and multi-language export require dual system
- **Recommendation**: JSON keys in English (programmatic stability), `nomenclature` object to declare Korean official + English + regulatory terms + synonyms. Workflow markdown body in Korean with English in parentheses.

**swm (Round 1)**:

**Q2 — Self-Inspection Cadence**:
- KP-GMP Chapter 15 mandates annual minimum
- Industry reality: Korean pharma companies typically run risk-based — quarterly for sterile/biologics, semi-annual for oral solids, annual for auxiliary
- Quarterly default burdens small manufacturers; annual default insufficient for high-risk products
- **Recommendation**: **default = annual** (KP-GMP minimum compliance), `risk_based_adjustment` field for quarterly/semi-annual/annual by high/medium/low risk. Skill handles `next_due` auto-calculation.

**Q3 — ICH Q9 (QRM) Integration**:
- ICH Q9 is horizontal methodology applicable to all GMP elements
- Three options evaluated:
  - Option A: Embed in gmp-agent → bloats agent, violates single-responsibility
  - Option B: Standalone workflow → isolates from other workflows, loses cross-cutting nature
  - Option C: Cross-cutting **skill** + reference field in all workflows
- **Recommendation**: **Option C**. Create `skills/gmp-qrm/SKILL.md` with ICH Q9 methodology matrix (FMEA, HACCP, FTA, PHA, HAZOP). Add `qrm_assessment` common field to all gmp-* workflows. Critical: **explicit separation from existing `risk-assessment-agent`** (EHS vs quality risk).

**compliance-agent (Round 1)**:

Observed convergence pattern across Q1-Q4: "basic schema in v1 + advanced features in v2". Two cross-cutting considerations:

- **Q1 reinforcement**: E-signature schema must be verifiable by `safety-audit.ts`. Field presence alone insufficient — audit script must enforce `e_signature.required=true` → `signer_id` + `signature_timestamp` existence.
- **Q3 reinforcement**: `gmp-qrm` skill and existing `risk-assessment-agent` role separation must be explicit in each file's Section B to avoid audit confusion. Also, HAZOP overlaps with PSM's `pha-hazop` workflow — decision needed whether gmp-qrm includes HAZOP as quality-focused variant (cQRM-HAZOP) or excludes it entirely.

---

### Round 2 — Concrete Specifications

**pm (Round 2)**: Confirmed Round 1 direction. Requested final JSON schema specifications from legal-agent (Q1/Q4) and swm (Q2/Q3).

**legal-agent (Round 2)**:

**Q1 Final Spec** — added to all `gmp-*.json`:

```json
"e_signature": {
  "required": true,
  "signer_id": "string (employee_id)",
  "signer_role": "QA_manager | production_manager | QC_analyst | reviewer",
  "signature_timestamp": "ISO-8601 with timezone",
  "signature_meaning": "approval | review | verification | execution",
  "cryptographic_hash": null
}
```

- `cryptographic_hash`: v1 allows `null`, v2 migrates to PKI-based hash
- `safety-audit.ts` validation: `required=true` enforces `signer_id` + `signature_timestamp` + `signature_meaning` presence

**Q4 Final Spec** — common field in `evidence-models/base/`:

```json
"nomenclature": {
  "key_en": "equipment_qualification",
  "display_name_ko": "설비 적격성평가",
  "display_name_en": "Equipment Qualification",
  "regulatory_term_ko": "적격성평가 (식약처 고시 제2023-XX호)",
  "synonyms": ["자격부여", "IQ/OQ/PQ", "설비 검증"]
}
```

- Workflow markdown rule: Korean on first mention with English in parentheses — e.g., "적격성평가(Equipment Qualification)는..."

**swm (Round 2)**:

**Q2 Final Spec** — added to `gmp-self-inspection-record.json`:

```json
"frequency": {
  "default": "annual",
  "risk_based_adjustment": {
    "high_risk_areas": "quarterly",
    "medium_risk_areas": "semi-annual",
    "low_risk_areas": "annual"
  },
  "risk_classification_logic": "ref: skills/gmp-self-inspection/SKILL.md#risk-matrix",
  "last_inspection": "ISO-8601",
  "next_due": "ISO-8601 (auto-calculated)"
}
```

- `next_due` auto-calculation in skill (audit-agent only validates)
- `high_risk_areas` definition: sterile manufacturing, biologics, API critical processes

**Q3 Final Spec** — new skill + common field:

`skills/gmp-qrm/SKILL.md` — ICH Q9 methodology matrix:
- **FMEA** (Failure Mode and Effects Analysis) — process failure mode evaluation
- **HACCP** (Hazard Analysis and Critical Control Points) — raw material/process hazard analysis
- **FTA** (Fault Tree Analysis) — root cause analysis
- **cQRM-HAZOP** (Quality-focused HAZOP) — quality perspective HAZOP (distinct from PSM HAZOP)
- **PHA** (Preliminary Hazard Analysis) — initial hazard assessment

Added to all `gmp-*.json`:
```json
"qrm_assessment": {
  "methodology": "FMEA | HACCP | FTA | cQRM-HAZOP | PHA",
  "risk_level": "low | medium | high | critical",
  "assessment_ref": "gmp-qrm-{id}",
  "mitigation_status": "open | closed | monitoring"
}
```

**Role separation explicit declaration**:
- `risk-assessment-agent` Section B update: "Scope limited to EHS risks (worker safety, environmental, occupational health). Quality risks handled by `gmp-qrm` skill."
- `skills/gmp-qrm/SKILL.md` Section B: "Scope limited to product quality and patient safety risks. EHS risks handled by `risk-assessment-agent`."

**compliance-agent (Round 2)**: Delivered synthesis.

---

## Synthesis (compliance-agent)

### Final Decisions (All 4 Resolved)

| Issue | Decision | Rationale |
|-------|----------|-----------|
| **Q1 Electronic Signature** | v1 basic schema included, cryptography deferred to v2 | MFDS audit practice + v1 timeline protection |
| **Q2 Self-Inspection Cadence** | default annual + risk-based adjustment | KP-GMP minimum + operational autonomy |
| **Q3 ICH Q9 Integration** | Cross-cutting skill + reference field in all workflows | Matches horizontal methodology nature |
| **Q4 Terminology Policy** | English JSON keys + `nomenclature` dual declaration | Program stability + multilingual audit support |

### v1 Scope Update (vs Prior Meeting)

| Component | Prior Plan | Updated |
|-----------|------------|---------|
| Workflows | 10 | 10 (unchanged) |
| Evidence Models | 10 | 10 + common fields added to all (`e_signature`, `qrm_assessment`, `nomenclature`) |
| Skills | 2 | **3** (+ new `gmp-qrm`) |
| Base schema | — | `evidence-models/base/` extended (3 common fields) |
| Agent updates | — | `risk-assessment-agent` Section B update (EHS scope clarification) |

### Action Items Update (Modifications + Additions)

| # | Owner | Tier | Deliverable | Platform | Phase / ETA |
|---|-------|------|-------------|----------|-------------|
| A-04 (modified) | swm + automation-engineer | Low | `evidence-models/gmp-*.json` 10 models — ALCOA+ + `e_signature` + `qrm_assessment` + `nomenclature` common fields | Both | Phase 4-a / 2026-07-15 |
| A-05 (modified) | swm + automation-engineer | Medium | **3 skills**: `gmp-change-control`, `gmp-deviation-capa`, `gmp-qrm` (new) | Both | Phase 4-b / 2026-07-22 |
| A-07 (new) | swm + automation-engineer | Medium | `evidence-models/base/` common schema extension — `e_signature`, `qrm_assessment`, `nomenclature` | Both | Phase 4-a / 2026-07-15 |
| A-08 (new) | sgm | Low | `agents/risk-assessment-agent.md` Section B update — explicit EHS scope limitation | Both | Phase 2 / 2026-06-30 |

### Acceptance Criteria (Additions)

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-06 | All `gmp-*.json` include `e_signature.signer_id` + `signature_timestamp` | `bun scripts/safety-audit.ts` passes |
| AC-07 | All `gmp-*.json` `qrm_assessment.methodology` is one of 5 ICH Q9 techniques | safety-audit.ts passes |
| AC-08 | All `gmp-*.json` include `nomenclature.display_name_ko` + `display_name_en` | JSON schema validation |
| AC-09 | `skills/gmp-qrm/SKILL.md` includes 5-technique matrix (FMEA, HACCP, FTA, cQRM-HAZOP, PHA) | PR review |
| AC-10 | `risk-assessment-agent` (EHS) and `gmp-qrm` skill (quality) role separation explicit in each Section B | Section B inspection |
| AC-11 | `safety-audit.ts` GMP extension includes `e_signature.required=true` validation logic | dry-run pass |

### Deferred to v2 Roadmap

All v1 decision items resolved. Items moved to v2:
- **v2-A**: Electronic signature cryptography (PKI/HSM)
- **v2-B**: MES/QMS/LIMS webhook integration
- **v2-C**: Sterile / API / biologics variant profiles
- **v2-D**: ICH Q12 (Lifecycle Management) evaluation

---

## JSON Schema Quick Reference (Implementation Guide)

### Common fields added to all `gmp-*.json` evidence models

```json
{
  "e_signature": {
    "required": true,
    "signer_id": "string",
    "signer_role": "QA_manager | production_manager | QC_analyst | reviewer",
    "signature_timestamp": "ISO-8601",
    "signature_meaning": "approval | review | verification | execution",
    "cryptographic_hash": null
  },
  "qrm_assessment": {
    "methodology": "FMEA | HACCP | FTA | cQRM-HAZOP | PHA",
    "risk_level": "low | medium | high | critical",
    "assessment_ref": "gmp-qrm-{id}",
    "mitigation_status": "open | closed | monitoring"
  },
  "nomenclature": {
    "key_en": "string",
    "display_name_ko": "string",
    "display_name_en": "string",
    "regulatory_term_ko": "string (with MFDS notice reference)",
    "synonyms": ["array"]
  }
}
```

### Self-inspection frequency extension (only `gmp-self-inspection-record.json`)

```json
{
  "frequency": {
    "default": "annual",
    "risk_based_adjustment": {
      "high_risk_areas": "quarterly",
      "medium_risk_areas": "semi-annual",
      "low_risk_areas": "annual"
    },
    "risk_classification_logic": "ref: skills/gmp-self-inspection/SKILL.md#risk-matrix",
    "last_inspection": "ISO-8601",
    "next_due": "ISO-8601"
  }
}
```

---
