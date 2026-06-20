/**
 * Domain Configuration — config-driven audit validation
 *
 * Instead of hard-coding per-domain validation blocks in safety-audit.ts,
 * define all domains in this config array. The audit script iterates and
 * applies the same validation logic to each domain.
 *
 * @version 1.0.0
 */

export interface DomainConfig {
    name: string;
    tier: 'functional' | 'industry';
    required_evidence_fields: string[];
    min_legal_basis: number;       // for evidence models
    min_workflow_legal_basis: number;  // for core workflows
    description: string;
}

export const DOMAINS: DomainConfig[] = [
    // ── Functional domains ────────────────────────────────────────────
    {
        name: 'gmp',
        tier: 'industry',
        required_evidence_fields: ['e_signature', 'qrm_assessment', 'nomenclature', 'audit_trail'],
        min_legal_basis: 2,
        min_workflow_legal_basis: 2,
        description: 'Good Manufacturing Practice (pharma)',
    },
    {
        name: 'msds',
        tier: 'functional',
        required_evidence_fields: ['ghs_version'],
        min_legal_basis: 2,
        min_workflow_legal_basis: 3,
        description: 'Material Safety Data Sheet (chemical safety)',
    },
    {
        name: 'gdp',
        tier: 'industry',
        required_evidence_fields: ['gdp_certification_status', 'temperature_condition', 'batch_disposition_approved_ref'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Good Distribution Practice (pharma logistics)',
    },
    {
        name: 'glp',
        tier: 'industry',
        required_evidence_fields: ['glp_certification_authority', 'oecd_mad_applicable', 'study_director_id'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Good Laboratory Practice (non-clinical)',
    },
    {
        name: 'gcp',
        tier: 'industry',
        required_evidence_fields: ['irb_approval_ref', 'ich_e6_compliance', 'protocol_ref'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Good Clinical Practice (clinical trials)',
    },
    {
        name: 'gvp',
        tier: 'industry',
        required_evidence_fields: ['ich_e2_compliance', 'pbrer_cycle_ref', 'product_id'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Good Pharmacovigilance Practice (post-market)',
    },
    {
        name: 'psm',
        tier: 'functional',
        required_evidence_fields: [],
        min_legal_basis: 2,
        min_workflow_legal_basis: 2,
        description: 'Process Safety Management',
    },
    {
        name: 'training',
        tier: 'functional',
        required_evidence_fields: [],
        min_legal_basis: 2,
        min_workflow_legal_basis: 3,
        description: 'Safety Training Management (OSHA-KR Art 13, 29, 31, 32, 114 + SAPA)',
    },

    // ── Industry domains ──────────────────────────────────────────────
    {
        name: 'ehsconst',
        tier: 'industry',
        required_evidence_fields: ['sapa_article_12_compliance', 'project_id', 'contractor_tier'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Construction Safety',
    },
    {
        name: 'gasterm',
        tier: 'industry',
        required_evidence_fields: ['facility_type', 'kgs_inspection_status', 'psm_applicable', 'gas_type'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Gas Terminal Safety (LNG/LPG/hydrogen)',
    },
    {
        name: 'powergen',
        tier: 'industry',
        required_evidence_fields: ['plant_type', 'kesa_inspection_status', 'voltage_class'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Power Generation Safety (nuclear excluded)',
    },
    {
        name: 'ehschem',
        tier: 'industry',
        required_evidence_fields: ['plant_category', 'psm_applicable', 'chemical_category'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Chemical Plant Safety (refining/petrochemical/specialty)',
    },
    {
        name: 'meddevice',
        tier: 'industry',
        required_evidence_fields: ['device_class', 'kgmp_certification_status', 'iso_13485_compliance'],
        min_legal_basis: 3,
        min_workflow_legal_basis: 3,
        description: 'Medical Device Safety (KGMP-MD + ISO 13485 + ISO 14971)',
    },
];

/**
 * Known cross-domain reference fields and their target domains.
 */
export const CROSS_DOMAIN_REFS: Array<{
    field: string;
    fromDomain: string;
    fromTier: string;
    toDomain: string;
    toTier: string;
}> = [
    { field: 'batch_disposition_approved_ref', fromDomain: 'gdp', fromTier: 'industry', toDomain: 'gmp', toTier: 'industry' },
    { field: 'msds_record_ref', fromDomain: 'glp', fromTier: 'industry', toDomain: 'msds', toTier: 'functional' },
    { field: 'msds_record_ref', fromDomain: 'gasterm', fromTier: 'industry', toDomain: 'msds', toTier: 'functional' },
    { field: 'msds_record_ref', fromDomain: 'ehschem', fromTier: 'industry', toDomain: 'msds', toTier: 'functional' },
    { field: 'psm_psi_ref', fromDomain: 'ehschem', fromTier: 'industry', toDomain: 'psm', toTier: 'functional' },
    { field: 'psm_applicable', fromDomain: 'gasterm', fromTier: 'industry', toDomain: 'psm', toTier: 'functional' },
];

/**
 * Known industries for applicable_industries validation.
 */
export const KNOWN_INDUSTRIES = [
    'chemical', 'gas_terminal', 'power_generation', 'construction', 'medical_device', 'pharma',
];
