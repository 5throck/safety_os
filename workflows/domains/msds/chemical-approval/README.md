# 신규 화학물질 도입 승인 (New Chemical Introduction Approval) Workflow

## 1. Objective
Review and approve requests to introduce new chemicals at site facilities, verifying compliance with OSHA-KR Article 113 (prohibited/permission/harmful substances) and 유해화학물질 관리법 (TCCL).

## 2. Applicability
All new chemical introduction requests for substances not currently in the chemical inventory, under the `chemical-handling` profile.

## 3. Workflow Steps

### Step 1: Introduction Request
- Receive request from production/engineering with: chemical name, CAS number, intended use, expected quantity, storage location.

### Step 2: Substance Classification Check
- Query prohibited substance registry (취급금지물질 list under OSHA-KR Article 113).
- Query permission-required substance registry (허가대상물질).
- Query harmful substance registry (유해물질).
- Query toxic chemical registry under TCCL.

### Step 3: GHS Classification (if not previously classified)
- Trigger `ghs-classification` workflow if substance lacks current classification.
- Wait for classification result before proceeding.

### Step 4: Risk Assessment
- Apply `skills/domains/msds/chemical-risk-assessment/` for intended use scenario.
- Evaluate exposure routes (inhalation, dermal, ingestion).
- Recommend engineering controls, PPE, storage conditions.

### Step 5: Multi-Disciplinary Review
- Route to: EHS, Production, Engineering, Occupational Health, Fire Safety.
- For high-hazard substances: require formal committee review.

### Step 6: Decision
- **Approve**: Substance complies with all regulatory restrictions.
- **Approve with conditions**: Specific storage/handling/training requirements.
- **Reject**: Substance is prohibited, or risks cannot be mitigated.
- **Escalate**: Permission-required substances need MOEL/ME authorization.

### Step 7: Documentation
- Generate `chemical-approval-record.json` with decision rationale.
- For approved chemicals: trigger `msds-intake` to obtain MSDS, then `chemical-inventory` to register.

## 4. Escalation Triggers (Immediate PM Notification)
- Prohibited substance detected → block request
- Permission-required substance without authorization → block and escalate
- Trade secret (CBI) claim without approval → flag for compliance review
- Substance with no toxicological data → require supplier testing before approval

## 5. Evidence Record
Generate `chemical-approval-record.json` with substance ID, classification, risk assessment, decision, conditions, and approval signatures.

## 6. KPI
- 0 unauthorized prohibited substance introductions
- Approval cycle time: ≤14 days for routine, ≤30 days for complex cases

## 7. Legal Disclaimer
> Workflow automation assistance only. Final approval decisions require qualified EHS manager and Chemical Management Officer per OSHA-KR Article 113.
