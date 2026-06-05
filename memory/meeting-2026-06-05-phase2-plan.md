# Meeting Transcript
**Date**: 2026-06-05
**Topic**: Phase 2 Development Plan
**Participants**: architect, safety-governance-manager, automation-engineer, auditor
**Rounds**: 2
**Language**: Korean (transcript always saved in English)
**Status**: Complete

---

## Transcript

**[PM]**: (Facilitator)
The purpose of this meeting is to establish a concrete development and implementation plan for the core milestones of Phase 2 (Advanced Capabilities): the introduction of the Knowledge Graph Agent, industry profile expansion, and the addition of new agents (Legal/Training). Please freely exchange opinions on architecture, governance, and implementation from your respective domains of expertise.

**[architect]**: (Round 1)
First, regarding the introduction of the Knowledge Graph Agent, existing relational databases or simple document searches have limitations. In Phase 2, we must link a Graph DB like Neo4j to the backend to build a knowledge graph representing the N:M relationships between incident reports, risk assessments, and relevant regulations (SAPA/OSHA-KR). To this end, could `automation-engineer` first implement a Neo4j integration skill using MCP?

**[safety-governance-manager]**: (Round 1)
I agree with `architect`'s knowledge graph direction. Once that graph is complete, it will be immensely helpful for Industry Expansion. For instance, the construction and chemical processing industries have different regulations and hazard factors compared to general manufacturing. Therefore, it is essential to design the system to enable customized compliance checks by adding an `Industry Profile` node to the knowledge graph. Furthermore, the newly introduced Legal Intelligence Agent must utilize this knowledge graph to monitor and reflect real-time regulatory revisions.

**[automation-engineer]**: (Round 1)
Synthesizing the opinions of `architect` and `safety-governance-manager`, there are two core aspects from an implementation perspective. First, developing a custom MCP skill for Neo4j integration. Second, granting the Legal and Training agents querying permissions to the knowledge graph in their prompts and contexts. I can immediately prototype the Neo4j MCP integration, and I propose managing the industry profiles in a structured YAML format within the `industry-profiles/` directory.

**[architect]**: (Round 2)
Excellent. The YAML-based industry profile management proposed by `automation-engineer` is perfectly compatible with the Traceability Model built in Phase 0. For the Legal Intelligence Agent, I will update the architecture to build a pipeline that collects real-time data through a K-Skill MCP connected to the National Law Information Center's OpenAPI, and pushes that data back into the Neo4j knowledge graph.

**[safety-governance-manager]**: (Round 2)
I agree. Once `architect`'s pipeline architecture is finalized, I will define the KPIs and evaluation criteria (Section B) for the Legal and Training agents based on that pipeline. In particular, the Training Agent should take on the role of dynamically generating customized safety training curricula for workers by analyzing near-miss data on the knowledge graph.

**[automation-engineer]**: (Round 2)
All architectures and requirements are now clear. I will sequentially proceed with 1) building the Neo4j MCP integration skill, 2) building the K-Skill OpenAPI integration skill, and 3) defining the `schema.yaml` for the Legal and Training agents. Since these tasks can be processed in parallel, I will start with the skill engineering immediately.

**[auditor]**: (Synthesis)
I will synthesize the entire discussion.
1. **Points of Agreement**: Building a Neo4j-based knowledge graph architecture, managing industry profiles in YAML format, and a pipeline for the Legal Agent via National Law Information Center OpenAPI (K-Skill) integration.
2. **Open Disagreements or Unresolved Questions**: The specific schema (node/edge definitions) of the knowledge graph database is not yet finalized.
3. **Action Items**:

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| 2-01 | automation-engineer | Medium | Implement Neo4j MCP and K-Skill OpenAPI integration skills | Both | Phase 2 |
| 2-02 | architect | High | Finalize architecture design for Knowledge Graph and Legal/Training pipelines | Both | Phase 2 |
| 2-03 | safety-governance-manager | Medium | Define governance and KPIs for the two new agents (Legal, Training) | Both | Phase 2 |

## Acceptance Criteria (if any)

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Neo4j MCP and K-Skill are functional | `bun scripts/validate-skills.ts` passes |
