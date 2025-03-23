
import { MarketData } from "@/components/market/types";

export interface MarketAnalysis {
  trend: "rising" | "falling" | "neutral";
  currentMA: number;
  previousMA: number;
  difference: number;
  windowSize: number;
}

export interface MarketAnalysisResult {
  trend: "rising" | "falling" | "neutral";
  currentMA: number;
  previousMA: number;
  difference: number;
  windowSize: number;
  error?: string;
}

export interface MarketAnalyzer {
  analyzeMarketTrend: (data: MarketData[], windowSize?: number) => MarketAnalysisResult;
}
