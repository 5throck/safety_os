# Compliance Gap Report — Legal Citation Audit (All Domains)
date: 2026-07-05
assessor: PM (CSO) via compliance-agent (4 parallel domain-cluster dispatches)
legal_basis: 산업안전보건법, 중대재해처벌법 (+ domain-specific statutes, see detail below)
status: approved

## Scope

Full-repo audit of `legal_basis` citation presence, accuracy, and substantive fit across:
- Functional domains: msds (7), psm (15), training (8), contractor-safety (1), occupational-health (1) — 32 workflows
- Pharma/GxP industry domains: gmp (10), gdp (8), glp (8), gcp (8), gvp (8) — 42 workflows
- Energy/construction/chemical industry domains: ehsconst (9), gasterm (12), powergen (8), ehschem (8), meddevice (8) — 45 workflows
- Emergency (9) + daily/manufacturing (6) + daily `_INDEX.md` stubs (4) — 19 items

**Total: 138 workflow definitions reviewed** against `regulations/KR/legal-glossary.yaml` (canonical citation source), `regulations/KR/*.yaml` / `regulations/international/*.yaml` detail files, and `scripts/domain-config.ts` policy (`min_legal_basis >= 3` universal, `>= 2` for `workflow_type: reference`).

**Method note**: `bun scripts/safety-audit.ts` could not be executed directly — the CLI Bash tool's Git Bash invocation was broken in this session. The script's validation logic (read from source) was replicated manually/by dispatched agents instead of run mechanically. Recommend re-running `bun scripts/safety-audit.ts` in a working shell to confirm the mechanical (presence/count/schema) checks match this audit's findings before closing this report.

## Gap Summary

> **Update (2026-07-05, later same day)**: `mcp-kr-legislation` and `legalize_kr` MCP servers came online this session (previously "still connecting"). The verification-gated items below have been re-checked against live law data where possible. See "MCP Verification Addendum" section at the end of this report for full detail and raw citations.

### Critical

| # | Location | Requirement | Current State | Gap | Risk |
|---|----------|-------------|----------------|-----|------|
| 1 | `workflows/emergency/disaster-response/schema.yaml` | Cite the correct statute/article for the general safety-assurance obligation | Cites "산업안전보건법 Article 5 (안전확보 의무)" | Article 5 does not exist in OSHA-KR's article set per glossary; the topic ("안전확보 의무") is actually SAPA Article 4. Statute-crossed citation on a life-safety, SAPA-triggering workflow. | Critical |
| 2 | 6 emergency workflows: `confined-space-rescue`, `disaster-response`, `electrical-emergency`, `high-angle-rescue`, `mechanical-accident`, `medical-emergency` | Cite SAPA's general safety-and-health assurance obligation article | All cite "중대재해처벌법 Article 7" | SAPA Art 7 is actually "Dual liability — corporate penalty (양벌규정)," a narrow provision, not the general obligation article (that is Art 4). Systemic, repeated mis-citation across the highest-stakes (life-safety) workflow cluster. | Critical |
| 3 | `workflows/domains/functional/msds/chemical-approval/schema.yaml` | Cite current chemical-control statute | Cites "유해화학물질 관리법 (TCCL)" | TCCL is documented in `K-REACH.yaml` as `status: partially_superseded` — largely absorbed into 화학물질관리법 (CCA). Schema cites a legacy/superseded statute name. | Critical |
| 3a | `ehsconst/subcontractor-management/schema.yaml` | Cite article substantively matching subcontractor safety management | Cites "건설산업기본법 Article 45" | **Verified via `legalize_kr` (MST 273435)**: Article 45 = "경영합리화 등의 노력" (general business-management-rationalization duty — order establishment, financial management), unrelated to subcontractor safety. **Reclassified from Major(unverified) → Critical (confirmed wrong article)**. | Critical |
| 3b | `ehsconst/daily-safety-inspection/schema.yaml`, `ehsconst/tbm-tool-box-meeting/schema.yaml` | Cite article substantively matching daily inspection / toolbox-meeting content | Both cite "건설산업기본법 Article 83" | **Verified via `legalize_kr`**: Article 83 = "건설업의 등록말소 등" (business-registration cancellation / administrative sanction), unrelated to daily safety inspection or TBM. **Reclassified from Major(unverified) → Critical (confirmed wrong article)**. | Critical |

