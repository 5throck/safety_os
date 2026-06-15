import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createLogger } from '../../shared/logger.js';
import { getRepoDir } from '../git-sync.js';

const log = createLogger('legalize_kr');

export async function findReferences(lawId: string): Promise<object[]> {
  const repoDir = getRepoDir();
  if (!existsSync(repoDir)) return [];

  const refs: object[] = [];
  const files = readdirSync(repoDir).filter(f => f.endsWith('.md'));
  const pattern = new RegExp(lawId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');

  for (const file of files) {
    if (file.includes(lawId)) continue;
    const content = readFileSync(join(repoDir, file), 'utf-8');
    const matches = content.match(pattern);
    if (matches) {
      refs.push({ file, referenceCount: matches.length, lawName: file.replace('.md', '') });
    }
  }
  return refs;
}
