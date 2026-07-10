---
name: psm-loto
owner: psm-agent
scope: workspace
status: stub
description: >
  Execute Lockout/Tagout (LOTO) procedure verification per KOSHA GUIDE Z-40-2022 and
  안전보건기준규칙 Article 92. Ensures energy isolation, lock application, verification,
  and return-to-service protocols are followed for hazardous energy sources.
version: 0.1.0
created: 2026-07-09
last_updated: 2026-07-09
metadata:
  type: domain
  triggers:
    - loto
    - lockout
    - tagout
    - lock out
    - tag out
    - energy isolation
    - 에너지 차단
    - 로크아웃
    - 태그아웃
  legal_basis:
    - 산업안전보건법 제38조 (작업 전 안전조치 — Pre-work Safety Measures)
    - 산업안전보건기준에 관한 규칙 제92조 (위험에너지에 의한 위험방지)
    - KOSHA GUIDE Z-40-2022
---

## psm-loto

> **Status**: Stub — implementation required

### Purpose

Execute Lockout/Tagout (LOTO) procedure verification for hazardous energy sources in PSM-covered facilities.

### Scope

- Energy isolation verification
- Lock and tag application procedures
- Verification and try-out protocols
- Return-to-service procedures
- Periodic LOTO procedure audits

### Legal Basis

| Law | Article | Requirement |
|-----|---------|-------------|
| 산업안전보건법 | Article 38 | 작업 전 안전조치 (Pre-work Safety Measures) |
| 안전보건규칙 | Article 92 | 위험에너지에 의한 위험방지 (Prevention of Hazardous Energy) |
| KOSHA GUIDE Z-40-2022 | — | LOTO procedure guidelines |

### Workflow (TODO)

_Lockout/Tagout procedure verification workflow to be implemented._

### Inputs (TODO)

- Equipment identification
- Energy source inventory
- LOTO procedure documents

### Outputs (TODO)

- LOTO verification checklist
- Non-conformance report
