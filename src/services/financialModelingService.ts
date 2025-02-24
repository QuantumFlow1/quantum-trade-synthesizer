
import { supabase } from "@/lib/supabase";
import {
  calculateSharpeRatio,
  calculateMaxDrawdown,
  calculateSortinoRatio,
  calculateROI,
} from "@/utils/financialMetrics";

export interface ModelParameters {
  timeframe: string;
  riskLevel: string;
  targetReturn: number;
  stopLoss: number;
  takeProfit: number;
}

export interface FinancialAnalysis {
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  roi: number;
  confidence: number;
  recommendation: string;
}

export const financialModelingService = {
  async analyzeStrategy(modelId: string, prices: number[]): Promise<FinancialAnalysis> {
    console.log("Analyzing strategy for model:", modelId);
    
    // Calculate returns from prices
    const returns = prices.slice(1).map((price, i) => 
      (price - prices[i]) / prices[i]
    );

    // Calculate key metrics
    const sharpeRatio = calculateSharpeRatio(returns);
    const sortinoRatio = calculateSortinoRatio(returns);
    const maxDrawdown = calculateMaxDrawdown(prices);
    const roi = calculateROI(prices[0], prices[prices.length - 1]);

    // Store metrics in database
    const { error } = await supabase.from("financial_metrics").insert([
      {
        model_id: modelId,
        metric_type: "sharpe_ratio",
        value: sharpeRatio,
        metadata: { timeframe: "daily" }
      },
      {
        model_id: modelId,
        metric_type: "sortino_ratio",
        value: sortinoRatio,
        metadata: { timeframe: "daily" }
      },
      {
        model_id: modelId,
        metric_type: "max_drawdown",
        value: maxDrawdown,
        metadata: { timeframe: "daily" }
      },
      {
        model_id: modelId,
        metric_type: "roi",
        value: roi,
        metadata: { timeframe: "daily" }
      }
    ]);

    if (error) {
      console.error("Error storing financial metrics:", error);
      throw error;
    }

    // Calculate confidence based on combined metrics
    const confidence = calculateConfidence(sharpeRatio, sortinoRatio, maxDrawdown);
    const recommendation = generateRecommendation(confidence, maxDrawdown, roi);

    return {
      sharpeRatio,
      sortinoRatio,
      maxDrawdown,
      roi,
      confidence,
      recommendation
    };
  }
};

function calculateConfidence(
  sharpeRatio: number,
  sortinoRatio: number,
  maxDrawdown: number
): number {
  // Normalize metrics to 0-1 scale
  const normalizedSharpe = Math.max(0, Math.min(1, (sharpeRatio + 2) / 4));
  const normalizedSortino = Math.max(0, Math.min(1, (sortinoRatio + 2) / 4));
  const normalizedDrawdown = Math.max(0, 1 - maxDrawdown);

  // Weight and combine metrics
  const confidence = (
    normalizedSharpe * 0.4 +
    normalizedSortino * 0.4 +
    normalizedDrawdown * 0.2
  ) * 100;

  return Number(confidence.toFixed(2));
}

function generateRecommendation(
  confidence: number,
  maxDrawdown: number,
  roi: number
): string {
  if (confidence > 80 && maxDrawdown < 0.1 && roi > 0) {
    return "Strong Buy";
  } else if (confidence > 60 && maxDrawdown < 0.15 && roi > 0) {
    return "Buy";
  } else if (confidence > 40 && maxDrawdown < 0.2) {
    return "Hold";
  } else if (confidence > 20) {
    return "Reduce";
  } else {
    return "Sell";
  }
}

