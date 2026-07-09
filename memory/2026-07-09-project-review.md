# Project Review Report — 2026-07-09

**Scope**: Full project review with deep-dive on sync skill pipeline
**Files scanned**: 28 agents, 42 skills, 50 scripts, 6 commands, 3 platform configs, 11 root docs
**Reviewers**: PM + base-map MCP (local LLM code review) + parallel structural scanners

---

## Summary

| Priority | Count |
|----------|:-----:|
| P1 — Critical | 3 |
| P2 — High | 8 |
| P3 — Medium | 7 |
| P4 — Low | 5 |
| P5 — Info | 6 |

---

## Findings

| # | Priority | Area | Finding | File(s) | Suggested Fix |
|---|----------|------|---------|---------|---------------|
| 1 | P1 | Skills Registry | 5 skills in AGENTS.md have NO implementation: `psm-loto`, `tar-planning`, `construction-permit-overview`, `pre-construction-technical-review`, `mid-construction-inspection`, `completion-inspection` | AGENTS.md:195-237 | Create SKILL.md or remove from roster |
| 2 | P1 | Skills Registry | `sync` skill missing from SKILLS.md index | skills/SKILLS.md | Run verify-skills.ts --generate |
| 3 | P1 | Content Integrity | CLAUDE.md/GEMINI.md "Last Updated" stale (34 days, dated 2026-06-05) | CLAUDE.md:337, GEMINI.md:334 | Update footer to 2026-07-09 |
| 4 | P2 | Skills Registry | 6 naming mismatches: psm-moc→moc, gmp-change-control→change-control, gmp-deviation-capa→deviation-capa, gmp-qrm→qrm, meeting→meeting-facilitation | AGENTS.md, skills/ | Standardize names |
| 5 | P2 | Skills Registry | 5 skills undocumented in AGENTS.md: agent-lifecycle-manager, script-lifecycle-manager, skill-lifecycle-manager, team-builder, translate | skills/*/SKILL.md | Add to AGENTS.md Skills table |
| 6 | P2 | Skills Frontmatter | 35 skills missing metadata.type field | 35 SKILL.md files | Add metadata.type |
| 7 | P2 | Skills Frontmatter | 4 skills missing entire metadata block: psm/moc, gmp/change-control, gmp/deviation-capa, gmp/qrm | 4 SKILL.md files | Add metadata block |
| 8 | P2 | Skills Frontmatter | legalize-kr-sync has triggers at top level instead of under metadata: | skills/legalize-kr-sync/SKILL.md | Move triggers under metadata |
| 9 | P2 | Platform Parity | .codex/ directory completely missing | N/A | Create config or document as unsupported |
| 10 | P2 | Platform Parity | platform-command-lifecycle-manager SKILL.md missing section in .gemini/ | .gemini/skills/ | Sync missing section |
| 11 | P2 | Sync Pipeline | dev-sync.ts hardcoded PR base to 'master' | scripts/dev-sync.ts:323 | Detect default branch dynamically |
| 12 | P2 | Content Integrity | memory/MEMORY.md sessions table essentially empty (1 entry from 2026-06-05) | memory/MEMORY.md | Fix sync-md.ts table insertion regex |
| 13 | P3 | Agent Frontmatter | 10 agents missing lifecycle/color fields | 10 agent files | Add for consistency |
| 14 | P3 | Sync Pipeline | dev-sync.ts:264 silent empty catch on sensitive file detection | scripts/dev-sync.ts:264 | Log error before continuing |
| 15 | P3 | Sync Pipeline | generate-version-manifest.ts:128 dead code (hasGeminiParitySkip) | scripts/generate-version-manifest.ts | Remove unused function |
| 16 | P3 | Sync Pipeline | generate-scripts-readme.ts mixes ESM/CJS imports | scripts/generate-scripts-readme.ts | Standardize imports |
| 17 | P3 | Sync Pipeline | archive-memory.ts uses renameSync (cross-volume risk on Windows) | scripts/archive-memory.ts | Use copyFileSync+unlinkSync |
| 18 | P3 | Sync Pipeline | gen-pr-body.ts language validation only checks Korean | scripts/gen-pr-body.ts:28 | Expand to cover all non-English |
| 19 | P3 | Sync Pipeline | sync-agent/skill-status.ts only detect deprecated transitions | Both files | Expand status detection |
| 20 | P4 | Documentation | docs/context.md missing | N/A | Create or update script |
| 21 | P4 | Documentation | security/ directory missing | N/A | Create or add placeholder |
| 22 | P4 | Documentation | memory/corrective-actions/ and incidents/ empty | memory/ | Add .gitkeep |
| 23 | P4 | Sync Pipeline | sync-skills.ts hardcoded meeting-facilitation special case | scripts/sync-skills.ts:110 | Make data-driven |
| 24 | P4 | Code Quality | retry-handler.ts catch without instanceof check | scripts/retry-handler.ts:76 | Add guard |
| 25 | P5 | Documentation | CONSTITUTION.md/PROMOTION_CHECKLIST.md from 2022 | Root files | Verify relevance |
| 26 | P5 | Code Quality | sync-skills.ts uses synchronous fs throughout | scripts/sync-skills.ts | Consider async refactor |
| 27 | P5 | Code Quality | VERSION_MANIFEST.md reports 58 skills (likely counting duplicates) | docs/VERSION_MANIFEST.md | Deduplicate count |
| 28 | P5 | Sync Pipeline | .gemini/skills/ has 8 stale non-SSOT skills | .gemini/skills/ | Run sync-skills.ts |

---

## Sync Skill Deep-Dive

### Architecture
`dev-sync.ts` (v1.4.3, 356 lines) — pipeline orchestrator with 12+ sub-script invocations.

**base-map MCP Rating: A (Excellent)**
- CWD guard, sensitive file scanning, retry resilience, and quality gates are production-grade.

### Sync-Specific Findings

| # | Severity | Finding |
|---|----------|---------|
| S-1 | P2 | Hardcoded prBase = 'master' — should detect dynamically |
| S-2 | P3 | Silent empty catch on sensitive file detection (line 264) |
| S-3 | P2 | MEMORY.md not being populated — sync-md.ts regex likely broken |
| S-4 | P3 | gen-pr-body.ts fallback hardcodes bash on Windows |
| S-5 | P4 | No recovery guidance if branch created but push/PR fails |

### Dependency Map
```
dev-sync.ts (orchestrator)
├── retry-handler.ts (shared)
├── sync-md.ts
├── generate-scripts-readme.ts
├── verify-scripts.ts
├── archive-memory.ts
├── safety-audit.ts / audit.ts (conditional)
├── generate-version-manifest.ts
├── gen-pr-body.ts → retry-handler.ts
├── propagate-to-templates.ts (L0→L1 only)
└── domain test scripts (variant only)
```

---

## Next Steps

1. **[Immediate]** Fix P1 #1-#3: Create missing skill stubs, regenerate SKILLS.md, update dates
2. **[24h]** Fix P2 #4-#12: Standardize naming, add metadata blocks, detect PR base dynamically
3. **[1 week]** Batch P3-P4: `/sync "chore: project review fixes"`
4. **[Opportunistic]** Track P5 for future grooming
