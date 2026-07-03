# Meeting Transcript
**Date**: 2026-07-03
**Topic**: Integrated design centered on Major Turnaround (TAR/대정수) — linking contractor workforce management (contractor-safety-agent), occupational health (occupational-health-agent), asset integrity (asset-integrity-agent), and the `workflows/daily/` layer
**Participants**: ehschem-agent (owner of the turnaround-shutdown-planning workflow), contractor-safety-agent, occupational-health-agent, asset-integrity-agent, safety-workflow-manager (SWM) | Synthesizer: safety-governance-manager (SGM)
**Rounds**: 2
**Language**: Korean (transcript translated to English below)
**Status**: Complete

---

## Pre-meeting fact check (PM, before opening)
- `agents/domains/industry/ehschem/ehschem-agent.md` Handoff Protocols table lists only functional/psm-agent, functional/msds-agent, emergency-agent, industry/gasterm-agent, industry/powergen-agent, PM(CSO) — a direct grep confirms **zero mentions** of asset-integrity-agent, occupational-health-agent, or contractor-safety-agent anywhere in the file.
- `evidence-models/domains/industry/ehschem/ehschem-turnaround-record.json` only has `contractors_involved` (integer headcount) and `permit_to_work_count` (integer count) — no per-contractor, per-worker, or cross-domain reference fields.
- `docs/_shared/user-scenarios_ko.md` already narrates a scenario where msds-agent notifies occupational-health-agent of special-health-exam targets, but occupational-health-agent has zero workflow/evidence-model files anywhere in the repo — that scenario cannot actually execute today.
- No "surge mode" / "intensive tracking" / project-based daily-tracking concept exists anywhere in the codebase prior to this meeting — genuinely new design territory.

## Transcript

### Round 1

**ehschem-agent**: Opened by owning the gap directly — its own Handoff Protocols table and turnaround evidence schema never reference asset-integrity-agent, occupational-health-agent, or contractor-safety-agent, despite a major turnaround being exactly the event where all three agents' workloads spike simultaneously. Asked each agent what a turnaround requires from their domain.

**contractor-safety-agent**: Agreed its `contractor-onboarding` skill is designed for one contractor at a time (intake → qualification → training → certification → access) and would bottleneck badly if run sequentially across dozens of simultaneous TAR contractors. Proposed borrowing ehsconst-agent's existing `subcontractor-management` pattern (contractor_tier, safety_history_score, prequalification_completed) as the starting point for a minimal TAR-surge schema — this becomes its long-deferred MVP wiring (previously A-05), now concretely scoped. Asked ehschem-agent when contractor headcount is finalized during TAR planning, since that's when bulk prequalification needs to trigger.

**occupational-health-agent**: Acknowledged having zero workflow/evidence-model at all. Noted TAR is precisely when its workload peaks: many temporary external workers get short-term exposure to hazardous chemicals, confined spaces, and heat, spiking the population requiring special health exams. Pointed out the already-documented msds-agent → occupational-health-agent notification scenario in `user-scenarios_ko.md` currently has no receiving end. Proposed designing its MVP wiring jointly with contractor-safety-agent's schema (shared contractor roster) rather than independently.

**asset-integrity-agent**: Framed TAR from the equipment angle — a turnaround's entire purpose is halting operations to inspect/maintain equipment, making its own KPIs (100% hazardous-equipment inspection, zero equipment-failure incidents) directly load-bearing here. Noted the SWM-proposed psm-agent boundary clause (from the earlier meeting, item A-04) is still unimplemented, and without it there's no clear answer to "who logs inspection records for which equipment" during TAR. Proposed ehschem-agent hand it a "non-PSM equipment list" during TAR planning, but flagged A-04 as this whole integration's actual prerequisite.

**SWM**: Synthesized the `workflows/daily/` reframing the user had proposed — while daily-cadence tracking doesn't fit this project's normal (event-driven) operating pattern, a 2-4 week TAR event is exactly when day-by-day tracking (contractor site entries, permit-to-work renewals, daily safety patrols) genuinely matters. Proposed redefining `workflows/daily/`'s purpose from "routine steady-state operations" to "the daily tracking window for short, high-intensity project events like TAR," triggered by the existing `planned_start_date`/`planned_end_date`/`duration_days` fields already in `ehschem-turnaround-record.json`. This gives the previously-deprioritized B-01 (execute a daily workflow) renewed, concrete purpose.

