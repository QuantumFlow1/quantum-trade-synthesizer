
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { BaseSceneLighting } from "./BaseSceneLighting";
import { OptimizationLevel } from "./SceneContainer";

interface SceneLightingProps {
  theme: ColorTheme;
  hoveredIndex: number | null;
  processedData: TradingDataPoint[];
  optimizationLevel?: OptimizationLevel;
}

export const SceneLighting = ({ 
  theme, 
  hoveredIndex, 
  processedData,
  optimizationLevel = 'normal'
}: SceneLightingProps) => {
  // Convert optimization level to the format needed by child components
  const childOptimizationLevel = optimizationLevel === 'extreme' ? 'aggressive' : optimizationLevel;
  
  return (
    <BaseSceneLighting
      theme={theme}
      hoveredIndex={hoveredIndex}
      processedData={processedData}
      optimizationLevel={childOptimizationLevel}
    />
  );
};
