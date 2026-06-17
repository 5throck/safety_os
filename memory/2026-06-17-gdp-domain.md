## Session Summary
feat: add GDP domain v1 — 8 workflows (incl. reference), 7 evidence models, 2 skills, KGDP + DTS + PIC/S alignment

## Changes

### GDP Domain v1 — Full Implementation

**Regulations**:
- `regulations/KR/MFDS-GDP.yaml` — KGDP framework
- `regulations/KR/DTS.yaml` — Drug Tracking System
- `docs/domains/gdp/scope.md`

**Agent**: `agents/domains/gdp/gdp-agent.md` (new)

**Industry Profile**: `industry-profiles/pharma-distribution.yaml` (new)

**Workflows (8)** under `workflows/domains/gdp/`:
- `goods-receipt/`, `storage-management/`, `temperature-monitoring/`,
  `transportation/`, `traceability-dts/`, `returned-goods/`,
  `gdp-self-inspection/` (7 core)
- `product-recall-reference/` (reference workflow — 2nd reference pattern application)

**Evidence Models (7)** under `evidence-models/domains/gdp/`:
- All include `gdp_certification_status`, `temperature_condition`, `batch_disposition_approved_ref`
- `gdp-temperature-monitoring-record.json` with time-series data
- `gdp-dts-tracking-record.json` for Korean DTS compliance

**Skills (2)** under `skills/domains/gdp/`:
- `temperature-excursion-analyzer/SKILL.md` — cold chain impact assessment
- `dts-verification/SKILL.md` — barcode/RFID verification

**Audit Script**: `scripts/safety-audit.ts` v2.3.0 → v2.4.0
- GDP workflow validation (≥3 legal_basis core, ≥2 reference)
- GDP evidence model validation (required fields)
- Report shows GMP + MSDS + GDP counts

**Documentation**:
- `docs/_shared/domain-onboarding-guide.md` — Active Domains Registry updated
- `CHANGELOG.md` — GDP Domain v1 entry
- 1 meeting transcript (`meeting-2026-06-17-gdp-domain-planning.md`)

## Decisions
- Domain name: `gdp` (Korean Good Distribution Practice)
- 8 workflows (7 core + 1 reference: product-recall-reference)
- DTS as separate workflow + regulation (Korea-specific)
- Reference workflow pattern reused (from MSDS chemical-spill-reference)
- Self-inspection pattern reused (from GMP)
- Cross-domain fields: `gdp_certification_status`, `temperature_condition`, `batch_disposition_approved_ref`

## Verification
- 130 files checked, 0 errors
- 39 workflows (10 GMP, 7 MSDS, 8 GDP, 14 PSM/EHS/daily/emergency)
- 35 evidence-models (11 GMP, 6 MSDS, 7 GDP, 11 PSM/shared)

## Active Domains Registry (after GDP)
| Domain | Status |
|--------|--------|
| psm | active |
| gmp | active (v1) |
| msds | active (v1) |
| **gdp** | **active (v1, new)** |
| glp, gcp, gvp | planned (v2/v3) |
