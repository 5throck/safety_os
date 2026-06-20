# Safety OS

> AI-driven Korean EHS/GxP compliance orchestration platform with 2-Tier functional × industry matrix architecture.
> Korean guide: [README_ko.md](README_ko.md)

---

## 📖 For New Users — Start Here

> **First time?** These documents explain how to use the agent team and workflows:

| # | Document | What You'll Learn |
|---|----------|-------------------|
| 1 | **[Tutorial](docs/_shared/tutorial.md)** / [KO](docs/_shared/tutorial_ko.md) | Onboarding tutorial — getting started with Safety OS end-to-end |
| 2 | **[User Scenarios](docs/_shared/user-scenarios.md)** / [KO](docs/_shared/user-scenarios_ko.md) | 5 real-world walkthroughs: new chemical introduction, clinical SAE reporting, construction daily safety, pharma cold chain, chemical plant turnaround |
| 3 | **[User Guide](docs/_shared/user-guide.md)** / [KO](docs/_shared/user-guide_ko.md) | How to select the right domain and dispatch agents (matrix coordinator pattern) |
| 4 | **[Domain Classification Guide](docs/_shared/domain-classification-guide.md)** / [KO](docs/_shared/domain-classification-guide_ko.md) | 3-tier system (functional / industry / cross-cutting) — which domain handles what |

---

## Active Domains (13)

### Functional Layer (Tier 1) — cross-industry methodology & data services

| Domain | Coverage | Workflows |
|--------|----------|-----------|
| `psm` | Process Safety Management (OSHA 14 elements) | 11 |
| `msds` | Chemical Substance Safety / GHS Rev 9 | 7 |
| `training` | Safety Training Management (OSHA-KR Art 13/29/31/32/114) | 8 |

### Industry Layer (Tier 2) — industry-specific operations

| Domain | Coverage | Workflows |
|--------|----------|-----------|
| `gmp` | Pharmaceutical Manufacturing Quality | 10 |
| `gdp` | Pharmaceutical Distribution / GDP | 8 |
| `glp` | Non-Clinical Laboratory Studies / OECD | 8 |
| `gcp` | Clinical Trial Management / ICH E6(R3) | 8 |
| `gvp` | Post-Market Pharmacovigilance / ICH E2 | 8 |
| `ehsconst` | Construction Safety / SAPA Article 12 | 9 |
| `ehschem` | Chemical Plant / Refining·Petrochemical·Specialty | 8 |
| `gasterm` | Gas Terminal / LNG·LPG·Hydrogen | 8 |
| `powergen` | Power Generation / Thermal·Renewable (nuclear excluded) | 8 |
| `meddevice` | Medical Device / KGMP-MD·ISO 13485·ISO 14971 | 8 |

### Cross-Cutting (Tier 3)

| Service | Coverage |
|---------|----------|
| `emergency/` | 9 scenarios (fire, disaster, medical, chemical, explosion, rescue, electrical, mechanical) |
| `daily/` | 14 EHS daily workflows (risk-assessment, permit-to-work, etc.) |

---

## 2-Tier Matrix Architecture

| Domain (Tier) | Pharma | Chemical | Gas/Energy | Power | Construction | MedDevice |
|---------------|:------:|:--------:|:----------:|:-----:|:------------:|:---------:|
| **Functional Services** | | | | | | |
| `psm` (Process Safety) | | ✓ | ✓ | ✓ | | |
| `msds` (Chemical Data) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `training` (Safety Education) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `emergency` (Cross-Cutting) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| **Industry Coordinators** | | | | | | |
| `gmp/gdp/glp/gcp/gvp` (GxP Pharma) | **●** | | | | | |
| `ehsconst` (Construction) | | | | | **●** | |
| `ehschem` (Chemical Plant) | | **●** | | | | |
| `gasterm` (Gas Terminal) | | | **●** | | | |
| `powergen` (Power Gen) | | | | **●** | | |
| `meddevice` (Medical Device) | | | | | | **●** |

> `✓` = functional service applies to this industry · `●` = industry domain owns this column · (blank) = not applicable
>
> **Industry domains = matrix coordinators.** They dispatch to functional services (PSM, MSDS, Training) for cross-cutting concerns. [Learn more →](docs/_shared/domain-classification-guide.md) ([KO](docs/_shared/domain-classification-guide_ko.md))

---

## 📚 Key Documents

