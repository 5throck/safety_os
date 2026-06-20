# Safety OS Getting Started Tutorial

> **Audience**: First-time users of Safety OS — EHS managers, safety and health officers, and compliance officers.
> **Time required**: Approximately 15 minutes (reading + hands-on practice).
> **Prerequisites**: None. Familiarity with Korean EHS/GxP work is sufficient.

---

## 1. What is Safety OS?

Safety OS is **an AI agent team for Korean EHS (Environment, Health, and Safety) and GxP regulatory compliance**. Instead of single-handedly tracking and documenting dozens of regulations — the Occupational Safety and Health Act (OSHA-KR), the Serious Accidents Punishment Act (SAPA), the Pharmaceutical Affairs Act, the Chemical Substances Control Act, and more — Safety OS's AI agents analyze your situation, identify the applicable legal provisions, and execute the appropriate work procedure (workflow).

How Safety OS works is straightforward. You describe your current situation, and the PM agent (acting as CSO, Chief Safety Officer) classifies the request and dispatches the responsible specialist agent. The specialist agent executes the regulation-driven workflow and generates an **evidence record** in JSON format. This evidence record becomes the foundational document of your audit trail. You do not need to memorize regulations or fill out forms by hand.

---

## 2. The Agent Team You Need to Know Before You Start

Safety OS is an agent team organized in a hierarchy. You always send requests to the **PM agent (CSO)**. Calling specialist agents directly is not supported.

### Agent Role Summary

| Agent | Role | What it produces |
|-------|------|------------------|
| **PM (CSO)** | Coordinator. Single point of contact for all requests. Verifies legal basis, then dispatches specialist agents | Execution plan table, audit log |
| **psm-agent** | Process Safety Management (PSM) specialist. Executes PHA, MOC, PSSR, PSI, MI, SOP | `psm-moc-record.json`, `psm-pssr-record.json` |
| **msds-agent** | Chemical substance data and GHS classification specialist | `msds-record.json`, `ghs-classification-record.json` |
| **training-agent** | Safety training management (OSHA-KR Article 29/31/32) | `training-record.json` |
| **ehschem-agent** | Chemical plant operations coordinator. Dispatches psm, msds, emergency | `ehschem-plant-safety-record.json` |
| **ehsconst-agent** | Construction site operations coordinator. Manages fall hazards, work permits, TBM | `ehsconst-inspection-record.json` |
| **gasterm-agent** | Gas terminal and filling station coordinator | `gasterm-operation-record.json` |
| **powergen-agent** | Power generation facility coordinator | `powergen-operation-record.json` |
| **gmp/gdp/glp/gcp/gvp-agent** | Pharmaceutical GxP stage-specific specialist agents | Stage-specific GxP records |
| **meddevice-agent** | Medical device coordinator (ISO 13485, ISO 14971) | `meddevice-record.json` |
| **emergency-agent** | Emergency response (dispatchable from all domains) | `emergency-response-record.json` |

### Core Principle

```
User → PM (CSO) → Industry-domain agent (coordinator)
                       └→ Functional-domain agent (service provider)
                       └→ emergency-agent (when an emergency occurs)
```

---

## 3. Your First Task: 5-Minute Quick Start

### Situation Setup

> "I am the EHS manager at a chemical plant. We are installing a new pump in a covered process area. I need to handle Management of Change (MOC) safely."

This situation requires a PSM Management of Change workflow under **OSHA-KR Article 44** (workplaces required to submit a Process Safety Report). Follow the steps below to converse with Safety OS.

---

### Step 1 — Describe the Situation to the PM Agent

**What you enter:**
```
I am going to install a new pump in a covered process area.
Please start the PSM MOC procedure. Target process: sulfuric acid transfer line (workplace subject to OSHA-KR Article 44).
```

**Example PM (CSO) response:**
```
[PM — CSO] Request received.

Legal basis verification:
- OSHA-KR Article 44 (obligation to submit a Process Safety Report)
- OSHA-KR Enforcement Rule Annex 13 (PSM elements: Management of Change)
- SAPA Article 4 (obligation to maintain a safety and health management system)

Classification: Tier 2 chemical plant (ehschem) + Tier 1 PSM service dispatch required

Execution plan:
1. ehschem-agent (coordinator) → set plant context
2. psm-agent (service) → execute MOC workflow
3. evidence record generation → psm-moc-record.json

Dispatching ehschem-agent...
```

