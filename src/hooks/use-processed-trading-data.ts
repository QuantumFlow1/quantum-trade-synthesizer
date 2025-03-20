
import { useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export const useProcessedTradingData = (data: TradingDataPoint[]): TradingDataPoint[] => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }
    
    // Process data points to ensure they have all required properties
    return data.map((point, index, arr) => {
      // Default values for missing fields
      const processedPoint: TradingDataPoint = {
        ...point,
        // Ensure trend is set
        trend: point.trend || (
          index > 0 
            ? (point.close > arr[index - 1].close ? 'up' : 'down') 
            : 'neutral'
        ),
        // Add fallbacks for technical indicators if missing
        sma: point.sma || point.close,
        ema: point.ema || point.close,
        rsi: point.rsi || 50,
        macd: point.macd || 0,
        macdSignal: point.macdSignal || 0,
        macdHistogram: point.macdHistogram || 0,
        bollingerUpper: point.bollingerUpper || point.close * 1.05,
        bollingerLower: point.bollingerLower || point.close * 0.95,
        stochastic: point.stochastic || 50,
        adx: point.adx || 25
      };
      
      return processedPoint;
    });
  }, [data]);
};
