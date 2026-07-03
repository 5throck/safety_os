#!/usr/bin/env bun
/**
 * mcp_kr_legislation MCP Server v1.0.0
 * Real-time Korean legislation via 국가법령정보센터 API.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createLogger } from '../shared/logger.js';
import { MCPValidationError } from '../shared/errors.js';
import { getCurrentLaw } from './tools/current-law.js';
import { getLawAmendments } from './tools/amendments.js';
import { interpretRegulation } from './tools/interpret.js';
import { getPenalties } from './tools/penalties.js';
import { getComplianceGuide } from './tools/guide.js';

const log = createLogger('mcp_kr_legislation');

const server = new Server(
  { name: 'mcp_kr_legislation', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    { name: 'get_current_law', description: '현행 법령 목록을 조회합니다.', inputSchema: { type: 'object', properties: { lawType: { type: 'string' } } } },
    { name: 'get_law_amendments', description: '법령 개정 이력을 조회합니다.', inputSchema: { type: 'object', properties: { lawId: { type: 'string' }, since: { type: 'string' } }, required: ['lawId'] } },
    { name: 'interpret_regulation', description: '법령 조문 원문을 조회합니다 ("<법령명> 제N조" 형식, 예: "산업안전보건법 제38조"). 행정해석·판례가 아닌 조문 원문만 반환합니다.', inputSchema: { type: 'object', properties: { articleId: { type: 'string' } }, required: ['articleId'] } },
    { name: 'get_penalties', description: '위반 시 처벌 내용을 조회합니다.', inputSchema: { type: 'object', properties: { articleId: { type: 'string' } }, required: ['articleId'] } },
    { name: 'get_compliance_guide', description: '주제어와 일치하는 법령명을 검색합니다 (law.go.kr은 체크리스트 API가 아닌 법령명 검색만 지원).', inputSchema: { type: 'object', properties: { topic: { type: 'string' } }, required: ['topic'] } },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  log.info(`Tool called: ${name}`);
  try {
    let result: unknown;
    switch (name) {
      case 'get_current_law': result = await getCurrentLaw(args?.lawType as string | undefined); break;
      case 'get_law_amendments':
        if (!args?.lawId) throw new MCPValidationError('lawId is required');
        result = await getLawAmendments(args.lawId as string, args.since as string | undefined); break;
      case 'interpret_regulation':
        if (!args?.articleId) throw new MCPValidationError('articleId is required');
        result = await interpretRegulation(args.articleId as string); break;
      case 'get_penalties':
        if (!args?.articleId) throw new MCPValidationError('articleId is required');
        result = await getPenalties(args.articleId as string); break;
      case 'get_compliance_guide':
        if (!args?.topic) throw new MCPValidationError('topic is required');
        result = await getComplianceGuide(args.topic as string); break;
      default: throw new MCPValidationError(`Unknown tool: ${name}`);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    log.error(`Tool ${name} failed: ${err}`);
    return { content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }], isError: true };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
log.info('mcp_kr_legislation MCP server started');
