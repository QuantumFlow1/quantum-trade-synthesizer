
export interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: "receptionist" | "advisor" | "trader" | "analyst";
  description: string;
  createdAt: string;
  lastActive: string;
  tasks?: string[];
  performance?: {
    successRate: number;
    tasksCompleted: number;
  };
}

