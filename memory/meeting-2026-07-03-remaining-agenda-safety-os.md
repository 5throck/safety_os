# Meeting Transcript
**Date**: 2026-07-03
**Topic**: Remaining Safety OS review agenda — legal-agent/reporting-agent non-operational status, `_shared` agent workflow gaps (asset-integrity, contractor-safety, occupational-health), empty `workflows/compliance/`, stub `workflows/daily/` verticals, and QA script bugs (agent-lifecycle-audit.ts / readme-lifecycle-audit.ts)
**Participants**: safety-governance-manager (SGM), safety-workflow-manager (SWM), legal-agent, reporting-agent, compliance-agent, asset-integrity-agent | Synthesizer: audit-agent
**Rounds**: 2
**Language**: Korean (transcript translated to English below)
**Status**: Complete

---

## Transcript

### Round 1

**SGM**: Framed the legal-agent/reporting-agent non-operational status as a **design debt**, not an execution failure — no industry profile or workflow ever explicitly required these two agents, so SWM's dispatch logic never had an entry point for them. Proposed opening a joint SGM+PM(CSO) Phase 1-2 gate to approve at least one reference workflow each, and noted `workflows/compliance/` is empty for the same root reason: compliance-agent has nothing from legal-agent to consume. Asked SWM for an operationally feasible placement.

**SWM**: Agreed with the "design debt" diagnosis — as the harness that assembles agent teams from `workflows/` definitions, SWM's dispatch logic never references legal-agent or reporting-agent because no workflow schema maps to them. Proposed legal-agent join as a **supporting role** validating `legal_basis` fields in existing workflows (GMP change-control, ehsconst SAPA serious-accident) rather than needing a new workflow — riding on existing execution paths. Proposed reporting-agent start as a **batch job** reading existing `memory/findings/` and `memory/corrective-actions/` logs already produced by audit-agent, requiring no new workflow design gate. Asked legal-agent whether the "supporting role" idea is actually workable.

**legal-agent**: Half-agreed. Its core value is real-time legal verification via `mcp-kr-legislation`/K-Skill OpenAPI, but existing workflows' `legal_basis` fields are static text — merely checking field presence duplicates what `safety-audit.ts` already does. Its strict Attribution Rule (`[Source: MOEL OpenAPI / Law ID: XXX]` on every citation) has no corresponding field in any evidence-model schema today — this must be designed together with filling `workflows/compliance/`. Asked compliance-agent whether its gap-report schema has room for source citations.

**reporting-agent**: Fully agreed with SWM's "start as batch job" proposal since it only aggregates existing logs and never generates raw incident data. Flagged a gap: this session's review never confirmed how many records actually exist in `memory/incidents/`, `memory/findings/`, `memory/corrective-actions/` — if raw data is sparse, its "100% TRIR/LTIR accuracy" KPI would be a hollow number. Also noted its escalation rule (LTIR exceeding annual target → escalate to SGM) requires `industry-profiles/*.yaml` to actually contain LTIR/TRIR target fields — asked SGM to confirm whether they exist.

**compliance-agent**: Answered legal-agent — its gap-report structure only defines finding severity (Critical/Major/Minor), with no citation field; agreed this is a genuine schema gap to close together with populating `workflows/compliance/`. Noted its own Workflow Pattern step 2 ("load checklist from `workflows/compliance/`") has never actually been exercised because the directory only contains `.gitkeep`. Raised the same structural problem for asset-integrity-agent (no dedicated workflow directory) and asked which workflow asset-integrity-agent would prioritize building first to break the "no workflow → no usage → no workflow" cycle.

**asset-integrity-agent**: Confirmed being caught in the same cycle. Proposed "hazardous-equipment-inspection" (based on OSHA-KR Article 93) as the top-priority workflow, but noted it substantially overlaps with psm-agent's existing mi-inspection (mechanical integrity) workflow, so role boundaries must be clarified before building anything new. Spoke on behalf of absent contractor-safety-agent and occupational-health-agent (same gap pattern: skill exists but no workflow/evidence-model) and proposed SGM group all three as a single "_shared agents pending deployment" cohort for one combined Phase 1-2 gate rather than designing each individually.

### Round 2

**SGM**: Accepted both legal-agent's citation-field concern and asset-integrity-agent's psm-agent overlap concern as design issues requiring approval, but prioritized reporting-agent's flagged gap (missing LTIR/TRIR targets in industry-profiles) as most urgent since it falls squarely under SGM's own Section B responsibility ("define compliance KPI targets") and has been neglected. Sequenced: (1) SGM fills `industry-profiles/*.yaml` LTIR/TRIR target fields this week — unblocks reporting-agent; (2) SGM+PM jointly approve legal-agent citation field + compliance-agent schema integration design; (3) SWM to resolve asset-integrity-agent/psm-agent role boundary.

