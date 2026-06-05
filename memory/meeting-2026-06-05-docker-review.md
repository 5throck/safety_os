# Meeting Transcript
**Date**: 2026-06-05
**Topic**: Review of Docker Necessity for MCP Isolation
**Participants**: architect, automation-engineer, auditor
**Rounds**: 2
**Language**: Korean (transcript always saved in English)
**Status**: Complete

---

## Transcript

**[PM]**: (Facilitator)
The core agenda of this 5th meeting is a technical and operational feasibility review of Action Item 2-12: **'Is it absolutely necessary to use Docker for external open-source isolation?'** Please analyze the pros and cons of Docker and propose alternatives if any.

**[architect]**: (Round 1)
The primary reasons I proposed Docker were isolation and deployment convenience. Wrapping open-source projects requiring different languages (Python, Node.js) and versions into individual containers perfectly prevents environmental conflicts. However, as the user pointed out, when Safety OS is installed on-premise at a client site, this creates a heavy constraint that the Docker Daemon must be installed on the client's server. In manufacturing floors or strict intranet security environments, introducing Docker itself can be a massive hurdle.

**[automation-engineer]**: (Round 1)
I completely agree with `architect`'s concerns. Since MCP servers fundamentally communicate via `stdio` (Standard I/O), we can sufficiently achieve process-level isolation by running them as local child processes without Docker. For instance, by invoking them directly in `.mcp.json` like `command: "node", args: ["vendor/mcp-kr-legislation/build/index.js"]` or `command: "uvx", args: ["korean-law-mcp"]`, they operate perfectly like independent daemons without Docker. From a license perspective (GPL), this is still independent process communication, so there are no issues.

**[architect]**: (Round 2)
The local process approach proposed by `automation-engineer` is much lighter and more realistic. I will completely eliminate Docker and change the architecture to utilize an npm script tool like `pm2` or a simple background process manager (like systemd) to run and manage restarts of the MCPs inside the `vendor/` directory. This way, all components can execute in isolation using just a single Node.js/Python runtime, regardless of the client's OS (Windows/Linux) environment.

**[automation-engineer]**: (Round 2)
That is a great alternative. Instead of Docker, to manage runtime dependencies, I will just add a script to Action Item 2-10 that locks the package versions of the open-source projects inside `vendor/`. Now, without complex Docker setup, users can safely launch all external open-source tools as background daemons with a single command invocation like `bun run start:mcp-connectors`.

**[auditor]**: (Synthesis)
I will synthesize the meeting results.
1. **Points of Agreement**: 
   - **Elimination of Docker Dependency**: Abandoned the Docker container (`docker-compose`) based deployment method to remove environment setup hurdles and overhead.
   - **Local Process (stdio) Based Isolation**: Changed to a local child process invocation method, which is the fundamental communication method of MCP. This achieves both license isolation and lightweight deployment simultaneously.
   - **Introduction of Process Manager**: Introduce pm2 or a single start script (`bun run start`) for background execution.
2. **Open Disagreements or Unresolved Questions**: None.
3. **Action Items (Updated)**:

---

## Action Items

| # | Owner | Tier | Deliverable | Platform | Phase |
|---|-------|------|-------------|----------|-------|
| 2-10 | automation-engineer | Medium | Set up `vendor/` isolation structure and write **local process (stdio) based execution scripts without Docker** | Both | Phase 2 |
| 2-12 | architect | High | Redesign lightweight MCP Connector integration architecture with Docker dependency removed | Both | Phase 2 |

## Acceptance Criteria (if any)

| # | Criterion | Verification |
|---|-----------|--------------|
| 1 | Docker dependency removed | Check `package.json` scripts and documentation |
