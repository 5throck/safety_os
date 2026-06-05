#!/usr/bin/env bun
/**
 * k_skill MCP Server - STUB
 *
 * This is a minimal stub server for MCP configuration.
 * Full implementation pending - see docs/superpowers/specs/2026-06-05-mcp-server-design.md
 *
 * This server provides Korean OSHA and SAPA regulations search with 24-hour caching.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'k_skill', version: '0.1.0-stub' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'search_osha_regulations',
      description: 'Search OSHA regulations (STUB - not implemented)',
      inputSchema: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: 'Search keyword' }
        },
        required: ['keyword']
      }
    },
    {
      name: 'get_sapa_requirements',
      description: 'Get SAPA requirements (STUB - not implemented)',
      inputSchema: {
        type: 'object',
        properties: {
          industry: { type: 'string', description: 'Industry type (optional)' }
        }
      }
    }
  ]
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  return {
    content: [{
      type: 'text',
      text: `Tool "${name}" is a stub - full implementation pending. See docs/superpowers/specs/2026-06-05-mcp-server-design.md`
    }]
  };
});

async function main() {
  console.error('[k_skill MCP] Starting stub server...');
  console.error('[k_skill MCP] This server is not yet fully implemented');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[k_skill MCP] Stub server started - tools will return stub messages');
}

main().catch((error) => {
  console.error('[k_skill MCP] Failed to start server:', error);
  process.exit(1);
});