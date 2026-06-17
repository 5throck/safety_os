# KP-GMP Regulatory Reference (Korean Good Manufacturing Practice)

> **Source MCP**: `mcp-kr-legislation`
> **Jurisdiction**: Republic of Korea
> **Regulator**: Ministry of Food and Drug Safety (MFDS / 식품의약품안전처)
> **Last Updated**: 2026-06-17

---

## 1. Primary Legal Basis

### 1.1 약사법 (Pharmaceutical Affairs Act) Article 34

의약품 제조업 관리 의무화 — pharmaceutical manufacturers must comply with GMP standards delegated by MFDS.

- **Korean text reference**: 약사법 제34조 (의약품의 제조관리기준 등)
- **English summary**: Mandatory GMP for pharmaceutical manufacturing
- **Enforcement agency**: MFDS

### 1.2 Delegated Legislation: 의약품 등의 기준 및 규정 (MFDS Notice)

The technical GMP requirements are codified in MFDS Notice 「의약품 등의 기준 및 규정」, which is updated periodically. This is the operational reference for all GMP workflows in safety-os.

---

## 2. International Harmonization

Korean GMP (KP-GMP) is harmonized with the following international frameworks:

| Framework | Reference Document | Alignment |
|-----------|-------------------|-----------|
| **PIC/S GMP** | PE 009 Annexes | Harmonized (mutual recognition for export) |
| **ICH Q7** | Active Pharmaceutical Ingredients | Adopted |
| **ICH Q9** | Quality Risk Management | Adopted |
| **ICH Q10** | Pharmaceutical Quality System | Adopted |

---

## 3. Key Articles (의약품등기준규정)

| Article | Topic (Korean) | Topic (English) | Safety-OS Workflow Reference |
|---------|----------------|-----------------|------------------------------|
| Article 12 | 제조관리기준 | Manufacturing Control Standards | All gmp-* workflows |
| Article 15 | 자체점검 | Self-Inspection | `workflows/gmp/self-inspection/` |
| Article 16 | 적격성평가 | Qualification | `workflows/gmp/equipment-qualification/` |
| Article 17 | 밸리데이션 | Validation | `workflows/gmp/cleaning-validation/`, `workflows/gmp/csv-validation/` |
| Article 18 | 변경관리 | Change Control | `workflows/gmp/change-control/` |
| Article 19 | 이상관리 및 시정조치 | Deviation Management and CAPA | `workflows/gmp/deviation-capa/` |
| Article 20 | 안정성 시험 | Stability Testing | `workflows/gmp/stability/` |

Additional topics covered by KP-GMP that map to GMP workflows:
- Batch Manufacturing Records (BMR) → `workflows/gmp/batch-mfg/`
- Supplier Qualification → `workflows/gmp/supplier-qualification/`
- Product Quality Review (PQR) → `workflows/gmp/pqr/`

---

## 4. GMP Pillars (PQS Framework)

Per ICH Q10, the Pharmaceutical Quality System (PQS) consists of five pillars:

1. **Quality System** — Management responsibility, quality culture, CAPA
2. **Personnel & Hygiene** — Training, qualification, hygiene practices
3. **Premises & Equipment** — Design, qualification (IQ/OQ/PQ), calibration
4. **Documentation & Records** — Data integrity (ALCOA+), electronic records
5. **Self-Inspection** — Internal audit program

---

## 5. Multi-Source Legal Basis Requirement

Unlike PSM (which references OSHA-KR Article 44 as a single source), GMP workflows in safety-os must declare **multi-source legal_basis** per the architecture decision (2026-06-17 meeting). Each workflow must reference at minimum:

- `약사법` Article 34 (Korean statutory basis)
- `의약품등기준규정` relevant article (Korean delegated legislation)
- One or more international alignment sources (PIC/S, ICH Q7/Q9/Q10)

This is enforced by the extended `safety-audit.ts` GMP validation logic.

---

## 6. Disclaimer

> Regulatory interpretation is user responsibility. This document provides workflow automation assistance only, not legal advice. All references to Korean law and ICH guidelines are for workflow documentation purposes. The accuracy and applicability of regulatory references must be verified by a qualified legal or GXO professional before operational use.
