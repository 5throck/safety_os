# VERSION_MANIFEST.md

**Generated**: 2026-07-05T04:26:30.096Z
**Manifest Version**: 1.0
**Location**: docs\VERSION_MANIFEST.md

---

## Summary

- **Agents**: 28
- **Skills**: 56
- **Scripts**: 55
- **Commands**: 6

---

## Agents

| Name | File | Tier | Model | Last Modified |
|------|------|------|-------|---------------|
| _core/pm | agents/_core/pm.md | high | inherit | 2026-07-04 |
| _core/safety-governance-manager | agents/_core/safety-governance-manager.md | high | inherit | 2026-06-17 |
| _core/safety-workflow-manager | agents/_core/safety-workflow-manager.md | high | inherit | 2026-06-17 |
| _shared/asset-integrity-agent | agents/_shared/asset-integrity-agent.md | medium | inherit | 2026-07-05 |
| _shared/audit-agent | agents/_shared/audit-agent.md | medium | inherit | 2026-06-21 |
| _shared/compliance-agent | agents/_shared/compliance-agent.md | medium | inherit | 2026-06-17 |
| _shared/contractor-safety-agent | agents/_shared/contractor-safety-agent.md | medium | inherit | 2026-07-05 |
| _shared/disaster-response-agent | agents/_shared/disaster-response-agent.md | high | inherit | 2026-07-05 |
| _shared/docs-writer | agents/_shared/docs-writer.md | medium | inherit | 2026-07-05 |
| _shared/emergency-agent | agents/_shared/emergency-agent.md | high | inherit | 2026-06-17 |
| _shared/incident-investigation-agent | agents/_shared/incident-investigation-agent.md | medium | inherit | 2026-07-05 |
| _shared/legal-agent | agents/_shared/legal-agent.md | medium | inherit | 2026-07-05 |
| _shared/occupational-health-agent | agents/_shared/occupational-health-agent.md | medium | inherit | 2026-07-05 |
| _shared/reporting-agent | agents/_shared/reporting-agent.md | medium | inherit | 2026-07-05 |
| _shared/risk-assessment-agent | agents/_shared/risk-assessment-agent.md | medium | inherit | 2026-07-04 |
| domains/functional/msds/msds-agent | agents/domains/functional/msds/msds-agent.md | N/A | inherit | 2026-07-04 |
| domains/functional/psm/psm-agent | agents/domains/functional/psm/psm-agent.md | N/A | N/A | 2026-07-04 |
| domains/functional/training/training-agent | agents/domains/functional/training/training-agent.md | N/A | N/A | 2026-07-04 |
| domains/industry/ehschem/ehschem-agent | agents/domains/industry/ehschem/ehschem-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/ehsconst/ehsconst-agent | agents/domains/industry/ehsconst/ehsconst-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/gasterm/gasterm-agent | agents/domains/industry/gasterm/gasterm-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/gcp/gcp-agent | agents/domains/industry/gcp/gcp-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/gdp/gdp-agent | agents/domains/industry/gdp/gdp-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/glp/glp-agent | agents/domains/industry/glp/glp-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/gmp/gmp-agent | agents/domains/industry/gmp/gmp-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/gvp/gvp-agent | agents/domains/industry/gvp/gvp-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/meddevice/meddevice-agent | agents/domains/industry/meddevice/meddevice-agent.md | N/A | inherit | 2026-07-04 |
| domains/industry/powergen/powergen-agent | agents/domains/industry/powergen/powergen-agent.md | N/A | inherit | 2026-07-04 |

---

## Skills

