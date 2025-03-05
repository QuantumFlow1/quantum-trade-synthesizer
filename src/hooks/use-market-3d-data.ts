
import { useState, useEffect, useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export const useMarket3DData = (data: TradingDataPoint[]) => {
  const [visualizationData, setVisualizationData] = useState<TradingDataPoint[]>([]);
  
  // Process data for visualization
  useEffect(() => {
    if (!data || data.length === 0) return;
    
    // Use last 24 points for better visualization
    const lastPoints = data.slice(Math.max(0, data.length - 24));
    setVisualizationData(lastPoints);
  }, [data]);
  
  // Calculate some statistics for the visualization
  const stats = useMemo(() => {
    if (visualizationData.length === 0) {
      return {
        avgPrice: 0,
        maxPrice: 0,
        minPrice: 0,
        priceChange: 0,
        priceChangePercent: 0
      };
    }
    
    const maxPrice = Math.max(...visualizationData.map(d => d.close));
    const minPrice = Math.min(...visualizationData.map(d => d.close));
    const avgPrice = visualizationData.reduce((sum, d) => sum + d.close, 0) / visualizationData.length;
    
    const first = visualizationData[0];
    const last = visualizationData[visualizationData.length - 1];
    const priceChange = last.close - first.close;
    const priceChangePercent = (priceChange / first.close) * 100;
    
    return {
      avgPrice,
      maxPrice,
      minPrice,
      priceChange,
      priceChangePercent
    };
  }, [visualizationData]);
  
  return {
    visualizationData,
    stats
  };
};
