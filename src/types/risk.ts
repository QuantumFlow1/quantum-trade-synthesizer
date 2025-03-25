
export interface RiskSettings {
  risk_level: 'conservative' | 'moderate' | 'aggressive';
  position_size_calculation: string;
  risk_reward_target: number;
  portfolio_allocation_limit: number;
  max_position_size: number;
  daily_loss_notification: boolean;
}
