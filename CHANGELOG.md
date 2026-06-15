# Changelog

All notable changes to Safety OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Fixed (2026-06-16 — MCP Server Connectivity)
- Corrected `bun` arg order in `.mcp.json` and `.gemini/settings.json` — `bun --env-file .env run` → `bun run --env-file .env` (this bun version requires subcommand before flags; all 3 servers were silently failing to start)

### Added (2026-06-16 — legalize_kr v1.1.0)
- `mcp/legalize-kr/tools/admrule.ts` — `search_admrule` tool: keyword search over `.cache/admrule-kr/` (고용노동부 고시·예규·훈령)
- `mcp/legalize-kr/tools/precedent.ts` — `search_precedent` tool: GitHub Search API over `legalize-kr/precedent-kr` (62K판례, GITHUB_TOKEN required)
- `mcp/legalize-kr/git-sync.ts` — `ensureAdmruleKRRepo()` for shallow-cloning `admrule-kr` into `.cache/admrule-kr/`
- `.cache/admrule-kr/` — shallow clone of `legalize-kr/admrule-kr` (21,675 files)

### Changed (2026-06-16 — Config & Cleanup)
- `.gemini/settings.json` mcpServers updated to local `bun run` servers (removed stale `korean-law`, `mcp-kr-legislation`, `k-skill` npx entries)
- `.claude/settings.json` stale `mcpServers` block removed (authoritative config is `.mcp.json`)
- `.claude/settings.local.json` pruned — removed stale `vendor/` permission entries and codegraph npx permission
- `mcp/LICENSE_REVIEW.md` — moved from `vendor/LICENSE_REVIEW.md` (missed in directory rename)
- `AGENTS.md` — added `## Regulatory Scope` section (Tier 1–4 law registry); removed `regulations/KR/` reference from Section A agent structure

### Removed (2026-06-16 — Codegraph & Regulations)
- Removed codegraph MCP servers (`codegraph_search`, `codegraph_mutate`) from `.mcp.json`
- Removed codegraph entries from `.claude/settings.json` and `.gemini/settings.json`
- Deleted `docs/blueprint/appendix/J-codegraph-integration.md`
- Deleted `regulations/` folder (28 YAML files) — tier classification consolidated into `AGENTS.md ## Regulatory Scope`

### Changed (2026-06-16 — MCP Directory Rename)
- Renamed `vendor/` to `mcp/` for semantic clarity — servers are first-party MCP implementations, not third-party dependencies
- Renamed `mcp/mcp-kr-legislation/` to `mcp/kr-legislation/` — removed redundant `mcp-` prefix
- Updated `.mcp.json` server paths to reflect new directory structure
- MCP server names (`k_skill`, `legalize_kr`, `mcp_kr_legislation`) remain unchanged

### Added (2026-06-16 — MCP Server Implementation)
- Implemented `vendor/k-skill/` MCP server v1.0.0 — OSHA/SAPA regulation search with 24h caching (`search_osha_regulations`, `get_sapa_requirements`, `list_industry_controls`, `check_compliance_gaps`, `invalidate_cache`)
- Implemented `vendor/legalize-kr/` MCP server v1.0.0 — Korean law structure parsing from git repo (`parse_law_structure`, `find_references`, `get_law_metadata`, `compare_versions`)
- Implemented `vendor/mcp-kr-legislation/` MCP server v1.0.0 — real-time legislation API via 국가법령정보센터 (`get_current_law`, `get_law_amendments`, `interpret_regulation`, `get_penalties`, `get_compliance_guide`)
- Added `vendor/shared/` infrastructure — `types.ts`, `logger.ts`, `errors.ts`, `retry.ts`, `rate-limiter.ts`
- Added `vendor/mcp-kr-legislation/xml-parser.ts` — XML parsing with Korean encoding fallback using `fast-xml-parser`
- Installed `simple-git@3.36.0` and `fast-xml-parser@5.9.0` at workspace root

### Added (2026-06-06 — EHS Agents)
- **[2026-06-06]**: `agents/occupational-health-agent.md` — Occupational health specialist agent
- **[2026-06-06]**: `agents/chemical-safety-agent.md` — MSDS and hazardous chemical control agent
- **[2026-06-06]**: `agents/docs-writer.md` — Documentation writer agent
- **[2026-06-06]**: `AGENTS.md` updated with new agent rosters


