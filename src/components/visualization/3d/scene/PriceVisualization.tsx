
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { PriceBarVisualization } from "./PriceBarVisualization";
import { OptimizationLevel } from "./SceneContainer";

interface PriceVisualizationProps {
  processedData: TradingDataPoint[];
  maxPrice: number;
  minPrice: number;
  theme: ColorTheme;
  onHoverChange: (index: number | null) => void;
  optimizationLevel: OptimizationLevel;
}

export const PriceVisualization = ({ 
  processedData,
  maxPrice,
  minPrice,
  theme,
  onHoverChange,
  optimizationLevel
}: PriceVisualizationProps) => {
  // Convert optimization level to the format needed by child components
  const childOptimizationLevel = optimizationLevel === 'extreme' ? 'aggressive' : optimizationLevel;
  
  return (
    <PriceBarVisualization 
      processedData={processedData}
      maxPrice={maxPrice}
      minPrice={minPrice}
      theme={theme}
      onHoverChange={onHoverChange}
      optimizationLevel={childOptimizationLevel}
    />
  );
};
