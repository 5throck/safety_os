## Session Summary
refactor: domain-based folder structure for docs/evidence-models/workflows/skills/agents (M-1 to M-4 complete)

## Changes

### M-1: evidence-models/ restructure
- Created `evidence-models/_shared/base/` (corrective-action, finding, gmp-common schemas)
- Created `evidence-models/domains/{psm,gmp}/`
- Moved 7 psm-*.json → `domains/psm/`
- Moved 11 gmp-*.json → `domains/gmp/`
- Updated all GMP $ref paths: `base/` → `../../_shared/base/`
- Removed legacy `base/` directory

### M-2: workflows/ restructure
- Created `workflows/_shared/` (moved _template/ and data-seeding.yaml)
- Created `workflows/domains/psm/` — converted 7 flat .md files to hierarchical (schema.yaml + README.md), now audit-coupled
- Created `workflows/domains/gmp/` — moved 10 GMP workflow directories from workflows/gmp/
- Maintained: daily/, emergency/, compliance/ (domain-agnostic)

### M-3: docs/skills/agents restructure
- `docs/_meta/` — architecture, blueprint, superpowers, VERSION_MANIFEST, v4.0-playbook, co-safety.context
- `docs/_shared/` — procedures, reports
- `docs/domains/gmp/` — scope.md (moved from docs/gmp/)
- `skills/_meta/` — README, SKILLS.md
- `skills/_shared/` — 15 cross-domain skills
- `skills/domains/gmp/{change-control, deviation-capa, qrm}/`
- `skills/domains/psm/moc/`
- `agents/_core/` — pm, safety-governance-manager, safety-workflow-manager
- `agents/_shared/` — 14 cross-domain agents
- `agents/domains/{psm,gmp}/`

### M-4: audit script extension + onboarding guide
- `scripts/safety-audit.ts` v2.1.0 → v2.2.0
  - GMP workflow path: workflows/gmp/ → workflows/domains/gmp/
  - Role separation paths updated for new structure
  - Accept both `gmp-qrm` and `gmp/qrm` path patterns
- `docs/_shared/domain-onboarding-guide.md` (new) — SOP for adding new domains
- Updated path references in domain agents and skills

## Decisions
- Adopted Option C (`_meta/` + `_shared/` + `domains/<name>/`) per meeting 2026-06-17
- Open items resolved per synthesis recommendations:
  - audit/compliance/docs-writer/legal agents → `_shared/`
  - regulations/ → flat (national organization natural)
  - daily/ and emergency/ → maintained at top-level (domain-agnostic)

## Verification
- `bun scripts/safety-audit.ts` → 70 files checked, 0 errors
- 24 workflows (10 GMP correctly identified)
- 22 evidence-models (11 GMP correctly identified)
- PSM now audit-coupled (previously flat .md, unrecognized)

## Migration Impact
- 6 PSM workflows converted to hierarchical schema.yaml + README.md pattern (audit visibility gained)
- All path references in domain agents and skills updated to new structure
- Domain onboarding SOP established for future GDP/GLP/GCP/GVP/EHS additions