---

### Step 2 — The Industry Coordinator Sets the Context

**Example ehschem-agent response:**
```
[ehschem-agent] Chemical plant context confirmed.

Plant type: Fine chemicals / includes covered process
PSM obligation: Yes (psm_applicable: true)
Target process: Sulfuric acid transfer line
Change type: New equipment installation (pump)

Dispatching the MOC workflow to psm-agent.
```

---

### Step 3 — The PSM Agent Executes MOC

**Example psm-agent response:**
```
[psm-agent] Starting the MOC workflow.

Collecting change information:
  Change number: MOC-2026-047
  Change type: Equipment replacement / new installation
  Affected process: Sulfuric acid transfer line (per P&ID Rev. 12)
  Expected hazards: Sulfuric acid leak, electrical arc, confined-space proximity

Hazard assessment:
  PHA method: HAZOP (with What-If in parallel)
  Identified hazards:
    - Pump seal failure → sulfuric acid leak (severity: HIGH, frequency: LOW)
    - Poor piping connection → pressure anomaly (severity: MEDIUM, frequency: LOW)

Safety measures:
  - Dual-seal pump specification required
  - Update PSI (Process Safety Information) before installation
  - Conduct PSSR (Pre-Startup Safety Review) before startup approval
  - Revise relevant SOPs and train workers

Generating evidence record...
```

---

### Step 4 — Review the Generated Evidence Record

**What you enter:**
```
Show me the evidence record.
```

**Example psm-moc-record.json generated by psm-agent:**
```json
{
  "record_id": "PSM-MOC-2026-047",
  "schema_version": "2.1.0",
  "workflow": "psm/moc",
  "legal_basis": [
    "산업안전보건법 제44조 (공정안전보고서 제출 의무)",
    "산업안전보건법 시행규칙 별표 13 (PSM 12대 요소 중 변경관리)",
    "OSHA-KR 고시 제2023-19호 (공정안전보고서 세부 기준)"
  ],
  "change_info": {
    "moc_number": "MOC-2026-047",
    "change_type": "equipment_installation",
    "description": "Sulfuric acid transfer line new pump installation (P&ID revision)",
    "initiator": "EHS Manager",
    "initiated_date": "2026-06-20",
    "target_completion": "2026-07-15"
  },
  "process_info": {
    "process_name": "Sulfuric acid transfer process",
    "pid_reference": "P&ID-H2SO4-REV12",
    "covered_process": true,
    "psm_applicable": true
  },
  "hazard_assessment": {
    "method": "HAZOP",
    "scenarios": [
      {
        "deviation": "Pump seal failure",
        "consequence": "Sulfuric acid leak",
        "severity": "HIGH",
        "frequency": "LOW",
        "risk_level": "MEDIUM",
        "safeguard": "Dual-seal pump specification + leak detector"
      }
    ]
  },
  "required_actions": [
    { "action": "Update PSI (P&ID revision)", "responsible": "Process Engineer", "due": "2026-07-01" },
    { "action": "Conduct PSSR", "responsible": "PSM Team Lead", "due": "2026-07-14" },
    { "action": "Revise relevant SOPs", "responsible": "Safety Manager", "due": "2026-07-10" },
    { "action": "Conduct worker training (change content)", "responsible": "Training Officer", "due": "2026-07-14" }
  ],
  "approvals": {
    "initiator_sign": { "status": "pending", "e_signature": null },
    "safety_manager_sign": { "status": "pending", "e_signature": null },
    "process_engineer_sign": { "status": "pending", "e_signature": null }
  },
  "audit_trail": {
    "created_at": "2026-06-20T09:32:15+09:00",
    "created_by": "psm-agent",
    "alcoa_status": "COMPLIANT"
  }
}
```

This single JSON file is the audit evidence record that tracks the entire MOC process.

---

## 4. Choosing the Right Domain for Your Situation

Before making a request, refer to the decision flowchart below to determine which agent to approach. (The PM always performs final coordination, but prior understanding enables a faster conversation.)

