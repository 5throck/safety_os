# Meeting Transcript
**Date**: 2026-07-05
**Topic**: Follow-up — Resolving Open Items from Legal Citation Audit Improvement Meeting (PSM bundling scope, ehsconst Critical reclassification, confined-space verification blocker, renewable-energy-act sourcing)
**Participants**: legal-agent, compliance-agent, docs-writer, safety-workflow-manager (SWM)
**Rounds**: 2
**Language**: Korean (transcript saved in English per Step 6 rule)
**Status**: Complete

---

## Context

This is a follow-up to `memory/meeting-2026-07-05-legal-citation-audit-improvement.md`. Since that meeting, `mcp-kr-legislation` and `legalize_kr` came online and were used to verify several previously-blocked items (see `memory/findings/compliance-gap-2026-07-05-all-domains.md`, "MCP Verification Addendum"). This session addresses: (1) the unresolved Gap-16 PSM-bundling question from the prior meeting, and (2) new questions raised by the verification results.

## Transcript

**[safety-workflow-manager]**: (Round 1)

Reopening the one item we didn't settle last time: Gap-16, the ten thin single-source PSM citations. I still think bundling the upgrade into the same PR as `trade-secrets-management`'s statute-name fix is more efficient — same domain, same reviewer, one pass through `psm-agent`. Compliance-agent, you pushed back on this last time on scope-discipline grounds; wanted to give you the floor again now that we have more information from the MCP verification pass.

**[compliance-agent]**: (Round 1)

My position hasn't moved on the core point — Gap-16 workflows are policy-compliant (PSM is exempt from the array/count check) and none of them cite anything wrong, just thin. That's categorically different from `trade-secrets-management`, which cites a non-canonical statute name — an actual defect. Mixing a "nice-to-have citation upgrade" into a "fix a wrong citation" PR makes the PR harder to review and muddies the audit trail about what was a required fix versus a discretionary improvement. I'll offer a middle path: open it as its own backlog item now, so it doesn't get lost, but don't make it a blocking dependency of anything in this remediation cycle.

**[legal-agent]**: (Round 1)

Setting Gap-16 aside for a moment — the more urgent thing from my side is the reclassification. `ehsconst/subcontractor-management`'s Article 45 and the two workflows citing Article 83 are no longer "unverified" — I pulled the actual article text via `legalize_kr` and confirmed both are substantively wrong (Art 45 is a general business-rationalization duty, Art 83 is registration-cancellation administrative sanction — neither is about subcontractor safety or daily inspection). That moved from Major to Critical in the report. But I want to flag a nuance before anyone dispatches a fix: I know the current citation is wrong, but I have not yet identified the correct replacement article. Dispatching `ehsconst-agent` right now with "the citation is wrong" and no replacement doesn't actually close the gap — it just moves the error. I'd rather finish the replacement-article search first.

**[docs-writer]**: (Round 1)

While that search happens, I can do something useful without waiting: mark the `legal_basis` entries on those three ehsconst schemas as under revision — something like a `status: under_revision` note alongside the existing (known-wrong) citation, so anyone reading the schema knows it's flagged rather than silently trusting a citation we've already confirmed is wrong. I want to check this is within my boundary before I do it — I don't invent a replacement, I'm not altering what the citation says, I'm just adding a status marker that a specialist already told me is warranted. Is that acceptable, or does even that cross into legal interpretation?

**[legal-agent]**: (Round 2)

That's fine — you're not changing or hallucinating the citation, you're annotating a status that I, the specialist, am telling you is warranted. That's exactly the "preserve, don't invent" boundary working as intended. Go ahead with that annotation on the three ehsconst schemas once I confirm the flag; I'll keep searching `legalize_kr`'s `건설산업기본법` structure for candidate replacement articles — the structure I already pulled has provisions on business registration, licensing, and management, but I didn't spot a dedicated subcontractor-safety or site-inspection article in the sections I've reviewed so far. That search continues after this meeting, not blocking today's decisions.

Separately, raising a new item: the confined-space-rescue statute (안전보건기준에관한규칙, a 규칙/administrative rule rather than a 법률/act) is still unconfirmed. Neither `legalize_kr.get_law_metadata` nor `kr_safety.search_osha_regulations` (keyword "밀폐공간") returned anything. I suspect this isn't a one-off gap — it looks like both tools may be scoped to 법률-level acts and simply don't index subordinate 규칙-level rules at all. If that's true, it's not just this citation that's affected; it's a structural blind spot in our verification toolset for any workflow that cites a 규칙 rather than a 법률. I'd like to try a direct law.go.kr web lookup as a fallback for this specific citation, but I also think the toolset gap itself deserves its own note to PM/CSO rather than getting lost as a one-line footnote on this one workflow.

**[compliance-agent]**: (Round 2)

Agreed on both counts — confined-space stays open pending the web lookup, and the toolset gap is worth flagging separately since it could affect other 규칙-citing workflows we haven't specifically audited yet (LOTO's reference to 산업안전보건기준에관한규칙 제92조 comes to mind — that one's already verified via the training-domain audit cross-check, so no immediate concern, but the same blind spot could bite us elsewhere).

