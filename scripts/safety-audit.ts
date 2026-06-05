#!/usr/bin/env tsx
/**
 * Safety OS Audit Script
 * Validates schema.yaml files in workflows, 
 * regulations mcp configurations, and evidence-models refs.
 *
 * @version 2.0.1
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

function walkDirExact(dir: string, filename: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === '_template') continue;
            results.push(...walkDirExact(full, filename));
        } else if (entry.isFile() && entry.name === filename) {
            results.push(full);
        }
    }
    return results;
}

function walkDirExt(dir: string, ext: string): string[] {
    if (!fs.existsSync(dir)) return [];
    const results: string[] = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name === '_template') continue;
            results.push(...walkDirExt(full, ext));
        } else if (entry.isFile() && entry.name.endsWith(ext)) {
            results.push(full);
        }
    }
    return results;
}

function relPath(full: string): string {
    return path.relative(ROOT, full).replace(/\\/g, '/');
}

// ── scan workflows ────────────────────────────────────────────────────────────

console.log(`${CYAN}=== safety-audit.ts - Safety OS Audit check ===${RESET}\n`);

const workflowDir = path.join(ROOT, 'workflows');
const schemaFiles = walkDirExact(workflowDir, 'schema.yaml');

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

// ── scan regulations ──────────────────────────────────────────────────────────
const regDir = path.join(ROOT, 'regulations');
const regFiles = walkDirExt(regDir, '.yaml');

for (const file of regFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) {
            errors.push(`${rel}: empty or invalid yaml`);
            continue;
        }
        if (doc.source_mcp !== 'mcp-kr-legislation') {
            errors.push(`${rel}: missing or incorrect source_mcp (expected 'mcp-kr-legislation')`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── scan evidence-models ──────────────────────────────────────────────────────
const evidenceDir = path.join(ROOT, 'evidence-models');
const evidenceFiles = walkDirExt(evidenceDir, '.json');

function findRefs(obj: any, refs: string[]) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.$ref && typeof obj.$ref === 'string') {
        refs.push(obj.$ref);
    }
    for (const key of Object.keys(obj)) {
        findRefs(obj[key], refs);
    }
}

for (const file of evidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const refs: string[] = [];
        findRefs(doc, refs);
        for (const ref of refs) {
            // Strip # pointer if any
            const filePathPart = ref.split('#')[0];
            if (!filePathPart) continue; // internal ref
            
            const resolvedPath = path.resolve(path.dirname(file), filePathPart);
            if (!fs.existsSync(resolvedPath)) {
                errors.push(`${rel}: missing linked schema file -> ${filePathPart}`);
            }
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}


// ── report ────────────────────────────────────────────────────────────────────

console.log(`Files checked : ${totalChecked}`);
console.log(`  workflows/        : ${schemaFiles.length} schema.yaml file(s)`);
console.log(`  regulations/      : ${regFiles.length} .yaml file(s)`);
console.log(`  evidence-models/  : ${evidenceFiles.length} .json file(s)\n`);

if (errors.length === 0) {
    console.log(`${GREEN}✅ ${totalChecked} files checked, 0 errors${RESET}`);
    process.exit(0);
} else {
    console.error(`${RED}❌ ${errors.length} error(s) found${RESET}`);
    for (const e of errors) {
        console.error(`${RED}  - ${e}${RESET}`);
    }
    process.exit(1);
}
