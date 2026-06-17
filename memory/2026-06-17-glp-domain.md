## Session Summary
feat: add GLP domain v1 — 8 workflows, 7 evidence models, 2 skills, MFDS + ME + OECD MAD alignment

## Changes

### GLP Domain v1 — Full Implementation

**Regulations**:
- `regulations/KR/MFDS-GLP.yaml` — 의약품 비임상시험
- `regulations/KR/ME-KREACH-GLP.yaml` — K-REACH 위해성평가
- `regulations/international/OECD-GLP.yaml` — OECD MAD
- `docs/domains/glp/scope.md`

**Agent**: `agents/domains/glp/glp-agent.md` (new — dual authority support)

**Industry Profile**: `industry-profiles/pharma-laboratory.yaml` (new)

**Workflows (8)** under `workflows/domains/glp/`:
- `test-article-management/`, `study-protocol/`, `study-conduct/`,
  `data-management/`, `personnel-qualification/`, `equipment-calibration/`,
  `qau-inspection/` (7 core)
- `study-inspection-reference/` (reference workflow — 3rd reference pattern application, dispatches to compliance-agent)

**Evidence Models (7)** under `evidence-models/domains/glp/`:
- All include `glp_certification_authority`, `oecd_mad_applicable`, `study_director_id`, `msds_record_ref`
- `glp-data-record.json` with ALCOA+ 9-principle compliance object

**Skills (2)** under `skills/domains/glp/`:
- `glp-data-integrity-checker/SKILL.md` — ALCOA+ validation
- `glp-study-protocol-validator/SKILL.md` — OECD Sec.8.3 verification

**Audit Script**: `scripts/safety-audit.ts` v2.4.0 → v2.5.0
- GLP workflow validation (≥3 legal_basis core, ≥2 reference)
- GLP evidence model validation (4 required fields)
- Report shows GMP + MSDS + GDP + GLP counts

**Documentation**:
- `docs/_shared/domain-onboarding-guide.md` — Active Domains Registry updated with GLP
- `CHANGELOG.md` — GLP Domain v1 entry
- 1 meeting transcript (`meeting-2026-06-17-glp-domain-planning.md`)

## Decisions
- Domain name: `glp` (Good Laboratory Practice)
- 8 workflows (7 core + 1 reference: study-inspection-reference)
- Dual authority: MFDS + ME (some facilities hold both)
- OECD MAD: Korea accession 2005, eliminates duplicate testing
- QAU: glp-agent provides functional support (not organizational replacement)
- Test article-MSDS 강결합: `msds_record_ref` 필수

## Verification
- 163 files checked, 0 errors
- 47 workflows (10 GMP, 7 MSDS, 8 GDP, 8 GLP, 14 PSM/EHS/daily/emergency)
- 42 evidence-models (11 GMP, 6 MSDS, 7 GDP, 7 GLP, 11 PSM/shared)

## Active Domains Registry (after GLP)
| Domain | Status |
|--------|--------|
| psm | active |
| gmp | active (v1) |
| msds | active (v1) |
| gdp | active (v1) |
| **glp** | **active (v1, new)** |
| gcp, gvp | planned (v3) |
