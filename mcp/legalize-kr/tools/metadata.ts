import { existsSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import simpleGit from 'simple-git';
import { createLogger } from '../../shared/logger.js';
import { getRepoDir } from '../git-sync.js';

const log = createLogger('legalize_kr');

export async function getLawMetadata(lawId: string): Promise<object> {
  const repoDir = getRepoDir();
  const lawFile = join(repoDir, 'kr', lawId, '법률.md');

  if (!existsSync(lawFile)) {
    return { error: `Law file not found: kr/${lawId}/법률.md` };
  }

  const stat = statSync(lawFile);
  const content = readFileSync(lawFile, 'utf-8');

  // Parse YAML-style frontmatter (--- ... ---), handles CRLF
  const frontmatter: Record<string, string> = {};
  const normalized = content.replace(/\r\n/g, '\n');
  const fmMatch = normalized.match(/^---\n([\s\S]*?)\n---/);
  if (fmMatch) {
    for (const line of fmMatch[1].split('\n')) {
      const kv = line.match(/^([^:]+):\s*'?([^'\n]+?)'?\s*$/);
      if (kv) frontmatter[kv[1].trim()] = kv[2].trim();
    }
  }

  const git = simpleGit(repoDir);
  const relPath = `kr/${lawId}/법률.md`;
  const gitLog = await git.log({ file: relPath, maxCount: 1 }).catch(() => null);

  return {
    lawId,
    title: frontmatter['제목'] ?? lawId,
    mst: frontmatter['법령MST'] ?? null,
    lawIdCode: frontmatter['법령ID'] ?? null,
    lawType: frontmatter['법령구분'] ?? null,
    fileSize: stat.size,
    lastModified: stat.mtime.toISOString(),
    lastCommit: gitLog?.latest?.date ?? null,
    commitMessage: gitLog?.latest?.message ?? null,
  };
}
