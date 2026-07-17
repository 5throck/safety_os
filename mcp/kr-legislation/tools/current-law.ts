import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { RateLimiter } from '../../shared/rate-limiter.js';
import { parseXML } from '../xml-parser.js';
import { createLogger } from '../../shared/logger.js';

const log = createLogger('mcp_kr_legislation');
const cache = new MCPCache();
const limiter = new RateLimiter(100, 60_000);
const OC = process.env.LAW_API_OC ?? 'test';

export async function getCurrentLaw(lawType?: string): Promise<object[]> {
  const key = `legislation:current:${lawType ?? 'all'}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  if (process.env.MOCK_API === 'true') return mockCurrentLaw(lawType);

  await limiter.acquireToken();
  const query = lawType ? `&query=${encodeURIComponent(lawType)}` : '';
  const url = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=law&type=XML${query}`;
  const res = await fetchWithRetry(url);
  const xmlText = await res.text();
  const parsed = parseXML(xmlText) as any;

  const laws = (parsed?.LawSearch?.law ?? []).map((item: any) => ({
    lawId: item.법령ID,
    lawName: item.법령명한글,
    lawType: item.법령구분명,
    effectiveDate: item.시행일자,
    source: 'live_api' as const,
  }));

  if (laws.length === 0) {
    // Honest empty result — no mock/fake data (OC key may be unregistered, or no match).
    log.warn('API returned empty result (OC key may not be registered, or no match found).');
    return [{
      lawId: null,
      lawName: lawType ?? null,
      lawType: lawType ?? null,
      effectiveDate: null,
      source: 'empty' as const,
      note: 'law.go.kr에서 결과를 찾지 못했습니다 (OC 키 미등록 또는 일치하는 법령 없음). 국가법령정보센터에서 직접 확인하시기 바랍니다.',
    }];
  }

  await cache.set(key, laws, 21_600);
  return laws;
}

function mockCurrentLaw(lawType?: string) {
  return [
    { lawId: '228817', lawName: '중대재해처벌법', lawType: lawType ?? '법률', effectiveDate: '2022-01-27', source: 'mock' as const },
    { lawId: '108723', lawName: '산업안전보건법', lawType: lawType ?? '법률', effectiveDate: '2021-01-16', source: 'mock' as const },
  ];
}
