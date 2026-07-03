import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createLogger } from '../../shared/logger.js';
import { getRepoDir } from '../git-sync.js';
import { resolveLawDir } from '../resolve.js';

const log = createLogger('legalize_kr');

interface ArticleChange {
  article: string;
  title: string;
  changeType: '개정' | '신설' | '삭제';
  date: string;
}

/**
 * 법령 파일 내 <개정/신설/삭제 YYYY.M.D> 마커를 파싱해 날짜 범위 내 변경 조문을 반환한다.
 * (shallow clone 환경에서 git diff 대신 사용)
 */
export async function compareVersions(lawId: string, sinceDate?: string): Promise<object> {
  const repoDir = getRepoDir();
  const resolvedDir = resolveLawDir(lawId);
  if (!resolvedDir) {
    return { error: `Law not found: ${lawId}` };
  }
  const lawFile = join(repoDir, 'kr', resolvedDir, '법률.md');

  if (!existsSync(lawFile)) {
    return { error: `Law file not found: kr/${resolvedDir}/법률.md` };
  }

  const content = readFileSync(lawFile, 'utf-8');
  const changes = extractChanges(content, sinceDate);

  return {
    lawId,
    sinceDate: sinceDate ?? '(전체)',
    totalChanges: changes.length,
    changes,
    note: '현행 법령 텍스트의 <개정/신설/삭제> 마커 기반 분석 (git 연혁 아님)',
  };
}

function extractChanges(content: string, sinceDate?: string): ArticleChange[] {
  const since = sinceDate ? normalizeDate(sinceDate) : null;
  const changes: ArticleChange[] = [];

  const articles = content.split(/(?=\n##### )/);
  for (const block of articles) {
    const titleMatch = block.match(/^\n?##### (제\d+조(?:의\d+)?)\s*(?:\(([^)]+)\))?/);
    if (!titleMatch) continue;

    const articleNo = titleMatch[1];
    const articleTitle = titleMatch[2]?.trim() ?? '';

    const markers = [...block.matchAll(/<(개정|신설|삭제)\s+(\d{4})\.(\d+)\.(\d+)>/g)];
    const seen = new Set<string>();

    for (const m of markers) {
      const [, changeType, y, mo, d] = m;
      const dateKey = `${y}.${mo.padStart(2,'0')}.${d.padStart(2,'0')}`;
      const dedupeKey = `${articleNo}:${changeType}:${dateKey}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      if (since && dateKey < since) continue;

      changes.push({
        article: articleNo,
        title: articleTitle,
        changeType: changeType as '개정' | '신설' | '삭제',
        date: dateKey,
      });
    }
  }

  return changes.sort((a, b) => a.date.localeCompare(b.date) || a.article.localeCompare(b.article));
}

function normalizeDate(d: string): string {
  // YYYY-MM-DD → YYYY.MM.DD
  const m = d.match(/^(\d{4})[.\-](\d{1,2})[.\-](\d{1,2})$/);
  if (!m) return d;
  return `${m[1]}.${m[2].padStart(2,'0')}.${m[3].padStart(2,'0')}`;
}
