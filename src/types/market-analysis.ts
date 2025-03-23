
import { MarketData } from "@/components/market/types";

export interface TechnicalIndicators {
  rsi: number;
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  bollingerBands: {
    middle: number;
    upper: number;
    lower: number;
    bandwidth: number;
  };
}

export interface MarketAnalysis {
  trend: "rising" | "falling" | "neutral";
  currentMA: number;
  previousMA: number;
  difference: number;
  windowSize: number;
  indicators?: TechnicalIndicators;
  confidence?: number;
}

export interface MarketAnalysisResult {
  trend: "rising" | "falling" | "neutral";
  currentMA: number;
  previousMA: number;
  difference: number;
  windowSize: number;
  indicators?: TechnicalIndicators;
  confidence?: number;
  error?: string;
}

export interface MarketAnalyzer {
  analyzeMarketTrend: (data: MarketData[], windowSize?: number) => MarketAnalysisResult;
}

export interface BacktestResult {
  trades: Array<{ 
    action: string; 
    price: number; 
    timestamp: number | Date; 
    profit: number;
  }>;
  finalCapital: number;
  totalReturn: number;
  winRate: number;
  maxDrawdown: number;
}

export interface SentimentAnalysisResult {
  overallSentiment: number;
  bullishSources: string[];
  bearishSources: string[];
  confidenceScore: number;
}

export interface MarketSentimentData {
  source: string;
  score: number;
  weight: number;
}