### Round 2

**ehschem-agent**: Synthesized all four proposals into a concrete plan: notify contractor-safety-agent at headcount-finalization, auto-link that roster to occupational-health-agent, hand asset-integrity-agent the non-PSM equipment list during planning, and activate SWM's daily layer for the TAR duration. Committed to proposing these as explicit Handoff Protocol entries and evidence-schema reference fields, while deferring actual schema changes to audit-agent's schemaVersion authority.

**contractor-safety-agent**: Agreed to design its minimal schema with a `health_screening_ref` (pointing to occupational-health-agent) built in from the start, avoiding a later retrofit. Will borrow ehsconst's `contractor_tier`, `safety_history_score`, `prequalification_completed` fields, adding TAR-specific `surge_headcount` and `tar_id` fields.

**occupational-health-agent**: Agreed, and specified its own minimal schema fields: `special_health_exam_completion_rate` (pre-TAR completion rate), `heat_exposure_monitoring`, `confined_space_clearance` — the three most common TAR-site health risks (heat, confined space, chemical exposure). Cross-referencing this completion rate against contractor-safety-agent's `surge_headcount` gives an immediate pre-TAR readiness check.

**asset-integrity-agent**: Confirmed no objection to treating A-04 (psm-agent boundary clause) as this entire integration's prerequisite — only after that clause exists can "non-PSM equipment" be clearly defined for the ehschem-agent handoff to mean anything.

## Synthesis (SGM)

This meeting re-integrated previously scattered backlog items (A-04, all three A-05 sub-items, B-01, B-03) into a single executable scenario — Major Turnaround — which is far more actionable than abstract backlog grooming.

**Key restructuring**:
1. The `workflows/daily/` layer's identity is now clear: not "routine daily inspection" but "the daily tracking window for project-scale events like TAR." This does not contradict the earlier finding that daily-cadence work is infrequent for this project overall — it's simply concentrated during TAR-type events.
2. contractor-safety-agent and occupational-health-agent's MVP wiring (previously A-05) will no longer be designed independently — they are designed together with cross-referencing fields from the start.
3. A-04 (asset-integrity-agent/psm-agent boundary) is reconfirmed as the actual prerequisite for the entire integration.

**Action Items**:

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| C-01 | SWM | Medium | Add "non-PSM equipment → asset-integrity-agent" boundary clause to psm-agent doc (formerly A-04, prerequisite for the whole integration) | Both | 4 |
| C-02 | contractor-safety-agent + audit-agent | Medium | Design minimal TAR-surge contractor schema (borrow contractor_tier/safety_history_score/prequalification_completed + new surge_headcount, tar_id, health_screening_ref) | Both | 1-2 (design) → 4 (build) |
| C-03 | occupational-health-agent + audit-agent | Medium | Design minimal TAR health-management schema (special_health_exam_completion_rate, heat_exposure_monitoring, confined_space_clearance), cross-referenced with C-02 | Both | 1-2 → 4 |
| C-04 | asset-integrity-agent | Medium | Design handoff procedure to receive "non-PSM equipment list" from ehschem-agent during TAR planning (starts after C-01) | Both | 4 |
| C-05 | ehschem-agent + docs-writer | Medium | Add asset-integrity-agent/occupational-health-agent/contractor-safety-agent to Handoff Protocols table; propose new reference fields in `ehschem-turnaround-record.json` (actual schema change via audit-agent) | Both | 4 |
| C-06 | SWM | Medium | Design "TAR-mode daily tracking" — activate `workflows/daily/chemical/` for the TAR duration, triggered by `planned_start_date`/`planned_end_date`/`duration_days` (replaces former B-01/B-03) | Both | 4 |
| C-07 | SGM + PM(CSO) | High | Approve C-01 through C-06 as a single Phase 1-2 design gate (one integrated review, not individual approvals) | Both | 1-2 |

**Supersedes**: This integrated design replaces the previously separate A-04, A-05, B-01, B-03, A-01 action items. A-03 (legal-agent/compliance-agent schema integration) is unrelated to TAR and remains a standalone item.
