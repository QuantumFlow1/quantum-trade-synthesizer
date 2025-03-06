
import { useState } from "react";
import { OrbitControls, Environment } from "@react-three/drei";
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
}

export const Scene = ({ data }: SceneProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const theme = useThemeDetection();
  
  // Use custom hooks to manage data and calculations
  const processedData = useProcessedTradingData(data);
  const { maxPrice, minPrice, maxVolume } = usePriceVolumeRanges(processedData);
  const marketSentiment = useMarketSentiment(processedData);
  const environmentPreset = useMarketEnvironment(marketSentiment, theme);
  
  return (
    <>
      <BaseSceneLighting 
        theme={theme} 
        hoveredIndex={hoveredIndex} 
        processedData={processedData} 
      />
      
      <CoordinatesAndStars theme={theme} sentiment={marketSentiment} />
      
      <PriceBarVisualization 
        processedData={processedData}
        maxPrice={maxPrice}
        minPrice={minPrice}
        theme={theme}
        onHoverChange={setHoveredIndex}
      />
      
      <VolumeVisualization 
        processedData={processedData}
        maxVolume={maxVolume}
        theme={theme}
      />
      
      <EnvironmentEffects theme={theme} environmentPreset={environmentPreset} />
    </>
  );
};
