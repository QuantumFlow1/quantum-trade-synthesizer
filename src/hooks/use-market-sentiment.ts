
import { useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export function useMarketSentiment(data: TradingDataPoint[]): 'bullish' | 'bearish' | 'neutral' {
  return useMemo(() => {
    if (!data || data.length === 0) return 'neutral';
    
    // Count up vs down trends
    const upCount = data.filter(point => point.trend === 'up').length;
    const downCount = data.filter(point => point.trend === 'down').length;
    
    // Calculate sentiment based on majority trend
    if (upCount > downCount * 1.25) {
      return 'bullish';
    } else if (downCount > upCount * 1.25) {
      return 'bearish';
    } else {
      return 'neutral';
    }
  }, [data]);
}
