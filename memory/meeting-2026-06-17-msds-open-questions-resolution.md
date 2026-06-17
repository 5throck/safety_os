# Meeting Transcript
**Date**: 2026-06-17
**Topic**: MSDS Domain Open Questions Resolution — spill-response / msds-parser implementation / GHS version / exposure monitoring boundary
**Participants**: pm (CSO), chemical-safety-agent, emergency-agent, occupational-health-agent, legal-agent, compliance-agent
**Rounds**: 2
**Language**: Korean (transcript archived in English per skill policy)
**Status**: Complete
**Follow-up to**: `memory/meeting-2026-06-17-msds-domain-addition.md`

---

## Context

The prior MSDS domain planning meeting (2026-06-17) identified 4 open questions requiring resolution before v1 implementation:

- **Q1**: spill-response workflow inclusion (6 core vs 6+1=7 workflows)
- **Q2**: msds-parser implementation (rule-based vs ML-based vs hybrid)
- **Q3**: GHS version management (fixed Rev 9 vs dynamic version field)
- **Q4**: Exposure monitoring boundary (MSDS domain vs occupational-health-agent)

This meeting resolved all 4 questions with concrete specifications.

**Agent roster rationale**: Added `emergency-agent` (spill-response SME) and `occupational-health-agent` (exposure monitoring boundary) to address Q1 and Q4 respectively. Kept `legal-agent` for Q3 regulatory analysis.

**Mode**: Dialogue enabled for substantive decision transparency.

---

## Transcript

### Facilitator Opening (pm / CSO)

Opened follow-up meeting to resolve 4 open questions from MSDS planning. Decision-oriented mode. Domain leads: emergency-agent → Q1, chemical-safety-agent → Q2, legal-agent → Q3, occupational-health-agent → Q4.

---

### Round 1 — Domain Recommendations

**emergency-agent (Round 1)** — Q1 spill-response:

Analyzed whether MSDS domain should directly handle spill-response. Key insight: MSDS Section 6 (Accidental Release Measures) contains critical data, but actual response is emergency-agent's job. Evaluated 3 options:

| Option | Description | Rating |
|--------|-------------|--------|
| A. Exclude from v1 | Delegate to emergency-agent | ⭐⭐ (Section 6 data fragmented) |
| B. Full inclusion | Overlaps with emergency-agent | ⭐ (duplication cost) |
| C. **Reference workflow** | MSDS provides Section 6 data + dispatch interface | ⭐⭐⭐⭐⭐ |

**Recommendation**: Option C. Reference workflow provides data + hands off to emergency-agent for execution. v1 maintains 7 workflows (6 core + 1 reference) with reference nature explicitly marked.

**chemical-safety-agent (Round 1)** — Q2 msds-parser:

Diagnosed real-world MSDS parsing complexity: Korean chemical majors (Lotte Chemical, LG Chem, Hanwha Solutions, BASF Korea, Dow Korea) each have unique formats; same company varies by product line; PDFs dominate; Korean/English mix; minor GHS classification notation variations. Evaluated options:

| Option | v1 Suitability | Accuracy | Difficulty | Maintenance |
|---------|----------------|----------|------------|-------------|
| Pure rule-based | ⭐⭐⭐⭐ | Top 5 suppliers 95%, others 60% | Low (2 weeks) | Add rule per new supplier |
| Pure ML-based | ⭐⭐ | Initial 70%, post-data 90% | High (6 weeks + data) | Retraining cost |
| **Hybrid** (rule + ML fallback) | ⭐⭐⭐⭐⭐ | Top 5 95%, others 85% | Medium (3 weeks) | Rule updates + ML retraining |

**Recommendation**: Hybrid. Rule-based primary for top 5 suppliers, ML fallback for unknown formats via external LLM API. v1 covers top 5 with rules, others use ML. Allows progressive rule DB expansion.

**legal-agent (Round 1)** — Q3 GHS version:

GHS revision history and Korean adoption:

| GHS Version | UN Issued | KR Mandated | Status |
|-------------|-----------|-------------|--------|
| Rev 7 (2017) | 2017 | 2019 | Expired |
| Rev 8 (2019) | 2019 | 2021 | Partial |
| **Rev 9 (2021)** | 2021 | 2023 | **Current KR standard** |
| Rev 10 (expected 2025) | 2025 est. | 2027 est. | Future |

Evaluated options:
- A. Fixed Rev 9 — simple but full rework at Rev 10
- B. **Version field + Rev 9 baseline** — flexible migration
- C. Multi-version support — v1 overengineering

