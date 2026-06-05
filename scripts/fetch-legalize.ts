/**
 * @version 1.0.0
 * Script to clone or update the legalize-kr repository.
 */

import { existsSync, appendFileSync, readFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { spawnSync } from 'child_process';

const REPO_URL = 'https://github.com/legalize-kr/legalize-kr.git';
const CACHE_DIR = join(process.cwd(), '.cache');
const TARGET_DIR = join(CACHE_DIR, 'legalize-kr');
const GITIGNORE_PATH = join(process.cwd(), '.gitignore');

function ensureGitignore() {
  try {
    if (existsSync(GITIGNORE_PATH)) {
      const content = readFileSync(GITIGNORE_PATH, 'utf-8');
      if (!content.includes('.cache/')) {
        appendFileSync(GITIGNORE_PATH, '\n# Cache directory\n.cache/\n');
        console.log('Added .cache/ to .gitignore');
      }
    } else {
      appendFileSync(GITIGNORE_PATH, '# Cache directory\n.cache/\n');
      console.log('Created .gitignore and added .cache/');
    }
  } catch (err: any) {
    console.warn(`Could not update .gitignore: ${err.message}`);
  }
}

function runCommand(command: string, args: string[], cwd: string = process.cwd()) {
  console.log(`Running: ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { cwd, stdio: 'inherit', shell: true });
  if (result.error) {
    console.error(`Error executing command: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`Command failed with exit code ${result.status}`);
    process.exit(result.status || 1);
  }
}

function fetchLegalize(depth: number = 1) {
  ensureGitignore();

  if (!existsSync(CACHE_DIR)) {
    mkdirSync(CACHE_DIR, { recursive: true });
  }

  if (existsSync(join(TARGET_DIR, '.git'))) {
    console.log(`Directory ${TARGET_DIR} exists, updating repository...`);
    runCommand('git', ['pull'], TARGET_DIR);
  } else {
    console.log(`Cloning repository into ${TARGET_DIR}...`);
    runCommand('git', ['clone', '--depth', depth.toString(), REPO_URL, TARGET_DIR]);
  }
}

// Parse optional depth argument
let depth = 1;
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg === '--depth' && i + 1 < process.argv.length) {
    const parsed = parseInt(process.argv[i + 1], 10);
    if (!isNaN(parsed) && parsed > 0) {
      depth = parsed;
    }
    break;
  } else if (!arg.startsWith('--')) {
    const parsed = parseInt(arg, 10);
    if (!isNaN(parsed) && parsed > 0) {
      depth = parsed;
      break;
    }
  }
}

fetchLegalize(depth);
