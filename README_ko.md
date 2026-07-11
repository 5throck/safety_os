# Safety OS — AI 기반 EHS/GxP 플랫폼

> 2-Tier 기능×산업 매트릭스 아키텍처 기반 대한민국 EHS/GxP 규정 준수 자동화
> 영문 가이드: [README.md](README.md)

---

## 📖 처음 오신 분들을 위해 — 여기서 시작하세요

> **처음이신가요?** 에이전트 팀과 워크플로우 활용법을 설명하는 핵심 문서들:

| # | 문서 | 학습 내용 |
|---|------|-----------|
| 1 | **[튜토리얼](docs/_shared/tutorial_ko.md)** | 온보딩 튜토리얼 — Safety OS 시작부터 끝까지 |
| 2 | **[사용자 시나리오](docs/_shared/user-scenarios_ko.md)** | 5개 실전 워크스루: 신규 화학물질 도입, 임상 SAE 보고, 건설 일일 안전, 의약품 냉장유통, 화학공장 정기보수 |
| 3 | **[사용자 가이드](docs/_shared/user-guide_ko.md)** | 올바른 도메인 선택과 에이전트 dispatch 패턴 (매트릭스 코디네이터) |
| 4 | **[도메인 분류 가이드](docs/_shared/domain-classification-guide_ko.md)** | 3-tier 체계 (기능/산업/공통) — 각 도메인이 담당하는 영역 |

---

## 활성 도메인 (15개)

### 기능 레이어 (Tier 1) — 산업 무관 방법론 및 데이터 서비스

| 도메인 | 적용 영역 | 워크플로우 |
|--------|-----------|------------|
| `psm` | 공정안전관리 (OSHA 14요소) | 15 |
| `msds` | 화학물질 안전 / GHS Rev 9 | 7 |
| `training` | 안전보건교육 관리 (산안법 제13/29/31/32/114조) | 8 |
| `contractor-safety` | 계약자 안전관리 (대정비(TAR)/대규모 정비 surge 시나리오) | 1 |
| `occupational-health` | 근로자 건강관리 (대정비(TAR)/대규모 정비 건강검진) | 1 |

### 산업 레이어 (Tier 2) — 산업별 운영

| 도메인 | 적용 산업 | 워크플로우 |
|--------|-----------|------------|
| `gmp` | 의약품 제조 품질 | 10 |
| `gdp` | 의약품 유통 / GDP | 8 |
| `glp` | 비임상시험 / OECD GLP | 8 |
| `gcp` | 임상시험 관리 / ICH E6(R3) | 8 |
| `gvp` | 시판 후 약물감시 / ICH E2 | 8 |
| `ehsconst` | 건설안전 / SAPA 제12조 | 9 |
| `ehschem` | 화학공장 / 정유·석유화학·정밀화학 | 8 |
| `gasterm` | 가스터미널 / LNG·LPG·수소 | 12 |
| `powergen` | 발전설비 / 화력·신재생 (원자력 제외) | 8 |
| `meddevice` | 의료기기 / KGMP-MD·ISO 13485·ISO 14971 | 8 |

### 공통 서비스 (Tier 3)

| 서비스 | 영역 |
|--------|------|
| `emergency/` | 9개 비상 대응 시나리오 (화재, 재해, 의료, 화학, 폭발, 구조, 감전, 기계) |
| `daily/` | `daily/manufacturing/` 하위 6개 일일 EHS 워크플로우 (위험성평가, 작업허가서, 계약자관리, 설비점검, 안전순찰, 안전교육); `chemical/`, `construction/`, `datacenter/`, `semiconductor/`는 아직 실제 워크플로우가 없는 `_INDEX.md` 스텁 |

---

## 2-Tier 매트릭스 아키텍처

| 기능 서비스 (Tier 1) | `GxP` (제약) | `ehschem` (화학) | `gasterm` (가스/에너지) | `powergen` (발전) | `ehsconst` (건설) | `meddevice` (의료기기) |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `psm` (공정안전) | | ✓ | ✓ | ✓ | | |
| `msds` (화학데이터) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `training` (안전교육) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| `emergency` (공통 대응) | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |

> `✓` = 해당 산업 도메인에 기능 서비스 적용 · 빈칸 = 해당 없음 · `GxP` = GMP, GDP, GLP, GCP, GVP
>
> **산업 도메인 (Tier 2, 열) = 매트릭스 코디네이터.** 공정안전(PSM), 화학데이터(MSDS), 교육(Training) 등 기능 서비스(Tier 1, 행)에 dispatch합니다. [자세히 보기 →](docs/_shared/domain-classification-guide_ko.md)

---

## 📚 주요 문서

### 시작하기 (모든 사용자)
| 문서 | 용도 |
|------|------|
| **[튜토리얼](docs/_shared/tutorial_ko.md)** | 온보딩 튜토리얼 |
| **[사용자 시나리오](docs/_shared/user-scenarios_ko.md)** | 5개 실전 워크스루 |
| **[사용자 가이드](docs/_shared/user-guide_ko.md)** | 도메인 선택 + dispatch 패턴 |
| **[도메인 분류 가이드](docs/_shared/domain-classification-guide_ko.md)** | 3-tier 분류 + 매트릭스 dispatch |

### 아키텍처 및 설계
| 문서 | 용도 |
|------|------|
| [아키텍처 개요 (EN)](docs/_meta/architecture-overview.md) | 15-도메인 시스템 아키텍처 |
| [도메인 추가 가이드](docs/_shared/domain-onboarding-guide_ko.md) | 신규 도메인 11단계 SOP + Active Domains Registry |
| [Reference 워크플로우 패턴](docs/_shared/reference-workflow-pattern_ko.md) | Reference 워크플로우 설계 (10개 적용) |

### 통합
| 문서 | 용도 |
|------|------|
| [MCP 통합 가이드](docs/_shared/mcp-integration-guide_ko.md) | 한국 법령 MCP 서버 연결 |

### 도메인 Scope 문서
| 도메인 | Scope |
|--------|-------|
| 기능 | [MSDS](docs/domains/functional/msds/scope.md) · [Training](docs/domains/functional/training/scope.md) |
| 산업 | [GMP](docs/domains/industry/gmp/scope.md) · [GDP](docs/domains/industry/gdp/scope.md) · [GLP](docs/domains/industry/glp/scope.md) · [GCP](docs/domains/industry/gcp/scope.md) · [GVP](docs/domains/industry/gvp/scope.md) · [ehsconst](docs/domains/industry/ehsconst/scope.md) · [ehschem](docs/domains/industry/ehschem/scope.md) · [gasterm](docs/domains/industry/gasterm/scope.md) · [powergen](docs/domains/industry/powergen/scope.md) · [meddevice](docs/domains/industry/meddevice/scope.md) |

---

## 빠른 시작

### 사전 요구사항