```
[Where do I work?]
        |
        |-- Pharmaceutical / biotech industry ---→ [Which stage?]
        |                              |-- Manufacturing quality ---→ gmp-agent
        |                              |-- Distribution management ---→ gdp-agent
        |                              |-- Non-clinical trials ---→ glp-agent
        |                              |-- Clinical trials ---→ gcp-agent
        |                              └-- Post-market surveillance ---→ gvp-agent
        |
        |-- Chemical plant (refining, petrochemical, fine chemicals)
        |           └→ ehschem-agent (coordinator)
        |               ├── If a PSM-covered process is involved → psm-agent collaboration
        |               └── If a new chemical substance is handled → msds-agent collaboration
        |
        |-- Construction site
        |           └→ ehsconst-agent (coordinator)
        |               └── If a serious accident occurs → emergency-agent immediate dispatch
        |
        |-- Gas terminal / LNG / LPG / hydrogen filling station
        |           └→ gasterm-agent (coordinator)
        |               └── If a large-scale facility (PSM-covered) → psm-agent collaboration
        |
        |-- Power plant (LNG thermal, renewables, etc.; excluding nuclear)
        |           └→ powergen-agent (coordinator)
        |
        |-- Medical device manufacturing / import
        |           └→ meddevice-agent (coordinator)
        |
        |-- Only chemical substance data needed (any industry)
        |           └→ msds-agent (functional domain, direct access possible)
        |
        |-- Safety training management (any industry)
        |           └→ training-agent (functional domain, direct access possible)
        |
        └-- An emergency has occurred!
                    └→ Notify PM immediately → emergency-agent auto-dispatched
```

### Quick Reference Table

| My situation | What to say | Agent PM dispatches |
|--------------|-------------|---------------------|
| Chemical plant PSM MOC | "Management of Change required for covered process" | ehschem → psm |
| New chemical introduction | "New chemical substance MSDS intake" | ehschem → msds |
| Construction site TBM | "Conduct today's TBM" | ehsconst |
| Fall-hazard work | "Issue a high-work permit" | ehsconst |
| Clinical trial adverse event reporting | "Serious Adverse Event (SAE) occurred" | gcp → emergency |
| Pharmaceutical cold-chain excursion | "Temperature excursion needs verification" | gdp |
| LNG terminal routine inspection | "Periodic gas storage tank inspection" | gasterm (→ psm if large-scale) |
| Power plant periodic safety inspection | "Periodic safety inspection of power generation facility" | powergen |
| Safety training plan development | "Establish annual safety training schedule" | training |

---

## 5. How to Read an Evidence Record

Using the `psm-moc-record.json` generated above, this section explains the role of each part during an audit.

### Key Field Guide

| Field | Role | What to check during an audit |
|-------|------|-------------------------------|
| `record_id` | Unique identifier. Used for cross-referencing with other records | Whether numbers are managed sequentially |
| `schema_version` | Evidence model version. Tracks regulatory revision history | Whether the version satisfies the legal requirements in effect at that time |
| `legal_basis` | Applicable legal provisions. **A minimum of 3 is mandatory** | The first item an auditor checks |
| `change_info` | Change content, initiator, dates | ALCOA+ Attributable / Contemporaneous evidence |
| `hazard_assessment` | HAZOP/PHA results. Severity, frequency, and safeguards per risk scenario | Whether risk assessment was substantively performed |
| `required_actions` | Follow-up action list. Includes responsible party and due date | Tracking of action implementation |
| `approvals.e_signature` | Electronic signature. v1: schema only, v2: PKI/HSM | Whether an authorized approver signed |
| `audit_trail` | Creation timestamp, creator, ALCOA status | Whether the record was tampered with |

### What are the ALCOA+ principles?

All evidence records in Safety OS follow the **ALCOA+** data integrity principles.

| Principle | English | Meaning |
|-----------|---------|---------|
| **A** | Attributable | Identifiable as to who performed the action |
| **L** | Legible | Readable and permanently preservable |
| **C** | Contemporaneous | Recorded at the time of the action |
| **O** | Original | The first record (not a copy) |
| **A** | Accurate | Free of errors |
| **+C** | Complete | A complete record |
| **+C** | Consistent | Consistent with other records |
| **+E** | Enduring | Complies with the regulatory retention period |
| **+A** | Available | Immediately accessible when needed |

