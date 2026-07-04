import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { fetchWithRetry } from '../../shared/retry.js';
import { RateLimiter } from '../../shared/rate-limiter.js';
import { createLogger } from '../../shared/logger.js';
import type { RegulatoryArticle } from '../../shared/types.js';
import { searchArticleIndex } from './article-index.js';
import { MST_TABLE, TIER2_SEARCH_ORDER, MAX_TIER2_LOOKUPS } from './mst-table.js';

const log = createLogger('kr_safety');
const cache = new MCPCache();
const limiter = new RateLimiter(100, 60_000);
const OC = process.env.LAW_API_OC ?? 'test';

const BASE_URL = 'https://www.law.go.kr/DRF/lawSearch.do';
const LAW_SERVICE_URL = 'https://www.law.go.kr/DRF/lawService.do';

/**
 * 3-tier hybrid search for Korean OSHA/EHS regulations.
 *
 * Tier 1 (Static index): Instant match against legal-glossary.yaml — 88+ articles,
 *   no API calls. Matches article numbers and English/Korean topic keywords.
 *
 * Tier 2 (MST full-text fetch): Fetch entire law via lawService.do?MST=NNN,
 *   cache for 24h, grep locally for keyword in article title+content.
 *   Checks up to MAX_TIER2_LOOKUPS core statutes.
 *
 * Tier 3 (lawSearch.do): Law name search as last resort — law.go.kr only
 *   supports law name search, NOT article/concept search.
 *
 * All tiers failing → honest empty result (NO mock data).
 */
export async function searchOshaRegulations(keyword: string): Promise<RegulatoryArticle[]> {
  const cacheKey = `osha:search:${keyword}`;
  const cached = await cache.get(cacheKey);
  if (cached) {
    log.info(`Cache hit for keyword: ${keyword}`);
    return cached;
  }

  // --- Tier 1: Static article index (instant, no API) ---
  const tier1 = searchArticleIndex(keyword);
  if (tier1.length > 0) {
    log.info(`Tier 1 hit: ${tier1.length} articles from static index for "${keyword}"`);
    // Enrich Tier 1 results with full article content via Tier 2 for first match
    const enriched = await enrichWithContent(tier1, keyword);
    await cache.set(cacheKey, enriched, 86_400);
    return enriched;
  }

  if (process.env.MOCK_API === 'true') {
    return [];
  }

  // --- Tier 2: MST full-law fetch + local grep ---
  const tier2 = await fullLawTextSearch(keyword);
  if (tier2.length > 0) {
    log.info(`Tier 2 hit: ${tier2.length} articles from MST fetch for "${keyword}"`);
    await cache.set(cacheKey, tier2, 86_400);
    return tier2;
  }

  // --- Tier 3: lawSearch.do (law name search only) ---
  await limiter.acquireToken();
  const url = `${BASE_URL}?OC=${OC}&target=law&type=JSON&query=${encodeURIComponent(keyword)}`;
  const res = await fetchWithRetry(url);
  const json = await res.json() as any;

  const tier3: RegulatoryArticle[] = (json?.LawSearch?.law ?? []).map((item: any) => ({
    articleId: item.법령ID ?? '',
    lawName: item.법령명한글 ?? '',
    articleNumber: item.조문번호 ?? '',
    title: item.조문제목 ?? '',
    content: item.조문내용 ?? '',
    effectiveDate: item.시행일자 ?? undefined,
  }));

  if (tier3.length > 0) {
    log.info(`Tier 3 hit: ${tier3.length} results from lawSearch.do for "${keyword}"`);
    await cache.set(cacheKey, tier3, 86_400);
    return tier3;
  }

  // All tiers exhausted — honest empty result (NO mock)
  log.info(`No results found for "${keyword}" across all 3 tiers`);
  await cache.set(cacheKey, [], 3_600); // Cache empty for 1h to avoid hammering API
  return [];
}

/**
 * Tier 2: Fetch full law text via lawService.do?MST=NNN and grep for keyword.
 * Caches each full-law response for 24h. Searches at most MAX_TIER2_LOOKUPS statutes.
 */
async function fullLawTextSearch(keyword: string): Promise<RegulatoryArticle[]> {
  const query = keyword.toLowerCase().trim();
  const results: RegulatoryArticle[] = [];

  for (let i = 0; i < TIER2_SEARCH_ORDER.length && results.length < 5; i++) {
    if (i >= MAX_TIER2_LOOKUPS && results.length === 0) break; // Stop after max lookups if nothing found
    if (results.length > 0 && i >= MAX_TIER2_LOOKUPS) break;   // Also stop if we have results

    const mst = TIER2_SEARCH_ORDER[i];
    const lawName = MST_TABLE[mst];
    if (!lawName) continue;

    const articles = await fetchAndSearchLaw(mst, lawName, query);
    results.push(...articles);
  }

  return results;
}

/**
 * Fetch full law by MST and search all articles for keyword match.
 * Caches the full-law JSON response for 24h to avoid repeated fetches.
 */
