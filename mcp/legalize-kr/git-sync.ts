import { existsSync } from 'fs';
import { join } from 'path';
import simpleGit from 'simple-git';
import { createLogger } from '../shared/logger.js';

const log = createLogger('legalize_kr');
const REPO_DIR = '.cache/legalize-kr';
const REPO_URL = 'https://github.com/legalize-kr/legalize-kr.git';

export async function ensureLegalizeKRRepo(): Promise<boolean> {
  if (process.env.SKIP_GIT_SYNC === 'true') {
    log.warn('SKIP_GIT_SYNC=true — skipping git sync');
    return existsSync(join(REPO_DIR, '.git'));
  }

  try {
    if (existsSync(join(REPO_DIR, '.git'))) {
      log.info('Updating legalize-kr repository...');
      const git = simpleGit(REPO_DIR);
      await git.fetch('origin');
      await git.reset(['--hard', 'origin/main']);
    } else {
      log.info('Cloning legalize-kr repository (shallow)...');
      await simpleGit().clone(REPO_URL, REPO_DIR, ['--depth', '1', '--branch', 'main']);
    }
    log.info('legalize-kr repository ready');
    return true;
  } catch (err) {
    log.error(`Git sync failed: ${err} — starting in degraded mode`);
    return false;
  }
}

export function getRepoDir(): string { return REPO_DIR; }
