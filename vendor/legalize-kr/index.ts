#!/usr/bin/env bun
/**
 * legalize_kr MCP Server v1.0.0
 * Korean law structure analysis from .cache/legalize-kr/ git repository.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createLogger } from '../shared/logger.js';
import { MCPValidationError } from '../shared/errors.js';
import { ensureLegalizeKRRepo } from './git-sync.js';
import { parseLawStructure } from './tools/parse.js';
import { findReferences } from './tools/references.js';
import { getLawMetadata } from './tools/metadata.js';
import { compareVersions } from './tools/compare.js';

const log = createLogger('legalize_kr');

ensureLegalizeKRRepo().catch(err => log.error(`Startup sync failed: ${err}`));

const server = new Server(
  { name: 'legalize_kr', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'parse_law_structure',
      description: '법령의 장→절→항 계층 구조를 분석합니다.',
      inputSchema: { type: 'object', properties: { lawId: { type: 'string', description: '법령명 (e.g., 산업안전보건법)' } }, required: ['lawId'] },
    },
    {
      name: 'find_references',
      description: '이 법령을 참조하는 다른 법령을 찾습니다.',
      inputSchema: { type: 'object', properties: { lawId: { type: 'string' } }, required: ['lawId'] },
    },
    {
      name: 'get_law_metadata',
      description: '법령 파일의 메타데이터(제정일, 개정이력)를 반환합니다.',
      inputSchema: { type: 'object', properties: { lawId: { type: 'string' } }, required: ['lawId'] },
    },
    {
      name: 'compare_versions',
      description: 'git diff를 활용하여 버전별 법령을 비교합니다.',
      inputSchema: {
        type: 'object',
        properties: { lawId: { type: 'string' }, sinceCommit: { type: 'string' } },
        required: ['lawId'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  log.info(`Tool called: ${name}`);

  try {
    let result: unknown;
    switch (name) {
      case 'parse_law_structure':
        if (!args?.lawId) throw new MCPValidationError('lawId is required');
        result = await parseLawStructure(args.lawId as string);
        break;
      case 'find_references':
        if (!args?.lawId) throw new MCPValidationError('lawId is required');
        result = await findReferences(args.lawId as string);
        break;
      case 'get_law_metadata':
        if (!args?.lawId) throw new MCPValidationError('lawId is required');
        result = await getLawMetadata(args.lawId as string);
        break;
      case 'compare_versions':
        if (!args?.lawId) throw new MCPValidationError('lawId is required');
        result = await compareVersions(args.lawId as string, args.sinceCommit as string | undefined);
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
log.info('legalize_kr MCP server started');