**Recommendation**: Option B. `ghs_version: "rev9"` field mandatory in msds-record.json. Workflows/skills baseline at Rev 9. Rev 10 migration via change-control when Korea adopts (~2027).

**occupational-health-agent (Round 1)** — Q4 exposure monitoring boundary:

Clarified MSDS Section 8 (Exposure Controls/PPE) data vs actual monitoring execution:

| Item | MSDS (data) | OH Agent (execution) |
|------|-------------|----------------------|
| OEL values | ✓ (Section 8) | — |
| Workplace measurement (TWA, STEL) | ✗ | ✓ (actual sampling) |
| Special health exam targeting | Partial (Section 11) | ✓ (roster management) |
| Exposure trend tracking | ✗ | ✓ (annual trending) |
| PPE adequacy evaluation | ✓ (Section 8 recommendation) | ✓ (actual usage assessment) |

**Recommendation**: Explicit role separation. MSDS = data provider, occupational-health-agent = executor. Both agent files get explicit scope limitation statements referencing each other.

**compliance-agent (Round 1)**: Identified cross-cutting implications:
1. Reference workflow pattern reusable for future domains (gmp-recall-reference, psm-emergency-shutdown-reference)
2. External LLM API dependency requires cost/latency/privacy policy
3. Version field pattern aligns with GMP `nomenclature` common field (potential generalization)
4. Explicit role separation consistent with existing PSM↔GMP patterns

---

### Round 2 — Concrete Specifications

**emergency-agent (Round 2)**: Final spec for reference workflow:
- New schema.yaml fields: `workflow_type: reference`, `target_agent: emergency-agent`, `data_provided`, `handoff_protocol`
- safety-audit.ts v2.3.0 must handle reference workflow exception (legal_basis inherited from target_agent)

**chemical-safety-agent (Round 2)**: Final msds-parser spec:
- Mode 1 (rule-based, default): match against `rules/<supplier>.yaml`, top 5 suppliers
- Mode 2 (ML fallback, auto when rule confidence <80%): external LLM API call with 16-section extraction prompt
- Mode selection logic: rule → confidence check → fallback → manual review if ML confidence <90%
- Successful Mode 2 results feed rule DB expansion in v2

**legal-agent (Round 2)**: Final GHS version spec:
- All msds-*.json require `ghs_version: "rev9"` field
- `ghs_version_migration` object tracks migration target and due date (null until transition)
- `regulations/KR/OSHA-KR-MSDS.yaml` declares current version + transition plan
- ghs-classifier skill accepts version parameter; v1 ships Rev 9 ruleset only

**occupational-health-agent (Round 2)**: Final boundary spec:
- msds-agent.md Section B: "Scope Limitation" block (substance data only; no monitoring)
- occupational-health-agent.md Section B: "Data Dependencies" block (references MSDS domain)
- Role matrix documented in MSDS domain docs

**compliance-agent (Round 2)**: Delivered synthesis.

---

## Synthesis (compliance-agent)

### Final Decisions (All 4 Resolved)

| Issue | Decision | Implementation |
|-------|----------|----------------|
| **Q1 spill-response** | Reference workflow pattern | `chemical-spill-reference/` (data provider, dispatches to emergency-agent) |
| **Q2 msds-parser** | Hybrid (rule + ML fallback) | Top 5 suppliers rule DB + external LLM fallback (confidence-based) |
| **Q3 GHS version** | Version field + Rev 9 baseline | `ghs_version: "rev9"` mandatory + migration tracking |
| **Q4 Exposure monitoring boundary** | Explicit role separation | Both agents Section B updated with scope statements |

### v1 Scope Update (vs Prior MSDS Meeting)

| Component | Prior Plan | Updated |
|-----------|------------|---------|
| Workflows | 6-7 (spill optional) | **7** (6 core + 1 reference: chemical-spill-reference) |
| Evidence Models | 6 | 6 (all include `ghs_version` field) |
| Skills | 3 | 3 (msds-parser with Mode 1/Mode 2) |
| Agent Updates | msds-agent new | msds-agent + occupational-health-agent Section B |
| Audit Script | v2.3.0 | v2.3.0 + reference workflow exception |

### Action Items Update

