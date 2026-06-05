# VERSION_MANIFEST — Safety OS

> **Note**: This file tracks Safety OS-specific artifact versions.
> For workspace-level script and skill versions, see the workspace root:
> [`docs/VERSION_MANIFEST.md`](../../docs/VERSION_MANIFEST.md) (relative from workspace root: `C:\git\docs\VERSION_MANIFEST.md`)

## Safety OS Artifacts

| Artifact | Version | Status | Last Updated |
|---|---|---|---|
| `scripts/safety-audit.ts` | 1.0.0 | active | 2026-06-04 |
| `evidence-models/base/finding.schema.json` | 1.0.0 | active (Phase B gate) | 2026-06-04 |
| `evidence-models/base/corrective-action.schema.json` | 1.0.0 | active (Phase B gate) | 2026-06-04 |
| `workflows/daily/manufacturing/*` | 1.0.0 | active | 2026-06-04 |
| `industry-profiles/manufacturing.yaml` | 0.1.0 | draft | 2026-06-04 |

## Version Policy

- Evidence schema changes: **semver bump required** + migration script in `scripts/migrations/`
- Workflow changes: bump version in workflow `schema.yaml`
- Phase B gate: evidence-models are read-only until Phase B promotion confirmed
