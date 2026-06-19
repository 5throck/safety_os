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
 * v2.4.0 (2026-06-17): Added GDP module validation — gdp_certification_status,
 *   temperature_condition, batch_disposition_approved_ref fields.
 * v2.5.0 (2026-06-17): Added GLP module validation — glp_certification_authority,
 *   oecd_mad_applicable, study_director_id, msds_record_ref fields.
 * v2.6.0 (2026-06-17): Added GCP module validation — irb_approval_ref,
 *   ich_e6_compliance, protocol_ref, site_id fields.
 * v2.7.0 (2026-06-17): Added GVP module validation — ich_e2_compliance,
 *   pbrer_cycle_ref, product_id, rmp_version_ref fields.
 * v2.8.0 (2026-06-18): Added ehsconst (Construction Safety) module validation —
 *   sapa_article_12_compliance, project_id, contractor_tier, safety_officer_in_charge.
 * v2.9.0 (2026-06-18): Added gasterm (Gas Terminal) + powergen (Power Generation)
 *   module validation. gasterm: facility_type, kgs_inspection_status, psm_applicable,
 *   gas_type. powergen: plant_type, kesa_inspection_status, voltage_class.
 * v3.0.0 (2026-06-18): Added ehschem + meddevice validation, generic domain helpers.
 * v3.1.0 (2026-06-19): Added cross-domain reference integrity validation —
 *   validates cross-domain reference fields, uses_functional_services, applicable_industries.
 *
 * @version 3.1.0
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
const gmpWorkflowDir = path.join(workflowDir, 'domains', 'functional', 'gmp');
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

const qrmSkillPath = path.join(ROOT, 'skills', 'domains', 'functional', 'gmp', 'qrm', 'SKILL.md');
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
const msdsWorkflowDir = path.join(workflowDir, 'domains', 'functional', 'msds');
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
}).filter(f => path.dirname(f).includes(path.join('domains', 'functional', 'msds')));

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

// ── GDP-specific validation: workflows ───────────────────────────────────────
// v2.4.0: GDP workflows require multi-source legal_basis (≥3 core, ≥2 reference)
const gdpWorkflowDir = path.join(workflowDir, 'domains', 'functional', 'gdp');
const gdpSchemaFiles = walkDirExact(gdpWorkflowDir, 'schema.yaml');

