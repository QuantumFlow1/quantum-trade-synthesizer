
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
        macdSignal: point.macdSignal || point.signal || 0,
        signal: point.signal || point.macdSignal || 0,
        macdHistogram: point.macdHistogram || point.histogram || 0,
        histogram: point.histogram || point.macdHistogram || 0,
        bollingerUpper: point.bollingerUpper || point.bollinger_upper || point.close * 1.05,
        bollingerMiddle: point.bollingerMiddle || point.bollinger_middle || point.close,
        bollingerLower: point.bollingerLower || point.bollinger_lower || point.close * 0.95,
        bollinger_upper: point.bollinger_upper || point.bollingerUpper || point.close * 1.05,
        bollinger_middle: point.bollinger_middle || point.bollingerMiddle || point.close,
        bollinger_lower: point.bollinger_lower || point.bollingerLower || point.close * 0.95,
        atr: point.atr || 0,
        cci: point.cci || 0,
        stochastic: point.stochastic || 50,
        adx: point.adx || 25
      };
      
      return processedPoint;
    });
  }, [data]);
};