### Major

| # | Location | Requirement | Current State | Gap | Risk |
|---|----------|-------------|----------------|-----|------|
| 4 | `psm/trade-secrets-management/schema.yaml` | Cite canonical trade-secret statute | Cites "영업비밀보호법" | Not a canonical statute name (actual: 부정경쟁방지 및 영업비밀보호에 관한 법률). K-REACH Art 13 (CBI protection) is already tracked in the glossary and directly on-topic but unused. | Major |
| 5 | `msds/chemical-spill-reference/schema.yaml` | Cite spill-specific accident-preparedness law | `[OSHA-KR Art 110, 위험물안전관리법, GHS]` | Missing 화학물질관리법 (CCA) Art 23 (사고대비물질/accident-preparedness substances) and/or OSHA-KR Art 54 (Action upon Serious Accidents) — the two most substantively relevant sources for spill response. | Major |
| 6 | `workflows/emergency/confined-space-rescue/schema.yaml` | Cite the correct confined-space provision | Cites "산업안전보건법 Article 63 (밀폐공간 작업)" | Glossary confirms Art 63 = "Ordering party's safety and health measures (도급인)," unrelated to confined-space work. The real confined-space article (안전보건기준에관한규칙, separate statute) is not in the glossary's curated list — needs SME lookup and glossary update. | Major |
| 7 | *(superseded — see Critical 3a/3b above; 건설산업기본법 is a real, currently-effective law (MST 273435), so the finding moved from "unverified statute" to "confirmed wrong article")* | — | — | — | — |
| 8 | 5 workflows across gasterm/powergen/ehschem | Canonical statute name | Cite "재난관리기본법" | **Verified via `legalize_kr`**: real, current law (MST 283851), canonical name **재난 및 안전관리 기본법**. Not fabricated — just an informal shorthand. Downgraded from "unverified" to a naming-precision fix; article-level content still unverified (no article number cited in any of the 5 workflows — needs follow-up). | Major (was flagged higher-uncertainty; now confirmed real + needs article number) |
| 9 | 6 workflows (gasterm/powergen/ehschem) citing "위험물안전관리법" with no article | Article-level citation matching workflow content | No article number cited | **Verified via `legalize_kr`** (MST 260549, full structure retrieved): candidate correct articles identified — Art 5/6 (저장·취급 제한 및 시설 설치·변경, for storage/handling-type workflows like `chemical-storage-management`, `tank-storage-management` equivalents) and Art 27 / Art 22-2 (응급조치·통보 및 사고조사, for leak/emergency-type workflows like `gas-emergency-preparedness`, `gas-leak-detection-response`, `loading-unloading-safety`). Each of the 6 workflows should cite the specific article matching its own operational content rather than the bare statute name. | Major |
| 10 | `powergen/ash-chemical-waste-management`, `ehschem/environmental-monitoring` | Cite the correct environmental statute | Cite generic "환경보전법" | Matches neither of the glossary's two distinct statutes (대기환경보전법 / 수질환경보전법) — imprecise or duplicate citation. Not yet checked against live law data this pass — still open. | Major |
| 11 | `powergen/renewable-energy-facility-safety/schema.yaml` | Canonical statute name | Cites "신재생에너지법 Article 12" | **Verified against `regulations/KR/Renewable-Energy-Act.yaml`**: canonical name is 신에너지 및 재생에너지 개발·이용·보급 촉진법; that file's own tracked article list confirms **Article 12 = "신재생에너지 시설 안전"** — an exact substantive match. Only the informal abbreviation needs replacing with the canonical name; the article number is correct. Note: `legalize_kr` does not have this act indexed under any name variant tried, so this verification rests on the in-repo regulation file (itself sourced from `mcp-kr-legislation` per its header), not a live MCP re-confirmation. **Downgraded from Major → Minor** (naming fix only, not a substantive error). | Minor |
| 12 | `workflows/emergency/chemical-release/schema.yaml` | Article-level, scenario-specific citation | `[CCA (no article), OSHA-KR Art 38, 환경보건법 (no article)]` | 2 of 3 entries lack article numbers; the precise CCA Art 23 (사고대비물질) is available in the glossary but unused; no SAPA citation despite being a clear SAPA-trigger scenario. | Major |
| 13 | `workflows/daily/datacenter/_INDEX.md` | Scenario-relevant citation | Cites "OSHA-KR Article 38" only | Most generic possible citation; zero datacenter-specific fit (no electrical/fire/power-cooling hazard linkage). Acceptable as a placeholder stub but should be revisited once real datacenter workflows are built. | Major |

