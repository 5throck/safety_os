## Session Summary
feat: add GVP domain v1 — 8 workflows, 7 evidence models, 2 skills (FINAL GxP domain — completes pharmaceutical lifecycle)

## Changes

### GVP Domain v1 — Final GxP Domain Implementation

**Regulations**:
- `regulations/KR/MFDS-GVP.yaml` — 약사법 Art 73의2/73의3 + KGVP
- `regulations/international/ICH-E2.yaml` — ICH E2 series (A-F)
- `docs/domains/gvp/scope.md`

**Agent**: `agents/domains/gvp/gvp-agent.md` (new)

**Industry Profile**: `industry-profiles/pharmacovigilance.yaml` (new)

**Workflows (8)** under `workflows/domains/gvp/`:
- `icsr-intake/`, `signal-detection/`, `pbrer-generation/`,
  `risk-management-plan/`, `pms-study-management/`,
  `benefit-risk-assessment/`, `labeling-update/` (7 core)
- `urgent-safety-action-reference/` (reference — 5th and final reference pattern application)

**Evidence Models (7)** under `evidence-models/domains/gvp/`:
- All include `ich_e2_compliance`, `pbrer_cycle_ref`, `product_id`, `rmp_version_ref`
- `gvp-icsr-record.json` with WHO-UMC causality
- `gvp-signal-record.json` with statistical methods
- `gvp-br-record.json` with multi-framework scoring

**Skills (2)** under `skills/domains/gvp/`:
- `signal-detector/SKILL.md` — PRR/ROR/BCPNN/EBGM disproportionality
- `benefit-risk-assessor/SKILL.md` — PrOACT/BRAT/MCDA

**Audit Script**: `scripts/safety-audit.ts` v2.6.0 → v2.7.0
- GVP workflow validation
- GVP evidence model validation
- Report shows all 6 domains

## Milestone: ALL GxP DOMAINS COMPLETE

With GVP, all 5 GxP domains are now active:
- **GLP** (non-clinical safety)
- **GCP** (clinical trials)
- **GMP** (manufacturing)
- **GDP** (distribution)
- **GVP** (post-market surveillance)

Plus PSM (process safety) and MSDS (chemical safety) — total **7 active domains**.

## Decisions
- Domain name: `gvp` (Good Pharmacovigilance Practice)
- 8 workflows (7 core + 1 reference: urgent-safety-action-reference)
- ICH E2 series (A through F) baseline
- Multi-framework B/R assessment (PrOACT/BRAT/MCDA)
- 4 common fields: ich_e2_compliance, pbrer_cycle_ref, product_id, rmp_version_ref
- PMS Korean-specific (6-8 year mandatory)
- 5th reference workflow pattern application (final)

## Verification
- 227 files checked, 0 errors
- 63 workflows (10 GMP, 7 MSDS, 8 GDP, 8 GLP, 8 GCP, 8 GVP, 14 PSM/EHS)
- 56 evidence-models (11 GMP, 6 MSDS, 7 GDP, 7 GLP, 7 GCP, 7 GVP, 11 PSM/shared)

## Active Domains Registry (FINAL — 7 domains)
| Domain | Status |
|--------|--------|
| psm | active |
| gmp | active (v1) |
| msds | active (v1) |
| gdp | active (v1) |
| glp | active (v1) |
| gcp | active (v1) |
| **gvp** | **active (v1, new — final GxP)** |

## Reference Workflow Pattern (5 applications total)
| # | Domain | Reference | Target |
|---|--------|-----------|--------|
| 1 | MSDS | chemical-spill-reference | emergency-agent |
| 2 | GDP | product-recall-reference | emergency-agent |
| 3 | GLP | study-inspection-reference | compliance-agent |
| 4 | GCP | sae-reporting-reference | emergency-agent |
| 5 | GVP | urgent-safety-action-reference | emergency-agent |
