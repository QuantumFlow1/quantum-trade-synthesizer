
/**
 * Agent connection types
 */
export interface AgentConnectionStatus {
  isConnected: boolean;
  lastChecked: Date | null;
  activeAgents: number;
  isVerifying: boolean;
  error?: string | null;
  retryCount?: number;
}

export interface ConnectionListener {
  (status: AgentConnectionStatus): void;
}
