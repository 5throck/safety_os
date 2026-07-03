import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { createLogger } from '../../shared/logger.js';

const log = createLogger('mcp_kr_legislation');
const cache = new MCPCache();
const OC = process.env.LAW_API_OC ?? 'test';

/**
 * law.go.kr has no "compliance guide" / checklist API — it only exposes law-name and
 * article-text lookups. This tool searches for laws whose name matches `topic` (reusing
 * the same lawSearch.do endpoint proven to work for search_osha_regulations) and returns
 * the real matching law(s) as a starting point, instead of fabricating generic steps.
 */
export async function getComplianceGuide(topic: string): Promise<object> {
  const cacheKey = `guide:${topic}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  if (process.env.MOCK_API === 'true') {
    return noMatchResponse(topic, 'MOCK_API=true');
  }

  const url = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=law&type=JSON&query=${encodeURIComponent(topic)}`;
  const res = await fetchWithRetry(url);
  const json = await res.json() as any;

  const laws = (json?.LawSearch?.law ?? []).map((item: any) => ({
    lawId: item.법령ID,
    lawName: item.법령명한글,
    lawType: item.법령구분명,
    effectiveDate: item.시행일자,
  }));

  if (laws.length === 0) {
    log.warn(`No law found matching topic "${topic}" via law-name search.`);
    return noMatchResponse(topic, `"${topic}"과(와) 일치하는 법령명을 찾지 못함`);
  }

  const result = {
    topic,
    relevantLaws: laws,
    note: 'law.go.kr은 법령명 검색만 지원하며, 컴플라이언스 체크리스트를 생성하는 API가 아닙니다. 위 법령의 실제 조문은 interpret_regulation("<법령명> 제N조")으로 개별 조회하시기 바랍니다.',
    source: '국가법령정보센터 (law.go.kr) 법령명 검색',
  };

  await cache.set(cacheKey, result, 21_600);
  return result;
}

function noMatchResponse(topic: string, reason: string): object {
  return {
    topic,
    relevantLaws: [],
    reason,
    note: 'law.go.kr은 법령명 검색만 지원합니다. 개념어·주제어 대신 구체적 법령명(예: "산업안전보건법")으로 다시 시도하거나, 국가법령정보센터에서 직접 검색하시기 바랍니다.',
    source: '국가법령정보센터 (law.go.kr)',
  };
}
