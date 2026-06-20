# Meeting Transcript
**Date**: 2026-06-20
**Topic**: GxP Tier Reclassification Validity Review
**Participants**: SGM (Safety Governance Manager), compliance-agent, docs-writer, audit-agent (synthesizer)
**Rounds**: 2
**Language**: Korean (transcript saved in English)
**Status**: Complete

---

## Transcript

### Round 1

**SGM**: Addressed the strategic rationale for GxP → Tier 2 reclassification. GMP/GDP/GCP/GVP are all governed by the Pharmaceutical Affairs Act (약사법) under MFDS jurisdiction — structurally identical to ehsconst (SAPA Art 12) or gasterm (High-Pressure Gas Act) as industry-specific coordinators. However, raised concern about GLP: OECD MAD (Mutual Acceptance of Data) framework means GLP also applies to K-REACH chemical hazard testing, making GLP more of a cross-industry methodology standard — closer to Tier 1 Functional than Tier 2 Industry. Asked compliance-agent to verify the regulatory scope.

**compliance-agent**: Confirmed SGM's GLP concern. Under K-REACH Enforcement Decree Article 14, chemical registration hazard data must come from GLP-certified facilities using the same OECD GLP principles as pharmaceutical GLP. This creates a structural awkwardness where chemical domain users (ehschem) would need to reference a Tier 2 Industry domain. Proposed: GLP only → revert to Tier 1 Functional; gmp/gdp/gcp/gvp remain Tier 2. Also proposed adding an explicit `ehschem → glp` path to CROSS_DOMAIN_REFS. Asked docs-writer whether this split would reduce or increase user confusion.

**docs-writer**: Agreed with the analysis but raised a documentation concern: keeping all GxP under Tier 2 Industry gives a clean single message ("pharma users pick from GxP family"), while extracting GLP forces dual-role documentation (pharma lifecycle member AND K-REACH service). Proposed a third option: GLP stays Tier 1 with a "GLP-as-a-Service" dual-context declaration via `industry_profile` fields. Asked SGM whether dual-context declarations create audit trail risks.

### Round 2

**SGM**: Rejected the dual-context `industry_profile` approach on audit risk grounds — MFDS inspectors examine `legal_basis` and workflow IDs, not custom profile fields; mixing 비임상시험관리기준 and OECD GLP contexts in a single profile creates ambiguity. Supported compliance-agent's reversal proposal with a refinement: GLP Tier 1 + standardized `legal_basis: [OECD GLP, 비임상시험관리기준, K-REACH Art 14]` + new `cross_contexts: ['pharma', 'chemical']` field in domain-config.ts so the audit script can distinguish contexts programmatically.

**compliance-agent**: Confirmed technical feasibility of `cross_contexts?: string[]` optional field in DomainConfig interface — backward-compatible, audit script handles absence gracefully. Confirmed ehschem → glp CROSS_DOMAIN_REF addition is structurally natural. Presented final recommendation: (1) GLP → Tier 1 reversal, (2) gmp/gdp/gcp/gvp → Tier 2 maintained, (3) `cross_contexts` added to GLP config, (4) ehschem → glp cross-domain ref added.

**docs-writer**: Accepted the final recommendation as documentation-friendly. Proposed classification-guide §2 updates: add GLP to Tier 1 table ("Non-clinical studies / K-REACH hazard assessment — pharma & chemical"), keep gmp/gdp/gcp/gvp in Tier 2 table ("GxP pharma production/distribution/clinical/surveillance cycle"), split §5 dispatch tree into "pharma user → gmp/gdp/gcp/gvp" and "K-REACH chemical hazard → glp (Tier 1 service)" paths.

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| A-01 | PM (CSO) | Medium | Set GLP to `tier: 'functional'` and add `cross_contexts: ['pharma', 'chemical']` in domain-config.ts | Both | Immediate |
| A-02 | automation-engineer | Low | Add `ehschem → glp` entry to CROSS_DOMAIN_REFS in domain-config.ts | Both | After A-01 |
| A-03 | docs-writer | Medium | Update domain-classification-guide.md §2 and §5 — GLP back to Tier 1, add K-REACH chemical dispatch path | Both | After A-01 |
| A-04 | PM (CSO) | Medium | Decide whether to physically move GLP folder (`docs/domains/industry/glp/` → `functional/glp/`) vs metadata-only change — weigh cost vs structural consistency | Both | This session |
| A-05 | PM (CSO) | Low | Add cross-context section to `docs/domains/functional/glp/scope.md` | Both | After A-04 |

## Key Decision

The unanimous conclusion was that the monolithic GxP → Tier 2 reclassification was partially over-broad. GLP is the exception: its OECD MAD scope and K-REACH application make it a cross-industry methodology service (Tier 1 Functional). The remaining four GxP domains (GMP, GDP, GCP, GVP) correctly belong in Tier 2 Industry as pharma-specific coordinators.

## Open Question

Whether to physically relocate the GLP folder structure or update only metadata/config — this is a PM decision balancing implementation cost against long-term structural consistency.
