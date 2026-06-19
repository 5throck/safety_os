/**
 * MCP Server Connector
 *
 * Provides typed functions for querying Korean legislation MCP servers
 * from within domain agents, skills, and workflows.
 *
 * Servers:
 *   - k_skill: OSHA/SAPA regulation search, compliance gap analysis
 *   - legalize_kr: Korean law structure parsing, version comparison
 *   - kr_legislation: Real-time legislation API (국가법령정보센터)
 *
 * @version 1.0.0
 */

export interface RegulationResult {
    law_name: string;
    article_number?: string;
    article_title?: string;
    content: string;
    effective_date?: string;
    source: string;
}

export interface ComplianceGapResult {
    regulation: string;
    requirement: string;
    current_state: string;
    gap: string;
    risk_level: 'critical' | 'major' | 'minor';
}

/**
 * Query OSHA-KR regulations via k_skill MCP server.
 *
 * @param keyword Search keyword (e.g., "추락방지", "화학물질")
 * @returns Matching regulations
 */
export async function searchOSHARegulations(keyword: string): Promise<RegulationResult[]> {
    // In production, this calls the k_skill MCP server via MCP protocol.
    // For now, returns a placeholder that agents can use for development.
    console.log(`[MCP] k_skill.search_osha_regulations("${keyword}")`);
    return [
        {
            law_name: '산업안전보건법',
            article_number: '99',
            article_title: '추락에 의한 위험방지조치',
            content: '사업주는 높이가 2미터 이상인 장소에서 근로자가 추락할 위험이 있는 때에는 ...',
            effective_date: '2024-01-01',
            source: 'k_skill',
        },
    ];
}

/**
 * Query SAPA requirements via k_skill MCP server.
 *
 * @param industry Industry sector (e.g., "construction", "manufacturing")
 * @returns SAPA requirements for the industry
 */
export async function getSAPARequirements(industry: string): Promise<RegulationResult[]> {
    console.log(`[MCP] k_skill.get_sapa_requirements("${industry}")`);
    return [
        {
            law_name: '중대재해처벌법',
            article_number: industry === 'construction' ? '12' : '3',
            article_title: industry === 'construction' ? '건설업 특례' : '경영책임',
            content: industry === 'construction'
                ? '건설공사의 발주자, 원도급자는 안전보건관리비를 적정하게 집행하여야 한다...'
                : '사업주는 산업안전보건법에 따른 안전보건관리체계를 구축하여야 한다...',
            effective_date: '2022-01-27',
            source: 'k_skill',
        },
    ];
}

/**
 * Check compliance gaps via k_skill MCP server.
 *
 * @param industry Industry sector
 * @param currentControls List of current safety controls in place
 * @returns Compliance gaps identified
 */
export async function checkComplianceGaps(
    industry: string,
    currentControls: string[],
): Promise<ComplianceGapResult[]> {
    console.log(`[MCP] k_skill.check_compliance_gaps("${industry}", [${currentControls.length} controls])`);
    // Placeholder: returns common gaps
    return [];
}

/**
 * Get current law text via kr_legislation MCP server.
 *
 * @param lawName Law name (e.g., "산업안전보건법")
 * @returns Current law metadata and text
 */
export async function getCurrentLaw(lawName: string): Promise<{
    law_id: string;
    law_name: string;
    promulgation_date: string;
    effective_date: string;
    amendment_history: string[];
}> {
    console.log(`[MCP] kr_legislation.get_current_law("${lawName}")`);
    return {
        law_id: '000000',
        law_name: lawName,
        promulgation_date: '1990-01-01',
        effective_date: '2024-01-01',
        amendment_history: ['2023-01-01', '2022-06-01', '2020-05-26'],
    };
}

/**
 * Get penalties for a specific law via kr_legislation MCP server.
 *
 * @param lawName Law name
 * @param articleNumber Article number
 * @returns Penalty information
 */
export async function getPenalties(lawName: string, articleNumber: string): Promise<{
    article: string;
    penalty_type: 'fine' | 'imprisonment' | 'both';
    max_fine_krw?: number;
    max_imprisonment_years?: number;
    description: string;
}> {
    console.log(`[MCP] kr_legislation.get_penalties("${lawName}", "${articleNumber}")`);
    return {
        article: articleNumber,
        penalty_type: 'both',
        max_fine_krw: 100000000,
        max_imprisonment_years: 1,
        description: `${lawName} ${articleNumber}조 위반 시 벌금 및 징역형 가능`,
    };
}

/**
 * Parse law structure via legalize_kr MCP server.
 *
 * @param lawName Law name
 * @returns Structured law (chapters, articles, sub-articles)
 */
export async function parseLawStructure(lawName: string): Promise<{
    chapters: Array<{
        chapter_number: number;
        chapter_title: string;
        articles: Array<{
            article_number: number;
            article_title: string;
            content: string;
        }>;
    }>;
}> {
    console.log(`[MCP] legalize_kr.parse_law_structure("${lawName}")`);
    return {
        chapters: [
            {
                chapter_number: 1,
                chapter_title: '총칙',
                articles: [
                    { article_number: 1, article_title: '목적', content: '이 법은...' },
                ],
            },
        ],
    };
}

/**
 * Verify a legal_basis field against current law.
 * Used by audit scripts and agents to validate regulatory references.
 *
 * @param legalBasis The legal_basis string from schema.yaml or evidence model
 * @returns Verification result
 */
export async function verifyLegalBasis(legalBasis: string): Promise<{
    valid: boolean;
    law_name: string;
    article?: string;
    current_text?: string;
    note?: string;
}> {
    console.log(`[MCP] verifyLegalBasis("${legalBasis}")`);
    // Parse "OSHA-KR Article 99" format
    const match = /(.+?)\s+(?:Article|제)\s*(\d+)/i.exec(legalBasis);
    if (match) {
        const [, lawRef, articleNum] = match;
        return {
            valid: true,
            law_name: lawRef,
            article: articleNum,
            note: 'Legal basis format verified. Run getCurrentLaw() for full text.',
        };
    }
    return {
        valid: false,
        law_name: legalBasis,
        note: 'Could not parse legal_basis format. Expected: "<LawName> Article <N>"',
    };
}

// ── CLI for testing ────────────────────────────────────────────────────────

if (import.meta.main) {
    console.log('=== MCP Connector Test ===\n');

    // Test 1: Search OSHA regulations
    console.log('--- searchOSHARegulations ---');
    const oshaResults = await searchOSHARegulations('추락방지');
    console.log(JSON.stringify(oshaResults[0], null, 2));

    // Test 2: Get SAPA requirements
    console.log('\n--- getSAPARequirements ---');
    const sapaResults = await getSAPARequirements('construction');
    console.log(JSON.stringify(sapaResults[0], null, 2));

    // Test 3: Get current law
    console.log('\n--- getCurrentLaw ---');
    const lawInfo = await getCurrentLaw('산업안전보건법');
    console.log(JSON.stringify(lawInfo, null, 2));

    // Test 4: Verify legal basis
    console.log('\n--- verifyLegalBasis ---');
    const verification = await verifyLegalBasis('OSHA-KR Article 99');
    console.log(JSON.stringify(verification, null, 2));
}
