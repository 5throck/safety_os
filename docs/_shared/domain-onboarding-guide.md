# Domain Onboarding Guide

> **Standard Operating Procedure** for adding a new domain (e.g., GDP, GLP, GCP, GVP) to Safety OS.

This guide documents the folder structure convention adopted on 2026-06-17 (per meeting `memory/meeting-2026-06-17-folder-structure-redesign.md`).

---

## 1. When to Use This Guide

Use this guide when introducing a new regulatory or operational domain to Safety OS. Examples:

- **GDP** (Good Distribution Practice)
- **GLP** (Good Laboratory Practice)
- **GCP** (Good Clinical Practice)
- **GVP** (Good Pharmacovigilance Practice)
- **EHS-Vertical** (e.g., `ehssemi`, `ehsconst`)

## 2. Naming Convention

| Family | Convention | Examples |
|--------|-----------|----------|
| GxP family | lowercase | `gmp`, `gdp`, `glp`, `gcp`, `gvp` |
| EHS family | `ehs<industry-abbrev>` | `ehsmfg`, `ehsconst`, `ehssemi` |
| Common/shared | underscore prefix | `_shared`, `_meta`, `_core` |

## 3. Folder Structure Per Top-Level Directory

Every domain touches these top-level directories with a consistent `<top-level>/domains/<name>/` pattern:

```
agents/
├── _core/                         # Governance/operational agents (pm, sgm, swm)
├── _shared/                       # Cross-domain service agents
└── domains/
    └── <name>/
        └── <name>-agent.md        # Domain-specific agent

docs/
├── _meta/                         # Domain-agnostic meta documents
├── _shared/                       # Cross-domain guides
└── domains/
    └── <name>/
        ├── README.md              # Domain overview
        ├── scope.md               # v1 scope document
        └── reports/               # Domain-specific reports

evidence-models/
├── _shared/base/                  # Common schemas (gmp-common, finding, etc.)
└── domains/
    └── <name>/
        └── <name>-*-record.json   # Domain-specific evidence models

skills/
├── _meta/                         # SKILLS.md, README files
├── <governance-skill>/SKILL.md    # Governance/build skills (flat)
├── daily/                         # Routine EHS operations
│   └── <skill>/SKILL.md
├── investigation/                 # Hazard/incident analysis (HAZOP, RCA)
│   └── <skill>/SKILL.md
├── emergency/                     # Emergency response
│   └── <skill>/SKILL.md
└── domains/
    └── <name>/
        └── <skill>/SKILL.md       # Domain-specific skills

workflows/
├── _shared/                       # _template/, data-seeding.yaml
├── daily/                         # Daily operations (domain-agnostic)
├── emergency/                     # Emergency response (domain-agnostic)
└── domains/
    └── <name>/
        └── <workflow>/            # Each workflow = directory with schema.yaml + README.md
            ├── schema.yaml
            └── README.md

regulations/                       # Flat structure (national organization natural)
└── KR/
    └── <Regulator>-<Framework>.{yaml,md}

industry-profiles/                 # Flat structure (industry ≈ domain but not 1:1)
└── <profile>.yaml
```

## 4. Onboarding Procedure (Step-by-Step)

### Step 1: Reserve the Domain Name
Confirm the domain name is not already in use. Add an entry to this guide's "Active Domains" table (Section 5).

### Step 2: Create Standard Substructure
For each top-level directory, create the `domains/<name>/` subdirectory:

```bash
mkdir -p agents/domains/<name>
mkdir -p docs/domains/<name>/reports
mkdir -p evidence-models/domains/<name>
mkdir -p skills/domains/<name>
mkdir -p workflows/domains/<name>
```

### Step 3: Author the Agent
Create `agents/domains/<name>/<name>-agent.md` following the template in `_core/` agents. Required sections:
- Section A — Legal Basis (multi-source; min 3 regulatory references with Primary + Adjacent structure)
- Section B — Role & Responsibilities (with explicit scope limitations)
- Section C — Operational Protocols & Escalation Rules

### Step 4: Author the Industry Profile
Create `industry-profiles/<profile>.yaml` mapping the domain to applicable laws, GMP/PQS pillars, and workflow list.

### Step 5: Author Workflows
For each workflow:
1. Create `workflows/domains/<name>/<workflow>/` directory
2. Author `schema.yaml` with required fields (`schema_version`, `workflow_id`, `title`, `status: active`, `applicability: mandatory`, `legal_basis`, `industry_profile`, `agent`, `evidence_model`)
3. Author `README.md` with Objective, Applicability, Workflow Steps, Evidence Record, Legal Disclaimer

