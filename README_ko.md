# Safety OS — AI 기반 EHS/GxP 플랫폼

> 2-Tier 기능×산업 매트릭스 아키텍처 기반 대한민국 EHS/GxP 규정 준수 자동화

## 활성 도메인 (11개)

### 기능 레이어 (Tier 1) — 방법론 및 데이터 서비스

| 도메인 | 적용 영역 |
|--------|-----------|
| `psm` | 공정안전관리 (11 워크플로우, OSHA 14요소) |
| `msds` | 화학물질 안전 / GHS Rev 9 (7 워크플로우) |
| `gmp` | 의약품 제조 품질 (10 워크플로우) |
| `gdp` | 의약품 유통 (8 워크플로우) |
| `glp` | 비임상시험 / OECD GLP (8 워크플로우) |
| `gcp` | 임상시험 관리 / ICH E6(R3) (8 워크플로우) |
| `gvp` | 시판 후 약물감시 / ICH E2 (8 워크플로우) |

### 산업 레이어 (Tier 2) — 산업별 운영

| 도메인 | 적용 산업 |
|--------|-----------|
| `ehsconst` | 건설안전 / SAPA 제12조 (9 워크플로우) |
| `ehschem` | 화학공장 / 정유·석유화학·정밀화학 (8 워크플로우) |
| `gasterm` | 가스터미널 / LNG·LPG·수소 (8 워크플로우) |
| `powergen` | 발전설비 / 화력·신재생, 원자력 제외 (8 워크플로우) |

### 공통 서비스 (Tier 3)

| 서비스 | 영역 |
|--------|------|
| `emergency/` | 9개 비상 대응 시나리오 (화재, 재해, 의료, 화학, 폭발, 구조, 감전, 기계) |
| `daily/` | 14개 일일 EHS 워크플로우 (위험성평가, 작업허가서 등) |

## 2-Tier 매트릭스 아키텍처

```
                 제약      화학      가스/에너지   발전      건설
PSM (기능)        -        ✓(ehschem)  ✓(gasterm)  ✓(powergen)  -
MSDS (기능)       ✓        ✓           ✓           ✓           ✓
GxP (기능)        ✓(전체)  -           -           -           -
Emergency (공통)  ✓        ✓           ✓           ✓           ✓
──────────────────────────────────────────────────────────────────
ehsconst (산업)                                           ✓
ehschem (산업)             ✓
gasterm (산업)                         ✓
powergen (산업)                                    ✓
```

산업 도메인은 **매트릭스 코디네이터** — 공정안전(PSM), 화학데이터(MSDS) 등 기능 서비스에 dispatch.

## 폴더 구조

```
agents/domains/
├── functional/     ← PSM, MSDS, GxP (기능 서비스)
├── industry/       ← ehsconst, ehschem, gasterm, powergen (산업 운영)
└── _core/, _shared/ ← 코어 에이전트, 공통 서비스

workflows/
├── domains/functional/   ← 기능 워크플로우
├── domains/industry/     ← 산업 워크플로우
├── emergency/            ← 9개 비상 대응
└── daily/                ← 14개 일일 EHS
```

## 빠른 시작

```bash
bun install
bun scripts/safety-audit.ts                         # 356+ 파일 검증, 0 errors
bun scripts/test-pharma-general-profile.ts          # GMP 필드 테스트
bun scripts/test-chemical-handling-profile.ts       # MSDS 필드 테스트
bun scripts/test-cross-domain-integration.ts        # 도메인 간 통합 시나리오 테스트
```

## 주요 문서

- `docs/_shared/domain-classification-guide.md` — 3-tier dispatch 가이드 + 매트릭스
- `docs/_shared/domain-onboarding-guide.md` — 신규 도메인 11단계 SOP
- `docs/_shared/reference-workflow-pattern.md` — reference workflow 패턴 (8개 적용)

## 한국 규제 커버리지

약사법, 산업안전보건법 (OSHA-KR), 중대재해처벌법 (SAPA), K-REACH, GHS Rev 9, ICH E6(R3)/E2 series, OECD GLP (MAD), PIC/S GDP, 건설기술진흥법, 고압가스법, 전기사업법, 화학물질관리법, 대기/수질환경보전법.

## 면책 조항

본 시스템은 워크플로우 자동화 지원만 제공합니다. 규제 해석 및 최종 컴플라이언스 판단은 자격을 갖춘 법률/EHS/GxP 전문가의 책임입니다.

*Last Updated: 2026-06-18*
