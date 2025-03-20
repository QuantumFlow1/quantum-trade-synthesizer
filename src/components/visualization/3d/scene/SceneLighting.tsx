
import { ColorTheme } from "@/hooks/use-theme-detection";
import { TradingDataPoint } from "@/utils/tradingData";
import { OptimizationLevel } from "./SceneContainer";
import { BaseSceneLighting } from "./BaseSceneLighting";

interface SceneLightingProps {
  theme: ColorTheme;
  hoveredIndex: number | null;
  processedData: TradingDataPoint[];
  optimizationLevel: OptimizationLevel;
}

export const SceneLighting = ({
  theme,
  hoveredIndex,
  processedData,
  optimizationLevel
}: SceneLightingProps) => {
  return (
    <BaseSceneLighting
      theme={theme}
      optimizationLevel={optimizationLevel === 'extreme' ? 'aggressive' : optimizationLevel}
    />
  );
};
