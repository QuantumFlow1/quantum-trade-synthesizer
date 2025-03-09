
import { TradingAgent } from "../types/portfolioTypes";

export const otherAgent2: TradingAgent = {
  id: "agent2",
  name: "Technical Analyst",
  description: "Uses technical indicators and chart patterns to predict price movements",
  specialization: "technical",
  confidence: 0.85,
  weight: 0.65,
  performance: {
    accuracy: 72,
    recentTrades: [true, true, false, true, false],
    profitFactor: 1.5
  }
};
