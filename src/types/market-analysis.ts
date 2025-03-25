
import { MarketData } from "@/components/trading/types";

export interface MarketAnalysis {
  trend: "rising" | "falling" | "neutral";
  currentMA: number;
  previousMA: number;
  difference: number;
  windowSize: number;
}

export interface MarketAnalyzer {
  analyzeMarketTrend: (data: MarketData[], windowSize?: number) => MarketAnalysis;
}