| Name | Version | Location | Platform | Triggers | Owner |
|------|---------|----------|----------|----------|-------|
| agent-lifecycle-manager | 1.0.0 | skills/agent-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| agent-lifecycle-manager | 1.0.0 | .claude/skills/agent-lifecycle-manager/SKILL.md | both | N/A | pm |
| api-documentation | 1.0.0 | .claude/skills/api-documentation/SKILL.md | claude | N/A | N/A |
| arc-flash-analyzer | 1.0 | .claude/skills/arc-flash-analyzer/SKILL.md | both | N/A | powergen-agent |
| asset-integrity-check | 1.0.0 | .claude/skills/asset-integrity-check/SKILL.md | both | N/A | asset-integrity-agent |
| audit-preparation | 1.0.0 | .claude/skills/audit-preparation/SKILL.md | both | N/A | audit-agent |
| benefit-risk-assessor | 1.0 | .claude/skills/benefit-risk-assessor/SKILL.md | both | N/A | gvp-agent |
| chemical-risk-assessment | 1.0 | .claude/skills/chemical-risk-assessment/SKILL.md | both | N/A | msds-agent |
| compliance-gap | 1.0.0 | .claude/skills/compliance-gap/SKILL.md | both | N/A | compliance-agent |
| contractor-onboarding | 1.0.0 | .claude/skills/contractor-onboarding/SKILL.md | both | N/A | contractor-safety-agent |
| documentation-writing | 1.0.0 | .claude/skills/documentation-writing/SKILL.md | claude | N/A | N/A |
| dts-verification | 1.0 | .claude/skills/dts-verification/SKILL.md | both | N/A | gdp-agent |
| emergency-response | 1.0.0 | .claude/skills/emergency-response/SKILL.md | both | N/A | emergency-agent |
| environmental-compliance-checker | 1.0 | .claude/skills/environmental-compliance-checker/SKILL.md | both | N/A | ehschem-agent |
| ess-fire-risk-assessor | 1.0 | .claude/skills/ess-fire-risk-assessor/SKILL.md | both | N/A | powergen-agent |
| fall-hazard-assessor | 1.0 | .claude/skills/fall-hazard-assessor/SKILL.md | both | N/A | ehsconst-agent |
| finishing-a-development-branch | 1.0.0 | .claude/skills/finishing-a-development-branch/SKILL.md | both | N/A | N/A |
| gas-dispersion-analyzer | 1.0 | .claude/skills/gas-dispersion-analyzer/SKILL.md | both | N/A | gasterm-agent |
| ghs-classifier | 1.0 | .claude/skills/ghs-classifier/SKILL.md | both | N/A | msds-agent |
| glp-data-integrity-checker | 1.0 | .claude/skills/glp-data-integrity-checker/SKILL.md | both | N/A | glp-agent |
| glp-study-protocol-validator | 1.0 | .claude/skills/glp-study-protocol-validator/SKILL.md | both | N/A | glp-agent |
| gmp-change-control | 1.0 | .claude/skills/gmp-change-control/SKILL.md | both | N/A | gmp-agent |
| gmp-deviation-capa | 1.0 | .claude/skills/gmp-deviation-capa/SKILL.md | both | N/A | gmp-agent |
| gmp-qrm | 1.0 | .claude/skills/gmp-qrm/SKILL.md | both | N/A | gmp-agent |
| hazop-analysis | 1.0.0 | .claude/skills/hazop-analysis/SKILL.md | both | N/A | psm-agent |
| iso14971-risk-scorer | 1.0 | .claude/skills/iso14971-risk-scorer/SKILL.md | both | N/A | meddevice-agent |
| legalize-kr-sync | 1.0.0 | skills/legalize-kr-sync/SKILL.md | workspace | N/A | safety-workflow-manager |
| legalize-kr-sync | 1.0.0 | .claude/skills/legalize-kr-sync/SKILL.md | both | N/A | safety-workflow-manager |
| meeting-facilitation | 1.4.0 | skills/meeting-facilitation/SKILL.md | workspace | N/A | pm |
| meeting-facilitation | 1.4.0 | .claude/skills/meeting-facilitation/SKILL.md | both | N/A | pm |
| msds-parser | 1.0 | .claude/skills/msds-parser/SKILL.md | both | N/A | msds-agent |
| permit-to-work | 1.0.0 | .claude/skills/permit-to-work/SKILL.md | both | N/A | safety-workflow-manager |
| platform-command-lifecycle-manager | 1.0.0 | .claude/skills/platform-command-lifecycle-manager/SKILL.md | both | N/A | pm |
| platform-skill-lifecycle-manager | 1.0.0 | .claude/skills/platform-skill-lifecycle-manager/SKILL.md | both | N/A | pm |
| process-hazard-screening | 1.0 | .claude/skills/process-hazard-screening/SKILL.md | both | N/A | ehschem-agent |
| project-review | 1.0.0 | skills/project-review/SKILL.md | workspace | N/A | pm |
| project-review | 1.0.0 | .claude/skills/project-review/SKILL.md | both | N/A | pm |
| protocol-deviation-analyzer | 1.0 | .claude/skills/protocol-deviation-analyzer/SKILL.md | both | N/A | gcp-agent |
| psm-moc | 1.0 | .claude/skills/psm-moc/SKILL.md | both | N/A | psm-agent |
| research-analysis | 1.0.0 | .claude/skills/research-analysis/SKILL.md | claude | N/A | N/A |
| risk-assessment | 1.0.0 | .claude/skills/risk-assessment/SKILL.md | both | N/A | risk-assessment-agent |
| root-cause-analysis | 1.0.0 | .claude/skills/root-cause-analysis/SKILL.md | both | N/A | incident-investigation-agent |
| sae-causality-assessor | 1.0 | .claude/skills/sae-causality-assessor/SKILL.md | both | N/A | gcp-agent |
| safety-inspection-validator | 1.0 | .claude/skills/safety-inspection-validator/SKILL.md | both | N/A | ehsconst-agent |
| script-lifecycle-manager | 1.2.0 | skills/script-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| script-lifecycle-manager | 1.2.0 | .claude/skills/script-lifecycle-manager/SKILL.md | both | N/A | pm |
| signal-detector | 1.0 | .claude/skills/signal-detector/SKILL.md | both | N/A | gvp-agent |
| simulate-project-creation | 1.0.0 | .claude/skills/simulate-project-creation/SKILL.md | both | N/A | scaffolding-expert |
| skill-lifecycle-manager | 1.2.0 | skills/skill-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| skill-lifecycle-manager | 1.2.0 | .claude/skills/skill-lifecycle-manager/SKILL.md | both | N/A | pm |
| tank-integrity-validator | 1.0 | .claude/skills/tank-integrity-validator/SKILL.md | both | N/A | gasterm-agent |
| team-builder | 1.1.0 | skills/team-builder/SKILL.md | workspace | N/A | pm |
| team-builder | 1.1.0 | .claude/skills/team-builder/SKILL.md | both | N/A | pm |
| temperature-excursion-analyzer | 1.0 | .claude/skills/temperature-excursion-analyzer/SKILL.md | both | N/A | gdp-agent |
| translate | 1.0.0 | skills/translate/SKILL.md | workspace | N/A | pm |
| translate | 1.0.0 | .claude/skills/translate/SKILL.md | both | N/A | pm |

