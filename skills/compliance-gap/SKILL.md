---
name: compliance-gap
description: Trigger compliance gap analysis against applicable EHS regulations
owner: compliance-agent
status: active
version: 1.0.0
metadata:
  triggers:
    - 법규 준수
    - compliance gap
    - 규정 점검
    - 법규 변경
    - regulatory compliance
    - 컴플라이언스
    - 법적 요건
    - legal requirement review
  agents:
    - compliance-agent
  legal_basis:
    - 산업안전보건법 전반 (Occupational Safety and Health Act — all articles)
    - 중대재해처벌법 전반 (Serious Accidents Punishment Act — all articles)
---

# Compliance Gap Analysis

## When to Use

Invoke this skill when: a new regulation is enacted or amended, a periodic compliance review is due, an audit finding references a legal requirement, management requests a gap assessment, or a new operational activity may trigger new regulatory obligations. Also invoke after any serious incident to assess whether legal obligations were met.

## Steps

1. **Regulation Identification** — Identify all applicable regulations based on the industry sector, workplace type, number of employees, and work activities. Key frameworks:
   - 산업안전보건법 (OSHA-KR) and subordinate regulations
   - 중대재해처벌법 (SAPA) — applies to workplaces with 5+ employees
   - 화학물질관리법 (Chemical Substances Control Act) — if applicable
   - 고압가스 안전관리법 — if applicable
   - Other sector-specific regulations as identified

2. **Current State Assessment** — For each applicable regulation, document the current compliance state: systems in place, records available, responsible persons assigned, training completed.

3. **Gap Identification** — Compare current state against regulatory requirements. For each gap, record:
   - Regulation article and requirement
   - Current state (what exists)
   - Required state (what the law mandates)
   - Gap description
   - Risk level (Critical / Major / Minor)

4. **Corrective Action Recommendation** — For each identified gap, recommend a corrective action with estimated effort, responsible party, and target completion date. Prioritize Critical gaps (those with potential criminal liability under 중대재해처벌법) first.

5. **Gap Report** — Produce a structured gap report and save to `memory/findings/`. Present findings to the CSO for review and approval of the corrective action plan.

## Output Format

Save gap report to `memory/findings/compliance-gap-YYYY-MM-DD-<scope>.md`:

```markdown
# Compliance Gap Report
date: YYYY-MM-DD
scope: <site / activity / regulation>
assessor: <name>
legal_basis: 산업안전보건법 전반
status: draft | under_review | approved

## Regulatory Framework
- <list of applicable regulations>

## Gap Summary
| # | Article | Requirement | Current State | Gap | Risk Level |
|---|---------|-------------|---------------|-----|------------|
| 1 | 제29조  | Training records for all workers | Partial records only | Missing records for 15 workers | Major |

## Corrective Action Plan
| # | Gap Ref | Action | Owner | Due | Priority |
|---|---------|--------|-------|-----|----------|
| 1 | Gap-1   | Update training records | HR/Safety | YYYY-MM-DD | High |

## Approval
Reviewed by CSO: <name>
Date: YYYY-MM-DD
```

## Legal Notes

- 산업안전보건법 imposes duties on employers across all aspects of occupational safety and health. Violations can result in fines up to 50 million KRW or imprisonment.
- 중대재해처벌법 applies criminal penalties (up to 1 year imprisonment or 1 billion KRW fine for the business) when serious accidents result from failure to meet safety management obligations.
- **Disclaimer**: This skill provides workflow assistance to support compliance management. It does not constitute legal advice. Consult a qualified legal professional for specific legal interpretations or enforcement matters.
