# PROMOTION_CHECKLIST.md — Phase B Promotion Conditions

All 7 conditions below must be satisfied before `Projects/safety-os/` can be promoted to
`templates/co-safety/` via `scripts/l2-to-variant-pipeline.ts`.

## Conditions

| # | Condition | Verification | Status |
|---|-----------|--------------|--------|
| 1 | All 7 agents defined with 3-Section structure (A/B/C) | `bun run agent:verify` passes with 0 errors | ✅ Done (2026-06-05) |
| 2 | All 4 core SKILL.md files completed | `bun scripts/validate-skills.ts` passes | ✅ Done (2026-06-05) |
| 3 | Manufacturing daily workflows x 6 completed (each with `legal_basis` field) | `bun scripts/safety-audit.ts` — 0 missing legal_basis | ✅ Done (2026-06-05) |
| 4 | `scripts/safety-audit.ts` passes with 0 legal_basis missing | Run `bun scripts/safety-audit.ts` — exit code 0 | ✅ Done (2026-06-05) |
| 5 | AGENTS.md updated with Safety agent roster (all 7 agents registered) | `bun run agent:verify` — all 7 agents present | ✅ Done (2026-06-05) |
| 6 | Platform parity validated (CLAUDE.md and GEMINI.md `## Safety OS Context` headings match) | `bun scripts/validate-templates.ts` — P-01 check passes | Pending |
| 7 | `_ORIGIN.md` Phase B manual steps documented and reviewed by user | Human review — check _ORIGIN.md §Manual Phase B Steps is complete | ✅ Done (2026-06-05) |

## Agent Checklist (Condition 1) — ✅ Complete

Each agent file in `agents/` must contain Sections A, B, and C:
- **Section A**: Legal Basis — applicable Korean law articles
- **Section B**: Agent Role & Responsibilities
- **Section C**: Operational Protocols & Escalation Rules

| Agent File | Section A | Section B | Section C | Status |
|-----------|-----------|-----------|-----------|--------|
| `agents/pm.md` (CSO override) | ✅ | ✅ | ✅ | ✅ Done |
| `agents/safety-governance-manager.md` | ✅ | ✅ | ✅ | ✅ Done |
| `agents/safety-workflow-manager.md` | ✅ | ✅ | ✅ | ✅ Done |
| `agents/compliance-agent.md` | ✅ | ✅ | ✅ | ✅ Done |
| `agents/risk-assessment-agent.md` | ✅ | ✅ | ✅ | ✅ Done |
| `agents/emergency-agent.md` | ✅ | ✅ | ✅ | ✅ Done |
| `agents/audit-agent.md` | ✅ | ✅ | ✅ | ✅ Done |

## Skill Checklist (Condition 2) — ✅ Complete

| Skill Directory | SKILL.md | Status |
|----------------|----------|--------|
| `skills/daily/risk-assessment/` | ✅ | ✅ Done |
| `skills/daily/permit-to-work/` | ✅ | ✅ Done |
| `skills/emergency/emergency-response/` | ✅ | ✅ Done |
| `skills/daily/compliance-gap/` | ✅ | ✅ Done |

## Workflow Checklist (Condition 3) — ✅ Complete

Manufacturing daily workflows — each must have `legal_basis` field:

| Workflow | File | legal_basis | Status |
|----------|------|-------------|--------|
| Risk Assessment | `workflows/daily/manufacturing/risk-assessment/README.md` | ✅ 산업안전보건법 제36조 | ✅ Done |
| Permit to Work | `workflows/daily/manufacturing/permit-to-work/README.md` | ✅ 산업안전보건법 제38조 | ✅ Done |
| Equipment Inspection | `workflows/daily/manufacturing/equipment-inspection/README.md` | ✅ 산업안전보건법 제93조 | ✅ Done |
| Contractor Management | `workflows/daily/manufacturing/contractor-management/README.md` | ✅ 산업안전보건법 제63조 | ✅ Done |
| Safety Training | `workflows/daily/manufacturing/safety-training/README.md` | ✅ 산업안전보건법 제29조 | ✅ Done |
| Safety Patrol | `workflows/daily/manufacturing/safety-patrol/README.md` | ✅ 산업안전보건법 제15조 | ✅ Done |

## Remaining Steps Before Phase B

### Condition 2 — Skill Validation
```bash
bun scripts/validate-skills.ts
```

### Condition 6 — Platform Parity
```bash
# From workspace root (C:\git\):
bun scripts/validate-templates.ts --variant co-safety
# Note: templates/co-safety/ does not exist yet — this runs after Phase B pipeline
```

### Condition 7 — Human Review
Review `_ORIGIN.md §Manual Phase B Steps` and confirm all manual copy items are understood.

## How to Run Verification

```bash
# From C:\git\Projects\safety-os\
bun run agent:verify                  # Condition 1 & 5
bun scripts/validate-skills.ts        # Condition 2
bun scripts/safety-audit.ts           # Conditions 3 & 4
```

```bash
# From workspace root C:\git\ (after Phase B):
bun scripts/validate-templates.ts     # Condition 6
```
