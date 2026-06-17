# Meeting Transcript
**Date**: 2026-06-17
**Topic**: GDP (Good Distribution Practice) Domain Planning
**Participants**: pm (CSO), gmp-agent, sgm, compliance-agent, legal-agent
**Rounds**: 2
**Status**: Complete

## Decisions

- **Domain name**: `gdp`
- **Scope**: 8 workflows (7 core + 1 reference: product-recall-reference)
- **Korea-specific**: DTS (Drug Tracking System) as separate workflow + regulation
- **Cross-domain interfaces**:
  - GMP batch-mfg → GDP goods-receipt (`batch_disposition_approved_ref`)
  - GDP → GMP deviation-capa (via `deviation_source` field)
  - GDP storage → MSDS (hazardous drug references)
- **Reused patterns**:
  - Self-inspection workflow (from GMP)
  - Reference workflow (from MSDS spill-reference → product-recall-reference)
- **Common fields** in all gdp-*.json:
  - `gdp_certification_status`
  - `temperature_condition` (cold_chain_2_8C / frozen / room_temp / ambient)
  - `batch_disposition_approved_ref`

## Components

| Component | Count | Notes |
|-----------|-------|-------|
| Agent | 1 | gdp-agent (new) |
| Workflows | 8 | 7 core + product-recall-reference |
| Evidence Models | 7 | All include temperature_condition |
| Skills | 2 | temperature-excursion-analyzer, dts-verification |
| Regulations | 2 | MFDS-GDP, DTS |
| Industry Profile | 1 | pharma-distribution |

## Regulatory Framework

- 약사법 제43조의2 (유통관리 의무)
- 의약품 유통관리 기준 (MFDS 고시)
- GDP 인증제 (3년 주기)
- 의약품 추적관리(DTS) 고시
- PIC/S GDP (국제 정렬)
- EU GDP 2013/C 343/01 (참고)

## Workflow Inventory

| # | Workflow | Type | Key Legal Basis |
|---|----------|------|-----------------|
| 1 | goods-receipt | core | 약사법 Art 43의2 + 유통관리기준 + PIC/S GDP |
| 2 | storage-management | core | 약사법 Art 43의2 + 유통관리기준 + EU GDP |
| 3 | temperature-monitoring | core | 유통관리기준 + PIC/S GDP Ch.3 + EU GDP Ch.7 |
| 4 | transportation | core | 약사법 Art 43의2 + 유통관리기준 + PIC/S GDP Ch.9 |
| 5 | traceability-dts | core | 약사법 Art 43의2 + DTS 고시 + PIC/S GDP Ch.6 |
| 6 | returned-goods | core | 유통관리기준 + PIC/S GDP Ch.10 |
| 7 | gdp-self-inspection | core | 유통관리기준 + PIC/S GDP Ch.8 + EU GDP Ch.8 |
| 8 | product-recall-reference | reference | 약사법 Art 43의3 + PIC/S GDP Ch.5 |

## Open Items

- GDP 인증 갱신 주기 알림 자동화 (skill vs audit script)
- DTS 센터 API 연동 방식 (현재는 evidence model에 수동 기록)
- Cold chain 온도 이탈 시 자동 분기 로직 (GMP CAPA vs GDP CAPA)

## Deferred to v2

- Real-time IoT sensor integration
- GPS/telematics for transportation tracking
- ML-based demand forecasting
- International shipment customs integration
