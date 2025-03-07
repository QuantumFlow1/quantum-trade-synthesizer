
import { useState, useEffect } from "react";
import { useThemeDetection } from "@/hooks/use-theme-detection";
import { useProcessedTradingData } from "@/hooks/use-processed-trading-data";
import { usePriceVolumeRanges } from "@/hooks/use-price-volume-ranges";
import { useMarketSentiment } from "@/hooks/use-market-sentiment";
import { useMarketEnvironment } from "@/hooks/use-market-environment";
import { TradingDataPoint } from "@/utils/tradingData";
import { CoordinatesAndStars } from "./scene/CoordinatesAndStars";
import { PriceBarVisualization } from "./scene/PriceBarVisualization";
import { VolumeVisualization } from "./scene/VolumeVisualization";
import { BaseSceneLighting } from "./scene/BaseSceneLighting";
import { EnvironmentEffects } from "./scene/EnvironmentEffects";

// Define the optimization level type to match what's used in the child components
type OptimizationLevel = 'normal' | 'aggressive';

// Define the environment preset type
type EnvironmentPreset = 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';

interface SceneProps {
  data: TradingDataPoint[];
  optimizationLevel?: OptimizationLevel;
  showPrices?: boolean;
  showVolume?: boolean;
  showStars?: boolean;
  dataReductionFactor?: number;
  environmentPreset?: EnvironmentPreset;
}

export const Scene = ({ 
  data, 
  optimizationLevel = 'aggressive',
  showPrices = true,
  showVolume = true,
  showStars = true,
  dataReductionFactor,
  environmentPreset: customEnvironment
}: SceneProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const theme = useThemeDetection();
  
  // Use custom hooks to manage data and calculations
  const processedData = useProcessedTradingData(data);
  const { maxPrice, minPrice, maxVolume } = usePriceVolumeRanges(processedData);
  const marketSentiment = useMarketSentiment(processedData);
  const defaultEnvironment = useMarketEnvironment(marketSentiment, theme);
  
  // Set environment preset based on props or default
  const environmentPreset: EnvironmentPreset = customEnvironment || defaultEnvironment;
  
  // Calculate data reduction based on optimization level
  const getReductionFactor = () => {
    if (dataReductionFactor) return dataReductionFactor;
    
    switch (optimizationLevel) {
      case 'normal': return 2; // Show 1/2 of data points
      case 'aggressive': return 4; // Show 1/4 of data points
      default: return 4;
    }
  };
  
  // Apply data reduction for better performance
  const displayData = processedData.filter((_, index) => 
    index % getReductionFactor() === 0
  );
  
  // Mark scene as ready after a short delay to ensure everything is initialized
  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <>
      <BaseSceneLighting 
        theme={theme} 
        hoveredIndex={hoveredIndex} 
        processedData={displayData}
        optimizationLevel={optimizationLevel}
      />
      
      {showStars && (
        <CoordinatesAndStars 
          theme={theme} 
          sentiment={marketSentiment} 
          optimizationLevel={optimizationLevel}
        />
      )}
      
      {showPrices && ready && (
        <PriceBarVisualization 
          processedData={displayData}
          maxPrice={maxPrice}
          minPrice={minPrice}
          theme={theme}
          onHoverChange={setHoveredIndex}
          optimizationLevel={optimizationLevel}
        />
      )}
      
      {showVolume && ready && (
        <VolumeVisualization 
          processedData={displayData}
          maxVolume={maxVolume}
          theme={theme}
          optimizationLevel={optimizationLevel}
        />
      )}
      
      <EnvironmentEffects 
        theme={theme} 
        environmentPreset={environmentPreset}
        optimizationLevel={optimizationLevel}
      />
    </>
  );
};
