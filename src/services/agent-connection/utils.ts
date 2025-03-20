
import { AgentConnectionStatus } from "./types";

// Enable or disable detailed logging
const DEBUG_LOGGING = true;

// Helper function to log connection-related activities
export const logConnection = (message: string): string => {
  if (DEBUG_LOGGING) {
    console.log(`[AgentConnection] ${message}`);
  }
  return message;
};

// Initial connection status
export const initialConnectionStatus: AgentConnectionStatus = {
  isConnected: false,
  isVerifying: false,
  activeAgents: 0,
  lastChecked: undefined,
  error: null,
  retryCount: 0
};
