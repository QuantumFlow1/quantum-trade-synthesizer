
import { AgentRecommendation, TradingAgent } from "./portfolioTypes";

export interface GroqAgentConfig {
  apiKey?: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  enabled: boolean;
}

export interface GroqAnalysisResult {
  recommendation: string;
  confidence: number;
  reasoning: string;
  marketSignals: {
    technicalIndicators: string[];
    fundamentalFactors: string[];
    sentimentAnalysis: string;
  };
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
}

export interface GroqAgent extends TradingAgent {
  type: 'groq';
  config: GroqAgentConfig;
}
