# Changelog

All notable changes to Safety OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added (2026-06-17 — GDP Domain v1)

Good Distribution Practice (GDP) domain implementation as fourth domain. Covers pharmaceutical supply chain from manufacturer handoff through customer delivery. KGDP + PIC/S + EU GDP + DTS alignment.

**Second new domain addition** via `docs/_shared/domain-onboarding-guide.md` SOP — pattern fully validated.

**Agent** (1):
- `agents/domains/gdp/gdp-agent.md` (new)

**Workflows** (8) under `workflows/domains/gdp/`:
- `goods-receipt/`, `storage-management/`, `temperature-monitoring/`, `transportation/`, `traceability-dts/`, `returned-goods/`, `gdp-self-inspection/` (7 core)
- `product-recall-reference/` (reference workflow — dispatches to emergency-agent)

**Evidence Models** (7) under `evidence-models/domains/gdp/`:
- All include `gdp_certification_status`, `temperature_condition`, `batch_disposition_approved_ref` fields
- `gdp-temperature-monitoring-record.json` includes time-series data and excursion analysis
- `gdp-dts-tracking-record.json` for Korean DTS (Drug Tracking System) compliance

**Skills** (2) under `skills/domains/gdp/`:
- `temperature-excursion-analyzer/` — cold chain excursion impact assessment
- `dts-verification/` — barcode/RFID DTS scan verification

**Regulations** (2):
- `regulations/KR/MFDS-GDP.yaml` — KGDP framework + PIC/S alignment
- `regulations/KR/DTS.yaml` — Korean Drug Tracking System

**Industry Profile**:
- `industry-profiles/pharma-distribution.yaml`

**Scope Document**:
- `docs/domains/gdp/scope.md`

**Cross-Domain Interface**:
- GMP `batch-record` → GDP `goods-receipt` (via `batch_disposition_approved_ref`)
- GDP `product-recall-reference` → `emergency-agent` (data + dispatch)
- GDP → GMP `deviation-capa` (when `deviation_source: manufacturing`)

**Audit Script**:
- `scripts/safety-audit.ts` v2.3.0 → v2.4.0:
  - GDP workflow validation (≥3 legal_basis core, ≥2 reference)
  - GDP evidence model validation (`gdp_certification_status`, `temperature_condition`, `batch_disposition_approved_ref`)
  - Report shows GMP + MSDS + GDP counts

**Verification**: 130 files checked, 0 errors (39 workflows: 10 GMP, 7 MSDS, 8 GDP, 14 PSM/EHS).

### Added (2026-06-17 — MSDS Domain v1)

Complete MSDS (Material Safety Data Sheet) / Chemical Safety domain implementation as the third domain (after PSM, GMP). Migrates and extends existing `chemical-safety-agent` into a full domain structure. OSHA-KR Articles 110-114 + K-REACH + GHS Rev 9 baseline.

**First new domain addition** following `docs/_shared/domain-onboarding-guide.md` SOP — validates the 11-step procedure.

**Agent** (1):
- `agents/domains/msds/msds-agent.md` (migrated from `_shared/chemical-safety-agent.md` + expanded)
- `agents/_shared/occupational-health-agent.md` updated Section B (MSDS data dependency)

**Workflows** (7) under `workflows/domains/msds/`:
- `msds-intake/` (OSHA-KR Art 110) — receive + parse MSDS
- `ghs-classification/` (OSHA-KR Art 243) — GHS Rev 9 classification
- `chemical-approval/` (OSHA-KR Art 113 + TCCL) — new chemical approval
- `chemical-inventory/` (K-REACH Art 10) — monthly inventory
- `kreach-registration/` (K-REACH Art 11) — ME registration
- `hazard-labeling/` (OSHA-KR Art 114) — GHS labels
- `chemical-spill-reference/` (reference workflow) — provides Section 6 data + dispatches to emergency-agent

**Evidence Models** (6) under `evidence-models/domains/msds/`:
- `msds-record.json` — GHS 16 sections full schema (international compatible)
- `ghs-classification-record.json`, `chemical-approval-record.json`, `chemical-inventory-record.json`, `kreach-registration-record.json`, `hazard-label-record.json`
- All include `ghs_version: "rev9"` field with migration tracking

**Skills** (3) under `skills/domains/msds/`:
- `msds-parser/SKILL.md` — Hybrid: Mode 1 rule-based (top 5 Korean suppliers) + Mode 2 ML fallback
- `msds-parser/rules/lotte_chemical.yaml` — first supplier rule (template for others)
- `ghs-classifier/SKILL.md` — GHS Rev 9 ruleset (17 physical + 11 health + 2 environmental hazards)
- `chemical-risk-assessment/SKILL.md` — scenario-based risk characterization

