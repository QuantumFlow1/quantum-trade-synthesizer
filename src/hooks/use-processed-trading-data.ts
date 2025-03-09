
import { useState, useEffect } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export function useProcessedTradingData(data: TradingDataPoint[]) {
  const [processedData, setProcessedData] = useState<TradingDataPoint[]>([]);

  useEffect(() => {
    try {
      if (data && Array.isArray(data) && data.length > 0) {
        console.log("Processing 3D visualization data:", data.length, "data points");
        setProcessedData(data);
      } else {
        console.warn("Empty or invalid data received, creating fallback data");
        const fallbackData: TradingDataPoint[] = Array.from({ length: 5 }).map((_, i) => ({
          name: `Fallback ${i + 1}`,
          open: 100 + i * 5,
          close: 105 + i * 5,
          high: 110 + i * 5,
          low: 95 + i * 5,
          volume: 1000 + i * 100,
          sma: 102 + i * 5,
          ema: 103 + i * 5,
          rsi: 50 + i,
          macd: 0.5 + i * 0.1,
          macdSignal: 0.3 + i * 0.1,
          macdHistogram: 0.2 + i * 0.1,
          bollingerUpper: 115 + i * 5,
          bollingerLower: 90 + i * 5,
          stochastic: 40 + i * 5,
          adx: 30 + i * 2,
          trend: i % 2 === 0 ? "up" : "down"
        }));
        setProcessedData(fallbackData);
      }
    } catch (error) {
      console.error("Error processing 3D visualization data:", error);
      setProcessedData([]);
    }
  }, [data]);

  return processedData;
}
