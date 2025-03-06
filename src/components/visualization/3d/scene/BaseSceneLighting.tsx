
import { ThemeBasedLighting } from "../ThemeBasedLighting";
import { SpotlightSystem } from "../SpotlightSystem";
import { GroundPlane } from "../GroundPlane";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";

interface BaseSceneLightingProps {
  theme: ColorTheme;
  hoveredIndex: number | null;
  processedData: TradingDataPoint[];
  optimizationLevel?: 'normal' | 'aggressive';
}

export const BaseSceneLighting = ({ 
  theme, 
  hoveredIndex, 
  processedData,
  optimizationLevel = 'normal'
}: BaseSceneLightingProps) => {
  // In aggressive mode, we skip spotlights which are performance heavy
  const showSpotlights = optimizationLevel !== 'aggressive';
  
  return (
    <>
      <ThemeBasedLighting optimizationLevel={optimizationLevel} />
      
      {showSpotlights && (
        <SpotlightSystem 
          theme={theme} 
          hoveredIndex={hoveredIndex} 
          processedData={processedData} 
        />
      )}
      
      <GroundPlane theme={theme} optimizationLevel={optimizationLevel} />
    </>
  );
};
