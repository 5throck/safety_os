export interface MCPResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface CacheEntry<T = unknown> {
  data: T;
  timestamp: string;
  ttl: number;
}

export interface RegulatoryArticle {
  articleId: string;
  lawName: string;
  articleNumber: string;
  title: string;
  content: string;
  effectiveDate?: string;
}