| # | Owner | Tier | Deliverable | Platform | Phase / ETA |
|---|-------|------|-------------|----------|-------------|
| A-03 (modified) | swm + automation-engineer | Medium | 7 workflows (6 core + 1 reference: chemical-spill-reference). Reference workflow includes `workflow_type: reference` field | Both | Phase 4-a / 2026-07-15 |
| A-04 (modified) | swm + automation-engineer | Medium | 6 evidence models — all include `ghs_version: "rev9"` + `ghs_version_migration` fields | Both | Phase 4-a / 2026-07-15 |
| A-05 (modified) | swm + automation-engineer | Medium | msds-parser skill with Mode 1 (rule) + Mode 2 (ML fallback) + top 5 suppliers rule DB | Both | Phase 4-b / 2026-07-22 |
| A-08 (new) | sgm | Low | `agents/_shared/occupational-health-agent.md` Section B update: MSDS data dependency statement | Both | Phase 2 / 2026-07-01 |
| A-09 (new) | compliance-agent | Low | Reference workflow pattern guide: `docs/_shared/reference-workflow-pattern.md` (future domain reuse) | Both | Phase 6 / 2026-07-25 |

### Acceptance Criteria (Additions)

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-07 | `chemical-spill-reference` workflow has `workflow_type: reference` + `target_agent: emergency-agent` | schema.yaml verification |
| AC-08 | msds-parser SKILL.md defines Mode 1/Mode 2 + transition logic (confidence < 80%) | File inspection |
| AC-09 | All msds-*.json include `ghs_version` field | JSON schema verification |
| AC-10 | msds-agent.md Section B explicit occupational-health-agent role separation | File inspection |
| AC-11 | occupational-health-agent.md explicit MSDS data dependency | File inspection |
| AC-12 | safety-audit.ts relaxes legal_basis requirement for reference workflows | dry-run pass |

### Deferred to v2 Roadmap

All v1 decision items resolved. Items moved to v2:
- **v2-A**: GHS Rev 10 migration (~2027)
- **v2-B**: msds-parser ML model internalization (remove external LLM dependency)
- **v2-C**: MSDS rule DB auto-expansion (ML fallback results → rule auto-learning)
- **v2-D**: Additional supplier rule DB (beyond top 5)

---

## JSON Schema Quick Reference (Implementation Guide)

### msds-record.json (key fields)

```json
{
  "msds_id": "MSDS-YYYY-NNNN",
  "ghs_version": "rev9",
  "ghs_classification": {
    "hazard_classes": ["flammable_liquids_cat_2", "acute_toxicity_cat_3"],
    "h_statements": ["H225", "H301"],
    "p_statements": ["P210", "P301+P310"]
  },
  "ghs_version_migration": {
    "current_rev": "rev9",
    "target_rev": null,
    "migration_due_date": null
  },
  "sections": {
    "section_1_identification": { ... },
    "section_2_hazard_identification": { ... },
    "section_6_accidental_release_measures": { ... },
    "section_8_exposure_controls_ppe": {
      "oel_kr": "10 ppm",
      "oel_un": "..."
    },
    "section_11_toxicological": { ... },
    ... (16 sections total)
  }
}
```

### Reference workflow schema.yaml (chemical-spill-reference)

```yaml
schema_version: "1.0"
workflow_id: chemical-spill-reference
title: "Chemical Spill Reference (데이터 제공)"
status: active
applicability: mandatory
workflow_type: reference        # NEW: core | reference
target_agent: emergency-agent   # NEW: handoff target
legal_basis:
  - OSHA-KR Article 110
  - 위험물안전관리법
data_provided:
  - msds_section_6_data
  - recommended_ppe
  - reporting_authorities
handoff_protocol:
  trigger: "chemical_spill_event"
  dispatch_to: "emergency-agent"
  include_data: ["msds_section_6", "ghs_classification"]
```

### msds-parser Mode Selection Logic

```
1. Receive MSDS document + supplier ID
2. Attempt Mode 1 (rule-based):
   - Match against rules/<supplier>.yaml
   - Calculate confidence score (0-100%)
3. If Mode 1 confidence >= 80%:
   - Return parsed record
4. Else, attempt Mode 2 (ML fallback):
   - Call external LLM API
   - Calculate ML confidence
5. If Mode 2 confidence >= 90%:
   - Return parsed record + flag for review
   - Queue for rule DB expansion (v2)
6. Else:
   - Flag for mandatory manual review
   - Return partial record with warnings
```

### Role Separation Matrix (MSDS vs Occupational Health)

| Activity | MSDS Domain | Occupational Health Agent |
|----------|-------------|---------------------------|
| OEL/PEL/TLV values | ✓ Provides (Section 8) | References |
| Workplace measurement planning | — | ✓ Executes |
| Special health exam targeting | ✓ Provides inputs (toxicology) | ✓ Manages roster |
| PPE recommendation | ✓ Provides (Section 8) | ✓ Evaluates actual usage |
| Exposure trend tracking | — | ✓ Owns |
| Chemical inventory management | ✓ Owns | — |

---
