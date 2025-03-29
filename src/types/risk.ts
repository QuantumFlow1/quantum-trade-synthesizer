
export interface RiskSettings {
  position_size_calculation: string;
  risk_reward_target: number;
  portfolio_allocation_limit: number;
  daily_loss_notification: boolean;
  risk_level: 'conservative' | 'moderate' | 'aggressive';
  max_position_size: number;
  max_daily_loss: number;
  max_leverage: number;
}

export interface RiskMetric {
  name: string;
  value: number;
  maxValue: number;
  status: "low" | "medium" | "high";
}

export interface RiskHistoryEntry {
  date: string;
  metrics: RiskMetric[];
}

export const defaultRiskSettings: RiskSettings = {
  position_size_calculation: 'fixed',
  risk_reward_target: 2,
  portfolio_allocation_limit: 20,
  daily_loss_notification: true,
  risk_level: 'moderate',
  max_position_size: 1000,
  max_daily_loss: 100,
  max_leverage: 2
};
