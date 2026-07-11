# MCP 통합 가이드

> **목적**: Safety OS가 규제 데이터를 위해 한국 법령 MCP 서버와 어떻게 연결되는지 설명합니다.

## 1. 사용 가능한 MCP 서버

Safety OS는 3개의 한국 규제 MCP 서버를 포함합니다:

| 서버 | 위치 | 도구 | 목적 |
|--------|----------|-------|---------|
| `kr_safety` | `mcp/kr-safety-regs/` | 5개 도구 | 한국 안전 규제 검색 (OSHA-KR, SAPA, CCA), 컴플라이언스 갭 분석 |
| `legalize_kr` | `mcp/legalize-kr/` | 6개 도구 | 한국 법령 구조 파싱, 버전 비교, 판례 검색 |
| `mcp_kr_legislation` | `mcp/kr-legislation/` | 5개 도구 | 실시간 법령 API (국가법령정보센터) |

## 2. 설정

MCP 서버는 `.mcp.json`에 설정됩니다:

```json
{
  "mcpServers": {
    "kr_safety": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "./mcp/kr-safety-regs/index.ts"]
    },
    "legalize_kr": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "./mcp/legalize-kr/index.ts"]
    },
    "mcp_kr_legislation": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "./mcp/kr-legislation/index.ts"]
    }
  }
}
```

## 3. 도메인 통합 지점

### PSM 도메인
- `regulations/KR/OSHA-KR-PSM.yaml` — 현행 법령 텍스트를 위해 kr_legislation 참조
- `evidence-models/domains/functional/psm/` — `source_mcp: mcp-kr-legislation`

### MSDS 도메인
- `regulations/KR/OSHA-KR-MSDS.yaml` — kr_legislation 참조
- `regulations/KR/K-REACH.yaml` — kr_legislation 참조
- 컴플라이언스 갭 분석을 위한 kr_safety 도구 (OSHA-KR, SAPA 조항)

### 컴플라이언스 에이전트 (도메인 공통)
`agents/_shared/compliance-agent.md` (2026-07-11 갱신)는 실시간 법령 검증을 임시 활동이 아닌 표준 절차로 명문화했습니다:
- `mcp__kr_safety__search_osha_regulations`, `mcp__kr_safety__check_compliance_gaps` — 실시간 OSHA-KR 규정 조회 및 갭 체크
- `mcp__legalize_kr__*` — 실시간 한국 법령 검증 (조문 번호, 개정 이력)
- `legal_basis` 필드에 인용하기 전 조문 번호 정확성을 검증하는 데 사용됨 — 이 프로젝트는 오인용 이력이 문서화되어 있으며(`memory/findings/compliance-gap-2026-07-05-all-domains.md` 참조), 실시간 검증이 이를 방지합니다.

### GMP 도메인
- `regulations/KR/MFDS-GDP.yaml` — kr_legislation 참조

### 모든 도메인
- 모든 규제 .yaml 파일에 `source_mcp: mcp-kr-legislation` 필수 포함
- 감사 스크립트가 이 필드를 검증

## 4. 워크플로우 내 활용

에이전트는 워크플로우 실행 중 MCP 서버를 조회할 수 있습니다:

```
1. 에이전트가 작업 수신
2. 에이전트가 현행 법령 텍스트를 위해 kr_legislation 조회
3. 에이전트가 현행 법령 대비 워크플로우 legal_basis 검증
4. 에이전트가 검증된 법령 참조를 포함한 증거 기록 생성
```

## 5. 환경 설정

```bash
# .env 파일
GITHUB_TOKEN=ghp_...          # legalize-kr용 (판례 검색)
# kr-legislation은 공개 API 사용 (토큰 불필요)
# kr-safety-regs은 캐시된 데이터 + 실시간 API 사용 (토큰 불필요)
```

## 6. 향후 통합 (v2)

- 실시간 법령 개정 알림
- 규제 변경 시 legal_basis 자동 갱신
- ML 기반 규제 해석
- 실제 법령 텍스트 대비 교차 참조 검증
