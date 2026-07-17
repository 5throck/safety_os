import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { parseXML } from '../xml-parser.js';
import { createLogger } from '../../shared/logger.js';

const log = createLogger('mcp_kr_legislation');
const cache = new MCPCache();
const OC = process.env.LAW_API_OC ?? 'test';

// MST = 법령마스터번호. Values verified live against law.go.kr's lawService.do
// (see memory/2026-07-03.md for the SAPA MST correction that prompted this verification).
// Exported so interpret.ts can resolve the same law-name → MST mapping.
export const LAW_MST: Record<string, string> = {
  '산업안전보건법': '285379',
  '화학물질관리법': '285367',
  '개인정보보호법': '283839',
  '중대재해처벌법': '228817',
};

export async function getLawAmendments(lawId: string, since?: string): Promise<object[]> {
  const key = `legislation:amendments:${lawId}:${since ?? 'all'}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  if (process.env.MOCK_API === 'true') return mockAmendments(lawId);

  const mst = LAW_MST[lawId];
  if (!mst) {
    log.warn(`No MST mapping for '${lawId}'.`);
    return [emptyAmendment(lawId, `법령 "${lawId}"이(가) 등록된 MST 목록(${Object.keys(LAW_MST).join(', ')})에 없음`)];
  }

  // lawHistory.do is not available on standard OC tier — use lawService.do instead
  // lawService.do returns the current version detail including 공포일자 and 제개정구분
  const url = `https://www.law.go.kr/DRF/lawService.do?OC=${OC}&target=law&MST=${mst}&type=XML&mobileYn=N`;
  const res = await fetchWithRetry(url);
  const xml = await res.text();
  const parsed = parseXML(xml) as any;

  const info = parsed?.법령?.기본정보;
  if (!info) {
    // Honest empty result — no mock/fake data.
    log.warn('lawService.do returned unexpected structure (no 기본정보).');
    return [emptyAmendment(lawId, 'lawService.do 응답에서 기본정보를 찾지 못함 (OC 키 미등록 가능)')];
  }

  const result = [{
    date: String(info.공포일자 ?? ''),
    effectiveDate: String(info.시행일자 ?? ''),
    reason: info.제개정구분 ?? '',
    lawNumber: String(info.공포번호 ?? ''),
    note: '단일 현행 버전 — 연혁 전체 조회는 국가법령정보센터 lawHistory API 등록 필요',
    source: 'live_api' as const,
  }].filter(r => !since || r.date >= since.replace(/-/g, ''));

  await cache.set(key, result, 21_600);
  return result;
}

function emptyAmendment(lawId: string, reason: string): object {
  return {
    lawId,
    date: null,
    effectiveDate: null,
    reason,
    lawNumber: null,
    note: '자동 조회에 실패했습니다. 정확한 개정 이력은 국가법령정보센터(law.go.kr)에서 직접 확인하시기 바랍니다.',
    source: 'empty' as const,
  };
}

function mockAmendments(lawId: string) {
  const defaults: Record<string, object[]> = {
    '산업안전보건법': [
      { date: '20260219', effectiveDate: '20260601', reason: '일부개정', lawNumber: '21374', source: 'mock' as const },
      { date: '20231012', effectiveDate: '20240101', reason: '일부개정', lawNumber: '19855', source: 'mock' as const },
    ],
    '중대재해처벌법': [
      { date: '20230407', effectiveDate: '20240127', reason: '일부개정', lawNumber: '19348', source: 'mock' as const },
    ],
  };
  return defaults[lawId] ?? [
    { date: '20230101', effectiveDate: '20230701', reason: '일부개정', lawNumber: '00000', source: 'mock' as const },
  ];
}
