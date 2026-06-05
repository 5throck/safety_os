---
name: permit-to-work
description: Trigger permit-to-work (PTW) issuance workflow for high-risk or non-routine work
owner: safety-workflow-manager
status: active
version: 1.0.0
metadata:
  triggers:
    - ?묒뾽?덇???
    - permit to work
    - PTW
    - hot work permit
    - ?붽린?묒뾽
    - 諛?먭났媛??묒뾽
    - confined space
  agents:
    - safety-workflow-manager
    - risk-assessment-agent
  legal_basis:
    - ?곗뾽?덉쟾蹂닿굔踰???8議?(?덉쟾議곗튂)
    - ?곗뾽?덉쟾蹂닿굔踰???9議?(蹂닿굔議곗튂)
scope: workspace
---

# Permit to Work

## When to Use

Invoke this skill when a worker or supervisor requests authorization for non-routine, high-risk, or regulated work activities including but not limited to: hot work (welding, cutting, grinding), confined space entry, work at height, electrical isolation, and chemical handling. PTW is required before work commences.

## Steps

1. **Work Type Identification** ??Classify the work type (hot work, confined space, electrical, height, chemical, general high-risk). Select the applicable PTW form template.
2. **Risk Assessment** ??Invoke the `risk-assessment` skill. The completed risk assessment must be attached to the PTW before issuance. Risk level must be acceptable (below site threshold) or controls must reduce residual risk to acceptable.
3. **Control Measure Verification** ??Confirm all required control measures are in place prior to issuance: isolation verified, PPE available, emergency equipment present, communication established.
4. **Permit Issuance** ??Issue the permit with: permit number, work description, work area, permitted personnel, valid time window (start/expiry), required controls, issuing authority signature.
5. **Post-Work Sign-Off** ??Upon completion, the performing authority signs off confirming work area is safe and restored. Permit is formally closed. Document any deviations or incidents.

## Output Format

Save permit record to `memory/findings/ptw-YYYY-MM-DD-<permit-number>.md`:

```markdown
# Permit to Work Record
permit_number: PTW-YYYY-MM-DD-NNN
date_issued: YYYY-MM-DD
expiry: YYYY-MM-DD HH:MM
work_type: <hot_work | confined_space | electrical | height | chemical | general>
work_description: <description>
work_area: <location>
permitted_personnel: [<names>]
legal_basis: ?곗뾽?덉쟾蹂닿굔踰???8議? ??9議?
risk_assessment_ref: memory/findings/risk-assessment-YYYY-MM-DD-<scope>.md
status: issued | active | closed | cancelled

## Control Measures
- [ ] Isolation verified
- [ ] PPE confirmed
- [ ] Emergency equipment present
- [ ] Communication established
- [ ] <additional controls>

## Signatures
Issuing Authority: <name> ??<date>
Performing Authority: <name> ??<date>
Close-Out Sign-Off: <name> ??<date>
```

## Legal Notes

- ?곗뾽?덉쟾蹂닿굔踰???8議?mandates that employers implement safety measures for work with risk of falls, collapse, fire, or explosion.
- ?곗뾽?덉쟾蹂닿굔踰???9議?mandates health protection measures for work involving hazardous substances or conditions.
- PTW systems are considered a best-practice administrative control under these articles. Permits must not be back-dated or issued after work commences.
- This skill provides workflow assistance only and does not constitute legal advice.
