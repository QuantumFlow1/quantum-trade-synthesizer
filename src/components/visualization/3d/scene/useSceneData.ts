
import { useState } from "react";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useProcessedTradingData } from "@/hooks/use-processed-trading-data";
import { usePriceVolumeRanges } from "@/hooks/use-price-volume-ranges";
import { useMarketSentiment } from "@/hooks/use-market-sentiment";
import { useMarketEnvironment } from "@/hooks/use-market-environment";
import { TradingDataPoint } from "@/utils/tradingData";
import { OptimizationLevel, EnvironmentPreset } from "./types";

export const useSceneData = (
  data: TradingDataPoint[],
  optimizationLevel: OptimizationLevel = 'aggressive',
  dataReductionFactor?: number,
  environmentPreset?: EnvironmentPreset
) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = useThemeDetection();
  
  // Use custom hooks to manage data and calculations
  const processedData = useProcessedTradingData(data);
  const { maxPrice, minPrice, maxVolume } = usePriceVolumeRanges(processedData);
  const marketSentiment = useMarketSentiment(processedData);
  const defaultEnvironment = useMarketEnvironment(marketSentiment, theme);
  
  // Set environment preset based on props or default
  const finalEnvironmentPreset = environmentPreset || defaultEnvironment;
  
  // Calculate data reduction based on optimization level
  const getReductionFactor = () => {
    if (dataReductionFactor) return dataReductionFactor;
    
    switch (optimizationLevel) {
      case 'extreme': return 8; // Show 1/8 of data points
      case 'aggressive': return 4; // Show 1/4 of data points
      case 'normal': return 2; // Show 1/2 of data points
      default: return 4;
    }
  };
  
  // Apply data reduction for better performance
  const displayData = processedData.filter((_, index) => 
    index % getReductionFactor() === 0
  );

  return {
    hoveredIndex,
    setHoveredIndex,
    theme,
    displayData,
    maxPrice,
    minPrice,
    maxVolume,
    marketSentiment,
    finalEnvironmentPreset
  };
};
