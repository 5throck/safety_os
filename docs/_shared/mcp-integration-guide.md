# MCP Integration Guide

> **Purpose**: How Safety OS connects to Korean legislation MCP servers for regulatory data.

## 1. Available MCP Servers

Safety OS includes 3 Korean regulatory MCP servers:

| Server | Location | Tools | Purpose |
|--------|----------|-------|---------|
| `k_skill` | `mcp/k-skill/` | 5 tools | OSHA/SAPA regulation search, compliance gap analysis |
| `legalize_kr` | `mcp/legalize-kr/` | 5 tools | Korean law structure parsing, version comparison |
| `kr_legislation` | `mcp/kr-legislation/` | 5 tools | Real-time legislation API (국가법령정보센터) |

## 2. Configuration

MCP servers are configured in `.mcp.json`:

```json
{
  "mcpServers": {
    "k_skill": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "mcp/k-skill/index.ts"]
    },
    "legalize_kr": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "mcp/legalize-kr/index.ts"]
    },
    "kr_legislation": {
      "command": "bun",
      "args": ["run", "--env-file", ".env", "mcp/kr-legislation/index.ts"]
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
- k_skill tools for compliance gap analysis (OSHA/SAPA articles)

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
# k-skill uses cached data (no token needed)
```

## 6. Future Integration (v2)

- Real-time law amendment notifications
- Automated legal_basis refresh when regulations change
- ML-powered regulation interpretation
- Cross-reference validation against actual law text
