# Safety OS — Domain Context

## Purpose
This document provides domain context for all Safety OS agents. Load this at the start of any Safety OS session.

## Regulatory Framework

### 산업안전보건법 (Occupational Safety and Health Act, OSHA-KR)
- Primary workplace safety framework in South Korea
- Enforced by: 고용노동부 (Ministry of Employment and Labor)
- Key articles:
  - 제15조 — 안전보건관리책임자 직무 (Safety manager duties)
  - 제29조 — 근로자 안전보건교육 (Worker safety training)
  - 제36조 — 위험성평가 실시 (Risk assessment)
  - 제38조 — 안전조치 (Safety measures)
  - 제39조 — 보건조치 (Health measures)
  - 제54조 — 중대재해 발생 시 조치 (Serious accident response)
  - 제63조 — 도급인의 안전보건조치 (Contractor safety)
  - 제93조 — 안전검사 (Safety inspection)

### 중대재해처벌법 (Serious Accidents Punishment Act, SAPA)
- Criminal liability for serious industrial accidents
- Effective: 2022-01-27 (5+ permanent workers)
- Key articles:
  - 제4조 — 사업주·경영책임자 안전보건 확보의무 (CEO safety duty)
  - 제6조 — 중대산업재해 처벌 (Criminal penalties)
  - 제13조 — 중대재해 기록 보존 (Record keeping obligation)

## Agent Hierarchy

```
PM (CSO — Chief Safety Officer)
  Governance track : PM → SGM → strategic decisions
  Operations track : PM → SWM → specialist agents
  Emergency track  : PM → emergency-agent  [SGM bypassed]
```

## Critical Rules

1. **`legal_basis` field is mandatory** in every workflow record — enforced by `scripts/safety-audit.ts`
2. **Regulation content**: store metadata/references only — never embed full statutory text
3. **Evidence schemas** (`evidence-models/base/`): semver bump + migration script required on any change
4. **Legal interpretation**: user/organization responsibility only — this system provides automation assistance, not legal advice

## Workflow Library

Location: `workflows/daily/manufacturing/`

| Workflow | Legal Basis | Agent Chain |
|----------|-------------|-------------|
| risk-assessment | 제36조 | SWM → risk-assessment-agent |
| permit-to-work | 제38조, 제39조 | SWM → risk-assessment-agent → compliance-agent |
| equipment-inspection | 제93조 | SWM → audit-agent |
| contractor-management | 제63조 | SWM → compliance-agent → risk-assessment-agent |
| safety-training | 제29조 | SWM → compliance-agent |
| safety-patrol | 제15조, 제16조 | SWM → risk-assessment-agent → audit-agent |

## Evidence Trail

| Schema | ID Format | Status |
|--------|-----------|--------|
| `evidence-models/base/finding.schema.json` | FIND-YYYY-NNNN | Phase B: read-only |
| `evidence-models/base/corrective-action.schema.json` | CA-YYYY-NNNN | Phase B: read-only |

> Agents are **read-only** on evidence-models until Phase B promotion is confirmed.
