
export type AgentType = "trading" | "analysis" | "risk" | "finance" | "compliance" | "security" | "legal" | "market_analysis" | "portfolio_risk";

export interface Agent {
  id: string;
  name: string;
  status: "active" | "paused" | "terminated";
  type: AgentType;
  performance: string;
  lastActive: string;
  department: string;
  expertise: string[];
  capabilities?: string[];
  riskLevel?: "low" | "medium" | "high";
}