**Regulations** (2):
- `regulations/KR/OSHA-KR-MSDS.yaml` — OSHA-KR Articles 110-114 + 243 + GHS Rev 9 alignment
- `regulations/KR/K-REACH.yaml` — K-REACH Articles 10-14 + thresholds

**Industry Profile** (1):
- `industry-profiles/chemical-handling.yaml` — general chemical handling profile

**Scope Document**:
- `docs/domains/msds/scope.md` — v1 scope, regulatory framework, cross-domain references, role separation matrix

**Pattern Documentation** (1):
- `docs/_shared/reference-workflow-pattern.md` — reference workflow SOP for future domain additions

**Audit Script**:
- `scripts/safety-audit.ts` v2.2.0 → v2.3.0:
  - Added MSDS workflow validation (multi-source legal_basis ≥3 for core, ≥2 for reference)
  - Added MSDS evidence model validation (`ghs_version` field required)
  - Added reference workflow exception handling
  - Report now shows MSDS-specific counts alongside GMP

**Renamed**:
- `evidence-models/_shared/base/gmp-common.schema.json` → `common.schema.json` (multi-domain shared)
- Updated all GMP evidence models' $ref paths to use `common.schema.json`

**Removed**:
- `agents/_shared/chemical-safety-agent.md` (migrated to `agents/domains/msds/msds-agent.md`)

### Verification
- 98 files checked, 0 errors
- 31 workflows (10 GMP, 7 MSDS, others PSM/EHS)
- 28 evidence-models (11 GMP, 6 MSDS, others PSM/shared)
- Domain Onboarding SOP validated (11-step procedure)

### Changed (2026-06-17 — Domain-Based Folder Structure)

Reorganized top-level directories into domain-scalable pattern (`_meta/` + `_shared/` + `domains/<name>/`) per meeting `memory/meeting-2026-06-17-folder-structure-redesign.md`. Anticipates future domain additions (GDP, GLP, GCP, GVP, EHS verticals).

