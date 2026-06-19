# 사용자 시나리오 — Safety OS 활용 가이드

> **처음 사용하는 분들을 위한 실전 워크스루**: 에이전트 팀과 워크플로우를 활용한 일반적인 EHS/GxP 업무 시나리오

---

## 빠른 시작

```bash
# 1. 의존성 설치
bun install

# 2. 시스템 무결성 확인
bun scripts/safety-audit.ts    # 443+ 파일, 0 오류

# 3. 도메인 탐색
ls workflows/domains/functional/   # 기능 서비스 (PSM, MSDS, GxP)
ls workflows/domains/industry/     # 산업 운영 (건설, 가스, 발전 등)
```

---

## 시나리오 1: 신규 화학물질 도입 (MSDS + PSM)

**상황**: 화학공장에 새로운 화학물질(예: 특수 용제)을 도입해야 한다.

### 단계별 진행

1. **MSDS 접수** — 공급자로부터 MSDS 수령
   ```
   사용자: "신규 화학물질 도입 — [화학물질명] MSDS 접수"
   → msds-agent가 msds-intake 워크플로우 실행
   ```

2. **GHS 분류** — 위해성 분류
   ```
   → msds-agent가 ghs-classifier 스킬 적용
   → H/P-문구, 그림문자, 신호어 생성
   ```

3. **화학물질 승인** — 한국 규제 대조
   ```
   → msds-agent가 chemical-approval 워크플로우 실행
   → 확인: 취급금지물질(산안법 제113조), TCCL, K-REACH
   ```

4. **PSM 영향 평가** — covered process인 경우 PSI 업데이트
   ```
   → ehschem-agent(화학공장)가 조정
   → psm-agent가 공정안전정보(PSI) 업데이트
   ```

5. **근로자 교육** — 직업보건 통보
   ```
   → msds-agent가 occupational-health-agent 통보
   → 특수건강진단 대상 업데이트 (Section 11 독성 정보)
   ```

### 생성 증거
- `msds-record.json` (GHS 16개 섹션)
- `ghs-classification-record.json`
- `chemical-approval-record.json`

---

## 시나리오 2: 임상시험 중증 이상반응 보고 (GCP → GVP)

**상황**: 3상 임상시험 중 중증 이상반응(SAE)이 발생했다.

### 단계별 진행

1. **SAE 식별** — 연구자가 사건 보고
   ```
   사용자: "임상시험 중증 이상반응 발생 — [참가자 ID]"
   → gcp-agent가 sae-reporting 워크플로우 실행
   ```

2. **인과관계 평가** — ImPACT 알고리즘 적용
   ```
   → gcp-agent가 sae-causality-assessor 스킬 적용
   → 판정: related / possibly_related / not_related
   ```

3. **SUSAR 판정** — 예상 여부 확인
   ```
   → 예상밖 + 관련 = SUSAR
   → 7일(치명적) 또는 15일(기타) 식약처 보고 기한 시작
   ```

4. **비상 dispatch** (안전 신호인 경우)
   ```
   → gcp-agent가 sae-reporting-reference → emergency-agent dispatch
   → emergency-agent가 의료 대응 + 규제 신고 조정
   ```

5. **시판 후 연계** — 약물감시로 데이터 흐름
   ```
   → SAE 데이터가 GVP 도메인으로 전달되어 시판 후 신호 맥락 제공
   ```

---

## 시나리오 3: 건설현장 일일 안전관리 (ehsconst)

**상황**: 대형 건설공사 현장의 일일 안전관리.

### 일일 루틴

1. **오전 TBM** (Tool Box Meeting)
   ```
   사용자: "오늘 TBM — [공사현장]"
   → ehsconst-agent가 TBM 안건 생성
   → 전일 발견사항, 금일 위해 요소, 기상 특보 검토
   ```

2. **작업 전 점검**
   ```
   → ehsconst-agent가 daily-safety-inspection 실행
   → 추락 위험, 붕괴 위험, 전기 점검
   ```

3. **추락 위해 평가** (고소 작업 시)
   ```
   → ehsconst-agent가 fall-hazard-assessor 스킬 적용
   → 방호 위계 생성: 난간 → 안전망 → 안전대
   → 풍속 14m/s 초과 시 작업 중지 권고
   ```

4. **작업허가서** (화기작업, 밀폐공간)
   ```
   → ehsconst-agent가 permit-to-work-construction 실행
   → 위험성평가 첨부, 방호조치 확인
   ```

5. **일일 마감**
   ```
   → 모든 허가서 마감, 발견사항 문서화
   → 안전관리비 집적 업데이트
   ```

---

## 시나리오 4: 의약품 냉장 유통 (GMP → GDP → GVP)

