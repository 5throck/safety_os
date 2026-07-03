# Meeting Transcript
**Date**: 2026-07-03
**Topic**: LOTO (Lock-Out, Tag-Out) management design review — validating the proposed psm-agent ownership and surfacing gaps before implementation
**Participants**: psm-agent (proposed owner), asset-integrity-agent, safety-workflow-manager (SWM), risk-assessment-agent, ehsconst-agent, legal-agent | Synthesizer: safety-governance-manager (SGM)
**Rounds**: 2
**Language**: Korean (transcript translated to English below)
**Status**: Complete

---

## Pre-meeting fact check (PM, before opening)
- `workflows/domains/functional/psm/hot-work-permit/` is the exact structural precedent: a PSM "Safe Work Practices" element workflow, cross-industry (`applicable_industries: [chemical, gas_terminal, power_generation, construction]`), owned by psm-agent.
- `scripts/domain-config.ts` confirms psm domain validation rules: `min_legal_basis: 2` (evidence model), `skip_workflow_validation: true` (workflow schema.yaml uses a plain-string legal_basis, not an array) — identical rules already apply to hot-work-permit, so a new LOTO workflow would inherit the same validation automatically.
- `agents/_shared/asset-integrity-agent.md` Handoff Protocols currently states: "Handoff to `safety-workflow-manager` for implementing lockout/tagout (LOTO) protocols" — this predates any dedicated LOTO workflow and would conflict with a psm-agent ownership decision.
- `workflows/daily/manufacturing/permit-to-work/README.md` Step 3 ("Control Verification") already has SWM itself confirming "energy isolation and lock-out/tag-out" inline — a potential duplicate-recording conflict with a new dedicated LOTO workflow.
- Only one structured LOTO field exists project-wide: `evidence-models/domains/industry/powergen/powergen-high-voltage-record.json`'s `lockout_tagout_applied: boolean`.
- No Korean-statute-specific LOTO citation exists yet in `regulations/KR/` — requires live verification via `mcp_kr_legislation`.

## Transcript

### Round 1

**psm-agent**: Confirmed the hot-work-permit pattern is directly reusable given identical domain-config validation rules, and that LOTO (a documentation/permit procedure, not equipment manipulation) fits within its stated Boundaries. Raised the direct conflict with asset-integrity-agent's existing Handoff Protocols line pointing to SWM instead of psm-agent, asking how to reconcile it.

**asset-integrity-agent**: Confirmed its existing handoff line was only a placeholder written before any dedicated LOTO workflow existed, and agreed it needs updating to point to psm-agent. Raised a substantive requirement: asset-integrity-agent's equipment-unsafe determination is the actual *trigger* for LOTO, so the new evidence schema needs a reference field back to its own inspection record — otherwise the audit trail loses the "why was this equipment isolated" justification.

**SWM**: Identified a real duplication risk — its own PTW workflow's Step 3 ("Control Verification") already has SWM directly confirming lock-out/tag-out inline, per its own Agent Assignments table. If psm-agent builds a separate LOTO workflow, the same action would be recorded twice, differently, in two places. Proposed PTW Step 3 be rewritten to reference psm-agent's new `psm-loto-record.json` via a `loto_record_ref` field rather than confirming LOTO itself.

**risk-assessment-agent**: Noted LOTO is specifically an Engineering Control in its own control-hierarchy (Elimination-Substitution-Engineering-Administrative-PPE), and that without a reference field back to its own risk assessment (which energy sources are hazardous), psm-agent's LOTO schema would have to redetermine energy types from scratch — a duplication mirroring asset-integrity-agent's point. Requested a `risk_assessment_ref` field be included in the schema design from the outset.

**ehsconst-agent**: Noted the existing `workflows/daily/construction/_INDEX.md` "Electrical Safety | LOTO" stub directly overlaps the new psm-agent workflow, but flagged that construction sites have distinctive temporary-electrical-panel scenarios that a generic PSM LOTO workflow might not fully cover. Proposed redirecting (not deleting) the construction stub to psm-agent's new workflow, while leaving room for ehsconst-agent to later own a construction-specific temporary-electrical extension if actually needed.