**evidence-models/** restructure (M-1):
- New: `_shared/base/` (corrective-action, finding, gmp-common schemas)
- New: `domains/psm/` (7 PSM records moved)
- New: `domains/gmp/` (11 GMP records moved)
- Updated: all GMP evidence models `$ref` paths from `base/` to `../../_shared/base/`
- Removed: legacy `base/` directory

**workflows/** restructure (M-2):
- New: `_shared/{_template, data-seeding.yaml}`
- New: `domains/psm/` — **PSM flat .md → hierarchical** (7 workflows converted to `schema.yaml + README.md` pattern, now audit-coupled)
- New: `domains/gmp/` (10 GMP workflows moved from `workflows/gmp/`)
- Maintained: `daily/`, `emergency/`, `compliance/` (domain-agnostic)

**docs/ restructure** (M-3):
- New: `_meta/{architecture, blueprint, superpowers, VERSION_MANIFEST, v4.0-playbook, co-safety.context}`
- New: `_shared/{procedures, reports, domain-onboarding-guide}`
- New: `domains/gmp/scope.md`

**skills/ restructure** (M-3):
- New: `_meta/{README, SKILLS.md}`
- New: `_shared/` (15 cross-domain skills)
- New: `domains/gmp/{change-control, deviation-capa, qrm}`
- New: `domains/psm/moc`

**agents/ restructure** (M-3):
- New: `_core/` (pm, safety-governance-manager, safety-workflow-manager)
- New: `_shared/` (14 cross-domain agents: audit, compliance, docs-writer, legal, chemical-safety, contractor-safety, disaster-response, emergency, incident-investigation, occupational-health, reporting, risk-assessment, training, asset-integrity)
- New: `domains/psm/psm-agent.md`
- New: `domains/gmp/gmp-agent.md`

**Audit Script** (M-4):
- `scripts/safety-audit.ts` v2.1.0 → v2.2.0:
  - Updated GMP workflow path: `workflows/gmp/` → `workflows/domains/gmp/`
  - Updated role separation paths for new `agents/_shared/` and `skills/domains/gmp/qrm/`
  - Accept both legacy (`gmp-qrm`) and new (`gmp/qrm`) path patterns

**Agent/Skill References Updated**:
- `agents/domains/gmp/gmp-agent.md`: workflow/skill/evidence paths
- `agents/domains/psm/psm-agent.md`: workflow/skill/evidence paths
- `agents/_shared/risk-assessment-agent.md`: gmp-qrm skill path
- `skills/domains/gmp/{change-control, deviation-capa}/SKILL.md`: gmp-qrm and psm-moc references

**New Documentation**:
- `docs/_shared/domain-onboarding-guide.md`: SOP for adding new domains (GDP, GLP, GCP, GVP, EHS verticals)

**Verification**: 70 files checked, 0 errors (24 workflows with 10 GMP, 22 evidence-models with 11 GMP).

### Added (2026-06-17 — GMP Module v1)
Complete Good Manufacturing Practice (GMP) module implementation benchmarked to PSM module architecture. KP-GMP base + PIC/S alignment + ICH Q7/Q9/Q10 reflection. v1 scope: `pharma-general` only (sterile/API/biologics deferred to v2).

**Agent** (1):
- `agents/gmp-agent.md` — GMP specialist with multi-source legal basis (약사법 Article 34 + 의약품등기준규정 + ICH Q7/Q9/Q10 + PIC/S PE 009)

**Workflows** (10) under `workflows/gmp/`:
- `change-control/` (변경관리, Article 18) — 90% pattern reuse from `psm-moc`
- `deviation-capa/` (이상관리 및 시정예방조치, Article 19)
- `equipment-qualification/` (설비 적격성평가, Article 16) — pattern reuse from PSM MI
- `batch-mfg/` (제조 및 포장기록, Article 12)
- `supplier-qualification/` (공급자 자격부여, Article 12) — pattern reuse from PSM Contractor Mgmt
- `stability/` (안정성 시험, Article 20 + ICH Q1A/Q1E)
- `self-inspection/` (자체점검, Article 15 + PIC/S Chapter 9) — default annual + risk-based adjustment
- `cleaning-validation/` (세정 밸리데이션, Article 17)
- `csv-validation/` (컴퓨터 시스템 적합성평가, Article 17 + 21 CFR Part 11 + GAMP 5)
- `pqr/` (제품품질평가, Article 12 + ICH Q7/Q10) — pattern reuse from PSM PSSR

**Evidence Models** (11) under `evidence-models/`:
- `gmp-change-control-record.json`, `gmp-deviation-record.json`, `gmp-capa-record.json`, `gmp-equipment-qualification-record.json`, `gmp-batch-record.json`, `gmp-supplier-record.json`, `gmp-stability-record.json`, `gmp-self-inspection-record.json`, `gmp-cleaning-validation-record.json`, `gmp-csv-record.json`, `gmp-pqr-record.json`
- All include ALCOA+ audit_trail, e_signature (v1 schema-only), qrm_assessment (ICH Q9 ref), nomenclature (multilingual)
- `evidence-models/base/gmp-common.schema.json` — common definitions

**Skills** (3) under `skills/`:
- `gmp-change-control/SKILL.md` — psm-moc pattern with quality impact extension
- `gmp-deviation-capa/SKILL.md` — deviation + CAPA lifecycle
- `gmp-qrm/SKILL.md` — ICH Q9 methodology matrix (FMEA, HACCP, FTA, cQRM-HAZOP, PHA). Cross-cutting skill referenced by all GMP workflows.

**Regulations** (1):
- `regulations/KR/MFDS-GMP.yaml` + `regulations/KR/MFDS-GMP.md` — KP-GMP reference with PIC/S + ICH mapping. Restores regulations/ directory (intentional for GMP module).

**Industry Profile** (1):
- `industry-profiles/pharma-general.yaml` — pharma general manufacturing profile (v1 scope)

**Scope Document**:
- `docs/gmp/scope.md` — GMP v1 scope, architecture, KPIs, compliance gates

**Agent Update**:
- `agents/risk-assessment-agent.md` — Section B scope clarification: EHS risks only (gmp-qrm handles quality risks, per meeting 2026-06-17 Q3 resolution)

### Changed (2026-06-17 — Audit Script GMP Extension)
- `scripts/safety-audit.ts` v2.0.1 → v2.1.0:
  - Added GMP workflow validation: multi-source `legal_basis` (array, ≥2 entries) check for `workflows/gmp/**/schema.yaml`
  - Added GMP evidence model validation: required common fields (`e_signature`, `qrm_assessment`, `nomenclature`, `audit_trail`) and `legal_basis.minItems ≥ 2` for `evidence-models/gmp-*.json`
  - Added role separation check: verify `risk-assessment-agent.md` references `gmp-qrm` and `product quality`; verify `gmp-qrm/SKILL.md` references `risk-assessment-agent`
  - Report now shows GMP-specific counts: `(${gmpSchemaFiles.length} GMP)` and `(${gmpEvidenceFiles.length} GMP)`

### Fixed (2026-06-16 — MCP Server Connectivity)
- Corrected `bun` arg order in `.mcp.json` and `.gemini/settings.json` — `bun --env-file .env run` → `bun run --env-file .env` (this bun version requires subcommand before flags; all 3 servers were silently failing to start)

### Added (2026-06-16 — legalize_kr v1.1.0)
- `mcp/legalize-kr/tools/admrule.ts` — `search_admrule` tool: keyword search over `.cache/admrule-kr/` (고용노동부 고시·예규·훈령)
- `mcp/legalize-kr/tools/precedent.ts` — `search_precedent` tool: GitHub Search API over `legalize-kr/precedent-kr` (62K판례, GITHUB_TOKEN required)
- `mcp/legalize-kr/git-sync.ts` — `ensureAdmruleKRRepo()` for shallow-cloning `admrule-kr` into `.cache/admrule-kr/`
- `.cache/admrule-kr/` — shallow clone of `legalize-kr/admrule-kr` (21,675 files)

### Changed (2026-06-16 — Config & Cleanup)
- `.gemini/settings.json` mcpServers updated to local `bun run` servers (removed stale `korean-law`, `mcp-kr-legislation`, `k-skill` npx entries)
- `.claude/settings.json` stale `mcpServers` block removed (authoritative config is `.mcp.json`)
- `.claude/settings.local.json` pruned — removed stale `vendor/` permission entries and codegraph npx permission
- `mcp/LICENSE_REVIEW.md` — moved from `vendor/LICENSE_REVIEW.md` (missed in directory rename)
- `AGENTS.md` — added `## Regulatory Scope` section (Tier 1–4 law registry); removed `regulations/KR/` reference from Section A agent structure