### Step 6: Author Evidence Models
For each evidence type, create `evidence-models/domains/<name>/<name>-*-record.json`. Required common fields (when applicable per domain decisions):
- `e_signature` ($ref to `_shared/base/gmp-common.schema.json` or domain-specific)
- `qrm_assessment` (if domain uses ICH Q9 or equivalent)
- `nomenclature` (multilingual declaration)
- `audit_trail` (ALCOA+ metadata)
- `legal_basis` (multi-source array, min 3 entries with description and examples)

### Step 7: Author Skills (Optional)
If the domain has cross-cutting methodology skills (like `gmp-qrm`), create `skills/domains/<name>/<skill>/SKILL.md`.

### Step 8: Author Regulations Reference
Create `regulations/<jurisdiction>/<Regulator>-<Framework>.{yaml,md}` with `source_mcp` field for audit compliance.

### Step 9: Author Scope Document
Create `docs/domains/<name>/scope.md` documenting v1 scope, exclusions, KPIs, and compliance gates.

### Step 10: Run Audit
```bash
bun scripts/safety-audit.ts
```
Must pass with 0 errors. The audit auto-recognizes new domains via recursive walkDir.

### Step 11: Update CHANGELOG and Memory Log
- Add `### Added (YYYY-MM-DD — <Domain> Module v1)` section to `CHANGELOG.md`
- Create `memory/YYYY-MM-DD.md` entry summarizing the addition

## 5. Active Domains Registry

> **Tier** classification: `functional` (산업 무관, 방법론/데이터 중심), `industry` (특정 산업 운영 중심), `cross-cutting` (공통 서비스). See `docs/_shared/domain-classification-guide.md`.

| Domain | Tier | Added | Status | Industry Profile |
|--------|------|-------|--------|------------------|
| `psm` | functional | pre-2026-06-17 | active | chemical-processing (LNG/LPG/발전 등 covered process 적용) |
| `msds` | functional | 2026-06-17 | active (v1) | chemical-handling |
| `gmp` | industry (pharma) | 2026-06-17 | active (v1) | pharma-general |
| `gdp` | industry (pharma) | 2026-06-17 | active (v1) | pharma-distribution |
| `glp` | industry (pharma) | 2026-06-17 | active (v1) | pharma-laboratory |
| `gcp` | industry (pharma) | 2026-06-17 | active (v1) | clinical-research |
| `gvp` | industry (pharma) | 2026-06-17 | active (v1) | pharmacovigilance |
| `ehsconst` | industry | 2026-06-18 | active (v1) | construction |
| `gasterm` | industry | 2026-06-18 | active (v1) | gas-facility |
| `powergen` | industry | 2026-06-18 | active (v1) | power-generation |
| `ehschem` | industry | 2026-06-18 | active (v1) | chemical-plant (정유/석유화학/정밀화학) |
| `meddevice` | industry | 2026-06-18 | active (v1) | medical-device |
| `training` | functional | 2026-06-19 | active (v1) | training-management |

## 6. Migration Notes (for Existing Domains)

When migrating an existing flat-structured domain to the new pattern:

1. **PSM-style `.md` → hierarchical**: Split YAML frontmatter into `schema.yaml`, body into `README.md`. Add `status: active` and `applicability: mandatory` to schema.yaml (audit requirement).
2. **Evidence models**: Move from `evidence-models/<prefix>-*.json` to `evidence-models/domains/<name>/<prefix>-*.json`. Update `$ref` paths from `base/X.schema.json` to `../../_shared/base/X.schema.json`.
3. **Update agent references**: Agent `.md` files reference workflow paths. Update from `workflows/<name>/X.md` to `workflows/domains/<name>/X/README.md`.
4. **Update skill references**: Skill files may reference agent paths. Update from `agents/X-agent.md` to `agents/domains/<name>/X-agent.md` (or `agents/_shared/X-agent.md`).

## 7. Verification Checklist

- [ ] All domain files under `<top-level>/domains/<name>/`
- [ ] `_shared/`, `_meta/`, `_core/` underscore prefix consistently applied
- [ ] `schema.yaml` files have `legal_basis`, `status: active`, `applicability: mandatory`
- [ ] Evidence models have valid `$ref` paths (relative)
- [ ] `bun scripts/safety-audit.ts` passes with 0 errors
- [ ] Domain added to Section 5 registry above
- [ ] CHANGELOG and memory log updated
