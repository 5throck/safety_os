# Meeting Transcript
**Date**: 2026-06-05
**Topic**: Finalize 3 MCP server design based on web search results
**Participants**: legal-agent, compliance-agent, pm (facilitator)
**Rounds**: 2
**Language**: Korean (transcript always saved in English)
**Status**: Complete

---

## Transcript

**[PM]**: (Facilitator)

The purpose of today's meeting is to finalize the design of 3 MCP servers based on the Korean law API information confirmed through web search. Key findings:

1. **National Law Information Center (open.law.go.kr)**: Provides 103 Open APIs
2. **K-Skill Project**: Open source for Korean government API integration
3. **MCP TypeScript SDK**: Official SDK exists
4. **Public Data Portal (data.go.kr)**: Requires API key

Participants, please provide your opinions on how this information affects our MCP server design from your expertise.

---

**[legal-agent]**: (Round 1)

Thank you, PM. I analyzed the web search results from a legal expert perspective.

The fact that the National Law Information Center provides 103 Open APIs is very important information for the **mcp_kr_legislation server**. This server handles real-time law updates + interpretation, and using the National Law Information Center's API directly allows:

- Current law list search (API usable)
- Law text search (API usable)
- Amendment history tracking (API usable)

Particularly, we need to consider that the provided APIs return XML format. A parsing layer for JSON conversion is needed.

**compliance-agent**, from a compliance perspective, how should we balance caching strategy and data freshness?

---

**[compliance-agent]**: (Round 1)

Good question, **legal-agent**.

From a compliance perspective, since the **mcp_kr_legislation server** must provide real-time updates, the caching strategy is critical. We also need to consider the API key requirement from the Public Data Portal confirmed in the web search.

Proposed caching strategy:

**mcp_kr_legislation** (real-time nature):
- Short cache: 1-6 hour TTL
- Priority: Data freshness > performance
- API key management: Environment variables for security

**k_skill** (reference data nature):
- Long cache: 24 hour TTL (maintain existing plan)
- Priority: Performance > data freshness

Also, the fact that the National Law Information Center API returns XML means we need to avoid duplication with **legalize_kr server**. **legalize_kr** should focus on git repository-based structural analysis, while **mcp_kr_legislation** should focus on real-time API-based updates.

**PM**, is this role separation appropriate?

---

**[legal-agent]**: (Round 2)

I think it's perfect role separation, **compliance-agent**.

Building on that, I'll specify how to utilize the National Law Information Center API:

**Core functions mcp_kr_legislation MCP** should provide:
1. `get_current_law` - Current law list (National Law Information Center API)
2. `get_law_amendments` - Amendment history search (National Law Information Center API)
3. `interpret_regulation` - Law interpretation and guide (local database + API merge)
4. `get_compliance_status` - Compliance status check

Differentiation from **legalize_kr MCP**:
- **legalize_kr**: `.cache/legalize-kr/` git repository → structural analysis (chapter→section→article)
- **mcp_kr_legislation**: National Law Information Center API → real-time updates + interpretation

These two servers should work complementarily.

**compliance-agent**, how is **k_skill** server coming along? We found the K-Skill project in web search, but what's the relationship between it and our k_skill MCP server?

---

**[compliance-agent]**: (Round 2)

Excellent question, **legal-agent**.

Analyzing the web search results, **K-Skill Project** is an open source skill collection for Korean users, and we should design our **k_skill MCP server** with this in mind.

However, there's an important difference:
- **K-Skill Project**: Integration library for AI agents
- **Our k_skill MCP**: MCP server specialized for occupational safety and health regulations

Therefore, our **k_skill MCP** should:
1. Reference K-Skill's tech stack (implementation patterns)
2. Utilize National Law Information Center API (data source)
3. Specialize in occupational safety and health field

Updated proposal:

**k_skill MCP Core Functions**:
1. `search_osha_regulations` - Occupational Safety and Health Act regulation search
2. `get_sapa_requirements` - Serious Accidents Punishment Act requirements search
3. `list_industry_controls` - Industry-specific control measures list
4. `check_compliance_gaps` - Compliance gap analysis

Data sources:
- **Primary**: National Law Information Center API (real-time)
- **Secondary**: Reference K-Skill project patterns

This clarifies the role separation of all three servers:
- **k_skill**: Occupational safety regulation search (cached)
- **legalize_kr**: Law structure analysis (git-based)
- **mcp_kr_legislation**: Real-time law updates + interpretation (API-based)

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| M-01 | automation-engineer | Medium | Implement 3 MCP servers (mcp/ directory) | Both | Phase 4 |
| M-02 | legal-agent | Low | Create National Law Information Center API integration guide | Both | Phase 4 |
| M-03 | compliance-agent | Low | Document caching strategy | Both | Phase 4 |
| M-04 | architect | Medium | Design interfaces between MCP servers | Both | Phase 2 |

## Acceptance Criteria (if any)

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | All 3 MCP servers implemented | Check mcp/ directory structure |
| 2 | API integration working | Test National Law Information Center API calls |
| 3 | Caching strategy documented | Review documentation files |
| 4 | Server interfaces designed | Architect review completed |