### Removed (2026-06-16 — Codegraph & Regulations)
- Removed codegraph MCP servers (`codegraph_search`, `codegraph_mutate`) from `.mcp.json`
- Removed codegraph entries from `.claude/settings.json` and `.gemini/settings.json`
- Deleted `docs/blueprint/appendix/J-codegraph-integration.md`
- Deleted `regulations/` folder (28 YAML files) — tier classification consolidated into `AGENTS.md ## Regulatory Scope`

### Changed (2026-06-16 — MCP Directory Rename)
- Renamed `vendor/` to `mcp/` for semantic clarity — servers are first-party MCP implementations, not third-party dependencies
- Renamed `mcp/mcp-kr-legislation/` to `mcp/kr-legislation/` — removed redundant `mcp-` prefix
- Updated `.mcp.json` server paths to reflect new directory structure
- MCP server names (`k_skill`, `legalize_kr`, `mcp_kr_legislation`) remain unchanged

### Added (2026-06-16 — MCP Server Implementation)
- Implemented `vendor/k-skill/` MCP server v1.0.0 — OSHA/SAPA regulation search with 24h caching (`search_osha_regulations`, `get_sapa_requirements`, `list_industry_controls`, `check_compliance_gaps`, `invalidate_cache`)
- Implemented `vendor/legalize-kr/` MCP server v1.0.0 — Korean law structure parsing from git repo (`parse_law_structure`, `find_references`, `get_law_metadata`, `compare_versions`)
- Implemented `vendor/mcp-kr-legislation/` MCP server v1.0.0 — real-time legislation API via 국가법령정보센터 (`get_current_law`, `get_law_amendments`, `interpret_regulation`, `get_penalties`, `get_compliance_guide`)
- Added `vendor/shared/` infrastructure — `types.ts`, `logger.ts`, `errors.ts`, `retry.ts`, `rate-limiter.ts`
- Added `vendor/mcp-kr-legislation/xml-parser.ts` — XML parsing with Korean encoding fallback using `fast-xml-parser`
- Installed `simple-git@3.36.0` and `fast-xml-parser@5.9.0` at workspace root

### Added (2026-06-06 — EHS Agents)
- **[2026-06-06]**: `agents/occupational-health-agent.md` — Occupational health specialist agent
- **[2026-06-06]**: `agents/chemical-safety-agent.md` — MSDS and hazardous chemical control agent
- **[2026-06-06]**: `agents/docs-writer.md` — Documentation writer agent
- **[2026-06-06]**: `AGENTS.md` updated with new agent rosters