**SWM**: Agreed, and took ownership of (3): psm-agent's mi-inspection is scoped to PSM-covered equipment (OSHA-KR Article 44), while asset-integrity-agent should cover general aging-equipment (OSHA-KR Article 93) outside that scope — a lightweight one-line boundary addition to psm-agent's doc, reusing the existing risk-assessment-agent/gmp-qrm separation pattern (the one validated by `safety-audit.ts`'s role-separation check), not a new design. Explicitly declared the agent-lifecycle-audit.ts/readme-lifecycle-audit.ts script bugs out of SWM's harness scope, deferring to audit-agent for final synthesis.

**legal-agent**: Agreed with SGM's sequencing but clarified it does not own step (2) — it can only state the requirement for a citation field; actual evidence-model schema changes fall under audit-agent's schemaVersion policy and require a migration script. Noted the discussion clarified its status was "design debt," not "failure."

**reporting-agent**: Thanked SGM for prioritizing its precondition. Asked SWM/audit-agent whether `evidence-models/base/finding.schema.json` already contains fields needed for TRIR/LTIR calculation (incident type, lost workdays) so it can consume the schema directly without a separate parsing layer.

**compliance-agent**: Agreed with asset-integrity-agent's grouped-gate proposal and legal-agent's "design debt not failure" framing. Noted that once `workflows/compliance/` is populated, its existing gap-report template (Critical/Major/Minor) can be reused directly with legal-agent's citation field added — an extension of an existing pattern, not a blank-slate design, so the effort should be smaller than SGM might expect.

**asset-integrity-agent**: Agreed with SWM's psm-agent boundary resolution. Requested that when SGM opens the "_shared agents pending deployment" gate (asset-integrity, contractor-safety, occupational-health), scope be capped at **MVP wiring** (1 workflow + 1 evidence-model per agent) rather than a full domain build, to avoid the same stagnation flagged in this review.

---

## Synthesis (audit-agent)

**Points of Agreement**:
1. legal-agent/reporting-agent non-operational status is design debt (missing workflow entry points), not execution failure.
2. reporting-agent's activation precondition is the missing LTIR/TRIR target fields in `industry-profiles/*.yaml` — most urgent, lightest item.
3. legal-agent should integrate into existing workflows' `legal_basis` validation rather than get a new workflow, but needs an evidence-model schema change (citation field) first.
4. asset-integrity-agent/contractor-safety-agent/occupational-health-agent should be grouped as one "_shared agents pending deployment" cohort for a single Phase 1-2 gate, scoped to MVP wiring (1 workflow + 1 evidence-model each), not full domain builds.
5. asset-integrity-agent/psm-agent overlap resolves via a one-line boundary addition, reusing the existing risk-assessment-agent/gmp-qrm separation pattern.
6. compliance-agent can reuse its existing gap-report template once `workflows/compliance/` is populated — not a blank-slate design.

**Open Disagreements / Unresolved Questions**:
- Whether `evidence-models/base/finding.schema.json` already contains TRIR/LTIR-required fields (incident type, lost workdays) was not confirmed in this meeting.
- agent-lifecycle-audit.ts / readme-lifecycle-audit.ts bug fixes: SWM explicitly declared these out of scope; no agent in this project's roster owns them (no automation-engineer deployed) — requires a separate PM(CSO)/user decision.
- `workflows/daily/` stub verticals (chemical, construction, datacenter, semiconductor) were not discussed in this meeting — needs a separate agenda/meeting.

**Action Items**:

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | SGM | High | Add LTIR/TRIR target fields to `industry-profiles/*.yaml` (unblocks reporting-agent) | Both | 1-2 |
| A-02 | audit-agent | Medium | Verify `evidence-models/base/finding.schema.json` has TRIR/LTIR fields (incident type, lost workdays); if missing, semver bump + migration script | Both | 4 |
| A-03 | SGM + PM(CSO) | High | Approve integrated design: legal-agent citation field + compliance-agent gap-report schema | Both | 1-2 |
| A-04 | SWM | Medium | Add one-line boundary clause to psm-agent (mi-inspection) doc: "non-PSM equipment → asset-integrity-agent" | Both | 4 |
| A-05 | SGM | High | Open Phase 1-2 gate for "_shared agents pending deployment" cohort (asset-integrity, contractor-safety, occupational-health) — MVP wiring scope (1 workflow + 1 evidence-model per agent) | Both | 1-2 |

**Unassigned (requires PM/user decision)**:
- agent-lifecycle-audit.ts / readme-lifecycle-audit.ts bug fixes — no automation-engineer role deployed in this project.
- `workflows/daily/` stub verticals (chemical, construction, datacenter, semiconductor) — needs separate meeting.
