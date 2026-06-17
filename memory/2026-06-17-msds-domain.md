## Session Summary
feat: add MSDS domain v1 — 7 workflows (incl. reference), 6 evidence models, 3 skills, OSHA-KR MSDS + K-REACH + GHS Rev 9

## Changes

### MSDS Domain v1 — Full Implementation

**Regulations**:
- `regulations/KR/OSHA-KR-MSDS.yaml` — OSHA-KR Articles 110-114 + 243
- `regulations/KR/K-REACH.yaml` — K-REACH Articles 10-14
- `docs/domains/msds/scope.md` — v1 scope document

**Agent**:
- `agents/domains/msds/msds-agent.md` (new — migrated + expanded from chemical-safety-agent)
- `agents/_shared/occupational-health-agent.md` — Section B updated with MSDS data dependency statement

**Industry Profile**:
- `industry-profiles/chemical-handling.yaml` (new)

**Workflows (7)** under `workflows/domains/msds/`:
- `msds-intake/` (schema.yaml + README.md)
- `ghs-classification/`
- `chemical-approval/`
- `chemical-inventory/`
- `kreach-registration/`
- `hazard-labeling/`
- `chemical-spill-reference/` (first reference workflow pattern application)

**Evidence Models (6)** under `evidence-models/domains/msds/`:
- `msds-record.json` — GHS 16 sections full schema
- `ghs-classification-record.json`
- `chemical-approval-record.json`
- `chemical-inventory-record.json`
- `kreach-registration-record.json`
- `hazard-label-record.json`
- All include `ghs_version: "rev9"` field with migration tracking

**Skills (3)** under `skills/domains/msds/`:
- `msds-parser/SKILL.md` — Hybrid Mode 1 (rule) + Mode 2 (ML fallback)
- `msds-parser/rules/lotte_chemical.yaml` — first supplier rule template
- `ghs-classifier/SKILL.md` — Rev 9 ruleset
- `chemical-risk-assessment/SKILL.md`

**Renamed**:
- `evidence-models/_shared/base/gmp-common.schema.json` → `common.schema.json` (multi-domain)
- GMP evidence models' $ref paths updated

**Removed**:
- `agents/_shared/chemical-safety-agent.md` (migrated to msds-agent)

**Audit Script**:
- `scripts/safety-audit.ts` v2.2.0 → v2.3.0
  - MSDS workflow validation (multi-source legal_basis ≥3 core, ≥2 reference)
  - MSDS evidence model validation (ghs_version required)
  - Reference workflow exception handling
  - Report shows GMP + MSDS counts

**Documentation**:
- `docs/_shared/reference-workflow-pattern.md` — reference workflow SOP
- `CHANGELOG.md` — MSDS Domain v1 entry added
- 2 meeting transcripts (planning + Q1-Q4 resolution)

## Decisions (4 Open Items Resolved)
- **Q1 spill-response**: Reference workflow pattern (data provider + dispatch to emergency-agent)
- **Q2 msds-parser**: Hybrid (rule-based default + ML fallback when confidence <80%)
- **Q3 GHS version**: Dynamic `ghs_version` field, Rev 9 baseline
- **Q4 exposure monitoring boundary**: Explicit role separation — MSDS provides data, occupational-health-agent executes monitoring

## Verification
- `bun scripts/safety-audit.ts` → 98 files checked, 0 errors
- 31 workflows (10 GMP, 7 MSDS, 14 PSM/EHS/daily/emergency)
- 28 evidence-models (11 GMP, 6 MSDS, 11 PSM/shared)
- Domain Onboarding SOP validated (first new domain test case)

## Open Items / v2 Roadmap
- v2-A: GHS Rev 10 migration (~2027 KR mandation)
- v2-B: msds-parser ML model internalization
- v2-C: MSDS rule DB auto-expansion (ML fallback → rule auto-learning)
- v2-D: Additional supplier rule templates (beyond Lotte Chemical)
- v2-E: spill-response execution (currently delegated to emergency-agent)
- v2-F: Multi-language MSDS support
