# 전사 안전보건 거버넌스 정책 (Enterprise Safety Governance Policy)

- **문서 번호**: POL-001
- **버전**: 1.0.0
- **제정일**: 2026-07-22
- **승인권자**: Chief Safety Officer (CSO) — safety-governance-manager (SGM) 위임
- **상태**: 승인됨 (Approved)

---

## 1. Scope (적용 범위)

본 정책은 Safety OS가 관리하는 **모든 산업 프로파일(industry profile) 및 워크플로우에 적용되는
최상위 우산 정책(umbrella policy)**이다. 하위 도메인별 정책(화학물질 취급, 건설 추락 방지,
반도체 공정안전 등)은 본 정책의 원칙을 상속하며, 본 정책과 상충할 수 없다.

적용 대상 산업 프로파일 (`industry-profiles/`):
- `chemical.yaml`, `chemical-plant.yaml`, `chemical-handling.yaml`
- `construction.yaml`
- `manufacturing.yaml`
- `semiconductor.yaml`
- `datacenter.yaml`
- `pharma-general.yaml`, `pharma-distribution.yaml`, `pharma-laboratory.yaml`, `pharmacovigilance.yaml`
- `clinical-research.yaml`
- `medical-device.yaml`
- `training-management.yaml`

적용 대상 조직 단위: 전 사업장, 모든 임직원 및 상시 상주 협력업체(도급인 포함,
산업안전보건법 제63조 관계 사업장 포함).

**적용 제외**: 개별 사업장의 법적 실체가 다른 자회사·해외 법인의 현지 규정은 본 정책의
하위 지침으로 별도 수립하며, 본 정책은 대한민국 내 사업장에 한하여 직접 적용된다.

---

## 2. Policy Statement (정책 선언)

1. 회사는 모든 사업장에서 **위험성평가(Risk Assessment)를 안전보건활동의 근간**으로 삼으며,
   신규/변경 공정 도입, 신규 설비 도입, 중대 변경(MOC) 발생 시 위험성평가를 선행하지 않고는
   작업을 개시하지 않는다.
2. 회사는 **경영책임자(대표이사) 및 안전보건관리책임자**가 안전보건 목표, 예산, 인력을
   매년 수립·공표하고, 그 이행 결과를 이사회 또는 이에 준하는 경영기구에 보고하도록 한다.
3. 회사는 모든 안전보건 관리 워크플로우(`workflows/`)에 대해 **최소 3개 이상의 법적 근거
   (`legal_basis`)를 명시**하여야 하며, 법적 근거가 누락되거나 불충분한 워크플로우는
   실행이 차단된다 (CSO Gate — 본 문서 §4 KPI Linkage 참조).
4. 회사는 중대재해(사망, 3개월 이상 요양이 필요한 부상 등 중대재해처벌법 제2조 정의에
   해당하는 재해)가 발생하거나 발생할 급박한 위험이 있는 경우, 산업안전보건법 제51조·제52조에
   따라 즉시 작업을 중지하고 근로자를 대피시킨다.
5. 회사는 도급·용역·위탁 관계에 있는 수급인의 종사자에 대해서도 자신의 종사자와 동일한
   수준의 안전보건 확보의무를 이행한다 (중대재해처벌법 제5조, 산업안전보건법 제63조).
6. 모든 안전보건 관리규정, 위험성평가 결과, 시정조치, 감사 기록은 **평가 근거와 함께
   추적 가능한 증거(evidence)로 보존**되어야 하며 (`evidence-models/`), 최소 3년간
   보관한다 (산업안전보건법 제57조).
7. 본 정책 및 하위 정책은 **연 1회 정기 검토** 또는 관련 법령 개정 시 수시 검토하며,
   개정 이력은 본 문서 하단에 기록한다.

---

## 3. Legal Basis (법적 근거)

본 정책은 다음 법령에 근거하며, CSO 위임 규정(safety-governance-manager Section A)에 따라
최소 3개 이상의 법적 근거를 충족한다.

