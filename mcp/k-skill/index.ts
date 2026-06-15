#!/usr/bin/env bun
/**
 * k_skill MCP Server v1.0.0
 * Korean OSHA / SAPA regulations search with 24-hour caching.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createLogger } from '../shared/logger.js';
import { MCPValidationError } from '../shared/errors.js';
import { searchOshaRegulations } from './tools/search-osha.js';
import { getSapaRequirements } from './tools/sapa.js';
import { listIndustryControls } from './tools/industry.js';
import { checkComplianceGaps } from './tools/gaps.js';
import { invalidateCache } from './tools/cache-admin.js';

const log = createLogger('k_skill');

const server = new Server(
  { name: 'k_skill', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_osha_regulations',
      description: '산업안전보건법 관련 규정을 키워드로 검색합니다.',
      inputSchema: { type: 'object', properties: { keyword: { type: 'string' } }, required: ['keyword'] },
    },
    {
      name: 'get_sapa_requirements',
      description: '중대재해처벌법 요건을 조회합니다.',
      inputSchema: { type: 'object', properties: { industry: { type: 'string' } } },
    },
    {
      name: 'list_industry_controls',
      description: '산업별 안전조치 목록을 반환합니다.',
      inputSchema: { type: 'object', properties: { industry: { type: 'string' } }, required: ['industry'] },
    },
    {
      name: 'check_compliance_gaps',
      description: '현재 안전조치와 법정 요건을 비교해 갭을 분석합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          industry: { type: 'string' },
          currentControls: { type: 'array', items: { type: 'string' } },
        },
        required: ['industry', 'currentControls'],
      },
    },
    {
      name: 'invalidate_cache',
      description: '캐시를 수동으로 초기화합니다.',
      inputSchema: { type: 'object', properties: { pattern: { type: 'string' } } },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  log.info(`Tool called: ${name}`);

  try {
    let result: unknown;
    switch (name) {
      case 'search_osha_regulations':
        if (!args?.keyword) throw new MCPValidationError('keyword is required');
        result = await searchOshaRegulations(args.keyword as string);
        break;
      case 'get_sapa_requirements':
        result = await getSapaRequirements(args?.industry as string | undefined);
        break;
      case 'list_industry_controls':
        if (!args?.industry) throw new MCPValidationError('industry is required');
        result = await listIndustryControls(args.industry as string);
        break;
      case 'check_compliance_gaps':
        if (!args?.industry || !args?.currentControls) throw new MCPValidationError('industry and currentControls are required');
        result = await checkComplianceGaps(args.industry as string, args.currentControls as string[]);
        break;
      case 'invalidate_cache':
        result = await invalidateCache(args?.pattern as string | undefined);
        break;
      default:
        throw new MCPValidationError(`Unknown tool: ${name}`);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    log.error(`Tool ${name} failed: ${err}`);
    return { content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
log.info('k_skill MCP server started');
