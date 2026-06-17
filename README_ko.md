# Safety OS — AI 기반 EHS/GxP 플랫폼

> Claude Code Harness Engineering 기반 대한민국 EHS/GxP 규정 준수 자동화

## 개요

Safety OS는 대한민국 EHS(환경·보건·안전) 및 GxP(Good Practice) 분야를 위한 AI 에이전트 기반 규정 준수 시스템입니다. 의약품 라이프사이클 전체(GLP → GCP → GMP → GDP → GVP)와 산업별 EHS 수직(PSM, MSDS, 건설안전)을 독립 도메인으로 구조화하여 워크플로우, 증거 모델, 스킬, 규제를 통합 관리합니다.

## 활성 도메인 (8개)

| 도메인 | 적용 영역 | 상태 |
|--------|-----------|------|
| `psm` | 공정안전관리 (화학공장) | active |
| `gmp` | 의약품 제조 품질 | active (v1) |
| `msds` | 화학물질 안전 / GHS | active (v1) |
| `gdp` | 의약품 유통 | active (v1) |
| `glp` | 비임상시험 | active (v1) |
| `gcp` | 임상시험 관리 | active (v1) |
| `gvp` | 시판 후 약물감시 | active (v1) |
| `ehsconst` | 건설안전 | active (v1) |

## 의약품 라이프사이클 통합

```
비임상(GLP) → 임상(GCP) → 허가 → 제조(GMP) → 유통(GDP) → 시판후(GVP)
     ↑                                                         ↓
     └──────── 재평가 (5-7년) ←────────────────────────────────┘
     
+ 화학안전(MSDS), 공정안전(PSM), 건설안전(ehsconst)이 모든 단계 참조
+ emergency-agent가 6개 reference workflow로 긴급 회수/제한/중지 실행
```

## 한국 규제 커버리지

| 법령 | 적용 도메인 | 핵심 |
|------|-------------|------|
| 약사법 | GMP, GDP, GCP, GVP | 제34조(GMP), 제43의2(GDP), 제69(CTA), 제73의2(SAE) |
| 산업안전보건법 (OSHA-KR) | PSM, MSDS, 건설안전 | 제15조(안전관리자), 제36조(위험성평가), 제44조(PSM), 제98-103조(건설) |
| 중대재해처벌법 (SAPA) | 모든 산업 | 제3조(경영책임), 제7조(사업주 의무), 제12조(건설업 특례) |
| K-REACH | MSDS, GLP | 위해성평가 시험 GLP 의무 |
| GHS Rev 9 | MSDS | UN 표준, 한국 2023년 의무화 |
| ICH E6(R3) | GCP | 임상시험 관리 국제 표준 |
| ICH E2 series | GVP | 안전성 보고 국제 정렬 |
| OECD GLP | GLP | MAD (데이터 상호인정) |
| PIC/S GDP | GDP | 유통 국제 정렬 |
| 건설기술진흥법 | 건설안전 | 제24조 독립 안전감리 |

## 아키텍처

```
PM (최고안전보건책임자, CSO)
├── SGM (안전거버넌스매니저) — 전략
│     KPI 설정, 정책 승인, 법규 모니터링
├── SWM (안전워크플로우매니저) — 실행
│   ├── _core/: pm, sgm, swm
│   ├── _shared/: 컴플라이언스, 위험성평가, 비상대응, 감사 등
│   └── domains/<도메인>/: gmp, msds, gdp, glp, gcp, gvp, ehsconst, psm
└── emergency workflows (9): fire-response, disaster-response,
    medical-emergency, chemical-release, explosion-gas-response,
    confined-space-rescue, high-angle-rescue, electrical-emergency,
    mechanical-accident
```

## 디렉토리 구조 (도메인 패턴)

```
<top-level>/
├── _meta/              # 메타 (도메인 무관)
├── _shared/            # 다중 도메인 공통 자산
└── domains/<도메인>/   # 도메인 특화
```

각 도메인은 동일한 패턴을 따릅니다:
- `agents/domains/<도메인>/<도메인>-agent.md`
- `workflows/domains/<도메인>/<workflow>/{schema.yaml, README.md}`
- `evidence-models/domains/<도메인>/<도메인>-*-record.json`
- `skills/domains/<도메인>/<skill>/SKILL.md`
- `docs/domains/<도메인>/scope.md`

## 빠른 시작

```bash
# 의존성 설치
bun install

# 감사 실행 (280+ 파일 검증)
bun scripts/safety-audit.ts

# 프로파일 필드 테스트
bun scripts/test-pharma-general-profile.ts        # GMP
bun scripts/test-chemical-handling-profile.ts     # MSDS
```

## 검증 현황

- **280+ 파일** (workflows, evidence-models, regulations) — multi-source legal_basis, ALCOA+ audit trail, 공통 필드
- **80개 워크플로우** — 8개 도메인 + 9개 emergency + 14개 daily EHS
- **6개 reference workflows** — emergency-agent, compliance-agent에 dispatch
- **Domain Onboarding SOP** (`docs/_shared/domain-onboarding-guide.md`) — 5개 연속 도메인 추가로 검증 완료

## 주요 산출물

- **`docs/_shared/domain-onboarding-guide.md`** — 신규 도메인 추가 11단계 SOP
- **`docs/_shared/reference-workflow-pattern.md`** — reference workflow 패턴 가이드
- **`scripts/safety-audit.ts`** v2.8.0 — 다중 도메인 검증 로직
- **감사 통과**: 모든 PR에서 0 errors 유지

## Cross-Domain 통합

| 인터페이스 | 데이터 흐름 |
|-----------|-------------|
| GMP batch → GDP goods-receipt | `batch_disposition_approved_ref` |
| MSDS Section 6 → emergency chemical-release | `msds_record_ref` |
| GCP SAE → GVP signal | 안전성 데이터 후속 |
| GDP cold chain → GVP signal | 온도 이탈 안전 영향 |
| 6개 reference workflows → emergency-agent | recall, spill, SAE, urgent action 등 |

## 프로젝트 상태

**2026-06-18 기준** — 의약품 라이프사이클 5개 GxP + PSM + MSDS + 건설안전 = 8개 도메인 v1 활성.

**v2 roadmap**: 전자 서명 암호화, ML signal detection, IoT 센서 통합, Real-World Evidence.

**신규 도메인 예정**: 에너지/가스 안전, 의료기기, 화장품, 식품/HACCP.

## 면책 조항

본 시스템은 워크플로우 자동화 지원만 제공합니다. 규제 해석 및 최종 컴플라이언스 판단은 자격을 갖춘 법률/EHS/GxP 전문가의 책임입니다.

*Last Updated: 2026-06-18*
