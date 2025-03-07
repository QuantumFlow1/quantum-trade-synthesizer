
import { useState } from "react";
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

interface SceneProps {
  data: TradingDataPoint[];
  optimizationLevel?: 'normal' | 'aggressive';
}

export const Scene = ({ data, optimizationLevel = 'aggressive' }: SceneProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = useThemeDetection();
  
  // Use custom hooks to manage data and calculations
  const processedData = useProcessedTradingData(data);
  const { maxPrice, minPrice, maxVolume } = usePriceVolumeRanges(processedData);
  const marketSentiment = useMarketSentiment(processedData);
  const environmentPreset = useMarketEnvironment(marketSentiment, theme);
  
  // Further limit the data points to improve performance - always use aggressive
  // This significantly improves loading and rendering speed
  const displayData = processedData.filter((_, index) => index % 4 === 0); // Show only 1/4 of data points
  
  return (
    <>
      <BaseSceneLighting 
        theme={theme} 
        hoveredIndex={hoveredIndex} 
        processedData={displayData}
        optimizationLevel="aggressive"
      />
      
      <CoordinatesAndStars 
        theme={theme} 
        sentiment={marketSentiment} 
        optimizationLevel="aggressive"
      />
      
      <PriceBarVisualization 
        processedData={displayData}
        maxPrice={maxPrice}
        minPrice={minPrice}
        theme={theme}
        onHoverChange={setHoveredIndex}
        optimizationLevel="aggressive"
      />
      
      <VolumeVisualization 
        processedData={displayData}
        maxVolume={maxVolume}
        theme={theme}
        optimizationLevel="aggressive"
      />
      
      <EnvironmentEffects 
        theme={theme} 
        environmentPreset={environmentPreset}
        optimizationLevel="aggressive"
      />
    </>
  );
};