**상황**: 백신 batch가 제조되어 유통되고 시판 후 감시된다.

### 라이프사이클 흐름

1. **GMP Batch 출고**
   ```
   → gmp-agent가 batch-mfg 워크플로우 실행
   → 30일 이내 QA 검토
   → Batch disposition: approved
   ```

2. **GDP 유통** — 냉장체인 유지
   ```
   → gdp-agent가 인수 (batch_disposition_approved_ref 확인)
   → 온도 모니터링: 2-8°C 냉장체인
   → temperature-excursion-analyzer 스킬이 이탈 없음 확인
   ```

3. **DTS 추적** — 유통 단계별 스캔
   ```
   → gdp-agent가 traceability-dts 워크플로우 실행
   → 식약처 DTS 센터에 실시간 데이터 전송
   ```

4. **GVP 감시** — 시판 후 안전 모니터링
   ```
   → gvp-agent가 ICSR 보고서 수집
   → signal-detector 스킬이 비례보고비(PRR/ROR) 분석 실행
   → 연례 PBRER를 식약처에 제출
   ```

5. **회수** (안전 신호 발생 시)
   ```
   → gvp-agent가 urgent-safety-action-reference → emergency-agent dispatch
   → emergency-agent가 회수 실행 조정
   ```

---

## 시나리오 5: 화학공장 정기보수 (ehschem + PSM + Emergency)

**상황**: 석유화학 공장의 연례 정기보수(TAR).

### 계획 단계
1. **TAR 계획**
   ```
   → ehschem-agent가 turnaround-shutdown-planning 실행
   → 모든 변경사항에 대해 PSM MOC 참조
   ```

2. **PSM 가동전 안전검토**
   ```
   → psm-agent가 PSSR 워크플로우 실행
   → 가동 전 모든 MOC 항목 확인
   ```

### 실행 단계
3. **작업허가 조정**
   ```
   → 다수 PTW 발행 (화기, 밀폐, 전기)
   → ehschem-agent가 psm-agent와 조정
   ```

4. **비상 대비**
   ```
   → ehschem-agent가 gas-emergency-preparedness 실행
   → 화학 누출 대응 준비 (MSDS Section 6 데이터 사전 로드)
   ```

### 보수 후
5. **PSSR 완료**
   ```
   → psm-agent가 PSSR 체크리스트 확인
   → 문서화된 안전 검증과 함께 공정 재가동
   ```

---

## 에이전트 Dispatch 패턴

```
사용자 요청
    ↓
PM (최고안전보건책임자) 수신
    ↓
PM이 산업 에이전트(조정자)에 dispatch
    ↓
산업 에이전트가 기능 에이전트(서비스)에 dispatch
    ↓
memory/에 증거 기록 생성
    ↓
에스컬레이션 시 Emergency/Compliance 통보
```

### 핵심 원칙
- **산업 도메인** (ehsconst, ehschem, gasterm, powergen, meddevice) = **조정자**
- **기능 도메인** (psm, msds, gmp/gdp/glp/gcp/gvp) = **서비스 제공자**
- **Emergency** = **공통 대응자** (모든 reference 워크플로우에서 dispatch 수신)

---

## 주요 명령어

```bash
# 감사 (sync 전 반드시 통과해야 함)
bun scripts/safety-audit.ts

# 도메인별 테스트
bun scripts/test-pharma-general-profile.ts        # GMP
bun scripts/test-chemical-handling-profile.ts     # MSDS
bun scripts/test-cross-domain-integration.ts      # 전체 도메인
bun scripts/test-domain-scenarios.ts              # 5개 실전 시나리오

# 스킬 실행 (rule-based)
bun skills/domains/functional/gmp/qrm/fmea-scoring.ts                    # FMEA 위해 평가
bun skills/domains/functional/msds/ghs-classifier/ghs-classifier.ts      # GHS 분류
bun skills/domains/industry/ehsconst/fall-hazard-assessor/fall-hazard-assessor.ts  # 추락 위해

# 동기화 (commit + push + PR)
bun scripts/dev-sync.ts "커밋 메시지"
```

---

## 문서 탐색

| 문서 | 용도 |
|------|------|
| [분류 가이드](domain-classification-guide.md) | 3-tier dispatch + 매트릭스 |
| [도메인 추가 가이드](domain-onboarding-guide.md) | 신규 도메인 추가 (SOP) |
| [Reference 패턴](reference-workflow-pattern.md) | Reference 워크플로우 설계 |
| [사용자 가이드](user-guide.md) | 도메인 선택 + dispatch 패턴 |
| [MCP 통합](mcp-integration-guide.md) | MCP 서버 연결 |
| [아키텍처 개요](../_meta/architecture-overview.md) | 12-도메인 시스템 아키텍처 |
