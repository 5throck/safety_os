import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { createLogger } from '../../shared/logger.js';
import type { RegulatoryArticle } from '../../shared/types.js';

const log = createLogger('kr_safety');

/** Parsed article entry from legal-glossary.yaml */
interface ArticleEntry {
  number: string;    // e.g. "제36조"
  topicEn: string;  // e.g. "Risk assessment (위험성평가 실시)"
  lawName: string;  // e.g. "산업안전보건법"
  lawAbbr: string;  // e.g. "OSHA-KR"
}

/**
 * Static article index — parsed once at module load from legal-glossary.yaml.
 * Provides instant keyword matching without API calls (Tier 1 of hybrid search).
 *
 * Format: { number, topicEn, lawName, lawAbbr } — 88+ entries across 12 statutes.
 * Search is O(n) linear scan (sub-millisecond for ~100 entries).
 */
let index: ArticleEntry[] | null = null;

/** Resolve to project root (4 levels up from mcp/kr-safety-regs/tools/) */
const PROJECT_ROOT = dirname(dirname(dirname(dirname(new URL(import.meta.url).pathname.replace(/^\//, '')))));

function loadIndex(): ArticleEntry[] {
  if (index) return index;

  const glossaryPath = join(PROJECT_ROOT, 'regulations', 'KR', 'legal-glossary.yaml');

  try {
    const raw = readFileSync(glossaryPath, 'utf-8');
    index = parseGlossary(raw);
    log.info(`Article index loaded: ${index.length} entries from legal-glossary.yaml`);
  } catch (err) {
    log.warn(`Failed to load article index: ${err instanceof Error ? err.message : err}`);
    index = [];
  }

  return index;
}

/**
 * Minimal YAML parser for legal-glossary.yaml structure.
 * Only extracts statute names + article { number, topic_en } tuples.
 *
 * Expected structure:
 *   statutes:
 *     산업안전보건법:
 *       english: Occupational Safety and Health Act
 *       abbreviation: OSHA-KR
 *       articles:
 *         - { number: "제36조", topic_en: "Risk assessment (위험성평가 실시)" }
 *
 * Uses regex line scanning — no external YAML dependency needed.
 */
function parseGlossary(raw: string): ArticleEntry[] {
  const entries: ArticleEntry[] = [];
  const lines = raw.split(/\r?\n/);

  let currentLawName = '';
  let currentAbbr = '';
  let inStatutes = false;

  for (const line of lines) {
    // Track statutes: section start
    if (/^statutes:/.test(line.trim())) {
      inStatutes = true;
      continue;
    }

    // Exit statutes section on any top-level (unindented) key
    if (inStatutes && /^[a-z_]+:/.test(line.trim()) && !line.startsWith(' ')) {
      inStatutes = false;
      continue;
    }

    if (!inStatutes) continue;

    // Match statute name (exactly 2-space indent, top-level key under statutes:)
    // e.g. "  산업안전보건법:" — NOT "    articles:" (4-space indent)
    // Must be exactly 2 spaces followed by non-space content, ending with colon
    const lawMatch = line.match(/^(  )([^\n:]+):$/);
    if (lawMatch) {
      // Verify it's truly a 2-space indent key (not a 4-space property)
      // by checking the captured group doesn't start with spaces
      if (!lawMatch[2].startsWith(' ')) {
        currentLawName = lawMatch[2].trim();
        currentAbbr = '';
        continue;
      }
    }

    // Match abbreviation (4-space indent)
    const abbrMatch = line.match(/^    abbreviation:\s*(.+)/);
    if (abbrMatch) {
      currentAbbr = abbrMatch[1].trim();
      continue;
    }

    // Match article entries — compact YAML inline format (6-space indent)
    // e.g. '      - { number: "제36조", topic_en: "Risk assessment (위험성평가 실시)" }'
    const articleMatch = line.match(/^\s+-\s*\{\s*number:\s*["']([^"']+)["']\s*,\s*topic_en:\s*["']([^"']+)["']\s*\}/);
    if (articleMatch && currentLawName) {
      entries.push({
        number: articleMatch[1],
        topicEn: articleMatch[2],
        lawName: currentLawName,
        lawAbbr: currentAbbr,
      });
    }
  }

  return entries;
}

/**
 * Tier 1: Search the static article index for keyword matches.
 * Matches against article number, English topic tokens, and Korean terms in topic_en.
 *
 * @returns Matching articles as RegulatoryArticle[], or empty array.
 */
export function searchArticleIndex(keyword: string): RegulatoryArticle[] {
  const entries = loadIndex();
  if (entries.length === 0) return [];

  const query = keyword.toLowerCase().trim();

  // Normalize article number queries: "36" → "제36조", "36조" → "제36조"
  const articleNumMatch = query.match(/(\d+)/);
  const targetNum = articleNumMatch ? articleNumMatch[1] : null;

  // Tokenize query for topic matching
  const queryTokens = query.replace(/[^a-z0-9가-힣\s]/g, ' ').split(/\s+/).filter(t => t.length >= 2);

  const results: RegulatoryArticle[] = [];

  for (const entry of entries) {
    let matched = false;

    // 1. Exact article number match: "제36조", "36", "36조"
    if (targetNum && entry.number.includes(targetNum)) {
      matched = true;
    }

    // 2. Keyword appears in article number: "추락방지" won't match number but topic will
    // 3. Keyword appears in English topic text (case-insensitive)
    if (!matched && entry.topicEn.toLowerCase().includes(query)) {
      matched = true;
    }

    // 4. Token-level matching: at least one query token matches topic or number
    if (!matched && queryTokens.length > 0) {
      const searchableText = `${entry.number} ${entry.topicEn} ${entry.lawName} ${entry.lawAbbr}`.toLowerCase();
      matched = queryTokens.some(token => searchableText.includes(token));
    }

    if (matched) {
      results.push({
        articleId: entry.lawName,
        lawName: entry.lawName,
        articleNumber: entry.number,
        title: entry.topicEn,
        content: '',  // Static index has no article content — caller should use Tier 2 for full text
        effectiveDate: undefined,
      });
    }
  }

  return results;
}

/** Expose for testing: reload index from disk */
export function resetIndex(): void {
  index = null;
}
