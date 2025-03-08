
import { useState, useEffect, useMemo } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export const useMarket3DData = (data: TradingDataPoint[]) => {
  const [visualizationData, setVisualizationData] = useState<TradingDataPoint[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Process data for visualization
  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No data received in useMarket3DData");
      return;
    }
    
    if (isProcessing) {
      console.log("Already processing data, skipping update");
      return;
    }
    
    console.log("Processing market data for 3D visualization:", data.length, "points");
    setIsProcessing(true);
    
    try {
      // Use last 24 points for better visualization
      const dataPoints = Math.min(data.length, 24);
      const lastPoints = data.slice(Math.max(0, data.length - dataPoints));
      
      // Add trend indicator based on price movement
      const pointsWithTrend = lastPoints.map((point, index, arr) => {
        if (index === 0) {
          return { ...point, trend: "neutral" as "up" | "down" | "neutral" };
        }
        
        const prevPoint = arr[index - 1];
        const trend = point.close > prevPoint.close ? "up" as const : "down" as const;
        
        return { ...point, trend };
      });
      
      console.log("Prepared 3D visualization data:", pointsWithTrend.length, "points");
      setVisualizationData(pointsWithTrend);
    } catch (error) {
      console.error("Error processing 3D visualization data:", error);
      // Fallback to empty array if processing fails
      setVisualizationData([]);
    } finally {
      setIsProcessing(false);
    }
  }, [data]);
  
  // Calculate statistics for the visualization
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
    
    try {
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
    } catch (error) {
      console.error("Error calculating 3D visualization stats:", error);
      return {
        avgPrice: 0,
        maxPrice: 0,
        minPrice: 0,
        priceChange: 0,
        priceChangePercent: 0
      };
    }
  }, [visualizationData]);
  
  return {
    visualizationData,
    stats,
    isProcessing
  };
};
