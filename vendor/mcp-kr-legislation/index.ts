#!/usr/bin/env bun
/**
 * mcp_kr_legislation MCP Server - STUB
 *
 * This is a minimal stub server for MCP configuration.
 * Full implementation pending - see docs/superpowers/specs/2026-06-05-mcp-server-design.md
 *
 * This server provides real-time law updates from National Law Information Center API.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'mcp_kr_legislation', version: '0.1.0-stub' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_current_law',
      description: 'Get current law list (STUB - not implemented)',
      inputSchema: {
        type: 'object',
        properties: {
          lawType: { type: 'string', description: 'Law type filter (optional)' }
        }
      }
    },
    {
      name: 'get_law_amendments',
      description: 'Get law amendment history (STUB - not implemented)',
      inputSchema: {
        type: 'object',
        properties: {
          lawId: { type: 'string', description: 'Law ID' },
          since: { type: 'string', description: 'Start date (ISO format, optional)' }
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
  console.error('[mcp_kr_legislation MCP] Starting stub server...');
  console.error('[mcp_kr_legislation MCP] This server is not yet fully implemented');

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error('[mcp_kr_legislation MCP] Stub server started - tools will return stub messages');
}

main().catch((error) => {
  console.error('[mcp_kr_legislation MCP] Failed to start server:', error);
  process.exit(1);
});