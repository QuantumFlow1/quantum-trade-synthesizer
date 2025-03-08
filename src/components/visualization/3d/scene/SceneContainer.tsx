
import { useState, useEffect, Suspense } from "react";
import { TradingDataPoint } from "@/utils/tradingData";
import { useSceneData } from "./useSceneData";
import { PriceVolumeContent } from "./PriceVolumeContent";
import { EnvironmentContent } from "./EnvironmentContent";
import { OptimizationLevel, EnvironmentPreset } from "./types";

interface SceneContainerProps {
  data: TradingDataPoint[];
  optimizationLevel?: OptimizationLevel;
  showPrices?: boolean;
  showVolume?: boolean;
  showStars?: boolean;
  dataReductionFactor?: number;
  environmentPreset?: EnvironmentPreset;
}

export const SceneContainer = ({ 
  data, 
  optimizationLevel = 'aggressive',
  showPrices = true,
  showVolume = true,
  showStars = true,
  dataReductionFactor,
  environmentPreset: customEnvironment
}: SceneContainerProps) => {
  const [ready, setReady] = useState(false);
  
  // Use our custom hook to handle all data processing
  const {
    hoveredIndex,
    setHoveredIndex,
    theme,
    displayData,
    maxPrice,
    minPrice,
    maxVolume,
    marketSentiment,
    finalEnvironmentPreset
  } = useSceneData(data, optimizationLevel, dataReductionFactor, customEnvironment);
  
  // Mark scene as ready immediately to avoid waiting
  useEffect(() => {
    setReady(true);
  }, []);
  
  if (!ready) {
    return null;
  }
  
  return (
    <Suspense fallback={null}>
      <EnvironmentContent
        theme={theme}
        sentiment={marketSentiment}
        hoveredIndex={hoveredIndex}
        displayData={displayData}
        showStars={showStars}
        optimizationLevel={optimizationLevel}
        environmentPreset={finalEnvironmentPreset}
      />
      
      {ready && (
        <PriceVolumeContent
          displayData={displayData}
          maxPrice={maxPrice}
          minPrice={minPrice}
          maxVolume={maxVolume}
          theme={theme}
          onHoverChange={setHoveredIndex}
          optimizationLevel={optimizationLevel}
          showPrices={showPrices}
          showVolume={showVolume}
        />
      )}
    </Suspense>
  );
};

export { OptimizationLevel, EnvironmentPreset };
