
import { useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export const usePriceVolumeRanges = (data: TradingDataPoint[]) => {
  return useMemo(() => {
    if (!data || data.length === 0) {
      return {
        maxPrice: 0,
        minPrice: 0,
        maxVolume: 0,
        avgPrice: 0,
        priceRange: 0
      };
    }
    
    // Calculate price ranges
    const prices = data.map(point => point.close);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    // Calculate volume maximum
    const volumes = data.map(point => point.volume);
    const maxVolume = Math.max(...volumes);
    
    return {
      maxPrice,
      minPrice,
      maxVolume,
      avgPrice,
      priceRange
    };
  }, [data]);
};
