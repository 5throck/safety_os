import { readdirSync, readFileSync, existsSync } from 'fs';
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
  if (!existsSync(repoDir)) {
    log.warn('Repository not available — returning empty structure');
    return [];
  }

  const files = readdirSync(repoDir).filter(f => f.includes(lawId) && f.endsWith('.md'));
  if (files.length === 0) {
    log.warn(`Law not found: ${lawId}`);
    return [];
  }

  const content = readFileSync(join(repoDir, files[0]), 'utf-8');
  return parseLawMarkdown(content);
}

function parseLawMarkdown(md: string): LawNode[] {
  const nodes: LawNode[] = [];
  let current: LawNode | null = null;

  for (const line of md.split('\n')) {
    const chapterMatch = line.match(/^## (제\d+장)\s+(.+)/);
    const articleMatch = line.match(/^### (제\d+조)\s*(?:\((.+)\))?/);
    const contentLine = line.trim();

    if (chapterMatch) {
      current = { type: 'chapter', number: chapterMatch[1], title: chapterMatch[2], children: [] };
      nodes.push(current);
    } else if (articleMatch) {
      const article: LawNode = {
        type: 'article',
        number: articleMatch[1],
        title: articleMatch[2] ?? '',
        content: '',
      };
      if (current?.children) current.children.push(article);
      else nodes.push(article);
    } else if (contentLine && current) {
      const lastChild = current.children?.at(-1);
      if (lastChild?.content !== undefined) lastChild.content += ' ' + contentLine;
    }
  }
  return nodes;
}
