
import { useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { SentimentType } from "@/components/visualization/3d/MarketSentiment";

export function useMarketSentiment(processedData: TradingDataPoint[]) {
  const marketSentiment = useMemo(() => {
    if (!processedData.length) return "neutral" as SentimentType;
    
    const upCount = processedData.filter(d => d.trend === "up").length;
    const downCount = processedData.filter(d => d.trend === "down").length;
    
    if (upCount > downCount * 1.5) return "very-bullish" as SentimentType;
    if (upCount > downCount) return "bullish" as SentimentType;
    if (downCount > upCount * 1.5) return "very-bearish" as SentimentType;
    if (downCount > upCount) return "bearish" as SentimentType;
    return "neutral" as SentimentType;
  }, [processedData]);
  
  return marketSentiment;
}
