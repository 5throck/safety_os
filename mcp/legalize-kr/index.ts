#!/usr/bin/env bun
/**
 * legalize_kr MCP Server v1.1.0
 * Korean legal data analysis from legalize-kr git repositories.
 * - legalize-kr: 법령 구조 분석
 * - admrule-kr:  행정규칙 검색 (고용노동부 고시/예규/훈령)
 * - precedent-kr: 판례 검색 (GitHub Search API)
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { createLogger } from '../shared/logger.js';
import { MCPValidationError } from '../shared/errors.js';
import { ensureLegalizeKRRepo, ensureAdmruleKRRepo } from './git-sync.js';
import { parseLawStructure } from './tools/parse.js';
import { findReferences } from './tools/references.js';
import { getLawMetadata } from './tools/metadata.js';
import { compareVersions } from './tools/compare.js';
import { searchAdmrule } from './tools/admrule.js';
import { searchPrecedent } from './tools/precedent.js';

const log = createLogger('legalize_kr');

// Non-blocking startup sync for both repos
ensureLegalizeKRRepo().catch(err => log.error(`legalize-kr sync failed: ${err}`));
ensureAdmruleKRRepo().catch(err => log.error(`admrule-kr sync failed: ${err}`));

const server = new Server(
  { name: 'legalize_kr', version: '1.1.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'parse_law_structure',
      description: '법령의 장→절→조 계층 구조를 분석합니다.',
      inputSchema: {
        type: 'object',
        properties: { lawId: { type: 'string', description: '법령명 (예: 산업안전보건법)' } },
        required: ['lawId'],
      },
    },
    {
      name: 'find_references',
      description: '이 법령을 참조하는 다른 법령 목록을 반환합니다.',
      inputSchema: {
        type: 'object',
        properties: { lawId: { type: 'string' } },
        required: ['lawId'],
      },
    },
    {
      name: 'get_law_metadata',
      description: '법령 파일의 메타데이터 (MST 코드, 법령ID, 최종 커밋 등)를 반환합니다.',
      inputSchema: {
        type: 'object',
        properties: { lawId: { type: 'string' } },
        required: ['lawId'],
      },
    },
    {
      name: 'compare_versions',
      description: '법령 텍스트의 <개정/신설/삭제> 마커를 파싱해 특정 날짜 이후 변경된 조문 목록을 반환합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          lawId: { type: 'string', description: '법령명 (예: 산업안전보건법)' },
          sinceDate: { type: 'string', description: '기준일 (YYYY-MM-DD 또는 YYYY.MM.DD)' },
        },
        required: ['lawId'],
      },
    },
    {
      name: 'search_admrule',
      description: '행정규칙 저장소(admrule-kr)에서 키워드로 고시·예규·훈령을 검색합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: '검색어 (규칙명 또는 본문)' },
          agency: { type: 'string', description: '기관명 (기본값: 고용노동부)' },
          ruleType: { type: 'string', description: '규칙 종류: 고시 | 예규 | 훈령 | 공고 (미지정 시 전체)' },
        },
        required: ['keyword'],
      },
    },
    {
      name: 'search_precedent',
      description: '판례 저장소(precedent-kr)에서 GitHub Search API를 통해 키워드로 판례를 검색합니다.',
      inputSchema: {
        type: 'object',
        properties: {
          keyword: { type: 'string', description: '검색어 (사건명, 법원, 판례 내용)' },
          category: { type: 'string', description: '사건 유형: 민사 | 형사 | 일반행정 | 가사 | 세무 (미지정 시 전체)' },
        },
        required: ['keyword'],
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
        result = await compareVersions(args.lawId as string, (args.sinceDate ?? args.sinceCommit) as string | undefined);
        break;
      case 'search_admrule':
        if (!args?.keyword) throw new MCPValidationError('keyword is required');
        result = await searchAdmrule(
          args.keyword as string,
          (args.agency as string) || '고용노동부',
          args.ruleType as string | undefined,
        );
        break;
      case 'search_precedent':
        if (!args?.keyword) throw new MCPValidationError('keyword is required');
        result = await searchPrecedent(args.keyword as string, args.category as string | undefined);
        break;
      default:
        throw new MCPValidationError(`Unknown tool: ${name}`);
    }
    return { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }] };
  } catch (err) {
    log.error(`Tool ${name} failed: ${err}`);
    return {
      content: [{ type: 'text', text: `Error: ${err instanceof Error ? err.message : String(err)}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
log.info('legalize_kr MCP server started');
