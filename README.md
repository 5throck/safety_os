# Safety OS

> AI-driven Korean EHS/GxP compliance orchestration platform with 2-Tier functional × industry matrix architecture.
> 한국어 가이드는 [README_ko.md](README_ko.md)를 참조하세요.

## Active Domains (12)

### Functional Layer (Tier 1) — methodology & data services

| Domain | Coverage |
|--------|----------|
| `psm` | Process Safety Management (11 workflows, OSHA 14 elements) |
| `msds` | Chemical Substance Safety / GHS Rev 9 (7 workflows) |
| `gmp` | Pharmaceutical Manufacturing Quality (10 workflows) |
| `gdp` | Pharmaceutical Distribution / GDP (8 workflows) |
| `glp` | Non-Clinical Laboratory Studies / OECD (8 workflows) |
| `gcp` | Clinical Trial Management / ICH E6(R3) (8 workflows) |
| `gvp` | Post-Market Pharmacovigilance / ICH E2 (8 workflows) |

### Industry Layer (Tier 2) — industry-specific operations

| Domain | Coverage |
|--------|----------|
| `ehsconst` | Construction Safety / SAPA Article 12 (9 workflows) |
| `ehschem` | Chemical Plant / Refining·Petrochemical·Specialty (8 workflows) |
| `gasterm` | Gas Terminal / LNG·LPG·Hydrogen (8 workflows) |
| `powergen` | Power Generation / Thermal·Renewable, Nuclear excluded (8 workflows) |
| `meddevice` | Medical Device / KGMP-MD·ISO 13485·ISO 14971 (8 workflows) |

### Cross-Cutting (Tier 3)

| Service | Coverage |
|---------|----------|
| `emergency/` | 9 scenarios (fire, disaster, medical, chemical, explosion, rescue, electrical, mechanical) |
| `daily/` | 14 EHS daily workflows (risk-assessment, permit-to-work, etc.) |

## 2-Tier Matrix Architecture

```
                 Pharma    Chemical    Gas/Energy    Power    Construction    MedDevice
PSM (func)         -         ✓(chem)     ✓(gas)      ✓(pow)      -               -
MSDS (func)        ✓         ✓           ✓           ✓          ✓               ✓
GxP (func)         ✓(all)    -           -           -          -               -
Emergency (cc)     ✓         ✓           ✓           ✓          ✓               ✓
──────────────────────────────────────────────────────────────────────────────────────────
ehsconst (ind)                                             ✓
ehschem (ind)               ✓
gasterm (ind)                           ✓
powergen (ind)                                      ✓
meddevice (ind)                                                                 ✓
```

Industry domains are **matrix coordinators** — they dispatch to functional services (PSM, MSDS) for cross-cutting concerns.

---

## 📚 Key Documents (문서 가이드)

> **New user?** Start here: [User Scenarios](docs/_shared/user-scenarios.md) · [한국어 시나리오](docs/_shared/user-scenarios_ko.md)

### Getting Started
| Document | Purpose | Language |
|----------|---------|----------|
| [User Scenarios](docs/_shared/user-scenarios.md) | 5 real-world walkthroughs (new chemicals, SAE reporting, construction, cold chain, turnaround) | EN |
| [사용자 시나리오](docs/_shared/user-scenarios_ko.md) | 실전 활용 가이드 (5개 시나리오) | KO |
| [User Guide](docs/_shared/user-guide.md) | Domain selection + dispatch patterns | EN |

### Architecture & Design
| Document | Purpose |
|----------|---------|
| [Architecture Overview](docs/_meta/architecture-overview.md) | 12-domain system architecture |
| [Domain Classification Guide](docs/_shared/domain-classification-guide.md) | 3-tier classification (functional/industry/cross-cutting) + matrix dispatch |
| [Domain Onboarding Guide](docs/_shared/domain-onboarding-guide.md) | 11-step SOP for adding new domains + Active Domains Registry |
| [Reference Workflow Pattern](docs/_shared/reference-workflow-pattern.md) | Reference workflow design pattern (10 applications) |

### Integration
| Document | Purpose |
|----------|---------|
| [MCP Integration Guide](docs/_shared/mcp-integration-guide.md) | Korean legislation MCP server connection |

### Domain Scope Documents
| Domain | Scope |
|--------|-------|
| [GMP](docs/domains/functional/gmp/scope.md) | Pharmaceutical Manufacturing |
| [GDP](docs/domains/functional/gdp/scope.md) | Pharmaceutical Distribution |
| [GLP](docs/domains/functional/glp/scope.md) | Non-Clinical Laboratory |
| [GCP](docs/domains/functional/gcp/scope.md) | Clinical Trials |
| [GVP](docs/domains/functional/gvp/scope.md) | Pharmacovigilance |
| [MSDS](docs/domains/functional/msds/scope.md) | Chemical Substance Safety |
| [ehsconst](docs/domains/industry/ehsconst/scope.md) | Construction Safety |
| [ehschem](docs/domains/industry/ehschem/scope.md) | Chemical Plant |
| [gasterm](docs/domains/industry/gasterm/scope.md) | Gas Terminal |
| [powergen](docs/domains/industry/powergen/scope.md) | Power Generation |
| [meddevice](docs/domains/industry/meddevice/scope.md) | Medical Device |

---

## Quick Start

```bash
bun install
bun scripts/safety-audit.ts                         # 443+ files, 0 errors
bun scripts/test-domain-scenarios.ts                # 5 real-world scenarios (56 checks)
bun scripts/test-cross-domain-integration.ts        # cross-domain integrity (8 checks)
```

### Rule-Based Skills (executable)

```bash
bun skills/domains/functional/gmp/qrm/fmea-scoring.ts                        # FMEA risk scoring
bun skills/domains/functional/msds/ghs-classifier/ghs-classifier.ts          # GHS hazard classification
bun skills/domains/industry/ehsconst/fall-hazard-assessor/fall-hazard-assessor.ts  # Fall hazard assessment
```

### Sync (commit + push + PR)

```bash
bun scripts/dev-sync.ts "commit message"
```

## Korean Regulatory Coverage

약사법, 산업안전보건법 (OSHA-KR), 중대재해처벌법 (SAPA), K-REACH, GHS Rev 9, ICH E6(R3)/E2 series, OECD GLP (MAD), PIC/S GDP, 건설기술진흥법, 고압가스법, 전기사업법, 화학물질관리법, 대기/수질환경보전법, 의료기기법.

## Disclaimer

This system provides workflow automation assistance only. Regulatory interpretation and final compliance decisions are the responsibility of qualified legal/EHS/GxP professionals.
본 시스템은 워크플로우 자동화 지원만 제공합니다. 규제 해석 및 최종 컴플라이언스 판단은 자격을 갖춘 법률/EHS/GxP 전문가의 책임입니다.

*Last Updated: 2026-06-19*
