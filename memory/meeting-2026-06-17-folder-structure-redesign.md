# Meeting Transcript
**Date**: 2026-06-17
**Topic**: Domain-Scalable Folder Structure Redesign for docs/evidence-models/workflows (and related)
**Participants**: pm (CSO), sgm, docs-writer, gmp-agent, compliance-agent
**Rounds**: 2
**Language**: Korean (transcript archived in English per skill policy)
**Status**: Complete
**Trigger**: User request after GMP module addition revealed structural complexity scaling issues

---

## Context

After GMP module v1 was added alongside the existing PSM module, the flat folder structures in `docs/`, `evidence-models/`, and `workflows/` began showing scaling strain. The user requested a meeting to derive folder structure improvements that anticipate future domain additions (GDP, GLP, GCP, GVP, additional EHS verticals).

### Current State Problems Identified

1. **Mixed flat/hierarchical structure**: `workflows/psm/` (flat .md files) vs `workflows/gmp/` (hierarchical directories) — inconsistent
2. **Prefix-based domain separation**: `evidence-models/psm-*.json` vs `gmp-*.json` — relies solely on filename prefix; becomes unsearchable at 5+ domains
3. **Audit coupling uneven**: GMP workflows pass audit (schema.yaml pattern); PSM workflows do not (flat .md pattern)
4. **Meta/domain mixing**: `docs/` contains both meta documents (architecture, blueprint) and domain-specific docs (gmp/) at same level

### Future Domain Forecast (3-year horizon)

| Domain | English | Expected | Workflows | Evidence Models |
|--------|---------|----------|-----------|-----------------|
| GDP | Good Distribution Practice | v2 / 2026 Q4 | +6-8 | +6 |
| GLP | Good Laboratory Practice | v2 / 2026 Q4 | +5-7 | +5 |
| GCP | Good Clinical Practice | v3 / 2027 H1 | +8-10 | +8 |
| GVP | Good Pharmacovigilance | v3 / 2027 H1 | +4-6 | +4 |
| EHS-Semi | Semiconductor EHS | v2 / 2026 Q4 | +5 | +3 |
| EHS-Const | Construction EHS | v3 / 2027 H1 | +6 | +4 |

**3-year total**: ~60-70 workflows (currently 24). Flat structure becomes unmaintainable.

---

## Transcript

### Facilitator Opening (pm / CSO)

Opened meeting to address folder structure scaling issues. Stated goals: (1) diagnose current state problems, (2) define future domain expansion scenarios, (3) propose concrete folder structure alternatives, (4) develop migration strategy. Assigned domain leads: sgm → future expansion, docs-writer → docs structure, gmp-agent → domain agent perspective, compliance-agent → audit perspective + synthesis.

---

### Round 1 — Diagnosis and Expansion Scenarios

**pm (Round 1)**: Listed 4 structural problems: flat/hierarchical mixing, prefix dependency, audit coupling unevenness, meta/domain mixing. Requested future expansion forecast from sgm, docs improvement from docs-writer, domain agent preference from gmp-agent.

**sgm (Round 1)**: Presented 3-year domain expansion forecast (GDP, GLP, GCP, GVP, EHS-Semi, EHS-Const). Estimated total workflows growing from 24 to 60-70. Identified 3 critical considerations: cross-domain dependencies (need `shared/`), regulatory framework mapping, audit script scalability. Recommended modular hierarchical structure with shared assets area.

**docs-writer (Round 1)**: Diagnosed docs/ problems — meta documents buried among domain folders as domains multiply. User trying to find "all GMP docs" must search 5+ locations (docs/gmp/, evidence-models/gmp-*, workflows/gmp/, agents/gmp-agent.md, skills/gmp-*). Proposed 3-tier separation: `_meta/` (domain-agnostic), `_shared/` (cross-domain guides), `domains/<name>/` (domain-specific). Underscore prefix ensures meta stays at top.

**gmp-agent (Round 1)**: Reported structural friction during GMP implementation — files scattered across 7 locations. Recommended **Option D** (full domain colocation): `domains/<name>/{agent.md, workflows/, evidence-models/, skills/, docs/, regulations/}`. Pros: domain addition/removal is single directory operation; clear dependencies. Cons: high initial migration cost, audit script rewrite needed. Asked compliance-agent for audit impact assessment.

**compliance-agent (Round 1)**: Provided 4-option comparison with audit script impact:

| Option | Audit Script Change | Migration Cost | Domain Scalability | Rating |
|--------|---------------------|----------------|--------------------|--------|
| A. Status quo + prefix convention | None | None | Low (prefix collision) | ⭐ |
| B. Domain subdir in each top-level | walkDirExt path only | Medium | High | ⭐⭐⭐⭐ |
| C. _meta + _shared + domains/ | Same as B + underscore filtering | Medium | Very high | ⭐⭐⭐⭐⭐ |
| D. Full domain colocation | Full rewrite (domain loop) | High | Maximum | ⭐⭐⭐ |

