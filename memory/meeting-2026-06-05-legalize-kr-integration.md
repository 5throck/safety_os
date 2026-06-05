# Meeting Transcript
**Date**: 2026-06-05
**Topic**: Integrating legalize-kr via git clone on demand
**Participants**: legal-agent, safety-workflow-manager, audit-agent
**Rounds**: 2
**Language**: English
**Status**: Complete

---

## Transcript

**PM**:
Welcome everyone. Today's topic is how we can incorporate the `legalize-kr` git repository clone functionality into our system architecture, specifically to be used on-demand when a user requests it. legal-agent, please start us off with your perspective on how we might leverage this.

**legal-agent**:
Thank you, PM. From a legal compliance perspective, having on-demand access to the entire `legalize-kr` repository via git clone is highly valuable. While we have the MCP API for specific queries, a full local clone allows us to easily run offline grep searches or track the exact diff of a law over time. We could design a workflow where, if a user needs comprehensive structural analysis of a law, we trigger a script to clone the repository into a temporary directory and analyze the markdown files directly.

**safety-workflow-manager**:
Building on legal-agent's point, from an operational workflow standpoint, we shouldn't clone this massive repository by default. Instead, we can create a dedicated local skill, say `fetch-legalize-kr`, which only executes `git clone --depth 1` (or full clone if history is needed) into a `.cache/` or `scratch/` directory when explicitly requested. This keeps our daily workflows lightweight but gives us the power to bring in the data when needed.

**audit-agent**:
I agree with both of you. For audit and evidence traceability, the `legalize-kr` repository is perfect because every amendment is a specific git commit. If we use a local clone, our evidence records can cite the exact commit hash of the law from `legalize-kr` that we used for our compliance check. However, as safety-workflow-manager mentioned, we must strictly ensure this clone goes into a gitignored directory so it doesn't pollute the Safety OS repository state.

**legal-agent**:
I completely agree with safety-workflow-manager and audit-agent. The local clone should definitely reside in a `.gitignore`d cache. To add a concrete proposal, the `fetch-legalize-kr` skill could expose parameters for `--depth` and `--branch` so we don't fetch unnecessary history unless the user specifically asks to track changes over time.

**safety-workflow-manager**:
That's a solid proposal, legal-agent. To implement this, I suggest we add a new skill script `scripts/fetch-legalize.ts` and document it in `skills/legalize-kr-sync/SKILL.md`. This skill will handle the cloning into `.cache/legalize-kr/` and provide search utility wrappers.

**audit-agent**:
That sounds like a complete plan. I will now synthesize our discussion.

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | safety-workflow-manager | Medium | Create `skills/legalize-kr-sync/SKILL.md` to define the on-demand clone workflow | Both | 4 |
| A-02 | automation-engineer | Low | Create `scripts/fetch-legalize.ts` to clone the repo into `.cache/legalize-kr/` safely | Both | 4 |

## Acceptance Criteria (if any)

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Clone must be placed in a .gitignore directory | Verify `.gitignore` includes `.cache/` |
| 2 | Skill must only trigger on user demand | Review `SKILL.md` triggers |
