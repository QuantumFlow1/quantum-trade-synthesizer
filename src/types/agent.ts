
/**
 * Represents an AI trading agent in the system
 */
export interface Agent {
  id: string;
  name: string;
  type: "trader" | "advisor" | "analyst" | "portfolio_manager";
  description?: string;
  status: "active" | "idle" | "offline";
  performance?: {
    successRate: number;
    tasksCompleted: number;
  };
}
