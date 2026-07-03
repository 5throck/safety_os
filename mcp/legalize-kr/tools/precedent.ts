import { createLogger } from '../../shared/logger.js';
import { RateLimiter } from '../../shared/rate-limiter.js';

const log = createLogger('legalize_kr');
const limiter = new RateLimiter(10, 60_000); // GitHub Search API: 10 req/min (unauthenticated)

interface PrecedentResult {
  caseNumber: string;
  court: string;
  date: string;
  category: string;
  path: string;
  url: string;
}

/**
 * legalize-kr/precedent-kr 저장소에서 GitHub Search API로 판례를 검색한다.
 * GITHUB_TOKEN 환경변수가 설정되면 rate limit이 분당 30건으로 증가한다.
 */
export async function searchPrecedent(
  keyword: string,
  category?: string,
): Promise<PrecedentResult[]> {
  await limiter.acquireToken();

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    log.warn('GITHUB_TOKEN not set — GitHub Search API requires authentication since 2023-02.');
    return [{
      error: 'GITHUB_TOKEN required',
      message: 'GitHub Code Search API requires authentication. Set GITHUB_TOKEN in .env to use search_precedent.',
      hint: 'Generate a token at https://github.com/settings/tokens (no scopes needed for public repos)',
    } as any];
  }

  const scope = category ? `path:${encodeURIComponent(category)}` : '';
  const q = `${keyword} repo:legalize-kr/precedent-kr ${scope}`.trim();
  const url = `https://api.github.com/search/code?q=${encodeURIComponent(q)}&per_page=15`;

  const headers: Record<string, string> = {
    'Accept': 'application/vnd.github+json',
    'Authorization': `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };

  log.info(`GitHub search: ${q}`);
  const res = await fetch(url, { headers });

  if (res.status === 403) {
    const remaining = res.headers.get('x-ratelimit-remaining');
    log.warn(`GitHub API rate limit: ${remaining} remaining`);
    return [{ error: 'Rate limit exceeded', retryAfter: res.headers.get('x-ratelimit-reset') } as any];
  }
  if (!res.ok) {
    log.error(`GitHub API error: ${res.status} ${await res.text()}`);
    return [];
  }

  const data = await res.json() as any;
  return (data.items ?? []).map((item: any) => {
    // path: 카테고리/법원/파일명.md  예) 형사/대법원/대법원_2023-01-15_2022도12345.md
    const parts = item.path.split('/');
    const fileName = parts.at(-1)?.replace('.md', '') ?? '';
    // 파일명 형식: 법원_날짜_사건번호
    const [court, date, ...rest] = fileName.split('_');
    return {
      caseNumber: rest.join('_') || fileName,
      court: court ?? '',
      date: date ?? '',
      category: parts[0] ?? '',
      subCategory: parts[1] ?? '',
      path: item.path,
      url: item.html_url,
    };
  });
}
