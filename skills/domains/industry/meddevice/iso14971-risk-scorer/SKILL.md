---
name: iso14971-risk-scorer
owner: meddevice-agent
scope: workspace
status: active
description: ISO 14971 risk estimation and scoring for medical devices. Severity × Probability matrix, residual risk evaluation.
version: "1.0"
created: "2026-06-18"
last_updated: "2026-06-18"
---

# ISO 14971 Risk Scorer Skill

## Overview
ISO 14971 위해 추정 및 평가 — 심각도(Severity) × 발생확률(Probability) 매트릭스 기반 risk scoring.

## Risk Estimation Matrix

| Severity \ Probability | Improbable | Remote | Occasional | Probable | Frequent |
|------------------------|------------|--------|------------|----------|----------|
| Negligible             | Low        | Low    | Low        | Medium   | Medium   |
| Minor                  | Low        | Low    | Medium     | Medium   | High     |
| Serious                | Low        | Medium | Medium     | High     | Critical |
| Critical               | Medium     | Medium | High       | Critical | Critical |
| Catastrophic           | Medium     | High   | Critical   | Critical | Critical |

## ISO 14971 Process

### Step 1: Hazard Identification
- Intended use / intended users
- Foreseeable misuse
- Reasonably foreseeable misuse
- Hazard identification (energy, biological, chemical, information)

### Step 2: Risk Estimation
- Severity (S1-S5): Negligible → Catastrophic
- Probability (P1-P5): Improbable → Frequent
- Risk level = f(S, P) — matrix lookup

### Step 3: Risk Evaluation
- Compare to risk acceptability criteria
- Broadly acceptable / ALARP / Unacceptable

### Step 4: Risk Control
- Inherent safety by design
- Protective measures (alarms, interlocks)
- Information for safety (IFU, labeling)
- Residual risk disclosure

### Step 5: Residual Risk Evaluation
- Overall residual risk
- Benefit-risk comparison (Class 3/4 devices)
- Risk management report

## Korean Class-Specific Requirements

| Class | Risk Management Depth |
|-------|-----------------------|
| Class 1 | Simplified (basic ISO 14971) |
| Class 2 | Standard ISO 14971 |
| Class 3 | Full + benefit-risk analysis |
| Class 4 | Full + clinical data + PMCF |

## Output

Returns risk estimation:
```json
{
  "hazard_id": "H-001",
  "hazard_description": "Electrical shock from power supply",
  "severity": "Critical (S4)",
  "probability": "Remote (P2)",
  "risk_level_before": "Medium",
  "risk_control": "Double insulation + grounding + IFU warning",
  "residual_severity": "Critical (S4)",
  "residual_probability": "Improbable (P1)",
  "risk_level_after": "Low",
  "residual_risk_acceptable": true,
  "overall_residual_risk": "ALARP"
}
```

## Legal Disclaimer
> 자동화 위해 추정 보조. 최종 위해 수용성 판정은 자격을 갖춘 의료기기 위해관리자 + 임상 평가자.