async function fetchAndSearchLaw(
  mst: string,
  lawName: string,
  query: string,
): Promise<RegulatoryArticle[]> {
  const lawCacheKey = `osha:law:${mst}`;

  // Check if we have the full-law JSON cached
  const cachedLaw = await cache.get(lawCacheKey);
  let units: any[];
  if (cachedLaw) {
    units = cachedLaw as any[];
  } else {
    await limiter.acquireToken();
    const url = `${LAW_SERVICE_URL}?OC=${OC}&target=law&MST=${mst}&type=JSON`;
    try {
      const res = await fetchWithRetry(url);
      const json = await res.json() as any;
      units = json?.법령?.조문?.조문단위 ?? [];
      // Cache the parsed units array for 24h
      await cache.set(lawCacheKey, units, 86_400);
    } catch (err) {
      log.warn(`Failed to fetch law MST=${mst} (${lawName}): ${err instanceof Error ? err.message : err}`);
      return [];
    }
  }

  // Search all articles for keyword match
  const matches: RegulatoryArticle[] = [];

  for (const unit of units) {
    // Only search actual articles, skip chapter/part headers
    if (unit.조문여부 !== '조문') continue;

    const articleTitle = (unit.조문제목 ?? '').toLowerCase();
    const articleContent = flattenArticleContent(unit).toLowerCase();

    // Match keyword against article title or content
    if (articleTitle.includes(query) || articleContent.includes(query)) {
      matches.push({
        articleId: lawName,
        lawName,
        articleNumber: `제${unit.조문번호}조`,
        title: unit.조문제목 ?? '',
        content: flattenArticleContent(unit).slice(0, 500), // Truncate long content
        effectiveDate: undefined,
      });
    }

    // Limit to 3 matches per law to keep results focused
    if (matches.length >= 3) break;
  }

  return matches;
}

/**
 * Flatten article content including 항/호/목 sub-items into a single string.
 *
 * law.go.kr response has inconsistent 항 structure:
 *   - undefined: content is fully in 조문내용
 *   - object { 호: [...] }: 호 items directly under 항 (no 항내용)
 *   - array of objects: [{ 항내용, 호: [...] }]
 */
function flattenArticleContent(unit: any): string {
  const parts: string[] = [];

  // 조문내용 is the main article text
  if (unit.조문내용) parts.push(unit.조문내용);

  // 항 (paragraphs) — can be undefined, object, or array
  const 항raw = unit.항;
  if (!항raw) return parts.join(' ');

  // Normalize to array: object with 호 → treat as single 항 wrapper
  const 항들: any[] = Array.isArray(항raw) ? 항raw : [항raw];

  for (const 항 of 항들) {
    if (typeof 항 === 'string') {
      parts.push(항);
    } else if (typeof 항 === 'object' && 항) {
      if (항.항내용) parts.push(항.항내용);
      // 호 (sub-paragraphs) — can be directly on the object or nested
      const 호들 = 항.호 ?? [];
      const 호array = Array.isArray(호들) ? 호들 : [호들];
      for (const 호 of 호array) {
        if (typeof 호 === 'string') {
          parts.push(호);
        } else if (typeof 호 === 'object' && 호?.호내용) {
          parts.push(호.호내용);
        }
      }
    }
  }

  return parts.join(' ');
}

/**
 * Enrich Tier 1 results with actual article content fetched via MST.
 * Only fetches content for the first match to avoid excessive API calls.
 */
async function enrichWithContent(
  tier1Results: RegulatoryArticle[],
  keyword: string,
): Promise<RegulatoryArticle[]> {
  if (tier1Results.length === 0) return tier1Results;

  // Find MST code for the first result's law
  const firstResult = tier1Results[0];
  const mst = Object.entries(MST_TABLE).find(([, name]) => name === firstResult.lawName)?.[0];

  if (!mst) return tier1Results; // No MST code available — return as-is

  try {
    const lawCacheKey = `osha:law:${mst}`;
    const cachedLaw = await cache.get(lawCacheKey);
    let units: any[];

    if (cachedLaw) {
      units = cachedLaw as any[];
    } else {
      await limiter.acquireToken();
      const url = `${LAW_SERVICE_URL}?OC=${OC}&target=law&MST=${mst}&type=JSON`;
      const res = await fetchWithRetry(url);
      const json = await res.json() as any;
      units = json?.법령?.조문?.조문단위 ?? [];
      await cache.set(lawCacheKey, units, 86_400);
    }

    // Extract article number from tier1 result (e.g. "제36조" → "36")
    const numMatch = firstResult.articleNumber.match(/제(\d+)/);
    const targetNum = numMatch ? numMatch[1] : null;

    for (const unit of units) {
      if (unit.조문여부 !== '조문') continue;
      if (targetNum && String(unit.조문번호) === targetNum) {
        firstResult.content = flattenArticleContent(unit).slice(0, 500);
        break;
      }
    }
  } catch (err) {
    log.debug(`Could not enrich content for ${firstResult.lawName} ${firstResult.articleNumber}: ${err instanceof Error ? err.message : err}`);
  }

  return tier1Results;
}
