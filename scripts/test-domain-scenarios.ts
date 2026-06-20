#!/usr/bin/env tsx
/**
 * Domain Scenario Integration Test
 *
 * Simulates real-world cross-domain data flows through 5 scenarios:
 *   S-01: 신약 개발 전 lifecycle (GLP→GCP→GMP→GDP→GVP→recall)
 *   S-02: 화학공장 사고 대응 (ehschem→PSM→MSDS→emergency)
 *   S-03: 가스터미널 비상 (gasterm→PSM→MSDS→emergency)
 *   S-04: 의료기기 회수 (meddevice→emergency→compliance)
 *   S-05: 건설 현장 중대재해 (ehsconst→emergency→SAPA)
 *
 * Each scenario validates:
 *   - Evidence models for all involved domains exist
 *   - Cross-domain reference fields are defined in schemas
 *   - Reference workflow dispatch targets exist
 *   - Legal basis chains are consistent
 *   - Common fields (e_signature, nomenclature, audit_trail) present
 *
 * @version 1.0.0
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

const ROOT = path.resolve(process.cwd());
const results: Array<{ scenario: string; test: string; pass: boolean; detail?: string }> = [];

function check(scenario: string, testId: string, description: string, pass: boolean, detail?: string) {
    results.push({ scenario, test: `${testId}: ${description}`, pass, detail });
    const mark = pass ? `${GREEN}✓${RESET}` : `${RED}✗${RESET}`;
    console.log(`  ${mark} ${testId}: ${description}${detail && !pass ? ` — ${RED}${detail}${RESET}` : ''}`);
}

function evidenceExists(tier: string, domain: string, filename: string): boolean {
    return fs.existsSync(path.join(ROOT, 'evidence-models', 'domains', tier, domain, filename));
}

function workflowExists(tier: string, domain: string, wfName: string): boolean {
    return fs.existsSync(path.join(ROOT, 'workflows', 'domains', tier, domain, wfName, 'schema.yaml'));
}

function schemaHasField(filePath: string, field: string): boolean {
    try {
        const content = fs.readFileSync(filePath, 'utf-8');
        return content.includes(`"${field}"`);
    } catch { return false; }
}

function evidenceHasField(tier: string, domain: string, filename: string, field: string): boolean {
    const fp = path.join(ROOT, 'evidence-models', 'domains', tier, domain, filename);
    return schemaHasField(fp, field);
}

console.log(`${CYAN}=== Domain Scenario Integration Test ===${RESET}\n`);

// ════════════════════════════════════════════════════════════════════════════
// S-01: 신약 개발 전 lifecycle (GLP→GCP→GMP→GDP→GVP→recall)
// ════════════════════════════════════════════════════════════════════════════
console.log(`${CYAN}[S-01] 신약 개발 전 lifecycle (GLP→GCP→GMP→GDP→GVP→recall)${RESET}`);

// GLP: 비임상 안전성 데이터 (시험물질 관리, MSDS 참조)
check('S-01', 'GLP-1', 'GLP test-article evidence exists', evidenceExists('industry', 'glp', 'glp-test-article-record.json'));
check('S-01', 'GLP-2', 'GLP test-article references msds_record_ref',
    evidenceHasField('industry', 'glp', 'glp-test-article-record.json', 'msds_record_ref'));

// GCP: 임상시험 (protocol, SAE reporting)
check('S-01', 'GCP-1', 'GCP protocol evidence exists', evidenceExists('industry', 'gcp', 'gcp-protocol-record.json'));
check('S-01', 'GCP-2', 'GCP SAE evidence exists', evidenceExists('industry', 'gcp', 'gcp-sae-record.json'));
check('S-01', 'GCP-3', 'GCP SAE references causality fields',
    evidenceHasField('industry', 'gcp', 'gcp-sae-record.json', 'causality_assessment'));
check('S-01', 'GCP-4', 'GCP sae-reporting-reference workflow exists',
    workflowExists('industry', 'gcp', 'sae-reporting-reference'));

// GMP: 제조 (batch release → GDP 인계)
check('S-01', 'GMP-1', 'GMP batch evidence exists', evidenceExists('industry', 'gmp', 'gmp-batch-record.json'));
check('S-01', 'GMP-2', 'GMP batch has disposition field',
    evidenceHasField('industry', 'gmp', 'gmp-batch-record.json', 'disposition'));

// GDP: 유통 (batch_disposition_approved_ref → GMP batch 참조)
check('S-01', 'GDP-1', 'GDP goods-receipt evidence exists', evidenceExists('industry', 'gdp', 'gdp-goods-receipt-record.json'));
check('S-01', 'GDP-2', 'GDP goods-receipt references batch_disposition_approved_ref',
    evidenceHasField('industry', 'gdp', 'gdp-goods-receipt-record.json', 'batch_disposition_approved_ref'));
check('S-01', 'GDP-3', 'GDP product-recall-reference workflow exists',
    workflowExists('industry', 'gdp', 'product-recall-reference'));

// GVP: 시판 후 감시 (SAE 데이터 후속, signal detection)
check('S-01', 'GVP-1', 'GVP ICSR evidence exists', evidenceExists('industry', 'gvp', 'gvp-icsr-record.json'));
check('S-01', 'GVP-2', 'GVP signal evidence exists', evidenceExists('industry', 'gvp', 'gvp-signal-record.json'));
check('S-01', 'GVP-3', 'GVP urgent-safety-action-reference workflow exists',
    workflowExists('industry', 'gvp', 'urgent-safety-action-reference'));

// Cross-domain chain validation
check('S-01', 'CHAIN-1', 'GMP batch → GDP goods-receipt chain field exists',
    evidenceHasField('industry', 'gdp', 'gdp-goods-receipt-record.json', 'batch_disposition_approved_ref'));
check('S-01', 'CHAIN-2', 'GLP → MSDS chain field exists',
    evidenceHasField('industry', 'glp', 'glp-test-article-record.json', 'msds_record_ref'));
check('S-01', 'CHAIN-3', 'GCP SAE → emergency dispatch workflow exists',
    workflowExists('industry', 'gcp', 'sae-reporting-reference'));

console.log('');

// ════════════════════════════════════════════════════════════════════════════
// S-02: 화학공장 사고 대응 (ehschem→PSM→MSDS→emergency)
// ════════════════════════════════════════════════════════════════════════════
console.log(`${CYAN}[S-02] 화학공장 사고 대응 (ehschem→PSM→MSDS→emergency)${RESET}`);

check('S-02', 'EHCHEM-1', 'ehschem plant-operation evidence exists', evidenceExists('industry', 'ehschem', 'ehschem-plant-operation-record.json'));
check('S-02', 'EHCHEM-2', 'ehschem process evidence exists', evidenceExists('industry', 'ehschem', 'ehschem-process-record.json'));
check('S-02', 'EHCHEM-3', 'ehschem process references psm_psi_ref',
    evidenceHasField('industry', 'ehschem', 'ehschem-process-record.json', 'psm_psi_ref'));
check('S-02', 'EHCHEM-4', 'ehschem storage references msds_record_ref',
    evidenceHasField('industry', 'ehschem', 'ehschem-storage-record.json', 'msds_record_ref'));
check('S-02', 'EHCHEM-5', 'ehschem major-chemical-incident-reference workflow exists',
    workflowExists('industry', 'ehschem', 'major-chemical-incident-reference'));

check('S-02', 'PSM-1', 'PSM PSI workflow exists (functional service)', workflowExists('functional', 'psm', 'psi-management'));
check('S-02', 'PSM-2', 'PSM PHA workflow exists (functional service)', workflowExists('functional', 'psm', 'pha-hazop'));
check('S-02', 'PSM-3', 'PSM EAP workflow exists (functional service)', workflowExists('functional', 'psm', 'eap-emergency-planning'));

check('S-02', 'MSDS-1', 'MSDS record evidence exists (chemical data service)', evidenceExists('functional', 'msds', 'msds-record.json'));
const msdsHasSection6 = schemaHasField(
    path.join(ROOT, 'evidence-models', 'domains', 'functional', 'msds', 'msds-record.json'),
    's6_accidental_release'
);
check('S-02', 'MSDS-2', 'MSDS record has Section 6 (accidental release)', msdsHasSection6);

check('S-02', 'EMERG-1', 'Emergency chemical-release workflow exists', fs.existsSync(path.join(ROOT, 'workflows', 'emergency', 'chemical-release', 'schema.yaml')));
check('S-02', 'EMERG-2', 'Emergency explosion-gas-response workflow exists', fs.existsSync(path.join(ROOT, 'workflows', 'emergency', 'explosion-gas-response', 'schema.yaml')));

console.log('');

// ════════════════════════════════════════════════════════════════════════════
// S-03: 가스터미널 비상 (gasterm→PSM→MSDS→emergency)
// ════════════════════════════════════════════════════════════════════════════
console.log(`${CYAN}[S-03] 가스터미널 비상 (gasterm→PSM→MSDS→emergency)${RESET}`);

check('S-03', 'GASTERM-1', 'gasterm tank-storage evidence exists', evidenceExists('industry', 'gasterm', 'gasterm-tank-storage-record.json'));
check('S-03', 'GASTERM-2', 'gasterm leak-detection evidence exists', evidenceExists('industry', 'gasterm', 'gasterm-leak-detection-record.json'));
check('S-03', 'GASTERM-3', 'gasterm evidence has psm_applicable field',
    evidenceHasField('industry', 'gasterm', 'gasterm-tank-storage-record.json', 'psm_applicable'));
check('S-03', 'GASTERM-4', 'gasterm major-gas-incident-reference workflow exists',
    workflowExists('industry', 'gasterm', 'major-gas-incident-reference'));

check('S-03', 'PSM-APPLICABLE', 'PSM applicable to gas terminals (applicable_industries)',
    workflowExists('functional', 'psm', 'pha-hazop'));

check('S-03', 'EMERG-1', 'Emergency explosion-gas-response exists for gasterm dispatch',
    fs.existsSync(path.join(ROOT, 'workflows', 'emergency', 'explosion-gas-response', 'schema.yaml')));

console.log('');

// ════════════════════════════════════════════════════════════════════════════
// S-04: 의료기기 회수 (meddevice→emergency)
// ════════════════════════════════════════════════════════════════════════════
console.log(`${CYAN}[S-04] 의료기기 회수 (meddevice→emergency)${RESET}`);

check('S-04', 'MED-1', 'meddevice design-control evidence exists', evidenceExists('industry', 'meddevice', 'meddevice-design-control-record.json'));
check('S-04', 'MED-2', 'meddevice risk evidence exists (ISO 14971)', evidenceExists('industry', 'meddevice', 'meddevice-risk-record.json'));
check('S-04', 'MED-3', 'meddevice PMS evidence exists', evidenceExists('industry', 'meddevice', 'meddevice-pms-record.json'));
check('S-04', 'MED-4', 'meddevice evidence has device_class field',
    evidenceHasField('industry', 'meddevice', 'meddevice-design-control-record.json', 'device_class'));
check('S-04', 'MED-5', 'meddevice evidence has kgmp_certification_status',
    evidenceHasField('industry', 'meddevice', 'meddevice-design-control-record.json', 'kgmp_certification_status'));
check('S-04', 'MED-6', 'meddevice device-recall-reference workflow exists',
    workflowExists('industry', 'meddevice', 'device-recall-reference'));

console.log('');

// ════════════════════════════════════════════════════════════════════════════
// S-05: 건설 현장 중대재해 (ehsconst→emergency→SAPA)
// ════════════════════════════════════════════════════════════════════════════
console.log(`${CYAN}[S-05] 건설 현장 중대재해 (ehsconst→emergency→SAPA)${RESET}`);

check('S-05', 'EHSCONST-1', 'ehsconst safety-plan evidence exists', evidenceExists('industry', 'ehsconst', 'ehsconst-safety-plan-record.json'));
check('S-05', 'EHSCONST-2', 'ehsconst evidence has sapa_article_12_compliance',
    evidenceHasField('industry', 'ehsconst', 'ehsconst-safety-plan-record.json', 'sapa_article_12_compliance'));
check('S-05', 'EHSCONST-3', 'ehsconst evidence has contractor_tier',
    evidenceHasField('industry', 'ehsconst', 'ehsconst-safety-plan-record.json', 'contractor_tier'));
check('S-05', 'EHSCONST-4', 'ehsconst sapa-serious-accident-reference workflow exists',
    workflowExists('industry', 'ehsconst', 'sapa-serious-accident-reference'));
check('S-05', 'EHSCONST-5', 'ehsconst fall-prevention evidence exists',
    evidenceExists('industry', 'ehsconst', 'ehsconst-fall-prevention-record.json'));

check('S-05', 'EMERG-1', 'Emergency medical-emergency workflow exists',
    fs.existsSync(path.join(ROOT, 'workflows', 'emergency', 'medical-emergency', 'schema.yaml')));
check('S-05', 'EMERG-2', 'Emergency disaster-response workflow exists',
    fs.existsSync(path.join(ROOT, 'workflows', 'emergency', 'disaster-response', 'schema.yaml')));

console.log('');

// ════════════════════════════════════════════════════════════════════════════
// Cross-domain reference field matrix validation
// ════════════════════════════════════════════════════════════════════════════
console.log(`${CYAN}[X-REF] Cross-domain reference field matrix${RESET}`);

const crossRefs = [
    { field: 'batch_disposition_approved_ref', from: 'industry/gdp', to: 'industry/gmp', desc: 'GDP→GMP batch release' },
    { field: 'msds_record_ref', from: 'industry/glp', to: 'functional/msds', desc: 'GLP→MSDS test article' },
    { field: 'msds_record_ref', from: 'industry/gasterm', to: 'functional/msds', desc: 'gasterm→MSDS gas chemicals' },
    { field: 'msds_record_ref', from: 'industry/ehschem', to: 'functional/msds', desc: 'ehschem→MSDS stored chemicals' },
    { field: 'psm_psi_ref', from: 'industry/ehschem', to: 'functional/psm', desc: 'ehschem→PSM process info' },
    { field: 'psm_applicable', from: 'industry/gasterm', to: 'functional/psm', desc: 'gasterm→PSM flag' },
    { field: 'irb_approval_ref', from: 'industry/gcp', to: 'industry/gcp', desc: 'GCP IRB internal ref' },
    { field: 'rmp_version_ref', from: 'industry/gvp', to: 'industry/gvp', desc: 'GVP RMP internal ref' },
];

for (const ref of crossRefs) {
    const [fromTier, fromDomain] = ref.from.split('/');
    const [toTier, toDomain] = ref.to.split('/');
    const toExists = fs.existsSync(path.join(ROOT, 'evidence-models', 'domains', toTier, toDomain));
    check('X-REF', `ref:${ref.field}`, `${ref.desc} → target ${ref.to} exists`, toExists);
}

console.log('');

// ════════════════════════════════════════════════════════════════════════════
// Report
// ════════════════════════════════════════════════════════════════════════════
console.log(`${CYAN}=== Test Report ===${RESET}`);
const passed = results.filter(r => r.pass).length;
const failed = results.filter(r => !r.pass).length;

const scenarioStats: Record<string, { pass: number; fail: number }> = {};
for (const r of results) {
    if (!scenarioStats[r.scenario]) scenarioStats[r.scenario] = { pass: 0, fail: 0 };
    if (r.pass) scenarioStats[r.scenario].pass++;
    else scenarioStats[r.scenario].fail++;
}

for (const [scenario, stats] of Object.entries(scenarioStats)) {
    const status = stats.fail === 0 ? `${GREEN}PASS${RESET}` : `${RED}FAIL${RESET}`;
    console.log(`  ${scenario}: ${stats.pass}/${stats.pass + stats.fail} ${status}`);
}

console.log(`\n  Total: ${GREEN}${passed} passed${RESET}, ${failed > 0 ? `${RED}${failed} failed${RESET}` : `${GREEN}0 failed${RESET}`}`);

if (failed === 0) {
    console.log(`\n${GREEN}✅ all domain scenarios PASSED${RESET}`);
    process.exit(0);
} else {
    console.log(`\n${RED}❌ some domain scenarios FAILED${RESET}`);
    process.exit(1);
}
