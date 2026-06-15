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
  }));

  await cache.set(key, laws, 21_600);
  return laws;
}

function mockCurrentLaw(lawType?: string) {
  return [
    { lawId: '272966', lawName: '중대재해처벌법', lawType: lawType ?? '법률', effectiveDate: '2022-01-27' },
    { lawId: '108723', lawName: '산업안전보건법', lawType: lawType ?? '법률', effectiveDate: '2021-01-16' },
  ];
}
