import { existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import simpleGit from 'simple-git';
import { getRepoDir } from '../git-sync.js';

export async function getLawMetadata(lawId: string): Promise<object> {
  const repoDir = getRepoDir();
  if (!existsSync(repoDir)) return { error: 'Repository not available' };

  const files = readdirSync(repoDir).filter((f: string) => f.includes(lawId) && f.endsWith('.md'));
  if (files.length === 0) return { error: `Law not found: ${lawId}` };

  const filePath = join(repoDir, files[0]);
  const stat = statSync(filePath);
  const git = simpleGit(repoDir);
  const gitLog = await git.log({ file: files[0], maxCount: 1 }).catch(() => null);

  return {
    lawId,
    fileName: files[0],
    fileSize: stat.size,
    lastModified: stat.mtime.toISOString(),
    lastCommit: gitLog?.latest?.date ?? null,
    commitMessage: gitLog?.latest?.message ?? null,
  };
}
