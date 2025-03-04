
import { supabase } from "@/lib/supabase";
import { logApiCall } from "@/utils/apiLogger";

/**
 * Service to handle agent connections separately from other trading functionality
 */
export interface AgentConnectionStatus {
  isConnected: boolean;
  lastChecked: Date | null;
  activeAgents: number;
  isVerifying: boolean;
  error?: string | null;
}

// Initial connection status
const initialStatus: AgentConnectionStatus = {
  isConnected: false,
  lastChecked: null,
  activeAgents: 0,
  isVerifying: false,
  error: null
};

class AgentConnectionService {
  private status: AgentConnectionStatus = initialStatus;
  private listeners: ((status: AgentConnectionStatus) => void)[] = [];
  private connectionCheckInterval: number | null = null;

  constructor() {
    // Initialize with a connection check
    this.checkConnection();
  }

  /**
   * Get the current connection status
   */
  getStatus(): AgentConnectionStatus {
    return { ...this.status };
  }

  /**
   * Subscribe to status changes
   */
  subscribe(listener: (status: AgentConnectionStatus) => void): () => void {
    this.listeners.push(listener);
    // Immediately notify the new listener of current status
    listener(this.getStatus());
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners of status changes
   */
  private notifyListeners(): void {
    const currentStatus = this.getStatus();
    this.listeners.forEach(listener => listener(currentStatus));
  }
  
  /**
   * Start automatic connection checking
   */
  startPeriodicChecking(intervalMs: number = 60000): void {
    // Clear any existing interval
    this.stopPeriodicChecking();
    
    // Start a new interval
    this.connectionCheckInterval = window.setInterval(() => {
      this.checkConnection();
    }, intervalMs);
    
    console.log(`Started periodic agent connection checking every ${intervalMs}ms`);
  }
  
  /**
   * Stop automatic connection checking
   */
  stopPeriodicChecking(): void {
    if (this.connectionCheckInterval !== null) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
      console.log("Stopped periodic agent connection checking");
    }
  }

  /**
   * Check connection to agent network
   */
  async checkConnection(): Promise<boolean> {
    // Only allow one check at a time
    if (this.status.isVerifying) {
      return this.status.isConnected;
    }
    
    try {
      this.status = {
        ...this.status,
        isVerifying: true,
        error: null
      };
      this.notifyListeners();
      
      // Log attempt
      await logApiCall('agent-network', 'AgentConnectionService', 'pending');
      
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
      
      // Parse response
      const isConnected = data?.status === 'connected';
      const activeAgents = data?.activeAgents || 0;
      
      // Update status
      this.status = {
        isConnected,
        activeAgents,
        lastChecked: new Date(),
        isVerifying: false,
        error: null
      };
      
      // Log success or failure
      await logApiCall(
        'agent-network', 
        'AgentConnectionService', 
        isConnected ? 'success' : 'error',
        isConnected ? undefined : 'Not connected'
      );
      
      console.log(`Agent network connection check: ${isConnected ? 'Connected' : 'Disconnected'}, ${activeAgents} active agents`);
      
      this.notifyListeners();
      return isConnected;
    } catch (error) {
      // Handle connection error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Agent connection error:", error);
      
      // Update status
      this.status = {
        isConnected: false,
        lastChecked: new Date(),
        activeAgents: 0,
        isVerifying: false,
        error: errorMessage
      };
      
      // Log error
      await logApiCall('agent-network', 'AgentConnectionService', 'error', errorMessage);
      
      this.notifyListeners();
      return false;
    }
  }
  
  /**
   * Reset connection status (useful for simulations)
   */
  resetStatus(customStatus?: Partial<AgentConnectionStatus>): void {
    this.status = {
      ...initialStatus,
      ...customStatus
    };
    this.notifyListeners();
  }
}

// Create a singleton instance
export const agentConnectionService = new AgentConnectionService();

// Start periodic checking
agentConnectionService.startPeriodicChecking();

export default agentConnectionService;
