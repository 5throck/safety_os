# Changelog

All notable changes to Safety OS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **license**: Added root `LICENSE` file (GNU Affero General Public License v3.0). Added License sections to `README.md`/`README_ko.md` and a `license` field to `scripts/package.json`.

### Fixed

- **governance**: Replaced `CLAUDE.md`'s Specialist Agent List and `Agent()` dispatch example (which referenced nonexistent `automation-engineer`/`architect`/`scaffolding-expert`/`security-expert` agents and a nonexistent Low tier) with the project's real roster; corrected `compliance-agent`/`audit-agent` tier from Low to Medium to match their frontmatter and `pm.md`'s Tier Ceiling Rule.
- **agents**: Replaced the hardcoded `model: inherit` frontmatter field (present on all 28 agent files, contradicting `pm.md`'s Model Parameter Enforcement Rule) with the tier-resolved short alias (`opus`/`sonnet`); added missing frontmatter to `psm-agent.md` and `training-agent.md`.
- **scripts**: Fixed `generate-version-manifest.ts`'s agent tier regex to tolerate CRLF line endings (was silently failing for all 9 domain agents); added support for nested YAML `metadata.triggers` lists (the format most skills actually use) alongside the old flat-array format; removed a false-positive "command not integrated as a skill" drift check that didn't match this project's auto-registration convention.
- **skills**: Added missing `metadata.triggers` keyword lists to 30 skills that had none, and synced the corrected content into their `.claude/skills/` and `.gemini/skills/` duplicate copies (which were stale relative to the canonical `skills/` tree); fixed an invalid unquoted YAML `description` field in `msds-parser/SKILL.md`. Drift detection now reports 0 issues (down from 75).
- **audit**: Resolved `agents/` path check in `scripts/audit.ts` to recursively scan subdirectories (supporting nested directories like `agents/_core/`).
- **audit**: Updated skills check in `scripts/audit.ts` to recursively check skill folders while skipping category folders.
- **commands**: Added `.gemini/commands/sync.md` matching `.claude/commands/sync.md` for platform command parity.

### Changed (2026-07-03 — Documentation Gap Fixes: LOTO/TAR Legal Basis + Art 36 Risk Assessment Cross-References)

**Evidence model wiring (follow-up):**
- **`skills/daily/risk-assessment/SKILL.md`**: Updated output instructions to generate structured JSON evidence records per `risk-assessment-record.json` schema alongside human-readable markdown summaries.
- **`agents/_shared/risk-assessment-agent.md`**: Updated Section B scope and Section C workflow pattern to reference `evidence-models/domains/functional/risk-assessment/risk-assessment-record.json` as primary output format; updated Tools Used table.
- **`workflows/daily/manufacturing/risk-assessment/README.md`**: Updated Documentation step, Evidence Requirements, and Completion Criteria to reference structured JSON evidence model.
- **`workflows/daily/manufacturing/risk-assessment/schema.yaml`**: Added `evidence_model: risk-assessment-record.json` field.

**LOTO+TAR documentation gaps resolved (ref: commit 4c1924c):**

**LOTO+TAR documentation gaps resolved (ref: commit 4c1924c):**
- **`agents/domains/functional/psm/psm-agent.md`**: Added LOTO to Section A Legal Basis (안전보건기준에관한규칙 Article 92, KOSHA GUIDE Z-40-2022), Section B scope (hazardous energy isolation), Section C operational procedures and handoff to ehsconst-agent for joint TBM.
- **`agents/_shared/contractor-safety-agent.md`**: Added TAR surge management scope — enhanced onboarding, TBM coordination with LOTO, pre-TAR health screening during turnaround periods.
- **`agents/_shared/occupational-health-agent.md`**: Added Turnaround (TAR) Health Monitoring subsection — pre-TAR/post-TAR enhanced health examinations with reference to `ehschem-turnaround-record.json`.
- **`AGENTS.md`**: Added `psm-loto` and `tar-planning` skills to Skills Table; added "Lockout/Tagout", "LOTO", "Lockout", "Tagout" to psm-agent dispatch triggers.
- **`regulations/KR/legal-glossary.yaml`**: Added `안전보건기준에관한규칙` statute entry with Article 92 (Zero Energy State / LOTO); added KOSHA GUIDE Z-40-2022 note to OSHA-KR statute block.

**Risk Assessment (Art 36) cross-reference improvements:**
- **`agents/domains/industry/ehsconst/ehsconst-agent.md`**: Added OSHA-KR Article 36 (위험성평가 실시) to Section A Legal Basis — mandatory risk assessment for all construction workplace tasks.
- **`agents/domains/functional/training/training-agent.md`**: Added OSHA-KR Article 36 to Section A; expanded scope to include risk assessment result communication training; expanded Gap Analysis to flag workers missing updated risk assessment training.
- **`workflows/domains/industry/ehsconst/tbm-tool-box-meeting/schema.yaml`**: Added `산업안전보건법 Article 36` to `legal_basis` — TBM is a primary vehicle for communicating risk assessment findings to workers.
- **`evidence-models/domains/industry/ehsconst/ehsconst-tbm-record.json`**: Added `risk_assessment_ref` optional field; version bumped 1.0.0 → 1.0.1.
- **`evidence-models/_shared/base/common.schema.json`**: Fixed `$id` from "gmp-common.schema.json" to "common.schema.json"; added shared `risk_assessment_ref` definition (assessment_id, assessment_date, risk_level, assessor_id); version bumped 1.0.0 → 1.0.1.
- **`evidence-models/domains/functional/risk-assessment/risk-assessment-record.json`**: NEW — dedicated risk assessment evidence model per OSHA-KR Article 36 with hazard identification, risk scoring (severity × likelihood), hierarchy of controls, worker communication tracking, and `$ref` to common definitions.
- **`GEMINI.md`**: Added Phase Determination Checklist (Safety OS) table — mirrors CLAUDE.md content for platform parity (SGM → Phase 1-2, SWM → Phase 4, compliance → Phase 4, emergency → Direct, audit → Phase 6).
- **`docs/_shared/user-scenarios.md`** + **`user-scenarios_ko.md`**: Added Scenario 6 (Workplace Risk Assessment / 작업 위험성평가) — step-by-step dispatch example covering hazard identification, risk scoring, LOTO coordination, and worker communication.

### Changed (2026-07-03 — kr_safety MCP v2.0.0: Hybrid Search + Rename)

**Hybrid 3-tier search replaces mock-data fallback in `search_osha_regulations`:**
- **Tier 1 (Static index)**: Parse `legal-glossary.yaml` at startup — 88 articles across 12 statutes, instant O(1) keyword match against article numbers, English topics, and Korean terms. No API calls.
- **Tier 2 (MST full-text fetch)**: Fetch entire law via `lawService.do?MST=NNN`, cache for 24h, grep locally for keyword in article title+content. Expanded MST table from 4 to 12 core EHS statutes (added 약사법, 의료기기법, 고압가스안전관리법, LPG법, 수소경제법, 전기사업법, 전기안전관리법, 건설기술진흥법, K-REACH). All MST codes verified live against law.go.kr.
- **Tier 3 (lawSearch.do)**: Law name search as last resort.
- **Honest empty**: All tiers failing returns `[]` (no mock/fake data). `mockOshaResults()` deleted entirely.
- **New files**: `mcp/kr-safety-regs/tools/article-index.ts` (glossary parser), `mcp/kr-safety-regs/tools/mst-table.ts` (MST code table).
- `checkComplianceGaps` returns honest empty analysis when no regulations found.

**Renamed `k_skill` → `kr_safety` for clarity:**
- The old name was opaque and did not convey function. `kr_safety` accurately reflects the server's purpose: Korean safety regulations search (OSHA-KR, SAPA, CCA, etc.).
- Directory: `mcp/k-skill/` → `mcp/kr-safety-regs/`, server name: `k_skill` → `kr_safety`.
- Updated: `.mcp.json`, `scripts/start-mcp.ts`, `docs/_shared/mcp-integration-guide.md/.ko`, `AGENTS.md`, `mcp/LICENSE_REVIEW.md`.
- Logger names updated in all 7 tool files.

### Fixed (2026-07-03 — Legal Basis Audit: Post-MCP-Fix Content Verification)

After fixing all 9 MCP server issues (previous entry), audited all existing content created during the 17-day window when legal MCP tools were broken (2026-06-16 ~ 2026-07-03). Verified that mock/fabricated data did NOT contaminate any schema, but found several citation accuracy issues introduced from agent training knowledge without live law verification.

**Agent description corrections (3):**
- **`agents/_shared/contractor-safety-agent.md`**: fixed OSHA-KR Article 63 description from "Responsibility of Contractor" to "Ordering party's safety and health measures (도급인의 안전보건조치)" — Article 63 places duty on the ordering party, not the contractor ([Source: law.go.kr](https://www.law.go.kr/lsLawLinkInfo.do?lsJoLnkSeq=900387016&chrClsCd=010202)).
- **`agents/_shared/asset-integrity-agent.md`**: fixed SAPA Article 4 description from "Measures to Prevent Serious Industrial Accidents" to "Safety and Health Management System establishment" — Article 4 is about the obligation to establish a management system, not direct accident prevention.
- **`agents/_shared/reporting-agent.md`**: fixed SAPA Article 4 description from "Management Responsibility and Reporting" to "Safety and Health Management System establishment" — "Management Responsibility" is Article 3.

**SAPA Article 12 misuse corrected (4 workflows):**
- SAPA Article 12 ("형 확정 사실의 통보" — procedural notification of final convictions) was incorrectly cited as "건설업 특례" in 4 ehschem/ehsconst workflows. Construction liability provisions are in SAPA Article 3 (scope), Article 5 (contract/outsourcing), and Article 6 (punishment).
- **`workflows/domains/industry/ehsconst/sapa-serious-accident-reference/schema.yaml`**: replaced SAPA Art 12 → Art 5 + Art 6.
- **`workflows/domains/industry/ehsconst/collapse-prevention/schema.yaml`**: replaced SAPA Art 12 → Art 6.
- **`workflows/domains/industry/ehsconst/fall-prevention/schema.yaml`**: replaced SAPA Art 12 → Art 6.
- **`workflows/domains/industry/ehsconst/safety-supervision/schema.yaml`**: replaced SAPA Art 12 → Art 6.

**Legal glossary updates (`regulations/KR/legal-glossary.yaml`):**
- Added OSHA-KR Article 13 (구급설비/first-aid equipment) — cited in `first-aid-training` and `medical-emergency` schemas but missing from glossary allowlist.
- Expanded SAPA from 6 to 14 articles (added Art 6-11, 14-16) — verified via `kr_safety.get_sapa_requirements` MCP (MST=228817, 16 articles confirmed). Corrected Art 3 description from "Management responsibility" to "Scope — application to business owners and management responsible persons."
- Resolved `의료기기법 Article 83` UNVERIFIED flag: confirmed as EU MDR Article 83 (PMS system) carryover; updated schema to cite "EU MDR Article 83" explicitly.
- Upgraded `환경보건법` from UNVERIFIED to verified active law ([Source: law.go.kr](https://www.law.go.kr/LSW/lsSc.do?menuId=1&dt=20201211&query=%ED%99%98%EA%B2%BD%EB%B3%B4%EA%B1%B4%EB%B2%95&subMenuId=15)).

**Stretched SAPA applicability fix:**
- **`workflows/domains/industry/meddevice/device-recall-reference/schema.yaml`**: replaced SAPA Art 7 (industrial accident dual liability) with 약사법 Art 43조의3 (pharmaceutical recall duty) + "EU MDR Article 87" (explicit EU prefix to avoid Korean Act confusion).

### Fixed (2026-07-03 — MCP Server Audit: 9 Findings Resolved Across 3 Korean Legal MCP Servers)

Comprehensive audit of all tools in `legalize_kr` (6 tools), `mcp_kr_legislation` (5 tools), and `k_skill` (5 tools) uncovered 9 issues spanning protocol pollution, stale paths, missing auth, law name mismatches, and permission gaps. All resolved.

- **`mcp/legalize-kr/resolve.ts`** (NEW): fuzzy law directory resolver — resolves current law names (e.g. `중대재해처벌법`) against the git mirror's former-name directories (e.g. `중대재해처벌등에관한법률`) via YAML title scan with whitespace normalization and Korean suffix stripping; in-memory `Map` cache on first miss; all JSDoc in English (Bun v1.3.14 parser rejects Korean in comments).
- **`mcp/legalize-kr/tools/parse.ts`**: updated to use `resolveLawDir(lawId)` instead of raw `lawId` for path lookup.
- **`mcp/legalize-kr/tools/references.ts`**: added `LawReference` interface, removed `any` casts, wired `resolveLawDir`.
- **`mcp/legalize-kr/tools/metadata.ts`**: wired `resolveLawDir` for both `lawFile` and `gitLog` paths.
- **`mcp/legalize-kr/tools/compare.ts`**: wired `resolveLawDir`.
- **`mcp/legalize-kr/tools/precedent.ts`**: added optional `date` field to `PrecedentResult`; reads `GITHUB_TOKEN` from `process.env` for GitHub Code Search API auth.
- **`scripts/lib/mcp-cache.ts`**: changed `console.log` to `process.stderr.write` — stdout pollution corrupted MCP JSON-RPC protocol.
- **`scripts/start-mcp.ts`**: fixed stale `vendor/` → `mcp/` paths after 2026-06-16 directory rename; added `--env-file .env`.
- **`mcp/shared/retry.ts`**: added 4xx client error skip-retry logic (401/403/404/429 fast-fail).
- **`mcp/mcp-connector.ts`**: deleted (dead code, zero runtime imports).
- **`.claude/settings.local.json`**: added 5 `k_skill` tool permissions (`search_osha_regulations`, `get_sapa_requirements`, `list_industry_controls`, `check_compliance_gaps`, `invalidate_cache`).

### Fixed (2026-07-03 — `withRetry` Fail-Fast Predicate + Error Classification)

`withRetry()` in `scripts/retry-handler.ts` determined success/failure solely by whether `fn()` threw. Bun Shell's `.nothrow()` suppresses the throw on non-zero exit codes, so `.nothrow()`-wrapped shell commands were unconditionally reported as `"Success on attempt 1"` — including real, persistent failures such as a `401` from `gh pr create`. The three `gh pr create` branches in `dev-sync.ts` discarded the return value, so a GitHub auth failure silently exited 0 having created no PR.

Applied the L0 `retry-handler-fail-fast-design.md` (Status: Proposed, 2026-07-02) to safety_os via **selective per-file merge** (not blanket overwrite) — `dev-sync.ts` carries safety_os-specific variant logic (`isVariant` branch, `safety-audit.ts`, domain test suites, `--base master`) that would have been destroyed by a wholesale L0 copy.

- **`retry-handler.ts`** (1.0.0 → 1.0.1): added `isSuccess?: (result: unknown) => boolean` predicate to `RetryConfig`; predicate-false results synthesize an `Error` from `result.stderr`/`exitCode` and route through the same failure path as caught exceptions; wired the previously-dead-code `classifyError` into the failure path so `'tool'`-classified errors (auth/permission, including `HTTP 401: Bad credentials`, `403 Forbidden`) fail on attempt 1 without consuming retry/backoff budget. Zero-regression guarantee: when `isSuccess` is omitted, behavior is byte-for-byte identical to before.
- **`dev-sync.ts`** (variant logic preserved): added `isSuccess: (r) => r.exitCode === 0` to all 4 `withRetry` calls; bound the 3 `gh pr create` branches to a `prCreateRetry` variable and added `if (!prCreateRetry.success) process.exit(1)` (closes the reported bug); simplified the push block to use `pushRetry.success` as the single source of truth (`|| pushProc?.exitCode !== 0` removed, stderr kept as defense-in-depth for the error message per design Trade-off #3 (b)).
- **`dispatch-parallel.ts`** (1.0.0 → 1.0.1) and **`gen-pr-body.ts`** (1.1.0 → 1.1.3): copied from L0 verbatim (no safety_os-specific code); both now pass `isSuccess` and trust `withRetry`'s returned `.success` field. `gen-pr-body.ts` additionally picks up the hardened prompt-injection sanitizer and the `LANGUAGE_POLICY_REF` fallback to `docs/context.md §3` for variant projects.
- **Verification**: AC-1 (401 → `success: false`, `attempts: 1`), AC-2 (`HTTP 401: Bad credentials` → `'tool'` → fail-fast, 1ms elapsed, no backoff), AC-3 (CLI self-test with no predicate → identical behavior to pre-change), AC-4 (all 4 `dev-sync.ts` calls pass `isSuccess` and bind the return value), AC-5 (push block single source of truth); `bun build` transpile-clean on all 4 files.

### Changed (2026-06-25 — Execution Plan Boilerplate Unification to `/sync` Single Row)

The variant execution plan boilerplate required two separate terminating rows — **N-1 (Lifecycle Update)** dispatched to `lifecycle-manager (workspace) / pm (variant)` and **N (Final QA Audit)** to `auditor (workspace) / pm (variant)` — which conflicted with the workspace root policy (workspace `AGENTS.md §5.1`) where `/sync` handles lifecycle update + full audit + commit + push + PR in a single pipeline. The variant boilerplate also omitted the `/sync` row entirely, leaving the lifecycle/audit steps it mandated with no pipeline to execute them. Unified all three variant governance files to the workspace single-`/sync`-row policy. Same "Truth-in-Documentation" principle as prior cleanups: the documented boilerplate must match the implemented `/sync` pipeline.

- **CLAUDE.md §5** ("Mandatory Execution Plan Display"): replaced the 3-row table (`1` + `N-1` + `N`) with a 2-row table (`1` + `N` `/sync`); removed the Context rule (workspace-root vs variant lifecycle/auditor dispatch) since `/sync` handles both; added a rule stating `/sync` is the mandatory final step covering lifecycle + audit + commit + push + PR.
- **GEMINI.md §2** (`implementation_plan.md` artifact template): replaced the `N-1`/`N` Step rows with a single `/sync` `N` row + rule (inside the code-fence).
- **GEMINI.md §5** ("Mandatory Execution Plan Display"): added the `/sync` `N` row + rule to the existing 1-row table.
- **AGENTS.md**: added a new "Execution Plan Boilerplate" subsection under PM Gateway Policy (single `/sync` row table + cross-reference to workspace `AGENTS.md §5`); the variant AGENTS.md previously had no execution plan policy at all.
- **Scope note**: workspace root `templates/common/AGENTS.md` carries the same legacy N-1/N boilerplate but was left untouched per CLAUDE.md §9 boundary isolation (workspace-root template vs variant cannot be modified in the same session); deferred to a follow-up task.
- **Verification**: `git stash` baseline confirmed the 6 `audit.ts` failures are pre-existing structural drift (unrelated to this change); `bun scripts/safety-audit.ts` → 582 files, 0 errors; platform parity — CLAUDE.md and GEMINI.md carry an identical `/sync` policy (model differs per platform: `claude-sonnet-4-6` vs `gemini-3.5-flash`).

### Added (2026-06-21 — meeting-facilitation Skill Registration Parity)

`meeting-facilitation` was a skill in name only: it existed as the `/meeting` slash command (parity-paired on both platforms) and as a stub in the project-root `skills/` registry, but was ABSENT from `.claude/skills/` and `.gemini/skills/` — the only paths the native Skill tool scans. So `Skill(skill="meeting-facilitation")` returned "Unknown skill", directly contradicting the documented "used on both platforms" claim. Final item of the Truth-in-Documentation cleanup.

- **Registered** `.claude/skills/meeting-facilitation/SKILL.md` + `.gemini/skills/meeting-facilitation/SKILL.md` (byte-identical parity). The canonical `/meeting` command already carried valid SKILL.md frontmatter (`metadata.triggers` etc.), so the skill body is the proven process verbatim, with one platform-neutral note to keep the skill and the command in sync.
- **Confirmed resolvable**: `meeting-facilitation` now appears in the platform available-skills list; `Skill(skill="meeting-facilitation")` resolves on both Claude and Antigravity.
- **Scope correction (PM verification)**: an earlier plan proposed backfilling 3 "missing" Gemini skills (`api-documentation`, `research-analysis`, `documentation-writing`). All three carry `gemini-parity: skip` — they are intentionally Claude-only per the §10 lifecycle rule. **No backfill performed**; the count mismatch was a false gap, not a parity violation.
- **Verification**: `diff` of the two SKILL.md → IDENTICAL; `bun scripts/skill-lifecycle-audit.ts` → 41 skills, 0 errors; `bun scripts/safety-audit.ts` → 582 files, 0 errors.

### Changed (2026-06-21 — Superpowers Plugin Policy Cleanup; Native Platform Parity)

Both Claude Code and Antigravity now ship native subagent dispatch and plan mode, so external "superpowers plugin" install/leverage instructions are obsolete. Removed every instruct-the-PM-to-install/leverage-an-external-plugin reference; the valuable 3-tier Model Selection Override guidance is preserved (it is platform-native, not plugin-dependent). Same "Truth-in-Documentation" principle as the code-graph cleanup: documented capability must match implemented capability.

- **CLAUDE.md + GEMINI.md**: renamed `#### Superpowers Plugin & Cost Optimization (3-Tier Strategy)` → `#### Cost Optimization (3-Tier Strategy)`; reframed the lead from "PM MUST leverage the superpowers plugin" to "uses the platform's native subagent dispatch and plan mode"; dropped the dangling `AGENTS.md#superpowers-plugin--...` link (AGENTS.md never had that section). The 3-tier `Model Selection Overrides` bullets kept verbatim per platform (Claude: opus/sonnet/haiku; Gemini: 3.1-pro/3.5-flash).
- **Skill Resolution Priority table (both files)**: Priority-3 row `superpowers/brainstorming, superpowers/writing-plans` → "Platform-native skills (built-in plan mode and subagent capabilities, no external plugin)"; the canonical "brainstorm" conflict row likewise points to platform-native skills.
- **`docs/_meta/superpowers/plans/*.md`** (2 MCP-server implementation plans): "REQUIRED: Use superpowers:subagent-driven-development / executing-plans" header → "Use native subagent dispatch (if available) or native plan mode". Directory name retained (historical; it documents the 3 active MCP servers).
- **Validators**: `scripts/validate-md-language.ts` exclusion path corrected `docs/superpowers/` → `docs/_meta/superpowers/` (the real nested path — the old exclusion never matched, so plan docs were not actually excluded); `scripts/validate-doc-folder.ts` removed the dead `'superpowers'` entry from `OPTIONAL_FOLDERS` (validator checks top-level `docs/`, but the folder is nested under `_meta/`, so the entry could never match). Both bumped (`1.4.1`, `1.0.1`).
- **Verification**: `grep superpowers` in CLAUDE/GEMINI/AGENTS → 0 refs; both validators exit 0; `bun scripts/safety-audit.ts` → 582 files, 0 errors.

### Removed (2026-06-21 — Code-Graph Remnant Cleanup; Truth-in-Documentation)

Completed the code-graph removal begun 2026-06-16. The codegraph MCP and the Neo4j "Knowledge Graph Traceability Model" were never wired into `.mcp.json`; their design docs and dead runtime artifacts persisted as false capability claims, which is unsafe in a GxP/audit context. Enforces a new **"Truth-in-Documentation"** principle: documented capability = implemented capability; unimplemented items are archived and annotated.

- **Deleted dead remnants**: `evidence-models/graph-schema.json` (0 references), `scripts/generate-playbook.ts` (stale generator reading nonexistent `docs/blueprint/`), and the CodeGraph MCP init block from `scripts/setup.sh` + `scripts/setup.ps1` (was still running `npx @colbymchenry/codegraph`).
- **Corrected** `_ORIGIN.md` false claim ".mcp.json (codegraph only)" → accurate active servers (`k_skill`, `legalize_kr`, `mcp_kr_legislation`).
- **Archived** unimplemented design docs to `docs/_meta/archive/code-graph/` (with a NOT-IMPLEMENTED README): blueprint `18-knowledge-graph.md`, `19-graph-schema.md`, `appendix/H-knowledge-graph-examples.md`, `architecture/knowledge-graph-ingestion.md`, and the `v4.0-playbook-2026-06-06.md` snapshot.
- **Re-specified agents** off the non-existent graph: `training-agent.md` and `audit-agent.md` now describe compliance/audit traceability via the LIVE mechanism — `evidence-models/*.json` + workflow `schema.yaml` `legal_basis` fields + `regulations/KR/legal-glossary.yaml` SSOT. `AGENTS.md` Training roster line updated to match. Zero residual Neo4j/graph capability claims across `agents/`.
- **Annotated** the 4 remaining blueprint docs with embedded graph refs (`02-architecture.md` diagram node fixed + banner; `04-agent-catalog.md`, `05-implementation-roadmap.md`, `appendix/A-agent-definitions.md` bannered) as NOT-IMPLEMENTED historical design, rather than gutting the broader docs.
- **Verification**: `bun scripts/safety-audit.ts` → 582 files, 0 errors; active-area `codegraph|neo4j|knowledge graph` grep → 0 unannotated hits.

### Changed (2026-06-21 — Korean-Regulation Domain READMEs → Layer C Korean-Canonical)

Applied the Layer C (Korean-canonical) policy to the **4 Korean-regulation industry domains**, converting their workflow READMEs from English-first to fully Korean-canonical for the Korean EHS/GxP practitioners who use them. This operationalizes the documentation language pivot for the human-operational layer (Layer C) — international-regulation domains (gcp/gvp/glp/meddevice) correctly remain Layer B (English-preferred) and were not touched.

- **ehsconst** (Construction Safety, 9), **ehschem** (Chemical Plant, 8), **gasterm** (Gas Terminal, 8), **powergen** (Power Generation, 8) — **33 READMEs total** rewritten to Korean body + canonical H1 `# <Korean> (<Title Case English>) Workflow` matching the established `gmp` pattern.
- **Content fidelity preserved** (verified): all evidence-record JSON filenames, technical identifiers/ref codes (`msds_record_ref`, `psm_psi_ref`, `legal_basis`, `permit_id`, etc.), cross-domain reference paths, and workflow step structure/numbering are byte-identical to the originals. Language conversion only — no logic, scope, or structural changes.
- **Korean statute citations standardized** from `regulations/KR/legal-glossary.yaml` SSOT as `한글명 (English gloss) 제N조` (e.g. `중대재해처벌법 (SAPA) 제12조`, `고압가스안전관리법 (High-Pressure Gas Safety Control Act) 제17조`, `전기사업법 (Electric Utility Act) 제47조`). International standard names (GHS, OSHA PSM) retained in English.
- **Verification**: `bun scripts/safety-audit.ts` → 583 files, 0 errors; canonical-pattern grep → 0 non-canonical titles.

### Changed (2026-06-21 — Documentation Language Policy Pivot: Korean-Default)

Pivoted the documentation language policy from English-default to **Korean-default**, reflecting that Safety OS is a Korea-only EHS/GxP platform serving Korean practitioners exclusively. Forcing English on human operational documentation was counterproductive (usability loss, double maintenance, no international audience). English is now retained ONLY where a justification applies: **Layer A** (system/agent layer — governance files, agent definitions, code, schemas) for cross-platform AI-agent instruction clarity and L1–L2 fork parity, and **Layer B** (international-regulation content — ICH/OECD/GHS/PIC-S/ISO).

- **§4 Language Policy rewritten** in `CLAUDE.md` + `GEMINI.md` (byte-identical body, platform parity held) as a 3-layer classification: Layer A (English required — internationalization), Layer B (English-preferred — international regulation), Layer C (Korean canonical — human operational docs: workflow READMEs, scope docs, user guides). Korean statute proper nouns always preserved as `Korean (English gloss)` per audit-trail integrity.
- **Legal/regulatory glossary SSOT** added at `regulations/KR/legal-glossary.yaml` — 19 Korean statutes (80 codebase-grounded article citations) + 20 international standards. Serves as the canonical statute→English-gloss reference and the validator's Korean allowlist input.
- **`validate-md-language.ts` reoriented** (v1.3.0 → v1.4.0): loads the glossary statute keys as an allowlist so statute citations pass in Layer A files; Layer C operational docs remain Korean-allowed by default. Glossary load failure fails loudly (never silently allows all Korean).

### Changed (2026-06-21 — CONSTITUTION.md Reroute + Repo Cleanup)

- **P0 — `CONSTITUTION.md` reference reroute**: Rewrote the 3-line `CONSTITUTION.md` stub into a concise governance index (Required Reading + Governance Sections tables). Rerouted **12 broken links** across `CLAUDE.md` (6), `GEMINI.md` (5), and `AGENTS.md` (1) to valid in-file anchors. Half the links pointed to nonexistent stub anchors (`CONSTITUTION.md#3`/`#5`) and half to a nonexistent `docs/constitution/` directory; the actual governance content already lived inline in `CLAUDE.md`/`GEMINI.md`, so links were redirected there rather than duplicating content. CLAUDE.md ↔ GEMINI.md platform parity maintained.
- **P1 — Repo cleanup**: Added `templates/common/scripts/` to `.gitignore` (L0/L1 workspace template infrastructure not needed in this L2 variant) and removed its stale auto-generated `README.md` (which referenced a nonexistent `SCRIPTS.md`). Audit script-sync check unaffected (0 shared files).

### Changed (2026-06-21 — 2-Tier Matrix Restructure)

Refactored the **2-Tier Matrix Architecture** section in `README.md` and `README_ko.md` from a flat list (Functional Service rows + redundant Industry Coordinator rows) into a true **Tier 1 (rows) × Tier 2 (columns) matrix**. Industry domains (GxP, ehschem, gasterm, powergen, ehsconst, meddevice) are now column headers, eliminating duplicate coordinator rows and shortening the Pharma column label to `GxP`. The exact applicability data (`✓` cells: psm=ehschem/gasterm/powergen; msds/training/emergency=all 6) is preserved. Both READMEs use an identical 16-line symmetric structure.

### Added (2026-06-17 — GVP Domain v1) — Final GxP Domain

Good Pharmacovigilance Practice (GVP) domain implementation as **seventh and final GxP domain**. Completes pharmaceutical lifecycle coverage (GLP → GCP → GMP → GDP → GVP). Post-market drug safety surveillance per KGVP + ICH E2 series + EU GVP + WHO-UMC.

**Fifth new domain addition** via `docs/_shared/domain-onboarding-guide.md` SOP — pattern fully validated across five consecutive use cases. **All GxP domains now active**.

**Agent** (1):
- `agents/domains/gvp/gvp-agent.md` (new) — Drug Safety Officer support

**Workflows** (8) under `workflows/domains/gvp/`:
- 7 core: `icsr-intake/` (E2B R3), `signal-detection/` (E2E + Module 9), `pbrer-generation/` (E2C R2), `risk-management-plan/` (E2E + Module 5), `pms-study-management/` (Korean-specific), `benefit-risk-assessment/` (Module 12), `labeling-update/` (Module 15)
- `urgent-safety-action-reference/` (reference — dispatches to emergency-agent for recall/restriction/suspension)

**Evidence Models** (7) under `evidence-models/domains/gvp/`:
- All include `ich_e2_compliance`, `pbrer_cycle_ref`, `product_id`, `rmp_version_ref` common fields
- `gvp-icsr-record.json` with WHO-UMC causality + MedDRA coding
- `gvp-signal-record.json` with statistical methods (PRR/ROR/BCPNN/EBGM)
- `gvp-br-record.json` with PrOACT/BRAT/MCDA framework scoring

**Skills** (2) under `skills/domains/gvp/`:
- `signal-detector/` — Disproportionality analysis (PRR, ROR, BCPNN, EBGM)
- `benefit-risk-assessor/` — Multi-framework scoring (PrOACT-URL, BRAT, MCDA)

**Regulations** (2):
- `regulations/KR/MFDS-GVP.yaml` — 약사법 Art 73의2/73의3 + KGVP
- `regulations/international/ICH-E2.yaml` — ICH E2 series (A through F)

**Industry Profile**:
- `industry-profiles/pharmacovigilance.yaml`

**Scope Document**:
- `docs/domains/gvp/scope.md`

**Korean-Specific**:
- PMS (Post-Marketing Surveillance) mandatory 6-8 years for new drugs
- Drug re-evaluation 5-7 year cycle
- KIDS (의약품안전사용센터) voluntary reporting integration
- 15-day expedited ICSR reporting to MFDS

**Cross-Domain Interface** (all 6 GxP + safety domains connected):
- GCP SAE data → GVP (trial context)
- GMP quality defects → GVP safety signals
- GDP cold chain excursions → GVP product safety
- MSDS occupational exposure → GVP signals
- GVP `urgent-safety-action-reference` → `emergency-agent` (5th reference pattern, final)

**Audit Script**:
- `scripts/safety-audit.ts` v2.6.0 → v2.7.0:
  - GVP workflow validation (≥3 legal_basis core, ≥2 reference)
  - GVP evidence model validation (4 required fields)
  - Report now shows all 6 domains (GMP + MSDS + GDP + GLP + GCP + GVP)

**Verification**: 227 files checked, 0 errors (63 workflows: 10 GMP, 7 MSDS, 8 GDP, 8 GLP, 8 GCP, 8 GVP, 14 PSM/EHS).

### Added (2026-06-17 — GCP Domain v1)

Good Clinical Practice (GCP) domain implementation as sixth domain. Covers clinical trial management — protocol design, IRB review, informed consent, monitoring visits, SAE/SUSAR reporting, source data verification per KGCP + ICH E6(R3) + Helsinki Declaration.

**Fourth new domain addition** via `docs/_shared/domain-onboarding-guide.md` SOP — pattern fully validated across four consecutive use cases.

**Agent** (1):
- `agents/domains/gcp/gcp-agent.md` (new) — IRB, ICF, monitoring, SAE specialist

**Workflows** (8) under `workflows/domains/gcp/`:
- 7 core: `protocol-management/` (ICH Sec.3), `irb-review/` (Sec.4), `informed-consent/` (Sec.5), `participant-enrollment/` (Sec.7), `monitoring-visits/` (Sec.8), `sae-reporting/` (E2A), `source-data-verification/` (Sec.9)
- `sae-reporting-reference/` (reference — dispatches to emergency-agent for severe safety signals)

**Evidence Models** (7) under `evidence-models/domains/gcp/`:
- All include `irb_approval_ref`, `ich_e6_compliance`, `protocol_ref`, `site_id` common fields
- `gcp-sae-record.json` includes causality assessment (ImPACT), reporting timelines
- `gcp-source-data-record.json` includes ALCOA+ compliance object

**Skills** (2) under `skills/domains/gcp/`:
- `protocol-deviation-analyzer/` — ICH E6(R3) classification, trend detection, CAPA
- `sae-causality-assessor/` — ImPACT/WHO-UMC/Naranjo algorithms

**Regulations** (2):
- `regulations/KR/MFDS-GCP.yaml` — 의약품 임상시험 관리기준 + 약사법 Art 69/73의2
- `regulations/international/ICH-E6.yaml` — ICH E6(R3) (2025) + Helsinki Declaration

**Industry Profile**:
- `industry-profiles/clinical-research.yaml`

**Scope Document**:
- `docs/domains/gcp/scope.md`

**Cross-Domain Interface**:
- GLP final report → GCP (clinical trial foundation)
- GMP IMP → GCP (investigational medicinal product)
- GCP SAE data → GVP (post-market pharmacovigilance, v3)
- GCP `sae-reporting-reference` → `emergency-agent` (4th reference pattern)

**Safety Reporting Timelines** (Korean KGCP + ICH E2A):
- SUSAR fatal: 7 days to MFDS
- SUSAR other serious: 15 days total
- SAE annual: PSUR

**Audit Script**:
- `scripts/safety-audit.ts` v2.5.0 → v2.6.0:
  - GCP workflow validation (≥3 legal_basis core, ≥2 reference)
  - GCP evidence model validation (4 required fields)
  - Report now shows GMP + MSDS + GDP + GLP + GCP counts

**Verification**: 195 files checked, 0 errors (55 workflows: 10 GMP, 7 MSDS, 8 GDP, 8 GLP, 8 GCP, 14 PSM/EHS).

### Added (2026-06-17 — GLP Domain v1)

Good Laboratory Practice (GLP) domain implementation as fifth domain. Covers non-clinical laboratory studies for pharmaceutical safety testing (MFDS) and chemical hazard assessment (ME/K-REACH). Implements OECD GLP principles for Mutual Acceptance of Data (MAD).

**Third new domain addition** via `docs/_shared/domain-onboarding-guide.md` SOP — pattern fully validated across three consecutive use cases.

**Agent** (1):
- `agents/domains/glp/glp-agent.md` (new) — supports both MFDS and ME GLP contexts

**Workflows** (8) under `workflows/domains/glp/`:
- `test-article-management/` (OECD Sec.7), `study-protocol/` (Sec.8), `study-conduct/` (Sec.9), `data-management/` (Sec.9+10), `personnel-qualification/` (Sec.2), `equipment-calibration/` (Sec.5), `qau-inspection/` (Sec.3)
- `study-inspection-reference/` (reference — dispatches to compliance-agent for regulatory inspections)

**Evidence Models** (7) under `evidence-models/domains/glp/`:
- All include `glp_certification_authority` (MFDS / ME / both / OECD_MAD_only), `oecd_mad_applicable`, `study_director_id`, `msds_record_ref` fields
- `glp-data-record.json` includes ALCOA+ 9-principle compliance check object

**Skills** (2) under `skills/domains/glp/`:
- `glp-data-integrity-checker/` — ALCOA+ validation
- `glp-study-protocol-validator/` — OECD Section 8.3 content verification

**Regulations** (3):
- `regulations/KR/MFDS-GLP.yaml` — 의약품 비임상시험 (MFDS)
- `regulations/KR/ME-KREACH-GLP.yaml` — K-REACH 위해성평가 (ME)
- `regulations/international/OECD-GLP.yaml` — OECD C(97)186/Final (MAD)

**Industry Profile**:
- `industry-profiles/pharma-laboratory.yaml`

**Scope Document**:
- `docs/domains/glp/scope.md`

**Korea-Specific — Dual Authority Tracking**:
- MFDS GLP (의약품 비임상시험, 3-year renewal)
- ME GLP (K-REACH 위해성평가, 3-year renewal)
- OECD MAD (Korea accession 2005, eliminates duplicate testing)

**Cross-Domain Interface**:
- GLP `test-article` ↔ MSDS `msds-record` (`msds_record_ref`)
- GLP final report → GMP IND application support
- GLP `study-inspection-reference` → `compliance-agent` (3rd reference workflow pattern)

**Audit Script**:
- `scripts/safety-audit.ts` v2.4.0 → v2.5.0:
  - GLP workflow validation (≥3 legal_basis core, ≥2 reference)
  - GLP evidence model validation (4 required fields)
  - Report now shows GMP + MSDS + GDP + GLP counts

**Verification**: 163 files checked, 0 errors (47 workflows: 10 GMP, 7 MSDS, 8 GDP, 8 GLP, 14 PSM/EHS).

### Added (2026-06-17 — GDP Domain v1)

Good Distribution Practice (GDP) domain implementation as fourth domain. Covers pharmaceutical supply chain from manufacturer handoff through customer delivery. KGDP + PIC/S + EU GDP + DTS alignment.

**Second new domain addition** via `docs/_shared/domain-onboarding-guide.md` SOP — pattern fully validated.

**Agent** (1):
- `agents/domains/gdp/gdp-agent.md` (new)

**Workflows** (8) under `workflows/domains/gdp/`:
- `goods-receipt/`, `storage-management/`, `temperature-monitoring/`, `transportation/`, `traceability-dts/`, `returned-goods/`, `gdp-self-inspection/` (7 core)
- `product-recall-reference/` (reference workflow — dispatches to emergency-agent)

**Evidence Models** (7) under `evidence-models/domains/gdp/`:
- All include `gdp_certification_status`, `temperature_condition`, `batch_disposition_approved_ref` fields
- `gdp-temperature-monitoring-record.json` includes time-series data and excursion analysis
- `gdp-dts-tracking-record.json` for Korean DTS (Drug Tracking System) compliance

**Skills** (2) under `skills/domains/gdp/`:
- `temperature-excursion-analyzer/` — cold chain excursion impact assessment
- `dts-verification/` — barcode/RFID DTS scan verification

**Regulations** (2):
- `regulations/KR/MFDS-GDP.yaml` — KGDP framework + PIC/S alignment
- `regulations/KR/DTS.yaml` — Korean Drug Tracking System

**Industry Profile**:
- `industry-profiles/pharma-distribution.yaml`

**Scope Document**:
- `docs/domains/gdp/scope.md`

**Cross-Domain Interface**:
- GMP `batch-record` → GDP `goods-receipt` (via `batch_disposition_approved_ref`)
- GDP `product-recall-reference` → `emergency-agent` (data + dispatch)
- GDP → GMP `deviation-capa` (when `deviation_source: manufacturing`)

**Audit Script**:
- `scripts/safety-audit.ts` v2.3.0 → v2.4.0:
  - GDP workflow validation (≥3 legal_basis core, ≥2 reference)
  - GDP evidence model validation (`gdp_certification_status`, `temperature_condition`, `batch_disposition_approved_ref`)
  - Report shows GMP + MSDS + GDP counts

**Verification**: 130 files checked, 0 errors (39 workflows: 10 GMP, 7 MSDS, 8 GDP, 14 PSM/EHS).

### Added (2026-06-17 — MSDS Domain v1)

Complete MSDS (Material Safety Data Sheet) / Chemical Safety domain implementation as the third domain (after PSM, GMP). Migrates and extends existing `chemical-safety-agent` into a full domain structure. OSHA-KR Articles 110-114 + K-REACH + GHS Rev 9 baseline.

**First new domain addition** following `docs/_shared/domain-onboarding-guide.md` SOP — validates the 11-step procedure.

**Agent** (1):
- `agents/domains/msds/msds-agent.md` (migrated from `_shared/chemical-safety-agent.md` + expanded)
- `agents/_shared/occupational-health-agent.md` updated Section B (MSDS data dependency)

**Workflows** (7) under `workflows/domains/msds/`:
- `msds-intake/` (OSHA-KR Art 110) — receive + parse MSDS
- `ghs-classification/` (OSHA-KR Art 243) — GHS Rev 9 classification
- `chemical-approval/` (OSHA-KR Art 113 + TCCL) — new chemical approval
- `chemical-inventory/` (K-REACH Art 10) — monthly inventory
- `kreach-registration/` (K-REACH Art 11) — ME registration
- `hazard-labeling/` (OSHA-KR Art 114) — GHS labels
- `chemical-spill-reference/` (reference workflow) — provides Section 6 data + dispatches to emergency-agent

**Evidence Models** (6) under `evidence-models/domains/msds/`:
- `msds-record.json` — GHS 16 sections full schema (international compatible)
- `ghs-classification-record.json`, `chemical-approval-record.json`, `chemical-inventory-record.json`, `kreach-registration-record.json`, `hazard-label-record.json`
- All include `ghs_version: "rev9"` field with migration tracking

**Skills** (3) under `skills/domains/msds/`:
- `msds-parser/SKILL.md` — Hybrid: Mode 1 rule-based (top 5 Korean suppliers) + Mode 2 ML fallback
- `msds-parser/rules/lotte_chemical.yaml` — first supplier rule (template for others)
- `ghs-classifier/SKILL.md` — GHS Rev 9 ruleset (17 physical + 11 health + 2 environmental hazards)
- `chemical-risk-assessment/SKILL.md` — scenario-based risk characterization

**Regulations** (2):
- `regulations/KR/OSHA-KR-MSDS.yaml` — OSHA-KR Articles 110-114 + 243 + GHS Rev 9 alignment
- `regulations/KR/K-REACH.yaml` — K-REACH Articles 10-14 + thresholds

**Industry Profile** (1):
- `industry-profiles/chemical-handling.yaml` — general chemical handling profile

**Scope Document**:
- `docs/domains/msds/scope.md` — v1 scope, regulatory framework, cross-domain references, role separation matrix

**Pattern Documentation** (1):
- `docs/_shared/reference-workflow-pattern.md` — reference workflow SOP for future domain additions

**Audit Script**:
- `scripts/safety-audit.ts` v2.2.0 → v2.3.0:
  - Added MSDS workflow validation (multi-source legal_basis ≥3 for core, ≥2 for reference)
  - Added MSDS evidence model validation (`ghs_version` field required)
  - Added reference workflow exception handling
  - Report now shows MSDS-specific counts alongside GMP

**Renamed**:
- `evidence-models/_shared/base/gmp-common.schema.json` → `common.schema.json` (multi-domain shared)
- Updated all GMP evidence models' $ref paths to use `common.schema.json`

**Removed**:
- `agents/_shared/chemical-safety-agent.md` (migrated to `agents/domains/msds/msds-agent.md`)

### Verification
- 98 files checked, 0 errors
- 31 workflows (10 GMP, 7 MSDS, others PSM/EHS)
- 28 evidence-models (11 GMP, 6 MSDS, others PSM/shared)
- Domain Onboarding SOP validated (11-step procedure)

### Changed (2026-06-17 — Domain-Based Folder Structure)

Reorganized top-level directories into domain-scalable pattern (`_meta/` + `_shared/` + `domains/<name>/`) per meeting `memory/meeting-2026-06-17-folder-structure-redesign.md`. Anticipates future domain additions (GDP, GLP, GCP, GVP, EHS verticals).

**evidence-models/** restructure (M-1):
- New: `_shared/base/` (corrective-action, finding, gmp-common schemas)
- New: `domains/psm/` (7 PSM records moved)
- New: `domains/gmp/` (11 GMP records moved)
- Updated: all GMP evidence models `$ref` paths from `base/` to `../../_shared/base/`
- Removed: legacy `base/` directory

**workflows/** restructure (M-2):
- New: `_shared/{_template, data-seeding.yaml}`
- New: `domains/psm/` — **PSM flat .md → hierarchical** (7 workflows converted to `schema.yaml + README.md` pattern, now audit-coupled)
- New: `domains/gmp/` (10 GMP workflows moved from `workflows/gmp/`)
- Maintained: `daily/`, `emergency/`, `compliance/` (domain-agnostic)

**docs/ restructure** (M-3):
- New: `_meta/{architecture, blueprint, superpowers, VERSION_MANIFEST, v4.0-playbook, co-safety.context}`
- New: `_shared/{procedures, reports, domain-onboarding-guide}`
- New: `domains/gmp/scope.md`

**skills/ restructure** (M-3):
- New: `_meta/{README, SKILLS.md}`
- New: `_shared/` (15 cross-domain skills)
- New: `domains/gmp/{change-control, deviation-capa, qrm}`
- New: `domains/psm/moc`

**agents/ restructure** (M-3):
- New: `_core/` (pm, safety-governance-manager, safety-workflow-manager)
- New: `_shared/` (14 cross-domain agents: audit, compliance, docs-writer, legal, chemical-safety, contractor-safety, disaster-response, emergency, incident-investigation, occupational-health, reporting, risk-assessment, training, asset-integrity)
- New: `domains/psm/psm-agent.md`
- New: `domains/gmp/gmp-agent.md`

**Audit Script** (M-4):
- `scripts/safety-audit.ts` v2.1.0 → v2.2.0:
  - Updated GMP workflow path: `workflows/gmp/` → `workflows/domains/gmp/`
  - Updated role separation paths for new `agents/_shared/` and `skills/domains/gmp/qrm/`
  - Accept both legacy (`gmp-qrm`) and new (`gmp/qrm`) path patterns

**Agent/Skill References Updated**:
- `agents/domains/gmp/gmp-agent.md`: workflow/skill/evidence paths
- `agents/domains/psm/psm-agent.md`: workflow/skill/evidence paths
- `agents/_shared/risk-assessment-agent.md`: gmp-qrm skill path
- `skills/domains/gmp/{change-control, deviation-capa}/SKILL.md`: gmp-qrm and psm-moc references

**New Documentation**:
- `docs/_shared/domain-onboarding-guide.md`: SOP for adding new domains (GDP, GLP, GCP, GVP, EHS verticals)

**Verification**: 70 files checked, 0 errors (24 workflows with 10 GMP, 22 evidence-models with 11 GMP).

### Added (2026-06-17 — GMP Module v1)
Complete Good Manufacturing Practice (GMP) module implementation benchmarked to PSM module architecture. KP-GMP base + PIC/S alignment + ICH Q7/Q9/Q10 reflection. v1 scope: `pharma-general` only (sterile/API/biologics deferred to v2).

**Agent** (1):
- `agents/gmp-agent.md` — GMP specialist with multi-source legal basis (약사법 Article 34 + 의약품등기준규정 + ICH Q7/Q9/Q10 + PIC/S PE 009)

**Workflows** (10) under `workflows/gmp/`:
- `change-control/` (변경관리, Article 18) — 90% pattern reuse from `psm-moc`
- `deviation-capa/` (이상관리 및 시정예방조치, Article 19)
- `equipment-qualification/` (설비 적격성평가, Article 16) — pattern reuse from PSM MI
- `batch-mfg/` (제조 및 포장기록, Article 12)
- `supplier-qualification/` (공급자 자격부여, Article 12) — pattern reuse from PSM Contractor Mgmt
- `stability/` (안정성 시험, Article 20 + ICH Q1A/Q1E)
- `self-inspection/` (자체점검, Article 15 + PIC/S Chapter 9) — default annual + risk-based adjustment
- `cleaning-validation/` (세정 밸리데이션, Article 17)
- `csv-validation/` (컴퓨터 시스템 적합성평가, Article 17 + 21 CFR Part 11 + GAMP 5)
- `pqr/` (제품품질평가, Article 12 + ICH Q7/Q10) — pattern reuse from PSM PSSR

**Evidence Models** (11) under `evidence-models/`:
- `gmp-change-control-record.json`, `gmp-deviation-record.json`, `gmp-capa-record.json`, `gmp-equipment-qualification-record.json`, `gmp-batch-record.json`, `gmp-supplier-record.json`, `gmp-stability-record.json`, `gmp-self-inspection-record.json`, `gmp-cleaning-validation-record.json`, `gmp-csv-record.json`, `gmp-pqr-record.json`
- All include ALCOA+ audit_trail, e_signature (v1 schema-only), qrm_assessment (ICH Q9 ref), nomenclature (multilingual)
- `evidence-models/base/gmp-common.schema.json` — common definitions

**Skills** (3) under `skills/`:
- `gmp-change-control/SKILL.md` — psm-moc pattern with quality impact extension
- `gmp-deviation-capa/SKILL.md` — deviation + CAPA lifecycle
- `gmp-qrm/SKILL.md` — ICH Q9 methodology matrix (FMEA, HACCP, FTA, cQRM-HAZOP, PHA). Cross-cutting skill referenced by all GMP workflows.

**Regulations** (1):
- `regulations/KR/MFDS-GMP.yaml` + `regulations/KR/MFDS-GMP.md` — KP-GMP reference with PIC/S + ICH mapping. Restores regulations/ directory (intentional for GMP module).

**Industry Profile** (1):
- `industry-profiles/pharma-general.yaml` — pharma general manufacturing profile (v1 scope)

**Scope Document**:
- `docs/gmp/scope.md` — GMP v1 scope, architecture, KPIs, compliance gates

**Agent Update**:
- `agents/risk-assessment-agent.md` — Section B scope clarification: EHS risks only (gmp-qrm handles quality risks, per meeting 2026-06-17 Q3 resolution)

### Changed (2026-06-17 — Audit Script GMP Extension)
- `scripts/safety-audit.ts` v2.0.1 → v2.1.0:
  - Added GMP workflow validation: multi-source `legal_basis` (array, ≥2 entries) check for `workflows/gmp/**/schema.yaml`
  - Added GMP evidence model validation: required common fields (`e_signature`, `qrm_assessment`, `nomenclature`, `audit_trail`) and `legal_basis.minItems ≥ 2` for `evidence-models/gmp-*.json`
  - Added role separation check: verify `risk-assessment-agent.md` references `gmp-qrm` and `product quality`; verify `gmp-qrm/SKILL.md` references `risk-assessment-agent`
  - Report now shows GMP-specific counts: `(${gmpSchemaFiles.length} GMP)` and `(${gmpEvidenceFiles.length} GMP)`

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
