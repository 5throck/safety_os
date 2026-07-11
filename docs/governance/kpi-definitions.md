# Safety Governance KPI Definitions

Owner: `safety-governance-manager` (SGM). Referenced by `agents/_core/safety-governance-manager.md`
§Responsibilities ("Define compliance KPI targets aligned with regulatory requirements") and
`docs/_meta/blueprint/03-governance.md`. Previously undefined — this file establishes the
initial KPI set; SGM should extend it as new industry profiles and workflows are added.

## 1. LTIFR — Lost Time Injury Frequency Rate

- **Formula**: `(Number of lost-time injuries × 1,000,000) / Total hours worked`
- **Data source**: `memory/incidents/` (incident records with `sapa_qualifying`/severity
  fields) aggregated over the reporting period. Requires `memory/incidents/` to be
  populated by `emergency-agent` and `incident-investigation-agent` per their existing
  workflow patterns.
- **Target threshold**: < 1.0 (industry-typical target for manufacturing/chemical sites;
  SGM should calibrate per selected industry profile in `industry-profiles/`).
- **Reporting cadence**: Monthly, rolled up quarterly for CSO review.
- **Escalation**: Any month where LTIFR exceeds 2× the target triggers an SGM policy
  review per `agents/_core/safety-governance-manager.md` Core Workflow.

## 2. Audit Pass Rate

- **Formula**: `(bun scripts/safety-audit.ts total files checked − errors found) / total files checked × 100%`
- **Data source**: `scripts/safety-audit.ts` output (see `scripts/SCRIPTS.md` for version
  history). Each CI/local run's error count and total-checked count should be logged to
  `memory/YYYY-MM-DD.md` for trend tracking.
- **Target threshold**: 100% (0 errors) — this is a hard compliance gate, not an
  aspirational target; the CSO mandate requires 0 missing/insufficient `legal_basis`
  fields at all times.
- **Reporting cadence**: Every audit run; SGM reviews the trend monthly.
- **Escalation**: Any run with ≥3 errors triggers a `project-review` per the T-03 QA
  escalation trigger (`skills/project-review/SKILL.md`).

## 3. Corrective Action Closure Rate

- **Formula**: `(Corrective actions with status "completed"/"verified") / (Total corrective actions issued in period) × 100%`
- **Data source**: `memory/corrective-actions/*.json` records conforming to
  `evidence-models/_shared/base/corrective-action.schema.json`.
- **Target threshold**: ≥ 90% closed within their `due_date`.
- **Reporting cadence**: Monthly.
- **Escalation**: Any corrective action overdue by 30+ days is escalated per
  `agents/_shared/audit-agent.md` §Escalation Thresholds.

## Future KPIs (not yet instrumented)

- Training compliance rate (% of workers with current certifications) — data source
  `evidence-models/domains/functional/training/training-compliance-record.json`,
  pending the automated expiry-scan script noted in the Training & Operations domain
  review (2026-07-11).
- Contractor safety onboarding completion rate.

SGM should extend this file as new KPIs are approved, and link approved policies in
`policies/` back to the KPI(s) they are intended to move.
