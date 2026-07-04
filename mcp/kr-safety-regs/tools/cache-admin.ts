import { MCPCache } from '../../../scripts/lib/mcp-cache.js';

const cache = new MCPCache();

export async function invalidateCache(pattern?: string): Promise<object> {
  if (pattern) {
    await cache.invalidate(pattern);
    return { invalidated: pattern };
  }
  for (const prefix of ['osha:', 'sapa:', 'industry:']) {
    await cache.invalidate(prefix);
  }
  return { invalidated: 'all' };
}
