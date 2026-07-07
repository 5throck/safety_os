---
name: gmp-change-control
owner: gmp-agent
scope: workspace
status: active
description: Manage GMP Change Control (변경관리) workflows per KP-GMP 의약품등기준규정 Article 18 + ICH Q10. Pattern reused from psm-moc with quality impact assessment extension.
version: "1.0"
created: 2026-06-17
last_updated: 2026-06-17
metadata:
  triggers:
    - 변경관리
    - change control
    - KP-GMP
    - ICH Q10
    - 변경요청
    - effectiveness check
    - 품질영향평가
    - 밸리데이션 재검증
---

# GMP Change Control (변경관리) Skill

## Overview
This skill oversees the GMP Change Control process to ensure that changes to facilities, equipment, processes, materials, documentation, or organization are properly evaluated, approved, implemented, and documented before execution. It reuses the pattern from `skills/domains/functional/psm/moc/` with extensions for quality impact assessment per ICH Q10.

## Scope
- **In scope**: GMP-regulated changes under `pharma-general` profile
- **Out of scope**: PSM-regulated changes (use `skills/domains/functional/psm/moc/` instead)
- **Overlap**: For changes affecting both process safety AND product quality, dispatch BOTH skills in parallel

## Operational Steps
1. **Initiate Change Request**: Document change description, rationale, technical basis, and classification (minor/major/critical).
2. **Quality Impact Assessment**: Apply ICH Q9 methodology (typically FMEA) via `skills/domains/industry/gmp/qrm/` to evaluate impact on:
   - Product quality
   - Validated state (equipment, process, cleaning, CSV)
   - Regulatory filings
   - Stability commitments
   - Supplier qualification status
3. **Multi-Disciplinary Review**: Route to QA, Production, Engineering, Regulatory, Medical (if applicable).
4. **Approval**: For critical changes, obtain QA Manager and RP (Responsible Person) approval.
5. **Implementation Planning**: Define training, dependent actions (re-validation, re-qualification, stability).
6. **Pre-Implementation Verification**: Confirm prerequisites met.
7. **Implementation & Effectiveness Check**: Execute change, define effectiveness check criteria (typically 30-90 days).
8. **Closure**: Verify effectiveness, archive evidence with multi-source `legal_basis`.

## Evidence Generation
Generate evidence to `memory/` using `evidence-models/domains/industry/gmp/gmp-change-control-record.json`. Required common fields:
- `legal_basis`: array with min 2 sources (Korean statutory + international)
- `e_signature`: schema-only in v1 (cryptographic_hash: null)
- `qrm_assessment`: link to gmp-qrm assessment
- `nomenclature`: multilingual declaration
- `audit_trail`: ALCOA+ metadata

## PSM Pattern Reuse
90% pattern reuse from `skills/domains/functional/psm/moc/`. Key extensions:
- Quality impact assessment (in addition to safety impact)
- Multi-source `legal_basis` (vs PSM's single source)
- ALCOA+ data integrity enforcement
- Effectiveness check (typically not in PSM MOC)

## KPI Tracking
- Change closure cycle time (target: <90 days for major changes)
- Effectiveness check pass rate (target: >95%)
- Changes requiring re-validation (trend metric)

## Legal Disclaimer
> Workflow automation assistance only. Final change approval and regulatory filing decisions require qualified QA and Regulatory Affairs professionals per KP-GMP requirements.
