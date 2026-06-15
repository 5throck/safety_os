import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { parseXML } from '../xml-parser.js';
import { createLogger } from '../../shared/logger.js';

const log = createLogger('mcp_kr_legislation');
const cache = new MCPCache();
const OC = process.env.LAW_API_OC ?? 'test';

export async function getLawAmendments(lawId: string, since?: string): Promise<object[]> {
  const key = `legislation:amendments:${lawId}:${since ?? 'all'}`;
  const cached = await cache.get(key);
  if (cached) return cached;

  if (process.env.MOCK_API === 'true') return mockAmendments(lawId);

  const url = `https://www.law.go.kr/DRF/lawHistory.do?OC=${OC}&target=law&MST=${lawId}&type=XML`;
  const res = await fetchWithRetry(url);
  const xml = await res.text();
  const parsed = parseXML(xml) as any;

  const amendments = (parsed?.LawHistory?.history ?? [])
    .filter((h: any) => !since || h.개정일자 >= since)
    .map((h: any) => ({
      date: h.개정일자,
      reason: h.개정이유,
      lawNumber: h.법령번호,
    }));

  await cache.set(key, amendments, 21_600);
  return amendments;
}

function mockAmendments(lawId: string) {
  return [
    { date: '2022-01-27', reason: '제정', lawNumber: '18967' },
    { date: '2023-04-18', reason: '일부개정', lawNumber: '19347' },
  ];
}
