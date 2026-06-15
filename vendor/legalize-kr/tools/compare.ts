import simpleGit from 'simple-git';
import { existsSync, readdirSync } from 'fs';
import { getRepoDir } from '../git-sync.js';

export async function compareVersions(lawId: string, sinceCommit?: string): Promise<object> {
  const repoDir = getRepoDir();
  if (!existsSync(repoDir)) return { error: 'Repository not available' };

  const git = simpleGit(repoDir);
  const files = readdirSync(repoDir).filter((f: string) => f.includes(lawId) && f.endsWith('.md'));
  if (files.length === 0) return { changes: [] };

  const since = sinceCommit ?? 'HEAD~1';
  const diff = await git.diff([since, 'HEAD', '--', files[0]]).catch(() => '');
  return { lawId, file: files[0], since, diff: diff || '(no changes)' };
}
