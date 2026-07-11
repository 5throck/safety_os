# policies/

Output directory for approved safety policy documents produced by the
Safety Governance Manager (SGM) — see `agents/_core/safety-governance-manager.md`
§Section C Core Workflow, step 4 ("Write approved policy to `policies/`").

## Purpose

Policies here are strategic-layer governance artifacts: organization-wide safety
standards, KPI-driven policy statements, and industry-profile-linked safety
management commitments approved by the CSO (PM). They are distinct from:

- **`workflows/`** — operational execution procedures (Phase 4, tactical)
- **`regulations/KR/`** — external regulatory reference data (not authored by SGM)
- **`docs/governance/`** — supporting documentation (e.g. KPI definitions) that
  policies here may reference

## Naming Convention

`policies/<industry-profile>-<policy-topic>-policy.md`, e.g.
`policies/chemical-handling-risk-tolerance-policy.md`.

## Structure

Each policy document should include:
1. **Scope** — which industry profile(s)/workflows this policy governs
2. **Policy Statement** — the approved standard
3. **Legal Basis** — regulatory sources this policy is grounded in (≥3 sources
   per the CSO mandate, see `regulations/KR/OSHA-KR.yaml` / `SAPA.yaml`)
4. **KPI Linkage** — which `docs/governance/kpi-definitions.md` metrics this
   policy is intended to move
5. **Approval** — CSO sign-off (name, date)
6. **Review Cadence** — when this policy is next due for review

No policy documents exist yet — this directory was previously empty and
undocumented; SGM should populate it as policies are approved.
