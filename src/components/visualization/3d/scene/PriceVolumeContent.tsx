
import { TradingDataPoint } from "@/utils/tradingData";
import { ColorTheme } from "@/hooks/use-theme-detection";
import { PriceVisualization } from "./PriceVisualization";
import { VolumeVisualization } from "./VolumeVisualization";
import { OptimizationLevel } from "./types";

interface PriceVolumeContentProps {
  displayData: TradingDataPoint[];
  maxPrice: number;
  minPrice: number;
  maxVolume: number;
  theme: ColorTheme;
  onHoverChange: (index: number | null) => void;
  optimizationLevel: OptimizationLevel;
  showPrices: boolean;
  showVolume: boolean;
}

export const PriceVolumeContent = ({
  displayData,
  maxPrice,
  minPrice,
  maxVolume,
  theme,
  onHoverChange,
  optimizationLevel,
  showPrices,
  showVolume
}: PriceVolumeContentProps) => {
  // Convert extreme optimization to aggressive for components that don't support extreme
  const volumeOptimizationLevel = optimizationLevel === 'extreme' ? 'aggressive' : optimizationLevel;
  
  return (
    <>
      {showPrices && (
        <PriceVisualization 
          processedData={displayData}
          maxPrice={maxPrice}
          minPrice={minPrice}
          theme={theme}
          onHoverChange={onHoverChange}
          optimizationLevel={optimizationLevel}
        />
      )}
      
      {showVolume && (
        <VolumeVisualization 
          processedData={displayData}
          maxVolume={maxVolume}
          theme={theme}
          optimizationLevel={volumeOptimizationLevel}
        />
      )}
    </>
  );
};
