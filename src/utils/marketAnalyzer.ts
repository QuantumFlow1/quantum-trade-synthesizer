
import { MarketData } from "@/components/trading/types";
import { MarketAnalysis } from "@/types/market-analysis";

export class MarketAnalyzer {
  static calculateMA(prices: number[], windowSize: number): number {
    if (prices.length < windowSize) {
      throw new Error("Insufficient data for MA calculation");
    }
    
    const sum = prices.slice(-windowSize).reduce((a, b) => a + b, 0);
    return sum / windowSize;
  }

  static analyzeMarketTrend(data: MarketData[], windowSize: number = 10): MarketAnalysis {
    console.log(`Analyzing market trend with window size: ${windowSize}`);
    
    if (data.length < windowSize * 2) {
      throw new Error(`Need at least ${windowSize * 2} data points for trend analysis`);
    }

    const prices = data.map(d => d.price);
    
    // Calculate current and previous MA
    const currentMA = this.calculateMA(prices, windowSize);
    const previousMA = this.calculateMA(prices.slice(0, -windowSize), windowSize);
    
    // Calculate relative difference
    const difference = (currentMA - previousMA) / previousMA;
    
    console.log(`Current MA: ${currentMA}, Previous MA: ${previousMA}, Difference: ${difference}`);
    
    // Determine trend (using 1% threshold like Python implementation)
    let trend: "rising" | "falling" | "neutral";
    if (Math.abs(difference) < 0.01) {
      trend = "neutral";
    } else {
      trend = difference > 0 ? "rising" : "falling";
    }

    console.log(`Detected trend: ${trend}`);

    return {
      trend,
      currentMA,
      previousMA,
      difference,
      windowSize
    };
  }
}