for (const file of gdpSchemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) continue;
        const isReference = doc.workflow_type === 'reference';
        const requiredMin = isReference ? 2 : 3;
        if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < requiredMin) {
            errors.push(`${rel}: GDP ${isReference ? 'reference' : 'core'} workflow requires multi-source legal_basis (≥${requiredMin} entries)`);
        }
        if (isReference && !doc.target_agent) {
            errors.push(`${rel}: GDP reference workflow requires target_agent field`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── GDP-specific validation: evidence models ────────────────────────────────
// v2.4.0: All gdp-*.json must include gdp_certification_status, temperature_condition, batch_disposition_approved_ref
const gdpEvidenceFiles = evidenceFiles.filter(f => {
    return path.basename(f).startsWith('gdp-') &&
           path.dirname(f).includes(path.join('domains', 'functional', 'gdp'));
});

const REQUIRED_GDP_FIELDS = ['gdp_certification_status', 'temperature_condition', 'batch_disposition_approved_ref'];

for (const file of gdpEvidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const props = doc.properties || {};
        for (const field of REQUIRED_GDP_FIELDS) {
            if (!props[field]) {
                errors.push(`${rel}: missing GDP required field '${field}'`);
            }
        }
        const legalBasis = props.legal_basis;
        if (legalBasis && (!legalBasis.minItems || legalBasis.minItems < 3)) {
            errors.push(`${rel}: GDP legal_basis must have minItems ≥3`);
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}

// ── report ────────────────────────────────────────────────────────────────────

// ── GLP-specific validation: workflows ───────────────────────────────────────
// v2.5.0: GLP workflows require multi-source legal_basis (≥3 core, ≥2 reference)
const glpWorkflowDir = path.join(workflowDir, 'domains', 'functional', 'glp');
const glpSchemaFiles = walkDirExact(glpWorkflowDir, 'schema.yaml');

for (const file of glpSchemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) continue;
        const isReference = doc.workflow_type === 'reference';
        const requiredMin = isReference ? 2 : 3;
        if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < requiredMin) {
            errors.push(`${rel}: GLP ${isReference ? 'reference' : 'core'} workflow requires multi-source legal_basis (≥${requiredMin} entries)`);
        }
        if (isReference && !doc.target_agent) {
            errors.push(`${rel}: GLP reference workflow requires target_agent field`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── GLP-specific validation: evidence models ────────────────────────────────
// v2.5.0: All glp-*.json must include glp_certification_authority, oecd_mad_applicable,
// study_director_id, msds_record_ref
const glpEvidenceFiles = evidenceFiles.filter(f => {
    return path.basename(f).startsWith('glp-') &&
           path.dirname(f).includes(path.join('domains', 'functional', 'glp'));
});

const REQUIRED_GLP_FIELDS = ['glp_certification_authority', 'oecd_mad_applicable', 'study_director_id', 'msds_record_ref'];

for (const file of glpEvidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const props = doc.properties || {};
        for (const field of REQUIRED_GLP_FIELDS) {
            if (!props[field]) {
                errors.push(`${rel}: missing GLP required field '${field}'`);
            }
        }
        const legalBasis = props.legal_basis;
        if (legalBasis && (!legalBasis.minItems || legalBasis.minItems < 3)) {
            errors.push(`${rel}: GLP legal_basis must have minItems ≥3`);
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}

// ── GCP-specific validation: workflows ───────────────────────────────────────
// v2.6.0: GCP workflows require multi-source legal_basis (≥3 core, ≥2 reference)
const gcpWorkflowDir = path.join(workflowDir, 'domains', 'functional', 'gcp');
const gcpSchemaFiles = walkDirExact(gcpWorkflowDir, 'schema.yaml');

for (const file of gcpSchemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) continue;
        const isReference = doc.workflow_type === 'reference';
        const requiredMin = isReference ? 2 : 3;
        if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < requiredMin) {
            errors.push(`${rel}: GCP ${isReference ? 'reference' : 'core'} workflow requires multi-source legal_basis (≥${requiredMin} entries)`);
        }
        if (isReference && !doc.target_agent) {
            errors.push(`${rel}: GCP reference workflow requires target_agent field`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── GCP-specific validation: evidence models ────────────────────────────────
// v2.6.0: All gcp-*.json must include irb_approval_ref, ich_e6_compliance,
// protocol_ref, site_id
const gcpEvidenceFiles = evidenceFiles.filter(f => {
    return path.basename(f).startsWith('gcp-') &&
           path.dirname(f).includes(path.join('domains', 'functional', 'gcp'));
});

const REQUIRED_GCP_FIELDS = ['irb_approval_ref', 'ich_e6_compliance', 'protocol_ref', 'site_id'];

for (const file of gcpEvidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const props = doc.properties || {};
        for (const field of REQUIRED_GCP_FIELDS) {
            if (!props[field]) {
                errors.push(`${rel}: missing GCP required field '${field}'`);
            }
        }
        const legalBasis = props.legal_basis;
        if (legalBasis && (!legalBasis.minItems || legalBasis.minItems < 3)) {
            errors.push(`${rel}: GCP legal_basis must have minItems ≥3`);
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}

// ── GVP-specific validation: workflows ───────────────────────────────────────
// v2.7.0: GVP workflows require multi-source legal_basis (≥3 core, ≥2 reference)
const gvpWorkflowDir = path.join(workflowDir, 'domains', 'functional', 'gvp');
const gvpSchemaFiles = walkDirExact(gvpWorkflowDir, 'schema.yaml');

for (const file of gvpSchemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) continue;
        const isReference = doc.workflow_type === 'reference';
        const requiredMin = isReference ? 2 : 3;
        if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < requiredMin) {
            errors.push(`${rel}: GVP ${isReference ? 'reference' : 'core'} workflow requires multi-source legal_basis (≥${requiredMin} entries)`);
        }
        if (isReference && !doc.target_agent) {
            errors.push(`${rel}: GVP reference workflow requires target_agent field`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── GVP-specific validation: evidence models ────────────────────────────────
// v2.7.0: All gvp-*.json must include ich_e2_compliance, pbrer_cycle_ref, product_id, rmp_version_ref
const gvpEvidenceFiles = evidenceFiles.filter(f => {
    return path.basename(f).startsWith('gvp-') &&
           path.dirname(f).includes(path.join('domains', 'functional', 'gvp'));
});

const REQUIRED_GVP_FIELDS = ['ich_e2_compliance', 'pbrer_cycle_ref', 'product_id', 'rmp_version_ref'];

for (const file of gvpEvidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const props = doc.properties || {};
        for (const field of REQUIRED_GVP_FIELDS) {
            if (!props[field]) {
                errors.push(`${rel}: missing GVP required field '${field}'`);
            }
        }
        const legalBasis = props.legal_basis;
        if (legalBasis && (!legalBasis.minItems || legalBasis.minItems < 3)) {
            errors.push(`${rel}: GVP legal_basis must have minItems ≥3`);
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}

// ── ehsconst-specific validation: workflows ─────────────────────────────────
// v2.8.0: Construction Safety workflows require multi-source legal_basis (≥3 core, ≥2 reference)
const ehsconstWorkflowDir = path.join(workflowDir, 'domains', 'industry', 'ehsconst');
const ehsconstSchemaFiles = walkDirExact(ehsconstWorkflowDir, 'schema.yaml');

for (const file of ehsconstSchemaFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = yaml.load(content) as any;
        if (!doc) continue;
        const isReference = doc.workflow_type === 'reference';
        const requiredMin = isReference ? 2 : 3;
        if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < requiredMin) {
            errors.push(`${rel}: ehsconst ${isReference ? 'reference' : 'core'} workflow requires multi-source legal_basis (≥${requiredMin} entries)`);
        }
        if (isReference && !doc.target_agent) {
            errors.push(`${rel}: ehsconst reference workflow requires target_agent field`);
        }
    } catch (e: any) {
        errors.push(`${rel}: YAML parsing error - ${e.message}`);
    }
}

// ── ehsconst-specific validation: evidence models ───────────────────────────
// v2.8.0: All ehsconst-*.json must include sapa_article_12_compliance, project_id,
// contractor_tier, safety_officer_in_charge
const ehsconstEvidenceFiles = evidenceFiles.filter(f => {
    return path.basename(f).startsWith('ehsconst-') &&
           path.dirname(f).includes(path.join('domains', 'industry', 'ehsconst'));
});

const REQUIRED_EHSCONST_FIELDS = ['sapa_article_12_compliance', 'project_id', 'contractor_tier', 'safety_officer_in_charge'];

for (const file of ehsconstEvidenceFiles) {
    totalChecked++;
    const content = fs.readFileSync(file, 'utf-8');
    const rel = relPath(file);
    try {
        const doc = JSON.parse(content);
        const props = doc.properties || {};
        for (const field of REQUIRED_EHSCONST_FIELDS) {
            if (!props[field]) {
                errors.push(`${rel}: missing ehsconst required field '${field}'`);
            }
        }
        const legalBasis = props.legal_basis;
        if (legalBasis && (!legalBasis.minItems || legalBasis.minItems < 3)) {
            errors.push(`${rel}: ehsconst legal_basis must have minItems ≥3`);
        }
    } catch (e: any) {
        errors.push(`${rel}: JSON parsing error - ${e.message}`);
    }
}

// ── gasterm + powergen validation (v2.9.0) ───────────────────────────────────
function validateDomainWorkflow(domainName: string, requiredMin: number = 3): string[] {
    const domainDir = path.join(workflowDir, 'domains', domainName);
    const schemaFiles = walkDirExact(domainDir, 'schema.yaml');
    const errs: string[] = [];
    for (const file of schemaFiles) {
        totalChecked++;
        const content = fs.readFileSync(file, 'utf-8');
        const rel = relPath(file);
        try {
            const doc = yaml.load(content) as any;
            if (!doc) continue;
            const isReference = doc.workflow_type === 'reference';
            const reqMin = isReference ? 2 : requiredMin;
            if (!Array.isArray(doc.legal_basis) || doc.legal_basis.length < reqMin) {
                errs.push(`${rel}: ${domainName} workflow requires multi-source legal_basis (≥${reqMin})`);
            }
            if (isReference && !doc.target_agent) {
                errs.push(`${rel}: ${domainName} reference workflow requires target_agent`);
            }
        } catch (e: any) {
            errs.push(`${rel}: YAML parsing error - ${e.message}`);
        }
    }
    return errs;
}

function validateDomainEvidence(domainName: string, requiredFields: string[], minLegalBasis: number = 3): { files: string[], errs: string[] } {
    const domainEvidence = evidenceFiles.filter(f => {
        return path.dirname(f).includes(path.join('domains', 'functional', domainName)) || path.dirname(f).includes(path.join('domains', 'industry', domainName));
    });
    const errs: string[] = [];
    for (const file of domainEvidence) {
        totalChecked++;
        const content = fs.readFileSync(file, 'utf-8');
        const rel = relPath(file);
        try {
            const doc = JSON.parse(content);
            const props = doc.properties || {};
            for (const field of requiredFields) {
                if (!props[field]) {
                    errs.push(`${rel}: missing ${domainName} required field '${field}'`);
                }
            }
            const legalBasis = props.legal_basis;
            if (legalBasis && (!legalBasis.minItems || legalBasis.minItems < minLegalBasis)) {
                errs.push(`${rel}: ${domainName} legal_basis must have minItems ≥${minLegalBasis}`);
            }
        } catch (e: any) {
            errs.push(`${rel}: JSON parsing error - ${e.message}`);
        }
    }
    return { files: domainEvidence, errs };
}

// gasterm validation
const gastermSchemaFiles = walkDirExact(path.join(workflowDir, 'domains', 'industry', 'gasterm'), 'schema.yaml');
const gastermWorkflowErrs = validateDomainWorkflow('gasterm');
errors.push(...gastermWorkflowErrs);
const gastermEvidenceResult = validateDomainEvidence('gasterm', ['facility_type', 'kgs_inspection_status', 'psm_applicable', 'gas_type']);
errors.push(...gastermEvidenceResult.errs);

// powergen validation
const powergenSchemaFiles = walkDirExact(path.join(workflowDir, 'domains', 'industry', 'powergen'), 'schema.yaml');
const powergenWorkflowErrs = validateDomainWorkflow('powergen');
errors.push(...powergenWorkflowErrs);
const powergenEvidenceResult = validateDomainEvidence('powergen', ['plant_type', 'kesa_inspection_status', 'voltage_class']);
errors.push(...powergenEvidenceResult.errs);

// ehschem validation
const ehschemSchemaFiles = walkDirExact(path.join(workflowDir, 'domains', 'industry', 'ehschem'), 'schema.yaml');
const ehschemWorkflowErrs = validateDomainWorkflow('ehschem');
errors.push(...ehschemWorkflowErrs);
const ehschemEvidenceResult = validateDomainEvidence('ehschem', ['plant_category', 'psm_applicable', 'chemical_category']);
errors.push(...ehschemEvidenceResult.errs);

// meddevice validation
const meddeviceSchemaFiles = walkDirExact(path.join(workflowDir, 'domains', 'industry', 'meddevice'), 'schema.yaml');
const meddeviceWorkflowErrs = validateDomainWorkflow('meddevice');
errors.push(...meddeviceWorkflowErrs);
const meddeviceEvidenceResult = validateDomainEvidence('meddevice', ['device_class', 'kgmp_certification_status', 'iso_13485_compliance']);
errors.push(...meddeviceEvidenceResult.errs);

// ── Cross-domain reference integrity (v3.1.0) ──────────────────────────────
// Validates that cross-domain reference fields in evidence models point to
// domains that actually exist in the 2-Tier folder structure.
console.log(`${CYAN}--- Cross-domain reference integrity ---${RESET}`);

// Define known cross-domain reference fields and their target domains
const CROSS_DOMAIN_REFS: Array<{ field: string; fromDomain: string; fromTier: string; toDomain: string; toTier: string }> = [
    { field: 'batch_disposition_approved_ref', fromDomain: 'gdp', fromTier: 'functional', toDomain: 'gmp', toTier: 'functional' },
    { field: 'msds_record_ref', fromDomain: 'glp', fromTier: 'functional', toDomain: 'msds', toTier: 'functional' },
    { field: 'msds_record_ref', fromDomain: 'gasterm', fromTier: 'industry', toDomain: 'msds', toTier: 'functional' },
    { field: 'msds_record_ref', fromDomain: 'ehschem', fromTier: 'industry', toDomain: 'msds', toTier: 'functional' },
    { field: 'psm_psi_ref', fromDomain: 'ehschem', fromTier: 'industry', toDomain: 'psm', toTier: 'functional' },
    { field: 'psm_applicable', fromDomain: 'gasterm', fromTier: 'industry', toDomain: 'psm', toTier: 'functional' },
];

for (const ref of CROSS_DOMAIN_REFS) {
    totalChecked++;
    // Verify source domain exists
    const sourceDir = path.join(ROOT, 'evidence-models', 'domains', ref.fromTier, ref.fromDomain);
    if (!fs.existsSync(sourceDir)) {
        errors.push(`cross-ref: source domain ${ref.fromTier}/${ref.fromDomain} missing for field '${ref.field}'`);
        continue;
    }
    // Verify target domain exists
    const targetDir = path.join(ROOT, 'evidence-models', 'domains', ref.toTier, ref.toDomain);
    if (!fs.existsSync(targetDir)) {
        errors.push(`cross-ref: target domain ${ref.toTier}/${ref.toDomain} missing for field '${ref.field}' (from ${ref.fromTier}/${ref.fromDomain})`);
    }
}

// Validate uses_functional_services in industry workflow schemas
const industryWorkflowDir = path.join(workflowDir, 'domains', 'industry');
if (fs.existsSync(industryWorkflowDir)) {
    for (const indDomain of fs.readdirSync(industryWorkflowDir, { withFileTypes: true })) {
        if (!indDomain.isDirectory()) continue;
        const indDir = path.join(industryWorkflowDir, indDomain.name);
        for (const wfDir of fs.readdirSync(indDir, { withFileTypes: true })) {
            if (!wfDir.isDirectory()) continue;
            const schemaPath = path.join(indDir, wfDir.name, 'schema.yaml');
            if (!fs.existsSync(schemaPath)) continue;
            totalChecked++;
            try {
                const doc = yaml.load(fs.readFileSync(schemaPath, 'utf-8')) as any;
                if (doc?.uses_functional_services) {
                    const services = Array.isArray(doc.uses_functional_services) ? doc.uses_functional_services : [];
                    for (const svc of services) {
                        // Check format: "functional/psm" or "emergency"
                        if (svc.includes('/')) {
                            const [tier, domain] = svc.split('/');
                            const svcDir = path.join(workflowDir, 'domains', tier, domain);
                            if (!fs.existsSync(svcDir)) {
                                errors.push(`${indDomain.name}/${wfDir.name}/schema.yaml: uses_functional_services references non-existent '${svc}'`);
                            }
                        }
                    }
                }
            } catch { /* skip */ }
        }
    }
}

// Validate applicable_industries in PSM workflow schemas
const psmWfDir = path.join(workflowDir, 'domains', 'functional', 'psm');
if (fs.existsSync(psmWfDir)) {
    for (const wfDir of fs.readdirSync(psmWfDir, { withFileTypes: true })) {
        if (!wfDir.isDirectory()) continue;
        const schemaPath = path.join(psmWfDir, wfDir.name, 'schema.yaml');
        if (!fs.existsSync(schemaPath)) continue;
        totalChecked++;
        try {
            const doc = yaml.load(fs.readFileSync(schemaPath, 'utf-8')) as any;
            if (doc?.applicable_industries) {
                const industries = Array.isArray(doc.applicable_industries) ? doc.applicable_industries : [];
                for (const ind of industries) {
                    // Check if a corresponding industry domain exists
                    const knownIndustries = ['chemical', 'gas_terminal', 'power_generation', 'construction', 'medical_device'];
                    if (!knownIndustries.includes(ind)) {
                        errors.push(`psm/${wfDir.name}/schema.yaml: applicable_industries references unknown industry '${ind}'`);
                    }
                }
            }
        } catch { /* skip */ }
    }
}

console.log(`Files checked : ${totalChecked}`);
console.log(`  workflows/        : ${schemaFiles.length} schema.yaml file(s) (${gmpSchemaFiles.length} GMP, ${msdsSchemaFiles.length} MSDS, ${gdpSchemaFiles.length} GDP, ${glpSchemaFiles.length} GLP, ${gcpSchemaFiles.length} GCP, ${gvpSchemaFiles.length} GVP, ${ehsconstSchemaFiles.length} ehsconst, ${gastermSchemaFiles.length} gasterm, ${powergenSchemaFiles.length} powergen, ${ehschemSchemaFiles.length} ehschem, ${meddeviceSchemaFiles.length} meddevice)`);
console.log(`  regulations/      : ${regFiles.length} .yaml file(s)`);
console.log(`  evidence-models/  : ${evidenceFiles.length} .json file(s) (${gmpEvidenceFiles.length} GMP, ${msdsEvidenceFiles.length} MSDS, ${gdpEvidenceFiles.length} GDP, ${glpEvidenceFiles.length} GLP, ${gcpEvidenceFiles.length} GCP, ${gvpEvidenceFiles.length} GVP, ${ehsconstEvidenceFiles.length} ehsconst, ${gastermEvidenceResult.files.length} gasterm, ${powergenEvidenceResult.files.length} powergen, ${ehschemEvidenceResult.files.length} ehschem, ${meddeviceEvidenceResult.files.length} meddevice)\n`);

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
