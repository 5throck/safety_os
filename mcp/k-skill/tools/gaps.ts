import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { createLogger } from '../../shared/logger.js';
import { searchOshaRegulations } from './search-osha.js';

const cache = new MCPCache();
const log = createLogger('k_skill');

export async function checkComplianceGaps(industry: string, currentControls: string[]): Promise<object> {
  const required = await searchOshaRegulations(industry);

  if (required.length === 0) {
    log.info(`No regulatory requirements found for industry "${industry}" — returning honest empty gap analysis.`);
    return {
      industry,
      totalRequired: 0,
      gaps: [],
      compliant: true,
      note: 'No matching regulations found. Try a specific article number (e.g. "제36조"), law name (e.g. "산업안전보건법"), or Korean keyword (e.g. "위험성평가").',
    };
  }

  const gaps = required.filter(r =>
    !currentControls.some(c => c.includes(r.title) || r.title.includes(c))
  );
  return {
    industry,
    totalRequired: required.length,
    gaps: gaps.map(g => ({ article: g.articleNumber, requirement: g.title })),
    compliant: gaps.length === 0,
  };
}
