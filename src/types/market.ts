
export interface MarketAnalysis {
  recommendation: "BUY" | "SELL" | "OBSERVE" | "HOLD";
  confidence: number;
  reason: string;
}

export interface MarketAnalysisResponse {
  symbol: string;
  market: string;
  analysis: MarketAnalysis;
}

export interface BatchMarketAnalysisResponse {
  analyses: MarketAnalysisResponse[];
}
