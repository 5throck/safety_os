# Safety OS — Architecture Overview

> **Last Updated**: 2026-06-19
> **Active Domains**: 12 (7 functional + 5 industry)
> **Architecture**: 2-Tier functional × industry matrix

## 1. System Overview

Safety OS is a multi-domain compliance orchestration platform for Korean EHS/GxP regulations. It organizes safety management into **functional services** (methodology/data) and **industry domains** (specific operations), connected via a dispatch matrix.

```
┌─────────────────────────────────────────────────────────────────┐
│                    PM Agent (CSO / Chief Safety Officer)         │
│                    Facilitator + final authority                  │
├─────────────┬───────────────────────────────────────────────────┤
│  SGM        │  SWM (Safety Workflow Manager)                     │
│  Strategy   │  Execution coordinator                             │
│  KPI/Policy │  Dispatches to domain agents                       │
├─────────────┴───────────────────────────────────────────────────┤
│                    Domain Agents (12 active)                      │
├──────────────────────────┬──────────────────────────────────────┤
│  Functional (Tier 1)     │  Industry (Tier 2)                    │
│  PSM  MSDS  GMP  GDP     │  ehsconst  ehschem  gasterm           │
│  GLP  GCP  GVP           │  powergen  meddevice                  │
├──────────────────────────┴──────────────────────────────────────┤
│              Cross-Cutting Services (Tier 3)                      │
│  Emergency (9 scenarios)  │  Daily EHS (14 workflows)            │
└─────────────────────────────────────────────────────────────────┘
```

## 2. 2-Tier Matrix

```
                 Pharma    Chemical    Gas/Energy   Power    Construction   MedDevice
PSM (func)         -         ✓            ✓           ✓          -              -
MSDS (func)        ✓         ✓            ✓           ✓          ✓              ✓
GxP (func)         ✓(5)      -            -           -          -              -
Emergency (cc)     ✓         ✓            ✓           ✓          ✓              ✓
─────────────────────────────────────────────────────────────────────────────────────────
ehsconst (ind)                                                        ✓
ehschem (ind)                ✓
gasterm (ind)                            ✓
powergen (ind)                                      ✓
meddevice (ind)                                                                  ✓
```

## 3. Domain Inventory

### Functional Domains (7)

| Domain | Workflows | Evidence Models | Key Standard |
|--------|-----------|-----------------|--------------|
| PSM | 11 | 7+4 | OSHA-KR Art 44 (14 elements) |
| MSDS | 7 | 6 | GHS Rev 9 + K-REACH |
| GMP | 10 | 11 | KP-GMP + ICH Q7/Q9/Q10 |
| GDP | 8 | 7 | KGDP + PIC/S |
| GLP | 8 | 7 | OECD GLP + MAD |
| GCP | 8 | 7 | KGCP + ICH E6(R3) |
| GVP | 8 | 7 | ICH E2 series + EU GVP |

### Industry Domains (5)

| Domain | Workflows | Evidence Models | Key Standard |
|--------|-----------|-----------------|--------------|
| ehsconst | 9 | 9 | OSHA-KR + SAPA Art 12 |
| ehschem | 8 | 6 | CCA + K-REACH + 환경법 |
| gasterm | 8 | 7 | 고압가스법 + LPG법 + 수소법 |
| powergen | 8 | 7 | 전기사업법 + 전기안전법 |
| meddevice | 8 | 7 | KGMP-MD + ISO 13485 + ISO 14971 |

### Cross-Cutting Services

| Service | Count | Coverage |
|---------|-------|----------|
| Emergency | 9 workflows | fire, disaster, medical, chemical, explosion, confined-space, high-angle, electrical, mechanical |
| Daily EHS | 14 workflows | risk-assessment, permit-to-work, equipment-inspection, etc. |

## 4. Dispatch Flow

```
User Request
  ↓
PM (CSO) → SWM
  ↓
Industry Domain Agent (coordinator)
  ├── Industry-specific workflow (direct)
  ├── Functional service dispatch (PSM/MSDS/GxP)
  └── Emergency dispatch (if urgent)
```

**Example: Chemical Plant PHA**
1. ehschem-agent receives "perform PHA" request
2. Dispatches to functional/psm/pha-hazop workflow
3. ehschem provides industry context (plant_type, chemical_category)
4. PSM agent executes PHA methodology
5. Evidence record generated in ehschem evidence model

## 5. Audit System

`safety-audit.ts` v3.0.0 validates:
- **116 workflow schema.yaml** files (legal_basis ≥2/3, status, applicability)
- **103 evidence models** ($ref resolution, domain-specific common fields)
- **25 regulations** (source_mcp validation)
- **Role separation** (risk-assessment-agent ↔ gmp-qrm)
- **12 domain-specific validations** (functional + industry)

## 6. Key Documents

| Document | Path |
|----------|------|
| Domain Classification Guide | `docs/_shared/domain-classification-guide.md` |
| Domain Onboarding SOP | `docs/_shared/domain-onboarding-guide.md` |
| Reference Workflow Pattern | `docs/_shared/reference-workflow-pattern.md` |
| User Guide | `docs/_shared/user-guide.md` |
| MCP Integration Guide | `docs/_shared/mcp-integration-guide.md` |