### Minor (documentation/glossary hygiene — not workflow defects)

| # | Location | Finding |
|---|----------|---------|
| 14 | `regulations/KR/legal-glossary.yaml` (Art 31 entry) | Glossary labels OSHA-KR 제31조 as "Mechanical/equipment safety measures," but `OSHA-KR-Training.yaml` maps the same article to "특별안전보건교육 (위험작업)." The two "source of truth" files disagree with each other — glossary should be reconciled; the workflow (`special-safety-training`) itself is correct per the domain-specific file. |
| 15 | Glossary completeness gaps | The following statutes/standards are cited consistently and substantively-correctly across workflows but are **not indexed** in `legal-glossary.yaml`: 생명윤리법 (GCP), EU GDP (GDP), EU GVP (GVP), 독성시험 책임자 규정 (GLP), 소방기본법 (emergency), 응급의료에 관한 법률 (emergency). Recommend adding all to the glossary for future auditability. |
| 16 | PSM workflow citation thinness | 10 of 15 PSM workflows (contractor-management, mi-inspection, moc-process, pha-hazop, psi-management, pssr-review, sop-management, employee-participation, hot-work-permit, psm-worker-training) cite only a single bare "OSHA-KR Article 44" — technically exempt from the array/count rule (`skip_workflow_validation: true`) but substantively thinner than sibling PSM workflows (`eap-emergency-planning`, `incident-investigation-psm`, `psm-compliance-audit`, `trade-secrets-management`, `loto-lockout-tagout`) which cite 3-4 well-matched sources. `loto-lockout-tagout` is the strongest example in the whole domain and a good template to replicate. |
| 17 | GMP schema structure | All 10 GMP schemas omit the `workflow_type` field present in the other 4 pharma domains — structural inconsistency, not a legal defect. |
| 18 | `glp/study-protocol/schema.yaml` | Cites bare "약사법" with no article number, unlike sibling GLP workflows. |
| 19 | Daily/manufacturing schema↔README sync | `equipment-inspection`, `permit-to-work`, `safety-patrol` each have a schema.yaml `legal_basis` string that captures only one of two-plus articles discussed in the companion README §2 — and in `safety-patrol`'s case the README's own stated basis (제15조/16조) actually differs from the schema's (제62조). Should be reconciled. |

## Positive Confirmations (no action needed)

- **meddevice 의료기기법/EU MDR Article 83 mismapping** — previously documented in the glossary as a known issue — is **fully resolved** across all meddevice workflows (`device-pms` now correctly cites "EU MDR Article 83" explicitly rather than the wrong "의료기기법 제83조").
- **Pharma/GxP cluster (gmp/gdp/glp/gcp/gvp, 42 workflows)** — zero Critical/Major findings. All meet the ≥3 legal_basis policy with accurate, substantively correct citations (notably GVP workflows correctly cite ICH E2-series/약사법 pharmacovigilance articles rather than leaking in GMP/GCP articles).
- **Functional domains (msds/training/contractor-safety/occupational-health)** — largely healthy; training domain in particular has consistently accurate, well-matched triads.
- **Daily/manufacturing cluster** — all citations verified accurate against the glossary (only minor sync gaps noted above).

## Corrective Action Plan

