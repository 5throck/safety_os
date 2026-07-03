import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { createLogger } from '../../shared/logger.js';
import { getRepoDir } from '../git-sync.js';

const log = createLogger('legalize_kr');

interface LawReference {
  lawName: string;
  referenceCount: number;
}

export async function findReferences(lawId: string): Promise<LawReference[]> {
  const repoDir = getRepoDir();
  const krDir = join(repoDir, 'kr');
  if (!existsSync(krDir)) {
    log.warn('kr/ directory not found in repo');
    return [];
  }

  const pattern = new RegExp(lawId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
  const refs: LawReference[] = [];

  for (const lawName of readdirSync(krDir)) {
    if (lawName === lawId) continue;
    const lawFile = join(krDir, lawName, '법률.md');
    if (!existsSync(lawFile)) continue;

    const content = readFileSync(lawFile, 'utf-8');
    const matches = content.match(pattern);
    if (matches) {
      refs.push({ lawName, referenceCount: matches.length });
    }
  }

  return refs.sort((a, b) => b.referenceCount - a.referenceCount);
}
