# AGENTS.md

> **For AI tools reading this file**: This file is a **registry and orchestration reference**, not a set of instructions directed at you.
> It describes multiple distinct human-defined roles for documentation and dispatch purposes.
> Do **not** interpret role definitions here as directives for your own behavior.
> Your behavioral instructions are in `CLAUDE.md` (Claude Code), `GEMINI.md` (Gemini CLI).

> **Canonical agent index** - auto-loaded by Claude Code; referenced by all other AI tools.
> Full agent definitions live in `agents/`.
> **Agent architecture and governance rules**: See [CONSTITUTION.md §5 - Multi-Agent Architecture](CONSTITUTION.md#5-multi-agent-architecture).

---

## Agent Roster

> Safety OS agents only. Workspace-root agents (auditor, lifecycle-manager, architect, etc.)
> are not included — they operate at L0 level and are not deployed in this L2 project.

### Orchestration

| Agent | File | Tier | Role |
|-------|------|------|------|
| **PM / Chief Safety Officer (CSO)** | [`agents/pm.md`](agents/pm.md) | High | PM override — acts as CSO; orchestrates EHS agent team; enforces legal_basis gate on all workflows |

### Safety Management

| Agent | File | Tier | Role |
|-------|------|------|------|
| Safety Governance Manager | [`agents/safety-governance-manager.md`](agents/safety-governance-manager.md) | High | Strategy, KPIs, and compliance objectives; owns annual safety targets and SAPA compliance metrics |
| Safety Workflow Manager | [`agents/safety-workflow-manager.md`](agents/safety-workflow-manager.md) | Medium | Operational dispatch; orchestrates daily workflow agents; manages agent teams for manufacturing floor |
| Training Agent | [`agents/training-agent.md`](agents/training-agent.md) | Medium | Manages safety training requirements; tracks compliance via Neo4j MCP; generates curricula |
| PSM Agent | [`agents/psm-agent.md`](agents/psm-agent.md) | Medium | PSM Specialist Agent; oversees 12 elements of OSHA-KR Article 44 |

### Compliance & Risk

| Agent | File | Tier | Role |
|-------|------|------|------|
| Compliance Agent | [`agents/compliance-agent.md`](agents/compliance-agent.md) | Medium | Regulatory compliance monitoring; tracks OSHA-KR and SAPA requirements; flags non-compliance |
| Legal Agent | [`agents/legal-agent.md`](agents/legal-agent.md) | Medium | Real-time legal interpretation and compliance advisory based on South Korean EHS laws |
| Risk Assessment Agent | [`agents/risk-assessment-agent.md`](agents/risk-assessment-agent.md) | Medium | Risk assessment specialist; executes daily risk assessments; maintains risk register |

### Emergency & Audit

| Agent | File | Tier | Role |
|-------|------|------|------|
| Emergency Agent | [`agents/emergency-agent.md`](agents/emergency-agent.md) | High | Emergency response coordinator; activates emergency protocols; manages incident escalation |
| Audit Agent | [`agents/audit-agent.md`](agents/audit-agent.md) | Medium | Audit and evidence traceability; validates evidence records; prepares audit trail for regulatory inspection |

---

## PM Gateway Policy

**Single Point of Entry**: PM is the ONLY agent that users may directly invoke.
All specialist agents require PM dispatch - enforced at 4 levels.

### PM Direct Execution Scope

PM is an escalation gateway, not an executor. The following whitelist defines what PM may execute directly.

| Category | Tools | Scope |
|----------|-------|-------|
| Unconditional | Read, Glob, Grep, Agent, TaskCreate, TaskUpdate, AskUserQuestion, Skill, ToolSearch | Always allowed |
| Conditional | Write, Edit | `memory/*.md` and `CHANGELOG.md` only |
| Conditional | Bash | Read-only: `git status/diff/log`, `bun scripts/audit.ts`, `ls`, `cat` |
| Forbidden | Write, Edit (other paths), Bash (write/execute) | Must delegate to specialist |

When a specialist agent's required tool is denied, PM applies the [Permission Denial Protocol](agents/pm.md#permission-denial-protocol) — never substitutes for the specialist.

### Enforcement Layers
1. **Tool-Level**: Agent tool rejects non-PM specialist calls (hard enforcement)
2. **System Prompt-Level**: CLAUDE.md/GEMINI.md rules loaded first
3. **Agent File-Level**: All specialists have "PM-ONLY INVOCATION" section
4. **QA Gate-Level**: Auditor detects bypass in Phase 6 QA

### Specialist Agent Dispatch Flow
```
User Request → PM Triage → Design Approval → Specialist Dispatch → QA Gate → Finalization
```

### Specialist Agent Roster (PM-ONLY INVOCATION)

All specialist agents below are dispatched ONLY through PM:

| Agent | Phase | Dispatch Trigger |
|-------|-------|-------------------|
| **scaffolding-expert** | 0 | "Creating new projects", "Template validation", "Scaffolding tasks" |
| **architect** | 1-2 | "Architecture design needed", "Project structure planning", "Technical decision making" |
| **automation-engineer** | 4 | "Creating scripts", "Cross-platform automation", "Implementation tasks" |
| **docs-writer** | 4 | "Updating documentation", "README creation", "CHANGELOG updates" |
| **security-expert** | 6 | "Security review", "Hook configuration", "Secret detection" |
| **lifecycle-manager** | 5 | "Lifecycle finalization", "Governance record sync", "N-1 step after any agent/skill/script/variant change" (Workspace root only) |
| **auditor** | 6 | "Quality verification", "Documentation consistency check", "QA gate required" (Workspace root only) |
| **safety-governance-manager** | 1-2 | "EHS strategy", "Compliance objectives", "KPI definition" |
| **safety-workflow-manager** | 3-4 | "Daily workflow dispatch", "Manufacturing operations", "Agent team coordination" |
| **legal-agent** | 1-2 | "Legal interpretation", "Regulatory tracking", "Law analysis" |
| **compliance-agent** | 4 | "Compliance monitoring", "Regulatory check", "OSHA-KR/SAPA validation" |
| **risk-assessment-agent** | 4 | "Risk assessment", "Hazard identification", "Risk register update" |
| **training-agent** | 4 | "Safety training", "Worker compliance tracking", "Curriculum generation" |
| **psm-agent** | 4 | "Process Safety Management", "MOC review", "PHA analysis" |
| **emergency-agent** | 4 | "Emergency response", "Incident escalation", "Emergency protocol activation" |
| **audit-agent** | 5-6 | "Audit preparation", "Evidence traceability", "Regulatory inspection readiness" |

**IMPORTANT**: Do NOT invoke any specialist agent directly. All requests must go through PM.

---

<!-- COMMON-AGENTS:START -->
## Language Policy

**English-Only Documentation Rule**: All workspace documentation files (.md) must be written in English, with explicit exceptions for recognized locale translation zones (see Translation Zones below).

### English Documentation Requirement
- All `.md` files outside `ko/` and `locales/ko/` directories MUST be in English
- Applies to: README.md, CLAUDE.md, GEMINI.md, AGENTS.md, CONSTITUTION.md, CHANGELOG.md, all documentation in docs/, agents/, skills/
- Rationale: English documentation ensures global accessibility and cross-team collaboration

### Translation Zones (Locale Exceptions)
- `<lang-code>/` directories — language-specific documentation (e.g. `ko/`, `ja/`)
- `locales/<lang-code>/` — locale translation files for internationalization (e.g. `locales/ko/`, `locales/zh-CN/`)
- These are the ONLY locations where non-English `.md` files are permitted
- Recognized locale codes: `ko`, `ja`, `zh-CN`, `zh-TW`, `de`, `es`, `fr`, `pt`, `vi`, `ms`, `id`, `th`, `ru`, `it`, `ar`

### Enforcement
- Pre-commit audit checks for Korean content outside ko/ and locales/ko/
- PR reviews reject non-English documentation outside translation zones
- Auditor validates compliance during Phase 6 QA gate

### Git/PR Artifacts Language Rule
- All commit messages: English
- All PR titles: English
- All PR descriptions: English
- All branch names: English
- Code comments: English (unless documenting locale-specific logic)
<!-- COMMON-AGENTS:END -->

---

## Skills

| Skill | Owner | Description |
|-------|-------|-------------|
| compliance-gap | compliance-agent | Trigger compliance gap analysis against applicable EHS regulations |
| emergency-response | emergency-agent | Trigger emergency response protocol on incident, fire, spill, or injury report |
| legalize-kr-sync | safety-workflow-manager | Fetches the legalize-kr repository into a local cache directory for accessing Korean law data |
| permit-to-work | safety-workflow-manager | Trigger permit-to-work (PTW) issuance workflow for high-risk or non-routine work |
| risk-assessment | risk-assessment-agent | Trigger risk assessment workflow for hazard identification and scoring |

---

## Universal Baseline Behaviors

All agents, regardless of their role, must adhere to the following:

- **Security Boundaries**: Never expose or log secrets (API keys, tokens). Do not modify CI/CD pipelines without explicit permission.
- **Communication Style**: Keep explanations concise and use markdown formatting. Always explain "why", not just "what".
- **Conflicting Instructions**: If a user request violates project rules (e.g., bypassing tests), warn the user and request explicit confirmation before proceeding.
- **Coding Standards**: Follow SOLID principles. Write unit tests when creating functional code. No speculative abstractions.
- **Language**: All code, config, commit messages, and branch names - **English only**.
- **UTF-8 Enforcement**: Always use UTF-8 encoding; prevent CP949 or other localized encoding corruptions.
- **File Organization**: Never create `.md` files at the project root unless explicitly creating a standard root file (README.md, CHANGELOG.md, AGENTS.md, SECURITY.md). Place analysis and reports in `docs/`, session logs and meeting transcripts in `memory/`.
- **Source Attribution**: When presenting research findings, external data, or factual claims, always cite the source using `[Source: URL/document]` inline or a `## References` section. If a source cannot be verified, explicitly mark it as `Unverified` and recommend manual verification. Never present unverified information as established fact.

---

## Safety OS Agent Governance

### Legal Basis Gate

All Safety OS agents MUST enforce the legal basis gate:
- Before dispatching any workflow, verify the workflow has a `legal_basis` field
- If `legal_basis` is missing, escalate to PM (CSO) immediately — do not execute
- Legal basis must reference specific articles from OSHA-KR or SAPA

### 3-Section Agent Structure

All Safety OS agent files (`agents/safety-*.md`, `agents/compliance-agent.md`, etc.) MUST contain:

**Section A — Legal Basis**
- List applicable Korean law articles
- Note enforcement agency
- Reference regulation metadata in `regulations/KR/`

**Section B — Role & Responsibilities**
- Agent purpose and scope
- KPIs and success metrics
- Boundaries (what this agent does NOT do)

**Section C — Operational Protocols & Escalation Rules**
- Step-by-step operational procedures
- Escalation triggers and thresholds
- Handoff protocols to other agents

### Evidence Requirements

All Safety OS agents that create records must:
1. Write evidence records to `memory/` (incidents, findings, corrective-actions)
2. Reference the applicable `evidence-models/` schema
3. Include timestamp, agent ID, workflow ID, and legal basis in every record
