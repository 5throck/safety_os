import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { createLogger } from '../../shared/logger.js';

const log = createLogger('k_skill');
const cache = new MCPCache();
const OC = process.env.LAW_API_OC ?? 'test';

export async function getSapaRequirements(industry?: string): Promise<object> {
  const cacheKey = `sapa:requirements:${industry ?? 'all'}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  if (process.env.MOCK_API === 'true') {
    return mockSapaData(industry);
  }

  // MST=228817 is 중대재해처벌법 (Act) itself — verified against a live lawSearch.do lookup
  // (the previous MST=272966 does not resolve: law.go.kr returns "일치하는 법령이 없습니다").
  const url = `https://www.law.go.kr/DRF/lawService.do?OC=${OC}&target=law&MST=228817&type=JSON`;
  const res = await fetchWithRetry(url);
  const json = await res.json() as any;

  const requirements = extractSapaRequirements(json);

  // OC=test는 IP 등록 없이 차단됨 — 빈 결과 대신 mock fallback 제공 (mcp/kr-legislation/tools/current-law.ts와 동일 패턴)
  if (requirements.length === 0) {
    log.warn(`API returned empty result for industry "${industry ?? '전체'}" (OC key may not be registered or reachable). Falling back to mock data.`);
    return mockSapaData(industry);
  }

  const result = {
    lawName: '중대재해처벌법',
    industry: industry ?? '전체',
    requirements,
  };

  await cache.set(cacheKey, result, 86_400);
  return result;
}

function extractSapaRequirements(json: any): string[] {
  // Real response shape (verified live): { 법령: { 조문: { 조문단위: [...] } } }.
  // 조문여부 distinguishes actual articles ("조문") from chapter/part headers ("전문").
  // SAPA's core duty articles (§4, §5, §9, etc.) are not industry-segmented in the statute
  // text itself, so there is no meaningful per-industry filter to apply here — 중대재해처벌법
  // 조문 내용 자체가 산업별로 구분되어 있지 않음. `industry` remains a response label only.
  const units = json?.법령?.조문?.조문단위 ?? [];
  return units
    .filter((u: any) => u.조문여부 === '조문' && u.조문제목)
    .map((u: any) => `제${u.조문번호}조: ${u.조문제목}`);
}

function mockSapaData(industry?: string) {
  return {
    lawName: '중대재해처벌법',
    industry: industry ?? '전체',
    requirements: [
      '제4조: 사업주와 경영책임자등의 안전 및 보건 확보의무',
      '제5조: 도급, 용역, 위탁 등 관계에서의 안전 및 보건 확보의무',
      '제9조: 사업주와 경영책임자등의 처벌',
    ],
  };
}
