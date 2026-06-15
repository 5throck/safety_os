import { existsSync } from 'fs';
import { join } from 'path';
import simpleGit from 'simple-git';
import { createLogger } from '../shared/logger.js';

const log = createLogger('legalize_kr');

const LEGALIZE_DIR = '.cache/legalize-kr';
const LEGALIZE_URL = 'https://github.com/legalize-kr/legalize-kr.git';

const ADMRULE_DIR = '.cache/admrule-kr';
const ADMRULE_URL = 'https://github.com/legalize-kr/admrule-kr.git';

async function syncRepo(dir: string, url: string, label: string): Promise<boolean> {
  if (process.env.SKIP_GIT_SYNC === 'true') {
    log.warn(`SKIP_GIT_SYNC=true — skipping ${label}`);
    return existsSync(join(dir, '.git'));
  }

  try {
    if (existsSync(join(dir, '.git'))) {
      log.info(`Updating ${label}...`);
      const git = simpleGit(dir);
      await git.fetch('origin');
      await git.reset(['--hard', 'origin/main']);
    } else {
      log.info(`Cloning ${label} (shallow)...`);
      await simpleGit().clone(url, dir, ['--depth', '1', '--branch', 'main']);
    }
    log.info(`${label} ready`);
    return true;
  } catch (err) {
    log.error(`Git sync failed for ${label}: ${err} — starting in degraded mode`);
    return false;
  }
}

export async function ensureLegalizeKRRepo(): Promise<boolean> {
  return syncRepo(LEGALIZE_DIR, LEGALIZE_URL, 'legalize-kr');
}

export async function ensureAdmruleKRRepo(): Promise<boolean> {
  return syncRepo(ADMRULE_DIR, ADMRULE_URL, 'admrule-kr');
}

export function getRepoDir(): string { return LEGALIZE_DIR; }
export function getAdmruleDir(): string { return ADMRULE_DIR; }
