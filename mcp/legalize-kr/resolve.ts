// legalize-kr law directory resolver
// Resolves user-provided law names to actual directory names in the git mirror.
// Handles current vs former law name mismatches (e.g. SAPA).

import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createLogger } from '../shared/logger.js';
import { getRepoDir } from './git-sync.js';

const log = createLogger('legalize_kr');

const LAW_FILE = '법률.md';

// In-memory cache: user-provided lawId -> actual directory name in kr/
const dirCache = new Map<string, string>();
let cachePopulated = false;

/**
 * Resolve a user-provided lawId to the actual directory name under kr/.
 * 1. Direct match (fast path)
 * 2. Fuzzy match via YAML title scan (cached after first miss)
 */
export function resolveLawDir(lawId: string): string | null {
  const repoDir = getRepoDir();
  const directPath = join(repoDir, 'kr', lawId, LAW_FILE);

  if (existsSync(directPath)) {
    return lawId;
  }

  if (dirCache.has(lawId)) {
    return dirCache.get(lawId)!;
  }

  if (!cachePopulated) {
    populateCache(repoDir);
    cachePopulated = true;
  }

  return dirCache.get(lawId) ?? null;
}

function populateCache(repoDir: string): void {
  const krDir = join(repoDir, 'kr');
  if (!existsSync(krDir)) return;

  const dirs = safeReaddir(krDir);
  log.info(`Populating law directory cache from ${dirs.length} entries in kr/`);

  for (const dirName of dirs) {
    const lawFile = join(krDir, dirName, LAW_FILE);
    if (!existsSync(lawFile)) continue;

    const title = parseYamlTitle(lawFile);
    const normalized = title.replace(/\s+/g, '');

    if (!dirCache.has(dirName)) {
      dirCache.set(dirName, dirName);
    }
    if (normalized && !dirCache.has(normalized)) {
      dirCache.set(normalized, dirName);
    }
    for (const short of extractShortForms(normalized)) {
      if (!dirCache.has(short)) {
        dirCache.set(short, dirName);
      }
    }
  }

  log.info(`Law directory cache populated: ${dirCache.size} entries`);
}

function parseYamlTitle(filePath: string): string {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const normalized = content.replace(/\r\n/g, '\n');
    const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch) return '';

    for (const line of fmMatch[1].split('\n')) {
      const kv = line.match(/^제목:\s*'?([^'\n]+?)'?\s*$/);
      if (kv) return kv[1].trim();
    }
    return '';
  } catch {
    return '';
  }
}

// Strip common Korean law suffixes to derive short-form names
function extractShortForms(normalized: string): string[] {
  const suffixes = [
    '등에관한법률', '에관한법률',
    '등에관한규정', '에관한규정',
    '등에관한령',   '에관한령',
  ];
  const results: string[] = [];
  for (const suffix of suffixes) {
    if (normalized.endsWith(suffix)) {
      results.push(normalized.slice(0, -suffix.length) + '법');
    }
  }
  return results;
}

function safeReaddir(dir: string): string[] {
  try {
    return readdirSync(dir);
  } catch {
    return [];
  }
}
