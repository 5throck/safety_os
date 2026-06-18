# sapa-serious-accident-reference Workflow

## WORKFLOW TYPE: `reference` — Provides accident data and dispatches to `emergency-agent` for serious accident (중대재해) response.

## 1. Objective
중대재해 발생 시 사고 데이터와 dispatch trigger를 `emergency-agent`에 전달.

## 2. 중대재해 정의 (SAPA)
- 사망 1명 이상
- 6개월 이상 치료 부상 1명 이상
- 동일 사고로 3명 이상 부상
- 1년 이상 요양 업무상 질병

## 3. Trigger Conditions
- 현장 사망사고
- 중상자 발생
- 다수 부상자 (3명 이상)
- 구조 활동 필요

## 4. Workflow Steps
1. **사고 인지**: 현장 안전관리자 보고.
2. **사고 현황 파악**: 인명피해, 공사 영향.
3. **데이터 취합**: 사고 장소, 공종, 협력업체, 안전관리계획서.
4. **emergency-agent dispatch**: 구조/구급/신고.
5. **사후 대응**: MOEL 신고 (고용노동부), 원도급자/발주처 통보.

## 5. Data Provided
- 사고 세부 정보
- 건설공사 정보 (project_id)
- 협력업체 책임 소재 (contractor chain)
- 안전관리계획 참조

## 6. Boundary with emergency-agent
| Activity | ehsconst Domain | emergency-agent |
|----------|-----------------|-----------------|
| 사고 데이터 취합 | ✓ Provides | — |
| SAPA 분류 | ✓ Provides | — |
| 구조/구급 실행 | — | ✓ Coordinates |
| MOEL 신고 | — | ✓ Owns |
| 유가족 통보 | — | ✓ Owns |

## 7. Legal Disclaimer
> Reference workflow. 중대재해처벌법 위반 여부는 법률 전문가 판단 사항. emergency-agent가 현장 대응을 주도.
