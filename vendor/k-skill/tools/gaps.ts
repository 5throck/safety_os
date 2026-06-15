import { MCPCache } from '../../../scripts/lib/mcp-cache.js';
import { searchOshaRegulations } from './search-osha.js';

const cache = new MCPCache();

export async function checkComplianceGaps(industry: string, currentControls: string[]): Promise<object> {
  const required = await searchOshaRegulations(industry);
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
