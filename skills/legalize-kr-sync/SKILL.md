---
name: legalize-kr-sync
version: 1.0.0
owner: safety-workflow-manager
scope: workspace
status: active
description: Fetches the legalize-kr repository into a local cache directory to ensure up-to-date access to Korean law data.
triggers:
  - "clone legalize-kr"
  - "fetch laws"
  - "sync korean laws"
---

# Legalize-KR Sync Skill

This skill defines an on-demand workflow that allows users to fetch the `legalize-kr` git repository into a local cache directory (`.cache/legalize-kr`).

## Purpose

The `legalize-kr` repository contains crucial South Korean legal data needed by Safety OS agents to verify compliance with regulations such as OSHA-KR and SAPA. This skill ensures that the local cache of these laws is synchronized and up-to-date, providing a reliable legal basis for safety workflows and audits.

## Triggers

This skill is invoked when a user uses phrases such as:
- "clone legalize-kr"
- "fetch laws"
- "sync korean laws"

## Instructions

When this skill is triggered, you must follow these steps:

1. **Acknowledge the Request**
   Notify the user that you are beginning the synchronization process for the `legalize-kr` repository.

2. **Execute the Fetch Script**
   Run the `fetch-legalize.ts` script to perform the synchronization. The script will handle creating the `.cache/legalize-kr` directory and cloning the repository if it doesn't exist, or pulling the latest changes if it does.
   
   Execute the following command:
   ```powershell
   bun scripts/fetch-legalize.ts
   ```

3. **Verify and Report Results**
   - If the script execution is successful, inform the user that the synchronization is complete and the legal data is now up-to-date in `.cache/legalize-kr`.
   - If the script encounters an error, report the specific error output to the user and advise on potential troubleshooting steps (e.g., checking network connection or git configuration).
