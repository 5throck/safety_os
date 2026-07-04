---
name: process-hazard-screening
owner: ehschem-agent
scope: workspace
status: active
description: Initial hazard screening for chemical plant processes. Identifies PSM-applicable processes and dispatches detailed PHA to functional PSM service.
version: "1.0"
created: "2026-06-18"
last_updated: "2026-06-18"
---

# Process Hazard Screening Skill

## Overview
화학공장 공정의 초기 위해 스크리닝. PSM 적용 대상 공정 식별 후 상세 PHA는 functional PSM service로 dispatch.

## Matrix Role
- ehschem (industry): 초기 스크리닝, 화학공장 context
- PSM (functional): 상세 PHA/HAZOP 수행

## Screening Criteria (PSM Article 44)

| 기준 | 임계값 |
|------|--------|
| 위해물질 보유량 | 지정수량 이상 (43종 사고대비물질) |
| 가연성 물질 | 10,000 lb (4,536 kg) 이상 |
| 독성 물질 | 물질별 지정수량 |
| 반응성 물질 | UN Division 1.1-1.3, Class 2/3 reactive |

## Workflow Steps
1. **공정 식별**: unit별 화학물질, 보유량 조사
2. **임계값 평가**: PSM 지정수량 대비 보유량
3. **PSM 적용 결정**: applicable → PSM service dispatch
4. **비PSM 위해 평가**: 간이 위해성 평가 (위험성평가 Article 36 수준)

## Legal Disclaimer
> 초기 스크리닝 보조. PSM 적용 여부 최종 판정은 안전관리자.
