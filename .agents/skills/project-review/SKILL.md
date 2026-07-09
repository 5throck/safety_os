---
name: project-review
status: active
scope: common
description: >
  Performs a comprehensive parallel review of the current project using all
  available specialist agents. Auto-detects project type and agent roster,
  generates an execution plan, dispatches agents in parallel, and produces
  a prioritized improvement plan (Critical/High/Medium/Low).
  Use when: user requests a full project review ("/project-review" or
  "do a full project review"); PM detects structural changes (3+ agent files modified,
  phase schema changes, variant.json modified, new domain added);
  QA escalation from auditor (safety-audit.ts ERROR >= 3 or Critical finding).
owner: pm
version: 1.1.0
last_reviewed: 2026-07-08
metadata:
  type: process
  triggers:
    - project review
    - review project
    - audit project
    - quality review
---

This skill's implementation resides in `.claude/commands/project-review.md` and `.gemini/commands/project-review.md`.

## When to Use

Use `/project-review` to run a comprehensive parallel review of the current project by all available specialist agents.

## Usage

```
/project-review
```

See the command file for full documentation.
