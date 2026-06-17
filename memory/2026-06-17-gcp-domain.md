## Session Summary
feat: add GCP domain v1 — 8 workflows, 7 evidence models, 2 skills, KGCP + ICH E6(R3) + Helsinki alignment

## Changes

### GCP Domain v1 — Full Implementation

**Regulations**:
- `regulations/KR/MFDS-GCP.yaml` — 의약품 임상시험 관리기준
- `regulations/international/ICH-E6.yaml` — ICH E6(R3) + Helsinki
- `docs/domains/gcp/scope.md`

**Agent**: `agents/domains/gcp/gcp-agent.md` (new)

**Industry Profile**: `industry-profiles/clinical-research.yaml` (new)

**Workflows (8)** under `workflows/domains/gcp/`:
- `protocol-management/`, `irb-review/`, `informed-consent/`,
  `participant-enrollment/`, `monitoring-visits/`, `sae-reporting/`,
  `source-data-verification/` (7 core)
- `sae-reporting-reference/` (reference workflow — 4th reference pattern application, dispatches to emergency-agent for severe safety signals)

**Evidence Models (7)** under `evidence-models/domains/gcp/`:
- All include `irb_approval_ref`, `ich_e6_compliance`, `protocol_ref`, `site_id`
- `gcp-sae-record.json` with causality assessment (ImPACT/WHO-UMC/Naranjo)
- `gcp-source-data-record.json` with ALCOA+ compliance object

**Skills (2)** under `skills/domains/gcp/`:
- `protocol-deviation-analyzer/SKILL.md` — ICH E6(R3) classification
- `sae-causality-assessor/SKILL.md` — Multi-algorithm causality assessment

**Audit Script**: `scripts/safety-audit.ts` v2.5.0 → v2.6.0
- GCP workflow validation (≥3 legal_basis core, ≥2 reference)
- GCP evidence model validation (4 required fields)
- Report shows GMP + MSDS + GDP + GLP + GCP counts

**Documentation**:
- `docs/_shared/domain-onboarding-guide.md` — Active Domains Registry updated with GCP
- `CHANGELOG.md` — GCP Domain v1 entry

## Decisions
- Domain name: `gcp` (Good Clinical Practice)
- 8 workflows (7 core + 1 reference: sae-reporting-reference)
- ICH E6(R3) baseline (current 2025 version)
- Safety reporting per ICH E2A (SUSAR 7/15 days)
- 4 required common fields: irb_approval_ref, ich_e6_compliance, protocol_ref, site_id
- Multi-algorithm causality assessment (ImPACT/WHO-UMC/Naranjo)

## Verification
- 195 files checked, 0 errors
- 55 workflows (10 GMP, 7 MSDS, 8 GDP, 8 GLP, 8 GCP, 14 PSM/EHS)
- 49 evidence-models (11 GMP, 6 MSDS, 7 GDP, 7 GLP, 7 GCP, 11 PSM/shared)

## Active Domains Registry (after GCP)
| Domain | Status |
|--------|--------|
| psm | active |
| gmp | active (v1) |
| msds | active (v1) |
| gdp | active (v1) |
| glp | active (v1) |
| **gcp** | **active (v1, new)** |
| gvp | planned (v3) |
