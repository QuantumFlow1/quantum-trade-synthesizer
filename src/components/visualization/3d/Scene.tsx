
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

export const Scene = ({ data, optimizationLevel = 'normal' }: SceneProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = useThemeDetection();
  
  // Use custom hooks to manage data and calculations
  const processedData = useProcessedTradingData(data);
  const { maxPrice, minPrice, maxVolume } = usePriceVolumeRanges(processedData);
  const marketSentiment = useMarketSentiment(processedData);
  const environmentPreset = useMarketEnvironment(marketSentiment, theme);
  
  // When in aggressive optimization mode, limit the number of elements rendered
  const optimizedData = optimizationLevel === 'aggressive' 
    ? processedData.filter((_, index) => index % 2 === 0) // Only render every other data point
    : processedData;
  
  return (
    <>
      <BaseSceneLighting 
        theme={theme} 
        hoveredIndex={hoveredIndex} 
        processedData={optimizedData}
        optimizationLevel={optimizationLevel}
      />
      
      <CoordinatesAndStars 
        theme={theme} 
        sentiment={marketSentiment} 
        optimizationLevel={optimizationLevel}
      />
      
      <PriceBarVisualization 
        processedData={optimizedData}
        maxPrice={maxPrice}
        minPrice={minPrice}
        theme={theme}
        onHoverChange={setHoveredIndex}
        optimizationLevel={optimizationLevel}
      />
      
      <VolumeVisualization 
        processedData={optimizedData}
        maxVolume={maxVolume}
        theme={theme}
        optimizationLevel={optimizationLevel}
      />
      
      <EnvironmentEffects 
        theme={theme} 
        environmentPreset={environmentPreset}
        optimizationLevel={optimizationLevel}
      />
    </>
  );
};
