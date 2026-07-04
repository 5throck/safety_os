---
name: chemical-risk-assessment
owner: msds-agent
scope: workspace
status: active
description: Scenario-based chemical risk assessment combining hazard data (GHS classification) with exposure evaluation. Outputs risk characterization with control recommendations.
version: "1.0"
created: 2026-06-17
last_updated: 2026-06-17
---

# Chemical Risk Assessment Skill

## Overview
Performs chemical-specific risk assessment by combining GHS hazard data with use-scenario exposure evaluation. Outputs risk characterization with engineering controls, PPE, and emergency recommendations.

## Scope (Role Separation)
> **This skill provides risk characterization only**. Actual exposure monitoring, workplace measurement, and health surveillance are handled by `occupational-health-agent`. This skill does NOT perform or track monitoring.

- **In scope**: Risk characterization for new chemical introduction approval
- **Out of scope**: Workplace measurement, biological monitoring, health examination targeting

## Methodology

### Step 1: Hazard Identification
- Input: `msds-record.json` (Sections 2, 8, 11)
- Output: Hazard profile (GHS classes, toxicity endpoints, OEL values)

### Step 2: Exposure Assessment
- Input: Use scenario (handling, transfer, application method)
- Evaluate routes:
  - **Inhalation**: vapor pressure + handling temperature → exposure estimate
  - **Dermal**: contact area + duration + glove permeation
  - **Ingestion**: unlikely in industrial setting (hygiene practices)
- Output: Exposure magnitude estimate (mg/m³ for inhalation, mg/cm² for dermal)

### Step 3: Risk Characterization
- Calculate Risk Characterization Ratio (RCR):
  - RCR = Exposure Estimate / OEL (or DNEL)
  - RCR < 0.1: Acceptable
  - RCR 0.1-1.0: Tolerable with controls
  - RCR > 1.0: Unacceptable, redesign required
- Identify worst-case exposure scenario

### Step 4: Control Recommendation
Per hierarchy of controls:
1. **Elimination**: Can the chemical be removed?
2. **Substitution**: Less hazardous alternative available?
3. **Engineering Controls**: Local exhaust ventilation, enclosure, automation
4. **Administrative Controls**: Work procedures, training, time limits
5. **PPE**: Respirator type, glove material, eye protection

### Step 5: Emergency Preparedness
- Spill response plan (links to `chemical-spill-reference` workflow)
- First-aid procedures (from MSDS Section 4)
- Fire-fighting media (from MSDS Section 5)
- Evacuation distance

## Use Scenarios Evaluated

| Scenario | Default Assumptions |
|----------|---------------------|
| Open handling (transfer) | Indoor, 1 hr/day, 8 hr/week |
| Closed system (process) | Maintenance exposure only |
| Spray application | Aerosol generation, respiratory hazard |
| Lab-scale use | <1L quantity, fume hood assumed |
| Bulk storage | Static, periodic sampling exposure |

## Output Format

```json
{
  "substance_id": "...",
  "use_scenario": "open_handling_transfer",
  "hazard_profile": { ... },
  "exposure_estimate": {
    "inhalation_mg_per_m3": 5.2,
    "dermal_mg_per_cm2": 0.1
  },
  "risk_characterization": {
    "rcr_inhalation": 0.52,
    "rcr_dermal": 0.05,
    "overall_risk_level": "tolerable_with_controls"
  },
  "recommended_controls": [
    "engineering: local_exhaust_ventilation (capture velocity 0.5 m/s)",
    "ppe: respirator P100 + nitrile gloves",
    "administrative: 30 min exposure limit per session"
  ],
  "emergency_preparedness": {
    "spill_response_ref": "MSDS-SPILL-...",
    "first_aid_summary": "...",
    "evacuation_distance_m": 25
  }
}
```

## Integration Points

- **Input from**: `msds-record.json` (hazard data), `chemical-approval` workflow (use scenario)
- **Output to**: `chemical-approval-record.json` (risk assessment attachment)
- **Handoff to**: `occupational-health-agent` (for monitoring planning if approved)

## Confidence Levels
- **High**: Validated exposure model + complete hazard data
- **Medium**: Estimated exposure + GHS-derived hazard data
- **Low**: Default assumptions + incomplete data → recommend monitoring

## v2 Roadmap
- Quantitative exposure modeling (ECETOC TRA, ART tool integration)
- Multiple scenario evaluation per substance
- Risk matrix visualization
- Integration with PSM risk assessment (process-level)

## Legal Disclaimer
> Skill automation only. Final risk acceptance decisions require qualified EHS professional review per OSHA-KR Article 113.
