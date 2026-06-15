export class MCPConfigError extends Error {
  constructor(message: string) { super(message); this.name = 'MCPConfigError'; }
}
export class MCPNetworkError extends Error {
  constructor(message: string) { super(message); this.name = 'MCPNetworkError'; }
}
export class MCPDataNotFoundError extends Error {
  constructor(message: string) { super(message); this.name = 'MCPDataNotFoundError'; }
}
export class MCPValidationError extends Error {
  constructor(message: string) { super(message); this.name = 'MCPValidationError'; }
}
