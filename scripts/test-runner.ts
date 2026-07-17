/**
 * test-runner.ts — Test Runner for TypeScript Test Suites
 * @version 1.1.0
 */
import { execSync } from 'child_process';
import { readdirSync } from 'fs';
import { join } from 'path';

interface TestSuite {
  name: string;
  pattern: string;
  timeout: number;
  dir: string;
  ext: string;
}

const suites: TestSuite[] = [
  { name: 'unit', pattern: '*.test.ts', timeout: 30000, dir: 'tests/unit', ext: '.test.ts' },
  { name: 'integration', pattern: '*.test.ts', timeout: 120000, dir: 'tests', ext: '.test.ts' },
  { name: 'scenarios', pattern: '*', timeout: 300000, dir: 'tests/scenarios', ext: '' }
];

function getTestFiles(suite: TestSuite): string[] {
  const files: string[] = [];
  try {
    const entries = readdirSync(suite.dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isFile() && (suite.ext === '' || entry.name.endsWith(suite.ext))) {
        files.push(join(suite.dir, entry.name));
      }
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') {
      console.error(`Error reading directory ${suite.dir}: ${error.message}`);
    }
  }
  return files.sort();
}

export async function runTests(suiteName: string): Promise<boolean> {
  const suite = suites.find(s => s.name === suiteName);
  if (!suite) {
    console.error(`Available suites: ${suites.map(s => s.name).join(', ')}`);
    throw new Error(`Suite not found: ${suiteName}`);
  }

  const files = getTestFiles(suite);

  if (files.length === 0) {
    console.log(`No tests found for suite: ${suiteName}`);
    return true;
  }

  console.log(`Running ${suiteName} suite (${files.length} test files)...`);

  try {
    for (const file of files) {
      console.log(`  Running: ${file}`);
      execSync('bun', ['test', file], {
        stdio: 'inherit',
        timeout: suite.timeout
      });
    }
    console.log(`✓ ${suiteName} suite passed`);
    return true;
  } catch (error: any) {
    console.error(`✗ Test failed: ${error.message}`);
    return false;
  } finally {
    try {
      import('node:fs').then(fs => {
        if (fs.existsSync('tests/.temp')) {
          fs.rmSync('tests/.temp', { recursive: true, force: true });
        }
      });
    } catch(e) {}
  }
}

// --- MCP server smoke tests ---
// Closes the long-standing TODO in
// docs/_meta/superpowers/plans/2026-06-05-mcp-server-implementation.md
// ("Add actual tool invocation tests") by invoking each MCP server's tool
// functions directly (no live network calls — MOCK_API=true forces the
// mock/fallback path where a server supports it; kr-safety-regs's
// search_osha_regulations uses its offline Tier-1 static article index
// regardless of MOCK_API, and legalize-kr's metadata lookup only reads the
// local repo cache, so no live API calls are made by any test below).

interface McpSmokeTest {
  name: string;
  run: () => Promise<void>;
}

function assert(condition: boolean, message: string): void {
  if (!condition) throw new Error(message);
}

