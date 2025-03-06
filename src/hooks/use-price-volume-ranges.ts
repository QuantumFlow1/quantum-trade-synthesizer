
import { useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export function usePriceVolumeRanges(processedData: TradingDataPoint[]) {
  const { maxPrice, minPrice, maxVolume } = useMemo(() => {
    try {
      if (!processedData || processedData.length === 0) {
        return { maxPrice: 100, minPrice: 0, maxVolume: 100 };
      }
      
      const maxP = Math.max(...processedData.map(d => d.close));
      const minP = Math.min(...processedData.map(d => d.close));
      const maxV = Math.max(...processedData.map(d => d.volume));
      
      return { maxPrice: maxP, minPrice: minP, maxVolume: maxV };
    } catch (error) {
      console.error("Error calculating min/max values:", error);
      return { maxPrice: 100, minPrice: 0, maxVolume: 100 };
    }
  }, [processedData]);
  
  return { maxPrice, minPrice, maxVolume };
}
