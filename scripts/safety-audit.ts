#!/usr/bin/env tsx
/**
 * Safety OS Audit Script
 * Validates schema.yaml files in workflows.
 *
 * @version 2.0.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';

// Color helpers
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';

const ROOT = path.resolve(process.cwd());

let totalChecked = 0;
const errors: string[] = [];

// ── helpers ──────────────────────────────────────────────────────────────────

function walkDir(dir: string, filename: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === '_template') continue;
            results.push(...walkDir(full, filename));
        } else if (entry.isFile() && entry.name === filename) {
            results.push(full);
        }
    }
    return results;
}

function relPath(full: string): string {
    return path.relative(ROOT, full).replace(/\\/g, '/');
}

// ── scan workflows ────────────────────────────────────────────────────────────

console.log(`${CYAN}=== safety-audit.ts - Safety OS schema.yaml check ===${RESET}\n`);

const workflowDir = path.join(ROOT, 'workflows');
const schemaFiles = walkDir(workflowDir, 'schema.yaml');

const VALID_STATUSES = ['active', 'template', 'deprecated'];
const VALID_APPLICABILITIES = ['mandatory', 'optional'];

for (const file of schemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) {
            errors.push(`${rel}: empty or invalid yaml`);
            continue;
        }

        if (!doc.legal_basis) {
            errors.push(`${rel}: missing legal_basis`);
        }

        if (!doc.status || !VALID_STATUSES.includes(doc.status)) {
            errors.push(`${rel}: invalid or missing status ('${doc.status}')`);
        }

        if (!doc.applicability || !VALID_APPLICABILITIES.includes(doc.applicability)) {
            errors.push(`${rel}: invalid or missing applicability ('${doc.applicability}')`);
        }

    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── report ────────────────────────────────────────────────────────────────────

console.log(`Files checked : ${totalChecked}`);
console.log(`  workflows/  : ${schemaFiles.length} schema.yaml file(s)\n`);

if (errors.length === 0) {
    console.log(`${GREEN}✅ ${totalChecked} schema files checked, 0 errors${RESET}`);
    process.exit(0);
} else {
    console.error(`${RED}❌ ${errors.length} error(s) found in schema.yaml files${RESET}`);
    for (const e of errors) {
        console.error(`${RED}  - ${e}${RESET}`);
    }
    process.exit(1);
}