const mcpSmokeTests: McpSmokeTest[] = [
  // --- kr-legislation ---
  {
    name: 'kr-legislation.get_current_law',
    run: async () => {
      const { getCurrentLaw } = await import('../mcp/kr-legislation/tools/current-law.js');
      const result = await getCurrentLaw();
      assert(Array.isArray(result) && result.length > 0, 'expected non-empty array');
      assert('lawId' in (result[0] as object) && 'lawName' in (result[0] as object), 'missing lawId/lawName fields');
    },
  },
  {
    name: 'kr-legislation.get_law_amendments',
    run: async () => {
      const { getLawAmendments } = await import('../mcp/kr-legislation/tools/amendments.js');
      const result = await getLawAmendments('산업안전보건법');
      assert(Array.isArray(result) && result.length > 0, 'expected non-empty array');
      assert('source' in (result[0] as object), 'missing source field');
    },
  },
  {
    name: 'kr-legislation.interpret_regulation',
    run: async () => {
      const { interpretRegulation } = await import('../mcp/kr-legislation/tools/interpret.js');
      const result: any = await interpretRegulation('산업안전보건법 제38조');
      assert(typeof result === 'object' && result !== null, 'expected object result');
      assert('articleId' in result && 'source' in result, 'missing articleId/source fields');
    },
  },
  {
    name: 'kr-legislation.get_compliance_guide',
    run: async () => {
      const { getComplianceGuide } = await import('../mcp/kr-legislation/tools/guide.js');
      const result: any = await getComplianceGuide('위험성평가');
      assert(typeof result === 'object' && result !== null, 'expected object result');
      assert('topic' in result && 'relevantLaws' in result, 'missing topic/relevantLaws fields');
    },
  },
  // --- kr-safety-regs ---
  {
    name: 'kr-safety-regs.search_osha_regulations',
    run: async () => {
      const { searchOshaRegulations } = await import('../mcp/kr-safety-regs/tools/search-osha.js');
      const result = await searchOshaRegulations('제36조');
      assert(Array.isArray(result) && result.length > 0, 'expected non-empty array from Tier-1 static index');
      assert('articleNumber' in (result[0] as object) && 'title' in (result[0] as object), 'missing articleNumber/title fields');
    },
  },
  {
    name: 'kr-safety-regs.get_sapa_requirements',
    run: async () => {
      const { getSapaRequirements } = await import('../mcp/kr-safety-regs/tools/sapa.js');
      const result: any = await getSapaRequirements('manufacturing');
      assert(typeof result === 'object' && result !== null, 'expected object result');
      assert(Array.isArray(result.requirements) && result.requirements.length > 0, 'missing requirements array');
    },
  },
  {
    name: 'kr-safety-regs.check_compliance_gaps',
    run: async () => {
      const { checkComplianceGaps } = await import('../mcp/kr-safety-regs/tools/gaps.js');
      const result: any = await checkComplianceGaps('제36조', ['안전보건관리체계']);
      assert(typeof result === 'object' && result !== null, 'expected object result');
      assert('totalRequired' in result && 'gaps' in result && 'compliant' in result, 'missing totalRequired/gaps/compliant fields');
    },
  },
  // --- legalize-kr ---
  {
    name: 'legalize-kr.get_law_metadata',
    run: async () => {
      const { getLawMetadata } = await import('../mcp/legalize-kr/tools/metadata.js');
      const result: any = await getLawMetadata('산업안전보건법');
      assert(typeof result === 'object' && result !== null, 'expected object result');
      // Tolerant of the local legalize-kr repo cache not being synced yet
      // (getLawMetadata degrades to { error } instead of hitting the network).
      assert('lawId' in result || 'error' in result, 'missing lawId/error fields');
    },
  },
];

export async function runMcpSmokeTests(): Promise<boolean> {
  process.env.MOCK_API = process.env.MOCK_API ?? 'true';
  console.log(`Running mcp-smoke suite (${mcpSmokeTests.length} tool invocations)...`);

  const results: { name: string; ok: boolean; error?: string }[] = [];
  for (const test of mcpSmokeTests) {
    try {
      await test.run();
      results.push({ name: test.name, ok: true });
      console.log(`  ✓ ${test.name}`);
    } catch (error: any) {
      results.push({ name: test.name, ok: false, error: error?.message ?? String(error) });
      console.error(`  ✗ ${test.name}: ${error?.message ?? error}`);
    }
  }

  const failed = results.filter(r => !r.ok);
  const passed = results.length - failed.length;
  if (failed.length === 0) {
    console.log(`✓ mcp-smoke suite passed (${passed}/${results.length})`);
    return true;
  }
  console.error(`✗ mcp-smoke suite failed (${passed}/${results.length} passed)`);
  return false;
}

// CLI entrypoint
const suiteName = process.argv[2] || 'integration';
(suiteName === 'mcp-smoke' ? runMcpSmokeTests() : runTests(suiteName)).then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error(error.message);
  process.exit(1);
});
