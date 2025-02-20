
export interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: "advisor" | "trader" | "analyst";
  description: string;
  createdAt: string;
  lastActive: string;
  performance?: {
    successRate: number;
    tasksCompleted: number;
  };
}