On the renewable-energy-act naming fix (Gap-11): I'm comfortable closing that as Minor based on `regulations/KR/Renewable-Energy-Act.yaml` alone, even without a live `legalize_kr` re-confirmation. That file already declares `source_mcp: mcp-kr-legislation` in its header, meaning it was sourced from the authoritative feed at authoring time, and the article content (제12조 = 신재생에너지 시설 안전) matches the workflow's own citation exactly — only the statute *name* was informal, not the substance. Re-litigating that with a second tool once we already have a properly-sourced internal record is not a good use of legal-agent's time. Docs-writer can just swap the name.

**[safety-workflow-manager]**: (Round 2)

That settles the sequencing. Updating the plan: Gap-16 becomes its own tracked backlog item, not bundled with `trade-secrets-management`. The ehsconst Critical items (3a/3b) get an immediate "under revision" annotation from docs-writer while legal-agent continues the replacement-article search as a fast-follow, not gating Batch 1's close. Confined-space stays open pending a direct law.go.kr attempt, and the toolset's apparent 규칙-coverage gap gets escalated as its own item rather than buried. Renewable-energy naming fix is closed, docs-writer's queue.

---

## Synthesis

**[audit-agent]**: (Synthesis)

**Points of Agreement**:
1. **Gap-16 resolved**: tracked as its own backlog item (PSM citation-thinness upgrade), explicitly *not* bundled into the `trade-secrets-management` statute-name fix PR. Non-blocking, low-priority.
2. **ehsconst 3a/3b (Critical, confirmed-wrong citations)**: interim mitigation is a `status: under_revision` annotation added by docs-writer to the existing (known-wrong) `legal_basis` entries — this does not invent or alter the citation content, only flags it — while legal-agent continues searching for the correct replacement article as a non-blocking fast-follow.
3. **Confined-space provision remains open.** Both `legalize_kr` and `kr_safety` failed to surface it; the working hypothesis is a structural gap in current tooling around 규칙-level administrative rules (vs. 법률-level acts). A direct law.go.kr web lookup will be attempted as a fallback; the toolset gap itself is escalated separately as it may affect other 규칙-citing workflows beyond this one instance.
4. **신재생에너지법 (Gap-11) is closed as Minor**, resolved by the in-repo `Renewable-Energy-Act.yaml` (already `mcp-kr-legislation`-sourced) without needing a second live tool confirmation — docs-writer proceeds with the name swap only, no further verification needed.

**Open Disagreements / Unresolved Questions**: None. Both the carried-over item (Gap-16) and the new items raised by this session's MCP verification reached consensus.

**⚠️ Platform Parity Check**: None of the five action items below touch `CLAUDE.md`, `GEMINI.md`, `agents/*.md`, `.claude/`, or `.gemini/` files. All edits are to `workflows/domains/industry/ehsconst/**/schema.yaml`, `regulations/KR/legal-glossary.yaml`, `memory/findings/`, and a new backlog note. `Platform: Both` applies uniformly.

**Action Items**:

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| B-01 | legal-agent | Medium | Search `건설산업기본법` (via `legalize_kr`) for the correct replacement article for `subcontractor-management` (하도급 안전관리 관련) and `daily-safety-inspection`/`tbm-tool-box-meeting` (일상점검 관련); report candidate article(s) | Both | Phase 4 |
| B-02 | docs-writer | Medium | Annotate `legal_basis` entries in `ehsconst/subcontractor-management`, `daily-safety-inspection`, `tbm-tool-box-meeting` schema.yaml with a `status: under_revision` marker pending B-01's replacement citation | Both | Phase 4 |
| B-03 | PM (CSO) | Low | Open a separate, non-blocking backlog item for Gap-16 (PSM single-source citation thinness across 10 workflows) | Both | Phase 1-2 (backlog intake) |
| B-04 | legal-agent | Medium | Attempt direct law.go.kr lookup for the confined-space provision (안전보건기준에관한규칙); if still unresolved, escalate the apparent 규칙-coverage gap in `legalize_kr`/`kr_safety` to PM/CSO as a tooling item | Both | Phase 4 (method TBD) |
| B-05 | docs-writer | Medium | Update `powergen/renewable-energy-facility-safety/schema.yaml` to cite the canonical name (신에너지 및 재생에너지 개발·이용·보급 촉진법) in place of "신재생에너지법"; close Gap-11 in the gap report as resolved | Both | Phase 4 |

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | Gap-16 exists as a standalone backlog entry, separate from any trade-secrets-management PR | Manual check of backlog / task tracker |
| AC-2 | Three ehsconst schemas carry an explicit `under_revision` (or equivalent) marker on their `legal_basis` field until B-01 completes | Manual review of schema files |
| AC-3 | `renewable-energy-facility-safety/schema.yaml` cites the canonical statute name | Manual review of schema file |
| AC-4 | Confined-space provision is either resolved with a verified article, or formally logged as a tooling gap if unresolved | PM/CSO review of legal-agent's B-04 output |