---

## Scripts

| Name | Version | Location | Dependencies |
|------|---------|----------|--------------|
| agent-create.ts | N/A | scripts/agent-create.ts | N/A |
| agent-delete.ts | N/A | scripts/agent-delete.ts | N/A |
| agent-lifecycle-audit.ts | N/A | scripts/agent-lifecycle-audit.ts | N/A |
| agent-list.ts | N/A | scripts/agent-list.ts | N/A |
| agent-verify.ts | N/A | scripts/agent-verify.ts | N/A |
| analyze-git-history.ts | 1.0.0 | scripts/analyze-git-history.ts | child_process |
| archive-memory.ts | N/A | scripts/archive-memory.ts | N/A |
| audit.ts | 2.6.1 | scripts/audit.ts | bun |
| auto-executor.ts | N/A | scripts/lib/auto-executor.ts | N/A |
| check-pm-approval.ts | N/A | scripts/check-pm-approval.ts | N/A |
| checkpoint-manager.ts | N/A | scripts/lib/checkpoint-manager.ts | N/A |
| clear-pm-approval.ts | N/A | scripts/clear-pm-approval.ts | N/A |
| dev-sync.ts | N/A | scripts/dev-sync.ts | bun |
| dispatch-parallel.ts | N/A | scripts/dispatch-parallel.ts | N/A |
| dispatch-serial.ts | N/A | scripts/dispatch-serial.ts | N/A |
| dispatch.ts | N/A | scripts/dispatch.ts | N/A |
| domain-config.ts | N/A | scripts/domain-config.ts | N/A |
| encoding-utils.ts | N/A | scripts/lib/encoding-utils.ts | fs, path |
| error-handling.ts | N/A | scripts/lib/error-handling.ts | N/A |
| fetch-legalize.ts | N/A | scripts/fetch-legalize.ts | child_process, fs, path |
| gen-pr-body.ts | N/A | scripts/gen-pr-body.ts | bun |
| generate-scripts-readme.ts | N/A | scripts/generate-scripts-readme.ts | N/A |
| generate-version-manifest.ts | 1.0.2 | scripts/generate-version-manifest.ts | bun |
| mcp-cache.ts | N/A | scripts/lib/mcp-cache.ts | N/A |
| new-domain.ts | N/A | scripts/new-domain.ts | N/A |
| pipeline-state.ts | N/A | scripts/lib/pipeline-state.ts | fs, path |
| plan-parser.ts | N/A | scripts/lib/plan-parser.ts | fs, js-yaml |
| platform-context.ts | N/A | scripts/lib/platform-context.ts | bun, os |
| platform-dispatcher.ts | N/A | scripts/lib/platform-dispatcher.ts | N/A |
| qa-gate.ts | N/A | scripts/qa-gate.ts | bun |
| readme-lifecycle-audit.ts | N/A | scripts/readme-lifecycle-audit.ts | N/A |
| retry-handler.ts | N/A | scripts/retry-handler.ts | N/A |
| safety-audit.ts | N/A | scripts/safety-audit.ts | js-yaml |
| skill-dependency-analysis.ts | N/A | scripts/skill-dependency-analysis.ts | N/A |
| skill-lifecycle-audit.ts | N/A | scripts/skill-lifecycle-audit.ts | N/A |
| start-mcp.ts | N/A | scripts/start-mcp.ts | child_process, path |
| sync-agent-status.ts | N/A | scripts/sync-agent-status.ts | N/A |
| sync-md.ts | 1.2.0 | scripts/sync-md.ts | N/A |
| sync-skill-status.ts | N/A | scripts/sync-skill-status.ts | N/A |
| sync-skills.ts | N/A | scripts/sync-skills.ts | N/A |
| team-builder.ts | N/A | scripts/team-builder.ts | fs, path |
| test-chemical-handling-profile.ts | N/A | scripts/test-chemical-handling-profile.ts | js-yaml |
| test-cross-domain-integration.ts | N/A | scripts/test-cross-domain-integration.ts | js-yaml |
| test-domain-scenarios.ts | N/A | scripts/test-domain-scenarios.ts | N/A |
| test-pharma-general-profile.ts | N/A | scripts/test-pharma-general-profile.ts | js-yaml |
| test-runner.ts | N/A | scripts/test-runner.ts | child_process, fs, path |
| translate-readme.ts | N/A | scripts/translate-readme.ts | bun, fs, path |
| validate-agents.ts | N/A | scripts/validate-agents.ts | N/A |
| validate-doc-folder.ts | N/A | scripts/validate-doc-folder.ts | fs, path |
| validate-md-language.ts | 1.4.1 | scripts/validate-md-language.ts | fs, js-yaml |
| validate-skills.ts | N/A | scripts/validate-skills.ts | N/A |
| verify-agent-deliverables.ts | N/A | scripts/verify-agent-deliverables.ts | fs |
| verify-memory.ts | N/A | scripts/verify-memory.ts | fs, path |
| verify-readme-sync.ts | 1.1.1 | scripts/verify-readme-sync.ts | bun, fs, path |
| verify-skills.ts | N/A | scripts/verify-skills.ts | N/A |