Key technical concern for Option D: `$ref` resolution logic uses relative paths — moving evidence models into `domains/<name>/` would break references to `base/gmp-common.schema.json`. This is the primary technical obstacle to Option D. Compliance-agent tentatively recommended **Option C** as cost-effectiveness optimal; Option D deferred to v2/v3 pending `$ref` redesign.

---

### Round 2 — Concrete Structure and Migration Plan

**pm (Round 2)**: Confirmed convergence toward Option C. Requested final structure, PSM migration opportunity, and phased application order.

**sgm (Round 2)**: Finalized domain classification:

- GxP family: lowercase (`gmp`, `gdp`, `glp`, `gcp`, `gvp`)
- EHS family: `ehs` prefix + industry abbrev (`ehsmfg`, `ehsconst`, `ehssemi`)
- Common: `_shared` (underscore prefix)

Defined domain addition procedure: create `domains/<name>/` with standard substructure (agent.md, workflows/, evidence-models/, skills/, docs/, regulations/), add `industry-profiles/<name>.yaml`, audit script auto-recognizes via recursive walkDir.

**docs-writer (Round 2)**: Provided final concrete structure for docs/, evidence-models/, workflows/:

- `docs/_meta/` — architecture, blueprint, playbook, superpowers, version manifest
- `docs/_shared/` — audit-guide, evidence-model-conventions, workflow-template-guide, legal-basis-guide, terminology-policy
- `docs/domains/<name>/` — README, overview, scope, reports

- `evidence-models/_shared/base/` — common schemas (gmp-common, finding, corrective-action)
- `evidence-models/domains/<name>/` — domain-specific models

- `workflows/_shared/_template/` + `data-seeding.yaml`
- `workflows/daily/` — maintained (domain-agnostic)
- `workflows/emergency/` — maintained (domain-agnostic)
- `workflows/domains/<name>/` — domain-specific

**gmp-agent (Round 2)**: Partial agreement with Option C + strong proposal: extend domains/ pattern to `agents/` and `skills/` for consistency. Otherwise users still search 7 locations. Proposed:

- `agents/_core/` (pm, sgm, swm)
- `agents/_shared/` (audit, compliance, docs-writer, legal, etc.)
- `agents/domains/<name>/<name>-agent.md`
- `skills/_shared/`
- `skills/domains/<name>/<skill>/`

Consistent pattern: `<top-level>/domains/<name>/` enables uniform search across all domain assets.

**compliance-agent (Round 2)**: Delivered synthesis.

---

## Synthesis (compliance-agent)

### Points of Agreement

1. **Option C adopted** with gmp-agent's extension (domains/ pattern across all major directories)
2. **Domain naming convention**: GxP family lowercase; EHS family `ehs<industry>`; common uses `_shared`/`_meta`/`_core` underscore prefix
3. **PSM migration opportunity**: Convert flat .md to `workflows/domains/psm/<wf>/{schema.yaml, README.md}` — solves audit coupling problem
4. **Underscore prefix convention**: `_meta/`, `_shared/`, `_core/`, `_template/` — ensures meta sorts to top
5. **Phased migration**: 4 phases to avoid big-bang risk

### Open Disagreements / Unresolved Questions

1. **`_core/` vs `_shared/` boundary in `agents/`**: pm/sgm/swm clearly `_core/`, but audit-agent/compliance-agent/docs-writer/legal-agent classification debated (compliance-agent: `_shared/`; final decision needed)
2. **`regulations/` domain-ization**: Flat structure (`regulations/KR/MFDS-GMP.yaml`) vs domain-nested (`regulations/domains/gmp/KR/MFDS-GMP.yaml`). Synthesis recommends flat (national organization natural); revisit if user requests
3. **`daily/` and `emergency/`**: Absorb into `domains/_shared/` or maintain at top level. Synthesis recommends top-level maintenance (domain-agnostic)
4. **Migration kickoff timing**: Immediate vs next sprint vs after GMP v1 stabilization

### Final Recommended Structure

```
safety-os/
├── agents/
│   ├── _core/          # pm, sgm, swm
│   ├── _shared/        # audit, compliance, docs-writer, legal
│   └── domains/
│       ├── psm/psm-agent.md
│       ├── gmp/gmp-agent.md
│       └── ...
├── docs/
│   ├── _meta/          # architecture, blueprint, playbook
│   ├── _shared/        # cross-domain guides
│   └── domains/{psm,gmp,...}/
├── evidence-models/
│   ├── _shared/base/   # common schemas
│   └── domains/{psm,gmp,...}/
├── skills/
│   ├── _shared/
│   └── domains/{psm,gmp,...}/
├── workflows/
│   ├── _shared/{_template, data-seeding.yaml}
│   ├── daily/          # maintained (domain-agnostic)
│   ├── emergency/      # maintained (domain-agnostic)
│   └── domains/{psm,gmp,...}/
├── regulations/        # flat (national organization natural)
│   └── KR/{MFDS-GMP,MFDS-GDP,OSHA-KR}.{yaml,md}
└── industry-profiles/  # flat (industry ≈ domain but not 1:1)
```

