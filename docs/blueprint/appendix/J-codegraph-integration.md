# Appendix J: Codegraph Integration

This appendix describes the integration between the Safety OS multi-agent architecture and the CodeGraph MCP server.

## Overview

The `codegraph` MCP server provides AST-aware codebase exploration, which is critical for agents needing to analyze code dependencies, find function definitions, and navigate the graph of the project structure efficiently.

## Enabled Tools
- `codegraph_search`: Semantic and keyword searching over the codebase graph.
- `codegraph_context`: Retrieves surrounding context for specific nodes.
- `codegraph_node`: Extracts precise structural information about a node (e.g., function, class).
- `codegraph_explore`: Navigates the edges of the codebase graph (e.g., finding callers of a function).
- `codegraph_trace`: Traces execution paths and data flow.

## Agent Usage

### Auditor Agent
Uses `codegraph_explore` to verify that all workflows defined in TypeScript (`scripts/`) correctly import and utilize the `validateLegalBasis` utility, ensuring no execution path bypasses the compliance gate.

### Architecture Agent
Uses `codegraph_search` and `codegraph_node` during Phase 1/2 to analyze existing project structure and determine optimal placement for new EHS compliance modules.
