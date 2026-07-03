import { MCPNetworkError } from './errors.js';

export async function fetchWithRetry(url: string, options?: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) {
        // 4xx errors are client-side — retrying won't help
        if (res.status >= 400 && res.status < 500) {
          throw new MCPNetworkError(`HTTP ${res.status} (client error, no retry): ${url}`);
        }
        throw new MCPNetworkError(`HTTP ${res.status}: ${url}`);
      }
      return res;
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      // 4xx errors should not be retried
      if (err instanceof MCPNetworkError && err.message.includes('client error')) throw err;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
  throw new MCPNetworkError('Max retries exceeded');
}

export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  constructor(
    private readonly threshold = 5,
    private readonly timeoutMs = 60_000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.failures >= this.threshold) {
      if (Date.now() - this.lastFailureTime < this.timeoutMs) {
        throw new Error('Circuit breaker OPEN');
      }
      this.failures = 0;
    }
    try {
      return await fn();
    } catch (err) {
      this.failures++;
      this.lastFailureTime = Date.now();
      throw err;
    }
  }
}
