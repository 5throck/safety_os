# Changelog

All notable changes to Safety OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

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
