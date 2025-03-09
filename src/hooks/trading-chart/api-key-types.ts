
/**
 * Interface for API Key availability check results
 */
export interface ApiKeyAvailability {
  available: boolean;
  message?: string;
  allKeys?: Record<string, boolean>;
  provider?: string;
}

/**
 * Interface for API Key configuration
 */
export interface ApiKeyConfig {
  key: string;
  provider: string;
  active: boolean;
  lastChecked?: number;
}

/**
 * Interface for API Key verification result
 */
export interface ApiKeyVerificationResult {
  valid: boolean;
  message?: string;
  provider?: string;
}

/**
 * API Key provider types
 */
export type ApiKeyProvider = 
  | 'openai' 
  | 'groq' 
  | 'anthropic' 
  | 'deepseek' 
  | 'trading' 
  | 'alphavantage' 
  | 'marketdata' 
  | 'any';
