# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x (Phase A beta) | ✅ Active development |

## Reporting a Vulnerability

If you discover a security vulnerability in Safety OS, please report it responsibly:

1. **Do not** open a public GitHub issue
2. Contact the project maintainer directly
3. Include a description of the vulnerability and reproduction steps

## Security Considerations for Safety OS

### Regulatory Data Handling

- **No full statutory text**: Regulation files (`regulations/`) must contain metadata only
- **No personal data in evidence models**: `evidence-models/` schemas do not include PII fields
- **Legal interpretation disclaimer**: This system provides automation assistance only — not legal advice

### Agent Security

- All agent prompts follow the 3-Section structure with explicit legal basis
- Agent dispatch requires PM (CSO) approval
- Emergency agent bypasses SGM but not security review

### Evidence Trail Integrity

- Evidence schemas are versioned (semver) — breaking changes require migration scripts
- Agents are read-only on evidence-models until Phase B promotion is confirmed

---

> **TODO (Phase B required)**: Complete this security policy before promoting to `templates/co-safety/`.
> Review all agent prompts for prompt injection risks and add threat model section.
