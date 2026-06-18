# Safety OS

> AI-driven Korean EHS/GxP compliance orchestration platform with 2-Tier functional × industry matrix architecture.

## Active Domains (11)

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
| `ehschem` | Chemical Plant / 정유·석유화학·정밀화학 (8 workflows) |
| `gasterm` | Gas Terminal / LNG·LPG·수소 (8 workflows) |
| `powergen` | Power Generation / 화력·신재생, 원자력 제외 (8 workflows) |

### Cross-Cutting (Tier 3)

| Service | Coverage |
|---------|----------|
| `emergency/` | 9 scenarios (fire, disaster, medical, chemical, explosion, rescue, electrical, mechanical) |
| `daily/` | 14 EHS daily workflows (risk-assessment, permit-to-work, etc.) |

## 2-Tier Matrix Architecture

```
                 Pharma    Chemical    Gas/Energy    Power    Construction
PSM (func)         -         ✓(chem)     ✓(gas)      ✓(pow)      -
MSDS (func)        ✓         ✓           ✓           ✓          ✓
GxP (func)         ✓(all)    -           -           -          -
Emergency (cc)     ✓         ✓           ✓           ✓          ✓
─────────────────────────────────────────────────────────────────────────────
ehsconst (ind)                                             ✓
ehschem (ind)               ✓
gasterm (ind)                           ✓
powergen (ind)                                      ✓
```

Industry domains are **matrix coordinators** — they dispatch to functional services (PSM, MSDS) for cross-cutting concerns.

## Repository Structure (2-Tier)

```
agents/domains/functional/     ← PSM, MSDS, GxP agents
agents/domains/industry/       ← ehsconst, ehschem, gasterm, powergen agents
workflows/domains/functional/  ← functional workflows
workflows/domains/industry/    ← industry workflows
evidence-models/domains/functional/
evidence-models/domains/industry/
skills/domains/functional/
skills/domains/industry/
workflows/emergency/           ← 9 cross-cutting emergency scenarios
workflows/daily/                ← 14 daily EHS workflows
regulations/KR/                 ← Korean regulations
regulations/international/      ← ICH, OECD, GHS
```

## Quick Start

```bash
bun install
bun scripts/safety-audit.ts                         # 356+ files, 0 errors
bun scripts/test-pharma-general-profile.ts          # GMP field test
bun scripts/test-chemical-handling-profile.ts       # MSDS field test
bun scripts/test-cross-domain-integration.ts        # cross-domain scenario test
```

## Key Documents

- `docs/_shared/domain-classification-guide.md` — 3-tier dispatch guide + matrix
- `docs/_shared/domain-onboarding-guide.md` — 11-step SOP for new domains
- `docs/_shared/reference-workflow-pattern.md` — reference workflow pattern (8 applications)

## Korean Regulatory Coverage

약사법, 산업안전보건법 (OSHA-KR), 중대재해처벌법 (SAPA), K-REACH, GHS Rev 9, ICH E6(R3)/E2 series, OECD GLP (MAD), PIC/S GDP, 건설기술진흥법, 고압가스법, 전기사업법, 화학물질관리법, 대기/수질환경보전법.

## Disclaimer

이 시스템은 워크플로우 자동화 지원만 제공합니다. 규제 해석 및 최종 컴플라이언스 판단은 자격을 갖춘 법률/EHS/GxP 전문가의 책임입니다.

*Last Updated: 2026-06-18*
