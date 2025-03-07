
import { logConnection, initialConnectionStatus } from "./utils";
import { connectionChecker } from "./connectionChecker";
import { AgentConnectionStatus, ConnectionListener } from "./types";

class AgentConnectionService {
  private status: AgentConnectionStatus = initialConnectionStatus;
  private listeners: ConnectionListener[] = [];
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
  subscribe(listener: ConnectionListener): () => void {
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
    
    logConnection(`Started periodic checking every ${intervalMs}ms`);
  }
  
  /**
   * Stop automatic connection checking
   */
  stopPeriodicChecking(): void {
    if (this.connectionCheckInterval !== null) {
      clearInterval(this.connectionCheckInterval);
      this.connectionCheckInterval = null;
      logConnection("Stopped periodic checking");
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
      logConnection(`Scheduling retry (${this.status.retryCount + 1}/${this.maxRetryCount}) in ${this.retryDelayMs}ms`);
      
      // Clear any existing retry timeout
      if (this.retryTimeoutId !== null) {
        clearTimeout(this.retryTimeoutId);
      }
      
      // Schedule new retry
      this.retryTimeoutId = window.setTimeout(() => {
        this.checkConnection();
      }, this.retryDelayMs);
    } else {
      logConnection("Max retry count reached, not scheduling more retries");
    }
  }

  /**
   * Check connection to agent network
   */
  async checkConnection(): Promise<boolean> {
    const updateStatus = (newStatus: Partial<AgentConnectionStatus>): void => {
      this.status = { ...this.status, ...newStatus };
      this.notifyListeners();
    };

    const result = await connectionChecker.checkConnection(this.status, updateStatus);
    
    // Schedule a retry if we had an error and haven't exceeded max retries
    if (!result && this.status.retryCount !== undefined && this.status.retryCount < this.maxRetryCount) {
      this.scheduleRetry();
    }
    
    return result;
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
      ...initialConnectionStatus,
      ...customStatus
    };
    this.notifyListeners();
  }
}

// Create a singleton instance
export const agentConnectionService = new AgentConnectionService();

// Start periodic checking
agentConnectionService.startPeriodicChecking();

// Export the singleton as default
export default agentConnectionService;
