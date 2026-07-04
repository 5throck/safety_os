---
name: risk-assessment
description: Trigger risk assessment workflow for hazard identification and scoring
owner: risk-assessment-agent
status: active
version: 1.0.0
metadata:
  triggers:
    - 위험성평가
    - risk assessment
    - hazard identification
    - 위험 평가
    - 작업위험성분석
  agents:
    - risk-assessment-agent
  legal_basis:
    - 산업안전보건법 제36조 (위험성평가 의무)
scope: workspace
---

# Risk Assessment

## When to Use

Invoke this skill when a user reports a new work task, equipment change, workplace modification, or requests a formal hazard identification and risk scoring exercise. Also use when onboarding new workers to a worksite or updating existing risk registers.

## Steps

1. **Scope Definition** — Identify the workplace unit, work task, and affected personnel. Confirm the assessment period and responsible person.
2. **Hazard Enumeration** — List all identified hazards (physical, chemical, biological, ergonomic, psychosocial) associated with the task or area.
3. **Risk Scoring** — Score each hazard on two axes:
   - **Likelihood**: 1 (rare) to 5 (almost certain)
   - **Severity**: 1 (negligible) to 5 (catastrophic)
   - **Risk Level** = Likelihood × Severity (1–25 scale)
4. **Control Assignment** — For each hazard, assign one or more controls following the hierarchy: Elimination → Substitution → Engineering → Administrative → PPE. Record responsible person and target completion date.
5. **Documentation** — Save the completed assessment record as structured JSON per `evidence-models/domains/functional/risk-assessment/risk-assessment-record.json` schema. Also save a human-readable summary to `memory/findings/` with the `legal_basis` field populated. Obtain responsible person signature or digital acknowledgment.

## Output Format

Generate a structured JSON evidence record conforming to `risk-assessment-record.json` (OSHA-KR Article 36 evidence model) and save a human-readable summary to `memory/findings/risk-assessment-YYYY-MM-DD-<scope>.md` with the following structure:

```markdown
# Risk Assessment Record
date: YYYY-MM-DD
assessor: <name>
legal_basis: 산업안전보건법 제36조
status: draft | approved

## Hazards
| # | Hazard | Likelihood | Severity | Risk Level | Controls | Owner | Due |
|---|--------|-----------|----------|------------|----------|-------|-----|
| 1 | ...    | 3         | 4        | 12 (High)  | ...      | ...   | ... |

## Approval
Approved by: <CSO/Manager>
Date: YYYY-MM-DD
```

## Legal Notes

- 산업안전보건법 제36조 requires employers to conduct risk assessments and implement control measures for all identified hazards.
- Assessments must be reviewed when work methods change, after incidents, or at a minimum annually.
- Records must be retained for a minimum of 3 years per enforcement guidelines.
- This skill provides workflow assistance only and does not constitute legal advice.