### Getting Started (for all users)
| Document | Purpose | Lang |
|----------|---------|------|
| **[Tutorial](docs/_shared/tutorial.md)** / [KO](docs/_shared/tutorial_ko.md) | Onboarding tutorial | EN/KO |
| **[User Scenarios](docs/_shared/user-scenarios.md)** / [KO](docs/_shared/user-scenarios_ko.md) | 5 real-world walkthroughs | EN/KO |
| **[User Guide](docs/_shared/user-guide.md)** / [KO](docs/_shared/user-guide_ko.md) | Domain selection + dispatch patterns | EN/KO |
| **[Domain Classification Guide](docs/_shared/domain-classification-guide.md)** / [KO](docs/_shared/domain-classification-guide_ko.md) | 3-tier classification + matrix dispatch | EN/KO |

### Architecture & Design
| Document | Purpose | Lang |
|----------|---------|------|
| [Architecture Overview](docs/_meta/architecture-overview.md) | 13-domain system architecture | EN |
| [Domain Onboarding Guide](docs/_shared/domain-onboarding-guide.md) / [KO](docs/_shared/domain-onboarding-guide_ko.md) | 11-step SOP for adding new domains + Active Domains Registry | EN/KO |
| [Reference Workflow Pattern](docs/_shared/reference-workflow-pattern.md) / [KO](docs/_shared/reference-workflow-pattern_ko.md) | Reference workflow design (10 applications) | EN/KO |

### Integration
| Document | Purpose | Lang |
|----------|---------|------|
| [MCP Integration Guide](docs/_shared/mcp-integration-guide.md) / [KO](docs/_shared/mcp-integration-guide_ko.md) | Korean legislation MCP server connection | EN/KO |

### Domain Scope Documents
| Domain | Scope |
|--------|-------|
| Functional | [MSDS](docs/domains/functional/msds/scope.md) · [Training](docs/domains/functional/training/scope.md) |
| Industry | [GMP](docs/domains/industry/gmp/scope.md) · [GDP](docs/domains/industry/gdp/scope.md) · [GLP](docs/domains/industry/glp/scope.md) · [GCP](docs/domains/industry/gcp/scope.md) · [GVP](docs/domains/industry/gvp/scope.md) · [ehsconst](docs/domains/industry/ehsconst/scope.md) · [ehschem](docs/domains/industry/ehschem/scope.md) · [gasterm](docs/domains/industry/gasterm/scope.md) · [powergen](docs/domains/industry/powergen/scope.md) · [meddevice](docs/domains/industry/meddevice/scope.md) |

---

## Quick Start

```bash
bun install
bun scripts/safety-audit.ts                         # 458+ files, 0 errors
bun scripts/test-domain-scenarios.ts                # 5 real-world scenarios (56 checks)
bun scripts/test-cross-domain-integration.ts        # cross-domain integrity (8 checks)
```

### Rule-Based Skills (executable TypeScript)

```bash
bun skills/domains/industry/gmp/qrm/fmea-scoring.ts                        # FMEA risk scoring
bun skills/domains/functional/msds/ghs-classifier/ghs-classifier.ts          # GHS hazard classification
bun skills/domains/industry/ehsconst/fall-hazard-assessor/fall-hazard-assessor.ts  # Fall hazard assessment
```

### Sync Pipeline (commit + push + PR)

```bash
bun scripts/dev-sync.ts "feat: description of changes"
```

---

## Repository Structure

```
agents/domains/functional/     ← PSM, MSDS, Training agents
agents/domains/industry/       ← GxP (GMP/GDP/GLP/GCP/GVP), ehsconst, ehschem, gasterm, powergen, meddevice agents
workflows/domains/functional/  ← cross-industry workflows
workflows/domains/industry/    ← industry-specific workflows
evidence-models/domains/       ← JSON schemas (functional/ + industry/)
skills/domains/                ← SKILL.md + executable .ts skills
workflows/emergency/           ← 9 cross-cutting emergency scenarios
workflows/daily/               ← 14 daily EHS workflows
regulations/KR/                ← Korean regulations (OSHA-KR, SAPA, MFDS, etc.)
regulations/international/     ← ICH, OECD, GHS
```

## Korean Regulatory Coverage

Pharmaceutical Affairs Act, Occupational Safety and Health Act (OSHA-KR), Serious Accidents Punishment Act (SAPA), K-REACH (ARECS), GHS Rev 9, ICH E6(R3)/E2 series, OECD GLP (MAD), PIC/S GDP, Construction Technology Promotion Act, High-Pressure Gas Safety Control Act, Electric Utility Act, Chemicals Control Act (CCA), Clean Air & Water Quality Conservation Acts, Medical Device Act.

## Disclaimer

This system provides workflow automation assistance only. Regulatory interpretation and final compliance decisions are the responsibility of qualified legal/EHS/GxP professionals.

*Last Updated: 2026-06-19*
