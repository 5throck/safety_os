import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createLogger } from '../../shared/logger.js';
import { getRepoDir } from '../git-sync.js';

const log = createLogger('legalize_kr');

interface LawNode {
  type: 'chapter' | 'section' | 'article';
  number: string;
  title: string;
  content?: string;
  children?: LawNode[];
}

export async function parseLawStructure(lawId: string): Promise<LawNode[]> {
  const repoDir = getRepoDir();
  const lawFile = join(repoDir, 'kr', lawId, '법률.md');

  if (!existsSync(lawFile)) {
    log.warn(`Law file not found: ${lawFile}`);
    return [];
  }

  const content = readFileSync(lawFile, 'utf-8');
  return parseLawMarkdown(content);
}

function parseLawMarkdown(md: string): LawNode[] {
  const nodes: LawNode[] = [];
  let currentChapter: LawNode | null = null;
  let currentSection: LawNode | null = null;
  let currentArticle: LawNode | null = null;

  for (const line of md.split('\n')) {
    // ## 제N장 제목
    const chapterMatch = line.match(/^## (제\d+장)\s+(.+)/);
    // ### 제N절 제목
    const sectionMatch = line.match(/^### (제\d+절)\s+(.+)/);
    // ##### 제N조 (제목)
    const articleMatch = line.match(/^##### (제\d+조(?:의\d+)?)\s*(?:\((.+?)\))?/);

    if (chapterMatch) {
      currentSection = null;
      currentArticle = null;
      currentChapter = { type: 'chapter', number: chapterMatch[1], title: chapterMatch[2].trim(), children: [] };
      nodes.push(currentChapter);
    } else if (sectionMatch) {
      currentArticle = null;
      currentSection = { type: 'section', number: sectionMatch[1], title: sectionMatch[2].trim(), children: [] };
      (currentChapter?.children ?? nodes).push(currentSection);
    } else if (articleMatch) {
      currentArticle = {
        type: 'article',
        number: articleMatch[1],
        title: articleMatch[2]?.trim() ?? '',
        content: '',
      };
      const parent = currentSection ?? currentChapter;
      (parent?.children ?? nodes).push(currentArticle);
    } else if (currentArticle && line.trim() && !line.startsWith('#')) {
      currentArticle.content = ((currentArticle.content ?? '') + ' ' + line.trim()).trim();
    }
  }

  return nodes;
}