### Added (2026-06-05 — MCP Server Configuration)
- **[2026-06-05]**: MCP server configuration with 3 stub servers (k_skill, legalize_kr, mcp_kr_legislation)
- **[2026-06-05]**: `vendor/*/index.ts` - MCP TypeScript SDK-based stub servers
- **[2026-06-05]**: `@modelcontextprotocol/sdk@1.29.0` - Official MCP TypeScript SDK installed
- **[2026-06-05]**: `docs/superpowers/specs/2026-06-05-mcp-server-design.md` - Comprehensive design spec
- **[2026-06-05]**: `docs/superpowers/plans/2026-06-05-mcp-server-implementation.md` - Implementation plan
- **[2026-06-05]**: `memory/meeting-2026-06-05-mcp-server-design.md` - Meeting transcript
- **[2026-06-05]**: `.mcp.json` - Updated with vendor/ paths and correct server names
- **[2026-06-05]**: `.cache/` directories initialized for k_skill and legalize-kr

### Changed (2026-06-05)
- **[2026-06-05]**: `codegraph` package installation and .mcp.json path fixes

### Added (2026-06-05 — Phase A completion)
- **[2026-06-05]**: Platform files: `.claude/settings.json`, `.gemini/settings.json` with Safety OS-specific hooks
- **[2026-06-05]**: Slash commands: `.claude/commands/` and `.gemini/commands/` (6 commands each)
- **[2026-06-05]**: Platform skills: `.claude/skills/` (8 skills) and `.gemini/skills/` (5 skills) from workspace common
- **[2026-06-05]**: Root skills: `skills/` — 11 common skills + 4 Safety OS domain skills (15 total)
- **[2026-06-05]**: Common scripts: `scripts/` — Tier 1+2 scripts (56 total) including `safety-audit.ts`
- **[2026-06-05]**: 7 Safety OS agents with 3-Section structure (pm/CSO, SGM, SWM, compliance, risk-assessment, emergency, audit)
- **[2026-06-05]**: 4 domain SKILL.md files (risk-assessment, permit-to-work, emergency-response, compliance-gap)
- **[2026-06-05]**: 6 manufacturing daily workflows with `legal_basis` fields (all passing `safety-audit.ts`)
- **[2026-06-05]**: `evidence-models/base/` — finding and corrective-action JSON schemas (v1.0.0)
- **[2026-06-05]**: `variant.json` — full schema with `inherits_common`, `skill_manifest`, `lifecycle` fields
- **[2026-06-05]**: `README.md` and `README_ko.md` — Safety OS platform documentation
- **[2026-06-05]**: `docs/co-safety.context.md` — domain context for all Safety OS agents
- **[2026-06-05]**: `docs/VERSION_MANIFEST.md` — Safety OS artifact version tracking
- **[2026-06-05]**: `docs/reports/` and `docs/procedures/` — Safety OS document subdirectories
- **[2026-06-05]**: `SECURITY.md` — security policy stub (Phase B completion required)
- **[2026-06-05]**: `memory/MEMORY.md` — session memory index
- **[2026-06-05]**: `.gitignore`, `.env.sample`, `.env` — environment configuration
- **[2026-06-05]**: `.githooks/` — git commit/push protection hooks
- **[2026-06-05]**: `git init` + `core.hooksPath .githooks` — git repository initialized
- **[2026-06-05]**: `scripts/bun.lock` — Bun package lock (bun install complete)
- **[2026-06-05]**: CodeGraph initialized for AI context search
- **[2026-06-05]**: `PROMOTION_CHECKLIST.md` updated — conditions 1/3/4/5 verified ✅

### Added (2026-06-04 — Phase A scaffold)
- **[2026-06-05]**: Initial Safety OS Phase A scaffold — directory structure, placeholder files, and base documentation
- **[2026-06-05]**: `_ORIGIN.md` — workspace common version snapshot and reconcile survival notes
- **[2026-06-05]**: `_COMMON_VERSION.md` — workspace root version reference for Phase B promotion tracking
- **[2026-06-05]**: `PROMOTION_CHECKLIST.md` — 7 Phase B promotion conditions with verification commands
- **[2026-06-05]**: `CLAUDE.md` and `GEMINI.md` — adapted from workspace root with Safety OS Context section
- **[2026-06-05]**: `AGENTS.md` — adapted from workspace root with Safety OS agent roster stubs
- **[2026-06-05]**: `industry-profiles/manufacturing.yaml` — manufacturing industry profile MVP stub
- **[2026-06-05]**: `regulations/KR/tier1-laws/` — metadata stubs for OSHA-KR and SAPA
- **[2026-06-05]**: `workflows/_template/` — 7-section standard workflow template and schema
- **[2026-06-05]**: `.mcp.json` — minimal MCP config with codegraph server
- **[2026-06-05]**: Directory structure: `agents/`, `skills/`, `workflows/`, `regulations/`, `evidence-models/`, `docs/`, `memory/`, `scripts/`