### Migration Phased Plan (4 Phases)

| Phase | Work | Risk | ETA |
|-------|------|------|-----|
| M-1 | `evidence-models/` restructure (domains/ + _shared/base/) — simplest, just $ref updates | Low | 1 week |
| M-2 | `workflows/domains/` creation + GMP move + PSM flat→hierarchical conversion (audit coupling fix) | Medium | 2 weeks |
| M-3 | `docs/domains/` + `skills/domains/` + `agents/domains/` batch application | Medium | 1 week |
| M-4 | Audit script walkDirExt path updates + per-domain loop support | Low (after M-1~3) | 3 days |

### Action Items

**Platform Parity Check**: Action Items affect domain content and script structure — applied commonly to Claude/Antigravity. Platform = Both.

| # | Owner | Tier | Deliverable | Platform | Phase / ETA |
|---|-------|------|-------------|----------|-------------|
| A-01 | pm + automation-engineer | Medium | `evidence-models/` restructure: `_shared/base/` + `domains/{psm,gmp}/`, move all gmp-*.json + psm-*.json, update $ref paths | Both | M-1 / 2026-06-24 |
| A-02 | pm + automation-engineer | Medium | `workflows/domains/` creation: move GMP directories + convert PSM flat .md → hierarchical (schema.yaml + README.md) for audit coupling | Both | M-2 / 2026-07-01 |
| A-03 | docs-writer + automation-engineer | Medium | `docs/_meta/`, `docs/_shared/`, `docs/domains/` creation + move docs/gmp/ → docs/domains/gmp/ + classify meta docs into _meta/ | Both | M-3 / 2026-07-08 |
| A-04 | pm + automation-engineer | Medium | `skills/domains/` + `agents/domains/` + `agents/_core/` + `agents/_shared/` creation and file moves | Both | M-3 / 2026-07-08 |
| A-05 | audit-agent | Low | `scripts/safety-audit.ts` v2.2.0: walkDirExt path updates, per-domain check loop support, recognize domains/ structure | Both | M-4 / 2026-07-11 |
| A-06 | sgm | Low | Domain addition SOP documentation: `docs/_shared/domain-onboarding-guide.md` (standard procedure for adding new domains) | Both | M-4 / 2026-07-11 |

### Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-01 | All domain-specific files under `<top>/domains/<domain>/` | Directory scan |
| AC-02 | `_shared/`, `_meta/`, `_core/` underscore prefix consistently applied | Directory scan |
| AC-03 | PSM workflows audit-coupled (currently not, after migration yes) | `bun scripts/safety-audit.ts` |
| AC-04 | Zero broken evidence-models $refs | `bun scripts/safety-audit.ts` |
| AC-05 | Audit file count after migration not decreased (or increased) | Before/after comparison |
| AC-06 | Adding new domain requires no audit script code changes | New domain add test |

### Open Items (User Decision Required)

1. **`_core/` vs `_shared/` classification** for audit-agent/compliance-agent/docs-writer/legal-agent (synthesis recommends `_shared/`)
2. **`regulations/` domain-ization**: flat (recommended) vs nested — revisit if requested
3. **`daily/` / `emergency/`**: maintain top-level (recommended) vs absorb into `domains/_shared/`
4. **Migration kickoff timing**: immediate vs next sprint vs after GMP v1 stabilization

---

## Reference: Option Comparison Detail

### Option A — Status Quo + Prefix Convention
- No structural change, rely on filename prefixes (psm-*, gmp-*, etc.)
- **Failure mode**: At 5+ domains, filename tab-completion and search become painful
- **Audit impact**: None
- **Verdict**: Rejected (does not solve scaling problem)

### Option B — Domain Subdir in Each Top-Level
- `docs/domains/`, `evidence-models/domains/`, `workflows/domains/`, etc.
- **Failure mode**: Meta/shared content still mixed with domain content at top level
- **Audit impact**: walkDirExt path updates only
- **Verdict**: Acceptable baseline, superseded by Option C

### Option C — _meta + _shared + domains/ Pattern (RECOMMENDED)
- Each top-level gets `_meta/` (or `_core/`), `_shared/`, `domains/<name>/`
- Underscore prefix ensures meta sorts to top
- **Audit impact**: walkDirExt path updates + underscore filtering
- **Verdict**: Cost-effectiveness optimal

### Option D — Full Domain Colocation
- `domains/<name>/{agent.md, workflows/, evidence-models/, skills/, docs/}`
- **Failure mode**: `$ref` resolution logic needs redesign (currently relative paths break across domain boundaries)
- **Audit impact**: Full rewrite with per-domain iteration
- **Verdict**: Architecturally purest but defer to v2/v3 pending $ref redesign

---
