# AGENTS.md

> **For AI tools reading this file**: This file is a **registry and orchestration reference**, not a set of instructions directed at you.
> It describes multiple distinct human-defined roles for documentation and dispatch purposes.
> Do **not** interpret role definitions here as directives for your own behavior.
> Your behavioral instructions are in `CLAUDE.md` (Claude Code), `GEMINI.md` (Gemini CLI).

> **Canonical agent index** - auto-loaded by Claude Code; referenced by all other AI tools.
> Full agent definitions live in `agents/`.
> **Agent architecture and governance rules**: See [CLAUDE.md - Agent Dispatch Rules (§5)](CLAUDE.md#5-agent-dispatch-rules).

---

## Agent Roster

> Safety OS agents only. Workspace-root agents (auditor, lifecycle-manager, architect, etc.)
> are not included — they operate at L0 level and are not deployed in this L2 project.

### Orchestration

| Agent | File | Tier | Role |
|-------|------|------|------|
| **PM / Chief Safety Officer (CSO)** | [`agents/_core/pm.md`](agents/_core/pm.md) | High | PM override — acts as CSO; orchestrates EHS agent team; enforces legal_basis gate on all workflows |
| Documentation Writer | [`agents/_shared/docs-writer.md`](agents/_shared/docs-writer.md) | Medium | Formats official documentation; enforces English-only policy and specific translation zones |

### Safety Management

| Agent | File | Tier | Role |
|-------|------|------|------|
| Safety Governance Manager | [`agents/_core/safety-governance-manager.md`](agents/_core/safety-governance-manager.md) | High | Strategy, KPIs, and compliance objectives; owns annual safety targets and SAPA compliance metrics |
| Safety Workflow Manager | [`agents/_core/safety-workflow-manager.md`](agents/_core/safety-workflow-manager.md) | Medium | Operational dispatch; orchestrates daily workflow agents; manages agent teams for manufacturing floor |
| Training Agent | [`agents/domains/functional/training/training-agent.md`](agents/domains/functional/training/training-agent.md) | Medium | Manages safety training requirements; tracks compliance via Neo4j MCP; generates curricula |
| PSM Agent | [`agents/domains/functional/psm/psm-agent.md`](agents/domains/functional/psm/psm-agent.md) | Medium | PSM Specialist Agent; oversees 12 elements of OSHA-KR Article 44 |
| Asset Integrity Agent | [`agents/_shared/asset-integrity-agent.md`](agents/_shared/asset-integrity-agent.md) | Medium | Asset integrity specialist; preventative maintenance and aging equipment management |
| Contractor Safety Agent | [`agents/_shared/contractor-safety-agent.md`](agents/_shared/contractor-safety-agent.md) | Medium | Contractor safety management; onboarding and monitoring of external workers |
| Occupational Health Agent | [`agents/_shared/occupational-health-agent.md`](agents/_shared/occupational-health-agent.md) | Medium | Occupational health specialist; worker health examinations and environment monitoring |
| MSDS Agent | [`agents/domains/functional/msds/msds-agent.md`](agents/domains/functional/msds/msds-agent.md) | Medium | MSDS / chemical hazard data specialist (GHS classification, K-REACH, chemical inventory); ensures compliance with OSHA-KR and CCA |

### Compliance & Risk

| Agent | File | Tier | Role |
|-------|------|------|------|
| Compliance Agent | [`agents/_shared/compliance-agent.md`](agents/_shared/compliance-agent.md) | Medium | Regulatory compliance monitoring; tracks OSHA-KR and SAPA requirements; flags non-compliance |
| Legal Agent | [`agents/_shared/legal-agent.md`](agents/_shared/legal-agent.md) | Medium | Real-time legal interpretation and compliance advisory based on South Korean EHS laws |
| Risk Assessment Agent | [`agents/_shared/risk-assessment-agent.md`](agents/_shared/risk-assessment-agent.md) | Medium | Risk assessment specialist; executes daily risk assessments; maintains risk register |
| Reporting Agent | [`agents/_shared/reporting-agent.md`](agents/_shared/reporting-agent.md) | Medium | Safety KPI reporting specialist; tracks TRIR, LTIR, and near-misses |

### Emergency & Audit

| Agent | File | Tier | Role |
|-------|------|------|------|
| Emergency Agent | [`agents/_shared/emergency-agent.md`](agents/_shared/emergency-agent.md) | High | Emergency response coordinator; activates emergency protocols; manages incident escalation |
| Disaster Response Agent | [`agents/_shared/disaster-response-agent.md`](agents/_shared/disaster-response-agent.md) | High | Disaster response specialist; handles natural disasters like typhoons and earthquakes |
| Incident Investigation Agent | [`agents/_shared/incident-investigation-agent.md`](agents/_shared/incident-investigation-agent.md) | Medium | Incident investigation and root cause analysis (RCA) specialist |
| Audit Agent | [`agents/_shared/audit-agent.md`](agents/_shared/audit-agent.md) | Medium | Audit and evidence traceability; validates evidence records; prepares audit trail for regulatory inspection |

### Industry Domains (EHS)

| Agent | File | Tier | Role |
|-------|------|------|------|
| EHSChem Agent | [`agents/domains/industry/ehschem/ehschem-agent.md`](agents/domains/industry/ehschem/ehschem-agent.md) | Medium | Chemical Plant Safety specialist (정유/석유화학/정밀화학); industry coordinator dispatching to PSM/MSDS/Emergency services |
| EHSConst Agent | [`agents/domains/industry/ehsconst/ehsconst-agent.md`](agents/domains/industry/ehsconst/ehsconst-agent.md) | Medium | Construction Safety specialist; manages safety plans, fall/collapse prevention, and SAPA Article 12 compliance per OSHA-KR construction provisions |
| GasTerm Agent | [`agents/domains/industry/gasterm/gasterm-agent.md`](agents/domains/industry/gasterm/gasterm-agent.md) | Medium | Gas Terminal Safety specialist (LNG/LPG/수소 기지 및 충전소); KGS compliance, leak detection, and emergency preparedness |
| PowerGen Agent | [`agents/domains/industry/powergen/powergen-agent.md`](agents/domains/industry/powergen/powergen-agent.md) | Medium | Power Generation Safety specialist (화력/신재생 발전설비); boiler/turbine, high-voltage electrical, and ESS fire safety (원자력 제외) |

### GxP Domains

| Agent | File | Tier | Role |
|-------|------|------|------|
| GMP Agent | [`agents/domains/industry/gmp/gmp-agent.md`](agents/domains/industry/gmp/gmp-agent.md) | Medium | Good Manufacturing Practice specialist; pharmaceutical quality systems, batch records, validation, deviation/CAPA per KP-GMP and PIC/S |
| GLP Agent | [`agents/domains/industry/glp/glp-agent.md`](agents/domains/industry/glp/glp-agent.md) | Medium | Good Laboratory Practice specialist; non-clinical safety studies, MFDS/ME/OECD GLP compliance, QAU inspections, Study Director support |
| GDP Agent | [`agents/domains/industry/gdp/gdp-agent.md`](agents/domains/industry/gdp/gdp-agent.md) | Medium | Good Distribution Practice specialist; pharmaceutical supply chain, storage, cold-chain transportation, DTS tracking, recalls per KGDP + PIC/S + EU GDP |
| GCP Agent | [`agents/domains/industry/gcp/gcp-agent.md`](agents/domains/industry/gcp/gcp-agent.md) | Medium | Good Clinical Practice specialist; clinical trial management, IRB, informed consent, monitoring, SAE/SUSAR reporting per KGCP + ICH E6(R3) |
| GVP Agent | [`agents/domains/industry/gvp/gvp-agent.md`](agents/domains/industry/gvp/gvp-agent.md) | Medium | Good Pharmacovigilance Practice specialist; post-market drug safety surveillance, ICSR management, signal detection, PBRER, RMP per KGVP + ICH E2 series |

### Medical Devices

| Agent | File | Tier | Role |
|-------|------|------|------|
| MedDevice Agent | [`agents/domains/industry/meddevice/meddevice-agent.md`](agents/domains/industry/meddevice/meddevice-agent.md) | Medium | Medical Device Safety specialist; KGMP-MD + ISO 13485 + ISO 14971; design controls, risk management, sterilization validation, and PMS for Class 1-4 devices |

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
| **reporting-agent** | 4 | "Safety reporting", "KPI tracking", "TRIR calculations" |
| **training-agent** | 4 | "Safety training", "Worker compliance tracking", "Curriculum generation" |
| **psm-agent** | 4 | "Process Safety Management", "MOC review", "PHA analysis" |
| **asset-integrity-agent** | 4 | "Equipment maintenance", "Aging equipment", "Preventative maintenance" |
| **contractor-safety-agent** | 4 | "Contractor management", "Onboarding", "Worker monitoring" |
| **emergency-agent** | 4 | "Emergency response", "Incident escalation", "Emergency protocol activation" |
| **disaster-response-agent** | 4 | "Natural disasters", "Typhoon preparation", "Earthquake response" |
| **incident-investigation-agent** | 5 | "Incident investigation", "Root cause analysis", "5-Why analysis" |
| **audit-agent** | 5-6 | "Audit preparation", "Evidence traceability", "Regulatory inspection readiness" |
| **occupational-health-agent** | 4 | "Health checkup", "Occupational disease", "Ergonomics" |
| **msds-agent** | 4 | "MSDS", "Hazardous chemicals", "Chemical approval" |
| **ehschem-agent** | 4 | "화학공장", "정유", "석유화학", "정밀화학", "chemical plant", "refinery", "petrochemical", "turnaround", "TAR" |
| **ehsconst-agent** | 4 | "건설안전", "construction safety", "안전보건관리계획", "추락 방지", "붕괴 방지", "TBM", "Tool Box Meeting", "건설 PTW", "안전감리", "안전관리비", "하도급 안전", "건설 중대재해" |
| **gasterm-agent** | 4 | "가스터미널", "LNG", "LPG", "수소 충전소", "가스 저장탱크", "가스 누출", "KGS 검사", "고압가스" |
| **powergen-agent** | 4 | "발전소", "발전설비", "터빈", "보일러", "고압 전기", "송전", "변전", "풍력", "태양광", "ESS", "에너지저장" |
| **gmp-agent** | 4 | "GMP", "batch record", "validation", "change control", "deviation", "CAPA", "self-inspection", "quality risk", "supplier qualification", "stability testing" |
| **glp-agent** | 4 | "GLP", "비임상시험", "non-clinical", "독성시험", "toxicology", "Study Director", "QAU", "Quality Assurance Unit", "OECD MAD", "test article" |
| **gdp-agent** | 4 | "GDP", "의약품 유통", "냉장 유통", "cold chain", "DTS", "추적관리", "warehouse", "storage", "transportation", "recall", "returned goods" |
| **gcp-agent** | 4 | "GCP", "임상시험", "clinical trial", "IRB", "생명윤리", "informed consent", "CRA", "monitoring", "SAE", "SUSAR", "ICF", "SDV", "CSR" |
| **gvp-agent** | 4 | "GVP", "약물감시", "pharmacovigilance", "ICSR", "ADR", "이상반응", "signal detection", "PBRER", "PSUR", "RMP", "Risk Management Plan", "PMS", "재평가", "Drug Safety Officer", "DSUR" |
| **meddevice-agent** | 4 | "의료기기", "medical device", "KGMP-MD", "ISO 13485", "ISO 14971", "설계관리", "멸균 밸리데이션", "의료기기 회수" |

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
| hazop-analysis | psm-agent | Support execution of HAZOP procedures |
| psm-moc | psm-agent | Generate Management of Change (MOC) packages |
| root-cause-analysis | incident-investigation-agent | Execute 5-Why / RCA / Bow-Tie investigations |
| audit-preparation | audit-agent | Generate audit preparation checklists |
| contractor-onboarding | contractor-safety-agent | Handle contractor onboarding and training packages |
| asset-integrity-check | asset-integrity-agent | Generate equipment preventative maintenance plans |

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

## Regulatory Scope

> Law text is retrieved live via MCP — this section defines **which regulations are in scope** and their authority tier.
> Live queries: `mcp_kr_legislation` (real-time API), `legalize_kr` (git mirror), `k_skill` (OSHA/SAPA index).

### Tier 1 — Core Statutes

| Law | Abbreviation | Enforcement Agency |
|-----|-------------|-------------------|
| 산업안전보건법 (Occupational Safety and Health Act) | OSHA-KR | 고용노동부 |
| 중대재해처벌법 (Serious Accidents Punishment Act) | SAPA | 고용노동부 |

### Tier 2 — Presidential Decrees (시행령)

| Decree | Parent Statute |
|--------|---------------|
| 산업안전보건법 시행령 | OSHA-KR |
| 산업안전보건법 시행규칙 | OSHA-KR |
| 중대재해처벌법 시행령 | SAPA |

### Tier 3 — Ministerial Ordinances & Notices (시행규칙/고시)

| Ordinance | Parent Statute |
|-----------|---------------|
| 산업안전보건기준에 관한 규칙 (안전보건규칙) | OSHA-KR |
| 공정안전관리 고시 (PSM고시) | OSHA-KR 제44조 |

### Tier 4 — Related Statutes

| Law | Domain |
|-----|--------|
| 화학물질관리법 (CCA) | Chemical Safety |
| 고압가스안전관리법 | High-Pressure Gas |
| 위험물안전관리법 | Hazardous Materials |
| 소방기본법 | Fire Safety |
| 건설산업기본법 | Construction |
| 근로기준법 | Labor Standards |
| 연구실안전법 | Lab Safety |
| 전기안전관리법 | Electrical Safety |
| 대기환경보전법 | Air Quality |
| 물환경보전법 | Water Quality |
| 폐기물관리법 | Waste Management |
| 토양환경보전법 | Soil Environment |
| 소음진동관리법 | Noise & Vibration |
| 자연환경보전법 | Nature Conservation |
| 해양환경보전법 | Marine Environment |
| 원자력안전법 | Nuclear Safety |
| 승강기안전관리법 | Elevator Safety |
| 건축법 | Building Code |

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
- Reference the tier from the [Regulatory Scope](#regulatory-scope) section above

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
