# Workflow: Safety Training

## 1. Overview

This workflow manages the identification, delivery, recording, and verification of occupational safety and health training for manufacturing workers. Regular safety training is a statutory obligation under Korean law and a foundational control for preventing workplace accidents. This workflow covers new employee onboarding training, periodic refresher training, job-specific hazard training, and training triggered by regulatory changes or incident findings.

## 2. Legal Basis (legal_basis)

**legal_basis: 산업안전보건법 제29조 (근로자 안전보건교육)**

- Article 29 mandates that employers provide safety and health education to all workers. Minimum training frequencies and durations are prescribed by regulation:
  - **신규채용 시 교육** (new employee training): minimum 8 hours (office) / 16 hours (manufacturing/hazardous)
  - **정기 교육** (periodic training): minimum 6 hours per quarter for manufacturing workers
  - **작업내용 변경 시 교육** (job change training): minimum 2 hours when work content changes
  - **특별교육** (special training): minimum 16 hours for workers assigned to 39 designated high-risk work types
- Employers must maintain training records including attendance, curriculum, and trainer qualifications.

## 3. Trigger Conditions

- New employee onboarding (before commencement of work)
- Periodic quarterly training schedule (manufacturing workers: 6 hours/quarter)
- Worker assigned to a new task or work area (minimum 2 hours)
- Worker assigned to designated high-risk work (special training: minimum 16 hours)
- Regulation change affecting worker duties or site procedures
- Post-incident remediation: training identified as a corrective action
- Annual training needs analysis review

## 4. Agent Assignments

| Step | Agent | Role |
|------|-------|------|
| Training needs identification | safety-workflow-manager | Identifies who needs what training and by when |
| Curriculum selection | compliance-agent | Verifies curriculum meets legal requirements |
| Training delivery | safety-workflow-manager | Coordinates delivery (in-person, online, OJT) |
| Attendance recording | safety-workflow-manager | Records attendance and trainer details |
| Competency verification | compliance-agent | Verifies training effectiveness and records |

## 5. Steps

1. **Training Needs Identification** — safety-workflow-manager reviews the workforce roster against training records to identify: workers overdue for periodic training, new employees requiring onboarding training, workers assigned to new tasks or high-risk work requiring specific training, and any training gaps identified by the compliance-gap workflow or incident investigations.

2. **Curriculum Selection** — compliance-agent verifies that the proposed curriculum meets or exceeds the legal minimum content requirements for the training type. For 특별교육 (special training on high-risk work), confirms the curriculum covers all 39 designated work types applicable to the site per the enforcement ordinance.

3. **Training Delivery** — safety-workflow-manager coordinates training delivery. Records: training type, date and time, location or platform, trainer name and qualifications, training materials reference, and list of attendees. For OJT (on-the-job training), confirms the trainer is a competent person for the relevant work.

4. **Attendance Recording** — safety-workflow-manager records attendance with each worker's signature confirming participation. Records are filed immediately after the session. For online training, captures system-generated completion records.

5. **Competency Verification** — compliance-agent confirms training effectiveness through: short assessment, practical demonstration, or supervisor sign-off confirming the worker can perform the work safely. Records the verification outcome for each worker.

## 6. Evidence Requirements

The following records must be created and retained (minimum 3 years per enforcement guidelines):

- Training attendance sheet with worker signatures and date
- Curriculum materials or reference to approved curriculum
- Trainer qualifications record
- Competency assessment results or supervisor sign-off
- Training register showing each worker's training history, type, hours, and next due date
- For 특별교육: certificate of completion referencing the specific high-risk work type
- File location: `memory/findings/training-YYYY-MM-DD-<type>-<session-id>.md`

## 7. Completion Criteria

The workflow is complete when:

- All identified workers have completed their required training within the prescribed timeframe
- Attendance records are signed and filed for each session
- Competency verification is documented for all workers
- Training register is updated with completion dates and next due dates
- All records are filed with `legal_basis` field populated
- Outstanding training gaps are reflected in the compliance monitoring tracker
