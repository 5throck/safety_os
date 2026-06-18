# Gas Terminal (gasterm) Domain v1 — Scope Document

> **Domain**: `gasterm` (Gas Terminal Safety / 가스터미널 안전)
> **Status**: Approved (2026-06-18) — **9th domain**

## 1. Purpose

LNG/LPG/수소 가스 기지, 충전소, 저장시설의 안전 관리. 한국가스안전공사(KGS) 규제 준수, 폭발/화재 예방, 비상 대응이 핵심. 대규모 시설은 PSM과 병행 적용.

## 2. Components

| Component | Count |
|-----------|-------|
| Agent | 1 (`gasterm-agent`) |
| Workflows | 8 (7 core + 1 reference) |
| Evidence Models | 7 |
| Skills | 2 |
| Regulations | 3 (고압가스법, LPG법, 수소법) |
| Industry Profile | 1 (`gas-facility.yaml`) |

## 3. Workflows

| # | Workflow | Type | Key Topic |
|---|----------|------|-----------|
| 1 | tank-storage-management | core | LNG/LPG/수소 저장탱크 운영 |
| 2 | gas-leak-detection-response | core | 가스 검지기 모니터링 및 알람 대응 |
| 3 | charging-operation-safety | core | LPG/수소 충전 작업 |
| 4 | pipe-transfer-management | core | 배관 이송 (터미널 내/외부) |
| 5 | hazardous-zone-management | core | 법정 거리/위해 구역 유지 |
| 6 | tank-inspection-maintenance | core | KGS 안전검사 대응 (연/월) |
| 7 | gas-emergency-preparedness | core | 비상 대비 (확산 모델, 대피) |
| 8 | major-gas-incident-reference | reference | 대형 사고 시 emergency-agent 위임 |

## 4. Common Fields (all gasterm-*.json)

- `facility_type`: LNG_terminal / LPG_charging / hydrogen_charging / city_gas_storage / pipe_transfer
- `kgs_inspection_status`: certified / pending / failed / expired
- `psm_applicable`: boolean (대규모 시설)
- `gas_type`: LNG / LPG / hydrogen / natural_gas / other

Plus standard: `e_signature`, `nomenclature`, `audit_trail`, `legal_basis` (≥3)

## 5. Gas-Specific Hazards

### LNG (Liquefied Natural Gas, -162°C)
- 저온 화상, RPT (Rapid Phase Transition)
- 가스 확산 (증발 시 공기보다 가벼움)

### LPG (Liquefied Petroleum Gas)
- 공기보다 무거움 → 지저부 분포
- BLEVE (Boiling Liquid Expanding Vapor Explosion)

### 수소 (Hydrogen, 신규 법령 2021)
- 폭발 범위 매우 넓음 (4-75%)
- 음폭성 (detonation 18.3-59%)
- 금속 취성 (수소 취성)
- 화염 안 보임 (UV/IR 검출기 필수)

## 6. Cross-Domain Interface

- gasterm ↔ PSM (대규모 시설 PSM 적용)
- gasterm → MSDS (가스 처리 화학물질)
- gasterm → emergency (explosion-gas-response 직접 연계)
- gasterm → emergency (disaster-response — 지진/태풍 시설 대응)

## 7. KGS Inspection Cycles

| 항목 | 주기 | 주관 |
|------|------|------|
| 저장탱크 (LNG/LPG) | 연 1회 | 한국가스안전공사 |
| 가스 검지기 | 월 1회 | 자체 점검 |
| 안전밸브 | 연 1회 | 자체 점검 |
| 충전기 (LPG) | 분기 1회 | 자체 점검 |
| 수소 충전소 | 연 1회 + 정기 | KGS + 자체 |

## 8. Legal Disclaimer

> 가스 시설 운영은 법적 안전관리자/시설관리자 책임. 본 시스템은 워크플로우 자동화 지원만 제공.
