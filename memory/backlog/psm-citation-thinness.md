# Backlog: PSM Single-Source Citation Thinness (Gap-16)

status: closed
priority: low
blocking: false
created: 2026-07-05
closed: 2026-07-05
source: memory/findings/compliance-gap-2026-07-05-all-domains.md (Gap-16), memory/meeting-2026-07-05-legal-citation-audit-followup.md (B-03)

## Summary

10 of 15 PSM workflow schemas cite only a single bare "OSHA-KR Article 44" as their `legal_basis`:

- `workflows/domains/functional/psm/contractor-management/schema.yaml`
- `workflows/domains/functional/psm/mi-inspection/schema.yaml`
- `workflows/domains/functional/psm/moc-process/schema.yaml`
- `workflows/domains/functional/psm/pha-hazop/schema.yaml`
- `workflows/domains/functional/psm/psi-management/schema.yaml`
- `workflows/domains/functional/psm/pssr-review/schema.yaml`
- `workflows/domains/functional/psm/sop-management/schema.yaml`
- `workflows/domains/functional/psm/employee-participation/schema.yaml`
- `workflows/domains/functional/psm/hot-work-permit/schema.yaml`
- `workflows/domains/functional/psm/psm-worker-training/schema.yaml`

This is **not a defect** — PSM is exempt from the array/count `legal_basis` policy (`skip_workflow_validation: true` in `scripts/domain-config.ts`) and every citation checked was accurate. It is, however, substantively thinner than sibling PSM workflows (`eap-emergency-planning`, `incident-investigation-psm`, `psm-compliance-audit`, `trade-secrets-management`, `loto-lockout-tagout`) which cite 3-4 well-matched, multi-source citations.

## Why this was NOT bundled into the Critical/Major remediation cycle

Decided in the 2026-07-05 follow-up meeting: mixing a discretionary citation-quality upgrade into a PR fixing actual defects (e.g., `trade-secrets-management`'s non-canonical statute name) would muddy the audit trail between "required fix" and "improvement." Tracked separately per that decision.

## Suggested approach (when picked up)

Use `workflows/domains/functional/psm/loto-lockout-tagout/schema.yaml` as the template — it cites 4 well-matched sources (OSHA-KR Art 38, 안전보건기준에관한규칙 제92조, SAPA Art 4, SAPA Art 5). Candidate additional articles per workflow (from the original audit, not yet verified against live law data):

| Workflow | Candidate additional article |
|---|---|
| mi-inspection | OSHA-KR Article 93 (안전검사) |
| pha-hazop | OSHA-KR Article 36 (위험성평가) |
| employee-participation | OSHA-KR Article 24 (산업안전보건위원회) |
| psm-worker-training | OSHA-KR Article 29 (근로자 안전보건교육) |
| contractor-management, moc-process, psi-management, pssr-review, sop-management, hot-work-permit | Not yet assessed — needs a fresh candidate-article pass |

## Owner / next step

Unassigned. When picked up: dispatch `psm-agent` to verify candidates via `legalize_kr`/`mcp_kr_legislation` (same pattern used for the 2026-07-05 remediation), then add to each schema's `legal_basis`.

## Resolution (2026-07-05)

All 10 workflows upgraded to a 3-source `legal_basis` array (OSHA-KR Article 44 + topically-specific OSHA-KR article + 중대재해처벌법 Article 4), using the candidate articles listed above (all already-verified glossary entries — no new statute research needed):

| Workflow | Companion article added |
|---|---|
| contractor-management | OSHA-KR Article 61 |
| mi-inspection | OSHA-KR Article 93 |
| moc-process | OSHA-KR Article 14 |
| pha-hazop | OSHA-KR Article 36 |
| psi-management | OSHA-KR Article 110 |
| pssr-review | OSHA-KR Article 38 |
| sop-management | OSHA-KR Article 14 |
| employee-participation | OSHA-KR Article 24 |
| hot-work-permit | OSHA-KR Article 98 |
| psm-worker-training | OSHA-KR Article 29 |

**Bonus finding during this pass**: the three "template" workflows this backlog cited as good examples (`eap-emergency-planning`, `incident-investigation-psm`, `psm-compliance-audit`) turned out to have the same 중대재해처벌법 Article 7→4 mis-citation already fixed elsewhere in the 2026-07-05 remediation — they were mis-assessed as "OK" by the original audit pass. Corrected as part of this batch.

Verified via `bun scripts/safety-audit.ts`: 618 files, 0 errors.
