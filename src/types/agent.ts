
export type AgentType = 'advisor' | 'trader' | 'analyst' | 'receptionist';
export type AgentStatus = 'active' | 'paused' | 'maintenance' | 'terminated';

export interface AgentPerformance {
  successRate: number;
  tasksCompleted: number;
}

export interface AgentTasks {
  completed: number;
  pending: number;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description: string;
  performance?: AgentPerformance;
  tasks?: AgentTasks | string[];
}
