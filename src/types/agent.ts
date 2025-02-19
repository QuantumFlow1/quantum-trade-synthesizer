
export type AgentType = "trading" | "analysis" | "risk" | "finance" | "compliance" | "security" | "legal";

export interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: AgentType;
  performance: string;
  lastActive: string;
  department: string;
  expertise: string[];
}
