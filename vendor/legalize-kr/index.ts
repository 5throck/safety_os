#!/usr/bin/env bun
/**
 * legalize_kr MCP Server - STUB
 *
 * This is a minimal stub server for MCP configuration.
 * Full implementation pending - see docs/superpowers/specs/2026-06-05-mcp-server-design.md
 *
 * This server analyzes legal structure from .cache/legalize-kr/ git repository.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'legalize_kr', version: '0.1.0-stub' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'parse_law_structure',
      description: 'Parse law structure (STUB - not implemented)',
      inputSchema: {
        type: 'object',
        properties: {
          lawId: { type: 'string', description: 'Law ID (e.g., 민법)' }
        },
        required: ['lawId']
      }
    },
    {
      name: 'find_references',
      description: 'Find references to this law (STUB - not implemented)',
      inputSchema: {
        type: 'object',
        properties: {
          lawId: { type: 'string', description: 'Law ID to search for' }
        },
        required: ['lawId']
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
  console.error('[legalize_kr MCP] Starting stub server...');
  console.error('[legalize_kr MCP] This server is not yet fully implemented');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[legalize_kr MCP] Stub server started - tools will return stub messages');
}

main().catch((error) => {
  console.error('[legalize_kr MCP] Failed to start server:', error);
  process.exit(1);
});