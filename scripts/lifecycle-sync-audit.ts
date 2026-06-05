#!/usr/bin/env bun
/**
 * Lifecycle Sync Audit Script
 *
 * Detects version drift between lifecycle management artifacts.
 * Check A: scripts/*.ts @version comment vs scripts/SCRIPTS.md registry version
 *
 * Usage:
 *   bun scripts/lifecycle-sync-audit.ts
 *   bun scripts/lifecycle-sync-audit.ts --json
 *
 * @version 1.3.2
 * @last_updated 2026-06-02
 * @license MIT
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

// ANSI colors for terminal output
const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  dim: '\x1b[2m',
};

interface SyncIssue {
  level: 'error' | 'warning';
  file: string;
  message: string;
  fix?: string;
  fixData?: {
    scriptName: string;
    fileVersion: string;
    registryVersion: string;
  };
}

interface DuplicateEntry {
  file: string;
  source: string;
  reason: string;
}

interface AuditResult {
  checksRun: number;
  errors: SyncIssue[];
  warnings: SyncIssue[];
  registry: DuplicateEntry[];
  passed: boolean;
}

const ROOT = cwd();
const SCRIPTS_MD = join(ROOT, 'scripts', 'SCRIPTS.md');

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');

interface RegistryEntry {
  version: string;
  layer: 'common' | 'L0-only' | 'L1-only';
}

function parseScriptsMdRegistry(
  filePath: string,
  activeOnly = false,
): Map<string, RegistryEntry> {
  const result = new Map<string, RegistryEntry>();

  if (!existsSync(filePath)) return result;

  const content = readFileSync(filePath, 'utf-8');

  const registryMatch = content.match(/## Registry\n([\s\S]*?)(?:\n## |\s*$)/);
  if (!registryMatch) return result;

  const section = registryMatch[1];
  const lines = section.split('\n');

  let versionColIdx = 3;
  let statusColIdx = 4;
  let layerColIdx = -1;

  for (const line of lines) {
    if (!line.startsWith('|')) continue;
    const cols = line.split('|').map((c) => c.trim());
    if (cols[1] === 'script') {
      for (let i = 1; i < cols.length; i++) {
        const h = cols[i].toLowerCase();
        if (h === 'version') versionColIdx = i;
        else if (h === 'status') statusColIdx = i;
        else if (h === 'layer') layerColIdx = i;
      }
      break;
    }
  }

  for (const line of lines) {
    if (!line.startsWith('|')) continue;

    const cols = line.split('|').map((c) => c.trim());
    if (cols.length < 5) continue;

    const rawName = cols[1];
    const version = cols[versionColIdx] ?? '';
    const status = cols[statusColIdx] ?? '';

    if (rawName === 'script' || rawName.startsWith('-')) continue;
    if (!rawName.startsWith('`')) continue;

    const filename = rawName.replace(/`/g, '').trim();
    if (!filename) continue;

    if (activeOnly && status !== 'active' && status !== 'experimental') continue;

    const rawLayer = layerColIdx >= 0 ? (cols[layerColIdx] ?? '') : '';
    let layer: RegistryEntry['layer'] = 'common';
    if (rawLayer === 'L0-only') layer = 'L0-only';
    else if (rawLayer === 'L1-only') layer = 'L1-only';

    result.set(filename, { version, layer });
  }

  return result;
}

function extractFileVersion(filePath: string): string | null {
  if (!existsSync(filePath)) return null;

  const content = readFileSync(filePath, 'utf-8');
  const match = content.match(/@version\s+([\d.]+)/);
  return match ? match[1] : null;
}

function runCheckA(): SyncIssue[] {
  const issues: SyncIssue[] = [];

  if (!existsSync(SCRIPTS_MD)) {
    issues.push({
      level: 'error',
      file: 'scripts/SCRIPTS.md',
      message: 'scripts/SCRIPTS.md not found — cannot run Check A',
    });
    return issues;
  }

  const registry = parseScriptsMdRegistry(SCRIPTS_MD, true);

  for (const [filename, { version: registryVersion }] of registry) {
    if (!filename.endsWith('.ts')) continue;

    const scriptPath = join(ROOT, 'scripts', filename);

    if (!existsSync(scriptPath)) continue;

    const fileVersion = extractFileVersion(scriptPath);

    if (fileVersion === null) {
      if (!jsonMode) console.log(`\x1b[33m[WARN]\x1b[0m ${filename}: @version header missing`);
      issues.push({
        level: 'warning',
        file: `scripts/${filename}`,
        message: `Check A: @version header missing in ${filename} — SCRIPTS.md version unvalidatable`,
      });
      continue;
    }

    if (fileVersion !== registryVersion) {
      issues.push({
        level: 'error',
        file: `scripts/${filename}`,
        message: `Check A: scripts/${filename} @version ${fileVersion} does not match SCRIPTS.md entry ${registryVersion}`,
        fix: `Update scripts/SCRIPTS.md version for ${filename} from ${registryVersion} to ${fileVersion}`,
        fixData: {
          scriptName: filename,
          fileVersion,
          registryVersion,
        },
      });
    }
  }

  return issues;
}

function runAudit(jsonMode = false): AuditResult {
  if (!jsonMode) {
    console.log(`${colors.cyan}🔍 Lifecycle Sync Audit${colors.reset}`);
    console.log(`${colors.cyan}========================${colors.reset}`);
    console.log(`${colors.dim}Check A: scripts @version vs SCRIPTS.md registry${colors.reset}`);
    console.log('');
  }

  const checkAIssues = runCheckA();

  const allErrors = checkAIssues.filter((i) => i.level === 'error');
  const allWarnings = checkAIssues.filter((i) => i.level === 'warning');

  return {
    checksRun: 1,
    errors: allErrors,
    warnings: allWarnings,
    registry: [],
    passed: allErrors.length === 0,
  };
}

function printResults(result: AuditResult): void {
  for (const error of result.errors) {
    console.log(`${colors.red}✖ ERROR: ${error.message}${colors.reset}`);
    if (error.fix) console.log(`   Fix: ${error.fix}`);
    console.log('');
  }

  for (const warning of result.warnings) {
    console.log(`${colors.yellow}⚠️  WARNING: ${warning.message}${colors.reset}`);
    if (warning.fix) console.log(`   Fix: ${warning.fix}`);
    console.log('');
  }

  console.log(`${colors.cyan}========================${colors.reset}`);
  if (result.passed) {
    console.log(`${colors.green}✅ All lifecycle sync checks passed.${colors.reset}`);
  } else {
    console.log(`${colors.red}❌ ${result.errors.length} error(s) found.${colors.reset}`);
  }
}

const result = runAudit(jsonMode);

if (jsonMode) {
  const cleanResult = {
    ...result,
    errors: result.errors.map(({ fixData: _fd, ...rest }) => rest),
    warnings: result.warnings.map(({ fixData: _fd, ...rest }) => rest),
  };
  console.log(JSON.stringify(cleanResult, null, 2));
} else {
  printResults(result);
}

process.exit(result.errors.length > 0 ? 1 : 0);
