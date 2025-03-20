
export interface AgentConnectionStatus {
  isConnected: boolean;
  isVerifying: boolean;
  activeAgents: number;
  lastChecked?: Date;
  error?: string | null;
  retryCount?: number;
}

export type ConnectionListener = (status: AgentConnectionStatus) => void;
