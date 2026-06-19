# Safety OS

> AI-driven Korean EHS/GxP compliance orchestration platform with 2-Tier functional × industry matrix architecture.
> 한국어 가이드: [README_ko.md](README_ko.md)

---

## 📖 For New Users — Start Here

> **First time?** These documents explain how to use the agent team and workflows:

| # | Document | What You'll Learn |
|---|----------|-------------------|
| 1 | **[User Scenarios](docs/_shared/user-scenarios.md)** | 5 real-world walkthroughs: new chemical introduction, clinical SAE reporting, construction daily safety, pharma cold chain, chemical plant turnaround |
| 2 | **[User Guide](docs/_shared/user-guide.md)** | How to select the right domain and dispatch agents (matrix coordinator pattern) |
| 3 | **[Domain Classification Guide](docs/_shared/domain-classification-guide.md)** | 3-tier system (functional / industry / cross-cutting) — which domain handles what |

---

## Active Domains (13)

### Functional Layer (Tier 1) — cross-industry methodology & data services

| Domain | Coverage | Workflows |
|--------|----------|-----------|
| `psm` | Process Safety Management (OSHA 14 elements) | 11 |
| `msds` | Chemical Substance Safety / GHS Rev 9 | 7 |
| `gmp` | Pharmaceutical Manufacturing Quality | 10 |
| `gdp` | Pharmaceutical Distribution / GDP | 8 |
| `glp` | Non-Clinical Laboratory Studies / OECD | 8 |
| `gcp` | Clinical Trial Management / ICH E6(R3) | 8 |
| `gvp` | Post-Market Pharmacovigilance / ICH E2 | 8 |
| `training` | Safety Training Management (OSHA-KR Art 13/29/31/32/114) | 8 |

### Industry Layer (Tier 2) — industry-specific operations

| Domain | Coverage | Workflows |
|--------|----------|-----------|
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

```
                 Pharma    Chemical    Gas/Energy    Power    Construction    MedDevice
PSM (func)         -         ✓           ✓           ✓          -               -
MSDS (func)        ✓         ✓           ✓           ✓          ✓               ✓
GxP (func)         ✓(all)    -           -           -          -               -
Training (func)    ✓         ✓           ✓           ✓          ✓               ✓
Emergency (cc)     ✓         ✓           ✓           ✓          ✓               ✓
──────────────────────────────────────────────────────────────────────────────────────────
ehsconst (ind)                                              ✓
ehschem (ind)               ✓
gasterm (ind)                           ✓
powergen (ind)                                      ✓
meddevice (ind)                                                                 ✓
```

**Industry domains = matrix coordinators.** They dispatch to functional services (PSM, MSDS, Training) for cross-cutting concerns. [Learn more →](docs/_shared/domain-classification-guide.md)

---

## 📚 Key Documents

### Getting Started (for all users)
| Document | Purpose | Lang |
|----------|---------|------|
| **[User Scenarios](docs/_shared/user-scenarios.md)** / **[사용자 시나리오](docs/_shared/user-scenarios_ko.md)** | 5 real-world walkthroughs | EN/KO |
| **[User Guide](docs/_shared/user-guide.md)** | Domain selection + dispatch patterns | EN |
| **[Domain Classification Guide](docs/_shared/domain-classification-guide.md)** | 3-tier classification + matrix dispatch | EN |

### Architecture & Design
| Document | Purpose |
|----------|---------|
| [Architecture Overview](docs/_meta/architecture-overview.md) | 13-domain system architecture |
| [Domain Onboarding Guide](docs/_shared/domain-onboarding-guide.md) | 11-step SOP for adding new domains + Active Domains Registry |
| [Reference Workflow Pattern](docs/_shared/reference-workflow-pattern.md) | Reference workflow design (10 applications) |

### Integration
| Document | Purpose |
|----------|---------|
| [MCP Integration Guide](docs/_shared/mcp-integration-guide.md) | Korean legislation MCP server connection |

### Domain Scope Documents
| Domain | Scope |
|--------|-------|
| Functional | [GMP](docs/domains/functional/gmp/scope.md) · [GDP](docs/domains/functional/gdp/scope.md) · [GLP](docs/domains/functional/glp/scope.md) · [GCP](docs/domains/functional/gcp/scope.md) · [GVP](docs/domains/functional/gvp/scope.md) · [MSDS](docs/domains/functional/msds/scope.md) · [Training](docs/domains/functional/training/scope.md) |
| Industry | [ehsconst](docs/domains/industry/ehsconst/scope.md) · [ehschem](docs/domains/industry/ehschem/scope.md) · [gasterm](docs/domains/industry/gasterm/scope.md) · [powergen](docs/domains/industry/powergen/scope.md) · [meddevice](docs/domains/industry/meddevice/scope.md) |

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
bun skills/domains/functional/gmp/qrm/fmea-scoring.ts                        # FMEA risk scoring
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
agents/domains/functional/     ← PSM, MSDS, GxP, Training agents
agents/domains/industry/       ← ehsconst, ehschem, gasterm, powergen, meddevice agents
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

약사법, 산업안전보건법 (OSHA-KR), 중대재해처벌법 (SAPA), K-REACH, GHS Rev 9, ICH E6(R3)/E2 series, OECD GLP (MAD), PIC/S GDP, 건설기술진혁법, 고압가스법, 전기사업법, 화학물질관리법, 대기/수질환경보전법, 의료기기법.

## Disclaimer

This system provides workflow automation assistance only. Regulatory interpretation and final compliance decisions are the responsibility of qualified legal/EHS/GxP professionals.
본 시스템은 워크플로우 자동화 지원만 제공합니다. 규제 해석 및 최종 컴플라이언스 판단은 자격을 갖춘 법률/EHS/GxP 전문가의 책임입니다.

*Last Updated: 2026-06-19*
