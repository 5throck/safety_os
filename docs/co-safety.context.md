# Safety OS — Domain Context

> Variant-specific configuration referenced by [docs/context.md](context.md) (the immutable SSOT template,
> mirrored verbatim from `templates/common/docs/context.md` and never modified per-project). Everything in
> this file either supplies domain content the SSOT template doesn't cover, or **overrides** a generic
> SSOT section where this project's actual structure differs from the generic template. Where this file
> overrides a section, it states so explicitly — do not fall back to the SSOT section in that case.

## Purpose
This document provides domain context for all Safety OS agents. Load this at the start of any Safety OS session.

## Project Overview (overrides docs/context.md § Project Overview)

Safety OS (co-safety) is an EHS (Environmental Health & Safety) AI agent platform automating South Korea
regulatory compliance workflows (산업안전보건법/OSHA-KR, 중대재해처벌법/SAPA) across 15 industry/functional
domains — risk assessment, permit-to-work, emergency response, process safety, and compliance audit trails.

**Type**: docs/schema/workflow platform (no application source code — see Directory Layout below)
**Status**: Beta (`variant.json` → `status: beta`, `phaseAComplete: false`)

## Directory Layout (overrides docs/context.md § Architecture → Directory Layout)

This project does not follow the SSOT's generic `src/`-based layout — it is a docs/schema/workflow
platform, not an application. Actual top-level structure:

```
safety_os/
├── agents/              # Role-based agent definitions (agents/_core/, agents/_shared/, agents/domains/)
├── skills/              # Reusable workflow skills — SSOT for all platforms
├── workflows/           # Per-domain workflow schema.yaml + README.md pairs
├── evidence-models/     # JSON schemas for evidence records (per domain + _shared/base)
├── regulations/         # Regulatory reference data (KR/*.yaml, legal-glossary.yaml)
├── industry-profiles/   # Industry-specific profile configs (14 profiles)
├── policies/            # CSO-approved governance policy documents
├── docs/                # context.md (SSOT) + co-safety.context.md (this file) + _meta/ (VERSION_MANIFEST.md, architecture-overview.md)
├── scripts/              # Automation scripts (TypeScript, .ts via bun)
├── memory/               # Session logs (MEMORY.md index + daily logs + findings/ + corrective-actions/)
├── mcp/                  # Project-local MCP server implementations
├── .claude/              # Claude Code settings, commands, skills
├── .gemini/              # Gemini CLI settings, commands, skills
└── .agents/              # Antigravity settings, skills
```

## Key Files (extends docs/context.md § Key Files)

In addition to the SSOT's generic Key Files table, this project has:

| File | Purpose |
|------|---------|
| `CONSTITUTION.md` | Governance index pointing to CLAUDE.md/GEMINI.md/AGENTS.md sections |
| `variant.json` | Variant identity, agent/skill overrides, lifecycle status |
| `PROMOTION_CHECKLIST.md` | Phase A→B promotion conditions and status |
| `scripts/safety-audit.ts` | CSO `legal_basis` ≥3 gate + domain cross-reference integrity (wired into `scripts/audit.ts`) |

> Note: this project does not have `.claude/skills.json` (the SSOT table lists it, but it is not present
> in this variant — `.gemini/skills.json` and `.agents/skills.json` do exist).

## Language Policy Note (extends docs/context.md § Documentation Standards → Language Policy)

The SSOT's Language Policy table applies as-is. Additionally, per `CLAUDE.md §4`, this project uses a
Layer A/B/C model where Korean is the canonical default for domain/user-facing operational docs (workflow
READMEs, scope documents, user guides) — not just an "exception" case. See `CLAUDE.md §4` for the full
Layer A (English-required governance/agent files) / Layer B (international-regulation content,
English-preferred) / Layer C (Korean canonical) breakdown. Not restated here to avoid drift with CLAUDE.md.

## Computational Integrity — Safety OS Applications (extends docs/context.md § Computational Integrity Standards)

The SSOT's Class A domain list applies. In this project it specifically covers the following skills, which
MUST delegate to external tools rather than have the AI estimate results directly:

- `arc-flash-analyzer` — IEEE 1584 incident energy calculations
- `gas-dispersion-analyzer` — LNG/LPG/hydrogen dispersion modeling
- `tank-integrity-validator` — storage tank structural integrity (pressure/temperature/corrosion/fatigue)
- `ess-fire-risk-assessor` — lithium-ion ESS thermal runaway prediction

## Lifecycle Management Note (extends docs/context.md § Lifecycle Management)

In addition to the SSOT's generic Agent/Skill/Script lifecycle rules, this project has Safety-OS-specific
lifecycle rules for **workflows** and **evidence models** (legal_basis gate audits via `safety-audit.ts`,
evidence schema semver + migration requirements) — defined in `CLAUDE.md § Safety OS Lifecycle Rules`.

## Regulatory Framework

### 산업안전보건법 (Occupational Safety and Health Act, OSHA-KR)
- Primary workplace safety framework in South Korea
- Enforced by: 고용노동부 (Ministry of Employment and Labor)
- Key articles:
  - 제15조 — 안전보건관리책임자 직무 (Safety manager duties)
  - 제29조 — 근로자 안전보건교육 (Worker safety training)
  - 제36조 — 위험성평가 실시 (Risk assessment)
  - 제38조 — 안전조치 (Safety measures)
  - 제39조 — 보건조치 (Health measures)
  - 제54조 — 중대재해 발생 시 조치 (Serious accident response)
  - 제63조 — 도급인의 안전보건조치 (Contractor safety)
  - 제93조 — 안전검사 (Safety inspection)

### 중대재해처벌법 (Serious Accidents Punishment Act, SAPA)
- Criminal liability for serious industrial accidents
- Effective: 2022-01-27 (5+ permanent workers)
- Key articles:
  - 제4조 — 사업주·경영책임자 안전보건 확보의무 (CEO safety duty)
  - 제6조 — 중대산업재해 처벌 (Criminal penalties)
  - 제13조 — 중대재해 기록 보존 (Record keeping obligation)

## Agent Hierarchy

```
PM (CSO — Chief Safety Officer)
  Governance track : PM → SGM → strategic decisions
  Operations track : PM → SWM → specialist agents
  Emergency track  : PM → emergency-agent  [SGM bypassed]
```

## Critical Rules

1. **`legal_basis` field is mandatory** in every workflow record — enforced by `scripts/safety-audit.ts`
2. **Regulation content**: store metadata/references only — never embed full statutory text
3. **Evidence schemas** (`evidence-models/_shared/base/`): semver bump + migration script required on any change
4. **Legal interpretation**: user/organization responsibility only — this system provides automation assistance, not legal advice

## Workflow Library

Location: `workflows/daily/manufacturing/`

| Workflow | Legal Basis (≥3 sources, see `regulations/KR/OSHA-KR.yaml`/`SAPA.yaml`) | Agent Chain |
|----------|-------------|-------------|
| risk-assessment | 제36조, 제38조, SAPA 제4조 | SWM → risk-assessment-agent |
| permit-to-work | 제98조, 제38조, SAPA 제4조 | SWM → risk-assessment-agent → compliance-agent |
| equipment-inspection | 제93조, 제108조, SAPA 제4조 | SWM → audit-agent |
| contractor-management | 제63조, 제61조, SAPA 제5조 | SWM → compliance-agent → risk-assessment-agent |
| safety-training | 제29조, 제31조, SAPA 제8조 | SWM → compliance-agent |
| safety-patrol | 제15조, 제16조, SAPA 제4조 | SWM → risk-assessment-agent → audit-agent |

## Evidence Trail

| Schema | ID Format | Status |
|--------|-----------|--------|
| `evidence-models/_shared/base/finding.schema.json` | FIND-YYYY-NNNN | Phase B: read-only |
| `evidence-models/_shared/base/corrective-action.schema.json` | CA-YYYY-NNNN | Phase B: read-only |

> Agents are **read-only** on evidence-models until Phase B promotion is confirmed.
