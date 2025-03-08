
import { TradingAgent } from "../types/portfolioTypes";

// Trading agent definitions
export const tradingAgents: TradingAgent[] = [
  {
    id: "value-investor",
    name: "Value Investor",
    icon: "trending-up",
    specialization: "fundamental",
    description: "Analyzes asset fundamentals and seeks undervalued opportunities",
    weight: 0.8,
    confidence: 80,
    successRate: 0.7
  },
  {
    id: "technical-analyst",
    name: "Technical Analyst",
    icon: "bar-chart-2",
    specialization: "technical",
    description: "Uses chart patterns and technical indicators to predict price movements",
    weight: 0.75,
    confidence: 75,
    successRate: 0.65
  },
  {
    id: "sentiment-analyzer",
    name: "Sentiment Analyzer",
    icon: "message-circle",
    specialization: "sentiment",
    description: "Monitors social media and news sentiment to gauge market perception",
    weight: 0.7,
    confidence: 70,
    successRate: 0.6
  },
  {
    id: "risk-manager",
    name: "Risk Manager",
    icon: "shield",
    specialization: "risk",
    description: "Evaluates potential downside risks and suggests protective strategies",
    weight: 0.85,
    confidence: 85,
    successRate: 0.75
  },
  {
    id: "volatility-expert",
    name: "Volatility Expert",
    icon: "activity",
    specialization: "volatility",
    description: "Specializes in analyzing market volatility and price fluctuations",
    weight: 0.72,
    confidence: 72,
    successRate: 0.63
  },
  {
    id: "macro-economist",
    name: "Macro Economist",
    icon: "globe",
    specialization: "macro",
    description: "Considers broader economic factors and market correlations",
    weight: 0.78,
    confidence: 78,
    successRate: 0.68
  }
];
