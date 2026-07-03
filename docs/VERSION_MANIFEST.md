# VERSION_MANIFEST.md

**Generated**: 2026-07-03T12:07:26.239Z
**Manifest Version**: 1.0
**Location**: docs/VERSION_MANIFEST.md

---

## Summary

- **Agents**: 0
- **Skills**: 17
- **Scripts**: 56
- **Commands**: 6

---

## Agents

| Name | File | Tier | Model | Last Modified |
|------|------|------|-------|---------------|

---

## Skills

| Name | Version | Location | Platform | Triggers | Owner |
|------|---------|----------|----------|----------|-------|
| agent-lifecycle-manager | 1.0.0 | skills/agent-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| agent-lifecycle-manager | 1.0.0 | .claude/skills/agent-lifecycle-manager/SKILL.md | both | N/A | pm |
| api-documentation | 1.0.0 | .claude/skills/api-documentation/SKILL.md | claude | N/A | N/A |
| documentation-writing | 1.0.0 | .claude/skills/documentation-writing/SKILL.md | claude | N/A | N/A |
| finishing-a-development-branch | 1.0.0 | .claude/skills/finishing-a-development-branch/SKILL.md | both | N/A | N/A |
| legalize-kr-sync | 1.0.0 | skills/legalize-kr-sync/SKILL.md | workspace | N/A | safety-workflow-manager |
| meeting-facilitation | 1.4.0 | skills/meeting-facilitation/SKILL.md | workspace | N/A | pm |
| meeting-facilitation | 1.3.1 | .claude/skills/meeting-facilitation/SKILL.md | both | N/A | pm |
| platform-command-lifecycle-manager | 1.0.0 | .claude/skills/platform-command-lifecycle-manager/SKILL.md | both | N/A | pm |
| platform-skill-lifecycle-manager | 1.0.0 | .claude/skills/platform-skill-lifecycle-manager/SKILL.md | both | N/A | pm |
| project-review | 1.0.0 | skills/project-review/SKILL.md | workspace | N/A | pm |
| research-analysis | 1.0.0 | .claude/skills/research-analysis/SKILL.md | claude | N/A | N/A |
| script-lifecycle-manager | 1.2.0 | skills/script-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| simulate-project-creation | 1.0.0 | .claude/skills/simulate-project-creation/SKILL.md | both | N/A | scaffolding-expert |
| skill-lifecycle-manager | 1.2.0 | skills/skill-lifecycle-manager/SKILL.md | workspace | N/A | pm |
| team-builder | 1.1.0 | skills/team-builder/SKILL.md | workspace | N/A | pm |
| translate | 1.0.0 | skills/translate/SKILL.md | workspace | N/A | pm |

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
| audit.ts | 2.5.3 | scripts/audit.ts | bun |
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
| generate-version-manifest.ts | 1.0.1 | scripts/generate-version-manifest.ts | bun |
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
| validate-model-registry.ts | N/A | scripts/validate-model-registry.ts | N/A |
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
| sync | .claude/commands/sync.md | claude | N/A |

---

## Platform Parity Status

**Checked**: Claude (.claude/) vs Gemini (.gemini/)

- **Commands with parity**: 5 / 6
- **Skills with parity**: 6 / 17

---

## Drift Detection

⚠️ **Drift detected**:

- Skill agent-lifecycle-manager has no triggers defined
- Skill agent-lifecycle-manager has no triggers defined
- Skill api-documentation has no triggers defined
- Skill documentation-writing has no triggers defined
- Skill finishing-a-development-branch has no triggers defined
- Skill legalize-kr-sync has no triggers defined
- Skill meeting-facilitation has no triggers defined
- Skill meeting-facilitation has no triggers defined
- Skill platform-command-lifecycle-manager has no triggers defined
- Skill platform-skill-lifecycle-manager has no triggers defined
- Skill project-review has no triggers defined
- Skill research-analysis has no triggers defined
- Skill script-lifecycle-manager has no triggers defined
- Skill simulate-project-creation has no triggers defined
- Skill skill-lifecycle-manager has no triggers defined
- Skill team-builder has no triggers defined
- Skill translate has no triggers defined
- Command changelog not integrated as a skill
- Command commit-push-pr not integrated as a skill
- Command meeting not integrated as a skill
- Command memlog not integrated as a skill
- Command new-task not integrated as a skill
- Command sync not integrated as a skill
