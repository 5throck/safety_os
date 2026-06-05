---
name: emergency-response
description: Trigger emergency response protocol on incident, fire, spill, or injury report
owner: emergency-agent
status: active
version: 1.0.0
metadata:
  triggers:
    - 鍮꾩긽???
    - emergency
    - ?ш퀬 諛쒖깮
    - ?붿옱
    - ?꾩텧
    - 遺??
    - 以묐??ы빐
    - serious accident
    - ??컻
    - explosion
  agents:
    - emergency-agent
  legal_basis:
    - ?곗뾽?덉쟾蹂닿굔踰???4議?(以묐??ы빐 諛쒖깮 ??議곗튂)
    - 以묐??ы빐泥섎쾶踰???議?(以묐??곗뾽?ы빐 ?ъ뾽二??섎Т)
scope: workspace
---

# Emergency Response

## When to Use

Invoke this skill immediately upon any report of an emergency event including: fire, explosion, chemical spill or release, structural collapse, serious injury or fatality, or any condition requiring immediate evacuation. This skill bypasses normal safety-workflow-manager routing and dispatches the emergency-agent directly via PM.

> **Dispatch note**: emergency-agent is dispatched directly by PM ??safety-workflow-manager is NOT in the chain for emergency response. Speed of response is paramount.

## Steps

1. **Emergency Classification** ??Identify the emergency type from the following categories:
   - Type A: Fire / Explosion
   - Type B: Chemical Spill / Toxic Release
   - Type C: Structural Collapse / Entrapment
   - Type D: Serious Injury / Fatality
   - Type E: Other (specify)
   - Note whether this qualifies as a 以묐??ы빐 (serious industrial accident) under 以묐??ы빐泥섎쾶踰?

2. **Response Protocol Activation** ??Activate the site-specific emergency response plan (ERP). Initiate evacuation if required. Secure the incident area and establish a command post.

3. **Notification** ??Notify in the following order:
   - Immediate: Site emergency team, first aiders
   - Within 1 hour: CSO (Chief Safety Officer) / site manager
   - Regulatory: If a 以묐??ы빐 (fatality, 3+ simultaneous injuries, or occupational disease requiring 1+ year recovery), notify 怨좎슜?몃룞遺 (Ministry of Employment and Labor) immediately per ?곗뾽?덉쟾蹂닿굔踰???4議?
   - SAPA reporting: If qualifying under 以묐??ы빐泥섎쾶踰? notify authorities within the legally prescribed timeframe.

4. **Evidence Preservation** ??Do not alter the incident scene except to provide emergency care or prevent further harm. Document: photographs, witness statements, equipment state, environmental conditions, timeline of events.

5. **Post-Incident Report** ??Within 24 hours of stabilization, create a preliminary incident record. Within 30 days, produce a full investigation report with root cause analysis and corrective actions.

## Output Format

Save incident record to `memory/incidents/incident-YYYY-MM-DD-<type>-NNN.md`:

```markdown
# Incident Record
incident_number: INC-YYYY-MM-DD-NNN
incident_type: <Type A-E>
date_time: YYYY-MM-DD HH:MM
location: <area>
injured_persons: <number and names if applicable>
legal_basis: ?곗뾽?덉쟾蹂닿굔踰???4議? 以묐??ы빐泥섎쾶踰???議?
sapa_qualifying: true | false
status: open | under_investigation | closed

## Initial Report
<narrative description of the emergency>

## Notifications Made
| Recipient | Method | Time | Name |
|-----------|--------|------|------|
| CSO       | Phone  | HH:MM | ... |
| MOEL      | Form   | HH:MM | ... |

## Evidence Log
- [ ] Scene photographs taken
- [ ] Witness statements collected
- [ ] Equipment state documented
- [ ] Environmental conditions recorded

## Corrective Actions
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|

## Investigation Report
Due: YYYY-MM-DD
Completed: YYYY-MM-DD
Root Cause: <RCA summary>
```

## Legal Notes

- ?곗뾽?덉쟾蹂닿굔踰???4議?requires employers to immediately halt work and take protective measures upon a serious industrial accident, and to report to the Ministry of Employment and Labor without delay.
- 以묐??ы빐泥섎쾶踰???議?imposes criminal liability on business owners and responsible managers for serious industrial accidents resulting from failure to fulfill safety management obligations.
- Failure to report a qualifying 以묐??ы빐 is itself a legal violation independent of the underlying accident.
- This skill provides workflow assistance only and does not constitute legal advice. In a real emergency, prioritize human safety over documentation.