| 항목 | 설명 |
|------|------|
| **Bun** | `>= 1.0.0` — [bun.sh](https://bun.sh)에서 설치 |
| **AI 툴** | Claude Code CLI 또는 Gemini CLI |
| **API 키** (2개) | 국가법령정보센터 OC 키 + GitHub PAT (선택사항 — 아래 Step 2 참조) |

### Step 1 — Clone & Install

```bash
git clone <repo-url> && cd safety_os
cp .env.sample .env              # 환경변수 템플릿 복사
cd scripts && bun install         # 스크립트 의존성 설치
cd ..
```

### Step 2 — `.env` 설정

`.env` 파일을 열고 2개 키를 입력합니다. 모두 **무료**입니다.

```env
# 1) 국가법령정보센터 Open API OC 키
#    → https://www.law.go.kr/LSO/openApi/openApiOcPage.do
#    → 필수: 한국 법령 실시간 조회 (mcp_kr_legislation 서버)
LAW_API_OC=your_oc_key_here

# 2) GitHub Personal Access Token (스코프 불필요 — 공개 저장소 읽기 전용)
#    → https://github.com/settings/tokens
#    → 선택사항: 판례 검색 기능 (legalize_kr 서버)
#    → 미설정 시: 판례 검색만 비활성화, 나머지 기능은 정상 동작
GITHUB_TOKEN=your_github_token_here
```

| 키 | 필수 여부 | 용도 |
|----|:---------:|------|
| `LAW_API_OC` | **필수** | 국가법령정보센터 실시간 법령 API (법령 목록, 개정 이력, 조문 해석) |
| `GITHUB_TOKEN` | 선택 | GitHub API 기반 판례 검색. 미설정해도 나머지 기능은 모두 정상 작동합니다. |

### Step 3 — 설치 확인

```bash
bun scripts/safety-audit.ts              # 640+ 파일 검증, 0 오류
```

### Step 4 — AI 툴에서 사용하기

Claude Code 또는 Gemini CLI에서 프로젝트 디렉토리를 엽니다. `.mcp.json` 파일이 자동으로 감지되어 **3개 MCP 서버가 자동 기동**됩니다 — 실시간 한국 규제 데이터를 사용할 수 있습니다:

| MCP 서버 | 도구 수 | 용도 |
|----------|--------|------|
| `kr_safety` | 5개 | 한국 안전 규제 검색 (OSHA-KR, SAPA, CCA), 컴플라이언스 갭 분석 |
| `legalize_kr` | 6개 | 한국 법령 구조 분석, 버전 비교, 판례 검색 |
| `mcp_kr_legislation` | 5개 | 국가법령정보센터 실시간 법령 API |

별도 MCP 설정 불필요 — AI 에이전트와 대화를 시작하면 됩니다.

> **최소 설정**: Clone → `scripts/`에서 `bun install` → `LAW_API_OC` 입력 → 완료.

---

## 고급 사용법

### Rule-Based 스킬 (실행 가능 TypeScript)

```bash
bun skills/domains/industry/gmp/qrm/fmea-scoring.ts                        # FMEA 위해 평가
bun skills/domains/functional/msds/ghs-classifier/ghs-classifier.ts          # GHS 위해 분류
bun skills/domains/industry/ehsconst/fall-hazard-assessor/fall-hazard-assessor.ts  # 추락 위해 평가
```

### 테스트 스위트

```bash
bun scripts/test-domain-scenarios.ts                # 5개 실전 시나리오 (56 검증)
bun scripts/test-cross-domain-integration.ts        # 도메인 간 통합 무결성 (8 검증)
```

### 동기화 파이프라인 (commit + push + PR)

```bash
bun scripts/dev-sync.ts "feat: 변경 내용 설명"
```

---

## 폴더 구조

```
agents/domains/functional/     ← PSM, MSDS, Training, contractor-safety, occupational-health 에이전트
agents/domains/industry/       ← GxP (GMP/GDP/GLP/GCP/GVP), ehsconst, ehschem, gasterm, powergen, meddevice 에이전트
workflows/domains/functional/  ← 산업 무관 워크플로우
workflows/domains/industry/    ← 산업 특화 워크플로우
evidence-models/domains/       ← JSON 스키마 (functional/ + industry/)
skills/domains/                ← SKILL.md + 실행 가능 .ts 스킬
workflows/emergency/           ← 9개 공통 비상 대응 시나리오
workflows/daily/               ← 6개 일일 EHS 워크플로우 (daily/manufacturing/ 하위)
workflows/compliance/          ← 구조화된 컴플라이언스 체크리스트 예약 공간 (아직 미작성)
policies/                      ← SGM 승인 안전 정책 문서 (policies/README.md 참조)
docs/governance/                ← KPI 정의 (LTIFR, 감사 통과율, 시정조치 완료율)
regulations/KR/                ← 한국 규제 (OSHA-KR, SAPA, MFDS 등) + 정본 OSHA-KR.yaml/SAPA.yaml
regulations/international/     ← ICH, OECD, GHS
```

## 한국 규제 커버리지

약사법, 산업안전보건법 (OSHA-KR), 중대재해처벌법 (SAPA), K-REACH, GHS Rev 9, ICH E6(R3)/E2 series, OECD GLP (MAD), PIC/S GDP, 건설기술진혁법, 고압가스법, 전기사업법, 화학물질관리법, 대기/수질환경보전법, 의료기기법.

## 라이선스

Safety OS는 [GNU Affero General Public License v3.0](LICENSE) (AGPL-3.0)에 따라 배포됩니다. 이 소프트웨어를 수정하여 네트워크 서비스로 제공하는 경우, 해당 서비스 이용자에게 수정본의 전체 소스코드를 제공해야 합니다.

## 면책 조항

본 시스템은 워크플로우 자동화 지원만 제공합니다. 규제 해석 및 최종 컴플라이언스 판단은 자격을 갖춘 법률/EHS/GxP 전문가의 책임입니다.

*Last Updated: 2026-07-11*
