# Meeting Transcript
**Date**: 2026-06-05
**Topic**: Phase 2 Knowledge Graph Schema and Additional Requirements
**Participants**: architect, safety-workflow-manager, automation-engineer, auditor
**Rounds**: 2
**Language**: Korean (transcript always saved in English)
**Status**: Complete

---

## Transcript

**[PM]**: (Facilitator)
The main agenda of this second meeting is to finalize the **'specific schema (Node/Edge) definition for the Neo4j Knowledge Graph'**, which was the unresolved issue from the first meeting. In addition, please review any additionally required or omitted matters (e.g., security, performance, data integration) for proceeding with Phase 2.

**[architect]**: (Round 1)
First, I will propose the core nodes for the knowledge graph schema. We need 6 core nodes: `Regulation`, `Requirement`, `Control`, `Workflow`, `Incident` (accident records), and `IndustryProfile`. For edges, they must be linked with relationships like `[Workflow] -RELATES_TO-> [Control]` and `[Control] -SATISFIES-> [Requirement]` so that the Traceability Model can be perfectly traced via graph queries (Cypher). As an additional review matter, privilege separation issues may arise when managing these extensive nodes.

**[safety-workflow-manager]**: (Round 1)
The schema structure proposed by `architect` is perfectly suited for reflecting field workflows in the database. We should add `Worker` and `TrainingRecord` nodes to this. That way, the Training Agent can track the `[Worker] -NEEDS_TRAINING_ON-> [Control]` relationship and dynamically assign training. As an additional matter, we are missing a data quality inspection step when seeding initial industry data outside of standard manufacturing.

**[automation-engineer]**: (Round 1)
Incorporating `architect`'s 6 core nodes and `safety-workflow-manager`'s 2 additional nodes results in a main schema of 8 nodes. From an implementation perspective, we need a layer that first enforces (Validates) this schema structure as JSON Schema in `schema.yaml` or `evidence-models`. Adding to the security-related additional matters, when fetching regulatory data in real-time via OpenAPI (K-Skill), rate limiting and a caching strategy are essential. This part was not considered in the first meeting.

**[architect]**: (Round 2)
Both `safety-workflow-manager`'s node additions and `automation-engineer`'s OpenAPI caching strategy proposals are critical enhancements. To resolve the privilege separation and initial data seeding issues, we can consider introducing a `data-ingestion-agent` (a dedicated agent for data loading) or assigning the data inspection role to the existing `compliance-agent`. I will document the schema definition based on the 8 core nodes and register it as `evidence-models/graph-schema.json`.

**[safety-workflow-manager]**: (Round 2)
If the existing `compliance-agent` handles initial data seeding and the `auditor` cross-validates the quality, we can reduce the burden of creating new agents. Since it is risky for the Training and Legal agents to have direct Write access to the knowledge graph, Neo4j access for all agents must be controlled by separating it into a Read-only MCP and a Write/Validation-only MCP.

**[automation-engineer]**: (Round 2)
I fully agree with the access control (RBAC) approach you summarized. I will design a separated structure: a read-only `codegraph_search` style MCP, and a `codegraph_mutate` style MCP for data updates. Also, I will apply a Redis-based cache layer or local file-based cache (TTL 24 hours) to the K-Skill communication module to bypass API rate limits.

**[auditor]**: (Synthesis)
I will synthesize the discussions from the second meeting.
1. **Points of Agreement**:
   - Finalized the knowledge graph schema with 8 core nodes (`Regulation`, `Requirement`, `Control`, `Workflow`, `Incident`, `IndustryProfile`, `Worker`, `TrainingRecord`).
   - Introduction of a dual Neo4j MCP structure with separated read/write privileges.
   - Application of a 24-hour TTL local caching strategy for K-Skill (OpenAPI) integration.
   - The `compliance-agent` will be responsible for initial data quality inspection.
2. **Open Disagreements or Unresolved Questions**: None (All unresolved issues from the first meeting are resolved).
3. **Action Items**:

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| 2-04 | architect | High | Write `evidence-models/graph-schema.json` containing the 8 core nodes | Both | Phase 2 |
| 2-05 | automation-engineer | Medium | Add Read/Write skill separation and caching layer architecture when designing Neo4j MCP | Both | Phase 2 |
| 2-06 | compliance-agent | Medium | Define pipeline workflow for initial seeding and inspection of external data (Industry Profile, etc.) | Both | Phase 2 |

## Acceptance Criteria (if any)

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Schema file exists | Check `evidence-models/graph-schema.json` |
| 2 | Read/Write MCP separation is documented | Reviewed by architect |
