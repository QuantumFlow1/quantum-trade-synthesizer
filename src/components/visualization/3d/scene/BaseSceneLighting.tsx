
import { ThemeBasedLighting } from "../ThemeBasedLighting";
import { SpotlightSystem } from "../SpotlightSystem";
import { GroundPlane } from "../GroundPlane";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";

interface BaseSceneLightingProps {
  theme: ColorTheme;
  hoveredIndex: number | null;
  processedData: TradingDataPoint[];
}

export const BaseSceneLighting = ({ 
  theme, 
  hoveredIndex, 
  processedData 
}: BaseSceneLightingProps) => {
  return (
    <>
      <ThemeBasedLighting />
      
      <SpotlightSystem 
        theme={theme} 
        hoveredIndex={hoveredIndex} 
        processedData={processedData} 
      />
      
      <GroundPlane theme={theme} />
    </>
  );
};