| # | Gap Ref | Action | Owner | Priority |
|---|---------|--------|-------|----------|
| 1 | Gap-1, Gap-2 | Correct emergency-workflow SAPA/OSHA-KR citations: replace "중대재해처벌법 Art 7" → "Art 4" in the 6 affected workflows; fix `disaster-response`'s "OSHA-KR Art 5" → correct statute/article | Safety governance / legal-agent verification | Critical — highest-stakes (life-safety, SAPA-exposure) workflows |
| 2 | Gap-3 | Update `msds/chemical-approval` to cite 화학물질관리법 (CCA) instead of superseded TCCL | msds-agent / docs-writer | Critical |
| 3 | Gap-4 | Correct `psm/trade-secrets-management` statute name; consider adding K-REACH Art 13 | psm-agent | Major |
| 4 | Gap-5, Gap-13 | Add CCA Art 23 / OSHA-KR Art 54 to `chemical-spill-reference` and `chemical-release` | msds-agent, emergency workflow owner | Major |
| 5 | Gap-6 | Research and add correct confined-space statute/article (likely 안전보건기준에관한규칙) to glossary, then fix `confined-space-rescue` | legal-agent (via mcp-kr-legislation) | Major |
| 6 | Gap-8, Gap-9, Gap-10 | **Partially complete (2026-07-05)**: 건설산업기본법 and 재난및안전관리기본법 confirmed real via `legalize_kr`; 위험물안전관리법 candidate articles identified. Remaining: add verified entries to `legal-glossary.yaml`; resolve 환경보전법 precision (Gap-10, not yet checked); confirm confined-space provision (still blocked — no data source found this session) | legal-agent | Major |
| 7 | Gap-14, 15 | Reconcile Art 31 glossary/training-file discrepancy; add missing statute entries (생명윤리법, EU GDP, EU GVP, etc.) to glossary | docs-writer | Minor |
| 8 | Gap-16 | Strengthen thin PSM citations using `loto-lockout-tagout` as template | psm-agent | Minor |
| 9 | Gap-17, 18, 19 | Normalize GMP `workflow_type` field; add article to `glp/study-protocol`; reconcile daily/manufacturing schema↔README sync gaps | docs-writer | Minor |
| 10 | — | Re-run `bun scripts/safety-audit.ts` in a working shell to confirm mechanical presence/count checks corroborate this manual audit | PM/CSO | Housekeeping |

## MCP Verification Addendum (2026-07-05, later same day)

`mcp-kr-legislation` and `legalize_kr` — both listed as "still connecting" at the time the original audit above was produced — came online later in this session. Verification performed:

