import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { RateLimiter } from '../../shared/rate-limiter.js';
import { createLogger } from '../../shared/logger.js';
import type { RegulatoryArticle } from '../../shared/types.js';

const log = createLogger('k_skill');
const cache = new MCPCache();
const limiter = new RateLimiter(100, 60_000);

const BASE_URL = 'https://www.law.go.kr/DRF/lawSearch.do';

export async function searchOshaRegulations(keyword: string): Promise<RegulatoryArticle[]> {
  const cacheKey = `osha:search:${keyword}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    log.info(`Cache hit for keyword: ${keyword}`);
    return cached;
  }

  if (process.env.MOCK_API === 'true') {
    return mockOshaResults(keyword);
  }

  await limiter.acquireToken();
  const url = `${BASE_URL}?OC=test&target=law&type=JSON&query=${encodeURIComponent(keyword)}`;
  const res = await fetchWithRetry(url);
  const json = await res.json() as any;

  const articles: RegulatoryArticle[] = (json?.LawSearch?.law ?? []).map((item: any) => ({
    articleId: item.법령ID ?? '',
    lawName: item.법령명한글 ?? '',
    articleNumber: item.조문번호 ?? '',
    title: item.조문제목 ?? '',
    content: item.조문내용 ?? '',
    effectiveDate: item.시행일자 ?? undefined,
  }));

  await cache.set(cacheKey, articles, 86_400);
  return articles;
}

function mockOshaResults(keyword: string): RegulatoryArticle[] {
  return [{
    articleId: 'MOCK-001',
    lawName: '산업안전보건법',
    articleNumber: '제38조',
    title: '안전조치',
    content: `${keyword} 관련 안전조치 (모의 데이터)`,
    effectiveDate: '2021-01-16',
  }];
}
