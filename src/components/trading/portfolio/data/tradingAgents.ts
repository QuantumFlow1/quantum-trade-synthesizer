
import { TradingAgent } from "../types/portfolioTypes";

// Define our specialized agents with weights
export const tradingAgents: TradingAgent[] = [
  {
    id: "value-investor",
    name: "Value Investor",
    specialization: "fundamental",
    description: "Analyzes asset fundamentals and intrinsic value",
    weight: 85,
    successRate: 0.72,
    contributionScore: 16
  },
  {
    id: "technical-analyst",
    name: "Technical Analyst",
    specialization: "technical",
    description: "Identifies patterns in price charts and technical indicators",
    weight: 82,
    successRate: 0.68,
    contributionScore: 14
  },
  {
    id: "sentiment-analyzer",
    name: "Sentiment Analyzer",
    specialization: "sentiment",
    description: "Analyzes news and social media for market sentiment",
    weight: 75,
    successRate: 0.63,
    contributionScore: 12
  },
  {
    id: "risk-manager",
    name: "Risk Manager",
    specialization: "risk",
    description: "Calculates risk metrics and optimal position sizing",
    weight: 90,
    successRate: 0.78,
    contributionScore: 18
  },
  {
    id: "volatility-expert",
    name: "Volatility Expert",
    specialization: "volatility",
    description: "Specializes in market volatility analysis",
    weight: 80,
    successRate: 0.65,
    contributionScore: 13
  },
  {
    id: "macro-economist",
    name: "Macro Economist",
    specialization: "macro",
    description: "Analyzes economic indicators and monetary policy effects",
    weight: 78,
    successRate: 0.64,
    contributionScore: 12
  }
];
