# MCP Integration Guide

> **Purpose**: How Safety OS connects to Korean legislation MCP servers for regulatory data.

## 1. Available MCP Servers

Safety OS includes 3 Korean regulatory MCP servers:

| Server | Location | Tools | Purpose |
|--------|----------|-------|---------|
| `kr_safety` | `mcp/kr-safety-regs/` | 5 tools | Korean safety regulations search (OSHA-KR, SAPA, CCA), compliance gap analysis |
| `legalize_kr` | `mcp/legalize-kr/` | 6 tools | Korean law structure parsing, version comparison, precedent search |
| `mcp_kr_legislation` | `mcp/kr-legislation/` | 5 tools | Real-time legislation API (국가법령정보센터) |

## 2. Configuration

MCP servers are configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "kr_safety": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "./mcp/kr-safety-regs/index.ts"]
    },
    "legalize_kr": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "./mcp/legalize-kr/index.ts"]
    },
    "mcp_kr_legislation": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "./mcp/kr-legislation/index.ts"]
    }
  }
}
```

## 3. Domain Integration Points

### PSM Domain
- `regulations/KR/OSHA-KR-PSM.yaml` — references kr_legislation for current law text
- `evidence-models/domains/functional/psm/` — `source_mcp: mcp-kr-legislation`

### MSDS Domain
- `regulations/KR/OSHA-KR-MSDS.yaml` — references kr_legislation
- `regulations/KR/K-REACH.yaml` — references kr_legislation
- kr_safety tools for compliance gap analysis (OSHA-KR, SAPA articles)

### Compliance Agent (cross-domain)
`agents/_shared/compliance-agent.md` (updated 2026-07-11) formalizes live-law verification as a standard step, not an ad hoc activity:
- `mcp__kr_safety__search_osha_regulations`, `mcp__kr_safety__check_compliance_gaps` — live OSHA-KR regulation lookup and gap checking
- `mcp__legalize_kr__*` — live Korean statute verification (article numbers, amendment history)
- Used to verify article-number accuracy before citing in `legal_basis` fields — this project has a documented history of mis-citations (see `memory/findings/compliance-gap-2026-07-05-all-domains.md`) that live-law verification catches.

### GMP Domain
- `regulations/KR/MFDS-GDP.yaml` — references kr_legislation

### All Domains
- `source_mcp: mcp-kr-legislation` required in all regulation .yaml files
- Audit script validates this field

## 4. Usage in Workflows

Agents can query MCP servers during workflow execution:

```
1. Agent receives task
2. Agent queries kr_legislation for current law text
3. Agent verifies workflow legal_basis against current law
4. Agent generates evidence record with verified legal references
```

## 5. Environment Setup

```bash
# .env file
GITHUB_TOKEN=ghp_...          # For legalize-kr (precedent search)
# kr-legislation uses public API (no token needed)
# kr-safety-regs uses cached data + live API (no token needed)
```

## 6. Future Integration (v2)

- Real-time law amendment notifications
- Automated legal_basis refresh when regulations change
- ML-powered regulation interpretation
- Cross-reference validation against actual law text
