
import { ColorTheme } from "@/hooks/use-theme-detection";
import { SceneBackground } from "./SceneBackground";
import { SceneLighting } from "./SceneLighting";
import { TradingDataPoint } from "@/utils/tradingData";
import { OptimizationLevel, EnvironmentPreset } from "./types";

interface EnvironmentContentProps {
  theme: ColorTheme;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  hoveredIndex: number | null;
  displayData: TradingDataPoint[];
  showStars: boolean;
  optimizationLevel: OptimizationLevel;
  environmentPreset: EnvironmentPreset;
}

export const EnvironmentContent = ({
  theme,
  sentiment,
  hoveredIndex,
  displayData,
  showStars,
  optimizationLevel,
  environmentPreset
}: EnvironmentContentProps) => {
  return (
    <>
      <SceneLighting 
        theme={theme} 
        hoveredIndex={hoveredIndex} 
        processedData={displayData}
        optimizationLevel={optimizationLevel}
      />
      
      <SceneBackground 
        theme={theme} 
        sentiment={sentiment} 
        showStars={showStars}
        optimizationLevel={optimizationLevel}
        environmentPreset={environmentPreset}
      />
    </>
  );
};
