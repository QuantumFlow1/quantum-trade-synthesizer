
export interface ApiKeyAvailability {
  available: boolean;
  allKeys?: Record<string, boolean>;
  provider?: string;
  message?: string;
}