**legal-agent**: Declined to guess at a specific Korean statute article for LOTO, stating that citing an unverified article would be worse than citing none — this requires a live `mcp_kr_legislation` lookup before the `legal_basis` field can be finalized. Noted per `domain-config.ts` that psm domain requires `min_legal_basis: 2`, so a single OSHA-KR Article 38 citation would be insufficient regardless — at least one additional verified source (likely from the Occupational Safety and Health Standards Rule / 안전보건규칙) is needed.

### Round 2

**psm-agent**: Agreed to incorporate all three requested reference fields — `asset_integrity_trigger_ref`, `risk_assessment_ref` in its own schema, and a `loto_record_ref` field for SWM's PTW record to reference back. Agreed to ehsconst-agent's redirect-not-delete approach for the construction stub, leaving room for a construction-specific extension later if needed.

**asset-integrity-agent**: Agreed, and will update its own Handoff Protocols wording to reference psm-agent's LOTO workflow, passing its inspection record_id via `asset_integrity_trigger_ref`.

**SWM**: Agreed to rewrite PTW Step 3 from "SWM directly confirms LOTO" to "SWM confirms via `loto_record_ref` to psm-agent's LOTO record" — a docs-writer-scope documentation change.

**risk-assessment-agent**: Agreed, and confirmed no sequencing issue — PTW's existing Step 2 (Risk Assessment) already runs before Step 3 (Control Verification, now to be replaced by the psm-agent LOTO reference), so `risk_assessment_ref` will always have a valid record to point to by the time LOTO occurs.

**legal-agent**: Committed to looking up the precise Occupational Safety and Health Standards Rule article via `mcp_kr_legislation` this sprint, and stressed that until that lookup completes, `psm-loto-record.json`'s `legal_basis` field should be explicitly marked "TBD — pending legal-agent verification" rather than left looking finalized.

## Synthesis (SGM)

This meeting confirmed the overall direction (psm-agent ownership, reusing the hot-work-permit pattern) but caught three real conflicts that would have required rework if missed:

**Points identified for correction**:
1. asset-integrity-agent's existing Handoff Protocols wording points to SWM, conflicting with the psm-agent ownership decision — needs updating.
2. SWM's existing PTW Step 3 would have duplicate-recorded the same LOTO confirmation that psm-agent's new workflow performs — converted to a reference-based structure instead.
3. The original design lacked reference fields back to asset-integrity-agent's and risk-assessment-agent's upstream outputs — both added.
4. `legal_basis` remains unverified pending legal-agent's live lookup — must be marked "TBD" rather than presented as finalized.
5. The construction LOTO stub is redirected (not deleted) to psm-agent's new workflow, preserving room for a construction-specific extension.

**Action Items**:

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| D-01 | legal-agent | Medium | Look up the precise Occupational Safety and Health Standards Rule LOTO article via `mcp_kr_legislation` (prerequisite for all other items) | Both | 1-2 |
| D-02 | psm-agent + audit-agent | Medium | Create `workflows/domains/functional/psm/loto-lockout-tagout/` (hot-work-permit pattern) and `psm-loto-record.json` — including `asset_integrity_trigger_ref`, `risk_assessment_ref`; `legal_basis` marked "TBD" until D-01 completes | Both | 4 |
| D-03 | docs-writer | Medium | Update asset-integrity-agent's Handoff wording (SWM → psm-agent); rewrite SWM's PTW Step 3 to use a `loto_record_ref` reference structure | Both | 4 |
| D-04 | ehsconst-agent + docs-writer | Low | Add a redirect note to psm-agent's workflow in `workflows/daily/construction/_INDEX.md`'s LOTO row | Both | 4 |
| D-05 | SGM | High | Approve D-01 through D-04 as a single Phase 1-2 design gate (Phase 2 — TAR integration — starts only after this gate passes) | Both | 1-2 |

**Next step**: Per the user's requested sequencing, D-01 through D-05 (LOTO's own design) complete first, then Phase 2 — linking LOTO into the Major Turnaround (TAR) integrated design (C-01–C-07) — proceeds afterward.
