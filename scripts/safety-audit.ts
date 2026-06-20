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
 * v4.0.0 (2026-06-20): Full generalization — removed all hardcoded per-domain blocks,
 *   replaced with config-driven loop over DOMAINS from domain-config.ts.
 *   CROSS_DOMAIN_REFS and KNOWN_INDUSTRIES imported from domain-config.ts.
 *   validateDomainWorkflow now accepts tier parameter.
 *
 * @version 4.0.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as yaml from 'js-yaml';
import { DOMAINS, CROSS_DOMAIN_REFS, KNOWN_INDUSTRIES } from './domain-config.ts';

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

const qrmSkillPath = path.join(ROOT, 'skills', 'domains', 'industry', 'gmp', 'qrm', 'SKILL.md');
if (fs.existsSync(qrmSkillPath)) {
    totalChecked++;
    const content = fs.readFileSync(qrmSkillPath, 'utf-8');
    if (!content.includes('risk-assessment-agent')) {
        errors.push('skills/domains/gmp/qrm/SKILL.md: missing risk-assessment-agent scope separation reference');
    }
}

// ── Domain-specific helper functions ─────────────────────────────────────────

function validateDomainWorkflow(domainName: string, requiredMin: number = 3, tier: string = 'industry'): string[] {
    const domainDir = path.join(workflowDir, 'domains', tier, domainName);
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

// ── Generalized per-domain validation (v4.0.0) ─────────────────────────────
// All domains validated uniformly from domain-config.ts DOMAINS array.

const domainCounts: Record<string, { workflows: number; evidence: number }> = {};

for (const domain of DOMAINS) {
    // Workflow validation (skip if domain uses non-array legal_basis format)
    const wfErrs = domain.skip_workflow_validation
        ? []
        : validateDomainWorkflow(domain.name, domain.min_workflow_legal_basis, domain.tier);
    errors.push(...wfErrs);

    // Evidence model validation
    const evResult = validateDomainEvidence(domain.name, domain.required_evidence_fields, domain.min_legal_basis);
    errors.push(...evResult.errs);

    // Count for report
    const wfDir = path.join(workflowDir, 'domains', domain.tier, domain.name);
    domainCounts[domain.name] = {
        workflows: walkDirExact(wfDir, 'schema.yaml').length,
        evidence: evResult.files.length,
    };
}

// ── PSM applicable_industries validation ─────────────────────────────────────
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
                    if (!KNOWN_INDUSTRIES.includes(ind)) {
                        errors.push(`psm/${wfDir.name}/schema.yaml: applicable_industries references unknown industry '${ind}'`);
                    }
                }
            }
        } catch { /* skip */ }
    }
}

// ── Cross-domain reference integrity (v3.1.0) ──────────────────────────────
// Validates that cross-domain reference fields in evidence models point to
// domains that actually exist in the 2-Tier folder structure.
console.log(`${CYAN}--- Cross-domain reference integrity ---${RESET}`);

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

// ── Final report ──────────────────────────────────────────────────────────────

const wfReport = Object.entries(domainCounts).map(([k, v]) => `${v.workflows} ${k}`).join(', ');
const evReport = Object.entries(domainCounts).map(([k, v]) => `${v.evidence} ${k}`).join(', ');
console.log(`Files checked : ${totalChecked}`);
console.log(`  workflows/        : ${schemaFiles.length} schema.yaml file(s) (${wfReport})`);
console.log(`  regulations/      : ${regFiles.length} .yaml file(s)`);
console.log(`  evidence-models/  : ${evidenceFiles.length} .json file(s) (${evReport})\n`);

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
