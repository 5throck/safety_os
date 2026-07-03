import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { createLogger } from '../../shared/logger.js';
import { LAW_MST } from './amendments.js';

const log = createLogger('mcp_kr_legislation');
const cache = new MCPCache();
const OC = process.env.LAW_API_OC ?? 'test';

export async function interpretRegulation(articleId: string): Promise<object> {
  const cacheKey = `interpret:${articleId}`;
  const cached = await cache.get(cacheKey);
  if (cached) return cached;

  if (process.env.MOCK_API === 'true') {
    return unresolvedResponse(articleId, 'MOCK_API=true');
  }

  const parsed = parseArticleId(articleId);
  if (!parsed) {
    log.warn(`Could not parse a "<법령명> 제N조" pattern from "${articleId}".`);
    return unresolvedResponse(articleId, `"${articleId}"에서 법령명과 조문번호(예: "산업안전보건법 제38조")를 인식하지 못함`);
  }

  const mst = LAW_MST[parsed.lawName];
  if (!mst) {
    log.warn(`No MST mapping for law "${parsed.lawName}".`);
    return unresolvedResponse(articleId, `법령 "${parsed.lawName}"이(가) 등록된 MST 목록(${Object.keys(LAW_MST).join(', ')})에 없음`);
  }

  const url = `https://www.law.go.kr/DRF/lawService.do?OC=${OC}&target=law&MST=${mst}&type=JSON`;
  const res = await fetchWithRetry(url);
  const json = await res.json() as any;

  const units = json?.법령?.조문?.조문단위 ?? [];
  const match = units.find((u: any) => u.조문여부 === '조문' && String(u.조문번호) === parsed.articleNumber);

  if (!match) {
    log.warn(`Article ${parsed.articleNumber}조 not found in ${parsed.lawName} (MST=${mst}).`);
    return unresolvedResponse(articleId, `${parsed.lawName} 제${parsed.articleNumber}조를 원문에서 찾지 못함 (조문 번호 확인 필요)`);
  }

  const content = extractArticleText(match);
  const result = {
    articleId,
    lawName: parsed.lawName,
    articleNumber: parsed.articleNumber,
    articleTitle: match.조문제목 ?? null,
    content,
    source: '국가법령정보센터 (law.go.kr) 조문 원문',
    disclaimer: '이 결과는 법령 조문의 원문이며, 행정해석·판례·유권해석 등 2차 해석 자료가 아닙니다. 실제 적용 여부는 자격 있는 안전/법무 전문가의 확인이 필요합니다.',
  };

  await cache.set(cacheKey, result, 21_600);
  return result;
}

/** Parses "<법령명> 제N조" (e.g. "산업안전보건법 제38조"). Does not yet handle 가지번호 (e.g. "제92조의2"). */
function parseArticleId(articleId: string): { lawName: string; articleNumber: string } | null {
  const m = articleId.match(/^(.+?)\s*제\s*(\d+)\s*조/);
  if (!m) return null;
  return { lawName: m[1].trim(), articleNumber: m[2] };
}

/**
 * 조문내용 alone is often just the article header (e.g. "제4조(사업주와 ...)"), with the
 * actual substantive text nested under 항 (paragraphs) → 호 (items) → 목 (sub-items).
 * Concatenate all levels so the returned content is the complete article text, not just
 * the header line (verified against 중대재해처벌법 제4조, which has both a short 조문내용
 * header and a fully-populated 항/호 tree).
 */
function extractArticleText(unit: any): string {
  const parts: string[] = [];
  if (unit.조문내용) parts.push(unit.조문내용);

  const hangList = Array.isArray(unit.항) ? unit.항 : (unit.항 ? [unit.항] : []);
  for (const hang of hangList) {
    if (hang.항내용) parts.push(hang.항내용);
    const hoList = Array.isArray(hang.호) ? hang.호 : (hang.호 ? [hang.호] : []);
    for (const ho of hoList) {
      if (ho.호내용) parts.push(ho.호내용);
      const mokList = Array.isArray(ho.목) ? ho.목 : (ho.목 ? [ho.목] : []);
      for (const mok of mokList) {
        if (mok.목내용) parts.push(mok.목내용);
      }
    }
  }

  return parts.join(' ') || '(조문 내용을 구조화된 형식에서 추출하지 못함 — law.go.kr 원문 직접 확인 필요)';
}

function unresolvedResponse(articleId: string, reason: string): object {
  return {
    articleId,
    interpretation: null,
    reason,
    note: '자동 조회에 실패했습니다. 정확한 조문은 국가법령정보센터(law.go.kr)에서 직접 확인하시기 바랍니다.',
    source: '국가법령정보센터 (law.go.kr)',
  };
}
