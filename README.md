# Safety OS

> AI-driven Korean EHS (Environment · Health · Safety) and GxP compliance orchestration platform.

## What Is This?

Safety OS is an agentic compliance system that automates safety, quality, and regulatory workflows for Korean industry. It covers the full pharmaceutical lifecycle (GLP → GCP → GMP → GDP → GVP) plus EHS verticals (PSM, MSDS, Construction), each as an independent domain with workflows, evidence models, skills, and regulations.

## Active Domains (8)

| Domain | Coverage | Status |
|--------|----------|--------|
| `psm` | Process Safety Management (chemical plants) | active |
| `gmp` | Pharmaceutical Manufacturing Quality | active (v1) |
| `msds` | Chemical Substance Safety / GHS | active (v1) |
| `gdp` | Pharmaceutical Distribution | active (v1) |
| `glp` | Non-Clinical Laboratory Studies | active (v1) |
| `gcp` | Clinical Trial Management | active (v1) |
| `gvp` | Post-Market Pharmacovigilance | active (v1) |
| `ehsconst` | Construction Safety | active (v1) |

## Repository Structure

```
.
├── agents/
│   ├── _core/                       # pm, sgm, swm
│   ├── _shared/                     # cross-domain specialists
│   └── domains/<domain>/            # domain-specific agents
├── docs/
│   ├── _meta/                       # architecture, blueprint
│   ├── _shared/                     # cross-domain guides
│   └── domains/<domain>/            # domain scope docs
├── evidence-models/
│   ├── _shared/base/                # common.schema.json (ALCOA+ definitions)
│   ├── emergency/                   # 7 emergency evidence models
│   └── domains/<domain>/            # domain-specific schemas
├── industry-profiles/               # 11 industry YAML profiles
├── regulations/
│   ├── KR/                          # Korean regulations
│   └── international/               # ICH, OECD, etc.
├── skills/
│   ├── _shared/                     # cross-domain skills
│   └── domains/<domain>/            # domain-specific skills
├── workflows/
│   ├── _shared/_template/           # workflow template
│   ├── daily/<industry>/            # daily EHS operations
│   ├── emergency/                   # 9 emergency scenarios
│   └── domains/<domain>/            # domain-specific workflows
└── scripts/
    ├── safety-audit.ts              # v2.8.0 audit (multi-domain validation)
    └── test-*-profile.ts            # profile field tests
```

## Multi-Agent Workflow

```
PM (CSO — Chief Safety Officer)
├── SGM (Safety Governance Manager) — strategy
│     KPIs, policies, regulatory monitoring
├── SWM (Safety Workflow Manager) — execution
│   ├── compliance-agent
│   ├── risk-assessment-agent
│   ├── emergency-agent
│   ├── audit-agent
│   └── domain agents (gmp, msds, gdp, glp, gcp, gvp, ehsconst, psm)
```

## Quick Start

```bash
# Install dependencies
bun install

# Run audit (validates all 280+ files)
bun scripts/safety-audit.ts

# Profile field tests
bun scripts/test-pharma-general-profile.ts        # GMP
bun scripts/test-chemical-handling-profile.ts     # MSDS
```

## Verification

- **280+ files** (workflows, evidence models, regulations) — multi-source `legal_basis`, ALCOA+ audit trail, common fields
- **80 workflows** across 8 domains + 9 emergency scenarios + 14 daily EHS operations
- **6 reference workflows** dispatching to `emergency-agent` and `compliance-agent`
- **Domain Onboarding SOP** validated across 5 consecutive new domain additions

## Korean Regulatory Coverage

- **약사법** (Pharmaceutical Affairs Act) — GMP, GDP, GCP, GVP
- **산업안전보건법** (OSHA-KR) — PSM, MSDS, Construction
- **중대재해처벌법** (SAPA) — Article 12 construction-specific
- **화학물질등록 및 평가 등에 관한 법률** (K-REACH) — MSDS, GLP
- **UN GHS Rev 9** — MSDS hazard classification
- **ICH E6(R3), E2 series** — GCP, GVP international alignment
- **OECD GLP** — Mutual Acceptance of Data (MAD)
- **PIC/S GDP** — distribution harmonization
- **건설기술진황법** — independent safety supervision

## Disclaimer

이 시스템은 워크플로우 자동화 지원만 제공합니다. 규제 해석 및 최종 컴플라이언스 판단은 자격을 갖춘 법률/EHS/GxP 전문가의 책임입니다.

*Last Updated: 2026-06-18*