| Statute checked | Tool | Result |
|---|---|---|
| 산업안전보건법 제38조 (smoke test) | `mcp_kr_legislation.interpret_regulation` | Confirmed — content matches `legal-glossary.yaml` exactly. |
| 건설산업기본법 | `legalize_kr.get_law_metadata` + `parse_law_structure` | Real, current law (MST 273435, last amended 2025-08-26). Article 45 = "경영합리화 등의 노력"; Article 83 = "건설업의 등록말소 등". Neither matches the workflows citing them (see Critical 3a/3b). |
| 재난 및 안전관리 기본법 (informally cited as "재난관리기본법") | `legalize_kr.get_law_metadata` | Real, current law (MST 283851). Canonical name confirmed; article-level content not yet checked. |
| 위험물안전관리법 | `legalize_kr.get_law_metadata` + `parse_law_structure` | Real, current law (MST 260549). Full structure retrieved; candidate articles identified for the 6 citing workflows (see Major-9). |
| 신에너지 및 재생에너지 개발·이용·보급 촉진법 (informally cited as "신재생에너지법") | `legalize_kr.get_law_metadata` (multiple name variants tried) | **Not found in `legalize_kr`'s index under any variant tried.** Canonical name + Article 12 content confirmed instead via `regulations/KR/Renewable-Energy-Act.yaml` (sourced from `mcp-kr-legislation` per its own header). Treat as repo-internal confirmation, not a live MCP re-confirmation — flag for a follow-up check once `legalize_kr`'s coverage of this act is clarified. |
| Confined-space provision (안전보건기준에관한규칙, referenced re: Major-6 / `confined-space-rescue`) | `legalize_kr.get_law_metadata` (not found), `kr_safety.search_osha_regulations` keyword "밀폐공간" (empty result) | **Still unresolved.** Neither tool surfaced this administrative rule (it may sit outside `legalize_kr`'s indexed law set, which appears to prioritize 법률-level acts over 규칙-level rules). No data source in this session could confirm the correct article. Remains open — needs a different source (law.go.kr direct lookup, or SME) or confirmation that `legalize_kr` covers subordinate rules under a different lookup key. |

**Net effect on findings**: 3 items reclassified Major→Critical (건설산업기본법 mis-citations, now confirmed rather than merely unverified), 1 item downgraded Major→Minor (신재생에너지법, naming-only fix), 1 item's uncertainty resolved from "unverified statute" to "real statute, needs article number" (재난및안전관리기본법, 위험물안전관리법). One item (confined-space) remains genuinely blocked pending a different verification path.

---

## Resolution Log (2026-07-05, executed under PM/CSO direction)

All action items from both meetings (`memory/meeting-2026-07-05-legal-citation-audit-improvement.md` A-01–A-05, `memory/meeting-2026-07-05-legal-citation-audit-followup.md` B-01–B-05) were dispatched and completed:

| Gap(s) | Resolution | Status |
|---|---|---|
| 1, 2 (SAPA Art 7→4, 6 emergency workflows) | Fixed — all 6 files now cite 중대재해처벌법 Article 4 | ✅ Closed |
| 1 (disaster-response invalid Art 5) | Fixed — invalid citation removed, replaced with 산업안전보건법 Article 54 to maintain min_legal_basis ≥3 | ✅ Closed |
| 3 (msds/chemical-approval TCCL) | Fixed — now cites 화학물질관리법 (CCA) Article 20 | ✅ Closed |
| 3a (ehsconst/subcontractor-management Art 45) | Fixed — now cites 건설산업기본법 Article 29-2 (하도급관리), verified via `legalize_kr` | ✅ Closed |
| 3b (ehsconst/daily-safety-inspection, tbm-tool-box-meeting Art 83) | Fixed — both now cite 건설기술진흥법 Article 24 (건설산업기본법 has no safety-titled article at all, confirmed via full structure scan) | ✅ Closed |
| 5, 13 (chemical-spill-reference, chemical-release missing CCA Art 23) | Fixed — both now include 화학물질관리법 (CCA) Article 23 | ✅ Closed |
| 6 (confined-space-rescue Art 63) | Fixed — now cites 산업안전보건기준에 관한 규칙 Article 623 (감시인의 배치 등), found via direct law.go.kr search after `legalize_kr`/`kr_safety` both failed to index this 규칙-level rule | ✅ Closed |
| 8 (재난관리기본법 naming) | Verified real (MST 283851); disaster-response already used the canonical full name — no change needed there. Glossary entry added. | ✅ Closed |
| 9 (위험물안전관리법 no article, 6 workflows) | Fixed — each workflow now cites a specific article (Art 27/22-2 for leak-response types, Art 5 for storage/handling types) | ✅ Closed |
| 11 (신재생에너지법 informal name) | Fixed — now cites canonical 신에너지 및 재생에너지 개발·이용·보급 촉진법 Article 12 | ✅ Closed |
| 14 (glossary Art 31 inconsistency) | Fixed — glossary now matches `OSHA-KR-Training.yaml`'s topic | ✅ Closed |
| 15 (partial — glossary completeness) | 생명윤리법, 건설산업기본법, 재난 및 안전관리 기본법 added; 위험물안전관리법 and 안전보건기준에관한규칙 extended with confirmed articles. EU GDP/EU GVP/독성시험 책임자 규정/소방기본법/응급의료에 관한 법률 deferred — not yet added. | ⚠️ Partially closed |
| 4 (psm/trade-secrets-management statute name) | **Not yet executed this batch** — was not included in the dispatched fix rounds; still open | ❌ Open |
| 10 (환경보전법 generic citation, 2 files) | **Not yet checked against live law data** — still open | ❌ Open |
| 16 (PSM thin citations) | Tracked as non-blocking backlog: `memory/backlog/psm-citation-thinness.md` | 📋 Backlogged (by design) |
| 17, 18, 19 (GMP workflow_type field, glp/study-protocol bare citation, daily/manufacturing schema↔README sync) | **Not yet executed this batch** — still open, Minor priority | ❌ Open |

**Verification**: `bun scripts/safety-audit.ts` re-run after all fixes — **618 files checked, 0 errors**.

**Remaining open items for a future batch**: ~~Gap-4 (trade-secrets-management naming), Gap-10 (환경보전법 precision), Gap-15 remainder (5 more glossary entries), Gap-17/18/19 (structural/Minor hygiene)~~ — **all closed 2026-07-05 (batch 2)**, see below.

## Resolution Log — Batch 2 (2026-07-05, executed under PM/CSO direction)

| Gap | Resolution | Status |
|---|---|---|
| 4 (psm/trade-secrets-management non-canonical statute) | 부정경쟁방지 및 영업비밀보호에 관한 법률 could not be verified against `legalize_kr`; replaced with the already-verified, substantively-fitting **K-REACH Article 13** (CBI/trade-secret protection for chemical composition data) instead of citing an unverified statute | ✅ Closed |
| 10 (환경보전법 generic citation, 2 files) | Confirmed 환경보전법 is a pre-1990 umbrella statute superseded by 대기/수질환경보전법 (already cited alongside it in both files) — redundant entry replaced with **산업안전보건법 Article 125** (Work Environment Measurement) in both `powergen/ash-chemical-waste-management` and `ehschem/environmental-monitoring` | ✅ Closed |
| 15 (glossary completeness, remainder) | Added 약사법 제34조의3 (verified via law.go.kr search as the delegating article for MFDS 비임상시험관리기준), EU_GDP, EU_GVP, 독성시험 책임자 규정, 소방기본법, 응급의료에 관한 법률 to `legal-glossary.yaml` (v1.0.1→1.0.2) | ✅ Closed |
| 17 (GMP workflow_type field missing) | Added `workflow_type: core` to all 10 GMP schema.yaml files, matching sibling pharma domain convention | ✅ Closed |
| 18 (glp/study-protocol bare 약사법 citation) | Verified delegating article via law.go.kr web search: **약사법 Article 34-3** (Designation of non-clinical test-conducting institutions) — now cited specifically | ✅ Closed |
| 19 (daily/manufacturing schema↔README sync, 3 files) | `equipment-inspection` and `permit-to-work` schemas updated to include the second article already discussed in their README; `safety-patrol` schema corrected from the loosely-fitting 제62조 to 제15조/제16조 per the README's own stated legal basis | ✅ Closed |

**Verification**: `bun scripts/safety-audit.ts` re-run after all Batch 2 fixes — **618 files checked, 0 errors**.

**Outstanding**: none. Gap-16 (PSM citation thinness) has also now been closed — see `memory/backlog/psm-citation-thinness.md` for the resolution. All 10 thin PSM workflows upgraded to a 3-source `legal_basis`; a bonus finding during this pass also caught and fixed the same SAPA Article 7→4 mis-citation (previously fixed in the emergency cluster) in 3 PSM workflows that had been mis-assessed as "OK" by the original audit (`eap-emergency-planning`, `incident-investigation-psm`, `psm-compliance-audit`). Re-verified via `bun scripts/safety-audit.ts`: 618 files, 0 errors.

## Approval

Reviewed by CSO: PM (acting CSO), scope = all Critical + Major + tracked Minor items (Batch 1 + Batch 2)
Date: 2026-07-05
Status: **approved** — all findings closed and mechanically verified (618 files, 0 audit errors) except Gap-16, which is an intentional non-blocking backlog item, not an open defect.

---
**Disclaimer**: This report provides workflow-documentation assistance only. Regulatory interpretation — including determination of legal sufficiency, applicability of specific provisions, and adequacy of compliance measures — is the sole responsibility of qualified legal professionals and the user organization. This does not constitute legal advice.
