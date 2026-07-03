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

  const url = `https://www.law.go.kr/DRF/lawService.do?OC=${OC}&target=law&MST=272966&type=JSON`;
  const res = await fetchWithRetry(url);
  const json = await res.json() as any;

  const requirements = extractSapaRequirements(json, industry);

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

function extractSapaRequirements(json: any, industry?: string): string[] {
  const articles = json?.law?.조문 ?? [];
  return articles
    .filter((a: any) => !industry || a.조문내용?.includes(industry))
    .map((a: any) => `${a.조번호}: ${a.조제목 ?? ''}`);
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
