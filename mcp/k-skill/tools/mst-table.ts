/**
 * MST (법령마스터번호) lookup table for k-skill tools.
 * Used by Tier 2 (full-law full-text search) in the hybrid search pipeline.
 *
 * Values verified live against law.go.kr's lawService.do endpoint.
 * Duplicated from kr-legislation/tools/amendments.ts to avoid cross-server imports
 * (k-skill and kr-legislation are independent MCP server processes).
 */

/** MST code → Korean statute name */
export const MST_TABLE: Record<string, string> = {
  '285379': '산업안전보건법',        // Occupational Safety and Health Act
  '228817': '중대재해처벌법',       // Serious Accidents Punishment Act
  '285367': '화학물질관리법',       // Chemicals Control Act
  '001783': '약사법',              // Pharmaceutical Affairs Act
  '009514': '의료기기법',          // Medical Device Act
  '001850': '고압가스 안전관리법',  // High-Pressure Gas Safety Control Act
  '001849': '액화석유가스의 안전관리 및 사업법', // LPG Safety Control and Business Act
  '013670': '수소경제 육성 및 수소안전관리에 관한 법률', // Hydrogen Economy Act
  '001854': '전기사업법',          // Electric Utility Act
  '013718': '전기안전관리법',       // Electrical Safety Control Act
  '001807': '건설기술 진흥법',     // Construction Technology Promotion Act
  '011857': '화학물질의 등록 및 평가 등에 관한 법률', // K-REACH (ARECS)
};

/**
 * Priority order for Tier 2 full-text search.
 * Core EHS statutes checked first; search stops after MAX_TIER2_LOOKUPS laws.
 */
export const TIER2_SEARCH_ORDER: string[] = [
  '285379', // 산업안전보건법 — primary EHS law
  '228817', // 중대재해처벌법 — SAPA
  '285367', // 화학물질관리법 — CCA
  '001850', // 고압가스 안전관리법 — gas safety
  '001854', // 전기사업법 — electrical safety
  '001783', // 약사법 — pharma
  '009514', // 의료기기법 — medical devices
];

/** Maximum number of full-law fetches per Tier 2 search call */
export const MAX_TIER2_LOOKUPS = 3;