---

## Commands

| Name | File | Platform | Skill Integration |
|------|------|----------|-------------------|
| changelog | .claude/commands/changelog.md | both | N/A |
| commit-push-pr | .claude/commands/commit-push-pr.md | both | N/A |
| meeting | .claude/commands/meeting.md | both | N/A |
| memlog | .claude/commands/memlog.md | both | N/A |
| new-task | .claude/commands/new-task.md | both | N/A |
| sync | .claude/commands/sync.md | both | N/A |

---

## Platform Parity Status

**Checked**: Claude (.claude/) vs Gemini (.gemini/)

- **Commands with parity**: 6 / 6
- **Skills with parity**: 45 / 56

---

## Drift Detection

⚠️ **Drift detected**:

- Agent domains/functional/msds/msds-agent missing tier or model metadata
- Agent domains/functional/psm/psm-agent missing tier or model metadata
- Agent domains/functional/training/training-agent missing tier or model metadata
- Agent domains/industry/ehschem/ehschem-agent missing tier or model metadata
- Agent domains/industry/ehsconst/ehsconst-agent missing tier or model metadata
- Agent domains/industry/gasterm/gasterm-agent missing tier or model metadata
- Agent domains/industry/gcp/gcp-agent missing tier or model metadata
- Agent domains/industry/gdp/gdp-agent missing tier or model metadata
- Agent domains/industry/glp/glp-agent missing tier or model metadata
- Agent domains/industry/gmp/gmp-agent missing tier or model metadata
- Agent domains/industry/gvp/gvp-agent missing tier or model metadata
- Agent domains/industry/meddevice/meddevice-agent missing tier or model metadata
- Agent domains/industry/powergen/powergen-agent missing tier or model metadata
- Skill agent-lifecycle-manager has no triggers defined
- Skill agent-lifecycle-manager has no triggers defined
- Skill api-documentation has no triggers defined
- Skill arc-flash-analyzer has no triggers defined
- Skill asset-integrity-check has no triggers defined
- Skill audit-preparation has no triggers defined
- Skill benefit-risk-assessor has no triggers defined
- Skill chemical-risk-assessment has no triggers defined
- Skill compliance-gap has no triggers defined
- Skill contractor-onboarding has no triggers defined
- Skill documentation-writing has no triggers defined
- Skill dts-verification has no triggers defined
- Skill emergency-response has no triggers defined
- Skill environmental-compliance-checker has no triggers defined
- Skill ess-fire-risk-assessor has no triggers defined
- Skill fall-hazard-assessor has no triggers defined
- Skill finishing-a-development-branch has no triggers defined
- Skill gas-dispersion-analyzer has no triggers defined
- Skill ghs-classifier has no triggers defined
- Skill glp-data-integrity-checker has no triggers defined
- Skill glp-study-protocol-validator has no triggers defined
- Skill gmp-change-control has no triggers defined
- Skill gmp-deviation-capa has no triggers defined
- Skill gmp-qrm has no triggers defined
- Skill hazop-analysis has no triggers defined
- Skill iso14971-risk-scorer has no triggers defined
- Skill legalize-kr-sync has no triggers defined
- Skill legalize-kr-sync has no triggers defined
- Skill meeting-facilitation has no triggers defined
- Skill meeting-facilitation has no triggers defined
- Skill msds-parser has no triggers defined
- Skill permit-to-work has no triggers defined
- Skill platform-command-lifecycle-manager has no triggers defined
- Skill platform-skill-lifecycle-manager has no triggers defined
- Skill process-hazard-screening has no triggers defined
- Skill project-review has no triggers defined
- Skill project-review has no triggers defined
- Skill protocol-deviation-analyzer has no triggers defined
- Skill psm-moc has no triggers defined
- Skill research-analysis has no triggers defined
- Skill risk-assessment has no triggers defined
- Skill root-cause-analysis has no triggers defined
- Skill sae-causality-assessor has no triggers defined
- Skill safety-inspection-validator has no triggers defined
- Skill script-lifecycle-manager has no triggers defined
- Skill script-lifecycle-manager has no triggers defined
- Skill signal-detector has no triggers defined
- Skill simulate-project-creation has no triggers defined
- Skill skill-lifecycle-manager has no triggers defined
- Skill skill-lifecycle-manager has no triggers defined
- Skill tank-integrity-validator has no triggers defined
- Skill team-builder has no triggers defined
- Skill team-builder has no triggers defined
- Skill temperature-excursion-analyzer has no triggers defined
- Skill translate has no triggers defined
- Skill translate has no triggers defined
- Command changelog not integrated as a skill
- Command commit-push-pr not integrated as a skill
- Command meeting not integrated as a skill
- Command memlog not integrated as a skill
- Command new-task not integrated as a skill
- Command sync not integrated as a skill
