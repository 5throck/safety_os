# Safety OS — AI-Powered EHS Platform

> South Korea EHS compliance automation powered by Claude Code Harness Engineering

## Overview

Safety OS is an AI Agent-based Safety Operating System designed for South Korea's EHS (Environmental Health & Safety) sector. It automates critical safety workflows while maintaining auditable evidence trails required by Korean law.

## Regulatory Framework

| Law | Scope | Effective |
|-----|-------|-----------|
| 산업안전보건법 (OSHA-KR) | Primary EHS framework | 1990 (amended 2023) |
| 중대재해처벌법 (SAPA) | Serious accident criminal liability | 2022-01-27 |

## Architecture

```
PM (CSO — Chief Safety Officer)
├── Safety Governance Manager (SGM) — Strategy
│     KPIs, policy approval, regulatory monitoring
└── Safety Workflow Manager (SWM) — Execution
      ├── Compliance Agent
      ├── Risk Assessment Agent
      ├── Emergency Agent
      └── Audit Agent
```

## Core Workflows (Manufacturing MVP)

| Workflow | Legal Basis | Status |
|----------|-------------|--------|
| Risk Assessment (위험성평가) | 산업안전보건법 제36조 | ✅ Active |
| Permit to Work (작업허가서) | 산업안전보건법 제38조 | ✅ Active |
| Equipment Inspection (설비점검) | 산업안전보건법 제93조 | ✅ Active |
| Contractor Management (도급관리) | 산업안전보건법 제63조 | ✅ Active |
| Safety Training (안전교육) | 산업안전보건법 제29조 | ✅ Active |
| Safety Patrol (안전순찰) | 산업안전보건법 제15조 | ✅ Active |

## Quick Start

```bash
# Validate legal_basis compliance
bun scripts/safety-audit.ts

# Start a risk assessment
/risk-assessment

# Emergency response
/emergency-response
```

## Project Status

**Phase A** — Independent prototype development in progress.
See [PROMOTION_CHECKLIST.md](PROMOTION_CHECKLIST.md) for Phase B promotion criteria (7 conditions).

## Disclaimer

This system provides workflow automation assistance only. Regulatory interpretation is the sole responsibility of qualified legal professionals and the user organization.