### Added (2026-06-05 — MCP Server Configuration)
- **[2026-06-05]**: MCP server configuration with 3 stub servers (k_skill, legalize_kr, mcp_kr_legislation)
- **[2026-06-05]**: `vendor/*/index.ts` - MCP TypeScript SDK-based stub servers
- **[2026-06-05]**: `@modelcontextprotocol/sdk@1.29.0` - Official MCP TypeScript SDK installed
- **[2026-06-05]**: `docs/superpowers/specs/2026-06-05-mcp-server-design.md` - Comprehensive design spec
- **[2026-06-05]**: `docs/superpowers/plans/2026-06-05-mcp-server-implementation.md` - Implementation plan
- **[2026-06-05]**: `memory/meeting-2026-06-05-mcp-server-design.md` - Meeting transcript
- **[2026-06-05]**: `.mcp.json` - Updated with vendor/ paths and correct server names
- **[2026-06-05]**: `.cache/` directories initialized for k_skill and legalize-kr

### Changed (2026-06-05)
- **[2026-06-05]**: `codegraph` package installation and .mcp.json path fixes

### Added (2026-06-05 — Phase A completion)
- **[2026-06-05]**: Platform files: `.claude/settings.json`, `.gemini/settings.json` with Safety OS-specific hooks
- **[2026-06-05]**: Slash commands: `.claude/commands/` and `.gemini/commands/` (6 commands each)
- **[2026-06-05]**: Platform skills: `.claude/skills/` (8 skills) and `.gemini/skills/` (5 skills) from workspace common
- **[2026-06-05]**: Root skills: `skills/` — 11 common skills + 4 Safety OS domain skills (15 total)
- **[2026-06-05]**: Common scripts: `scripts/` — Tier 1+2 scripts (56 total) including `safety-audit.ts`
- **[2026-06-05]**: 7 Safety OS agents with 3-Section structure (pm/CSO, SGM, SWM, compliance, risk-assessment, emergency, audit)
- **[2026-06-05]**: 4 domain SKILL.md files (risk-assessment, permit-to-work, emergency-response, compliance-gap)
- **[2026-06-05]**: 6 manufacturing daily workflows with `legal_basis` fields (all passing `safety-audit.ts`)
- **[2026-06-05]**: `evidence-models/base/` — finding and corrective-action JSON schemas (v1.0.0)
- **[2026-06-05]**: `variant.json` — full schema with `inherits_common`, `skill_manifest`, `lifecycle` fields
- **[2026-06-05]**: `README.md` and `README_ko.md` — Safety OS platform documentation
- **[2026-06-05]**: `docs/co-safety.context.md` — domain context for all Safety OS agents
- **[2026-06-05]**: `docs/VERSION_MANIFEST.md` — Safety OS artifact version tracking
- **[2026-06-05]**: `docs/reports/` and `docs/procedures/` — Safety OS document subdirectories
- **[2026-06-05]**: `SECURITY.md` — security policy stub (Phase B completion required)
- **[2026-06-05]**: `memory/MEMORY.md` — session memory index
- **[2026-06-05]**: `.gitignore`, `.env.sample`, `.env` — environment configuration
- **[2026-06-05]**: `.githooks/` — git commit/push protection hooks
- **[2026-06-05]**: `git init` + `core.hooksPath .githooks` — git repository initialized
- **[2026-06-05]**: `scripts/bun.lock` — Bun package lock (bun install complete)
- **[2026-06-05]**: CodeGraph initialized for AI context search
- **[2026-06-05]**: `PROMOTION_CHECKLIST.md` updated — conditions 1/3/4/5 verified ✅

### Added (2026-06-04 — Phase A scaffold)
- **[2026-06-05]**: Initial Safety OS Phase A scaffold — directory structure, placeholder files, and base documentation
- **[2026-06-05]**: `_ORIGIN.md` — workspace common version snapshot and reconcile survival notes
- **[2026-06-05]**: `_COMMON_VERSION.md` — workspace root version reference for Phase B promotion tracking
- **[2026-06-05]**: `PROMOTION_CHECKLIST.md` — 7 Phase B promotion conditions with verification commands
- **[2026-06-05]**: `CLAUDE.md` and `GEMINI.md` — adapted from workspace root with Safety OS Context section
- **[2026-06-05]**: `AGENTS.md` — adapted from workspace root with Safety OS agent roster stubs
- **[2026-06-05]**: `industry-profiles/manufacturing.yaml` — manufacturing industry profile MVP stub
- **[2026-06-05]**: `regulations/KR/tier1-laws/` — metadata stubs for OSHA-KR and SAPA
- **[2026-06-05]**: `workflows/_template/` — 7-section standard workflow template and schema
- **[2026-06-05]**: `.mcp.json` — minimal MCP config with codegraph server
- **[2026-06-05]**: Directory structure: `agents/`, `skills/`, `workflows/`, `regulations/`, `evidence-models/`, `docs/`, `memory/`, `scripts/`
