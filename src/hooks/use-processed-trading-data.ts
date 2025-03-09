
import { useEffect, useState } from "react";
import { TradingDataPoint } from "@/utils/tradingData";

export const useProcessedTradingData = (data: TradingDataPoint[]) => {
  const [processedData, setProcessedData] = useState<TradingDataPoint[]>([]);
  
  useEffect(() => {
    if (!data || data.length === 0) {
      console.log("No trading data to process");
      setProcessedData([]);
      return;
    }
    
    try {
      // Ensure data is properly formatted for visualization
      const formattedData = data.map(point => {
        // Make sure all required fields are present
        return {
          ...point,
          // Ensure these are numbers for visualization
          open: typeof point.open === 'number' ? point.open : point.close || 0,
          high: typeof point.high === 'number' ? point.high : point.close || 0,
          low: typeof point.low === 'number' ? point.low : point.close || 0,
          close: typeof point.close === 'number' ? point.close : 0,
          volume: typeof point.volume === 'number' ? point.volume : 0,
          // Add extra visualization data if not present
          visualX: point.visualX || 0,
          visualY: point.visualY || 0,
          visualZ: point.visualZ || 0,
          color: point.color || getPointColor(point)
        };
      });
      
      console.log(`Processed ${formattedData.length} trading data points for visualization`);
      setProcessedData(formattedData);
    } catch (error) {
      console.error("Error processing trading data:", error);
      // Return empty array on error
      setProcessedData([]);
    }
  }, [data]);
  
  return processedData;
};

// Helper function to get color based on candle direction
function getPointColor(point: TradingDataPoint): string {
  if (!point) return '#888888';
  
  // Use close vs open if available
  if (typeof point.close === 'number' && typeof point.open === 'number') {
    return point.close >= point.open ? '#4ade80' : '#ef4444';
  }
  
  // Fallback to change values
  if (typeof point.change === 'number') {
    return point.change >= 0 ? '#4ade80' : '#ef4444';
  }
  
  return '#888888';
}
