
export type OrderType = "buy" | "sell";
export type OrderExecutionType = "market" | "limit" | "stop" | "stop_limit";
export type ApiStatus = 'checking' | 'available' | 'unavailable';

export interface AIAnalysis {
  confidence: number;
  riskLevel: string;
  recommendation: string;
  expectedProfit: string;
  stopLossRecommendation: number;
  takeProfitRecommendation: number;
  collaboratingAgents: string[];
}

export interface AdvancedSignal {
  direction: string;
  confidence: number;
  entry_price: number;
  stop_loss: number;
  take_profit: number;
  reasoning: string;
}
