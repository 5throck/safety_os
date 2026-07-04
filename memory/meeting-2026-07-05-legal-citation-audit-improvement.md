# Meeting Transcript
**Date**: 2026-07-05
**Topic**: Legal Citation Audit Findings (compliance-gap-2026-07-05-all-domains.md) — Improvement Plan
**Participants**: legal-agent, compliance-agent, docs-writer, safety-workflow-manager (SWM)
**Rounds**: 2
**Language**: Korean (transcript saved in English per Step 6 rule)
**Status**: Complete

---

## Transcript

**[legal-agent]**: (Round 1)

Starting with the three Critical findings. Two of them — the SAPA Article 7 mis-citation repeated across six emergency workflows (confined-space-rescue, disaster-response, electrical-emergency, high-angle-rescue, mechanical-accident, medical-emergency), and disaster-response's non-existent "OSHA-KR Article 5" — are not close calls. `legal-glossary.yaml` already documents Article 7 as the corporate dual-liability/penalty provision (양벌규정), and Article 4 as the actual safety-and-health assurance obligation. This is verifiable from data we already have in the repo; I don't need to query `mcp-kr-legislation` to confirm it, I need it to look up what OSHA-KR Article 5 actually is (or confirm it doesn't exist) before we can write a replacement citation for disaster-response. I'd flag this pair as fix-now, high-confidence.

The third Critical — `msds/chemical-approval` citing "유해화학물질 관리법 (TCCL)" — is also already substantiated in-repo: `K-REACH.yaml` documents TCCL as `status: partially_superseded`, absorbed into 화학물질관리법 (CCA). Same category: fix-now.

Where I do need external verification before anyone touches a schema file: 건설산업기본법, 재난관리기본법, and the correct confined-space-rescue statute/article (likely under 안전보건기준에관한규칙, a different statute than the one currently miscited as Article 63). None of these appear anywhere in our glossary or regulation files. I will not sign off on a citation I can't trace to a real article number — that's the whole point of my role.

**[compliance-agent]**: (Round 1)

Agreed on the split. From the report I filed, my read is we should triage by confidence, not by domain: Critical findings that are already internally verifiable (SAPA Art 7→4, disaster-response Art 5, TCCL) go into a fast-track fix now. Everything that requires new statute verification (Gap-6 through Gap-11 — 건설산업기본법, 재난관리기본법, 위험물안전관리법 article-level citations, 신재생에너지법's canonical name) goes into legal-agent's queue and shouldn't be touched until that comes back verified.

One process question: should we re-run `bun scripts/safety-audit.ts` after every batch, or once at the end? I'd rather gate per batch — if the fast-track fixes introduce a schema error (e.g., breaking the array format), I want to catch it immediately rather than after five separate agents have all made changes.

**[docs-writer]**: (Round 1)

I can take the glossary-side items independently of all of that. Two things are squarely mine: reconciling the internal inconsistency where `legal-glossary.yaml` labels OSHA-KR Article 31 as "Mechanical/equipment safety measures" while `OSHA-KR-Training.yaml` — the more specific, apparently authoritative file for training content — maps the same article to "특별안전보건교육 (위험작업)." The workflow itself (`special-safety-training`) is correct; the glossary is the thing that's wrong, and that's a documentation fix I can make without any legal reinterpretation.

Second: the glossary-completeness gaps — 생명윤리법, EU GDP, EU GVP, 독성시험 책임자 규정, 소방기본법, 응급의료에 관한 법률 — none of these are cited incorrectly, they're just missing from the index. I can add them directly from the domain regulation files (MFDS-GCP.yaml, MFDS-GDP.yaml, MFDS-GVP.yaml) that already document them.

What I will not do is invent a citation for the unverified statutes legal-agent flagged. Per my own operating boundary, I don't interpret law or hallucinate legal_basis content — I format and preserve what specialists give me. So the 건설산업기본법/재난관리기본법/confined-space items sit in my queue only after legal-agent delivers a verified replacement.

**[safety-workflow-manager]**: (Round 1)

From the orchestration side, the question is sequencing across domain owners. The fixes touch six different domain agents: emergency workflows, msds-agent (chemical-approval, chemical-spill-reference), psm-agent (trade-secrets-management), and — once legal-agent's verification lands — ehsconst-agent, gasterm-agent, powergen-agent, ehschem-agent for the unverified-statute batch.

I'd rather not dispatch all of them at once. My proposal: batch 1 is the fast-track Critical fixes (emergency + msds), because they don't have external dependencies. Batch 2 is legal-agent's verification pass. Batch 3 is the domain-agent fixes that depend on batch 2's output. docs-writer's glossary-hygiene track runs in parallel with all of it since it has no dependency on either batch. That keeps agents from idling on each other.

---

**[legal-agent]**: (Round 2)

Responding to compliance-agent's gating question — yes, per-batch, not once at the end. I'll add one more distinction to the "needs verification" pile: `msds/chemical-spill-reference` and `emergency/chemical-release` (Gap-5, Gap-13) aren't citing a wrong statute, they're citing the right statute (화학물질관리법) without an article number, when the correct article (Art 23, 사고대비물질) already exists in our own glossary. That's not an external-verification problem — that's just an omission we can fix immediately by pulling the article number we already have on file. I'm moving those two into the fast-track batch alongside SAPA Art 7→4, disaster-response Art 5, and TCCL.

For the genuinely external ones — 건설산업기본법, 재난관리기본법, 위험물안전관리법 article-level detail, the confined-space provision, and 신재생에너지법's canonical name — I'll query `mcp-kr-legislation` / `legalize_kr` for each and only write a glossary entry once I have a real article citation to point to. I want to flag that neither of those MCP connections were reachable in this session (both were shown as "still connecting"); until connectivity is confirmed, this batch is blocked, not just queued.

**[safety-workflow-manager]**: (Round 2)

Understood — updating the sequencing: batch 1 (fast-track) now covers SAPA Art 7→4 across the six emergency workflows, disaster-response's Article 5, TCCL in chemical-approval, and the missing Art 23 citations in chemical-spill-reference and chemical-release. That's emergency-agent + msds-agent, dispatched together since neither depends on the other. Batch 2 (legal-agent verification) is blocked pending MCP reachability — I'll hold that as an open item rather than assign a due date I can't back up. Batch 3 (ehsconst/gasterm/powergen/ehschem domain fixes, plus psm's trade-secrets-management statute-name correction) follows once batch 2 clears. docs-writer's track runs now, independently.

**[compliance-agent]**: (Round 2)

That sequencing works. Adding two closing points: first, after batch 1 lands, re-run `bun scripts/safety-audit.ts` as the gate before batch 3 starts — I don't want compounding schema errors across multiple agents' edits. Second, the gap report itself (`memory/findings/compliance-gap-2026-07-05-all-domains.md`) should move from `status: draft` to `status: under_review` now that we have an agreed remediation plan, and only to `status: approved` once CSO signs off after batch 1 and batch 3 both close.

One item I want to raise as unresolved rather than settle here: Gap-16, the ten PSM workflows citing only a bare "OSHA-KR Article 44." They're policy-compliant (PSM is exempt from the array/count check) and none of them are wrong — just thin compared to `loto-lockout-tagout`. I don't think that belongs in this remediation cycle, which is about closing Critical/Major gaps; I'd rather it become its own backlog item so we're not scope-creeping a Critical-fix cycle into a broader PSM citation-quality upgrade. SWM raised bundling it with the trade-secrets-management fix since they're in the same domain — I'd push back on that; different severity, different urgency, shouldn't share a PR.

**[docs-writer]**: (Round 2)

No objection from my side on any of that — my two-item queue (Art 31 reconciliation, missing glossary entries) stays as stated and doesn't block or depend on the PSM scope question. I'll note it for the record: whichever way that's resolved, I still won't touch legal_basis content on any workflow directly — only the glossary index entries that describe statutes already correctly cited elsewhere.

---

## Synthesis

**[audit-agent]**: (Synthesis)

**Points of Agreement**:
1. Fixes split into two confidence tiers: (a) fast-track — corrections already substantiated by data already in the repo, requiring no external lookup: SAPA Art 7→4 (6 emergency workflows), disaster-response's invalid "OSHA-KR Article 5," `msds/chemical-approval`'s superseded TCCL citation, and adding the already-known-but-unused CCA Art 23 to `chemical-spill-reference` and `chemical-release`; (b) verification-gated — 건설산업기본법, 재난관리기본법, 위험물안전관리법 article detail, the correct confined-space-rescue statute, and 신재생에너지법's canonical name, none of which may be written into any schema until legal-agent confirms them via `mcp-kr-legislation`/`legalize_kr`.
2. `mcp-kr-legislation` and `legalize_kr` were unreachable ("still connecting") during this session — the verification-gated batch is formally **blocked**, not merely scheduled, until connectivity is confirmed in a future session.
3. docs-writer's glossary-hygiene track (Article 31 reconciliation between `legal-glossary.yaml` and `OSHA-KR-Training.yaml`; adding missing-but-correctly-used entries: 생명윤리법, EU GDP, EU GVP, 독성시험 책임자 규정, 소방기본법, 응급의료에 관한 법률) is independent of both fix batches and can proceed immediately.
4. `bun scripts/safety-audit.ts` re-run is a mandatory gate after each batch, not just at the end. The report `memory/findings/compliance-gap-2026-07-05-all-domains.md` moves to `status: under_review` now, `status: approved` only after batch 1 and batch 3 both close and CSO signs off.

**Open Disagreements / Unresolved Questions**:
- Whether Gap-16 (10 thin single-source PSM citations) should be bundled into the same remediation pass as `psm/trade-secrets-management`'s statute-name fix (SWM's suggestion) or split into a separate, lower-priority backlog item (compliance-agent's position, on grounds of severity/scope discipline). **Escalated to PM/CSO for a decision** — no consensus reached.
- No ETA exists for batch 2 (legal-agent's external verification) since it depends on `mcp-kr-legislation`/`legalize_kr` reachability, which was not confirmed this session. This should be revisited once those MCP servers report as connected.

**⚠️ Platform Parity Check**: None of the five action items below touch `CLAUDE.md`, `GEMINI.md`, `agents/*.md`, `.claude/`, or `.gemini/` files — all edits are to `workflows/**/schema.yaml`, `regulations/KR/legal-glossary.yaml`, and `memory/findings/`. No cross-platform pairing is required; `Platform: Both` reflects that the fix applies uniformly regardless of which platform executes it.

**Action Items**:

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | emergency workflow owner (dispatched via SWM) | Medium | Fix SAPA Art 7→Art 4 in 6 emergency schemas + disaster-response's invalid Art 5 citation | Both | Phase 4 |
| A-02 | msds-agent | Medium | Fix `chemical-approval` (TCCL→CCA); add CCA Art 23 to `chemical-spill-reference` and `emergency/chemical-release` | Both | Phase 4 |
| A-03 | legal-agent | Medium | Verify 건설산업기본법, 재난관리기본법, 위험물안전관리법 article detail, confined-space statute, 신재생에너지법 canonical name via `mcp-kr-legislation`/`legalize_kr` once reachable; update `legal-glossary.yaml` | Both | Phase 4 (blocked — MCP unreachable) |
| A-04 | docs-writer | Medium | Reconcile Art 31 glossary/training-file mismatch; add missing statute/standard entries (생명윤리법, EU GDP, EU GVP, 독성시험 책임자 규정, 소방기본법, 응급의료에 관한 법률) to `legal-glossary.yaml` | Both | Phase 4 |
| A-05 | audit-agent / PM (CSO) | Low | Re-run `bun scripts/safety-audit.ts` after batch 1 and after batch 3; move gap report `draft`→`under_review` now, →`approved` after both batches close | Both | Phase 6 |

**Not included as an action item (escalated instead)**: Gap-16 (PSM citation thinness) scope/bundling decision — requires PM/CSO ruling before it can be assigned.

---

## Acceptance Criteria

| # | Criterion | Verification |
|---|-----------|--------------|
| AC-1 | Zero occurrences of "중대재해처벌법 Article 7" used as a general safety-obligation citation across `workflows/emergency/**/schema.yaml` | `bun scripts/safety-audit.ts` + manual grep for "중대재해처벌법.*7" in emergency schemas |
| AC-2 | `msds/chemical-approval/schema.yaml` no longer cites "유해화학물질 관리법 (TCCL)" | Manual review of schema file |
| AC-3 | `chemical-spill-reference` and `chemical-release` schemas include 화학물질관리법 Article 23 | Manual review of schema files |
| AC-4 | `legal-glossary.yaml` Article 31 entry matches `OSHA-KR-Training.yaml`'s topic description | Manual review of both files |
| AC-5 | No schema edits made under A-03 until `mcp-kr-legislation`/`legalize_kr` connectivity is confirmed and a verified article citation is obtained | PM/CSO review before batch 3 dispatch |
