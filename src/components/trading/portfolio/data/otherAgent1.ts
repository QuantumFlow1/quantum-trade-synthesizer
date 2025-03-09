
import { TradingAgent } from "../types/portfolioTypes";

export const otherAgent1: TradingAgent = {
  id: "agent1",
  name: "Value Investor",
  description: "Analyzes fundamental value metrics to identify undervalued assets",
  specialization: "fundamental",
  confidence: 0.8,
  weight: 0.7,
  performance: {
    accuracy: 76,
    recentTrades: [true, false, true, true, true],
    profitFactor: 1.8
  }
};
