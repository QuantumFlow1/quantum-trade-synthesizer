
import { supabase } from "@/lib/supabase";
import { logApiCall, logApiCallLocal } from "@/utils/apiLogger";
import { AgentConnectionStatus } from "./types";
import { logConnection } from "./utils";

/**
 * Responsible for checking connection to agent network
 */
export class ConnectionChecker {
  /**
   * Checks connection to agent network through Supabase function
   */
  async checkConnection(
    currentStatus: AgentConnectionStatus,
    onStatusUpdate: (newStatus: Partial<AgentConnectionStatus>) => void
  ): Promise<boolean> {
    // Only allow one check at a time
    if (currentStatus.isVerifying) {
      return currentStatus.isConnected;
    }
    
    try {
      onStatusUpdate({
        isVerifying: true,
        error: null
      });
      
      // First log the attempt
      await logApiCall('agent-network', 'AgentConnectionService', 'success');
      
      // Check connection to agent network through the Supabase function
      const { data, error } = await supabase.functions.invoke('agent-network-coordinator', {
        body: { 
          action: 'ping',
          requestId: `ping-${Date.now()}`
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Parse response - Updated to match our new edge function response format
      const isConnected = data?.status === 'connected';
      const activeAgents = data?.activeAgents || 0;
      
      // Update status
      const newStatus = {
        isConnected,
        activeAgents,
        lastChecked: new Date(),
        isVerifying: false,
        error: null,
        retryCount: 0 // Reset retry count on success
      };
      
      // Log success or failure
      await logApiCall(
        'agent-network', 
        'AgentConnectionService', 
        isConnected ? 'success' : 'error',
        isConnected ? undefined : 'Not connected'
      );
      
      logConnection(`Connection check: ${isConnected ? 'Connected' : 'Disconnected'}, ${activeAgents} active agents`);
      
      onStatusUpdate(newStatus);
      return isConnected;
    } catch (error) {
      // Handle connection error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(logConnection("Connection error:"), error);
      
      // Increment retry count
      const retryCount = (currentStatus.retryCount || 0) + 1;
      
      // Update status
      const newStatus = {
        isConnected: false,
        lastChecked: new Date(),
        activeAgents: 0,
        isVerifying: false,
        error: errorMessage,
        retryCount
      };
      
      // Log error
      await logApiCallLocal('agent-network', 'AgentConnectionService', 'error', errorMessage);
      
      onStatusUpdate(newStatus);
      return false;
    }
  }
}

export const connectionChecker = new ConnectionChecker();
