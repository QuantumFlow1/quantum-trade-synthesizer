
import { AgentConnectionStatus } from "./types";

// Initial connection status
export const initialConnectionStatus: AgentConnectionStatus = {
  isConnected: false,
  lastChecked: null,
  activeAgents: 0,
  isVerifying: false,
  error: null,
  retryCount: 0
};

/**
 * Helper function to create a consistent console log prefix
 */
export const logPrefix = "[AgentConnection]";

/**
 * Helper to log agent connection activities with consistent format
 */
export function logConnection(message: string, data?: any): void {
  if (data) {
    console.log(`${logPrefix} ${message}`, data);
  } else {
    console.log(`${logPrefix} ${message}`);
  }
}
