
import { supabase } from "@/lib/supabase";
import { logApiCall, logApiCallLocal } from "@/utils/apiLogger";

/**
 * Service to handle agent connections separately from other trading functionality
 */
export interface AgentConnectionStatus {
  isConnected: boolean;
  lastChecked: Date | null;
  activeAgents: number;
  isVerifying: boolean;
  error?: string | null;
  retryCount?: number;
}

// Initial connection status
const initialStatus: AgentConnectionStatus = {
  isConnected: false,
  lastChecked: null,
  activeAgents: 0,
  isVerifying: false,
  error: null,
  retryCount: 0
};

class AgentConnectionService {
  private status: AgentConnectionStatus = initialStatus;
  private listeners: ((status: AgentConnectionStatus) => void)[] = [];
  private connectionCheckInterval: number | null = null;
  private maxRetryCount = 3;
  private retryDelayMs = 5000;
  private retryTimeoutId: number | null = null;

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
    
    // Also clear any retry timeout
    if (this.retryTimeoutId !== null) {
      clearTimeout(this.retryTimeoutId);
      this.retryTimeoutId = null;
    }
  }

  /**
   * Schedule a retry after a delay
   */
  private scheduleRetry(): void {
    // Only schedule if we haven't exceeded max retries
    if (this.status.retryCount !== undefined && this.status.retryCount < this.maxRetryCount) {
      console.log(`Scheduling agent connection retry (${this.status.retryCount + 1}/${this.maxRetryCount}) in ${this.retryDelayMs}ms`);
      
      // Clear any existing retry timeout
      if (this.retryTimeoutId !== null) {
        clearTimeout(this.retryTimeoutId);
      }
      
      // Schedule new retry
      this.retryTimeoutId = window.setTimeout(() => {
        this.checkConnection();
      }, this.retryDelayMs);
    } else {
      console.log("Max retry count reached, not scheduling more retries");
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
      this.status = {
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
      
      console.log(`Agent network connection check: ${isConnected ? 'Connected' : 'Disconnected'}, ${activeAgents} active agents`);
      
      this.notifyListeners();
      return isConnected;
    } catch (error) {
      // Handle connection error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Agent connection error:", error);
      
      // Increment retry count
      const retryCount = (this.status.retryCount || 0) + 1;
      
      // Update status
      this.status = {
        isConnected: false,
        lastChecked: new Date(),
        activeAgents: 0,
        isVerifying: false,
        error: errorMessage,
        retryCount
      };
      
      // Log error
      await logApiCallLocal('agent-network', 'AgentConnectionService', 'error', errorMessage);
      
      this.notifyListeners();
      
      // Schedule a retry if we haven't exceeded max retries
      if (retryCount < this.maxRetryCount) {
        this.scheduleRetry();
      }
      
      return false;
    }
  }
  
  /**
   * Force a connection check and reset retry counter
   */
  async forceCheckConnection(): Promise<boolean> {
    // Reset retry count
    this.status = {
      ...this.status,
      retryCount: 0
    };
    
    return this.checkConnection();
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