| # | 법령 (Korean) | English Gloss | 조항 | 근거 내용 |
|---|---|---|---|---|
| 1 | 산업안전보건법 (OSHA-KR) | Occupational Safety and Health Act | 제14조 | 안전보건관리규정 작성·이행 의무 |
| 2 | 산업안전보건법 (OSHA-KR) | Occupational Safety and Health Act | 제15조 | 안전보건관리책임자의 안전보건관리체계 수립·시행 의무 |
| 3 | 산업안전보건법 (OSHA-KR) | Occupational Safety and Health Act | 제36조 | 위험성평가 실시 의무 |
| 4 | 산업안전보건법 (OSHA-KR) | Occupational Safety and Health Act | 제51조 / 제52조 | 사업주/근로자의 작업중지 |
| 5 | 산업안전보건법 (OSHA-KR) | Occupational Safety and Health Act | 제57조 | 재해 기록 보존 (3년) |
| 6 | 산업안전보건법 (OSHA-KR) | Occupational Safety and Health Act | 제63조 | 도급인의 안전보건조치 의무 |
| 7 | 중대재해처벌법 (SAPA) | Serious Accidents Punishment Act | 제4조 | 경영책임자등의 안전 및 보건 확보의무 (목표·예산·인력 수립) |
| 8 | 중대재해처벌법 (SAPA) | Serious Accidents Punishment Act | 제5조 | 도급·용역·위탁 관계에서의 안전·보건 확보의무 |
| 9 | 중대재해처벌법 (SAPA) | Serious Accidents Punishment Act | 제6조 | 중대산업재해 발생 시 경영책임자등의 처벌 규정 (위반 시 리스크) |

인용된 조항은 `regulations/KR/legal-glossary.yaml` (version 1.0.2) 기준으로 검증되었다.
(9개 근거 — CSO 최소 요건인 3개를 초과 충족)

---

## 4. KPI Linkage (KPI 연계)

본 정책은 `docs/governance/kpi-definitions.md`에 정의된 다음 KPI를 통해 이행 성과를 측정한다.

| KPI | 연계 방식 |
|---|---|
| **1. LTIFR (Lost Time Injury Frequency Rate)** | 본 정책 §2-1(위험성평가 선행), §2-4(작업중지) 이행 수준이 저하되면 LTIFR이 목표치(< 1.0)를 초과하는 선행지표로 나타난다. LTIFR이 목표치의 2배를 초과하는 월이 발생하면 SGM 정책 재검토가 트리거된다 (kpi-definitions.md §1 Escalation). |
| **2. Audit Pass Rate** | 본 정책 §2-3의 `legal_basis` ≥3 요건은 `bun scripts/safety-audit.ts`가 강제하는 하드 컴플라이언스 게이트(목표 100%, 0 errors)와 직접 일치한다. 워크플로우가 이 요건을 충족하지 못하면 Audit Pass Rate가 하락하고, 오류 3건 이상 발생 시 `project-review`가 자동 트리거된다. |
| **3. Corrective Action Closure Rate** | 본 정책 §2-6의 증거 추적성 요구는 시정조치 기록(`memory/corrective-actions/*.json`)의 완결성을 뒷받침하며, 목표(≥90% 기한 내 종결) 미달 시 본 정책의 재검토 트리거가 된다. |

주 연계 KPI: **LTIFR** 및 **Audit Pass Rate** (본 정책은 이 두 KPI를 직접 개선하기 위해 제정됨).

---

## 5. Approval (승인)

| 역할 | 승인자 | 서명/승인일 |
|---|---|---|
| Chief Safety Officer (CSO) | safety-governance-manager (SGM) — PM 위임 | 2026-07-22 |
| 검토 (Review) | audit-agent (Phase 6, 다음 정기 감사 시 검증 예정) | — |

> **면책 조항**: 본 정책은 Safety OS의 워크플로우 자동화 지원 목적으로 작성되었으며, 법적 자문을
> 대체하지 않는다. 산업안전보건법 및 중대재해처벌법에 대한 최종 해석과 적용은 자격을 갖춘
> 법률 전문가 및 안전보건 전문가의 검토를 거쳐야 한다.

---

## 6. Review Cadence (검토 주기)

- **정기 검토**: 연 1회 (다음 검토 예정일: **2027-07-22**)
- **수시 검토 트리거**:
  - 산업안전보건법 또는 중대재해처벌법 개정 시
  - LTIFR이 목표치의 2배를 초과하는 월 발생 시 (kpi-definitions.md §1)
  - Audit Pass Rate 오류 3건 이상 발생 시 (`project-review` 트리거와 연동)
  - 신규 산업 프로파일(`industry-profiles/`) 추가 시 본 정책의 적용 범위 갱신 필요성 검토

## 개정 이력 (Revision History)

| 버전 | 일자 | 변경 내용 | 승인자 |
|---|---|---|---|
| 1.0.0 | 2026-07-22 | 최초 제정 (First CSO-approved policy) | SGM |
