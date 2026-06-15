import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { parseXML } from '../xml-parser.js';
import { createLogger } from '../../shared/logger.js';

const log = createLogger('mcp_kr_legislation');
const cache = new MCPCache();
const OC = process.env.LAW_API_OC ?? 'test';

// MST = 법령마스터번호 (legalize-kr 캐시 frontmatter 기준)
const LAW_MST: Record<string, string> = {
  '산업안전보건법': '285379',
  '화학물질관리법': '285367',
  '개인정보보호법': '283839',
};

export async function getLawAmendments(lawId: string, since?: string): Promise<object[]> {
  const key = `legislation:amendments:${lawId}:${since ?? 'all'}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  if (process.env.MOCK_API === 'true') return mockAmendments(lawId);

  const mst = LAW_MST[lawId];
  if (!mst) {
    log.warn(`No MST mapping for '${lawId}'. Falling back to mock amendments.`);
    return mockAmendments(lawId);
  }

  // lawHistory.do is not available on standard OC tier — use lawService.do instead
  // lawService.do returns the current version detail including 공포일자 and 제개정구분
  const url = `https://www.law.go.kr/DRF/lawService.do?OC=${OC}&target=law&MST=${mst}&type=XML&mobileYn=N`;
  const res = await fetchWithRetry(url);
  const xml = await res.text();
  const parsed = parseXML(xml) as any;

  const info = parsed?.법령?.기본정보;
  if (!info) {
    log.warn('lawService.do returned unexpected structure. Falling back to mock.');
    return mockAmendments(lawId);
  }

  const result = [{
    date: String(info.공포일자 ?? ''),
    effectiveDate: String(info.시행일자 ?? ''),
    reason: info.제개정구분 ?? '',
    lawNumber: String(info.공포번호 ?? ''),
    note: '단일 현행 버전 — 연혁 전체 조회는 국가법령정보센터 lawHistory API 등록 필요',
  }].filter(r => !since || r.date >= since.replace(/-/g, ''));

  await cache.set(key, result, 21_600);
  return result;
}

function mockAmendments(lawId: string) {
  const defaults: Record<string, object[]> = {
    '산업안전보건법': [
      { date: '20260219', effectiveDate: '20260601', reason: '일부개정', lawNumber: '21374' },
      { date: '20231012', effectiveDate: '20240101', reason: '일부개정', lawNumber: '19855' },
    ],
    '중대재해처벌법': [
      { date: '20230407', effectiveDate: '20240127', reason: '일부개정', lawNumber: '19348' },
    ],
  };
  return defaults[lawId] ?? [
    { date: '20230101', effectiveDate: '20230701', reason: '일부개정', lawNumber: '00000' },
  ];
}
