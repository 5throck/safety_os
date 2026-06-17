#!/usr/bin/env tsx
/**
 * Safety OS Audit Script
 * Validates schema.yaml files in workflows,
 * regulations mcp configurations, and evidence-models refs.
 *
 * v2.1.0 (2026-06-17): Added GMP module validation — multi-source legal_basis,
 *   e_signature, qrm_assessment, nomenclature, and role separation checks.
 * v2.2.0 (2026-06-17): Updated paths for domain-based folder structure
 *   (workflows/domains/gmp/, agents/_shared/, skills/domains/gmp/qrm/).
 * v2.3.0 (2026-06-17): Added MSDS module validation — multi-source legal_basis
 *   (≥3 stricter than GMP), ghs_version field, reference workflow exception.
 *
 * @version 2.3.0
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


// ── GMP-specific validation: workflows ───────────────────────────────────────
// GMP workflows require multi-source legal_basis (array with ≥2 entries) per
// meeting decision 2026-06-17 (Q3/Q4 follow-up).
// v2.2.0: Path updated for domain-based folder structure.
const gmpWorkflowDir = path.join(workflowDir, 'domains', 'gmp');
const gmpSchemaFiles = walkDirExact(gmpWorkflowDir, 'schema.yaml');

for (const file of gmpSchemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) continue;
        if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < 2) {
            errors.push(`${rel}: GMP workflow requires multi-source legal_basis (array, ≥2 entries per meeting 2026-06-17)`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── GMP-specific validation: evidence models ─────────────────────────────────
// All gmp-*.json (excluding gmp-common.schema.json) must include common fields
// per meeting 2026-06-17 decisions (Q1 e-signature, Q3 qrm_assessment, Q4 nomenclature).
const gmpEvidenceFiles = evidenceFiles.filter(f => {
    const name = path.basename(f);
    return name.startsWith('gmp-') && name !== 'gmp-common.schema.json';
});

const REQUIRED_GMP_COMMON_FIELDS = ['e_signature', 'qrm_assessment', 'nomenclature', 'audit_trail'];

for (const file of gmpEvidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const props = doc.properties || {};
        for (const field of REQUIRED_GMP_COMMON_FIELDS) {
            if (!props[field]) {
                errors.push(`${rel}: missing GMP common field '${field}'`);
            }
        }
        const legalBasis = props.legal_basis;
        if (!legalBasis) {
            errors.push(`${rel}: missing legal_basis property`);
        } else if (!legalBasis.minItems || legalBasis.minItems < 2) {
            errors.push(`${rel}: legal_basis must have minItems ≥2 (multi-source required)`);
        }
        const required = doc.required || [];
        for (const field of [...REQUIRED_GMP_COMMON_FIELDS, 'legal_basis']) {
            if (!required.includes(field)) {
                errors.push(`${rel}: '${field}' must be in required array`);
            }
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}

// ── Role separation check (risk-assessment-agent vs gmp-qrm) ─────────────────
// Per meeting 2026-06-17 Q3 resolution: explicit role separation between EHS
// (risk-assessment-agent) and quality (gmp-qrm skill) risk domains.
// v2.2.0: Paths updated for domain-based folder structure.
const riskAgentPath = path.join(ROOT, 'agents', '_shared', 'risk-assessment-agent.md');
if (fs.existsSync(riskAgentPath)) {
    totalChecked++;
    const content = fs.readFileSync(riskAgentPath, 'utf-8');
    // Accept either legacy `gmp-qrm` or new `gmp/qrm` path reference
    const hasQrmRef = content.includes('gmp-qrm') || content.includes('gmp/qrm');
    if (!hasQrmRef || !content.toLowerCase().includes('product quality')) {
        errors.push('agents/_shared/risk-assessment-agent.md: missing gmp-qrm/gmp-qrm scope separation reference (required per meeting 2026-06-17)');
    }
}

const qrmSkillPath = path.join(ROOT, 'skills', 'domains', 'gmp', 'qrm', 'SKILL.md');
if (fs.existsSync(qrmSkillPath)) {
    totalChecked++;
    const content = fs.readFileSync(qrmSkillPath, 'utf-8');
    if (!content.includes('risk-assessment-agent')) {
        errors.push('skills/domains/gmp/qrm/SKILL.md: missing risk-assessment-agent scope separation reference');
    }
}

// ── MSDS-specific validation: workflows ──────────────────────────────────────
// v2.3.0: MSDS workflows require multi-source legal_basis (≥3 entries, stricter
// than GMP's ≥2) per meeting 2026-06-17. Reference workflows are exempt.
const msdsWorkflowDir = path.join(workflowDir, 'domains', 'msds');
const msdsSchemaFiles = walkDirExact(msdsWorkflowDir, 'schema.yaml');

for (const file of msdsSchemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) continue;
        const isReference = doc.workflow_type === 'reference';
        // Reference workflows: legal_basis min 2 (inherited from target_agent context)
        // Core workflows: legal_basis min 3 (OSHA-KR + 환경부법 + GHS)
        const requiredMin = isReference ? 2 : 3;
        if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < requiredMin) {
            errors.push(`${rel}: MSDS ${isReference ? 'reference' : 'core'} workflow requires multi-source legal_basis (≥${requiredMin} entries per meeting 2026-06-17)`);
        }
        // Reference workflow must have target_agent
        if (isReference && !doc.target_agent) {
            errors.push(`${rel}: reference workflow requires target_agent field`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── MSDS-specific validation: evidence models ────────────────────────────────
// All msds-*.json must include ghs_version field per meeting 2026-06-17 Q3.
const msdsEvidenceFiles = evidenceFiles.filter(f => {
    const name = path.basename(f);
    return name.startsWith('msds-') || name.startsWith('ghs-') ||
           name.startsWith('chemical-') || name.startsWith('kreach-') ||
           name.startsWith('hazard-label-');
}).filter(f => path.dirname(f).includes(path.join('domains', 'msds')));

for (const file of msdsEvidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const props = doc.properties || {};
        // ghs_version field required
        if (!props.ghs_version) {
            errors.push(`${rel}: missing ghs_version property (required per meeting 2026-06-17 Q3)`);
        }
        // legal_basis min 2 (MSDS domain standard)
        const legalBasis = props.legal_basis;
        if (legalBasis && (!legalBasis.minItems || legalBasis.minItems < 2)) {
            errors.push(`${rel}: legal_basis must have minItems ≥2`);
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}

// ── report ────────────────────────────────────────────────────────────────────

console.log(`Files checked : ${totalChecked}`);
console.log(`  workflows/        : ${schemaFiles.length} schema.yaml file(s) (${gmpSchemaFiles.length} GMP, ${msdsSchemaFiles.length} MSDS)`);
console.log(`  regulations/      : ${regFiles.length} .yaml file(s)`);
console.log(`  evidence-models/  : ${evidenceFiles.length} .json file(s) (${gmpEvidenceFiles.length} GMP, ${msdsEvidenceFiles.length} MSDS)\n`);

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