---

## 6. Five Common Mistakes

### Mistake 1 — Trying to call a specialist agent directly, skipping the PM

All requests in Safety OS **must go through the PM (CSO)**. Calling psm-agent, msds-agent, and others directly is not supported. The reason is simple — the correct agent is dispatched only after the PM verifies the legal basis (`legal_basis`) and determines whether multi-domain coordination is needed. Skipping the PM may produce evidence records without legal basis.

**Correct approach:**
```
✗ "psm-agent, start MOC"
✓ "I am installing a new pump in a covered process. Please start the PSM MOC procedure."
```

### Mistake 2 — Confusing PSM training with general safety training

PSM has **12 elements**, of which **Element 4 is Training**. This is a training record within the PSM workflow and is distinct from the `training` domain.

| Category | Where it is handled | Legal basis |
|----------|---------------------|-------------|
| PSM Training (Element 4) | Inside psm-agent | OSHA-KR Enforcement Rule Annex 13 |
| General safety and health training | training-agent | OSHA-KR Article 29/31/32 |
| New chemical substance training notification | msds-agent → occupational-health | OSHA-KR Article 114 |

### Mistake 3 — Mistaking an evidence record for an official report

The JSON evidence record generated by Safety OS is a **workflow execution record**. It does **not replace official administrative documents** such as the Process Safety Report (PSR), Chemical Impact Assessment, or MFDS reports.

Uses of the evidence record:
- Internal audit trail
- Compliance documentation supporting material
- Proof of work-procedure implementation

Official document submission must be done separately by the responsible person. Safety OS is a tool that helps you prepare for it.

### Mistake 4 — Handling a PSM-covered facility as a general safety inspection without knowing it is subject to PSM

Workplaces with a covered process are subject to PSM under OSHA-KR Article 44. This applies not only to chemical plants but also potentially to **large-scale LNG terminals, LPG bases, and large-scale LNG thermal power plants**. Regardless of which industry domain your facility falls under, confirm with the PM whether you are subject to PSM first.

```
To PM: "Please confirm whether our facility is subject to PSM.
        We operate an LNG terminal with a storage capacity of __ tons."
```

### Mistake 5 — Attempting a normal workflow during an emergency

In the event of fire, chemical leak, explosion, or serious accident, **do not start a regular workflow.** Immediately notify the PM that it is an emergency, and the `emergency-agent` will be dispatched right away.

```
✗ "Please check the MSDS for a chemical leak" (regular workflow)
✓ "Emergency: sulfuric acid leak occurred. Immediate response required." → emergency-agent immediate dispatch
```

---

## 7. Next Steps

You have completed the tutorial. Continue your in-depth learning with the materials below.

### Additional Documentation

| Document | Content | Link |
|----------|---------|------|
| **User Scenarios Guide** | Detailed step-by-step explanations of 5 real-world scenarios (new chemical introduction, SAE reporting, construction site daily safety, pharmaceutical cold-chain, chemical plant maintenance) | [user-scenarios.md](user-scenarios.md) |
| **Domain Classification Guide** | 3-Tier domain structure, multi-domain dispatch rules, PSM application scenarios | [domain-classification-guide.md](domain-classification-guide.md) |
| **User Guide** | Domain selection criteria, ALCOA+ evidence record structure, reference workflow list | [user-guide.md](user-guide.md) |

### Recommended Practice Order

1. **Quick Start in this tutorial (§3)** → Try requesting an MOC from the PM
2. **[user-scenarios.md](user-scenarios.md) Scenario 1** → New chemical introduction (MSDS + PSM collaboration)
3. **[user-scenarios.md](user-scenarios.md) Scenario 3** → Construction site daily safety (ehsconst routine workflow)
4. Practice with the scenario closest to your own work

### Legal Disclaimer

> **Regulatory interpretation is your responsibility. This system is a workflow automation assistance tool and does not provide legal advice.**
>
> The OSHA-KR, SAPA, Pharmaceutical Affairs Act, and Chemical Substances Control Act provisions referenced by Safety OS are used solely for workflow documentation purposes. The accuracy and applicability of all regulatory references must be verified by a qualified legal or EHS professional before operational use. The AI agents in this system do not provide legal opinions.

---

*Last Updated: 2026-06-20*
